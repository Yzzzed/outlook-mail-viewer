import type { Account } from '@/types';

const STORAGE_KEY = 'outlook_accounts';

export const storage = {
  // 获取所有邮箱账户
  getAccounts(): Account[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load accounts:', error);
      return [];
    }
  },

  // 保存所有邮箱账户
  saveAccounts(accounts: Account[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
    } catch (error) {
      console.error('Failed to save accounts:', error);
      throw new Error('保存失败，请检查浏览器存储空间');
    }
  },

  // 添加单个账户
  addAccount(account: Account): void {
    const accounts = this.getAccounts();
    accounts.push(account);
    this.saveAccounts(accounts);
  },

  // 批量添加账户（自动过滤已存在的邮箱）
  addAccounts(newAccounts: Account[]): { added: Account[], skipped: string[] } {
    const existingAccounts = this.getAccounts();
    const existingEmails = new Set(existingAccounts.map(acc => acc.email.toLowerCase()));

    const toAdd: Account[] = [];
    const skipped: string[] = [];

    for (const account of newAccounts) {
      const emailLower = account.email.toLowerCase();
      if (existingEmails.has(emailLower)) {
        skipped.push(account.email);
      } else {
        toAdd.push(account);
        existingEmails.add(emailLower);
      }
    }

    if (toAdd.length > 0) {
      existingAccounts.push(...toAdd);
      this.saveAccounts(existingAccounts);
    }

    return { added: toAdd, skipped };
  },

  // 删除账户
  deleteAccount(id: string): void {
    const accounts = this.getAccounts().filter(acc => acc.id !== id);
    this.saveAccounts(accounts);
  },

  // 清空所有账户
  clearAccounts(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  // 更新账户错误状态
  updateAccountError(id: string, hasError: boolean): void {
    const accounts = this.getAccounts();
    const account = accounts.find(acc => acc.id === id);
    if (account) {
      account.hasError = hasError;
      this.saveAccounts(accounts);
    }
  },

  // 更新账户标签
  updateAccountTags(id: string, tags: string[]): void {
    const accounts = this.getAccounts();
    const account = accounts.find(acc => acc.id === id);
    if (account) {
      account.tags = tags;
      this.saveAccounts(accounts);
    }
  },
};
