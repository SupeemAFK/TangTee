import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router';
import AuthContext from '../context/AuthContext'
import Navbar from '../components/Navbar';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { asPath } = router;

  if (asPath === "/auth") {
    return (
      <AuthContext>
        <Component {...pageProps} />
      </AuthContext>
    )
  }

  return (
    <AuthContext>
      <Navbar />
      <Component {...pageProps} />    
    </AuthContext>
  )
}

export default MyApp
