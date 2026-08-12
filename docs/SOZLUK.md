# KEEL sözlüğü — hangi kelime neyi anlatır

**Amaç:** bir kelime bir şeyi anlatır. Aynı kelimenin iki anlamı varsa, hafızasız bir oturum
hangisini okuduğunu bilemez ve yanlış yere bakar.

Bu dosya iki iş yapar: (1) bugünkü doğru adları listeler, (2) hangi eski adın hangi yeni ada
çevrildiğini kaydeder — eski kayıtları okuyan biri karşılığını buradan bulur.

---

## 1 · "koşu" — altı ayrı şeyi anlatıyordu · UYGULANDI

Düzeltme tarihi: 2026-07-29 (dil paketi, Faz 2 sıra 1).

| Eski | Yeni | Ne demek |
|---|---|---|
| koşu | **otonom dönem** | Sahibin `/donem` ile açtığı, `tools/sevk/.donem-acik` göstergesi varken süren çalışma dilimi. Mühürde ya da duran görevde biter |
| koşu | **alt-ajan çağrısı** | Sevkin bir görev için açtığı tek, taze hafızalı ajan çağrısı |
| koşu | **bekçi denetimi** | `tools/bekci/bekci.sh`'ın bir kez çalışması; çıktısı `00_pano/SAGLIK.md`'ye düşer |
| koşu | **prova** | Deneme klasöründe yapılan tatbikat (`Dev/keel-tatbikat-*`) |
| koşu | **kurulum oturumu** | GENESIS'in yürüdüğü ilk oturum |
| koşu | **çalıştırma** | Bir programın bir kez çalışması ("node çalıştırması", "kanıt çalıştırması") |

Fiil olarak **"koşmak"** doğru ve tek anlamlıdır — "bekçi koşar", "test koşuluyor" değişmedi.
Değişen yalnız **isim** hâlidir.

### Makine adları (kodda geçen karşılıklar)

| Eski | Yeni |
|---|---|
| `/kosu` | `/donem` |
| `tools/sevk/kosu-ac.sh` | `tools/sevk/donem-ac.sh` |
| `tools/sevk/.kosu-acik` | `tools/sevk/.donem-acik` |
| `.claude/skills/kosu/` | `.claude/skills/donem/` |
| `02_kanon/OTONOM_KOSU.md` | `02_kanon/OTONOM_DONEM.md` |
| `00_genesis/OTONOM_KOSU_KALIBI.md` | `00_genesis/OTONOM_DONEM_KALIBI.md` |
| `KOSU_ID` `KOSU_KUTU` `KOSU_TUR` `KOSU_KIP` `KOSU_HATA` `KOSU_SINIF` `KOSU_DAMGA` `KOSU_SATIRI` `KOSU_RC` `KOSU_YOL` `KOSU_YAS_SAAT` `KOSU_GONDERIM_TAVANI` | aynısı: baştaki `KOSU_` yerine `DONEM_` |
| betikler arası geçiş değişkenleri `S_KOSU` `D_KOSU` `A_KOSU` `N_KOSU` `KAPI_KOSU` `B_KOSU` `J_kosu` | aynısı: `_KOSU` yerine `_DONEM` |
| `kosu_oku` · `kosuAcik` · `kosuAcikMi` | `donem_oku` · `donemAcik` · `donemAcikMi` |
| olay adları: `kosu-acilis` `kosu-basladi` `kosu-bitti` `kosu-kapanis` | `donem-acilis` `donem-basladi` `donem-bitti` `donem-kapanis` |
| dönem kimliği öneki `KOSU-…` | `DONEM-…` |
| zarf günlüğü alanı `"kosu"` | `"donem"` |
| bekçi damgası `Son koşu: … (koşu #N)` | `Son denetim: … (denetim #N)` — eski yazım kokpitte okunmaya devam eder (§2) |

**Ekranda görünen değişiklik:** tören çıktısı artık `KOŞU AÇIK` değil **`DÖNEM AÇIK`** yazar.

---

## 2 · "kapı" ÜÇ şeyi anlatıyordu · UYGULANDI

Düzeltme tarihi: 2026-07-29 (dil paketi 2. katman). Yöntem: 50 dosya **dosya dosya okundu** —
635 geçişin her biri tek tek sınıflandırıldı. Mekanik toplu değiştirme bir kez denenip geri
alınmıştı (anlam bozuyordu); bu kayıt onun yerine geçer.

### Anlam 1 → **görev**

`KUTU.md` görev tablosunun bir satırı (`G-NN`): sahibi var, durumu var, kanıtı var, alt-ajana
sevk edilir, karneyle kapanır. Kod aynı şey için **iki ad** taşıyordu — yerel değişken `kapi`,
günlük alanı `gorev` (`sevk.sh`'ta `r.j.gorev === kapi`). Tek ada indi: **görev**.

| Eski | Yeni |
|---|---|
| kapı (`KUTU.md` tablosunun satırı) | **görev** |
| `## Kapılar` başlığı · `\| Kapı \|` sütun başlığı | `## Görevler` · `\| Görev \|` |
| `kapilar` · `kapiToplam` | `gorevler` · `gorevToplam` |
| `miras-kapi` · `pas-kapi` · `kapi-kapatilmadi` (bulgu cinsleri) | `miras-gorev` · `pas-gorev` · `gorev-kapatilmadi` |
| `tip: "kapi-sayaci"` + alanı `kapi_sayisi` | `tip: "gorev-sayaci"` + `gorev_sayisi` |
| karne kaydının alanı `kapi` (`j.kapi`) | `gorev` — **şema değişikliği** |
| zarf satırı `KARNE-KAPI:` | **`KARNE-GOREV:`** — **sözleşme değişikliği** (rol zarfları, iki ajan kalıbı, biçim kapısı, testler birlikte döndü) |
| kokpit paneli `kutu · kapılar` | `kutu · görevler` |

### Anlam 2 → **kapı** (değişmedi)

Geçiren ya da geçirmeyen **denetim noktası**: `kurulum-kapisi.sh` · `devir-kapisi.sh` ·
`zarf-bicim-kapisi.sh` · biçim/devir/izin/jargon/SubagentStop kapısı · G4.5 sabit kapısı ·
bekçi kapıları · faz kapıları · "kapılanma" · `KAPI_` önekli ortam değişkenleri.

**`duran kapı` da buraya girer — sözlüğün ilk yazımı yanlıştı.** Burada `duran-kapi` →
`duran-gorev` yazıyordu; uygulama sırasında çürütüldü: `sevk.sh` bu cinsi "node bulunamadı",
"DUR işareti var", "gösterge bayat", "bekçi KIRMIZI" gibi **hiçbir görevle ilgisi olmayan**
hâllerde de basıyor. Duran kapı bir `G-NN` satırı değil, akışın açılmayan bir denetim noktasına
çarpmasıdır. Doğru okunuş — ikisi aynı cümlede yaşar:

> "açık **görev** var ama hiçbiri açılamıyor → duran **kapı**"

### Anlam 3 → **adım** (yeni bulundu)

`00_genesis/GENESIS_DURUM.md` başlığı `## Bekleyen kapı` bir **G-adımını** anlatıyordu (G0…G5) —
ne görev ne mekanizma. Aynı dosya zaten "Tamamlanan adımlar" diyor. → **`## Bekleyen adım`**
(ve `GENESIS.md`'deki ona yapılan atıf). Başka hiçbir yerde bu dönüşüm yok.

### Geri uyum — kokpit iki başlığı da okur

`tools/kokpit/lib/status.mjs` hem `## Görevler` hem `## Kapılar` okur. Sebep: kokpit kodu üç
kopyada bayt-bayt ortaktır (D-02) ve **üçüncü kopya** danışmanın kendi özel projesini okuyan
kokpittir; o proje eski başlığı kullanır ve oraya yazılmaz (D-05). Aynı yöntem 2026-07-14'te
sütun sayısı için de kullanılmıştı. İki başlığı da ayrı birer test tutar.

**Karne kaydının `kapi` alanı ve `KARNE-KAPI` satırı için geri uyum YOKTUR** — bilerek. Bu
mekanizma 2026-07-28'de doğdu; hiçbir kurulu projede eski yazımlı zarf günlüğü yok. Geri uyum
eklemek, hiç okunmayacak bir ikinci şemayı kalıcılaştırırdı.

**Kanıt (2026-07-29):** guard 343/343 iki kopyada · kokpit 52 test üç kopyada (50 → 52; eklenen
ikisi eski ve yeni başlığı tek tek tutar) · üçüncü kopyanın gerçek vault'u eski başlıkla sıfır
uyarıyla okunuyor (21 görev) · `keel-tatbikat-faz3` numunesi de sıfır uyarı · `kurulu-sim`
15.843B / marj 541B (freni geçiyor).

---

## 2b · İki ad doğuşta ayrıldı (GENESIS iskeleti, 2026-07-29)

Bu iki karar §5'in kuralının **önleyici** uygulamasıdır: kelimeler ürüne girmeden ayrıldı.

### "sevk" ikinci bir anlam kazanmadı → **sürücü**

Faz 1 tasarısı kurulum sırasını taşıyan betiğe `kurulum-sevk.sh` adını öneriyordu. Konmadı:
**sevk** bu sözlükte *bir görevi alt-ajana vermek* demektir (`tools/sevk/sevk.sh` onu yapar) ve
yeni betik alt-ajan çağırmaz — **adım sıralar**. Tasarının kendi gövdesi de ona zaten "sürücü"
diyordu; ad gövdeye uyduruldu: **`tools/guard/kurulum-surucu.sh`**.

| Ne yapar | Adı |
|---|---|
| Bir görevi alt-ajana verir, rol seçer, bütçe sayar | **sevk** — `tools/sevk/sevk.sh` |
| Kurulum adımlarını sıraya dizer, bitmemiş adımla oturumu kapattırmaz | **kurulum sürücüsü** — `tools/guard/kurulum-surucu.sh` |

Yeri de bilinçli: `tools/guard/` kurulum penceresinde de `[SERT]` korumalıdır, yani **kuran ajan
bu betiği oturum içinde yeniden yazamaz**. `tools/genesis/` gibi yeni bir dizin o korumanın
dışında kalırdı (ölçüldü). Kardeşleri aynı evde: `ortam-kontrol.sh` (G0.0) ·
`klasor-hazirligi.sh` (G0.1) · `kurulum-denetimi.sh` (G4.5).

### `## MEKANİK BLOK` adı ikinci bir sözleşmeye verilmedi → **`## KURULUM DURUMU`**

`## MEKANİK BLOK` panonun kendi sözleşmesine aittir (`tools/kokpit/PANO_SOZLESMESI.md`) ve kendi
alan dilbilgisi vardır (`Işıklar:` · `Görevler:` · `Son denetim:`). `GENESIS_DURUM.md`'nin makine
bloğu **başka** alanlar taşır (`Adım:` · `Durum:` · `Tamamlanan:`). Aynı adı iki ayrı sözleşmeye
vermek, aynı adı iki şeye vermektir — §5 tam bunu yasaklar. Biçim (başlık + fenced blok +
`Ad: değer`) aynen devralındı, **ad ayrıldı**.

| Dosya | Başlık | Alanlarını okuyan |
|---|---|---|
| `00_pano/PANO.md` | `## MEKANİK BLOK` | kokpit (`tools/kokpit/lib/status.mjs`) |
| `00_genesis/GENESIS_DURUM.md` | `## KURULUM DURUMU` | kurulum sürücüsü + açılış kancası |

**Durum alanının dört değeri** (birebir, Türkçe harflerle; tanınmayan değer fail-closed):
`başlamadı` · `açık` · `bekliyor` · `bitti`.

## 2c · İlk kutuyla doğan iki ad (Faz 2 sıra 5, 2026-07-30)

`5 · Bu dosyanın kuralı` gereği: ürüne giren her yeni kelime buraya bir satır düşer.

| Kelime | Ne demek | Nerede yaşıyor |
|---|---|---|
| **kabuk** | GENESIS'in kurulumda bıraktığı, **metni sabit** kutu dosyası. İçini ekip doldurur; GENESIS ürün planı yapmaz. "İskelet" DEĞİL (o, kanon dosyalarının boş hâli için kullanılıyor) ve "şablon" DEĞİL (o, KEEL'in kendisi) | `00_genesis/ILK_KUTU_KALIBI.md` → `01_kutular/KT-001-proje-plani/KUTU.md` |
| **planlama kutusu** | Görev listesi **dönem içinde doğan** kutu: ilk görevinin İŞİ, kalan görevleri üretmektir. Ürün dilimi kutusundan iki noktada ayrılır — ≤5 görev tavanı ona uygulanmaz (tavanı iş zincirindeki rol sayısı + 1) ve şişme çapası liste doğana dek çakılmaz | Kutu bunu `## Duruş sözleşmesi` bloğundaki `LİSTE: dönem içinde doğar` satırıyla ilan eder; okuyanlar: `tools/sevk/sevk.sh` · `tools/sevk/kurulum-kapisi.sh` · `tools/guard/kurulum-denetimi.sh` · bekçi |

**Neden yeni kelime gerekti:** "ilk kutu" bir SIRA bildiriyor, bir CİNS değil. Kural ("tavanı
farklıdır") sıraya değil cinse bağlı — ikinci bir planlama kutusu da açılabilir (`KUTU_PLANI`
boşaldığında ve proje bitmediğinde). Sıraya bağlanan kural, ikinci örnekte sessizce kırılırdı.

---

## 2d · Dönem dikişleriyle doğan/ölen adlar (Faz 2 sıra 7, 2026-07-30)

| Kelime | Ne demek | Nerede yaşıyor |
|---|---|---|
| **evre** | Bir dönemin üç hâlinden biri: `yapim` → `kapanis` (→ KIRMIZI karnede geri `yapim`). Dönem AYNI dönemdir; kimliği, bütçesi ve günlük dilimi değişmez — yalnız göstergenin 3. alanı yeniden yazılır. "Yeni dönem" DEĞİL | `tools/sevk/.donem-acik` 3. alan · `tools/sevk/ortak.sh` `donem_turu_yaz` · günlükte `evre-gecis` kaydı |
| **izin sınıfı** | Kutunun `İZİN:` satırında önceden serbest bırakılan komut/yazım cinsi. Kapalı sözlük: `git-obje` · `disa` · `mcp` · `yazim` · `korumali-yol` · `kutu-ciktilari`. Sahibin kutu açılışında verdiği izin; dönem içinde genişletilemez | `KUTU.md` duruş sözleşmesi · `tools/guard/file-guard.sh` · `tools/sevk/kurulum-kapisi.sh` |
| ~~**kip** (`interaktif` / `bassiz`)~~ | **ÖLDÜ (F1-5e).** Yalnız bir not dizesi üretiyordu; davranışı oturumun nasıl başlatıldığı belirliyordu. İzin penceresi artık hiçbir kipte açılmadığı için anlattığı ayrım da kalmadı | Eski beş-alan gösterge okunmaya devam eder (`ortak.sh` geri uyumu) |
| ~~**prova fişi** (`tools/sevk/damgalar/T0-T4`)~~ | **ÖLDÜ (F1-5h).** KEEL sürümünün provasını kanıtlıyordu, kullanıcının kurulumunu değil; dolu geldiği için kapı baştan mühürlüydü | Prova kaydı geliştirme arşivinde, beyan olarak yaşar; dağıtılan pakette YOKTUR (K27) |

---

## 2e · Yayın yoluyla doğan adlar (K8, 2026-08-11)

Ölçüm: bu paketten önce **"sürüm"** üründe 104 satırda geçiyordu ve en az üç ayrı şeyi
anlatıyordu; hiçbiri KEEL'in kendi yayın numarası değildi. §5'in kuralı gereği anlamlar
ayrılır — açıklama eklenmez.

| Kelime | Ne demek | Nerede yaşıyor |
|---|---|---|
| **sürüm** | **KEEL'in yayın numarası** (`v0.0`, `v0.1`…). Numarayı yalnız yayın töreni verir; bir kez verilir ve anlamı değişmez | `SURUM.md` — kökte, dağıtımla gelir, kurulumdan sonra projede KALIR ([SERT]) |
| **künye** (sürüm künyesi) | `SURUM.md`'nin iki makine satırı: sürüm + hangi geliştirme commit'inden çıktığı + ağaç özeti (`KEEL-SURUM|…`) ve deneme kurulumu kaydı (`KEEL-DENEME|…`) | `SURUM.md`. Adın diğer kullanımları (README'nin tek satırlık proje künyesi · bekçinin ATIF KÜNYESİ) başka yüzeylerdedir; ikisi de "sürüm künyesi" DEĞİLDİR |
| **yayın** | Numaralı sürümün herkese açık depoya çıkması. Üç aşamalı yolun üçüncüsü | Herkese açık depo (`batuhanozgun/keel`) + `v<numara>` git etiketi |
| **deneme kurulumu** | Yolun ikinci aşaması: yayınlanacak ağacın taze bir klasöre açılıp orada kendi testlerini koşturması. **"Prova" DEĞİL** (§1'deki tanım: deneme klasöründe yapılan tatbikat) ve GENESIS'i koşturmaz | Kaydı `SURUM.md`'nin `KEEL-DENEME` satırında |
| ~~**sürüm damgası**~~ | **DOĞMADAN ÖLDÜ.** Prova kaydı ve `00_genesis/GENESIS_DURUM.md` bu adı kullanıyordu. "damga"nın üç anlamı zaten bilerek korunuyor (§4); dördüncüsü D-27'yi çiğnerdi | İki metin de düzeltildi; ad **künye** oldu |

**Bilerek DEĞİŞMEYEN iki "sürüm":** zarf günlüğünün şema alanı (`surum: 1` / `surum: 4`) ve
Node **sürüm tabanı** (`tools/guard/node-tabani.txt`). İkisi de KEEL'in yayın numarası değildir
ve çakışmazlar: biri JSONL alan adı, öteki dış aracın sürümü. `tools/kokpit/package.json`'daki
`"version": "1.0.0"` da KEEL'in sürümü DEĞİLDİR — kokpitin özel npm paket sürümüdür.

## 3 · "pano" İKİ şeyi anlatıyordu · UYGULANDI

Düzeltme tarihi: 2026-08-11 (K9). Yöntem §2'nin emsali: **749 satır tek tek sınıflandırıldı**,
mekanik toplu değiştirme yapılmadı. Sayı yeniden üretilebilir: K9'dan önceki
commit'te `git grep -c -i pano <o commit>` izlenen 89 dosyada 749 satır sayar.

**Ölçümün tek cümlesi: kod katmanı temizdi, yüzey katmanı kirliydi.** Ayrıştırıcı tarafında
(`tools/bekci` · `tools/guard` · `tools/sevk` — 390 geçiş) referans hep doğruydu:
pano okunan veri, kokpit okuyan. Çakışmanın neredeyse tamamı **kokpitin kendi yüzeyindeydi**:
sekme başlığı, marka yazısı, geri düğmesi, başlatıcı mesajı, README. İki yerde eş anlamlılık
açıkça ilan edilmişti (`public/app.js` bölüm yorumu · `launcher/Kokpit.command` başlığı),
üçüncüsü kurulum adımındaydı ("başka bir pano/KEEL kokpiti").

| Eski | Yeni | Ne demek |
|---|---|---|
| pano | **pano** — değişmedi | `00_pano/PANO.md`: projenin durumunu tutan DOSYA. Ekip yazar, bekçi damgalar |
| pano | **kokpit** | `tools/kokpit/`: vault'u salt-okuyan yerel web uygulaması. Hiçbir şey yazmaz |

**Ayrım tek cümlede: pano YAZILAN dosyadır, kokpit yalnız OKUYAN uygulamadır.** Sahibin
ekranında panodan söz etmek meşrudur ve gereklidir (*"panodaki rol ekipte yok"*); yasak olan, **kokpitin KENDİNE
pano demesidir.** Ters yön (panoyu yeniden adlandırıp adı kokpite bırakmak) ölçülüp elendi:
izlenen 65 dosyada `00_pano` yolunun **369 geçişi** (`git grep -o 00_pano <o commit>`) +
kokpit taşıyan beş kurulu proje + yazılamayan bir vault, karşılığında sıfır kazanç.

### Makine adları

| Eski | Yeni |
|---|---|
| `<title>pano</title>` · marka `pano.` · alt marka `panosu` | `kokpit` · `kokpit.` · `kokpiti` |
| ayar alanı `altBaslik` | **ÖLDÜ.** Uygulamanın adı projeye göre değişen bir ayar değildi: tek meşru değeri vardı, GENESIS onu her projeye elle yazıyordu ve kopyaya özel olduğu için hiçbir kapı ölçemiyordu. Alt marka artık paylaşılan kodda sabittir: eski ayar dosyaları YENİ KODLA doğru adı gösterir. Kurulu projeler bugünkü kodlarıyla eski adı göstermeye devam eder — oraya değişiklik götüren tören yok (K4) |
| `DEFAULTS.baslik = 'Pano'` | `'Proje'` (ayarsız hâlde markanın yedeği `proje`) |
| geri düğmesi `← pano` | `← geri` — dosya görünümünden dönülen yer kokpitin KENDİSİDİR; ona ekranın içinde ikinci bir ad vermek aynı kuralı yeniden çiğnemek olurdu |
| `view = 'pano'` · `renderPano()` · `showPano()` · `#pano-view` | `'kokpit'` · `renderKokpit()` · `showKokpit()` · `#kokpit-view` |
| `npm run pano` | `npm run kokpit` |
| G3b madde 4 `Panoyu bağla` | `Panoyu kur` — bağlanan kokpittir (G5 0b), pano ÜRETİLİR |

### Kapı — kelimeyi kural değil test tutuyor

`tools/kokpit/test/ad-tekligi.test.mjs`. Ölçtüğü şey **uygulamanın kendini adlandırdığı
yerlerdir**: marka · alt marka · sekme başlığı · geri düğmesi · sunucunun varsayılanları ve
açılış satırı. Kelimeyi YASAKLAMAZ — yasaklayan bir kapı doğru cümleyi de keserdi ve ilk
düzeltme "kapıyı sustur" olurdu; ayrı bir test bu freni ölçer. Marka tarafı kaynağı değil
**çizilen ekranı** okur ve bunu bilerek ESKİ ayarla (`altBaslik: "panosu"`) yapar: kurulu
projelerin bugün diskte duran ayarı budur.

## 4 · Değişmeyenler — bilerek

| Ne | Neden |
|---|---|
| **`koşul`** kelimesi (= şart) | "koşu" ile ilgisi yok; LICENSE'taki "Kullanım Koşulları" dâhil |
| **`keel-tatbikat-*`** deneme kitlerinin adı (`Dev/keel-tatbikat-e1` gibi) | KEEL'İN KENDİ adıdır, yabancı bir projenin değil: prova kitleri bu adla kuruldu ve o provaların tarihi bu adla anılıyor. Muafiyet DAR: yalnız geçmiş provaların ADI. Yeni bir kit adı ürüne girmez |
| `00_pano/` · `PANO.md` · `PANO_SOZLESMESI.md` · `pano-alanlari.txt` · testlerin `panoDamga` `panoIsik` `panoSayac` alan adları | Hepsi PANO DOSYASINI anlatır, yani §3'ün koruduğu tek anlamdır. Klasör adı kurulu her projede diskte yaşıyor ve kurulu projeye değişiklik götüren tören henüz yok |
| **üçüncü kopya** — kokpitin D-02 kapsamındaki üçüncü bayt-eş kopyası | O kopya danışmanın kendi aracında yaşar ve ürün DEĞİLDİR. **Adı üründe geçmez** (K27, 2026-08-12): yayınlanan ağaçta yabancı bir özel projenin adı SIFIRDIR — kendi deposunun adı, klasörü ve başlatıcı dosyası yalnız o makinede yaşar. Ürün metni ona "üçüncü kopya" der; başka bir ad kullanmaz |
| **`damga`** — rol damgası, kapanış damgası, tarih damgası | Gerçekten damgadır; tek istisna aşağıda |
| **`yapim` · `kurulum` · `kapanis`** dönem **evreleri** | `yapim` iş üretir; `kurulum` ve `kapanis` hiçbir şey üretmez, **denetim evresidir**. Faz 2 sıra 7'de "tür" değil **evre** dendi (aynı dönemin üç hâli) ama makine-okur değerler DEĞİŞMEDİ: gösterge ve `/donem` argümanı aynı üç kelimeyi kullanır — değer değişimi geri-uyum bedeli ister, ad değişimi istemez |
| kokpitteki İngilizce `gates` · `parseGates` alanları | Türkçe "kapı"nın iki anlamı İngilizce adda çakışmıyor: kodda mekanizmalara hiçbir yerde `gate` denmiyor. Ad kokpitin JSON sözleşmesidir ve üç kopyada bayt-bayt ortaktır — değiştirmek D-02 eşitleme riskini karşılıksız artırırdı |
| `KURULUM` · `KAPANIS` **görev** kimlikleri ile `kurulum kapısı` · `kapanış kapısı` **mekanizmaları** | İkisi ayrı şey ve ikisi de doğru: kimlik, karnenin konusu olan denetim görevidir; kapı, o mühürden önce geçilmesi gereken denetim noktasıdır |

---

## 5 · Bu dosyanın kuralı

Yeni bir kelime ürüne girerken buraya bir satır düşer. Bir kelime iki şeyi anlatmaya
başladıysa, çözüm ikinci anlama yeni bir kelime bulmaktır — açıklama eklemek değil.
