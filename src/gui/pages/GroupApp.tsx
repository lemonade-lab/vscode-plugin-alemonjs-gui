import { useEffect, useState } from 'react';
import { Shuffle } from '@/gui/ui/Icons';
import {
  Config,
  Data,
  DataPublic,
  Message,
  PublicMessage,
  User
} from '../typing';
import MessageWondow from '../component/MessageWindow';
import BotTextarea from '../component/BotTextarea';
import { DATA, parseMessage } from '../core';

export default function App({
  status,
  Data,
  user
}: {
  status: boolean;
  Data: Config;
  user: User[];
}) {
  const [value, setValue] = useState('');

  const [message, setMessage] = useState<PublicMessage[]>([]);

  useEffect(() => {
    if (!window.socket) return;
    if (status) {
      // 监听消息事件
      window.socket.onmessage = db => {
        const event = DATA.parse(db.data);
        console.log('t', event.t);
        if (event.t == 'send_message') {
          const d = event.d;
          setMessage(message => [...message, d]);
        } else if (event.t == 'post_channel') {
          // 获取消息
          const d = event.d;
          setMessage(d.map(item => item.d));
        }
      };

      // 获取消息
      if (message.length == 0) {
        const createAt = Date.now();
        window.socket.send(
          JSON.stringify({
            t: 'get_channel',
            d: {
              createAt
            }
          })
        );
      }
    } else {
      // 清除监听
      window.socket.onmessage = null;
    }

    return () => {
      if (!window.socket) return;
      window.socket.onmessage = null;
    };
  }, [status]);

  /**
   * @param msg
   */
  const sendMessage = (msg: string) => {
    if (!status) return;

    // 发送消息
    if (window.socket && msg != '') {
      const MessageBody = parseMessage(msg);
      const data: DataPublic = {
        t: 'send_message',
        d: {
          GuildId: Data.GuildId,
          ChannelId: Data.ChannelId,
          UserId: Data.UserId,
          UserName: Data.UserName,
          UserAvatar: Data.UserAvatar,
          IsBot: false,
          OpenId: Data.OpenId,
          MessageId: Date.now(),
          createAt: Date.now(),
          MessageBody: MessageBody
        }
      };
      // 消息
      setMessage([...message, data.d]);
      // 清空
      setValue('');
      window.socket.send(DATA.stringify(data));
    }
  };

  const onClickDel = (item: Message) => {
    if (!status) return;
    const data: Data = {
      t: 'del_channel',
      d: {
        createAt: Date.now(),
        MessageId: item.MessageId
      }
    };
    window.socket.send(DATA.stringify(data));
    const news = message.filter(i => i.MessageId != item.MessageId);
    setMessage(news);
  };

  return (
    <section className="flex-1 flex flex-col  overflow-auto ">
      <section className="select-none flex flex-row justify-between w-full shadow-md">
        <div className="flex flex-row gap-3 px-2 py-1 cursor-pointer">
          <div className="flex items-center">
            {Data.ChannelAvatar && Data.ChannelAvatar != '' && (
              <img
                className="w-10 h-10 rounded-full"
                src={Data.ChannelAvatar}
                alt="Avatar"
              />
            )}
          </div>
          <div className="flex flex-col justify-center">
            <div className="font-semibold ">{Data.ChannelName}</div>
            <div className="text-sm text-[var(--vscode-textPreformat-background)]">
              测试群
            </div>
          </div>
        </div>
        <div
          onClick={() => {
            vscode.postMessage({
              type: 'window.showInformationMessage',
              payload: {
                text: '暂未开放'
              }
            });
          }}
          className="flex-row cursor-pointer flex items-center px-4  hover:bg-[var(--vscode-activityBar-background)]"
        >
          <Shuffle />
        </div>
      </section>
      <MessageWondow message={message} onClickDel={onClickDel} Data={Data} />
      <BotTextarea
        value={value}
        onContentChange={val => setValue(val)}
        onClickSend={() => sendMessage(value)}
        UserList={[
          {
            OpenId: 'everyone',
            UserName: '全体成员',
            UserId: 'everyone',
            IsBot: false,
            UserAvatar: ''
          },
          {
            OpenId: Data.BotId,
            UserId: Data.BotId,
            IsBot: false,
            UserName: Data.BotName,
            UserAvatar: Data.BotAvatar
          },
          ...user
        ]}
      />
    </section>
  );
}
