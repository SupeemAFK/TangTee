import IUser from './user'

export default interface IMessage {
    id: string
    text: string
    user: IUser
}