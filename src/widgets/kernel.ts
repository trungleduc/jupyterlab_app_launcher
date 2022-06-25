import { IKernelExecutor } from './../types';
import {
  Kernel,
  KernelMessage,
  ServiceManager,
  Session
} from '@jupyterlab/services';
import { find } from '@lumino/algorithm';
import { UUID } from '@lumino/coreutils';

export class KernelExecutor implements IKernelExecutor {
  constructor(private options: KernelExecutor.IOptions) {
    this._kernelStarted = false;
    this.isDisposed = false;
  }

  async startKernel(): Promise<void> {
    if (this._kernelStarted) {
      return;
    }
    const sessionManager = this.options.manager.sessions;
    await sessionManager.ready;
    await sessionManager.refreshRunning();
    const model = find(sessionManager.running(), item => {
      return item.name === this.options.kernelName;
    });

    if (model) {
      this._sessionConnection = sessionManager.connectTo({ model });
    } else {
      await this.options.manager.kernelspecs.ready;
      const specs = this.options.manager.kernelspecs.specs!;
      console.log('sepcs', specs, this.options.kernelName);

      this._sessionConnection = await sessionManager.startNew({
        name: `jupyter_app_launcher_${UUID.uuid4()}`,
        path: UUID.uuid4(),
        kernel: {
          name: this.options.kernelName
        },
        type: 'notebook'
      });
      const kernelModel = {
        name: this.options.kernelName
      } as Kernel.IModel;
      await this._sessionConnection.changeKernel(kernelModel);
    }
    this._sessionConnection.kernel?.disposed.connect(
      () => (this._kernelStarted = false)
    );
    this._kernelStarted = true;
  }

  async executeCode(
    code: KernelMessage.IExecuteRequestMsg['content']
  ): Promise<void> {}

  dispose(): void {
    if (this._sessionConnection) {
      const id = this._sessionConnection.id;
      this.options.manager.sessions.shutdown(id);
      this._sessionConnection.dispose();
    }
  }

  isDisposed: boolean;
  // private _sessionContext: ISessionContext;
  private _sessionConnection?: Session.ISessionConnection;
  private _kernelStarted: boolean;
}

export namespace KernelExecutor {
  export interface IOptions {
    manager: ServiceManager;
    jupyterLite: boolean;
    kernelName: string;
  }
}
