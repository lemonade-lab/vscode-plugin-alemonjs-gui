import { createRoot } from 'react-dom/client';
import 'animate.css';
import '@/gui/input.scss';
import App from '@/gui/pages/App';
createRoot(document.getElementById('root')!).render(<App />);

interface VsCodeApi {
  postMessage<T = any>(message: T): void; // 发送消息到插件
  setState<T = any>(newState: T): T; // 存储状态
  getState<T = any>(): T | undefined; // 获取存储的状态
}

declare global {
  var socket: WebSocket;
  var vscode: VsCodeApi;
}
