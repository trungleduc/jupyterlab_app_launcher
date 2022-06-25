import { AppModel } from './app_model';
import { IDict, IAppModel } from './../types';
import * as nbformat from '@jupyterlab/nbformat';
import { Widget } from '@lumino/widgets';

import { ServiceManager } from '@jupyterlab/services';
import { Message } from '@lumino/messaging';
export class AppWidget extends Widget {
  constructor(options: AppWidget.IOptions) {
    super();
    this.id = options.id;
    this.title.label = options.label;
    this.title.closable = true;
    this._model = new AppModel({ notebook: options.notebook, manager: options.serviceManager });
    this._model.initialize().then(() => {
      this._render();
    });
  }

  get model(): IAppModel {
    return this._model;
  }

  protected onCloseRequest(msg: Message): void {
    this._model.dispose()
    super.onCloseRequest(msg)
      
  }

  private _render(): void {
    console.log('rendering');
  }

  private _model: IAppModel;
}

export namespace AppWidget {
  export interface IOptions {
    id: string;
    label: string;
    notebook: nbformat.INotebookContent;
    serviceManager: ServiceManager;
  }
}
