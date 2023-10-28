import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	// console.log('Sorter extension activated.');
	registerCommand(context, 'sorter.sortAscending', () => sortSelection(true));
	registerCommand(context, 'sorter.sortDescending', () => sortSelection(false));
}

function sortSelection(isAscending: boolean) {
	const editor = vscode.window.activeTextEditor;
	if(!editor) {
		console.log('No active editor found.');
		return;
	}

	const selection = editor.selection;
	const start = selection.start;
	const end = selection.end;

	const newSelection = new vscode.Selection(start.line, 0, end.line+1, 0);
	const text = editor.document.getText(newSelection);
	const lines = text.split(/\r?\n/);
	
	// console.log('Before sorting:', lines);
	lines.sort((a,b) => (isAscending ? a.localeCompare(b) : b.localeCompare(a)));
	// console.log('After sorting:', lines);

	editor.edit((editBuilder) => {
		editBuilder.replace(newSelection, lines.join('\n'));
	});

	editor.selection = newSelection;
}

function registerCommand(context: vscode.ExtensionContext, command: string, func: () => void) {
	const disposable = vscode.commands.registerCommand(command, func);
	context.subscriptions.push(disposable);
}
// This method is called when your extension is deactivated
export function deactivate() {}
