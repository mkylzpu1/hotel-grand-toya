import CtaButton from '../ui/CtaButton';

export default function Hero() {
  return (
    <div className="relative m-[28px] overflow-hidden rounded-[28px]">
      <section className="relative h-[calc(100vh-56px)] max-h-[920px] min-h-[560px] max-[760px]:h-[84vh]">
        <div className="absolute inset-0">
          <img
            src="/assets/photos/image10.png"
            alt="洞爺湖の湖畔からの眺め"
            className="block h-full w-full object-cover"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(100deg, rgba(20,16,12,.62) 0%, rgba(20,16,12,.32) 32%, rgba(20,16,12,0) 62%), linear-gradient(0deg, rgba(20,16,12,.5) 0%, rgba(20,16,12,0) 40%)',
          }}
        />
        <div className="relative z-[1] flex h-full max-w-[620px] flex-col items-start justify-end pb-[72px] pl-14 pr-10 pt-0 text-left text-white max-[760px]:max-w-none max-[760px]:px-[22px]">
          <p className="mb-[22px] text-[0.78rem] font-medium tracking-[0.18em] opacity-95">
            洞爺湖温泉
          </p>
          <h1 className="mb-[26px] text-[clamp(1.9rem,1.4rem+2.2vw,2.9rem)] font-bold leading-[1.6] tracking-[0.05em] text-white">
            湖畔に、
            <br />
            いちばん近い時間を。
          </h1>
          <p className="mb-[38px] max-w-[34ch] text-[0.94rem] font-normal tracking-[0.02em] opacity-90">
            源泉かけ流しの湯と、洞爺湖を望む客室で過ごす静かなひととき。
          </p>
          <CtaButton href="https://reserve.example.com/grandtoya">ご予約はこちら</CtaButton>
        </div>
      </section>
    </div>
  );
}
