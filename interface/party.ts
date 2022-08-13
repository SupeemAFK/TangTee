import IUser from './user'
import IMessage from './message';
import { Timestamp } from 'firebase/firestore'

export default interface IParty {
    id: string;
    messages: IMessage[];
    participants: IUser[];
    author: IUser;
    post_id: string;
    isRead: boolean;
    timestamp: Timestamp
}