import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Mail } from '@/types';

interface MailDetailModalProps {
  mail: Mail | null;
  open: boolean;
  onClose: () => void;
}

export function MailDetailModal({ mail, open, onClose }: MailDetailModalProps) {
  if (!mail) return null;

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>邮件详情</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex gap-2">
              <span className="font-semibold min-w-20">发件人:</span>
              <span className="font-mono">{mail.from}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold min-w-20">主题:</span>
              <span>{mail.subject}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold min-w-20">时间:</span>
              <span>{formatDateTime(mail.receivedDateTime)}</span>
            </div>
          </div>
          <div className="border-t pt-4">
            <div className="font-semibold mb-2">邮件正文:</div>
            <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap font-mono text-sm max-h-96 overflow-y-auto">
              {mail.body || '(无内容)'}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
