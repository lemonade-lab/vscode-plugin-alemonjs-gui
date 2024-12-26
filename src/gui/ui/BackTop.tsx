import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { ArrowUp } from './Icons';
/**
 * @returns JSX.Element
 */
export default function BackTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const backToTop = () => {
      if (
        document.body.scrollTop > 50 ||
        document.documentElement.scrollTop > 50
      ) {
        setShow(true);
      } else {
        setShow(false);
      }
    };
    backToTop();
    window.addEventListener('scroll', backToTop);
    return () => {
      window.removeEventListener('scroll', backToTop);
    };
  }, []);
  return (
    <>
      <section
        className={classNames(
          'w-10 h-10 opacity-0 fixed bottom-5 animate__animated duration-500 right-5  flex items-center justify-center rounded-full  border-2 border-white text-white hover:bg-apollo-blue-full hover:border-1 text-lg ',
          {
            'opacity-100 animate__fadeInUpBig': show
          }
        )}
        onClick={() => {
          window.scrollTo({
            behavior: 'smooth', // 平滑滚动
            top: 0
          });
        }}
      >
        <button
          type="button"
          className="bg-slate-500 rounded-full bg-opacity-40"
        >
          <ArrowUp />
        </button>
      </section>
    </>
  );
}
