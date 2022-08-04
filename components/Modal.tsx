import * as React from 'react';
import { motion } from 'framer-motion';

export interface IModalProps {
  children: React.ReactNode
}

export default function Modal ({ children }: IModalProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className='w-screen min-h-screen fixed flex justify-center items-center'
    >
      <div className='bg-white rounded-md border-[1px] border-[#e6e6e6]'>
        {children}
      </div>  
    </motion.div>
  );
}
