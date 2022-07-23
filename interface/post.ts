import IUser from "./user"

export default interface IPost {
    id: string
    text: string
    img: string
    max_participants: number
    tags: string[]
    status: boolean
    user: IUser
    requests: string[]
    accepts: string[]
}