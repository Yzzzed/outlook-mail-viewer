import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { parseCDKFormat } from '@/lib/utils';
import { storage } from '@/lib/storage';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';

interface ImportSectionProps {
  onImportSuccess: () => void;
}

export function ImportSection({ onImportSuccess }: ImportSectionProps) {
  const [text, setText] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = () => {
    if (!text.trim()) {
      toast.error('请输入邮箱凭证');
      return;
    }

    setIsImporting(true);

    try {
      const { success, failed } = parseCDKFormat(text);

      if (success.length > 0) {
        const { added, skipped } = storage.addAccounts(success);

        if (added.length > 0) {
          toast.success(`成功导入 ${added.length} 个邮箱`);
        }

        if (skipped.length > 0) {
          toast.info(`跳过 ${skipped.length} 个已存在的邮箱`);
        }

        if (added.length > 0) {
          setText('');
          onImportSuccess();
        }
      }

      if (failed.length > 0) {
        failed.forEach(({ line, reason }) => {
          toast.error(`第 ${line} 行: ${reason}`);
        });
      }

      if (success.length === 0 && failed.length === 0) {
        toast.error('未找到有效的邮箱凭证');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '导入失败');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-5">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-md-primary to-md-primary-container flex-shrink-0">
          <Upload className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1 pt-1">
          <h2 className="text-2xl font-medium text-md-on-surface mb-2">批量导入邮箱</h2>
          <p className="text-base text-md-on-surface-variant leading-relaxed">
            格式: email----password----client_id----refresh_token（每行一个）
          </p>
        </div>
      </div>

      <div className="relative">
        <Textarea
          placeholder="user1@outlook.com----password1----client_id1----refresh_token1&#10;user2@hotmail.com----password2----client_id2----refresh_token2"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          className="font-mono text-sm resize-none bg-white/90 border-2 border-md-outline/30 rounded-2xl focus:border-md-primary focus:bg-white transition-all duration-300 text-md-on-surface placeholder:text-md-on-surface-variant/50 px-6 py-5 shadow-sm hover:border-md-outline/50 hover:shadow-md max-h-[300px] overflow-y-auto"
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          onClick={handleImport}
          disabled={isImporting}
          size="lg"
          className="text-base px-10 py-6 shadow-lg hover:shadow-xl h-auto"
        >
          {isImporting ? (
            <>
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span className="ml-2">导入中...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span className="ml-2">开始导入</span>
            </>
          )}
        </Button>
        {text.trim() && (
          <Button
            onClick={() => setText('')}
            variant="outline"
            size="lg"
            className="text-base px-6 py-6 h-auto"
          >
            清空
          </Button>
        )}
      </div>
    </div>
  );
}
