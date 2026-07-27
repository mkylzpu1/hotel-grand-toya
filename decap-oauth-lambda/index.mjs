// Decap CMS (github backend) 用 OAuth provider
// API Gateway (HTTP API) + Lambda で動かす想定
//
// ルーティング:
//   GET /auth      -> GitHubの認可画面へリダイレクト
//   GET /callback  -> 認可コードをトークンに交換し、Decap CMSの管理画面へpostMessage
//
// 環境変数:
//   GITHUB_CLIENT_ID
//   GITHUB_CLIENT_SECRET
//   ALLOWED_ORIGIN   例: https://mkylzpu1.github.io  (postMessageのtargetOrigin用)

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN;

export const handler = async (event) => {
  const path = event.rawPath || event.path || '';

  if (path.endsWith('/auth')) {
    return handleAuth(event);
  }
  if (path.endsWith('/callback')) {
    return handleCallback(event);
  }

  return {
    statusCode: 404,
    body: 'Not Found',
  };
};

function handleAuth() {
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    scope: 'repo,user',
  });

  return {
    statusCode: 302,
    headers: {
      Location: `https://github.com/login/oauth/authorize?${params.toString()}`,
    },
    body: '',
  };
}

async function handleCallback(event) {
  const code = event.queryStringParameters?.code;

  if (!code) {
    return {
      statusCode: 400,
      body: 'Missing code parameter',
    };
  }

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const tokenData = await tokenRes.json();

  if (tokenData.error) {
    return {
      statusCode: 400,
      body: `GitHub OAuth error: ${tokenData.error_description || tokenData.error}`,
    };
  }

  const accessToken = tokenData.access_token;

  // Decap CMSが待ち受けているpostMessage形式で返す
  const message = JSON.stringify({
    token: accessToken,
    provider: 'github',
  });

  const html = `
<!doctype html>
<html>
<body>
<script>
  (function() {
    function receiveMessage(e) {
      window.opener.postMessage(
        'authorization:github:success:${message.replace(/'/g, "\\'")}',
        e.origin
      );
    }
    window.addEventListener('message', receiveMessage, false);
    window.opener.postMessage('authorizing:github', '${ALLOWED_ORIGIN}');
  })();
</script>
</body>
</html>`;

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html' },
    body: html,
  };
}
