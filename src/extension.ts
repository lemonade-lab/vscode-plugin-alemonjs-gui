import * as vscode from 'vscode';
import { ChatSidebarProvider } from './core/ChatSidebarProvider';
export function activate(context: vscode.ExtensionContext) {
  const sidebarProvider = new ChatSidebarProvider(context);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      'alemonjs.chatSidebar',
      sidebarProvider
    )
  );
  const openChatSidebarCommand = vscode.commands.registerCommand(
    'alemonjs.openChatSidebar',
    async () => {
      await vscode.commands.executeCommand('alemonjs.chatSidebar.focus');
    }
  );
  context.subscriptions.push(openChatSidebarCommand);
  const openChatWindowButton = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  openChatWindowButton.text = '$(comment-discussion) A';
  openChatWindowButton.command = 'alemonjs.openChatSidebar';
  openChatWindowButton.show();
  context.subscriptions.push(openChatWindowButton);
}
