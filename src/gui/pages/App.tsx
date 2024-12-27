import { useEffect, useRef, useState } from 'react';
import GroupApp from '@/gui/pages/GroupApp';
import PrivateApp from '@/gui/pages/PrivateApp';
import { Data, User } from '../typing';
import SettingApp from './Setting';
import ConfigUser from './ConfigUser';
import ConfigGuild from './ConfigGuild';

export default function App() {
  const [status, setStatus] = useState<boolean>(false);
  const [tag, setTag] = useState<
    'group' | 'private' | 'setting' | 'config.user' | 'config.guild'
  >('group');
  const [config, setConfig] = useState({
    host: '',
    port: ''
  });
  // 保存定时任务。确保只有一个定时任务
  const timeRef = useRef<any>(null);
  const configRef = useRef<any>(null);
  const countRef = useRef<number>(0);

  useEffect(() => {
    configRef.current = config;
    countRef.current = 0;
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

    // 等待配置信息
    const handleResponse = (event: any) => {
      const message = event.data;
      if (message.type === 'fs.readFile.config') {
        setConfig(message.payload);
      } else if (message.type === 'fs.readFile.message') {
        setData(message.payload);
      } else if (message.type === 'fs.readFile.users') {
        setUser(message.payload);
      } else if (message.type == 'alemonjs.openSetting') {
        setTag('setting');
      } else if (message.type == 'alemonjs.openConfigUser') {
        setTag('config.user');
      } else if (message.type == 'alemonjs.openConfigGuild') {
        setTag('config.guild');
      } else if (message.type == 'alemonjs.openGroup') {
        setTag('group');
      } else if (message.type == 'alemonjs.openPrivate') {
        setTag('private');
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

    setTimeout(() => {
      connect && connect();
    }, 300);

    window.addEventListener('message', handleResponse);
    return () => {
      window.removeEventListener('message', handleResponse);
    };
  }, []);

  const connect = () => {
    try {
      // 清除定时任务
      if (timeRef.current) clearTimeout(timeRef.current);
      // 如果已经连接，直接返回
      if (window.socket && window.socket.readyState === 1) return;
      // 创建socket
      const socket = new WebSocket(
        `ws://${configRef.current.host}:${configRef.current.port}`
      );
      // 监听连接打开事件
      socket.onopen = () => {
        console.log('连接已建立');
        setStatus(true);
        countRef.current = 0;
      };
      // 监听连接关闭事件
      socket.onclose = () => {
        setStatus(false);
        console.log('连接已关闭');
        // 连接关闭的时候，1.7s后重连
        let time = 1700;
        if (countRef.current > 5) {
          time = 2700;
        } else if (countRef.current > 10) {
          time = 3700;
        } else if (countRef.current > 15) {
          time = 4700;
        } else if (countRef.current > 20) {
          time = 5700;
        }
        timeRef.current = setTimeout(() => {
          connect && connect();
          countRef.current = countRef.current + 1;
        }, time);
      };
      window.socket = socket;
    } catch (e) {
      setStatus(false);
      // 连接错误的时候，3.7s后重连
      let time = 3700;
      if (countRef.current > 15) {
        time = 4700;
      } else if (countRef.current > 20) {
        time = 5700;
      }
      timeRef.current = setTimeout(() => {
        connect && connect();
        countRef.current = countRef.current + 1;
      }, time);
    }
  };

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
      {tag === 'config.user' && (
        <ConfigUser
          Data={data}
          setData={setData}
          onClickMessageSave={onClickMessageSave}
          user={user}
        />
      )}
      {tag === 'config.guild' && (
        <ConfigGuild
          Data={data}
          setData={setData}
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
      {tag === 'setting' && (
        <SettingApp
          config={config}
          setConfig={setConfig}
          onClickConfigSave={onClickConfigSave}
        />
      )}
    </section>
  );
}
