import { useState } from 'react';
import GroupApp from '@/gui/pages/GroupApp';
import PrivateApp from '@/gui/pages/PrivateApp';
import ConfigApp from '@/gui/pages/ConfigApp';
import classNames from 'classnames';
export default function App() {
  const [tag, setTag] = useState<'group' | 'private' | 'config'>('group');
  const onClickConnect = () => {
    console.log('connect');
  };
  const onClickDisconnect = () => {
    console.log('disconnect');
  };
  return (
    <section className="relative h-full flex flex-col shadow-content ">
      <div className="flex flex-row justify-between gap-2 py-1 px-2 border-b border-opacity-70">
        <div className="flex-1 flex flex-row">
          <div
            className={classNames(
              'px-2 flex items-center cursor-pointer rounded-md py-1',
              tag === 'group' && 'bg-gray-100 bg-opacity-70'
            )}
            onClick={() => setTag('group')}
          >
            群聊
          </div>
          <div
            className={classNames(
              'px-2 flex items-center cursor-pointer rounded-md py-1',
              tag === 'private' && 'bg-gray-100 bg-opacity-70'
            )}
            onClick={() => setTag('private')}
          >
            私聊
          </div>
          <div
            className={classNames(
              'px-2 flex items-center cursor-pointer rounded-md py-1',
              tag === 'config' && 'bg-gray-100 bg-opacity-70'
            )}
            onClick={() => setTag('config')}
          >
            配置
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <button
            onClick={onClickConnect}
            className="px-2 flex items-center cursor-pointer rounded-md py-1 hover:bg-gray-100 bg-opacity-70"
          >
            连接
          </button>
          <button
            onClick={onClickDisconnect}
            className="px-2 flex items-center cursor-pointer rounded-md py-1 hover:bg-gray-100 bg-opacity-70"
          >
            断开
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {tag === 'group' && <GroupApp />}
        {tag === 'private' && <PrivateApp />}
        {tag === 'config' && <ConfigApp />}
      </div>
    </section>
  );
}
