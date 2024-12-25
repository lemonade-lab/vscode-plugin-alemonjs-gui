import { useState } from 'react';
import GroupApp from '@/gui/pages/GroupApp';
import PrivateApp from '@/gui/pages/PrivateApp';
import ConfigApp from '@/gui/pages/ConfigApp';
import classNames from 'classnames';
import { config } from '../config';

const postMessage = (message: any) => {
  if (!acquireVsCodeApi) return;
  const vscode = acquireVsCodeApi();
  vscode.postMessage(message);
};

export default function App() {
  const [tag, setTag] = useState<'group' | 'private' | 'config'>('group');

  /**
   *
   */
  const onClickConnect = () => {
    // 关闭之前的连接
    if (window.socket) {
      window.socket.close();
    }
    const socket = new WebSocket(`ws://${config.host}:${config.port}`);
    // 监听连接打开事件
    socket.onopen = () => {
      console.log('WebSocket 连接已建立');
      postMessage({
        type: 'window.showInformationMessage',
        payload: {
          text: 'WebSocket 连接已建立'
        }
      });
    };
    // 监听连接关闭事件
    socket.onclose = () => {
      console.log('WebSocket 连接已关闭');
      postMessage({
        type: 'window.showInformationMessage',
        payload: {
          text: 'WebSocket 连接已关闭'
        }
      });
    };
    window.socket = socket;
  };

  /**
   *
   */
  const onClickDisconnect = () => {
    if (window.socket) {
      window.socket.close();
    }
    postMessage({
      type: 'window.showInformationMessage',
      payload: {
        text: 'WebSocket 连接断开'
      }
    });
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
