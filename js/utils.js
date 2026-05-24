/**
 * utils.js — Утилиты форматирования
 * ====================================
 * Чистые функции для преобразования чисел в читаемые строки.
 *
 * Функции:
 *   fmtPrice(n) — цена в USD
 *   fmtCap(n)   — капитализация с суффиксом T/B/M
 *   fmtPct(n)   — процент со знаком
 *   fmtDate(ts) — дата из временной метки
 */

'use strict';

/**
 * Форматирует цену в USD.
 *
 * Примеры:
 *   fmtPrice(67234.5)  → '$67,234.50'
 *   fmtPrice(0.00042)  → '$0.000420'
 *
 * @param {number|null} n
 * @returns {string}
 */
function fmtPrice(n) {
  if (n == null) return '—';
  if (n >= 1) {
    return '$' + n.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  // Для дробных значений — 4 значимые цифры
  return '$' + n.toPrecision(4);
}

/**
 * Форматирует рыночную капитализацию с суффиксом масштаба.
 *
 * Примеры:
 *   fmtCap(1320000000000) → '$1.32T'
 *   fmtCap(456780000000)  → '$456.78B'
 *   fmtCap(78900000)      → '$78.90M'
 *
 * @param {number|null} n
 * @returns {string}
 */
function fmtCap(n) {
  if (n == null) return '—';
  if (n >= 1e12) return '$' + (n / 1e12).toFixed(2) + 'T';
  if (n >= 1e9)  return '$' + (n / 1e9).toFixed(2)  + 'B';
  if (n >= 1e6)  return '$' + (n / 1e6).toFixed(2)  + 'M';
  return fmtPrice(n);
}

/**
 * Форматирует процентное изменение со знаком.
 *
 * Примеры:
 *   fmtPct(2.345)  → '+2.35%'
 *   fmtPct(-1.2)   → '-1.20%'
 *
 * @param {number|null} n
 * @returns {string}
 */
function fmtPct(n) {
  if (n == null) return '—';
  return (n >= 0 ? '+' : '') + n.toFixed(2) + '%';
}

/**
 * Форматирует временную метку (Unix ms) в короткую дату.
 *
 * Пример: fmtDate(1705276800000) → '15 янв.'
 *
 * @param {number} ts
 * @returns {string}
 */
function fmtDate(ts) {
  return new Date(ts).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'short',
  });
}
