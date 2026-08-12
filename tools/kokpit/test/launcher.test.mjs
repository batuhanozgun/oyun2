// launcher.test.mjs — U73: çift-tıkla başlatıcının yapılandırma okuması.
//
// NEDEN VAR: bu dosya bu paketle DOĞDU; başlatıcının hiçbir dalı ölçülmüyordu. Kusur, kurulum
// yolunu JS KAYNAĞINA gömmekti: yolda tek tırnak varsa (ör. "Batu's Proje") node AYRIŞTIRMA
// anında ölüyor, `catch` HİÇ koşmuyor ve kabuktaki `|| echo 4173` sessizce devreye giriyordu —
// sahibin kokpit.config.json'a yazdığı port YOK SAYILIYOR, kokpit başka portta aranıyordu.
//
// AĞA ÇIKILMAZ, SUNUCU BAŞLATILMAZ: başlatıcının PORT bloğu KAYNAĞINDAN çıkarılıp koşturulur
// (ikinci bir kopya yazmak — D-02 — tam da bu sınıfın kusurunu doğururdu).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const BURASI = dirname(fileURLToPath(import.meta.url));
const BASLATICI = join(BURASI, '..', 'launcher', 'Kokpit.command');

// PORT bloğu kaynaktan çıkarılır: `PORT="$(` satırından `URL=` satırına kadar.
function portBlogu() {
  const s = readFileSync(BASLATICI, 'utf8');
  const i = s.indexOf('PORT="$(');
  const j = s.indexOf('URL="http', i);
  assert.ok(i > 0 && j > i, 'başlatıcının PORT bloğu bulunamadı — kaynak biçimi değişmiş');
  return s.slice(i, j);
}

function portOku(klasorAdi, config) {
  const kok = mkdtempSync(join(tmpdir(), 'kokpit-launcher-'));
  const dir = join(kok, klasorAdi, 'tools', 'kokpit');
  mkdirSync(dir, { recursive: true });
  if (config !== null) writeFileSync(join(dir, 'kokpit.config.json'), config);
  const betik = ['DIR="$1"', 'NODE="$2"', portBlogu(), 'printf "%s" "$PORT"'].join('\n');
  const r = spawnSync('bash', ['-c', betik, 'bash', dir, process.execPath], { encoding: 'utf8' });
  return r.stdout;
}

test('U73: yolda TEK TIRNAK varken yapılandırılmış port KORUNUR', () => {
  // Arızanın kendisi. Gömme biçimde node `SyntaxError: missing ) after argument list` verip
  // rc=1 dönüyordu; `catch` hiç koşmadığı için hata dalı da işlemiyordu ve port 4173 oluyordu.
  assert.equal(portOku("Batu's Proje", '{"port":4199,"vaultYolu":"../.."}'), '4199',
    'tek tırnaklı yolda yapılandırılmış port düştü — kokpit sahibin yazdığı portta aranmıyor');
});

test('U73: sıradan yolda da yapılandırılmış port okunur (ölçümün ön koşulu)', () => {
  assert.equal(portOku('Duz Proje', '{"port":4199}'), '4199');
});

test('U73: yapılandırma yoksa/bozuksa varsayılan 4173 (fail-safe dal fiilen koşuyor)', () => {
  assert.equal(portOku('Duz Proje', null), '4173', 'dosya yokken varsayılana düşmeli');
  assert.equal(portOku('Duz Proje', '{bozuk json'), '4173', 'bozuk JSON varsayılana düşmeli');
  assert.equal(portOku("Batu's Proje", '{bozuk json'), '4173',
    'tırnaklı yolda BOZUK yapılandırma da varsayılana düşmeli (iki kusur üst üste)');
});

test('U73: port SAYI değilse varsayılana düşer (çöp değer URL’e girmez)', () => {
  assert.equal(portOku('Duz Proje', '{"port":"4199; rm -rf /"}'), '4173');
  assert.equal(portOku('Duz Proje', '{"port":true}'), '4173');
});

test('U73 tek ev: başlatıcı hiçbir yolu JS KAYNAĞINA gömmüyor', () => {
  // Yapısal dikiş: `"$NODE" -e "…"` bloklarının içinde kabuk genişletmesi olamaz. Değer
  // ortamdan geçer (process.env), çünkü ortam değişkeni bir DEĞERDİR — ayrıştırıcıya girmez.
  const s = readFileSync(BASLATICI, 'utf8');
  const bloklar = [...s.matchAll(/"\$NODE"\s+-e\s+"([\s\S]*?)"\s*\n?\s*(?:2>|\)|\|\|)/g)].map((m) => m[1]);
  assert.ok(bloklar.length >= 2, 'node -e blokları bulunamadı (' + bloklar.length + ')');
  for (const b of bloklar) {
    assert.ok(!/\$(?!\{?process\b)[A-Za-z_{]/.test(b),
      'JS kaynağına kabuk değişkeni gömülmüş — tek tırnaklı yol ayrıştırmayı bozar:\n' + b.slice(0, 200));
  }
});
