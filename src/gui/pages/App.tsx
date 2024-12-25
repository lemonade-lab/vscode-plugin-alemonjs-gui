import { useEffect, useState } from 'react';
import GroupApp from '@/gui/pages/GroupApp';
import PrivateApp from '@/gui/pages/PrivateApp';
import ConfigApp from '@/gui/pages/ConfigApp';
import classNames from 'classnames';
import { Data } from '../typing';

export default function App() {
  const [status, setStatus] = useState<boolean>(false);
  const [tag, setTag] = useState<'group' | 'private' | 'config'>('config');
  const [config, setConfig] = useState({
    host: '',
    port: ''
  });

  const [data, setData] = useState<Data>({
    BotId: '',
    BotName: '',
    BotAvatar: '',
    UserId: '',
    UserName: '',
    OpenId: '',
    UserAvatar: '',
    GuildId: '',
    ChannelId: '',
    ChannelName: '',
    ChannelAvatar: ''
  });

  useEffect(() => {
    // 等待配置信息
    const handleResponse = (event: any) => {
      console.log('handleResponse');
      const message = event.data;
      if (message.type === 'fs.readFile.config') {
        setConfig(message.payload);
      }
      if (message.type === 'fs.readFile.message') {
        setData(message.payload);
      }
      vscode.postMessage({
        type: 'window.showInformationMessage',
        payload: {
          text: '配置加载成功'
        }
      });
    };
    // 请求得到配置
    vscode.postMessage({
      type: 'fs.readFile.config'
    });
    vscode.postMessage({
      type: 'fs.readFile.message'
    });
    window.addEventListener('message', handleResponse);
    return () => {
      window.removeEventListener('message', handleResponse);
    };
  }, []);

  /**
   *
   */
  const onClickConnect = () => {
    try {
      // 关闭之前的连接
      if (window.socket) {
        window.socket.close();
        vscode.postMessage({
          type: 'window.showInformationMessage',
          payload: {
            text: '连接已关闭'
          }
        });
      }
      const socket = new WebSocket(`ws://${config.host}:${config.port}`);
      // 监听连接打开事件
      socket.onopen = () => {
        console.log('连接已建立');
        setStatus(true);
        vscode.postMessage({
          type: 'window.showInformationMessage',
          payload: {
            text: '连接已建立'
          }
        });
      };
      // 监听连接关闭事件
      socket.onclose = () => {
        setStatus(false);
        console.log('连接已关闭');
        vscode.postMessage({
          type: 'window.showInformationMessage',
          payload: {
            text: '连接已关闭'
          }
        });
      };
      window.socket = socket;
    } catch (e) {
      console.log(e);
      vscode.postMessage({
        type: 'window.showInformationMessage',
        payload: {
          text: '连接错误, 请检查配置'
        }
      });
    }
  };

  /**
   *
   */
  const onClickConfigSave = () => {
    vscode.postMessage({
      type: 'fs.writeFile.config',
      payload: config
    });
  };

  const onClickMessageSave = () => {
    vscode.postMessage({
      type: 'fs.writeFile.message',
      payload: data
    });
  };

  /**
   *
   */
  const onClickDisconnect = () => {
    if (window.socket) {
      window.socket.close();
      vscode.postMessage({
        type: 'window.showInformationMessage',
        payload: {
          text: '连接断开'
        }
      });
    } else {
      vscode.postMessage({
        type: 'window.showInformationMessage',
        payload: {
          text: '未连接'
        }
      });
    }
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
            Data={data}
            setData={setData}
            setConfig={setConfig}
            onClickConfigSave={onClickConfigSave}
            onClickMessageSave={onClickMessageSave}
          />
        )}
        {tag === 'private' && (
          <PrivateApp Data={data} config={config} status={status} />
        )}
        {tag === 'group' && (
          <GroupApp Data={data} config={config} status={status} />
        )}
      </div>
    </section>
  );
}
