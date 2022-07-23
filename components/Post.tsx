import * as React from 'react';
import IPost from '../interface/post'

export interface IPostProps {
    post: IPost
}

export default function Post ({ post }: IPostProps) {
  return (
    <div className="rounded-md border-[1px] border-[#e6e6e6] w-72 md:w-96 lg:w-96 mt-5">
      <div className="p-3 flex items-center justify-between font-medium">
        <div className="flex item-center">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img className="object-cover w-full" src={post.user.avatar} alt={post.user.name} />
          </div>
          <p className="ml-2 flex items-center">{post.user.name.slice(0, 5)}...</p> 
        </div>
        <div>
          <p>Status : <span className={`${post.status ? "text-green-500" : "text-red-500"}`}>{post.status ? "Open" : "Closed"}</span></p>
        </div>
      </div>

      {post?.img !== '' && (
        <div className='w-full overflow-hidden'>
          <img className='object-cover w-full' src={post.img} alt={post.text} />
        </div>
      )}

      <div className='flex justify-center my-5 text-xl p-3'>
        <p className='text-center'>{post.text}</p>
      </div>

      <div className='flex justify-end p-3'>
        <button className="bg-teal-400 py-1 px-5 text-white rounded-xl">View</button>
        <button className="bg-teal-400 py-1 px-5 text-white rounded-xl ml-2">Join</button>
      </div>
    </div>
  );
}
