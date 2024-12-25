import { useState } from 'react';
import { Data } from '../typing';
/**
 * @returns
 */
export default function App({
  config,
  setConfig,
  onClickConfigSave,
  onClickMessageSave,
  Data,
  setData
}: {
  config: { host: string; port: string };
  setConfig: (config: { host: string; port: string }) => void;
  onClickConfigSave: () => void;
  onClickMessageSave: () => void;
  Data: Data;
  setData: (data: Data) => void;
}) {
  const [show, setShow] = useState(false);
  return (
    <section className="flex-1 flex flex-col overflow-auto scrollbar">
      <section className=" h-full w-full flex-1 flex flex-col gap-2 py-2 select-none">
        <div className="flex flex-col sm:flex-row gap-2">
          {/* 连接配置 */}
          <div className="md:flex-1 flex flex-col gap-2 py-2 border-y px-2 border-[var(--vscode-sidebar-border)]">
            <div className="font-semibold">连接配置</div>
            <input
              type="text"
              value={config.host}
              onChange={e => setConfig({ ...config, host: e.target.value })}
              className="min-w-0  bg-opacity-0 px-3 py-1 bg-[var(--vscode-editor-background)] rounded-md border border-[var(--vscode-sidebar-border)] focus:border-[var(--vscode-button-background)]"
              placeholder="host"
            />
            <input
              type="text"
              value={config.port}
              onChange={e => setConfig({ ...config, port: e.target.value })}
              className="min-w-0  bg-opacity-0 px-3 py-1 bg-[var(--vscode-editor-background)] rounded-md border border-[var(--vscode-sidebar-border)] focus:border-[var(--vscode-button-background)]"
              placeholder="port"
            />
            <button
              onClick={onClickConfigSave}
              className="px-2 flex items-center cursor-pointer rounded-md justify-center  py-1 border border-[var(--vscode-sidebar-border)]  hover:bg-[var(--vscode-activityBar-background)]"
            >
              保存
            </button>
          </div>

          <div className="md:flex-1 flex flex-col gap-2 py-2 border-y px-2 border-[var(--vscode-sidebar-border)]">
            <div className="font-semibold">频道配置</div>
            <input
              type="text"
              value={Data.GuildId}
              onChange={e => setData({ ...Data, GuildId: e.target.value })}
              className="min-w-0  bg-opacity-0 px-3 py-1 bg-[var(--vscode-editor-background)] rounded-md border border-[var(--vscode-sidebar-border)] focus:border-[var(--vscode-button-background)]"
              placeholder="频道编号"
            />
            <input
              type="text"
              value={Data.ChannelId}
              onChange={e => setData({ ...Data, ChannelId: e.target.value })}
              className="min-w-0  bg-opacity-0 px-3 py-1 bg-[var(--vscode-editor-background)] rounded-md border border-[var(--vscode-sidebar-border)] focus:border-[var(--vscode-button-background)]"
              placeholder="子频道编号"
            />
            <input
              type="text"
              value={Data.ChannelName}
              onChange={e => setData({ ...Data, ChannelName: e.target.value })}
              className="min-w-0  bg-opacity-0 px-3 py-1 bg-[var(--vscode-editor-background)] rounded-md border border-[var(--vscode-sidebar-border)] focus:border-[var(--vscode-button-background)]"
              placeholder="子频道昵称"
            />
            <input
              type="text"
              value={Data.ChannelAvatar}
              onChange={e =>
                setData({ ...Data, ChannelAvatar: e.target.value })
              }
              className="min-w-0  bg-opacity-0 px-3 py-1 bg-[var(--vscode-editor-background)] rounded-md border border-[var(--vscode-sidebar-border)] focus:border-[var(--vscode-button-background)]"
              placeholder="子频道头像"
            />
            <button
              onClick={onClickMessageSave}
              className="px-2 flex items-center cursor-pointer rounded-md justify-center  py-1 border border-[var(--vscode-sidebar-border)]  hover:bg-[var(--vscode-activityBar-background)]"
            >
              保存
            </button>
          </div>

          {/* 用户列表 */}
          <div className="md:flex-1 flex flex-col gap-2 py-2 border-y px-2 border-[var(--vscode-sidebar-border)]">
            <div className="font-semibold">用户列表</div>
            <div className="flex flex-row justify-between">
              <div className="flex flex-row gap-3 px-2 py-1 cursor-pointer">
                <div className="flex items-center">
                  <img
                    className="w-10 h-10 rounded-full"
                    src={Data.UserAvatar}
                    alt="Avatar"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <div className="font-semibold text-[var(--vscode-activityBar-activeBackground)]">
                    {Data.UserName}
                  </div>
                  <div className="text-sm text-[var(--vscode-text-selection-foreground)]">
                    测试用户
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <button
                  className="px-2 flex items-center cursor-pointer rounded-md py-1 hover:bg-[var(--vscode-activityBar-background)]"
                  onClick={() => setShow(!show)}
                >
                  编辑
                </button>
                <button
                  onClick={() => {
                    vscode.postMessage({
                      type: 'window.showInformationMessage',
                      payload: {
                        text: '暂未开放'
                      }
                    });
                  }}
                  className="px-2 flex items-center cursor-pointer rounded-md py-1 hover:bg-[var(--vscode-activityBar-background)]"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>

        {show && (
          <div className="md:flex-1 flex flex-col gap-2 py-2 border-y px-2 border-[var(--vscode-sidebar-border)]">
            <div className="font-semibold">用户配置</div>
            <input
              type="text"
              value={Data.UserId}
              onChange={e => setData({ ...Data, UserId: e.target.value })}
              className="min-w-0  bg-opacity-0 px-3 py-1 bg-[var(--vscode-editor-background)] rounded-md border border-[var(--vscode-sidebar-border)] focus:border-[var(--vscode-button-background)]"
              placeholder="用户编号"
            />
            <input
              type="text"
              value={Data.UserName}
              onChange={e => setData({ ...Data, UserName: e.target.value })}
              className="min-w-0  bg-opacity-0 px-3 py-1 bg-[var(--vscode-editor-background)] rounded-md border border-[var(--vscode-sidebar-border)] focus:border-[var(--vscode-button-background)]"
              placeholder="用户昵称"
            />
            <input
              type="text"
              value={Data.UserAvatar}
              onChange={e => setData({ ...Data, UserAvatar: e.target.value })}
              className="min-w-0  bg-opacity-0 px-3 py-1 bg-[var(--vscode-editor-background)] rounded-md border border-[var(--vscode-sidebar-border)] focus:border-[var(--vscode-button-background)]"
              placeholder="用户头像"
            />
            <input
              type="text"
              value={Data.OpenId}
              onChange={e => setData({ ...Data, OpenId: e.target.value })}
              className="min-w-0  bg-opacity-0 px-3 py-1 bg-[var(--vscode-editor-background)] rounded-md border border-[var(--vscode-sidebar-border)] focus:border-[var(--vscode-button-background)]"
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
