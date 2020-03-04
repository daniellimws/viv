VSCode extension for interacting with Vivado installed on a vagrant machine. Assumes the setup described [here](https://github.com/daniellimws/vivado-mac).

### Installation
Download the [package](#) from the releases. Not published onto the VSCode marketplace because it seems like a lot of work. Then run the following command to install.

```sh
code --install-extension viv.vsix
```

### Usage
All actions are performed through the command pallete (⌘+Shift+P). The commands are prefixed by `viv:`, for example `viv: Create Project`.

Currently, the extension does not monitor when the commands have finished executing, but the progress can be seen in the terminal at the bottom of VSCode.

#### `viv: Create Project`
Call this to create a project in the current folder. The project name will be the name of the current folder. This means VSCode needs to be opened in the folder where the project files are going to be in.

#### `viv: Add Design Source`
Provide the module name (without .v at the end) of the new source file to be created. Make sure to use this to add a source file, instead of manually creating the file, because the Vivado project file needs to be updated with this new information.

#### `viv: Add Simulation Source`
Same idea.

#### `viv: Export Schematic`
Provide the name of the design module to generate its schematic. A schematic.svg file will be saved in the root of the project folder.

#### `viv: Run Simulation`
Provide the name of the simulation module to simulate. XQuartz has to be opened because the simulator GUI will be forwarded to it.

#### `viv: Generate Bitstream`
Provide the name of the design module to generate a bitstream. This one is a bit special because its progress cannot be tracked in the terminal, as Vivado runs this part in detached mode. However, progress can still be monitored by looking at **PROJECT_NAME.runs/impl_1/runme.log**. (If the file does not exist it might mean the command failed to execute or it has not finished running yet)

#### `viv: Program Device`
Provide the name of the design module which has a bitstream generated earlier. Follow instructions [here](https://www.centennialsoftwaresolutions.com/post/connecting-vivado-to-digilent-s-usb-to-jtag-through-virtualbox) to set up USB and the required drivers in the virtual machine.

