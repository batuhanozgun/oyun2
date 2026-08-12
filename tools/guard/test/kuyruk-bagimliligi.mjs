// kuyruk-bagimliligi — kurulu bir projede HER ZAMAN bulunan, ürünün FAIL-CLOSED aradığı ortak
// dosyaları simülasyon köküne taşır. Test yardımcısıdır, ürünün parçası değildir.
// İki küme: kuyruğa yazan kolların bağımlılıkları (U60) ve KUTU risk satırının tanımı (U75).
//
// NEDEN VAR (U60). Kuyruğa yazan her kol yazımdan önce içerik süzgecinden geçer ve süzgeç
// bulunamazsa satır YAZILMAZ. Kurulu bir projede bu dosyalar her zaman vardır; simülasyon kökü
// de taşımak zorundadır — yoksa test, ürünün gerçekte koşmayacağı bir hâli ölçer.
// Emsali: cevap-sozlugu.txt · gorev-durumlari.txt · zarf-jetonlari.txt (aynı gerekçeyle taşınır).
//
// İki sınıf ayrıdır: KOD betiğin yanından çözülür (kuyruk-ortak.mjs → icerik-suzgeci.sh),
// VERİ projenin kökünden gelir (yazim-kalibi.txt · gercek-veri-isaretleri.txt). İkisi de
// gerekir: kod yoksa süzgeç koşmaz, veri yoksa süzgeç kendi fail-closed'una düşer.

import { mkdirSync, copyFileSync, chmodSync } from 'node:fs';
import { join } from 'node:path';

/**
 * @param {string} kok      simülasyon kökü
 * @param {string} kokRepo  gerçek depo kökü (kaynak)
 */
export function kuyrukBagimliliklariKur(kok, kokRepo) {
  mkdirSync(join(kok, 'tools', 'sevk'), { recursive: true });
  mkdirSync(join(kok, 'tools', 'guard'), { recursive: true });
  // KOD
  copyFileSync(join(kokRepo, 'tools', 'sevk', 'kuyruk-ortak.mjs'),
               join(kok, 'tools', 'sevk', 'kuyruk-ortak.mjs'));
  copyFileSync(join(kokRepo, 'tools', 'guard', 'icerik-suzgeci.sh'),
               join(kok, 'tools', 'guard', 'icerik-suzgeci.sh'));
  chmodSync(join(kok, 'tools', 'guard', 'icerik-suzgeci.sh'), 0o755);
  // VERİ
  copyFileSync(join(kokRepo, 'tools', 'guard', 'yazim-kalibi.txt'),
               join(kok, 'tools', 'guard', 'yazim-kalibi.txt'));
  copyFileSync(join(kokRepo, 'tools', 'guard', 'gercek-veri-isaretleri.txt'),
               join(kok, 'tools', 'guard', 'gercek-veri-isaretleri.txt'));
  copyFileSync(join(kokRepo, 'tools', 'guard', 'sinif-listesi.txt'),
               join(kok, 'tools', 'guard', 'sinif-listesi.txt'));
  riskBagimliligiKur(kok, kokRepo);
}

/**
 * KUTU risk satırının biçim tanımı + ortak okuyucusu (U75). Beş tüketici de FAIL-CLOSED arar:
 * biçimi ölçemeyen tüketici "biçimli" diyemez. Ayrı işlev, çünkü kuyrukla ilgisi olmayan
 * kökler de (sevk · kurulum kapısı · bekçi) bunu taşımak zorunda.
 */
export function riskBagimliligiKur(kok, kokRepo) {
  mkdirSync(join(kok, 'tools', 'guard'), { recursive: true });
  for (const ad of ['risk-satiri.txt', 'risk-satiri.mjs']) {
    copyFileSync(join(kokRepo, 'tools', 'guard', ad), join(kok, 'tools', 'guard', ad));
  }
}
