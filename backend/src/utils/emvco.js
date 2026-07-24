const calculateCRC16 = (data) => {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i += 1) {
    crc ^= data.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
};

const tlv = (tag, value) => {
  const stringValue = String(value);
  return `${tag}${Buffer.byteLength(stringValue, 'utf8').toString().padStart(2, '0')}${stringValue}`;
};

const ascii = (value) => String(value)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/đ/g, 'd')
  .replace(/Đ/g, 'D');

// VietQR/NAPAS payload following the EMVCo TLV format. This mirrors the
// implementation used by the EXE201 project, but is CommonJS for ALSM.
const generateVietQR = ({ bin, accountNumber, accountName, amount, orderCode }) => {
  const fields = new Map();
  fields.set('00', '01');
  fields.set('01', amount ? '12' : '11');

  const beneficiary = tlv('00', bin) + tlv('01', accountNumber);
  fields.set('38', tlv('00', 'A000000727') + tlv('01', beneficiary) + tlv('02', 'QRIBFTTA'));
  fields.set('53', '704');
  if (amount > 0) fields.set('54', String(amount));
  fields.set('58', 'VN');
  if (accountName) fields.set('59', ascii(accountName).toUpperCase().slice(0, 25));
  fields.set('60', 'HANOI');
  if (orderCode) fields.set('62', tlv('08', ascii(orderCode).replace(/\s+/g, '').slice(0, 25)));

  let payload = '';
  for (const [tag, value] of fields) payload += tlv(tag, value);
  const payloadForCrc = `${payload}6304`;
  return `${payloadForCrc}${calculateCRC16(payloadForCrc)}`;
};

module.exports = { generateVietQR };
