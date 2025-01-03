import { useEffect, useRef } from 'react';
import MessageBot from './MessageBot';
import { Config, Message } from '../typing';
export default function MessageWondow({
  message,
  Data,
  onClickDel
}: {
  message: Message[];
  Data: Config;
  onClickDel: (item: Message) => void;
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
      <section className="flex-1 px-3 py-2 flex gap-4 flex-col ">
        {message.map((item, index) => (
          <div
            key={index}
            className={`flex gap-2 ${
              !item.IsBot ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            <img
              className="w-12 h-12 rounded-full"
              src={item.IsBot ? Data.BotAvatar : Data.UserAvatar}
              alt="Avatar"
            />
            <MessageBot item={item} />
            <div
              onClick={() => onClickDel(item)}
              className="select-none cursor-pointer flex justify-end items-end"
            >
              del
            </div>
          </div>
        ))}
      </section>
    </section>
  );
}
