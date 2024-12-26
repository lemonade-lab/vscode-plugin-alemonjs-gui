import { useEffect, useState } from 'react';
import { Shuffle } from '@/gui/ui/Icons';
import dayjs from 'dayjs';
import { DataImage, DataText, Data } from '../typing';
import MessageWondow from '../component/MessageWindow';
import BotTextarea from '../component/BotTextarea';
import { parseMessageContent } from '../core';

export default function App({
  status,
  config,
  Data
}: {
  status: boolean;
  config: { host: string; port: string };
  Data: Data;
}) {
  const [value, setValue] = useState('');

  const [message, setMessage] = useState<
    {
      bot: boolean;
      value: DataText | DataImage;
      createAt: string;
    }[]
  >([]);

  useEffect(() => {
    if (!window.socket) return;

    // 监听消息事件
    window.socket.onmessage = db => {
      const event = JSON.parse(db.data);
      if (event.t == 'send_message') {
        // 获取文本消息
        const Text = event.d.find((item: any) => item.t == 'Text');
        if (Text) {
          // 使用函数式更新
          setMessage(prevMessages =>
            prevMessages.concat([
              {
                bot: true,
                value: Text,
                createAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
              }
            ])
          );
        }
        // 获取图片消息
        const image = event.d.find((item: any) => item.t == 'Image');
        if (image) {
          setMessage(prevMessages =>
            prevMessages.concat([
              {
                bot: true,
                value: image,
                createAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
              }
            ])
          );
        }
      }
    };

    //
  });

  /**
   *
   * @param msg
   */
  const sendMessage = (msg: string) => {
    if (!status) return;

    if (window.socket && msg != '') {
      // 消息
      setMessage(prevMessages =>
        prevMessages.concat([
          {
            bot: false,
            value: {
              t: 'Text',
              d: msg
            },
            createAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
          }
        ])
      );

      // 清空
      setValue('');

      //
      window.socket.send(
        JSON.stringify({
          t: 'send_message',
          d: {
            GuildId: Data.GuildId,
            ChannelId: Data.ChannelId,
            UserName: Data.UserName,
            UserId: Data.UserId,
            OpenId: Data.OpenId,
            MessageId: Date.now(),
            MessageText: parseMessageContent(msg)
          }
        })
      );
    }
  };

  return (
    <section className="flex-1 flex flex-col  overflow-auto ">
      <section className="select-none flex flex-row justify-between w-full  border-b border-[var(--vscode-sidebar-border)] border-opacity-70">
        <div className="flex flex-row gap-3 px-2 py-1 cursor-pointer">
          <div className="flex items-center">
            <img
              className="w-10 h-10 rounded-full"
              src={Data.ChannelAvatar}
              alt="Avatar"
            />
          </div>
          <div className="flex flex-col justify-center">
            <div className="font-semibold text-[var(--vscode-textPreformat-foreground)]">
              {Data.ChannelName}
            </div>
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
          <Shuffle className="text-[var(--vscode-textPreformat-background)]" />
        </div>
      </section>

      <MessageWondow message={message} config={config} Data={Data} />

      <BotTextarea
        value={value}
        onContentChange={val => setValue(val)}
        onClickSend={() => sendMessage(value)}
        mention={true}
      />
    </section>
  );
}
