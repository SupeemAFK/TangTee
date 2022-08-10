import React from 'react';
import type { NextPage } from 'next'
import Head from 'next/head';
import { AnimatePresence, motion } from 'framer-motion';
import { usePostsContext } from '../context/PostContext';

//components
import Post from '../components/Post'
import AddPost from '../components/AddPost'

const Home: NextPage = () => {
  const { posts } = usePostsContext()
  
  return (
    <>
      <Head>
        <title>Tang Tee</title>
      </Head>
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
            {posts?.map(post => post.isOpen && <Post key={post.id} post={post} />)}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  )
}

export default Home