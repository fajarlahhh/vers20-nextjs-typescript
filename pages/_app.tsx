import type { AppProps } from 'next/app'
import '../public/css/style.css';
import 'react-perfect-scrollbar/dist/css/styles.css';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
