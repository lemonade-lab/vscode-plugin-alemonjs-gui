import React, { useState, useRef, useEffect } from 'react';
import { SendIcon } from '../ui/Icons';
import { parseHtmlContent, UserList } from '../core';

interface TextareaProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  onContentChange?: (content: string) => void;
  onClickSend: () => void;
  mention?: boolean;
}

const BotTextarea: React.FC<TextareaProps> = ({
  value,
  onContentChange,
  onClickSend,
  mention,
  ...props
}) => {
  const editableDivRef = useRef<HTMLDivElement | null>(null);
  const [isComposing, setIsComposing] = useState<boolean>(false);
  const [showUserList, setShowUserList] = useState<boolean>(false);

  useEffect(() => {
    if (editableDivRef.current) {
      editableDivRef.current.innerText = value;
      handleInput();
    }
  }, [value]);

  const handleInput = () => {
    if (editableDivRef.current && !isComposing) {
      const rawText = editableDivRef.current.innerText;
      onContentChange?.(rawText);

      if (mention) {
        if (/@$/.test(rawText)) {
          setShowUserList(true);
        } else {
          setShowUserList(false);
        }
      }

      const formatted = parseHtmlContent(rawText);
      editableDivRef.current.innerHTML = formatted;
      moveCaretToEnd(editableDivRef.current);
    }
  };

  const moveCaretToEnd = (el: HTMLDivElement) => {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel?.removeAllRanges();
    sel?.addRange(range);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = event => {
    if (isComposing) {
      if (event.key === ' ') setIsComposing(false);
      if (event.key === 'Enter') setIsComposing(false);
      return;
    }

    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      if (editableDivRef.current) {
        event.preventDefault();
        editableDivRef.current.innerText += '\n';
        handleInput();
        return;
      }
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      onClickSend();
    }
  };

  const handleCompositionStart = () => setIsComposing(true);
  const handleCompositionEnd = () => setIsComposing(false);

  const handleUserSelection = (userName: string) => {
    if (editableDivRef.current) {
      const innerHTML = editableDivRef.current.innerHTML;
      editableDivRef.current.innerHTML = innerHTML.replace(
        /@$/,
        `@${userName}&nbsp;`
      );
      setShowUserList(false);
      handleInput();
    }
  };

  return (
    <section className="select-none w-full flex flex-row justify-center p-4">
      <div className="w-full flex flex-col gap-2 border border-[var(--vscode-sidebar-border)] focus-within:border-[var(--vscode-button-background)] bg-[var(--vscode-editor-background)] border-opacity-70 shadow-inner rounded-md p-2">
        <div
          contentEditable
          ref={editableDivRef}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          className="font-mono min-h-16 max-h-60 bg-[var(--vscode-editor-background)] relative border-0 rounded-lg overflow-auto"
          suppressContentEditableWarning
          {...props}
        ></div>

        {showUserList && (
          <div className="absolute bg-[var(--vscode-editor-background)] max-w-36 shadow-md border rounded-md w-full">
            <div className="flex flex-col px-2 py-1">
              {UserList.map(user => (
                <div
                  key={user.id}
                  onClick={() => handleUserSelection(user.UserName)}
                  className="rounded-md cursor-pointer  hover:bg-[var(--vscode-activityBar-background)]"
                >
                  {user.UserName}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-row justify-between">
          <div className="text-[var(--vscode-textPreformat-background)]">
            Control+Enter 换行
          </div>
          <div
            onClick={e => {
              e.stopPropagation();
              e.preventDefault();
              onClickSend();
            }}
            className="border border-[var(--vscode-sidebar-border)] border-opacity-70 px-3 cursor-pointer rounded-md flex items-center justify-center hover:bg-[var(--vscode-button-background)]"
          >
            <SendIcon />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BotTextarea;