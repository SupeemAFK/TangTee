import React, { useEffect, useState } from 'react';
import useGetUser from '../../hooks/useGetUser';
import { useAuth } from '../../context/AuthContext'
import { motion } from 'framer-motion';
import { BsCheckCircle, BsFillStarFill } from 'react-icons/bs'
import { VscSymbolColor } from 'react-icons/vsc'
import { useRouter } from 'next/router';
import { ChromePicker } from "react-color";
import { toast } from 'react-toastify'
import Modal from '../../components/Modal'
import IPost from '../../interface/post'
import IImage from '../../interface/img'
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase'
import Post from '../../components/Post'
import { BiImageAdd } from 'react-icons/bi';
import { FirebaseStorage, getStorage, StorageReference, ref, UploadResult, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface IProfileProps {
}

interface IEditProfileForm {
    name: string
    avatar: IImage
    banner_hex: string
    bio: string
}

export default function Profile (props: IProfileProps) {
    const [userPosts, setUserPosts] = useState<IPost[]>([]);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openColorPicker, setOpenColorPicker] = useState<boolean>(false);
    const [editProfileForm, setEditProfileForm] = useState<IEditProfileForm>({ name: "", bio: "", avatar: { url: "", file: {} as File }, banner_hex: "#0d9488" });
    const { currentUser } = useAuth();
    const router = useRouter();
    const { id } = router.query
    const { user, loading } = useGetUser(id as string);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/404')
        }
    }, [loading])

    useEffect(() => {
        user && setEditProfileForm({ name: user.name, bio: user.bio, avatar: { url: user.avatar, file: {} as File }, banner_hex: user.banner_hex })
    }, [user])

    useEffect(() => {
        if (user) {
            onSnapshot(query(collection(db, "posts"), where("user_id", "==", user.id), orderBy("createdAt", "desc")), (snapshot => {
                const posts: IPost[] = snapshot.docs.map(doc => {
                    const data = doc.data()
                    return {
                        id: doc.id,
                        title: data?.title,
                        details: data?.details,
                        img: data?.img,
                        user,
                        max_participants: data?.max_participants,
                        tags: data?.tags,
                        status: data?.status,
                        participants: data?.participants,
                        createdAt: new Date(data?.createdAt * 1000)
                    }
                })
                currentUser?.id === user.id ? setUserPosts(posts) : setUserPosts(posts.filter(post => post.status === "Open"))
            }))
        }
    }, [user])

    function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
        setEditProfileForm({ ...editProfileForm, [e.target.name]: e.target.value })
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file: File | null | undefined = e.target.files?.item(0)
        file && setEditProfileForm({ ...editProfileForm, avatar: { file: file, url: URL.createObjectURL(file) } })
    }

    async function updateProfile() {
        let imgUrl = editProfileForm.avatar.url;

        const storage: FirebaseStorage = getStorage();
        const storageRef: StorageReference = ref(storage, editProfileForm.avatar.file.name);

        if (editProfileForm.avatar.url !== user?.avatar) {
            const snapshot: UploadResult = await uploadBytes(storageRef, editProfileForm.avatar.file)
            imgUrl = await getDownloadURL(snapshot.ref) 
        }

       currentUser && updateDoc(doc(db, "users", currentUser.id), {
            name: editProfileForm.name,
            avatar: imgUrl,
            banner_hex: editProfileForm.banner_hex,
            bio: editProfileForm.bio,
        })
        .then(() => toast.success("Profile has been updated!", {
            autoClose: 5000,
            closeOnClick: true,
            pauseOnHover: false,
            style: { color: "#2dd4bf" },
            progressStyle: { backgroundColor: '#2dd4bf'},
            icon(props) {
                return <BsCheckCircle />
            },
        }))
    }

    if (loading || !user) {
        return (
            <div className="mt-16 p-5 flex flex-col items-center text-teal-400">
                <div className="flex justify-center">
                    <svg aria-hidden="true" className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-teal-400" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                </div>
            </div>
        )
    }

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { y: -100, opacity: 0 },
                visible: { y: 0, opacity: 1, },
            }}
            className="min-w-screen min-h-screen mt-16 flex justify-center"
        >
            {openModal && (
                <Modal setOpenModal={setOpenModal}>
                    {openColorPicker && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute z-10"
                        >
                           <ChromePicker
                                color={editProfileForm.banner_hex}
                                onChange={color => setEditProfileForm({ ...editProfileForm, banner_hex: color.hex })}
                            /> 
                        </motion.div>
                    )}
                    <div className="flex flex-col items-center">
                        <div className='bg-slate-300 w-full flex justify-start items-center rounded-t-md p-1'>
                            <button onClick={() => setOpenModal(false)} className='rounded-full bg-slate-500 opacity-50 w-5 h-5 flex justify-center items-center p-1 text-white'>x</button> 
                        </div>
                        <div className="relative w-full h-44 flex flex-col justify-end" style={{ backgroundColor: editProfileForm.banner_hex }}>
                            <button onClick={() => setOpenColorPicker(!openColorPicker)} className="absolute top-2 right-3 text-white"><VscSymbolColor /></button>
                            <div className="w-full flex justify-start relative mb-12">
                                <div className="ml-5 w-20 h-20 rounded-full overflow-hidden absolute top-0 border-4 border-white">
                                    <label className='absolute top-1 right-1 z-10 text-white text-xl mr-2 flex justify-center items-center cursor-pointer'>
                                        <BiImageAdd />
                                        <input onChange={handleFileChange} type="file" className="hidden" />
                                    </label>
                                    <img className="w-full object-cover brightness-75" src={editProfileForm.avatar.url} alt="profile" />
                                </div>
                            </div>
                        </div>
                        <div className="w-full p-2 mt-7">
                            <input onChange={handleOnChange} placeholder="name" name="name" value={editProfileForm.name} className="p-1 mt-2 w-full border-2 border-[#e6e6e6] rounded-sm focus:border-teal-400 outline-none transition-all duration-200" />
                            <input onChange={handleOnChange} placeholder="bio" name="bio" value={editProfileForm.bio} className="p-1 mt-2 w-full border-2 border-[#e6e6e6] rounded-sm focus:border-teal-400 outline-none transition-all duration-200" />
                        </div>
                        <div className="flex justify-end w-full mb-2 p-2">
                            <button onClick={updateProfile} className="bg-teal-400 py-1 px-5 text-white rounded-xl">Done</button>
                        </div>
                    </div>
                </Modal>
            )}
            <div className="w-full lg:w-1/2 flex flex-col items-center">
                <div className="w-full h-44 flex flex-col justify-end" style={{ backgroundColor: user.banner_hex }}>
                    <div className="w-full flex justify-start relative mb-12">
                        <div className="ml-5 w-28 h-28 rounded-full overflow-hidden absolute top-0 border-4 border-white">
                            <img className="w-full object-cover" src={user.avatar} alt="profile" />
                        </div>
                    </div>
                </div>
                <div className="border-[1px] border-[#e6e6e6] w-full">
                        <div className={`${currentUser?.id === user.id ? "mt-5" : "mt-12"} mr-5 flex justify-end`}>
                            {user.id === currentUser?.id && <button onClick={() => setOpenModal(true)} className="bg-teal-400 py-1 px-5 text-white rounded-xl">Edit</button>}
                        </div>
                    <div className="my-7 ml-5">
                        <p className="font-bold text-lg">{user.name}</p>
                        <p>{user.bio}</p>
                        <div className="flex mt-3">
                            {Array.from(Array(user.stars).keys()).map(star => <BsFillStarFill key={star} />)}
                        </div>
                    </div>
                </div>
                <div className='my-5'>
                    {userPosts.map(post => <Post key={post.id} post={post} />)}
                </div>
            </div>
        </motion.div>
    );
}
