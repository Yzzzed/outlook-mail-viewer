import { v4 as uuidv4 } from 'uuid';
import type { Account } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ParseResult {
  success: Account[];
  failed: Array<{ line: number; reason: string }>;
}

/**
 * 解析 CDK 格式的邮箱凭证
 * 格式: email----password----client_id----refresh_token
 */
export function parseCDKFormat(text: string): ParseResult {
  const lines = text.split('\n');
  const success: Account[] = [];
  const failed: Array<{ line: number; reason: string }> = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // 跳过空行
    if (!trimmed) return;

    const parts = trimmed.split('----');

    // 验证格式
    if (parts.length !== 4) {
      failed.push({
        line: index + 1,
        reason: '格式错误，应为: email----password----client_id----refresh_token',
      });
      return;
    }

    const [email, password, clientId, refreshToken] = parts.map(p => p.trim());

    // 验证必填字段
    if (!email || !password || !clientId || !refreshToken) {
      failed.push({
        line: index + 1,
        reason: '存在空字段',
      });
      return;
    }

    // 简单验证邮箱格式
    if (!email.includes('@')) {
      failed.push({
        line: index + 1,
        reason: '邮箱格式无效',
      });
      return;
    }

    success.push({
      id: uuidv4(),
      email,
      password,
      clientId,
      refreshToken,
      hasError: false,
    });
  });

  return { success, failed };
}
