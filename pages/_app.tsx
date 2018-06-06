import React from 'react';
import { Provider } from 'react-redux';
import App, { Container } from 'next/app';
import withRedux from 'next-redux-wrapper';
import intl from "react-intl-universal";
import _ from "lodash";
import SUPPOER_LOCALES from '../utils/enums'

import { createStore } from '../utils/store';

interface Props {
  Component: React.Component;
  pageProps: any;
  store: any;
  lang: string;
}

// const SUPPOER_LOCALES = [ "en-US", "zh-CN", "zh-TW", "fr-FR", "ja-JP"];


export default withRedux(createStore)(class MyApp extends App<Props> {
  static async getInitialProps(...arg) {

    // console.log('arg[0].ctx', arg[0].ctx.query)

    const lang = arg[0].ctx.query.lang || arg[0].ctx.req.headers['accept-language'].split(',')[0]
    // const props = await App.getInitialProps(...arg);
    return {
      lang
    }
  }

  constructor(props) {
    super(props);
    this.loadLocales();
  }

  loadLocales () {
    // console.log('prop.lang', this.props.lang)
    // console.log('store', this.props)
    let currentLocale = this.props.lang;
    if (!_.find(SUPPOER_LOCALES, { value: currentLocale })) {
      currentLocale = "en-US";
    }
    intl.init({
      currentLocale: currentLocale,
      // locales
      locales: {
        [currentLocale]: require(`../static/locales/${currentLocale}`)
      }
    })
    .then(() => {
      // this.setState({ initDone: true });
    });
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