import { SendIcon } from '../ui/Icons';
export default function Textarea(
  props: React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > & { onClickSend: React.MouseEventHandler<HTMLDivElement> }
) {
  const { onClickSend } = props;
  return (
    <section className="select-none w-full flex flex-row justify-center p-4">
      <div className="flex gap-2 flex-col border border-[var(--vscode-sidebar-border)] focus-within:border-[var(--vscode-button-background)] bg-[var(--vscode-editor-background)] border-opacity-70 shadow-inner rounded-md w-full p-2">
        <textarea
          className="min-h-20 max-h-64 border-0 focus:border-0 bg-opacity-0 pointer-events-none bg-[var(--vscode-editor-background)] rounded-md "
          placeholder="输入内容..."
          {...props}
        />
        <div className="flex flex-row justify-between ">
          <div className="text-[var(--vscode-textPreformat-background)]">
            Control+Enter 换行
          </div>
          <div
            className="border border-[var(--vscode-sidebar-border)] border-opacity-70  px-3 cursor-pointer rounded-md flex items-center justify-center hover:bg-[var(--vscode-button-background)]"
            onClick={onClickSend}
          >
            <SendIcon />
          </div>
        </div>
      </div>
    </section>
  );
}
