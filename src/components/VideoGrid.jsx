import { motion } from 'framer-motion';
import { Youtube, ExternalLink, Play } from 'lucide-react';

const VideoGrid = () => {
    const videos = [
        {
            id: "Ocp8Jud2_8k",
            title: "폴리마켓 : 마이크론 (실적 및 기술 발표 분석)",
            thumbnail: "/thumbnail1.png",
            tags: ["시장예측", "마이크론", "AGI"]
        },
        {
            id: "4-bKAW0HgII",
            title: "폴리마켓 : BOJ 금리인상과 엔캐리트레이드",
            thumbnail: "https://img.youtube.com/vi/4-bKAW0HgII/maxresdefault.jpg",
            tags: ["금융시장", "BOJ", "금리인상"]
        },
        {
            id: "m2aXiVhSPG8",
            title: "\"일짱 테슬라에 도전하는 리비안\" 자율주행 전쟁",
            thumbnail: "/thumbnail3.png",
            tags: ["리비안", "테슬라", "자율주행"]
        }
    ];

    return (
        <section id="analysis" className="py-24 bg-black/30">
            <div className="container">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <span className="text-cyan-400 font-tech text-sm tracking-widest">TRANSMISSION START</span>
                        <h2 className="text-3xl md:text-5xl font-bold mt-2">최신 분석 리포트</h2>
                    </div>
                    <a
                        href="https://www.youtube.com/@2ndNLife/videos"
                        target="_blank"
                        className="flex items-center gap-2 text-dim hover:text-cyan-400 transition-colors group"
                    >
                        <span>전체 영상 보기</span>
                        <Youtube className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {videos.map((video, index) => (
                        <motion.a
                            key={index}
                            href={`https://www.youtube.com/watch?v=${video.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group cursor-pointer block"
                        >
                            <div className="relative overflow-hidden rounded-lg aspect-video mb-6 ring-1 ring-white/10 group-hover:ring-cyan-500/50 transition-all">
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <div className="w-16 h-16 rounded-full bg-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.6)]">
                                        <Play className="w-8 h-8 text-black fill-current" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 mb-3">
                                {video.tags.map(tag => (
                                    <span key={tag} className="text-[10px] uppercase tracking-wider text-cyan-400 px-2 py-0.5 border border-cyan-500/30 rounded-full">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                            <h3 className="text-base font-bold group-hover:text-cyan-400 transition-colors line-clamp-2 leading-tight">
                                {video.title}
                            </h3>
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default VideoGrid;
