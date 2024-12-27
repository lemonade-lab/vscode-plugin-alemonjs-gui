/**
 * @returns
 */
export default function Setting({
  config,
  setConfig,
  onClickConfigSave
}: {
  config: { host: string; port: string };
  setConfig: (config: { host: string; port: string }) => void;
  onClickConfigSave: () => void;
}) {
  return (
    <section className="flex-1 flex flex-col overflow-auto scrollbar">
      <section className=" h-full w-full flex-1 flex flex-col gap-2 py-2 select-none">
        {/* 连接配置 */}
        <div className="md:flex-1 flex flex-col gap-2 py-2  px-2 border-[var(--vscode-sidebar-border)]">
          <div className="font-semibold">连接配置</div>
          <input
            type="text"
            value={config.host}
            onChange={e => setConfig({ ...config, host: e.target.value })}
            className="min-w-0  bg-opacity-0 px-3 py-1 rounded-md border bg-[var(--vscode-editor-background)]  border-[var(--vscode-sidebar-border)] focus:border-[var(--vscode-button-background)]"
            placeholder="host"
          />
          <input
            type="text"
            value={config.port}
            onChange={e => setConfig({ ...config, port: e.target.value })}
            className="min-w-0  bg-opacity-0 px-3 py-1 rounded-md border bg-[var(--vscode-editor-background)]  border-[var(--vscode-sidebar-border)] focus:border-[var(--vscode-button-background)]"
            placeholder="port"
          />
          <button
            onClick={onClickConfigSave}
            className="px-2 flex items-center cursor-pointer rounded-md justify-center  py-1 border border-[var(--vscode-sidebar-border)]  hover:bg-[var(--vscode-activityBar-background)]"
          >
            保存
          </button>
        </div>
      </section>
    </section>
  );
}
