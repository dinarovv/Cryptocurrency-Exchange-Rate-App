/**
 * config.js — Конфигурация и API-запросы
 * ========================================
 * Этот файл содержит:
 *   - Константы приложения (URL, лимиты, ключи хранилища)
 *   - Настройки поддерживаемых валют
 *   - Функции для запросов к CoinGecko API
 *
 * Используемый API: CoinGecko v3 (бесплатно, без ключа)
 * Документация: https://www.coingecko.com/en/api/documentation
 */

'use strict';

// ──────────────────────────────────────────────────────────────────
//  Константы
// ──────────────────────────────────────────────────────────────────

/** Базовый URL CoinGecko API (версия 3) */
const API_BASE = 'https://api.coingecko.com/api/v3';

/**
 * Монет на один запрос.
 * CoinGecko разрешает максимум 250 на странице.
 * Увеличение этого числа позволяет загружать больше монет за раз.
 */
const PER_PAGE = 250;

/** Ключ для сохранения избранных монет в localStorage */
const LS_FAVORITES = 'ct_favorites';

// ──────────────────────────────────────────────────────────────────
//  Поддерживаемые валюты
// ──────────────────────────────────────────────────────────────────

/**
 * Объект настроек для каждой валюты.
 * Ключ совпадает со значением параметра vs_currency в API.
 *
 * Поля:
 *   symbol  — знак валюты для отображения цен
 *   label   — короткое название (показывается на кнопке)
 *   flag    — флаг-эмодзи для переключателя
 *   after   — true если символ ставится ПОСЛЕ числа (1 000 ₽)
 */
const CURRENCIES = {
  usd: { symbol: '$', label: 'USD', flag: '🇺🇸', after: false },
  eur: { symbol: '€', label: 'EUR', flag: '🇪🇺', after: false },
  rub: { symbol: '₽', label: 'RUB', flag: '🇷🇺', after: true  },
};

// ──────────────────────────────────────────────────────────────────
//  API-запросы
// ──────────────────────────────────────────────────────────────────

/**
 * Загружает список монет с рыночными данными.
 *
 * Эндпоинт: GET /coins/markets
 * Возвращает массив объектов, каждый из которых содержит:
 *   id                          — уникальный идентификатор (например, "bitcoin")
 *   name                        — полное название ("Bitcoin")
 *   symbol                      — тикер ("btc")
 *   image                       — URL логотипа
 *   current_price               — текущая цена в выбранной валюте
 *   price_change_percentage_24h — изменение цены за 24 часа (в %)
 *   market_cap                  — рыночная капитализация
 *
 * @param {string} currency — валюта котировок: 'usd' | 'eur' | 'rub'
 * @param {number} page     — номер страницы пагинации (с 1)
 * @returns {Promise<Array>}
 * @throws {Error} если сервер вернул ошибку
 */
async function fetchCoins(currency, page) {
  const url =
    `${API_BASE}/coins/markets` +
    `?vs_currency=${currency}` +       // в какой валюте показывать цены
    `&order=market_cap_desc` +          // сортировка по убыванию капитализации
    `&per_page=${PER_PAGE}` +           // монет на страницу
    `&page=${page}` +                   // номер страницы
    `&sparkline=false` +                // не запрашиваем мини-график (экономим трафик)
    `&price_change_percentage=24h`;     // запрашиваем изменение за 24ч

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Загружает историю цен монеты для построения графика.
 *
 * Эндпоинт: GET /coins/{id}/market_chart
 * Возвращает объект с полем prices — массив точек [[timestamp, price], ...]
 * Количество точек зависит от периода:
 *   7 дней  → ~168 точек (каждые ~час)
 *   30 дней → ~720 точек
 *   90 дней → ~90 точек  (каждый день)
 *
 * @param {string} coinId   — идентификатор монеты (например, 'bitcoin')
 * @param {string} currency — валюта: 'usd' | 'eur' | 'rub'
 * @param {number} days     — период в днях: 7, 30 или 90
 * @returns {Promise<{prices: Array}>}
 * @throws {Error} если сервер вернул ошибку
 */
async function fetchChart(coinId, currency, days) {
  const url =
    `${API_BASE}/coins/${coinId}/market_chart` +
    `?vs_currency=${currency}` +
    `&days=${days}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
  }

  return response.json();
}
