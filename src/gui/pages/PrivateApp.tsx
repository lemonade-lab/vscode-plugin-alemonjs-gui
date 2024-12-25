import { Fragment, useEffect, useRef, useState } from 'react';
import { SendIcon, Shuffle } from '@/gui/Icons';
import dayjs from 'dayjs';
import { DataImage, DataText, Data } from '../typing';

export default function App({
  status,
  config,
  Data
}: {
  status: boolean;
  config: {
    host: string;
    port: string;
  };
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
    if (!window.socket) {
      return;
    }
    // 监听消息事件
    window.socket.onmessage = db => {
      const event = JSON.parse(db.data);
      if (event.t == 'send_private_message') {
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
  });

  /**
   *
   * @param msg
   */
  const sendMessage = (msg: string) => {
    if (!status) return;
    if (window.socket && msg != '') {
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
      window.socket.send(
        JSON.stringify({
          t: 'send_private_message',
          d: {
            UserName: Data.UserName,
            UserId: Data.UserId,
            OpenID: Data.OpenId,
            MessageId: Date.now(),
            MessageText: msg
          }
        })
      );
    }
  };

  //

  const MessageWindowRef = useRef<HTMLElement>(null);
  // 变动时自动清理
  useEffect(() => {
    // 清空
    setValue('');
    if (MessageWindowRef.current) {
      // 滚动到底部
      MessageWindowRef.current.scrollTo(
        0,
        MessageWindowRef.current.scrollHeight
      );
    }
  }, [message]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.metaKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault(); // 防止表单提交
      setValue(value + '\n'); // 在当前文本后添加换行符
    } else if (event.key === 'Enter') {
      sendMessage(value);
    }
  };

  return (
    <section className="relative h-full flex flex-col shadow-content">
      <section className="select-none flex flex-row justify-between w-full overflow-hidden border-b border-[var(--vscode-sidebar-border)] border-opacity-70">
        <div className="flex flex-row gap-3 px-2 py-1 cursor-pointer">
          <div className="flex items-center">
            <img
              className="w-10 h-10 rounded-full"
              src={Data.ChannelAvatar}
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

        {/* 切换下一个用户 */}
        <div className="flex-row cursor-pointer flex items-center px-4 hover:bg-[var(--vscode-activityBar-background)]">
          <Shuffle />
        </div>
      </section>

      <div className="flex-1 flex flex-col">
        <section
          ref={MessageWindowRef}
          className="flex-1 px-3 py-2 overflow-y-auto flex gap-1 flex-col "
        >
          {message.map((item, index) => (
            <div
              key={index}
              className={`flex gap-4  ${
                !item.bot ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              <img
                className="w-12 h-12 rounded-full"
                src={item.bot ? Data.BotAvatar : Data.UserAvatar}
                alt="Avatar"
              />
              <div className="rounded-md relative p-2 shadow-md bg-[var(--vscode-panel-background)]">
                {item.value.t === 'Text' &&
                  item.value.d
                    .split('\n')
                    .map((line: string, index: number) => (
                      <Fragment key={index}>{line}</Fragment>
                    ))}
                {item.value.t === 'Image' && (
                  <img
                    className="max-w-[15rem] xl:max-w-[20rem] rounded-md"
                    src={
                      /^\/file/.test(item.value.d?.url_index ?? '')
                        ? `http://${config.host}:${config.port}${item.value.d.url_index}`
                        : item.value.d?.url_data
                    }
                    alt="Image"
                  />
                )}
                <span className="absolute bottom-0 right-0  whitespace-nowrap text-[0.5rem] text-[var(--vscode-text-selection-foreground)]">
                  {item.createAt}
                </span>
              </div>
            </div>
          ))}
        </section>

        {/* 输入框和发送按钮 */}
        <section className="select-none w-full flex flex-row justify-center p-4">
          <div className="flex gap-2 flex-col border border-[var(--vscode-sidebar-border)] bg-[var(--vscode-editor-background)] border-opacity-70 shadow-inner rounded-md w-full p-2">
            <textarea
              className="min-h-20 max-h-64  border-0 focus:border-0 bg-opacity-0 bg-[var(--vscode-editor-background)] p-2 rounded-md text-[var(--vscode-activityBar-activeBackground)]"
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder="输入内容..."
              onKeyDown={handleKeyDown}
            />
            <div className="flex flex-row justify-end">
              <div
                className="border border-[var(--vscode-sidebar-border)] border-opacity-70  px-3 cursor-pointer rounded-md flex items-center justify-center hover:bg-[var(--vscode-button-background)]"
                onClick={() => sendMessage(value)}
              >
                <SendIcon />
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
