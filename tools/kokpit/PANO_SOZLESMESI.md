# PANO Sözleşmesi — kokpitin okuduğu biçim

Kokpit (`tools/kokpit/`) vault'u SALT-OKUR ve tek ekranda gösterir. Bunu yapabilmesi için
vault'un makine-okur biçimi sabit olmalı. Bu belge o **sözleşmedir**: **söz dizimi sabit,
içerik serbest.** GENESIS her projede bu iskeleti aynen üretir.

## Sabit (söz dizimi — değişmez)

- **Dizin şeması:** `00_pano/{PANO,SAGLIK,ERTELENENLER}.md` (+ `00_pano/oturum-gunlugu.jsonl` —
  makine günlüğü; tek yazarı kapanış kancası, kokpit okumaz) · `01_kutular/KT-*/**/KUTU.md` ·
  `01_kutular/_arsiv/` · `03_roller/<rol>/DURUM.md` · `02_kanon/`
- **Ayıraçlar:** alan ayıracı ` · ` (U+00B7, boşluklu) · durum ayıracı ` — ` (U+2014, em-dash).
  ASCII'ye normalize edilmez; `toLowerCase` uygulanmaz (Türkçe İ/ı).
- **PANO mekanik blok:** `## MEKANİK BLOK` başlığı altında ``` ``` ``` fenced blok. **Alan
  listesi bu belgede DEĞİL, `pano-alanlari.txt` dosyasındadır** (U74): yazar (bekçi) ve okuyucu
  (kokpit) tabloyu oradan TÜRETİR. Aşağıdaki tablo o dosyadan ÜRETİLİR; belge listeyi elle
  yazsaydı üçüncü kopya olur ve yine ayrışırdı — test bayt-eşliğini ölçer.
  **Sınır nettir ve ölçülür:** hangi alanların olduğu, hangi sırada durdukları ve KİMİN NEYİ
  yazmak/okumak ZORUNDA olduğu yalnız `pano-alanlari.txt`tedir. Bu belge yalnız DEĞERİN
  GRAMERİNİ taşır — tek tek öneklerin burada geçmesi bu yüzden meşrudur, zorunluluk
  cümlesi kurması değildir. Test ikisini ayırır ve sınır şudur:
  `zorunlu` · `kurulu` · `istegebagli` · `kosullu` · `bosluk` sözcükleri — yani `pano-alanlari.txt`in sütun sözlüğü — bu belgede bir alan hakkında hüküm kuramaz.

<!-- pano-alanlari:baslangic — ÜRETİLEN BLOK, elle yazma. Kaynak: pano-alanlari.txt (U74) -->
| Alan | Satır öneki | Yazar | Okuyucu | Eksik-hâl |
|---|---|---|---|---|
| son-denetim | `Son denetim:` | her | zorunlu | not |
| isiklar | `Işıklar:` | her | zorunlu | bosluk |
| gorevler | `Görevler:` | her | zorunlu | not |
| sahipte-bekleyen | `Sahipte bekleyen:` | her | kurulu | not |
| sira | `Sıra:` | her | istegebagli | - |
| durak | `Durak:` | kosullu | istegebagli | - |
| sayac | `Kırmızı:` | her | zorunlu | bosluk |
<!-- pano-alanlari:bitis -->

  Sütunların ve değerlerinin tanımı `pano-alanlari.txt` başlığındadır.
  Tablonun TAŞIMADIĞI kısım değerin gramerdir; o tüketicinin bilgisidir:
  - `Son denetim: YYYY-MM-DD HH:MM (denetim #N)`
  - `Işıklar: <AD>=<değer> · <AD>=<değer> · …`  → **NAME=val çiftleri** (ad serbest, değer ciddiyet sözlüğünden)
  - `Görevler: G-NN=<durum> · …`
  - `Sahipte bekleyen: N` — sahibin kuyruğundaki açık madde sayısı (`00_pano/SENDE_BEKLEYEN.md`);
    kokpit ekranında görünür.
  - `Sıra: sahip | sistem | bilinmiyor` — `sistem` = yapı kendi başına çalışıyor, kokpit sahibi
    oturum açmaya ÇAĞIRMAZ; `bilinmiyor` = okunamadı, yön fail-safe (bilmediğimiz hâlde "sıra
    sende" denmez). Sözlük dışı bir değer tanınmaz ve `bilinmiyor` sayılır.
  - `Durak: <sebep>` — sistem insan girdisi bekliyorken basılır. Sebep metninin sonundaki iç
    kural kodu (`(D9)` gibi) sahibin ekranına ÇIKMAZ; panoda kalır, ajanlar okur.
  - `Kırmızı: N · Sarı: N` — **SAGLIK kalem sayılarıyla eşit olmak zorundadır**; ayrışırlarsa
    kokpit okuma notu basar ve genel durumu yeşilden düşürür (aynı koşunun iki görünümü).
- **Ciddiyet sözlüğü (sabit Türkçe):** `YEŞİL` · `SARI` · `KIRMIZI` · `VERİ-YOK` (nötr).
- **PANO yargı bloğu (koordinatör nesri):** kalın etiketli satırlar —
  `- **Aktif kutu:** …` · `- **SIRADAKİ OTURUM:** <rol> — …` · `- **Paralel açılabilir:** …` · `- **Blokaj:** …`
- **KUTU görev tablosu:** `## Görevler` başlığı altında `| Görev | İş | Sahip | Durum | Kanıt |` tablosu.
  **Kanıt** = kanıt-işaretçisi (`test:`/`demo:` öneki ya da vault yolu); varlık denetimini bekçinin
  bağ-varlık kategorisi yapar (yeni projelerde zorunlu; açık görevde `test:`/`demo:` tipi — yol-tipi
  görev kapanırken yazılır). Kokpit 4 sütunlu eski tabloyu **ve** eski `## Kapılar` başlığını da
  okur (geri-uyum); `—` hücresi "işaretçisiz" sayılır.
  - **Tek-faz:** Faz alt-başlığı yok → tablo doğrudan aktif.
  - **Çok-faz:** `### Faz A …` (aktif) · `### Faz B …` (iskelet, pasif). Görev ID öneki `G-`.
- **Rol durumu:** `03_roller/<rol>/DURUM.md`, `# DURUM — <Ad>` başlığı; `**Son oturum:** …` satırı.
- **ID önekleri:** kutu `KT-` · görev `G-`.

## Serbest (içerik — projeye göre değişir)

- Rol adları ve sayısı (`03_roller/*`'tan okunur; kokpit saymaz-sabitlemez).
- Işık boyutlarının **adları/sayısı** (`NAME=val` jenerik okunur; AKIŞ/DOSYA/DAVRANIŞ zorunlu değil).
- Kutu faz sayısı (tek/çok).
- Proje başlığı · sahip adı · renkler · vault yolu → `tools/kokpit/kokpit.config.json`.
- Koordinatör rolünün slug'ı → `kokpit.config.json` `koordinatorRol` (varsayılan `koordinator`).
- Rol açılış TARİFİ → `kokpit.config.json` `rolToreni`: `true` = "proje kökünde `/rol-<slug>` yaz →
  'ROL AÇIK' → `devam`" metni (KEEL projeleri — tören rol kafesini kurar); alan yok/`false` =
  "rol klasöründe oturum aç" metni (eski kurgular — geri-uyum, varsayılan).

## "Sıradaki" bayatlığı (kokpit ipucu)

Yargı bloğunu yalnız koordinatör yazar. Bir rol işini bitirip koordinatöre devrettiğinde
panoda bir an eski "sıradaki" yazılı kalabilir. Kokpit bunu **deterministik** yakalar: SIRADAKİ
rolünün `DURUM.md` dosya-değişim-zamanı, koordinatörünkinden yeniyse → *"koordinatör sevki
bekleniyor"* gösterir (rol adı değil dosya mtime; aynı-gün ayrımı için).

> **GENESIS/kapanış yazım sırası (load-bearing — iki mtime kısıtını BİRLİKTE çözer):**
> önce diğer rol `DURUM.md`'leri → sonra `03_roller/koordinator/DURUM.md` (rol dosyaları arasında **en yeni**)
> → **EN SON bekçiyi koştur** (SAGLIK+PANO damgasını o yazar; ikisi de drift-skip listesinde). Böylece
> hem "koordinatör en yeni rol" (yoksa yanlış *"sevk bekleniyor"*) hem "SAGLIK damgası tüm canlı dosyalardan
> yeni" (yoksa drift-radar yanlış SARI) aynı anda sağlanır. Koordinatör DURUM'u bekçiden ÖNCE ama diğer
> rollerden SONRA yaz.

## Load-bearing yazımlar (harfi harfine — kayarsa uyarı/yanlış-skor)

Parser bu string'leri **birebir** arar; ASCII'ye çevirme, harf değiştirme:

- `## MEKANİK BLOK`  (İ = U+0130, noktalı büyük I)
- Bloğun **satır önekleri burada TEKRARLANMAZ** — evi `pano-alanlari.txt`, görüntüsü yukarıdaki
  üretilen tablodur (U74). Türkçe harfler load-bearing: `Işıklar:` noktasız büyük I ile,
  `Son denetim:` küçük "d" ile, `Kırmızı:` ve `Sıra:` noktasız ı ile yazılır.
- **Geri uyum (dil paketi, 2026-07-29):** damga satırının kanonik yazımı `Son denetim: … (denetim #N)`.
  Parser eski yazımı (`Son koşu: … (koşu #N)`) da okur — kokpit kodu üç kopyada ortaktır (D-02) ve
  üçüncü kopya, eski yazımı kullanan ve yazılmayan bir vault okur (D-05). **Yeni kurulum
  eski yazımı ÜRETMEZ.**
- **Ciddiyet değerleri:** `YEŞİL` · `SARI` · `KIRMIZI` · `VERİ-YOK` (nötr). ASCII `YESIL` **skorlanmaz** → nötr sayılır, sistem yanlışlıkla yeşil görünür.
- `# DURUM — <Ad>`  (— = U+2014 em-dash, çevresinde boşluk) · `**Son oturum:** …`
- Boş rol için gövdede `Henüz oturum açılmadı` (parser bunu "boş" işaretler).
- **Ayıraçlar:** alan ` · ` (U+00B7, çevresinde boşluk) · durum ` — ` (U+2014).
- **Rol slug'ları tek-token** (tire/boşluk yok; ör. `urun` — `urun-ortagi` DEĞİL). SIRADAKİ ayrıştırıcısı slug'ın yalnız ilk kelimesini alır; tireli slug "sevk bekleniyor" tespitini ve "aç: `<rol>`" etiketini bozar.

**En güvenli yol:** `tools/kokpit/test/fixtures/tekfaz/` dosyalarını **kopyalayıp içeriğini değiştir** —
diakritikler otomatik doğru gelir, elle yazım hatası olmaz.

## Okuma bütünlüğü — vaadin ölçülen hâli (K13)

Bu belge en baştan *"asla sessiz maskeleme"* diyordu; kod demiyordu. 2026-08-05 ölçümü dört
bozmada **sıfır uyarı + YEŞİL** saydı: sayaç-kalem çelişkisi · ışığa açıklama eklenmesi ·
damga tek harf sapması · ışık satırının tamamen silinmesi. Vaat artık mekaniktir
(`test/okuma-butunlugu.test.mjs`; 17 kasıtlı bozmanın 17'si kırmızı):

- **NOT** — satır sözleşme dışı ama hüküm kaybolmadı (değerden sonra açıklama, okunmayan PANO
  damgası, iki bloğun ayrı denetimden gelmesi): okuma notu basılır, genel duruma dokunulmaz.
  Değerden sonra gelen serbest metin ışığı **DÜŞÜRMEZ** — kaybolan ışık, sözleşme dışı yazılmış
  ışıktan tehlikelidir (canlı örnek: `DAVRANIŞ=VERİ-YOK (Denetçi örneklemesi …)` sessizce
  düşüyordu ve KIRMIZI'yı da aynı sessizlikle götürebilirdi).
- **BOŞLUK** — ışık hükmünün bir parçası kayboldu (satır yok · parça çözülemedi · ikinci kaynak
  yok · değer sözlük dışı): okuma notu + **genel durum YEŞİL basamaz**, sahibe sebebi söyleyen
  şerit çıkar. Boşluk yalnız yeşili düşürür; VERİ-YOK zaten "bilmiyorum", KIRMIZI zaten en kötü.
- **Listelenen KIRMIZI kalem varken rozet yeşil olamaz** — ışıklar ve kalemler aynı koşunun iki
  görünümüdür; biri kırmızıyken ötekinin yeşil basması kokpitin kendi gövdesiyle çelişmesiydi.

## Neden sözleşme?

Kokpit parser'ı jeneriktir; onu bir projeye bağlayan tek şey bu söz dizimidir. GENESIS bu
iskeleti üretirse kokpit **0 uyarı** ile okur (gerçek koşularda kanıtlandı).
Söz dizimi bozulursa kokpit ilgili satır için "okuma notu" uyarısı basar (asla sessiz maskeleme).
