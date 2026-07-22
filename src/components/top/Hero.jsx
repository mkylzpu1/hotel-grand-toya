export default function Hero() {
  return (
  <div className="relative m-[28px] rounded-[28px] overflow-hidden">
    <section className="relative h-[calc(100vh-56px)] min-h-[560px] max-h-[920px] max-[760px]:h-[84vh]">
      <div className="absolute inset-0">
        <img
          src="/assets/photos/image10.png"
          alt="洞爺湖の湖畔からの眺め"
          className="w-full h-full object-cover block"
        />
      </div>
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(100deg, rgba(20,16,12,.62) 0%, rgba(20,16,12,.32) 32%, rgba(20,16,12,0) 62%), linear-gradient(0deg, rgba(20,16,12,.5) 0%, rgba(20,16,12,0) 40%)',
        }}
      />
      <div className="relative z-[1] h-full max-w-[620px] max-[760px]:max-w-none flex flex-col items-start justify-end text-left pt-0 pr-10 pb-[72px] pl-14 max-[760px]:px-[22px] text-white">
        <p className="text-[0.78rem] tracking-[0.18em] font-medium mb-[22px] opacity-95">洞爺湖温泉</p>
        <h1 className="text-[clamp(1.9rem,1.4rem+2.2vw,2.9rem)] leading-[1.6] font-bold tracking-[0.05em] mb-[26px] text-white">
          湖畔に、<br />いちばん近い時間を。
        </h1>
        <p className="text-[0.94rem] font-normal max-w-[34ch] mb-[38px] opacity-90 tracking-[0.02em]">
          源泉かけ流しの湯と、洞爺湖を望む客室で過ごす静かなひととき。
        </p>
        <a
          href="https://reserve.example.com/grandtoya"
          target="_blank"
          rel="noopener"
          className="inline-flex items-center justify-center px-[46px] py-[17px] text-[0.86rem] tracking-[0.1em] font-medium border border-[#29415C] bg-[#29415C] text-white whitespace-nowrap transition-colors hover:bg-[#A24730] hover:border-[#A24730]"
        >
          ご予約はこちら
        </a>
      </div>
    </section>
  </div>
  );
}
