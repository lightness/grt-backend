const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const { grt } = require('github-repo-tools');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/api/grt', function (req, res) {
  const { token, t } = req.body;

  if (!token && !t) {
    res.status(401).send('Unauthorized');
  }

  grt(req.body)
    .then(response => {
      res.send(response);
    })
    .catch(err => {
      console.error('Error during communication with github-repo-tools');
      console.error(err);
      res.status(500).send('Something went wrong');
    });
});

app.post('/api/token', (req, res) => {
  const { code, state } = req.body;

  const data = {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code,
    state,
  };

  console.log('Github oauth access token payload', data);

  axios({
    method: 'post',
    url: 'https://github.com/login/oauth/access_token',
    headers: { 'Accept': 'application/json' },
    data,
  }).then(response => {
    res.send(JSON.stringify(response.data));
  }).catch(err => {
    res.status(500).send(err);
  })
})

const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});