import React from 'react';
import { Provider } from 'react-redux';
import App, { Container } from 'next/app';
import withRedux from 'next-redux-wrapper';
import { createStore } from '../store';

interface Props {
  Component: React.Component;
  pageProps: any;
  store: any;
}

export default withRedux(createStore)(class MyApp extends App<Props> {
  static async getInitialProps(...arg) {
    return await App.getInitialProps(...arg);
  }

  render() {
    const { Component, pageProps, store } = (this as any).props;
    return <Container>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </Container>;
  }
});