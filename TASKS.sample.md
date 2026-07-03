<!--
  ╭──────────────────────────────────────────────────────────────────────╮
  │  Pie Tasks — FILE MẪU (TASKS.md)                                       │
  ╰──────────────────────────────────────────────────────────────────────╯
  Cách dùng: copy file này ra thư mục gốc vault, đổi tên thành TASKS.md
  (hoặc trỏ đường dẫn ở Settings → Pie Tasks), rồi mở board bằng icon ✓
  ở thanh ribbon bên trái.

  • Mỗi "## Tiêu đề" = 1 LANE (cột). Emoji đầu tiêu đề = icon lane.
  • Mỗi "- [ ] **Tên việc**" = 1 THẺ việc. Thêm các token vào cuối dòng:

      `👤 Tên`            người phụ trách (nhiều người: `👤 An, Bình`)
      📅 2026-07-05        ngày / hạn (định dạng YYYY-MM-DD)
      `⏰ 09:00–11:00`     khung giờ
      `Đang làm`           trạng thái — dùng ĐÚNG 1 trong các nhãn:
                           Đang chờ · Đang làm · Chờ duyệt · Hoàn thành ·
                           Chưa hoàn thành · Không hoàn thành · Tạm dừng ·
                           Hủy · Dự kiến · Đã đóng · Lỗi
      `60%`                tiến độ
      `next: ...`          việc kế tiếp (mô tả 1 dòng)
      `output: [[note]]`   tài liệu/file liên quan (nhiều: [[a]], [[b]])
      `id:12345`           mã tham chiếu (map với hệ thống ngoài khi đồng bộ)
      🔴                   đánh dấu ưu tiên cao

  • Việc XONG: đổi "- [ ]" thành "- [x]" và thêm "✅ 2026-07-01".
  • Việc con (checklist): thụt lề rồi "- [ ] bước ...".
  • Emoji đầu lane quyết định icon (📌 cờ · 🤖 bot · 📄 tài liệu · 📋 danh sách ·
    📅 lịch · ⏳ chờ · ✅ hoàn thành · 📁 nhóm · 👥 đội · 📊 thống kê · 🔗 liên kết).
  • Dùng kèm plugin Kanban? Thêm dòng "kanban-plugin: board" vào frontmatter.

  → Xoá hết các thẻ mẫu bên dưới rồi thêm việc của bạn (hoặc bấm "+ Thêm việc").
-->

## 📅 Lên lịch

- [ ] **Họp planning đầu tuần** 📅 2026-07-06 `⏰ 09:00–10:00` `Đang chờ`


## 📌 Đang làm

- [ ] **Viết bài blog "Bắt đầu với PKM"** `👤 An` 📅 2026-07-05 `⏰ 14:00–16:00` `Đang làm` 🔴
  - [x] Lên dàn ý
  - [ ] Viết bản nháp
  - [ ] Chèn ảnh minh hoạ
- [ ] **Dựng landing page ra mắt** `👤 An, Bình` 📅 2026-07-08 `Đang làm` `60%` `next: xong phần hero rồi làm form đăng ký`


## 🤖 Đội ngũ AI

- [ ] **Bot — Tổng hợp báo cáo số liệu tuần** `owner: Bot` `next: kéo dữ liệu → dựng bảng → xuất PDF`
- [ ] **Bot — Job đồng bộ bị lỗi cần xem** `owner: Bot` `Lỗi` `output: [[log-loi-mau]]`


## 📋 Chờ duyệt

- [ ] **Thiết kế poster sự kiện** `👤 Chi` 📅 2026-07-03 `Chờ duyệt` `100%` `output: [[poster-su-kien]]`


## 📁 Việc để dành

- [ ] **Nghiên cứu công cụ automation mới** `Dự kiến`


## ✅ Hoàn thành

- [x] **Lên kế hoạch nội dung tháng 7** `👤 An` 📅 2026-06-30 `output: [[ke-hoach-thang-7]]` ✅ 2026-07-01
