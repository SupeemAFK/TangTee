import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next'
import Navbar from '../components/Navbar';
import IPost from '../interface/post'
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase'
import Post from '../components/Post'

const Home: NextPage = () => {
  const [posts, setPosts] = useState<IPost[]>();

  useEffect(() => {
    onSnapshot(collection(db, "posts"), (snapshot) => {
      const dbPosts = snapshot.docs.map(doc => doc.data())
      setPosts(dbPosts)
    })
  }, []) 

  return (
    <div>
      <Navbar />
      <div>
        {posts?.map(post => <Post post={post} />)}
      </div>
    </div>
  )
}

export default Home