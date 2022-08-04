import IUser from "./user"
import IPost from './post'

export default interface IJoin {
    id: string
    isRead: boolean
    from_user: IUser
    post: IPost
}