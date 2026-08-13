<!-- yazar: gelistirici -->
# Geliştirici görüşü — KT-001

## Projenin sonunda ne olacak
iPhone ve iPad'e kurulan, internetsiz çalışan bir uygulama (K-07 · K-02). Yanında iki şey daha:
metni koddan ayrı tutan içerik dosyası düzeni (K-06) ve **çıplak bir kurma/test komutu** — kanıt
disiplini (D4d) ona bağlıdır; komut yoksa "çalışıyor" beyanı doğrulanamaz.
Veri kısıtı özellik değil mimari çizgidir: hesap yok, ağ çağrısı yok, analitik yok; eklenen her
ağ bağımlılığı gerekçelenir.

## Süreçte neye ihtiyacım var
1. **Kabul ölçütü + ekran tarifi + mekanik tarifi, koddan önce.** Ölçütsüz görevde "bitti"yi
   uyduramam.
2. **Kurma ortamı — ölçüldü, eksik.** Bu makinede yalnız Command Line Tools var
   (`xcode-select -p` → `/Library/Developer/CommandLineTools`); `xcodebuild -version` çıktısı
   `requires Xcode`. Xcode.app, iOS SDK ve simülatör yok; bugün iPhone/iPad'e tek satır kod
   derlenemez. Makine: Intel Core i5 · macOS 26.5.2.
3. BOŞLUK: Intel makineye kurulan Xcode iOS hedefini destekliyor mu (hayırsa K-07 açılır) ·
   kaynak: araştırma
4. BOŞLUK: gerçek cihaz ve mağaza için ücretli Apple geliştirici hesabı alınacak mı ·
   kaynak: sahip — `yayin` uyanma tetiği ③'e değiyor, uyandırma kararı bende değil
5. İçeriğin **veri** olarak gelmesi; ekrana gömülen metin sonradan çevrilemez.

## Hafızasız oturum için ne kaydedilmeli
Yeni arşiv gerekmiyor; dördü mevcut dosyalara:
- **Çıplak kurma/test komutu + ürün ağacının yolu** → `02_kanon/KARAR_INDEKSI.md` K-01 (REZERVE)
  ve `tools/bekci/bekci.conf` `urun_yollari` (`04_urun`, klasör yok).
- **Teknik seçimin gerekçesi** → K-01 gövdesi; yoksa her oturumda yeniden tartışılır.
- **Nerede kaldım ve neyin inşa EDİLMEDİĞİ** → `03_roller/gelistirici/DURUM.md`. Bitmemiş parça
  yazılmazsa taze oturum bitmiş sayar.
- **Son koşan komut ve çıktının belirleyici satırı** → görev satırının Kanıt sütunu.
