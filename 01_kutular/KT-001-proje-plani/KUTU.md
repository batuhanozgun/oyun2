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
| G-01 | Proje planını çıkar: her role birer görev doğur, sonra hepsini tek planda topla | koordinator | açık | demo: dört ortak çıktı dosyası açılıp sahibe okunur |
| G-02 | Ürün görüşü — üç soru (biçim aşağıda) | urun | açık | demo: `gorus-urun.md` üç başlıkla dolu |
| G-03 | Pedagoji görüşü — üç soru | pedagoji | açık | demo: `gorus-pedagoji.md` üç başlıkla dolu |
| G-04 | Oyun tasarımı görüşü — üç soru | oyuntasarim | açık | demo: `gorus-oyuntasarim.md` üç başlıkla dolu |
| G-05 | Çocuk güvenliği görüşü — üç soru | guvenlik | açık | demo: `gorus-guvenlik.md` üç başlıkla dolu |
| G-06 | İçerik görüşü — üç soru | icerik | açık | demo: `gorus-icerik.md` üç başlıkla dolu |
| G-07 | Tasarım görüşü — üç soru | tasarim | açık | demo: `gorus-tasarim.md` üç başlıkla dolu |
| G-08 | Geliştirici görüşü — üç soru | gelistirici | açık | demo: `gorus-gelistirici.md` üç başlıkla dolu |

**Görev listesini G-01 doğurur.** Koordinatör ilk iş olarak **iş zincirindeki her role bir görev**
açar (G-02, G-03, …; bir görev = bir rol = bir alt-ajan çağrısı — `tools/sevk/devir-kapisi.sh` iç
içe alt-ajanı durdurur). **Dış göz ve yazamaz koltuklar HARİÇ:** onlar iş zincirinin dışındadır ve
dosya yazamazlar (rol kafesi kancada kesin engeldir — görev verilirse alt-ajan çağrısı exit 2 ile
düşer). Her rol **kendi dosyasına** yazar: `01_kutular/KT-001-proje-plani/gorus-<slug>.md`
— üç soru: projenin sonunda ne olacak · süreçte neye ihtiyacım var · hafızasız oturum için ne
kaydedilmeli. **Son görev yine koordinatörün:** hepsini aşağıdaki dört çıktıda toplar.

**Bu kutunun görev tavanı:** iş zincirindeki rol başına en çok bir görev + bir toplama görevi
(sevk bu sayıyı `03_roller/` altındaki yazamaz-olmayan rollerden okur ve aşılırsa haber verir). EL_KITABI
kutu-döngüsü 1'deki **≤5 görev** tavanı *ürün dilimi* kutuları içindir (tek faz · tek
gözle-görülür demo · tek domain rolü); bu kutu ürün dilimi değil, planlama kutusudur ve
görev sayısı kadro büyüklüğünün türevidir. Sapma değil, tanımlı istisnadır.

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

Liste bu satırla doğdu: **7 görüş + 1 toplama.** Toplama ayrı ID almadı; G-01'in kendi ikinci
yarısıdır (önkoşulu G-02…G-08). Tavan 10 (kadro 9 + toplama), kullanılan 8.

- **`koordinator` görüşü G-NN olarak açılmadı:** bu oturumda elle yazıldı (`gorus-koordinator.md`).
  Gerekçe: aynı koltuk, daha küçük yol — bir dönem çağrısı harcamadan bu oturumun bağlamı
  hafızasız toplama görevine taşınır. [KARAR: Ç-03]
- **`yayin` görev ALMADI** — uyuyan koltuk; KADRO'daki üç uyanma tetiğinin (çalışan sürüm · para
  modeli çatalı · mağaza işi) hiçbiri doğmadı. Uyandırmak kadro değişikliğidir, mühür ister.
  [BİLİNÇLİ-DIŞARIDA: uyanma tetiği yok]
- **`denetci` · `disgoz` görev ALMAZ** — yazamaz koltuk, iş zincirinin dışında (kutu şartı).
- **Ç-01 · Görüş görevi soru-başına bölünmedi.** F3 "3+ sorulu görüş işi soru-başına bölünür"
  der; bölseydik 7×3=21 görev çıkardı ve EL_KITABI'nın planlama kutusuna verdiği tavanı
  (rol sayısı + 1) iki kat aşardı — aynı belgede iki kural çatışıyor. Daha özel olan kazandı:
  tavan. F3'ün amacı (tek oturuş · tek çıktı · net devir) burada zaten karşılanıyor. Retro adayı.
- **Ç-02 · ROL.md ek-okuma satırlarını toplama görevi GÜNCELLEYEMEZ.** Bu kutu öyle yazıyor ama
  her `03_roller/<slug>/ROL.md`'nin yazarı kendi rolüdür (F1 tek-yazar). Yol: toplama görevi
  önerilen satırları `KAYIT_DUZENI.md`'ye **tablo** olarak yazar; her rol kendi satırını bir
  sonraki rol oturumunun açılışında kendi dosyasına uygular. [AÇIK→DEVİR: G-01 toplama yarısı]

## Dört ortak çıktı (kutunun ürünü)
| Çıktı | Nereye yazılır |
|---|---|
| Projenin bitti tanımı | `02_kanon/BITTI_TANIMI.md` (iskeleti G3'te doğdu) |
| Bilinmeyenler — her satırda cevabın kaynağı: **sahip / araştırma / ancak ilk gerçek işte** | `01_kutular/KT-001-proje-plani/BILINMEYENLER.md` |
| Kayıt düzeni — hangi bilgi hangi **mevcut** dosyaya (yeni arşiv İCAT EDİLMEZ) | `01_kutular/KT-001-proje-plani/KAYIT_DUZENI.md` |
| Sonraki kutular — ad, sıra, tek cümle gerekçe | `02_kanon/KUTU_PLANI.md` (iskeleti G3'te doğdu) |

Kayıt düzeni kesinleşince toplama görevi **rol sözleşmelerinin "Açılış ek-okumaları" satırını**
günceller (`03_roller/<slug>/ROL.md`) — GENESIS oraya "ilk kutuda güncellenecek" yazdı, bu o an.

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
G-01: onkosul=G-02 G-03 G-04 G-05 G-06 G-07 G-08 · risk=düşük — toplama yarısı; yedi görüş yazılmadan dört çıktı türetilemez
G-02: onkosul=yok · risk=düşük — görüş yazımı; ürün koduna dokunmaz, geri dönüşü dosya silmektir
G-03: onkosul=yok · risk=düşük — görüş yazımı; kaynaklı zemin, karar basmaz
G-04: onkosul=yok · risk=düşük — görüş yazımı; mekanik kurmaz, yalnız ihtiyacını yazar
G-05: onkosul=yok · risk=düşük — görüş yazımı; ray yazılmaz, ihtiyacı işaretlenir
G-06: onkosul=yok · risk=düşük — görüş yazımı; içerik üretilmez
G-07: onkosul=yok · risk=düşük — görüş yazımı; ekran tarif edilmez
G-08: onkosul=yok · risk=düşük — görüş yazımı; kod yazılmaz, teknik karar mühürlenmez
