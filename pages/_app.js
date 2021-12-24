// import App from 'next/app';
// import { Provider } from 'react-redux';
// import React from 'react';
// import { createWrapper } from 'next-redux-wrapper';
// import store from '../redux/store';

// import '../styles/globals.scss'

// class TcgOnline extends App {
//     static async getInitialProps({Component, ctx}) {
//         const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

//         //Anything returned here can be access by the client
//         return { pageProps: pageProps };
//     }

//     render() {
//         //Information that was returned  from 'getInitialProps' are stored in the props i.e. pageProps
//         const { Component, pageProps, store } = this.props;

//         return (
//             <Provider store={store}>
//                 <Component {...pageProps}/>
//             </Provider>
//         );
//     }
// }

// const makeStore = () => store;
// const wrapper = createWrapper(makeStore);

// export default wrapper.withRedux(TcgOnline);

import '../styles/globals.scss'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp