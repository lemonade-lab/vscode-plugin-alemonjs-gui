import { Fragment, useEffect, useRef, useState } from 'react';
import { SendIcon } from '@/gui/Icons';
import dayjs from 'dayjs';
export default function App() {
  const [status, setStatus] = useState<'open' | 'close'>('close');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState<
    {
      bot: boolean;
      value: {
        t: string;
        d: any;
      };
      createAt: string;
    }[]
  >([]);

  const [config, setConfig] = useState({
    wsUri: '',
    httpUri: ''
  });

  const [event, setEvent] = useState({
    Platform: '',
    GuildId: '',
    ChannelId: '',
    IsMaster: 0,
    UserId: '',
    UserName: '',
    MessageText: '',
    MsgId: '',
    OpenID: ''
  });

  const [value, setValue] = useState('');

  const USER_URI = 'https://q1.qlogo.cn/g?b=qq&s=0&nk=1715713638';

  /**
   * 刷新状态
   * @returns
   */
  const update = () => {
    // 创建 WebSocket 连接
    const socket = new WebSocket(config.wsUri);
    // 监听连接打开事件
    socket.onopen = () => {
      console.log('WebSocket 连接已建立');
      setStatus('open');
    };
    // 监听消息事件
    socket.onmessage = db => {
      const event = JSON.parse(db.data);
      console.log('event', event);
      if (event.t == 'send_message') {
        const txt = event.d.MsgBody.find((item: any) => item.t == 'text');
        if (txt) {
          // 使用函数式更新
          setMessage(prevMessages =>
            prevMessages.concat([
              {
                bot: true,
                value: {
                  t: 'text',
                  d: txt.d
                },
                createAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
              }
            ])
          );
        }
        const img = event.d.MsgBody.find((item: any) => item.t == 'image');
        if (img) {
          console.log('img.d', img.d);
          setMessage(prevMessages =>
            prevMessages.concat([
              {
                bot: true,
                value: {
                  t: 'image',
                  d: img.d.url
                },
                createAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
              }
            ])
          );
        }
      }
    };
    // 监听连接关闭事件
    socket.onclose = () => {
      setStatus('close');
      console.log('WebSocket 连接已关闭');
      alert('连接关闭');
    };
    return socket;
  };

  const onClickConnect = () => {
    const socket = update();
    // 设置 socket 状态
    setSocket(socket);
  };

  const onClickclose = () => {
    setSocket(null);
    socket && socket.close();
  };

  useEffect(() => {
    // 清理函数，关闭 WebSocket 连接
    return () => {
      socket && socket.close();
    };
  }, []);

  const MessageWindowRef = useRef<HTMLElement>(null);

  // 变动时自动清理
  useEffect(() => {
    // 清空
    setValue('');
    // save

    if (MessageWindowRef.current) {
      // 滚动到底部
      MessageWindowRef.current.scrollTo(
        0,
        MessageWindowRef.current.scrollHeight
      );
    }
  }, [message]);

  /**
   *
   * @param msg
   */
  const sendMessage = (msg: string) => {
    if (status == 'close') return;
    if (socket && msg != '') {
      setMessage(prevMessages =>
        prevMessages.concat([
          {
            bot: false,
            value: {
              t: 'text',
              d: msg
            },
            createAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
          }
        ])
      );
      socket.send(
        JSON.stringify({
          t: 'send_message',
          d: {
            ...event,
            MsgBody: [
              {
                t: 'text',
                d: msg
              }
            ]
          }
        })
      );
    }
  };

  return (
    <section className="relative h-full flex flex-col shadow-content ">
      <div className="flex flex-row justify-between w-full  overflow-hidden border-b">
        <div className="flex flex-row gap-3 px-2 py-1  cursor-pointer ">
          <div className="flex items-center">
            <img
              className="w-10 h-10 rounded-full "
              src={USER_URI}
              alt="Avatar"
            />
          </div>
          <div className="flex flex-col justify-center">
            <div className="font-semibold">柠檬冲水</div>
            <div className="text-sm text-gray-500">2024-12-25</div>
          </div>
        </div>
        {
          // 切换下一个用户
        }
        <div className="flex-row cursor-pointer flex items-center px-4 hover:bg-gray-100">
          ...
        </div>
      </div>
      <div className="flex-1 flex flex-col ">
        <section
          ref={MessageWindowRef}
          className="flex-1 px-3 py-2 overflow-y-auto flex gap-1 flex-col webkit bg-opacity-50 "
        >
          {message.map((item, index) => (
            <div key={index} className="flex gap-4 bg-opacity-70 mr-auto">
              <img
                className="w-12 h-12 rounded-full "
                src={USER_URI}
                alt="Avatar"
              />
              <div className="rounded-md relative p-2  shadow-sm ">
                {item.value.t == 'text' &&
                  item.value.d
                    .split('\n')
                    .map((line: string, index: number) => (
                      <Fragment key={index}>
                        {line}
                        {index < item.value.d.split('\n').length - 1 && <br />}
                      </Fragment>
                    ))}
                {item.value.t == 'image' && (
                  <img
                    className="max-w-[20rem] xl:max-w-[25rem] rounded-md  "
                    src={
                      /^\/file/.test(item.value.d)
                        ? `${config.httpUri}${item.value.d}`
                        : item.value.d
                    }
                    alt="Image"
                  />
                )}
                <span className="absolute bottom-0 right-0 text-[0.5rem] text-gray-500">
                  {item.createAt}
                </span>
              </div>
            </div>
          ))}
        </section>
        <section className="w-full flex flex-row justify-center p-2 ">
          <div className="flex gap-2 flex-col border shadow-inner rounded-md w-full p-2">
            <input
              type="text"
              className="min-h-10 outline-none bg-opacity-0 px-3 rounded-md"
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder="输入内容..."
              onKeyDown={event => event.key === 'Enter' && sendMessage(value)}
            />
            <div className="flex flex-row justify-end">
              <div
                className="border mx-2 px-3 cursor-pointer rounded-md flex items-center justify-center hover:bg-gray-100 "
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
