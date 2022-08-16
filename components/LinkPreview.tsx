import React, { useEffect, useState } from 'react';
import Iframe from 'react-iframe'

export interface ILinkPreviewProps {
    url: string;
}

export default function LinkPreview ({ url }: ILinkPreviewProps) {
    const [loading, setLoading] = useState<boolean>(true);
    const [linksData, setLinksData] = useState<any>(null);

    useEffect(() => {
        fetch(`/api/opengraph?url=${url}`)
            .then(res => res.json())
            .then(result => {
                setLinksData(result.results)
                setLoading(false)
            })
    }, [])

    if (loading) {
        return (
            <div role="status" className="space-y-8 animate-pulse md:space-y-0 max-w-xs max-h-xs md:space-x-8 md:flex md:items-center">
                <div className="w-full">
                    <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5"></div>
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[440px] mb-2.5"></div>
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[460px] mb-2.5"></div>
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                </div>
                <div className="flex justify-center items-center w-full h-48 bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
                    <svg className="w-12 h-12 text-gray-200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512"><path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z"/></svg>
                </div>
                <span className="sr-only">Loading...</span>
            </div>
        )
    }

    if (linksData?.ogType === "video.other" && linksData?.ogSiteName === "YouTube") {
        return (
            <div className="relative overflow-hidden pt-[56.25%] w-full">
                <Iframe url={linksData?.ogVideo.url} className="absolute top-0 left-0 w-full h-full"></Iframe>
            </div>
        )
    }

    return (
        <div className="bg-teal-600 p-3 md:p-5 rounded-md text-white flex">
            <div className="flex-1">
                <h1 className="font-semibold">{linksData?.ogTitle?.length > 20 ? linksData?.ogTitle?.substring(0, 10)+"..." : linksData?.ogTitle}</h1>
                <p>{linksData?.ogDescription}</p>
            </div>
            {linksData?.ogImage?.url && (
                <div className="flex-[0.3] flex items-center">
                    <div className="w-full overflow-hidden rounded-md">
                        <img className="w-full object-cover" src={linksData?.ogImage?.url} alt={linksData?.ogTitle} />
                    </div>
                </div>
            )}
        </div>
    );
}
