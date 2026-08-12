#!/bin/bash
# kanal-yokla — haber kanalının sağlık kontrolü (E5). `/donem` töreninin ve bekçinin okuduğu
# tek satırlık hüküm; karar-alani.sh emsali, FAIL-CLOSED (kendi hatası da "HAZIR DEĞİL"dir).
#
# Neden ön koşul: kanalın kırık olduğunu öğrenmenin en ucuz anı, sahibin klavyede olduğu tek
# andır. Gece yarısı keşfedilen kırık kanal = haber alınmayan bir gece (tasarı §3.3).
#
# KANAL İKİ YÖNLÜDÜR ve yoklama İKİSİNİ DE sayar. Kalem SAYISI burada YAZILMAZ — bu satırda
# eskiden "Üç kalem" yazıyordu, gelen yön hiç yoklanmıyordu ve ilan yıllarca kendi kendine
# doğru göründü (U7). İlan artık YÖNE göre kurulur; kapsamı bir test ölçer (kanal-e5).
#   GİDEN (SMTP) : yapılandırma · Keychain kaydı · kimlik doğrulaması. POSTA GÖNDERMEZ —
#                  curl yalnız bağlanır, STARTTLS yapar, AUTH dener ve kapatır.
#   GELEN (IMAP) : yapılandırmanın kendi içinde tutarlılığı · sunucu oturumu · INBOX'ın
#                  seçilebilmesi ve aramanın kabul edilmesi. POSTA OKUMAZ — hiçbir iletiyi
#                  çekmez, hiçbir bayrağa dokunmaz (çekim iletiyi okundu işaretlerdi; U80).
# Gelen yön KOŞULLUDUR: IMAP'siz kurulum meşrudur, AMA uzaktan cevap açıkken IMAP'in olmaması
# kurulumun kendi kendisiyle çelişmesidir ve KIRMIZI'dır — U7'nin doğuş senaryosu birebir budur.
# Çıktı (ilk satır): HAZIR   ya da   HAZIR DEĞİL · <sebep>
#   İLK SATIR SÖZLEŞMEDİR ve büyümez: üç tüketici de yalnız onu okuyor (bekci/cekirdek.mjs ·
#   donem-ac.sh · ortak.sh). Gelen yönün hükmü bu yüzden İKİNCİ satıra yazılır — ilk satıra
#   eklenen her ek, üç tüketiciyi birden yanlış kırmızıya çevirirdi.
# Çıkış kodu: 0 = hazır · 1 = değil.
set -uo pipefail
export LC_ALL=C.UTF-8

DIZIN="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KOK="${CLAUDE_PROJECT_DIR:-$(cd "$DIZIN/../.." && pwd)}"
DERIN=1
[ "${1:-}" = "--sig" ] && DERIN=0   # ağa çıkmadan yalnız yapılandırma+Keychain (testler)

degil() { printf 'HAZIR DEĞİL · %s\n' "$1"; exit 1; }

[ -r "$DIZIN/ortak.sh" ] || degil "ortak kitaplık yok (tools/sevk/ortak.sh)"
# shellcheck source=/dev/null
. "$DIZIN/ortak.sh"

kanal_oku "$KOK" || degil "${KANAL_HATA:-kanal.conf okunamadı}"
[ -x "$(command -v security 2>/dev/null || echo /usr/bin/security)" ] || degil "security (Keychain) bulunamadı"

PAROLA="$(security find-generic-password -s "$KANAL_KEYCHAIN_SERVIS" -a "$KANAL_HESAP" -w 2>/dev/null)" || PAROLA=""
[ -n "$PAROLA" ] || degil "Keychain kaydı yok — kur: security add-generic-password -s \"$KANAL_KEYCHAIN_SERVIS\" -a \"$KANAL_HESAP\" -w"

if [ "$DERIN" -eq 1 ]; then
  command -v curl >/dev/null 2>&1 || degil "curl bulunamadı"
  # Değer taşıyan satırlar TEK EVDEN (U71: ortak.sh:curl_conf_yaz). Tırnaklı bir conf değeri
  # eskiden curl'e sunucusuz URL verip curl 3 döndürüyordu; bu betik onu `*)` dalında
  # "SMTP yoklaması başarısız" diye basıyordu — sahip yanlış yere bakardı (ölçüldü).
  # Yapılandırma kurulamazsa SEBEP KENDİ ADIYLA basılır (hasım bulgusu): eskiden bu hâl
  # `*)` dalına düşüp "SMTP yoklaması başarısız (curl 1)" diyordu — sahip ağa/parolaya bakardı,
  # oysa kusur kanal.conf'un kendi değerinde.
  KONF="$(curl_conf_yaz url "smtp://$KANAL_SMTP_SUNUCU:$KANAL_SMTP_PORT" \
      user "$KANAL_HESAP:$PAROLA" max-time 15)" \
    || degil "kanal.conf değeri curl yapılandırmasına yazılamadı — kaçırılamayan kontrol karakteri var (SMTP_SUNUCU · HESAP · Keychain parolası)"
  CIKTI="$( { printf '%s\n' "$KONF"; printf 'ssl-reqd\nsilent\nshow-error\n'; } | curl -K - 2>&1)"
  KOD=$?
  case "$KOD" in
    0) : ;;
    67) degil "SMTP kimlik doğrulaması reddedildi — uygulama parolası yanlış ya da süresi dolmuş (Keychain: $KANAL_KEYCHAIN_SERVIS/$KANAL_HESAP)" ;;
    6|7|28|35) degil "SMTP sunucusuna ulaşılamadı ($KANAL_SMTP_SUNUCU:$KANAL_SMTP_PORT · curl $KOD): $CIKTI" ;;
    *) degil "SMTP yoklaması başarısız (curl $KOD): $CIKTI" ;;
  esac
fi

# ── GELEN YÖN (IMAP) ─────────────────────────────────────────────────────────────────────
# Koşulluluk önce, ağ sonra: çelişkili yapılandırma SIĞ kipte de yakalanır. U7'nin senaryosu
# ağa hiç çıkmadan görülebilirdi ve görülmüyordu.
IMAP_HUKUM=""
CEVAP_ISTENDI=0
[ "${KANAL_CEVAP_KANALI:-}" = "acik" ] && CEVAP_ISTENDI=1

if [ -z "${KANAL_IMAP_SUNUCU:-}" ]; then
  # TEK KIRMIZI KOŞULLU HÂL. Kurulum "gece bir karar gerekirse postayla cevaplayacağım" diyor
  # ama cevabın okunacağı yolu hiç kurmamış: soru gider, cevap HİÇ işlenmez ve sahip bunu
  # ancak telefondan cevap verip hiçbir şey olmadığını görünce anlar.
  [ "$CEVAP_ISTENDI" -eq 1 ] && degil "uzaktan cevap açık (CEVAP_KANALI=acik) ama IMAP_SUNUCU boş — cevabın okunacağı yol kurulu değil; ya IMAP_SUNUCU'yu doldur ya CEVAP_KANALI'nı boşalt"
  # DUR_JETON dolu + IMAP boş hâli KIRMIZI DEĞİLDİR: uzaktan DUR'un varlık sorusu açık
  # (sahip 2026-08-12) ve varlığı sorgulanan bir yeteneğin üstüne yeni kırmızı kapı kurulmaz.
  # Sessiz de kalmaz — nabız o hâl için günlüğe `uzaktan-dur-kapali` bulgusu yazıyor.
  if [ -n "${KANAL_DUR_JETON:-}" ]; then
    IMAP_HUKUM="GELEN (IMAP): kurulu değil — uzaktan cevap kapalı, meşru. NOT: DUR_JETON dolu ama IMAP yok, uzaktan DUR fiilen çalışmaz."
  else
    IMAP_HUKUM="GELEN (IMAP): kurulu değil — uzaktan cevap kapalı, meşru."
  fi
else
  case "${KANAL_IMAP_PORT:-993}" in
    ''|*[!0-9]*) degil "IMAP_PORT sayı değil (${KANAL_IMAP_PORT:-boş}) — kanal.conf" ;;
  esac
  if [ "$DERIN" -eq 0 ]; then
    IMAP_HUKUM="GELEN (IMAP): $KANAL_IMAP_SUNUCU:${KANAL_IMAP_PORT:-993} yapılandırılmış — sığ kip, ağa çıkılmadı."
  else
    # (a) KİMLİK — YOLSUZ çağrı. Kutu seçilmeden yalnız oturum açılır; ölçüldü 2026-08-12
    #     (K17 tatbikatı): yolsuz `imaps://` + NOOP çalışıyor. Gelen kutusuna hiç dokunulmaz.
    I_KONF="$(curl_conf_yaz url "imaps://$KANAL_IMAP_SUNUCU:${KANAL_IMAP_PORT:-993}" \
        user "$KANAL_HESAP:$PAROLA" request "NOOP" max-time 15)" \
      || degil "kanal.conf değeri curl yapılandırmasına yazılamadı — kaçırılamayan kontrol karakteri var (IMAP_SUNUCU · HESAP · Keychain parolası)"
    I_CIKTI="$( { printf '%s\n' "$I_KONF"; printf 'silent\nshow-error\n'; } | curl -K - 2>&1)"
    I_KOD=$?
    # AŞAMA ATFI ÇIKIŞ KODU KEHANETİYLE DEĞİL, HANGİ ÇAĞRININ DÜŞTÜĞÜYLE yapılır. Bu çağrı
    # geçerse parola ve erişilebilirlik ELENMİŞTİR; sonraki dalın sebebi artık yalan olamaz.
    case "$I_KOD" in
      0) : ;;
      67) degil "IMAP kimlik doğrulaması reddedildi — uygulama parolası IMAP'te geçmiyor (Keychain: $KANAL_KEYCHAIN_SERVIS/$KANAL_HESAP). SMTP geçti, yani parola var ama IMAP erişimi kapalı olabilir" ;;
      6|7|28|35) degil "IMAP sunucusuna ulaşılamadı ($KANAL_IMAP_SUNUCU:${KANAL_IMAP_PORT:-993} · curl $I_KOD): $I_CIKTI" ;;
      *) degil "IMAP oturumu açılamadı (curl $I_KOD): $I_CIKTI" ;;
    esac
    # (b) KUTU + ARAMA — nabzın fiilen yaptığı iş. Eşleşmeyen bir arama seçilir: SEARCH hiçbir
    #     bayrağa dokunmaz (çekim dokunurdu) ve sonuç boş dönse de komutun kabul edildiğini
    #     kanıtlar. Kimlik yukarıda elendiği için buradaki hata KUTUYU işaret eder.
    A_KONF="$(curl_conf_yaz url "imaps://$KANAL_IMAP_SUNUCU:${KANAL_IMAP_PORT:-993}/INBOX" \
        user "$KANAL_HESAP:$PAROLA" request "UID SEARCH HEADER Message-ID \"<keel-yoklama-eslesmez@gecersiz>\"" max-time 15)" \
      || degil "IMAP arama yapılandırması yazılamadı — kanal.conf değeri kontrol karakteri taşıyor"
    A_CIKTI="$( { printf '%s\n' "$A_KONF"; printf 'silent\nshow-error\n'; } | curl -K - 2>&1)"
    A_KOD=$?
    [ "$A_KOD" -eq 0 ] || degil "IMAP INBOX seçilemedi ya da arama reddedildi (curl $A_KOD) — kimlik doğrulaması GEÇTİ, kusur kutuda: $A_CIKTI"
    if [ "$CEVAP_ISTENDI" -eq 1 ]; then
      IMAP_HUKUM="GELEN (IMAP): yoklandı — oturum açıldı, INBOX seçildi, arama kabul edildi. Uzaktan cevap AÇIK."
    else
      IMAP_HUKUM="GELEN (IMAP): yoklandı — oturum açıldı, INBOX seçildi, arama kabul edildi. Uzaktan cevap kapalı (CEVAP_KANALI boş)."
    fi
  fi
fi

printf 'HAZIR\n'
printf '%s\n' "$IMAP_HUKUM"
exit 0
