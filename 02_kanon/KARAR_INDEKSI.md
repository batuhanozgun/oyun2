<!-- yazar: koordinator (iskelet: genesis) -->
# KARAR İNDEKSİ

Bu dosya kararların **listesidir**, gövdesi değil. Kilitli karar gövdeleri `02_kanon/kilitli/`
altında yaşar ve düzenlenmez (EL_KITABI D3): hatalı kilitli karar düzeltilmez, YENİSİ yazılır ve
`aşar: K-NN` işaretçisiyle bağlanır.

**Kanon-fakir dünya:** ilk kutularda gövde yoktur. Gövdesi olmayan bir kararla çelişen iş
bulunduğunda yol "eskisini aş" değil, **"yeni karar üret + mühürle"**dir.

**Alıntılama:** bir ajan sahibe soru sormak yerine bir kararı gerekçe gösterebilir
(`sormadım çünkü K-NN`). Bu, sahibin "bana az soru gelsin" talebinin mekanik karşılığıdır —
karar ne kadar yazılıysa sahibe o kadar az soru gider.

| ID | Karar | Bağlayıcılık | Gövde | Kaynak |
|---|---|---|---|---|
| K-01 | **REZERVE — teknik temel** (dil/çatı, dosya ağacı, çıplak test ve derleme komutları) | — | yok (ilk kutuda doğar) | `tools/bekci/bekci.conf` `urun_yollari` ve EL_KITABI D4d kanıt-komutu buna bağlıdır |
| K-02 | Çocuktan veri toplanmaz; hesap/giriş yok, veri cihazda kalır | sert | yok — tohum | VIZYON §5.1 · §9 tohum 1 |
| K-03 | Para yalnız ebeveyn tarafından: tek seferlik satın alma **ya da** abonelik; çocuk yüzeyinde satış yok | sert (biçim) · model seçimi AÇIK | yok — tohum | VIZYON §5.2 · §9 tohum 2 |
| K-04 | Ebeveyn birinci sınıf kullanıcıdır, sonradan eklenen ayar ekranı değil | sert | yok — tohum | VIZYON §5.4 · §9 tohum 3 |
| K-05 | Eğlenceli olmak, öğretici olmakla **eşit ağırlıkta** kalite ölçütüdür | sert | yok — tohum | VIZYON §5.5 · §9 tohum 4 |
| K-06 | Metin baştan oyundan ayrı tutulur (çok dil) | orta | yok — tohum | VIZYON §9 tohum 5 |
| K-07 | Önce iPhone + iPad; Android sonra | orta | yok — tohum | VIZYON §9 tohum 6 |
| K-08 | Sahip yön verir ve onaylar; yapım işi ekiptedir | orta | yok — tohum | VIZYON §9 tohum 7 |
| K-09 | Kadro geniş kurulur; tartışan roller dâhil | sert | `02_kanon/KADRO.md` (sahip mührü 2026-08-12) | VIZYON §9 tohum 8 · G2.5 |
| K-10 | Hassas konular (ölüm, kayıp, ilk aşk, ergenlik) **ray yazılmadan** içeriğe girmez | sert | yok — tohum | VIZYON §5.6 |
| K-11 | Sahibin çocuğuna dair hiçbir kişisel bilgi kayda geçmez; gözlem ürüne yazılır, kişiye değil | sert | yok — tohum | VIZYON §7 (sahibin açık talebi) |

**Durum notu:** K-02…K-08, K-10, K-11 **tohum** kararlardır: yürürlüktedirler ve iş onlara
uymak zorundadır, ama gövdeleri yoktur ve `kilitli/` altında değildirler. Biri tartışmaya
açılırsa yol şudur: gövdesini yaz, sahibin mührünü al, `kilitli/`ye indir.
