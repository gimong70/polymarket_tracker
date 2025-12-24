const BASE_URL = import.meta.env.PROD
    ? 'https://gamma-api.polymarket.com'
    : '/gamma';

/**
 * Fetches markets based on category
 * @param {string} category - 'all', 'trending', 'politics', 'crypto', 'finance', 'tech', 'world', 'economy', 'trump'
 */
export const fetchPolymarketData = async (category) => {
    const tagMap = {
        'politics': 'politics',
        'crypto': 'crypto',
        'finance': 'finance',
        'tech': 'tech',
        'world': 'world-affairs',
        'economy': 'economy',
        'trump': 'trump'
    };

    if (category === 'all') {
        const categoriesToFetch = ['trending', ...Object.keys(tagMap)];
        try {
            const allResults = await Promise.all(
                categoriesToFetch.map(cat => fetchPolymarketData(cat))
            );

            const flatResults = allResults.flat();
            const uniqueMap = new Map();
            flatResults.forEach(event => {
                if (event && event.id) uniqueMap.set(event.id, event);
            });
            return Array.from(uniqueMap.values());
        } catch (error) {
            console.error('Error fetching all categories:', error);
            return [];
        }
    }

    let url = `${BASE_URL}/events/pagination?active=true&closed=false&limit=100`;

    if (category === 'trending') {
        url += '&order=volume&ascending=false';
    } else if (tagMap[category]) {
        url += `&tag_slug=${tagMap[category]}`;
    }

    try {
        const fetchUrl = import.meta.env.PROD
            ? `https://corsproxy.io/?${encodeURIComponent(url)}`
            : url;

        const response = await fetch(fetchUrl);
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};

/**
 * Filters markets based on timeframe and threshold range
 * @param {Array} events - The nested events from Gamma API
 * @param {string} timeframe - '1h', '3h', '6h', '12h', '24h', '7d'
 * @param {string} range - '10-30', '30-50', '50+'
 */
export const filterMarkets = (events, timeframe, range) => {
    const changeFieldMap = {
        '1h': 'oneHourPriceChange',
        '3h': 'oneDayPriceChange', // Approximation
        '6h': 'oneDayPriceChange', // Approximation
        '12h': 'oneDayPriceChange', // Approximation
        '24h': 'oneDayPriceChange',
        '7d': 'oneWeekPriceChange'
    };

    const field = changeFieldMap[timeframe] || 'oneHourPriceChange';
    const results = [];

    // Parse range
    let min = 0;
    let max = Infinity;
    if (range === '10-30') { min = 0.1; max = 0.3; }
    else if (range === '30-50') { min = 0.3; max = 0.5; }
    else if (range === '50+') { min = 0.5; max = Infinity; }

    events.forEach(event => {
        if (!event.markets || !Array.isArray(event.markets)) return;

        event.markets.forEach(market => {
            // Exclude closed markets
            if (market.closed === true) return;

            const changeValue = market[field] || 0;
            const absChange = Math.abs(changeValue);

            if (absChange >= min && absChange < max) {
                results.push({
                    id: market.id,
                    title: market.question || event.title,
                    slug: event.slug,
                    category: event.tags?.[0]?.label || event.groupItemTitle || 'Market',
                    priceChange: changeValue,
                    currentPrice: market.lastTradePrice || 0,
                    volume24h: market.volume24hr || 0,
                    timeframe: timeframe,
                    isApproximated: ['3h', '6h', '12h'].includes(timeframe)
                });
            }
        });
    });

    return results.sort((a, b) => Math.abs(b.priceChange) - Math.abs(a.priceChange));
};
