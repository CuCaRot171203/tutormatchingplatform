# Tài liệu Nghiệp vụ — TutorMatchingPlatform

## Mục lục

| File | Nội dung |
|------|---------|
| `NGHIEPVU_TONGHOP.md` | Tổng quan toàn bộ nghiệp vụ, sơ đồ quy trình, mô hình dữ liệu |
| `NGHIEPVU_01_AUTH.md` | Đăng ký, đăng nhập, JWT, quên mật khẩu |
| `NGHIEPVU_02_SESSION.md` | Đặt phiên học, xác nhận, hủy, thay đổi lịch |
| `NGHIEPVU_03_CREDITS.md` | Nạp tín dụng, thanh toán, lịch sử giao dịch |
| `NGHIEPVU_04_COMPLAINTS.md` | Gửi khiếu nại, xử lý vi phạm, tự động phát hiện hủy muộn |
| `NGHIEPVU_05_TUTOR.md` | Tìm gia sư, quản lý hồ sơ, điểm uy tín |
| `NGHIEPVU_06_PROGRESS.md` | Mục tiêu học tập, ghi nhận kết quả, biểu đồ tiến độ |

---

## Tóm tắt nghiệp vụ cốt lõi

### User (Vai trò: Student, Tutor, Admin)

| Hành động | Student | Tutor | Admin |
|-----------|---------|-------|-------|
| Đăng ký / Đăng nhập | ✅ | ✅ | ❌ |
| Đặt phiên học | ✅ | ❌ | ❌ |
| Nhận & xác nhận phiên học | ❌ | ✅ | ❌ |
| Ghi nhận kết quả phiên | ❌ | ✅ | ❌ |
| Đánh giá phiên học | ✅ | ✅ | ❌ |
| Nạp tín dụng | ✅ | ❌ | ❌ |
| Duyệt gia sư | ❌ | ❌ | ✅ |
| Xử lý khiếu nại | ❌ | ❌ | ✅ |
| Duyệt nạp tiền | ❌ | ❌ | ✅ |

---

## Background Jobs

| Job | Chu kỳ | Mục đích |
|-----|--------|---------|
| `SessionReminderJob` | 1 phút | Gửi email nhắc lịch trước 1 giờ |
| `LateCancellationAutoFlagJob` | 24 giờ | Phát hiện user hủy ≥3 lần trong 30 ngày |
| `ReputationScoreCalculationJob` | 24 giờ | Tính điểm uy tín gia sư từ feedback 90 ngày |

---

## Thông tin hệ thống

| Item | Chi tiết |
|------|---------|
| **API Base URL** | `http://localhost:5256` |
| **Swagger UI** | `http://localhost:5256/swagger` |
| **Swagger JSON** | `http://localhost:5256/swagger/v1/swagger.json` |
| **Công nghệ** | ASP.NET Core 10, EF Core, SQL Server, JWT, MediatR |
| **Kiến trúc** | Clean Architecture (Domain → Application → Infrastructure → API) |
| **Pattern** | CQRS + MediatR + FluentValidation |
| **Database** | SQL Server (LocalDB/SQL Express) |

---

## Tài khoản seed mặc định

| Email | Mật khẩu | Vai trò |
|-------|-----------|---------|
| `admin@tutormatching.com` | `Admin@123` | Admin |
| `student1@test.com` | `Student@123` | Student (300 credits) |
| `tutor1@test.com` | `Tutor@123` | Tutor (Approved) |
