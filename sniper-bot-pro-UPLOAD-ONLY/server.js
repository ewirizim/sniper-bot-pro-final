const express = require('express');
const basicAuth = require('express-basic-auth');
const path = require('path');
const app = express();

app.use(basicAuth({
  users: { 'admin': 'sniperboss123' },
  challenge: true
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', { score: 92, status: 'Güvenli' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Dashboard çalışıyor: http://localhost:' + port);
});
