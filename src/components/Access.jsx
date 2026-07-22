const sceneryItems = [
  { img: '/assets/photos/garden-2.jpg', title: 'ひまわり畑', note: 'ホテルから車で約15分' },
  { img: '/assets/photos/image2.png', title: '洞爺湖ロングラン花火大会', note: '湖畔から観覧できます' },
  { img: '/assets/photos/hero-lake-sub.jpg', title: '洞爺湖遊覧船', note: '乗り場まで徒歩約8分' },
];

// シームレスな無限スクロールのためにリストを複製
const sceneryLoop = [...sceneryItems, ...sceneryItems];

export default function Access() {
  return (
    <section className="section access-section" id="access">
      <div className="access-hero">
        <img src="/assets/photos/image12.jpg" alt="ホテルグランドトーヤ周辺" />
      </div>

      <div className="section-heading">
        <p className="eyebrow"><span className="hanko" aria-hidden="true">道</span> Access</p>
        <h2 className="section-title">アクセス・周辺観光</h2>
      </div>

      <div className="access-grid">
        <div className="access-info">
          <ul className="access-list">
            <li><b>お車</b>：札幌市街から約2時間</li>
            <li><b>JR</b>：JR洞爺駅より送迎バス約20分</li>
            <li><b>高速バス</b>：札幌から約2時間30分</li>
            <li><b>新千歳空港</b>：空港連絡バスで約2時間</li>
          </ul>

          <p className="access-note">
            冬季は積雪・路面凍結のため、お車でお越しの際は冬用タイヤをご準備ください。
          </p>

          <a href="#" className="link-more">詳細はこちら →</a>
        </div>

        <div className="access-map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2938.515404605304!2d140.81545087618343!3d42.565581722092354!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5f9fe2bdc82d202d%3A0x94c12be9cc1e0e64!2z44Ob44OG44Or44Kw44Op44Oz44OJ44OI44O844Ok!5e0!3m2!1sja!2sjp!4v1784723174147!5m2!1sja!2sjp"
            loading="lazy"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            title="ホテルグランドトーヤ地図"
          ></iframe>
        </div>
      </div>

      <div className="access-scenery">
        <h3>四季折々の洞爺湖を楽しめる立地</h3>

        <p>
          ホテルグランドトーヤは洞爺湖畔に位置し、
          春の桜、夏のロングラン花火大会やひまわり畑、
          秋の紅葉、冬のイルミネーションなど、
          季節ごとの見どころへのアクセスにも便利です。
        </p>

        <div className="gallery-slider">
          <div className="gallery-track">
            {sceneryLoop.map((item, i) => (
              <figure key={i}>
                <div className="gallery-image">
                  <img src={item.img} alt="" />
                </div>
                <figcaption>
                  <h4>{item.title}</h4>
                  <p>{item.note}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
      <div className="scenery-button">
        <a href="#" className="link-more">周辺観光はこちら →</a>
      </div>
    </section>
  );
}
