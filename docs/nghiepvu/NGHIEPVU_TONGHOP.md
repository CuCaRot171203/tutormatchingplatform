# Nghiệp vụ hệ thống TutorMatchingPlatform

> **Phiên bản:** 1.0
> **Ngày tài liệu:** 2026-07-30
> **Công nghệ:** ASP.NET Core 10 + Entity Framework Core + SQL Server + JWT + MediatR

---

## Mục lục

1. [Tổng quan hệ thống](#1-tổng-quan-hệ-thống)
2. [Các角色 (Vai trò người dùng)](#2-các-vai-trò-người-dùng)
3. [Đăng ký & Xác thực](#3-đăng-ký--xác-thực)
4. [Quản lý Hồ sơ (Profile)](#4-quản-lý-hồ-sơ-profile)
5. [Quản lý Gia sư (Tutor)](#5-quản-lý-gia-sư-tutor)
6. [Đặt & Quản lý Phiên học (Session)](#6-đặt--quản-lý-phiên-học-session)
7. [Phản hồi & Đánh giá (Feedback)](#7-phản-hồi--đánh-giá-feedback)
8. [Học tập & Theo dõi tiến độ (Learning Milestones)](#8-học-tập--theo-dõi-tiến-độ-learning-milestones)
9. [Quản lý Tín dụng (Credits)](#9-quản-lý-tín-dụng-credits)
10. [Khiếu nại & Xử lý vi phạm (Complaints)](#10-khiếu-nại--xử-lý-vi-phạm-complaints)
11. [Thông báo (Notifications)](#11-thông-báo-notifications)
12. [Quản trị hệ thống (Admin)](#12-quản-trị-hệ-thống-admin)
13. [Các nghiệp vụ nền tự động (Background Jobs)](#13-các-nghiệp-vụ-nền-tự-động-background-jobs)
14. [Mô hình dữ liệu chính](#14-mô-hình-dữ-liệu-chính)
15. [Quy trình nghiệp vụ tổng hợp](#15-quy-trình-nghiệp-vụ-tổng-hợp)

---

## 1. Tổng quan hệ thống

**TutorMatchingPlatform** là nền tảng kết nối gia sư (Tutor) và học sinh (Student) để tổ chức các phiên học trực tuyến 1-kèm-1.

**Các chức năng cốt lõi:**
- Đăng ký / đăng nhập với 3 vai trò: Admin, Tutor, Student
- Gia sư đăng ký hồ sơ, chờ phê duyệt từ Admin
- Học sinh tìm kiếm gia sư theo môn học, lịch rảnh, điểm uy tín
- Đặt phiên học (Session) giữa học sinh và gia sư
- Đánh giá phiên học sau khi hoàn thành
- Đặt mục tiêu học tập và theo dõi tiến độ
- Nạp và quản lý tín dụng (Credits) để thanh toán phí học
- Hệ thống khiếu nại khi có hành vi vi phạm
- Các job nền tự động: nhắc lịch, tính điểm uy tín, phát hiện hủy muộn

**Kiến trúc:** Clean Architecture (Domain → Application → Infrastructure → API)
**Pattern:** CQRS + MediatR + FluentValidation + JWT

---

## 2. Các vai trò người dùng

Hệ thống có 3 vai trò được định nghĩa trong enum `UserRole`:

| Vai trò | Mã | Mô tả |
|---------|-----|-------|
| Học sinh | `Student = 0` | Đăng ký học, tìm gia sư, đặt phiên học, đánh giá |
| Gia sư | `Tutor = 1` | Cập nhật lịch, nhận đặt phiên, đánh giá học sinh |
| Quản trị | `Administrator = 2` | Duyệt gia sư, xử lý khiếu nại, quản lý tín dụng, dashboard |

---

## 3. Đăng ký & Xác thực

### 3.1. Đăng ký (`POST /api/auth/register`)

- **Ai dùng:** Học sinh hoặc Gia sư tự chọn vai trò khi đăng ký
- **Dữ liệu đầu vào:** `Email`, `Password`, `FullName`, `Role`
- **Xử lý:**
  - Hash mật khẩu bằng BCrypt
  - Tạo bản ghi `User` với vai trò chỉ định
  - Nếu vai trò là `Tutor` → tự động tạo `TutorProfile` với `Status = Pending` (chờ Admin duyệt)
  - Nếu vai trò là `Student` → tự động tạo `StudentProfile`
- **Phản hồi:** Thông tin user + JWT token

### 3.2. Đăng nhập (`POST /api/auth/login`)

- **Dữ liệu đầu vào:** `Email`, `Password`
- **Xử lý:**
  - Xác thực mật khẩu BCrypt
  - Kiểm tra trạng thái khóa: `FailedLoginAttempts >= 5` → khóa tài khoản (`LockoutEnd`)
  - Kiểm tra `IsSuspended` → từ chối nếu bị treo
  - Tạo JWT token (60 phút) + Refresh token (7 ngày)
  - Reset `FailedLoginAttempts` về 0 nếu đăng nhập thành công
- **Phản hồi:** `AccessToken`, `RefreshToken`, thông tin user

### 3.3. Làm mới Token (`POST /api/auth/refresh-token`)

- Đầu vào: `RefreshToken`
- Xác thực refresh token còn hạn → cấp JWT mới

### 3.4. Quên mật khẩu (`POST /api/auth/forgot-password`)

- Đầu vào: `Email`
- Tạo `PasswordResetToken` (GUID), lưu `PasswordResetTokenExpiry` (1 giờ)
- Gửi email reset (hiện tại log ra console)

### 3.5. Đặt lại mật khẩu (`POST /api/auth/reset-password`)

- Đầu vào: `Token`, `NewPassword`
- Xác thực token + kiểm tra expiry → cập nhật `PasswordHash`

---

## 4. Quản lý Hồ sơ (Profile)

### 4.1. Xem & Cập nhật hồ sơ cá nhân (`GET/PUT /api/profiles/me`)

- **Ai dùng:** Tất cả mọi người (Student, Tutor, Admin)
- Cập nhật: `FullName`, `AvatarUrl` (upload file)

### 4.2. Cập nhật hồ sơ Học sinh (`PUT /api/profiles/student`)

- **Ai dùng:** Student
- Cập nhật: `StudyGoals` (mục tiêu học tập), `TargetSubjectsJson` (danh sách môn quan tâm)

### 4.3. Cập nhật hồ sơ Gia sư (`PUT /api/profiles/tutor`)

- **Ai dùng:** Tutor
- Cập nhật: `Bio` (giới thiệu bản thân), `Qualifications` (bằng cấp/chứng chỉ)

### 4.4. Cập nhật môn giảng dạy của Gia sư (`POST /api/profiles/tutor/subjects`)

- **Ai dùng:** Tutor
- Cập nhật: Danh sách môn học giảng dạy + lịch rảnh (`FreeSchedulesJson`)

---

## 5. Quản lý Gia sư (Tutor)

### 5.1. Tìm kiếm Gia sư (`GET /api/tutor/search`)

- **Ai dùng:** Student, Admin
- **Tham số tìm kiếm:**
  - `SubjectId` - lọc theo môn học
  - `MinRate` / `MaxRate` - khoảng mức giá (hiện tại giá đã bị loại khỏi model)
  - `Availability` - lọc theo lịch rảnh (tính overlap với học sinh)
- **Trả về:** Danh sách gia sư kèm `ReputationScore`, thông tin môn, trạng thái duyệt

### 5.2. Xem chi tiết Gia sư (`GET /api/tutor/{id}`)

- **Ai dùng:** Tất cả
- Trả về: Thông tin đầy đủ tutor profile, bio, bằng cấp, danh sách môn, điểm uy tín

### 5.3. Xem đánh giá của Gia sư (`GET /api/tutor/{id}/feedbacks`)

- **Ai dùng:** Tất cả
- Trả về: Danh sách feedback từ học sinh

### 5.4. Cập nhật lịch rảnh (`PUT /api/tutor/me/availability`)

- **Ai dùng:** Tutor
- Cập nhật `FreeSchedulesJson` - lịch rảnh hàng tuần

---

## 6. Đặt & Quản lý Phiên học (Session)

### 6.1. Đặt phiên học (`POST /api/session/book`)

- **Ai dùng:** Student
- **Dữ liệu đầu vào:** `TutorId`, `SubjectId`, `StartTime`, `EndTime`
- **Quy trình xử lý:**
  1. Kiểm tra phiên không trùng thời gian với phiên đã đặt của cùng tutor
  2. Kiểm tra `StartTime` phải trong tương lai
  3. Kiểm tra gia sư đã được Admin duyệt (`TutorProfile.Status == Approved`)
  4. Tạo `Session` với `Status = Pending`
  5. Tạo `SessionChangeRequest` (chờ gia sư xác nhận)
  6. Ghi nhận `CreditTransaction` kiểu `SessionFee` (trừ tiền học sinh)
- **Trạng thái phiên** (enum `SessionStatus`):
  - `Pending = 0` - Chờ gia sư xác nhận
  - `Confirmed = 1` - Đã xác nhận
  - `Completed = 2` - Hoàn thành
  - `Cancelled = 3` - Đã hủy
  - `PendingChangeConfirmation = 4` - Chờ xác nhận thay đổi

### 6.2. Xác nhận / Từ chối yêu cầu thay đổi (`POST /api/session/change-requests/{id}/respond`)

- **Ai dùng:** Tutor (hoặc Student khi gia sư đề xuất thay đổi)
- **Đầu vào:** `Accept` (true/false)
- **Xử lý:**
  - `Accept = true`: Cập nhật `Session.StartTime/EndTime`, set `Status = Confirmed`
  - `Accept = false`: Giữ nguyên thời gian cũ, cập nhật `SessionChangeRequest.Status = Declined`
- **Quy trình đặt phiên ban đầu:** Khi Student đặt → `SessionChangeRequest` được tạo với `Status = Pending` → Tutor xác nhận → phiên được duyệt

### 6.3. Đề xuất thay đổi phiên (`POST /api/session/{id}/propose-change`)

- **Ai dùng:** Tutor hoặc Student
- **Dữ liệu đầu vào:** `ChangeType` (Reschedule / Cancel), `ProposedStartTime`, `ProposedEndTime`
- **Xử lý:**
  - Tạo `SessionChangeRequest` với trạng thái `Pending`
  - Nếu là **Reschedule**: Cập nhật `Session.Status = PendingChangeConfirmation`
  - Nếu là **Cancel**: Tạo `CreditTransaction` kiểu `Refund` cho Student

### 6.4. Cập nhật link họp (`PATCH /api/session/{id}/meeting-link`)

- **Ai dùng:** Tutor
- Cập nhật `MeetingLink` cho phiên học đã được xác nhận

### 6.5. Xem danh sách phiên học (`GET /api/session/my-sessions`)

- **Ai dùng:** Student hoặc Tutor
- Trả về tất cả phiên học liên quan đến người dùng (cả vai trò Student lẫn Tutor)

### 6.6. Xem chi tiết phiên học (`GET /api/session/{id}`)

- **Ai dùng:** Tutor hoặc Student tham gia phiên đó

---

## 7. Phản hồi & Đánh giá (Feedback)

### 7.1. Gửi đánh giá (`POST /api/feedback/rate`)

- **Ai dùng:** Tutor hoặc Student (sau khi phiên `Completed`)
- **Dữ liệu đầu vào:** `SessionId`, `Rating` (1-5), `Comment`
- **Xử lý:**
  - Kiểm tra phiên đã hoàn thành (`Status == Completed`)
  - Kiểm tra người gửi tham gia phiên học
  - Tạo `Feedback` với `SenderId` và `ReceiverId` (người được đánh giá)
  - Liên kết `StudentProfileId` / `TutorProfileId` nếu có

---

## 8. Học tập & Theo dõi tiến độ (Learning Milestones)

### 8.1. Đặt mục tiêu học tập (`POST /api/progress/goal`)

- **Ai dùng:** Tutor
- **Dữ liệu đầu vào:** `StudentId`, `SubjectId`, `MilestoneName`, `TargetDate`
- **Xử lý:** Tạo `LearningMilestone` với `Status = NotStarted`, `CompletionPercentage = 0`

### 8.2. Ghi nhận kết quả phiên học (`POST /api/progress/record-result`)

- **Ai dùng:** Tutor
- **Dữ liệu đầu vào:** `SessionId`, `Score` (0-10), `GoalCompletionPercentage`, `TutorComment`
- **Xử lý:**
  - Cập nhật `Session` với `Score`, `GoalCompletionPercentage`, `TutorComment`
  - Cập nhật `LearningMilestone.CompletionPercentage` nếu có milestone liên quan
  - Tự động cập nhật `MilestoneStatus`:
    - `CompletionPercentage = 100` → `Completed`
    - `TargetDate < now` và chưa xong → `Overdue`

### 8.3. Xem danh sách mục tiêu (`GET /api/progress/goals`)

- **Ai dùng:** Tutor hoặc Student
- Trả về các milestone liên quan

### 8.4. Xem biểu đồ tiến độ (`GET /api/progress/chart`)

- **Ai dùng:** Tutor hoặc Student
- Trả về dữ liệu chart tiến độ học tập theo thời gian

---

## 9. Quản lý Tín dụng (Credits)

### 9.1. Nạp tín dụng (`POST /api/credits/deposit`)

- **Ai dùng:** Student
- **Dữ liệu đầu vào:** `Amount`, `Note`
- **Quy trình:**
  1. Tạo `CreditRequest` với `Status = Pending` (chờ Admin duyệt)
  2. Admin sẽ xử lý qua `POST /api/admin/credits/{id}/approve`

### 9.2. Xem số dư (`GET /api/credits/balance`)

- **Ai dùng:** Student, Tutor, Admin
- Trả về `CreditBalance` từ `User.CreditBalance`

### 9.3. Xem lịch sử giao dịch (`GET /api/credits/transactions`)

- **Ai dùng:** Student, Tutor
- Trả về danh sách `CreditTransaction` của người dùng
- Các loại giao dịch (enum `CreditTransactionType`):
  - `Deposit` - Nạp tiền
  - `SessionFee` - Thanh toán phí phiên học (trừ Student)
  - `LateCancellationFee` - Phí hủy muộn
  - `Refund` - Hoàn tiền

### 9.4. Admin duyệt / từ chối yêu cầu nạp tiền

- `POST /api/admin/credits/{id}/approve` → Cộng tiền vào `User.CreditBalance`, tạo `CreditTransaction` kiểu `Deposit`, cập nhật `CreditRequest.Status = Approved`
- `POST /api/admin/credits/{id}/reject` → Cập nhật `CreditRequest.Status = Rejected`

---

## 10. Khiếu nại & Xử lý vi phạm (Complaints)

### 10.1. Gửi khiếu nại (`POST /api/complaints`)

- **Ai dùng:** Student hoặc Tutor
- **Dữ liệu đầu vào:** `ReportedUserId`, `SessionId` (optional), `Type`, `Description`
- **Loại khiếu nại** (enum `ComplaintType`):
  - `LateCancellation` - Hủy muộn
  - `InappropriateBehavior` - Hành vi không phù hợp
  - `SessionResultDispute` - Khiếu nại kết quả phiên học
  - `Other` - Khác
- **Nguồn khiếu nại:** `UserSubmitted`

### 10.2. Xử lý khiếu nại (`POST /api/admin/complaints/{id}/resolve`)

- **Ai dùng:** Admin
- **Đầu vào:** `Action` (Warning / TemporarySuspension / Close), `ResolutionReason`
- **Xử lý theo Action:**
  - `Warning`: Ghi nhận cảnh cáo, không thay đổi tài khoản
  - `TemporarySuspension`: Set `User.IsSuspended = true`
  - `Close`: Đóng khiếu nại, không xử phạt thêm
- **Cập nhật:** `Complaint.Status = Resolved`, lưu `ResolutionAction`, `ResolutionReason`

### 10.3. Tự động phát hiện hủy muộn (Background Job)

- `LateCancellationAutoFlagJob` chạy mỗi 24 giờ
- Tìm user có ≥ 3 giao dịch `LateCancellationFee` trong 30 ngày gần nhất
- Tự động tạo `Complaint` với `Source = SystemGenerated`, `Type = LateCancellation`

---

## 11. Thông báo (Notifications)

- Entity `Notification` lưu trữ thông báo trong hệ thống
- Các trường: `ReceiverId`, `Title`, `Message`, `IsWarning`, `IsRead`
- Hiện tại chủ yếu được tạo tự động bởi background jobs (nhắc lịch, khiếu nại)

---

## 12. Quản trị hệ thống (Admin)

### 12.1. Dashboard (`GET /api/admin/dashboard`)

- Trả về thống kê tổng quan:
  - Tổng số học sinh / gia sư
  - Số phiên học đã hoàn thành
  - Số khiếu nại đang chờ xử lý
  - Tổng credits đã nạp

### 12.2. Quản lý Gia sư

- `GET /api/admin/tutors` - Danh sách tất cả gia sư
- `GET /api/admin/tutor-profiles/pending` - Danh sách hồ sơ chờ duyệt
- `POST /api/admin/tutor-profiles/{id}/approve` → `TutorProfile.Status = Approved`
- `POST /api/admin/tutor-profiles/{id}/reject` → `TutorProfile.Status = Rejected`

### 12.3. Quản lý Môn học (`/api/subjects`)

- `GET` - Xem tất cả môn (Admin, Tutor, Student)
- `POST / PUT / DELETE` - Chỉ Admin

### 12.4. Quản lý Khiếu nại

- `GET /api/admin/complaints/pending` - Danh sách khiếu nại chưa xử lý
- `POST /api/admin/complaints/{id}/resolve` - Xử lý khiếu nại

### 12.5. Quản lý Credits

- `GET /api/admin/credits/pending` - Danh sách yêu cầu nạp tiền chờ duyệt
- `POST /api/admin/credits/{id}/approve` - Duyệt nạp tiền
- `POST /api/admin/credits/{id}/reject` - Từ chối nạp tiền

---

## 13. Các nghiệp vụ nền tự động (Background Jobs)

### 13.1. SessionReminderJob

- **Chu kỳ:** Mỗi 1 phút
- **Xử lý:**
  1. Tìm tất cả phiên có `Status = Confirmed`, `ReminderSent = false`
  2. Lọc các phiên bắt đầu trong khoảng **1 giờ tới**
  3. Gửi email nhắc nhở cho cả gia sư và học sinh
  4. Cập nhật `ReminderSent = true`

### 13.2. LateCancellationAutoFlagJob

- **Chu kỳ:** Mỗi 24 giờ
- **Xử lý:**
  1. Đếm `CreditTransaction` kiểu `LateCancellationFee` của mỗi user trong 30 ngày gần nhất
  2. Tìm user có ≥ 3 lần hủy muộn
  3. Tạo `Complaint` tự động (`Source = SystemGenerated`) để Admin xem xét

### 13.3. ReputationScoreCalculationJob

- **Chu kỳ:** Mỗi 24 giờ
- **Xử lý:**
  1. Với mỗi gia sư, lấy tất cả `Feedback` nhận được trong 90 ngày gần nhất (không tính feedback tự đánh giá)
  2. Tính điểm trung bình: `TutorProfile.ReputationScore = Average(Feedback.Rating)`
  3. Cập nhật `TutorProfile.ReputationScore` và `UpdatedAt`

---

## 14. Mô hình dữ liệu chính

```
User (id, email, passwordHash, role, creditBalance, isSuspended, ...)
├── TutorProfile (userId, bio, qualifications, status, reputationScore, subjectsJson, freeSchedulesJson)
├── StudentProfile (userId, studyGoals, targetSubjectsJson)
├── CreditTransactions[]
├── CreditRequests[]
├── Notifications[] (as receiver)
└── Complaints[] (as reporter / reported user)

Session (id, tutorId, studentId, subjectId, startTime, endTime, status, score, ...)
├── SessionChangeRequests[]
├── Feedbacks[]
└── Complaints[]

Subject (id, name, description, isActive)

LearningMilestone (id, studentId, subjectId, name, targetDate, status, completionPercentage)
```

---

## 15. Quy trình nghiệp vụ tổng hợp

### 15.1. Quy trình Đăng ký Gia sư

```
1. User đăng ký → tạo User + TutorProfile (Status=Pending)
2. Admin đăng nhập → GET /api/admin/tutor-profiles/pending
3. Admin duyệt → POST /api/admin/tutor-profiles/{id}/approve
4. TutorProfile.Status = Approved → Tutor có thể nhận học sinh
```

### 15.2. Quy trình Đặt phiên học

```
1. Student tìm gia sư → GET /api/tutor/search
2. Student đặt phiên → POST /api/session/book
   → Tạo Session (Status=Pending)
   → Tạo SessionChangeRequest (chờ xác nhận)
   → Trừ CreditBalance của Student (SessionFee)
3. Tutor nhận yêu cầu → POST /api/session/change-requests/{id}/respond?accept=true
   → Session.Status = Confirmed
4. [Tự động] SessionReminderJob gửi email trước 1 giờ
5. Phiên diễn ra → Tutor cập nhật MeetingLink
6. Phiên kết thúc → Tutor ghi nhận kết quả → POST /api/progress/record-result
   → Session.Status = Completed
7. Cả hai đánh giá → POST /api/feedback/rate
8. [Tự động] ReputationScoreCalculationJob cập nhật điểm gia sư
```

### 15.3. Quy trình Yêu cầu hoàn tiền / Hủy phiên

```
1. Tutor hoặc Student đề xuất hủy → POST /api/session/{id}/propose-change
   → Tạo SessionChangeRequest (ChangeType=Cancel, Status=Pending)
2. Bên kia phản hồi → POST /api/session/change-requests/{id}/respond
   → Nếu accept: Session.Status = Cancelled, Refund cho Student
   → Nếu reject: Giữ nguyên phiên
3. [Tự động] LateCancellationAutoFlagJob kiểm tra nếu hủy trễ
```

### 15.4. Quy trình Nạp tiền

```
1. Student gửi yêu cầu → POST /api/credits/deposit
   → Tạo CreditRequest (Status=Pending)
2. Admin xem danh sách → GET /api/admin/credits/pending
3. Admin duyệt → POST /api/admin/credits/{id}/approve
   → CreditBalance của User tăng
   → CreditRequest.Status = Approved
   → Tạo CreditTransaction (Type=Deposit)
```

### 15.5. Quy trình Xử lý khiếu nại

```
1. User gửi khiếu nại → POST /api/complaints
   → Tạo Complaint (Status=Pending, Source=UserSubmitted)
2. [Tự động] LateCancellationAutoFlagJob tạo Complaint nếu phát hiện hủy muộn 3 lần
   → Complaint (Status=Pending, Source=SystemGenerated)
3. Admin xem → GET /api/admin/complaints/pending
4. Admin xử lý → POST /api/admin/complaints/{id}/resolve
   → Cập nhật Complaint.Status = Resolved
   → Thực hiện Action (Warning / TemporarySuspension / Close)
```
