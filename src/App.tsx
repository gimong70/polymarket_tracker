import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, AlertCircle, Clock, Percent, List } from 'lucide-react';
import { fetchMarkets, fetchPriceChange, Market } from './services/api';

const App: React.FC = () => {
    const [markets, setMarkets] = useState<Market[]>([]);
    const [filteredMarkets, setFilteredMarkets] = useState<Market[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [category, setCategory] = useState('Trending');
    const [timeFrame, setTimeFrame] = useState('1h');
    const [changeRange, setChangeRange] = useState('10-30');

    const categories = ['Trending', 'Politics', 'Crypto', 'Finance', 'Tech', 'Economy', 'Trump'];
    const timeFrames = [
        { label: '1시간 이내', value: '1h' },
        { label: '3시간 이내', value: '3h' },
        { label: '6시간 이내', value: '6h' },
        { label: '하루 이내', value: '24h' },
        { label: '일주일 이내', value: '1w' },
    ];
    const changeRanges = [
        { label: '10% ~ 30%', value: '10-30' },
        { label: '30% ~ 50%', value: '30-50' },
        { label: '50% 이상', value: '50+' },
    ];

    const handleSearch = async () => {
        setLoading(true);
        setError(null);
        try {
            const allMarkets = await fetchMarkets(category);

            if (!allMarkets || allMarkets.length === 0) {
                setFilteredMarkets([]);
                return;
            }

            const isGammaDataAvailable = ['1h', '24h', '1w'].includes(timeFrame);

            // Limit expensive CLOB calls to top markets
            // Gamma is cheap, so we can check many more to find volatile ones
            const limitCount = isGammaDataAvailable ? 300 : 50;
            const processingMarkets = allMarkets.slice(0, limitCount);

            const processedMarkets = await Promise.all(
                processingMarkets.map(async (m, index) => {
                    try {
                        let tokenIds: string[] = [];
                        if (typeof m.clobTokenIds === 'string') {
                            try { tokenIds = JSON.parse(m.clobTokenIds); } catch { tokenIds = []; }
                        } else {
                            tokenIds = m.clobTokenIds || [];
                        }

                        let maxAbsoluteChange = 0;
                        let displayChange = 0;
                        let foundInGamma = false;

                        // Try Gamma API first
                        if (isGammaDataAvailable) {
                            let gammaVal: number | undefined;
                            if (timeFrame === '1h') gammaVal = m.oneHourPriceChange;
                            else if (timeFrame === '24h') gammaVal = m.oneDayPriceChange;
                            else if (timeFrame === '1w') gammaVal = m.oneWeekPriceChange;

                            if (gammaVal !== undefined && gammaVal !== 0) {
                                displayChange = gammaVal;
                                maxAbsoluteChange = Math.abs(gammaVal);
                                foundInGamma = true;
                            }
                        }

                        // Fallback to CLOB if:
                        // 1. Timeframe not in Gamma (3h, 6h)
                        // 2. Gamma result was 0/missing AND it's a top market (top 30)
                        const shouldTryClob = (!foundInGamma && index < 30 && tokenIds.length > 0) || (!isGammaDataAvailable && tokenIds.length > 0);

                        if (shouldTryClob) {
                            // Parallelize token checks for this market
                            const changes = await Promise.all(tokenIds.slice(0, 2).map(async (tid: string) => {
                                try {
                                    return await fetchPriceChange(m.id, timeFrame, [tid]);
                                } catch {
                                    return 0;
                                }
                            }));

                            changes.forEach(c => {
                                if (Math.abs(c) > maxAbsoluteChange) {
                                    maxAbsoluteChange = Math.abs(c);
                                    displayChange = c;
                                }
                            });
                        }

                        const percentChange = maxAbsoluteChange * 100;
                        return {
                            ...m,
                            calculatedChange: displayChange,
                            percentChange: isNaN(percentChange) ? 0 : percentChange
                        };
                    } catch (err) {
                        return { ...m, calculatedChange: 0, percentChange: 0 };
                    }
                })
            );

            const filtered = processedMarkets.filter((m: any) => {
                const p = m.percentChange;
                if (changeRange === '10-30') return p >= 10 && p <= 30;
                if (changeRange === '30-50') return p >= 30 && p <= 50;
                if (changeRange === '50+') return p >= 50;
                return true;
            });

            setFilteredMarkets(filtered);
        } catch (err) {
            setError('데이터를 가져오는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container">
            <header>
                <h1>Polymarket Tracker</h1>
                <p className="subtitle">예측 시장의 실시간 변동률을 추적합니다</p>
            </header>

            <div className="filters-container">
                <div className="filter-group">
                    <label className="filter-label"><List size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> 섹션</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label className="filter-label"><Clock size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> 기준 시간</label>
                    <select value={timeFrame} onChange={(e) => setTimeFrame(e.target.value)}>
                        {timeFrames.map(tf => (
                            <option key={tf.value} value={tf.value}>{tf.label}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label className="filter-label"><Percent size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> 변동 확률</label>
                    <select value={changeRange} onChange={(e) => setChangeRange(e.target.value)}>
                        {changeRanges.map(cr => (
                            <option key={cr.value} value={cr.value}>{cr.label}</option>
                        ))}
                    </select>
                </div>

                <button className="search-button" onClick={handleSearch} disabled={loading}>
                    {loading ? '조회 중...' : '데이터 조회'} <Search size={20} />
                </button>
            </div>

            <div className="market-grid">
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>데이터를 불러오는 중입니다...</p>
                    </div>
                ) : error ? (
                    <div className="empty-state">
                        <AlertCircle size={48} color="var(--danger-color)" />
                        <p>{error}</p>
                    </div>
                ) : filteredMarkets.length > 0 ? (
                    filteredMarkets.map((market: any) => (
                        <a
                            key={market.id}
                            href={`https://polymarket.com/event/${market.eventSlug || market.slug}`}
                            className="market-card-link"
                        >
                            <div className="market-card">
                                <img src={market.image} alt={market.question} className="market-image" />
                                <div className="market-content">
                                    {market.category && market.category !== 'MARKET' && (
                                        <span className="category-badge">{market.category}</span>
                                    )}
                                    <h3 className="market-question">{market.question}</h3>
                                    <div className="market-stats">
                                        <div className="price-container">
                                            <span className="price-label">기준 시간</span>
                                            <span className="price-value" style={{ fontSize: '0.9rem' }}>
                                                {timeFrames.find(tf => tf.value === timeFrame)?.label}
                                            </span>
                                        </div>
                                        <div className={`change-value ${market.calculatedChange >= 0 ? 'change-positive' : 'change-negative'}`}>
                                            {market.calculatedChange >= 0 ? '+' : ''}
                                            {market.percentChange.toFixed(1)}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </a>
                    ))
                ) : (
                    <div className="empty-state">
                        <p>조건에 맞는 데이터가 없습니다.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
