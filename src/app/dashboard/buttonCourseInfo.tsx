'use client';
import { useRouter } from 'next/navigation';
export default function ButtonCourseInfo({ courseName }: { courseName: string }) {
    const router = useRouter();

    return (
<h2 className='text-xl font-bold'>
        <button className='focus:outline-none' onClick={() => {
            const [firstWord, secondWord, thirdWord] = courseName.split(" ");
            const path = thirdWord ? `courses/${firstWord.toLowerCase()}${secondWord.toLowerCase()}${thirdWord.toLowerCase()}` : `courses/${firstWord.toLowerCase()}${secondWord.toLowerCase()}`;
            router.push(`/${path}`);
        }} >
            
                {courseName}
           
        </button>
        </h2>
    );

};