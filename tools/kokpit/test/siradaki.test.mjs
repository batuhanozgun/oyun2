import { test } from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildState } from '../lib/status.mjs';
import { sandbox } from './ekran-kabuk.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEKFAZ = path.join(__dirname, 'fixtures/tekfaz');
const IKIFAZ = path.join(__dirname, 'fixtures/ikifaz');

// Deterministik mtime kur (Date.now yok): koordinator eski, siradaki rol yeni.
async function setMtimes(root, map) {
  for (const [rel, epochSec] of Object.entries(map)) {
    await fs.utimes(path.join(root, rel), epochSec, epochSec);
  }
}

test('bayat: SIRADAKİ rolü koordinatörden yeni hareket ettiyse tespit', async () => {
  // tekfaz: SIRADAKİ=uygulayici. uygulayici DURUM'u koordinatörden yeni yap.
  await setMtimes(TEKFAZ, {
    '03_roller/koordinator/DURUM.md': 1783115000,
    '03_roller/uygulayici/DURUM.md': 1783118000, // daha yeni
  });
  const s = await buildState(TEKFAZ, { koordinatorRol: 'koordinator' });
  assert.equal(s.yargi.siradakiRol, 'uygulayici');
  assert.equal(s.yargi.siradakiStale, true, 'bayat tespit edilmeli');
  assert.equal(s.yargi.sonHareketRol, 'uygulayici');
});

test('taze: SIRADAKİ rolü henüz hareket etmediyse bayat değil', async () => {
  // koordinator DURUM'u siradaki rolden yeni (sevk taze).
  await setMtimes(TEKFAZ, {
    '03_roller/uygulayici/DURUM.md': 1783115000,
    '03_roller/koordinator/DURUM.md': 1783118000, // koordinator daha yeni = taze sevk
  });
  const s = await buildState(TEKFAZ, { koordinatorRol: 'koordinator' });
  assert.equal(s.yargi.siradakiStale, false, 'taze sevk bayat sayılmamalı');
  assert.equal(s.yargi.sonHareketRol, null);
});

test('SIRADAKİ koordinatörün kendisiyse bayat mantığı çalışmaz', async () => {
  // ikifaz SIRADAKİ=analiz; koordinatorRol'ü 'analiz' verirsek eşleşir → stale değil
  const s = await buildState(IKIFAZ, { koordinatorRol: 'analiz' });
  assert.equal(s.yargi.siradakiStale, false);
});

// ── U57 · ÖLÇEMEDİĞİM ≠ SAĞLAM ───────────────────────────────────────────────────────────
//
// DOĞUŞ (ölçüm, 2026-08-08): üç ayrı ölçülemezlik tek satırda "bayat değil"e düşüyordu ve
// `warnings` bu hesaba HİÇ geçmediği için okuma notu basmak MÜMKÜN DEĞİLDİ. En pahalısı
// birincisiydi: panoda yazan rol ekipte yokken kokpit sahibe "aç: <rol>" diyordu — var
// olmayan bir oturumu açması isteniyordu ve tek satır uyarı çıkmıyordu.

async function vault({ siradaki = 'uygulayici — iş', roller = ['koordinator', 'uygulayici'], durumsuz = [] } = {}) {
  const kok = await fs.mkdtemp(path.join(os.tmpdir(), 'kokpit-u57-'));
  await fs.mkdir(path.join(kok, '00_pano'), { recursive: true });
  const p = (n) => String(n).padStart(2, '0');
  const d = new Date(Date.now() - 5 * 60 * 1000);
  const damga = d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  await fs.writeFile(path.join(kok, '00_pano/SAGLIK.md'), '# SAĞLIK\nson denetim: ' + damga + ' (denetim #3)\n\n**Işıklar:** AKIŞ=YEŞİL\n');
  await fs.writeFile(path.join(kok, '00_pano/PANO.md'),
    '# PANO\n\n## MEKANİK BLOK\n```\nSon denetim: ' + damga + ' (denetim #3)\nIşıklar: AKIŞ=YEŞİL\n'
    + 'Görevler: —\nKırmızı: 0 · Sarı: 0\n```\n\n- **Aktif kutu:** KT-001\n- **SIRADAKİ OTURUM:** ' + siradaki + '\n');
  await fs.mkdir(path.join(kok, '01_kutular'), { recursive: true });
  for (const r of roller) {
    await fs.mkdir(path.join(kok, '03_roller', r), { recursive: true });
    if (!durumsuz.includes(r)) {
      await fs.writeFile(path.join(kok, '03_roller', r, 'DURUM.md'), '# DURUM — ' + r + '\n\n**Son oturum:** iş (2026-08-09)\n');
      // mtime SABİTLENİR (Date.now yok): koordinatör en yeni = sevk henüz tüketilmemiş.
      // Yazma sırasına bırakmak testi belirlenimsiz yapardı — bayatlık tam bu sinyale bakar.
      await fs.utimes(path.join(kok, '03_roller', r, 'DURUM.md'),
        r === koordinatorAd ? 1783118000 : 1783115000, r === koordinatorAd ? 1783118000 : 1783115000);
    }
  }
  return kok;
}

const koordinatorAd = 'koordinator';

async function durum(o) {
  const kok = await vault(o);
  try { return await buildState(kok, { koordinatorRol: 'koordinator', rolToreni: true }); }
  finally { await fs.rm(kok, { recursive: true, force: true }); }
}

function ekranMetni(state) {
  const { ctx, ekran } = sandbox();
  ctx.state = state;
  ctx.renderTopbar();
  ctx.renderKokpit();
  return (ekran['kokpit-view'].innerHTML || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
}

const uyariVar = (s, parca) => s.warnings.some((w) => w.includes(parca));

test('U57 · panoda yazan rol EKİPTE YOK: not düşer, ölçülemedi döner, davet ÇIKMAZ', async () => {
  const s = await durum({ siradaki: 'hayalet — iş', roller: ['koordinator', 'uygulayici'] });
  assert.ok(uyariVar(s, '"hayalet" ekipte yok'), JSON.stringify(s.warnings));
  assert.equal(s.yargi.siradakiStale, null, 'ölçülemedi hâli "taze" ile aynı değere düşmemeli');
  assert.equal(s.yargi.siradakiRolYok, true);
  const metin = ekranMetni(s);
  assert.equal(/Bu senin sıran/.test(metin), false, 'var olmayan rol için oturum daveti çıkmamalı');
  assert.match(metin, /panodaki rol ekipte yok/);
  assert.match(metin, /hayalet/, 'sahip hangi adın sorunlu olduğunu görmeli');
});

test('U57 · sevki veren rol ekipte yoksa bayatlık ölçülemedi sayılır', async () => {
  const s = await durum({ roller: ['uygulayici'] });
  assert.ok(uyariVar(s, 'sevki veren rol'), JSON.stringify(s.warnings));
  assert.equal(s.yargi.siradakiStale, null);
  assert.equal(s.yargi.siradakiRolYok, false, 'sıradaki rol VAR; eksik olan öteki taraf');
});

test('U57 · durum dosyası okunamayan rol sessiz "taze" üretmez', async () => {
  const s = await durum({ durumsuz: ['uygulayici'] });
  assert.ok(uyariVar(s, 'durum dosyası okunamadı'), JSON.stringify(s.warnings));
  assert.equal(s.yargi.siradakiStale, null);
});

test('U57 FREN · sağlam vault not üretmez ve hüküm boolean kalır', async () => {
  const s = await durum();
  assert.equal(s.warnings.filter((w) => /ekipte yok|bayatlığı ölçülemedi|durum dosyası okunamadı/.test(w)).length, 0,
    'yanlış-alarm: ' + JSON.stringify(s.warnings));
  assert.equal(typeof s.yargi.siradakiStale, 'boolean');
  assert.match(ekranMetni(s), /Bu senin sıran/, 'sağlam vault\'ta davet kaybolmamalı');
});

test('U57 FREN · sıra koordinatörün kendisindeyse not basılmaz (ölçülecek sevk yok)', async () => {
  const s = await durum({ siradaki: 'koordinator — plan' });
  assert.equal(s.warnings.filter((w) => /ekipte yok|bayatlığı ölçülemedi|rollerin durum dosyası okunamadı/.test(w)).length, 0, JSON.stringify(s.warnings));
  assert.equal(s.yargi.siradakiStale, false, 'ölçülecek şeyin olmaması, ölçülememek değildir');
});
