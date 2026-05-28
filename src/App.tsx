import { useState, useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { ImportSection } from '@/components/ImportSection';
import { AccountList } from '@/components/AccountList';
import { QuerySection } from '@/components/QuerySection';
import { MailList } from '@/components/MailList';
import { MailDetailModal } from '@/components/MailDetailModal';
import { storage } from '@/lib/storage';
import { fetchLatestMails } from '@/lib/microsoft-api';
import type { Account, Mail } from '@/types';
import { toast } from 'sonner';
import { Mail as MailIcon, Inbox } from 'lucide-react';

function App() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [mails, setMails] = useState<Mail[]>([]);
  const [selectedMail, setSelectedMail] = useState<Mail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuerying, setIsQuerying] = useState(false);

  // 加载账户列表
  const loadAccounts = () => {
    const loadedAccounts = storage.getAccounts();
    setAccounts(loadedAccounts);

    // 如果当前选中的账户被删除，清空选择
    if (selectedAccountId && !loadedAccounts.find(acc => acc.id === selectedAccountId)) {
      setSelectedAccountId(null);
      setMails([]);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleImportSuccess = () => {
    loadAccounts();
  };

  const handleSelectAccount = (id: string) => {
    setSelectedAccountId(id);
    setMails([]); // 切换账户时清空邮件列表
  };

  const handleQuery = async (count: number) => {
    if (!selectedAccountId) {
      toast.error('请先选择一个邮箱');
      return;
    }

    const account = accounts.find(acc => acc.id === selectedAccountId);
    if (!account) {
      toast.error('邮箱不存在');
      return;
    }

    setIsQuerying(true);
    setMails([]);

    try {
      const fetchedMails = await fetchLatestMails(account, count);
      setMails(fetchedMails);

      // 清除错误标记
      if (account.hasError) {
        storage.updateAccountError(account.id, false);
        loadAccounts();
      }

      if (fetchedMails.length === 0) {
        toast.info('该邮箱暂无邮件');
      } else {
        toast.success(`成功获取 ${fetchedMails.length} 封邮件`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : '查询失败';
      toast.error(message);

      // 标记账户错误
      storage.updateAccountError(account.id, true);
      loadAccounts();
    } finally {
      setIsQuerying(false);
    }
  };

  const handleViewMail = (mail: Mail) => {
    setSelectedMail(mail);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMail(null);
  };

  return (
    <div className="min-h-screen bg-md-background relative overflow-hidden">
      {/* Organic Blur Shapes - Background Decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-md-primary/15 to-md-tertiary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-md-secondary/12 to-md-primary/8 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-md-tertiary/10 to-md-secondary/8 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <header className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-3xl bg-gradient-to-br from-md-primary to-md-tertiary mb-4 md-elevation-2 hover:md-elevation-3 md-transition">
            <MailIcon className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl md:text-xl font-medium text-md-on-background mb-3 tracking-tight">
            Outlook 邮件
          </h1>
          <p className="text-base text-md-on-surface-variant max-w-2xl mx-auto">
            批量导入邮箱凭证，快速查询最新邮件
          </p>
        </header>

        <div className="space-y-6">
          {/* 导入区域 */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-10 shadow-xl hover:shadow-2xl md-transition border-2 border-md-outline/10">
            <ImportSection onImportSuccess={handleImportSuccess} />
          </div>

          {/* 邮箱列表 */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-10 shadow-xl hover:shadow-2xl md-transition border-2 border-md-outline/10">
            <AccountList
              accounts={accounts}
              selectedAccountId={selectedAccountId}
              onSelectAccount={handleSelectAccount}
              onAccountsChange={loadAccounts}
            />
          </div>

          {/* 查询区域 */}
          {selectedAccountId && (
            <div className="relative bg-gradient-to-br from-md-primary-container/95 to-md-secondary-container/95 backdrop-blur-xl rounded-3xl p-10 shadow-xl overflow-hidden border-2 border-md-primary/20">
              {/* Subtle glow effect */}
              <div className="absolute -top-32 -right-32 w-80 h-80 bg-md-primary/15 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-md-tertiary/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
              <div className="relative">
                <QuerySection
                  disabled={isQuerying}
                  onQuery={handleQuery}
                />
              </div>
            </div>
          )}

          {/* 邮件列表 */}
          {(mails.length > 0 || isQuerying) && (
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-10 shadow-xl hover:shadow-2xl md-transition border-2 border-md-outline/10">
              {isQuerying ? (
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-md-secondary-container mb-8 animate-pulse shadow-lg">
                    <Inbox className="w-12 h-12 text-md-on-secondary-container" />
                  </div>
                  <p className="text-2xl font-medium text-md-on-surface">查询中...</p>
                </div>
              ) : (
                <MailList mails={mails} onViewMail={handleViewMail} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* 邮件详情弹窗 */}
      <MailDetailModal
        mail={selectedMail}
        open={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Toast 通知 */}
      <Toaster />
    </div>
  );
}

export default App;
