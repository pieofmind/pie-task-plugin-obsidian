# 0001 — Tiến độ v1: derived-live, không thêm token trạng thái

- Trạng thái: Accepted
- Ngày: 2026-09-18
- Bối cảnh: `../../CONTEXT.md` (glossary), `nghien-cuu-tinh-tien-do-pie-task.md` (vault, nghiên cứu đầy đủ)

## Bối cảnh

Pie Task cần hiển thị **tiến độ thực tế**, **tiến độ dự kiến** và **độ lệch** (cảnh báo "trễ sớm") cho board thủ công / khách hàng dùng độc lập. v1 giới hạn ở: % tự nhập + đầu việc (thực tế), dự kiến-theo-thời-gian (từ `🛫`/`📅`), và cột Tiến độ tô màu độ lệch trong List view.

## Quyết định

1. **Derived-live**: tiến độ **tính khi render**, KHÔNG cache. Markdown là nguồn sự thật. Nguồn dữ liệu chỉ gồm token đã có: `` `N%` `` (thủ công), `t.check` (đầu việc), `🛫`/`📅` (ngày).
2. **Không thêm token `pmode`** trong v1. Cách tính thực tế suy theo heuristic ít ma sát:
   - `t.done` → 100%.
   - có `` `N%` `` → **thủ công** (đè checklist — ý người dùng tường minh).
   - else có đầu việc → **theo đầu việc** = done/total.
   - else → không có tiến độ.
3. **Dự kiến chỉ tính khi có ĐỦ `🛫` + `📅`**. Thiếu → không có dự kiến/độ lệch (chỉ hiện thực tế). Không đoán mốc bắt đầu.
4. **% thủ công vẫn ghi qua token cũ `` `N%` ``** (không đổi định dạng đĩa) → tương thích ngược + Base/sync đọc được.

## Đánh đổi & hệ quả

- (+) Số luôn khớp file, không lệ thuộc job cache, không đụng định dạng đĩa hiện có.
- (+) Zero cấu hình cho v1 → hợp công ty nhỏ.
- (−) Nếu sau này bên ngoài (Base/1Office) cần đọc % *dẫn xuất* (từ đầu việc), phải cache thêm 1 token → xét ở v2.
- (−) Heuristic "manual đè checklist" có thể bất ngờ với 1 số người; nếu cần chọn tường minh → thêm `pmode` ở v2.

## Cân nhắc phương án khác

- Cache token `N%` cho mọi cách tính: bị bỏ vì đụng định dạng đĩa + rủi ro lệch file, chưa cần cho v1.
- Thêm selector `pmode` per task ngay v1: bị hoãn để giữ v1 ít ma sát; heuristic đủ cho manual + đầu việc.
