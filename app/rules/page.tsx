import Image from 'next/image';

const toc = [
  { id: 'section-1', label: '1. Đơn vị tổ chức' },
  { id: 'section-2', label: '2. Thời gian chương trình' },
  { id: 'section-3', label: '3. Đối tượng tham gia' },
  { id: 'section-4', label: '4. Điều kiện tham gia' },
  { id: 'section-5', label: '5. Cách thức tham gia' },
  { id: 'section-6', label: '6. Quy định về Slogan' },
  { id: 'section-7', label: '7. Trường hợp bài dự thi không hợp lệ' },
  { id: 'section-8', label: '8. Cơ cấu giải thưởng' },
  { id: 'section-9', label: '9. Tiêu chí chấm giải' },
  { id: 'section-10', label: '10. Ban giám khảo' },
  { id: 'section-11', label: '11. Thuế thu nhập cá nhân' },
  { id: 'section-12', label: '12. Quyền sở hữu tác phẩm' },
  { id: 'section-13', label: '13. Quyền của Ban tổ chức' },
  { id: 'section-14', label: '14. Liên hệ' },
];

export default function RulesPage() {
  return (
    <main>
      <section className="hero-brand">
        <div className="hero-media" aria-hidden="true">
          <Image src="/slogan/hero.jpg" alt="" fill sizes="(min-width: 40rem) 100vw, 0px" className="hero-media-img" />
          <div className="hero-media-overlay" />
        </div>
        <div className="page-frame section-stack">
          <div className="section-narrow">
            <p className="submission-meta">Cuộc Thi Sáng Tác Slogan Green Ruby Cruises 2026</p>
            <h1 className="hero-title">Thể lệ Cuộc thi &ldquo;Đặt Tên Cho Chuyến Đi&rdquo;.</h1>
            <p className="hero-lede">Cập nhật lần cuối: [ngày phát động]</p>
          </div>
        </div>
      </section>

      <section className="section section-cream">
        <div className="page-frame section-stack">
          <nav className="rules-toc" aria-label="Mục lục thể lệ">
            {toc.map((item) => (
              <a key={item.id} href={`#${item.id}`}>
                {item.label}
              </a>
            ))}
          </nav>

          <section className="rules-section" id="section-1">
            <h2>1. Đơn vị tổ chức</h2>
            <div className="rules-body">
              <p>
                Green Ruby Cruises (sau đây gọi là &ldquo;Ban tổ chức&rdquo;), địa chỉ tại [điền địa chỉ đăng ký
                kinh doanh].
              </p>
            </div>
          </section>

          <section className="rules-section" id="section-2">
            <h2>2. Thời gian chương trình</h2>
            <ul className="rules-list">
              <li>Thời gian nhận bài: từ 10/07/2026 đến hết ngày 31/07/2026 (23:59, giờ Việt Nam)</li>
              <li>
                Thời gian bình chọn công khai: mở song song với nhận bài, từ 15/07/2026 đến hết ngày 31/07/2026
                (23:59) — nộp sớm có nhiều thời gian nhận vote hơn
              </li>
              <li>
                Công bố kết quả và trao giải: sau khi Ban giám khảo chấm nội bộ, phát trực tiếp trên Facebook và
                TikTok của Green Ruby Cruises
              </li>
            </ul>
          </section>

          <section className="rules-section" id="section-3">
            <h2>3. Đối tượng tham gia</h2>
            <ul className="rules-list">
              <li>Công dân Việt Nam, cư trú tại Việt Nam, từ 18 tuổi trở lên</li>
              <li>
                Không áp dụng cho nhân viên, cộng tác viên, và người thân trực tiếp (vợ/chồng, cha mẹ, anh chị em
                ruột) của Green Ruby Cruises
              </li>
              <li>Mỗi người được submit tối đa 1 (một) bài dự thi duy nhất, xác thực qua địa chỉ email cá nhân</li>
            </ul>
          </section>

          <section className="rules-section" id="section-4">
            <h2>4. Điều kiện tham gia</h2>
            <div className="rules-body">
              <p>
                Người tham gia cần follow ít nhất 1 (một) trong các kênh mạng xã hội chính thức sau của Green Ruby
                Cruises:
              </p>
              <ul className="rules-list">
                <li>Facebook: facebook.com/greenrubycruises</li>
                <li>TikTok: @greenrubycruises</li>
                <li>Instagram: @greenrubyofficial</li>
                <li>YouTube: youtube.com/@greenrubycruises</li>
              </ul>
              <p>Không bắt buộc follow tất cả các kênh.</p>
            </div>
          </section>

          <section className="rules-section" id="section-5">
            <h2>5. Cách thức tham gia</h2>
            <ol className="rules-list">
              <li>Truy cập trang dự thi: greenrubycruises.com/slogan/join</li>
              <li>Điền đầy đủ thông tin: Họ tên, Email, kênh đã follow, Slogan dự thi, Giải thích ý nghĩa</li>
              <li>Nhấn &ldquo;Gửi bài dự thi&rdquo;</li>
              <li>Nhập mã OTP 6 số được gửi đến email đã đăng ký để xác nhận</li>
              <li>Sau khi xác nhận thành công, bài dự thi được ghi nhận và có URL riêng để chia sẻ</li>
            </ol>
          </section>

          <section className="rules-section" id="section-6">
            <h2>6. Quy định về Slogan</h2>
            <ul className="rules-list">
              <li>Ngôn ngữ: Tiếng Việt</li>
              <li>Độ dài: Tối đa 10 chữ</li>
              <li>
                Nội dung: Phản ánh tinh thần của Green Ruby Cruises — sang trọng, có trách nhiệm với môi trường,
                trải nghiệm đích thực trên vịnh
              </li>
              <li>
                Tính nguyên gốc: 100% sáng tác cá nhân, chưa được sử dụng thương mại dưới bất kỳ hình thức nào
                trước đó
              </li>
              <li>Không vi phạm: thuần phong mỹ tục, luật sở hữu trí tuệ, quyền của bên thứ ba</li>
            </ul>
          </section>

          <section className="rules-section" id="section-7">
            <h2>7. Trường hợp bài dự thi không hợp lệ</h2>
            <ul className="rules-list">
              <li>Slogan vượt quá 10 chữ hoặc không phải tiếng Việt</li>
              <li>Sao chép hoặc cải biên từ slogan đã tồn tại</li>
              <li>Chứa ngôn từ phản cảm, xúc phạm, hoặc vi phạm pháp luật</li>
              <li>Gửi nhiều hơn 1 bài từ cùng một email (chỉ bài hợp lệ đầu tiên được tính)</li>
              <li>Thông tin liên lạc không hợp lệ hoặc không thể xác minh qua OTP</li>
            </ul>
          </section>

          <section className="rules-section" id="section-8">
            <h2>8. Cơ cấu giải thưởng</h2>
            <div style={{ overflowX: 'auto' }}>
              <table className="rules-table">
                <thead>
                  <tr>
                    <th>Giải</th>
                    <th>Phần thưởng</th>
                    <th>Giá trị</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Giải Nhất</td>
                    <td>1 cặp vé du thuyền Green Ruby 2N1Đ (2 người)</td>
                    <td>20.000.000đ</td>
                  </tr>
                  <tr>
                    <td>Giải Được Yêu Thích</td>
                    <td>1 cặp vé du thuyền Green Ruby 2N1Đ (2 người)</td>
                    <td>20.000.000đ</td>
                  </tr>
                  <tr>
                    <td>Giải Nhì</td>
                    <td>1 vé du thuyền Green Ruby 2N1Đ (1 người)</td>
                    <td>10.000.000đ</td>
                  </tr>
                  <tr>
                    <td>Giải Ba</td>
                    <td>Phiếu ưu đãi 50% cho 1 chuyến bất kỳ</td>
                    <td>~5.000.000đ</td>
                  </tr>
                  <tr>
                    <td>20 Giải Khuyến Khích</td>
                    <td>Phiếu ưu đãi 30% cho 1 chuyến bất kỳ</td>
                    <td>~2.000.000đ/suất</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              Vé có giá trị sử dụng cho các chuyến khởi hành từ tháng 12/2026 đến hết tháng 6/2027. Không áp dụng
              đồng thời với các ưu đãi khác. Phiếu ưu đãi không có giá trị quy đổi thành tiền mặt.
            </p>
          </section>

          <section className="rules-section" id="section-9">
            <h2>9. Tiêu chí chấm giải</h2>
            <p>
              <strong>Giải Nhất, Nhì, Ba</strong> (do Ban giám khảo quyết định):
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table className="rules-table">
                <thead>
                  <tr>
                    <th>Tiêu chí</th>
                    <th>Trọng số</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Phù hợp thương hiệu</td>
                    <td>40%</td>
                  </tr>
                  <tr>
                    <td>Súc tích, dễ nhớ</td>
                    <td>30%</td>
                  </tr>
                  <tr>
                    <td>Sáng tạo, độc đáo</td>
                    <td>30%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              <strong>Tiêu chí phụ (chỉ áp dụng khi 2 bài dự thi có điểm bằng nhau):</strong> Trong trường hợp Ban
              giám khảo chấm điểm bằng nhau giữa 2 hoặc nhiều bài dự thi, bài dự thi của người đã follow đầy đủ cả
              4 kênh mạng xã hội chính thức (Facebook, TikTok, Instagram, YouTube) sẽ được ưu tiên xếp hạng cao
              hơn.
            </p>
            <p>
              <strong>Giải Được Yêu Thích:</strong> Bình chọn mở ngay khi bài dự thi được duyệt và kéo dài đến hết
              thời gian nhận bài (23:59 ngày 31/07/2026). Giải Được Yêu Thích được xác định bằng tổng lượt vote
              công khai hợp lệ tính đến thời điểm đóng bình chọn. Bài dự thi nộp sớm sẽ có nhiều thời gian nhận
              bình chọn hơn — hãy tham gia sớm để tăng cơ hội.
            </p>
          </section>

          <section className="rules-section" id="section-10">
            <h2>10. Ban giám khảo</h2>
            <ul className="rules-list">
              <li>Đại diện Green Ruby Cruises</li>
              <li>[Tên khách mời 1]</li>
              <li>[Tên khách mời 2]</li>
            </ul>
            <p>Quyết định của Ban giám khảo là quyết định cuối cùng đối với Giải Nhất, Nhì, Ba.</p>
          </section>

          <section className="rules-section" id="section-11">
            <h2>11. Thuế thu nhập cá nhân</h2>
            <p>
              Theo quy định pháp luật hiện hành, giải thưởng có giá trị vượt trên 10.000.000đ phải chịu thuế thu
              nhập cá nhân 10%. Green Ruby Cruises có trách nhiệm khấu trừ thuế trước khi trao giải đối với Giải
              Nhất và Giải Được Yêu Thích. Giá trị giải thưởng công bố ở trên [đã bao gồm/chưa bao gồm — điền theo
              quyết định cuối cùng] thuế TNCN.
            </p>
          </section>

          <section className="rules-section" id="section-12">
            <h2>12. Quyền sở hữu tác phẩm</h2>
            <ul className="rules-list">
              <li>
                Bằng việc gửi bài dự thi, người tham gia xác nhận đây là sáng tác gốc và không vi phạm quyền sở
                hữu trí tuệ của bên thứ ba
              </li>
              <li>
                Green Ruby Cruises có quyền sử dụng toàn bộ bài dự thi (slogan và giải thích) cho mục đích truyền
                thông thương hiệu
              </li>
              <li>
                Với bài đoạt giải, Green Ruby Cruises có toàn quyền sử dụng thương mại không giới hạn thời gian và
                địa lý sau khi thông báo cho người thắng giải
              </li>
              <li>
                Với bài không đoạt giải nhưng được sử dụng, Green Ruby Cruises sẽ xin phép tác giả trước qua email
              </li>
            </ul>
          </section>

          <section className="rules-section" id="section-13">
            <h2>13. Quyền của Ban tổ chức</h2>
            <ul className="rules-list">
              <li>Loại bỏ bất kỳ bài dự thi nào vi phạm thể lệ mà không cần thông báo trước</li>
              <li>
                Điều chỉnh thể lệ trong trường hợp bất khả kháng, có thông báo công khai trên các kênh chính thức
              </li>
              <li>Hoãn hoặc hủy chương trình nếu có lý do khách quan</li>
              <li>
                Tạm khóa bài dự thi khỏi bảng xếp hạng nếu phát hiện dấu hiệu gian lận vote, trong thời gian chờ
                xác minh
              </li>
            </ul>
          </section>

          <section className="rules-section" id="section-14">
            <h2>14. Liên hệ</h2>
            <p>
              Mọi thắc mắc về chương trình, vui lòng liên hệ: [email hỗ trợ] hoặc qua fanpage chính thức của Green
              Ruby Cruises.
            </p>
          </section>

          <p className="submission-meta">Green Ruby Cruises — Luxury Without Trace</p>
        </div>
      </section>
    </main>
  );
}
