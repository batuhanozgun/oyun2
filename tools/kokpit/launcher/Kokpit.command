#!/bin/bash
# Kokpit — çift tıkla başlatıcı (salt-okunur, yerel).
# Bu pencere açık kaldıkça kokpit çalışır; pencereyi kapatınca kokpit kapanır.

DIR="$(cd "$(dirname "$0")/.." && pwd)"   # tools/kokpit

# node keşfi — çift-tıkta PATH dardır (file-guard ile AYNI aday listesi; bağlantısız
# Homebrew kegi dahil — soğuk-denetim B6: eski tek-aday arama gerçek makinede node'u bulamıyordu).
NODE="$(command -v node 2>/dev/null || true)"
if [ -z "$NODE" ]; then
  for aday in /usr/local/bin/node /opt/homebrew/bin/node /usr/local/opt/node*/bin/node /opt/homebrew/opt/node*/bin/node; do
    if [ -x "$aday" ]; then NODE="$aday"; break; fi
  done
fi
if [ -z "$NODE" ]; then
  printf '\n  Kokpit açılamadı: Node.js bulunamadı.\n'
  printf '  Çözüm: nodejs.org adresinden Node.js kur, sonra bu dosyaya yeniden çift tıkla.\n\n'
  read -r -p '  (kapatmak için Enter) ' _
  exit 1
fi

SRV="$DIR/server.mjs"

# ── U73 · YOL JS KAYNAĞINA GÖMÜLMEZ, ORTAMDAN GEÇER ──────────────────────────────────────
# Kurulum yolu tek tırnak taşıyorsa (ör. "Batu's Proje") gömme biçim JS'i AYRIŞTIRMA anında
# bozuyordu: `catch` hiç koşmuyor, node exit 1 veriyor ve kabuktaki `|| echo 4173` sessizce
# devreye giriyordu — yapılandırılmış port (ör. 4199) YOK SAYILIYOR, kokpit başka bir portta
# aranıyordu. Ölçüldü 2026-08-09: `SyntaxError: missing ) after argument list`, rc=1, PORT=4173.
# Ortam değişkeni bir DEĞERDİR, kaynak metni değil — ayrıştırıcıya hiç girmez.
PORT="$(K_DIR="$DIR" "$NODE" -e "
  const fs = require('fs');
  try { process.stdout.write(String(JSON.parse(fs.readFileSync(process.env.K_DIR + '/kokpit.config.json', 'utf8')).port || 4173)); }
  catch (e) { process.stdout.write('4173'); }
" 2>/dev/null || echo 4173)"
# Port SAYI olmalı: config'e dize/çöp yazılmışsa sessizce URL'e girmesin.
case "$PORT" in ''|*[!0-9]*) PORT=4173 ;; esac
URL="http://127.0.0.1:$PORT"

clear
printf '\n  ▸ Kokpit çalışıyor\n\n'
printf '    Tarayıcıda:    %s\n' "$URL"
printf '    Kapatmak için: bu pencereyi kapat.\n\n'

# Portta zaten bir kokpit varsa HANGİ projeye ait olduğunu doğrula (soğuk-denetim E4):
# sağlık cevabındaki vault, bu kopyanın vault'uyla aynı değilse YANLIŞ projenin kokpiti açılmasın.
SAGLIK="$(curl -s -m 1 "$URL/api/health" 2>/dev/null || true)"
if [ -n "$SAGLIK" ]; then
  BEKLENEN="$(K_DIR="$DIR" "$NODE" -e "
    const fs = require('fs'), path = require('path'), d = process.env.K_DIR;
    let v = '../..';
    try { v = JSON.parse(fs.readFileSync(d + '/kokpit.config.json', 'utf8')).vaultYolu || '../..'; } catch (e) {}
    try { process.stdout.write(fs.realpathSync(path.resolve(d, v))); } catch (e) { process.stdout.write(path.resolve(d, v)); }
  " 2>/dev/null || true)"
  CALISAN="$(printf '%s' "$SAGLIK" | "$NODE" -e "
    let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{try{process.stdout.write(String(JSON.parse(d).vault||''))}catch(e){}});
  " 2>/dev/null || true)"
  if [ -n "$BEKLENEN" ] && [ "$CALISAN" = "$BEKLENEN" ]; then
    printf '    (Zaten çalışıyordu — tarayıcı açılıyor.)\n\n'
    open "$URL"; exit 0
  fi
  printf '    DİKKAT: Bu portta BAŞKA bir projenin kokpiti çalışıyor:\n'
  printf '      çalışan: %s\n      bu proje: %s\n' "${CALISAN:-bilinmiyor}" "$BEKLENEN"
  printf '    Bu projenin kokpitini görmek için önce o pencereyi kapat,\n'
  printf '    ya da kokpit.config.json içindeki "port" değerini değiştir (ör. 4174).\n\n'
  read -r -p '  (kapatmak için Enter) ' _
  exit 1
fi

( sleep 2; open "$URL" ) &
exec "$NODE" "$SRV"
