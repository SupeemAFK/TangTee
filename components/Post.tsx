import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import IPost from '../interface/post';
import { BsThreeDots } from 'react-icons/bs';
import { MdOutlineDelete } from 'react-icons/md'
import { AiOutlineEdit } from 'react-icons/ai'
import { GiPartyPopper } from 'react-icons/gi'
import { db } from '../lib/firebase';
import { deleteDoc, doc, query, collection, where, getDocs, onSnapshot } from "firebase/firestore"; 
import { useAuth } from '../context/AuthContext'
import { usePostsContext } from '../context/PostContext'
import Tag from './Tag'
import { join, cancelJoin } from '../utils/join'
import Modal from '../components/Modal'

export interface IPostProps {
    post: IPost
}

export interface isAlreadyJoined {
  alreadyJoined: boolean
  join_id: string
}

export default function Post ({ post }: IPostProps) {
  const [partyId, setPartyId] = useState<string | null>(null);
  const [isAlreadyJoined, setIsAlreadyJoined] = useState<isAlreadyJoined>({ alreadyJoined: false, join_id: "" });
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>("");
  const { currentUser } = useAuth();
  const { setPosts, posts } = usePostsContext();

  async function handleJoin() {
    if (currentUser) {
      const newJoinID = await join(post, currentUser)
      newJoinID !== "" && setIsAlreadyJoined({ alreadyJoined: true, join_id: newJoinID }) 
    }
  }

  function handleCancel() {
    if (post && currentUser) {
      cancelJoin(post, currentUser, isAlreadyJoined.join_id)
      setIsAlreadyJoined({ alreadyJoined: false, join_id: ""})
    }
  }

  function deletePost(): void {
    deleteDoc(doc(db, "posts", post.id));
    const deletePosts = posts.filter(p => p.id !== post.id)
    setPosts(deletePosts);
  }

  function openModalType(type: string) {
    setOpenModal(true)
    setOpenMenu(false)
    setModalType(type)
  }

  useEffect(() => {
    if (post && currentUser) {
      const q = query(collection(db, "join"), where("post_id", "==", post.id), where("from_user_id", "==", currentUser?.id));
      getDocs(q).then(snap => snap.docs.length > 0 && snap.docs.forEach(doc => setIsAlreadyJoined({ alreadyJoined: true, join_id: doc.id })))
    }
  }, [post, currentUser])

  useEffect(() => {
    if (post && post.status === "Completed") {
      const q = query(collection(db, "party"), where("post_id", "==", post.id))
      getDocs(q)
       .then(snapshot => snapshot.docs.map(doc => setPartyId(doc.id)))
    }
  }, [post])

  return (
    <motion.div 
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
      }}
      className="rounded-md border-[1px] border-[#e6e6e6] w-72 md:w-96 lg:w-96 mt-5"
    >
      {openModal && (
        <Modal setOpenModal={setOpenModal} >
          <div className="p-5 flex flex-col items-center">
              <h1>Are you sure you want to <span className='font-semibold'>{modalType === "delete" ? "Delete" : isAlreadyJoined.alreadyJoined ? "Cancel" : "Join" }</span>?</h1>
              <div className="mt-2">
                  <button onClick={() => setOpenModal(false)} className="rounded bg-red-400 text-white py-1 px-2">No</button>
                  <button 
                      onClick={() => {
                          if (modalType === "join") {
                            isAlreadyJoined.alreadyJoined ? handleCancel() : handleJoin()
                          }
                          else if (modalType === "delete") {
                            deletePost()
                          }
                          setOpenModal(false)
                      }} 
                      className="rounded bg-teal-400 text-white py-1 px-2 ml-2"
                  >
                      Yes
                  </button>    
              </div>
          </div>
        </Modal>
      )}
      <div className="p-3 flex items-center justify-between font-medium">
        <div className="flex item-center">
          <Link href={`/user/${post.user?.id}`}>
            <div className="w-10 h-10 rounded-full overflow-hidden cursor-pointer">
              <img className="object-cover w-full" src={post?.user?.avatar} alt={post?.user?.name} />
            </div>
          </Link>
          <p className="ml-2 flex items-center">{post?.user?.name.slice(0, 5)}...</p> 
        </div>
        <div className="relative">
          <div className="flex">
            <p className='mr-1 text-sm'>{post?.participants ? post.participants.length : "Error"}/{post?.max_participants}</p>
            {currentUser?.id === post.user?.id && <button onClick={() => setOpenMenu(true)}><BsThreeDots /></button>}
          </div>
          {openMenu && (
            <>
              <motion.div 
                initial={{ y: -20, opacity: 0, }}
                animate={{ y: 0, opacity: 1 }}
                className="border-[1px] border-[#e6e6e6] bg-white rounded-md p-2 absolute right-0 z-50"
              >
                {post.status === "Completed" && (
                  <>
                  <Link href={`/contact/${partyId}`}>
                    <button className="text-yellow-400 flex items-center font-normal">Party <GiPartyPopper className="ml-1" /></button>
                  </Link>
                  <div className="p-[0.02rem] bg-[#e6e6e6] my-1"></div>
                  </>
                )}
                <Link href={`/manage/${post.id}`}>
                  <button className="text-teal-400 flex items-center font-normal">Manage <AiOutlineEdit className="ml-1" /></button>
                </Link>
                <div className="p-[0.02rem] bg-[#e6e6e6] my-1"></div>
                <button onClick={() => openModalType("delete")} className="text-red-400 flex items-center font-normal">Delete <MdOutlineDelete className="ml-1" /></button>
              </motion.div> 
              <div onClick={() => setOpenMenu(false)} className="w-full h-screen fixed top-0 left-0 z-40"></div> 
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
              <Tag key={tag} tag={tag} />
            ))}
          </div>
        )}
      </div>

        <div className='flex justify-between items-center p-3 text-xs lg:text-base'>
          <div>
            <p>Status : <span className={`${post.status === "Open" ? "text-green-500" : post.status === "Closed" ? "text-red-500" : "text-yellow-500"}`}>{post.status.charAt(0).toUpperCase() + post.status.slice(1)}</span></p>
          </div>
          <div>
            <Link href={`/view/${post.id}`}><button className="bg-teal-400 py-1 px-5 text-white rounded-xl">View</button></Link>
            {(currentUser && post.user?.id !== currentUser?.id && post.status === "Open") && (
              <>
              {isAlreadyJoined.alreadyJoined ? (
                <button onClick={() => openModalType("join")} className="bg-red-400 py-1 px-3 text-white rounded-xl ml-2">Cancel</button>
              ) : (
                <button onClick={() => openModalType("join")} className="bg-teal-400 py-1 px-5 text-white rounded-xl ml-2">Join</button>
              )}
              </>
            )}
          </div>
        </div>
    </motion.div>
  );
}
