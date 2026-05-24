/**
 * utils.js — Утилиты форматирования
 * ====================================
 * Чистые функции для преобразования чисел в читаемые строки.
 * «Чистая функция» — не имеет побочных эффектов, всегда возвращает
 * одно и то же при одинаковых аргументах.
 *
 * Функции:
 *   fmtPrice(n, currency) — цена с символом валюты
 *   fmtCap(n, currency)   — рыночная капитализация с суффиксом T/B/M
 *   fmtPct(n)             — процент со знаком (+/-)
 *   fmtDate(ts)           — временная метка в короткую дату
 */

'use strict';

/**
 * Форматирует цену с символом валюты.
 *
 * Логика:
 *   • n >= 1   → два знака после запятой, разделитель тысяч
 *   • n < 1    → 4 значимые цифры (для очень дешёвых монет типа Shiba Inu)
 *   • Рубль    → символ ставится после числа, используется русская локаль
 *
 * Примеры:
 *   fmtPrice(67234.5, 'usd') → '$67,234.50'
 *   fmtPrice(62100,   'eur') → '€62,100.00'
 *   fmtPrice(5980000, 'rub') → '5 980 000,00 ₽'
 *   fmtPrice(0.00042, 'usd') → '$0.000420'
 *
 * @param {number|null} n        — числовое значение цены
 * @param {string}      currency — ключ из объекта CURRENCIES ('usd'|'eur'|'rub')
 * @returns {string}
 */
function fmtPrice(n, currency = 'usd') {
  if (n == null) return '—';

  const { symbol, after } = CURRENCIES[currency];
  const locale = currency === 'rub' ? 'ru-RU' : 'en-US';

  let numStr;

  if (n >= 1) {
    // Стандартный формат с двумя знаками после запятой
    numStr = n.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } else {
    // Для дробных значений — 4 значимые цифры
    numStr = n.toPrecision(4);
  }

  // Символ до или после числа зависит от валюты
  return after ? `${numStr} ${symbol}` : `${symbol}${numStr}`;
}

/**
 * Форматирует рыночную капитализацию с суффиксом масштаба.
 *
 * Суффиксы: T (трлн), B (млрд), M (млн)
 *
 * Примеры:
 *   fmtCap(1320000000000, 'usd') → '$1.32T'
 *   fmtCap(456780000000, 'eur')  → '€456.78B'
 *   fmtCap(78900000, 'rub')      → '78.90M ₽'
 *
 * @param {number|null} n        — рыночная капитализация
 * @param {string}      currency — ключ из объекта CURRENCIES
 * @returns {string}
 */
function fmtCap(n, currency = 'usd') {
  if (n == null) return '—';

  const { symbol, after } = CURRENCIES[currency];

  // Вспомогательная функция: оборачивает число с суффиксом в символ валюты
  function wrap(num, suffix) {
    const str = num.toFixed(2) + suffix;
    return after ? `${str} ${symbol}` : `${symbol}${str}`;
  }

  if (n >= 1e12) return wrap(n / 1e12, 'T');  // триллионы
  if (n >= 1e9)  return wrap(n / 1e9,  'B');  // миллиарды
  if (n >= 1e6)  return wrap(n / 1e6,  'M');  // миллионы

  // Маленькие значения форматируем как обычную цену
  return fmtPrice(n, currency);
}

/**
 * Форматирует процентное изменение со знаком + или -.
 *
 * Примеры:
 *   fmtPct(2.345)  → '+2.35%'
 *   fmtPct(-1.2)   → '-1.20%'
 *   fmtPct(null)   → '—'
 *
 * @param {number|null} n — процентное изменение
 * @returns {string}
 */
function fmtPct(n) {
  if (n == null) return '—';
  return (n >= 0 ? '+' : '') + n.toFixed(2) + '%';
}

/**
 * Форматирует временную метку (Unix milliseconds) в короткую дату.
 *
 * Примеры:
 *   fmtDate(1705276800000) → '15 янв.'
 *   fmtDate(1706400000000) → '28 янв.'
 *
 * @param {number} ts — временная метка в миллисекундах
 * @returns {string}
 */
function fmtDate(ts) {
  return new Date(ts).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'short',
  });
}
