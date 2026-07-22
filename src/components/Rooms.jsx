export default function Rooms() {
  return (
    <section className="section photo-section" id="rooms">
      <div className="split-section">
        <div className="split-text">
          <p className="eyebrow"><span className="hanko" aria-hidden="true">室</span>Rooms</p>
          <h2 className="section-title">旅のスタイルに合わせて選べる、多彩な客室。</h2>
          <p className="section-lead">
            和室・洋室に加え、大人数でご利用いただける大広間もご用意しています。<br />
            お一人様やご夫婦・ご家族での旅行はもちろん、修学旅行やスポーツ合宿、団体旅行まで、さまざまなご宿泊に対応いたします。
          </p>
          <a href="#" className="link-more">客室のご案内 →</a>
        </div>
        <div className="split-gallery mosaic-a">
          <figure>
            <img src="/assets/photos/image3.png" alt="和室客室" />
            <figcaption>和室</figcaption>
          </figure>
          <figure>
            <img src="/assets/photos/facility-4.jpg" alt="客室からの眺め" />
          </figure>
          <figure>
            <img src="/assets/photos/facility-3.jpg" alt="ホテル外観（夕景）" />
            <figcaption>ホテル外観</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
