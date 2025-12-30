const QRCode = require('qrcode');
const os = require('os');
const path = require('path');

function getLocalIp() {
  const ifaces = os.networkInterfaces();
  for (const name of Object.keys(ifaces)) {
    for (const iface of ifaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

const ip = getLocalIp();
const port = process.env.PORT || '8081';
const url = `http://${ip}:${port}`;
const outFile = path.resolve(__dirname, '..', 'qr-metro.png');

(async () => {
  try {
    await QRCode.toFile(outFile, url, { width: 512 });
    const ascii = await QRCode.toString(url, { type: 'terminal' });
    console.log('\nQR code URL:', url);
    console.log('\nQR code saved to:', outFile);
    console.log('\nScan this ASCII QR from your terminal or open the PNG file to scan with your iPhone:\n');
    console.log(ascii);
  } catch (err) {
    console.error('Failed to generate QR code:', err);
    process.exit(1);
  }
})();
