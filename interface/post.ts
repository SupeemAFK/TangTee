import IUser from "./user"

export default interface IPost {
    id: string
    title: string
    details: string
    img: string
    max_participants: number
    tags: string[]
    status: string
    user?: IUser
    participants: string[]
    createdAt: Date
}