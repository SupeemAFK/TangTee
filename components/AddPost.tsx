import React, { useState } from 'react';
import Link from 'next/link';
import IImage from '../interface/img'
import { BiImageAdd } from 'react-icons/bi';
import { BsEmojiSmile } from 'react-icons/bs'
import dynamic from 'next/dynamic';
const Picker = dynamic(() => import('emoji-picker-react'), { ssr: false });
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc } from "firebase/firestore"; 
import { getStorage, ref, uploadBytes, getDownloadURL  } from "firebase/storage";

export interface IAddPostProps {
}

interface IPostForm {
  text: string
  img: IImage
}

export default function AddPost (props: IAddPostProps) {
  const { currentUser } = useAuth();
  const [postForm, setPostForm] = useState<IPostForm>({ text: "", img: { url: "", file: {} as File } });
  const [openEmojiPicker, setOpenEmojiPicker] = useState<Boolean>(false);

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const type: string = e.target.type

    if (type === "text") {
      const value: string = e.target.value
      setPostForm({ ...postForm, text: value })
    }
    if (type === "file") {
      const file: File | null | undefined = e.target.files?.item(0)
      file && setPostForm({ ...postForm, img: { file: file, url: URL.createObjectURL(file) } })
    }
  }

  async function AddPost(): Promise<void> {
    if (postForm.text !== '' || postForm.img.url !== '') {
      let imgUrl: string = "";
      const storage = getStorage();
      const storageRef = ref(storage, postForm.img.file.name);
  
      if (postForm.img.url !== "") {
        const snapshot = await uploadBytes(storageRef, postForm.img.file)
        imgUrl = await getDownloadURL(snapshot.ref) 
      }
  
      await addDoc(collection(db, "posts"), {
        text: postForm.text,
        img: imgUrl,
        max_participants: 0,
        tags: [],
        status: true,
        user_id: currentUser?.id,
        requests: [],
        accepts: []
      });
      setPostForm({ text: "", img: { url: "", file: {} as File } })
    }
  }

  return (
    <div className="p-3 rounded-md border-[1px] border-[#e6e6e6] w-72 md:w-96 lg:w-96">
      {currentUser ? (
        <>
          <input placeholder='Going out with friends...' onChange={handleOnChange} value={postForm.text} type="text" className="p-1 w-full border-2 border-[#e6e6e6] rounded-sm focus:border-teal-400 outline-none transition-all duration-200" />
          <div className="flex items-center justify-end mt-5">
            <button onClick={() => setOpenEmojiPicker(!openEmojiPicker)} className='text-teal-400 text-2xl mr-2 flex justify-center items-center'><BsEmojiSmile /></button>
            <label className='text-teal-400 text-3xl mr-2 flex justify-center items-center cursor-pointer'>
              <BiImageAdd />
              <input onChange={handleOnChange} type="file" className="hidden" />
            </label>
            <button onClick={() => AddPost()} className="bg-teal-400 py-1 px-5 text-white rounded-xl">Add Post</button>
          </div>
          {openEmojiPicker && (
            <div className="flex justify-center">
              <Picker onEmojiClick={(e, emoji) => setPostForm({ ...postForm, text: postForm.text + emoji.emoji })} />
            </div>
          )}
          {postForm.img.url !== "" && (
            <div className="flex justify-center mt-2 max-h-96 overflow-y-auto">
              <div>
                <img className="w-full object-cover" src={postForm.img.url} alt="input file" />
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
