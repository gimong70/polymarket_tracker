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
}

export const fetchMarkets = async (category?: string): Promise<Market[]> => {
    try {
        const params: any = {
            active: true,
            closed: false,
            limit: 500,
        };

        // Map internal categories to API tags
        const categoryToTag: Record<string, string> = {
            'Politics': 'Politics',
            'Crypto': 'Crypto',
            'Trump': 'Trump',
            'Finance': 'Business',
            'Economy': 'Business',
            'Tech': 'Tech',
        };

        if (category && categoryToTag[category]) {
            params.tag = categoryToTag[category];
        }

        const response = await axios.get(`${GAMMA_API_URL}/markets`, { params });
        const rawMarkets = response.data;

        let markets = rawMarkets
            .map((m: any) => {
                let outcomePrices = m.outcomePrices;
                if (typeof outcomePrices === 'string') {
                    try {
                        outcomePrices = JSON.parse(outcomePrices);
                    } catch (e) {
                        outcomePrices = [];
                    }
                }
                return {
                    ...m,
                    outcomePrices: outcomePrices || [],
                };
            })
            .filter((m: any) => !m.closed && m.active);

        if (category && category !== 'Trending') {
            const catLower = category.toLowerCase();

            // Secondary filter to ensure accuracy and catch overlapping tags
            markets = markets.filter((m: any) => {
                const title = m.question?.toLowerCase() || '';
                const slug = m.slug?.toLowerCase() || '';
                const description = m.description?.toLowerCase() || '';
                const catField = m.category?.toLowerCase() || '';

                if (category === 'Trump') {
                    return title.includes('trump') || slug.includes('trump');
                }

                if (category === 'Politics') {
                    return title.includes('politics') || title.includes('election') ||
                        slug.includes('politics') || catField.includes('politics') ||
                        catField.includes('affairs');
                }

                if (category === 'Crypto') {
                    return title.includes('crypto') || title.includes('bitcoin') ||
                        title.includes('eth') || slug.includes('crypto') ||
                        catField.includes('crypto');
                }

                if (category === 'Finance' || category === 'Economy') {
                    return title.includes('fed') || title.includes('rate') ||
                        title.includes('economy') || title.includes('recession') ||
                        title.includes('finance') || title.includes('usd') ||
                        catField.includes('business') || catField.includes('economy') ||
                        catField.includes('finance');
                }

                if (category === 'Tech') {
                    return title.includes('tech') || title.includes('ai') ||
                        title.includes('apple') || title.includes('nvidia') ||
                        title.includes('google') || title.includes('meta') ||
                        catField.includes('tech');
                }

                return catField.includes(catLower);
            });
        }

        if (category === 'Trending') {
            markets.sort((a: any, b: any) => (b.volume24hr || 0) - (a.volume24hr || 0));
        }

        return markets;
    } catch (error) {
        console.error('Error fetching markets:', error);
        return [];
    }
};

export const fetchPriceChange = async (marketId: string, hours: number): Promise<number> => {
    try {
        // Only 3h and 6h need manual calculation if not provided by Gamma
        if (hours !== 3 && hours !== 6) return 0;

        const response = await axios.get(`${CLOB_API_URL}/prices-history`, {
            params: {
                market: marketId,
                interval: '1h',
            },
        });

        const history = response.data.history || [];
        if (history.length < hours) return 0;

        const currentPrice = parseFloat(history[history.length - 1].price);
        const pastPrice = parseFloat(history[history.length - 1 - hours].price);

        return currentPrice - pastPrice;
    } catch (error) {
        console.error(`Error fetching price history for ${marketId}:`, error);
        return 0;
    }
};
