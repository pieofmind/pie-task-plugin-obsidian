# Changelog — Pie Tasks

Định dạng theo [Keep a Changelog](https://keepachangelog.com/) + [SemVer](https://semver.org/).

## [2.1.0]

### Added
- **Đa ngôn ngữ (i18n) — Tiếng Việt + English**, đổi trong Settings → Pie Tasks → Ngôn ngữ. Toàn bộ giao diện (view, nút, drawer, settings, modal, thông báo, lệnh) dịch qua hàm `tr()` + dict EN; mặc định Tiếng Việt. **Dữ liệu trong file KHÔNG đổi** — tên lane, tiêu đề việc và nhãn trạng thái on-disk vẫn giữ nguyên (chỉ *hiển thị* được dịch), nên không phá format/sync 1Office & Google Tasks.

## [2.0.3]

### Added
- **Kéo thả đổi thứ tự task trong lane**: kéo card lên/xuống, các card khác **nhường chỗ live** theo con trỏ; thả để chốt, huỷ (Esc) tự hoàn tác. Kéo sang lane khác cũng thả **đúng vị trí**. Ghi thẳng thứ tự vào file, giữ nguyên checklist con của task.

### Fixed
- Viền chọn lane chuyển sang **inset** — không còn bị khung/bo của board cắt cụt (trước hiện lòi 4 góc).
- Ảnh đại diện profile (chip rail) **phủ kín khung** trên Obsidian/iOS (chống rule `img{height:auto}` làm ảnh dọc không đầy khung).

## [2.0.0]

### Added
- **🚀 Thiết lập nhanh (one-click)** trong Settings: dựng cả hệ thống trong 1 lần — bảng công việc (`TASKS.md`), file nhân sự (`People.md`), **Dashboard dự án** (`Dashboard Projects.base` + cột tiến độ), **Dashboard việc con** (Dataview). Modal xem trước file nào **đã có / sẽ tạo**; **chỉ tạo file còn thiếu, không đè**; chọn được thư mục dự án. Seed từ file mẫu `TASKS.sample.md` / `People.sample.md`.
- **Đa-profile (nhiều bảng)**: quản lý công việc theo project — mỗi bảng đọc 1 file `.md` riêng (task1.md / task2.md…). Chuyển bảng bằng **chip ở góc trên-trái** (thay logo "P") → popover chọn bảng.
- **CRUD bảng đầy đủ**: thêm / sửa / xoá / đổi thứ tự; mỗi bảng có **màu riêng** + **icon 3 kiểu** (chữ cái đầu tên / icon SVG dựng sẵn / **ảnh trong vault** làm avatar, có viền frame), nhớ **riêng** trạng thái (lane thu gọn, màu lane, view mode). Xoá bảng KHÔNG xoá file `.md`.
- Modal "Quản lý bảng" (Settings → Quản lý bảng, hoặc popover → ⚙ Quản lý).
- File nhân sự **theo từng bảng** (để trống → dùng file nhân sự mặc định chung).
- **Field "Dự án"** trong task drawer: gắn việc vào 1 dự án (chọn từ note có `subtype`/`type: project` — 17 dự án trong `3.PROCESS/02.PROJECTS` xếp lên đầu), lưu token **Dataview inline-field** `[project:: [[...]]]` vào dòng task, hiện **chip bấm-mở-được** ở đầu drawer; gỡ được. (Đọc ngược cả token cũ `project: [[...]]`.)
- **Rollup task con → Dashboard Projects.base**: plugin tự đếm task theo từng dự án (quét mọi bảng) và ghi `task_total / task_done / task_error / task_progress` vào frontmatter note dự án → hiện thành **cột "Việc (xong/tổng)", "Tiến độ %", "Task lỗi"** trong `Dashboard Projects.base`. Cập nhật debounce khi TASKS.md đổi.
- **Dashboard drill-down** `viec-con-theo-du-an.md`: gom task con thật theo từng dự án (Dataview, tick trực tiếp, live). Setting **"Phạm vi bảng việc con"**: *Tất cả task gắn dự án trong vault* ↔ *Chỉ task từ các bảng Pie Tasks* (scope `FROM` vào đúng file bảng) — plugin tự viết lại query trong vùng marker của note.

### Changed
- Settings chuyển từ 1 bảng cố định → danh sách `profiles[]` + `activeId`. **Tự migrate**: người dùng bản 1.x giữ nguyên bảng hiện tại (đường dẫn, lane thu gọn, màu) thành "Bảng chính".

## [1.0.0]

- Bảng công việc từ file Markdown: **board / list / lịch / thống kê**.
- Đọc/ghi thẳng vào file: tick xong, đổi trạng thái, kéo-thả card & lane, thêm/sửa/xoá việc và lane.
- Lane có **icon + màu** tuỳ chọn; 12 trạng thái 1Office (kể cả **Lỗi** đỏ).
- Field thời gian (⏰ giờ), deadline, người phụ trách (picker từ file nhân sự), checklist việc con, **tài liệu/file liên quan** (`output: [[...]]`) bấm mở được.
- Lọc theo người / trạng thái / khoảng ngày tuỳ chọn; theo theme Obsidian; tối ưu **mobile**.
