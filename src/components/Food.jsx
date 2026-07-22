export default function Food() {
  return (
    <section className="section food-section" id="food">
      <div className="food-grid">
        <div className="food-text">
          <p className="eyebrow"><span className="hanko" aria-hidden="true">膳</span>Dinner</p>
          <h2 className="section-title">北海道の味覚を、<br />ゆったりと味わう。</h2>
          <p>
            ご夕食は会席膳、朝は和朝食をご用意。<br />
            ご宿泊とともに、夕食・朝食をお楽しみいただけるプランをご用意しております。温泉とお食事で、ゆったりとしたひとときをお過ごしください。
          </p>
          <a href="#" className="link-more">お料理のご案内 →</a>
        </div>
        <div className="food-photos">
          <img src="/assets/photos/lobby-1.jpg" alt="夕食のお料理" />
          <img src="/assets/photos/lobby-2.jpg" alt="お食事の一品" />
        </div>
      </div>
    </section>
  );
}
