import { useState } from 'react';
import GroupApp from '@/gui/pages/GroupApp';
import PrivateApp from '@/gui/pages/PrivateApp';
import ConfigApp from '@/gui/pages/ConfigApp';
import classNames from 'classnames';
export default function App() {
  const [tag, setTag] = useState<
    'group' | 'private' | 'config' | 'connect' | 'close'
  >('group');
  return (
    <section className="relative h-full flex flex-col shadow-content ">
      <div className="flex flex-row gap-2 py-1 px-2">
        <div
          className={classNames(
            'px-3 py-2 cursor-pointer',
            tag === 'group' && 'bg-gray-100'
          )}
          onClick={() => setTag('group')}
        >
          群聊
        </div>
        <div
          className={classNames(
            'px-3 py-2 cursor-pointer',
            tag === 'private' && 'bg-gray-100'
          )}
          onClick={() => setTag('private')}
        >
          私聊
        </div>
        <div
          className={classNames(
            'px-3 py-2 cursor-pointer',
            tag === 'config' && 'bg-gray-100'
          )}
          onClick={() => setTag('config')}
        >
          配置
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
