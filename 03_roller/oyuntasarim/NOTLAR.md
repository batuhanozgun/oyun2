<!-- yazar: oyuntasarim -->
# NOTLAR — kalıcı gözlemler (F6 terfi hattı; tavan 2KB)

## N-01 · Var olmayan dosyaya işaret eden ek-okuma satırı (2026-08-13, G-04)
`03_roller/oyuntasarim/ROL.md` "Açılış ek-okumaları" satırı **pedagoji koltuğunun zemin
dosyalarını** zorunlu tutuyor; `02_kanon/zemin/` dizini ise henüz YOK (ölçüldü). Taze hafızalı
bir oturum bu satırı okuyup dosyayı arar, bulamaz ve iki yoldan birine sapabilir: ya boşluğu
sessizce doldurur (DEFO_MODELI #6 — uydurma), ya da işi durdurur.
**Gözlem:** ek-okuma işaretçisi "henüz doğmamış" olabileceğini söylemiyor. Doğru davranış
üçüncü yol: boşluğu **açık borç** olarak işaretle ve devam et (ROL iş akışı 4 bunu zaten
söylüyor, ama ek-okuma satırında karşılığı yok).
**Çapraz-rol adayı:** aynı desen pedagoji ROL.md'sinde de var ("kendi `02_kanon/zemin/`
dosyaların"). İki koltukta görülürse retroda kural terfisine aday: *ek-okuma işaretçisi
doğmamış dosyayı gösterebilir; yokluğu ARIZA değil, işaretlenecek boşluktur.*
Retro sorusu: kayıt düzeni (G-01) bu satırları güncellerken bu ayrımı taşıyacak mı?
