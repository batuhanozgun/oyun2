<!-- yazar: koordinator · G-01 · 2026-08-13 -->
# KAYIT DÜZENİ — hangi bilgi hangi dosyaya

Bu ekip hafızasız çalışır: her oturum sıfırdan açılır ve yalnız dosyada yazanı bilir. Bu dosya
"hangi bilgi nereye yazılır" sorusunun tek cevabıdır. **Yeni arşiv icat edilmez** — her satır
bugün var olan bir dosyayı adresler; doğmamış evler §3'te ayrıca ilan edilir.

**Üç kural.** ① Her dosyanın tek yazarı vardır (`<!-- yazar: … -->` kimliktir); başkası
değiştirmez, yazarına devreder. ② Durum dosyaları yerinde yeniden yazılır, alt alta eklenmez;
tarihçe git'te yaşar. ③ Aynı olguyu iki yerde canlı tutmak yasaktır: ikinci yer işaretçi taşır,
kopya değil.

## 1 · Sıra, durum ve trafik

| Bilgi | Evi | Yazarı |
|---|---|---|
| Açık kutu · görevler · sahipleri · durum · kanıt | `01_kutular/<kutu>/KUTU.md` görev tablosu | koordinator (durum ve kanıt hücresini biçim kapısı basar) |
| Günün sırası · blokaj · sıradaki oturum | `00_pano/PANO.md` YARGI bloğu | koordinator |
| Işıklar, sayılar, mekanik ölçüm | `00_pano/PANO.md` MEKANİK blok | bekçi betiği |
| Sahibe **gitmiş** soru ve cevabı | `00_pano/SENDE_BEKLEYEN.md` | kapanış kancası + cevabı alan rol; **madde silinmez** |
| Sahibe **gitmeyen** soru + gerekçesi | açık kutunun `BILINMEYENLER.md` süzgeç sütunu | koordinator |
| Rol kararı (Ç-NN) + gerekçesi | `01_kutular/<kutu>/KUTU.md` planlama notu; kutu kapanınca `01_kutular/_arsiv/` ile taşınır | kararı veren rol |
| Mühürlenen karar | `02_kanon/KARAR_INDEKSI.md` (liste) + `02_kanon/kilitli/` (gövde) | koordinator; kilitli gövde düzenlenmez |
| Karar/kanıt anlatısı, gerekçe nesri | commit gövdesi | commit'i atan rol |
| Dönem izleri (zarflar) · oturum metası | `00_pano/zarf-gunlugu.jsonl` · `00_pano/oturum-gunlugu.jsonl` | yalnız betikler; elle yazılmaz |
| Sahibe normallik raporu | `03_roller/disgoz/BRIFING.md` | dosyayı kapı yazar, koltuk yazamaz |

**Blokaj biçimi üç ayaklıdır** ve panoda birebir şöyle yazılır:
`Blokaj: <iş> · kimde: <rol> · bağlı: <ne bekleniyor> · tetikte: <gelince ne olacak>`.
"Bekliyor" tek başına kayıt değildir.

## 2 · İşin kendisi

| Bilgi | Evi | Yazarı |
|---|---|---|
| Projenin bitti tanımı | `02_kanon/BITTI_TANIMI.md` | koordinator yazar, içeriği ürün sorumlusundan devşirilir |
| Sıradaki kutular | `02_kanon/KUTU_PLANI.md` | koordinator |
| Kutunun kabul ölçütleri · "göreceklerin" bloğu · geçti/kaldı cümlesi | `01_kutular/<kutu>/KUTU.md` | urun — **işi yapan rol ölçüt satırına dokunamaz** |
| Pedagoji zemini: iddia · kaynak · sınıf · tarih | `02_kanon/zemin/` (**doğmadı** — §3) | pedagoji |
| Hassas konu rayı · yayın öncesi kontrol listesi | `02_kanon/uyum/` (**doğmadı** — §3) | guvenlik |
| Çekirdek döngü tek sayfa · mekanik tarifi | açık kutunun klasörü `01_kutular/<kutu>/` | oyuntasarim |
| Ekran tarifleri · ergonomi sayıları · görsel dil sözlüğü | açık kutunun klasörü; mühürlenen tercih `02_kanon/KARAR_INDEKSI.md` | tasarim |
| Ton kılavuzu · kalıp listesi · hacim kaydı | açık kutunun klasörü; ton kılavuzu mühürlenirse karar indeksine iner | icerik |
| Metin havuzunun kendisi (ürün verisi) | `04_urun/` (**doğmadı** — K-01 ile doğar) | icerik + gelistirici |
| Uygulama kaynağı | `04_urun/` (**doğmadı**) | gelistirici |
| Çıplak kurma/test komutu + ürün ağacının yolu | `02_kanon/KARAR_INDEKSI.md` K-01 gövdesi + `tools/bekci/bekci.conf` `urun_yollari` | gelistirici |
| Son koşan komut ve çıktının belirleyici satırı | görev satırının Kanıt sütunu (`KUTU.md`) | görevi koşan rol / biçim kapısı |
| Çocuk gözlemi — kişisiz | gözlemi ürüne çeviren rolün `03_roller/<slug>/NOTLAR.md`'si; değişen ölçüt `KUTU.md`'ye | urun |
| "Nerede kaldım · ne inşa EDİLMEDİ" | `03_roller/<slug>/DURUM.md` | rolün kendisi |
| Kalıcı gözlem, kural adayı | `03_roller/<slug>/NOTLAR.md` | rolün kendisi (retroda kurala terfi hattı) |
| **Reddedilen / elenen şey + gerekçesi** | ürettiği yerde: elenen mekanik ve reddedilen metin kutu klasöründe, reddedilen tasarım seçeneği kutu klasöründe, kalıcı ders `NOTLAR.md`'de | reddeden rol |
| Ertelenen dilim (uyanma koşuluyla) | **ERTELENENLER — adı el kitabında var, yolu yazılı değil, dosya yok (§3)** | — |

## 3 · Doğmamış evler — beyanlı boşluk

Dört yol bugün yazılı ama diskte yok. **Bu toplama onları AÇMAZ:** klasörü, oraya ilk yazan rol
kendi işiyle açar (tek-yazar kuralı). Doğana kadar geçici ev aşağıdadır.

| Yol | Kim açar | Doğana kadar geçici ev |
|---|---|---|
| `02_kanon/zemin/` | pedagoji | `03_roller/pedagoji/NOTLAR.md` + kutu içi görüş dosyası |
| `02_kanon/uyum/` | guvenlik | `03_roller/guvenlik/NOTLAR.md` + kutu içi görüş dosyası |
| `04_urun/` | gelistirici (K-01 ile) | yok — kod yazılmadan doğmaz |
| ERTELENENLER | **yol kararı yok** | açık kutunun `KUTU.md` planlama notunda Ç-NN satırı |

ERTELENENLER'in yolunu bu görev seçemez: dosyanın adı ve tavanı el kitabında yazılı, yolu değil;
el kitabı yalnız kutu-kapanış retrosunda ve sahip onayıyla değişir. **İlk retronun maddesi.**

## 4 · Yazılmayacaklar

- **Sahibin çocuğuna dair hiçbir kişisel bilgi** — ad, yaş, okul, alışkanlık, karakter dâhil.
  Gözlem ürüne yazılır, kişiye değil. Bu kural mekanik süzgeçten daha katıdır.
- **Tartışmanın seyri** — yalnız sonucu ve gerekçesi kayda geçer.
- **Gerekçe nesri dosyaya değil commit gövdesine.** Görev dosyası tek işaretçi taşır.
- **Kaynaksız pedagojik ya da uyum iddiası** — kaynaksız satır kural değil, boşluktur.
- **"Bakılmadı" ile "sorun yok" karıştırılmaz:** taranan yüzey ve tarih yazılır; taranmayan
  taranmadı olarak kalır.

## 5 · Rol sözleşmelerinin "Açılış ek-okumaları" satırı — öneri tablosu (Ç-02)

Kurulum her `ROL.md`'ye "ilk kutuda güncellenecek" yazdı; o an geldi. **Bu tabloyu uygulamak bu
görevin işi değildir:** her `ROL.md`'nin yazarı kendi rolüdür, satırını kendi oturumunda kendi
değiştirir. Aşağısı öneridir, emir değil.

**Genel kusur:** bugünkü satırlar bazı yerlerde bir şeyi **adıyla** anıyor ("oyun tasarımcısının
mekanik tarifi", "pedagoji zemin dosyaları") ama **yolunu** vermiyor; taze oturum onu aramak
zorunda kalıyor. Kayıt düzeni yolları verdiğine göre her rol kendi satırındaki adı yola çevirsin.
Doğmamış klasöre işaret eden satır **silinmez** — yanına §3'teki geçici ev yazılır.

| Rol | Önerilen değişiklik |
|---|---|
| hepsi | `02_kanon/KARAR_INDEKSI.md` eklensin — sahibe soru sormak yerine karara dayanmanın tek kaynağı orası; ayrıca açık kutunun `BILINMEYENLER.md`'si (varsa) |
| urun | + açık kutunun `BILINMEYENLER.md`'si (kapsam boşlukları) · `02_kanon/BITTI_TANIMI.md` |
| koordinator | + `02_kanon/KUTU_PLANI.md` · açık kutunun `KAYIT_DUZENI.md`'si |
| pedagoji | satır kalsın; yanına "klasör doğmadıysa `03_roller/pedagoji/NOTLAR.md`" |
| guvenlik | satır kalsın; yanına "klasör doğmadıysa `03_roller/guvenlik/NOTLAR.md`" |
| oyuntasarim | "pedagoji zemin dosyaları" → `02_kanon/zemin/` (yoksa geçici ev) |
| icerik | "mekanik tarifi" ve "hassas konu rayı" → açık kutunun klasörü `01_kutular/<kutu>/` ve `02_kanon/uyum/` |
| tasarim | "mekanik tarifi" ve "yaş-gelişim notları" → aynı iki yol |
| gelistirici | + `02_kanon/KARAR_INDEKSI.md` K-01 (ürün ağacı ve çıplak komut); ekran/mekanik tarifi → kutu klasörü |
| denetci | `02_kanon/uyum/` satırının yanına "klasör yoksa nereye bakılacağı" notu |
| disgoz | değişiklik önerilmiyor — okuma listesi zaten geniş |
| yayin | uyuyan koltuk; uyandığında `02_kanon/uyum/` satırı aynı notu alsın |
