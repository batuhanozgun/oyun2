// pano-alanlari — PANO mekanik bloğunun alan listesinin ORTAK okuyucusu ve blok kurucusu.
// Tanım burada DEĞİL, veri dosyasındadır: tools/kokpit/pano-alanlari.txt (U74). Bu dosya
// yalnız o tanımı okur, doğrular ve iki tüketicinin ortak işini yapar:
//   YAZAR    tools/bekci/cekirdek.mjs  → panoBlokKur() ile bloğu kurar
//   OKUYUCU  lib/status.mjs            → panoBlokCoz() ile bloğu satırlara ayırır
//
// NEDEN KOKPİT AĞACINDA. Kokpitin KOD yüzeyi ÜÇ kopyada bayt-bayt ortaktır (D-02) ve üçüncü
// kopyada bekçi ağacı YOKTUR — tanımı bekçi tarafına koymak, üçüncü kopyada okuyucuyu
// tanımsız bırakırdı. Yön bu yüzden tersinedir: sözleşmenin evi, keyfî vault okumak zorunda
// olan taraftadır; yazar oraya bağlanır. Bedeli beyandır: kokpit ağacı olmayan bir kurulumda
// bekçi PANO mekanik bloğunu YAZAMAZ ve bunu arıza hattından söyler (sessizce eski biçime
// dönmek, tam da U74'ün kapattığı sınıftır).
//
// FAIL-CLOSED: dosya yoksa, satır biçimsizse ya da sözlük dışı bir değer taşıyorsa HATA
// fırlatır — alan listesini ölçemeyen tüketici "biçimli" diyemez.

import { readFileSync } from 'node:fs';

const YAZAR_SOZLUK = new Set(['her', 'kosullu']);
const OKUYUCU_SOZLUK = new Set(['zorunlu', 'kurulu', 'istegebagli']);
const EKSIK_SOZLUK = new Set(['not', 'bosluk', '-']);

const ONBELLEK = new Map();

/**
 * Alan listesini okur.
 * @param {string|URL} yol pano-alanlari.txt yolu
 * @returns {{anahtar:string,onek:string,yazar:string,okuyucu:string,eksikHal:string,eskiOnek:string|null}[]}
 */
export function panoAlanlariOku(yol) {
  const anahtarYol = String(yol);
  if (ONBELLEK.has(anahtarYol)) return ONBELLEK.get(anahtarYol);
  let ham;
  try { ham = readFileSync(yol, 'utf8'); }
  catch { throw new Error('PANO alan listesi okunamadi: ' + anahtarYol + ' (fail-closed)'); }
  const alanlar = [];
  const gorulen = new Set();
  for (const satirHam of ham.split('\n')) {
    const satir = satirHam.replace(/\r$/, '');
    if (!satir.trim() || satir.trimStart().startsWith('#')) continue;
    if (!satir.startsWith('ALAN|')) throw new Error('pano-alanlari.txt taninmayan satir: ' + satir + ' (fail-closed)');
    const p = satir.split('|');
    if (p.length !== 7) throw new Error('pano-alanlari.txt yedi alan bekler, ' + p.length + ' geldi: ' + satir);
    const [, anahtar, onek, yazar, okuyucu, eksikHal, eskiOnek] = p;
    if (!anahtar || !onek) throw new Error('pano-alanlari.txt bos anahtar/onek: ' + satir);
    if (gorulen.has(anahtar)) throw new Error('pano-alanlari.txt yinelenen anahtar: ' + anahtar);
    if (!YAZAR_SOZLUK.has(yazar)) throw new Error('pano-alanlari.txt sozluk disi yazar degeri: ' + yazar);
    if (!OKUYUCU_SOZLUK.has(okuyucu)) throw new Error('pano-alanlari.txt sozluk disi okuyucu degeri: ' + okuyucu);
    if (!EKSIK_SOZLUK.has(eksikHal)) throw new Error('pano-alanlari.txt sozluk disi eksik-hal degeri: ' + eksikHal);
    // Tutarlılık: `kosullu` yazarın alanı okuyucuda zorunlu OLAMAZ (satır meşruca doğmaz),
    // ve `istegebagli` alanın eksik-hâli anlamsızdır. Bu iki çelişki tabloda sessizce
    // durabilseydi, tablo kendi kendisiyle çelişen bir sözleşme taşırdı.
    if (yazar === 'kosullu' && okuyucu !== 'istegebagli') throw new Error('pano-alanlari.txt celiski: kosullu alan okuyucuda zorunlu olamaz: ' + anahtar);
    if (okuyucu === 'istegebagli' && eksikHal !== '-') throw new Error('pano-alanlari.txt celiski: istegebagli alanin eksik-hali "-" olmali: ' + anahtar);
    if (okuyucu !== 'istegebagli' && eksikHal === '-') throw new Error('pano-alanlari.txt celiski: ' + okuyucu + ' alanin eksik-hali yazilmali: ' + anahtar);
    gorulen.add(anahtar);
    alanlar.push({ anahtar, onek, yazar, okuyucu, eksikHal, eskiOnek: eskiOnek === '-' ? null : eskiOnek });
  }
  if (!alanlar.length) throw new Error('pano-alanlari.txt bos: hicbir ALAN satiri yok (fail-closed)');
  ONBELLEK.set(anahtarYol, alanlar);
  return alanlar;
}

/**
 * Mekanik bloğun gövdesini kurar (yazar tarafı).
 * @param {ReturnType<typeof panoAlanlariOku>} alanlar
 * @param {Record<string,string|null|undefined>} degerler anahtar → satırın önek SONRASI gövdesi
 * @returns {string} satırlar, aralarında \n; sonda \n YOK
 */
export function panoBlokKur(alanlar, degerler) {
  const bilinen = new Set(alanlar.map((a) => a.anahtar));
  for (const anahtar of Object.keys(degerler)) {
    // Yazarın listede olmayan bir alan üretmesi, listenin ikinci bir kopyasının koda geri
    // sızması demektir — U74'ün tam olarak kapattığı hâl.
    if (!bilinen.has(anahtar)) throw new Error('PANO yazari listede olmayan alan uretti: ' + anahtar + ' (fail-closed)');
  }
  const satirlar = [];
  for (const a of alanlar) {
    const deger = degerler[a.anahtar];
    if (deger === null || deger === undefined) {
      if (a.yazar === 'her') throw new Error('PANO zorunlu alani degersiz: ' + a.anahtar + ' (fail-closed)');
      continue; // kosullu: şartı doğmadı
    }
    const govde = String(deger);
    if (a.yazar === 'her' && !govde.trim()) throw new Error('PANO zorunlu alani bos: ' + a.anahtar + ' (fail-closed)');
    if (govde.includes('\n')) throw new Error('PANO alani cok satirli olamaz: ' + a.anahtar + ' (fail-closed)');
    satirlar.push(a.onek + ' ' + govde);
  }
  return satirlar.join('\n');
}

// Önek eşleşmesi satır BAŞINDAN yapılır: `Sıra:` gibi kısa bir öneki satır ortasında aramak
// başka bir alanın gövdesinde yanlış eşleşme üretirdi (ör. sayaç satırının içindeki `Sarı:`).
function onekDeseni(onek) {
  return new RegExp('^[ \\t]*' + onek.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[ \\t]*(.*)$', 'm');
}

/**
 * Mekanik blok gövdesini alanlara ayırır (okuyucu tarafı). Değerin GRAMERİ tüketicinindir;
 * burada yalnız satır bulunur ve önek sonrası gövde kırpılarak döner.
 *
 * GÖVDESİ BOŞ SATIR = YOK sayılır. Önek var ama arkası boşsa ortada hüküm yoktur; "var"
 * saymak eksik alanı sessizleştirirdi — U74'ün kapattığı hâlin ta kendisi. Yazar tarafı da
 * aynı hükümde: `her` alanı boş bırakmak fail-closed hatadır.
 * @param {ReturnType<typeof panoAlanlariOku>} alanlar
 * @param {string} govde mekanik bloğun içi
 * @returns {Map<string,string>} anahtar → önek sonrası gövde
 */
export function panoBlokCoz(alanlar, govde) {
  const deger = new Map();
  for (const a of alanlar) {
    for (const onek of [a.onek, a.eskiOnek]) {
      if (!onek) continue;
      const m = govde.match(onekDeseni(onek));
      if (!m) continue;
      const ham = m[1].trim();
      if (!ham) continue;
      deger.set(a.anahtar, ham);
      break;
    }
  }
  return deger;
}

/**
 * Sözleşme belgesindeki ÜRETİLEN tabloyu kurar. Belge listeyi elle yazmaz; bu satırları
 * taşır ve test bayt-eş ölçer (tek ev dikişi — U74).
 * @param {ReturnType<typeof panoAlanlariOku>} alanlar
 * @returns {string}
 */
export function panoAlanlariTablosu(alanlar) {
  const satir = (h) => '| ' + h.join(' | ') + ' |';
  const out = [satir(['Alan', 'Satır öneki', 'Yazar', 'Okuyucu', 'Eksik-hâl']), '|---|---|---|---|---|'];
  for (const a of alanlar) {
    out.push(satir([a.anahtar, '`' + a.onek + '`', a.yazar, a.okuyucu, a.eksikHal]));
  }
  return out.join('\n');
}
