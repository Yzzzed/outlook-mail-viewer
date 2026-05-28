import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import type { Mail } from '@/types';
import { Mail as MailIcon, Eye, Clock, User } from 'lucide-react';

interface MailListProps {
  mails: Mail[];
  onViewMail: (mail: Mail) => void;
}

export function MailList({ mails, onViewMail }: MailListProps) {
  if (mails.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-28 h-28 rounded-3xl bg-gradient-to-br from-md-primary/20 to-md-tertiary/20 mb-8 shadow-lg">
          <MailIcon className="w-14 h-14 text-md-primary" />
        </div>
        <p className="text-2xl font-medium text-md-on-surface mb-3">暂无邮件</p>
        <p className="text-base text-md-on-surface-variant">请先选择邮箱并查询</p>
      </div>
    );
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;

    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-5">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-md-tertiary to-md-tertiary-container flex-shrink-0">
          <MailIcon className="w-7 h-7 text-white" />
        </div>
        <div className="pt-1">
          <h2 className="text-2xl font-medium text-md-on-surface mb-1">邮件列表</h2>
          <p className="text-base text-md-on-surface-variant">共 {mails.length} 封邮件</p>
        </div>
      </div>

      <div className="border-2 border-md-outline/20 rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm shadow-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-md-surface-container/60 hover:bg-md-surface-container/60 border-b-2 border-md-outline/20">
              <TableHead className="w-[280px] font-medium text-md-on-surface text-base py-5 px-6">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  发件人
                </div>
              </TableHead>
              <TableHead className="font-medium text-md-on-surface text-base py-5 px-6">
                <div className="flex items-center gap-2">
                  <MailIcon className="w-4 h-4" />
                  主题
                </div>
              </TableHead>
              <TableHead className="w-[180px] font-medium text-md-on-surface text-base py-5 px-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  时间
                </div>
              </TableHead>
              <TableHead className="w-[140px] font-medium text-md-on-surface text-base text-center py-5 px-6">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mails.map((mail) => (
              <TableRow
                key={mail.id}
                className="group hover:bg-md-primary-container/15 transition-all duration-200 border-b border-md-outline/10 last:border-0"
              >
                <TableCell className="font-mono text-sm text-md-on-surface py-5 px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-md-secondary to-md-secondary-container text-white text-base font-medium flex-shrink-0 shadow-md">
                      {mail.from[0].toUpperCase()}
                    </div>
                    <span className="truncate">{mail.from}</span>
                  </div>
                </TableCell>
                <TableCell className="py-5 px-6">
                  <div className="truncate font-medium text-md-on-surface text-base">{mail.subject}</div>
                </TableCell>
                <TableCell className="text-sm text-md-on-surface-variant py-5 px-6">
                  {formatDateTime(mail.receivedDateTime)}
                </TableCell>
                <TableCell className="text-center py-5 px-6">
                  <Button
                    variant="tonal"
                    size="sm"
                    className="shadow-md hover:shadow-lg"
                    onClick={() => onViewMail(mail)}
                  >
                    <Eye className="w-4 h-4" />
                    查看
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
