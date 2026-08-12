<!-- yazar: GENESIS · G2.5 · mühür: Ahmet · 2026-08-12
     Kadro tablosunun TEK EVİ burasıdır. EL_KITABI "Kadro + kapsam" bölümü buraya İŞARET EDER,
     tabloyu kopyalamaz (tavan payı + aynı olguyu iki yerde yazmak drift kapısıdır).
     Rol sözleşmeleri: 03_roller/<slug>/ROL.md · slug'lar tek-token ASCII (kurulum denetimi şartı). -->

# KADRO — bu projenin ekibi

**Kadro mührü: Ahmet · 2026-08-12** — "Evet bu kadro uygun."
Kadran: **ritüel tam · kadro geniş · sahibe giden soru trafiği dar** (sahibin G1 revizyonu).

## Koltuklar

| Slug | Rol | Araç profili | Durum |
|---|---|---|---|
| `urun` | Ürün sorumlusu | tam | etkin |
| `koordinator` | Koordinatör | tam | etkin |
| `oyuntasarim` | Oyun tasarımcısı | tam | etkin |
| `icerik` | İçerik yazarı | tam | etkin |
| `pedagoji` | Pedagoji zemini | tam (dar beyaz-liste) | etkin |
| `guvenlik` | Çocuk güvenliği ve uyum | tam (dar beyaz-liste) | etkin |
| `tasarim` | Deneyim ve görsel tasarım | tam | etkin |
| `gelistirici` | Geliştirici | tam | etkin |
| `denetci` | Denetçi | **yazamaz** | etkin |
| `disgoz` | Dış göz | **yazamaz** | etkin (zorunlu koltuk) |
| `yayin` | Yayın ve ticaret | tam | **uyuyan** |

**yazamaz** = dosya-yazma araçları kancayla kilitlidir; kendi `03_roller/<slug>/` klasörü dışına
yazamaz. İyi niyet değil mekanik kısıt: denetleyenin denetlediği şeyi düzeltememesi tasarımdır.

**`yayin` uyanma tetiği:** ① çocuğun eline verilebilir çalışan bir sürüm çıktığında ·
② para modeli çatalı sahibin önüne gitmeye hazır olduğunda · ③ mağaza hesabı/dağıtım işi ilk kez
gündeme geldiğinde. Öncesinde açılmaz.

## Tanıtım tablosu (mühürlenen hâl)

| Rol | Bu projede somut işi | Yazar / Okur | Bu rol yoksa | Komşusundan farkı |
|---|---|---|---|---|
| Ürün sorumlusu | Vizyondan tek kutuluk dilim seçer, "bitti" ne demek yazar | Yazar: kutu kapsamı, kararlar · Okur: VIZYON, kilitli kararlar | Ekip teknik olarak kusursuz ama yanlış şeyi üretir | Koordinatör "kim/ne zaman" der; o "ne/neden" der |
| Koordinatör | Kutuyu görevlere böler, sahip atar, sahibe gidecek soruları süzer | Yazar: görev tablosu, pano · Okur: rol durumları | On rolün ham soruları doğrudan sahibe akar | Ürün "ne"yi seçer; o sırayı ve sahibini kurar |
| Oyun tasarımcısı | Kararın sonucunu dakikalar içinde gösteren mekaniği kurar | Yazar: mekanik tarifi · Okur: VIZYON §3, pedagoji zemini | Resimli bir bilgi yarışması kalır | Tasarımcı görünen yüzü kurar; o kuralı kurar |
| İçerik yazarı | Sahnenin olay/seçenek/sonuç metinlerini yaş etiketiyle yazar | Yazar: metin havuzu, ton kılavuzu · Okur: hassas konu rayı, mekanik | Oyun beş ağızdan konuşur; hacim projeyi durdurur | Oyun tasarımcısı kuralı kurar; o kuralın içini doldurur |
| Pedagoji zemini | Yaş-algı sorularını kaynaklı cevaplar, cevaplayamadığını boşluk işaretler | Yazar: zemin dosyaları · Okur: VIZYON §3, §8 | Kaynaksız pedagojik cümleler üretilir, kimse sormaz | Güvenlik "ne gösterilmez" der; o "ne öğrenilebilir" der |
| Çocuk güvenliği ve uyum | Hassas konu rayını yazar; veri toplayan bileşen var mı tarar | Yazar: hassas konu rayı, uyum listeleri · Okur: VIZYON §5, §7 | Sahibin en pahalı saydığı kayıp korumasız kalır | Denetçi işin ölçüte uyduğunu sınar; o ölçütün çocuğa uygunluğunu sınar |
| Deneyim ve görsel tasarım | Çocuğun ne göreceğini, nereye dokunacağını, ebeveyn kapısını tasarlar | Yazar: ekran tarifleri, görsel/ses · Okur: mekanik, yaş ergonomisi | Mekanik doğru olsa bile çocuk ne yapacağını bulamaz | Oyun tasarımcısı kuralı; o kuralın görünen yüzünü kurar |
| Geliştirici | Tarif edilen sahneyi iPhone/iPad'de çalışan uygulamaya çevirir | Yazar: uygulama kaynağı · Okur: kabul ölçütleri, ekran tarifi | Tasarım ve içerik havada kalır | Tasarımcı tarif eder; o çalışır hâle getirir |
| Denetçi | "Bitti" denen işi bağımsız sınar; negatif ölçütü ayrıca tarar | Yazar: yalnız kendi karnesi · Okur: ölçütler, kararlar, çıktı | "Bitti" kelimesinin karşılığı kalmaz | **denetçi işin doğru yapıldığını kanıtlar; dış göz sahibin doğru şeyi onayladığını kontrol eder** |
| Dış göz | İzi zaman içinde okur; sahibe "ne · neden · normal mi · sırada ne" yazar | Yazar: yalnız brifingi · Okur: her şey (salt-okuma) | Sahibin elinde yalnız ekibin kendi raporu kalır | **denetçi işin doğru yapıldığını kanıtlar; dış göz sahibin doğru şeyi onayladığını kontrol eder.** Kokpit sınırı: kokpit DURUMU gösterir, dış göz GEREKÇEYİ ve NORMALLİĞİ anlatır |
| Yayın ve ticaret | Mağaza süreci, derecelendirme beyanı, para modelinin somutlaşması | Yazar: mağaza metinleri · Okur: uyum listesi | İş, sahibin önüne inceleme reddi olarak çıkar | Güvenlik kuralı söyler; yayın onu mağaza sürecinde uygular |

## Kapsam yüzeyi — VIZYON §6 alt-sistemleri kimde

| Alt-sistem | Sahibi | Destek |
|---|---|---|
| 1 · Karar → sonuç motoru | `oyuntasarim` | `gelistirici` (inşa), `pedagoji` (zemin) |
| 2 · Hayat çizgisi | `oyuntasarim` | `urun` (kapsam) |
| 3 · İçerik havuzu | `icerik` | `oyuntasarim` |
| 4 · Yaşa göre uyarlama | `oyuntasarim` (mekanik) | `tasarim` (yüzey), `pedagoji` (zemin), `icerik` (etiket) |
| 5 · Pedagoji ve hassas konu rayı | `pedagoji` (ne öğretilir) **+** `guvenlik` (ne gösterilmez) | — |
| 6 · Çocuk arayüzü / oyun hissi | `tasarim` | `oyuntasarim` |
| 7 · Ebeveyn yüzeyi | `urun` (ne olacağı) | `tasarim` (nasıl görüneceği) |
| 8 · Uyum ve güvenlik | `guvenlik` | `gelistirici` (mimari karşılığı) |
| 9 · Çok dillilik | `icerik` (yazım) **+** `gelistirici` (teknik ayrım) | — ayrı rol AÇILMADI |
| 10 · Ticaret | `yayin` (**uyuyor**) | — |
| 11 · Teknik temel | `gelistirici` | `denetci` |

**Çapraz koltuklar:** sıra ve trafik `koordinator` · bağımsız doğrulama `denetci` ·
sahibe normallik raporu `disgoz` · mekanik denetim **bekçi** (rol değil, betik — G3a'da doğar).

### Sahipsiz kalan alanlar — sahibe kırmızı olarak gösterildi ve mühürde kabul edildi

1. 🔴 **Gerçek uzman görüşü.** `pedagoji` koltuğu iddiaları kaynağa bağlar ve dayanaksızı
   işaretler ama **uzman değildir ve öyle davranmayacaktır**. Sahibin "uzmanlar tavsiye etsin"
   hedefi (VIZYON §4.3) bir noktada **sahibin gerçek bir insana ulaşmasını** gerektirir.
   Bu, VIZYON §8.1'deki açık borçtur; hiçbir rol onu kapatamaz.
2. 🔴 **Ticaret / mağaza** — `yayin` uyuyana kadar sahipsiz. Bilinçli.
3. 🟡 **Duyurma / pazarlama** — ürün yokken erken. `yayin` uyandığında kapsamına girer;
   o ana kadar açık kalır ve örtülmez.
4. 🟢 **Çeviri** — gerçek çeviri yükü doğmadan rol açılmadı (boş koltuk üretmemek için).
   Disiplin olarak yürür: metin baştan çevrilebilir yazılır (VIZYON tohum 5).

## Bir iş, uçtan uca

Örnek iş: *"6 yaş bandı için tek bir karar sahnesi çalışsın."*
`urun` dilimi seçip kabul ölçütünü yazar → `pedagoji` bu yaşta gecikmeli sonucun nasıl
algılandığına dair zemini kaynaklarıyla koyar, bulamadığını boşluk işaretler → `oyuntasarim`
kararın ve sonucun mekaniğini kurar, **eklemediği** mekaniği de yazar → `guvenlik` o sahnede
neyin gösterilmeyeceğini raya bağlar → `icerik` metni yazar ve yaş etiketini vurur → `tasarim`
ekranı ve dokunma akışını tarif eder → `gelistirici` çalışır hâle getirir, ne koşup ne gördüğünü
yazar → `denetci` ölçütü önce kendi türetir, sonra çıktıya bakar, karneyi keser → `koordinator`
sırayı taşır, tıkananı panoya yazar, sahibe gidecek tek kalemi süzer → `disgoz` bütün izi okuyup
sahibe "normal mi" der → sahip mühürler.
