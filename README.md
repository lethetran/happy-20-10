# 💗 Gửi em · 20/10

Một trang web nhỏ tặng người yêu nhân ngày Phụ nữ Việt Nam 20/10: màu hồng, có mèo Mun, có thư, có ảnh kỷ niệm và vài trò vui.

**Link:** https://lethetran.github.io/happy-20-10/

## Trang web có gì?

- **Mèo Mun** ở đầu trang: mắt dõi theo chuột, bấm vào để vuốt ve (có tiếng grừ grừ), đếm số lần vuốt.
- **Lá thư** mở ra bằng hiệu ứng phong bì.
- **Sáu tấm thẻ** lật để đọc điều anh thương ở em.
- **Dây ảnh kỷ niệm**: 14 tấm ảnh treo trên dây, kéo ngang để xem, bấm vào để mở ảnh lớn kèm lời nhắn riêng. Có nút chuyển ảnh, phím ← → và vuốt ngang trên điện thoại.
- **Game "Hứng trái tim cho Mun"**: 25 giây, lưu kỷ lục trong máy.
- **Phiếu quà cào**: cào lớp giấy bạc để mở món quà bí mật.
- **Máy khen** + pháo hoa giấy, nhạc nền nhẹ (bật/tắt bằng nút Nhạc).

Trang tự co giãn cho điện thoại, máy tính bảng và laptop; tôn trọng cài đặt giảm chuyển động của hệ điều hành.

## Chạy thử trên máy

```bash
python3 -m http.server 8765
# mở http://localhost:8765
```

## Đổi tên người nhận

Mở `script.js`, sửa 2 dòng đầu:

```js
const CONFIG = {
  name: "em yêu",   // tên người nhận
  sender: "anh",    // tên người gửi
};
```

Tên sẽ tự thay vào trang bìa, phong bì, cuối thư và footer.

## Sửa lời chúc

- Thư: sửa phần `.letter-paper` trong `index.html`.
- Ảnh: mỗi ảnh là một thẻ `.photo-card`, sửa `data-title` (tiêu đề) và `data-caption` (lời nhắn).
- Lời khen: sửa mảng `list` trong mục `compliments()` ở `script.js`.

## Thêm ảnh mới

1. Đưa ảnh đã nén vào `assets/photos/` (ảnh lớn) và `assets/photos/thumbs/` (bản nhỏ).
2. Copy một khối `.photo-card` trong `index.html`, đổi `data-full`, `data-title`, `data-caption` và `src` của ảnh thu nhỏ.

Mẹo nén ảnh bằng macOS:

```bash
sips -Z 1400 -s format jpeg -s formatOptions 78 anh-goc.jpg --out assets/photos/15.jpg
sips -Z 480  -s format jpeg -s formatOptions 70 anh-goc.jpg --out assets/photos/thumbs/15.jpg
```

## Cấu trúc

```
index.html          # toàn bộ nội dung
style.css           # giao diện hồng, responsive
script.js           # mèo, game, lightbox, nhạc, hiệu ứng
assets/photos/      # ảnh lớn (14 ảnh)
assets/photos/thumbs/  # ảnh nhỏ cho dây ảnh
```

Trang tĩnh, không cần build, không thư viện ngoài — chỉ cần mở là chạy.
