import React, { useState } from 'react';
import { fetchPolymarketData, filterMarkets } from './services/polymarketApi';
import { Search, TrendingUp, DollarSign, BarChart3, Clock, AlertTriangle, ExternalLink, Info } from 'lucide-react';

const App = () => {
    const [category, setCategory] = useState('trending');
    const [timeframe, setTimeframe] = useState('1h');
    const [range, setRange] = useState('10-30');
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
                <h1 style={{ fontSize: '3rem', marginBottom: '10px', background: 'linear-gradient(90deg, #00d2ff, #9d50bb, #00d2ff)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'gradientFlow 5s linear infinite' }}>
                    POLYMARKET TRACKER
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', fontWeight: '300', letterSpacing: '1px' }}>
                    실시간 지능형 예측 시장 데이터 분석 플랫폼
                </p>
            </header>

            <section className="glass-morphism" style={{ padding: '40px', marginBottom: '50px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '25px', alignItems: 'flex-end', justifyContent: 'center' }}>
                    <div style={{ flex: '1', minWidth: '200px' }}>
                        <label style={{ display: 'block', marginBottom: '12px', fontFamily: 'Orbitron', fontSize: '0.8rem', color: 'var(--accent-blue)', opacity: 0.8 }}>SECTION</label>
                        <select className="input-select" style={{ width: '100%' }} value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="trending">Trending</option>
                            <option value="politics">Politics</option>
                            <option value="crypto">Crypto</option>
                            <option value="finance">Finance</option>
                            <option value="tech">Tech</option>
                            <option value="world">World</option>
                            <option value="economy">Economy</option>
                            <option value="trump">Trump</option>
                        </select>
                    </div>

                    <div style={{ flex: '1', minWidth: '200px' }}>
                        <label style={{ display: 'block', marginBottom: '12px', fontFamily: 'Orbitron', fontSize: '0.8rem', color: 'var(--accent-blue)', opacity: 0.8 }}>TIMEFRAME</label>
                        <select className="input-select" style={{ width: '100%' }} value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
                            <option value="1h">1시간 이내</option>
                            <option value="3h">3시간 이내</option>
                            <option value="6h">6시간 이내</option>
                            <option value="24h">하루 이내</option>
                            <option value="7d">일주일 이내</option>
                        </select>
                    </div>

                    <div style={{ flex: '1', minWidth: '200px' }}>
                        <label style={{ display: 'block', marginBottom: '12px', fontFamily: 'Orbitron', fontSize: '0.8rem', color: 'var(--accent-blue)', opacity: 0.8 }}>PROBABILITY RANGE</label>
                        <select className="input-select" style={{ width: '100%' }} value={range} onChange={(e) => setRange(e.target.value)}>
                            <option value="10-30">10% ~ 30%</option>
                            <option value="30-50">30% ~ 50%</option>
                            <option value="50+">50% 이상</option>
                        </select>
                    </div>

                    <button className="btn-primary" onClick={handleSearch} disabled={loading} style={{ height: '54px', minWidth: '200px' }}>
                        {loading ? '분석 중...' : <><Search size={22} /> 조회하기</>}
                    </button>
                </div>

                {['3h', '6h'].includes(timeframe) && (
                    <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', justifyContent: 'center' }}>
                        <Info size={14} />
                        <span>Available via 24h field approximation</span>
                    </div>
                )}
            </section>

            <main>
                {error && searched && (
                    <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.01)', borderRadius: '24px', border: '1px dashed var(--border-glass)' }}>
                        <AlertTriangle size={64} style={{ marginBottom: '24px', opacity: 0.3, color: 'var(--accent-purple)' }} />
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '12px', color: '#fff' }}>데이터가 없습니다</h2>
                        <p style={{ opacity: 0.7 }}>해당 필터 조건에 부합하는 활성 시장을 찾을 수 없습니다.</p>
                    </div>
                )}

                {!searched && !loading && (
                    <div style={{ textAlign: 'center', padding: '100px 20px', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px' }}>
                        <TrendingUp size={80} style={{ marginBottom: '30px', opacity: 0.1, color: 'var(--accent-blue)' }} />
                        <h2 style={{ fontSize: '1.8rem', color: 'var(--text-secondary)', fontWeight: '300' }}>조회 대기 중</h2>
                        <p style={{ marginTop: '15px', color: 'rgba(255,255,255,0.3)', maxWidth: '400px', margin: '15px auto 0' }}>상단의 필터를 세팅한 후 조회 버튼을 클릭하여 예측 시장 데이터를 확인하세요.</p>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '30px' }}>
                    {markets.map((market, index) => (
                        <MarketCard key={market.id} market={market} index={index} />
                    ))}
                </div>
            </main>
        </div>
    );
};

const MarketCard = ({ market, index }) => {
    const change = market.priceChange || 0;
    const isPositive = change > 0;
    const isNeutral = change === 0;

    return (
        <div className="glass-morphism animate-fade-in" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', animationDelay: `${index * 0.05}s`, position: 'relative', overflow: 'hidden' }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                e.currentTarget.style.borderColor = 'rgba(0, 210, 255, 0.4)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 210, 255, 0.15)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.borderColor = 'var(--border-glass)';
                e.currentTarget.style.boxShadow = 'none';
            }}>

            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: isNeutral ? 'var(--text-secondary)' : (isPositive ? 'var(--accent-green)' : 'var(--accent-red)'), opacity: 0.6 }}></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--accent-blue)', fontFamily: 'Orbitron', background: 'rgba(0, 210, 255, 0.08)', padding: '5px 12px', borderRadius: '4px', border: '1px solid rgba(0, 210, 255, 0.2)', letterSpacing: '1px' }}>
                    {market.category?.toUpperCase()}
                </span>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: isNeutral ? 'var(--text-secondary)' : (isPositive ? 'var(--accent-green)' : 'var(--accent-red)'),
                    fontFamily: 'Orbitron',
                    fontWeight: '800',
                    fontSize: '1.2rem',
                    textShadow: `0 0 10px ${isPositive ? 'rgba(0, 242, 96, 0.3)' : 'rgba(255, 65, 108, 0.3)'}`
                }}>
                    {isNeutral ? '' : (isPositive ? '↑' : '↓')} {Math.abs(change * 100).toFixed(1)}%
                </div>
            </div>

            <h3 style={{ fontSize: '1.25rem', lineHeight: '1.5', fontWeight: '600', color: '#fff', minHeight: '3.8em', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {market.title}
            </h3>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px' }}>
                <div style={{ flex: 1 }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.65rem', marginBottom: '6px', fontFamily: 'Orbitron', letterSpacing: '1px', textTransform: 'uppercase' }}>Current Prob.</p>
                    <p style={{ fontWeight: '800', fontSize: '1.5rem', color: 'var(--accent-blue)' }}>{(market.currentPrice * 100).toFixed(1)}%</p>
                </div>
                <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.1)' }}></div>
                <div style={{ flex: 1, textAlign: 'right' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.65rem', marginBottom: '6px', fontFamily: 'Orbitron', letterSpacing: '1px', textTransform: 'uppercase' }}>Period</p>
                    <p style={{ fontWeight: '600', color: '#fff' }}>{market.timeframe.toUpperCase()}{market.isApproximated ? '*' : ''}</p>
                </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '20px', marginTop: 'auto' }}>
                <a
                    href={`https://polymarket.com/event/${market.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-link"
                    style={{
                        color: '#fff',
                        textDecoration: 'none',
                        fontSize: '0.85rem',
                        fontFamily: 'Orbitron',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        justifyContent: 'center',
                        background: 'rgba(255,255,255,0.05)',
                        padding: '12px',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease'
                    }}
                >
                    VIEW ON POLYMARKET <ExternalLink size={16} />
                </a>
            </div>
        </div>
    );
};

export default App;
