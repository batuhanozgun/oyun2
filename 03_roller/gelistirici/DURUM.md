# DURUM — Geliştirici

**Son oturum:** G-08 (KT-001, otonom dönem) · 2026-08-13. Bu koltuğun ilk oturumu.

## Varılan yer
`01_kutular/KT-001-proje-plani/gorus-gelistirici.md` yazıldı (2029 B, üç başlık). Görüştür,
karar değil: bu kutuda teknik temel mühürlenmez (KUTU üst sınırı).

## Sonraki oturumun bilmesi gerekenler
- **Ürün kodu YOK. `04_urun/` klasörü yok** — `tools/bekci/bekci.conf` `urun_yollari=04_urun`
  dolu ama karşılığı diskte yok. Hiçbir şey inşa edilmedi; "başlanmış" sanma.
- **iOS derlemesi bugün mümkün değil (ölçüldü).** `xcode-select -p` →
  `/Library/Developer/CommandLineTools`; `xcodebuild -version` → `requires Xcode`. Xcode.app,
  iOS SDK, simülatör yok. Makine Intel Core i5 · macOS 26.5.2. K-07 (önce iPhone+iPad) bu engel
  kalkmadan koda dönüşemez — ilk ürün kutusunun önkoşuludur.
- **K-01 (teknik temel) hâlâ REZERVE.** Dil/çatı, dosya ağacı ve çıplak test/derleme komutu
  seçilmedi. Bu karar bu koltuktadır (sahibe menü sunulmaz), ama ilk gerçek ürün işinde basılır;
  komut ilan edilmeden D4d kanıt disiplini işletilemez.
- İki BOŞLUK açık: ① bu Intel makineye kurulan Xcode iOS hedefini destekliyor mu (araştırma)
  ② ücretli Apple geliştirici hesabı alınacak mı (sahip).

## Açık kalem
Yukarıdaki ② `yayin` koltuğunun ③ numaralı uyanma tetiğine (KADRO) değiyor. Uyandırma kararı
bu koltukta değil; işaretlendi, devralınmadı.

## Bu oturumda commit atılmadı
Kutunun `İZİN:` satırı yalnız `kutu-ciktilari` veriyor; `git-obje` yok. Kanıt dosya yoludur.
