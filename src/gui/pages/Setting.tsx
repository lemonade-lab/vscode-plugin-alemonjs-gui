import { Button } from '@/gui/ui/Button';
import { Input } from '@/gui/ui/Input';

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
          <Input
            type="text"
            value={config.host}
            onChange={e => setConfig({ ...config, host: e.target.value })}
            placeholder="host"
          />
          <Input
            type="text"
            value={config.port}
            onChange={e => setConfig({ ...config, port: e.target.value })}
            placeholder="port"
          />
          <Button onClick={onClickConfigSave}>保存</Button>
        </div>
      </section>
    </section>
  );
}
