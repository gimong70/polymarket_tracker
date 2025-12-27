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
    const [changeRange, setChangeRange] = useState('50+');

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

            const processedMarkets = await Promise.all(
                allMarkets.map(async (m) => {
                    let change = 0;
                    let currentPrice = parseFloat(m.outcomePrices[0] || '0.5');

                    if (timeFrame === '1h') change = m.oneHourPriceChange ?? 0;
                    else if (timeFrame === '24h') change = m.oneDayPriceChange ?? 0;
                    else if (timeFrame === '1w') change = m.oneWeekPriceChange ?? 0;
                    else {
                        const hours = timeFrame === '3h' ? 3 : 6;
                        const tokenIds = typeof m.clobTokenIds === 'string' ? JSON.parse(m.clobTokenIds) : (m.clobTokenIds || []);
                        change = await fetchPriceChange(m.id, hours, tokenIds) ?? 0;
                    }

                    const oldPrice = currentPrice - change;
                    // Calculate percentage change based on absolute move to capture both up and down volatility
                    // User requested 0-100% range based on probability change
                    const percentChange = Math.abs(change) * 100;

                    return { ...m, calculatedChange: change, percentChange: isNaN(percentChange) ? 0 : percentChange };
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
            setError('데이터를 가져오는 중 오류가 발생했습니다.');
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
