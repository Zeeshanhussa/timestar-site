
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const payload = JSON.parse(event.body);
    const REPO_OWNER = process.env.REPO_OWNER; // e.g., 'username'
    const REPO_NAME = process.env.REPO_NAME;   // e.g., 'timestar-site'
    const BRANCH = process.env.BRANCH || 'main';
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Personal Access Token with repo scope
    if(!REPO_OWNER || !REPO_NAME || !GITHUB_TOKEN) {
      return { statusCode: 500, body: 'Missing environment variables on Netlify (REPO_OWNER, REPO_NAME, GITHUB_TOKEN).' };
    }

    const path = 'data/products.json';
    const apiBase = 'https://api.github.com/repos/' + REPO_OWNER + '/' + REPO_NAME + '/contents/' + path;

    // Get current file to retrieve sha (if exists)
    let sha = null;
    const getRes = await fetch(apiBase + '?ref=' + BRANCH, {
      headers: { 'Authorization': 'token ' + GITHUB_TOKEN, 'Accept': 'application/vnd.github.v3+json' }
    });
    if (getRes.status === 200) {
      const getJson = await getRes.json();
      sha = getJson.sha;
    }

    const content = Buffer.from(JSON.stringify(payload, null, 2)).toString('base64');
    const body = {
      message: 'Update products.json via Netlify publish',
      content: content,
      branch: BRANCH
    };
    if (sha) body.sha = sha;

    const putRes = await fetch(apiBase, {
      method: 'PUT',
      headers: { 'Authorization': 'token ' + GITHUB_TOKEN, 'Accept': 'application/vnd.github.v3+json' },
      body: JSON.stringify(body)
    });
    const putJson = await putRes.json();
    if (putRes.status >= 200 && putRes.status < 300) {
      return { statusCode: 200, body: JSON.stringify({ message: 'Committed and deployed', result: putJson }) };
    } else {
      return { statusCode: putRes.status, body: JSON.stringify(putJson) };
    }
  } catch (e) {
    return { statusCode: 500, body: e.message };
  }
};
