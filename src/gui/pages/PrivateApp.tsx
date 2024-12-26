import { Fragment, useEffect, useRef, useState } from 'react';
import { SendIcon, Shuffle } from '@/gui/ui/Icons';
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
      // 使用函数式更新
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

      // 发送消息
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
      event.preventDefault();
      sendMessage(value);
    }
  };

  return (
    <section className="flex-1 flex flex-col  overflow-auto">
      <section className="select-none flex flex-row justify-between w-full  border-b border-[var(--vscode-sidebar-border)] border-opacity-70">
        <div className="flex flex-row gap-3 px-2 py-1 cursor-pointer">
          <div className="flex items-center">
            <img
              className="w-10 h-10 rounded-full"
              src={Data.BotAvatar}
              alt="Avatar"
            />
          </div>
          <div className="flex flex-col justify-center">
            <div className="font-semibold text-[var(--vscode-textPreformat-foreground)]">
              {Data.BotName}
            </div>
            <div className="text-sm text-[var(--vscode-textPreformat-background)]">
              机器人
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
          className="flex-row cursor-pointer flex items-center px-4 text-[var(--vscode-textPreformat-background)] hover:bg-[var(--vscode-activityBar-background)]"
        >
          <Shuffle className="text-[var(--vscode-textPreformat-background)]" />
        </div>
      </section>

      <section
        ref={MessageWindowRef}
        className="flex-1 w-full h-full flex flex-col overflow-auto"
      >
        <section className="flex-1 px-3 py-2 overflow-auto flex gap-1 flex-col ">
          {message.map((item, index) => (
            <div
              key={index}
              className={`flex gap-2 ${
                !item.bot ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              <img
                className="w-12 h-12 rounded-full"
                src={item.bot ? Data.BotAvatar : Data.UserAvatar}
                alt="Avatar"
              />
              <div className="rounded-md relative p-3 shadow-md bg-[var(--vscode-panel-background)]">
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
                <span className="absolute bottom-0 right-0  whitespace-nowrap text-[0.5rem] text-[var(--vscode-textPreformat-foreground)]">
                  {item.createAt}
                </span>
              </div>
            </div>
          ))}
        </section>
      </section>

      {/* 输入框和发送按钮 */}
      <section className="select-none w-full flex flex-row justify-center p-4">
        <div className="flex gap-2 flex-col border border-[var(--vscode-sidebar-border)] focus-within:border-[var(--vscode-button-background)] bg-[var(--vscode-editor-background)] border-opacity-70 shadow-inner rounded-md w-full p-2">
          <textarea
            className="min-h-20 max-h-64 border-0 focus:border-0 bg-opacity-0 bg-[var(--vscode-editor-background)] rounded-md "
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="输入内容..."
            onKeyDown={handleKeyDown}
          />
          <div className="flex flex-row justify-between ">
            <div className="text-[var(--vscode-textPreformat-background)]">
              Control+Enter 换行
            </div>
            <div
              className="border border-[var(--vscode-sidebar-border)] border-opacity-70  px-3 cursor-pointer rounded-md flex items-center justify-center hover:bg-[var(--vscode-button-background)]"
              onClick={() => sendMessage(value)}
            >
              <SendIcon />
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
