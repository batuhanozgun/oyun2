# Hayat Oyunu — nasıl kullanılır

Kurulum bittikten sonra da günlük kılavuzun budur.

## Ekibin

- **Ürün sorumlusu** — ne yapılacağını ve bitti şartını yazar · `/rol-urun`
- **Koordinatör** — işi böler, sırayı tutar, soruları süzer · `/rol-koordinator`
- **Oyun tasarımcısı** — oyunun kurallarını ve oynanışını kurar · `/rol-oyuntasarim`
- **İçerik yazarı** — olayları, seçenekleri ve metinleri yazar · `/rol-icerik`
- **Pedagoji zemini** — hangi yaşta ne öğrenilebilir, kaynağıyla arar · `/rol-pedagoji`
- **Çocuk güvenliği** — hangi konu nasıl gösterilir, sınırı çizer · `/rol-guvenlik`
- **Tasarım** — çocuğun gördüğü ekranı ve akışı tasarlar · `/rol-tasarim`
- **Geliştirici** — uygulamayı yazar · `/rol-gelistirici`
- **Denetleyen** — bitti denen işi bağımsız sınar · `/rol-denetci`
- **Dış göz** — durum brifingi yazar, iş yapmaz · `/rol-disgoz`
- **Yayın** — mağaza ve para işleri; uykuda · `/rol-yayin`

En çok muhatabın iki rol: fikir/şikâyet/demo → `/rol-urun` · süreç/sıra/takılma →
`/rol-koordinator`.

## Günlük döngü

1. `00_pano/PANO.md`'yi aç.
2. **"SIRADAKİ OTURUM: <rol>"** satırını gör.
3. Proje klasöründe yeni bir sohbet penceresi (oturum) aç.
4. `/rol-<rol>` yaz.
5. Açılış çıktısı **"ROL AÇIK"** deyince `devam` yaz.

Rolü **sen** açarsın; ekip kendi rolünü açamaz — bu kilit bilinçlidir. Rol değiştirmek yeni
oturum ister.

## Sen yokken çalışması

Ekip sen uyurken de çalışabilir. Başlatmak: `/donem` (tek iş varsa
onunla başlar, çoksa sorar) · bitirmek: `/donem kapat`.

**Senin onayın olmadan başlamaz** — o paketin onay satırı boşken makine reddeder; nezaket
değil, mekanik kilit. Bir karara ihtiyacı olursa **durur ve sana haber verir**, uydurmaz;
sabah o gecenin özeti önüne gelir. Bunun için e-posta bildirimi ve "yapı susarsa seni uyaran
nöbetçi" kurulmuş olmalı; kurulmadıysa bu biçim hiç açılmaz ve ekip sebebini söyler.

## İlk işin

Ekip ilk işte sana bir **plan** çıkaracak: bu proje ne zaman bitmiş sayılır · sıradaki işlerin
adı ve sırası · neleri bilmiyoruz (her satırda cevabın kimden geleceği yazılı) · hangi bilginin
nereye kaydedileceği. **Kod bundan sonra yazılır.**

## Nerede sen dahilsin

Bir işin **başında** onay, **sonunda** onay. Arada ürün sahibiyle sohbet ve sana gelen
"itiraz eder misin" davetleri. Arası ekibin işidir.

## Sonunda önüne gelecek paket

Kapanışta **dört şey** gelir: (1) başlangıçta söz verilen "gözünle göreceklerin"in nasıl
gösterileceği, (2) sağlık ışıkları ve son ölçüm tarihi, (3) denetleyenin hükmü,
(4) dış gözün brifingi. **Dördünden biri eksikse onaylamayın** — eksik paket geçersizdir.
Sana teknik bir soru soran paket hatalıdır: *"bunu denetleyene sor"* de. Teknik kanıtı
SEN değerlendirmezsin; paketin tam olmasına bakarsın.

## Her kapanışın üç başlığı

**BİTEN · SENDE BEKLEYEN · SIRADAKİ.** Orta satır ya "YOK" der ya "N madde" + numaralı sorular;
her madde dördünü söyler: neden soruluyor · seçimin neyi değiştirir · geri dönüşü var mı ·
itiraz etmezsen ne olur.

Maddeler `00_pano/SENDE_BEKLEYEN.md` listesine kendiliğinden düşer ve **silinmez**: cevaplayınca
işaretlenir, tarih ve cevabınla orada kalır. Yeni oturum açılışında *"sende bekleyen N madde"*
bilgi satırını görürsün — ısrar etmez, hatırlatır. İstediğin an **"bekleyenleri göster"** dersen
ekip listeyi sade dille okur; **"aksiyon alma, anlat"** dersen hiçbir dosyaya dokunmadan anlatır.

## Dış göz — senin koltuğun değil, senin için duran koltuk

Ekipte iş yapmayan, hiçbir dosyaya dokunmayan, yalnız SANA konuşan bir koltuk var. İşi tek şey:
**durum brifingi** — ne yapılıyor · neden · bu normal mi · sırada ne var + senden ne istenecek.
Sapma yazarsa arkasına kanıt satırı koymak zorundadır; bakamadığı yeri de yazar.

İstediğin an **"durumu anlat"** dersen açılır ve brifingi getirir; **iş kapanışında
brifing zorunludur** (paketin dördüncüsü). Uzun süre brifing yazılmamışsa oturum açılışında tek
satır hatırlatma görürsün — ısrar etmez.

Ekibin denetleyeni işin doğru yapıldığını kanıtlar; **dış göz senin doğru şeyi onayladığını
kontrol eder.**

## İş verirken 4 soru kartı (60 saniye)

1. Bitince neye bakıp "tamam" diyeceğim?
2. Ekip "iyi görüneyim" diye fazladan ne ekleyebilir — **bunlar YOK**.
3. Bu iş hangi kararı besliyor?
4. Çıktı en fazla ne kadar?

Bulanık bıraktığın her yeri ekip "kapsamlı görünme"yle doldurur.

## Ara sıra sana iki kontrol sorusu gelebilir

*"Sahte seçenek menüsü gördün mü?"* ve *"sana taşınan karar gerçekten senin miydi?"* — dürüst
cevabın ekibin en sinsi iki hatasını yakalar.

## Tek ezberin

`00_pano/SAGLIK.md`'deki tarih damgası **yoksa ya da bir günden eskiyse sistem KIRMIZI'dır.**

## Tek ekrandan izleme

**Kokpit** (`tools/kokpit`) tarayıcıda tek ekranda sağlık ışıkları · sıradaki adım · açık işin
maddeleri · roller gösterir. Açmak: `launcher/Kokpit.command`'i Masaüstüne kopyala + çift tıkla,
ya da `cd tools/kokpit && npm start` → `http://127.0.0.1:4173`. **Salt-okunur** —
hiçbir şeye dokunmaz. İçindeki **"nasıl kullanılır"** düğmesi bu dosyayı gösterir.

## Düşman-gözü incelemesi (isteğe bağlı)

Büyük bir iş onayına gelmeden önce `/hasim-inceleme` yazarsan ekip, işi birbirinden bağımsız
birkaç açıdan tarar ve bulduklarını çürütmeye çalışır. Uzun sürer ve pahalıdır; küçük işte
gerekmez — koordinatör gerektiğinde önerir.
