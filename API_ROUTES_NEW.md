# Tài liệu API - Tour Manager (Tóm tắt)

Base URL (giả định): `http://localhost:3000/api`

Tài liệu này mô tả các nhóm route chính, phương thức HTTP, đường dẫn và ví dụ response ngắn.

Mount chính (xem `src/routes/index.js`):

- `/auth` → `src/modules/auth/auth.route.js`
- `/category` → `src/modules/categories/category.route.js`
- `/service` → `src/modules/tourService/service.route.js`
- `/tour` → `src/modules/tours/tour.route.js`
- `/customer` → `src/modules/customers/customer.route.js`
- `/user` → `src/modules/user/user.route.js`
- `/health` → health check

---

## /auth

- POST `/auth/sign-in` — Đăng nhập

    Ví dụ request:

```bash
curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

    Ví dụ response (200):

```json
{
    "message": "Đăng nhập thành công",
    "data": {
        "id": 1,
        "username": "user1",
        "email": "user@example.com",
        "role": "admin",
        "is_block": true
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

- POST `/auth/sign-up` — Đăng ký

    Ví dụ response (200):

```json
{
    "message": "Đăng ký tài khoản thành công.",
    "data": {
        "id": 2,
        "username": "newuser",
        "email": "newuser@example.com",
        "role": "user"
    }
}
```

- POST `/auth/refresh` — Làm mới token

    Ví dụ request: `{"refreshToken": "eyJhbGci..."}`

    Ví dụ response (200):

```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

- POST `/auth/logout` — Đăng xuất

    Ví dụ response (200):

```json
{
    "message": "Đã đăng xuất"
}
```

---

## /category

- GET `/category/` — Lấy danh sách category (public)

    Ví dụ response (200):

```json
{
    "data": [
        { "id": 1, "name": "City Tour", "description": "Tour thành phố" },
        { "id": 2, "name": "Adventure", "description": "Tour phiêu lưu" }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 2, "totalPages": 1 }
}
```

- POST `/category/create` — Tạo category (admin)

    Ví dụ response (200):

```json
{
    "message": "Tạo mới thành công",
    "cate": {
        "id": 3,
        "name": "Beach Tour",
        "description": "Tour bãi biển"
    }
}
```

- PUT `/category/update/:id` — Cập nhật (admin)

    Ví dụ response (200):

```json
{
    "message": "Cập nhật thành công",
    "newCate": {
        "id": 1,
        "name": "City Tour Updated",
        "description": "Tour thành phố cập nhật"
    }
}
```

- DELETE `/category/delete/:id` — Xóa (admin)

    Ví dụ response (200):

```json
{
    "message": "Xóa thành công"
}
```

---

## /service

- GET `/service/` — Lấy danh sách service

    Ví dụ response (200):

```json
{
    "data": [
        { "id": 1, "name": "Breakfast", "price": 100000 },
        { "id": 2, "name": "Guide", "price": 500000 }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 2, "totalPages": 1 }
}
```

- POST `/service/create` — Tạo service (admin)

    Ví dụ response (201):

```json
{
    "data": {
        "id": 3,
        "name": "Lunch",
        "price": 150000
    }
}
```

- PUT `/service/update/:id` — Cập nhật (admin)

    Ví dụ response (200):

```json
{
    "id": 1,
    "name": "Breakfast Updated",
    "price": 120000
}
```

- DELETE `/service/delete/:id` — Xóa (admin)

    Ví dụ response (200):

```json
{
    "id": 1,
    "name": "Breakfast",
    "price": 100000
}
```

---

## /tour

- GET `/tour/` — Lấy danh sách tour (hỗ trợ pagination & filter)

    Ví dụ response (200):

```json
{
    "message": "Danh sách tour",
    "tours": [
        {
            "id": 10,
            "code": "TOUR001",
            "title": "Hạ Long 2 ngày 1 đêm",
            "description": "Tour tham quan vịnh Hạ Long",
            "price": 1200000,
            "duration": 2,
            "categoryId": 1,
            "categoryName": "Adventure",
            "createdAt": "2024-01-15",
            "updatedAt": "2024-01-20"
        }
    ]
}
```

- GET `/tour/:id` — Lấy chi tiết tour

    Ví dụ response (200):

```json
{
    "message": "Thông tin tour",
    "tour": {
        "id": 10,
        "code": "TOUR001",
        "title": "Hạ Long 2 ngày 1 đêm",
        "description": "Tour tham quan vịnh Hạ Long",
        "price": 1200000,
        "duration": 2,
        "categoryId": 1,
        "categoryName": "Adventure",
        "services": [1, 2],
        "createdAt": "2024-01-15",
        "updatedAt": "2024-01-20"
    }
}
```

- POST `/tour/create` — Tạo tour (admin)

    Ví dụ response (200):

```json
{
    "message": "Tạo tour mới thành công",
    "tour": {
        "id": 11,
        "code": "TOUR002",
        "title": "Sapa 3 ngày 2 đêm",
        "description": "Tour leo núi Fansipan",
        "price": 1500000,
        "categoryId": 1,
        "duration": 3
    }
}
```

- PUT `/tour/update/:id` — Cập nhật tour (partial)

    Ví dụ response (200):

```json
{
    "message": "Cập nhật tour thành công",
    "oldTour": {
        "title": "Hạ Long 2 ngày 1 đêm",
        "price": 1200000
    },
    "tourUpdated": {
        "title": "Hạ Long 2 ngày 1 đêm",
        "price": 1300000
    }
}
```

- DELETE `/tour/delete/:id` — Xóa tour

    Ví dụ response (200):

```json
{
    "message": "Xóa tour thành công"
}
```

---

## /customer

- POST `/customer/create` — Tạo khách hàng

    Ví dụ request:

```bash
curl -X POST http://localhost:3000/api/customer/create \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Tran Thi B","email":"b@example.com","phone":"0909xxxxxx"}'
```

    Ví dụ response (201):

```json
{
    "message": "Tạo khách hàng thành công",
    "data": {
        "id": 5,
        "fullName": "Tran Thi B",
        "email": "b@example.com",
        "phone": "0909xxxxxx",
        "createdAt": "2024-01-20",
        "updatedAt": "2024-01-20"
    }
}
```

- GET `/customer/` — Danh sách

    Ví dụ response (200):

```json
{
    "data": [
        {
            "id": 1,
            "fullName": "Nguyen Van A",
            "email": "a@example.com",
            "phone": "0909111111"
        }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 1, "totalPages": 1 }
}
```

- GET `/customer/:id` — Chi tiết

    Ví dụ response (200):

```json
{
    "id": 5,
    "fullName": "Tran Thi B",
    "email": "b@example.com",
    "phone": "0909xxxxxx",
    "createdAt": "2024-01-20",
    "updatedAt": "2024-01-20"
}
```

- PUT `/customer/update/:id` — Cập nhật

    Ví dụ response (200):

```json
{
    "message": "Cập nhật thành công",
    "updated": {
        "id": 5,
        "fullName": "Tran Thi B Updated",
        "email": "b.updated@example.com",
        "phone": "0909xxxxxx"
    }
}
```

- DELETE `/customer/delete/:id` — Xóa

    Ví dụ response (200):

```json
{
    "message": "Xóa thành công"
}
```

---

## /user

- GET `/user/` — Danh sách user (admin)
- GET `/user/:id` — Chi tiết user
- PUT `/user/:id` — Cập nhật (admin)
- PUT `/user/update/me` — Cập nhật profile hiện tại

    Ví dụ response danh sách (200):

```json
{
    "data": [{ "id": 1, "username": "guide1", "role": "guide" }],
    "pagination": { "page": 1, "limit": 10, "total": 1, "totalPages": 1 }
}
```

---

## /health

- GET `/health` — Health check

```json
{ "status": "ok", "timestamp": 1675200000000 }
```

---

Ghi chú & mở rộng:

- Các route cần xác thực sử dụng middleware `requiredAuth` và có thêm quyền `requireAdmin` cho các hành động quản trị.
- Nếu muốn, tôi có thể mở rộng tài liệu với: schema payload (từ `*.validation.js`), mô tả các error common, và ví dụ responses cho tất cả endpoint chi tiết.
