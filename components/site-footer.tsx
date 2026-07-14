import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-frame footer-grid">
        <div>
          <p className="wordmark">Green Ruby Cruises</p>
          <p className="section-lede">#GreenRubySlogan · #DatTenChoChuyenDi · #SangTrongKhongDauVet</p>
        </div>
        <nav className="footer-links" aria-label="Liên kết cuộc thi">
          <Link className="footer-link" href="/join">
            Tham gia
          </Link>
          <Link className="footer-link" href="/wall">
            Danh sách dự thi
          </Link>
          <Link className="footer-link" href="/results">
            Kết quả
          </Link>
          <Link className="footer-link" href="/rules">
            Thể lệ
          </Link>
        </nav>
      </div>
    </footer>
  );
}
