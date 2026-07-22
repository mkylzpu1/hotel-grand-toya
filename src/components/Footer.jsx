export default function Footer() {
  return (
    <>
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="logo" style={{ marginBottom: '16px' }}>
              <span className="hanko" aria-hidden="true" style={{ borderColor: '#fff', color: '#fff' }}>湖</span>
              <span className="logo-text light">HOTEL<br />GRAND TOYA</span>
            </div>
            <p>〒049-XXXX 北海道虻田郡洞爺湖町XXXX<br />TEL: 0142-XX-XXXX</p>
          </div>
          <div className="footer-col">
            <h4>ご利用案内</h4>
            <a href="#rooms">客室</a>
            <a href="#onsen">温泉</a>
            <a href="#food">お料理</a>
            <a href="#access">アクセス</a>
          </div>
          <div className="footer-col">
            <h4>サイト情報</h4>
            <a href="#">FAQ</a>
            <a href="#">お客様の声</a>
            <a href="#">採用情報</a>
            <a href="#">会社情報</a>
            <a href="#">プライバシーポリシー</a>
            <a href="#">特定商取引法に基づく表記</a>
          </div>
          <div className="footer-col">
            <h4>ご予約</h4>
            <a href="https://reserve.example.com/grandtoya" target="_blank" rel="noopener">外部予約サイトへ</a>
            <a href="tel:0142-XX-XXXX">0142-XX-XXXX</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Hotel Grand Toya</p>
        </div>
      </footer>

      <div className="mobile-cta-bar">
        <a href="tel:0142-XX-XXXX" className="mobile-cta mobile-cta--tel">電話</a>
        <a
          href="https://reserve.example.com/grandtoya"
          className="mobile-cta mobile-cta--reserve"
          target="_blank"
          rel="noopener"
        >
          ご予約はこちら
        </a>
      </div>
    </>
  );
}
