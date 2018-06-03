import React, { Component } from 'react';
import dva, { DvaInstance, Model, connect } from 'dva';
import { Provider } from 'react-redux';
import models from './model/index';

const DEFAULT_KEY = '__NEXT_DVA_STORE__';
const checkServer = () => Object.prototype.toString.call(global.process) === '[object process]';

export interface DvaProps {
  store: any;
  isServer: boolean;
  initialProps: any;
  initialState: any;
}

/**
 *
 * @param {{}} initialState
 * @param {Model[]} models
 * @returns {any}
 */
export function createStore(initialState = {}, models: Model[] = []): any {
  const app: DvaInstance = dva({ initialState });
  models.forEach(m => app.model(m));
  app.router(() => {
  });
  app.start();

  return app._store;
}

/**
 *
 * @param {any} initialState
 * @param {Model[]} models
 * @param {any} config
 * @returns {any}
 */
function initStore(initialState = {}, models: Model[], config = {}): any {
  const { storeKey } = { storeKey: DEFAULT_KEY, ...config };
  const isServer = checkServer();

  if (isServer) { // run in server
    return createStore(initialState, models);
  }

  // Memoize store if client
  if (!window[storeKey]) {
    window[storeKey] = createStore(initialState, models);
  }

  return window[storeKey];
}

/**
 *
 * @param args
 * @returns {(App) => {getInitialProps: (ctx: any) => Promise<DvaProps>; componentDidMount?(): void; shouldComponentUpdate?(nextProps: Readonly<DvaProps>, nextState: Readonly<{}>, nextContext: any): boolean; componentWillUnmount?(): void; componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void; getSnapshotBeforeUpdate?(prevProps: Readonly<DvaProps>, prevState: Readonly<{}>): (any); componentDidUpdate?(prevProps: Readonly<DvaProps>, prevState: Readonly<{}>, snapshot?: any): void; componentWillMount?(): void; UNSAFE_componentWillMount?(): void; componentWillReceiveProps?(nextProps: Readonly<DvaProps>, nextContext: any): void; UNSAFE_componentWillReceiveProps?(nextProps: Readonly<DvaProps>, nextContext: any): void; componentWillUpdate?(nextProps: Readonly<DvaProps>, nextState: Readonly<{}>, nextContext: any): void; UNSAFE_componentWillUpdate?(nextProps: Readonly<DvaProps>, nextState: Readonly<{}>, nextContext: any): void; new(props: DvaProps, context?: any): DvaComponent<>; prototype: DvaComponent}}
 */
export default function withDva(...args) {
  const config = {
    storeKey: DEFAULT_KEY,
    serializeState: state => state,
    deserializeState: state => state,
  };

  return (App) => (class DvaComponent extends Component<DvaProps> {

    static getInitialProps = async (ctx: any): Promise<DvaProps> => {
      const isServer = checkServer();
      const store = initStore(ctx.req, models, config);

      // call children's getInitialProps
      // get initProps and transfer in to the page
      const initialProps = App.getInitialProps
        ? await App.getInitialProps({ ...ctx, isServer, store })
        : {};

      return {
        store,
        isServer,
        initialProps,
        initialState: config.serializeState(store.getState()),
      };
    };

    render() {
      const { store, initialProps, initialState } = this.props;
      const hasStore = store && store.dispatch;
      const ConnectedComponent = connect(...args)(App);
      return React.createElement(
        Provider,
        // in client side, it will init store with the initial state transfer from server side
        { store: hasStore ? store : initStore(initialState, models, config) },
        // transfer next.js's props to the page
        React.createElement(ConnectedComponent, initialProps),
      );
    }

  });
}
