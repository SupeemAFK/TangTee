import '../styles/globals.css'
import type { AppProps } from 'next/app'
import AuthContext from '../context/AuthContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthContext>
      <Component {...pageProps} />    
    </AuthContext>
  )
}

export default MyApp
