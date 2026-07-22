export default function Onsen() {
  return (
    <section className="section photo-section photo-section--alt" id="onsen">
      <div className="split-section">
        <div className="split-text">
          <p className="eyebrow"><span className="hanko" aria-hidden="true">湯</span>Onsen</p>
          <h2 className="section-title">源泉かけ流しの湯で、<br />心も体もゆっくりと。</h2>
          <p className="section-lead">
            保温性に優れた源泉かけ流しの天然温泉。<br />
            熱め・ぬるめ・人肌の3つの浴槽で、お好みの湯加減をお楽しみいただけます。宿泊はもちろん、日帰り入浴でもご利用いただけます。
          </p>
          <a href="#" className="link-more">温泉のご案内 →</a>
        </div>
        <div className="split-gallery mosaic-a mosaic-a--reverse">
          <figure>
            <img src="/assets/photos/room-2.jpg" alt="大浴場" />
            <figcaption>大浴場</figcaption>
          </figure>
          <figure>
            <img src="/assets/photos/image9.png" alt="露天風呂（夜景）" />
          </figure>
          <figure>
            <img src="/assets/photos/onsen-3.jpg" alt="露天風呂" />
            <figcaption>露天風呂</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
