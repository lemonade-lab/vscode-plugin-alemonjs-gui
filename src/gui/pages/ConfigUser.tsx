import { useState } from 'react';
import { Data, User } from '../typing';
/**
 * @returns
 */
export default function ConfigUser({
  onClickMessageSave,
  Data,
  setData,
  user
}: {
  onClickMessageSave: () => void;
  Data: Data;
  setData: (data: Data) => void;
  user: User[];
}) {
  const [show, setShow] = useState(false);
  return (
    <section className="flex-1 flex flex-col overflow-auto scrollbar">
      <section className="h-full w-full flex-1 flex flex-col gap-2 py-2 select-none">
        {/* 用户列表 */}
        <div className="py-2 px-2">
          <div className="flex flex-col gap-2    border-[var(--vscode-sidebar-border)]">
            <div className="font-semibold">用户列表</div>
            {[
              {
                UserId: Data.BotId,
                UserName: Data.BotName,
                UserAvatar: Data.BotAvatar,
                DOCS: 'bot'
              },
              {
                UserId: Data.UserId,
                UserName: Data.UserName,
                UserAvatar: Data.UserAvatar,
                DOCS: 'myself'
              },
              ...user
            ].map(item => (
              <div className="flex flex-row justify-between border-y border-[var(--vscode-sidebar-border)]">
                <div className="flex flex-row gap-3 px-2 py-1 cursor-pointer">
                  <div className="flex items-center">
                    <img
                      className="w-10 h-10 rounded-full"
                      src={item.UserAvatar}
                      alt="Avatar"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="font-semibold text-[var(--vscode-textPreformat-foreground)]">
                      {item.UserName}
                    </div>
                    <div className="text-sm text-[var(--vscode-textPreformat-background)]">
                      {item['DOCS'] ?? '测试用户'}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row gap-2 items-center">
                  {item['DOCS'] == 'myself' && (
                    <>
                      <button
                        className="px-2 flex items-center cursor-pointer rounded-md py-1 hover:bg-[var(--vscode-activityBar-background)]"
                        onClick={() => setShow(!show)}
                      >
                        编辑
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {show && (
          <div className="flex flex-col gap-2 py-2  px-2 border-[var(--vscode-sidebar-border)]">
            <div className="font-semibold">用户配置</div>
            <input
              type="text"
              value={Data.UserId}
              onChange={e => setData({ ...Data, UserId: e.target.value })}
              className="min-w-0  bg-opacity-0 px-3 py-1 rounded-md border bg-[var(--vscode-editor-background)]  border-[var(--vscode-sidebar-border)] focus:border-[var(--vscode-button-background)]"
              placeholder="用户编号"
            />
            <input
              type="text"
              value={Data.UserName}
              onChange={e => setData({ ...Data, UserName: e.target.value })}
              className="min-w-0  bg-opacity-0 px-3 py-1 rounded-md border bg-[var(--vscode-editor-background)]  border-[var(--vscode-sidebar-border)] focus:border-[var(--vscode-button-background)]"
              placeholder="用户昵称"
            />
            <input
              type="text"
              value={Data.UserAvatar}
              onChange={e => setData({ ...Data, UserAvatar: e.target.value })}
              className="min-w-0  bg-opacity-0 px-3 py-1 rounded-md border bg-[var(--vscode-editor-background)]  border-[var(--vscode-sidebar-border)] focus:border-[var(--vscode-button-background)]"
              placeholder="用户头像"
            />
            <input
              type="text"
              value={Data.OpenId}
              onChange={e => setData({ ...Data, OpenId: e.target.value })}
              className="min-w-0  bg-opacity-0 px-3 py-1 rounded-md border bg-[var(--vscode-editor-background)]  border-[var(--vscode-sidebar-border)] focus:border-[var(--vscode-button-background)]"
              placeholder="用户开放ID"
            />
            <button
              onClick={onClickMessageSave}
              className="px-2 flex items-center cursor-pointer rounded-md justify-center  py-1 border border-[var(--vscode-sidebar-border)]  hover:bg-[var(--vscode-activityBar-background)]"
            >
              保存
            </button>
          </div>
        )}
      </section>
    </section>
  );
}
