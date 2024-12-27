import { Data, User } from '../typing';
import { Button } from '@/gui/ui/Button';
import { Input } from '@/gui/ui/Input';
/**
 * @returns
 */
export default function ConfigGuild({
  onClickMessageSave,
  Data,
  setData
}: {
  onClickMessageSave: () => void;
  Data: Data;
  setData: (data: Data) => void;
  user: User[];
}) {
  return (
    <section className="flex-1 flex flex-col overflow-auto scrollbar">
      <section className="h-full w-full flex-1 flex flex-col gap-2 py-2 select-none">
        <div className="flex flex-col gap-2 py-2  px-2 border-[var(--vscode-sidebar-border)]">
          <div className="font-semibold">频道配置</div>
          <Input
            type="text"
            value={Data.GuildId}
            onChange={e => setData({ ...Data, GuildId: e.target.value })}
            placeholder="频道编号"
          />
          <Input
            type="text"
            value={Data.ChannelId}
            onChange={e => setData({ ...Data, ChannelId: e.target.value })}
            placeholder="子频道编号"
          />
          <Input
            type="text"
            value={Data.ChannelName}
            onChange={e => setData({ ...Data, ChannelName: e.target.value })}
            placeholder="子频道昵称"
          />
          <Input
            type="text"
            value={Data.ChannelAvatar}
            onChange={e => setData({ ...Data, ChannelAvatar: e.target.value })}
            placeholder="子频道头像"
          />
          <Button onClick={onClickMessageSave}>保存</Button>
        </div>
      </section>
    </section>
  );
}
