import { Search } from '@/gui/ui/Icons';

export const Input = (
  props: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
) => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative ">
        <input
          {...props}
          type="text"
          className="py-2 px-3 ps-9 block w-full  focus:outline-none  border dark:border-gray-200 dark:bg-slate-900  dark:bg-slate-9 border-gray-200 shadow-sm rounded-lg text-sm  focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
        />
        <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
          <Search />
        </div>
      </div>
    </div>
  );
};

export const InputMini = (
  props: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
) => {
  return (
    <input
      className="py-2 px-3 block  w-20 focus:outline-none border dark:text-white border-gray-200  dark:border-gray-200 dark:bg-slate-900  shadow-sm rounded-lg text-sm  focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
      {...props}
    />
  );
};
