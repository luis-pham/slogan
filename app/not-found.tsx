import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="page-frame section">
      <h1 className="section-title">Không tìm thấy bài dự thi.</h1>
      <p className="section-lede">URL chưa chính xác hoặc bài dự thi không còn công khai.</p>
      <div className="hero-actions" style={{ marginTop: 'var(--space-lg)' }}>
        <Link className="button button-primary" href="/wall">
          Xem bảng bài dự thi
        </Link>
      </div>
    </main>
  );
}
