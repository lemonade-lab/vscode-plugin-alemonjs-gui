import classNames from 'classnames';
import { useState } from 'react';

const Up = () => {
  return (
    <svg
      className="  size-4"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6"></path>
    </svg>
  );
};

const Down = () => {
  return (
    <svg
      className="size-4"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m18 15-6-6-6 6"></path>
    </svg>
  );
};

const Accordion = (
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & {
    haeder?: React.ReactNode;
    bar?: React.ReactNode;
    icon?: {
      open?: React.ReactNode;
      close?: React.ReactNode;
    };
  }
) => {
  const { children, haeder, bar, icon, ...prop } = props ?? {};
  const [show, setShow] = useState(false);
  return (
    <div {...prop}>
      <div className="flex gap-2 items-center w-full ">
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="inline-flex items-center gap-x-3 w-full font-semibold text-start text-gray-800 hover:text-gray-500 focus:outline-none focus:text-gray-500 rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:hs-accordion-active:text-blue-500 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400"
        >
          {show ? (
            icon?.open ? (
              icon?.open
            ) : (
              <Up />
            )
          ) : icon?.close ? (
            icon?.close
          ) : (
            <Down />
          )}
          {haeder ?? ''}
        </button>
        {bar ?? ''}
      </div>
      <div
        className={classNames('w-full ', {
          'hidden overflow-hidden': !show
        })}
      >
        {children}
      </div>
    </div>
  );
};

export default Accordion;
