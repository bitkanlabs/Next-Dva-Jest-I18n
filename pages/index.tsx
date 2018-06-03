import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import Link from 'next/link';

import { DvaContext } from '../store';
import Head from '../components/head';
import Nav from '../components/nav';
import { Button } from 'antd';

interface Props extends DispatchProp {
  index: {
    name: string;
    count: number;
  }
}

class Page extends React.Component<Props> {
  static async getInitialProps(ctx: DvaContext<any>) {
    // first time run in server side
    // other times run in client side ( client side init with default ctx
    const { pathname, query, isServer, store, } = ctx;

    // dispatch effects to fetch data here
    await ctx.store.dispatch({ type: 'index/init' });

    // don't use store as property name, it will conflict with initial store
    return { pathname, query, isServer, dvaStore: store, };
  }

  render() {
    console.log(this.props);
    const { index } = this.props;
    const { name, count } = index;
    // console.log('rendered!!');
    return (
      <div>
        <Head title="Home"/>
        <Nav/>

        <div className="hero">
          <h1 className="title">Hello {name}</h1>
          <h1 className="title">Welcome to Next+Dva!</h1>
          <p className="description">To get started, edit <code>pages/index.js</code> and save to reload.</p>

          <div className="row box">
            <Link href="https://github.com/zeit/next.js#getting-started">
              <a className="card">
                <h3>Getting Started &rarr;</h3>
                <p>Learn more about Next on Github and in their examples</p>
              </a>
            </Link>
            <Link href="https://open.segment.com/create-next-app">
              <a className="card">
                <h3>Examples &rarr;</h3>
                <p>
                  Find other example boilerplates on the <code>create-next-app</code> site
                </p>
              </a>
            </Link>
            <Link href="https://github.com/segmentio/create-next-app">
              <a className="card">
                <h3>Create Next App &rarr;</h3>
                <p>Was this tool helpful? Let us know how we can improve it</p>
              </a>
            </Link>
            <Link href="https://github.com/dvajs/dva">
              <div className="card">
                <h3>Dva &rarr;</h3>
                <p className="row">
                  <Button type="primary" onClick={() => { this.props.dispatch({ type: 'index/calculate', delta: 1 }); }} >
                    +
                  </Button>
                  <span>count:&nbsp; {count}</span>
                  <Button type="primary" onClick={() => { this.props.dispatch({ type: 'index/calculate', delta: -1 }); }} >
                    -
                  </Button>
                </p>
              </div>
            </Link>
          </div>
        </div>

        <style jsx>{`
      .hero {
        width: 100%;
        color: #333;
      }
      .title {
        margin: 0;
        width: 100%;
        padding-top: 80px;
        line-height: 1.15;
        font-size: 48px;
      }
      .title, .description {
        text-align: center;
      }
      .box {
        margin: 80px auto 40px;
      }
      .row {
        max-width: 880px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
      }
      .card {
        padding: 18px 18px 24px;
        width: 220px;
        text-align: left;
        text-decoration: none;
        color: #434343;
        border: 1px solid #9B9B9B;
      }
      .card:hover {
        border-color: #067df7;
      }
      .card h3 {
        margin: 0;
        color: #067df7;
        font-size: 18px;
      }
      .card p {
        margin: 0;
        padding: 12px 0 0;
        font-size: 13px;
        color: #333;
      }
    `}</style>
      </div>
    );
  }
}

export default connect((state: Props) => { return { index: state.index }; })(Page);
