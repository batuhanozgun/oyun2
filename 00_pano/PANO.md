<!-- yazar: bekci-betigi (MEKANİK BLOK) + koordinator (YARGI BLOĞU) -->
# PANO

## MEKANİK BLOK — yalnız bekçi yazar
```
Son denetim: 2026-08-13 03:57 (denetim #18)
Işıklar: AKIŞ=KIRMIZI · DOSYA=KIRMIZI
Görevler: G-01=açık · G-02=açık · G-03=açık · G-04=açık · G-05=açık · G-06=açık · G-07=açık · G-08=açık · G-09=açık
Sahipte bekleyen: 0
Sıra: sahip
Kırmızı: 1 · Sarı: 2
```

## YARGI BLOĞU — yazar: koordinator
- **Aktif kutu:** KT-001 — **AÇIK.** Açılış mührü verildi (Ahmet · 2026-08-13).
- **Görev listesi DOĞDU + bağımsız denetimden geçti** (2026-08-13): G-02…G-08 yedi görüş
  (urun · pedagoji · oyuntasarim · guvenlik · icerik · tasarim · gelistirici) + iki toplama
  (G-01 kutu içi · G-09 kanon). `yayin` uyuyor, `denetci`/`disgoz` yazamaz — görev almadılar.
- **Kurulum denetimi:** 7 kalemden 6'sı geçti; "lokma boyu" kaldı → toplama ikiye bölündü
  (Ç-04). Düzeltme uygulandı; **denetimin yeniden koşması gerekiyor** (kendi işime yeşil
  diyemem).
- **SIRADAKİ OTURUM:** BEKLEMEDE — dönem yeniden açılmadan önce bir onarım kararı var
  (aşağıdaki blokaj). Onarımdan sonra: `/donem KT-001-proje-plani kurulum`, yeşil gelirse
  `/donem KT-001-proje-plani yapim`.
- **Blokaj:** **dönem kendi günlüğüne takılıyor.** İlk dönem duran kapıda öldü; sebebi denetim
  değil, bekçinin `00_pano/zarf-gunlugu.jsonl` için bastığı DURDURAN — dosya `[SERT]` korunan
  yolda ve commit-dışı, ama dönemin her turu ona yazmak zorunda. Kimde: koordinator (inceleme
  koştu) · neye bağlı: onarımın `tools/` içine düşüp düşmediği · tetiklenince: `tools/` ise
  sahip kararı + töreni, değilse rol çözer ve dönem yeniden açılır.
