import * as vscode from 'vscode';
import * as fs from 'fs';

var terminal: vscode.Terminal;
const vivado = "vivado -nolog -nojournal -mode batch -source current.tcl";
const rm = "rm current.tcl";

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('viv.init', () => {
		initialize();
	}));

	context.subscriptions.push(vscode.commands.registerCommand('viv.create_project', () => {
		ensureInit();

		let folderName = vscode.workspace.name;

		terminal.show();
		terminal.sendText("cp create_project.tcl current.tcl");
		terminal.sendText(`sed -i 's/$PROJECT_NAME/${folderName}/g' current.tcl`);
		terminal.sendText("cat current.tcl");
		terminal.sendText(vivado);
		terminal.sendText(rm);
		vscode.window.showInformationMessage('Creating project');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('viv.add_design', async () => {
		ensureInit();

		let folderName = vscode.workspace.name;
		let moduleName = await vscode.window.showInputBox({prompt: "Design module name"});

		terminal.show();
		terminal.sendText("cp add_design.tcl current.tcl");
		terminal.sendText(`sed -i 's/$PROJECT_NAME/${folderName}/g' current.tcl`);
		terminal.sendText(`sed -i 's/$MODULE_NAME/${moduleName}/g' current.tcl`);
		terminal.sendText("cat current.tcl");
		terminal.sendText(vivado);
		terminal.sendText(rm);
		vscode.window.showInformationMessage(`Adding design source ${moduleName}.v to project`);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('viv.rename_design', async () => {
		ensureInit();

		let folderName = vscode.workspace.name;
		let oldModuleName = await vscode.window.showInputBox({prompt: "Old module name"});
		let newModuleName = await vscode.window.showInputBox({prompt: "New module name"});

		terminal.show();
		terminal.sendText("cp rename_design.tcl current.tcl");
		terminal.sendText(`sed -i 's/$PROJECT_NAME/${folderName}/g' current.tcl`);
		terminal.sendText(`sed -i 's/$OLD_MODULE_NAME/${oldModuleName}/g' current.tcl`);
		terminal.sendText(`sed -i 's/$NEW_MODULE_NAME/${newModuleName}/g' current.tcl`);
		terminal.sendText("cat current.tcl");
		terminal.sendText(vivado);
		terminal.sendText(rm);
		vscode.window.showInformationMessage(`Renaming ${oldModuleName}.v to ${newModuleName}.v `);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('viv.set_design_top', async () => {
		ensureInit();

		let folderName = vscode.workspace.name;
		let moduleName = await vscode.window.showInputBox({prompt: "Design module name"});

		terminal.show();
		terminal.sendText("cp set_design_top.tcl current.tcl");
		terminal.sendText(`sed -i 's/$PROJECT_NAME/${folderName}/g' current.tcl`);
		terminal.sendText(`sed -i 's/$MODULE_NAME/${moduleName}/g' current.tcl`);
		terminal.sendText("cat current.tcl");
		terminal.sendText(vivado);
		terminal.sendText(rm);
		vscode.window.showInformationMessage(`Setting ${moduleName} as top`);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('viv.schematic', async () => {
		ensureInit();

		let folderName = vscode.workspace.name;
		let moduleName = await vscode.window.showInputBox({prompt: "Design module name"});

		terminal.show();
		terminal.sendText("cp schematic.tcl current.tcl");
		terminal.sendText(`sed -i 's/$PROJECT_NAME/${folderName}/g' current.tcl`);
		terminal.sendText(`sed -i 's/$MODULE_NAME/${moduleName}/g' current.tcl`);
		terminal.sendText("cat current.tcl");
		terminal.sendText(`xvfb-run ${vivado}`);
		terminal.sendText(rm);
		vscode.window.showInformationMessage(`Exporting schematic`);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('viv.add_sim', async () => {
		ensureInit();

		let folderName = vscode.workspace.name;
		let moduleName = await vscode.window.showInputBox({prompt: "Simulation module name"});

		terminal.show();
		terminal.sendText("cp add_sim.tcl current.tcl");
		terminal.sendText(`sed -i 's/$PROJECT_NAME/${folderName}/g' current.tcl`);
		terminal.sendText(`sed -i 's/$SIM_NAME/${moduleName}/g' current.tcl`);
		terminal.sendText("cat current.tcl");
		terminal.sendText(vivado);
		terminal.sendText(rm);
		vscode.window.showInformationMessage(`Adding simulation source ${moduleName}.v to project`);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('viv.set_sim_top', async () => {
		ensureInit();

		let folderName = vscode.workspace.name;
		let moduleName = await vscode.window.showInputBox({prompt: "Simulation module name"});

		terminal.show();
		terminal.sendText("cp set_sim_top.tcl current.tcl");
		terminal.sendText(`sed -i 's/$PROJECT_NAME/${folderName}/g' current.tcl`);
		terminal.sendText(`sed -i 's/$MODULE_NAME/${moduleName}/g' current.tcl`);
		terminal.sendText("cat current.tcl");
		terminal.sendText(vivado);
		terminal.sendText(rm);
		vscode.window.showInformationMessage(`Setting ${moduleName} as top`);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('viv.simulation', async () => {
		ensureInit();

		let folderName = vscode.workspace.name;
		let moduleName = await vscode.window.showInputBox({prompt: "Simulation module name"});

		terminal.show();
		terminal.sendText("cp simulation.tcl current.tcl");
		terminal.sendText(`sed -i 's/$PROJECT_NAME/${folderName}/g' current.tcl`);
		terminal.sendText(`sed -i 's/$MODULE_NAME/${moduleName}/g' current.tcl`);
		terminal.sendText("cat current.tcl");
		terminal.sendText(vivado);
		terminal.sendText(rm);

		terminal.sendText("cp xsim.sh current.sh");
		terminal.sendText(`sed -i 's/$PROJECT_NAME/${folderName}/g' current.sh`);
		terminal.sendText(`sed -i 's/$MODULE_NAME/${moduleName}/g' current.sh`);
		terminal.sendText("zsh current.sh");
		terminal.sendText("rm current.sh");

		vscode.window.showInformationMessage(`Running simulation`);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('viv.bitstream', async () => {
		ensureInit();

		let folderName = vscode.workspace.name;
		let moduleName = await vscode.window.showInputBox({prompt: "Design module name"});

		terminal.show();
		terminal.sendText("cp bitstream.tcl current.tcl");
		terminal.sendText(`sed -i 's/$PROJECT_NAME/${folderName}/g' current.tcl`);
		terminal.sendText(`sed -i 's/$MODULE_NAME/${moduleName}/g' current.tcl`);
		terminal.sendText("cat current.tcl");
		terminal.sendText(vivado);
		terminal.sendText(rm);

		vscode.window.showInformationMessage(`Generating bitstream`);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('viv.program', async () => {
		ensureInit();

		let folderName = vscode.workspace.name;
		let moduleName = await vscode.window.showInputBox({prompt: "Design module name"});

		terminal.show();
		terminal.sendText("cp program.tcl current.tcl");
		terminal.sendText(`sed -i 's/$PROJECT_NAME/${folderName}/g' current.tcl`);
		terminal.sendText(`sed -i 's/$MODULE_NAME/${moduleName}/g' current.tcl`);
		terminal.sendText("cat current.tcl");
		terminal.sendText(vivado);
		terminal.sendText(rm);

		vscode.window.showInformationMessage(`Programming device`);
	}));
}

// this method is called when your extension is deactivated
export function deactivate() {}

function initialize() {
	terminal = vscode.window.createTerminal("viv");
	terminal.show();
	terminal.sendText("cd ~/vivado-mac/box; vagrant ssh");
	terminal.sendText("cd /shared/viv/scripts");
	vscode.window.showInformationMessage('Initializing connection to vagrant');
}

function ensureInit() {
	if (!terminal) {
		initialize();
	}
}