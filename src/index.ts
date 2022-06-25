import { AppTracker } from './app_tracker';
import { IDict } from './types';
import { AppWidget } from './widgets/app_widget';
import { UUID } from '@lumino/coreutils';
import {
  ILabShell,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { ILauncher } from '@jupyterlab/launcher';
import { iconFromText } from './tools';
import { requestAPI } from './handler';
import * as nbformat from '@jupyterlab/nbformat';
/**
 * Initialization data for the jupyterlab_app_launcher extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_app_launcher:plugin',
  autoStart: true,
  requires: [ILauncher, ILabShell],
  activate: (app: JupyterFrontEnd, launcher: ILauncher, shell: ILabShell) => {
    console.log('JupyterLab extension jupyterlab_app_launcher is activated!');
    const namespace = 'jupyterlab-app-launcher';
    const { commands, serviceManager } = app;
    const widgetTracker = new AppTracker({ namespace });
    commands.addCommand( 'foo', {
      label: 'Foo',
      caption: 'Foo',
      icon: iconFromText('FO'),
      execute: async args => {
        const notebook = await requestAPI<nbformat.INotebookContent>('get_notebook', {
          method: 'POST',
          body: JSON.stringify({
            appName: 'foo'
          })
        })

        const id = UUID.uuid4()
        const label = 'Foo'
        const widget = new AppWidget({id, label, notebook, serviceManager})
        app.shell.add(widget, 'main');
        widgetTracker.add(widget);
      }
    });

    widgetTracker.widgetDisposed.connect((_, changed) => {
      console.log('changed', changed);
      
    });
  
    launcher.add({
      command: 'foo',
      category: 'Jupyter App',
      rank: 1
    });
    
    commands.addCommand('bar', {
      label: 'Bar',
      caption: 'Bar',
      icon: iconFromText('BA'),
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
