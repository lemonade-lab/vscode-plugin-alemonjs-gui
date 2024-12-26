import classNames from 'classnames';
import { Close } from './Icons';

export const From = (
  props: React.DetailedHTMLProps<
    React.FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  > & {
    label: string;
    inputs: React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >[];
    buttons: React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >[];
    onClose?: () => void;
  }
) => {
  const { onSubmit, label, inputs, buttons, onClose, ...prop } = props ?? {};
  return (
    <form
      className="flex flex-col gap-1 md:gap-2 border p-2  md:p-4 rounded-md hover:shadow-md dark:bg-slate-800  "
      onSubmit={e => {
        e.preventDefault();
        if (typeof onSubmit == 'function') {
          onSubmit(e);
        }
      }}
      {...prop}
    >
      <div className="flex justify-between">
        <div className="text-2xl dark:text-white">{label}</div>
        {onClose && (
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              onClose();
            }}
            className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-red-700 dark:hover:bg-red-600 dark:text-white dark:focus:bg-neutral-600"
          >
            <Close />
          </button>
        )}
      </div>
      {inputs.map((props, index) => (
        <input
          key={index}
          {...props}
          className="mb-2   p-1    md:p-2  border rounded focus:outline-none focus:border-blue-500 dark:bg-slate-900 dark:text-white"
          required
        />
      ))}
      <div
        className={classNames('w-full', {
          'flex  justify-center gap-2': buttons.length > 1
        })}
      >
        {buttons.map((props, index) => (
          <button
            key={index}
            type="button"
            className="bg-blue-500 text-white w-full  p-1  md:p-2  rounded"
            {...props}
          ></button>
        ))}
      </div>
    </form>
  );
};
