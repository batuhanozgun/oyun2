<!-- yazar: bekci-betigi (MEKANİK BLOK) + koordinator (YARGI BLOĞU) -->
# PANO

## MEKANİK BLOK — yalnız bekçi yazar
```
Son denetim: 2026-08-13 12:50 (denetim #39)
Işıklar: AKIŞ=YEŞİL · DOSYA=SARI
Görevler: G-01=kapalı · G-02=kapalı · G-03=kapalı · G-04=kapalı · G-05=kapalı · G-06=kapalı · G-07=kapalı · G-08=kapalı · G-09=açık
Sahipte bekleyen: 0
Sıra: sahip
Kırmızı: 0 · Sarı: 2
```

## YARGI BLOĞU — yazar: koordinator
- **Aktif kutu:** KT-001 — **AÇIK.** Açılış mührü: Ahmet · 2026-08-13. Kurulum denetimi YEŞİL.
- **Yedi görüş yazıldı, defteri kapatıldı.** Kalan iki görev: G-01 (kutu içi toplama) ·
  G-09 (kanon toplama). Dört çıktı bu ikisinden doğacak.
- **Defter artık yapının işi (K-14, sahip onaylı):** biçim kapısı, bir görev dönüşü geçtiğinde
  o satırın Durum ve Kanıt hücresini kendisi yazar. Dairesel kilit de onarıldı (Ç-05).
  Bekçinin kendi sınavı: taban 393/47 → değişiklikle 393/47, kalan testlerin listesi birebir
  aynı. **Yeni yol canlı ölçülmedi** — kanıt bu dönemde aranacak.
- **SIRADAKİ OTURUM:** `/donem KT-001-proje-plani yapim` — şimdi. G-01 ve G-09 koşar.
- **Bu dönemde İZLENECEK TEK ŞEY:** G-01 döndükten sonra tablodaki G-01 satırı kendiliğinden
  `kapalı` olmalı. Olmuyorsa K-14 çalışmıyor demektir; o commit geri alınır ve iddia düşer.
- **Blokaj:** yok.
- **Sarı:** `03_roller/icerik/DURUM.md` tavanı aşıyor (2498B > 2048). Yazarı içerik koltuğu —
  F1 gereği bana kapalı; bir sonraki içerik oturumu kırpar.
