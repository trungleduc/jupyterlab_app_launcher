import { WidgetTracker } from '@jupyterlab/apputils';
import { ISignal, Signal } from '@lumino/signaling';

import { IAppTracker } from './types';
import { AppWidget } from './widgets/app_widget';

export class AppTracker
  extends WidgetTracker<AppWidget>
  implements IAppTracker
{
  add(widget: AppWidget): Promise<void> {
    widget.disposed.connect(() => {
      this._widgetDisposed.emit(widget);
    });
    return super.add(widget);
  }
  get widgetDisposed(): ISignal<this, AppWidget> {
    return this._widgetDisposed;
  }

  private _widgetDisposed = new Signal<this, AppWidget>(this);
}
