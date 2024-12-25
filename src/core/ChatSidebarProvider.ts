import * as vscode from 'vscode';

export class ChatSidebarProvider implements vscode.WebviewViewProvider {
  /**
   *
   * @param context
   */
  constructor(private readonly context: vscode.ExtensionContext) {}

  /**
   *
   * @param webviewView
   */
  resolveWebviewView(webviewView: vscode.WebviewView) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this.context.extensionUri),
        vscode.Uri.joinPath(this.context.extensionUri, 'dist-gui'),
        vscode.Uri.joinPath(this.context.extensionUri, 'dist-gui', 'assets')
      ]
    };

    webviewView.webview.onDidReceiveMessage(
      message => {
        switch (message.type) {
          case 'window.showInformationMessage': {
            vscode.window.showInformationMessage(message.payload.text);
            break;
          }
          case 'fs.readFile.config': {
            const dir = this.context.asAbsolutePath('dist/config.json');
            if (!require('fs').existsSync(dir)) {
              const config = {
                host: 'localhost',
                port: '9601'
              };
              // 发送消息
              webviewView.webview.postMessage({
                // 按主动消息格式返回
                type: 'fs.readFile.config',
                payload: config
              });
              // 写入文件
              require('fs').writeFileSync(dir, JSON.stringify(config));
              return;
            }
            const data = require('fs').readFileSync(dir, 'utf-8');
            webviewView.webview.postMessage({
              type: 'fs.readFile.config',
              payload: JSON.parse(data)
            });
            break;
          }
          case 'fs.writeFile.config': {
            const dir = this.context.asAbsolutePath('dist/config.json');
            require('fs').writeFileSync(dir, JSON.stringify(message.payload));
            break;
          }
        }
      },
      undefined,
      this.context.subscriptions
    );

    webviewView.webview.html = this.getHtmlForWebview(webviewView.webview);
  }

  /**
   *
   * @param webview
   * @returns
   */
  private getHtmlForWebview(webview: vscode.Webview): string {
    const getHTMLURL = (...arg: string[]) => {
      return webview.asWebviewUri(
        vscode.Uri.joinPath(this.context.extensionUri, ...arg)
      );
    };
    const html = require('fs').readFileSync(
      this.context.asAbsolutePath('dist-gui/index.html'),
      'utf-8'
    );
    const scriptReg = /<script.*?src="(.+?)".*?>/g;
    const styleReg = /<link.*?href="(.+?)".*?>/g;
    const styleUri = getHTMLURL('dist-gui', 'assets', 'index.css');
    const scriptUri = getHTMLURL('dist-gui', 'assets', 'index.js');
    // 替换 script
    const newHtml = html.replace(
      scriptReg,
      `<script type="module" crossorigin src="${scriptUri}"></script>`
    );
    // 替换 style
    const finalHtml = newHtml.replace(
      styleReg,
      `<link rel="stylesheet" crossorigin href="${styleUri}">`
    );

    return finalHtml;
  }
}
