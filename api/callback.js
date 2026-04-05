const https = require('https');

module.exports = (req, res) => {
  const code = req.query.code;
  if (!code) {
    res.status(400).send('Missing code parameter');
    return;
  }

  const postData = JSON.stringify({
    client_id: process.env.OAUTH_GITHUB_CLIENT_ID,
    client_secret: process.env.OAUTH_GITHUB_CLIENT_SECRET,
    code: code
  });

  const options = {
    hostname: 'github.com',
    path: '/login/oauth/access_token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const request = https.request(options, (response) => {
    let data = '';
    response.on('data', (chunk) => { data += chunk; });
    response.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        const token = parsed.access_token;
        const provider = 'github';
        const responseHtml = `
<html><body><script>
(function() {
  function receiveMessage(e) {
    console.log("receiveMessage %o", e);
    window.opener.postMessage(
      'authorization:${provider}:success:{"token":"${token}","provider":"${provider}"}',
      e.origin
    );
    window.removeEventListener("message", receiveMessage, false);
  }
  window.addEventListener("message", receiveMessage, false);
  window.opener.postMessage("authorizing:${provider}", "*");
})();
</script></body></html>`;
        res.status(200).send(responseHtml);
      } catch (e) {
        res.status(500).send('Failed to parse GitHub response');
      }
    });
  });

  request.on('error', (e) => {
    res.status(500).send('Error exchanging code for token');
  });

  request.write(postData);
  request.end();
};
