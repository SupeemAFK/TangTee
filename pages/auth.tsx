import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { BsFacebook } from 'react-icons/bs';
import { useAuth } from '../context/AuthContext'

export interface IAuthProps {
}

export default function Auth (props: IAuthProps) {
  const { currentUser, signinFacebook } = useAuth()
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push('/');
    }
  }, [])

  return (
    <div className="flex min-w-screen min-h-screen justify-center items-center bg-gray-500">
      <Head>
        <title>Tang Tee</title>
      </Head>
      <div className="flex flex-col items-center">
        <div className="flex items-center mb-20">
          <h1 className="text-teal-400 font-bold text-5xl">Tang <span className="text-white">Tee</span></h1>
          <div className="w-10 ml-2"><img className="object-cover w-full" src="/icon.png" alt="icon"/></div>
        </div>
        <button onClick={() => signinFacebook()} className="p-2 px-4 bg-[#1877F2] text-white rounded-lg flex items-center hover:bg-blue-700 transition-all duration-300">Sign in with Facebook <BsFacebook className="ml-2" /></button>
      </div>
    </div>
  );
}
