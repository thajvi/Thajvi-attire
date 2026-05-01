const https = require('https');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Auth check — verify Supabase JWT or fall back to env var password
  var authorized = false;

  // Option 1: Supabase Bearer token
  var authHeader = req.headers['authorization'] || '';
  if (authHeader.startsWith('Bearer ')) {
    var token = authHeader.slice(7);
    try {
      var supabaseUrl = process.env.SUPABASE_URL || 'https://kqrtyygwonozakvbiujv.supabase.co';
      var supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxcnR5eWd3b25vemFrdmJpdWp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMTc0ODUsImV4cCI6MjA5Mjg5MzQ4NX0.MarhU_IRvWuAro2XE0wLS9mZIBeR3aStQstOo43E5w8';
      // Verify token by calling Supabase auth endpoint
      var userRes = await fetch(supabaseUrl + '/auth/v1/user', {
        headers: { 'Authorization': 'Bearer ' + token, 'apikey': supabaseKey }
      });
      if (userRes.ok) authorized = true;
    } catch (e) {
      // Token verification failed, continue to next method
    }
  }

  // Option 2: Legacy password via env var (not hardcoded)
  if (!authorized && process.env.ADMIN_PASSWORD) {
    if (req.headers['x-admin-pass'] === process.env.ADMIN_PASSWORD) {
      authorized = true;
    }
  }

  if (!authorized) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  var pat = process.env.GITHUB_PAT;
  if (!pat) {
    return res.status(500).json({ error: 'GitHub PAT not configured' });
  }

  var allowedFiles = ['data/products.json', 'data/site.json'];
  var { file, content, message } = req.body;

  if (!file || !content) {
    return res.status(400).json({ error: 'Missing file or content' });
  }
  if (allowedFiles.indexOf(file) === -1) {
    return res.status(400).json({ error: 'File not allowed' });
  }

  var repo = 'thajvi/Thajvi-attire';
  var branch = 'main';

  try {
    // Step 1: GET current file to obtain SHA
    var current = await githubRequest('GET', '/repos/' + repo + '/contents/' + file + '?ref=' + branch, pat, null);
    var sha = current.sha;

    // Step 2: PUT updated content
    var putBody = {
      message: message || 'Update ' + file + ' via Mobile Admin',
      content: Buffer.from(content).toString('base64'),
      sha: sha,
      branch: branch
    };
    await githubRequest('PUT', '/repos/' + repo + '/contents/' + file, pat, putBody);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('GitHub update error:', err);
    return res.status(500).json({ success: false, error: err.message || 'GitHub API error' });
  }
};

function githubRequest(method, path, token, body) {
  return new Promise(function(resolve, reject) {
    var postData = body ? JSON.stringify(body) : '';
    var options = {
      hostname: 'api.github.com',
      path: path,
      method: method,
      headers: {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'ThajviMobileAdmin',
        'Content-Type': 'application/json'
      }
    };
    if (body) options.headers['Content-Length'] = Buffer.byteLength(postData);

    var request = https.request(options, function(response) {
      var data = '';
      response.on('data', function(chunk) { data += chunk; });
      response.on('end', function() {
        try {
          var parsed = JSON.parse(data);
          if (response.statusCode >= 400) {
            reject(new Error(parsed.message || 'GitHub API error ' + response.statusCode));
          } else {
            resolve(parsed);
          }
        } catch (e) {
          reject(new Error('Failed to parse GitHub response'));
        }
      });
    });
    request.on('error', reject);
    if (body) request.write(postData);
    request.end();
  });
}
