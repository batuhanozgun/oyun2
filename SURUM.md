# KEEL — sürüm künyesi

Elindeki KEEL'in **hangi sürüm** olduğunu bu dosya söyler. Kurulum git bağını kopardığı için
sürüm bilgisi git geçmişinde yaşayamaz; bu yüzden dağıtımla **dosya olarak** gelir ve
kurulumdan sonra projende kalır. Dosyayı elle değiştirme — kurulu projede korumalıdır.

```
KEEL-SURUM|v0.2|2026-08-12|1c2108ba7b035fb05b06ed3b292a3dceabb61eae
KEEL-DENEME|2026-08-12|1c2108ba7b035fb05b06ed3b292a3dceabb61eae|1202|1201|1
```

- **KEEL-SURUM** — sürüm etiketi · yayın tarihi · bu sürümün ağaç kimliği. Ağaç kimliği
  yayınlanan dosyaların kendisinden hesaplanır; tek bilerek fark bu dosyanın kendisidir.
- **KEEL-DENEME** — deneme kurulumu: tarih · sınanan ağaç · test sayısı · geçen · atlanan.

## Deneme kurulumu ne söyler, ne söylemez

**Söyler:** bu paket taze bir klasöre açıldığında kendi ortam ölçümünü ve üç test kümesini
yeşil koşturur — yani yayınlanan dosya kümesi kendi kendine yeter.

**Söylemez:** kurulumun kendisini. GENESIS bir betik değil, mühürleri insanın verdiği bir
konuşmadır; onu bir tören koşturamaz. Gerçek bir projede uçtan uca kurulum ayrı bir kanıttır.
