import React from 'react';

interface Option {
  value: string;
  label: string;
}

const Select = (
  props: React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > & {
    options: Option[];
  }
) => {
  const { options, ...prop } = props;
  return (
    <select
      className="py-2 px-3 pe-9 block w-full  dark:border-white dark:text-white border-gray-200 rounded-md  ounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900   dark:placeholder-slate-500 dark:focus:ring-slate-600"
      {...prop}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
