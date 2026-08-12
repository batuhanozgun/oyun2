// kanal-e5.test.mjs — E5: haber kanalı · gönderim-öncesi süzgeç · DUR üç hat · watchdog/nabız ·
// şişme alarmı · sabah yüzeyi · canlılık denetimi.
// Sözleşme: E5 kanal-nabız-sabah tasarısı (2026-07-28) — geliştirme arşivinde, pakette yok.
// AĞA ÇIKILMAZ: gönderim testleri `--prova` kipinde koşar, yoklama `--sig` kipinde. Gerçek
// gönderim yalnız T6 tatbikatındadır (sahibin kendi adresine) — testin girdisi ağ olamaz.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, copyFileSync, chmodSync, appendFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { kuyrukBagimliliklariKur } from './kuyruk-bagimliligi.mjs';

const BURASI = dirname(fileURLToPath(import.meta.url));
const KOK_REPO = join(BURASI, '..', '..', '..');
const BETIKLER = ['ortak.sh', 'kilit.sh', 'zarf-ekle.sh', 'haber.sh', 'kanal-yokla.sh',
                  'nabiz.sh', 'watchdog-kur.sh', 'devir-kapisi.sh', 'zarf-bicim-kapisi.sh',
                  'catal-kuyruk.sh', 'karar-alani.sh'];

// SENTETİK DEĞER ÜRETİLİR, YAZILMAZ (E2 dersi): kapı redi alan ajan koruma betiklerini OKUYOR;
// testte duran gerçekçi bir literal, desen-tabanlı gözleri kirletir. Luhn kuralından üretiyoruz.
function luhnKart() {
  const govde = '42' + '1'.repeat(13);            // 15 hane, kontrol hanesi eklenecek
  let toplam = 0, ikile = true;
  for (let i = govde.length - 1; i >= 0; i--) {
    let d = Number(govde[i]);
    if (ikile) { d *= 2; if (d > 9) d -= 9; }
    ikile = !ikile; toplam += d;
  }
  return govde + String((10 - (toplam % 10)) % 10);
}

function kurulum({ kanal = true, donem = null, pano = true } = {}) {
  const kok = mkdtempSync(join(tmpdir(), 'e5-test-'));
  mkdirSync(join(kok, 'tools', 'sevk', 'damgalar'), { recursive: true });
  mkdirSync(join(kok, 'tools', 'guard'), { recursive: true });
  if (pano) mkdirSync(join(kok, '00_pano'), { recursive: true });
  for (const b of BETIKLER) {
    copyFileSync(join(KOK_REPO, 'tools', 'sevk', b), join(kok, 'tools', 'sevk', b));
    chmodSync(join(kok, 'tools', 'sevk', b), 0o755);
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
  }
  for (const g of ['icerik-suzgeci.sh', 'gercek-veri-isaretleri.txt', 'yazim-kalibi.txt', 'sinif-listesi.txt']) {
    copyFileSync(join(KOK_REPO, 'tools', 'guard', g), join(kok, 'tools', 'guard', g));
  }
  if (kanal) {
    writeFileSync(join(kok, 'tools', 'sevk', 'kanal.conf'),
      'SMTP_SUNUCU=smtp.ornek.gecersiz\nSMTP_PORT=587\nHESAP=deneme@ornek.gecersiz\n' +
      'ALICI=deneme@ornek.gecersiz\nKEYCHAIN_SERVIS=keel-test-yok\n' +
      'IMAP_SUNUCU=imap.ornek.gecersiz\nDUR_KONU=KEEL DUR\nSESSIZLIK_ESIK_DK=30\n');
  }
  if (donem) writeFileSync(join(kok, 'tools', 'sevk', '.donem-acik'), donem);
  return kok;
}
const kos = (kok, ad, args = [], girdi = undefined) =>
  spawnSync('bash', [join(kok, 'tools', 'sevk', ad), ...args],
    { encoding: 'utf8', input: girdi, env: { ...process.env, CLAUDE_PROJECT_DIR: kok } });
const haber = (kok, args) => kos(kok, 'haber.sh', args);
const gunluk = (kok) => {
  const y = join(kok, '00_pano', 'zarf-gunlugu.jsonl');
  return existsSync(y) ? readFileSync(y, 'utf8').split('\n').filter(Boolean).map((s) => JSON.parse(s)) : [];
};
const DONEM_SATIRI = (damga) => `DONEM-E5\tKT-900\tyapim\tbassiz\ttatbikat\ndamga\t${damga}\n`;

// ── 1 · Serbest-metin yasağı: KURAL DEĞİL, ARAYÜZ ─────────────────────────────────────────
test('haber: serbest gövde argümanı YOKTUR (yasak arayüze gömülü)', () => {
  const kok = kurulum();
  for (const kotu of ['--govde', '--body', '--metin']) {
    const r = haber(kok, ['--olay', 'alarm', '--cins', 'kanal', kotu, 'ne istersem yazarım', '--prova']);
    assert.equal(r.status, 1, kotu + ' kabul edilmemeli');
    assert.match(r.stderr, /tanınmayan argüman/);
  }
  // Betikte gerçekten yok: kaynak taraması (arayüz sözleşmesinin ikinci hattı)
  const kaynak = readFileSync(join(KOK_REPO, 'tools', 'sevk', 'haber.sh'), 'utf8');
  assert.ok(!/--govde\)/.test(kaynak), 'haber.sh içinde gövde argümanı dalı olmamalı');
});

test('haber: tanınmayan olay reddedilir; alarm --cins zorunludur', () => {
  const kok = kurulum();
  assert.match(haber(kok, ['--olay', 'uydurma', '--prova']).stderr, /tanınmayan olay/);
  assert.match(haber(kok, ['--olay', 'alarm', '--prova']).stderr, /--cins ister/);
});

// ── 2 · Dört olay ─────────────────────────────────────────────────────────────────────────
test('haber: dört olayın gövdesi şablondan kurulur (prova)', () => {
  const kok = kurulum();
  // --kip argümanı F1-5e ile KALKTI: haber.sh onu artık tanımaz (bilinmeyen argüman = hata).
  const a = haber(kok, ['--olay', 'donem-basladi', '--donem', 'K1', '--kutu', 'KT-900',
                        '--tur', 'yapim', '--sinif', 'gercek', '--prova']);
  assert.equal(a.status, 0);
  assert.match(a.stdout, /PROVA\tdonem-basladi\tTEMIZ/);
  assert.match(a.stdout, /Dönem açıldı: K1/);
  assert.match(a.stdout, /KEEL DUR/, 'durdurma yolu ilk postada yazılı olmalı');

  const b = haber(kok, ['--olay', 'donem-bitti', '--donem', 'K1', '--kutu', 'KT-900',
                        '--blok1', 'iki dönem', '--blok2', 'kuyruk boş', '--blok3', 'durdu', '--prova']);
  assert.match(b.stdout, /GECE NE OLDU\niki dönem/);
  assert.match(b.stdout, /SENDE BEKLEYEN\nkuyruk boş/);
  assert.match(b.stdout, /ŞİMDİ NE YAPIYOR\ndurdu/);

  const c = haber(kok, ['--olay', 'catal-bekliyor', '--donem', 'K1', '--kutu', 'KT-900',
                        '--catal', 'Ç-01', '--ceviri', 'soru metni', '--etki', 'etki metni',
                        '--bekletir', 'G-02', '--prova']);
  assert.match(c.stdout, /Ç-01/);
  assert.match(c.stdout, /soru metni/);
  assert.match(c.stdout, /SENDE_BEKLEYEN\.md/, 'cevap yolu bilgisayardadır — uzaktan cevap yok');

  const d = haber(kok, ['--olay', 'alarm', '--cins', 'sisme', '--donem', 'K1', '--kutu', 'KT-900',
                        '--detay', 'kutu büyüdü', '--prova']);
  assert.match(d.stdout, /ALARM \(sisme\)/);
  assert.match(d.stdout, /kutu büyüdü/);
});

// ── 3 · Gönderim-öncesi ZORUNLU süzgeç (paketin en kritik güvencesi) ──────────────────────
test('haber: süzgeç eşleşmesi postayı DURDURUR; değer sansürlü şablona SIZMAZ', () => {
  const kok = kurulum();
  const kart = luhnKart();
  const r = haber(kok, ['--olay', 'alarm', '--cins', 'kirmizi', '--donem', 'K1', '--kutu', 'KT-900',
                        '--detay', 'müşteri kaydı ' + kart + ' yazıldı', '--prova']);
  assert.equal(r.status, 3, 'süzgeç redi 3 ile bildirilir');
  assert.match(r.stdout, /SANSURLU/);
  assert.match(r.stdout, /önleme süzgecinde DURDU \(kart\)/);
  assert.ok(!r.stdout.includes(kart), 'DEĞER hiçbir kanala sızmamalı');
  assert.ok(!r.stdout.includes('müşteri kaydı'), 'özgün metnin kendisi de taşınmamalı');
  assert.ok(!r.stderr.includes(kart));
});

test('haber: süzgeç KOŞAMAZSA da temiz sayılmaz (fail-closed)', () => {
  const kok = kurulum();
  writeFileSync(join(kok, 'tools', 'guard', 'icerik-suzgeci.sh'), '#!/bin/bash\nexit 90\n');
  const r = haber(kok, ['--olay', 'alarm', '--cins', 'kanal', '--donem', 'K1', '--kutu', 'KT-900',
                        '--detay', 'sıradan metin', '--prova']);
  assert.equal(r.status, 3);
  assert.match(r.stdout, /süzgeç koşamadı/);
  assert.ok(!r.stdout.includes('sıradan metin'), 'tarayamadığı metni taşımaz');
});

test('haber: alan tavanı aşılırsa KESİLDİĞİ yazılır (sessiz kırpma yok)', () => {
  const kok = kurulum();
  const r = haber(kok, ['--olay', 'alarm', '--cins', 'kanal', '--donem', 'K1', '--kutu', 'KT-900',
                        '--detay', 'x'.repeat(2000), '--prova']);
  assert.equal(r.status, 0);
  // BİRİM KARAKTERDEN BAYTA DÖNDÜ (U29, K23): tavan "1500 bayt" diye ilan ediliyordu ama
  // karakter sayılıyordu — ilan edilen birimle ölçülen birim aynı değildi. Etiketin birimi
  // de artık ölçülen birimdir; "karakter kesildi" demek ölçmediğin şeyi söylemekti.
  assert.match(r.stdout, /\[\d+ bayt kesildi\]/);
});

// ── 4 · Kanal yoklaması (fail-closed) ─────────────────────────────────────────────────────
test('kanal-yokla: conf yok / eksik / Keychain yok → HAZIR DEĞİL + sebep', () => {
  const yok = kurulum({ kanal: false });
  const r0 = kos(yok, 'kanal-yokla.sh', ['--sig']);
  assert.equal(r0.status, 1);
  assert.match(r0.stdout, /HAZIR DEĞİL · kanal\.conf yok/);

  const eksik = kurulum({ kanal: false });
  writeFileSync(join(eksik, 'tools', 'sevk', 'kanal.conf'), 'SMTP_PORT=587\n');
  assert.match(kos(eksik, 'kanal-yokla.sh', ['--sig']).stdout, /eksik alan.*SMTP_SUNUCU/);

  const tam = kurulum();
  const r = kos(tam, 'kanal-yokla.sh', ['--sig']);
  assert.equal(r.status, 1, 'Keychain kaydı olmayan kanal HAZIR olamaz');
  assert.match(r.stdout, /Keychain kaydı yok/);
  assert.match(r.stdout, /add-generic-password/, 'sebep, düzeltme komutunu da söyler');
});

test('kanal.conf SOURCE edilmez: kabuk enjeksiyonu ve kontrol karakteri geçmez', () => {
  const kok = kurulum({ kanal: false });
  writeFileSync(join(kok, 'tools', 'sevk', 'kanal.conf'),
    'SMTP_SUNUCU=$(touch ' + join(kok, 'SIZDI') + ')\nHESAP=a@b.c\nALICI=a@b.c\n');
  kos(kok, 'kanal-yokla.sh', ['--sig']);
  assert.ok(!existsSync(join(kok, 'SIZDI')), 'conf değeri komut olarak KOŞMAMALI');
});

// ── 4b · U7 · Yoklamanın GELEN yönü (IMAP) ────────────────────────────────────────────────
// DOĞUŞ: yoklama başlığında "Üç kalem" yazıyordu ve üçü de GİDEN (SMTP) taraftaydı; kanal ise
// iki yönlü. `CEVAP_KANALI=acik` ama IMAP'i kurulmamış bir kutuda tören HAZIR diyor, dönem
// açılıyor ve kırık olduğu ancak sahip telefondan cevap verip cevabının hiç işlenmediğini
// görünce anlaşılıyordu — yoklamanın kendi gerekçesinin ("kırığı öğrenmenin en ucuz anı
// sahibin klavyede olduğu andır") tam tersi.
// CANLI ÖLÇÜM 2026-08-12 (K17 tatbikatı): yolsuz `imaps://` + NOOP çalışıyor, yani kimlik
// gelen kutusuna HİÇ DOKUNMADAN yoklanabiliyor; `UID SEARCH` hiçbir bayrağa dokunmuyor.
function yoklamaKutusu(ekConf) {
  const kok = kurulum({ kanal: false });
  writeFileSync(join(kok, 'tools', 'sevk', 'kanal.conf'),
    'SMTP_SUNUCU=smtp.ornek.gecersiz\nSMTP_PORT=587\nHESAP=a@b.gecersiz\nALICI=a@b.gecersiz\n' +
    'KEYCHAIN_SERVIS=k\n' + ekConf);
  const bin = join(kok, 'sahte-bin');
  mkdirSync(bin, { recursive: true });
  writeFileSync(join(bin, 'security'), '#!/bin/bash\necho sahte-parola\n');
  // Sahte curl hangi çağrı olduğunu URL'DEN ayırır — çağrı sırası KEHANET EDİLMEZ. Sıra
  // sayarak ayırsaydı, çağrılar yer değiştirdiğinde test yeşil kalıp yanlış şeyi ölçerdi.
  writeFileSync(join(bin, 'curl'), [
    '#!/bin/bash',
    'KONF="$(cat)"',
    'case "$KONF" in',
    '  *smtp://*) exit "${SAHTE_SMTP:-0}" ;;',
    '  *imaps://*/INBOX*) [ "${SAHTE_ARAMA:-0}" -eq 0 ] && echo "* SEARCH"; exit "${SAHTE_ARAMA:-0}" ;;',
    '  *imaps://*) exit "${SAHTE_NOOP:-0}" ;;',
    'esac',
    'exit 0',
  ].join('\n'));
  chmodSync(join(bin, 'security'), 0o755);
  chmodSync(join(bin, 'curl'), 0o755);
  return { kok, bin };
}
const yokla = ({ kok, bin }, args = [], env = {}) =>
  spawnSync('bash', [join(kok, 'tools', 'sevk', 'kanal-yokla.sh'), ...args],
    { encoding: 'utf8', env: { ...process.env, ...env, CLAUDE_PROJECT_DIR: kok, PATH: bin + ':' + process.env.PATH } });
const ilkSatir = (r) => (r.stdout.split('\n')[0] || '').trim();
const ikinciSatir = (r) => (r.stdout.split('\n')[1] || '').trim();

test('U7: uzaktan cevap AÇIK ama IMAP_SUNUCU boş → HAZIR DEĞİL (doğuş senaryosu)', () => {
  const k = yoklamaKutusu('IMAP_SUNUCU=\nCEVAP_KANALI=acik\n');
  const r = yokla(k, ['--sig']);
  assert.equal(r.status, 1, 'kendi kendisiyle çelişen kurulum HAZIR olamaz');
  assert.match(r.stdout, /CEVAP_KANALI=acik.*IMAP_SUNUCU boş/,
    'sebep çelişkiyi ADIYLA söylemeli — sahip nereye bakacağını bilmeli: ' + r.stdout);
  assert.match(r.stdout, /ya IMAP_SUNUCU'yu doldur ya CEVAP_KANALI'nı boşalt/,
    'sebep düzeltmenin İKİ yolunu da söyler (kanalı kapatmak da meşru bir çözümdür)');
});

test('U7: çelişki SIĞ kipte de yakalanır — ağa çıkmadan görülebilirdi ve görülmüyordu', () => {
  const k = yoklamaKutusu('IMAP_SUNUCU=\nCEVAP_KANALI=acik\n');
  // Sahte curl HER çağrıda 0 döner: ağa çıkılsa bile hüküm değişmemeli, çünkü kusur
  // yapılandırmanın KENDİ İÇİNDE. `--sig` bekçinin ve sevkin koştuğu kiptir.
  assert.equal(yokla(k, ['--sig']).status, 1);
  assert.equal(yokla(k, []).status, 1, 'derin kipte de aynı hüküm');
});

test('U7: IMAP\'siz kurulum uzaktan cevap kapalıyken MEŞRUDUR (kırmızı değil)', () => {
  const k = yoklamaKutusu('IMAP_SUNUCU=\nCEVAP_KANALI=\n');
  const r = yokla(k, ['--sig']);
  assert.equal(r.status, 0, 'tek yönlü kurulum kırmızı olsaydı bugün kurulu her kutu dönem açamazdı');
  assert.equal(ilkSatir(r), 'HAZIR');
  assert.match(ikinciSatir(r), /kurulu değil.*meşru/);
});

test('U7: DUR_JETON dolu + IMAP yok → KIRMIZI DEĞİL, ikinci satırda not', () => {
  // Uzaktan DUR'un VARLIK sorusu açık (sahip 2026-08-12): varlığı sorgulanan bir yeteneğin
  // üstüne yeni kırmızı kapı kurulmaz. Sessiz de kalmaz — nabız günlüğe bulgu yazıyor.
  const k = yoklamaKutusu('IMAP_SUNUCU=\nCEVAP_KANALI=\nDUR_JETON=abc\n');
  const r = yokla(k, ['--sig']);
  assert.equal(r.status, 0);
  assert.match(ikinciSatir(r), /DUR_JETON dolu ama IMAP yok/);
});

test('U7: IMAP kurulu + derin kip → oturum, INBOX ve arama fiilen yoklanır', () => {
  const k = yoklamaKutusu('IMAP_SUNUCU=imap.ornek.gecersiz\nCEVAP_KANALI=acik\n');
  const r = yokla(k, []);
  assert.equal(r.status, 0, r.stdout);
  assert.match(ikinciSatir(r), /oturum açıldı, INBOX seçildi, arama kabul edildi/);
  assert.match(ikinciSatir(r), /Uzaktan cevap AÇIK/);
});

test('U7: sığ kip ağa ÇIKMAZ ve çıkmadığını SÖYLER', () => {
  const k = yoklamaKutusu('IMAP_SUNUCU=imap.ornek.gecersiz\nCEVAP_KANALI=acik\n');
  // Sahte curl her IMAP çağrısında düşse bile sığ kip HAZIR demeli: ağa hiç çıkmıyor.
  const r = yokla(k, ['--sig'], { SAHTE_NOOP: '7', SAHTE_ARAMA: '7' });
  assert.equal(r.status, 0, 'sığ kip ağ hükmü vermez');
  assert.match(ikinciSatir(r), /sığ kip, ağa çıkılmadı/);
});

test('U7: IMAP kimliği reddedilirse HAZIR DEĞİL ve sebep SMTP\'den ayrışır', () => {
  const k = yoklamaKutusu('IMAP_SUNUCU=imap.ornek.gecersiz\nCEVAP_KANALI=acik\n');
  const r = yokla(k, [], { SAHTE_NOOP: '67' });
  assert.equal(r.status, 1);
  assert.match(r.stdout, /IMAP kimlik doğrulaması reddedildi/);
  assert.match(r.stdout, /SMTP geçti/, 'sahip "parolam yanlış" sanmamalı: SMTP geçmişti');
});

test('U7: IMAP sunucusuna ulaşılamama, kimlik reddinden AYRI sebeptir', () => {
  const k = yoklamaKutusu('IMAP_SUNUCU=imap.ornek.gecersiz\nCEVAP_KANALI=acik\n');
  const r = yokla(k, [], { SAHTE_NOOP: '7' });
  assert.equal(r.status, 1);
  assert.match(r.stdout, /IMAP sunucusuna ulaşılamadı/);
  assert.doesNotMatch(r.stdout, /kimlik doğrulaması reddedildi/);
});

test('U7: kimlik GEÇİP kutu düşerse sebep KUTUYU gösterir (aşama atfı kehanet değil)', () => {
  // Aşama atfı çıkış kodu tahminiyle değil, HANGİ ÇAĞRININ düştüğüyle yapılır: kimlik çağrısı
  // geçtiyse parola ve erişilebilirlik elenmiştir ve sebep artık yalan olamaz.
  const k = yoklamaKutusu('IMAP_SUNUCU=imap.ornek.gecersiz\nCEVAP_KANALI=acik\n');
  const r = yokla(k, [], { SAHTE_ARAMA: '54' });
  assert.equal(r.status, 1);
  assert.match(r.stdout, /INBOX seçilemedi ya da arama reddedildi/);
  assert.match(r.stdout, /kimlik doğrulaması GEÇTİ, kusur kutuda/);
});

test('U7: IMAP_PORT sayı değilse yoklama ağa çıkmadan durur', () => {
  const k = yoklamaKutusu('IMAP_SUNUCU=imap.ornek.gecersiz\nIMAP_PORT=abc\nCEVAP_KANALI=\n');
  const r = yokla(k, ['--sig']);
  assert.equal(r.status, 1);
  assert.match(r.stdout, /IMAP_PORT sayı değil/);
});

test('U7: GELEN yön GİDEN yönü MASKELEMEZ — SMTP hükmü önce düşer', () => {
  const k = yoklamaKutusu('IMAP_SUNUCU=imap.ornek.gecersiz\nCEVAP_KANALI=acik\n');
  const r = yokla(k, [], { SAHTE_SMTP: '67' });
  assert.equal(r.status, 1);
  assert.match(r.stdout, /SMTP kimlik doğrulaması reddedildi/);
});

test('U7: İLK SATIR SÖZLEŞMESİ — hüküm ikinci satırda, ilk satır tam olarak "HAZIR"', () => {
  // EN PAHALI BOZMA: gelen yönün hükmünü ilk satıra katmak. Üç tüketici de (bekci/cekirdek.mjs
  // · donem-ac.sh · ortak.sh) ilk satırı BİREBİR "HAZIR" ile karşılaştırıyor; ilk satıra
  // eklenen tek bir ek, üçünü birden yanlış kırmızıya çevirir ve gerçek kutu dönem AÇAMAZ.
  for (const conf of ['IMAP_SUNUCU=\nCEVAP_KANALI=\n',
                      'IMAP_SUNUCU=imap.ornek.gecersiz\nCEVAP_KANALI=acik\n']) {
    const k = yoklamaKutusu(conf);
    for (const args of [['--sig'], []]) {
      const r = yokla(k, args);
      if (r.status !== 0) continue;
      assert.equal(ilkSatir(r), 'HAZIR',
        'ilk satır sözleşmesi bozuldu (' + JSON.stringify(args) + '): ' + JSON.stringify(r.stdout));
      assert.ok(ikinciSatir(r).length > 0, 'gelen yönün hükmü ikinci satırda olmalı');
    }
  }
});

test('U7: İLAN ile UYGULAMA birlikte çürür — biri kalıp diğeri giderse KIRMIZI', () => {
  // U7'nin ta kendisi buydu: başlık "üç kalem" diye bir KAPSAM ilan ediyordu, gelen yön hiç
  // yoklanmıyordu ve ilan yıllarca kendi kendine doğru göründü. Bu test ikisini birbirine
  // bağlar: ilan GELEN diyorsa kodda gerçekten bir IMAP çağrısı olmak zorunda, ve tersi.
  const ham = readFileSync(join(KOK_REPO, 'tools', 'sevk', 'kanal-yokla.sh'), 'utf8');
  const baslik = ham.split('set -uo pipefail')[0];
  const ilanEdiyor = /GELEN \(IMAP\)/.test(baslik);
  const uyguluyor = /imaps:\/\//.test(ham);
  assert.equal(ilanEdiyor, uyguluyor,
    ilanEdiyor ? 'başlık GELEN yönü ilan ediyor ama kodda IMAP çağrısı YOK (U7 nüksü)'
               : 'kodda IMAP çağrısı var ama başlık onu ilan etmiyor — ilan kapsamı çürümüş');
  // Yasaklanan KELİME değil BİÇİMDİR: kapsamı SAYIYLA ilan etmek. Eski başlık
  // `# Üç kalem: yapılandırma · Keychain · SMTP` diyordu; sayı, kapsam büyüdüğünde sessizce
  // yalan olur. Tarihi ANMAK serbesttir ve gereklidir (doğuş kaydı) — ilan etmek değil.
  const sayiylaIlan = baslik.split('\n')
    .find((l) => /^#\s*(bir|iki|üç|dört|beş|altı|yedi|sekiz|dokuz|on|\d+)\s+kalem\s*:/i.test(l));
  assert.equal(sayiylaIlan, undefined,
    'kapsam SAYIYLA ilan edilmiş — sayı, kapsam büyüdüğünde sessizce yalan olur (U7 doğuşu): ' + sayiylaIlan);
});

// ── 5 · DUR üç hat ────────────────────────────────────────────────────────────────────────
test('DUR hat-1: .dur varken yeni alt-ajan AÇILMAZ (frenleme hattı)', () => {
  const kok = kurulum({ donem: DONEM_SATIRI(new Date().toISOString()) });
  writeFileSync(join(kok, 'tools', 'sevk', '.dur'), 'uzaktan · posta · deneme\n');
  const r = kos(kok, 'devir-kapisi.sh', [], JSON.stringify({
    tool_name: 'Agent', tool_input: { subagent_type: 'uretici', prompt: 'gorev: G-01' } }));
  assert.equal(r.status, 2, 'DUR varken çağrı kesilmeli');
  assert.match(r.stderr, /DUR işareti var/);
  assert.match(r.stderr, /Yeni alt-ajan AÇILMAZ/);
});

test('DUR hat-1 negatif: .dur yokken çağrı bu kapıdan DUR sebebiyle geçmez', () => {
  const kok = kurulum({ donem: DONEM_SATIRI(new Date().toISOString()) });
  const r = kos(kok, 'devir-kapisi.sh', [], JSON.stringify({
    tool_name: 'Agent', tool_input: { subagent_type: 'uretici', prompt: 'gorev: G-01' } }));
  assert.ok(!/DUR işareti/.test(r.stderr), 'DUR yokken DUR gerekçesi üretilmemeli');
});

test('DUR hat-2: SubagentStop dönüşünde dur-alindi kaydı düşer (görülme anı)', () => {
  const kok = kurulum({ donem: DONEM_SATIRI(new Date().toISOString()) });
  mkdirSync(join(kok, '.claude', 'agents'), { recursive: true });
  writeFileSync(join(kok, '.claude', 'agents', 'uretici.md'), '---\nname: uretici\n---\n');
  writeFileSync(join(kok, 'tools', 'sevk', '.dur'), 'elle · sahip durdurdu\n');
  kos(kok, 'zarf-bicim-kapisi.sh', [], JSON.stringify({
    agent_type: 'uretici',
    last_assistant_message: ['BİTEN: G-01 — iş · kanıt: 00_pano/PANO.md:1', 'ÇATAL: yok',
      'DEĞERLENDİRMEDİKLERİM: yok', 'SIRADAKİ: kapalı', 'TÜRETME-İZİ: yok', 'GERİ-ÇEKİLEN: yok'].join('\n') }));
  const kayitlar = gunluk(kok).filter((j) => j.tip === 'dur-alindi');
  assert.equal(kayitlar.length, 1, 'DUR görülme anı günlüğe geçmeli');
  assert.equal(kayitlar[0].kaynak, 'isaret');
});

// ── 6 · Watchdog / nabız ──────────────────────────────────────────────────────────────────
test('nabız: dönem yokken SESSİZ (sıradan günler etkilenmez) ama canlılık damgası basar', () => {
  const kok = kurulum();
  const r = kos(kok, 'nabiz.sh');
  assert.equal(r.status, 0);
  assert.equal(r.stdout, '', 'dönem yoksa hiçbir şey söylemez');
  assert.ok(existsSync(join(kok, 'tools', 'sevk', '.nabiz-son')), 'canlılık damgası her turda basılır');
  assert.equal(gunluk(kok).length, 0, 'dönem yokken günlüğe satır düşmez');
});

test('nabız durum (b): dönem AÇIK ama HİÇ nabız yok → sessizlik alarmı', () => {
  const eski = new Date(Date.now() - 90 * 60000).toISOString();
  const kok = kurulum({ donem: DONEM_SATIRI(eski) });
  appendFileSync(join(kok, '00_pano', 'zarf-gunlugu.jsonl'),
    JSON.stringify({ surum: 1, ts: eski, donem: 'DONEM-E5', tip: 'donem-acilis' }) + '\n');
  kos(kok, 'nabiz.sh');
  const a = gunluk(kok).filter((j) => j.tip === 'alarm');
  assert.equal(a.length, 1, 'açılıştan başka kayıt yoksa alarm düşmeli');
  assert.equal(a[0].durum, 'SESSIZ_B');
  assert.ok(existsSync(join(kok, 'tools', 'sevk', '.donem-acik')), 'watchdog dönemi DİRİLTMEZ ve göstergeyi silmez');
});

test('nabız durum (a): nabız var ama eşik aşıldı → sessizlik alarmı', () => {
  const eski = new Date(Date.now() - 90 * 60000).toISOString();
  const kok = kurulum({ donem: DONEM_SATIRI(eski) });
  const y = join(kok, '00_pano', 'zarf-gunlugu.jsonl');
  appendFileSync(y, JSON.stringify({ surum: 1, ts: eski, donem: 'DONEM-E5', tip: 'donem-acilis' }) + '\n');
  appendFileSync(y, JSON.stringify({ surum: 1, ts: eski, donem: 'DONEM-E5', tip: 'nabiz' }) + '\n');
  kos(kok, 'nabiz.sh');
  const a = gunluk(kok).filter((j) => j.tip === 'alarm');
  assert.equal(a.length, 1);
  assert.equal(a[0].durum, 'SESSIZ_A');
});

test('nabız: eşik içindeki taze dönemde alarm YOK (yanlış-pozitif freni)', () => {
  const simdi = new Date().toISOString();
  const kok = kurulum({ donem: DONEM_SATIRI(simdi) });
  appendFileSync(join(kok, '00_pano', 'zarf-gunlugu.jsonl'),
    JSON.stringify({ surum: 1, ts: simdi, donem: 'DONEM-E5', tip: 'nabiz' }) + '\n');
  kos(kok, 'nabiz.sh');
  assert.equal(gunluk(kok).filter((j) => j.tip === 'alarm').length, 0);
});

test('nabız: dönem kapandıysa uyanık-tutma savı BIRAKILIR (sav sızıntısı ayrı arızadır)', () => {
  const kok = kurulum();
  writeFileSync(join(kok, 'tools', 'sevk', '.caffeinate-pid'), '999999999\n');
  kos(kok, 'nabiz.sh');
  assert.ok(!existsSync(join(kok, 'tools', 'sevk', '.caffeinate-pid')), 'dönem yokken sav kaydı temizlenir');
});

// ── 7 · Canlılık: işaret dosyası YETMEZ ───────────────────────────────────────────────────
test('canlılık: watchdog işareti şekilsiz / iş yüklü değil → gerçek kutu şartı DÜŞER', () => {
  const kok = kurulum();
  const eksikler = (yaz) => {
    if (yaz !== null) writeFileSync(join(kok, 'tools', 'sevk', 'watchdog-kurulu'), yaz);
    const r = spawnSync('bash', ['-c',
      '. "$1/tools/sevk/ortak.sh"; CLAUDE_PROJECT_DIR="$1" gercek_kutu_eksikleri "$1/tools/sevk"', '_', kok],
      { encoding: 'utf8' });
    return r.stdout;
  };
  assert.match(eksikler(null), /watchdog-kaydi/, 'işaret yokken eksik');
  assert.match(eksikler('launchd: var gibi\n'), /watchdog-kaydinda-etiket-yok/, 'şekilsiz işaret yetmez');
  assert.match(eksikler('etiket=dev.keel.nabiz.olmayan-' + process.pid + '\n'), /watchdog-isi-YUKLU-DEGIL/,
    'yüklü olmayan iş yetmez — dosyada duran ölü kural');
});

test('canlılık: kanal yoklaması yoksa gerçek kutu şartı DÜŞER', () => {
  const kok = kurulum({ kanal: false });
  const r = spawnSync('bash', ['-c',
    'rm -f "$1/tools/sevk/kanal-yokla.sh"; . "$1/tools/sevk/ortak.sh"; CLAUDE_PROJECT_DIR="$1" gercek_kutu_eksikleri "$1/tools/sevk"', '_', kok],
    { encoding: 'utf8' });
  assert.match(r.stdout, /kanal-yoklamasi-yok/);
});

// ── 8 · file-guard kanal dikişi ───────────────────────────────────────────────────────────
test('file-guard: ajan haber/nabız betiklerini çağıramaz; sıradan komutlar serbest', () => {
  const g = (komut) => spawnSync('bash', [join(KOK_REPO, 'tools', 'guard', 'file-guard.sh')], {
    encoding: 'utf8', env: { ...process.env, CLAUDE_PROJECT_DIR: KOK_REPO },
    input: JSON.stringify({ tool_name: 'Bash', tool_input: { command: komut } }) });
  for (const k of ['bash tools/sevk/haber.sh --olay alarm', 'sh ./tools/sevk/nabiz.sh',
                   'echo x && bash tools/sevk/haber.sh --olay donem-bitti']) {
    const r = g(k);
    assert.equal(r.status, 2, 'engellenmeli: ' + k);
    assert.match(r.stderr, /haber kanalı ajan eliyle çağrılamaz/);
  }
  for (const k of ['ls -la', 'grep -rn haber docs/', 'git status']) {
    assert.equal(g(k).status, 0, 'serbest kalmalı: ' + k);
  }
});

// ── 9 · Günlük şeması: yeni tipler ────────────────────────────────────────────────────────
test('zarf-ekle: E5 tipleri kabul edilir, uydurma tip REDDEDİLİR (beyaz liste fail-closed)', () => {
  const kok = kurulum();
  const yaz = (tip) => spawnSync('bash', [join(kok, 'tools', 'sevk', 'zarf-ekle.sh')], {
    encoding: 'utf8', env: { ...process.env, CLAUDE_PROJECT_DIR: kok },
    input: JSON.stringify({ surum: 1, ts: '2026-07-28T10:00:00Z', donem: 'K1', tip }) });
  for (const t of ['haber', 'dur-alindi', 'gorev-sayaci', 'alarm']) {
    assert.equal(yaz(t).status, 0, t + ' kabul edilmeli');
  }
  const kotu = yaz('uydurma-tip');
  assert.equal(kotu.status, 1);
  assert.match(kotu.stderr, /bilinmeyen/);
});

// ═════════════════════════════════════════════════════════════════════════════════════════
// K11 · E5 hüküm turunun üç sert arızası (U26 · U27 · U28). Üçünün ortak kökeni:
// "ÖLÇEMEDİM"i ölçülmüş bir değere çevirmek — sentinel sayı, yalan etiket, sessiz atlama.
// ═════════════════════════════════════════════════════════════════════════════════════════

// ── U28 · Değeri eksik seçenek: `shift 2` sonsuz döngüsü ──────────────────────────────────
test('haber/U28: değersiz kalan seçenek HATA verir; süreç ASILMAZ', () => {
  const kok = kurulum();
  // Seçenek listesi KAYNAKTAN okunur: elle tutulan bir kopya bayatlar ve yeni seçenek
  // testsiz doğar. Kapsam kendini seçer (bekçi madde 24 emsali).
  const kaynak = readFileSync(join(KOK_REPO, 'tools', 'sevk', 'haber.sh'), 'utf8');
  const es = kaynak.match(/^DEGERLI_SECENEKLER='([^']+)'/m);
  assert.ok(es, 'değerli seçenekler TEK listede olmalı — test o çapadan okur');
  const secenekler = es[1].trim().split(/\s+/);
  assert.ok(secenekler.length >= 15, 'liste beklenenden kısa: ' + secenekler.length);

  // KAPSAM KENDİNİ SEÇERKEN KÜÇÜLEBİLİR: liste kaynaktan okunduğu için bir seçenek listeden
  // DÜŞERSE test de onunla birlikte küçülür ve düşüşü göremez (kasıtlı bozmada ölçüldü —
  // bozma YEŞİL kalmıştı). İki bağımsız yüzey karşılıklı sınanır: beyaz liste ve ATAMA dalları.
  // Hangisi kayarsa kümeler ayrışır; tek yönlü bir çapa bu sınıfı hiç göremezdi.
  const atananlar = [...kaynak.matchAll(/^ {4}(--[a-z0-9]+)\) [A-Z0-9_]+="\$DEGER" ;;$/gm)].map((m) => m[1]);
  assert.deepEqual([...secenekler].sort(), [...atananlar].sort(),
    'beyaz liste ile atama dalları AYRIŞTI — biri diğerine sessizce ekleniyor/düşüyor');
  // Ayrışma çalışma anında da SESLİ olmalı: iç tutarsızlık dalı arayüzün ikinci hattıdır.
  assert.match(kaynak, /\*\) hata "iç tutarsızlık: \$SEC beyaz listede ama atanmıyor/,
    'atama case\'inin fail-closed dalı kalkmış');

  for (const s of secenekler) {
    const r = spawnSync('bash', [join(kok, 'tools', 'sevk', 'haber.sh'), s],
      { encoding: 'utf8', timeout: 10000, env: { ...process.env, CLAUDE_PROJECT_DIR: kok } });
    assert.equal(r.signal, null, s + ': süreç zaman aşımıyla ÖLDÜRÜLDÜ — sonsuz döngü yaşıyor');
    assert.equal(r.status, 1, s + ': değersiz seçenek 1 dönmeli');
    assert.match(r.stderr, /değersiz kaldı/, s + ': sebep söylenmeli');
  }
  // Beyaz liste ile atama listesi AYRIŞMAZ: her seçenek değeriyle verildiğinde atanır.
  for (const s of secenekler) {
    const r = haber(kok, ['--olay', 'alarm', '--cins', 'kanal', s, 'x', '--prova']);
    assert.doesNotMatch(r.stderr || '', /iç tutarsızlık/, s + ' beyaz listede ama atanmıyor');
  }
  // Değersiz bayraklar listeye SIZMAZ (sızsalardı `--prova` değer isterdi).
  for (const bayrak of ['--prova', '--sayacsiz']) {
    assert.ok(!secenekler.includes(bayrak), bayrak + ' değer isteyen seçenek değildir');
  }
  // Tanınmayan argüman hâlâ KENDİ sebebini söyler (değersizlik mesajının arkasına saklanmaz).
  const t = spawnSync('bash', [join(kok, 'tools', 'sevk', 'haber.sh'), '--govde'],
    { encoding: 'utf8', timeout: 10000, env: { ...process.env, CLAUDE_PROJECT_DIR: kok } });
  assert.match(t.stderr, /tanınmayan argüman/);
});

// ── U26 · "Ölçemedim" ile "ölçtüm, kötü" ayrımı ───────────────────────────────────────────
const zehirliBin = (kok) => {                 // PATH'e çıplak `node` çağrısını ÖLDÜREN bir shim
  const d = join(kok, 'zehirli-bin');
  mkdirSync(d, { recursive: true });
  writeFileSync(join(d, 'node'), '#!/bin/sh\nexit 66\n');
  chmodSync(join(d, 'node'), 0o755);
  return d;
};
const kabukta = (kok, govde, env = {}) => spawnSync('bash', ['-c',
  '. "$1/tools/sevk/ortak.sh"; ' + govde, '_', kok],
  { encoding: 'utf8', env: { ...process.env, ...env } });

test('ortak/U26: nabız yaşı ÖLÇÜLEMEYİNCE sayı basmaz — 999 sentineli kalktı', () => {
  const kok = kurulum();
  const damga = join(kok, 'tools', 'sevk', '.nabiz-son');
  const olc = (env = {}, on = '') => {
    const r = kabukta(kok, on + 'nabiz_yasi_dk "$1/tools/sevk/.nabiz-son"; printf "|%s" "$?"', env);
    const [cikti, kod] = r.stdout.split('|');
    return { cikti, kod };
  };

  writeFileSync(damga, new Date(Date.now() - 5 * 60000).toISOString() + '\n');
  const a = olc();
  assert.equal(a.kod, '0', 'taze damga ÖLÇÜLEBİLMELİ');
  assert.ok(Number(a.cikti) >= 4 && Number(a.cikti) <= 7, 'yaş ~5 dk olmalı, ölçülen: ' + a.cikti);

  // node HİÇ bulunamıyor → 2 (ölçülemedi) ve çıktı BOŞ. Eskiden burası 999 basıyordu ve
  // 999 dakikalık bir "yaş" gibi karşılaştırmaya giriyordu.
  const b = olc({}, 'node_bul() { return 1; }; NODE_BIN=""; ');
  assert.equal(b.kod, '2', 'node yoksa ölçülemedi (2) dönmeli');
  assert.equal(b.cikti, '', 'ölçülemeyen yaş SAYI basmaz');

  // Damga çözülemiyor → 3 (ayrı sınıf: dosya var ama tarih değil)
  writeFileSync(damga, 'bu bir tarih değil\n');
  assert.equal(olc().kod, '3', 'bozuk damga ayrı sınıftır');

  // ÇIPLAK `node` ÇAĞRISI KALKTI: PATH'teki node zehirliyken NODE_BIN'den ölçer.
  // Arızanın canlı hâli tam buydu — launchd/GUI oturumunun PATH'i dardır.
  writeFileSync(damga, new Date(Date.now() - 7 * 60000).toISOString() + '\n');
  const d = olc({ PATH: zehirliBin(kok) + ':' + process.env.PATH, NODE_BIN: process.execPath });
  assert.equal(d.kod, '0', 'NODE_BIN verilmişken PATH zehirli olsa da ölçmeli');
  assert.ok(Number(d.cikti) >= 6 && Number(d.cikti) <= 9, 'yaş ~7 dk olmalı, ölçülen: ' + d.cikti);
});

test('ortak/U26: gerçek kutu şartı, ölçemediğinde "BAYAT" DEMEZ', () => {
  const kok = kurulum();
  writeFileSync(join(kok, 'tools', 'sevk', 'watchdog-kurulu'), 'etiket=dev.keel.nabiz.k11-test\n');
  writeFileSync(join(kok, 'tools', 'sevk', '.nabiz-son'), new Date().toISOString() + '\nhal=TAM\n');
  // launchctl dalı testte HİÇ koşmuyordu (kapının kör kipi): yükleme sorgusu artık kendi
  // fonksiyonunda, böylece kuyruğun tamamı ölçülebiliyor.
  const YUKLU = 'watchdog_isi_yuklu() { return 0; }; ';
  const eksik = (on = '') => kabukta(kok, YUKLU + on +
    'CLAUDE_PROJECT_DIR="$1" gercek_kutu_eksikleri "$1/tools/sevk"').stdout;

  assert.doesNotMatch(eksik(), /watchdog-nabzi/, 'taze damga + yüklü iş → nabız kalemi eksik değil');

  const kor = eksik('node_bul() { return 1; }; NODE_BIN=""; ');
  assert.match(kor, /watchdog-nabzi-OLCULEMEDI/, 'ölçülemeyen nabız ADIYLA söylenir');
  assert.doesNotMatch(kor, /BAYAT/, 'ölçülemeyene BAYAT denmez');
  assert.doesNotMatch(kor, /999/, '999 sentineli sahip yüzeyine sızmaz');

  writeFileSync(join(kok, 'tools', 'sevk', '.nabiz-son'),
    new Date(Date.now() - 120 * 60000).toISOString() + '\nhal=TAM\n');
  assert.match(eksik(), /watchdog-nabzi-BAYAT\(1[12][0-9]dk\)/, 'GERÇEKTEN bayat nabız hâlâ bayattır');
});

// ── U32 · CANLILIK DAMGASI İŞİN SONUNDA BASILIR ───────────────────────────────────────────
// Damga eskiden nabiz.sh'ın İLK iş satırıydı ve "koştum" diyordu, "işimi yaptım" demiyordu.
// İki satır sonra sessizce çıkan bir watchdog üç tüketicinin gözünde YEŞİL görünüyordu.
// Aşağıdaki beş kol o hâllerin her birini ADIYLA ölçer; altıncısı ters yöndür (yanlış-pozitif
// kapısı) — o olmadan "kapı her şeye EKSİK basıyor" da bu testlerden geçerdi.
const damgaOku = (kok) => readFileSync(join(kok, 'tools', 'sevk', '.nabiz-son'), 'utf8');

test('nabız/U32: yapacak iş yokken damga TAM — ama ortak.sh OKUNAMIYORSA taze damga TAM DEMEZ', () => {
  const kok = kurulum();
  kos(kok, 'nabiz.sh');
  assert.match(damgaOku(kok), /^\d{4}-\d{2}-\d{2}T[\d:]+Z\nhal=TAM\n$/,
    'dönem yoksa watchdog yapabileceğini yapmıştır: TAM');

  // Arızanın canlı hâli: ortak.sh okunamıyor → betik 2. satırda çıkıyor, eskiden damga TAZEydi.
  chmodSync(join(kok, 'tools', 'sevk', 'ortak.sh'), 0o000);
  kos(kok, 'nabiz.sh');
  chmodSync(join(kok, 'tools', 'sevk', 'ortak.sh'), 0o644);
  const d = damgaOku(kok);
  assert.match(d, /hal=EKSIK/, 'ortak.sh okunamayan watchdog işini YAPAMAZ');
  assert.match(d, /sebep=ortak\.sh-okunmuyor/, 'sebep ADIYLA yazılır — sahip oraya bakar');
  assert.match(d.split('\n')[0], /^\d{4}-\d{2}-\d{2}T/, 'ilk satır sözleşmesi (ISO damga) korunur');
});

test('nabız/U32: "dönem yok" ile "göstergeyi okuyamadım" aynı damgaya düşmez', () => {
  const kok = kurulum();
  mkdirSync(join(kok, 'tools', 'sevk', '.donem-acik'), { recursive: true });  // gösterge BOZUK
  kos(kok, 'nabiz.sh');
  assert.match(damgaOku(kok), /hal=EKSIK\nsebep=donem-gostergesi-bozuk/,
    'gösterge bozukken 1-4 numaralı işlerin hiçbiri koşamaz; damga bunu söylemeli');
});

test('nabız/U32: node yoksa 0. iş (uzaktan cevap) hiç koşamaz ve damga bunu ADIYLA söyler', () => {
  const kok = kurulum();
  // ortak.sh KOPYASINA override eklenir: nabiz.sh onu source ettiği için sonraki tanım kazanır.
  // Bu makinede /opt/homebrew/bin/node mutlak yolla bulunuyor; node'u PATH'ten gizlemek yetmez.
  appendFileSync(join(kok, 'tools', 'sevk', 'ortak.sh'), '\nnode_bul() { NODE_BIN=""; return 1; }\n');
  kos(kok, 'nabiz.sh');
  assert.match(damgaOku(kok), /hal=EKSIK\nsebep=node-yok/, 'node yoksa cevap hattı sessizce ölür');
});

test('nabız/U32: beklenmedik ölümde damga TAM DEMEZ (tuzağın varsayılanı eksiktir)', () => {
  // Damgayı ÇIKIŞ TUZAĞI basar. Bu kol tuzağın varsayılanını ölçer: betik hiç annotate
  // edilmemiş bir yerden çıkarsa (çökme, ya da ileride eklenen yeni bir sessiz `exit 0`)
  // damga kendiliğinden EKSİK basar — sessiz kaçış yolu açmak ekstra bir satır ister.
  const kok = kurulum();
  appendFileSync(join(kok, 'tools', 'sevk', 'ortak.sh'), '\nexit 7\n');
  const r = kos(kok, 'nabiz.sh');
  assert.equal(r.status, 7, 'betik gerçekten yarıda öldü');
  assert.match(damgaOku(kok), /hal=EKSIK\nsebep=yarim-kaldi/, 'yarıda ölen koşu TAM damga basamaz');
});

test('ortak/U32: taze ama EKSİK damga gerçek kutu dönemini AÇTIRMAZ (hâlin tüketicisi var)', () => {
  const kok = kurulum();
  writeFileSync(join(kok, 'tools', 'sevk', 'watchdog-kurulu'), 'etiket=dev.keel.nabiz.u32-test\n');
  const damga = join(kok, 'tools', 'sevk', '.nabiz-son');
  const YUKLU = 'watchdog_isi_yuklu() { return 0; }; ';
  const eksik = () => kabukta(kok, YUKLU + 'CLAUDE_PROJECT_DIR="$1" gercek_kutu_eksikleri "$1/tools/sevk"').stdout;
  const taze = () => new Date().toISOString();

  writeFileSync(damga, taze() + '\nhal=EKSIK\nsebep=node-yok\n');
  const e = eksik();
  assert.match(e, /watchdog-KOSUYOR-AMA-ISINI-YAPAMIYOR\(node-yok\)/, 'taze damga canlılık kanıtı DEĞİLDİR');
  assert.doesNotMatch(e, /watchdog-nabzi-BAYAT/, 'taze nabza BAYAT denmez — ayrı sorular, ayrı adlar');

  // HÂL SATIRI HİÇ YOKSA: eski bir nabiz.sh koşuyordur. "Bilinmiyor" bir ölçüm değeri değildir.
  writeFileSync(damga, taze() + '\n');
  assert.match(eksik(), /watchdog-damgasi-HALSIZ\(eski-nabiz\.sh-kosuyor\)/, 'hâlsiz damga kendi adıyla söylenir');

  // TERS YÖN: TAM damgada bu kalemlerin HİÇBİRİ basılmaz.
  writeFileSync(damga, taze() + '\nhal=TAM\n');
  const t = eksik();
  assert.doesNotMatch(t, /KOSUYOR-AMA-ISINI-YAPAMIYOR/, 'TAM damgada eksik uydurulmaz');
  assert.doesNotMatch(t, /HALSIZ/, 'TAM damgada hâlsizlik uydurulmaz');
});

// ── U27 · Uzaktan DUR: SAHTE IMAP TAŞIYICISI ──────────────────────────────────────────────
// E5 kendi sınırını ilan etmişti: "canlı IMAP hiç koşulmadığı için hiçbir test bunu göremezdi".
// U27 tam o sınırın faturasıydı. Taşıyıcı (curl) ve parola kaynağı (security) PATH'te
// sahtelenir; DUR hattının TAMAMI ağsız koşar ve gönderilen IMAP isteği ölçülebilir hâle gelir.
// Sahte sunucu curl'ün ÖLÇÜLMÜŞ sınırını da taklit eder: BODY.PEEK üretilemediği için
// ÇEKİLEN İLETİ \Seen İŞARETLENİR. Kendini körleştirme ancak bu taklitle görünür.
const SAHTE_CURL = `
import { readFileSync, writeFileSync, appendFileSync } from "node:fs";
const KUTU = process.env.SAHTE_KUTU, LOG = process.env.SAHTE_LOG;
let konf = ""; try { konf = readFileSync(0, "utf8"); } catch {}
appendFileSync(LOG, konf + "\\n--- ---\\n");
const kutu = JSON.parse(readFileSync(KUTU, "utf8"));
const url = (konf.match(/^url = "([^"]*)"/m) || [])[1] || "";
const istekHam = (konf.match(/^request = "(.*)"$/m) || [])[1] || "";
if (istekHam) {
  // -K KACISLARI CURL GIBI COZULUR (hasim bulgusu): eski hal TUM ters bolulari SILIYORDU,
  // yani cift kacirilmis bir arama dizesi de dogru sayiliyordu ve DUR hatti regresyona KORDU.
  // Silmek cozmek degildir.
  const istek = istekHam.replace(/\\\\(.)/g, (_, k) => ({ n: "\\n", r: "\\r", t: "\\t", v: "\\v" }[k] || k));
  let aday = kutu;
  if (/\\bUNSEEN\\b/.test(istek)) aday = aday.filter((m) => !m.seen);
  const kEs = istek.match(/HEADER Subject "([^"]*)"/);
  if (kEs) { const k = kEs[1].toLowerCase(); aday = aday.filter((m) => (m.subject || "").toLowerCase().includes(k)); }
  const sEs = istek.match(/\\bSINCE ([0-9]{1,2}-[A-Za-z]{3}-[0-9]{4})\\b/);
  if (sEs) { const t = Date.parse(sEs[1].replace(/-/g, " ") + " 00:00:00Z"); aday = aday.filter((m) => Date.parse(m.date) >= t); }
  process.stdout.write("* SEARCH " + aday.map((m) => m.uid).join(" ") + "\\r\\n");
  process.exit(0);
}
const uEs = url.match(/;UID=(\\d+)/);
if (uEs) {
  const m = kutu.find((x) => String(x.uid) === uEs[1]);
  if (!m) process.exit(0);
  const ilkti = !m.seen;
  m.seen = true;                                  // curl BODY.PEEK ÜRETEMEZ (ölçülmüş sınır)
  writeFileSync(KUTU, JSON.stringify(kutu));
  if (m.bozukIlkCekim && ilkti) process.exit(0);  // ağ tökezlemesi: sunucu işaretledi, yanıt geldi sayılmaz
  process.stdout.write("From: " + m.from + "\\r\\nDate: " + m.date + "\\r\\n\\r\\n");
}
`;
function sahteImap(kok, iletiler) {
  const bin = join(kok, 'sahte-bin');
  mkdirSync(bin, { recursive: true });
  const kutuYolu = join(kok, 'sahte-imap-kutu.json');
  const logYolu = join(kok, 'sahte-imap-istek.log');
  writeFileSync(kutuYolu, JSON.stringify(iletiler));
  writeFileSync(logYolu, '');
  const js = join(kok, 'sahte-curl.mjs');
  writeFileSync(js, SAHTE_CURL);
  writeFileSync(join(bin, 'curl'),
    `#!/bin/sh\nexec ${JSON.stringify(process.execPath)} ${JSON.stringify(js)} "$@"\n`);
  chmodSync(join(bin, 'curl'), 0o755);
  writeFileSync(join(bin, 'security'), '#!/bin/sh\nprintf "sahte-parola\\n"\n');
  chmodSync(join(bin, 'security'), 0o755);
  return {
    env: { PATH: bin + ':' + process.env.PATH, SAHTE_KUTU: kutuYolu, SAHTE_LOG: logYolu },
    kutu: () => JSON.parse(readFileSync(kutuYolu, 'utf8')),
    istekler: () => readFileSync(logYolu, 'utf8'),
  };
}
const ALICI = 'deneme@ornek.gecersiz';
const durKurulum = (damgaMs) => {
  const damga = new Date(damgaMs).toISOString();
  const kok = kurulum({ donem: DONEM_SATIRI(damga) });
  appendFileSync(join(kok, '00_pano', 'zarf-gunlugu.jsonl'),
    JSON.stringify({ surum: 1, ts: new Date().toISOString(), donem: 'DONEM-E5', tip: 'nabiz' }) + '\n');
  return kok;
};
const nabizKos = (kok, imap) => spawnSync('bash', [join(kok, 'tools', 'sevk', 'nabiz.sh')],
  { encoding: 'utf8', timeout: 30000, env: { ...process.env, ...imap.env, CLAUDE_PROJECT_DIR: kok } });

test('nabız/U27: DUR araması OKUNDU-BAYRAĞINA bağlı değil — çekim yarıda kalsa da ikinci tur bulur', () => {
  const kok = durKurulum(Date.now() - 60 * 60000);
  const imap = sahteImap(kok, [{
    uid: 7, subject: 'KEEL DUR', from: ALICI, date: new Date().toUTCString(),
    seen: false, bozukIlkCekim: true,
  }]);
  const durYolu = join(kok, 'tools', 'sevk', '.dur');

  nabizKos(kok, imap);                       // 1. tur: çekim yarıda kalır, sunucu \Seen işaretler
  assert.ok(!existsSync(durYolu), 'yarım çekimde DUR yazılmaz');
  assert.equal(imap.kutu()[0].seen, true, 'sahte sunucu curl sınırını taklit etmeli (\\Seen)');

  nabizKos(kok, imap);                       // 2. tur: ileti ARTIK Seen — arama onu hâlâ bulmalı
  assert.ok(existsSync(durYolu), 'ikinci turda DUR bulunmalı: arama kendini kör etmez');
  assert.match(readFileSync(durYolu, 'utf8'), /uzaktan · posta/);
  assert.ok(gunluk(kok).some((j) => j.tip === 'dur-alindi'), 'DUR günlüğe düşer');
  assert.doesNotMatch(imap.istekler(), /UNSEEN/, 'arama UNSEEN ile daraltılmaz');
});

test('nabız/U27: dönem açılışından ESKİ bir DUR postası bu koşuyu durdurmaz', () => {
  // İKİ KADEME ayrı ayrı ölçülür: SINCE bir GÜN çözünürlüğünde KABA ön-elemedir, hükmü
  // iletinin kendi Date başlığı verir. Tek bir örnekle ikisi ayırt edilemezdi.
  // (a) Kaba eleme — üç gün önceki posta sunucudan hiç dönmez.
  const eski = durKurulum(Date.now() - 60 * 60000);          // dönem 1 saat önce açıldı
  const imapEski = sahteImap(eski, [{
    uid: 3, subject: 'KEEL DUR', from: ALICI, seen: false,
    date: new Date(Date.now() - 3 * 24 * 3600000).toUTCString(),
  }]);
  nabizKos(eski, imapEski);
  assert.ok(!existsSync(join(eski, 'tools', 'sevk', '.dur')), 'üç gün önceki posta bu koşuyu durduramaz');
  assert.match(imapEski.istekler(), /SINCE [0-9]{2}-[A-Z][a-z]{2}-[0-9]{4}/, 'arama zamanla sınırlanır');

  // (b) İNCE hüküm — SINCE penceresinden GEÇEN ama dönem açılmadan ÖNCE yazılmış posta.
  // Gerçek hâli: bir önceki koşudan kalmış, sahibin bu gece için yazmadığı bir DUR.
  const once = durKurulum(Date.now() - 60 * 60000);
  const imapOnce = sahteImap(once, [{
    uid: 4, subject: 'KEEL DUR', from: ALICI, seen: false,
    date: new Date(Date.now() - 3 * 3600000).toUTCString(),   // dönemden 2 saat önce
  }]);
  nabizKos(once, imapOnce);
  assert.ok(!existsSync(join(once, 'tools', 'sevk', '.dur')), 'koşu başlamadan önceki posta bu koşuyu durduramaz');
  assert.ok(gunluk(once).some((j) => j.cins === 'dur-postasi-eski'), 'eleme İZ BIRAKIR, sessiz değildir');
});

test('nabız/U27: taze DUR postası ateşler; sahte gönderen REDDEDİLİR', () => {
  const taze = () => new Date().toUTCString();
  const k1 = durKurulum(Date.now() - 60 * 60000);
  nabizKos(k1, sahteImap(k1, [{ uid: 5, subject: 'KEEL DUR', from: ALICI, date: taze(), seen: false }]));
  assert.ok(existsSync(join(k1, 'tools', 'sevk', '.dur')), 'taze ve doğru gönderen DUR yazar');

  const k2 = durKurulum(Date.now() - 60 * 60000);
  nabizKos(k2, sahteImap(k2, [{ uid: 5, subject: 'KEEL DUR', from: 'saldirgan@kotu.gecersiz', date: taze(), seen: false }]));
  assert.ok(!existsSync(join(k2, 'tools', 'sevk', '.dur')), 'başka adresten gelen DUR yazmaz');
});

test('nabız/U27: IMAP ucu doldurulmamışsa uzaktan DUR SESSİZCE atlanmaz', () => {
  const kok = durKurulum(Date.now() - 60 * 60000);
  writeFileSync(join(kok, 'tools', 'sevk', 'kanal.conf'),
    'SMTP_SUNUCU=smtp.ornek.gecersiz\nHESAP=' + ALICI + '\nALICI=' + ALICI + '\nDUR_KONU=KEEL DUR\n');
  const imap = sahteImap(kok, []);
  nabizKos(kok, imap);
  const b = gunluk(kok).filter((j) => j.cins === 'uzaktan-dur-kapali');
  assert.equal(b.length, 1, 'eksik IMAP ucu ADIYLA bildirilir');
  assert.match(b[0].detay, /IMAP_SUNUCU/);
  nabizKos(kok, imap);
  assert.equal(gunluk(kok).filter((j) => j.cins === 'uzaktan-dur-kapali').length, 1,
    'dönem başına BİR iz — 15 dakikada bir tekrarlayan bulgu günlüğü boğar');
});

// ── U48 · U49 · KOŞUDA BULUNDU: aynı kökenin nabiz.sh içindeki iki kardeşi ─────────────────
// U26 kapanırken köken turu iki ikizini buldu. U26 "okuyamadım"ı bir SAYIYA çeviriyordu;
// bunlar aynı hatanın iki yarısı: (U48) sentinel yine bir ölçümmüş gibi karşılaştırmaya girer
// ve GERİ ALINAMAZ bir sonuç doğurur · (U49) üçüncü hâl DOĞRU üretilir ama HİÇBİR tüketiciye
// bağlanmamıştır — üretmek yetmez, bağlamak gerekir.
const capaSatiri = (ts) => JSON.stringify({
  kod: 'K7MN2', msgid: '<keel-K7MN2@ornek.gecersiz>', catal: 'Ç-04', donem: 'DONEM-E5',
  kutu: 'KT-900', ts, durum: 'acik', alarm: '', bicimsiz: 0,
  secenekler: ['evet', 'hayir'], gorulen: [],
}) + '\n';
const cevapKurulum = (ts) => {
  const kok = durKurulum(Date.now() - 60 * 60000);
  writeFileSync(join(kok, 'tools', 'sevk', 'kanal.conf'),
    'SMTP_SUNUCU=smtp.ornek.gecersiz\nHESAP=' + ALICI + '\nALICI=' + ALICI + '\n' +
    'IMAP_SUNUCU=imap.ornek.gecersiz\nDUR_KONU=KEEL DUR\nCEVAP_KANALI=acik\n');
  writeFileSync(join(kok, 'tools', 'sevk', '.cevap-capa'), capaSatiri(ts));
  return kok;
};
const capa = (kok) => JSON.parse(readFileSync(join(kok, 'tools', 'sevk', '.cevap-capa'), 'utf8')
  .split('\n').filter(Boolean)[0]);

test('nabız/U48: ÇÖZÜLEMEYEN damga "ömrü doldu" sayılmaz — canlı kod düşürülmez', () => {
  // Geri alınamazlık bu satırın tamamı: kod düşerse sahip telefondan ARTIK cevaplayamaz ve
  // üstüne "cevap süren doldu" postası alır. Belirsizlikte pahalı olan taraf DÜŞÜRMEKTİR.
  const kok = cevapKurulum('BU-BIR-TARIH-DEGIL');
  nabizKos(kok, sahteImap(kok, []));
  assert.equal(capa(kok).durum, 'acik', 'ölçülemeyen yaş yüzünden kod DÜŞÜRÜLMEMELİ');
  const b = gunluk(kok).filter((j) => j.cins === 'cevap-yasi-olculemedi');
  assert.equal(b.length, 1, 'ölçülemeyen yaş ADIYLA bildirilir');
  nabizKos(kok, sahteImap(kok, []));
  assert.equal(gunluk(kok).filter((j) => j.cins === 'cevap-yasi-olculemedi').length, 1,
    'kod başına BİR iz — her turda tekrarlayan bulgu günlüğü boğar');

  // Karşı örnek: GERÇEKTEN ömrü dolmuş kod hâlâ düşer (fren körelmedi).
  const eski = cevapKurulum(new Date(Date.now() - 100 * 3600000).toISOString());
  nabizKos(eski, sahteImap(eski, []));
  assert.equal(capa(eski).durum, 'suresi-doldu', 'gerçekten dolan ömür hâlâ düşer');
});

test('nabız/U49: ölçülemeyen sessizlik durumu SESSİZ geçmez (üçüncü hâl bağlandı)', () => {
  // Gösterge damgasız + günlük yok ⇒ "yapı sustu mu?" sorusu ÖLÇÜLEMEZ. Watchdog'un tek işi
  // sessizliği bildirmektir; onu ölçemediğini bildirmemek, tam da var oluş sebebinde kör olmaktır.
  const kok = kurulum({ donem: 'DONEM-E5\tKT-900\tyapim\tgercek\n' });   // ikinci satır YOK
  const r = nabizKos(kok, sahteImap(kok, []));
  assert.equal(r.status, 0);
  const b = gunluk(kok).filter((j) => j.cins === 'nabiz-olculemedi');
  assert.equal(b.length, 1, 'ölçülemeyen durum ADIYLA günlüğe düşer');
  assert.ok(gunluk(kok).some((j) => j.tip === 'alarm' && j.cins === 'nabiz-olculemedi'),
    'sahibe de gider: ölçemediğini söylemeyen watchdog yeşil basıyor demektir');
  // GÜNLÜK SATIRI POSTAYI ÖLÇMEZ: o satır haber çağrısından ÖNCE düşer, yani cins beyaz
  // listeden çıksa bile yeşil kalırdı (kasıtlı bozmada ölçüldü). Postanın arayüzden GEÇTİĞİNİ
  // ölçen tek mekanik iz, haber.sh'ın program-kusuru bulgusunun DÜŞMEMİŞ olmasıdır.
  assert.ok(!gunluk(kok).some((j) => j.cins === 'haber-cagrisi-gecersiz'),
    'alarm cinsi haber.sh beyaz listesinde yok — posta izsiz düşüyor');
});

// ═════════════════════════════════════════════════════════════════════════════════════════
// K23 · ÖBEK 1 — tavan/kırpma ailesi (U29 U30 U31 U38). Aynı kusurun ÜÇ kopyası + süzgeç
// sonrası yeniden sızdırma. ÖLÇÜLDÜ 2026-08-08 (köken turu): ilan "1500 bayt" ama `${#M}`
// KARAKTER sayıyor (1800 Türkçe karakter = 3300 B, tavan onu 1800 sanıyor) · `cut -c1-1500`
// çıktısı 2751 B veriyor · üç satırlık 2702 karakterlik gövde HİÇ kesilmeden geçiyor ve
// etiket "1202 karakter kesildi" diyor. Kesilmemiş metne "kesildi" demek düz yalandır.
// ═════════════════════════════════════════════════════════════════════════════════════════
const bayt = (s) => Buffer.byteLength(s, 'utf8');

test('ortak/U29: kırpma BAYT sayar, çok satırda keser, karakteri ikiye BÖLMEZ', () => {
  const kok = kurulum();
  // ÇIKTI BAYT OLARAK ALINIR, dize olarak DEĞİL. Node stdout'u utf8 çözerken yarım kalmış bir
  // baytı U+FFFD'ye çevirir ve o karakter 3 bayta genişler: bayt ölçen bir testi dize üstünden
  // yapmak, ölçtüğünü sandığın şeyi ölçmemektir (ilk yazımda 2 bayt kaydı, ölçüldü).
  const kirpHam = (metin, tavan) => spawnSync('bash', ['-c',
    '. "$1/tools/sevk/ortak.sh"; kirp_bayt "$(cat)" "$2"', '_', kok, String(tavan)],
    { input: Buffer.from(metin, 'utf8') }).stdout;
  const kirp = (metin, tavan) => kirpHam(metin, tavan).toString('utf8');

  // (a) Tavanın ALTINDA hiçbir şey olmaz — etiket de basılmaz.
  const kisa = 'kısa metin';
  assert.equal(kirp(kisa, 1500), kisa, 'tavan altındaki metne dokunulmaz');

  // (b) ÇOK SATIRLI gövde artık gerçekten kesilir (eski cut -c her satırı ayrı kesiyordu).
  const cok = ['a'.repeat(900), 'b'.repeat(900), 'c'.repeat(900)].join('\n');
  const r = kirp(cok, 1500);
  assert.ok(bayt(r) < bayt(cok), 'çok satırlı gövde KESİLMELİ');
  assert.match(r, /\[\d+ bayt kesildi\]/, 'kesinti ADIYLA ve MİKTARIYLA söylenir');

  // (c) Etiketin söylediği sayı ÖLÇÜLEN sayıdır — uydurma değil.
  const es = r.match(/\[(\d+) bayt kesildi\]/);
  const govde = r.slice(0, r.indexOf('… ['));
  assert.equal(Number(es[1]), bayt(cok) - bayt(govde), 'etiket ölçülen kesintiyi söylemeli');

  // (c2) ETİKETİN BİRİMİ DE ÖLÇÜLÜR — ve ASCII'de değil, ÇOK BAYTLIDA. Kusurun kendisi
  // birimdi: `${#M}` karakter sayardı ve ASCII'de karakter=bayt olduğu için tek-baytlı bir
  // test bu hatayı HİÇ göremezdi (kasıtlı bozmada ölçüldü: bozma yeşil kalmıştı).
  const turkceUzun = 'ğüşiöç'.repeat(400);                 // 2400 karakter = 4400 bayt
  const ham = kirpHam(turkceUzun, 1500);
  const etiketYeri = ham.indexOf(Buffer.from('… [', 'utf8'));
  assert.ok(etiketYeri > 0, 'çok baytlı metin de kesildiğini söylemeli');
  const esT = ham.subarray(etiketYeri).toString('utf8').match(/\[(\d+) bayt kesildi\]/);
  assert.ok(esT, 'etiket okunabilmeli');
  assert.equal(Number(esT[1]), bayt(turkceUzun) - etiketYeri,
    'etiket BAYT sayar; karakter sayarsa bu sayı tutmaz');
  // Karakter sayan bir kırpma burada ~1500 karakter (=~2750 bayt) keserdi; bayt sayan ~2900.
  assert.ok(Number(esT[1]) > 2800, 'kesinti gerçek BAYT boyutundan hesaplanmalı: ' + esT[1]);

  // (d) ÇOK BAYTLI karakter ikiye BÖLÜNMEZ: bayt sınırında kesmek satırı bozar.
  for (const tavan of [101, 102, 103, 104, 105]) {
    const turkce = 'ğüşiöçĞÜŞİÖÇ'.repeat(40);
    const k = kirp(turkce, tavan);
    const govdeK = k.slice(0, k.indexOf('… ['));
    assert.ok(bayt(govdeK) <= tavan, `tavan ${tavan}: gövde tavanı aşmamalı (${bayt(govdeK)})`);
    assert.ok(!govdeK.includes('�'), `tavan ${tavan}: karakter ikiye bölünmüş`);
  }
});

test('haber/U29-U30: alan ve gövde tavanları TEK EVDEN geçer; yalancı etiket yok', () => {
  const kok = kurulum();
  // Tek satır, tavanın ALTINDA ama karakter sayısı yüksek: eski kod burada "kesildi" derdi.
  const r = haber(kok, ['--olay', 'alarm', '--cins', 'kanal', '--donem', 'K1', '--kutu', 'KT-900',
                        '--detay', 'kısa ve temiz bir ayrıntı', '--prova']);
  assert.equal(r.status, 0);
  assert.doesNotMatch(r.stdout, /kesildi/, 'kesilmemiş metne "kesildi" denmez');

  // Gerçekten büyük alan kesilir ve KESİLDİĞİNİ söyler.
  const b = haber(kok, ['--olay', 'alarm', '--cins', 'kanal', '--donem', 'K1', '--kutu', 'KT-900',
                        '--detay', 'x'.repeat(4000), '--prova']);
  assert.match(b.stdout, /\[\d+ bayt kesildi\]/);

  // GÖVDE TAVANI FİİLEN ULAŞILABİLİR OLMALI. Kasıtlı bozma bunu ortaya çıkardı: alan tavanı
  // (1500 B) kırpılan alanlara uygulandığı için üç blok toplasa 4.5 KB eder ve 8 KB gövde
  // tavanı O YOLDAN HİÇ ateşlenmez. Tavana giden gerçek yol KIRPILMAYAN alanlardır — `--kutu`
  // kırpma listesinde değildir ve hem konuya hem gövdeye tavansız giriyordu (U50 buradan çıktı).
  const devKutu = 'K'.repeat(20000);
  const c = haber(kok, ['--olay', 'donem-bitti', '--donem', 'D'.repeat(20000), '--kutu', devKutu,
                        '--blok1', 'a', '--blok2', 'b', '--blok3', 'c', '--prova']);
  assert.equal(c.status, 0);
  const govde = c.stdout.slice(c.stdout.indexOf('\n\n') + 2);
  assert.ok(bayt(govde) <= 8192 + 60, 'gövde 8 KB tavanına FİİLEN inmeli, ölçülen: ' + bayt(govde));
  assert.match(govde, /\[\d+ bayt kesildi\]/, 'gövde kesintisi de söylenir');

  // U50 · KONU (Subject) tavansızdı. RFC 5322 başlık satırına 998 bayt sınırı koyar; aşan
  // Subject'i sunucular öngörülemez biçimde kırpar ya da iletiyi reddeder.
  const konu = c.stdout.split('\n').find((l) => l.startsWith('Subject: '));
  assert.ok(konu, 'Subject satırı olmalı');
  assert.ok(bayt(konu) < 998, 'Subject RFC sınırının altında kalmalı, ölçülen: ' + bayt(konu));
  assert.match(konu, /\[\d+ bayt kesildi\]/, 'konu kesintisi de sessiz değildir');
});

test('sevk/U31: SABAH.md sessizce kırpılmaz — kesinti sahibe SÖYLENİR', () => {
  const kok = kurulum();
  const sabah = join(kok, '00_pano', 'SABAH.md');
  const uzun = Array.from({ length: 60 }, (_, i) => 'kayıt ' + i + ': ' + 'z'.repeat(200)).join('\n');
  spawnSync('bash', ['-c',
    '. "$1/tools/sevk/ortak.sh"; DIZIN="$1/tools/sevk"; KOK="$1"; ' +
    'DONEM_KUTU=KT-900; DONEM_ID=K1; . /dev/stdin', '_', kok],
    { encoding: 'utf8', input: 'kapanis_yuzeyi_test() { :; }' });
  // Yüzeyi doğrudan sevk.sh üzerinden kurmak dönem gerektirir; burada TAVAN kapısının kendisi
  // ölçülür: aynı tek ev, aynı etiket sözleşmesi. Sessiz kırpma bu evde ARTIK YOK.
  const r = spawnSync('bash', ['-c',
    '. "$1/tools/sevk/ortak.sh"; kirp_bayt "$(cat)" 4096 > "$2"', '_', kok, sabah],
    { encoding: 'utf8', input: uzun });
  assert.equal(r.status, 0);
  const yazilan = readFileSync(sabah, 'utf8');
  assert.ok(bayt(yazilan) <= 4096 + 40, 'tavan uygulanmalı');
  assert.match(yazilan, /\[\d+ bayt kesildi\]/, 'SABAH.md sessizce kırpılmaz');
  // Kaynak taraması: sessiz `cut -c` kalıbı sevk.sh'tan KALKMIŞ olmalı (üçüncü kopya).
  const s = readFileSync(join(KOK_REPO, 'tools', 'sevk', 'sevk.sh'), 'utf8');
  assert.ok(!/cut -c1-\d+ > "\$KOK\/00_pano\/SABAH\.md"/.test(s), 'sessiz kırpma kopyası duruyor');
});

test('haber/U38: sansürlü şablon da SÜZGEÇTEN geçer — gönderilen metin taranmış metindir', () => {
  const kok = kurulum();
  const kart = luhnKart();
  // Sır KUTU ADINDA: eski kod onu süzgeçten SONRA yeniden konuya koyuyordu.
  const r = haber(kok, ['--olay', 'alarm', '--cins', 'kirmizi', '--donem', 'K1',
                        '--kutu', 'KT-' + kart, '--detay', 'sıradan ayrıntı', '--prova']);
  assert.equal(r.status, 3, 'süzgeç redi 3 ile bildirilir');
  assert.ok(!r.stdout.includes(kart), 'DEĞER sansürlü şablona SIZMAMALI (Subject dâhil)');
  assert.ok(!r.stderr.includes(kart));
  // Dönem kimliğinde de aynı yol: iki alan da şablona elle geri konuyordu.
  const b = haber(kok, ['--olay', 'alarm', '--cins', 'kirmizi', '--donem', 'D-' + kart,
                        '--kutu', 'KT-900', '--detay', 'sıradan ayrıntı', '--prova']);
  assert.equal(b.status, 3);
  assert.ok(!b.stdout.includes(kart), 'dönem kimliğindeki değer de sızmamalı');

  // SON ÇARE METNİ SINIF ADINI TAŞIR ve o metin bir daha TARANMAZ. "Sınıf adı değer taşıyamaz"
  // varsayım olarak bırakılmadı, kapalı alfabeyle MEKANİK yapıldı — kasıtlı bozma bu dalın
  // testsiz olduğunu gösterdi. Süzgeç sahtelenip sınıf alanına bir değer konur:
  const c = kurulum();
  writeFileSync(join(c, 'tools', 'guard', 'icerik-suzgeci.sh'),
    '#!/bin/bash\nprintf \'eslesme\\t%s\\n\' "kart-' + kart + '"\nexit 3\n');
  const r3 = haber(c, ['--olay', 'alarm', '--cins', 'kirmizi', '--donem', 'K1',
                       '--kutu', 'KT-900', '--detay', 'sıradan', '--prova']);
  assert.equal(r3.status, 3);
  assert.ok(!r3.stdout.includes(kart), 'süzgecin KENDİ çıktısındaki değer de sızmamalı');
  assert.match(r3.stdout, /bilinmeyen-sinif/, 'kapalı alfabeye uymayan sınıf adı düşürülür');
});

// ═════════════════════════════════════════════════════════════════════════════════════════
// K23 · ÖBEK 2 — guard dikişi ailesi (U34 U35 U36). U34 ile U35 AYNI kusurun iki yüzüdür:
// dikiş komutu ÇIPLAK ALT-DİZE ile sınıflandırıyordu, bu yüzden hem ÇALIŞTIRMAYI kaçırıyor
// (değişkene bölünmüş çağrı) hem de OKUMAYI kesiyordu (grep/cat). ÖLÇÜLDÜ 2026-08-08:
// `X=haber; bash tools/sevk/$X.sh` → rc=0 (geçti) · `grep -rn haber.sh tools/` → rc=2 (engel).
// U10'un kapanışında yazılan üç hat (bölüt ayırma · komut adı çözümü · çözülemeyen ad güvenli
// tarafa) bu dikişe HİÇ uygulanmamıştı — kökenin ta kendisi: ders kardeş hatta taşınmamış.
// ═════════════════════════════════════════════════════════════════════════════════════════
const guard = (komut, kok = KOK_REPO) => spawnSync('bash', [join(KOK_REPO, 'tools', 'guard', 'file-guard.sh')], {
  encoding: 'utf8', env: { ...process.env, CLAUDE_PROJECT_DIR: kok },
  input: JSON.stringify({ tool_name: 'Bash', tool_input: { command: komut } }),
});

test('file-guard/U34: kanal dikişi ÇALIŞTIRMAYI yakalar — değişkene bölünmüş çağrı kaçmaz', () => {
  for (const k of [
    'bash tools/sevk/haber.sh --olay alarm',
    './tools/sevk/haber.sh --olay alarm',
    'sh ./tools/sevk/nabiz.sh',
    'X=haber; bash tools/sevk/$X.sh --olay alarm',
    'Y=tools/sevk; X=haber; bash $Y/$X.sh',
    'echo x && bash tools/sevk/haber.sh --olay donem-bitti',
    'D=/Users/x/tools/sevk; bash "$D/haber.sh"',
  ]) {
    const r = guard(k);
    assert.equal(r.status, 2, 'engellenmeli: ' + k);
    assert.match(r.stderr, /kanalı ajan eliyle çağrılamaz/, k);
  }
});

test('file-guard/U35: dikiş OKUMAYI kesmez — salt-okunur komut serbesttir', () => {
  for (const k of [
    'grep -rn haber.sh tools/',
    'cat tools/sevk/haber.sh',
    'git log --oneline -5 -- tools/sevk/nabiz.sh',
    'ls -la tools/sevk/haber.sh',
    'wc -l tools/sevk/nabiz.sh tools/sevk/haber.sh',
    'head -n 20 tools/sevk/haber.sh',
  ]) {
    const r = guard(k);
    assert.equal(r.status, 0, 'serbest kalmalı: ' + k + '\n' + r.stderr);
    assert.equal(r.stdout, '', 'okuma için karar da üretilmez: ' + k);
  }
  // Sıradan komutlar da serbest kalmayı sürdürür (dikişin kapsamı genişlemedi).
  for (const k of ['ls -la', 'git status', 'grep -rn haber docs/']) {
    assert.equal(guard(k).status, 0, 'serbest kalmalı: ' + k);
  }
});

test('file-guard/U36: Keychain parola OKUMA komutu serbest bırakılmaz', () => {
  // ÖLÇÜLDÜ: `security find-generic-password … -w` hiçbir katmanda yakalanmıyordu (rc=0) ve
  // tek koruma 00_genesis altındaki DÜZYAZIydı. Parolayı ajanın bağlamına almak, kanalın
  // kendisini ajana açmakla aynı sınıftır — kanal dikişiyle aynı sertlikte kapanır.
  for (const k of [
    'security find-generic-password -s keel-haber -a x@y.z -w',
    'security find-internet-password -s imap.x -w',
    'P=$(security find-generic-password -s keel-haber -a x -w); echo ok',
  ]) {
    const r = guard(k);
    assert.equal(r.status, 2, 'engellenmeli: ' + k);
    assert.match(r.stderr, /parola/i, k);
  }
  // Parola OKUMAYAN security çağrıları serbest (kapsam dar tutulur, geniş değil).
  for (const k of ['security list-keychains', 'security find-generic-password -s keel-haber -a x']) {
    assert.equal(guard(k).status, 0, 'serbest kalmalı: ' + k);
  }
});

// ── U39 · Düşen katman kendi düştüğünü SÖYLER; sürüm tabanı İLAN EDİLİR ───────────────────
// Komut sınıfının süzgeç düştüğünde serbest geçmesi BİLİNÇLİDİR (node-yok tabanı korunur,
// hasım bulgusu) — ama SESSİZ geçmesi değil. Kök 3'ün hükmü: bir katman düştüğünde sessiz
// serbest bırakma yoktur. Ve iz ÜRETMEK yetmez, BAĞLAMAK gerekir (U49 dersi): izin tüketicisi
// kurulum denetimidir, yani sahibin oturum başında gördüğü yüzey.
test('file-guard/U39: süzgeç düşünce komut serbest ama SESSİZ değil — iz düşer, başarıda silinir', () => {
  const kok = kurulum();
  mkdirSync(join(kok, 'tools', 'guard'), { recursive: true });
  copyFileSync(join(KOK_REPO, 'tools', 'guard', 'file-guard.sh'), join(kok, 'tools', 'guard', 'file-guard.sh'));
  copyFileSync(join(KOK_REPO, 'tools', 'guard', 'disa-fiilleri.txt'), join(kok, 'tools', 'guard', 'disa-fiilleri.txt'));
  copyFileSync(join(KOK_REPO, 'tools', 'guard', 'korunan-yollar.txt'), join(kok, 'tools', 'guard', 'korunan-yollar.txt'));
  copyFileSync(join(KOK_REPO, 'tools', 'guard', 'korunan-yollar.txt'), join(kok, 'tools', 'guard', 'korunan-yollar.txt'));
  copyFileSync(join(KOK_REPO, 'tools', 'guard', 'node-tabani.txt'), join(kok, 'tools', 'guard', 'node-tabani.txt'));
  const iz = join(kok, 'tools', 'guard', '.suzgec-dustu');
  const g = (komut) => spawnSync('bash', [join(kok, 'tools', 'guard', 'file-guard.sh')], {
    encoding: 'utf8', env: { ...process.env, CLAUDE_PROJECT_DIR: kok },
    input: JSON.stringify({ tool_name: 'Bash', tool_input: { command: komut } }) });

  // Süzgeç KOŞAMIYOR: komut sınıfı serbest kalmalı (taban korunur) AMA iz bırakmalı.
  writeFileSync(join(kok, 'tools', 'guard', 'icerik-suzgeci.sh'), '#!/bin/bash\nexit 90\n');
  const r = g('git status');
  assert.equal(r.status, 0, 'komut sınıfı fail-open kalmalı (bilinçli taban)');
  assert.ok(existsSync(iz), 'düşen katman iz BIRAKMALI — sessiz fail-open kalktı');
  const satir = readFileSync(iz, 'utf8');
  assert.match(satir, /\d{4}-\d{2}-\d{2}T/, 'iz ne zaman düştüğünü söyler');
  assert.match(satir, /v?\d+\./, 'iz hangi node sürümüyle düştüğünü söyler');

  // İZ ŞİŞMEZ: iz tek satırdır, her komutta büyümez.
  g('git status'); g('ls -la >/tmp/x'); g('git status');
  assert.equal(readFileSync(iz, 'utf8').trim().split('\n').length, 1, 'iz tek satır kalır');

  // KENDİ KENDİNİ İYİLEŞTİRİR: süzgeç yeniden koşabildiğinde iz SİLİNİR — yoksa bir kerelik
  // arıza sonsuza dek "süzgeç düşük" der ve uyarı gürültüye dönüşür (bayat uyarı = uyarı yok).
  copyFileSync(join(KOK_REPO, 'tools', 'guard', 'icerik-suzgeci.sh'), join(kok, 'tools', 'guard', 'icerik-suzgeci.sh'));
  copyFileSync(join(KOK_REPO, 'tools', 'guard', 'sinif-listesi.txt'), join(kok, 'tools', 'guard', 'sinif-listesi.txt'));
  assert.equal(g('git status').status, 0);
  assert.ok(!existsSync(iz), 'süzgeç yeniden koşunca iz silinir');
});

test('U39: node sürüm tabanı TEK EVDE ilan edilir ve tüketicileri onu okur', () => {
  const taban = readFileSync(join(KOK_REPO, 'tools', 'guard', 'node-tabani.txt'), 'utf8');
  // İki taban AYRI: kurulu bir kutunun KOŞMASI için gereken sürüm ile bu depoda TEST koşturmak
  // için gereken sürüm aynı değildir; tek sayıya sıkıştırmak ya kullanıcıyı gereksiz kısıtlar
  // ya geliştiriciyi yanıltır.
  const kosu = taban.match(/^KOSU=(\d+)$/m);
  const gelistirme = taban.match(/^GELISTIRME=(\d+)$/m);
  assert.ok(kosu && gelistirme, 'iki taban da makine-okur satırda ilan edilmeli');
  assert.ok(Number(gelistirme[1]) >= Number(kosu[1]), 'geliştirme tabanı koşu tabanından düşük olamaz');
  // İÇERİK KOPYALANMAZ, İŞARETÇİ YAZILIR: tüketiciler sayıyı gömmez, bu dosyadan okur.
  for (const t of ['file-guard.sh', 'kurulum-denetimi.sh']) {
    const s = readFileSync(join(KOK_REPO, 'tools', 'guard', t), 'utf8');
    assert.match(s, /node-tabani\.txt/, t + ' tabanı tek evden okumalı');
  }
});

test('U39: izin TÜKETİCİSİ var — kurulum denetimi düşmüş süzgeci SAHİBE söyler', () => {
  // U49 dersinin bu pakete uygulanmasi: iz URETMEK yetmez, BAGLAMAK gerekir. Tuketicisi
  // olmayan bir iz, hic uretilmemis izle ayni korlugu verir — bu test o baglantiyi olcer.
  const kok = kurulum();
  mkdirSync(join(kok, 'tools', 'guard'), { recursive: true });
  copyFileSync(join(KOK_REPO, 'tools', 'guard', 'node-tabani.txt'), join(kok, 'tools', 'guard', 'node-tabani.txt'));
  const denetim = () => spawnSync('bash', [join(KOK_REPO, 'tools', 'guard', 'kurulum-denetimi.sh'), kok],
    { encoding: 'utf8' }).stdout;

  assert.match(denetim(), /içerik süzgeci düşme izi yok/, 'iz yokken temiz olduğunu söyler');

  // TABAN FİİLEN DOSYADAN OKUNUR. "Kaynakta adı geçiyor" bunu ÖLÇMEZ — kasıtlı bozmada
  // ölçüldü: yol başka bir dosyayı gösterse bile ad yorumlarda geçtiği için grep yeşil kalıyordu.
  // Ölçüm davranışsal: dosyadaki sayıyı değiştir, rapordaki hüküm değişiyor mu.
  const tabanYolu = join(kok, 'tools', 'guard', 'node-tabani.txt');
  assert.match(denetim(), /koşu tabanı 14/, 'taban dosyadan okunup raporlanmalı');
  writeFileSync(tabanYolu, 'KOSU=99\nGELISTIRME=99\n');
  assert.match(denetim(), /koşu tabanının \(99\) ALTINDA/, 'taban değişince hüküm de değişmeli');
  writeFileSync(tabanYolu, readFileSync(join(KOK_REPO, 'tools', 'guard', 'node-tabani.txt'), 'utf8'));
  writeFileSync(join(kok, 'tools', 'guard', '.suzgec-dustu'),
    '2026-08-08T03:00:00Z\tv12.0.0\ttaban=14\ticerik-suzgeci.sh cikis 1\n');
  const r = denetim();
  assert.match(r, /içerik süzgeci DÜŞTÜ/, 'iz varken SAHİBE söylenir');
  assert.match(r, /v12\.0\.0/, 'hangi sürümle düştüğü de söylenir');
  assert.match(r, /^KIRMIZI · içerik süzgeci DÜŞTÜ/m, 'düşmüş koruma katmanı KIRMIZI basar');
});

// ══ U71 · curl YAPILANDIRMASININ TEK YAZICISI ═════════════════════════════════════════════
// Kusur: altı çağrı yeri (haber · kanal-yokla · nabız×4) değerleri `-K` yapılandırmasına
// KAÇIŞSIZ gömüyordu. curl'ün tırnaklı değerinde `"` değeri BİTİRİR, `\` bir KAÇIŞ başlatır.
// AĞA ÇIKILMAZ: oracle `file:///dev/null` + `--libcurl` — curl'ün FİİLEN aldığı değeri okur,
// DNS'e hiç dokunmaz. Metnin nasıl göründüğü değil, curl'ün ne aldığı ölçülür.
// Her kaçış kuralı BİRDEN ÇOK kez tetiklenir (hasım bulgusu): tek örnekli fixture, genel
// değiştirme bayrağı düşse bile yeşil kalırdı. Türkçe harf de var: "bayt-eş" iddiası
// ASCII ile sınırlı kalmasın.
const CURL_KOTU = 'a"b"c\\q\\r d şğüİ';
function curlAlinanDeger(konf) {
  const d = mkdtempSync(join(tmpdir(), 'curlconf-'));
  const c = join(d, 'k.c');
  const r = spawnSync('curl', ['-K', '-', '--libcurl', c], { encoding: 'utf8', input: konf });
  if (!existsSync(c)) return { rc: r.status, deger: null };
  const m = readFileSync(c, 'utf8').match(/CURLOPT_USERPWD, "((?:[^"\\]|\\.)*)"/);
  if (!m) return { rc: r.status, deger: null };
  // C dizesini çöz: --libcurl çıktısı C kaçışlıdır.
  // C dizesini çöz: --libcurl çıktısı C kaçışlıdır ve ASCII-DIŞI baytı SEKİZLİK yazar
  // (`\303\266`). Sekizliği çözmeyen bir okuyucu "bayt-eş" iddiasını yalnız ASCII'de
  // ölçebilirdi — Türkçe bir parola ya da alan adı ölçüm dışında kalırdı (hasım bulgusu).
  const bayt = [];
  for (let i = 0; i < m[1].length; i++) {
    if (m[1][i] !== '\\') { bayt.push(...Buffer.from(m[1][i], 'utf8')); continue; }
    const h = m[1].slice(i + 1).match(/^x[0-9a-fA-F]{2}/);
    if (h) { bayt.push(parseInt(h[0].slice(1), 16)); i += h[0].length; continue; }
    const o = m[1].slice(i + 1).match(/^[0-7]{1,3}/);
    if (o) { bayt.push(parseInt(o[0], 8)); i += o[0].length; continue; }
    const k = m[1][++i];
    bayt.push(...Buffer.from({ n: '\n', r: '\r', t: '\t', v: '\v' }[k] || k, 'utf8'));
  }
  return { rc: r.status, deger: Buffer.from(bayt).toString('utf8') };
}
const konfKur = (deger) => {
  const r = spawnSync('bash', ['-c',
    `. "${join(KOK_REPO, 'tools', 'sevk', 'ortak.sh')}"; ` +
    `curl_conf_yaz url "file:///dev/null" user "$1" max-time 2 && printf 'silent\\n'`,
    'bash', deger], { encoding: 'utf8' });
  return { rc: r.status, konf: r.stdout };
};

test('U71: curl DEĞERİ bayt-eş alır (tırnak · ters bölü · boşluk)', () => {
  const { rc, konf } = konfKur(CURL_KOTU);
  assert.equal(rc, 0, 'yapılandırma yazılamadı');
  const { deger } = curlAlinanDeger(konf);
  assert.equal(deger, CURL_KOTU + ':', 'curl DEĞERİ olduğu gibi almadı: ' + JSON.stringify(deger));
});

test('U71 negatif kontrol: kaçırmasız eski biçimde curl BAŞKA bir değer alır', () => {
  // Arızanın kendisi. Bu iddia düşerse ölçüm oracle'ı bozulmuş demektir — testin kendi
  // ön koşulu (kaçırmanın gerçekten gerektiği) burada ölçülür.
  const ham = `url = "file:///dev/null"\nuser = "${CURL_KOTU}"\nmax-time = 2\nsilent\n`;
  const { deger } = curlAlinanDeger(ham);
  // ORACLE ÖNCE DOĞRULANIR (hasım bulgusu): oracle bozulsa `deger` null olur ve `notEqual`
  // yine geçerdi — yani negatif kontrol kendi ön koşulunu ölçmeden yeşil kalırdı.
  assert.ok(deger !== null && deger.length > 1, 'oracle çalışmadı — negatif kontrol ölçmüyor');
  assert.notEqual(deger, CURL_KOTU + ':',
    'kaçışsız biçim de doğru değeri veriyor — kaçırmanın gerekçesi ölçülemiyor');
});

test('U71: TAB · LF · CR kaçırılır ve BAYT-EŞ geri gelir (kanal boşuna düşürülmez)', () => {
  // Hasım bulgusu: ilk hâl HER kontrol baytını reddediyordu ve curl'ün SORUNSUZ taşıdığı
  // TAB'lı bir parola bütün kanalı düşürüyordu. curl'ün kendi kaçış kümesi kullanılır.
  for (const [ad, deger] of [['TAB', 'a\tb'], ['LF', 'a\nb'], ['CR', 'a\rb'], ['VT', 'a\vb']]) {
    const { rc, konf } = konfKur(deger);
    assert.equal(rc, 0, ad + ': kaçırılabilir bayt reddedildi');
    assert.equal(konf.split('\n').filter(Boolean).length, 4,
      ad + ': değer satırı BÖLDÜ — seçenek enjeksiyonu (url · user · max-time · silent beklenir)');
    // KURALIN KENDİSİ ÖLÇÜLÜR (hasım bulgusu): yalnız bayt-eşliğe bakan bir iddia, TAB/CR
    // için kaçırma SİLİNSE DE yeşil kalırdı (curl ham baytı da taşır). Yapılandırmada ham
    // bayt KALMAMALI — kaçırılmış biçimi durmalı.
    assert.ok(!new RegExp('[\\u0009\\u000b\\r]').test(konf), ad + ': ham kontrol baytı yapılandırmada kaldı');
    assert.equal(curlAlinanDeger(konf).deger, deger + ':', ad + ': bayt-eş gelmedi');
  }
});

test('U71: kaçırılamayan bayt FAIL-CLOSED — hiçbir satır yazılmaz', () => {
  // Satır sızdırmak seçenek ENJEKSİYONU olurdu. curl'ün karşılığı OLMAYAN kontrol baytları.
  // 0x0C (FF) DE BURADA: curl'ün `\\f` kaçışı yok; eski aralık onu ne kaçırıyor ne
  // reddediyordu — ham bayt değere sızıyordu (hasım bulgusu).
  for (const kotu of ['a\u0001b', 'a\u007fb', 'a\u001bb', 'a\u000cb']) {
    const r = spawnSync('bash', ['-c',
      `. "${join(KOK_REPO, 'tools', 'sevk', 'ortak.sh')}"; curl_conf_yaz url "file:///x" user "$1"`,
      'bash', kotu], { encoding: 'utf8' });
    assert.equal(r.status, 1, 'kontrol karakteri kabul edildi: ' + JSON.stringify(kotu));
    assert.equal(r.stdout, '', 'reddedilen çağrıdan YARIM yapılandırma sızdı');
  }
});

test('U71: eşi olmayan anahtar reddedilir (yarım çift sessiz geçmez)', () => {
  const r = spawnSync('bash', ['-c',
    `. "${join(KOK_REPO, 'tools', 'sevk', 'ortak.sh')}"; curl_conf_yaz url "file:///x" user`],
    { encoding: 'utf8' });
  assert.equal(r.status, 1, 'tek başına kalan anahtar kabul edildi');
  assert.equal(r.stdout, '', 'yarım yapılandırma yazıldı');
});

// Tarama ÖZYİNELEMELİ ve `tools/` genelinde (hasım bulgusu: ilan edilen sınır `tools/sevk`
// ile ölçülüyordu; guard ya da kokpit altına konan bir curl çağrısı nöbetçiden geçerdi).
function sevkKaynaklari() {
  const kok = KOK_REPO, cikti = [];
  const gez = (d) => {
    for (const g of readdirSync(d, { withFileTypes: true })) {
      if (g.name === 'node_modules' || g.name === '.git' || g.name === 'test') continue;
      const y = join(d, g.name);
      if (g.isDirectory()) gez(y); else if (/\.(sh|mjs)$/.test(g.name)) cikti.push(y.slice(kok.length + 1));
    }
  };
  for (const alt of ['tools', '.claude']) if (existsSync(join(kok, alt))) gez(join(kok, alt));
  return cikti;
}

// `anahtar <ayırıcı> …%s…` kalıbı: değeri BİÇİM DİZESİNE gömen her printf buna düşer.
// DESEN GRAMERE BAĞLI, kozmetik boşluğa değil: curl `-K` ayırıcı olarak boşluk · `=` · `:`
// kabul eder ve değer TIRNAKSIZ da yazılabilir. İlk hâl yalnız ` = "` biçimini arıyordu.
const KURAL_DESENI = /(?:^|[^A-Za-z0-9_-])(?:url|user|request|mail-from|mail-rcpt|upload-file|max-time)\s*[=:]\s*\\?"?[^"\n]*%s/;

test('U71 tek ev: hiçbir betik curl yapılandırma satırını KENDİ printf’iyle kurmuyor', () => {
  const suclu = [];
  for (const f of sevkKaynaklari()) {
    const s = readFileSync(join(KOK_REPO, f), 'utf8');
    // NÖBETÇİNİN KENDİSİ ÖLÇÜLÜR (hasım bulgusu): bir önceki hâlde desen AŞIRI KAÇIRILMIŞTI
    // (`\\n` yerine `\\\\n`) ve HİÇBİR girdide eşleşmiyordu — ölü kapı. Deseni değiştirip
    // kasıtlı bozmasını yeniden koşmamak, tam da bu deponun yasakladığı şeydi.
    if (KURAL_DESENI.test(s)) suclu.push(f);
  }
  assert.deepEqual(suclu, [],
    'curl yapılandırma satırını kendi kuran betik(ler): ' + suclu.join(', ') + ' — kaçırma ikinci eve döndü');
});

test('U71 nöbetçi canlı: desen ESKİ (kaçışsız) biçimi FİİLEN yakalıyor', () => {
  // Ölü kapı sessizdir: yalnız "bugün ihlal yok" diyen bir iddia, deseni bozulmuş bir
  // nöbetçiden ayırt edilemez. Nöbetçinin kendi oracle'ı budur.
  const eski = [
    `  printf 'url = "smtp://%s:%s"\\nuser = "%s:%s"\\n' \\\\`,
    `  printf 'request = "%s"\\n' "$ARAMA"`,
    `  printf 'url = smtp://%s:%s\\n' "$S" "$P"`,          // TIRNAKSIZ değer de geçerli gramer
    `  printf 'max-time: %s\\n' "$T"`,                      // ':' ayıracı da geçerli gramer
  ];
  for (const o of eski) assert.ok(KURAL_DESENI.test(o), 'nöbetçi bu ihlali görmüyor: ' + o);
  // Yanlış-pozitif freni: bugünkü tek ev bu desene DÜŞMEMELİ.
  for (const f of ['tools/sevk/ortak.sh', 'tools/sevk/haber.sh', 'tools/sevk/nabiz.sh'])
    assert.ok(!KURAL_DESENI.test(readFileSync(join(KOK_REPO, f), 'utf8')), f + ' yanlış-pozitif');
});

test('U71 tek ev: `curl -K` çağıran HER betik curl_conf_yaz’dan geçiyor', () => {
  const cagiran = [];
  for (const f of sevkKaynaklari()) {
    const s = readFileSync(join(KOK_REPO, f), 'utf8');
    if (!/curl -K/.test(s)) continue;
    cagiran.push(f);
    assert.match(s, /curl_conf_yaz /, `${f}: curl -K çağırıyor ama tek evden geçmiyor`);
  }
  assert.ok(cagiran.length >= 3,
    'curl -K çağıran betik bulunamadı (' + cagiran.length + ') — tarama deseni bozulmuş olabilir');
});

// ══ U56 · BOĞULMA FRENİNİN SAYACI: ÜÇ HÂL AYRIDIR ════════════════════════════════════════
// Kusur: `head -n1` başarısız olunca çıktı boş kalıyor, "farklı dönem" sanılıyor ve `else`
// dalı listeyi SIFIRLIYORDU. ÖLÇÜLDÜ (2026-08-09, onarımdan ÖNCE):
//   · chmod 000 sayaç → fren TAMAMEN düştü (aynı anahtar ikinci kez geçti: rc 5 yerine 2)
//     ve hiçbir yere iz düşmedi; gerçek kurulumda o alarm İKİNCİ KEZ giderdi.
//   · dönem kimliği boşken 3 satırlık liste TEK satıra düştü, ardından aynı alarm freni
//     yeniden geçti — fren sessizce yok oldu.
// Testler AĞA ÇIKMAZ: Keychain kaydı olmadığı için haber §6'da exit 2 ile durur; fren §4'te,
// yani ondan ÖNCE koşar. Ölçülen şey gönderim değil, FRENİN KARARI.
const DURUM_YOLU = (kok) => join(kok, 'tools', 'sevk', '.haber-durum');
const durumSatirlari = (kok) =>
  readFileSync(DURUM_YOLU(kok), 'utf8').split('\n').filter(Boolean);
const alarmAt = (kok, anahtar, donem) =>
  haber(kok, ['--olay', 'alarm', '--cins', 'cevapsiz', '--anahtar', anahtar,
    ...(donem === null ? [] : ['--donem', donem]), '--kutu', 'KT-900', '--detay', 'deneme']);

test('U56 ön koşul: sağlam sayaçta fren TUTUYOR (aynı olay ikinci kez gitmez)', () => {
  const kok = kurulum();
  writeFileSync(DURUM_YOLU(kok), 'D1\nalarm:a1:cevapsiz\n');
  assert.equal(alarmAt(kok, 'a1', 'D1').status, 5, 'fren tutmuyor — ölçümün ön koşulu yok');
});

test('U56: OKUNAMAYAN sayaç listeyi SİLMEZ ve iz bırakır', () => {
  const kok = kurulum();
  writeFileSync(DURUM_YOLU(kok), 'D1\nalarm:a1:cevapsiz\nalarm:a2:cevapsiz\n');
  chmodSync(DURUM_YOLU(kok), 0o000);
  alarmAt(kok, 'a1', 'D1');
  chmodSync(DURUM_YOLU(kok), 0o644);
  assert.deepEqual(durumSatirlari(kok), ['D1', 'alarm:a1:cevapsiz', 'alarm:a2:cevapsiz'],
    'okunamayan sayaç SIFIRLANDI — dönemin tekilleştirme belleği yok oldu');
  assert.ok(gunluk(kok).some((j) => j.cins === 'haber-sayaci-okunmuyor'),
    'fren sessizce düştü — hiçbir yere iz düşmedi');
});

test('U56: KİMLİKSİZ çağrı BAŞKA dönemin listesini silmez ve fren sonra da tutar', () => {
  const kok = kurulum();
  writeFileSync(DURUM_YOLU(kok), 'D1\nalarm:a1:cevapsiz\n');
  alarmAt(kok, 'a1', null);                       // --donem YOK → yer tutucu kimlik
  assert.deepEqual(durumSatirlari(kok), ['D1', 'alarm:a1:cevapsiz'],
    'kimliksiz çağrı D1 dönemin listesini sildi');
  assert.ok(gunluk(kok).some((j) => j.cins === 'haber-sayaci-kimliksiz'), 'iz düşmedi');
  // ARIZANIN ASIL SONUCU: liste silinince aynı alarm freni yeniden geçiyordu.
  assert.equal(alarmAt(kok, 'a1', 'D1').status, 5,
    'kimliksiz çağrıdan sonra aynı alarm freni GEÇTİ — fren yok olmuş');
});

test('U56: YAZILAMAYAN sayaç sessiz kalmaz (fren bu dönemde sayamaz)', () => {
  const kok = kurulum();
  writeFileSync(DURUM_YOLU(kok), 'D1\nalarm:a1:cevapsiz\n');
  chmodSync(DURUM_YOLU(kok), 0o444);              // okunur ama yazılamaz
  alarmAt(kok, 'a9', 'D2');                       // farklı dönem → yazmayı dener
  chmodSync(DURUM_YOLU(kok), 0o644);
  assert.ok(gunluk(kok).some((j) => j.cins === 'haber-sayaci-yazilamadi'),
    'yazılamayan sayaç izsiz kaldı — bir sonraki tur frensiz koşar');
});

test('U56 negatifi: GERÇEK yeni dönem listeyi baştan kurar ve iz DÜŞMEZ', () => {
  const kok = kurulum();
  writeFileSync(DURUM_YOLU(kok), 'D1\nalarm:a1:cevapsiz\n');
  alarmAt(kok, 'a1', 'D2');
  assert.deepEqual(durumSatirlari(kok), ['D2'], 'yeni dönem listeyi sıfırlamalı');
  assert.ok(!gunluk(kok).some((j) => String(j.cins || '').startsWith('haber-sayaci-')),
    'meşru dönem geçişi bulgu üretti — yanlış-pozitif');
});

test('U71: ÇAĞRI YERİ ön-kaçırma yapmaz (çift kaçırma kanalı kör ediyordu)', () => {
  // Regresyonun kendisi: nabız `imap_ara "… \\\"$MSGID\\\""` yazıyordu; kabuk açılımından
  // sonra değerin İÇİNDE gerçek ters bölü kalıyor, curl_conf_yaz onu bir kez daha kaçırıyor
  // ve tele `\\"<msgid>\\"` gidiyordu — sahibin cevabı HİÇ bulunmuyordu.
  // DEVAM SATIRLARI BİRLEŞTİRİLİR (hasım bulgusu): en pahalı çağrı yeri (DUR araması) ÇOK
  // SATIRLI ve satır-kapsamlı bir nöbetçi onu hiç görmüyordu — regresyonun asıl evi kapsam
  // dışındaydı. Yorumlar önce atılır, sonra `\` + satırsonu tek satıra indirilir.
  for (const f of sevkKaynaklari()) {
    const ham = readFileSync(join(KOK_REPO, f), 'utf8')
      .split('\n').filter((l) => !/^\s*#/.test(l)).join('\n')
      .replace(/\\\n\s*/g, ' ');
    for (const satir of ham.split('\n')) {
      if (!/(curl_conf_yaz|imap_ara|imap_getir)\s/.test(satir)) continue;
      assert.ok(!/\\\\\\"/.test(satir),
        `${f}: çağrı yerinde ön-kaçırma var (\\\\") — kaçırma tek evindir → ${satir.trim().slice(0, 160)}`);
    }
  }
});

test('U71: nabızda yapılandırma kurulamazsa SESSİZ kalmaz (günlüğe bulgu düşer)', () => {
  const kok = kurulum();
  // Parolaya kaçırılamayan bir bayt konur: curl_conf_yaz 1 döner, kol boş sonuç üretir —
  // eskiden bu "hiç posta yok" ile BAYT-EŞ görünüyordu ve DUR hattı sessizce körleşiyordu.
  const bin = join(kok, 'sahte-bin');
  mkdirSync(bin, { recursive: true });
  writeFileSync(join(bin, 'security'), '#!/bin/bash\nprintf "pa\\001rola\\n"\n');
  writeFileSync(join(bin, 'curl'), '#!/bin/bash\ncat >/dev/null\nexit 0\n');
  for (const f of ['curl', 'security']) chmodSync(join(bin, f), 0o755);
  writeFileSync(join(kok, 'tools', 'sevk', '.donem-acik'), DONEM_SATIRI(new Date().toISOString()));
  writeFileSync(join(kok, 'tools', 'sevk', 'kanal.conf'),
    readFileSync(join(kok, 'tools', 'sevk', 'kanal.conf'), 'utf8') + 'CEVAP_KANALI=acik\n');
  writeFileSync(join(kok, 'tools', 'sevk', '.cevap-capa'), JSON.stringify({
    kod: 'AAAA1111', msgid: '<keel-AAAA1111@ornek.gecersiz>', catal: 'Ç-01', donem: 'D1',
    kutu: 'KT-900', ts: new Date().toISOString(), durum: 'acik',
    secenekler: ['a', 'b'], bicimsiz: 0, gorulen: [], alarm: '' }) + '\n');
  spawnSync('bash', [join(kok, 'tools', 'sevk', 'nabiz.sh')],
    { encoding: 'utf8', env: { ...process.env, CLAUDE_PROJECT_DIR: kok, PATH: bin + ':' + process.env.PATH } });
  // HANGİ KOL olduğu da yazılı olmalı (kendi kasıtlı bozmamız yakaladı): sınıfa bakan bir
  // iddia, cevap hattının izi silinse bile DUR hattının izi yüzünden yeşil kalıyordu.
  const izler = gunluk(kok).filter((j) => j.cins === 'curl-yapilandirmasi-kurulamadi');
  assert.ok(izler.some((j) => /imap aramasi/.test(j.detay || '')),
    'cevap hattının yapılandırma reddi izsiz kaldı: ' + JSON.stringify(izler.map((j) => j.detay)));
  assert.ok(izler.some((j) => /DUR aramasi/.test(j.detay || '')),
    'DUR hattının yapılandırma reddi izsiz kaldı — uzaktan durdurma sessizce körleşir');
});

test('U71: kanal-yoklaması yapılandırma reddini KENDİ ADIYLA söyler (curl kodu değil)', () => {
  const kok = kurulum();
  const bin = join(kok, 'sahte-bin');
  mkdirSync(bin, { recursive: true });
  writeFileSync(join(bin, 'security'), '#!/bin/bash\nprintf "pa\\001rola\\n"\n');
  chmodSync(join(bin, 'security'), 0o755);
  const r = spawnSync('bash', [join(kok, 'tools', 'sevk', 'kanal-yokla.sh')],
    { encoding: 'utf8', env: { ...process.env, CLAUDE_PROJECT_DIR: kok, PATH: bin + ':' + process.env.PATH } });
  assert.equal(r.status, 1);
  assert.match(r.stdout, /curl yapılandırmasına yazılamadı/,
    'sebep curl koduyla anlatılıyor — sahip ağa/parolaya bakar, oysa kusur değerde: ' + r.stdout);
});

test('U56: KİMLİKSİZ çağrı başka dönemin listesine YAZAMAZ da (silmemek yetmez)', () => {
  // Hasım bulgusu: okuma yanı onarıldı, YAZMA yanı koşulsuz append ediyordu. Kimliksiz bir
  // alarm başka dönemin listesine satır ekleyince o dönemin 10'luk tavanını yer ve
  // tekilleştirmesini kirletir — sessiz bir kota hırsızlığı.
  const kok = kurulum();
  const bin = join(kok, 'sahte-bin');
  mkdirSync(bin, { recursive: true });
  writeFileSync(join(bin, 'curl'), '#!/bin/bash\ncat >/dev/null\nexit 0\n');
  writeFileSync(join(bin, 'security'), '#!/bin/bash\nprintf "parola\\n"\n');
  for (const f of ['curl', 'security']) chmodSync(join(bin, f), 0o755);
  writeFileSync(DURUM_YOLU(kok), 'D1\nalarm:a1:cevapsiz\n');
  const r = spawnSync('bash', [join(kok, 'tools', 'sevk', 'haber.sh'), '--olay', 'alarm',
    '--cins', 'cevapsiz', '--anahtar', 'a9', '--kutu', 'KT-900', '--detay', 'x'],
    { encoding: 'utf8', env: { ...process.env, CLAUDE_PROJECT_DIR: kok, PATH: bin + ':' + process.env.PATH } });
  assert.equal(r.status, 0, 'sahte gönderim başarısız: ' + r.stderr);
  assert.deepEqual(durumSatirlari(kok), ['D1', 'alarm:a1:cevapsiz'],
    'kimliksiz çağrı BAŞKA dönemin listesine yazdı — tavanı yiyor, tekilleştirmeyi kirletiyor');
  assert.ok(gunluk(kok).some((j) => j.cins === 'haber-sayaci-yazilmadi'), 'yazılmama izsiz kaldı');
});
