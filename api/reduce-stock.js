const https = require('https');

// Called after Razorpay payment is verified. Reduces stock in products.json via GitHub API.
// Input: { items: [{ productId, size, quantity }], orderId }
// Auth: Requires GITHUB_PAT env var (same as github-update.js)

function makeProductId(name) {
  return String(name).toLowerCase().replace(/\s+/g, '-');
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  var body = req.body || {};
  if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
    return res.status(400).json({ error: 'missing_items', message: 'items array required' });
  }

  var pat = process.env.GITHUB_PAT;
  if (!pat) {
    return res.status(500).json({ error: 'not_configured', message: 'GitHub PAT not set' });
  }

  var repo = 'thajvi/Thajvi-attire';
  var branch = 'main';
  var filePath = 'data/products.json';

  try {
    // Step 1: Read current products.json from GitHub
    var current = await githubRequest('GET', '/repos/' + repo + '/contents/' + filePath + '?ref=' + branch, pat, null);
    var sha = current.sha;
    var productsData = JSON.parse(Buffer.from(current.content, 'base64').toString('utf8'));
    var products = productsData.items || [];

    // Step 2: Reduce stock for each purchased item
    var changes = [];
    for (var i = 0; i < body.items.length; i++) {
      var reqItem = body.items[i];
      for (var j = 0; j < products.length; j++) {
        if (makeProductId(products[j].name) === reqItem.productId) {
          if (products[j].inventory && products[j].inventory.sizes && products[j].inventory.sizes[reqItem.size] !== undefined) {
            var before = products[j].inventory.sizes[reqItem.size];
            products[j].inventory.sizes[reqItem.size] = Math.max(0, before - (reqItem.quantity || 1));
            changes.push(reqItem.productId + ' ' + reqItem.size + ': ' + before + ' → ' + products[j].inventory.sizes[reqItem.size]);
          }
          break;
        }
      }
    }

    if (changes.length === 0) {
      return res.status(200).json({ success: true, message: 'No stock changes needed' });
    }

    // Step 3: Write updated products.json back to GitHub
    var updatedContent = JSON.stringify(productsData, null, 2);
    var commitMessage = 'Auto stock reduction: ' + (body.orderId || 'order') + '\n' + changes.join(', ');

    await githubRequest('PUT', '/repos/' + repo + '/contents/' + filePath, pat, {
      message: commitMessage,
      content: Buffer.from(updatedContent).toString('base64'),
      sha: sha,
      branch: branch
    });

    return res.status(200).json({ success: true, changes: changes });
  } catch (err) {
    console.error('Stock reduction error:', err.message);
    return res.status(500).json({ error: 'stock_update_failed', message: err.message });
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
        'User-Agent': 'ThajviStockManager',
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
