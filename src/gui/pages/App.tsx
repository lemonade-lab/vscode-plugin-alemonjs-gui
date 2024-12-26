import { useEffect, useRef, useState } from 'react';
import GroupApp from '@/gui/pages/GroupApp';
import PrivateApp from '@/gui/pages/PrivateApp';
import ConfigApp from '@/gui/pages/ConfigApp';
import classNames from 'classnames';
import { Data, User } from '../typing';

export default function App() {
  const [status, setStatus] = useState<boolean>(false);
  const [tag, setTag] = useState<'group' | 'private' | 'config'>('config');
  const [config, setConfig] = useState({
    host: '',
    port: ''
  });
  // 保存定时任务。确保只有一个定时任务
  const timeRef = useRef<any>(null);
  const configRef = useRef<any>(null);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  const [user, setUser] = useState<User[]>([]);

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
    if (!window.vscode) return;

    connect && connect();

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
      if (message.type === 'fs.readFile.users') {
        setUser(message.payload);
      }
    };

    // 请求得到配置
    vscode.postMessage({
      type: 'fs.readFile.config'
    });
    vscode.postMessage({
      type: 'fs.readFile.message'
    });
    vscode.postMessage({
      type: 'fs.readFile.users'
    });

    window.addEventListener('message', handleResponse);
    return () => {
      window.removeEventListener('message', handleResponse);
    };
  }, []);

  /**
   *
   */
  const connect = () => {
    try {
      if (timeRef.current) {
        clearTimeout(timeRef.current);
      }
      if (window.socket && window.socket.readyState === 1) return;
      // 创建socket
      const socket = new WebSocket(
        `ws://${configRef.current.host}:${configRef.current.port}`
      );
      // 监听连接打开事件
      socket.onopen = () => {
        console.log('连接已建立');
        setStatus(true);
      };
      // 监听连接关闭事件
      socket.onclose = () => {
        setStatus(false);
        console.log('连接已关闭');
        // 连接关闭的时候，1s后重连
        timeRef.current = setTimeout(() => {
          connect && connect();
        }, 1700);
      };
      window.socket = socket;
    } catch (e) {
      setStatus(false);
      console.log(e);
      // 连接错误的时候，3s后重连
      timeRef.current = setTimeout(() => {
        connect && connect();
      }, 3700);
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

  return (
    <section className="overflow-hidden flex flex-1 flex-col bg-[var(--vscode-sideBar-foreground)] ">
      <div className="select-none flex flex-row  justify-between gap-2 py-1 px-2 border-b border-opacity-70 border-[var(--vscode-sidebar-border)]">
        <div className="flex flex-1 flex-row gap-2"></div>
        <div className="flex flex-row gap-2">
          <div
            className={classNames(
              'px-2 flex items-center cursor-pointer rounded-md ',
              tag === 'group' &&
                'bg-[var(--vscode-activityBar-background)] text-[var(--vscode-activityBar-activeBackground)]'
            )}
            onClick={() => setTag('group')}
          >
            群聊
          </div>
          <div
            className={classNames(
              'px-2 flex items-center cursor-pointer rounded-md ',
              tag === 'private' &&
                'bg-[var(--vscode-activityBar-background)] text-[var(--vscode-activityBar-activeBackground)]'
            )}
            onClick={() => setTag('private')}
          >
            私聊
          </div>
          <div
            className={classNames(
              'px-2 flex items-center cursor-pointer rounded-md ',
              tag === 'config' &&
                'bg-[var(--vscode-activityBar-background)] text-[var(--vscode-activityBar-activeBackground)]'
            )}
            onClick={() => setTag('config')}
          >
            配置
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden ">
        {tag === 'config' && (
          <ConfigApp
            config={config}
            Data={data}
            setData={setData}
            setConfig={setConfig}
            onClickConfigSave={onClickConfigSave}
            onClickMessageSave={onClickMessageSave}
            user={user}
          />
        )}
        {tag === 'private' && (
          <PrivateApp Data={data} config={config} status={status} />
        )}
        {tag === 'group' && (
          <GroupApp user={user} Data={data} config={config} status={status} />
        )}
      </div>
    </section>
  );
}
