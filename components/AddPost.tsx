import React, { useState } from 'react';
import Link from 'next/link';
import IImage from '../interface/img'
import IPost from '../interface/post'
import getUser from '../utils/getUser';
import { BiImageAdd } from 'react-icons/bi';
import { BsEmojiSmile } from 'react-icons/bs'
import dynamic from 'next/dynamic';
const Picker = dynamic(() => import('emoji-picker-react'), { ssr: false });
import { useAuth } from '../context/AuthContext';
import { usePostsContext } from '../context/PostContext'
import { db } from '../lib/firebase';
import { collection, addDoc, getDoc, DocumentData, DocumentSnapshot, doc } from "firebase/firestore"; 
import { getStorage, ref, uploadBytes, getDownloadURL, FirebaseStorage, StorageReference, UploadResult } from "firebase/storage";
import Tag from './Tag';

export interface IAddPostProps {
}

interface IPostForm {
  [key: string]: string | IImage | number
  title: string
  details: string
  tags: string
  img: IImage
  max_participants: number
}

export default function AddPost (props: IAddPostProps) {
  const { currentUser } = useAuth();
  const { setPosts, posts } = usePostsContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [focusInputName, setFocusInputName] = useState<string>("title");
  const [postForm, setPostForm] = useState<IPostForm>({ title: "", img: { url: "", file: {} as File }, tags: "", details: "", max_participants: 1 });
  const [openEmojiPicker, setOpenEmojiPicker] = useState<Boolean>(false);

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
    const name: string = e.target.name
    const value: string = e.target.value
    setPostForm({ ...postForm, [name]: value })
  }

  function handleChangeFile(e: React.ChangeEvent<HTMLInputElement>): void {
    const file: File | null | undefined = e.target.files?.item(0)
    file && setPostForm({ ...postForm, img: { file: file, url: URL.createObjectURL(file) } })
  }

  async function AddPost(): Promise<void> {
    if (postForm.title !== '' && postForm.details !== '' && postForm.tags) {
      setLoading(true);
      let imgUrl: string = "";
      const storage: FirebaseStorage = getStorage();
      const storageRef: StorageReference = ref(storage, postForm.img.file.name);
  
      if (postForm.img.url !== "") {
        const snapshot: UploadResult = await uploadBytes(storageRef, postForm.img.file)
        imgUrl = await getDownloadURL(snapshot.ref) 
      }
  
      const docRef = await addDoc(collection(db, "posts"), {
        title: postForm.title,
        details: postForm.details,
        img: imgUrl,
        max_participants: postForm.max_participants,
        tags: postForm.tags !== "" ? postForm.tags.split(' ') : [],
        isOpen: true,
        user_id: currentUser?.id,
        participants: [],
        createdAt: Date.now() 
      });
      getDoc(docRef)
            .then(async docSnap => {
                const data: DocumentData | undefined = docSnap.data();
                if (data) {
                    const id: string = docSnap.id;
                    const user = await getUser(data?.user_id);
                    const newPost: IPost = {
                      id,
                      title: data?.title,
                      details: data?.details,
                      img: data?.img,
                      user,
                      max_participants: data?.max_participants,
                      tags: data?.tags,
                      isOpen: data?.isOpen,
                      participants: data?.participants,
                      createdAt: new Date(data?.createdAt * 1000)
                    }
                    setPosts([newPost, ...posts]);
                    setPostForm({ title: "", img: { url: "", file: {} as File }, tags: "", details: "", max_participants: 1 })
                    setLoading(false);
                }
            })
    }
  }

  return (
    <div className="p-3 rounded-md border-[1px] border-[#e6e6e6] w-72 md:w-96 lg:w-96">
      {currentUser ? (
        <>
          {loading && (
            <div className="flex justify-center">
              <svg aria-hidden="true" className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-teal-400" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
            </div>
          )}
          <input placeholder='Your title to Tang Tee' onFocus={() => setFocusInputName("title")} onChange={handleOnChange} value={postForm.title} type="text" name="title" className="p-1 w-full border-2 border-[#e6e6e6] rounded-sm focus:border-teal-400 outline-none transition-all duration-200" />
          <div className="p-[0.02rem] bg-teal-400 my-2 rounded-lg"></div>
          <textarea  placeholder='Write some details about your activities' onFocus={() => setFocusInputName("details")}  onChange={handleOnChange} value={postForm.details} name="details" className="p-1 w-full border-2 border-[#e6e6e6] rounded-sm focus:border-teal-400 outline-none transition-all duration-200" />
          <div className="flex">
            <input placeholder='Add your tags' onFocus={() => setFocusInputName("tags")}  onChange={handleOnChange} value={postForm.tags} type="text" name="tags" className="p-1 w-full border-2 border-[#e6e6e6] rounded-sm focus:border-teal-400 outline-none transition-all duration-200" />
            <input type="number" name="max_participants" onChange={handleOnChange} min="1" max="12" defaultValue="1" className="w-10 border-2 border-[#e6e6e6] rounded-sm focus:border-teal-400 outline-none transition-all duration-200" placeholder="Max" />
          </div>
          
          {postForm.tags !== "" && (
            <div className="mt-2 w-full flex overflow-auto">
              {postForm.tags.split(' ').map(tag => tag !== '' && (
                <Tag key={tag} tag={tag} />
              ))}
            </div>
          )}

          <div className="flex items-center justify-end mt-5">
            <button onClick={() => setOpenEmojiPicker(!openEmojiPicker)} className='text-teal-400 text-2xl mr-2 flex justify-center items-center'><BsEmojiSmile /></button>
            <label className='text-teal-400 text-3xl mr-2 flex justify-center items-center cursor-pointer'>
              <BiImageAdd />
              <input onChange={handleChangeFile} type="file" className="hidden" />
            </label>
            <button onClick={() => AddPost()} className="bg-teal-400 py-1 px-5 text-white rounded-xl">Post</button>
          </div>
          {openEmojiPicker && (
            <div className="flex justify-center">
              <Picker onEmojiClick={(e, emoji) => setPostForm({ ...postForm, [focusInputName]: postForm[focusInputName] + emoji.emoji })} />
            </div>
          )}
          {postForm.img.url !== "" && (
            <div className="relative">
              <button onClick={() => setPostForm({ ...postForm, img: { url: "", file: {} as File }})} className="absolute top-1 right-5 text-white bg-teal-400 opacity-70 flex justify-center items-center w-7 h-7 p-2 rounded-full transition-all duration-300 hover:opacity-100">X</button>
              <div className="flex justify-center mt-2 max-h-96 overflow-y-auto scrollbar">
                <div>
                  <img className="w-full object-cover" src={postForm.img.url} alt="input file" />
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex justify-center">
          <Link href="/auth">
            <button className="border-2 border-teal-400 py-1 px-5 text-teal-400 rounded-md w-full"><span className="font-semibold">Sign in</span> to tang tee with your friends</button>          
          </Link>
        </div>
      )}
    </div>
  );
}
