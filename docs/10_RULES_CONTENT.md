# Nội dung Thể lệ — Rút gọn (trang chủ) + Đầy đủ (trang /rules)

## Việc Cursor cần code

1. Component `components/prize-rules-tabs.tsx` — dùng đúng nội dung
   "BẢN RÚT GỌN" bên dưới cho tab "Thể lệ tham gia" trên trang chủ
2. Trang `app/rules/page.tsx` — dùng đúng nội dung "BẢN ĐẦY ĐỦ" bên dưới
3. Link "Xem đầy đủ thể lệ chi tiết" ở cuối tab rút gọn trỏ tới `/rules`
4. KHÔNG tự viết lại nội dung — dùng đúng văn bản dưới đây, chỉ style
   theo design system đã có

---

## BẢN RÚT GỌN — Tab "Thể lệ tham gia" trên trang chủ

Hiển thị dạng danh sách đánh số 01-06, mỗi mục 1-2 câu ngắn:

```
01. Đối tượng
Công dân Việt Nam từ 18 tuổi trở lên. Không áp dụng cho nhân viên,
cộng tác viên và người thân trực tiếp của Green Ruby Cruises.

02. Điều kiện tham gia
Follow ít nhất 1 trong 4 kênh: Facebook, TikTok, Instagram, YouTube
của Green Ruby Cruises.

03. Slogan dự thi
Tiếng Việt, tối đa 10 chữ, là sáng tác gốc, chưa từng công bố thương
mại dưới bất kỳ hình thức nào.

04. Mỗi người một bài
Mỗi email chỉ được gửi 1 bài dự thi duy nhất, xác thực qua email OTP
trước khi bài chính thức được ghi nhận.

05. Cách chọn người thắng
Giải Nhất, Nhì, Ba do Ban giám khảo chấm. Giải Được Yêu Thích do cộng
đồng bình chọn công khai trong 3 ngày sau khi kết thúc nhận bài.

06. Bản quyền
Green Ruby Cruises có quyền sử dụng slogan đoạt giải cho mục đích
truyền thông thương hiệu, không giới hạn thời gian.
```

Link cuối: "Xem đầy đủ thể lệ chi tiết →" → `/rules`

---

## BẢN ĐẦY ĐỦ — Trang `/rules`

Trang này là văn bản pháp lý chính thức, cần đầy đủ, có cấu trúc heading
rõ ràng. Dùng layout đơn giản: nền cream, text đen/forest green, không
cần trang trí nhiều — đây là trang tra cứu, không phải trang bán hàng.

```markdown
# Thể lệ Cuộc thi "Đặt Tên Cho Chuyến Đi"
## Cuộc Thi Sáng Tác Slogan Green Ruby Cruises 2026

Cập nhật lần cuối: [ngày phát động]

---

## 1. Đơn vị tổ chức

Green Ruby Cruises (sau đây gọi là "Ban tổ chức"), địa chỉ tại [điền
địa chỉ đăng ký kinh doanh].

## 2. Thời gian chương trình

- Thời gian nhận bài: [ngày bắt đầu] đến [ngày kết thúc], 14 ngày
- Thời gian bình chọn công khai: [ngày] đến [ngày], 3 ngày liên tiếp
  ngay sau khi kết thúc nhận bài
- Công bố kết quả và trao giải: [ngày], phát trực tiếp trên Facebook
  và TikTok của Green Ruby Cruises

## 3. Đối tượng tham gia

- Công dân Việt Nam, cư trú tại Việt Nam, từ 18 tuổi trở lên
- Không áp dụng cho nhân viên, cộng tác viên, và người thân trực tiếp
  (vợ/chồng, cha mẹ, anh chị em ruột) của Green Ruby Cruises
- Mỗi người được submit tối đa 1 (một) bài dự thi duy nhất, xác thực
  qua địa chỉ email cá nhân

## 4. Điều kiện tham gia

Người tham gia cần follow ít nhất 1 (một) trong các kênh mạng xã hội
chính thức sau của Green Ruby Cruises:

- Facebook: facebook.com/greenrubycruises
- TikTok: @greenrubycruises
- Instagram: @greenrubyofficial
- YouTube: youtube.com/@greenrubycruises

Không bắt buộc follow tất cả các kênh.

## 5. Cách thức tham gia

1. Truy cập trang dự thi: greenrubycruises.com/slogan/join
2. Điền đầy đủ thông tin: Họ tên, Email, kênh đã follow, Slogan dự thi,
   Giải thích ý nghĩa
3. Nhấn "Gửi bài dự thi"
4. Nhập mã OTP 6 số được gửi đến email đã đăng ký để xác nhận
5. Sau khi xác nhận thành công, bài dự thi được ghi nhận và có URL
   riêng để chia sẻ

## 6. Quy định về Slogan

- Ngôn ngữ: Tiếng Việt
- Độ dài: Tối đa 10 chữ
- Nội dung: Phản ánh tinh thần của Green Ruby Cruises — sang trọng,
  có trách nhiệm với môi trường, trải nghiệm đích thực trên vịnh
- Tính nguyên gốc: 100% sáng tác cá nhân, chưa được sử dụng thương mại
  dưới bất kỳ hình thức nào trước đó
- Không vi phạm: thuần phong mỹ tục, luật sở hữu trí tuệ, quyền của
  bên thứ ba

## 7. Trường hợp bài dự thi không hợp lệ

- Slogan vượt quá 10 chữ hoặc không phải tiếng Việt
- Sao chép hoặc cải biên từ slogan đã tồn tại
- Chứa ngôn từ phản cảm, xúc phạm, hoặc vi phạm pháp luật
- Gửi nhiều hơn 1 bài từ cùng một email (chỉ bài hợp lệ đầu tiên được
  tính)
- Thông tin liên lạc không hợp lệ hoặc không thể xác minh qua OTP

## 8. Cơ cấu giải thưởng

| Giải | Phần thưởng | Giá trị |
|------|-------------|---------|
| Giải Nhất | 1 cặp vé du thuyền Green Ruby 2N1Đ (2 người) | 20.000.000đ |
| Giải Được Yêu Thích | 1 cặp vé du thuyền Green Ruby 2N1Đ (2 người) | 20.000.000đ |
| Giải Nhì | 1 vé du thuyền Green Ruby 2N1Đ (1 người) | 10.000.000đ |
| Giải Ba | Phiếu ưu đãi 50% cho 1 chuyến bất kỳ | ~5.000.000đ |
| 20 Giải Khuyến Khích | Phiếu ưu đãi 30% cho 1 chuyến bất kỳ | ~2.000.000đ/suất |

Vé có giá trị sử dụng cho các chuyến khởi hành từ tháng 10/2026 đến
hết tháng 3/2027. Không áp dụng đồng thời với các ưu đãi khác. Phiếu
ưu đãi không có giá trị quy đổi thành tiền mặt.

## 9. Tiêu chí chấm giải

**Giải Nhất, Nhì, Ba** (do Ban giám khảo quyết định):

| Tiêu chí | Trọng số |
|----------|---------|
| Phù hợp thương hiệu | 40% |
| Súc tích, dễ nhớ | 30% |
| Sáng tạo, độc đáo | 30% |

**Giải Được Yêu Thích:** xác định bằng tổng lượt vote công khai trên
trang greenrubycruises.com/slogan trong 3 ngày bình chọn. Không tính
lượt vote gian lận hoặc bất thường theo đánh giá của Ban tổ chức.

## 10. Ban giám khảo

- Đại diện Green Ruby Cruises
- [Tên khách mời 1]
- [Tên khách mời 2]

Quyết định của Ban giám khảo là quyết định cuối cùng đối với Giải
Nhất, Nhì, Ba.

## 11. Thuế thu nhập cá nhân

Theo quy định pháp luật hiện hành, giải thưởng có giá trị vượt trên
10.000.000đ phải chịu thuế thu nhập cá nhân 10%. Green Ruby Cruises có
trách nhiệm khấu trừ thuế trước khi trao giải đối với Giải Nhất và
Giải Được Yêu Thích. Giá trị giải thưởng công bố ở trên [đã bao gồm/
chưa bao gồm — điền theo quyết định cuối cùng] thuế TNCN.

## 12. Quyền sở hữu tác phẩm

- Bằng việc gửi bài dự thi, người tham gia xác nhận đây là sáng tác
  gốc và không vi phạm quyền sở hữu trí tuệ của bên thứ ba
- Green Ruby Cruises có quyền sử dụng toàn bộ bài dự thi (slogan và
  giải thích) cho mục đích truyền thông thương hiệu
- Với bài đoạt giải, Green Ruby Cruises có toàn quyền sử dụng thương
  mại không giới hạn thời gian và địa lý sau khi thông báo cho người
  thắng giải
- Với bài không đoạt giải nhưng được sử dụng, Green Ruby Cruises sẽ
  xin phép tác giả trước qua email

## 13. Quyền của Ban tổ chức

- Loại bỏ bất kỳ bài dự thi nào vi phạm thể lệ mà không cần thông báo
  trước
- Điều chỉnh thể lệ trong trường hợp bất khả kháng, có thông báo công
  khai trên các kênh chính thức
- Hoãn hoặc hủy chương trình nếu có lý do khách quan
- Tạm khóa bài dự thi khỏi bảng xếp hạng nếu phát hiện dấu hiệu gian
  lận vote, trong thời gian chờ xác minh

## 14. Liên hệ

Mọi thắc mắc về chương trình, vui lòng liên hệ: [email hỗ trợ] hoặc
qua fanpage chính thức của Green Ruby Cruises.

---

Green Ruby Cruises — Luxury Without Trace
```

## Ghi chú cho Cursor

- Các đoạn [điền ...] trong bản đầy đủ là placeholder — GIỮ NGUYÊN dấu
  ngoặc vuông trong code, KHÔNG tự bịa nội dung, để tôi tự điền tay
  trước khi publish
- Trang `/rules` nên có mục lục nhảy nhanh (anchor link) tới từng mục
  1-14 nếu danh sách dài, dùng heading `id` + link nội bộ
- Không cần animation hay tab trên trang `/rules` — đây là trang đọc
  tuyến tính, style đơn giản, ưu tiên dễ đọc dễ tìm hơn là thẩm mỹ
