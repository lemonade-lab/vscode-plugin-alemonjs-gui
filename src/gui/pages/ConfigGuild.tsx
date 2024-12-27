import { Data, User } from '../typing';
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
          <input
            type="text"
            value={Data.GuildId}
            onChange={e => setData({ ...Data, GuildId: e.target.value })}
            className="min-w-0  bg-opacity-0 px-3 py-1 rounded-md border bg-[var(--vscode-editor-background)]  border-[var(--vscode-sidebar-border)] focus:border-[var(--vscode-button-background)]"
            placeholder="频道编号"
          />
          <input
            type="text"
            value={Data.ChannelId}
            onChange={e => setData({ ...Data, ChannelId: e.target.value })}
            className="min-w-0  bg-opacity-0 px-3 py-1 rounded-md border bg-[var(--vscode-editor-background)]  border-[var(--vscode-sidebar-border)] focus:border-[var(--vscode-button-background)]"
            placeholder="子频道编号"
          />
          <input
            type="text"
            value={Data.ChannelName}
            onChange={e => setData({ ...Data, ChannelName: e.target.value })}
            className="min-w-0  bg-opacity-0 px-3 py-1 rounded-md border bg-[var(--vscode-editor-background)]  border-[var(--vscode-sidebar-border)] focus:border-[var(--vscode-button-background)]"
            placeholder="子频道昵称"
          />
          <input
            type="text"
            value={Data.ChannelAvatar}
            onChange={e => setData({ ...Data, ChannelAvatar: e.target.value })}
            className="min-w-0  bg-opacity-0 px-3 py-1 rounded-md border bg-[var(--vscode-editor-background)]  border-[var(--vscode-sidebar-border)] focus:border-[var(--vscode-button-background)]"
            placeholder="子频道头像"
          />
          <button
            onClick={onClickMessageSave}
            className="px-2 flex items-center cursor-pointer rounded-md justify-center  py-1 border border-[var(--vscode-sidebar-border)]  hover:bg-[var(--vscode-activityBar-background)]"
          >
            保存
          </button>
        </div>
      </section>
    </section>
  );
}
