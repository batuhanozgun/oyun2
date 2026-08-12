// risk-satiri — KUTU.md "## Bağımlılık ve risk" satırının JS tarafındaki ORTAK okuyucusu.
// Tanım burada DEĞİL, veri dosyasındadır: tools/guard/risk-satiri.txt (U75). Bu dosya yalnız
// o tanımı okur ve derler; dört JS tüketicisi (zarf-bicim-kapisi · sevk · kurulum-kapisi ·
// bekci/cekirdek) buradan geçer. Beşinci tüketici bash'tir ve aynı dosyanın ERE anahtarını
// okur; iki lehçenin aynı hükmü verdiğini test ölçer.
// FAIL-CLOSED: dosya yoksa ya da anahtar eksikse HATA fırlatır — biçimi ölçemeyen tüketici
// "biçimli" diyemez.

import { readFileSync } from "node:fs";

const ONBELLEK = new Map();

/** @returns {RegExp} KUTU risk satırının deseni. Yakalar: 1=görev 2=önkoşul 3=risk 4=gerekçe */
export function riskDeseni(kok) {
  const yol = String(kok).replace(/\/+$/, "") + "/tools/guard/risk-satiri.txt";
  if (ONBELLEK.has(yol)) return ONBELLEK.get(yol);
  let ham;
  try { ham = readFileSync(yol, "utf8"); }
  catch { throw new Error("risk satiri tanimi okunamadi: " + yol + " (fail-closed)"); }
  let desen = null;
  for (const satirHam of ham.split("\n")) {
    const satir = satirHam.replace(/\r$/, "");
    if (!satir.trim() || satir.trimStart().startsWith("#")) continue;
    if (satir.startsWith("RISK_SATIRI_JS=")) desen = satir.slice("RISK_SATIRI_JS=".length);
  }
  if (!desen) throw new Error("risk-satiri.txt eksik anahtar: RISK_SATIRI_JS (fail-closed)");
  const re = new RegExp(desen);
  ONBELLEK.set(yol, re);
  return re;
}

/**
 * Tek satırı çözer. Gerekçe İSTEĞE BAĞLI okunur — zorunluluğu tüketicinin politikasıdır
 * (kurulum kapısı ve bekçi arar; sevk ile uygulayıcı aramaz).
 * @returns {{gorev:string, onkosul:string, risk:string, gerekce:string}|null}
 */
export function riskCoz(kok, satir) {
  const m = String(satir).match(riskDeseni(kok));
  if (!m) return null;
  return { gorev: m[1], onkosul: m[2], risk: m[3], gerekce: (m[4] || "").trim() };
}
