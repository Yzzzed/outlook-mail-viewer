import { useState, useMemo } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import type { Account } from '@/types';
import { storage } from '@/lib/storage';
import { toast } from 'sonner';
import { Mail, Trash2, AlertCircle, Users, Copy, Tag, Search } from 'lucide-react';
import { TagEditor } from '@/components/TagEditor';
import { getTagColor } from '@/lib/tag-colors';
import { useDebounce } from '@/hooks/useDebounce';

interface AccountListProps {
  accounts: Account[];
  selectedAccountId: string | null;
  onSelectAccount: (id: string) => void;
  onAccountsChange: () => void;
}

export function AccountList({
  accounts,
  selectedAccountId,
  onSelectAccount,
  onAccountsChange,
}: AccountListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  // 过滤邮箱列表
  const filteredAccounts = useMemo(() => {
    if (!debouncedSearch.trim()) {
      return accounts;
    }

    const query = debouncedSearch.toLowerCase();
    return accounts.filter((account) => {
      // 匹配邮箱地址
      if (account.email.toLowerCase().includes(query)) {
        return true;
      }
      // 匹配标签
      if (account.tags?.some(tag => tag.toLowerCase().includes(query))) {
        return true;
      }
      return false;
    });
  }, [accounts, debouncedSearch]);

  const handleDelete = (id: string) => {
    storage.deleteAccount(id);
    toast.success('已删除邮箱');
    onAccountsChange();
  };

  const handleCopy = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      toast.success('已复制邮箱地址');
    } catch (error) {
      toast.error('复制失败');
    }
  };

  const handleTagsChange = (accountId: string, newTags: string[]) => {
    storage.updateAccountTags(accountId, newTags);
    toast.success('标签已更新');
    onAccountsChange();
  };

  const handleClearAll = () => {
    if (accounts.length === 0) return;

    if (confirm(`确定要清空所有 ${accounts.length} 个邮箱吗？`)) {
      storage.clearAccounts();
      toast.success('已清空所有邮箱');
      onAccountsChange();
    }
  };

  if (accounts.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-28 h-28 rounded-3xl bg-gradient-to-br from-md-secondary/20 to-md-secondary-container/30 mb-8 shadow-lg">
          <Mail className="w-14 h-14 text-md-secondary" />
        </div>
        <p className="text-2xl font-medium text-md-on-surface mb-3">暂无邮箱</p>
        <p className="text-base text-md-on-surface-variant">请先在上方导入邮箱凭证</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-5">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-md-secondary to-md-secondary-container flex-shrink-0">
            <Users className="w-7 h-7 text-white" />
          </div>
          <div className="pt-1">
            <h2 className="text-2xl font-medium text-md-on-surface mb-1">邮箱列表</h2>
            <p className="text-base text-md-on-surface-variant">已导入 {accounts.length} 个邮箱</p>
          </div>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleClearAll}
          className="shadow-md hover:shadow-lg"
        >
          <Trash2 className="w-4 h-4" />
          清空全部
        </Button>
      </div>

      {/* 搜索框 */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-md-on-surface-variant pointer-events-none" />
        <Input
          placeholder="搜索邮箱地址或标签..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-12 bg-white/60 border-2 border-md-outline/20 rounded-2xl focus:border-md-primary focus:bg-white transition-all"
        />
      </div>

      <RadioGroup value={selectedAccountId || ''} onValueChange={onSelectAccount}>
        <div className="space-y-3 max-h-[400px] overflow-y-auto overflow-x-hidden pr-2">
          {filteredAccounts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-md-on-surface-variant">
                {searchQuery ? '未找到匹配的邮箱' : '暂无邮箱'}
              </p>
            </div>
          ) : (
            filteredAccounts.map((account) => (
            <div
              key={account.id}
              className={`group flex items-center justify-between px-6 py-5 rounded-2xl transition-all duration-300 ease-md-standard border-2 ${
                selectedAccountId === account.id
                  ? 'bg-md-secondary-container border-md-secondary shadow-lg'
                  : 'bg-white/60 border-md-outline/20 hover:bg-white hover:border-md-outline/40 hover:shadow-md'
              }`}
            >
              <div className="flex items-center space-x-4 flex-1">
                <RadioGroupItem value={account.id} id={account.id} className="w-5 h-5" />
                <Label
                  htmlFor={account.id}
                  className="flex-1 cursor-pointer flex items-center gap-4"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-md-tertiary to-md-tertiary-container text-white text-lg font-medium shadow-md">
                    {account.email[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-medium text-md-on-surface truncate">{account.email}</div>

                    {/* 标签显示 */}
                    {account.tags && account.tags.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-2">
                        {account.tags.slice(0, 3).map((tag) => {
                          const colors = getTagColor(tag);
                          return (
                            <span
                              key={tag}
                              className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                              style={{ backgroundColor: colors.bg, color: colors.text }}
                            >
                              {tag}
                            </span>
                          );
                        })}
                        {account.tags.length > 3 && (
                          <span className="text-xs text-md-on-surface-variant font-medium">
                            +{account.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {account.hasError && (
                      <div className="flex items-center gap-2 text-md-error text-sm mt-1">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>认证失败</span>
                      </div>
                    )}
                  </div>
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <TagEditor
                  tags={account.tags || []}
                  onTagsChange={(newTags) => handleTagsChange(account.id, newTags)}
                >
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-md-tertiary hover:bg-md-tertiary-container/50"
                  >
                    <Tag className="w-4 h-4" />
                  </Button>
                </TagEditor>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleCopy(account.email)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-md-primary hover:bg-md-primary-container/50"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleDelete(account.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-md-error hover:bg-md-error-container/50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
          )}
        </div>
      </RadioGroup>
    </div>
  );
}
