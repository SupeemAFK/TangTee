import IUser from "./user"
import IPost from './post'
import { Timestamp } from 'firebase/firestore'

export default interface IJoin {
    id: string
    isRead: boolean
    from_user: IUser
    post: IPost
    timestamp: Timestamp
}