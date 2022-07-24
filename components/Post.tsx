import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import IPost from '../interface/post';
import { BsThreeDots } from 'react-icons/bs';
import { MdOutlineDelete } from 'react-icons/md'
import { AiOutlineEdit } from 'react-icons/ai'
import { db } from '../lib/firebase';
import { deleteDoc, doc } from "firebase/firestore"; 

export interface IPostProps {
    post: IPost
}

export default function Post ({ post }: IPostProps) {
  const [openMenu, setOpenMenu] = useState<Boolean>(false);

  return (
    <motion.div 
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
      }}
      className="rounded-md border-[1px] border-[#e6e6e6] w-72 md:w-96 lg:w-96 mt-5"
    >
      <div className="p-3 flex items-center justify-between font-medium">
        <div className="flex item-center">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img className="object-cover w-full" src={post?.user?.avatar} alt={post?.user?.name} />
          </div>
          <p className="ml-2 flex items-center">{post?.user?.name.slice(0, 5)}...</p> 
        </div>
        <div className="relative">
          <button onClick={() => setOpenMenu(true)}><BsThreeDots /></button>
          {openMenu && (
            <>
              <motion.div 
                initial={{ y: -20, opacity: 0, }}
                animate={{ y: 0, opacity: 1 }}
                className="border-[1px] border-[#e6e6e6] bg-white rounded-md p-2 absolute right-0 z-10"
              >
                <button className="text-teal-400 flex items-center font-normal">Edit <AiOutlineEdit className="ml-1" /></button>
                <div className="p-[0.02rem] bg-[#e6e6e6] my-1"></div>
                <button onClick={async () => await deleteDoc(doc(db, "posts", post.id))}className="text-red-400 flex items-center font-normal">Delete <MdOutlineDelete className="ml-1" /></button>
              </motion.div> 
              <div onClick={() => setOpenMenu(false)} className="w-full h-screen mt-16 fixed top-0 left-0"></div> 
            </>
          )}
        </div>
      </div>

      {post?.img !== '' && (
        <div className='w-full overflow-hidden'>
          <img className='object-cover w-full' src={post.img} alt={post.title} />
        </div>
      )}

      <div className='flex justify-center my-5 text-xl p-3 flex-col items-center'>
        <p className='text-center'>{post.title}</p>
        {post.tags.length > 0 && (
          <div className='w-full flex justify-center mt-1'>
            {post.tags.map(tag => (
              <div key={tag} className="bg-slate-400 mr-1 rounded-xl p-1 flex items-center justify-center text-white text-sm">
                <p>{tag}</p>
              </div>
            ))}
          </div>
        )}
      </div>

        <div className='flex justify-between items-center p-3 text-xs lg:text-base'>
          <div>
            <p>Status : <span className={`${post.status ? "text-green-500" : "text-red-500"}`}>{post.status ? "Open" : "Closed"}</span></p>
          </div>
          <div>
            <Link href={`/view/${post.id}`}><button className="bg-teal-400 py-1 px-5 text-white rounded-xl">View</button></Link>
            <button className="bg-teal-400 py-1 px-5 text-white rounded-xl ml-2">Join</button>
          </div>
        </div>
    </motion.div>
  );
}
