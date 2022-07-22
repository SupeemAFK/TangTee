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
            <img className="object-cover w-full" src="https://pbs.twimg.com/media/E9dBy5qVcAco5-f.jpg" alt="" />
          </div>
          <p className="ml-2 flex items-center">Mina-Chan</p> 
        </div>
        <div>
          <p>Status : <span className="text-green-500">Open</span></p>
        </div>
      </div>

      <div className='w-full rounded-t-md overflow-hidden'>
        <img className='object-cover w-full' src="https://www.ryoiireview.com/upload/article/202011/1604489333_9174c8d8872b1b3f956c16eaa75d07b9.jpg" alt="" />
      </div>

      <div className='flex justify-center my-5 text-xl p-3'>
        <p className='text-center'>หิวครับ ตั้งตี้แดกหมูกระทะ</p>
      </div>

      <div className='flex justify-end p-3'>
        <button className="bg-teal-400 py-1 px-5 text-white rounded-xl">View</button>
        <button className="bg-teal-400 py-1 px-5 text-white rounded-xl ml-2">Join</button>
      </div>
    </div>
  );
}