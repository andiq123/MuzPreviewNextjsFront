import '../styles/globals.css';
import type { AppProps } from 'next/app';
import '@fortawesome/fontawesome-svg-core/styles.css'; // import Font Awesome CSS
import { config } from '@fortawesome/fontawesome-svg-core';
import { PlayerContextProvider } from '../store/PlayerContext';
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PlayerContextProvider>
      <Component {...pageProps} />
    </PlayerContextProvider>
  );
}

export default MyApp;
