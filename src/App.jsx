import React, { useState } from 'react';
import { fetchPolymarketData, filterMarkets } from './services/polymarketApi';
import { Search, TrendingUp, DollarSign, BarChart3, Clock, AlertTriangle, ExternalLink, Info } from 'lucide-react';

const App = () => {
    const [category, setCategory] = useState('trending');
    const [timeframe, setTimeframe] = useState('1h');
    const [range, setRange] = useState('any');
    const [markets, setMarkets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searched, setSearched] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        setError(null);
        setSearched(true);
        try {
            const allEvents = await fetchPolymarketData(category);
            const filtered = filterMarkets(allEvents, timeframe, range);
            setMarkets(filtered);
            if (filtered.length === 0) {
                setError('선택하신 조건에 일치하는 아이템이 없습니다.');
            }
        } catch (err) {
            setError('데이터를 가져오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container animate-fade-in">
            <header style={{ marginBottom: '60px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', background: 'linear-gradient(45deg, #00d2ff, #9d50bb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    POLYMARKET TRACKER
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
                    실시간 예측 시장 변동성 대시보드
                </p>
            </header>

            <section className="glass-morphism" style={{ padding: '30px', marginBottom: '40px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-end', justifyContent: 'center' }}>
                    <div style={{ flex: '1', minWidth: '180px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontFamily: 'Rajdhani', fontSize: '0.9rem', color: 'var(--accent-blue)' }}>조회 섹션</label>
                        <select className="input-select" style={{ width: '100%' }} value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="trending">🔥 Trending</option>
                            <option value="politics">⚖️ Politics</option>
                            <option value="crypto">🪙 Crypto</option>
                            <option value="finance">💰 Finance</option>
                            <option value="tech">💻 Tech</option>
                            <option value="world">🌍 World</option>
                            <option value="economy">📊 Economy</option>
                            <option value="trump">🇺🇸 Trump</option>
                        </select>
                    </div>

                    <div style={{ flex: '1', minWidth: '180px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontFamily: 'Rajdhani', fontSize: '0.9rem', color: 'var(--accent-blue)' }}>기준 시간</label>
                        <select className="input-select" style={{ width: '100%' }} value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
                            <option value="1h">1시간 이내</option>
                            <option value="3h">3시간 이내</option>
                            <option value="6h">6시간 이내</option>
                            <option value="24h">하루 이내</option>
                            <option value="7d">일주일 이내</option>
                        </select>
                    </div>

                    <div style={{ flex: '1', minWidth: '180px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontFamily: 'Rajdhani', fontSize: '0.9rem', color: 'var(--accent-blue)' }}>변동 확률 범위</label>
                        <select className="input-select" style={{ width: '100%' }} value={range} onChange={(e) => setRange(e.target.value)}>
                            <option value="any">전체 (Any)</option>
                            <option value="10-30">10% ~ 30%</option>
                            <option value="30-50">30% ~ 50%</option>
                            <option value="50+">50% 이상</option>
                        </select>
                    </div>

                    <button className="btn-primary" onClick={handleSearch} disabled={loading} style={{ height: '48px', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 40px' }}>
                        {loading ? '조회 중...' : <><Search size={18} /> 조회하기</>}
                    </button>
                </div>

                {['3h', '6h', '12h'].includes(timeframe) && (
                    <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                        <Info size={14} />
                        <span>3h, 6h, 12h 데이터는 현재 API 제약으로 인해 24h 데이터를 기반으로 근사 필터링됩니다.</span>
                    </div>
                )}
            </section>

            {error && searched && (
                <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
                    <BarChart3 size={64} style={{ marginBottom: '20px', opacity: 0.2 }} />
                    <p style={{ fontSize: '1.2rem', fontFamily: 'Orbitron' }}>{error}</p>
                    <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>검색 조건을 변경하거나 범위를 넓혀보세요.</p>
                </div>
            )}

            {!searched && !loading && (
                <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
                    <TrendingUp size={64} style={{ marginBottom: '20px', opacity: 0.2 }} />
                    <p style={{ fontSize: '1.2rem', fontFamily: 'Orbitron' }}>조회 준비 완료</p>
                    <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>조건을 선택한 후 조회 버튼을 눌러주세요.</p>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px' }}>
                {markets.map((market) => (
                    <MarketCard key={market.id} market={market} />
                ))}
            </div>
        </div>
    );
};

const MarketCard = ({ market }) => {
    const change = market.priceChange || 0;
    const isPositive = change > 0;
    const isNeutral = change === 0;

    return (
        <div className="glass-morphism animate-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', transition: 'all 0.3s ease' }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.borderColor = 'var(--accent-blue)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border-glass)';
            }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--accent-blue)', fontFamily: 'Orbitron', background: 'rgba(0, 210, 255, 0.1)', padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(0, 210, 255, 0.2)' }}>
                    {market.category?.toUpperCase()}
                </span>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: isNeutral ? 'var(--text-secondary)' : (isPositive ? 'var(--accent-green)' : 'var(--accent-red)'),
                    fontFamily: 'Orbitron',
                    fontWeight: '700',
                    fontSize: '1.1rem'
                }}>
                    {isNeutral ? '' : (isPositive ? '↑' : '↓')} {Math.abs(change * 100).toFixed(1)}%
                </div>
            </div>

            <h3 style={{ fontSize: '1.15rem', lineHeight: '1.4', fontWeight: '600', color: '#fff', minHeight: '3.4em' }}>
                {market.title}
            </h3>

            <div style={{ display: 'flex', gap: '15px', fontSize: '0.9rem' }}>
                <div style={{ flex: 1 }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginBottom: '4px', fontFamily: 'Orbitron' }}>현재가</p>
                    <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{(market.currentPrice * 100).toFixed(1)}¢</p>
                </div>
                <div style={{ flex: 1, textAlign: 'right' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginBottom: '4px', fontFamily: 'Orbitron' }}>기준 시간</p>
                    <p style={{ fontWeight: 'bold' }}>{market.timeframe.toUpperCase()}{market.isApproximated ? '*' : ''}</p>
                </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '15px' }}>
                <a
                    href={`https://polymarket.com/event/${market.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        color: 'var(--accent-blue)',
                        textDecoration: 'none',
                        fontSize: '0.85rem',
                        fontFamily: 'Orbitron',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        justifyContent: 'center'
                    }}
                >
                    POLYMARKET에서 보기 <ExternalLink size={14} />
                </a>
            </div>
        </div>
    );
};

export default App;
