const { parse } = require('dotenv');

require('dotenv').config();

/**
 * Lấy ngày giờ hiện tại theo múi giờ Việt Nam
 * @returns {string} - Ngày giờ theo định dạng yyyy-MM-dd HH:mm:ss
 */
const dateNow = () => {
  const timeZone = 'Asia/Ho_Chi_Minh'; // Múi giờ Việt Nam
  const now = new Date();

  // Lấy các thành phần ngày giờ
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  // Tách các phần tử
  const parts = formatter.formatToParts(now);
  const dateParts = {
    year: parts.find(part => part.type === 'year').value,
    month: parts.find(part => part.type === 'month').value,
    day: parts.find(part => part.type === 'day').value,
    hour: parts.find(part => part.type === 'hour').value,
    minute: parts.find(part => part.type === 'minute').value,
    second: parts.find(part => part.type === 'second').value,
  };

  // Kết hợp thành chuỗi định dạng yyyy-MM-dd HH:mm:ss
  return `${dateParts.year}-${dateParts.month}-${dateParts.day} ${dateParts.hour}:${dateParts.minute}:${dateParts.second}`;
};

module.exports = {
  dateNow
};
