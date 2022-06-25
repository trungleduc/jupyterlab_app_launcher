import { KernelExecutor } from './kernel';
import { IAppModel, IDict, IKernelExecutor } from './../types';
import * as nbformat from '@jupyterlab/nbformat';
import { ServiceManager } from '@jupyterlab/services';
export class AppModel implements IAppModel {
  constructor(private options: AppModel.IOptions) {
    this._notebook = options.notebook;
    this.isDisposed = false;
  }
  /**
   * Whether the handler is disposed.
   */
  isDisposed: boolean;

  dispose(): void {
    if (this.isDisposed) {
      return;
    }
    this._kernel?.dispose()
    this.isDisposed = true;
  }
  get notebook(): nbformat.INotebookContent {
    return this._notebook;
  }

  public async initialize(): Promise<void> {
    this.parseNotebook(this._notebook);
    this._kernel = new KernelExecutor({
      manager: this.options.manager,
      jupyterLite: !!document.getElementById('jupyter-lite-main'),
      kernelName: this._kernelspec.name
    });
    await this._kernel.startKernel()
    console.log(this._cells, this._kernelspec, this._jupyter_dashboards);
  }

  private parseNotebook(nb: nbformat.INotebookContent): void {
    this._cells = this._notebook.cells ?? [];
    this._kernelspec = this._notebook.metadata.kernelspec ?? {
      name: 'python3',
      display_name: ''
    };
    const extensions = (this._notebook.metadata['extensions'] ?? {}) as IDict;
    this._jupyter_dashboards = extensions['jupyter_dashboards'] ?? {};
  }
  private _cells: IDict[] = [];
  private _kernelspec: nbformat.IKernelspecMetadata = {
    name: 'python3',
    display_name: ''
  };
  private _jupyter_dashboards: IDict = {};
  private _notebook: nbformat.INotebookContent;
  private _kernel?: IKernelExecutor
}

export namespace AppModel {
  export interface IOptions {
    notebook: nbformat.INotebookContent;
    manager: ServiceManager
  }
}
