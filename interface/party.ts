import IUser from './user'
import IMessage from './message';

export default interface IParty {
    id: string;
    messages: IMessage[];
    participants: IUser[];
    post_id: string;
}