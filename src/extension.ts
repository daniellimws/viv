import * as vscode from 'vscode';
import * as fs from 'fs';

var terminal: vscode.Terminal;
const vivado = "vivado -nolog -nojournal -mode batch -source current.tcl";
const rm = "rm current.tcl";

var designModuleName: string = "";
var simModuleName: string = "";

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
		let folderName = vscode.workspace.name;
		designModuleName = await vscode.window.showInputBox({ prompt: "Design module name", value: designModuleName }) || '';

		if (designModuleName === '') { return; }

		ensureInit();

		terminal.show();
		terminal.sendText("cp add_design.tcl current.tcl");
		terminal.sendText(`sed -i 's/$PROJECT_NAME/${folderName}/g' current.tcl`);
		terminal.sendText(`sed -i 's/$MODULE_NAME/${designModuleName}/g' current.tcl`);
		terminal.sendText("cat current.tcl");
		terminal.sendText(vivado);
		terminal.sendText(rm);
		vscode.window.showInformationMessage(`Adding design source ${designModuleName}.v to project`);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('viv.rename_design', async () => {
		let folderName = vscode.workspace.name;
		let oldModuleName: string = await vscode.window.showInputBox({ prompt: "Old module name" }) || '';
		let newModuleName: string = await vscode.window.showInputBox({ prompt: "New module name" }) || '';

		if (oldModuleName === '' || newModuleName === '') { return; }

		ensureInit();

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
		let folderName = vscode.workspace.name;
		designModuleName = await vscode.window.showInputBox({ prompt: "Design module name", value: designModuleName }) || '';

		if (designModuleName === '') { return; }

		ensureInit();

		terminal.show();
		terminal.sendText("cp set_design_top.tcl current.tcl");
		terminal.sendText(`sed -i 's/$PROJECT_NAME/${folderName}/g' current.tcl`);
		terminal.sendText(`sed -i 's/$MODULE_NAME/${designModuleName}/g' current.tcl`);
		terminal.sendText("cat current.tcl");
		terminal.sendText(vivado);
		terminal.sendText(rm);
		vscode.window.showInformationMessage(`Setting ${designModuleName} as top`);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('viv.schematic', async () => {
		let folderName = vscode.workspace.name;
		designModuleName = await vscode.window.showInputBox({ prompt: "Design module name", value: designModuleName }) || '';

		if (designModuleName === '') { return; }

		ensureInit();

		terminal.show();
		terminal.sendText("cp schematic.tcl current.tcl");
		terminal.sendText(`sed -i 's/$PROJECT_NAME/${designModuleName}/g' current.tcl`);
		terminal.sendText(`sed -i 's/$MODULE_NAME/${designModuleName}/g' current.tcl`);
		terminal.sendText("cat current.tcl");
		terminal.sendText(`xvfb-run ${vivado}`);
		terminal.sendText(rm);
		vscode.window.showInformationMessage(`Exporting schematic`);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('viv.add_sim', async () => {
		let folderName = vscode.workspace.name;
		simModuleName = await vscode.window.showInputBox({ prompt: "Simulation module name" }) || '';

		if (simModuleName === '') { return; }

		ensureInit();

		terminal.show();
		terminal.sendText("cp add_sim.tcl current.tcl");
		terminal.sendText(`sed -i 's/$PROJECT_NAME/${folderName}/g' current.tcl`);
		terminal.sendText(`sed -i 's/$SIM_NAME/${simModuleName}/g' current.tcl`);
		terminal.sendText("cat current.tcl");
		terminal.sendText(vivado);
		terminal.sendText(rm);
		vscode.window.showInformationMessage(`Adding simulation source ${simModuleName}.v to project`);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('viv.set_sim_top', async () => {
		let folderName = vscode.workspace.name;
		simModuleName = await vscode.window.showInputBox({ prompt: "Simulation module name", value: simModuleName }) || '';

		if (simModuleName === '') { return; }

		ensureInit();

		terminal.show();
		terminal.sendText("cp set_sim_top.tcl current.tcl");
		terminal.sendText(`sed -i 's/$PROJECT_NAME/${folderName}/g' current.tcl`);
		terminal.sendText(`sed -i 's/$MODULE_NAME/${simModuleName}/g' current.tcl`);
		terminal.sendText("cat current.tcl");
		terminal.sendText(vivado);
		terminal.sendText(rm);
		vscode.window.showInformationMessage(`Setting ${simModuleName} as top`);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('viv.simulation', async () => {
		let folderName = vscode.workspace.name;
		simModuleName = await vscode.window.showInputBox({ prompt: "Simulation module name", value: simModuleName }) || '';

		if (simModuleName === '') { return; }

		ensureInit();

		terminal.show();
		terminal.sendText("cp simulation.tcl current.tcl");
		terminal.sendText(`sed -i 's/$PROJECT_NAME/${folderName}/g' current.tcl`);
		terminal.sendText(`sed -i 's/$MODULE_NAME/${simModuleName}/g' current.tcl`);
		terminal.sendText("cat current.tcl");
		terminal.sendText(vivado);
		terminal.sendText(rm);

		terminal.sendText("cp xsim.sh current.sh");
		terminal.sendText(`sed -i 's/$PROJECT_NAME/${folderName}/g' current.sh`);
		terminal.sendText(`sed -i 's/$MODULE_NAME/${simModuleName}/g' current.sh`);
		terminal.sendText("zsh current.sh");
		terminal.sendText("rm current.sh");

		vscode.window.showInformationMessage(`Running simulation`);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('viv.bitstream', async () => {
		let folderName = vscode.workspace.name;
		designModuleName = await vscode.window.showInputBox({ prompt: "Design module name", value: designModuleName }) || '';

		if (designModuleName === '') { return; }

		ensureInit();

		terminal.show();
		terminal.sendText("cp bitstream.tcl current.tcl");
		terminal.sendText(`sed -i 's/$PROJECT_NAME/${folderName}/g' current.tcl`);
		terminal.sendText(`sed -i 's/$MODULE_NAME/${designModuleName}/g' current.tcl`);
		terminal.sendText("cat current.tcl");
		terminal.sendText(vivado);
		terminal.sendText(rm);

		vscode.window.showInformationMessage(`Generating bitstream`);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('viv.program', async () => {
		let folderName = vscode.workspace.name;
		designModuleName = await vscode.window.showInputBox({ prompt: "Design module name", value: designModuleName }) || '';

		if (designModuleName === '') { return; }

		ensureInit();

		terminal.show();
		terminal.sendText("cp program.tcl current.tcl");
		terminal.sendText(`sed -i 's/$PROJECT_NAME/${folderName}/g' current.tcl`);
		terminal.sendText(`sed -i 's/$MODULE_NAME/${designModuleName}/g' current.tcl`);
		terminal.sendText("cat current.tcl");
		terminal.sendText(vivado);
		terminal.sendText(rm);

		vscode.window.showInformationMessage(`Programming device`);
	}));
}

// this method is called when your extension is deactivated
export function deactivate() { }

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