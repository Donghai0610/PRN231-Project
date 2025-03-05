const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const crypto = require("crypto");
const cron = require("node-cron");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Đường dẫn file database.json
const databasePath = "../../../database.json";

// Cấu hình VNPay
const vnpayConfig = {
    vnp_TmnCode: "7HJM21XJ", // Mã TMN
    vnp_HashSecret: "EUGNBYHOEDDNGAR4NW90DXOGTIXGS26I", // Secret Key
    vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html", // URL thanh toán môi trường TEST
    vnp_ReturnUrl: "http://localhost:5000/payment-result", // URL trả về kết quả thanh toán
};

// Cấu hình email
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "kubinduong2002@gmail.com",
        pass: "wubr bysj fvrk rvju", // App Password của bạn
    },
});

// Hàm đọc dữ liệu từ file database.json
function getDatabase() {
    return JSON.parse(fs.readFileSync(databasePath, "utf8"));
}

// API xử lý quên mật khẩu
app.post("/api/forgot-password", (req, res) => {
    const { email } = req.body;

    const database = getDatabase();
    const accounts = database.accounts;

    // Kiểm tra xem email có tồn tại trong hệ thống không
    const user = accounts.find((u) => u.email === email);
    if (!user) {
        return res.status(404).json({ message: "Email không tồn tại trong hệ thống!" });
    }

    // Tạo token reset mật khẩu
    const resetToken = Math.random().toString(36).substring(2, 12);
    const tokenExpirationTime = Date.now() + 300000; // 5 phút

    // Gửi email
    const mailOptions = {
        from: "kubinduong2002@gmail.com",
        to: email,
        subject: "Đặt lại mật khẩu của bạn",
        html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        <img src="https://duongvanluc2002.sirv.com/black_on_trans.png" width="100" height="100" alt="Logo" style="margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto;">
          <h2 style="color: #333; text-align: center;">Xin chào ${user.full_name}</h2>
          <p style="font-size: 16px; color: #555;">Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng sử dụng mã dưới đây để thay đổi mật khẩu của bạn:</p>
          <div style="text-align: center; margin: 20px 0;">
            <h3 style="font-size: 24px; color: #007bff; font-weight: bold;">${resetToken}</h3>
          </div>
          <p style="font-size: 16px; color: #555;">Nếu bạn không yêu cầu thay đổi mật khẩu, vui lòng bỏ qua email này. Mã đặt lại mật khẩu này sẽ hết hạn trong vòng 5 phút.</p>
          <hr style="border: 0; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="font-size: 14px; color: #777; text-align: center;">Nếu bạn gặp bất kỳ vấn đề gì, hãy liên hệ với chúng tôi qua email này.</p>
          <div style="text-align: center; margin-top: 30px;">
            <p style="font-size: 14px; color: #777;">Trân trọng,</p>
            <p style="font-size: 14px; color: #777;">Đội ngũ hỗ trợ khách hàng của chúng tôi</p>
          </div>
        </div>
      </div>
    `,
    };

    // Lưu token và thời gian hết hạn vào tài khoản
    user.resetToken = resetToken;
    user.resetTokenExpiration = tokenExpirationTime;

    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            console.error("Error sending email:", error);
            return res.status(500).json({ message: "Gửi email thất bại!" });
        }

        fs.writeFileSync(databasePath, JSON.stringify(database, null, 2));
        res.json({ message: "Email đặt lại mật khẩu đã được gửi!" });
    });
});

// API cập nhật mật khẩu mới
app.post("/api/reset-password", (req, res) => {
    const { email, resetToken, newPassword } = req.body;

    const database = getDatabase();
    const accounts = database.accounts;

    // Kiểm tra xem email có tồn tại trong hệ thống không
    const user = accounts.find((u) => u.email === email);
    if (!user) {
        return res.status(404).json({ message: "Email không tồn tại trong hệ thống!" });
    }

    // Kiểm tra token có hợp lệ không
    if (user.resetToken !== resetToken) {
        return res.status(400).json({ message: "Mã reset không hợp lệ!" });
    }

    // Kiểm tra xem token có hết hạn chưa
    if (Date.now() > user.resetTokenExpiration) {
        delete user.resetToken;
        delete user.resetTokenExpiration;
        fs.writeFileSync(databasePath, JSON.stringify(database, null, 2));
        return res.status(400).json({ message: "Mã reset đã hết hạn!" });
    }

    // Cập nhật mật khẩu
    user.password = newPassword;
    delete user.resetToken;
    delete user.resetTokenExpiration;
    fs.writeFileSync(databasePath, JSON.stringify(database, null, 2));

    res.json({ message: "Mật khẩu đã được thay đổi thành công!" });
});

// Cron job để kiểm tra và xóa các token hết hạn
cron.schedule("* * * * *", () => {
    const database = getDatabase();
    const accounts = database.accounts;

    accounts.forEach((user) => {
        if (user.resetToken && Date.now() > user.resetTokenExpiration) {
            delete user.resetToken;
            delete user.resetTokenExpiration;

            fs.writeFileSync(databasePath, JSON.stringify(database, null, 2));
            console.log(`Reset token của người dùng ${user.email} đã hết hạn và bị xóa.`);
        }
    });
});

// // API xử lý thanh toán
// app.post("/payment", (req, res) => {
//     const ticketInfo = req.body;

//     // Tạo mã giao dịch (txnRef)
//     const txnRef = new Date().getTime();

//     // Thông tin thanh toán
//     const vnp_Params = {
//         vnp_TmnCode: vnpayConfig.vnp_TmnCode,
//         vnp_Amount: ticketInfo.totalAmount * 100, // Số tiền thanh toán, VNPay yêu cầu tính bằng đồng
//         vnp_OrderInfo: `Thanh toán vé phim ${ticketInfo.movieTitle}`,
//         vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
//         vnp_TxnRef: txnRef,
//         vnp_CreateDate: new Date().toISOString().replace(/[-T:\.Z]/g, ""), // Ngày tạo đơn hàng
//         vnp_Locale: "vn", // Hoặc "en" tùy thuộc vào ngôn ngữ bạn muốn
//         vnp_CurrCode: "VND", // Đơn vị tiền tệ
//         vnp_Version: "2.1.0", // Phiên bản API
//         vnp_Command: "pay", // Lệnh thanh toán
//         vnp_OrderType: "100000", // Loại đơn hàng, 100000 cho thanh toán trực tuyến
//         vnp_IpAddr: req.ip, // Địa chỉ IP người dùng
//         vnp_ExpireDate: new Date(Date.now() + 10 * 60 * 1000).toISOString().replace(/[-T:\.Z]/g, ""), // Thời gian hết hạn (10 phút)
//     };

//     // Tạo chữ ký
//     const queryString = Object.keys(vnp_Params)
//         .map((key) => `${key}=${vnp_Params[key]}`)
//         .join("&");

//     const secureHash = crypto
//         .createHmac("sha512", vnpayConfig.vnp_HashSecret)
//         .update(queryString)
//         .digest("hex");

//     // Thêm chữ ký vào tham số
//     vnp_Params.vnp_SecureHash = secureHash;

//     // Tạo URL thanh toán
//     const vnpUrl = `${vnpayConfig.vnp_Url}?${new URLSearchParams(vnp_Params).toString()}`;
//     console.log("URL Payment gửi đến VNPay:", vnpUrl);

//     // Trả về URL thanh toán
//     res.json({ url: vnpUrl });
// });

// Xử lý kết quả thanh toán
app.get("/payment-result", (req, res) => {
    const vnpayData = req.query;
    const secureHash = vnpayData.vnp_SecureHash;

    const queryString = Object.keys(vnpayData)
        .filter((key) => key !== "vnp_SecureHash")
        .map((key) => `${key}=${vnpayData[key]}`)
        .join("&");

    const hashData = crypto
        .createHmac("sha512", vnpayConfig.vnp_HashSecret)
        .update(queryString)
        .digest("hex");

    if (secureHash === hashData && vnpayData.vnp_ResponseCode === "00") {
        // Thanh toán thành công
        const ticketInfo = {
            userName: vnpayData.vnp_BillFirstName,
            movieTitle: "Tên Phim", // Lấy thông tin phim từ database
            showDate: "Ngày Chiếu", // Lấy ngày chiếu
            showTime: "Giờ Chiếu", // Lấy giờ chiếu
            seats: "Ghế Đã Chọn", // Lấy ghế từ thông tin frontend
            totalAmount: vnpayData.vnp_Amount / 100, // Tiền đã thanh toán
        };

        // Gửi email thông báo cho người dùng
        sendTicketEmail(vnpayData.vnp_BillEmail, ticketInfo);

        res.send("Thanh toán thành công và email đã được gửi.");
    } else {
        res.send("Thanh toán thất bại.");
    }
});

// Hàm gửi email
const sendTicketEmail = (userEmail, ticketInfo) => {
    const mailOptions = {
        from: "kubinduong2002@gmail.com",  // Email người gửi
        to: userEmail,  // Địa chỉ email người nhận
        subject: `Thông tin vé đặt chỗ - ${ticketInfo.movieTitle}`,
        html: `
      <h2>Thông tin vé của bạn</h2>
      <p><strong>Người đặt:</strong> ${ticketInfo.userName}</p>
      <p><strong>Phim:</strong> ${ticketInfo.movieTitle}</p>
      <p><strong>Ngày chiếu:</strong> ${ticketInfo.showDate}</p>
      <p><strong>Giờ chiếu:</strong> ${ticketInfo.showTime}</p>
      <p><strong>Ghế:</strong> ${ticketInfo.seats}</p>
      <p><strong>Tổng tiền:</strong> ${ticketInfo.totalAmount}</p>
    `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};
const { v4: uuidv4 } = require('uuid');  // Import UUID để tạo ID ngẫu nhiên

app.post("/api/confirm-booking", (req, res) => {
    const {
        userEmail,
        fullName,
        phone,
        cinema,
        movie,
        duration,
        screen,
        seats,  // seats sẽ là mảng
        date,
        startTime,
        endTime,
        totalPrice,
    } = req.body;

    const database = getDatabase();
    const accounts = database.accounts;

    // Tìm tài khoản của người dùng
    const user = accounts.find((u) => u.email === userEmail);
    if (!user) {
        return res.status(404).json({ message: "Không tìm thấy tài khoản người dùng!" });
    }

    // Tạo ID cho ticket mới
    const ticketId = uuidv4();  // Tạo ID duy nhất cho ticket

    // Cập nhật thông tin vé vào tài khoản người dùng
    const newTicket = {
        id: ticketId,  // Thêm ID cho ticket
        movie,
        cinema,
        seats,  // Lưu seats dưới dạng mảng
        date,
        startTime,
        endTime,
        totalPrice,
        screen,
        status: "inactive",
    };

    user.tickets.push(newTicket);

    // Gửi email xác nhận
    const mailOptions = {
        from: "kubinduong2002@gmail.com",
        to: userEmail,
        subject: "Xác nhận đặt vé",
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            
            <!-- Logo Section -->
            <div style="text-align: center;">
              <img src="https://duongvanluc2002.sirv.com/black_on_trans.png" width="120" height="120" alt="Logo" style="margin-bottom: 20px;">
            </div>

            <!-- Title Section -->
            <h2 style="color: #333; text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 20px;">
              Xác nhận đặt vé cho <span style="color: #007BFF;">${movie}</span>
            </h2>

            <!-- Ticket Information Section -->
            <div style="border-top: 2px solid #f0f0f0; padding-top: 20px;">
              
              <!-- Ticket ID -->
              <div style="margin-bottom: 15px;">
                <p style="font-size: 16px; color: #555;"><strong>Mã vé:</strong> ${ticketId}</p>
              </div>

              <!-- Booker's Information -->
              <div style="margin-bottom: 15px;">
                <p style="font-size: 16px; color: #555;"><strong>Người đặt:</strong> ${fullName}</p>
                <p style="font-size: 16px; color: #555;"><strong>Email:</strong> ${userEmail}</p>
                <p style="font-size: 16px; color: #555;"><strong>Số điện thoại:</strong> ${phone}</p>
              </div>

              <!-- Show Information -->
              <div style="margin-bottom: 20px;">
                <p style="font-size: 16px; color: #555;"><strong>Rạp chiếu:</strong> ${cinema}</p>
                <p style="font-size: 16px; color: #555;"><strong>Ghế:</strong> ${seats.join(", ")}</p>  <!-- Hiển thị seats dưới dạng chuỗi -->
                <p style="font-size: 16px; color: #555;"><strong>Ngày chiếu:</strong> ${date}</p>
                <p style="font-size: 16px; color: #555;"><strong>Thời gian chiếu:</strong> ${startTime} - ${endTime}</p>
                <p style="font-size: 16px; color: #555;"><strong>Phòng chiếu:</strong> ${screen}</p>
              </div>

              <!-- Total Price -->
              <div style="margin-bottom: 20px; border-top: 1px solid #f0f0f0; padding-top: 10px;">
                <p style="font-size: 16px; color: #555;"><strong>Tổng tiền:</strong> ${totalPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" })} (chưa thanh toán.)</p>
              </div>
            </div>

            <!-- Additional Information -->
            <div style="font-size: 16px; color: #555; margin-top: 20px; text-align: center;">
              <p style="font-size: 16px; color: #e74c3c; font-weight: bold;">Vui lòng mang thông tin này đến quầy để thanh toán và nhận vé. MOVIE88 xin cảm ơn!</p>
              <hr style="border: 0; border-top: 1px solid #ddd; margin: 30px 0;">
            </div>

            <!-- Footer Section -->
            <div style="text-align: center; font-size: 14px; color: #777;">
              <p style="font-size: 14px;">Nếu bạn gặp bất kỳ vấn đề gì, hãy liên hệ với chúng tôi qua email này.</p>
              <div style="margin-top: 20px;">
                <p>Trân trọng,</p>
                <p>Đội ngũ hỗ trợ khách hàng của chúng tôi</p>
              </div>
            </div>
          </div>
        </div>
        `,
    };

    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            console.error("Error sending email:", error);
            return res.status(500).json({ message: "Gửi email thất bại!" });
        }

        // Lưu thông tin vào database.json
        fs.writeFileSync(databasePath, JSON.stringify(database, null, 2));

        res.json({ message: "Đặt vé thành công và email đã được gửi!", ticketId });
    });
});


// Chạy server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
