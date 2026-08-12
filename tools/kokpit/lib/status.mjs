// Vault durumu → tek JSON. SALT-OKUNUR: yalnız okur, ayrıştırır; hiçbir yere yazmaz.
// Biçim sözleşmesi 2026-07-03 keşif turundan. Türkçe İ/ı ve · (U+00B7),
// — (U+2014), → (U+2192) load-bearing; ASCII normalize edilmez, toLowerCase kullanılmaz.
//
// Kaynak önceliği (keşif turunun tuzağı): görev durumu için tek otorite PANO MEKANİK BLOK
// (bekci.sh üretir, makine). KUTU görev tablosu koordinatör elyazımı (en bayat) → yalnız iş+sahip.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { splitRow } from './markdown.mjs';
// U74 · PANO mekanik bloğunun ALAN LİSTESİ tek evde: ../pano-alanlari.txt. Bu dosya listeyi
// TEKRAR ETMEZ; hangi satırların beklendiğini, hangisinin eksikliğinin not düşürdüğünü ve
// hangisinin sessiz geçeceğini oradan türetir. Yazar (bekçi) aynı tabloyu kullanır.
import { panoAlanlariOku, panoBlokCoz } from './pano-alanlari.mjs';

const MID = '·';   // ·  alan ayıracı (boşluklu)
const DASH = '—';  // —  em-dash

// ── OKUMA BÜTÜNLÜĞÜ (K13) ────────────────────────────────────────────────────────────────
// Bu dosyanın eski kusuru bir satırda değil, bir ALIŞKANLIKTAYDI: "eşleşirse oku, eşleşmezse
// yok say". Sözleşme (PANO_SOZLESMESI) bunun tersini vaat ediyordu — "söz dizimi bozulursa
// okuma notu basılır, asla sessiz maskeleme". Ölçüm dört bozmada sıfır uyarı + YEŞİL saydı.
//
// İki sınıf ayrıdır çünkü bedelleri ayrıdır:
//   NOT      → satır sözleşme dışı ama HÜKÜM kaybolmadı (fazladan açıklama, okunmayan damga).
//              Uyarı yeter; genel duruma dokunmaz.
//   BOŞLUK   → ışık hükmünün bir parçası KAYBOLDU (satır yok · parça çözülemedi · ikinci
//              kaynak yok · değer sözlük dışı). Uyarı + genel durum YEŞİL BASAMAZ.
// Boşluk YALNIZ yeşili düşürür: VERİ-YOK zaten "bilmiyorum", KIRMIZI zaten en kötü.

// "AKIŞ=YEŞİL · DOSYA=SARI · DAVRANIŞ=VERİ-YOK" → [{ad,deger}] (sıralı).
// Ad'lar serbest (vault'a göre değişir); yalnız söz dizimi sabit (NAME=val · NAME=val).
export function parseLights(s, warnings, bosluklar) {
  if (typeof s !== 'string') return null;
  const out = [];
  for (const part of s.split(' ' + MID + ' ')) {
    const ham = part.trim();
    if (!ham) continue;
    // Değerden SONRA gelen serbest metin ışığı DÜŞÜRMEZ; değer okunur, fazlalık nota yazılır.
    // Gerekçe ölçülmüştür, tahmin değil: üçüncü kopyanın canlı panosunda üçüncü ışık
    // "DAVRANIŞ=VERİ-YOK (Denetçi örneklemesi …)" biçiminde yazılıyor ve eski desen
    // (`^(.+?)=(\S+)$`) o ışığı sessizce düşürüyordu. KAYBOLAN ışık, sözleşme dışı yazılmış
    // ışıktan tehlikelidir: KIRMIZI'yı da aynı sessizlikle götürür (K13 bozma 2).
    const m = ham.match(/^([^=]+?)=(\S+)(?:\s+(.*))?$/);
    if (!m) {
      if (warnings) warnings.push('ışık parçası çözümlenemedi (ad=değer bekleniyor): ' + ham);
      if (bosluklar) bosluklar.push('isik-parca-cozulemedi');
      continue;
    }
    out.push({ ad: m[1].trim(), deger: m[2] });
    if (m[3] && m[3].trim() && warnings) {
      warnings.push('ışık satırında fazladan açıklama var (ad=değer bekleniyor): ' + ham);
    }
  }
  return out.length ? out : null;
}

async function readIf(abs) {
  try {
    return await fs.readFile(abs, 'utf8');
  } catch {
    return null;
  }
}

async function statIf(abs) {
  try {
    return await fs.stat(abs);
  } catch {
    return null;
  }
}

// Alan listesinin tek evi KODUN YANINDADIR, okunan vault'ta değil: kokpit kendisine ait
// olmayan vault'ları da okur (D-05) ve okuduğu yerin tablosuna göre şekil değiştiren bir
// okuyucu, sözleşmeyi okunan tarafa devretmiş olurdu.
const ALAN_DOSYASI = fileURLToPath(new URL('../pano-alanlari.txt', import.meta.url));

// Eksik satırın okuma notu. Metinler sahip dilindedir; tabloya yeni bir alan eklenip buraya
// karşılığı yazılmazsa genel metin basılır — sessizlik değil, daha az ayrıntı.
const EKSIK_NOTU = {
  'son-denetim': 'PANO son denetim damgası okunamadı',
  'isiklar': 'PANO Işıklar satırı okunamadı',
  'gorevler': 'PANO Görevler satırı okunamadı',
  'sahipte-bekleyen': 'PANO sende bekleyen sayısı satırı okunamadı',
  'sira': 'PANO Sıra satırı okunamadı',
  'sayac': 'PANO Kırmızı/Sarı sayaç satırı okunamadı',
};

// --- PANO mekanik blok (fenced, makine) ---
// kuruluVault: okunan vault ALAN LİSTESİNİ kendisi taşıyor mu? Taşıyorsa panosunu o tablodan
// türeyen bir yazar yazıyordur ve eksik alan gerçek bir kayıptır; taşımıyorsa vault ya eski
// bir kurulumdur ya da bize ait değildir — ona not basmak yanlış-alarm olurdu.
function parseMekanik(pano, warnings, bosluklar, kuruluVault) {
  const out = { lights: null, tasks: {}, red: null, yellow: null, lastRun: null, runNo: null, sira: null, sahipteBekleyen: null, durak: null };
  if (!pano) {
    warnings.push('PANO.md okunamadı');
    return out;
  }
  const block = pano.match(/## MEKANİK BLOK[^\n]*\n```\n([\s\S]*?)\n```/);
  if (!block) {
    warnings.push('PANO mekanik blok bulunamadı (biçim değişmiş olabilir)');
    return out;
  }
  const body = block[1];
  // U74 · hangi satırların beklendiği TEK EVDEN gelir; aşağıdaki kod yalnız DEĞERİ çözer.
  // Eskiden liste burada elle yazılıydı, yazarda ayrı, sözleşmede ayrı — üçü ayrıştı:
  // yazar sekiz satır basarken burada beşi aranıyordu, `Bekleyen sorular:` ise hiçbir yerde
  // okunmuyordu (ölü dize) ve eksik alan SESSİZ geçiyordu.
  // ALAN LİSTESİ OKUNAMAZSA EKRAN BOŞALMAZ. İlk yazımda buradaki hata dışarı fırlıyordu ve
  // /api/state 500 dönüyordu: sahip SIFIR okuma notuyla BOŞ bir sayfa görüyordu (hasım turu,
  // 2026-08-10). Hiçbir şey söylemeden kapanmak fail-closed değildir. Hüküm boşluğa yazılır:
  // genel durum YEŞİL basamaz ve sebep sahibin okuma notlarında görünür.
  let alanlar;
  try {
    alanlar = panoAlanlariOku(ALAN_DOSYASI);
  } catch {
    warnings.push('pano biçim listesi okunamadı — panonun makine satırları çözümlenemedi');
    if (bosluklar) bosluklar.push('pano-alan-listesi-okunamadi');
    return out;
  }
  const deger = panoBlokCoz(alanlar, body);
  for (const a of alanlar) {
    if (deger.has(a.anahtar)) continue;
    if (a.okuyucu === 'istegebagli') continue;
    if (a.okuyucu === 'kurulu' && !kuruluVault) continue;
    warnings.push(EKSIK_NOTU[a.anahtar] || ('PANO satırı okunamadı: ' + a.onek));
    if (a.eksikHal === 'bosluk' && bosluklar) bosluklar.push('pano-' + a.anahtar + '-satiri-yok');
  }

  const damga = deger.get('son-denetim');
  if (damga !== undefined) {
    // Geri uyum (dil paketi, 2026-07-29): satır öneki gibi değer yazımı da iki türlü olabilir;
    // eski kurulumlar ve üçüncü kopyanın vault'u eski sözcüğü kullanır (D-02/D-05).
    const son = damga.match(/^(\d{4}-\d{2}-\d{2} \d{2}:\d{2})\s*\((?:denetim|koşu) #(\d+)\)/);
    if (son) {
      out.lastRun = son[1];
      out.runNo = Number(son[2]);
    } else {
      // NOT, boşluk değil: damganın yaşını SAGLIK tarafı yönetir ve o ayrıca ölçülür. Ama
      // okunamayan damga sessiz kalmaz (K13 bozma 3).
      warnings.push(EKSIK_NOTU['son-denetim']);
    }
  }

  const isikHam = deger.get('isiklar');
  if (isikHam !== undefined) {
    out.lights = parseLights(isikHam, warnings, bosluklar);
    if (!out.lights) {
      warnings.push('PANO Işıklar satırı çözümlenemedi');
      if (bosluklar) bosluklar.push('pano-isik-satiri-cozulemedi');
    }
  }

  // Sıra kimde? Değerler: `sahip` · `sistem` · `bilinmiyor`. Tanınmayan değer sessiz geçmez —
  // ışık sözlüğüyle aynı disiplin. Satırın HİÇ olmaması sessizdir (tablo: istegebagli);
  // gerekçe pano-alanlari.txt'te yazılı — okuyucuyu ikinci kez katılaştırmak, güncelleme
  // penceresinde sahibin ana panelini durduruyordu, yeni bir şey ölçmüyordu.
  const siraHam = deger.get('sira');
  if (siraHam !== undefined) {
    const jeton = siraHam.split(/\s+/)[0];
    if (['sahip', 'sistem', 'bilinmiyor'].includes(jeton)) out.sira = jeton;
    else {
      warnings.push('PANO Sıra satırı tanınmayan değer taşıyor: ' + jeton);
      out.sira = 'bilinmiyor';
    }
  }

  const gorevHam = deger.get('gorevler');
  if (gorevHam !== undefined) {
    for (const part of gorevHam.split(' ' + MID + ' ')) {
      const m = part.match(/G-(\d+)=(\S+)/);
      if (m) out.tasks['G-' + m[1]] = m[2];
    }
  }

  // Sende bekleyen madde sayısı: sahibin ekranında görünür. Sayı değilse sessiz kalmaz —
  // okunamayan bir sayıyı sıfır saymak, sahibe "bekleyen yok" demek olurdu.
  const bekHam = deger.get('sahipte-bekleyen');
  if (bekHam !== undefined) {
    if (/^\d+$/.test(bekHam)) out.sahipteBekleyen = Number(bekHam);
    else warnings.push('PANO sende bekleyen sayısı okunamadı: ' + bekHam);
  }

  // Durak: sistem kendi başına ilerleyemiyor, insan girdisi bekliyor. Satır koşulludur —
  // yokluğu sessizdir, varlığı sahibin ekranına çıkar.
  // SONDAKİ İÇ KURAL KODU ATILIR: panodaki metin ekipler için "(D9)" taşır, sahip için o kod
  // tanımsız bir işarettir ve sahip yüzeyinin ilk kuralı tanımsız kelime basmamaktır. Kod
  // panoda KALIR (ajanlar okur); yalnız sahibin ekranına çıkmaz.
  const durakHam = deger.get('durak');
  if (durakHam !== undefined) out.durak = durakHam.replace(/\s*\([A-ZÇĞİÖŞÜ]{1,2}\d+\)\s*$/, '').trim();

  const sayacHam = deger.get('sayac');
  if (sayacHam !== undefined) {
    const say = sayacHam.match(/^(\d+)\s*·\s*Sarı:\s*(\d+)/);
    if (say) {
      out.red = Number(say[1]);
      out.yellow = Number(say[2]);
    } else {
      warnings.push(EKSIK_NOTU['sayac']);
    }
  }
  return out;
}

// --- SAGLIK.md (makine): damga + kalem metinleri ---
function parseSaglik(saglik, warnings, bosluklar) {
  const out = { lastRun: null, runNo: null, lights: null, items: [] };
  if (!saglik) {
    warnings.push('SAGLIK.md okunamadı');
    return out;
  }
  // Geri uyum: kanonik yazım "son denetim: … (denetim #N)"; eski yazım da okunur (D-02/D-05).
  const stamp = saglik.match(/son (?:denetim|koşu):\s*(\d{4}-\d{2}-\d{2} \d{2}:\d{2})\s*\((?:denetim|koşu) #(\d+)\)/);
  if (stamp) {
    out.lastRun = stamp[1];
    out.runNo = Number(stamp[2]);
  } else {
    warnings.push('SAGLIK dosyasında tarih damgası bulunamadı');
  }
  // SAGLIK ışık satırı SESSİZ DEĞİLDİR (K13 bozma 4): satır tamamen silindiğinde kokpit
  // eskiden hiçbir şey söylemiyor, ışıkları PANO'dan alıp YEŞİL basıyordu. Sağlık dosyası
  // ışık hükmünün asıl evidir; okunamıyorsa iki-kaynaklı kötümser birleştirme de çalışmaz.
  const isik = saglik.match(/\*\*Işıklar:\*\*\s*(.+)/);
  if (isik) {
    out.lights = parseLights(isik[1], warnings, bosluklar);
    if (!out.lights) {
      warnings.push('SAGLIK Işıklar satırı çözümlenemedi');
      if (bosluklar) bosluklar.push('saglik-isik-satiri-cozulemedi');
    }
  } else {
    warnings.push('SAGLIK Işıklar satırı okunamadı');
    if (bosluklar) bosluklar.push('saglik-isik-satiri-yok');
  }
  for (const line of saglik.split(/\r?\n/)) {
    const m = line.match(/^-\s*\[(KIRMIZI|SARI|[iİI])\]\s*(.+)$/);
    if (m) out.items.push({ level: /^[iİI]$/.test(m[1]) ? 'BILGI' : m[1], text: m[2].trim() });
  }
  return out;
}

// --- PANO yargı bloğu (nesir): kalın etiketli satırlar ---
function yargiField(pano, label) {
  if (!pano) return null;
  const re = new RegExp('- \\*\\*' + label + '[^:]*:\\*\\*\\s*(.+)');
  const m = pano.match(re);
  return m ? m[1].trim() : null;
}

// --- KUTU.md görev tablosu → [{id, is, sahip, durum, kanit}] ---
// Sözleşme: görevler "## Görevler" bölümü altındadır. ESKİ "## Kapılar" başlığı da okunur
// (geri-uyum: kod üç kopyada bayt-bayt ortaktır ve üçüncü kopya eski başlığı kullanan bir
// vault'u okur — 4-sütun geri-uyumuyla aynı yöntem). Tek-faz (Faz başlığı yok) →
// tüm satırlar aktif. Çok-faz → yalnız "### Faz A" aktif; Faz B+ ve "Kapanan aşama"
// gibi diğer alt başlıklar pasif (mevcut çok-faz davranışı korunur).
function parseGates(kutu, warnings) {
  const gates = [];
  if (!kutu) return gates;
  let inGorevler = false; // "## Görevler" (ya da eski "## Kapılar") bölümünün içinde miyiz
  let aktif = false;      // aktif görev satırları toplanır mı
  for (const line of kutu.split(/\r?\n/)) {
    if (/^##\s+(Görevler|Kapılar)/.test(line)) { inGorevler = true; aktif = true; continue; }
    if (/^##\s/.test(line)) { inGorevler = false; aktif = false; continue; } // başka H2 → bölüm bitti
    if (inGorevler && /^###\s+Faz\s+A\b/.test(line)) { aktif = true; continue; }
    if (inGorevler && /^###\s+Faz\s+/.test(line)) { aktif = false; continue; } // Faz B, C… pasif
    if (inGorevler && /^###\s/.test(line)) { aktif = false; continue; }        // "Kapanan aşama" vb. pasif
    if (!inGorevler || !aktif) continue;
    if (!/^\|\s*G-\d+\b/.test(line)) continue;
    // splitRow (markdown.mjs ile ORTAK): `a|b` gibi satır-içi kod hücreyi bölmez (soğuk-denetim B4).
    const cells = splitRow(line);
    // [ 'G-07', 'iş...', 'analiz', 'açık — sevkte', 'kanıt' ]
    const id = cells[0];
    const is = cells[1] || '';
    const sahip = (cells[2] || '').split(/[\s/]/)[0]; // ilk rol
    const durum = (cells[3] || '').split(DASH)[0].trim();
    const kanitHam = (cells[4] || '').trim();
    const kanit = kanitHam && kanitHam !== DASH ? kanitHam : null; // 5. sütun (Kanıt); boş/'—'/4-sütun → null (bekçiyle aynı dil: '—' = işaretçisiz)
    gates.push({ id, is, sahip, durum, kanit });
  }
  return gates;
}

// --- ERTELENENLER.md (4 sütun tablo) ---
function parseErtelenenler(text, warnings) {
  const rows = [];
  if (!text) return rows;
  let headerSeen = false;
  for (const line of text.split(/\r?\n/)) {
    if (/^\|/.test(line)) {
      if (/^\|\s*Kalem\b/.test(line)) { headerSeen = true; continue; }
      if (/^[|\s:—-]+$/.test(line)) continue; // ayraç satırı
      if (!headerSeen) continue;
      const cells = splitRow(line); // markdown.mjs ile ortak bölücü (satır-içi kod korunur)
      rows.push({ kalem: cells[0] || '', sahip: cells[1] || '', kosul: cells[2] || '', kaynak: cells[3] || '' });
    } else if (headerSeen && rows.length) {
      break; // tablo bitti (kural paragrafı)
    }
  }
  return rows;
}

// --- Rol DURUM.md → özet ---
function parseDurum(slug, text) {
  const out = { slug, ad: slug, path: '03_roller/' + slug + '/DURUM.md', ozet: null, sonOturum: null, bos: false };
  if (!text) {
    out.ozet = '(DURUM.md okunamadı)';
    return out;
  }
  const h1 = text.match(/^#\s+DURUM\s+—\s+(.+)$/m);
  if (h1) out.ad = h1[1].trim();
  if (/Henüz oturum açılmadı/.test(text)) {
    out.bos = true;
    out.ozet = 'Henüz oturum açılmadı';
    return out;
  }
  const son = text.match(/\*\*Son oturum[^*]*\*\*:?\s*(.+)/);
  if (son) {
    out.ozet = son[1].trim();
    const d = text.match(/Son oturum[^)]*\(?(\d{4}-\d{2}-\d{2})/);
    if (d) out.sonOturum = d[1];
  } else {
    // ilk dolu gövde satırı (başlık + yorum sonrası)
    const lines = text.split(/\r?\n/).filter((l) => l.trim() && !/^<!--/.test(l) && !/^#/.test(l));
    if (lines.length) out.ozet = lines[0].trim();
  }
  return out;
}

// --- Tazelik: sahibin tek ezberi (bekçi tazeliği) + denetim-sonrası dosya değişimi (drift radarı) ---
async function computeFreshness(root, saglik, warnings) {
  const out = { lastRun: saglik.lastRun, stale: false, staleReason: null, driftAfterRun: false, driftFiles: [] };
  if (!saglik.lastRun) {
    out.stale = true;
    out.staleReason = 'SAGLIK dosyasında tarih damgası yok';
    return out;
  }
  const stampTime = new Date(saglik.lastRun.replace(' ', 'T') + ':00');
  const now = new Date();
  const ageMs = now.getTime() - stampTime.getTime();
  if (Number.isNaN(stampTime.getTime())) {
    out.stale = true;
    out.staleReason = 'damga çözümlenemedi';
    return out;
  }
  // Gelecekteki damga tazelik VE drift radarını birden maskeler (soğuk-denetim B2):
  // saat/dilim hatası ya da bozuk bekçi çıktısı — güvenilmez say, bayat işaretle.
  // Tolerans 5 dk: damga dakikaya yuvarlı + yerel-saat ayrıştırmalı olduğundan küçük saat
  // kayması/DST kenarı yanlış-KIRMIZI üretmesin (hasım turu bulgusu 2026-07-16); gerçek
  // gelecek-damgalar saatler/günler ötede olur, bu eşik onları yine yakalar. Yön fail-safe.
  if (ageMs < -300 * 1000) {
    out.stale = true;
    out.staleReason = 'sağlık damgası GELECEKTE görünüyor (saat/dilim hatası?) — damganın yaşı güvenilmez';
    return out;
  }
  if (ageMs > 24 * 3600 * 1000) {
    out.stale = true;
    const gun = Math.floor(ageMs / (24 * 3600 * 1000));
    out.staleReason = 'son sağlık denetimi ' + gun + ' gün önce — otomatik sağlık kontrolü güncel değil';
  }
  // Koşudan sonra değişen dosyalar (bekçi çıktıları hariç) → ışıklar geride olabilir
  const skip = new Set(['00_pano/SAGLIK.md', '00_pano/PANO.md']);
  async function scan(rel) {
    const abs = path.join(root, rel);
    let entries;
    try { entries = await fs.readdir(abs, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      if (e.name.startsWith('.') || e.name === 'node_modules') continue;
      if (e.isSymbolicLink()) continue;
      const childRel = rel ? rel + '/' + e.name : e.name;
      if (e.isDirectory()) { await scan(childRel); continue; }
      if (!e.isFile() || !e.name.endsWith('.md')) continue;
      if (skip.has(childRel)) continue;
      const st = await statIf(path.join(root, childRel));
      if (st && st.mtime.getTime() > stampTime.getTime() + 60000) {
        out.driftFiles.push(childRel);
      }
    }
  }
  await scan('');
  if (out.driftFiles.length) {
    out.driftAfterRun = true;
    out.driftFiles.sort();
  }
  return out;
}

const WORST = { KIRMIZI: 3, SARI: 2, YEŞİL: 1 };
function worseLight(x, y) {
  return (WORST[x] || 0) >= (WORST[y] || 0) ? x : y;
}
export function worstLight(lights) {
  if (!lights || !lights.length) return null;
  let worst = 'YEŞİL'; // taban iyimserlik; VERİ-YOK nötr (WORST=0), kötüleştirmez
  for (const { deger } of lights) {
    if ((WORST[deger] || 0) > (WORST[worst] || 0)) worst = deger;
  }
  return worst;
}
// İki ışık dizisini ada göre birleştir; ortak adta kötümser değer (fail-safe —
// izleme aracı kırmızıyı asla maskelemez). Çelişki uyarısı yalnız iki taraf da
// ÖLÇÜLMÜŞ (VERİ-YOK değil) ve farklıysa.
export function mergeLights(a, b, warnings, bosluklar) {
  if (!a && !b) {
    if (warnings) warnings.push('ışıklar hiçbir kaynaktan okunamadı');
    if (bosluklar) bosluklar.push('isik-kaynagi-yok');
    return null;
  }
  if (!a) {
    if (warnings) warnings.push('PANO ışıkları okunamadı; SAGLIK ışıkları kullanıldı');
    if (bosluklar) bosluklar.push('tek-isik-kaynagi');
    return b;
  }
  // SİMETRİ (K13): ters yön sessizdi. Tek kaynakla çalışmak, kötümser birleştirmenin
  // (kırmızı maskelenmez) fiilen kapalı olması demektir — eksik kaynaktaki KIRMIZI görünmez.
  if (!b) {
    if (warnings) warnings.push('SAGLIK ışıkları okunamadı; PANO ışıkları kullanıldı');
    if (bosluklar) bosluklar.push('tek-isik-kaynagi');
    return a;
  }
  const bMap = new Map(b.map((x) => [x.ad, x.deger]));
  const seen = new Set();
  const out = [];
  let celiski = false;
  for (const { ad, deger } of a) {
    seen.add(ad);
    if (!bMap.has(ad)) { out.push({ ad, deger }); continue; }
    const bVal = bMap.get(ad);
    const wa = WORST[deger] || 0, wb = WORST[bVal] || 0;
    if (wa > 0 && wb > 0 && wa !== wb) celiski = true;
    out.push({ ad, deger: worseLight(deger, bVal) });
  }
  for (const { ad, deger } of b) {
    if (!seen.has(ad)) out.push({ ad, deger });
  }
  if (celiski && warnings) warnings.push('PANO ve SAGLIK ışıkları çelişiyor — kötümser değer gösterildi');
  return out;
}

export async function buildState(root, config = {}) {
  const warnings = [];
  // Okuma boşlukları: ışık hükmünün eksik okunduğu hâller (yukarıdaki OKUMA BÜTÜNLÜĞÜ notu).
  // Uyarıdan AYRI tutulur çünkü her uyarı hüküm kaybettirmez; kaybettiren burada toplanır.
  const bosluklar = [];
  const [pano, saglikTxt, ertTxt, kutuInfo, alanDosyasi] = await Promise.all([
    readIf(path.join(root, '00_pano/PANO.md')),
    readIf(path.join(root, '00_pano/SAGLIK.md')),
    readIf(path.join(root, '00_pano/ERTELENENLER.md')),
    findActiveBox(root, warnings),
    // U74 · vault kendi alan listesini taşıyor mu? Eksik alanın not düşürüp düşürmeyeceğini
    // bu ÖLÇÜLEBİLİR olgu belirler; vault'un yaşını ya da kimliğini tahmin eden bir kural
    // ölçemediği bir şeye ev kurardı (U70 dersi).
    statIf(path.join(root, 'tools/kokpit/pano-alanlari.txt')),
  ]);

  const mek = parseMekanik(pano, warnings, bosluklar, !!alanDosyasi);
  const sag = parseSaglik(saglikTxt, warnings, bosluklar);
  const fresh = await computeFreshness(root, sag, warnings);

  // PANO damgası ARTIK KULLANILIYOR: iki blok tek koşuda yazılır, denetim numaraları eşittir.
  // Ayrıştıklarında dosyalardan biri eski koşudan kalmıştır (yazım yarıda kesilmiş) — ışıklar
  // ve sayaçlar farklı koşuları anlatıyor demektir. BOŞLUK DEĞİL: kötümser birleştirme
  // yüzünden eski blok yeni bir KIRMIZI'yı maskeleyemez; yön yalnız yanlış-kırmızıdır.
  if (mek.runNo != null && sag.runNo != null && mek.runNo !== sag.runNo) {
    warnings.push('PANO ve SAGLIK ayrı denetimden: #' + mek.runNo + ' / #' + sag.runNo + ' — biri eski');
  }

  // Işıklar: PANO + SAGLIK birleşimi; çelişki varsa kötümser (fail-safe)
  const lights = mergeLights(mek.lights, sag.lights, warnings, bosluklar);
  // İzleme aracında BİLİNMEYEN ≠ VERİSİZ: sözlük-dışı bir ışık değeri (bekçi tipo/kodlama
  // hatası ya da ASCII YESIL) sessizce "ölçülmemiş" sayılıp gri görünür — hasım turu bulgusu
  // (2026-07-16). En azından uyarı yüzeyine çıkar ki fark edilsin.
  if (lights) for (const l of lights) {
    if (l.deger !== 'VERİ-YOK' && !(l.deger in WORST)) {
      warnings.push('tanınmayan ışık seviyesi: ' + l.ad + '=' + l.deger + ' (ölçülmemiş sayıldı — YEŞİL/SARI/KIRMIZI/VERİ-YOK bekleniyor)');
      // Boşluktur: skorlanmayan değer nötr sayılır, yani o ışıktaki KIRMIZI genele hiç
      // yansımaz (sözleşmenin kendi uyarısı: ASCII `YESIL` sistemi yanlışlıkla yeşil gösterir).
      bosluklar.push('taninmayan-isik-seviyesi');
    }
  }

  // Görevler: KUTU'dan iş+sahip, PANO mekanikten kanonik durum
  const gates = kutuInfo ? parseGates(kutuInfo.text, warnings) : [];
  for (const g of gates) {
    if (mek.tasks[g.id]) g.durumKanon = mek.tasks[g.id];
    else g.durumKanon = g.durum;
  }

  // Roller
  const roller = await readRoles(root, warnings);

  // Kutular (aktif + arşiv)
  const kutular = await listBoxes(root);

  // Sayaç ↔ kalem: aynı koşunun İKİ görünümü. Eskiden hiç karşılaştırılmıyordu; PANO
  // "Kırmızı: 0" derken SAGLIK'ta KIRMIZI kalem durabiliyordu ve ekran yeşil kalıyordu
  // (K13 bozma 1). Bu sentetik değil: ürünün kendi yazarında `arıza` satırları SAGLIK'a
  // KIRMIZI kalem olarak düşer, sayaca girmez ve hiçbir ışığı kırmızıya çevirmez.
  const kirmiziKalem = sag.items.filter((i) => i.level === 'KIRMIZI').length;
  const sariKalem = sag.items.filter((i) => i.level === 'SARI').length;
  if (mek.red != null && mek.red !== kirmiziKalem) {
    warnings.push('PANO kırmızı sayacı ile SAGLIK kırmızı kalem sayısı uyuşmuyor: ' + mek.red + ' / ' + kirmiziKalem);
    bosluklar.push('sayac-kalem-celiskisi');
  }
  if (mek.yellow != null && mek.yellow !== sariKalem) {
    warnings.push('PANO sarı sayacı ile SAGLIK sarı kalem sayısı uyuşmuyor: ' + mek.yellow + ' / ' + sariKalem);
    bosluklar.push('sayac-kalem-celiskisi');
  }

  const stale = fresh.stale;
  const worst = worstLight(lights);
  // Hiç ÖLÇÜLMÜŞ değer yokken (hepsi VERİ-YOK/serbest) taban-iyimserlik YEŞİL göstermesin —
  // dürüst gri (soğuk-denetim B1). Tek ölçülmüş değer varsa davranış eskisiyle aynı.
  const olculmus = !!(lights && lights.some((l) => (WORST[l.deger] || 0) > 0));
  // Genel hüküm dört kattan geçer; her katın yönü fail-safe:
  //  1) damga bayat → KIRMIZI (sahibin tek ezberi; eskiden beri)
  //  2) LİSTELENEN kırmızı kalem → KIRMIZI. Ekranda kırmızı kalem dururken rozetin yeşil
  //     basması, kokpitin kendi gövdesiyle çelişmesiydi (K13 bozma 1'in asıl zararı).
  //  3) hiç ölçülmüş ışık yok → VERİ-YOK grisi (soğuk-denetim B1)
  //  4) okuma boşluğu → YEŞİL'i SARI'ya düşürür. YALNIZ yeşili: VERİ-YOK zaten "bilmiyorum",
  //     KIRMIZI zaten en kötü; ikisini oynatmak bilgi kazandırmaz, gürültü üretir.
  let sistemGenel;
  if (stale) sistemGenel = 'KIRMIZI';
  else if (kirmiziKalem > 0) sistemGenel = 'KIRMIZI';
  else if (!olculmus) sistemGenel = 'VERI-YOK';
  else sistemGenel = sariKalem > 0 ? worseLight(worst, 'SARI') : worst;
  const okumaBoslugu = bosluklar.length > 0;
  if (okumaBoslugu && sistemGenel === 'YEŞİL') sistemGenel = 'SARI';

  // SIRADAKİ bayatlığı (#6): sevk edilen rol koordinatörden yeni hareket ettiyse bayat.
  const koordinatorRol = config.koordinatorRol || 'koordinator';
  const siradakiRolAd = siradakiRol(yargiField(pano, 'SIRADAKİ OTURUM'));
  const siradakiDurum = computeSiradakiStale(roller, siradakiRolAd, koordinatorRol, warnings);

  return {
    generatedAt: new Date().toISOString(),
    vaultRoot: root,
    saglik: {
      lastRun: sag.lastRun || mek.lastRun,
      runNo: sag.runNo != null ? sag.runNo : mek.runNo,
      lights,
      red: mek.red,
      yellow: mek.yellow,
      items: sag.items,
      stale: fresh.stale,
      staleReason: fresh.staleReason,
      driftAfterRun: fresh.driftAfterRun,
      driftFiles: fresh.driftFiles.slice(0, 12),
      driftCount: fresh.driftFiles.length,
      okumaBoslugu,
      bosluklar: [...new Set(bosluklar)],
      sistemGenel,
    },
    yargi: {
      aktifKutu: yargiField(pano, 'Aktif kutu'),
      siradakiOturum: yargiField(pano, 'SIRADAKİ OTURUM'),
      siradakiRol: siradakiRolAd,
      // ÜÇ DEĞERLİ (U57): true bayat · false taze · null ÖLÇÜLEMEDİ. `null`u "taze" saymak
      // kapatılan kusuru geri açar; ekran onu ayrı bir hâl olarak gösterir.
      siradakiStale: siradakiDurum.stale,
      siradakiRolYok: siradakiDurum.rolYok,
      sonHareketRol: siradakiDurum.sonHareketRol,
      // U17: "sıra sende DEĞİL" hâlinin makine-okur değeri. Yokken kokpit sahibe her hâlde
      // "sıra sende, oturumu sen açacaksın" diyordu — sistem kendi başına çalışırken bu
      // cümle yanlıştı ve sahibi koşunun üstüne davet ediyordu.
      siraKimde: mek.sira,
      // U74: ikisi de bekçinin yazdığı ama HİÇ okunmayan alanlardı — silindiklerinde kokpit
      // tek not bile basmıyordu. Artık okunur ve sahibin ekranına çıkar.
      sahipteBekleyen: mek.sahipteBekleyen,
      durak: mek.durak,
      paralel: yargiField(pano, 'Paralel açılabilir'),
      blokaj: yargiField(pano, 'Blokaj'),
    },
    kutu: kutuInfo
      ? { id: kutuInfo.id, title: kutuInfo.title, path: kutuInfo.path, fazA: kutuInfo.fazA, gates }
      : null,
    roller,
    ertelenenler: parseErtelenenler(ertTxt, warnings),
    kutular,
    config: {
      baslik: config.baslik || null,
      sahip: config.sahip || null,
      koordinatorRol,
      // true = /rol-<slug> töreni metni (KEEL); yok/false = klasörde-aç metni (eski kurgular — geri-uyum).
      // Boolean true VE string "true" kabul: elle düzenlenen config'te tırnaklı yazım sessizce
      // töreni kapatmasın (hasım turu bulgusu 2026-07-16); "false"/0/boş yine kapalı.
      rolToreni: config.rolToreni === true || config.rolToreni === 'true',
      isikIpuclari: config.isikIpuclari || null,
      renkler: config.renkler || null,
    },
    // BİREBİR tekrar düşürülür: sağlıklı vault'ta ışık satırı iki dosyada AYNIdır, yani tek
    // bir yazım hatası iki özdeş not üretir. Tekrar bilgi taşımaz, sahibin okuma notunu
    // uzatır. Tekilleştirme SADECE aynı dizeye uygulanır — değer taşıyan notlar (sayılar,
    // ışık adları) zaten ayrışır ve hiçbiri yutulmaz.
    warnings: [...new Set(warnings)],
  };
}

function siradakiRol(s) {
  if (!s) return null;
  // Slug HARFLE başlar, içinde rakam olabilir (ör. "po2" okunur — soğuk-denetim A3).
  // İlk-karakter-harf şartı, "SIRADAKİ OTURUM: 3 gün sonra…" gibi bozuk satırın "3"ü rol
  // sanmasını önler (hasım turu bulgusu 2026-07-16); rakamla başlayan slug konvansiyonu yok.
  const m = s.match(/^([A-Za-zÇĞİÖŞÜçğıöşü][A-Za-z0-9ÇĞİÖŞÜçğıöşü]*)/);
  return m ? m[1] : null;
}

// SIRADAKİ rolü koordinatörden DAHA YENİ hareket ettiyse sevk tüketilmiş = bayat.
// Sinyal: DURUM.md dosya mtime (gün-granülü metin damgasından ince). koordinatorRol config'ten.
//
// U57 · ÖLÇEMEDİĞİM ≠ SAĞLAM. Eski hâlde üç ayrı ölçülemezlik tek satırda "bayat değil"e
// düşüyordu ve `warnings` bu fonksiyona HİÇ geçmediği için okuma notu basmak da mümkün
// değildi: sahibe hiçbir şey söylenmiyordu. Üçü de gerçek hâllerdir —
//   ① panoda yazan rol ekipte YOK: kokpit sahibe var olmayan bir rolün oturumunu açtırıyordu
//   ② koordinatör rolü ekipte yok: sevkin kimden geleceği bilinmiyor
//   ③ iki taraftan birinin durum dosyası okunamıyor: karşılaştırılacak sinyal yok
// Dönüş artık ÜÇ değerlidir: true (bayat) · false (taze) · null (ölçülemedi). `null`u
// "taze" diye okuyan bir tüketici, kapatılan kusuru geri açar.
function computeSiradakiStale(roller, siradakiRolAd, koordinatorRol, warnings) {
  const not = (metin) => { if (warnings) warnings.push(metin); };
  // Pano SIRADAKİ satırı yazmamış ya da sıra koordinatörün kendisinde: ölçülecek sevk yok.
  // Bu ölçülemezlik DEĞİL, ölçülecek şeyin olmamasıdır — not basmak gürültü olurdu.
  if (!siradakiRolAd || siradakiRolAd === koordinatorRol) return { stale: false, sonHareketRol: null, rolYok: false };
  const sr = roller.find((r) => r.slug === siradakiRolAd);
  if (!sr) {
    not('panoda sıradaki olarak yazan "' + siradakiRolAd + '" ekipte yok — o rolün klasörü bulunamadı');
    return { stale: null, sonHareketRol: null, rolYok: true };
  }
  const ko = roller.find((r) => r.slug === koordinatorRol);
  if (!ko) {
    not('sevki veren rol ("' + koordinatorRol + '") ekipte yok — sıradaki adımın bayatlığı ölçülemedi');
    return { stale: null, sonHareketRol: null, rolYok: false };
  }
  if (sr.mtimeMs == null || ko.mtimeMs == null) {
    not('rollerin durum dosyası okunamadı — sıradaki adımın bayatlığı ölçülemedi');
    return { stale: null, sonHareketRol: null, rolYok: false };
  }
  if (sr.mtimeMs > ko.mtimeMs) return { stale: true, sonHareketRol: siradakiRolAd, rolYok: false };
  return { stale: false, sonHareketRol: null, rolYok: false };
}

async function findActiveBox(root, warnings) {
  const kutularDir = path.join(root, '01_kutular');
  let entries;
  try {
    entries = await fs.readdir(kutularDir, { withFileTypes: true });
  } catch {
    warnings.push('işlerin klasörü okunamadı (01_kutular)');
    return null;
  }
  // Tek-aktif-kutu varsayımı: birden fazla açık kutu görürsek deterministik (ada göre sıralı)
  // İLKİNİ gösterir ve uyarı basarız — sessiz dosya-sistemi-sırası seçimi yok (soğuk-denetim B5).
  const adaylar = entries
    .filter((e) => e.isDirectory() && /^KT-\d+/.test(e.name))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })); // KT-2 < KT-10 (sayısal — hasım turu 2026-07-16)
  if (adaylar.length > 1) {
    warnings.push(
      'birden fazla açık iş var (' + adaylar.map((e) => e.name.match(/^(KT-\d+)/)[1]).join(', ') +
      ') — normalde tek iş açık olur; ayrıntı paneli ada göre ilkini gösteriyor'
    );
  }
  const active = adaylar[0];
  if (!active) return null;
  const rel = '01_kutular/' + active.name + '/KUTU.md';
  const text = await readIf(path.join(root, rel));
  const idMatch = active.name.match(/^(KT-\d+)/);
  let title = active.name;
  let fazA = null;
  if (text) {
    const h1 = text.match(/^#\s+(.+)$/m);
    if (h1) title = h1[1].trim();
    const fh = text.match(/^###\s+Faz A[^\n]*/m);
    if (fh) {
      const paren = fh[0].match(/\(([^)]*)\)/);
      fazA = { sevkte: /SEVKTE/i.test(fh[0]), not: paren ? paren[1].trim() : null };
    }
  }
  return { id: idMatch ? idMatch[1] : active.name, name: active.name, title, path: rel, fazA, text };
}

async function listBoxes(root) {
  const boxes = [];
  const kutularDir = path.join(root, '01_kutular');
  try {
    const entries = await fs.readdir(kutularDir, { withFileTypes: true });
    for (const e of entries) {
      if (e.isDirectory() && /^KT-\d+/.test(e.name)) {
        boxes.push({ id: e.name.match(/^(KT-\d+)/)[1], name: e.name, aktif: true, path: '01_kutular/' + e.name + '/KUTU.md' });
      }
    }
    const arsivDir = path.join(kutularDir, '_arsiv');
    const arsiv = await fs.readdir(arsivDir, { withFileTypes: true }).catch(() => []);
    for (const e of arsiv) {
      if (e.isDirectory() && /^KT-\d+/.test(e.name)) {
        boxes.push({ id: e.name.match(/^(KT-\d+)/)[1], name: e.name, aktif: false, path: '01_kutular/_arsiv/' + e.name + '/KUTU.md' });
      }
    }
  } catch {}
  boxes.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true })); // KT-2 < KT-10
  return boxes;
}

async function readRoles(root, warnings) {
  const rollerDir = path.join(root, '03_roller');
  let entries;
  try {
    entries = await fs.readdir(rollerDir, { withFileTypes: true });
  } catch {
    warnings.push('ekibin klasörü okunamadı (03_roller)');
    return [];
  }
  const roles = [];
  for (const e of entries) {
    if (!e.isDirectory() || e.name.startsWith('.')) continue;
    const durumAbs = path.join(rollerDir, e.name, 'DURUM.md');
    const text = await readIf(durumAbs);
    const st = await statIf(durumAbs);
    const role = parseDurum(e.name, text);
    role.mtimeMs = st ? st.mtime.getTime() : null;
    roles.push(role);
  }
  roles.sort((a, b) => a.slug.localeCompare(b.slug, 'tr'));
  return roles;
}
