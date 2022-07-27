import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router';
import AuthContext from '../context/AuthContext'
import PostContext from '../context/PostContext'
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
      <PostContext>
        <Navbar />
        <Component {...pageProps} />  
      </PostContext>  
    </AuthContext>
  )
}

export default MyApp
