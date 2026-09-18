# CONTEXT — Pie Task

Bảng thuật ngữ (glossary) của Pie Task. **Chỉ định nghĩa khái niệm — KHÔNG chứa chi tiết cài đặt.**
Chi tiết cài đặt / kiến trúc tính tiến độ nằm ở note nghiên cứu trong vault (`nghien-cuu-tinh-tien-do-pie-task.md`).

## Cấu trúc công việc

- **Board (bảng)** — một file Markdown chứa nhiều Lane + task. Mỗi board là một "profile" trỏ tới một `taskPath` riêng.
- **Lane (cột)** — một `## Heading` trong file board; nhóm task theo trạng thái / người / giai đoạn tuỳ board.
- **Task (công việc)** — một dòng `- [ ] **Tiêu đề**` dưới một Lane.
- **đầu việc (checklist item)** — mục con **nhị phân** (xong / chưa) của một task; dòng `- [ ]` thụt lề dưới task. KHÔNG có tiến độ %, tỷ trọng hay ngày riêng.
- **công việc con (child task)** — một task có **tiến độ %, tỷ trọng và ngày RIÊNG**, dùng để gộp lên task cha. *Khác đầu việc*: đầu việc chỉ xong/chưa; công việc con có % riêng. (Hiện Pie Task mới có đầu việc; công việc con là khái niệm mở rộng đang nghiên cứu.)
- **task cha** — task chứa đầu việc và/hoặc công việc con.

## Người & vai

- **Người phụ trách (owner)** — người/agent chịu trách nhiệm một task hoặc một đầu việc. Người = token `👤`, AI agent = `🤖`.
- **Reporter (người làm)** — vai *cập nhật* tiến độ. Nhu cầu: khai nhanh, đúng loại việc.
- **Viewer (quản lý)** — vai *nhìn* tiến độ. Nhu cầu: thấy độ lệch + gộp tổng nhiều task.

## Tiến độ

- **Tiến độ thực tế (actual)** — % công việc *đã làm thật*. Tính theo một trong các *cách tính tiến độ thực tế*.
- **Tiến độ dự kiến (planned/expected)** — % *lẽ ra phải đạt* tính đến hôm nay (đường baseline). KHÔNG phải việc đã làm — là mốc để so sánh.
- **Độ lệch (variance)** — `thực tế − dự kiến`. Âm = đang **trễ nhịp**; dương = vượt nhịp; ~0 = đúng nhịp.
- **Trễ sớm (early-behind)** — trạng thái độ lệch âm, cảnh báo *TRƯỚC* ngày kết thúc. Khác **Quá hạn** (chỉ báo *SAU* khi qua ngày kết thúc — đã muộn).

## Cách tính tiến độ thực tế (chọn per-task)

- **Theo % tự nhập** — reporter gõ % trực tiếp. Hợp việc mờ/sáng tạo.
- **Theo đầu việc** — % = (đầu việc xong) / (tổng đầu việc). Hợp deliverable nhiều bước.
- **Theo khối lượng** — % = (khối lượng đã làm) / (khối lượng mục tiêu). Cần **Đơn vị**. Hợp việc sản xuất/số lượng.
- **Theo tỷ trọng công việc con** — % cha = `Σ(tỷ trọng × % con) / Σ tỷ trọng`. Hợp việc lớn chia nhiều người.
- **Theo thời gian** — % = (thời gian đã trôi) / (tổng thời gian). *Trùng công thức với "dự kiến theo thời gian".*

## Cách tính tiến độ dự kiến (chọn per-task)

- **Theo tiến trình thời gian** — dự kiến % = `(hôm nay − ngày bắt đầu dự kiến) / (ngày kết thúc dự kiến − ngày bắt đầu dự kiến)`, kẹp `[0,1]`.
- **Theo tỷ trọng công việc con** — dự kiến % cha = `Σ(tỷ trọng × dự kiến % con) / Σ tỷ trọng`.
- **Theo trung bình công việc con** — dự kiến % cha = trung bình cộng dự kiến % các con.

## Khối lượng & đơn vị

- **Khối lượng (volume)** — số lượng mục tiêu cần hoàn thành của một task (khi tính theo khối lượng).
- **Đơn vị (unit)** — đơn vị đo khối lượng (Cái, Sản phẩm, Video…). Là một danh mục quản lý được (tạo mới được).
- **Tỷ trọng (weight)** — trọng số của một công việc con khi gộp % lên task cha.
