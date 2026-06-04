export default function HeroBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#2A2A25] via-[#3A4A3A] to-[#4A5A3A] text-[#FAF7F0] px-6 py-12">
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#76B87A] opacity-10" />
      <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-[#EDE5CC] opacity-10" />
      <div className="relative max-w-4xl mx-auto">
        <p className="text-[#76B87A] text-xs font-bold mb-2 tracking-widest uppercase">
          마이리얼트립 터키 T&amp;A
        </p>
        <h1 className="text-3xl font-bold mb-2">터키 공항 픽업 &amp; 샌딩</h1>
        <p className="text-[#C8DCCA] text-sm">
          마이리얼트립이 검증한 파트너 상품 · 이스탄불 · 카파도키아 · 안탈리아 · 이즈미르
        </p>
      </div>
    </div>
  );
}
