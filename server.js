const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const session = require('express-session');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'gizli_sifre',
  resave: false,
  saveUninitialized: true
}));

// Kullanıcı girişi kontrolü
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'sniperboss123') {
    req.session.loggedIn = true;
    res.redirect('/dashboard');
  } else {
    res.send('Giriş başarısız');
  }
});

// Giriş ekranı
app.get('/', (req, res) => {
  res.render('login');
});

// 🔐 Dashboard rotası
app.get('/dashboard', (req, res) => {
  if (!req.session.loggedIn) {
    return res.redirect('/');
  }

  const logPath = path.join(__dirname, 'logs', 'trade_log.json');
  let trades = [];

  if (fs.existsSync(logPath)) {
    const raw = fs.readFileSync(logPath);
    try {
      trades = JSON.parse(raw);
    } catch (err) {
      console.error("Trade log parse hatası:", err.message);
    }
  }

  const lastTrade = trades.length > 0 ? trades[trades.length - 1] : {};
  res.render('dashboard', {
    botStatus: '🟢 Aktif',
    lastScore: lastTrade.score || 'Yok',
    lastToken: lastTrade.token || 'Yok',
    trades
  });
});

// Sunucuyu başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 SniperBot Dashboard başlatıldı: http://localhost:${PORT}`);
});
