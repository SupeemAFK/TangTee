import * as React from 'react';
import Link from 'next/link'

export interface ICustom404Props {
}

export default function Custom404 (props: ICustom404Props) {
  return (
    <div className="mt-16 p-5 flex flex-col items-center text-teal-400">
        <div className="mt-5 w-fullflex justify-center">
            <h1 className="text-3xl font-medium">Not found</h1>
        </div>
        <div className="mt-5">
            <Link href="/">
                <button className="bg-teal-400 py-1 px-5 text-white rounded-xl ml-2">Go back</button>
            </Link>
        </div>
    </div>
  );
}
