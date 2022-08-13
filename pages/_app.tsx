import '../styles/globals.css'
import 'react-toastify/dist/ReactToastify.css';
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router';
import { ToastContainer } from 'react-toastify';
import AuthContext from '../context/AuthContext'
import PostContext from '../context/PostContext'
import JoinContext from '../context/JoinContext'
import PartyContext from '../context/PartyContext'
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
        <JoinContext>
          <PartyContext>
            <Navbar />
            <ToastContainer />
            <Component {...pageProps} /> 
          </PartyContext> 
        </JoinContext>
      </PostContext>  
    </AuthContext>
  )
}

export default MyApp
