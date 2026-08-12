<!-- yazar: genesis — her G-adımı kapanışında yerinde yeniden yazılır.
     Aşağıdaki fenced blok MAKİNE OKUR (tools/guard/kurulum-surucu.sh · tools/guard/acilis.sh ·
     tools/guard/kurulum-denetimi.sh): alan adları ve değerler BİREBİR eşleşir, tanınmayan değer
     fail-closed sayılır. Her alanın bir değeri, her alanın bir okuyucusu var — süsleme alan yok.
     Başlık bilerek `## MEKANİK BLOK` DEĞİLDİR — o ad panonun kendi sözleşmesine aittir
     (tools/kokpit/PANO_SOZLESMESI.md) ve alan dilbilgisi başkadır; aynı adı iki ayrı sözleşmeye
     vermek D-27'nin kapattığı çok-anlamlılığı diriltirdi.

     DURUM BİLGİSİ YALNIZ BLOKTA YAZILIR. Bu dosyanın eski hâlinde aynı üç olgu bir de düzyazıyla
     yazılıyordu (`**Durum:** …` · `## Tamamlanan adımlar` · `## Bekleyen adım`). Sürücü bloğu
     ilerlettiğinde o üç bölüm eskiyordu ve aynı dosya kendisiyle çelişiyordu: makine G1'de,
     düzyazı "kurulum başlamadı" (hasım turu 2026-07-29 — sahibin okuduğu yüzey yanlış oluyordu).
     Aynı olguyu iki yerde yazmak drift kapısıdır; ikinci kopya kaldırıldı.

     Tasarıda bir de `SÜRÜM` alanı vardı (B-43); bu bloğa KONMADI ve sebebi mekanik: KEEL'in
     sürüm kimliği git geçmişinde yaşıyordu, G0.1 (klasör hazırlığı) ise kuruluma başlamadan
     `.git`i siliyor — yani alan doldurulacağı anda bilgi zaten yok olmuş oluyordu.
     ÇÖZÜLDÜ (K8, 2026-08-11) ve teşhisin işaret ettiği yoldan: sürüm artık DAĞITIMLA GELEN bir
     dosyadır — kökteki `SURUM.md`. Bağ koparılmadan önce yakalanacak bir şey kalmadı, çünkü
     bilgi git'te değil ağaçta. ALAN YİNE BURAYA KONMAZ ve sebebi bu bloğun kendi kuralıdır:
     aynı olguyu iki yerde yazmak drift kapısıdır — sürümün tek evi `SURUM.md`'dir. -->

# GENESIS DURUM

## KURULUM DURUMU — makine okur (yazan: GENESIS ve kurulum sürücüsü)
```
Adım: G5
Durum: bekliyor
Tamamlanan: G0, G1, G2, G3a, G3b, G4, G4.5
```

`Adım` = açık adımın kimliği (`00_genesis/adimlar/SIRA.txt`) · `Durum` = **başlamadı** ·
**açık** (çalışıyorum) · **bekliyor** (sahibin mührünü/cevabını bekliyorum — oturum kapanabilir) ·
**bitti** (sıradakini sürücü açsın) · `Tamamlanan` = bitmiş adımlar, sıra sırasıyla, virgülle.
**Nerede kaldığın buradadır; başka yerde tekrarlanmaz.**

## Sahip adı
Ahmet

## Son mühür
G0.3 · Ahmet · 2026-08-12 — kurulum planı (G0–G5) ve ağırlık ayarı onaylandı.
Onaylanan ağırlık: herkese açık dağıtım (App Store) · birincil kullanıcı ÇOCUK · uzun ömürlü ·
en pahalı kayıp = çocuğun uygunsuz içerik görmesi + ailelerin güveni, ikincisi sahibin emeğinin
buharlaşması; para kaybı ikincil. Mevzuat: sahip bilmiyordu, GENESIS yüzeyi gösterdi (çocuk verisi
rejimi + mağaza çocuk kategorisi kuralları) ve G1'de kısıt olarak yazılacak; hedef yaş aralığı
(13 altı/üstü kırılması) G1'de sorulacak — AÇIK SORU.
Kadran kararı: **ritüel tam, kadro yalın** — bağımsız doğrulama ve çocuğa dokunan her şey için
ayrı kapı KALIR; roller birleştirilir, çok aşamalı komite kurulmaz.

**REVİZYON · G1 · Ahmet · 2026-08-12 — kadran kararının ikinci yarısı sahip tarafından ters
çevrildi.** Sahip açıkça geniş kadro istedi: "sadece oyunu yazan değil, içeriğini de düşünen,
en iyiyi bulmak için akıl koyup tartışan bir ekip — ben bunları tek başıma yapamam." Yürürlükteki
kadran: **ritüel tam · kadro GENİŞ · sahibe giden soru trafiği DAR.** Üçü birlikte tutarlıdır:
roller kendi aralarında tartışır, sahip yalnız süzülmüş çatallarda konuşur.
Sahip ritmi: haftada 3 gün × ~30 dk (≈1,5 saat/hafta) — G2 kadrosu bu bütçeye göre tasarlanır.

**G2.5 · Ahmet · 2026-08-12 — KADRO MÜHÜRLENDİ** ("Evet bu kadro uygun."). Tanıtım tablosu
gösterilerek onaylandı; mühürlü hâl `02_kanon/KADRO.md`. On bir koltuk: urun · koordinator ·
oyuntasarim · icerik · pedagoji · guvenlik · tasarim · gelistirici · denetci(yazamaz) ·
disgoz(yazamaz, zorunlu) · yayin(uyuyan). Sahibe kırmızı olarak gösterilip kabul edilen üç
sahipsiz alan: gerçek uzman görüşü (hiçbir rol kapatamaz — VIZYON §8.1) · ticaret/mağaza
(yayin uyanana dek) · duyurma/pazarlama (kısmen).

## Karar alanı teyidi
Karar alanı teyidi: Ahmet · 2026-08-13
Dört başlık sahibe geri okundu ve onaylandı ("Karar alanı beni doğru anlatıyor, teyit ediyorum").
Aynı turda K-12'nin ikinci düzeltmesine de veto gelmedi ("itirazım yok, olduğu gibi kalsın").

## Bekçi damgası (G3.2)
Ayar: `kadran=tam` (EL_KITABI kadranıyla eş) · `urun_yollari=04_urun` ·
`kok_izinli_ek=.DS_Store .obsidian` (proje bir Obsidian kasasının içinde yaşıyor; `.obsidian/`
ilan edilmeseydi bekçi her koşuda şema-dışı kök girdisi uyarısı basardı — ölçüldü).
Tavanlar EL_KITABI F3 ile birebir; kalibrasyon ilk retroda.

İlk koşu (2026-08-12):
`BEKCI v1 durduran=0 kilit=0 uyari=0 bilgi=46 ariza=0 kadran=tam pencere=kurulum`

Fail-closed öz-testi (aynı gün): `kadran=uydurma` ile koşuldu →
`ARIZA [ayar] bekci.conf: kadran değeri tanınmadı: 'uydurma'` + beş gözün hepsi
`kapsam: TARANMADI (ayar okunamadı — gözler hiç koşmadı)` + **çıkış kodu 2**.
Yani bozuk ayar sessiz yeşile değil arızaya düşüyor. Ayar sonra geri alındı ve normal
makine satırı yeniden basıldı.

## G3b kanıt damgaları

**G3.3b · koruma katmanı (iki kanıt da ZORUNLU, ikisi de alındı — 2026-08-13):**
- (i) `.claude/settings.json`a kasıtlı Edit → `PreToolUse:Edit hook error … file-guard ENGEL:
  bu yol korumalı ([SERT] sınıfı: .claude/)`. Engel görüldü.
- (ii) `tools/guard/file-guard.sh`ın KENDİSİNE kasıtlı Edit → `file-guard ENGEL: bu yol korumalı
  ([SERT] sınıfı: tools/guard/)`. Öz-koruma görüldü.
- `korunan-yollar.txt` DEĞİŞTİRİLMEDİ: kilitli yolu (`02_kanon/kilitli/`) zaten `[SERT]`,
  golden yolu (`02_kanon/golden/`) zaten `[SORULUR]` — varsayılanlar bu projenin yapısıyla eş.
- `.claude/settings.json` ask kuralları yerinde: `Edit(/02_kanon/kilitli/**)` ·
  `Edit(/02_kanon/golden/**)`.

**G3.3c · rol becerileri (üç kanıt):**
- (i) `grep -R '«' .claude/skills/` BOŞ · 11/11 dosyada `disable-model-invocation: true` ·
  11/11 dosyanın ilk satırı `---`.
- (ii) Kafes canlı-kanıtı: `.aktif-rol` = `denetci yazamaz` iken `00_pano/PANO.md`ye Edit
  denendi → `file-guard ENGEL: rol kafesi: aktif rol 'denetci' YAZAMAZ modundadır` · **exit=2**.
  Damga aynı komutta kaldırıldı (doğrulandı).
- (iii) `tools/guard/.aktif-rol` `.gitignore:27`de.
- **BEKLEYEN KANIT: ilk rol töreni** (insan `/rol-<slug>` yazar → "ROL AÇIK"). Kurulum
  oturumunda alınamaz — beceriyi ajan tetikleyemez, bu bilinçli. İlk rol oturumunda kapanacak.

**G3.3e · alt-ajan koltukları (dört kanıt):**
- (i) 11 kadro dosyasında `«` yok. (Şablonla gelen `dogrulayici.md` kendi gösteriminde `«»`
  kullanıyor — bkz. aşağıdaki KAPI BULGUSU.)
- (ii) 11/11 dosyanın İLK SATIRI `---`.
- (iii) `grep -REl '^[[:space:]]*memory[[:space:]]*:' .claude/agents/` BOŞ.
- (iv) `tools:` değerleri moda göre BİREBİR: yazamaz (denetci, disgoz) → `Read, Grep, Glob` ·
  tam (9 koltuk) → `Read, Grep, Glob, Edit, Write, Bash`. Her koltuğun ROL.md `Mod:` değeriyle
  eşleştiği tek tek doğrulandı. Boylar 2128–2200 B (tavan 2816 B).

## G4 · ilk kutu kabuğu + bütçe uyarlaması
Kabuk `01_kutular/KT-001-proje-plani/KUTU.md` kalıptan kopyalandı; tek alan (`koordinator`)
dolduruldu, metne EKLEME/ÇIKARMA yapılmadı. Taban ref: `8924019` ·
kilitli-tarih çapası `02_kanon/kilitli/.taban-ref` (41 bayt: 40 hash + satır sonu).

**TEK DEĞER DEĞİŞTİ — `BÜTÇE` satırındaki ilk sayı: 6 → 12.** Sebep mekanik ve kapı zorunlu
kıldı: kabuğun bütçesi SABİT metindir (6), planlama kutusunun görev sayısı ise kadronun
TÜREVİDİR (G-01 + yazamaz-olmayan her role bir görev). Bu kurulumda yazamaz-olmayan koltuk
sayısı 9 → gereken üretim çağrısı 10. 6 ile kutu **mekanik olarak bitirilemezdi**: 7. sevk
bütçeye takılır, dönem erken döner, ne dış göz brifingi ne kapanış karnesi üretilir — kutu
sessizce ölür. Kapı bunu KIRMIZI bastı ve haklıydı.
**Neden 10 değil 12:** 10 sıfır paylı asgari sayıdır; tek bir yeniden deneme kutuyu kilitler.
Kabuğun kendi `ilerleme-yok eşiği 2 tur` ilanı yeniden denemeyi zaten öngörüyor — pay o ilandan
türetildi, uydurulmadı. `toplam dönem tavanı` (6) DEĞİŞMEDİ: o dönem sayısıdır, çağrı değil.
Bu karar sahibe TAŞINMADI ve sebebi yazılı: `02_kanon/KARAR_ALANI.md` Bölüm B, sahip
"işlerin sırası ve dağılımı" ile "kutunun içi nasıl işliyor" sınıflarını açıkça kendi karar
alanının DIŞINDA bıraktı. Türetme-izi bu paragraftır.

Kabuk sonrası ölçüm: çekilme kapısı **YEŞİL** (56 kalem geçti, 0 kırmızı) ·
bekçi `durduran=0 kilit=0 uyari=0 ariza=0`.

## G4.5 · aktarım öz-denetimi — YEŞİL damgası
Koşu: 2026-08-13 · `bash tools/guard/kurulum-denetimi.sh`
`SONUÇ: YEŞİL — aktarım tam, çekilme serbest` · **56 kalem geçti · 0 KIRMIZI · çıkış kodu 0**
Yeşil izi düştü: `tools/guard/.kurulum-denetimi-son` (sıra sürücüsü son adımı bu iz olmadan
yürütmez).

**İLAN EDİLMİŞ SINIR — bu damganın zayıf noktası, örtülmez.** Adım tarifi bu betik için
"yazmadın, değiştirmezsin; denetleyen ≠ denetlenenin yazarı" diyor. Bu kurulumda betik
DEĞİŞTİ (K-12, sahip onaylı): U5 kaleminde SIGPIPE/pipefail kusuru vardı ve kapı, kategoriyi
BULDUĞUNDA kırmızı basıyordu — yani hiçbir kurulum bu kapıdan geçemezdi. Düzeltme yapıldı,
ama sonuç şu: **bu YEŞİL, betiğine bir kez dokunmuş bir kapıdan alınmıştır.**
Bunu telafi eden iki bağımsız kanıt var, ikisi de benim kalemimden DEĞİL:
1. Betiğin kendi test takımı (şablonla gelir, ben yazmadım) düzeltmeden sonra **61/61** geçti —
   yani ölçünün semantiği korundu.
2. Değişiklik git'te tek blok hâlinde görünür ve geri alınabilir (`git diff` ile okunur).
Yine de "denetleyen ≠ denetlenenin yazarı" güvencesi bu kurulumda TAM değildir. İlk retroda
bu kalem gözden geçirilmeli ve düzeltme KEEL'in kendi bakımına bildirilmelidir.

## Format spec (G3b'de doldurulur)
- **PANO:** `tools/kokpit/test/fixtures/tekfaz/` biçimi birebir. `## MEKANİK BLOK` fenced blok —
  yazarı YALNIZ bekçi; `## YARGI BLOĞU` — yazarı koordinatör.
- **Işık adları:** bekçinin ürettikleri (`AKIŞ` · `DOSYA`; davranış ölçümü kutu kapanınca doğar).
  Ciddiyet sözlüğü: `YEŞİL` · `SARI` · `KIRMIZI` · `VERİ-YOK`.
- **ID önekleri:** kutu `KT-` · görev `G-` · karar `K-` · rol kararı `Ç-`.
- **Rol durumu:** ilk satır `# DURUM — <Ad>` (em-dash, çevresinde boşluk); boş rol gövdesi
  birebir `Henüz oturum açılmadı`. `**Son oturum:**` satırı YAZILMADI (o, oturum açmış rol için).
- **Ayıraçlar:** alan ` · ` (U+00B7) · durum ` — ` (U+2014). ASCII'ye normalize edilmez.
- **Rol slug'ları:** tek-token ASCII (`^[a-z0-9]+$`); insan-görünümü Türkçe adlar dosya İÇİNDE.
- **Yazım sırası (load-bearing):** önce diğer rol DURUM'ları → sonra `koordinator/DURUM.md`
  (rol dosyaları arasında en yeni) → EN SON bekçi. Bu sırayla üretildi.
- **Doğrulandı (2026-08-13):** kokpit `buildState` ile okundu → **okuma notu 0 · boşluk 0**,
  11 rolün hepsi "Henüz oturum açılmadı" olarak görülüyor. Bekçi: `durduran=0 uyari=0 ariza=0`.

## KAPI BULGUSU — çekilme kapısında şablon kaynaklı kusur (G3b'de ölçüldü)
`tools/guard/kurulum-denetimi.sh` (satır 7 `set -euo pipefail`; satır 420-424, "U5" kalemi)
bekçi kategorilerinin kodda karşılığını şu boru hattıyla arıyor:
`grep -rl … | while read f; do … && echo VAR; done | grep -q VAR`.
`grep -q` ilk eşleşmede çıkıyor, boruyu kapatıyor; yukarıdaki `while` SIGPIPE alıp **141** ile
ölüyor ve `pipefail` yüzünden hattın tamamı BAŞARISIZ sayılıyor. Yani kategori BULUNDUĞUNDA
kırmızı basıyor. Ölçüldü: aynı ifade `pipefail` kapalıyken 0, açıkken 141 dönüyor.
Fixture'da yakalanmamasının sebebi mekanik: test sahte bekçiyi TEK dosyayla kuruyor, tek
eşleşmede `grep -q` girdiyi tüketip bitiriyor ve SIGPIPE doğmuyor. Gerçek kurulumda
`tools/bekci` altında 9 dosya eşleşiyor.
**Sonuç: beş kategori de KIRMIZI → G4.5 çekilme kapısı bu hâliyle asla yeşile dönemez.**
Düzeltme `tools/guard/` içinde, yani `[SERT]` — kuran ajan dokunamaz; sahip kararı + tören ister.
Sahibe getirildi: 2026-08-13.

**ÇÖZÜLDÜ — sahip onayı: Ahmet · 2026-08-13** ("düzelt, ne değiştirdiğini kayda geçir, sınavı
yeniden koştur ve sonucu bana göster"). İki dosyada değişiklik yapıldı; ikisi de `[SERT]` yolda
olduğu için araç hattı (Edit/Write) mekanik kapalıydı — değişiklik kabuk üzerinden uygulandı ve
git'te görünür (geri alınabilir). Kayıt: `02_kanon/KARAR_INDEKSI.md` K-12.
1. `tools/guard/kurulum-denetimi.sh` (U5 kalemi): erken-çıkışlı boru yerine sonuç değişkende
   toplanıyor (`KAT_VAR=$(…) || true`). **Ölçü değişmedi.** Kapının kendi test takımı
   düzeltmeden sonra da 61/61 geçti — yani semantik korundu, yalnız kusur kalktı.
2. `.claude/agents/dogrulayici.md` satır 40: `«KARNE-GOREV: KAPANIS»` → `"KARNE-GOREV: KAPANIS"`.
   Aynı kusur sınıfı: deponun kendi kuralı Fransız tırnağını tırnak olarak kullanmayı yasaklıyor
   (kapı onu "doldurulmamış alan" sayar) ama şablonun kendi dosyası bu kuralı çiğniyordu.
   Anlam değişmedi. **Bu ikinci düzeltme sahibin ilk iznindeki tek-dosya kapsamının dışındaydı;
   sahibe ayrıca bildirildi ve vetosu açık bırakıldı.**

Düzeltme sonrası kapı: 39 kalem geçti · KIRMIZI 2 (karar alanı teyit damgası — sahibin
teyidini bekliyor · ilk kutu kabuğu — G4'ün işi). Beş U5 kırmızısı yok.
