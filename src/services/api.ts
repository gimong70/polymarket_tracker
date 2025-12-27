import axios from 'axios';

const GAMMA_API_URL = '/gamma';
const CLOB_API_URL = '/clob';

export interface Market {
    id: string;
    question: string;
    image: string;
    category: string;
    outcomePrices: string[];
    oneHourPriceChange: number;
    oneDayPriceChange: number;
    oneWeekPriceChange: number;
    volume24hr: number;
    active: boolean;
    closed: boolean;
    slug: string;
    clobTokenIds?: string[] | string;
    eventSlug?: string;
}

const marketCache: Record<string, { data: Market[], timestamp: number }> = {};
const historyCache: Record<string, { data: number, timestamp: number }> = {};
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

export const fetchMarkets = async (category?: string): Promise<Market[]> => {
    const cacheKey = category || 'all';
    if (marketCache[cacheKey] && Date.now() - marketCache[cacheKey].timestamp < CACHE_TTL) {
        return marketCache[cacheKey].data;
    }

    try {
        const fetchEvents = async (offset: number) => {
            const response = await axios.get(`${GAMMA_API_URL}/events`, {
                params: {
                    limit: 250,
                    offset: offset,
                    active: true,
                    closed: false,
                    order: 'volume',
                    ascending: false
                }
            });
            return response.data || [];
        };

        const eventPages = await Promise.all([
            fetchEvents(0),
            fetchEvents(250),
            fetchEvents(500),
            fetchEvents(750)
        ]);

        const allEvents = eventPages.flat();
        let flattenedMarkets: any[] = [];

        allEvents.forEach((event: any) => {
            const eventMarkets = event.markets || [];
            eventMarkets.forEach((m: any) => {
                let outcomePrices = m.outcomePrices;
                if (typeof outcomePrices === 'string') {
                    try { outcomePrices = JSON.parse(outcomePrices); } catch { outcomePrices = []; }
                }

                flattenedMarkets.push({
                    ...m,
                    image: m.image || event.image,
                    category: m.category || event.category || '',
                    eventTitle: event.title,
                    eventTags: event.tags || [],
                    outcomePrices: outcomePrices || [],
                    eventSlug: event.slug
                });
            });
        });

        let markets = flattenedMarkets.filter((m: any, index: number, self: any[]) =>
            index === self.findIndex((t) => t.id === m.id) && !m.closed && m.active
        );

        if (category && category !== 'Trending') {
            const catLower = category.toLowerCase();
            const categoryToTag: Record<string, string[]> = {
                'Politics': ['politics', 'election', 'government', 'world'],
                'Crypto': ['crypto', 'bitcoin', 'ethereum', 'solana'],
                'Trump': ['trump'],
                'Finance': ['business', 'finance', 'economy', 'fed'],
                'Economy': ['business', 'finance', 'economy', 'fed'],
                'Tech': ['tech', 'ai', 'big-tech']
            };

            const searchTags = categoryToTag[category] || [catLower];

            markets = markets.filter((m: any) => {
                const title = (m.question + ' ' + (m.eventTitle || '')).toLowerCase();
                const tags = (m.eventTags || []).map((t: any) => t.label?.toLowerCase() || '');
                const mCat = (m.category || '').toLowerCase();

                if (searchTags.some(st => tags.includes(st))) return true;
                if (category === 'Trump') return title.includes('trump');
                if (category === 'Politics') return searchTags.some(kw => title.includes(kw) || mCat.includes(kw) || mCat.includes('affairs'));
                if (category === 'Finance' || category === 'Economy') return searchTags.some(kw => title.includes(kw) || mCat.includes(kw) || title.includes('rate') || title.includes('usd'));
                if (category === 'Crypto') return searchTags.some(kw => title.includes(kw) || mCat.includes(kw) || title.includes('btc') || title.includes('eth'));
                if (category === 'Tech') return searchTags.some(kw => title.includes(kw) || mCat.includes(kw) || title.includes('nvidia') || title.includes('google'));

                return title.includes(catLower) || mCat.includes(catLower);
            });
        }

        markets.sort((a: any, b: any) => (b.volume24hr || 0) - (a.volume24hr || 0));

        marketCache[cacheKey] = { data: markets, timestamp: Date.now() };
        return markets;
    } catch (error) {
        console.error('Error fetching markets:', error);
        return [];
    }
};

export const fetchPriceChange = async (marketId: string, hours: number, clobTokenIds: string[] = []): Promise<number> => {
    const targetId = clobTokenIds.length > 0
        ? (typeof clobTokenIds === 'string' ? JSON.parse(clobTokenIds)[0] : clobTokenIds[0]).replace(/"/g, '').replace(/[\[\]]/g, '')
        : marketId;

    const cacheKey = `${targetId}_${hours}`;
    if (historyCache[cacheKey] && Date.now() - historyCache[cacheKey].timestamp < CACHE_TTL) {
        return historyCache[cacheKey].data;
    }

    try {
        let interval = '1d';
        if (hours > 24) interval = '1w';

        const response = await axios.get(`${CLOB_API_URL}/prices-history`, {
            params: {
                market: targetId,
                interval: interval,
            },
        });

        const history = response.data.history || (Array.isArray(response.data) ? response.data : []);
        if (!Array.isArray(history) || history.length < 2) return 0;

        const currentPrice = parseFloat(history[history.length - 1].p);
        const currentTime = history[history.length - 1].t;
        const pastTargetTime = currentTime - (hours * 3600);

        let pastPrice = parseFloat(history[0].p);
        for (let i = history.length - 1; i >= 0; i--) {
            if (history[i].t <= pastTargetTime) {
                pastPrice = parseFloat(history[i].p);
                break;
            }
        }

        const change = currentPrice - pastPrice;
        historyCache[cacheKey] = { data: change, timestamp: Date.now() };
        return change;
    } catch (error) {
        console.error(`Error fetching price history for ${marketId}:`, error);
        return 0;
    }
};
