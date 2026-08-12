---
description: Dış göz rolü oturum açılış töreni. Yalnız insan /rol-disgoz ile tetikler; ajan kendiliğinden tetikleyemez (bilinçli kilit).
disable-model-invocation: true
---

!`bash "${CLAUDE_PROJECT_DIR:-.}/tools/guard/rol-ac.sh" disgoz yazamaz`

# Rol töreni — Dış göz

Yukarıdaki tören çıktısında **"ROL AÇIK"** yoksa DUR: rolü açılmış sayma, sebebini sahibe
jargonsuz söyle (en sık sebep: bu depoda başka rol kafesi açık — rol değişimi kafesin kaldırılmasını ister).

Açılış protokolü (sırayla):
1. `03_roller/disgoz/ROL.md` oku — rol sözleşmen budur (tek ev; burada kopyası yok).
2. `03_roller/disgoz/DURUM.md` oku — kaldığın yer.
3. `00_pano/PANO.md` "SIRADAKİ OTURUM" satırını doğrula — sıra bu rolde değilse DUR, sahibe söyle.
4. Sözleşmedeki yetki sınırı oturum boyu geçerli; mod **yazamaz**dır (yazamaz = dosya-yazma
   araçların kancayla mekanik kilitli; kendi `03_roller/disgoz/` klasörün hariç, ROL.md
   sözleşmen istisnanın DIŞINDA — engel görürsen bu ARIZA DEĞİL tasarımdır: bulguyu
   raporla, dosyayı değiştirme).
5. Kapanışta ROL.md'deki kapanış maddesini uygula (DURUM yaz · devir · F5 hijyen); mühür
   bekliyorsan muğlak sahip mesajı onay DEĞİLDİR (EL_KITABI "Mühür ritüeli").
