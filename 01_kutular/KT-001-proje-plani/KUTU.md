<!-- yazar: koordinator -->
# KT-001 — Proje planı (AÇIK)

**Durum:** AÇIK — ama **açılış mührü bekliyor.** Kutu ancak sahip mührü verince çalışmaya başlar;
mührü GENESIS vermez, sahip verir. Tek faz · tek demo.

**Açılış mührü:** Ahmet · 2026-08-13

<!-- Yukarıdaki satır MAKİNE-OKURDUR ve dönemin ön koşuludur (K3, 2026-08-07): mühürsüz kutuya
     `donem-ac.sh` dönem AÇMAZ. Mühür gelince satır "ad · YYYY-AA-GG" olur (G5 adımı damgalar,
     ör. "Ahmet · 2026-08-13"); gelmezse `bekliyor` kalır ve kalem sahibin kuyruğuna düşer.
     Doğuş: bu satır 2026-08-07'ye kadar HİÇBİR kalıpta yoktu — G5 var olmayan bir satıra damga
     bastırıyordu ve mührü okuyan tek bir betik bile yoktu, yani "mühürsüz eşik = süreç ihlali"
     hükmü (EL_KITABI) tamamen düzyazıda yaşıyordu. Satırı SİLMEK dönemi açmaz, KIRMIZI yapar.
     Yer tutucu köşeli tırnak BİLEREK yok: kurulum denetimi doldurulmamış alanı o işaretle arar
     ve bu yorum onu tetiklerdi (ölçüldü — kapı haklıydı, yorum düzeltildi). -->

## Bu kutunun işi

Bu kutunun işi, bu projenin nasıl yürütüleceğini çıkarmaktır. Kod yazmakla başlanmaz. Sonunda ne
var olacağını, süreçte hangi bilgiye ihtiyaç duyulacağını ve hafızasız oturumlar için neyin
nereye kaydedileceğini çıkarın.

## Görevler
| Görev | İş | Sahip | Durum | Kanıt |
|---|---|---|---|---|
| G-01 | Toplama-1 (kutu içi): sekiz görüşten `BILINMEYENLER.md` + `KAYIT_DUZENI.md` | koordinator | açık | demo: iki dosya sahibe açılıp okunur |
| G-02 | Ürün görüşü — üç soru (biçim aşağıda) | urun | kapalı | 01_kutular/KT-001-proje-plani/gorus-urun.md · 2032B · 3 başlık |
| G-03 | Pedagoji görüşü — üç soru | pedagoji | kapalı | 01_kutular/KT-001-proje-plani/gorus-pedagoji.md · 2002B · 3 başlık |
| G-04 | Oyun tasarımı görüşü — üç soru | oyuntasarim | kapalı | 01_kutular/KT-001-proje-plani/gorus-oyuntasarim.md · 2010B · 3 başlık |
| G-05 | Çocuk güvenliği görüşü — üç soru | guvenlik | kapalı | 01_kutular/KT-001-proje-plani/gorus-guvenlik.md · 2036B · 3 başlık |
| G-06 | İçerik görüşü — üç soru | icerik | kapalı | 01_kutular/KT-001-proje-plani/gorus-icerik.md · 1987B · 3 başlık |
| G-07 | Tasarım görüşü — üç soru | tasarim | kapalı | 01_kutular/KT-001-proje-plani/gorus-tasarim.md · 2020B · 3 başlık |
| G-08 | Geliştirici görüşü — üç soru | gelistirici | kapalı | 01_kutular/KT-001-proje-plani/gorus-gelistirici.md · 2029B · 3 başlık |
| G-09 | Toplama-2 (kanon): `BITTI_TANIMI.md` + `KUTU_PLANI.md` iskelet olmaktan çıkar | koordinator | açık | demo: iki dosya sahibe açılıp okunur; ikisinde de `(iskelet — ilk kutu doldurur` satırı KALMAZ |

**Görev listesini G-01 doğurdu** (2026-08-13): iş zincirindeki her yazabilir role bir görüş
görevi + iki toplama. Bir görev = bir rol = bir alt-ajan çağrısı. Dış göz ve yazamaz koltuklar
iş zincirinin dışındadır.

**Görev tavanı:** rol başına en çok bir görev + toplama (sevk sayıyı `03_roller/` altındaki
yazamaz-olmayan rollerden okur). EL_KITABI kutu-döngüsü 1'deki ≤5 tavanı *ürün dilimi* kutuları
içindir; bu planlama kutusudur ve tavanı kadro büyüklüğünün türevidir — tanımlı istisna.

kırpıldı: bu iki paragrafın uzun hâli (kim yazamaz, hangi kanca keser, üç sorunun metni) —
liste doğduğu için tarihçe oldu; soruların metni "Görüş görevi" bölümünde canlı duruyor.

## Görüş görevi (G-02…G-08) — ne yazılır

Dosya: `01_kutular/KT-001-proje-plani/gorus-<slug>.md`. Üç başlık, BİREBİR bu sırayla:
`## Projenin sonunda ne olacak` · `## Süreçte neye ihtiyacım var` · `## Hafızasız oturum için ne kaydedilmeli`.
Her başlık **kendi koltuğundan** cevaplanır (KADRO'daki eksen ayrımı: komşunun işini yazma).

- **Kardeş `gorus-*.md` dosyalarını OKUMA.** Yedi görüş birbirinden bağımsız üretilir; bağımsızlığımız
  taze bağlamdır (OTONOM_DONEM §8 — hepsi aynı modelin kopyası). Ayrışma kusur değil, `BILINMEYENLER`in
  ham maddesidir; toplama görevi ayrışmayı görmek zorunda.
- **Bilmediğini uydurma:** `BOŞLUK: <ne bilinmiyor> · kaynak: sahip | araştırma | ancak ilk gerçek işte`
  satırı yaz (DEFO_MODELI #6). Boşluk işaretlemek bu görevde başarıdır, eksik değil.
- **Domain koltukları (pedagoji · güvenlik):** kaynaksız iddia GEÇERSİZ; her görüş çözünürlük-sınıfı
  taşır (`bağlayıcı`/`tartılır`/`açık-kalır`) — EL_KITABI domain-rol iskeleti.
- Tavan **2KB**. Kapsam seçme, sıraya karışma, ürün kodu yazma yok — bu bir görüştür, karar değil.

## Planlama notu — G-01'in birinci yarısı (koordinator · 2026-08-13, el-sürüşlü oturum)

Liste doğdu: **7 görüş + 2 toplama.** G-01'in "liste doğur" yarısı bu oturumda elle bitti;
satırı toplamaya daraltıldı (Ç-04). Tavan 10 (kadro 9 + toplama), kullanılan 9.

Gerekçe nesri commit gövdelerinde yaşar (D4b), burada hüküm satırları:

- **Ç-01** görüş görevi soru-başına bölünmedi — F3 taneciği ile planlama kutusu tavanı çatıştı,
  daha özel kural kazandı. Kurulum denetçisi muafiyeti savunulabilir buldu. · `5b10464`
- **Ç-02** ROL.md ek-okuma satırını toplama güncelleyemez (F1); G-01 öneri tablosunu
  `KAYIT_DUZENI.md`'ye yazar, uygulaması her rolün işi. [AÇIK→DEVİR: G-01] · `5b10464`
- **Ç-03** `koordinator` görüşü elle yazıldı, G-NN açılmadı. · `5b10464`
- **Ç-04** toplama İKİYE bölündü (kurulum denetçisi kalem 4, KIRMIZI): tek çağrıda dört belge
  F3'ün "tek çıktı" ölçüsünü aşıyordu; `maxTurns` kesmesi işaretsiz olduğu için yarım kanon
  kurtarılamazdı. **Kapsam koruması:** bitti tanımının içeriği ürün sorumlusunundur — G-09 onu
  G-02'den DEVŞİRİR, üretmez; cevaplanmamışsa `BOŞLUK` yazar. · `76aae26`
- **Ç-05** G-09 önkoşulu `G-01` → **`yok`** (dairesel kilit onarımı). Ölçüldü: sevkin "dönüşü
  geldi ama satır açık" engeli onkoşul sorgusundan ÖNCE koşar; tablonun tek meşru yazarı
  koordinatör olduğu için iki toplama da kendi ürününün arkasına kilitlenmişti ve dönem boyunca
  hiç sevk edilmedi. **Bağımlılık kalkmadı, biçim değiştirdi: G-09'un İLK İŞİ dosya kontrolüdür**
  — `BILINMEYENLER.md` + `KAYIT_DUZENI.md` diskte yoksa yazmaz, zarfına DUR yazar, döner.
- **`yayin`** görev almadı (uyuyan; tetik yok) · **`denetci`·`disgoz`** yazamaz, iş zinciri dışı.

## Dört ortak çıktı (kutunun ürünü)
| Çıktı | Nereye yazılır |
|---|---|
| Projenin bitti tanımı | `02_kanon/BITTI_TANIMI.md` (iskeleti G3'te doğdu) |
| Bilinmeyenler — her satırda cevabın kaynağı: **sahip / araştırma / ancak ilk gerçek işte** | `01_kutular/KT-001-proje-plani/BILINMEYENLER.md` |
| Kayıt düzeni — hangi bilgi hangi **mevcut** dosyaya (yeni arşiv İCAT EDİLMEZ) | `01_kutular/KT-001-proje-plani/KAYIT_DUZENI.md` |
| Sonraki kutular — ad, sıra, tek cümle gerekçe | `02_kanon/KUTU_PLANI.md` (iskeleti G3'te doğdu) |

Kayıt düzeni kesinleşince **rol sözleşmelerinin "Açılış ek-okumaları" satırı** güncellenir
(`03_roller/<slug>/ROL.md`) — GENESIS oraya "ilk kutuda güncellenecek" yazdı, bu o an. Ama
güncellemeyi toplama görevi YAPAMAZ: her ROL.md'nin yazarı kendi rolüdür (F1). Ç-02'ye bak —
G-01 öneri tablosunu `KAYIT_DUZENI.md`'ye yazar, uygulaması her rolün kendi işidir.

## Bu kutu bitince gözünle göreceklerin
1. `02_kanon/BITTI_TANIMI.md`'yi açtığında, bu projenin **ne zaman bittiğini** tek sayfada okursun.
2. `02_kanon/KUTU_PLANI.md`'yi açtığında, **sıradaki kutuların adını ve sırasını** görürsün.
3. Ekibin sana **bilmediklerini** listeler ve her satırda cevabın kimden geleceğini söyler — hangileri sana sorulacak, hangileri araştırılacak, hangileri ancak ilk gerçek işte belli olacak.

## Kabul kriterleri
- **Alt sınır (tek başına evet/hayır):** dört çıktının dördü de yazılı ve sahibe okundu.
- **Üst sınır (kapsam aşımı = hata):** ürün kodu yazmak · mimari seçim mühürletmek · sonraki
  kutuların içini doldurmak. Bu kutu **sırayı** çıkarır, işi yapmaz.

## Duruş sözleşmesi
BİTİŞ HÂLİ: dört ortak çıktı yazılı ve sahibe okunmuş
KANIT:      demo: dört dosya sahibe açılıp okunur · `02_kanon/BITTI_TANIMI.md` ile `02_kanon/KUTU_PLANI.md` iskelet olmaktan çıkmıştır
KISIT:      ürün kodu yazılmaz · `02_kanon/kilitli/` ve `02_kanon/golden/` içeriğine dokunulmaz · yeni arşiv/klasör düzeni icat edilmez (kayıt düzeni MEVCUT dosyaları adresler)
BÜTÇE:      dönem başına en çok 12 ÜRETİM çağrısı · ilerleme-yok eşiği 2 tur · toplam dönem tavanı 6
LİSTE:      dönem içinde doğar — bu kutunun görev listesini G-01 üretir (planlama kutusu)
İZİN:       kutu-ciktilari

**İZİN satırı ne yapar:** otonom dönemde "sahibe sor" penceresi açılmaz — pencere açmak, gözetimsiz
çalışmanın bittiği andır. Bu kutunun ekibi yalnız `02_kanon/BITTI_TANIMI.md` ile
`02_kanon/KUTU_PLANI.md` dosyalarına yazabilsin diye tek sınıf önceden serbesttir
(`kutu-ciktilari`); listede olmayan bir izin gerekirse o adım ATLANIR ve sahibin kuyruğuna not
düşer. Sözlük: `git-obje` · `disa` · `mcp` · `yazim` · `korumali-yol` · `kutu-ciktilari` (hiçbiri
gerekmiyorsa `yok`). Ekibin commit atması isteniyorsa `git-obje` eklenir — bu kutuda gerekmez.

## Bağımlılık ve risk (yalnız sevk + kurulum denetçisi okur)
G-01: onkosul=G-02 G-03 G-04 G-05 G-06 G-07 G-08 · risk=düşük — kutu-içi toplama; sekiz görüş yazılmadan türetilemez, çıktısı kutu içinde kalır
G-09: onkosul=yok · risk=düşük — kanon toplaması; bağımlılık satır değil DOSYA kontrolüyle taşınır (Ç-05): G-01'in iki çıktısı diskte yoksa yazmaz, DUR döner
G-02: onkosul=yok · risk=düşük — görüş yazımı; ürün koduna dokunmaz, geri dönüşü dosya silmektir
G-03: onkosul=yok · risk=düşük — görüş yazımı; kaynaklı zemin, karar basmaz
G-04: onkosul=yok · risk=düşük — görüş yazımı; mekanik kurmaz, yalnız ihtiyacını yazar
G-05: onkosul=yok · risk=düşük — görüş yazımı; ray yazılmaz, ihtiyacı işaretlenir
G-06: onkosul=yok · risk=düşük — görüş yazımı; içerik üretilmez
G-07: onkosul=yok · risk=düşük — görüş yazımı; ekran tarif edilmez
G-08: onkosul=yok · risk=düşük — görüş yazımı; kod yazılmaz, teknik karar mühürlenmez
