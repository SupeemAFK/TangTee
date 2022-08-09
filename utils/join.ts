import { db } from "../lib/firebase"
import { collection, addDoc, deleteDoc, doc, getDoc } from 'firebase/firestore'
import IPost from "../interface/post"
import IUser from '../interface/user'

export async function join(post: IPost, currentUser: IUser): Promise<string> {
    const postSnap = await getDoc(doc(db, "posts", post.id))
    const postData = postSnap.data()
    if (postData?.isOpen) {
        const newDoc = await addDoc(collection(db, "join"), {
            isRead: false,
            post_id: post.id,
            from_user_id: currentUser?.id,
            to_user_id: post.user?.id
        })
        return newDoc.id
    }
    return ""
}

export async function cancelJoin(join_id: string): Promise<void> {
    await deleteDoc(doc(db, "join", join_id))
}