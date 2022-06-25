import { AppWidget } from './widgets/app_widget';
import { IDisposable } from '@lumino/disposable';
import {
  KernelMessage,
} from '@jupyterlab/services';
import { ISignal } from '@lumino/signaling';
import { IWidgetTracker } from '@jupyterlab/apputils';


export interface IDict<T = any>{
  [key:string]: T
}

export interface IAppModel extends IDisposable {
  initialize(): Promise<void>
}

export interface IKernelExecutor extends IDisposable {
  startKernel(): Promise<void>
  executeCode(
    code: KernelMessage.IExecuteRequestMsg['content']
  ): Promise<void>
}

export interface IAppTracker extends IWidgetTracker<AppWidget> {
  widgetDisposed: ISignal<IAppTracker, AppWidget>;
}
