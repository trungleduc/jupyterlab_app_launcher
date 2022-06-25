import {
  ILabShell,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { ILauncher } from '@jupyterlab/launcher';
import { iconFromText } from './tools';


/**
 * Initialization data for the jupyterlab_app_launcher extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_app_launcher:plugin',
  autoStart: true,
  requires: [ILauncher, ILabShell],
  activate: (app: JupyterFrontEnd, launcher: ILauncher, shell: ILabShell) => {
    console.log('JupyterLab extension jupyterlab_app_launcher is activated!');
    const { commands } = app;
    commands.addCommand( 'foo', {
      label: 'Foo',
      caption: 'Foo',
      icon: args => iconFromText('FO'),
      execute: async args => {
        console.log('hello', args);
        
      }
    });
    launcher.add({
      command: 'foo',
      category: 'Jupyter App',
      rank: 10
    });
    
    commands.addCommand('bar', {
      label: 'Bar',
      caption: 'Bar',
      icon: args => iconFromText('BA'),
      execute: async args => {
        console.log('hello bar', args);
      }
    });
    launcher.add({
      command: 'bar',
      category: 'Jupyter App',
      rank: 2
    });

  }
};

export default plugin;
