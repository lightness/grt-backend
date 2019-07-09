const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const GrtService = require('./grt-service');

const GITHUB_CLIENT_ID = '8b20e17f2c8c05c29536';
const GITHUB_CLIENT_SECRET = '17587914489ea7db1de22d75bf8c93c669ad4255';

const app = express();
const grtService = new GrtService();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  res.send('Hello');
})

app.post('/api/grt', function (req, res) {
  const { token, t } = req.body;

  if (!token && !t) {
    res.status(401);
    res.send("Unauthorized");
  }

  grtService.call(req.body)
    .then(response => {
      res.send(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500);
      res.send(err);
    });
});

app.post('/api/token', (req, res) => {
  console.log('api-token', req.body);
  const { code, state } = req.body;

  const data = {
    client_id: GITHUB_CLIENT_ID,
    client_secret: GITHUB_CLIENT_SECRET,
    code,
    state,
  };

  console.log('data', data);

  axios({
    method: 'post',
    url: 'https://github.com/login/oauth/access_token',
    headers: { 'Accept': 'application/json' },
    data,
  }).then(response => {
    console.log('> then', response.data);
    res.send(JSON.stringify(response.data));
  }).catch(err => {
    console.log('> catch');
    res.status(500);
    res.send(err);
  })
})

// app.get('/auth/github',
//   passport.authenticate('github')
// );

// app.get('/auth/github/callback',
//   passport.authenticate('github', { failureRedirect: '/' }),
//   function (req, res) {
//     res.send(JSON.stringify({ token: req.user.accessToken }));
//   }
// );

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});