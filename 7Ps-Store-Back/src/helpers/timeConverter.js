function convertToMeccaTime(timeStr) {
  // Extract time from format "ST: 18:30"
  const timeMatch = timeStr.match(/\d{1,2}:\d{2}/);
  if (!timeMatch) return timeStr;

  const [hours, minutes] = timeMatch[0].split(':').map(Number);
  
  // Convert to Mecca timezone (UTC+3)
  const meccaOffset = 3;
  const localOffset = -(new Date().getTimezoneOffset() / 60);
  const hoursDiff = meccaOffset - localOffset;
  
  // Adjust hours
  let meccaHours = hours + hoursDiff;
  
  // Handle day wraparound
  if (meccaHours >= 24) {
    meccaHours -= 24;
  } else if (meccaHours < 0) {
    meccaHours += 24;
  }
  
  // Convert to 12-hour format
  const period = meccaHours >= 12 ? 'PM' : 'AM';
  meccaHours = meccaHours % 12;
  meccaHours = meccaHours === 0 ? 12 : meccaHours;
  
  return `${meccaHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

module.exports = { convertToMeccaTime };