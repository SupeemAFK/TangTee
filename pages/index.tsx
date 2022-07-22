import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next'
import Head from 'next/head';

//components
import Navbar from '../components/Navbar';
import Post from '../components/Post'
import AddPost from '../components/AddPost'

//interface
import IPost from '../interface/post'

//services
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase'

const Home: NextPage = () => {
  const [posts, setPosts] = useState<IPost[]>();

  useEffect(() => {
    onSnapshot(collection(db, "posts"), (snapshot) => {
      const dbPosts = snapshot.docs.map(doc => doc.data())
      setPosts(dbPosts)
    })
  }, []) 

  return (
    <>
      <Head>
        <title>Tang Tee</title>
      </Head>
      <Navbar />
      <div className="min-w-screen mt-16 py-5 flex flex-col items-center">
        <div>
          <AddPost />
        </div>
        <div>
          {[0, 1, 2].map(num => <Post key={num} post={{}} />)}
          {posts?.map(post => <Post post={post} />)}
        </div>
      </div>
    </>
  )
}

export default Home