import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Inbox } from 'lucide-react';

interface QuerySectionProps {
  disabled: boolean;
  onQuery: (count: number) => void;
}

export function QuerySection({ disabled, onQuery }: QuerySectionProps) {
  const [count, setCount] = useState('10');

  const handleQuery = () => {
    onQuery(parseInt(count));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-5">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/30 backdrop-blur-sm flex-shrink-0">
          <Search className="w-7 h-7 text-md-on-primary-container" />
        </div>
        <div className="pt-1">
          <h2 className="text-2xl font-medium text-md-on-primary-container mb-1">查询邮件</h2>
          <p className="text-base text-md-on-primary-container/80">选择要查询的邮件数量</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-4 bg-white/40 backdrop-blur-md px-6 py-3.5 rounded-full border border-white/30 shadow-md">
          <Inbox className="w-5 h-5 text-md-on-primary-container" />
          <span className="text-base font-medium text-md-on-primary-container">查询最新</span>
          <Select value={count} onValueChange={(value) => value && setCount(value)}>
            <SelectTrigger className="w-20 border-md-outline bg-white/50 backdrop-blur-sm rounded-full h-10 text-base font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-base font-medium text-md-on-primary-container">封邮件</span>
        </div>

        <Button
          onClick={handleQuery}
          disabled={disabled}
          size="lg"
          className="text-base px-8 shadow-md hover:shadow-lg"
        >
          {disabled ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              查询中...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              开始查询
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
