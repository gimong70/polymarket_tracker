import { motion } from 'framer-motion';
import { Terminal, Shield, Cpu, Activity } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Terminal className="w-8 h-8 text-cyan-400" />,
      title: "집단지성 알고리즘",
      description: "폴리마켓의 방대한 데이터를 분석하여 시장의 흐름을 날카롭게 포착합니다."
    },
    {
      icon: <Shield className="w-8 h-8 text-fuchsia-400" />,
      title: "신뢰할 수 있는 예측",
      description: "단순한 추측이 아닌, 실제 확률과 통계에 기반한 정밀한 시장 예측을 제공합니다."
    },
    {
      icon: <Cpu className="w-8 h-8 text-blue-400" />,
      title: "AGI 시대의 경제학",
      description: "인공지능 기술의 진화가 우리 경제와 투자 시장에 미치는 영향을 탐구합니다."
    },
    {
      icon: <Activity className="w-8 h-8 text-cyan-400" />,
      title: "실시간 시장 분석",
      description: "변화하는 시장 상황에 맞춰 매일 새로운 인사이트와 투자 전략을 업데이트합니다."
    }
  ];

  return (
    <section className="py-20 container">
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          미래를 읽는 <span className="neon-text">인사이트</span>
        </motion.h2>
        <p className="text-dim max-w-2xl mx-auto">
          @2ndNLife는 폴리마켓과 집단지성을 활용하여 복잡한 시장의 미래를 확률로 풀어냅니다.
          우리는 데이터 속에서 진실을 찾고, 더 나은 의사결정을 돕습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -10, borderColor: 'var(--primary-neon)' }}
            className="glass-card p-8 transition-all duration-300"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
            <p className="text-dim text-sm leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;
