import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next'
import Head from 'next/head';

//components
import Navbar from '../components/Navbar';
import Post from '../components/Post'
import AddPost from '../components/AddPost'

//interface
import IPost from '../interface/post'
import IUser from '../interface/user';

//services
import { collection, onSnapshot, getDoc, doc, DocumentData } from 'firebase/firestore';
import { db } from '../lib/firebase'

const Home: NextPage = () => {
  const [posts, setPosts] = useState<IPost[]>();

  useEffect(() => {
    onSnapshot(collection(db, "posts"), async (snapshot) => {
      const dbPosts = await Promise.all(snapshot.docs.map(async doc => {
        const data: DocumentData = doc.data()
        const id: string = doc.id
        const user: IUser = await getUser(data.user_id);
        return {
          id,
          text: data.text,
          img: data.img,
          max_participants: data.max_participants,
          tags: data.tags,
          status: data.status,
          user,
          requests: data.requests,
          accepts: data.accepts
        }
      }))
      
      setPosts(dbPosts.reverse())
    })
  }, []) 

  async function getUser(id: string): Promise<IUser> {
    const docSnap = await getDoc(doc(db, "users", id));
    const user = docSnap.data()
    return {
      id: docSnap.id,
      name: user?.name,
      avatar: user?.avatar,
      bio: user?.avatar,
      stars: user?.stars,
      status: user?.status,
    }
  }

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
          {posts?.map(post => <Post key={post.id} post={post} />)}
        </div>
      </div>
    </>
  )
}

export default Home