// pano-alan-tek-ev.test.mjs — U74: PANO mekanik bloğunu YAZAN taraf alan listesinden TÜRÜYOR mu?
//
// DOĞUŞ (ölçüm, 2026-08-10): satırlar cekirdek.mjs içinde elle diziliydi; okuyucu (kokpit)
// ayrı bir liste arıyordu, sözleşme üçüncü bir liste sayıyordu. Sonuç ölçüldü: `Bekleyen
// sorular:` sabit `—` basılıyor ve tüm ağaçta okuyanı yok — ÖLÜ DİZE. Liste tek eve indi
// (tools/kokpit/pano-alanlari.txt); bu dosya yazarın gerçekten oradan türediğini ölçer.
//
// YÖNTEM: fixture'ın taşıdığı TABLO bozulur ve yazının değişmesi beklenir. Tablo değişince
// çıktı değişmiyorsa "tek ev" iddiası ölçülmemiş demektir — bu deponun en pahalı dersi
// (U75 sahte-yeşil avı) tam buydu.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, rmSync, chmodSync } from 'node:fs';
import { join } from 'node:path';
import { kurulum, kos, temizle } from './yardimci.mjs';

const TABLO = (kok) => join(kok, 'tools', 'kokpit', 'pano-alanlari.txt');
const tabloyuBoz = (kok, donustur) => writeFileSync(TABLO(kok), donustur(readFileSync(TABLO(kok), 'utf8')));
const panoBlok = (kok) => {
  const m = readFileSync(join(kok, '00_pano', 'PANO.md'), 'utf8').match(/## MEKANİK BLOK[^\n]*\n```\n([\s\S]*?)\n```/);
  return m ? m[1] : '';
};

test('taban: blok tablonun SIRASIYLA ve öneklerinden doğar', () => {
  const kok = kurulum();
  const r = kos(kok);
  assert.equal(r.alanlar.ariza, 0, r.stdout);
  const onekler = panoBlok(kok).split('\n').map((s) => s.split(':')[0]);
  assert.deepEqual(onekler, ['Son denetim', 'Işıklar', 'Görevler', 'Sahipte bekleyen', 'Sıra', 'Kırmızı']);
  temizle(kok);
});

test('ölü dize düştü: `Bekleyen sorular` satırı artık basılmıyor', () => {
  // Sabit `—` basılan, hiç kimsenin okumadığı satır. Ölçüm 2026-08-10: tüm ağaçta okuyucusu
  // yoktu; aynı olguyu `Sahipte bekleyen: N` zaten sayıyla taşıyor.
  const kok = kurulum();
  kos(kok);
  assert.equal(panoBlok(kok).includes('Bekleyen sorular'), false, panoBlok(kok));
  assert.match(panoBlok(kok), /^Sahipte bekleyen: \d+$/m, panoBlok(kok));
  temizle(kok);
});

test('tek ev · tablodaki ÖNEK değişince YAZILAN satır da değişir (kodda gömülü değil)', () => {
  const kok = kurulum();
  tabloyuBoz(kok, (h) => h.replace('ALAN|sira|Sıra:|', 'ALAN|sira|Nöbet:|'));
  const r = kos(kok);
  assert.equal(r.alanlar.ariza, 0, r.stdout);
  assert.match(panoBlok(kok), /^Nöbet: sahip$/m, 'yazar tablodaki öneki kullanmadı: ' + panoBlok(kok));
  assert.equal(/^Sıra:/m.test(panoBlok(kok)), false, 'eski önek koddan geliyor demektir');
  temizle(kok);
});

test('tek ev · tablodaki SIRA değişince satır sırası da değişir', () => {
  const kok = kurulum();
  const h = readFileSync(TABLO(kok), 'utf8');
  // Satır metni ELLE yazılmaz, tablodan okunur: sütun değerleri değiştiğinde test sessizce
  // hiçbir şey ölçmez hâline düşerdi (ilk yazımda tam bu oldu — `sira` satırının okuyucu
  // sütunu değişince eşleşme kaçtı ve bozma "dosyayı değiştirmedi"ye döndü).
  const satir = h.split('\n').find((l) => l.startsWith('ALAN|sira|'));
  assert.ok(satir, 'tabloda sira satırı yok: ' + h);
  tabloyuBoz(kok, () => h.replace(satir + '\n', '').replace('ALAN|son-denetim|', satir + '\nALAN|son-denetim|'));
  const r = kos(kok);
  assert.equal(r.alanlar.ariza, 0, r.stdout);
  assert.equal(panoBlok(kok).split('\n')[0].startsWith('Sıra:'), true, panoBlok(kok));
  temizle(kok);
});

test('tek ev · alan tablodan çıkarılıp kodda kalırsa SESSİZ geçilmez (ters yön)', () => {
  // Sürüklenme iki yönlüdür ve ikisi de ölçülür: tablo bir alan İSTEYİP yazar dolduramazsa
  // (aşağıdaki fail-closed testi) ya da yazar bir alan ÜRETİP tablo tanımazsa. İkincisi
  // "listeyi güncelledim, kodu unuttum" hâlidir; sessiz geçse tablo otorite olmaktan çıkardı.
  const kok = kurulum();
  tabloyuBoz(kok, (h) => h.split('\n').filter((l) => !l.startsWith('ALAN|sahipte-bekleyen|')).join('\n'));
  const r = kos(kok);
  assert.equal(r.alanlar.ariza >= 1, true, r.stdout);
  assert.match(r.stdout, /listede olmayan alan uretti: sahipte-bekleyen/, r.stdout);
  temizle(kok);
});

// ── FAIL-CLOSED: alan listesini ölçemeyen yazar blok kuramaz ─────────────────────────────

test('fail-closed · tablo dosyası yoksa PANO YAZILMAZ, arıza basılır (sessiz eski biçime dönüş yok)', () => {
  const kok = kurulum();
  const oncesi = readFileSync(join(kok, '00_pano', 'PANO.md'), 'utf8');
  rmSync(TABLO(kok));
  const r = kos(kok);
  assert.equal(r.alanlar.ariza >= 1, true, r.stdout);
  assert.match(r.stdout, /ARIZA \[yüzey\] SAGLIK\/PANO yazılamadı/, r.stdout);
  assert.equal(r.rc, 2, 'arıza çıkışı 2 olmalı');
  assert.equal(readFileSync(join(kok, '00_pano', 'PANO.md'), 'utf8'), oncesi, 'PANO yarım/eski biçimde yazılmamalı');
  temizle(kok);
});

test('fail-closed · başarısız koşu SAGLIK\'ı TAZE damgayla yeniden yazamaz (sahibin tek ezberi)', () => {
  // Hasım turu (2026-08-10): ilk yazımda alan listesi SAGLIK yazıldıktan SONRA okunuyordu.
  // Yani tablo yoksa SAGLIK.md taze damga + yeşil ışıklarla yeniden yazılıyor, PANO donuyor
  // ve `[yüzey] SAGLIK/PANO yazılamadı` arızası SAGLIK'a HİÇBİR koşuda giremiyordu. Sahibin
  // tek ezberi — "bu dosyada TAZE damga yoksa sistem KIRMIZI sayılır" — başarısız koşuda
  // TAZE ve YEŞİL gösteriyordu. Fail-closed'ın sahip yüzeyine ulaşmayanı fail-closed değildir.
  const kok = kurulum();
  kos(kok);                       // önce SAĞLAM bir koşu: sahibin yüzeyi doğsun
  const oncesi = readFileSync(join(kok, '00_pano', 'SAGLIK.md'), 'utf8');
  rmSync(TABLO(kok));
  const r = kos(kok);
  assert.equal(r.rc, 2, r.stdout);
  assert.equal(readFileSync(join(kok, '00_pano', 'SAGLIK.md'), 'utf8'), oncesi,
    'SAGLIK başarısız koşuda yeniden yazıldı — sahip taze/yeşil bir yüzey görür');
  temizle(kok);
});

test('okunamayan sahip kuyruğu SIFIR değildir (bulgu SAGLIK\'a da düşer)', () => {
  // Hasım turu (2026-08-10): `oku()` "dosya yok" ile "okunamadı"yı ayırt etmiyor, ikisine de
  // null dönüyordu ve yazar ikisini de 0 sayıyordu — sahibe "bekleyen yok" deniyordu.
  const kok = kurulum();
  const yol = join(kok, '00_pano', 'SENDE_BEKLEYEN.md');
  writeFileSync(yol, '- [ ] bir madde\n');
  chmodSync(yol, 0o000);
  try {
    const r = kos(kok);
    const blok = panoBlok(kok);
    assert.equal(/Sahipte bekleyen: 0/.test(blok), false, 'okunamayan kuyruk sıfır sayıldı:\n' + blok);
    assert.match(blok, /Sahipte bekleyen: okunamadı/, blok);
    // Bulgu SAYAÇLARDAN ÖNCE doğmalı: yoksa SAGLIK'a da düşmez, sayaç da saymaz.
    assert.match(readFileSync(join(kok, '00_pano', 'SAGLIK.md'), 'utf8'), /SENDE_BEKLEYEN.md VAR ama okunamıyor/, r.stdout);
  } finally {
    chmodSync(yol, 0o644);
    temizle(kok);
  }
});

test('fail-closed · tabloya YAZARIN dolduramayacağı zorunlu alan eklenirse arıza', () => {
  // Yeni bir alan tabloya yazılıp yazarda karşılığı kurulmazsa, satır sessizce eksik doğardı.
  const kok = kurulum();
  tabloyuBoz(kok, (h) => h + '\nALAN|yeni-alan|Yeni alan:|her|zorunlu|not|-\n');
  const r = kos(kok);
  assert.equal(r.alanlar.ariza >= 1, true, r.stdout);
  assert.match(r.stdout, /degersiz: yeni-alan/, r.stdout);
  temizle(kok);
});

test('fail-closed · tablo biçimi bozulursa da yazar durur (sözlük dışı sütun)', () => {
  const kok = kurulum();
  tabloyuBoz(kok, (h) => h.replace('ALAN|gorevler|Görevler:|her|', 'ALAN|gorevler|Görevler:|bazen|'));
  const r = kos(kok);
  assert.equal(r.alanlar.ariza >= 1, true, r.stdout);
  assert.match(r.stdout, /yazar degeri/, r.stdout);
  temizle(kok);
});

// ── KOŞULLU ALAN: durak ──────────────────────────────────────────────────────────────────

test('koşullu · durak satırı yalnız şartı doğunca yazılır ve tablo sırasında durur', () => {
  const kok = kurulum();
  kos(kok);
  assert.equal(panoBlok(kok).includes('Durak:'), false, 'açık kutu varken durak satırı doğmamalı');
  rmSync(join(kok, '01_kutular', 'KT-001-proje-plani'), { recursive: true });
  const r = kos(kok);
  assert.equal(r.alanlar.ariza, 0, r.stdout);
  const onekler = panoBlok(kok).split('\n').map((s) => s.split(':')[0]);
  assert.deepEqual(onekler, ['Son denetim', 'Işıklar', 'Görevler', 'Sahipte bekleyen', 'Sıra', 'Durak', 'Kırmızı']);
  temizle(kok);
});
