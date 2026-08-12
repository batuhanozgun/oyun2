// risk-satiri.test.mjs — U75: KUTU risk satırının biçim tanımı TEK EVDE ve İKİ LEHÇE eşit.
//
// Arıza: aynı satırı BEŞ ev ayrı katılıkta ayrıştırıyordu ve yasağı fiilen uygulayan tek kapı
// en gevşeğiydi — `G-07 :` (boşluklu) yazımı riskli-görev commit yasağını sessizce düşürüyordu.
// Dördü "biçimli" derken uygulayıcı kördü. Buradaki iki test o iki yüzü kapatır:
//   (1) iki lehçe (JS · POSIX ERE) AYNI külliyatta AYNI hükmü veriyor
//   (2) uygulayıcı boşluklu yazımı artık görüyor (uçtan uca)

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const BURASI = dirname(fileURLToPath(import.meta.url));
const KOK_REPO = join(BURASI, '..', '..', '..');
const TANIM = join(BURASI, '..', 'risk-satiri.txt');

function anahtar(ad) {
  for (const ham of readFileSync(TANIM, 'utf8').split('\n')) {
    const s = ham.replace(/\r$/, '');
    if (s.startsWith(ad + '=')) return s.slice(ad.length + 1);
  }
  return null;
}

// Külliyat: her satır bir yazım varyantı. `bekleniyor` = biçime UYAR mı (politika değil, BİÇİM).
const KULLIYAT = [
  ['G-01: onkosul=yok · risk=düşük — gerekçe', true, 'kanonik yazım'],
  ['G-07: onkosul=G-01 · risk=riskli — sır cinsi', true, 'riskli + önkoşul'],
  ['G-07 : onkosul=yok · risk=riskli — gerekçe', true, 'BOŞLUKLU iki nokta (U75in kaçağı)'],
  ['   G-07: onkosul=yok · risk=riskli — gerekçe', true, 'girintili'],
  ['G-07: onkosul=yok · risk=riskli', true, 'gerekçesiz (biçim tutar; zorunluluk politikadır)'],
  ['G-07:onkosul=yok · risk=riskli', true, 'iki nokta bitişik'],
  ['G-07: onkosul=yok · risk=orta — gerekçe', false, 'tanımsız risk sınıfı'],
  ['G-07: onkosul=yok risk=riskli — gerekçe', false, 'ayraç (·) yok'],
  ['G07: onkosul=yok · risk=riskli — gerekçe', false, 'görev kimliği bozuk'],
  ['- G-07: onkosul=yok · risk=riskli — gerekçe', false, 'liste imi (satır başı çapası)'],
  ['risk=riskli', false, 'yalnız sınıf'],
  ['', false, 'boş satır'],
];

test('U75 iki lehçe EŞİT: JS ve POSIX ERE aynı külliyatta aynı hükmü veriyor', () => {
  const jsDesen = anahtar('RISK_SATIRI_JS');
  const ereDesen = anahtar('RISK_SATIRI_ERE');
  assert.ok(jsDesen, 'RISK_SATIRI_JS anahtarı yok');
  assert.ok(ereDesen, 'RISK_SATIRI_ERE anahtarı yok');
  const re = new RegExp(jsDesen);
  for (const [satir, bekleniyor, ad] of KULLIYAT) {
    const js = re.test(satir);
    // ERE tarafı GERÇEK grep ile ölçülür — "aynı sayılır" demek ölçüm değildir.
    const g = spawnSync('grep', ['-cE', ereDesen], { input: satir + '\n', encoding: 'utf8' });
    const ere = g.stdout.trim() === '1';
    assert.equal(js, bekleniyor, 'JS hükmü yanlış (' + ad + '): ' + satir);
    assert.equal(ere, bekleniyor, 'ERE hükmü yanlış (' + ad + '): ' + satir);
    assert.equal(js, ere, 'İKİ LEHÇE AYRIŞTI (' + ad + '): ' + satir);
  }
});

test('U75: JS deseni alanları doğru yakalıyor (tüketicilerin politikası buna dayanır)', () => {
  const re = new RegExp(anahtar('RISK_SATIRI_JS'));
  const m = 'G-07 : onkosul=G-01 ve G-02 · risk=riskli — sır cinsi'.match(re);
  assert.ok(m, 'boşluklu yazım yakalanmalı');
  assert.equal(m[1], 'G-07');
  assert.match(m[2], /G-01 ve G-02/);
  assert.equal(m[3], 'riskli');
  assert.equal((m[4] || '').trim(), 'sır cinsi');
  const g = 'G-08: onkosul=yok · risk=düşük'.match(re);
  assert.ok(g, 'gerekçesiz satır BİÇİM olarak geçerli');
  assert.equal(g[4], undefined, 'gerekçe yoksa yakalama boş kalmalı');
});

test('U75: ortak okuyucu tanım yoksa FAIL-CLOSED (biçimi ölçemeyen "biçimli" diyemez)', async () => {
  const { riskCoz } = await import(join(KOK_REPO, 'tools', 'guard', 'risk-satiri.mjs'));
  assert.throws(() => riskCoz('/olmayan/kok/xyz', 'G-01: onkosul=yok · risk=düşük — x'),
                /risk satiri tanimi okunamadi/);
});
