// cevap-kanali.test.mjs — F1-5g: haber kanalının GELEN yönü (Faz 2 · sıra 8).
// Sözleşme: "Otonom KEEL — cevap kanalı tasarısı (sıra 8)" — geliştirme arşivi
//   §3 kimlik (Message-ID/In-Reply-To) · §3.1 MIME-farkında gövde · §4 sözleşme genişlemeleri ·
//   §5 mekanik akış · §6 kırılma tablosu · §8 bitti ölçütü.
//
// AĞA ÇIKILMAZ. Gönderim `--prova` kipinde; IMAP hattının kendisi burada koşmaz (canlı prova
// Faz 3'ün işi ve tasarının ilan edilmiş sınırı). Buradaki testler o hattın AYRIŞTIRICILARINI
// ve karar mantığını ölçer — hasım turunun en pahalı iki bulgusu (curl BODY.PEEK · çok parçalı
// MIME) sahte IMAP çıktısıyla DEĞİL, gerçek bir iOS Mail yanıtının ham metniyle sınanır.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, copyFileSync, chmodSync, statSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { kuyrukBagimliliklariKur } from './kuyruk-bagimliligi.mjs';

const BURASI = dirname(fileURLToPath(import.meta.url));
const KOK_REPO = join(BURASI, '..', '..', '..');
const BETIKLER = ['ortak.sh', 'kilit.sh', 'zarf-ekle.sh', 'haber.sh', 'nabiz.sh', 'catal-kuyruk.sh'];

function kurulum({ cevapKanali = 'acik', jeton = '' } = {}) {
  const kok = mkdtempSync(join(tmpdir(), 'cevap-test-'));
  mkdirSync(join(kok, 'tools', 'sevk'), { recursive: true });
  mkdirSync(join(kok, 'tools', 'guard'), { recursive: true });
  mkdirSync(join(kok, '00_pano'), { recursive: true });
  for (const b of BETIKLER) {
    copyFileSync(join(KOK_REPO, 'tools', 'sevk', b), join(kok, 'tools', 'sevk', b));
    chmodSync(join(kok, 'tools', 'sevk', b), 0o755);
  }
  copyFileSync(join(KOK_REPO, 'tools', 'sevk', 'cevap-sozlugu.txt'), join(kok, 'tools', 'sevk', 'cevap-sozlugu.txt'));
  // gorev-durumlari.txt VERI dosyasidir ve sevk onu FAIL-CLOSED arar (K5 tek evi; kume
  // bekci ile ORTAK): kurulu projede her zaman vardir, simulasyon da tasimak zorunda.
  mkdirSync(join(kok, 'tools', 'bekci'), { recursive: true });
  copyFileSync(join(KOK_REPO, 'tools', 'bekci', 'gorev-durumlari.txt'),
               join(kok, 'tools', 'bekci', 'gorev-durumlari.txt'));
  // zarf-jetonlari.txt de VERI dosyasidir ve IKI UC (sevk + zarf-bicim-kapisi) onu
  // FAIL-CLOSED arar (U40 tek evi): kurulu projede hep vardir, simulasyon da tasir.
  copyFileSync(join(KOK_REPO, 'tools', 'sevk', 'zarf-jetonlari.txt'),
               join(kok, 'tools', 'sevk', 'zarf-jetonlari.txt'));
  // Kuyruga yazan kollar icerik suzgecini FAIL-CLOSED arar (U60): kod betigin yanindan,
  // VERI projenin kokunden gelir. Kurulu projede ikisi de vardir; simulasyon da tasir.
  kuyrukBagimliliklariKur(kok, KOK_REPO);
  for (const g of ['icerik-suzgeci.sh', 'gercek-veri-isaretleri.txt', 'yazim-kalibi.txt', 'sinif-listesi.txt']) {
    copyFileSync(join(KOK_REPO, 'tools', 'guard', g), join(kok, 'tools', 'guard', g));
  }
  writeFileSync(join(kok, 'tools', 'sevk', 'kanal.conf'),
    'SMTP_SUNUCU=smtp.ornek.gecersiz\nHESAP=deneme@ornek.gecersiz\nALICI=deneme@ornek.gecersiz\n' +
    'IMAP_SUNUCU=imap.ornek.gecersiz\nKEYCHAIN_SERVIS=keel-test-yok\n' +
    (cevapKanali ? `CEVAP_KANALI=${cevapKanali}\n` : '') + (jeton ? `CEVAP_JETON=${jeton}\n` : ''));
  return kok;
}
const kos = (kok, ad, args = [], girdi = undefined) =>
  spawnSync('bash', [join(kok, 'tools', 'sevk', ad), ...args],
    { encoding: 'utf8', input: girdi, env: { ...process.env, CLAUDE_PROJECT_DIR: kok } });
const KUYRUK = (kok) => join(kok, '00_pano', 'SENDE_BEKLEYEN.md');

function kuyrukKur(kok, satirlar) {
  writeFileSync(KUYRUK(kok), '# SENDE BEKLEYEN\n\n' + satirlar.join('\n') + '\n');
}
const ACIK = (id, gorev = 'G-12') =>
  `- [ ] 2026-07-30 · po · ÇATAL ${id} · "Hangisi olsun?" · etki: sabah farkı · bekletir: ${gorev} · kaynak: zarf-günlüğü satır 4`;

// nabiz.sh'ın JS yardımcılarını KAYNAĞINDAN çıkarıp koştururuz: ikinci bir kopya yazmak
// (D-02) tam da bu paketin düzelttiği sürüklenme sınıfını yeniden doğururdu.
function jsCikar(ad) {
  const s = readFileSync(join(KOK_REPO, 'tools', 'sevk', 'nabiz.sh'), 'utf8');
  const bas = s.indexOf(ad + "='");
  assert.ok(bas > 0, `${ad} nabiz.sh içinde bulunamadı`);
  const i = bas + ad.length + 2;
  const j = s.indexOf("\n'\n", i);
  return s.slice(i, j);
}
const jsKos = (ad, girdi, env = {}) =>
  spawnSync(process.execPath, ['--input-type=module', '-e', jsCikar(ad)],
    { encoding: 'utf8', input: girdi, env: { ...process.env, ...env } });

// ── 1 · Kimlik: Message-ID tek üreticiden çıkar (bitti ölçütü 4-5) ────────────────────────
test('kodlu çatal postası Message-ID taşır; konu kodu TAŞIMAZ', () => {
  const kok = kurulum();
  const r = kos(kok, 'haber.sh', ['--prova', '--olay', 'catal-bekliyor', '--kutu', 'KT-001',
    '--donem', 'D1', '--catal', 'Ç-03', '--ceviri', 'Hangisi olsun?', '--etki', 'x', '--bekletir', 'G-12',
    '--kod', 'R4T7QM2F', '--secenekler', '1) Yerinde kal\n2) Yenisine geç']);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /^Message-ID: <keel-R4T7QM2F@ornek\.gecersiz>$/m,
    'Message-ID başlığı yok — kimlik çapası kurulmuyor');
  const konu = r.stdout.split('\n').find((l) => l.startsWith('Subject:'));
  assert.ok(!konu.includes('R4T7QM2F'),
    'kod KONUDA görünüyor — kilitli telefon bildiriminde okunur ve Fwd: ile taşınır (§3)');
  assert.match(r.stdout, /1\) Yerinde kal/, 'seçenek listesi gövdede yok');
  assert.match(r.stdout, /YANITLA/, 'nasıl cevap verileceği yazmıyor');
});

test('kodsuz çatal postası "uzaktan cevaplanamaz" der (geri uyum)', () => {
  const kok = kurulum({ cevapKanali: '' });
  const r = kos(kok, 'haber.sh', ['--prova', '--olay', 'catal-bekliyor', '--kutu', 'KT-001',
    '--catal', 'Ç-03', '--ceviri', 'Hangisi?', '--etki', 'x', '--bekletir', 'G-12']);
  assert.equal(r.status, 0);
  assert.ok(!/Message-ID/.test(r.stdout), 'kodsuz postada Message-ID doğmamalı');
  assert.match(r.stdout, /uzaktan cevaplanamaz/, 'sahibe yolun kapalı olduğu söylenmiyor');
});

test('geçersiz kod biçimi reddedilir (arama anahtarı saf ASCII olmak zorunda)', () => {
  const kok = kurulum();
  for (const kod of ['abc', 'R4T7-QM', 'R4T7QM2İ', '']) {
    const r = kos(kok, 'haber.sh', ['--prova', '--olay', 'catal-bekliyor', '--kutu', 'K',
      '--catal', 'Ç-1', '--ceviri', 'x', '--etki', 'x', '--bekletir', 'G-1', '--kod', kod,
      '--secenekler', '1) a\n2) b']);
    if (kod === '') { assert.equal(r.status, 0, 'boş kod yalnız "kod yok" demektir'); continue; }
    assert.equal(r.status, 1, `geçersiz kod kabul edildi: ${kod}`);
  }
});

// ── 2 · Kapalı beyaz listeler (bitti ölçütü 11 · hasım bulgusu L9) ────────────────────────
test('cevapsiz ve cevap-okunamadi alarm cinsleri TANINIR; uydurma cins reddedilir', () => {
  const kok = kurulum();
  for (const c of ['cevapsiz', 'cevap-okunamadi']) {
    const r = kos(kok, 'haber.sh', ['--prova', '--olay', 'alarm', '--cins', c, '--kutu', 'K', '--detay', 'x']);
    assert.equal(r.status, 0, `${c} cinsi reddedildi — yükseltme hattı izsiz ölürdü`);
  }
  const r = kos(kok, 'haber.sh', ['--prova', '--olay', 'alarm', '--cins', 'uydurma', '--kutu', 'K']);
  assert.equal(r.status, 1, 'beyaz liste açıldı — kapalı liste güvencesi kayboldu');
});

test('cevap-alindi ve cevap-reddedildi günlük tipleri kabul edilir', () => {
  const kok = kurulum();
  for (const tip of ['cevap-alindi', 'cevap-reddedildi']) {
    const r = kos(kok, 'zarf-ekle.sh', [],
      JSON.stringify({ surum: 1, ts: new Date().toISOString(), donem: 'D1', tip, catal: 'Ç-03' }));
    assert.equal(r.status, 0, `${tip} tipi reddedildi — cevabın TEK denetim izi kaybolurdu`);
  }
  const r = kos(kok, 'zarf-ekle.sh', [],
    JSON.stringify({ surum: 1, ts: new Date().toISOString(), donem: 'D1', tip: 'uydurma-tip' }));
  assert.notEqual(r.status, 0, 'beyaz liste açıldı');
});

test('--sayacsiz alarm .haber-durum dosyasına DOKUNMAZ (canlı dönemin sayacı silinmez)', () => {
  const kok = kurulum();
  const durum = join(kok, 'tools', 'sevk', '.haber-durum');
  writeFileSync(durum, 'CANLI-DONEM\ndonem-basladi\n');
  const oncesi = readFileSync(durum, 'utf8');
  // Gönderim ağa çıkamayacağı için exit 1/4 olur; ölçtüğümüz şey dosyaya dokunulmaması.
  kos(kok, 'haber.sh', ['--olay', 'alarm', '--cins', 'cevapsiz', '--sayacsiz',
    '--anahtar', 'esik-XX', '--kutu', 'K', '--detay', 'x']);
  assert.equal(readFileSync(durum, 'utf8'), oncesi,
    '--sayacsiz sayaç dosyasını yeniden yazdı — dönem-dışı bir alarm canlı dönemin frenini siler');
});

// ── 3 · MIME-farkında gövde çözümleyici (bitti ölçütü 8 · hasım bulgusu L5) ───────────────
// Fixture GERÇEK bir iOS Mail yanıtının BODY[TEXT] yapısıdır: çok parçalı + quoted-printable.
// v1'in "alıntıdan önceki ilk boş olmayan satır" kuralı bu girdide sahibin DOĞRU cevabını
// reddediyordu — sınır çizgisi rakamdan önce gelir.
const IOS_YANIT = [
  '--Apple-Mail-9C1B2A3D-4E5F',
  'Content-Transfer-Encoding: quoted-printable',
  'Content-Type: text/plain;',
  '\tcharset=utf-8',
  '',
  '2',
  '',
  '> 30 Tem 2026 22:12 tarihinde KEEL <deneme@ornek.gecersiz> =C5=9Funlar=C4=B1 yazd=C4=B1:',
  '> SORU',
  '--Apple-Mail-9C1B2A3D-4E5F',
  'Content-Type: text/html; charset=utf-8',
  '',
  '<html><body>2</body></html>',
  '--Apple-Mail-9C1B2A3D-4E5F--',
].join('\r\n');

test('gerçek iOS Mail yanıtı (multipart + quoted-printable) doğru çözülür', () => {
  const r = jsKos('CEVAP_JS_SECIM', IOS_YANIT);
  assert.equal(r.stdout.trim(), 'SECIM\t2', 'sahibin doğru cevabı reddedildi (' + r.stdout.trim() + ')');
});

test('base64 gövde ve düz metin gövde de çözülür', () => {
  const b64 = ['Content-Transfer-Encoding: base64', 'Content-Type: text/plain; charset=utf-8', '',
    Buffer.from('3\n\n> alinti\n').toString('base64')].join('\r\n');
  assert.equal(jsKos('CEVAP_JS_SECIM', b64).stdout.trim(), 'SECIM\t3');
  // Düz metin: parça BAŞLIĞI YOKTUR. Koşulsuz "ilk boş satıra kadar atla" kuralı burada
  // sahibin yazdığı rakamı atlıyordu (uygulama sırasında fixture'ın yakaladığı kusur).
  assert.equal(jsKos('CEVAP_JS_SECIM', '1\n\n> alinti\n').stdout.trim(), 'SECIM\t1');
});

test('cevap OLMAYAN gövdeler reddedilir (tatil yanıtı · yalnız alıntı · iki hane · boş)', () => {
  const olumsuz = [
    ['Ofis disindayim, 5 Agustosta donecegim.\n', 'tatil yanıtı'],
    ['> 2\n', 'yalnız alıntı'],
    ['12\n', 'iki haneli'],
    ['', 'boş gövde'],
    ['iki\n', 'yazıyla'],
  ];
  for (const [govde, ad] of olumsuz) {
    const r = jsKos('CEVAP_JS_SECIM', govde);
    assert.match(r.stdout, /^YOK\t/, `${ad} CEVAP SAYILDI — kanal kendi kendine karar basıyor`);
  }
});

test('jeton açıksa rakam TEK BAŞINA yetmez (ikinci etken gövdededir)', () => {
  assert.match(jsKos('CEVAP_JS_SECIM', '2\n', { SEC_JETON: 'gizli' }).stdout, /^YOK\tjeton/);
  assert.equal(jsKos('CEVAP_JS_SECIM', '2 gizli\n', { SEC_JETON: 'gizli' }).stdout.trim(), 'SECIM\t2');
  assert.match(jsKos('CEVAP_JS_SECIM', '2 yanlis\n', { SEC_JETON: 'gizli' }).stdout, /^YOK\tjeton/);
});

// ── 4 · Gönderen kimliği: zarf adresi BİREBİR (hasım bulgusu L17) ─────────────────────────
test('görünen ada yazılmış adres From denetimini GEÇEMEZ', () => {
  const sahte = 'Date: x\nFrom: "deneme@ornek.gecersiz" <saldirgan@kotu.com>\n';
  assert.equal(jsKos('CEVAP_JS_ADRES', sahte).stdout.trim(), 'saldirgan@kotu.com',
    'görünen ad zarf adresi sanıldı — alt-dize denetimi sahteciliği geçirirdi');
  assert.equal(jsKos('CEVAP_JS_ADRES', 'From: Batu <Deneme@Ornek.Gecersiz>\n').stdout.trim(),
    'deneme@ornek.gecersiz', 'meşru gönderen tanınmıyor (büyük/küçük harf)');
});

// ── 5 · Çapa: fail-closed okuma (hasım bulgusu L11) ───────────────────────────────────────
test('bozuk çapa "açık kod yok" ile AYNI dala düşmez (fail-closed)', () => {
  const kok = kurulum();
  const capa = join(kok, 'tools', 'sevk', '.cevap-capa');
  writeFileSync(capa, '{"kod":"AAA","durum":"acik","ts":"' + new Date().toISOString() + '"}\n{ yarim satir\n');
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', jsCikar('CEVAP_JS_OKU')],
    { encoding: 'utf8', env: { ...process.env, CAPA_YOL: capa } });
  assert.equal(r.status, 1, 'bozuk çapa sessizce "kod yok" sayıldı — sahibin sorusu kaybolurdu');
});

test('açık kodlar yaşıyla birlikte dökülür; tüketilmiş kod dökülmez', () => {
  const kok = kurulum();
  const capa = join(kok, 'tools', 'sevk', '.cevap-capa');
  const eski = new Date(Date.now() - 30 * 3600000).toISOString();
  writeFileSync(capa,
    JSON.stringify({ kod: 'AAAA1111', msgid: '<keel-AAAA1111@x.y>', catal: 'Ç-01', donem: 'D1', kutu: 'K',
      ts: eski, secenekler: ['bir', 'iki'], durum: 'acik', bicimsiz: 0, gorulen: [], alarm: '' }) + '\n' +
    JSON.stringify({ kod: 'BBBB2222', msgid: '<keel-BBBB2222@x.y>', catal: 'Ç-02', ts: eski, durum: 'tuketildi' }) + '\n');
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', jsCikar('CEVAP_JS_OKU')],
    { encoding: 'utf8', env: { ...process.env, CAPA_YOL: capa } });
  assert.equal(r.status, 0, r.stderr);
  const satirlar = r.stdout.trim().split('\n');
  assert.equal(satirlar.length, 1, 'tüketilmiş kod hâlâ aranıyor');
  const a = satirlar[0].split(String.fromCharCode(30));
  assert.equal(a.length, 10, 'alan sayısı sözleşmeden farklı: ' + a.length);
  assert.equal(a[0], 'AAAA1111');
  assert.ok(Number(a[5]) >= 29, 'yaş saati yanlış hesaplandı: ' + a[5]);
  assert.equal(a[8], 'biriki', 'seçenek metinleri taşınmıyor — cevap uygulanamaz');
});

// ── 6 · Kuyruğa yazan TEK betik: --cevapla (bitti ölçütü 9-10 · hasım bulgusu L6/L7) ──────
test('geçerli cevap uygulanır ve --durum CEVAPLANDI okur', () => {
  const kok = kurulum();
  kuyrukKur(kok, [ACIK('Ç-01')]);
  const r = kos(kok, 'catal-kuyruk.sh', ['--cevapla', 'Ç-01', 'Yenisine geç', 'uzaktan-posta uid:1841']);
  assert.equal(r.stdout.trim(), 'CEVAPLANDI\tÇ-01', r.stdout + r.stderr);
  const d = kos(kok, 'catal-kuyruk.sh', ['--durum']).stdout;
  assert.match(d, /Ç-01\tCEVAPLANDI/, 'yazıldı ama cevap sayılmıyor');
  assert.match(readFileSync(KUYRUK(kok), 'utf8'), /uzaktan-posta uid:1841/, 'kaynak izi yok');
});

test('yapı işareti taşıyan seçenek metni KALICI KİLİT üretmez (v1 kusuru)', () => {
  // Hasım turunun canlı ölçtüğü senaryo: tırnaklı/ayraçlı bir seçenek metni kuyruk
  // ayrıştırıcısını "boş cevap"a düşürüyor, kod tükeniyor, iş sonsuza dek kilitli kalıyordu.
  const kok = kurulum();
  kuyrukKur(kok, [ACIK('Ç-01')]);
  const r = kos(kok, 'catal-kuyruk.sh', ['--cevapla', 'Ç-01', '"kalın" modda · bırak · cevap: evet', 'uzaktan-posta uid:9']);
  assert.equal(r.stdout.trim(), 'CEVAPLANDI\tÇ-01', r.stdout + r.stderr);
  assert.match(kos(kok, 'catal-kuyruk.sh', ['--durum']).stdout, /Ç-01\tCEVAPLANDI/);
});

test('"anlamadım" sınıfı seçenek metni yazılmaz (ARIZA — kod tüketilmez)', () => {
  const kok = kurulum();
  kuyrukKur(kok, [ACIK('Ç-01')]);
  const r = kos(kok, 'catal-kuyruk.sh', ['--cevapla', 'Ç-01', 'Ne demek istediğini sor', 'uzaktan-posta uid:9']);
  assert.match(r.stdout, /^ARIZA\t/, 'çeviri kusuru okutacak metin yazıldı — kilit hiç açılmazdı');
  assert.match(kos(kok, 'catal-kuyruk.sh', ['--durum']).stdout, /Ç-01\tCEVAP-BEKLIYOR/);
});

test('cevaplanmış · devretmiş · olmayan madde: yazma YOK (ATLANDI)', () => {
  const kok = kurulum();
  kuyrukKur(kok, [
    ACIK('Ç-01').replace('- [ ]', '- [x]') + ' · cevap: "sahibin kendi cevabı" · 2026-07-30',
    ACIK('Ç-02') + ' · devretti: Ç-03',
    ACIK('Ç-03'),
  ]);
  const oncesi = readFileSync(KUYRUK(kok), 'utf8');
  for (const id of ['Ç-01', 'Ç-02', 'Ç-99']) {
    const r = kos(kok, 'catal-kuyruk.sh', ['--cevapla', id, 'baska bir yol', 'uzaktan-posta uid:9']);
    assert.match(r.stdout, /^ATLANDI\t/, `${id} için yazma yapıldı`);
  }
  assert.equal(readFileSync(KUYRUK(kok), 'utf8'), oncesi,
    'kuyruk değişti — sahibin KENDİ cevabı yapının metniyle ezilebilirdi (D-21 ihlali)');
});

test('geçersiz argümanlar fail-closed (kimlik · boş metin · imzada yapı işareti)', () => {
  const kok = kurulum();
  kuyrukKur(kok, [ACIK('Ç-01')]);
  const kotu = [['G-01', 'x', 'imza'], ['Ç-01', '', 'imza'], ['Ç-01', 'x', 'imza · cevap: evet'], ['Ç-01', 'x', '']];
  for (const a of kotu) {
    assert.notEqual(kos(kok, 'catal-kuyruk.sh', ['--cevapla', ...a]).status, 0,
      'geçersiz argüman kabul edildi: ' + JSON.stringify(a));
  }
});

// ── 7 · Sözlük tek evde (D-02) ────────────────────────────────────────────────────────────
test('cevap sözlüğü yoksa --durum FAIL-CLOSED durur ("anlamadım" tanınamaz)', () => {
  const kok = kurulum();
  kuyrukKur(kok, [ACIK('Ç-01')]);
  spawnSync('rm', ['-f', join(kok, 'tools', 'sevk', 'cevap-sozlugu.txt')]);
  const r = kos(kok, 'catal-kuyruk.sh', ['--durum']);
  assert.notEqual(r.status, 0, 'sözlüksüz koştu — "anlamadım" cevap sayılır ve kilit yanlış açılır');
});

test('sözlük TEK evdedir: kapı ve kuyruk aynı dosyayı okur', () => {
  const kapi = readFileSync(join(KOK_REPO, 'tools', 'sevk', 'zarf-bicim-kapisi.sh'), 'utf8');
  const kuyruk = readFileSync(join(KOK_REPO, 'tools', 'sevk', 'catal-kuyruk.sh'), 'utf8');
  assert.match(kapi, /KAPI_SOZLUK/, 'biçim kapısı sözlüğü okumuyor');
  assert.match(kuyruk, /cevap-sozlugu\.txt/, 'kuyruk sözlüğü okumuyor');
  for (const s of [kapi, kuyruk]) {
    assert.ok(!/anlam[ıi]yorum"/.test(s), 'sözlük listesi koda geri kopyalanmış (D-02 ihlali)');
  }
});

// ── 8 · Geri uyum: kanal kapalıyken hiçbir şey değişmez (bitti ölçütü 12) ─────────────────
test('CEVAP_KANALI boşken kanal KAPALI sayılır; tanınmayan değer de AÇMAZ', () => {
  const oku = (deger) => {
    const kok = kurulum({ cevapKanali: deger });
    const r = spawnSync('bash', ['-c',
      `. "${join(kok, 'tools', 'sevk', 'ortak.sh')}"; kanal_oku "${kok}" >/dev/null 2>&1; printf '%s' "$KANAL_CEVAP_KANALI"`],
      { encoding: 'utf8' });
    return r.stdout;
  };
  assert.equal(oku(''), '', 'boş alan kanalı açtı');
  assert.equal(oku('evet'), '', 'tanınmayan değer kanalı açtı — yazım hatası karar kanalı açardı');
  assert.equal(oku('1'), '', 'tanınmayan değer kanalı açtı');
  assert.equal(oku('acik'), 'acik', 'açık kanal tanınmıyor');
});

// ── 9 · DUR hattının onarımı (bitti ölçütü 1 · §0.1) ──────────────────────────────────────
test('nabız IMAP aramaları UID SEARCH kullanır (düz SEARCH sıra numarası döndürür)', () => {
  const s = readFileSync(join(KOK_REPO, 'tools', 'sevk', 'nabiz.sh'), 'utf8');
  // ÜÇ ÜRETİCİ ayrı ayrı taranır. Eskiden yalnız `request = "…"` literalleri taranıyordu;
  // U27 onarımı DUR aramasını bir DEĞİŞKENE taşıyınca ölçüm HİÇBİR ŞEY görmez oldu. Kapıyı
  // sessiz yeşile döndürmeyen tek şey sayı çapasıydı (ölçüldü, K11) — çapa bu yüzden kalıyor
  // ve üretici listesi genişliyor: bir kapının KÖR KİPİ, kapının kendisinden tehlikelidir.
  const uretilen = [
    ...[...s.matchAll(/imap_ara "([^"]*)"/g)].map((m) => m[1]),
    ...[...s.matchAll(/^\s*DUR_ARAMA="([^"$]*)"/gm)].map((m) => m[1]),
    ...[...s.matchAll(/request = "([^"]*SEARCH[^"]*)"/g)].map((m) => m[1]),
  ];
  assert.ok(uretilen.length >= 3, `IMAP arama üreticisi bulunamadı (${uretilen.length}) — çapa kaydı`);
  for (const a of uretilen) {
    assert.match(a, /^UID SEARCH/,
      `düz SEARCH kullanılıyor (${a}) — dönen SIRA numarası ;UID= olarak verilirse YANLIŞ mesaj çekilir`);
  }
});

test('cevap bloğu dönem kapısının ÖNÜNDEDİR (kapanmış dönemde de koşar)', () => {
  const s = readFileSync(join(KOK_REPO, 'tools', 'sevk', 'nabiz.sh'), 'utf8');
  const cevap = s.indexOf('cevap_hatti\n');
  const donemKapisi = s.indexOf('DONEM_RC=0; donem_oku');
  assert.ok(cevap > 0 && donemKapisi > 0, 'çağrılar bulunamadı');
  assert.ok(cevap < donemKapisi,
    'cevap hattı dönem dalının ARKASINDA — dönem kapandığında hiç koşmaz, yani tam da var oluş sebebindeki durumda çalışmaz');
});

// ── 10 · Koruma: çapa dikişi hem ön-elemede hem kararda (hasım bulgusu) ───────────────────
test('.cevap-capa hem ön-eleme listesinde hem dikişte var (biri eksikse dikiş hiç koşmaz)', () => {
  const s = readFileSync(join(KOK_REPO, 'tools', 'guard', 'file-guard.sh'), 'utf8');
  assert.match(s, /\*'\.cevap-'\*/, 'ön-eleme listesinde yok — dikiş HİÇ koşmaz (sessiz delik)');
  assert.match(s, /komut\.includes\("\.cevap-capa"\)/, 'dikiş kararı yok');
});


// ══ 11 · KOD ÜRETECİ GERÇEKTEN KOŞUYOR (hasım bulgusu: yedi kasıtlı bozma 669/669 yeşil bıraktı)
// Önceki hâlde bu bölüm YOKTU: nabız hattı ve KOD_JS hiçbir testte koşmuyordu, dolayısıyla
// kanalın canlıda ölü olduğu (msgid çapaya hiç yazılmıyordu) ölçülemiyordu.
function kodJs() {
  const s = readFileSync(join(KOK_REPO, 'tools', 'sevk', 'zarf-bicim-kapisi.sh'), 'utf8');
  const i = s.indexOf("KOD_JS='") + "KOD_JS='".length;
  return s.slice(i, s.indexOf("\n'\n", i));
}
function kodUret(kok, { uzaktan = 'uygun', secenekler = '1) Yerinde kal 2) Yenisine geç',
                        sinif = 'is', catal = 'dolu', kod = 'R4T7QM2F',
                        msgid = '<keel-R4T7QM2F@ornek.gecersiz>', ekKayit = null } = {}) {
  const gy = join(kok, '00_pano', 'zarf-gunlugu.jsonl');
  const satirlar = [
    { surum: 1, ts: new Date().toISOString(), donem: 'D1', tip: 'zarf', gorev: 'G-07', ajan: 'po',
      sinif, alanlar: { catal, ceviri: 'Hangisi?', etki: 'x', bekletir: 'G-12', secenekler } },
    { surum: 1, ts: new Date().toISOString(), donem: 'D1', tip: 'catal-suzgec', gorev: 'G-07',
      ajan: 'catal-denetcisi', hukum: 'GECTI', uzaktan },
  ];
  if (ekKayit) satirlar.push(ekKayit);
  writeFileSync(gy, satirlar.map((j) => JSON.stringify(j)).join('\n') + '\n');
  return spawnSync(process.execPath, ['--input-type=module', '-e', kodJs()], {
    encoding: 'utf8',
    env: { ...process.env, C_GUNLUK: gy, C_CAPA: join(kok, 'tools', 'sevk', '.cevap-capa'),
           C_GOREV: 'G-07', C_CATAL: 'Ç-03', C_DONEM: 'D1', C_KUTU: 'KT-001', C_KOD: kod, C_MSGID: msgid },
  });
}
const capaOku = (kok) => {
  const y = join(kok, 'tools', 'sevk', '.cevap-capa');
  return existsSync(y) ? readFileSync(y, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)) : [];
};

test('kod üreteci çapaya msgid YAZAR (yazmazsa kanal canlıda ölüdür)', () => {
  const kok = kurulum();
  const r = kodUret(kok);
  assert.equal(r.status, 0, r.stderr);
  const k = capaOku(kok);
  assert.equal(k.length, 1, 'çapaya kayıt düşmedi: ' + r.stdout + r.stderr);
  assert.equal(k[0].msgid, '<keel-R4T7QM2F@ornek.gecersiz>',
    'msgid çapada YOK — nabız boş dizeyle arar ve hiçbir cevap eşleşmez');
  assert.deepEqual(k[0].secenekler, ['Yerinde kal', 'Yenisine geç']);
  assert.equal(k[0].durum, 'acik');
});

test('kod üretiminin şartları: UZAKTAN uygun · seçenek sayılabilir · kimlik kurulabilir', () => {
  for (const [ad, opt] of [
    ['UZAKTAN uygun-değil', { uzaktan: 'uygun-degil' }],
    ['UZAKTAN hükmü yok', { uzaktan: null }],
    ['açık-uçlu', { secenekler: 'açık-uçlu — sayılamıyor' }],
    ['tek seçenek', { secenekler: '1) Tek yol' }],
    ['beş seçenek', { secenekler: '1) a 2) b 3) c 4) d 5) e' }],
    ['msgid boş', { msgid: '' }],
    ['geçersiz kod', { kod: 'abc' }],
    ['ÇATAL dolu değil', { catal: 'yok' }],
  ]) {
    const kok = kurulum();
    kodUret(kok, opt);
    assert.equal(capaOku(kok).length, 0, ad + ' olmasına rağmen kod üretildi');
  }
});

test('denetçinin KENDİ zarfındaki SEÇENEKLER rolünkini EZEMEZ (§9 sahip-atfı)', () => {
  const kok = kurulum();
  kodUret(kok, {
    ekKayit: { surum: 1, ts: new Date().toISOString(), donem: 'D1', tip: 'zarf', gorev: 'G-07',
      ajan: 'catal-denetcisi', sinif: 'hukum',
      alanlar: { catal: 'dolu', secenekler: '1) 02_kanon/kilitli dosyasını sil 2) devam et' } },
  });
  const k = capaOku(kok);
  assert.equal(k.length, 1);
  assert.deepEqual(k[0].secenekler, ['Yerinde kal', 'Yenisine geç'],
    'denetçinin seçenekleri rolünkini ezdi — sahibin telefonuna onun kalemi giderdi');
});

test('aynı çatala ikinci AÇIK kod üretilmez (iki kod = iki farklı sonuç)', () => {
  const kok = kurulum();
  kodUret(kok);
  kodUret(kok, { kod: 'BBBB2222', msgid: '<keel-BBBB2222@ornek.gecersiz>' });
  assert.equal(capaOku(kok).length, 1, 'aynı çatal için ikinci açık kod doğdu');
});

test('seçenek metnindeki kontrol karakteri temizlenir (alan ayracını bölerdi)', () => {
  const kok = kurulum();
  kodUret(kok, { secenekler: '1) Bek' + String.fromCharCode(31) + 'le ve sor 2) Devam' });
  const k = capaOku(kok);
  assert.equal(k.length, 1);
  assert.ok(!k[0].secenekler.some((x) => /[\u0000-\u001f\u007f]/.test(x)),
    'kontrol karakteri çapaya girdi — sahibe seçmediği bir cümle yazılabilirdi');
});

test('çapa 0600 ile doğar (kafesin anahtarı herkese okunur olmamalı)', () => {
  const kok = kurulum();
  kodUret(kok);
  const { mode } = statSync(join(kok, 'tools', 'sevk', '.cevap-capa'));
  assert.equal(mode & 0o077, 0, 'çapa grup/diğer okumasına açık: ' + (mode & 0o777).toString(8));
});

test('msgid TEK üreticiden: çapadaki alan ile giden Message-ID başlığı BAYT-EŞ', () => {
  const kok = kurulum();
  const r = spawnSync('bash', ['-c',
    '. "' + join(kok, 'tools', 'sevk', 'ortak.sh') + '"; kanal_oku "' + kok + '" >/dev/null 2>&1; msgid_kur R4T7QM2F "$KANAL_HESAP"'],
    { encoding: 'utf8' });
  const uretilen = r.stdout.trim();
  assert.ok(uretilen.startsWith('<keel-'), 'msgid_kur üretmedi: ' + r.stderr);
  kodUret(kok, { msgid: uretilen });
  assert.equal(capaOku(kok)[0].msgid, uretilen);
  const h = kos(kok, 'haber.sh', ['--prova', '--olay', 'catal-bekliyor', '--kutu', 'K', '--catal', 'Ç-03',
    '--ceviri', 'x', '--etki', 'x', '--bekletir', 'G-1', '--kod', 'R4T7QM2F', '--secenekler', '1) a\n2) b']);
  assert.ok(h.stdout.includes('Message-ID: ' + uretilen),
    'giden başlık ile çapadaki kimlik ayrışmış — iki uç sürüklendi (bitti ölçütü 5)');
});

test('bozuk alan adı Message-ID kurdurmaz (kod üretilmez, fail-closed)', () => {
  for (const hesap of ['batu', 'a@b c', 'a@b"c', 'a@']) {
    const r = spawnSync('bash', ['-c',
      '. "' + join(KOK_REPO, 'tools', 'sevk', 'ortak.sh') + "\"; msgid_kur R4T7QM2F '" + hesap + "'"], { encoding: 'utf8' });
    assert.notEqual(r.status, 0, 'bozuk alan adı kabul edildi: ' + hesap);
  }
});

// ══ 12 · Alan sözleşmesi: boş alan sütunları KAYDIRMAZ (yedi mercek buldu) ════════════════
test('çapa okuması boş alanları KORUR (sekme IFS-boşluğudur, 0x1e değildir)', () => {
  const kok = kurulum();
  kodUret(kok);   // taze kayıtta alarm="" ve gorulen=[] — İKİ boş alan
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', jsCikar('CEVAP_JS_OKU')],
    { encoding: 'utf8', env: { ...process.env, CAPA_YOL: join(kok, 'tools', 'sevk', '.cevap-capa') } });
  assert.equal(r.status, 0, r.stderr);
  // Kabuğun KENDİ okuma sözleşmesiyle ayrıştırılır — testin kendi ayrıştırıcısıyla değil.
  const b = spawnSync('bash', ['-c',
    'IFS=$\'\\036\' read -r KOD MSGID CATAL D KUTU YAS ALARM BIC SEC GOR; ' +
    'printf "%s|%s|%s|%s|%s" "$KOD" "$MSGID" "$ALARM" "$BIC" "$SEC"'],
    { encoding: 'utf8', input: r.stdout });
  const [kod, msgid, alarm, bic, sec] = b.stdout.split('|');
  assert.equal(kod, 'R4T7QM2F');
  assert.equal(msgid, '<keel-R4T7QM2F@ornek.gecersiz>', 'msgid sütunu kaydı');
  assert.equal(alarm, '', 'boş alarm alanı yutuldu — sütunlar kayıyor');
  assert.equal(bic, '0', 'bicimsiz sütunu kaydı');
  assert.equal(sec.split(String.fromCharCode(31))[1], 'Yenisine geç',
    'seçenek listesi kayboldu — sahibin doğru cevabı "listede yok" sayılırdı');
});

test('msgid taşımayan çapa satırı DÖKÜLMEZ (boş anahtarla arama yapılmaz)', () => {
  const kok = kurulum();
  writeFileSync(join(kok, 'tools', 'sevk', '.cevap-capa'),
    JSON.stringify({ kod: 'AAAA1111', catal: 'Ç-01', ts: new Date().toISOString(), durum: 'acik' }) + '\n');
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', jsCikar('CEVAP_JS_OKU')],
    { encoding: 'utf8', env: { ...process.env, CAPA_YOL: join(kok, 'tools', 'sevk', '.cevap-capa') } });
  assert.equal(r.stdout.trim(), '', 'kimlik çapasız kod arama listesine girdi');
});

// ══ 13 · Adres ayrıştırma: iki kat derin sahtecilik ═══════════════════════════════════════
test('görünen adın İÇİNDEKİ açı parantez kimlik kapısını GEÇEMEZ', () => {
  const r = jsKos('CEVAP_JS_ADRES', 'From: "Batu <sahip@ornek.gecersiz>" <saldirgan@kotu.com>\n');
  assert.equal(r.stdout.trim(), 'saldirgan@kotu.com',
    'ilk <...> alındı — gerçek zarf adresi saldırganınken kapı sahibin adresini görüyordu');
});

test('katlanmış From başlığı doğru okunur (sahibin kendi cevabı sahtecilik sanılmasın)', () => {
  assert.equal(jsKos('CEVAP_JS_ADRES', 'From: Batu\n <sahip@ornek.gecersiz>\nDate: x\n').stdout.trim(),
    'sahip@ornek.gecersiz');
});

// ══ 14 · İç içe MIME (olağan telefon yanıtı: mixed > alternative > plain+html) ════════════
test('iç içe MIME yanıtında EN İÇTEKİ text/plain seçilir', () => {
  const ic = ['--000_ALT_X', 'Content-Transfer-Encoding: quoted-printable',
    'Content-Type: text/plain; charset=utf-8', '', '2', '', '> alinti',
    '--000_ALT_X', 'Content-Type: text/html; charset=utf-8', '', '<html>2</html>', '--000_ALT_X--'].join('\r\n');
  const dis = ['--000_MIX_Y', 'Content-Type: multipart/alternative; boundary="000_ALT_X"', '', ic,
    '--000_MIX_Y', 'Content-Type: image/png; name=imza.png', 'Content-Transfer-Encoding: base64', '',
    'iVBORw0KGgo=', '--000_MIX_Y--'].join('\r\n');
  assert.equal(jsKos('CEVAP_JS_SECIM', dis).stdout.trim(), 'SECIM\t2',
    'imzasında resim olan olağan bir yanıtta geçerli cevap reddediliyor');
});

// ══ 15 · Sır sızıntısı ve geri uyum ══════════════════════════════════════════════════════
test('haber.sh çağrısı hata verse de KOD günlüğe yazılmaz; kanal-kurulu-değil sahte bulgu üretmez', () => {
  const kok = kurulum();
  const r = spawnSync('bash', ['-c',
    '. "' + join(kok, 'tools', 'sevk', 'ortak.sh') + '"; CLAUDE_PROJECT_DIR="' + kok + '" haber_at ' +
    '--olay catal-bekliyor --kutu K --catal Ç-03 --ceviri x --etki x --bekletir G-1 ' +
    "--kod R4T7QM2F --secenekler '1) a'"],
    { encoding: 'utf8', env: { ...process.env, CLAUDE_PROJECT_DIR: kok } });
  const gy = join(kok, '00_pano', 'zarf-gunlugu.jsonl');
  const icerik = existsSync(gy) ? readFileSync(gy, 'utf8') : '';
  assert.ok(!icerik.includes('R4T7QM2F'), 'cevap kodu günlüğe düz metin olarak sızdı');
  assert.ok(!icerik.includes('haber-cagrisi-gecersiz'),
    'kanal KURULU DEĞİL hâli program hatası sayıldı — kanalı hiç kurmamış proje sahte bulgu görür');
  assert.equal(r.status, 2, 'kanal kurulu değil ayrı çıkış kodu almalı (exit 2), gelen: ' + r.status);
});

test('--sayacsiz alarm .haber-durum dosyasına YAZMAZ da (okumayı atlamak yetmez)', () => {
  const kok = kurulum();
  const durum = join(kok, 'tools', 'sevk', '.haber-durum');
  writeFileSync(durum, 'CANLI-DONEM\ndonem-basladi\n');
  // Gerçek gönderim dalına ulaşmak için sahte curl + security PATH'e konur (ağa çıkılmaz).
  const bin = join(kok, 'sahte-bin');
  mkdirSync(bin, { recursive: true });
  // BOŞ yapılandırmaya 0 DÖNMEZ (hasım bulgusu): gerçek curl "no URL specified" der ve 2
  // döner; her şeye 0 diyen bir taşıyıcı fail-closed dalını "gönderildi" gösterirdi.
  writeFileSync(join(bin, 'curl'),
    '#!/bin/bash\nYAP="$(cat)"\ncase "$YAP" in *"url = "*) exit 0 ;; esac\n' +
    'printf "curl: (2) no URL specified\\n" >&2\nexit 2\n');
  writeFileSync(join(bin, 'security'), '#!/bin/bash\nprintf "parola\\n"\n');
  for (const f of ['curl', 'security']) chmodSync(join(bin, f), 0o755);
  const r = spawnSync('bash', [join(kok, 'tools', 'sevk', 'haber.sh'), '--olay', 'alarm', '--cins', 'cevapsiz',
    '--sayacsiz', '--anahtar', 'esik-C3', '--kutu', 'K', '--detay', 'x'],
    { encoding: 'utf8', env: { ...process.env, CLAUDE_PROJECT_DIR: kok, PATH: bin + ':' + process.env.PATH } });
  assert.equal(r.status, 0, 'sahte gönderim başarısız: ' + r.stderr);
  assert.equal(readFileSync(durum, 'utf8'), 'CANLI-DONEM\ndonem-basladi\n',
    '--sayacsiz sayaç dosyasına YAZDI — dönem-dışı alarmlar canlı dönemin kotasını yer');
});


// ══ 16 · KAPALI DEVRE: kod üret → posta → sahte IMAP → nabız → kuyruk → sevk görevi AÇAR ═══
// Bitti ölçütü 13. Hasım turu bunun HİÇ koşulmadığını gösterdi: paketin en büyük iddiası
// ("cevap gelince kilitli işler açılır") iki ayrı, elle yazılmış satıra dayanıyordu.
// Ağa çıkılmaz: PATH'e sahte curl + security konur.
function sahteImap(kok, { msgid, govde, from = 'deneme@ornek.gecersiz', uid = '1841', ek = '' }) {
  const bin = join(kok, 'sahte-bin');
  mkdirSync(bin, { recursive: true });
  const g = join(kok, 'sahte-govde.txt');
  writeFileSync(g, govde);
  // Sahte curl IMAP: SEARCH → UID · HEADER.FIELDS → başlıklar · SECTION=TEXT → gövde.
  // TAŞIYICI `-K` KAÇIŞLARINI ÇÖZER (U71 regresyonu bunu zorunlu kıldı): eski hâli HAM
  // yapılandırma metninde alt-dize arıyordu, yani çift kaçırılmış bir arama dizesi bile
  // eşleşiyordu ve kanal ölürken test YEŞİL kalıyordu. Artık curl'ün kendi ayrıştırıcısı
  // taklit ediliyor ve IMAP dizesi TAM eşleşiyor — tek fazladan ters bölü testi kırar.
  writeFileSync(join(bin, 'curl'), [
    '#!' + process.execPath,
    'const fs = require("fs");',
    'const yap = fs.readFileSync(0, "utf8");',
    'const coz = (x) => x.replace(/\\\\(.)/g, (_, k) => ({ n: "\\n", r: "\\r", t: "\\t", v: "\\v" }[k] || k));',
    'const al = (a) => { const m = yap.match(new RegExp("^" + a + " = \\"((?:[^\\"\\\\\\\\]|\\\\\\\\.)*)\\"", "m")); return m ? coz(m[1]) : null; };',
    'const url = al("url"), req = al("request");',
    'if (url === null) { process.stderr.write("curl: (2) no URL specified"); process.exit(2); }',
    'const ARANAN = ' + JSON.stringify('UID SEARCH HEADER In-Reply-To "' + msgid + '"') + ';',
    'const ARANAN2 = ' + JSON.stringify('UID SEARCH HEADER References "' + msgid + '"') + ';',
    'if (req === ARANAN || req === ARANAN2) process.stdout.write("* SEARCH ' + uid + '\\r\\n");',
    'else if (/HEADER\\.FIELDS/.test(url)) process.stdout.write(' +
      JSON.stringify('From: ' + from + '\r\nDate: Thu, 30 Jul 2026 22:12:00 +0300\r\nIn-Reply-To: ' + msgid + '\r\n' + ek + '\r\n') + ');',
    'else if (/SECTION=TEXT/.test(url)) process.stdout.write(fs.readFileSync(' + JSON.stringify(g) + ', "utf8"));',
    'process.exit(0);',
  ].join('\n'));
  writeFileSync(join(bin, 'security'), '#!/bin/bash\nprintf "parola\\n"\n');
  for (const f of ['curl', 'security']) chmodSync(join(bin, f), 0o755);
  return bin;
}

test('KAPALI DEVRE: telefondan gelen "2" kuyruğa düşer ve sevk BEKLETİR görevini AÇAR', () => {
  const kok = kurulum();
  // (1) Kod üreteci gerçek çapayı yazar (elle fixture YOK — bu, testin kendi dünyasını
  //     doğrulamasını engelleyen tek şey; sıra 5'in dersi).
  const msgid = spawnSync('bash', ['-c',
    '. "' + join(kok, 'tools', 'sevk', 'ortak.sh') + '"; msgid_kur R4T7QM2F deneme@ornek.gecersiz'],
    { encoding: 'utf8' }).stdout.trim();
  kodUret(kok, { msgid });
  const capa0 = capaOku(kok);
  assert.equal(capa0.length, 1, 'kod üretilmedi');
  assert.equal(capa0[0].msgid, msgid);

  // (2) Kuyrukta o çatal açık ve G-12'yi bekletiyor.
  kuyrukKur(kok, [ACIK('Ç-03', 'G-12')]);
  assert.match(kos(kok, 'catal-kuyruk.sh', ['--durum']).stdout, /Ç-03\tCEVAP-BEKLIYOR\tG-12/);

  // (3) Sahibin telefonundan gerçek bir yanıt gelir (multipart + quoted-printable).
  const yanit = ['--Apple-Mail-1', 'Content-Transfer-Encoding: quoted-printable',
    'Content-Type: text/plain; charset=utf-8', '', '2', '', '> alinti', '--Apple-Mail-1--'].join('\r\n');
  const bin = sahteImap(kok, { msgid, govde: yanit });
  const r = spawnSync('bash', [join(kok, 'tools', 'sevk', 'nabiz.sh')],
    { encoding: 'utf8', env: { ...process.env, CLAUDE_PROJECT_DIR: kok, PATH: bin + ':' + process.env.PATH } });
  assert.equal(r.status, 0, 'nabız hata verdi: ' + r.stderr);

  // (4) Kuyruk artık CEVAPLANDI okuyor ve yazılan cümle YAPININ kendi seçeneği.
  const durum = kos(kok, 'catal-kuyruk.sh', ['--durum']).stdout;
  assert.match(durum, /Ç-03\tCEVAPLANDI/,
    'cevap uygulanmadı — kanal uçtan uca çalışmıyor. Kuyruk: ' + readFileSync(KUYRUK(kok), 'utf8'));
  assert.match(readFileSync(KUYRUK(kok), 'utf8'), /cevap: "Yenisine geç"/,
    'kuyruğa yapının kendi seçenek metni yazılmadı');
  assert.match(readFileSync(KUYRUK(kok), 'utf8'), /uzaktan-posta uid:1841/, 'kaynak izi yok');

  // (5) Kod tüketildi (aynı posta ikinci kez uygulanamaz) ve günlükte kod GEÇMİYOR.
  assert.equal(capaOku(kok)[0].durum, 'tuketildi', 'kod tüketilmedi — tekrar uygulanabilir');
  const gunluk = readFileSync(join(kok, '00_pano', 'zarf-gunlugu.jsonl'), 'utf8');
  assert.match(gunluk, /"tip":"cevap-alindi"/, 'cevabın denetim izi düşmedi');
  assert.ok(!gunluk.includes('R4T7QM2F'), 'cevap kodu (sır) günlüğe sızdı');

  // (6) ASIL İDDİA: sevk artık G-12'yi kilitli saymıyor.
  const kilitli = kos(kok, 'catal-kuyruk.sh', ['--durum']).stdout
    .split('\n').filter((l) => /CEVAP-BEKLIYOR|CEVIRI-KUSURU|COZULEMEDI/.test(l));
  assert.equal(kilitli.length, 0,
    'çatal hâlâ kilit üretiyor — cevap geldiği hâlde BEKLETİR görevleri açılmaz: ' + kilitli.join(' | '));
});

test('KAPALI DEVRE negatifi: yanlış gönderenden gelen aynı cevap UYGULANMAZ', () => {
  const kok = kurulum();
  const msgid = spawnSync('bash', ['-c',
    '. "' + join(kok, 'tools', 'sevk', 'ortak.sh') + '"; msgid_kur R4T7QM2F deneme@ornek.gecersiz'],
    { encoding: 'utf8' }).stdout.trim();
  kodUret(kok, { msgid });
  kuyrukKur(kok, [ACIK('Ç-03', 'G-12')]);
  const bin = sahteImap(kok, { msgid, govde: '2\r\n', from: 'saldirgan@kotu.com' });
  spawnSync('bash', [join(kok, 'tools', 'sevk', 'nabiz.sh')],
    { encoding: 'utf8', env: { ...process.env, CLAUDE_PROJECT_DIR: kok, PATH: bin + ':' + process.env.PATH } });
  assert.match(kos(kok, 'catal-kuyruk.sh', ['--durum']).stdout, /Ç-03\tCEVAP-BEKLIYOR/,
    'yanlış gönderenden gelen cevap uygulandı');
  assert.equal(capaOku(kok)[0].durum, 'acik', 'kod tüketildi — sahibin gerçek cevabı artık işlemez');
  assert.match(readFileSync(join(kok, '00_pano', 'zarf-gunlugu.jsonl'), 'utf8'), /"tip":"cevap-reddedildi"/);
});

test('KAPALI DEVRE negatifi: tatil yanıtı kodu YAKMAZ (aynı UID iki turda bir kez sayılır)', () => {
  const kok = kurulum();
  const msgid = spawnSync('bash', ['-c',
    '. "' + join(kok, 'tools', 'sevk', 'ortak.sh') + '"; msgid_kur R4T7QM2F deneme@ornek.gecersiz'],
    { encoding: 'utf8' }).stdout.trim();
  kodUret(kok, { msgid });
  kuyrukKur(kok, [ACIK('Ç-03', 'G-12')]);
  // Çözülemeyen gövde: aynı ileti üç turda yeniden bulunur. Sayaç TUR başına artsaydı kod düşerdi.
  const bin = sahteImap(kok, { msgid, govde: 'Tamamdir, ikinci secenek olsun.\r\n' });
  for (let i = 0; i < 3; i++) {
    spawnSync('bash', [join(kok, 'tools', 'sevk', 'nabiz.sh')],
      { encoding: 'utf8', env: { ...process.env, CLAUDE_PROJECT_DIR: kok, PATH: bin + ':' + process.env.PATH } });
  }
  const k = capaOku(kok)[0];
  assert.equal(k.durum, 'acik',
    'tek okunamayan yanıt kodu düşürdü — sahip hiçbir şey yapmadan uzaktan cevap yolu kapanır');
  assert.equal(k.bicimsiz, 1, 'sayaç TUR başına arttı (beklenen: UID başına bir), gelen: ' + k.bicimsiz);
});

test('KAPALI DEVRE negatifi: Auto-Submitted:no taşıyan GEÇERLİ cevap yine uygulanır', () => {
  const kok = kurulum();
  const msgid = spawnSync('bash', ['-c',
    '. "' + join(kok, 'tools', 'sevk', 'ortak.sh') + '"; msgid_kur R4T7QM2F deneme@ornek.gecersiz'],
    { encoding: 'utf8' }).stdout.trim();
  kodUret(kok, { msgid });
  kuyrukKur(kok, [ACIK('Ç-03', 'G-12')]);
  // RFC 3834: "no" = bu ileti otomatik DEĞİLDİR. Alt-dize eşleşmesi onu da eliyordu.
  const bin = sahteImap(kok, { msgid, govde: '1\r\n', ek: 'Auto-Submitted: no\\r\\n' });
  spawnSync('bash', [join(kok, 'tools', 'sevk', 'nabiz.sh')],
    { encoding: 'utf8', env: { ...process.env, CLAUDE_PROJECT_DIR: kok, PATH: bin + ':' + process.env.PATH } });
  assert.match(kos(kok, 'catal-kuyruk.sh', ['--durum']).stdout, /Ç-03\tCEVAPLANDI/,
    'Auto-Submitted: no taşıyan geçerli cevap izsiz düştü');
});


// ══ 17 · SADE VE KISA YAZMA KAPISI (sahip kararı 2026-07-31) ══════════════════════════════
// Sahip kuyruk tavanını 2 KBdan 10 KBa çıkarırken şunu söyledi: "asıl çözüm tavan değil kalem —
// ajanlar sade, jargonsuz, benzetmesiz yazsın." Tavan artışı TEK BAŞINA yeterli değildi: kuyruğu
// dolduran şey madde SAYISI değil madde BOYUydu. Kapı artık uzun sahip cümlesini KIRPMAZ,
// REDDEDER — kırpılmış bir sahip cümlesi yalan söyler ve rol daha kısa yazmayı ancak geri
// dönerse öğrenir.
function zarfKur({ ceviri = 'Hangisi olsun?', etki = 'Yarın sabah farkı şu olur', secenekler = null } = {}) {
  return ['BİTEN: G-07 — iş bitti · kanıt: 00_pano/PANO.md:3',
    'ÇATAL: dolu', 'ÇEVİRİ: ' + ceviri, 'ETKİ: ' + etki, 'BEKLETİR: G-12',
    ...(secenekler ? ['SEÇENEKLER: ' + secenekler] : []),
    'DEĞERLENDİRMEDİKLERİM: yok', 'SIRADAKİ: kapalı', 'TÜRETME-İZİ: yok', 'GERİ-ÇEKİLEN: yok'].join('\n');
}
function kapiKos(zarf) {
  const kok = mkdtempSync(join(tmpdir(), 'kapi-test-'));
  for (const d of [['00_pano'], ['tools', 'sevk'], ['.claude', 'agents'], ['01_kutular', 'KT-001']]) {
    mkdirSync(join(kok, ...d), { recursive: true });
  }
  for (const b of ['ortak.sh', 'kilit.sh', 'zarf-ekle.sh', 'zarf-bicim-kapisi.sh', 'catal-kuyruk.sh', 'karar-alani.sh']) {
    copyFileSync(join(KOK_REPO, 'tools', 'sevk', b), join(kok, 'tools', 'sevk', b));
    chmodSync(join(kok, 'tools', 'sevk', b), 0o755);
  }
  copyFileSync(join(KOK_REPO, 'tools', 'sevk', 'cevap-sozlugu.txt'), join(kok, 'tools', 'sevk', 'cevap-sozlugu.txt'));
  // gorev-durumlari.txt VERI dosyasidir ve sevk onu FAIL-CLOSED arar (K5 tek evi; kume
  // bekci ile ORTAK): kurulu projede her zaman vardir, simulasyon da tasimak zorunda.
  mkdirSync(join(kok, 'tools', 'bekci'), { recursive: true });
  copyFileSync(join(KOK_REPO, 'tools', 'bekci', 'gorev-durumlari.txt'),
               join(kok, 'tools', 'bekci', 'gorev-durumlari.txt'));
  // zarf-jetonlari.txt de VERI dosyasidir ve IKI UC (sevk + zarf-bicim-kapisi) onu
  // FAIL-CLOSED arar (U40 tek evi): kurulu projede hep vardir, simulasyon da tasir.
  copyFileSync(join(KOK_REPO, 'tools', 'sevk', 'zarf-jetonlari.txt'),
               join(kok, 'tools', 'sevk', 'zarf-jetonlari.txt'));
  // Kuyruga yazan kollar icerik suzgecini FAIL-CLOSED arar (U60): kod betigin yanindan,
  // VERI projenin kokunden gelir. Kurulu projede ikisi de vardir; simulasyon da tasir.
  kuyrukBagimliliklariKur(kok, KOK_REPO);
  writeFileSync(join(kok, 'tools', 'sevk', '.donem-acik'), 'D1\tKT-001\tyapim\tgercek\n2026-07-31T00:00:00Z\n');
  writeFileSync(join(kok, '.claude', 'agents', 'po.md'), '# rol\n');
  writeFileSync(join(kok, '00_pano', 'PANO.md'), '# pano\n');   // kanıt işaretçisinin hedefi
  // Kapının beklediği olay biçimi catal.test.mjs ile AYNI: { agent_type, last_assistant_message }
  const olay = JSON.stringify({ agent_type: 'po', last_assistant_message: zarf });
  return spawnSync('bash', [join(kok, 'tools', 'sevk', 'zarf-bicim-kapisi.sh')],
    { encoding: 'utf8', input: olay, env: { ...process.env, CLAUDE_PROJECT_DIR: kok } });
}

test('kısa ve sade ÇEVİRİ/ETKİ kapıdan GEÇER', () => {
  const r = kapiKos(zarfKur());
  assert.notEqual(r.status, 2, 'sade zarf reddedildi: ' + r.stderr);
});

test('uzun ÇEVİRİ kapıdan DÖNER (kırpılmaz, geri çevrilir)', () => {
  const r = kapiKos(zarfKur({ ceviri: 'Aynı şeyi ' + 'çok uzun uzun anlatan bir cümle. '.repeat(9) }));
  assert.equal(r.status, 2, 'uzun ÇEVİRİ geçti — sahip yüzeyi şişer');
  assert.match(r.stderr, /çok uzun/, 'red sebebi uzunluk değil: ' + r.stderr);
  assert.match(r.stderr, /SADE ve KISA|benzetme yok/, 'role sade yazması söylenmiyor');
});

test('uzun ETKİ kapıdan DÖNER', () => {
  const r = kapiKos(zarfKur({ etki: 'Sabah şu olur ve şu olur ve ayrıca şu da olur. '.repeat(7) }));
  assert.equal(r.status, 2, 'uzun ETKİ geçti');
  assert.match(r.stderr, /ETKİ satırı çok uzun/);
});

test('kapı eşiği kuyruğun kırpma tavanının ALTINDA (kırpma dalı fiilen hiç koşmaz)', () => {
  const kapi = readFileSync(join(KOK_REPO, 'tools', 'sevk', 'zarf-bicim-kapisi.sh'), 'utf8');
  const kuyruk = readFileSync(join(KOK_REPO, 'tools', 'sevk', 'catal-kuyruk.sh'), 'utf8');
  const kapiCeviri = Number((kapi.match(/"ÇEVİRİ":\s*(\d+)/) || [])[1]);
  const kapiEtki = Number((kapi.match(/"ETKİ":\s*(\d+)/) || [])[1]);
  const kisCeviri = Number((kuyruk.match(/kis\(a\.ceviri,\s*(\d+)\)/) || [])[1]);
  const kisEtki = Number((kuyruk.match(/kis\(a\.etki,\s*(\d+)\)/) || [])[1]);
  assert.ok(kapiCeviri && kisCeviri && kapiEtki && kisEtki, 'eşikler okunamadı');
  assert.ok(kapiCeviri < kisCeviri, `kapı eşiği (${kapiCeviri}) kırpma tavanının (${kisCeviri}) altında değil — sahip cümlesi kesilebilir`);
  assert.ok(kapiEtki < kisEtki, `ETKİ: kapı ${kapiEtki} ≥ kırpma ${kisEtki}`);
});

test('kuyruk tavanı 10 KB ve ÜÇ yazıcının başlığı BAYT-EŞ', () => {
  const kalip = readFileSync(join(KOK_REPO, '00_genesis', 'EL_KITABI_KALIBI.md'), 'utf8');
  assert.match(kalip, /SENDE_BEKLEYEN 10KB/, 'ilan edilen tavan 10KB değil');
  // Başlığı üç yer yazar (kuyruk --ekle · kuyruk --not · kapanış kancası). Ayrışırlarsa dosya
  // kimin doğurduğuna göre farklı içerikle doğar — D-02nin tam olarak yasakladığı şey.
  const blok = (metin) => {
    const i = metin.indexOf('MADDE SİLİNMEZ');
    assert.ok(i > 0, 'başlık bloğu bulunamadı');
    return metin.slice(i, metin.indexOf('-->', i));
  };
  const kuyruk = readFileSync(join(KOK_REPO, 'tools', 'sevk', 'catal-kuyruk.sh'), 'utf8');
  const kapanis = readFileSync(join(KOK_REPO, 'tools', 'guard', 'kapanis.sh'), 'utf8');
  const hepsi = new Set([blok(kuyruk), blok(kuyruk.slice(kuyruk.indexOf('MADDE SİLİNMEZ') + 20)), blok(kapanis)]);
  assert.equal(hepsi.size, 1, 'üç başlık ayrışmış (' + hepsi.size + ' farklı sürüm)');
  assert.match([...hepsi][0], /tavan 10KB/, 'başlıktaki tavan 10KB değil');
  assert.ok(!/kırpılır/.test([...hepsi][0]),
    'başlık hâlâ kırpma vaat ediyor ama kırpan kod YOK — "yorumda yazılı, kodda yok" sınıfı');
});

// ══ 18 · U72 · ÇAPA YAZICISININ TEK EVİ ══════════════════════════════════════════════════
// Kusur: aynı yazıcının İKİ kopyası vardı. Nabzınki kilitli · alan beyaz listeli · hatasını
// günlüğe düşüren; zarf-bicim-kapisi'ndeki KİLİTSİZ · listesiz · `|| true` ile susturulmuş.
// İkisi AYNI geçici yola yazıyordu (.cevap-capa.yeni) ve kapının kendi başlığı "çapa KİLİTLİ
// ve ATOMİK yazılır" diyordu. ÖLÇÜLDÜ (2026-08-09, onarımdan ÖNCE):
//   · 12 eşzamanlı yazıcı → kilitsiz kopyada 12'nin yalnız 8'i işaretlendi; kilitlide 12/12.
//   · `Y_ALAN=kod` → kilitsiz kopya çapanın KİMLİK alanını ezdi; kilitli kopya reddetti.
//   · Yazım başarısızken kabuk exit 0 döndü, satır `acik` KALDI, günlüğe HİÇBİR ŞEY düşmedi.
// Bu bölümden önce yazıcıyı ölçen TEK BİR test yoktu — sürüklenmenin sağ kalma sebebi buydu.
const CAPA_YOLU = (kok) => join(kok, 'tools', 'sevk', '.cevap-capa');
// Fixture ÜRETİCİYLE BİÇİM-EŞ (hasım bulgusu): eksik alanlı bir fixture hem `bicimsiz`/
// `gorulen` dönüşüm dallarını hiç koşturmuyor hem de satırı kısaltarak eşzamanlılık testinin
// ölçtüğü kritik bölgeyi daraltıyordu. Kaynak: zarf-bicim-kapisi.sh KOD_JS `kayit` nesnesi.
const capaSatiri = (kod, ek = {}) => JSON.stringify({
  kod, msgid: `<keel-${kod}@ornek.gecersiz>`, catal: 'Ç-03', gorev: 'G-07', donem: 'D1', kutu: 'KT-001',
  ts: new Date().toISOString(), secenekler: ['Yerinde kal', 'Yenisine geç'],
  durum: 'acik', bicimsiz: 0, gorulen: [], alarm: '', ...ek });
function capaKur(kok, kodlar) {
  writeFileSync(CAPA_YOLU(kok), kodlar.map((k) => capaSatiri(k)).join('\n') + '\n', { mode: 0o600 });
}
const capaJson = (kok) =>
  readFileSync(CAPA_YOLU(kok), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const gunlukSatirlari = (kok) => {
  const y = join(kok, '00_pano', 'zarf-gunlugu.jsonl');
  return existsSync(y) ? readFileSync(y, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)) : [];
};
// Yazıcı KAYNAĞINDAN çağrılır: testin kendi kopyasını yazmak (D-02) tam da bu paketin
// kapattığı sürüklenme sınıfını yeniden doğururdu.
function capaYaz(kok, { kod = 'AAAA1111', alan = 'durum', deger = 'gitmedi', ongovde = '', ardgovde = '',
                        argumanlar = null } = {}) {
  const cagri = argumanlar !== null ? argumanlar
    : `"${kok}" "${CAPA_YOLU(kok)}" "${kod}" "${alan}" "${deger}"`;
  const betik = [`. "${join(kok, 'tools', 'sevk', 'ortak.sh')}"`, ongovde,
    `cevap_capa_yaz ${cagri}`, 'RC=$?', ardgovde, 'exit "$RC"'].filter(Boolean).join('\n');
  return spawnSync('bash', ['-c', betik], { encoding: 'utf8', env: { ...process.env, CLAUDE_PROJECT_DIR: kok } });
}

// Tarama YÜZEYİ geniş ve ÖZYİNELEMELİ (hasım bulgusu): ilk hâli yalnız tools/sevk'in düz
// listesine ve `.sh` uzantısına bakıyordu — tools/guard altına ya da bir kancaya konan kopya
// nöbetçiden geçerdi. Testler dışarıda: onlar fixture kurar, yazıcı tanımlamaz.
function kaynakDosyalari() {
  const kok = KOK_REPO, cikti = [];
  const gez = (d) => {
    for (const g of readdirSync(d, { withFileTypes: true })) {
      if (g.name === 'node_modules' || g.name === '.git' || g.name === 'test') continue;
      const y = join(d, g.name);
      if (g.isDirectory()) gez(y);
      else if (/\.(sh|mjs|js)$/.test(g.name)) cikti.push(y.slice(kok.length + 1));
    }
  };
  for (const alt of ['tools', '.claude']) if (existsSync(join(kok, alt))) gez(join(kok, alt));
  return cikti;
}

test('U72 tek ev: çapaya YAZAN tanım yalnız ortak.sh’ta — ikinci kopya doğamaz', () => {
  // TARAMA YÜZEYİ ÖNCE ÖLÇÜLÜR (kendi kasıtlı bozmamız yakaladı): yüzeyi tools/sevk'e geri
  // daraltan bir düzenleme hiçbir testi kırmızıya döndürmüyordu, çünkü bugün sevk dışında
  // kopya YOK — yani genişletme ölçülmemiş bir temenniydi. Yüzeyin kendisi artık iddia.
  const yuzey = kaynakDosyalari();
  for (const alt of ['tools/guard/', 'tools/bekci/', 'tools/kokpit/']) {
    assert.ok(yuzey.some((f) => f.startsWith(alt)),
      `tarama yüzeyi ${alt} altını görmüyor — oraya konan bir kopya nöbetçiden geçer`);
  }
  const tanim = [], protokol = [], yerinde = [];
  for (const f of yuzey) {
    const s = readFileSync(join(KOK_REPO, f), 'utf8');
    // Gevşek tanım deseni: `cevap_capa_yaz()`, `function cevap_capa_yaz {`, girintili yazım.
    if (/(^|\n)\s*(function\s+)?cevap_capa_yaz\s*(\(\s*\))?\s*\{/.test(s)) tanim.push(f);
    if (/Y_ALAN|Y_DEGER/.test(s)) protokol.push(f);
    // Çapayı YERİNDE yeniden yazan her JS: geçici dosya + rename kalıbı. Yeni bir kopya env
    // değişkenlerini yeniden adlandırsa bile bu kalıptan kaçamaz.
    if (/CAPA_YOL/.test(s) && /renameSync\s*\(/.test(s)) yerinde.push(f);
  }
  assert.deepEqual(tanim, ['tools/sevk/ortak.sh'],
    'cevap_capa_yaz birden çok evde tanımlı: ' + tanim.join(', ') + ' — ayrışma yeniden başlar');
  assert.deepEqual(protokol, ['tools/sevk/ortak.sh'],
    'çapa yazım protokolü (Y_ALAN/Y_DEGER) ortak.sh dışında da geçiyor: ' + protokol.join(', '));
  assert.deepEqual(yerinde, ['tools/sevk/ortak.sh'],
    'çapayı yerinde yeniden yazan ikinci bir JS var: ' + yerinde.join(', '));
});

test('U72 tek ev: HER çağrı BEŞ argüman veriyor (kayan argüman alanı sessizce boşaltıyordu)', () => {
  let cagri = 0;
  for (const f of kaynakDosyalari()) {
    const s = readFileSync(join(KOK_REPO, f), 'utf8');
    for (const satir of s.split('\n')) {
      if (/^\s*#/.test(satir)) continue;                       // yorumdaki imza örneği sayılmaz
      const m = satir.match(/(?:^\s*|[;&|]\s*|\)\s*)cevap_capa_yaz\s+(.*?)\s*(?:\|\||&&|;;|;|$)/);
      if (!m || /^\(\)/.test(m[1])) continue;
      // Argümanları kabaca ayır: tırnaklı öbekler tek argümandır.
      const arg = m[1].match(/"[^"]*"|\S+/g) || [];
      cagri++;
      assert.equal(arg.length, 5,
        `${f}: cevap_capa_yaz ${arg.length} argümanla çağrılıyor (5 olmalı) → ${satir.trim()}`);
    }
  }
  assert.ok(cagri >= 11, 'çağrı yerleri bulunamadı (' + cagri + ') — tarama deseni bozulmuş olabilir');
});

test('U72 tek ev: çapaya yazan HER kol tek evi ÇAĞIRIR (kendi yazıcısını kurmaz)', () => {
  for (const f of ['nabiz.sh', 'zarf-bicim-kapisi.sh']) {
    const s = readFileSync(join(KOK_REPO, 'tools', 'sevk', f), 'utf8')
      .split('\n').filter((l) => !/^\s*#/.test(l)).join('\n');   // yorumla beslenmez
    assert.match(s, /cevap_capa_yaz "\$KOK"/,
      `${f} çapa yazıcısını tek evden çağırmıyor — kendi kopyasına dönmüş olabilir`);
  }
});

test('U72: alan beyaz listesi — `kod` alanı YAZILAMAZ (kimlik ezilemez)', () => {
  const kok = kurulum();
  capaKur(kok, ['AAAA1111']);
  const r = capaYaz(kok, { alan: 'kod', deger: 'SAHTE' });
  assert.equal(r.status, 1, 'beyaz liste dışı alan kabul edildi');
  assert.equal(capaJson(kok)[0].kod, 'AAAA1111', 'çapanın KİMLİK alanı ezildi — kod eşleşmesi çöker');
  // ÇAĞRI kusuru ile G/Ç kusuru AYRI ize düşer (evin «yok ≠ okuyamadım» doktrininin yazma
  // yönü): ikisi aynı cümleyi yazsaydı sahibin bakacağı yer de aynı görünürdü.
  const iz = gunlukSatirlari(kok).filter((j) => j.cins === 'cevap-capasi-yazilamadi');
  assert.equal(iz.length, 1, 'reddedilen yazım izsiz kaldı');
  assert.match(iz[0].detay, /beyaz listede degil/,
    'çağrı kusuru G/Ç kusuruyla aynı ize düştü: ' + iz[0].detay);
});

test('U72: eksik/fazla argüman FAIL-CLOSED — alan sessizce boşalmaz', () => {
  // Arite 3→5 değişti; kayan bir argüman `Y_DEGER`i boş dizeye çeviriyor, alan boşalıyor ve
  // dönüş yine 0 oluyordu. O kod açık kod listesinden sessizce düşer (nabiz CEVAP_JS_OKU
  // `durum !== "acik"` der), sahip cevabı hiç aranmaz ve aynı çatala İKİNCİ kod üretilir.
  for (const [ad, argumanlar] of [
    ['dört argüman (değer yok)', (k) => `"${k}" "${CAPA_YOLU(k)}" "AAAA1111" durum`],
    ['üç argüman (eski imza)', (k) => `"${k}" "AAAA1111" durum`],
    ['altı argüman', (k) => `"${k}" "${CAPA_YOLU(k)}" "AAAA1111" durum gitmedi fazla`],
    ['boş değer', (k) => `"${k}" "${CAPA_YOLU(k)}" "AAAA1111" durum ""`],
  ]) {
    const kok = kurulum();
    capaKur(kok, ['AAAA1111']);
    const r = capaYaz(kok, { argumanlar: argumanlar(kok) });
    assert.equal(r.status, 1, ad + ': kabul edildi');
    assert.equal(capaJson(kok)[0].durum, 'acik', ad + ': satır yine de değişti');
  }
});

test('U72: çapada olmayan kod için dönüş 1 — "yazdım" ile "satır bulamadım" ayrı', () => {
  // nabiz.sh `cevap_capa_yaz … durum tuketildi || return 0` freni tam bu dönüşe bağlı:
  // sessiz 0 gelirse sahibe "hiçbir şey değiştirilmedi" postası gider, oysa cevabı uygulanmıştır.
  const kok = kurulum();
  capaKur(kok, ['AAAA1111']);
  const r = capaYaz(kok, { kod: 'YOKKOD99' });
  assert.equal(r.status, 1, 'eşleşmeyen kod için BAŞARI döndü');
  assert.ok(gunlukSatirlari(kok).some((j) => /kod YOK/.test(j.detay || '')), 'iz düşmedi');
  assert.equal(capaJson(kok).length, 1, 'eşleşme yokken dosya yeniden yazılmamalı');
});

test('U72: yazım başarısızsa dönüş 1 ve günlükte iz var (sessiz başarısızlık yok)', () => {
  const kok = kurulum();
  capaKur(kok, ['AAAA1111']);
  chmodSync(CAPA_YOLU(kok), 0o000);                      // okunamayan çapa: readFileSync patlar
  const r = capaYaz(kok);
  chmodSync(CAPA_YOLU(kok), 0o600);
  assert.equal(r.status, 1, 'okunamayan çapaya yazım BAŞARILI raporlandı');
  assert.equal(capaJson(kok)[0].durum, 'acik', 'satır değişmemeli (ölçümün ön koşulu)');
  const iz = gunlukSatirlari(kok).filter((j) => j.cins === 'cevap-capasi-yazilamadi');
  assert.equal(iz.length, 1, 'başarısız yazım günlüğe DÜŞMEDİ — sahibin eline geçmemiş kod sessizce açık kalır');
  assert.match(iz[0].detay, /yazim kosamadi/);
});

test('U72: kilit BAŞKASINDAYSA yazılmaz ve iz düşer (fail-closed)', () => {
  const kok = kurulum();
  capaKur(kok, ['AAAA1111']);
  const kilit = CAPA_YOLU(kok) + '.kilit';
  mkdirSync(kilit, { recursive: true });
  writeFileSync(join(kilit, 'pid'), String(process.pid) + '\n');   // YAŞAYAN sahip: kırılamaz
  const r = capaYaz(kok);
  assert.equal(r.status, 1, 'kilit başkasındayken yazım yapıldı — kilitsiz oku-değiştir-yaz geri geldi');
  assert.equal(capaJson(kok)[0].durum, 'acik', 'kilit alınamadan çapa değişti');
  assert.ok(gunlukSatirlari(kok).some((j) => /kilit alinamadi/.test(j.detay || '')),
    'kilit reddi izsiz kaldı');
});

test('U72: eşzamanlı yazımda hiçbir işaret KAYBOLMAZ ve 12/12 işaretlenir', () => {
  const kok = kurulum();
  const N = 12;
  const kodlar = Array.from({ length: N }, (_, i) => 'K' + String(i).padStart(7, '0'));
  capaKur(kok, kodlar);
  // Aynı anda N yazıcı: kilitsiz kopyada oku-değiştir-yaz turları birbirini eziyordu ve
  // yazıcılar yine de BAŞARI dönüyordu — kayıp yazım sessizdi (ölçüldü: 12'de 8).
  const betik = kodlar.map((k) =>
    `( . "${join(kok, 'tools', 'sevk', 'ortak.sh')}"; ` +
    `cevap_capa_yaz "${kok}" "${CAPA_YOLU(kok)}" "${k}" durum gitmedi && echo "${k}" ) &`).join('\n') + '\nwait';
  const r = spawnSync('bash', ['-c', betik],
    { encoding: 'utf8', env: { ...process.env, CLAUDE_PROJECT_DIR: kok } });
  const basarili = new Set(r.stdout.split('\n').filter(Boolean));
  const isaretli = () => new Set(capaJson(kok).filter((j) => j.durum === 'gitmedi').map((j) => j.kod));

  // (1) ASIL DEĞİŞMEZ — kilidin ölçtüğü şey: BAŞARI dönen hiçbir yazım kaybolmaz.
  assert.deepEqual([...basarili].filter((k) => !isaretli().has(k)), [],
    'BAŞARI dönen yazım çapada YOK — kayıp yazım (kilitsiz oku-değiştir-yaz geri gelmiş)');
  assert.equal(capaJson(kok).length, N, 'eşzamanlı yazım satır DÜŞÜRDÜ (yarım/ezilmiş çapa)');

  // (2) 12/12 iddiası — ortak.sh'ın kalıcı yorumundaki sayının mekanik karşılığı. Kilidin
  // bütçesi 5 sn'dir; YÜKLÜ makinede bir kısmı bu bütçeyi aşıp 1 dönebilir ve bu bir ARIZA
  // DEĞİL, çekişmedir. Ayrımı test kendisi yapar: çekişmede kalanlar TEKRAR, bu kez
  // çekişmesiz denenir ve GEÇMEK ZORUNDADIR. Yük yüzünden kırmızıya düşen kapı da kusurdur
  // (ölçüldü: hasım turu koşarken 12'nin bir kısmı bütçeyi aştı ve test yanlış-kırmızı verdi).
  // ÇEKİŞME GERÇEKTEN OLDU MU (hasım bulgusu): tekrar-denemeli aklama, kilidin çekişme
  // davranışı TAMAMEN çökse bile testi yeşil bırakabilirdi. En az iki yazıcı ÇEKİŞME İÇİNDE
  // geçmiş olmalı; aksi hâlde ölçüm kurulmamıştır.
  assert.ok(basarili.size >= 2,
    `eşzamanlı turda yalnız ${basarili.size} yazıcı geçti — çekişme ölçülemedi: ` + r.stderr);
  for (const k of kodlar.filter((x) => !basarili.has(x))) {
    const t = capaYaz(kok, { kod: k });
    assert.equal(t.status, 0,
      `${k}: çekişmesiz ikinci denemede de yazılamadı — bu çekişme değil ARIZA: ` + t.stderr);
  }
  assert.equal(isaretli().size, N, `çapada ${isaretli().size}/${N} işaret var`);
});

test('U72: çağıranın kilidi korunur — iç çağrı dıştaki kilidi düşürmez', () => {
  const kok = kurulum();
  capaKur(kok, ['AAAA1111']);
  const disKilit = join(kok, 'tools', 'sevk', '.dis.kilit');
  const r = capaYaz(kok, {
    ongovde: `. "${join(kok, 'tools', 'sevk', 'kilit.sh')}"\nkilit_al "${disKilit}" || exit 9`,
    ardgovde: 'kilit_birak',
  });
  assert.notEqual(r.status, 9, 'ölçüm kurulamadı: dış kilit alınamadı');
  assert.equal(r.status, 0, 'yazım başarısız: ' + r.stderr);
  assert.ok(!existsSync(disKilit),
    'dış kilit SIZDI — iç çağrı KILIT_YOLU’nu ezmiş, çağıranın kilit_birak’ı etkisiz kalmış');
});

test('U72: çağıran AYNI kilidi tutuyorsa yazım yine olur (mkdir kilidi yeniden-girişli DEĞİL)', () => {
  // Hasım bulgusu: bugün güvenlik yalnız kapının çağrı SIRASINDAN geliyordu (kilit_birak,
  // mutabakat bloğundan önce). O satır aşağı taşınsa kapı kendi kilidine 5 sn takılır,
  // yazım düşer ve `|| true` yutar — kod kalıcı olarak `acik` kalırdı.
  const kok = kurulum();
  capaKur(kok, ['AAAA1111']);
  const kilit = CAPA_YOLU(kok) + '.kilit';
  const r = capaYaz(kok, {
    ongovde: `. "${join(kok, 'tools', 'sevk', 'kilit.sh')}"\nkilit_al "${kilit}" || exit 9`,
    ardgovde: `[ -d "${kilit}" ] || exit 8\nkilit_birak`,
  });
  assert.notEqual(r.status, 9, 'ölçüm kurulamadı: kilit alınamadı');
  assert.notEqual(r.status, 8, 'çağıranın kilidi İÇERİDE bırakıldı — sahibi olmayan kilit serbest kaldı');
  assert.equal(r.status, 0, 'çağıran kilidi tutarken yazım DÜŞTÜ (kendi kilidine takıldı): ' + r.stderr);
  assert.equal(capaJson(kok)[0].durum, 'gitmedi', 'yazım yapılmadı');
  assert.ok(!existsSync(kilit), 'çağıranın kilidi bırakılamadı');
});
