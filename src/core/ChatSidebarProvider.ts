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
   * @returns
   */
  fsFreadFileConfig(webviewView: vscode.WebviewView) {
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
  }

  /**
   *
   * @param webviewView
   * @param message
   */
  fsWriteFileConfig(message: any) {
    const dir = this.context.asAbsolutePath('dist/config.json');
    require('fs').writeFileSync(dir, JSON.stringify(message.payload));
    vscode.window.showInformationMessage('保存成功');
  }

  /**
   *
   * @param webviewView
   * @returns
   */
  fsFreadFileMessage(webviewView: vscode.WebviewView) {
    const dir = this.context.asAbsolutePath('dist/message.json');
    if (!require('fs').existsSync(dir)) {
      const config = {
        BotId: '794161769',
        BotName: '阿柠檬',
        BotAvatar: 'https://q1.qlogo.cn/g?b=qq&s=0&nk=794161769',
        UserId: '1715713638',
        UserName: '柠檬冲水',
        OpenId: '120120120',
        UserAvatar: 'https://q1.qlogo.cn/g?b=qq&s=0&nk=1715713638',
        GuildId: '123123',
        ChannelId: '123456',
        ChannelName: '机器人交流群',
        ChannelAvatar: 'https://alemonjs.com/img/alemon.png'
      };
      // 发送消息
      webviewView.webview.postMessage({
        // 按主动消息格式返回
        type: 'fs.readFile.message',
        payload: config
      });
      // 写入文件
      require('fs').writeFileSync(dir, JSON.stringify(config));
      return;
    }
    const data = require('fs').readFileSync(dir, 'utf-8');
    webviewView.webview.postMessage({
      type: 'fs.readFile.message',
      payload: JSON.parse(data)
    });
  }

  /**
   *
   * @param webviewView
   * @param message
   */
  fsWriteFileMessage(message: any) {
    const dir = this.context.asAbsolutePath('dist/message.json');
    require('fs').writeFileSync(dir, JSON.stringify(message.payload));
    vscode.window.showInformationMessage('保存成功');
  }

  /**
   *
   * @param webviewView
   */
  resolveWebviewView(webviewView: vscode.WebviewView) {
    //
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
            this.fsFreadFileConfig(webviewView);
            break;
          }
          case 'fs.writeFile.config': {
            this.fsWriteFileConfig(message);
            break;
          }
          case 'fs.readFile.message': {
            this.fsFreadFileMessage(webviewView);
            break;
          }
          case 'fs.writeFile.message': {
            this.fsWriteFileMessage(message);
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
    const scriptReg = /<script.*?src="(.+?)".*?>/g;
    const styleReg = /<link.*?href="(.+?)".*?>/g;
    const styleUri = getHTMLURL('dist-gui', 'assets', 'index.css');
    const scriptUri = getHTMLURL('dist-gui', 'assets', 'index.js');
    const html = require('fs')
      .readFileSync(this.context.asAbsolutePath('dist-gui/index.html'), 'utf-8')
      .replace(
        '<head>',
        `<head> <script> const vscode = acquireVsCodeApi();window.vscode = vscode; </script>`
      )
      .replace(
        scriptReg,
        `<script type="module" crossorigin src="${scriptUri}"></script>`
      )
      .replace(
        styleReg,
        `<link rel="stylesheet" crossorigin href="${styleUri}">`
      );
    return html;
  }
}
