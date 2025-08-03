const express = require('express');
const basicAuth = require('express-basic-auth');
const path = require('path');
const { exec } = require('child_process');
const app = express();

// Bot dosyalarını arka planda çalıştır
const botScripts = [
  'core/monitorPrice.js',
  'core/tokenScanner.js',
  'core/walletTracker.js'
];
botScripts.forEach(script => {
  exec(`node ${script}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Bot error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Bot stderr: ${stderr}`);
      return;
    }
    console.log(`Bot output: ${stdout}`);
  });
});

// Auth ayarı
app.use(basicAuth({
  users: { 'admin': 'sniperboss123' },
  challenge: true
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', { score: 99, status: 'Otomatik Bot Aktif' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Dashboard aktif: http://localhost:' + port);
});
