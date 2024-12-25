import * as vscode from 'vscode';

export class ChatProvider implements vscode.TreeDataProvider<MessageItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<MessageItem | undefined | void> = new vscode.EventEmitter<MessageItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<MessageItem | undefined | void> = this._onDidChangeTreeData.event;

    private messages: string[] = [];

    getTreeItem(element: MessageItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: MessageItem): Thenable<MessageItem[]> {
        return Promise.resolve(this.messages.map((msg, index) => new MessageItem(msg, index)));
    }

    addMessage(message: string) {
        this.messages.push(message);
        this._onDidChangeTreeData.fire();
    }
}

class MessageItem extends vscode.TreeItem {
    constructor(
        public readonly message: string,
        public readonly index: number
    ) {
        super(message, vscode.TreeItemCollapsibleState.None);
        this.tooltip = `${this.message}`;
        this.description = this.message;
    }
}
