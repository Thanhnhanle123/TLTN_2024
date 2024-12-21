require('dotenv').config()
const nodemailer = require('nodemailer')

// Tạo đối tượng gửi email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true nếu bạn sử dụng port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// Cấu hình email
const mailOptions = {
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_TO,
  subject: 'Log File Error Detected',
  text: '' // Nội dung email sẽ được cập nhật khi có lỗi
}

// Kiểm tra nội dung file log để phát hiện lỗi
function checkForErrors (errorpath, errorMessage) {
  // Cập nhật nội dung email
  const emailOptions = {
    ...mailOptions,
    text: `Error: ${errorpath}\n${errorMessage}`
  }

  // Gửi email
  transporter.sendMail(emailOptions, (error, info) => {
    if (error) {
      console.error('Error occurred while sending email:', error)
    } else {
      console.log('Email sent:', info.response)
    }
  })
}

// Xác nhận email đăng ký
function emailRegistrationConfirmation (mailTo, subject, message) {
  // Cập nhật nội dung email
  const emailOptions = {
    ...mailOptions,
    to: mailTo,
    subject: subject,
    text: message
  }

  // Gửi email
  transporter.sendMail(emailOptions, (error, info) => {
    if (error) {
      console.error('Error occurred while sending email:', error)
    } else {
      console.log('Email sent:', info.response)
    }
  })
}

function emailResetConfirmation (mailTo, subject, message) {
  // Cập nhật nội dung email
  const emailOptions = {
    ...mailOptions,
    to: mailTo,
    subject: subject,
    html: templateReset(message)
  }

  // Gửi email
  transporter.sendMail(emailOptions, (error, info) => {
    if (error) {
      console.error('Error occurred while sending email:', error)
    } else {
      console.log('Email sent:', info.response)
    }
  })
}
const templateReset = resetLink => {
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="vi">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quên mật khẩu</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f7f7f7;
        margin: 0;
        padding: 0;
      }
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 20px;
        border: 1px solid #ddd;
      }
      .header {
        background-color: #003580;
        padding: 20px;
        text-align: center;
      }
      .header img {
        width: 120px;
      }
      .content {
        padding: 20px;
        text-align: center;
      }
      .content h2 {
        color: #333333;
      }
      .content p {
        color: #666666;
        font-size: 16px;
      }
      .reset-button {
        display: inline-block;
        padding: 15px 25px;
        margin: 20px 0;
        font-size: 16px;
        color: #ffffff; /* Màu trắng cho text */
        background-color: #40689f;
        text-decoration: none;
        border-radius: 5px;
      }
      .footer {
        font-size: 12px;
        color: #999999;
        text-align: center;
        padding: 10px;
        border-top: 1px solid #ddd;
      }
      .footer a {
        color: #0071c2;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <img src="https://seeklogo.com/images/B/booking-logo-937C69F36E-seeklogo.com.png" alt="Booking.com logo">
      </div>
      <div class="content">
        <h2>Bạn đã quên mật khẩu?</h2>
        <p>Đừng lo – đây là chuyện thường! Bạn chỉ cần nhấn vào nút bên dưới để chọn mật khẩu mới. Thật dễ dàng phải không?</p>
        <a href="${resetLink}" class="reset-button" style="color:white">Cài đặt lại mật khẩu</a>
      </div>
      <div class="footer">
        <p>Bản quyền © 1996–2024 Booking.com. Bảo lưu mọi quyền.</p>
        <p>Email này được gửi bởi Booking.com, Oosterdoksstraat 163, 1011 DL Amsterdam, Hà Lan</p>
        <p>
          <a href="#">Bảo mật trên Cookie</a> | <a href="#">Chăm sóc khách hàng</a>
        </p>
      </div>
    </div>
  </body>
  </html>
  `
  return htmlContent
}

module.exports = {
  checkForErrors,
  emailRegistrationConfirmation,
  emailResetConfirmation
}
