# DURUM — Koordinatör

**Son oturum:** 2026-08-13 · rol oturumu + üç dönem (kurulum YEŞİL · yapim duran-kapı)

## Varılan yer
Yedi görüş yazıldı (dosyalar diskte, ölçüldü) ve tablo satırları `kapalı`ya çevrildi.
Kalan iş: G-01 · G-09. Kurulum denetimi YEŞİL, bekçi `durduran=0`.

## Açık kalem
1. **G-01 + G-09** — dört çıktı henüz YOK. Bir sonraki `yapim` dönemi ikisini de koşturabilir
   (Ç-05 sonrası ikisi de sevk edilebilir).
2. **K-14 KURULDU ama CANLI ÖLÇÜLMEDİ.** Biçim kapısı artık satırı kendi kapatıyor (sahip
   onaylı). Kanıt bu dönemde aranacak: G-01 dönünce satırı `kapalı` olmalı. **Olmuyorsa
   commit `259a314` geri alınır ve iddia düşer** — kapıyı elle koşturmak file-guard'da engel,
   etrafından dolaşılmadı.
3. **Ç-02 devri** — ROL.md ek-okuma satırları; öneri tablosu G-01'den, uygulama her rolden.
4. **Retroya:** sınav 47 kırmızıyla geliyor (K-14'ten ÖNCE de öyleydi; KEEL'in kendi kurulum
   testleri dağıtılan kopyada fixture kuramıyor) · `03_roller/icerik/DURUM.md` tavan aşımı (F1).
5. **`BILINMEYENLER`e girecek dış bulgular:** pedagoji ve güvenlik koltuklarının dış kaynak
   hattı YOK (kaynaklı zemin üretemiyorlar) · `02_kanon/zemin/` ve `04_urun/` klasörleri yok
   ama sözleşmeler onlara işaret ediyor · bu makinede Xcode yok, iOS derlenemiyor (G-08 ölçtü).

## Kendi hatam — kayda geçsin
Dairesel önkoşulu ben yazdım (`G-01: onkosul=G-02…G-08` + `G-09: onkosul=G-01`) ve iki toplamayı
da kendi ürünlerinin arkasına kilitledim. Sahibe önce "meşru aktör yok, yapısal kusur" dedim;
**yanlıştı** — koordinatör koltuğu dönemde sevk edilebilir ve yazma araçlı. Düzeltildi, sahibe
düzeltildiği söylendi. Ç-01…Ç-05 gövdeleri KUTU planlama notunda, nesri commit'lerde (D4b).
