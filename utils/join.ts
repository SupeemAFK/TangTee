import { db } from "../lib/firebase"
import { collection, addDoc, deleteDoc, updateDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore'
import IPost from "../interface/post"
import IUser from '../interface/user'

export async function join(post: IPost, currentUser: IUser): Promise<string> {
    const postSnap = await getDoc(doc(db, "posts", post.id))
    const postData = postSnap.data()
    if (postData?.status === "Open") {
        const newDoc = await addDoc(collection(db, "join"), {
            isRead: false,
            post_id: post.id,
            from_user_id: currentUser?.id,
            to_user_id: post.user?.id,
            timestamp: serverTimestamp()
        })
        return newDoc.id
    }
    return ""
}

export async function cancelJoin(post: IPost, currentUser: IUser, join_id: string): Promise<void> {
    if (post.status === "Open") {
        await deleteDoc(doc(db, "join", join_id))
        const snapshot = await getDoc(doc(db, "posts", post.id));
        const filterParticipants: string[] = snapshot.data()?.participants.filter((participantId: string) => participantId !== currentUser.id)
        await updateDoc(doc(db, "posts", post.id), {
            participants: filterParticipants
        })
    }
}