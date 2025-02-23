import { useEffect, useRef, useState } from 'react';
import { User } from '../typing';
import { SendIcon } from '../ui/Icons';

interface TextareaProps extends React.HTMLAttributes<HTMLTextAreaElement> {
  value: string;
  onContentChange?: (content: string) => void;
  onClickSend: () => void;
  userList?: User[];
}

export default function Textarea({
  value,
  onContentChange,
  onClickSend,
  userList,
  ...props
}: TextareaProps) {
  const [showUserList, setShowUserList] = useState<boolean>(false);

  const [textareaValue, setTextareaValue] = useState<string>('');
  // 监听输入到每一个字符。当输入到@的时候，显示用户列表，并聚焦到第一个用户。

  useEffect(() => {
    if (textareaValue.endsWith('@')) {
      setShowUserList(true);
    } else {
      setShowUserList(false);
    }
    onContentChange?.(textareaValue);
  }, [textareaValue]);

  useEffect(() => {
    textareaValue !== value && setTextareaValue(value);
  }, [value]);

  /**
   * 选择用户
   * @param userName
   */
  const handleUserSelection = (userName: string) => {
    // 选择用户后，将用户名插入到光标处。
    const value = textareaValue.replace(/@$/, `<@${userName}> `);
    setTextareaValue(value);
    showUserList && setShowUserList(false);
  };

  const selectRef = useRef<HTMLDivElement | null>(null);

  // 聚焦第一个子元素
  useEffect(() => {
    if (showUserList && userList && userList.length > 1) {
      const firstChild = selectRef.current?.firstElementChild as HTMLElement;
      firstChild?.focus();
    }
  }, [showUserList]);

  // 输入框内容改变
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log(e.target.value);
    setTextareaValue(e.target.value);
  };

  /**
   * 回车
   * @param e
   */
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      setTextareaValue(textareaValue + '\n');
    } else if (e.key === 'Enter') {
      e.preventDefault();
      console.log('Enter');
      onClickSend();
    }
  };

  return (
    <section className="select-none w-full flex flex-row justify-center px-4 py-1">
      <div className="flex gap-2 flex-col border border-[var(--vscode-sidebar-border)] focus-within:border-[var(--vscode-button-background)] bg-[var(--vscode-editor-background)] border-opacity-70 shadow-inner rounded-md w-full p-2">
        {showUserList && userList && userList.length > 1 && (
          <div className="absolute rounded-md w-full max-w-36 max-h-32 overflow-y-auto  shadow-md border border-[var(--vscode-sidebar-border)] bg-[var(--vscode-editor-background)]">
            <div ref={selectRef} className="flex flex-col px-2 py-1">
              {userList.map(user => (
                <div
                  key={user.UserId}
                  onClick={() => handleUserSelection(user.UserName)}
                  className="rounded-md cursor-pointer p-1 hover:bg-[var(--vscode-activityBar-background)]"
                >
                  {user.UserName}
                </div>
              ))}
            </div>
          </div>
        )}
        <textarea
          className="min-h-20 resize-none max-h-64 border-0 focus:border-0 bg-opacity-0 bg-[var(--vscode-editor-background)] rounded-md "
          placeholder="输入内容..."
          value={textareaValue}
          onChange={onChange}
          onKeyDown={onKeyDown}
          {...props}
        />

        <div className="flex flex-row justify-between ">
          <div className="text-[var(--vscode-textPreformat-background)]">
            Control+Enter 换行
          </div>
          <div
            className="border border-[var(--vscode-sidebar-border)] border-opacity-70  px-3 cursor-pointer rounded-md flex items-center justify-center hover:bg-[var(--vscode-button-background)]"
            onClick={e => {
              e.stopPropagation();
              e.preventDefault();
              onClickSend();
            }}
          >
            <SendIcon />
          </div>
        </div>
      </div>
    </section>
  );
}
