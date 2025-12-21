import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-[120px] animate-pulse-glow" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-[150px] animate-pulse-glow" />

            <div className="container relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="mb-8"
                >
                    <span className="inline-block px-4 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-tech mb-6">
                        ENTER THE FUTURE PREDICTION
                    </span>
                    <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter">
                        <span className="block">POLYMARKET</span>
                        <span className="neon-text">INSIGHTS</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-dim max-w-3xl mx-auto font-light leading-relaxed">
                        전 세계의 집단지성이 모이는 곳, <span className="text-white font-medium">폴리마켓</span>의 확률 데이터로 <br />
                        누구보다 먼저 <span className="text-cyan-400">시장의 미래</span>를 정확하게 읽어내세요.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="flex flex-col md:flex-row items-center justify-center gap-6 mt-12"
                >
                    <a
                        href="https://www.youtube.com/@2ndNLife"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="neon-border px-8 py-4 rounded-sm bg-cyan-500/10 hover:bg-cyan-500/20 transition-all duration-300 group"
                    >
                        <span className="font-tech text-cyan-400 group-hover:tracking-widest transition-all">채널 입장하기</span>
                    </a>
                    <button className="px-8 py-4 text-dim hover:text-white transition-colors flex items-center gap-2">
                        <span className="font-tech text-sm">SCROLL TO ANALYZE</span>
                    </button>
                </motion.div>
            </div>

            {/* Cyberpunk Line Pattern */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        </section>
    );
};

export default Hero;
