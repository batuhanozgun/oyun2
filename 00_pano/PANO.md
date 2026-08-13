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
- **Görev listesi doğdu + bağımsız denetimden geçti:** G-02…G-08 yedi görüş + iki toplama
  (G-01 kutu içi · G-09 kanon). `yayin` uyuyor, `denetci`/`disgoz` yazamaz.
- **Kurulum denetimi:** 7 kalemden 6'sı geçti; "lokma boyu" kaldı → toplama ikiye bölündü (Ç-04).
  Düzeltme uygulandı, **yeşili alınmadı** — kendi işime yeşil diyemem, denetim yeniden koşmalı.
- **SIRADAKİ OTURUM:** BEKLEMEDE — sahibin onarım kararı bekleniyor (blokaj). Onaydan sonra:
  onarım + bekçi testi → `/donem KT-001-proje-plani kurulum` → yeşilse `… yapim`.
- **Blokaj — YAPISAL, her dönemde tekrarlar:** bekçi `00_pano/zarf-gunlugu.jsonl` için DURDURAN
  basıyor; dosya `[SERT]`, dönem HER tur ona yazıyor, dönem içinde commit yasak. Commit'lemek
  çözmez. Üç mercek + üç çürütücü kıramadı; kendi ölçümüm de `durduran=1`, sebep birebir bu satır.
  **Kimde:** sahip · **neye bağlı:** onarım `tools/bekci/` içinde = [SERT], karar + tören ister ·
  **tetiklenince:** onarım + bekçi test takımı koşar, sonucu sahibe gösterilir (K-12 emsali).
- **İki SARI:** `00_pano/SABAH.md` · `kurulum-kapisi.txt` — sistemin kendi ürettikleri, bekçinin
  izinli listesinde yok. İş durdurmaz; aynı onarımda kapanır.
