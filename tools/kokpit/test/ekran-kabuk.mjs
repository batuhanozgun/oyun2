// ekran-kabuk — app.js'i sanal kabukta (node:vm) gerçek haliyle koşturan sahte DOM.
//
// NEDEN TEK EV: kabuk BEŞ test dosyasının ortak aletidir (sahip-ekrani · okuma-butunlugu ·
// siradaki · pano-alanlari · ad-tekligi). İkinci kopyayı yazmak, bu deponun en pahalı dersini
// tekrarlamak olurdu — `tools/sevk/ortak.sh` başlığında yazılı: aynı blok beş betiğe
// kopyalanmıştı ve sürüklendi (D-02 dersi).
// Kabuk app.js'in DOKUNDUĞU her şeyi sağlar, fazlasını değil; eklemek gerekirse burada eklenir.
//
// `donustur` (K9): kaynağı vm'e girmeden ÖNCE değiştirir — bir kapının KENDİ BOZMASINI
// yazabilmesi için. Kapı "app.js kendine pano demiyor" diyorsa, bunun kanıtı app.js'e o adı
// geri koyup KIRMIZI görmektir. Argümansız çağrı dokunulmamış kaynağı koşturur, yani dört eski
// çağıranın davranışı değişmez.
//
// KULLANIM SINIRI — BAĞLAYICI: bu kol yalnız BOZMA yazmak içindir; bir kapının ÖLÇTÜĞÜ hâli
// üretmek için kullanılamaz. Sebebi mekanik: `sandbox(k => k.replace(...))` yazan bir kapı,
// denetlediği kaynağı ölçümün dışına çıkarır ve en ucuz yeşili satın alır. Kural: `donustur`
// geçen her çağrının beklentisi KIRMIZI olmak zorundadır (bugün tek çağıran ad-tekligi, iki
// bozma testinde ve ikisinde de beklenti "bozma yakalandı").
import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

export function sandbox(donustur) {
  const ekran = {};
  const el = (id) => (ekran[id] ||= { id, innerHTML: '', textContent: '', className: '', hidden: false });
  const ctx = {
    document: {
      getElementById: el,
      querySelector: () => el('wm-sub'),
      querySelectorAll: () => [],
      addEventListener: () => {},
      set title(v) { el('__title').textContent = v; },
      get title() { return el('__title').textContent; },
    },
    // fetch: app.js yüklenirken kendiliğinden çağrılır. Hiç çözülmeyen bir söz veriyoruz ki
    // testin çizdiği ekranı ağdan gelen bir cevap EZMESİN (belirlenimsizlik yok).
    fetch: () => new Promise(() => {}),
    requestAnimationFrame: () => {},
    setInterval: () => 0,
    console,
    Promise, Date, String, Number, Object, Array, JSON, RegExp, Math,
  };
  createContext(ctx);
  const kaynak = readFileSync(path.join(KOK, 'public', 'app.js'), 'utf8');
  runInContext(donustur ? donustur(kaynak) : kaynak, ctx, { filename: 'app.js' });
  return { ctx, ekran };
}
