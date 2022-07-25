import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next'
import Head from 'next/head';
import { AnimatePresence, motion } from 'framer-motion';

//components
import Navbar from '../components/Navbar';
import Post from '../components/Post'
import AddPost from '../components/AddPost'

//interface
import IPost from '../interface/post'
import IUser from '../interface/user';

//services
import { collection, onSnapshot, getDoc, doc, DocumentData, DocumentSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase'

const Home: NextPage = () => {
  const [posts, setPosts] = useState<IPost[]>();

  useEffect(() => {
    onSnapshot(collection(db, "posts"), async (snapshot) => {
      const dbPosts: IPost[] = await Promise.all(snapshot.docs.map(async doc => {
        const data: DocumentData = doc.data()
        const id: string = doc.id
        const user: IUser = await getUser(data.user_id);
        return {
          id,
          title: data.title,
          details: data.details,
          img: data.img,
          max_participants: data.max_participants,
          tags: data.tags,
          status: data.status,
          user,
          participants: data.participants,
          createdAt: new Date(data.createdAt * 1000)
        }
      }))
      
      const dbPostSortDate: IPost[] = dbPosts.sort((a,b)=> (b.createdAt.getTime() - a.createdAt.getTime()))
      setPosts(dbPostSortDate)
    })
  }, []) 

  async function getUser(id: string): Promise<IUser> {
    const docSnap: DocumentSnapshot = await getDoc(doc(db, "users", id));
    const user: DocumentData | undefined = docSnap.data()
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
        <motion.div 
          variants={{
            hidden: { opacity: 1 },
            visible: {
              opacity: 1,
              scale: 1,
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {posts?.map(post => <Post key={post.id} post={post} />)}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  )
}

export default Home