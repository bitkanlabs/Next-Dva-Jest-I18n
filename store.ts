import dva, { DvaInstance } from 'dva';
import { Context } from 'next/document';
import models from './model';
import { Store } from 'react-redux';

export interface DvaProps<S> {
  store: Store<S>;
  isServer: boolean;
  initialProps: any;
  initialState: any;
}

export interface DvaContext<S> extends Context {
  store: Store<S>;
  isServer: boolean;
}

/**
 *
 * @param {{}} initialState
 * @returns {any}
 */
export function createStore(initialState = {}): any {
  const app: DvaInstance = dva({ initialState });
  models.forEach(m => app.model(m));
  app.router(() => {});
  app.start();

  return app._store;
}
