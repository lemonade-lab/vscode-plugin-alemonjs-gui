import { useEffect, useState } from 'react';
import GroupApp from '@/gui/pages/GroupApp';
import PrivateApp from '@/gui/pages/PrivateApp';
import ConfigApp from '@/gui/pages/ConfigApp';
import classNames from 'classnames';
import { postMessage } from '../vscode';

export default function App() {
  const [status, setStatus] = useState<boolean>(false);

  const [tag, setTag] = useState<'group' | 'private' | 'config'>('config');

  const [config, setConfig] = useState({
    host: '',
    port: ''
  });

  useEffect(() => {
    // 等待配置信息
    const handleResponse = (event: any) => {
      console.log('handleResponse');
      const message = event.data;
      if (message.type === 'fs.readFile.config') {
        setConfig(message.payload);
      }
    };

    // 请求得到配置
    postMessage({
      type: 'fs.readFile.config'
    });

    window.addEventListener('message', handleResponse);
    return () => {
      window.removeEventListener('message', handleResponse);
    };
  }, []);

  const onClickConnect = () => {
    // 关闭之前的连接
    if (window.socket) {
      window.socket.close();
      postMessage({
        type: 'window.showInformationMessage',
        payload: {
          text: 'WebSocket 连接已关闭'
        }
      });
    }
    const socket = new WebSocket(`ws://${config.host}:${config.port}`);
    // 监听连接打开事件
    socket.onopen = () => {
      console.log('WebSocket 连接已建立');
      setStatus(true);
      postMessage({
        type: 'window.showInformationMessage',
        payload: {
          text: 'WebSocket 连接已建立'
        }
      });
    };
    // 监听连接关闭事件
    socket.onclose = () => {
      setStatus(false);
      console.log('WebSocket 连接已关闭');
      postMessage({
        type: 'window.showInformationMessage',
        payload: {
          text: 'WebSocket 连接已关闭'
        }
      });
    };
    window.socket = socket;
  };

  const onClickConfigSave = () => {
    // 保存。
    postMessage({
      type: 'fs.writeFile.config',
      payload: config
    });
  };

  const onClickDisconnect = () => {
    if (window.socket) {
      window.socket.close();
    }
    postMessage({
      type: 'window.showInformationMessage',
      payload: {
        text: 'WebSocket 连接断开'
      }
    });
  };

  return (
    <section className="relative h-full flex flex-col shadow-content bg-[var(--vscode-sideBar-foreground)] text-[var(--vscode-activityBar-activeBackground)]">
      <div className="select-none flex flex-row justify-between gap-2 py-1 px-2 border-b border-opacity-70 border-[var(--vscode-sidebar-border)]">
        <div className="flex flex-1 flex-row gap-2">
          <button
            onClick={onClickConnect}
            className="px-2 flex items-center cursor-pointer rounded-md py-1 hover:bg-[var(--vscode-activityBar-background)] "
          >
            连接
          </button>
          <button
            onClick={onClickDisconnect}
            className="px-2 flex items-center cursor-pointer rounded-md py-1 hover:bg-[var(--vscode-activityBar-background)] "
          >
            断开
          </button>
        </div>
        <div className="flex flex-row gap-2">
          <div
            className={classNames(
              'px-2 flex items-center cursor-pointer rounded-md py-1',
              tag === 'group' &&
                'bg-[var(--vscode-activityBar-background)] text-[var(--vscode-activityBar-activeBackground)]'
            )}
            onClick={() => setTag('group')}
          >
            群聊
          </div>
          <div
            className={classNames(
              'px-2 flex items-center cursor-pointer rounded-md py-1',
              tag === 'private' &&
                'bg-[var(--vscode-activityBar-background)] text-[var(--vscode-activityBar-activeBackground)]'
            )}
            onClick={() => setTag('private')}
          >
            私聊
          </div>
          <div
            className={classNames(
              'px-2 flex items-center cursor-pointer rounded-md py-1',
              tag === 'config' &&
                'bg-[var(--vscode-activityBar-background)] text-[var(--vscode-activityBar-activeBackground)]'
            )}
            onClick={() => setTag('config')}
          >
            配置
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-[var(--vscode-sideBar-foreground)]">
        {tag === 'config' && (
          <ConfigApp
            config={config}
            setConfig={setConfig}
            onClickConfigSave={onClickConfigSave}
          />
        )}
        {tag === 'private' && <PrivateApp status={status} />}
        {tag === 'group' && <GroupApp status={status} />}
      </div>
    </section>
  );
}
