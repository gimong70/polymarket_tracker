import { motion } from 'framer-motion';
import { Mail, Youtube, BookText, MessageSquare } from 'lucide-react';

const Contact = () => {
    const socials = [
        { icon: <Youtube className="w-6 h-6" />, label: "Main YouTube", href: "https://www.youtube.com/@2ndNLife" },
        { icon: <Youtube className="w-6 h-6" />, label: "Sub YouTube", href: "https://www.youtube.com/@gimong70" },
        { icon: <BookText className="w-6 h-6" />, label: "Blog", href: "https://gimong70.tistory.com" },
        { icon: <Mail className="w-6 h-6" />, label: "Business", href: "mailto:gimong70@gmail.com" }
    ];

    return (
        <footer id="contact" className="py-20 border-t border-white/5 bg-black/50">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-6">함께 <span className="neon-text">미래</span>를 설계하세요</h2>
                        <p className="text-dim mb-8 max-w-md">
                            비즈니스 협업, 강연 문의 또는 기술적 영감을 나누고 싶다면 언제든 연락주세요.
                            AGI 시대의 새로운 기회를 함께 탐색합니다.
                        </p>
                        <div className="flex gap-4">
                            {socials.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    className="p-3 rounded-full glass-card hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 group"
                                    aria-label={social.label}
                                >
                                    <div className="group-hover:scale-110 group-hover:text-cyan-400 transition-all">
                                        {social.icon}
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    <form className="glass-card p-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-2">
                            <label className="text-xs font-tech text-dim">NAME / ORGANIZATION</label>
                            <input
                                type="text"
                                className="w-full bg-white/5 border border-white/10 rounded-sm p-3 focus:outline-none focus:border-cyan-500/50 transition-colors"
                                placeholder="성함 또는 기업명을 입력하세요"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-tech text-dim">EMAIL ADDRESS</label>
                            <input
                                type="email"
                                className="w-full bg-white/5 border border-white/10 rounded-sm p-3 focus:outline-none focus:border-cyan-500/50 transition-colors"
                                placeholder="연락받으실 이메일 주소"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-tech text-dim">MESSAGE</label>
                            <textarea
                                className="w-full bg-white/5 border border-white/10 rounded-sm p-3 h-32 focus:outline-none focus:border-cyan-500/50 transition-colors"
                                placeholder="문의하실 내용을 적어주세요"
                            ></textarea>
                        </div>
                        <button className="w-full neon-border bg-cyan-500/10 py-3 rounded-sm font-tech text-cyan-400 hover:bg-cyan-500/20 transition-all">
                            SEND TRANSMISSION
                        </button>
                    </form>
                </div>

                <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-tech text-dim">
                    <p>© 2025 THE SECOND N LIFE. ALL RIGHTS RESERVED.</p>
                    <div className="flex gap-8">
                        <span className="hover:text-cyan-400 cursor-pointer transition-colors">PRIVACY POLICY</span>
                        <span className="hover:text-cyan-400 cursor-pointer transition-colors">DATA SECURITY</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Contact;
