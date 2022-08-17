export interface star {
    id: number
    open: boolean
}

export interface starUser {
    user_id: string
    stars: number
}

export default interface IUser {
    id: string
    name: string
    avatar: string
    bio: string
    stars: starUser[]
    banner_hex: string
}