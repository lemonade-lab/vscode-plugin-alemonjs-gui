import { DataImage, DataText } from '../typing';
export default function MessageBot({
  item,
  config
}: {
  item: {
    bot: boolean;
    value: DataText | DataImage;
    createAt: string;
  };
  config: { host: string; port: string };
}) {
  const parseContent = (input: string): React.ReactNode => {
    const parts = input.split(/(@[^\s#]+|#[^\s@]+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        return <strong key={index}>{part}</strong>;
      } else if (part.startsWith('#')) {
        return <strong key={index}>{part}</strong>;
      } else {
        return part;
      }
    });
  };
  return (
    <div className="rounded-md relative p-3 shadow-md bg-[var(--vscode-panel-background)]">
      {item.value.t === 'Text' &&
        item.value.d
          .split('\n')
          .map((line: string, index: number) => (
            <div key={index}>{parseContent(line)}</div>
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
      <span className="absolute bottom-0 whitespace-nowrap right-0 text-[0.5rem]">
        {item.createAt}
      </span>
    </div>
  );
}
