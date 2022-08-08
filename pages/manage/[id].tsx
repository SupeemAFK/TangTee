import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import useGetPost from '../../hooks/useGetPost';
import Tag from '../../components/Tag'
import { useAuth } from '../../context/AuthContext'
import { motion } from 'framer-motion';
import { BiImageAdd } from 'react-icons/bi'
import { BsCheckCircle } from 'react-icons/bs'
import IImage from '../../interface/img';
import { doc, updateDoc, getDoc, DocumentData } from 'firebase/firestore';
import { FirebaseStorage, StorageReference, UploadResult, uploadBytes, getDownloadURL, ref, getStorage } from 'firebase/storage';
import { db } from '../../lib/firebase'
import IPost from '../../interface/post'
import { usePostsContext } from '../../context/PostContext'
import { toast } from 'react-toastify'
import IUser from '../../interface/user';

export interface IEditProps {
}

interface IEditPostForm {
    title: string
    details: string
    max_participants: number
    img: IImage
    tags: string
    isOpen: boolean
}

export default function Edit (props: IEditProps) {
    const [editPostForm, setEditPostForm] = useState<IEditPostForm>({ title: "", details: "", max_participants: 0, img: { url: "", file: {} as File }, tags: "", isOpen: false });
    const [checkUsers, setCheckUsers] = useState<string[]>([])
    const router = useRouter();
    const { id } = router.query;
    const { post, loading } = useGetPost(id as string);
    const { posts, setPosts } = usePostsContext();
    const { currentUser } = useAuth()

    useEffect(() => {
        post && setEditPostForm({
            title: post.title,
            details: post.details,
            max_participants: post.max_participants,
            img: { url: post.img, file: {} as File },
            tags: post.tags.join(" "),
            isOpen: post.isOpen
        })
    }, [post])

    /*useEffect(() => {
        if (!loading && !post) {
            router.push('/404')
        }
    }, [loading])*/

    /*useEffect(() => {
        if (currentUser) {
            if (currentUser?.id === post?.user?.id) {
                router.push('/404')
            }
        } else {
            router.push('/404')
        }
    }, [currentUser])*/

    async function editPost(): Promise<void> {
        let imgUrl = post?.img;
        if (editPostForm.img.url !== post?.img) {
            const storage: FirebaseStorage = getStorage();
            const storageRef: StorageReference = ref(storage, editPostForm.img.file.name);
            const snapshot: UploadResult = await uploadBytes(storageRef, editPostForm.img.file)
            imgUrl = await getDownloadURL(snapshot.ref) 
        }
        const docRef = doc(db, "posts", post?.id as string)
        await updateDoc(docRef, { ...editPostForm, img: imgUrl, tags: editPostForm.tags.split(" ") })
        getDoc(docRef)
            .then(async docSnap => {
                const data: DocumentData | undefined = docSnap.data();
                if (data) {
                    const id: string = docSnap.id;
                    const updatePosts = posts.map(post => post.id === id ? {
                        id: id,
                        title: data.title,
                        details: data.details,
                        img: data.img,
                        max_participants: data.max_participants,
                        tags: data.tags,
                        isOpen: data.isOpen,
                        user: post.user,
                        participants: post.participants,
                        createdAt: post.createdAt,
                    } as IPost : post);
                    setPosts(updatePosts);
                    toast.success("Post has been updated!", {
                        autoClose: 5000,
                        closeOnClick: true,
                        pauseOnHover: false,
                        style: { color: "#2dd4bf" },
                        progressStyle: { backgroundColor: '#2dd4bf'},
                        icon(props) {
                            return <BsCheckCircle />
                        },
                    })
                }
            })
    }

    function handleOnChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        const name = e.target.name;
        const value = e.target.value;
        setEditPostForm({ ...editPostForm, [name]: value })
    }

    function handleCheckboxChange(user: string) {
        if (checkUsers.includes(user)) {
            const filterUser = checkUsers.filter(checkUser => checkUser !== user)
            setCheckUsers(filterUser);
        } else {
            setCheckUsers([...checkUsers, user]);
        }
    }

    function handleChangeFile(e: React.ChangeEvent<HTMLInputElement>): void {
        const file: File | null | undefined = e.target.files?.item(0)
        file && setEditPostForm({ ...editPostForm, img: { file: file, url: URL.createObjectURL(file) } })  
    }
  
    if (loading || !post) {
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
        <>
            <motion.div 
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { y: -100, opacity: 0 },
                    visible: { y: 0, opacity: 1, },
                }}
                className="mt-16 flex flex-col lg:flex-row min-h-screen min-w-screen p-5"
            >
                <div className="p-2 flex flex-col items-center flex-[1.5]">
                    <h1 className="mb-5 text-3xl font-medium text-teal-400">Edit Post</h1>
                    <div className="w-full lg:w-1/2 relative mt-5">
                        <label className='absolute top-0 right-0 z-10 text-white text-3xl mr-2 flex justify-center items-center cursor-pointer'>
                            <BiImageAdd />
                            <input onChange={handleChangeFile} type="file" className="hidden" />
                        </label>
                        <img className='object-cover w-full brightness-75' src={editPostForm.img.url} alt={editPostForm.title} />
                    </div>
                    <div className="mt-5 w-full lg:w-1/2">
                        <div className="mt-3">
                            <label>Title</label>
                            <input onChange={handleOnChange} placeholder={editPostForm.title} value={editPostForm.title} type="text" name="title" className="p-1 w-full border-2 border-[#e6e6e6] rounded-sm focus:border-teal-400 outline-none transition-all duration-200" />
                        </div>
                        <div className="mt-3">
                            <label>Details</label>
                            <textarea onChange={handleOnChange}  placeholder={editPostForm.details} value={editPostForm.details} name="details" className="p-1 w-full min-h-fit border-2 border-[#e6e6e6] rounded-sm focus:border-teal-400 outline-none transition-all duration-200 scrollbar" />
                        </div>
                        <div className="mt-3">
                            <label>Tags</label>
                            <input placeholder='Add your tags' onChange={handleOnChange} value={editPostForm.tags} type="text" name="tags" className="p-1 w-full border-2 border-[#e6e6e6] rounded-sm focus:border-teal-400 outline-none transition-all duration-200" />
                            <div className="mt-2 flex w-full">
                                {editPostForm.tags.split(' ').map(tag => tag !== '' && (
                                    <Tag key={tag} tag={tag} />
                                ))}
                            </div>
                        </div>
                        <div className="mt-3">
                            <label>Max Participants</label>
                            <input type="number" name="max_participants" onChange={handleOnChange} min="1" max="12" defaultValue="1" className="w-10 ml-2 border-2 border-[#e6e6e6] rounded-sm focus:border-teal-400 outline-none transition-all duration-200" placeholder="Max" />
                        </div>
                        <div className="flex flex-col mt-3">
                            <label>Status</label>
                            <label className="inline-flex relative items-center mr-5 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={editPostForm.isOpen}
                                    readOnly
                                />
                                <div
                                    onClick={() => {
                                        setEditPostForm({ ...editPostForm, isOpen: !editPostForm.isOpen });
                                    }}
                                    className="w-11 h-6 bg-gray-200 rounded-full peer  peer-focus:ring-teal-400  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-400"
                                ></div>
                                <span className="ml-2 text-sm font-medium text-gray-900 flex items-center">
                                    {editPostForm.isOpen ? "Open" : "Closed"}
                                </span>
                            </label>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 mt-5 flex justify-end">
                        <button onClick={editPost} className="bg-teal-400 py-1 px-5 text-white rounded-xl">Save</button>
                    </div>
                </div>
                <div className="p-2 flex flex-col items-center flex-1">
                    <h1 className="mb-5 text-3xl font-medium text-teal-400">Manage User</h1>
                    <h1>{checkUsers.length}/{post.max_participants}</h1>
                    <div className="border-2 border-teal-400 rounded max-h-96 p-3 overflow-auto scrollbar">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                            <div key={num} className="flex items-center mt-5">
                                <div className="flex items-center">
                                    <div className="rounded-full overflow-hidden w-10 h-10">
                                        <img className="w-full object-cover" src="https://pbs.twimg.com/media/E9dBxilVoAIryXi.jpg" alt="test" />
                                    </div>
                                    <p className="ml-1">Alan Walker</p> 
                                </div>
                                <div className="ml-2 flex items-center">
                                    <input type="checkbox" onChange={() => handleCheckboxChange(String(num))} className="appearance-none w-5 h-5 rounded-md border-2 text-white focus:outline-none checked:bg-teal-400 checked:border-teal-400 transition-all duration-100" disabled={!checkUsers.includes(String(num)) && checkUsers.length >= post.max_participants} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </>
    );
}
