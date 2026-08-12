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
Adım: G0
Durum: bitti
Tamamlanan: —
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

## Karar alanı teyidi
(G3.3f-ii'de doldurulur. Sahip profili sahibe geri okunup onaylandığında buraya satır başında
"Karar alanı teyidi: <sahip adı> · <tarih>" biçiminde TEK satır yaz. Çekilme kapısı bu satırı
arar: yoksa KIRMIZI — sahibe hangi sorunun gideceğini kuran ajanın kendi kalemi belirlemiş olur.)

## Format spec (G3b'de doldurulur)
(henüz yok)
