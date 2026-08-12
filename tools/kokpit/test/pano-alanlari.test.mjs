// pano-alanlari.test.mjs — U74: PANO mekanik bloğunun ALAN LİSTESİ tek evde mi, iki tüketici
// gerçekten oradan mı TÜRÜYOR?
//
// DOĞUŞ (ölçüm, 2026-08-10): aynı liste üç evde elle yazılıydı ve üçü ayrışmıştı. Yazar sekiz
// satır basıyor, okuyucu beşini arıyor, sözleşme bir yerde beş bir yerde altı sayıyordu.
// İki somut sonuç: ① `Bekleyen sorular:` ölü dizeydi (sabit `—` basılıyor, tüm ağaçta okuyucusu
// yok) ② `Sahipte bekleyen` ve `Durak` silindiğinde kokpit `warnings=[]` dönüyordu.
//
// YEŞİL TEST KANIT DEĞİLDİR: "okuyucu tablodan türüyor" iddiasını ölçmenin tek dürüst yolu
// TABLOYU DEĞİŞTİRİP hükmün döndüğünü görmektir. Bu dosyanın belkemiği odur — kod ile veri
// ayrı temp ağaca kopyalanır, tablo bozulur, okuyucu yeniden içe aktarılır. Üretim kodunda
// test-için-kapı YOKTUR; ölçülen şey gerçek okuyucudur.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildState } from '../lib/status.mjs';
import { panoAlanlariOku, panoBlokKur, panoBlokCoz, panoAlanlariTablosu } from '../lib/pano-alanlari.mjs';
import { sandbox } from './ekran-kabuk.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KOK = path.join(__dirname, '..');
const ALAN_DOSYASI = path.join(KOK, 'pano-alanlari.txt');
const ALANLAR = panoAlanlariOku(ALAN_DOSYASI);

const p = (n) => String(n).padStart(2, '0');
const damgala = (d) => d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
const TAZE = damgala(new Date(Date.now() - 5 * 60 * 1000));

// Kurulu bir KEEL vault'u: alan listesini KENDİSİ taşır (okuyucunun katı okuma şartı budur).
// `alanListesi:false` ile aynı vault "eski kurulum / yabancı vault" hâline döner.
async function vault(o = {}) {
  const kok = await fs.mkdtemp(path.join(os.tmpdir(), 'kokpit-u74-'));
  await fs.mkdir(path.join(kok, '00_pano'), { recursive: true });
  await fs.mkdir(path.join(kok, '01_kutular/KT-001-ilk'), { recursive: true });
  await fs.mkdir(path.join(kok, '03_roller/koordinator'), { recursive: true });
  await fs.mkdir(path.join(kok, '03_roller/uygulayici'), { recursive: true });
  if (o.alanListesi !== false) {
    await fs.mkdir(path.join(kok, 'tools/kokpit'), { recursive: true });
    await fs.copyFile(ALAN_DOSYASI, path.join(kok, 'tools/kokpit/pano-alanlari.txt'));
  }
  const satirlar = o.hamBlok !== undefined ? o.hamBlok.split('\n') : [
    o.damga ?? 'Son denetim: ' + TAZE + ' (denetim #3)',
    o.isik ?? 'Işıklar: AKIŞ=YEŞİL · DOSYA=YEŞİL',
    o.gorevler ?? 'Görevler: G-01=açık',
    o.bekleyen ?? 'Sahipte bekleyen: 2',
    o.sira ?? 'Sıra: sistem',
    ...(o.durak ? [o.durak] : []),
    ...(o.fazladan ? [o.fazladan] : []),
    o.sayac ?? 'Kırmızı: 0 · Sarı: 0',
  ].filter((s) => s !== '');
  await fs.writeFile(path.join(kok, '00_pano/PANO.md'),
    '# PANO\n\n## MEKANİK BLOK — yalnız bekçi yazar\n```\n' + satirlar.join('\n') + '\n```\n\n'
    + '## YARGI BLOĞU — yazar: koordinator\n'
    + '- **Aktif kutu:** KT-001 — **AÇIK.**\n'
    + '- **SIRADAKİ OTURUM:** uygulayici — ilk üretim.\n'
    + '- **Blokaj:** yok\n');
  await fs.writeFile(path.join(kok, '00_pano/SAGLIK.md'),
    '# SAĞLIK\n\nson denetim: ' + TAZE + ' (denetim #3)\n\n**Işıklar:** AKIŞ=YEŞİL · DOSYA=YEŞİL\n\n');
  await fs.writeFile(path.join(kok, '01_kutular/KT-001-ilk/KUTU.md'),
    '# İlk iş\n\n## Görevler\n\n| Görev | İş | Sahip | Durum | Kanıt |\n|---|---|---|---|---|\n| G-01 | zemin | uygulayici | açık | test: t |\n');
  await fs.writeFile(path.join(kok, '03_roller/uygulayici/DURUM.md'), '# DURUM — Uygulayıcı\n\n**Son oturum:** zemin (2026-08-09)\n');
  await new Promise((r) => setTimeout(r, 12));
  await fs.writeFile(path.join(kok, '03_roller/koordinator/DURUM.md'), '# DURUM — Koordinatör\n\n**Son oturum:** sevk (2026-08-09)\n');
  // Drift radarını sustur: ölçülen şey dosya yaşı değil, alan listesi.
  const eski = new Date(Date.now() - 30 * 60 * 1000);
  for (const rel of ['00_pano/PANO.md', '00_pano/SAGLIK.md', '01_kutular/KT-001-ilk/KUTU.md',
                     '03_roller/uygulayici/DURUM.md', '03_roller/koordinator/DURUM.md']) {
    await fs.utimes(path.join(kok, rel), eski, eski);
  }
  return kok;
}

async function durum(o = {}) {
  const kok = await vault(o);
  try { return await buildState(kok, { koordinatorRol: 'koordinator', rolToreni: true }); }
  finally { await fs.rm(kok, { recursive: true, force: true }); }
}

const uyariVar = (s, parca) => s.warnings.some((w) => w.includes(parca));

// Kod + veri ayrı bir ağaca kopyalanır, tablo bozulur, OKUYUCU yeniden içe aktarılır.
// Temp yol her seferinde benzersiz olduğu için modül önbelleği taze gelir.
async function bozukTabloylaOkuyucu(donustur) {
  const dis = await fs.mkdtemp(path.join(os.tmpdir(), 'kokpit-tekev-'));
  await fs.mkdir(path.join(dis, 'lib'), { recursive: true });
  for (const ad of await fs.readdir(path.join(KOK, 'lib'))) {
    await fs.copyFile(path.join(KOK, 'lib', ad), path.join(dis, 'lib', ad));
  }
  const ham = await fs.readFile(ALAN_DOSYASI, 'utf8');
  await fs.writeFile(path.join(dis, 'pano-alanlari.txt'), donustur(ham));
  const mod = await import(pathToFileURL(path.join(dis, 'lib', 'status.mjs')).href);
  return { dis, buildState: mod.buildState };
}

// ── 1 · FREN: tabloya uyan vault temiz okunur ────────────────────────────────────────────

test('taban: tablonun istediği her satır yerindeyse 0 uyarı', async () => {
  const s = await durum();
  assert.deepEqual(s.warnings, [], 'temiz vault uyarı üretmemeli');
  assert.equal(s.yargi.siraKimde, 'sistem');
  assert.equal(s.yargi.sahipteBekleyen, 2);
  assert.equal(s.yargi.durak, null);
});

// ── 2 · OKUYUCU TABLODAN TÜRÜYOR MU (tek ev dikişi) ──────────────────────────────────────

test('tek ev · tablodaki ÖNEK değişince okuyucu yeni öneki okur (kodda gömülü değil)', async () => {
  const { dis, buildState: bozukOkuyucu } = await bozukTabloylaOkuyucu(
    (ham) => ham.replace('ALAN|sira|Sıra:|', 'ALAN|sira|Nöbet:|'));
  const kok = await vault({ sira: 'Nöbet: sistem' });
  try {
    // Bozuk tablolu okuyucu YENİ öneki okur…
    const s1 = await bozukOkuyucu(kok, { koordinatorRol: 'koordinator' });
    assert.equal(s1.yargi.siraKimde, 'sistem', 'tablodaki önek okunmadı — okuyucu koda gömülü demektir');
    // …asıl okuyucu ise okumaz: hüküm gerçekten TABLODAN geliyor.
    const s2 = await buildState(kok, { koordinatorRol: 'koordinator' });
    assert.equal(s2.yargi.siraKimde, null, 'asıl tabloda `Nöbet:` yok; satır eksik sayılmalı');
  } finally {
    await fs.rm(kok, { recursive: true, force: true });
    await fs.rm(dis, { recursive: true, force: true });
  }
});

test('tek ev · alan tablodan ÇIKARILINCA okuyucu o satırı hiç aramaz', async () => {
  const { dis, buildState: bozukOkuyucu } = await bozukTabloylaOkuyucu(
    (ham) => ham.split('\n').filter((l) => !l.startsWith('ALAN|sahipte-bekleyen|')).join('\n'));
  const kok = await vault({ bekleyen: '' });   // satır yok
  try {
    const s1 = await bozukOkuyucu(kok, { koordinatorRol: 'koordinator' });
    assert.deepEqual(s1.warnings, [], 'tablodan çıkan alan için not basılmamalı');
    const s2 = await buildState(kok, { koordinatorRol: 'koordinator' });
    assert.ok(uyariVar(s2, 'sende bekleyen'), 'asıl tabloda alan var: eksikliği not almalı — ' + JSON.stringify(s2.warnings));
  } finally {
    await fs.rm(kok, { recursive: true, force: true });
    await fs.rm(dis, { recursive: true, force: true });
  }
});

// ── 3 · EKSİK ALAN ARTIK SESSİZ DEĞİL ────────────────────────────────────────────────────

test('bozma · `Sahipte bekleyen` silinince okuma notu düşer (eskiden warnings=[] dönüyordu)', async () => {
  const s = await durum({ bekleyen: '' });
  assert.ok(uyariVar(s, 'sende bekleyen'), JSON.stringify(s.warnings));
  assert.equal(s.yargi.sahipteBekleyen, null);
});

// `Sıra` SATIRININ YOKLUĞU SESSİZDİR — ve bu bilinçli bir geri adımdır (hasım turu 2026-08-10).
// İlk yazımda satırın yokluğu kurulu vault'ta "bilinmiyor"a kapanıyordu. Ölçüldü: sahadaki ALTI
// kurulumun HİÇBİRİNİN panosunda `Sıra:` satırı yok, yani kokpit dosyaları kopyalandığı anda —
// bekçi daha bir kez koşmadan — hepsinin ana paneli "belirsiz, emin olmadan yeni oturum açma"ya
// düşerdi. Sahibi durduran bir panel, bir okuma notundan pahalıdır. Satırın YAZILMASI yazar
// tarafında zaten fail-closed'dır; okuyucunun ikinci kez katılaşması yeni bir şey ölçmüyordu.
// U17'nin kapattığı zarar KORUNUR: satır VARSA ve değeri tanınmıyorsa yön fail-safe kapanır.
test('geri-uyum · `Sıra` satırı YOKSA sessizdir (eski pano yanlış-alarm üretmez)', async () => {
  const s = await durum({ sira: '' });
  assert.equal(s.warnings.filter((w) => w.includes('Sıra')).length, 0, JSON.stringify(s.warnings));
  assert.equal(s.yargi.siraKimde, null, 'yokluk bir DEĞER değildir; hüküm üretilmez');
});

test('fren · `Sıra` VAR ama değeri tanınmıyorsa yön fail-safe kapanır (U17 zararı geri gelmez)', async () => {
  const s = await durum({ sira: 'Sıra: kimbilir' });
  assert.ok(uyariVar(s, 'PANO Sıra satırı tanınmayan değer'), JSON.stringify(s.warnings));
  assert.equal(s.yargi.siraKimde, 'bilinmiyor');
  const metin = ciz(s).metin;
  assert.equal(/Bu senin sıran/.test(metin), false, 'okunamayan sıra sahibi oturuma davet edemez');
});

test('bozma · sayı olmayan `Sahipte bekleyen` sessiz sıfıra düşmez', async () => {
  const s = await durum({ bekleyen: 'Sahipte bekleyen: birkaç' });
  assert.ok(uyariVar(s, 'sende bekleyen sayısı okunamadı'), JSON.stringify(s.warnings));
  assert.equal(s.yargi.sahipteBekleyen, null);
});

test('bozma · önek var gövde BOŞ ise satır YOK sayılır (var saymak eksiği sessizleştirirdi)', async () => {
  // İKİ NOT BİRBİRİNE ÇOK YAKIN ve ilk yazımda ölçüm bunu kaçırıyordu: "…sayısı SATIRI
  // okunamadı" (satır yok) ile "…sayısı okunamadı: <değer>" (satır var, değer çözülemedi)
  // ayrı hâllerdir. Gevşek eşleşme ikisini de kabul ediyordu ve boş gövdeyi "var" sayan
  // bozma YEŞİL kalıyordu — kasıtlı bozma turu yakaladı.
  const s = await durum({ bekleyen: 'Sahipte bekleyen:' });
  assert.ok(uyariVar(s, 'sende bekleyen sayısı satırı okunamadı'), JSON.stringify(s.warnings));
  assert.equal(uyariVar(s, 'sayısı okunamadı:'), false, 'boş gövde "değer çözülemedi" değil, "satır yok"tur');
});

// ── 4 · GERİ-UYUM FRENİ: yanlış-alarm üretmiyoruz ────────────────────────────────────────

test('fren · alan listesini taşımayan vault (eski kurulum · üçüncü kopya) not almaz', async () => {
  const s = await durum({ alanListesi: false, bekleyen: '', sira: '' });
  assert.deepEqual(s.warnings, [], 'yabancı vault yanlış-alarm üretmemeli: ' + JSON.stringify(s.warnings));
  assert.equal(s.yargi.siraKimde, null, 'geri-uyum: satır yoksa bugünkü davranış korunur');
});

test('fren · ZORUNLU alan her vault\'ta ölçülür (geri-uyum zorunluyu susturmaz)', async () => {
  const s = await durum({ alanListesi: false, gorevler: '' });
  assert.ok(uyariVar(s, 'PANO Görevler satırı okunamadı'), JSON.stringify(s.warnings));
});

// ── 5 · ÖLÜ DİZE DÜŞTÜ ───────────────────────────────────────────────────────────────────

test('ölü dize · `Bekleyen sorular` tabloda YOK; panoda dursa bile okunmaz ve not üretmez', async () => {
  assert.equal(ALANLAR.some((a) => a.onek.includes('Bekleyen sorular')), false, 'ölü dize tabloya geri gelmiş');
  const s = await durum({ fazladan: 'Bekleyen sorular: —' });
  assert.deepEqual(s.warnings, [], 'eski kurulumların panosunda kalan satır gürültü üretmemeli');
});

// ÖLÜ DİZE YASAĞI — U74'ün asıl hükmü. Yukarıdaki test yalnız BUGÜNKÜ tabloyu ölçüyordu:
// `Bekleyen sorular`ı listeye geri koyan bir bozma YEŞİL kalıyordu (kasıtlı bozma turu
// yakaladı). Ölü dize "adı Bekleyen sorular olan satır" değildir — TÜKETİCİSİ OLMAYAN alandır.
// Ölçüm o yüzden ada değil DAVRANIŞA bakar: tablodaki her alan için satırı olan ve olmayan
// vault'un okunuşu FARKLI olmak zorundadır. Fark yoksa o alan hiçbir şey yapmıyor demektir.
test('ölü dize yasağı · tablodaki HER alanın gözlenebilir bir tüketicisi var', async () => {
  // Değerler yazarın kendi kurucusundan geçer: tabloya alan eklenip buraya değer yazılmazsa
  // panoBlokKur fail-closed atar ve bu test kırmızı basar — sessiz genişleme yok.
  const degerler = {
    'son-denetim': TAZE + ' (denetim #3)',
    'isiklar': 'AKIŞ=YEŞİL · DOSYA=YEŞİL',
    'gorevler': 'G-01=açık',
    'sahipte-bekleyen': '2',
    'sira': 'sistem',
    'durak': 'insan girdisi bekleniyor (D9)',
    'sayac': '0 · Sarı: 0',
  };
  // SATIRI SİLMEK DEĞİL, DEĞERİ DEĞİŞTİRMEK. İlk yazım silmeyi ölçüyordu ve totolojikti
  // (hasım turu 2026-08-10): zorunlu bir alanın satırını silmek okuyucunun KENDİ "eksik"
  // notunu doğuruyor, yani fark her hâlde çıkıyordu — gerçek bir tüketici olmasa bile.
  // Değeri DEĞİŞTİRMEK bu tuzağı mekanik olarak yok eder: satır yerinde, biçim geçerli,
  // eksik-notu doğmaz. Okunan hüküm yine de değişiyorsa o alanı biri gerçekten KULLANIYOR
  // demektir; değişmiyorsa alan ölü dizedir — U74'ün düşürdüğü `Bekleyen sorular:` gibi.
  //
  // KARŞILAŞTIRILAN ŞEY DURUMUN TAMAMIDIR, seçilmiş birkaç alan değil: ilk yazımda yalnız
  // warnings+yargi+saglik karşılaştırılıyordu ve `Görevler:` satırının GERÇEK tüketicisi
  // (state.kutu.gates[].durumKanon) karşılaştırmanın dışında kaldığı için kapı onu "ölü"
  // sanıyordu. Geçici dizin adı her koşuda değiştiği için yollar normalize edilir — bu
  // normalizasyon olmadan iki okunuş HER ZAMAN farklı çıkar ve kapı hiçbir şey ölçmez.
  const okunus = async (harita) => {
    const kok = await vault({ hamBlok: panoBlokKur(ALANLAR, harita) });
    try {
      const s = await buildState(kok, { koordinatorRol: 'koordinator', rolToreni: true });
      // OYNAK ALANLAR DÜŞÜRÜLÜR. `generatedAt` milisaniye taşır ve her çağrıda değişir; ilk
      // yazımda düşürülmemişti, yani iki okunuş HER ZAMAN farklı çıkıyor ve kapı hiçbir şey
      // ölçmüyordu. Bozma turu bunu yakaladı: `Görevler:` tüketicisi düşürüldüğünde kapı
      // yeşil kaldı. Yol adı da geçici dizinden gelir, o da normalize edilir.
      const { generatedAt, vaultRoot, ...kalan } = s;
      // `mtimeMs` de oynaktır: geçici vault her çağrıda yeniden yazılır ve dosya damgaları
      // milisaniye düzeyinde ayrışır. Düşürülmezse iki okunuş HER ZAMAN farklı çıkar; bozma
      // turu tam bunu yakaladı — `Görevler:` tüketicisi düşürüldüğü hâlde kapı yeşil kaldı.
      return JSON.stringify(kalan).split(kok).join('<KOK>').replace(/"mtimeMs":\d+/g, '"mtimeMs":0');
    } finally { await fs.rm(kok, { recursive: true, force: true }); }
  };
  const tam = await okunus(degerler);
  for (const a of ALANLAR) {
    assert.ok(BASKA_DEGER[a.anahtar],
      a.anahtar + ' için ikinci değer yazılmamış — tabloya alan eklenmiş, kapı güncellenmemiş');
    assert.notEqual(await okunus({ ...degerler, [a.anahtar]: BASKA_DEGER[a.anahtar] }), tam,
      a.anahtar + ' alanının DEĞERİ değişince kokpitin okuduğu HİÇBİR ŞEY değişmiyor — '
      + 'o alanı kimse kullanmıyor demektir (ölü dize)');
  }
});

// Her alan için AYNI BİÇİMDE ama farklı bir değer: tüketiciyi görünür kılmak için.
// Değerler fixture'la UYUMLU seçilir — `Görevler:` için kutuda gerçekten bulunan G-01
// kullanılır, çünkü tüketici (durumKanon) yalnız kutudaki görevle eşleşen satırı okur.
const BASKA_DEGER = {
  'son-denetim': '2026-01-02 03:04 (denetim #99)',
  'isiklar': 'AKIŞ=KIRMIZI · DOSYA=SARI',
  'gorevler': 'G-01=kapandı',
  'sahipte-bekleyen': '7',
  'sira': 'sahip',
  'durak': 'başka bir sebep',
  'sayac': '5 · Sarı: 4',
};

// ── 6 · SAHİBİN EKRANI: yazılan satır GÖRÜNÜYOR mu ───────────────────────────────────────

function ciz(state) {
  const { ctx, ekran } = sandbox();
  ctx.state = state;
  ctx.renderTopbar();
  ctx.renderKokpit();
  const metin = ['sys-light', 'stamp', 'ribbon', 'kokpit-view']
    .map((id) => (ekran[id] ? (ekran[id].innerHTML || '') + ' ' + (ekran[id].textContent || '') : ''))
    .join('\n').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
  return { metin };
}

test('ekran · sende bekleyen madde sayısı sahibin ekranında görünür', async () => {
  const s = await durum({ bekleyen: 'Sahipte bekleyen: 3' });
  assert.match(ciz(s).metin, /sende bekleyen: 3 madde/);
});

test('ekran · sıfır bekleyen ekranı kirletmez (sayı yalnız varken çıkar)', async () => {
  const s = await durum({ bekleyen: 'Sahipte bekleyen: 0' });
  assert.equal(/sende bekleyen:/.test(ciz(s).metin), false);
});

test('ekran · durak satırı varsa "sistem durdu" görünür, yoksa görünmez', async () => {
  const varli = await durum({ durak: 'Durak: insan girdisi bekleniyor (D9)' });
  assert.match(ciz(varli).metin, /sistem durdu/);
  assert.match(ciz(varli).metin, /insan girdisi bekleniyor/);
  const yoklu = await durum();
  assert.equal(/sistem durdu/.test(ciz(yoklu).metin), false);
});

// ── 7 · SÖZLEŞME BELGESİ ÜRETİLEN TABLOYU TAŞIYOR ────────────────────────────────────────

test('sözleşme · PANO_SOZLESMESI.md içindeki tablo pano-alanlari.txt\'ten ÜRETİLENLE bayt-eş', async () => {
  const belge = await fs.readFile(path.join(KOK, 'PANO_SOZLESMESI.md'), 'utf8');
  const m = belge.match(/<!-- pano-alanlari:baslangic[^>]*-->\n([\s\S]*?)\n<!-- pano-alanlari:bitis -->/);
  assert.ok(m, 'üretilen blok işaretleri belgede bulunamadı — sözleşme listeyi yine elle yazıyor olabilir');
  assert.equal(m[1], panoAlanlariTablosu(ALANLAR),
    'sözleşmedeki tablo veri dosyasından ayrıştı; blok pano-alanlari.txt\'ten yeniden üretilmeli');
});

test('sözleşme · belge alan listesini İKİNCİ kez saymıyor (ölü kopya geri gelmesin)', async () => {
  const belge = await fs.readFile(path.join(KOK, 'PANO_SOZLESMESI.md'), 'utf8');
  const disi = belge.replace(/<!-- pano-alanlari:baslangic[^>]*-->[\s\S]*?<!-- pano-alanlari:bitis -->/, '');
  for (const a of ALANLAR) {
    const kez = disi.split('`' + a.onek + '`').length - 1;
    assert.ok(kez <= 1, a.onek + ' üretilen blok DIŞINDA ' + kez + ' kez sayılmış — liste ikinci eve dönüyor');
  }
});

// ÇOKLUK DEĞİL, CİNS. Yukarıdaki kapı öneklerin KAÇ KEZ geçtiğini sayar ve hasım turu (2026-08-10)
// bunun yetmediğini gösterdi: belge zorunluluk cümlesi kurabiliyordu ("kurulu vault'ta satır
// eksikse okuyucu bilinmiyor'a düşer") ve o cümle aynı gün BAYATLADI — `sira` satırının okuyucu
// sütunu değişti, belge eski hükmü anlatmaya devam etti, hiçbir test görmedi. Sınır artık cinse
// göredir: ÖNEK belgede geçebilir (değerin grameri buranın işi), ZORUNLULUK geçemez.
test('sözleşme · zorunluluk sözlüğü belgede yaşamıyor (hüküm tek evde: pano-alanlari.txt)', async () => {
  const belge = await fs.readFile(path.join(KOK, 'PANO_SOZLESMESI.md'), 'utf8');
  const disi = belge.replace(/<!-- pano-alanlari:baslangic[^>]*-->[\s\S]*?<!-- pano-alanlari:bitis -->/, '');
  const sozluk = ['zorunlu', 'kurulu', 'istegebagli', 'kosullu', 'bosluk'];
  // SATIR DEĞİL MADDE ölçülür. `zorunlu` sıradan bir Türkçe kelimedir ve belgede alanla
  // ilgisiz yerlerde geçer ("yeni projelerde zorunlu"); satır satır yasaklamak yanlış-kırmızı
  // üretirdi. Aranan CİNS şudur: bir maddenin İÇİNDE hem bir alan öneki hem zorunluluk sözcüğü
  // geçiyorsa o madde o alan hakkında hüküm kuruyordur. Bayatlayan gerçek cümle de tam bu
  // şekildeydi ve önek ile hüküm AYRI SATIRLARDAYDI — bu yüzden ölçüm maddeyi bütün alır.
  const maddeler = disi.split(/\n(?=\s*[-*] |#{1,6} |\S)/);
  for (const madde of maddeler) {
    const onek = ALANLAR.find((a) => madde.includes('`' + a.onek + '`') || madde.includes(a.onek + ' '));
    if (!onek) continue;
    if (madde.includes('pano-alanlari.txt')) continue;   // veri dosyasına yollayan cümle meşru
    const kacak = sozluk.find((k) => new RegExp('\\b' + k + '\\b').test(madde));
    assert.equal(kacak, undefined,
      'sözleşme `' + onek.onek + '` alanı hakkında zorunluluk hükmü kuruyor ("' + kacak + '") — '
      + 'hüküm pano-alanlari.txt\'in evidir ve orada değişince burası sessizce bayatlar:\n  ' + madde.trim());
  }
});

// ── 4b · OKUYUCU ÇÖKMEZ: EKRAN BOŞALMAZ, HÜKÜM BOŞLUĞA YAZILIR ───────────────────────────
//
// Hasım turu (2026-08-10): alan listesi okunamadığında buildState fırlıyordu; /api/state 500
// dönüyor, tarayıcı gövdeyi başarıyla ayrıştırdığı için hata dalı hiç koşmuyor ve sahip
// SIFIR okuma notuyla BOŞ bir ekran görüyordu. Hiçbir şey söylemeden kapanmak fail-closed
// değildir. Hüküm artık boşluğa yazılır: not basılır ve genel durum YEŞİL basamaz.
test('okuyucu · alan listesi okunamazsa ÇÖKMEZ; not basar ve yeşil basamaz', async () => {
  const { dis, buildState: kirikOkuyucu } = await bozukTabloylaOkuyucu((ham) => ham);
  await fs.rm(path.join(dis, 'pano-alanlari.txt'));
  const kok = await vault();
  try {
    const s = await kirikOkuyucu(kok, { koordinatorRol: 'koordinator' });
    assert.ok(uyariVar(s, 'pano biçim listesi okunamadı'), JSON.stringify(s.warnings));
    assert.ok((s.saglik.bosluklar || []).includes('pano-alan-listesi-okunamadi'), JSON.stringify(s.saglik.bosluklar));
    assert.notEqual(s.saglik.sistemGenel, 'YEŞİL', 'okunamayan biçim listesiyle ekran yeşil kalamaz');
  } finally {
    await fs.rm(kok, { recursive: true, force: true });
    await fs.rm(dis, { recursive: true, force: true });
  }
});

// ── 5b · İÇ KURAL KODU SAHİBİN EKRANINA ÇIKMAZ ───────────────────────────────────────────
//
// Panodaki durak metni ekipler için kod taşır ("… (D9)"); sahip için o kod TANIMSIZ bir
// işarettir ve sahip yüzeyinin ilk kuralı tanımsız kelime basmamaktır. Hasım turu (2026-08-10)
// kodun ekrana çıktığını ve hiçbir sahip-dili kapısının bu yolu taramadığını ölçtü.
// ÖLÇÜM GERÇEK ZİNCİRDEN GEÇER: pano → okuyucu → ekran. Ekrana elle durum enjekte eden bir
// test yanlış katmanı ölçerdi — ayıklama okuyucunun işidir, ekran ne verilirse onu basar.
test('sahip yüzeyi · panodaki iç kural kodu ("(D9)") sahibin ekranına ÇIKMAZ', async () => {
  const s = await durum({ durak: 'Durak: insan girdisi bekleniyor (D9)' });
  assert.equal(s.yargi.durak, 'insan girdisi bekleniyor', 'kod okuyucuda ayıklanmalı');
  const metin = ciz(s).metin;
  assert.match(metin, /insan girdisi bekleniyor/, 'sebep sahibe gösterilmeli');
  assert.equal(/\(D\d+\)/.test(metin), false, 'iç kural kodu sahibin ekranında:\n' + metin);
});

test('sahip yüzeyi · "sistem durdu" ile "kendi başına çalışıyor" AYNI ekranda basılamaz', async () => {
  // İkisi de doğru olabilir (dönem açık + aktif kutu yok) ama sahibe biri "senin bir şey
  // açmana gerek yok", öteki "sistem durdu" der. Hasım turu bu çelişkiyi ölçtü.
  const s = await durum({ durak: 'Durak: insan girdisi bekleniyor (D9)', sira: 'Sıra: sistem' });
  const metin = ciz(s).metin;
  assert.match(metin, /sistem durdu/);
  assert.equal(/kendi başına çalışıyor/.test(metin), false, 'iki cümle birbirini yalanlıyor:\n' + metin);
});

// ── 6b · ESKİ YAZIM (geri-uyum sütunu) GERÇEKTEN KOŞUYOR ─────────────────────────────────
//
// Tabloda `eski-önek` sütunu var ve bugün yalnız `son-denetim` onu taşıyor (`Son koşu:` —
// damganın eski yazımı). Hasım turu (2026-08-10) o sütunun HİÇBİR fixture tarafından
// koşturulmadığını ölçtü: sütunu okumayı bırakan bir bozma yeşil kalırdı ve sahadaki eski
// kurulumlar (bugün altı tanesi) sessizce damgasız okunmaya başlardı — yani "sistem KIRMIZI
// sayılır" ezberi hiç ateşlenmezdi.
test('geri-uyum · eski yazımlı damga (`Son koşu:`) bugünkü okuyucuda hâlâ okunuyor', async () => {
  const eski = ALANLAR.find((a) => a.eskiOnek);
  assert.ok(eski, 'tabloda eski-önek taşıyan alan kalmamış — bu kapı da düşmeli');
  const s = await durum({ damga: eski.eskiOnek + ' ' + TAZE + ' (koşu #3)' });
  assert.deepEqual(s.warnings, [], 'eski yazım tanınmalı, not üretmemeli');
  assert.equal(s.saglik.stale, false, 'eski yazımlı damga okunamazsa vault bayat sanılır');
});

test('geri-uyum · eski yazım TABLODAN geliyor: sütun boşalınca damga okunamaz', async () => {
  const { dis, buildState: bozukOkuyucu } = await bozukTabloylaOkuyucu(
    (ham) => ham.replace('|Son koşu:', '|-'));
  const kok = await vault({ damga: 'Son koşu: ' + TAZE + ' (koşu #3)' });
  try {
    const s1 = await bozukOkuyucu(kok, { koordinatorRol: 'koordinator' });
    assert.ok(s1.warnings.length > 0, 'sütun boşalınca eski yazım artık okunmamalı');
    const s2 = await buildState(kok, { koordinatorRol: 'koordinator' });
    assert.deepEqual(s2.warnings, [], 'asıl tabloda sütun dolu: aynı pano temiz okunmalı');
  } finally {
    await fs.rm(kok, { recursive: true, force: true });
    await fs.rm(dis, { recursive: true, force: true });
  }
});

// ── 7b · BİÇİM OTORİTESİ İLAN EDİLEN DOSYALAR SÖZLEŞMEYE UYAR ────────────────────────────
//
// Sözleşme yeni kurulumu "fixtures/tekfaz dosyalarını kopyala" diye yönlendirir; yani o iki
// pano fiilen BİÇİM OTORİTESİDİR. Hasım turu (2026-08-10) ikisinin de bayat olduğunu ölçtü:
// düşürülen `Bekleyen sorular:` satırını hâlâ taşıyorlardı ve U74'ün eklediği iki alanı hiç
// taşımıyorlardı. Kopyalayan her proje bayat biçimle doğardı. Ölçüm ada değil TABLOYA bakar,
// böylece tablo değiştiğinde bu dosyalar da kırmızıya döner.
for (const ad of ['tekfaz', 'ikifaz']) {
  test('biçim otoritesi · fixtures/' + ad + ' panosu bugünkü alan tablosuna uyar', async () => {
    const metin = await fs.readFile(path.join(KOK, 'test/fixtures', ad, '00_pano/PANO.md'), 'utf8');
    const blok = metin.match(/```\n([\s\S]*?)\n```/);
    assert.ok(blok, ad + ' panosunda mekanik blok yok');
    const satirlar = blok[1].split('\n').filter(Boolean);
    for (const a of ALANLAR) {
      const var_ = satirlar.some((s) => s.startsWith(a.onek));
      if (a.okuyucu === 'zorunlu' || a.okuyucu === 'kurulu') {
        assert.ok(var_, ad + ' panosunda `' + a.onek + '` yok — kopyalayan proje bayat biçimle doğar');
      }
    }
    for (const s of satirlar) {
      assert.ok(ALANLAR.some((a) => s.startsWith(a.onek)),
        ad + ' panosunda tabloda OLMAYAN satır var: "' + s + '" — ölü dize kopyalanarak yayılır');
    }
  });
}

// ── 8 · TABLO KENDİ BİÇİMİNİ ÖLÇÜYOR (fail-closed) ───────────────────────────────────────

const bozukTablo = async (donustur) => {
  const dis = await fs.mkdtemp(path.join(os.tmpdir(), 'kokpit-tablo-'));
  const yol = path.join(dis, 'pano-alanlari.txt');
  await fs.writeFile(yol, donustur(await fs.readFile(ALAN_DOSYASI, 'utf8')));
  try { return { hata: (() => { try { panoAlanlariOku(yol); return null; } catch (e) { return e.message; } })() }; }
  finally { await fs.rm(dis, { recursive: true, force: true }); }
};

test('fail-closed · dosya yoksa okuyucu "biçimli" demez, hata fırlatır', () => {
  assert.throws(() => panoAlanlariOku(path.join(os.tmpdir(), 'olmayan-pano-alanlari-' + process.pid + '.txt')),
    /okunamadi/);
});

test('fail-closed · sözlük dışı sütun değeri sessiz geçmez', async () => {
  assert.match((await bozukTablo((h) => h.replace('|her|zorunlu|bosluk|', '|her|belki|bosluk|'))).hata || '', /okuyucu degeri/);
  assert.match((await bozukTablo((h) => h.replace('ALAN|isiklar|Işıklar:|her|', 'ALAN|isiklar|Işıklar:|bazen|'))).hata || '', /yazar degeri/);
});

test('fail-closed · tablo kendi içinde çelişemez (kosullu alan zorunlu okunamaz)', async () => {
  assert.match((await bozukTablo((h) => h.replace('ALAN|durak|Durak:|kosullu|istegebagli|-|-', 'ALAN|durak|Durak:|kosullu|zorunlu|not|-'))).hata || '',
    /celiski/);
});

test('fail-closed · eksik sütun ve yinelenen anahtar yakalanır', async () => {
  assert.match((await bozukTablo((h) => h.replace('ALAN|gorevler|Görevler:|her|zorunlu|not|-', 'ALAN|gorevler|Görevler:|her|zorunlu|not'))).hata || '', /yedi alan/);
  assert.match((await bozukTablo((h) => h + '\nALAN|sira|Nöbet:|her|kurulu|not|-\n')).hata || '', /yinelenen anahtar/);
});

// ── 9 · KURUCU: yazarın sözleşmesi ───────────────────────────────────────────────────────

test('kurucu · listede olmayan anahtar üretmek fail-closed', () => {
  assert.throws(() => panoBlokKur(ALANLAR, { 'son-denetim': 'x', 'isiklar': 'y', 'gorevler': 'z',
    'sahipte-bekleyen': '0', 'sira': 'sahip', 'sayac': '0 · Sarı: 0', 'bekleyen-sorular': '—' }),
    /listede olmayan alan/);
});

test('kurucu · `her` alanını değersiz/boş bırakmak fail-closed', () => {
  const taban = { 'son-denetim': 'x', 'isiklar': 'y', 'gorevler': 'z', 'sahipte-bekleyen': '0', 'sira': 'sahip', 'sayac': '0 · Sarı: 0' };
  assert.throws(() => panoBlokKur(ALANLAR, { ...taban, 'sira': null }), /degersiz/);
  assert.throws(() => panoBlokKur(ALANLAR, { ...taban, 'sira': '   ' }), /bos/);
});

test('kurucu · `kosullu` alan yokken satır doğmaz, varken tablo SIRASINDA doğar', () => {
  const taban = { 'son-denetim': 'x', 'isiklar': 'y', 'gorevler': 'z', 'sahipte-bekleyen': '0', 'sira': 'sahip', 'sayac': '0 · Sarı: 0' };
  assert.equal(panoBlokKur(ALANLAR, taban).includes('Durak:'), false);
  const satirlar = panoBlokKur(ALANLAR, { ...taban, 'durak': 'insan girdisi bekleniyor (D9)' }).split('\n');
  assert.deepEqual(satirlar.map((s) => s.split(':')[0]),
    ['Son denetim', 'Işıklar', 'Görevler', 'Sahipte bekleyen', 'Sıra', 'Durak', 'Kırmızı']);
});

test('çözücü · önek satır BAŞINDAN eşleşir (başka satırın gövdesindeki iki nokta yanıltmaz)', () => {
  const govde = panoBlokKur(ALANLAR, { 'son-denetim': 'x', 'isiklar': 'y', 'gorevler': 'z',
    'sahipte-bekleyen': '0', 'sira': 'sahip', 'sayac': '0 · Sarı: 4' });
  const d = panoBlokCoz(ALANLAR, govde);
  assert.equal(d.get('sayac'), '0 · Sarı: 4');
  assert.equal(d.get('sira'), 'sahip');
  assert.equal(d.has('durak'), false);
});
