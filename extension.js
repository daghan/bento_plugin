// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
// const { exec, execFileSync } = require('child_process');
const path = require('path');
//const { exec } = require('child-process-promise');
const exec = require('child-process-promise').exec;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "bento" is now active!');
	vscode.window.showInformationMessage('Activating Bento IDE integration');  
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	const folderPath = vscode.workspace.workspaceFolders[0].uri
		.toString()
		.split(":")[1];

	const output = vscode.window.createTerminal({
		cwd: folderPath,
		name: "Bento CLI",
		hideFromUser: false
	});

	let onSave = vscode.workspace.onDidSaveTextDocument(document => {
		// file path
		const filePath = document.uri.fsPath
		const dirPath = path.dirname(filePath);

		exec('cd ' + dirPath + ' ; git rev-parse --show-toplevel')
			.then(results => {
				const repoPath = results.stdout.trim();
				const relFilePath = filePath.replace(repoPath,'.');
				output.show()
				output.sendText('cd ' + repoPath + '; bento check ' + relFilePath);
			})
			.catch(error => {console.error('ERROR: ', error)});
	});

	// let onTerminal = vscode.window.onDidOpenTerminal(event =>{
	// 	console.log(event);
	// });

	

	let disposable = vscode.commands.registerCommand('extension.bento', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Activating Bento IDE integration');
		context.subscriptions.push(onSave);
		context.subscriptions.push(onTerminal);


	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
