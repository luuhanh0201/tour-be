# Checklist sửa lỗi & nâng cấp code

Mục tiêu: sửa dần các lỗi, chuẩn hoá style và đảm bảo mapping snake_case <-> camelCase hoạt động nhất quán.

Ưu tiên: Critical -> High -> Medium -> Low

2. Critical: Sửa điều kiện tồn tại ngược và throw lỗi
    - Files: `src/modules/user/user.service.js` (hàm `findUserByIdService`) và những vị trí khác.
    - Mô tả: nhiều chỗ dùng `if (exist) { /* lỗi */ }` hoặc tạo `error` nhưng không `throw`.
    - Hành động: kiểm tra tất cả caller model `find*ById*` và sửa `if (!exist) { throw error }`.

3. High: Chuẩn hoá tên trả về existence (`exists` vs `exist`)
    - Vấn đề: models trả `exist` hoặc `exists` không nhất quán; callers destructure không đồng bộ.
    - Hành động: chọn một tên (đề xuất: `exists`) và sửa tất cả models + callers.


5. High: Sửa validatePayload usage
    - Vấn đề: nhiều chỗ dùng `const res = validatePayload(...)` rồi `if (res)`; hàm trả `{ errors, value }`.
    - Hành động: thay bằng `const { errors, value } = validatePayload(...)` và kiểm tra `if (errors)`.

6. High: Sửa catch blocks gọi `next()` không truyền error
    - File ví dụ: `src/modules/tourService/service.controller.js` catch dùng `next()`.
    - Hành động: đổi thành `next(error)` ở mọi catch.

7. High: Kiểm tra và chuẩn hoá việc sử dụng DB wrapper
    - Vấn đề: wrapper `query(sql, params)` đã thêm; transaction vẫn dùng `conn.query` — cần convert object params sang snake_case khi dùng `conn.query`.
    - Hành động: thêm note/utility `connWrapper` hoặc luôn gọi `toSnake()` trước khi truyền object params trong transactions.

9. Medium: Loại bỏ debug logs
    - Files: `tour.service.js`, controllers có `console.log`/`console.table`.
    - Hành động: remove hoặc chuyển sang logger có thể tắt.

10. Medium: Chuẩn hoá các tên biến/treatment nhỏ

- Ví dụ: `refreshToKenHash` (viết inconsistent), `hightLight` vs `highlights` (kiểm tra chính tả trong các nơi).
- Hành động: grep các chuỗi khả nghi và sửa cho đồng nhất.

11. Low: Cải thiện API docs

- File: `API_ROUTES.md` — có thể mở rộng payload schema (từ `*.validation.js`) và ví dụ curl.

12. Final: Chạy linter & test

- Hành động: chạy ESLint, start server, thử nhiều endpoint chính (create/find/update/delete) để xác nhận.

Ghi chú thực hiện

- Thay đổi model (DB) tốt nhất làm theo từng bước nhỏ: sửa model -> sửa caller -> test.
- Trong transaction, luôn dùng `conn.query` và convert params object với `toSnake()` trước khi gọi.
- Khi chuẩn hoá `exists`, cập nhật tất cả callers trước khi commit.
