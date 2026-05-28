/**
 * Cloudflare Pages Function - Graph API Proxy
 * 代理 Microsoft Graph API 请求
 * 使用 [[path]] 捕获所有路径
 */
export async function onRequest(context) {
  const { request, params } = context;

  try {
    // 获取路径参数（去掉 /api/graph/ 前缀）
    const path = params.path ? params.path.join('/') : '';

    // 构建完整的 Graph API URL
    const url = new URL(request.url);
    const graphUrl = `https://graph.microsoft.com/v1.0/${path}${url.search}`;

    // 转发请求
    const response = await fetch(graphUrl, {
      method: request.method,
      headers: {
        'Authorization': request.headers.get('Authorization'),
        'Content-Type': 'application/json',
      },
    });

    // 获取响应数据
    const data = await response.text();

    // 返回响应，添加 CORS 头
    return new Response(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Proxy error', message: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

// 处理 OPTIONS 预检请求
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
