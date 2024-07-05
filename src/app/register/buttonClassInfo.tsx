'use client';
import { useRouter } from 'next/navigation';
export default function ButtonCourseInfo({ className }: { className: string }) {
    const router = useRouter();
    return (
        <h2 className='text-md font-bold'>
            <button className='focus:outline-none text-left' onClick={() => {
                const [firstWord, secondWord, thirdWord] = className.split(" ");
                const path = thirdWord ? `classes/${firstWord.toLowerCase()}${secondWord.toLowerCase()}${thirdWord.toLowerCase()}` : `classes/${firstWord.toLowerCase()}${secondWord.toLowerCase()}`;
                router.push(`/${path}`);
            }} >
                {className}
            </button>
        </h2>
    );

};