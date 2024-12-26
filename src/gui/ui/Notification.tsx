import { Xmark } from '@/gui/ui/Icons';
import classNames from 'classnames';
export default function Notification({
  message,
  type,
  onClose
}: {
  message: string;
  type?: 'success' | 'error' | 'warning';
  onClose: () => void;
}) {
  return (
    <div
      className={classNames(
        'flex justify-between items-center p-2  md:p-4 rounded-md shadow-md',
        {
          'bg-green-100 text-green-800': type === 'success',
          'bg-red-100 text-red-800': type === 'error',
          'bg-red-100 text-yellow-800': type === 'warning'
        }
      )}
    >
      <span>{message}</span>
      <button
        className="ml-4 text-sm text-gray-500 hover:text-gray-700"
        onClick={onClose}
      >
        <Xmark />
      </button>
    </div>
  );
}
