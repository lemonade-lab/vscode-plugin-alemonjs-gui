import { useEffect, useRef } from 'react';
import MessageBot from './MessageBot';
import { Data, DataImage, DataText } from '../typing';
export default function MessageWondow({
  message,
  config,
  Data
}: {
  message: {
    bot: boolean;
    value: DataText | DataImage;
    createAt: string;
  }[];
  config: {
    host: string;
    port: string;
  };
  Data: Data;
}) {
  const MessageWindowRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (MessageWindowRef.current) {
      MessageWindowRef.current.scrollTo(
        0,
        MessageWindowRef.current.scrollHeight
      );
    }
  }, [message]);
  return (
    <section
      ref={MessageWindowRef}
      className="flex-1 w-full h-full flex flex-col overflow-auto"
    >
      <section className="flex-1 px-3 py-2 flex gap-1 flex-col ">
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
            <MessageBot item={item} config={config} />
          </div>
        ))}
      </section>
    </section>
  );
}
