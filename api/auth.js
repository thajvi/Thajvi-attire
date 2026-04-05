module.exports = (req, res) => {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const redirectUri = `${req.headers['x-forwarded-proto']}://${req.headers.host}/api/callback`;
  const scope = 'repo,user';
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;
  res.writeHead(302, { Location: authUrl });
  res.end();
};
