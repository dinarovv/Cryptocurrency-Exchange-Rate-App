/**
 * config.js — Конфигурация и API-запросы
 * ========================================
 * Содержит:
 *   - Константы (базовый URL, лимит монет)
 *   - Функции запросов к CoinGecko API
 *
 * API: CoinGecko v3 (бесплатно, без ключа)
 * Документация: https://www.coingecko.com/en/api/documentation
 */

'use strict';

/** Базовый URL CoinGecko API */
const API_BASE = 'https://api.coingecko.com/api/v3';

/** Количество монет для загрузки */
const PER_PAGE = 100;

/**
 * Загружает топ-100 монет по рыночной капитализации.
 *
 * Каждый объект в ответе содержит:
 *   id                          — уникальный идентификатор ('bitcoin')
 *   name                        — полное название ('Bitcoin')
 *   symbol                      — тикер ('btc')
 *   image                       — URL логотипа
 *   current_price               — текущая цена в USD
 *   price_change_percentage_24h — изменение за 24 часа (%)
 *   market_cap                  — рыночная капитализация
 *
 * @returns {Promise<Array>}
 */
async function fetchCoins() {
  const url =
    `${API_BASE}/coins/markets` +
    `?vs_currency=usd` +
    `&order=market_cap_desc` +
    `&per_page=${PER_PAGE}` +
    `&page=1` +
    `&sparkline=false` +
    `&price_change_percentage=24h`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
  return response.json();
}

/**
 * Загружает историю цен монеты для графика.
 *
 * Возвращает объект { prices: [[timestamp, price], ...] }
 *
 * @param {string} coinId — идентификатор ('bitcoin')
 * @param {number} days   — период: 7, 30 или 90 дней
 * @returns {Promise<Object>}
 */
async function fetchChart(coinId, days) {
  const url =
    `${API_BASE}/coins/${coinId}/market_chart` +
    `?vs_currency=usd` +
    `&days=${days}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
  return response.json();
}
