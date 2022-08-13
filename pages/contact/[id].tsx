import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import IParty from '../../interface/party'
import IMessage from '../../interface/message'
import IUser from '../../interface/user'
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext'
import { FiSend } from 'react-icons/fi'
import { v4 as uuidv4 } from 'uuid';
import { getUser } from '../../hooks/useGetUser'
import Iframe from 'react-iframe'
import Link from 'next/link'

export interface IContactProps {
}

export default function Contact (props: IContactProps) {
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [party, setParty] = useState<IParty | null>(null);
  const { currentUser } = useAuth()
  const router = useRouter();
  const { id } = router.query

  useEffect(() => {
    if (id) {
      onSnapshot(doc(db, "party", id as string), async snapshot => {
        const data = snapshot.data()
        if (data) {
          const messages: IMessage[] = await Promise.all(data?.messages.map(async (messageObj: any) => {
            const user = await getUser(messageObj.user_id)
            return {
              id: messageObj.id,
              text: messageObj.text,
              user
            }
          }))
          const participants: IUser[] = await Promise.all(data?.participants.map(async (userId: string) => await getUser(userId)))
          const author = await getUser(data?.author_id)
          setParty({
            id: snapshot.id,
            messages,
            participants,
            author,
            post_id: data?.post_id,
            isRead: data.isRead,
            timestamp: data.timestamp
          })
        }
        setLoading(false);
      })
    }
  }, [id])

  useEffect(() => {
    if (!loading && !party) {
      router.push('/404')
    }
  }, [loading])

  useEffect(() => {
    if (!loading) {
      if (currentUser) {
        if (party) {
          const participantsId = party.participants.map(participant => participant.id)
          !participantsId.includes(currentUser.id) && router.push('/404')
        }
      } 
      else {
        router.push('/404')
      }
    }
  }, [party, currentUser])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()

    if(id) {
      const messageObj = {
        id: uuidv4(),
        text: message,
        user_id: currentUser?.id,
      }
      const docRef = doc(db, "party", id as string)
      const snapshot = await getDoc(docRef)
      updateDoc(docRef, {
        messages: [...snapshot.data()?.messages, messageObj]
      })
    }
    setMessage("")
  }

  return (
    <div className="min-w-screen h-[calc(100vh-4rem)] mt-16">
      <div className="h-screen w-52 fixed left-0 bg-teal-500 text-white overflow-auto scrollbar p-2">
        {party?.participants?.map(user => (
          <div key={user.id} className="flex items-center p-2 border-[1px] border-[#e6e6e6] rounded mt-2">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img className="w-full object-cover" src={user.avatar} alt={user.name} />
            </div>
            <p className="flex-1 ml-1">{user.name}</p>
          </div>
        ))}
      </div>
      <div className="w-[calc(100%-13rem)] h-[calc(100%-11rem)] px-5 py-1 fixed right-0 top-0 mt-16 overflow-auto scrollbar">
          {party?.messages?.map(message => (
            <div key={message.id} className="mt-2">
              <div className='flex items-center'>
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img className="w-full object-cover" src={message.user.avatar} alt={message.user.name} />
                </div>
                <div className='flex flex-col items-start ml-2'>
                  <p className="text-xs ml-1">{message.user.name}</p>
                  {isValidURL(message.text) ? (
                    <div>
                      <Link href={message.text}>
                        <p className="bg-teal-400 p-2 rounded-xl text-white cursor-pointer underline">{message.text}</p> 
                      </Link>
                      <div className="relative overflow-hidden pt-[56.25%] ">
                        <Iframe url={convertToEmbedded(message.text)} className="absolute top-0 left-0 w-full h-full"></Iframe>
                      </div>
                    </div>
                  ) : (
                    <p className="bg-teal-400 p-2 rounded-xl text-white">{message.text}</p> 
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
      <form onSubmit={sendMessage} className="bg-teal-400 fixed bottom-0 right-0 w-[calc(100%-13rem)] h-28 p-5 flex items-center">
        <input onChange={e => setMessage(e.target.value)} value={message} placeholder='Exchange contact with your friends' type="text" name="title" className="p-1 w-full border-2 border-[#e6e6e6] rounded-sm focus:border-teal-400 outline-none transition-all duration-200" />
        <button type="submit"className="bg-white text-teal-400 rounded p-2 ml-3 flex items-center">Send <FiSend className='ml-1' /></button>
      </form>
    </div>
  );
}

function isValidURL(string: string) {
  var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
  return (res !== null)
};

function convertToEmbedded(url: string) {
  const domain = new URL(url)
  if (domain.hostname === "www.youtube.com") {
    return "//www.youtube.com/embed/" + getId(url)
  }
  if (domain.hostname === "www.facebook.com") {
    return url
  }
  return url;
}

function getId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return (match && match[2].length === 11)
    ? match[2]
    : null;
}