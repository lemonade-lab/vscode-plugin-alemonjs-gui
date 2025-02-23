import { Message } from '../typing';
import dayjs from 'dayjs';
import { Buffer } from 'buffer';
/**
 *
 * @param param0
 * @returns
 */
export default function MessageBubble({
  messageBody,
  createAt
}: {
  messageBody: Message['MessageBody'];
  createAt: number;
}) {
  return (
    <div className="rounded-md relative p-3 shadow-md bg-[var(--vscode-panel-background)]">
      {
        // 消息是一个body。需要按格式解析
      }
      {messageBody.map((item, index) => {
        if (item.type == 'Image') {
          const blob = new Blob([Buffer.from(item.value)]);
          // 转为本地地址
          const url = URL.createObjectURL(blob);
          return (
            <img
              key={index}
              className="max-w-[15rem] xl:max-w-[20rem] rounded-md"
              src={url}
              alt="Image"
            />
          );
        } else if (item.type == 'Text') {
          // 换行
          const text = item.value.includes('\n')
            ? item.value.split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))
            : item.value;
          if (item.options?.style == 'bold') {
            return (
              <span>
                <strong key={index}>{text}</strong>
              </span>
            );
          } else if (item.options?.style == 'italic') {
            return <span key={index}>{text}</span>;
          } else if (item.options?.style == 'boldItalic') {
            return <span key={index}>{text}</span>;
          } else if (item.options?.style == 'block') {
            return (
              <span className="shadow-inner" key={index}>
                {text}
              </span>
            );
          } else if (item.options?.style == 'strikethrough') {
            return <code key={index}>{text}</code>;
          } else if (item.options?.style == 'none') {
            return text;
          } else {
            return text;
          }
        } else if (item.type == 'Mention') {
          // 根据提示渲染。
          if (
            item.value == 'all' ||
            item.value == 'everyone' ||
            item.value == '全体成员'
          ) {
            return (
              <span key={index}>
                <strong>@全体成员</strong>
              </span>
            );
          } else if (item.options?.belong == 'channel') {
            return (
              <span key={index}>
                <strong>#{item.value}</strong>
              </span>
            );
          } else if (item.options?.belong == 'user') {
            return (
              <span key={index}>
                <strong>@{item.value}</strong>
              </span>
            );
          } else if (item.options?.belong == 'everyone') {
            return (
              <span key={index}>
                <strong>@全体成员</strong>
              </span>
            );
          } else if (item.options?.belong == 'guild') {
            return (
              <span key={index}>
                <strong>#{item.value}</strong>
              </span>
            );
          } else {
            return <span key={index}></span>;
          }
        }
      })}
      <span className="absolute -bottom-3 whitespace-nowrap right-0 text-[0.5rem]">
        {
          // 时间戳格式化
          dayjs(createAt).format('YYYY-MM-DD HH:mm:ss')
        }
      </span>
    </div>
  );
}
