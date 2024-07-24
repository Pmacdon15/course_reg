'use client';
import { useRouter } from 'next/navigation';

export default function ButtonCourseInfo({ userEmail, className, classId, term }: { userEmail:string,className:string, classId: number, term: string}) {
    const router = useRouter();
    // const words = className.split(" ");
    // const firstWord = words[0]?.toLowerCase() || '';
    // const restOfWords = words.slice(1).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join('');

    // const path = `classes/${firstWord}${restOfWords}/${term}`;
    const path = `classes/${userEmail}/${classId}/${term}`;
    return (
        <h2 className='text-md font-bold'>
            <button className='focus:outline-none text-left' onClick={() => {
                router.push(`/${path}`);
            }}>
                {className}
            </button>
        </h2>
    );
}
