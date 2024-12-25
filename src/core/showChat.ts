import * as vscode from 'vscode';
import { getWebviewContent } from './webview';
export const showChat = (context: vscode.ExtensionContext) => {
  let panel: vscode.WebviewPanel | undefined = undefined;
  const chatDisposable = vscode.commands.registerCommand(
    'alemonjs.showChat',
    () => {
      if (panel) {
        panel.reveal(vscode.ViewColumn.Two);
        return;
      }
      panel = vscode.window.createWebviewPanel(
        'chat', // 标识符
        '聊天对话框', // 标题
        vscode.ViewColumn.Two, // 显示在编辑器的第二列
        {
          enableScripts: true,
          retainContextWhenHidden: true
        }
      );
      // 设置 Webview 的 HTML 内容
      panel.webview.html = getWebviewContent(panel.webview, context);
      // 监听 Webview 消息
      panel.webview.onDidReceiveMessage(
        message => {
          switch (message.command) {
            case 'close':
              panel && panel.dispose();
              break;
          }
        },
        undefined,
        context.subscriptions
      );
      panel.onDidDispose(
        () => {
          panel = undefined;
        },
        null,
        context.subscriptions
      );
    }
  );
  context.subscriptions.push(chatDisposable);

  const chatButton = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  chatButton.text = '$(comment-discussion) GUI';
  chatButton.command = 'alemonjs.showChat';
  chatButton.show();
  context.subscriptions.push(chatButton);
  return;
};
