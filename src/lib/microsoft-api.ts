import type { Account, Mail, GraphApiTokenResponse, GraphApiMailResponse } from '@/types';

const TOKEN_ENDPOINT = '/api/oauth/token';
const GRAPH_API_BASE = '/api/graph';

/**
 * 使用 refresh_token 获取 access_token
 */
export async function refreshAccessToken(account: Account): Promise<string> {
  const params = new URLSearchParams({
    client_id: account.clientId,
    refresh_token: account.refreshToken,
    grant_type: 'refresh_token',
    scope: 'https://graph.microsoft.com/Mail.Read',
  });

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    if (response.status === 400 && error.error === 'invalid_grant') {
      throw new Error('凭证已失效，请重新导入');
    }
    throw new Error(`获取 token 失败: ${response.status}`);
  }

  const data: GraphApiTokenResponse = await response.json();
  return data.access_token;
}

/**
 * 查询最新的 N 封邮件
 */
export async function fetchLatestMails(
  account: Account,
  count: number = 10
): Promise<Mail[]> {
  // 1. 刷新 access token
  const accessToken = await refreshAccessToken(account);

  // 2. 调用 Graph API 获取邮件
  const url = `${GRAPH_API_BASE}/me/messages?$top=${count}&$orderby=receivedDateTime desc&$select=id,from,subject,receivedDateTime,bodyPreview,body`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('认证失败，请重新导入凭证');
    }
    throw new Error(`查询邮件失败: ${response.status}`);
  }

  const data: GraphApiMailResponse = await response.json();

  // 3. 转换为应用内的 Mail 类型
  return data.value.map(item => ({
    id: item.id,
    from: item.from.emailAddress.address,
    subject: item.subject || '(无主题)',
    receivedDateTime: item.receivedDateTime,
    bodyPreview: item.bodyPreview || '',
    body: item.body.contentType === 'text' ? item.body.content : stripHtml(item.body.content),
  }));
}

/**
 * 简单的 HTML 标签移除（用于将 HTML 邮件转为纯文本）
 */
function stripHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}
