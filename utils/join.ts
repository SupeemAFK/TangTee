import { db } from "../lib/firebase"
import { collection, addDoc } from 'firebase/firestore'
import IPost from "../interface/post"
import IUser from '../interface/user'

export default async function join(post: IPost, currentUser: IUser): Promise<void> {
    await addDoc(collection(db, "join"), {
        isRead: false,
        post_id: post.id,
        from_user_id: currentUser?.id,
        to_user_id: post.user?.id
    })
}