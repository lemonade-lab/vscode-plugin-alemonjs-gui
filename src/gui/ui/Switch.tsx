import React, { useEffect, useState } from 'react';
import { Off, On } from '@/gui/ui/Icons';
import classNames from 'classnames';

interface ToggleSwitchProps {
  value: boolean;
  onChange?: (checked: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ value, onChange }) => {
  const [checked, setChecked] = useState(value);
  const handleToggle = () => {
    const newChecked = !checked;
    setChecked(newChecked);
    if (onChange) {
      onChange(newChecked);
    }
  };
  useEffect(() => {
    setChecked(value);
  }, [value]);
  return (
    <div className="relative inline-block">
      <input
        type="checkbox"
        className={classNames(
          'peer relative shrink-0 w-11 h-6 p-px bg-gray-100 border border-gray-200 text-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200  ',
          'focus:ring-blue-600 disabled:opacity-50 disabled:pointer-events-none checked:bg-none checked:text-blue-100 checked:border-blue-200',
          'focus:checked:border-blue-200 dark:bg-slate-800 dark:border-slate-700 dark:checked:bg-blue-800/30 dark:checked:border-blue-800 dark:focus:ring-offset-gray-600',
          'before:inline-block before:size-5 before:bg-white checked:before:bg-blue-600 before:translate-x-0 checked:before:translate-x-full before:rounded-full before:transform before:ring-0 before:transition before:ease-in-out before:duration-200 dark:before:bg-slate-400 dark:checked:before:bg-blue-500'
        )}
        checked={value}
        onChange={handleToggle}
      />
      <span className="peer-checked:text-blue-600 text-slate-800 size-5 absolute top-[3px] start-0.5 flex justify-center items-center pointer-events-none transition-colors ease-in-out duration-200 dark:text-slate-500">
        <Off />
      </span>
      <span className="peer-checked:text-white size-5 absolute top-[3px] end-0.5 flex justify-center items-center pointer-events-none transition-colors ease-in-out duration-200 dark:text-slate-500">
        <On />
      </span>
    </div>
  );
};

export default ToggleSwitch;
