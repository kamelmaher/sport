function parseFrequencyInfo(frequencyText) {
  if (!frequencyText) return null;

  const frequencyInfo = {
    position: '',
    satellite: '',
    frequency: '',
    symbolRate: '',
    encryption: ''
  };

  const rows = frequencyText.match(/<tr>.*?<\/tr>/gs);
  if (!rows || rows.length < 2) return null;

  // Skip header row and process first data row
  const dataRow = rows[1];
  const cells = dataRow.match(/<td.*?>(.*?)<\/td>/g);
  
  if (cells && cells.length >= 5) {
    frequencyInfo.position = cells[0].replace(/<[^>]*>/g, '').trim();
    frequencyInfo.satellite = cells[1].replace(/<[^>]*>/g, '').trim();
    frequencyInfo.frequency = cells[2].replace(/<[^>]*>/g, '').trim();
    frequencyInfo.symbolRate = cells[3].replace(/<[^>]*>/g, '').trim();
    frequencyInfo.encryption = cells[4].replace(/<[^>]*>/g, '').trim();
  }

  return frequencyInfo;
}

module.exports = { parseFrequencyInfo };