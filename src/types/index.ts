export interface Account {
  id: string;                    // 唯一 ID（UUID）
  email: string;
  password: string;
  clientId: string;
  refreshToken: string;
  hasError?: boolean;            // 错误标记
  tags?: string[];               // 标签列表
}

export interface Mail {
  id: string;
  from: string;
  subject: string;
  receivedDateTime: string;
  bodyPreview: string;
  body: string;                  // 纯文本正文
}

export interface GraphApiTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface GraphApiMailResponse {
  value: Array<{
    id: string;
    from: {
      emailAddress: {
        address: string;
        name: string;
      };
    };
    subject: string;
    receivedDateTime: string;
    bodyPreview: string;
    body: {
      contentType: string;
      content: string;
    };
  }>;
}
