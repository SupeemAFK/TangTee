import * as React from 'react';
import { motion } from 'framer-motion';

export interface IModalProps {
  children: React.ReactNode
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Modal ({ children, setOpenModal }: IModalProps) {
  return (
    <>
    <div className="fixed left-0 right-0 text-center z-50">
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className='bg-white rounded-md border-[1px] border-[#e6e6e6] inline-block'
      >
        {children}
      </motion.div>  
    </div>
    <div onClick={() => setOpenModal(false)} className="w-full h-screen fixed top-0 left-0 z-40"></div> 
    </>
  );
}
