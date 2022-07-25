import * as React from 'react';

export interface ITagProps {
    tag: string
}

export default function Tag ({ tag }: ITagProps) {
  return (
    <div className="bg-slate-400 mr-1 rounded-xl text-sm py-1 px-2 flex items-center justify-center text-white">
        <p>{tag}</p>
    </div>
  );
}
