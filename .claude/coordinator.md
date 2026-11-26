# Hồ sơ coordinator — pie-task

## 1. Repo
- pieofmind/pie-task-plugin-obsidian. Plugin Obsidian một file `main.js` (không build), id `pie-tasks`.
- Không có CI.

## 2. Verify
- `for f in test/*.test.js; do node "$f" || exit 1; done` (không cần Obsidian; mock trong từng test).

## 3. Deploy (Nguyên chốt 2026-11-26)
- Deploy = chép `main.js`, `manifest.json`, `styles.css` của main sang vault prod `~/obsidian-vault/.obsidian/plugins/pie-tasks/`.
- Làm sau MỖI lần merge. Trước khi chép: sao lưu 3 file cũ vào `~/.cache/pie-task-deploy/<YYYYMMDD-HHMM>/`.
- Sau khi chép: reload plugin, smoke = mở bảng, kéo 1 task, xem console không lỗi.
- Rollback = chép lại bản sao lưu.
- Bump version / release là việc của Nguyên, không tự làm.

## 4. Vùng cấm ghi
- Vault prod khác (`~/obsidian-bussiness`, `~/obsidian-pom`): không đụng.
- Note trong `~/obsidian-vault`: không sửa khi E2E; E2E làm trên vault test.

## 5. E2E
- Vault test: `~/obsidian-starter` (Nguyên chốt 2026-11-26). Nạp build PR = chép 3 file của HEAD PR vào `~/obsidian-starter/.obsidian/plugins/pie-tasks/`.
- Dữ liệu test: bản chép `TASKS.sample.md` + folder note mẫu trong vault test.

## 9. Gotcha
- Checkout chính có thể có thay đổi chưa commit của Nguyên/session khác — làm trong worktree.

## 10. Cổng riêng repo (Nguyên chốt 2026-11-26)
- Không chạy review đa model (`review-cli.sh`) cho repo này, kể cả tầng cao. Tầng cao vẫn bắt buộc E2E trước merge có backup + diff.
