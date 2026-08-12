// ad-tekligi.test.mjs — KOKPİT KENDİNE "PANO" DEMEZ (K9).
//
// NEDEN: ürünün sözlüğünde (docs/SOZLUK.md §3) "pano" TEK şeydir — `00_pano/PANO.md`, ekibin
// yazdığı DOSYA. Kokpit onu OKUYAN uygulamadır. İkisi aynı adı taşıdığında sahip hangisine
// baktığını bilemez ve bunun bedeli ölçüldü: sahibin "pano kurulmadı" hissi tam bu çakışmadan
// doğdu. Ad çakışması, kokpitin varlık sebebini — doğru durum algısı — tersine çevirir.
//
// KAPSAM SINIRI — BEYANLI: bu kapı "pano" kelimesini YASAKLAMAZ. Ekranda PANO dosyasından söz
// etmek meşrudur ve gereklidir ("panodaki rol ekipte yok"); yasaklayan bir kapı, doğru cümleyi
// de keserdi ve ilk düzeltme "kapıyı sustur" olurdu. Ölçülen tek şey UYGULAMANIN KENDİNİ
// ADLANDIRDIĞI yerlerdir: marka · alt marka · sekme başlığı · geri düğmesi · sunucunun
// varsayılanları ve açılış satırı.
//
// TARANMAYAN İKİ YÜZEY — BEYANLI: (1) `public/style.css` hiçbir kapıda taranmıyor, yani
// `content: "pano"` gibi CSS'ten basılan bir metin bu kapıya görünmez; bugün öyle bir kural yok
// ve kapı eklemek yerine sınır yazıldı. (2) Kurulu bir projenin `kokpit.config.json`'undaki
// `baslik` (proje adı) kopyaya özeldir — oraya "pano" yazan sahibi bu kapı durduramaz.
//
// KAPININ ULAŞAMADIĞI YER — BEYANLI: kurulu bir projenin `kokpit.config.json`'undaki `baslik`
// (proje adı) kopyaya özeldir (D-02 proje yüzeyi) ve oraya "pano" yazan bir sahibi bu kapı
// durduramaz. Kapatılan delik BAŞKAydı: alt marka eskiden `altBaslik` ayarından geliyordu,
// yani UYGULAMANIN ADI kopyaya özel bir alanda yaşıyordu. O alan kaldırıldı; aşağıdaki ilk
// test bunu, kurulu projelerin bugün diskte duran ESKİ ayarıyla ölçer.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sandbox } from './ekran-kabuk.mjs';

const KOK = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const oku = (rel) => readFileSync(path.join(KOK, rel), 'utf8');

// Türkçe büyük harf tuzağı yok: /i bayrağı `pano` `Pano` `PANO` `panosu` hepsini tutar.
const bul = (s) => (String(s).match(/pano/gi) || []);

// Marka yüzeyi = sahibin üst şeritte gördüğü ad + sekme başlığı. Kaynak değil ÇİZİM ölçülür:
// değişken adı ekrana çıkmaz, yani yanlış-kırmızı mekanik olarak imkânsızdır.
function markaMetni(donustur, config) {
  const { ctx, ekran } = sandbox(donustur);
  // Varsayılan ayar BİLEREK eski hâldedir: kurulu projelerin bugün diskte duran ayarı bu.
  ctx.state = { config: config || { baslik: 'oyun', altBaslik: 'panosu' }, saglik: {}, yargi: {} };
  ctx.renderTopbar();
  return [ekran['home-btn'].innerHTML, ekran['wm-sub'].textContent, ekran['__title'].textContent].join(' | ');
}

// Geri düğmesi kabukta çizilemez (dosya görüntüleyici hiç çözülmeyen bir fetch'in arkasında).
// O yüzden tek yer kaynaktır ve DÜĞMENİN TAMAMI kesilir — bütün dosyayı taramak, aynı dosyadaki
// meşru PANO cümlelerini kırmızı basardı. Etiket değil TÜM ETİKET+ÖZNİTELİK alınır: hasım turu
// ölçtü, `<button id="back" title="panoya dön">` eski dar biçimde kaçıyordu.
// TÜM EŞLEŞME kesilir, yakalama grubu DEĞİL: ilk yazımda regex genişledi ama dilim genişlemedi
// (öznitelikler eşleşmeye giriyor, taranan metne girmiyordu) — yani `aria-label="pano"` sessizce
// geçiyordu ve dosya o deliği KAPALI ilan ediyordu. Hasım turu ölçtü: üç yazımın üçü de yeşildi.
const geriDugmesi = (kaynak) => (kaynak.match(/<button[^>]*id="back"[^>]*>[^<]*</) || [''])[0];

// Başlatıcı SAHİBİN GÖRDÜĞÜ İLK EKRANDIR (çift tıklayınca açılan pencereye basar) ve kopyaya
// özeldir — ADI da öyle: üçüncü kopyanın başlatıcısı başka bir addadır. Bu yüzden dosya ADLA
// değil GLOB'la bulunur (ad muaf, İÇİ değil) ve yalnız EKRANA BASILAN satırlar taranır:
// dosyanın geri kalanında o kopyanın kendi depo yolu meşru olarak geçer.
function baslatici() {
  const dizin = path.join(KOK, 'launcher');
  let adlar = [];
  try { adlar = readdirSync(dizin).filter((f) => f.endsWith('.command')); } catch { /* yok */ }
  return { ad: adlar[0] || null, kaynak: adlar[0] ? readFileSync(path.join(dizin, adlar[0]), 'utf8') : '' };
}
const basilanSatirlar = (kaynak) => kaynak.split('\n').filter((l) => /\b(printf|echo)\b/.test(l)).join('\n');

// KAYNAK OKUYAN ÜÇ YÜZEY. Her biri ÜÇ şey taşır ve üçü de zorunludur:
//   çapa  — ölçülecek şey dosyada GERÇEKTEN var mı (yoksa kapı boşa döner, sessizce yeşil basar)
//   oku   — dosyadan tam olarak neyin taranacağı
//   bozma — kaynağı eski hâline döndüren dönüşüm
// Gerçek test ile bozma AYNI `oku`dan geçer. Bu, hasım turunun 2026-08-11'de yakaladığı
// kusurun panzehiridir: bozma "kaynak + 'pano'" diye yazılırsa yalnız `bul()`u sınar, kapı
// hakkında hiçbir şey söylemez ve iki test silinse bile yeşil kalır.
const YUZEYLER = [
  {
    ad: 'sekme kabuğu (index.html)',
    dosya: 'public/index.html',
    // Bu dosyada tek bir "pano" bile meşru değildir: içinde cümle yok, yalnız uygulamanın
    // kendi iskeleti ve adı var. Dar sınır bilinçli.
    capa: /id="home-btn"[\s\S]*class="wm-sub"/,
    capaNotu: 'marka iskeleti index.html\'de değil — kapı başka yeri ölçüyor olabilir',
    oku: (k) => k,
    bozma: (k) => k.replace('<title>kokpit</title>', '<title>pano</title>'),
  },
  {
    ad: 'sunucu (server.mjs)',
    dosya: 'server.mjs',
    // server.mjs PANO dosyasını hiç okumaz (onu lib/status.mjs okur); burada geçen her
    // "pano" uygulamanın kendi adı olurdu. Dosyanın tamamı taranır.
    capa: /const DEFAULTS = \{[^}]*baslik:/,
    capaNotu: 'sunucunun marka varsayılanı bulunamadı — kapı bayatladı',
    oku: (k) => k,
    bozma: (k) => k.replace("baslik: 'Proje'", "baslik: 'Pano'"),
  },
  {
    ad: 'geri düğmesi (app.js)',
    dosya: 'public/app.js',
    // Çapa FAIL-CLOSED: düğmeye öznitelik eklenirse (`id="back" title="…"`) regex eşleşmez ve
    // kapı "bayatladı" diye KIRMIZI basar. Yön bilinçli — sessizce boşa dönmektense durur.
    capa: /<button[^>]*id="back"[^>]*>/,
    capaNotu: 'geri düğmesi bulunamadı ya da yazımı değişti — kapı bayatladı',
    oku: geriDugmesi,
    bozma: (k) => k.replace(/(<button[^>]*id="back"[^>]*>)([^<]*)</, '$1← pano<'),
  },
  {
    ad: 'başlatıcı (launcher/*.command)',
    dosya: null,                       // glob ile bulunur; adı kopyaya özeldir
    capa: /▸ .*çalışıyor/,
    capaNotu: 'başlatıcının açılış satırı bulunamadı — kapı bayatladı ya da dosya yok',
    oku: basilanSatirlar,
    bozma: (k) => k.replace(/▸ (.*)çalışıyor/, '▸ $1panosu çalışıyor'),
  },
];

// Yüzeyin kaynağı: `dosya` varsa dosyadan, yoksa başlatıcı glob'undan.
const yuzeyKaynagi = (y) => (y.dosya ? oku(y.dosya) : baslatici().kaynak);

test('marka: ESKİ ayar "panosu" derken bile ekranda kokpit yazar', () => {
  const metin = markaMetni();
  assert.deepEqual(bul(metin), [], 'kokpit kendine pano diyor: ' + metin);
  assert.match(metin, /kokpiti/, 'alt marka hiç basılmamış — test bir şey ölçmüyor olabilir');
  assert.match(metin, /oyun/, 'proje adı ayardan gelmeli (yoksa marka ölçülmemiş sayılır)');
});

test('kaynak yüzeyleri: kokpit kendini "pano" diye adlandırmıyor (dördü de çapalı)', () => {
  for (const y of YUZEYLER) {
    const kaynak = yuzeyKaynagi(y);
    assert.match(kaynak, y.capa, `${y.ad}: ${y.capaNotu}`);
    assert.deepEqual(bul(y.oku(kaynak)), [], `${y.ad}: kokpite pano deniyor`);
  }
});

// ── KIRMIZIYA DÖNÜYOR MU ─────────────────────────────────────────────────────────────────

test('bozma · marka yedeği eski hâline dönerse KIRMIZI (iki yedek tek tek)', () => {
  const taban = oku('public/app.js');
  // İkinci yedek yalnız AYARSIZ hâlde çizilir; o satırın bozması boş ayarla ölçülmek zorunda,
  // yoksa proje adı yedeği ezer ve kapı hiçbir şey ölçmeden yeşil basar.
  // Çapalar EN KÜÇÜK TEKİL biçimde: bütün deyimi çapa yapan bozma, davranışı DOĞRU bırakan bir
  // yeniden yazımda (değişken adı değişse yeter) yanlış-kırmızı basardı — ve yanlış-kırmızının
  // bilinen ilk çaresi kapıyı gevşetmektir.
  for (const [eski, yeni, ayar] of [
    [/= 'kokpiti';/, "= c.altBaslik || 'panosu';", undefined],
    [/= c\.baslik \|\| 'proje';/, "= c.baslik || 'pano';", {}],
  ]) {
    assert.match(taban, eski, 'ön koşul: enjeksiyon hedefi kaynakta yok — bozma hiçbir şey ölçmüyor: ' + eski);
    assert.deepEqual(bul(markaMetni(undefined, ayar)), [], 'ön koşul: taban marka zaten temiz olmalı');
    const metin = markaMetni((k) => k.replace(eski, yeni), ayar);
    assert.ok(bul(metin).length > 0, 'bozma yakalanmadı: ' + eski + ' → ' + yeni + ' | ekran: ' + metin);
  }
});

test('bozma · dört kaynak yüzeyi eski adına dönerse KIRMIZI (tek tek, aynı okuyucudan)', () => {
  for (const y of YUZEYLER) {
    const kaynak = yuzeyKaynagi(y);
    const bozuk = y.bozma(kaynak);
    assert.notEqual(bozuk, kaynak, `${y.ad}: bozma kaynağı DEĞİŞTİRMEDİ — hedef kaymış, test hiçbir şey ölçmüyor`);
    assert.deepEqual(bul(y.oku(kaynak)), [], `${y.ad}: ön koşul — taban temiz olmalı`);
    assert.ok(bul(y.oku(bozuk)).length > 0, `${y.ad}: bozma yakalanmadı`);
  }
});

test('bozma · geri düğmesine ÖZNİTELİK olarak sızan ad da KIRMIZI (metin değil, öznitelik)', () => {
  // Ayrı bir bozma, çünkü ayrı bir kaçış yolu: etiket doğru kalırken `title`/`aria-label`
  // sahibin gördüğü ikinci metindir. İki yazım sırası da ölçülür — öznitelik id'den ÖNCE ve SONRA.
  const taban = oku('public/app.js');
  assert.deepEqual(bul(geriDugmesi(taban)), [], 'ön koşul: taban düğme temiz olmalı');
  for (const bozuk of [
    taban.replace('<button class="back-btn" id="back">', '<button class="back-btn" title="panoya dön" id="back">'),
    taban.replace('<button class="back-btn" id="back">', '<button class="back-btn" id="back" aria-label="pano">'),
  ]) {
    assert.notEqual(bozuk, taban, 'bozma kaynağı DEĞİŞTİRMEDİ — hedef kaymış');
    assert.ok(bul(geriDugmesi(bozuk)).length > 0, 'öznitelikteki ad yakalanmadı: ' + geriDugmesi(bozuk));
  }
});

test('fren · PANO DOSYASINDAN söz etmek kırmızı üretmez', () => {
  // Kapının yanlış-pozitif freni. app.js sahibin ekranına "panodaki rol ekipte yok" basar ve
  // bu DOĞRU cümledir (U57). Kapı bunu görmemeli; görseydi çözüm cümleyi silmek olurdu.
  const app = oku('public/app.js');
  assert.match(app, /panodaki rol ekipte yok/, 'ön koşul: meşru PANO cümlesi kaynakta yok — fren ölçmüyor');
  assert.deepEqual(bul(markaMetni()), [], 'meşru PANO cümlesi marka taramasına karıştı');
  assert.deepEqual(bul(geriDugmesi(app)), [], 'meşru PANO cümlesi geri düğmesi taramasına karıştı');
});
