import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import IParty from '../../interface/party'
import IMessage from '../../interface/message'
import IUser from '../../interface/user'
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext'
import { FiSend } from 'react-icons/fi'
import { MdNavigateNext, MdNavigateBefore } from 'react-icons/md'
import { v4 as uuidv4 } from 'uuid';
import { getUser } from '../../hooks/useGetUser'
import Iframe from 'react-iframe'
import Link from 'next/link'
import LinkPreview from '../../components/LinkPreview'

export interface IContactProps {
}

export default function Contact (props: IContactProps) {
  const [openParticipants, setOpenParticipants] = useState<boolean>();
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [party, setParty] = useState<IParty | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
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
    scrollToBottom()
  }, [party?.messages])

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

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-w-screen h-[calc(100vh-4rem)] mt-16">
      <button onClick={() => setOpenParticipants(true)} className="md:hidden block p-2 bg-teal-400 text-white fixed top-16 left-1 rounded-full z-20"><MdNavigateNext /></button> 
      <div className={`${openParticipants ? "left-0" : "left-[-100%]"} md:left-0 z-30 h-screen w-52 relative md:fixed left-0 bg-teal-500 text-white overflow-auto scrollbar p-2 transition-all duration-300`}>
        <button onClick={() => setOpenParticipants(false)} className="md:hidden block p-2 bg-teal-400 text-white absolute top-0 right-0 rounded-full z-20"><MdNavigateBefore/></button> 
        {party?.participants?.map(user => (
          <div key={user.id} className="flex items-center p-2 border-[1px] border-[#e6e6e6] rounded mt-2">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img className="w-full object-cover" src={user.avatar} alt={user.name} />
            </div>
            <p className="flex-1 ml-1">{user.name}</p>
          </div>
        ))}
      </div>
      <div className="w-full md:w-[calc(100%-13rem)] h-[calc(100%-7.5rem)] px-5 py-3 fixed right-0 top-0 mt-16 overflow-auto scrollbar">
          {party?.messages?.map(message => (
            <div key={message.id} className="mt-4">
              <div className='flex w-full'>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden">
                  <img className="w-full object-cover" src={message.user.avatar} alt={message.user.name} />
                </div>
                <div className='ml-2 text-xs md:text-base flex flex-col items-start flex-1 max-w-xs md:max-w-md'>
                  <p className="text-xs ml-1">{message.user.name}</p>
                  {isValidURL(message.text) ? (
                    <>
                    <Link href={message.text}>
                      <p className="bg-teal-400 p-2 cursor-pointer underline rounded-xl text-white break-all max-w-xs md:max-w-md">{message.text}</p>
                    </Link>
                    <LinkPreview url={message.text} />
                    </>
                  ) : (
                    <p className="bg-teal-400 p-2 rounded-xl text-white break-words max-w-xs md:max-w-md">{message.text}</p> 
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="bg-teal-400 fixed bottom-0 right-0 w-full md:w-[calc(100%-13rem)] h-14 p-5 flex items-center">
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