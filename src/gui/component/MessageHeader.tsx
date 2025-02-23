import { PropsWithChildren } from 'react';
export default function MessageHeader({
  value,
  children
}: {
  value: {
    avatar: string;
    decs: string;
    name: string;
  };
} & PropsWithChildren) {
  return (
    <section className="select-none flex flex-row justify-between items-center w-full shadow-md">
      <div className="flex flex-row gap-3 px-2 py-1 cursor-pointer">
        <div className="flex items-center">
          {value.avatar && value.avatar != '' && (
            <img
              className="w-10 h-10 rounded-full"
              src={value.avatar}
              alt="Avatar"
            />
          )}
        </div>
        <div className="flex flex-col justify-center">
          <div className="font-semibold ">{value.name}</div>
          <div className="text-sm text-[var(--vscode-textPreformat-background)]">
            {value.decs}
          </div>
        </div>
      </div>
      <div>{children}</div>
    </section>
  );
}
