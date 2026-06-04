const PROPS = [
  {
    icon: '🚗',
    title: '검증된 파트너',
    desc: '24시간 지원 · 전문 기사 · 신뢰할 수 있는 운영업체',
  },
  {
    icon: '✅',
    title: '즉시 확정',
    desc: '예약 즉시 확정 · 예약 수수료 없이 직접 예약',
  },
  {
    icon: '🇰🇷',
    title: '한국어 지원',
    desc: '한국어 고객센터 · 언제 어디서든 든든한 지원',
  },
];

export default function ValueProps() {
  return (
    <div className="bg-[#FAF7F0] border-b border-[#EDE5CC] px-6 py-6">
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
        {PROPS.map((p) => (
          <div key={p.title} className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">{p.icon}</span>
            <div>
              <p className="text-sm font-bold text-[#2A2A25]">{p.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
