'use client';
import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Class, UserCourse } from "@/types/types";
import { Button } from '@mui/material';
import ButtonClassInfo from '@/components/buttonClassInfo';

export default function AvailableClasses(
    { userEmail, availableFallClasses, availableWinterClasses, availableSpringClasses, userCourses }:
        {
            userEmail: string,
            availableFallClasses: Class[],
            availableWinterClasses: Class[],
            availableSpringClasses: Class[],
            userCourses: UserCourse[],
        }
) {
    const router = useRouter();
    const searchParams = useSearchParams()

    // Handle switching between courses
    userCourses.sort((a, b) => {
        if (a.registered && !b.registered) return -1;
        if (!a.registered && b.registered) return 1;
        return 0;
    });

    // Handle switching between courses
    const [currentCourseIndex, setCurrentCourseIndex] = useState(0);

    const handleNextCourse = () => {
        setCurrentCourseIndex((prevIndex) => prevIndex + 1);
    };

    const handlePrevCourse = () => {
        setCurrentCourseIndex((prevIndex) => prevIndex - 1);
    };

    const currentCourse = userCourses[currentCourseIndex];

    // Handle switching between terms    
    const [currentTerm, setCurrentTerm] = useState('Fall');

    //TODO: Add query for course
    // Create query string for url
    const createQueryString = useCallback(
        (currentTerm: string)
            : string => {
            return `${userEmail}/?term=${currentTerm}`;
        },
        [userEmail]
    );
    // get term from url then set it to currentTerm
    useEffect(() => {
        const newTerm = searchParams.get('term');
        if (newTerm) {
            setCurrentTerm(newTerm);
        }
    }, [searchParams, router]);

    // Update url when term changes
    useEffect(() => {
        if (currentTerm === 'Fall') {
            setCurrentTermArray(availableFallClasses);
        }
        if (currentTerm === 'Winter') {
            setCurrentTermArray(availableWinterClasses);
        }
        if (currentTerm === 'Spring') {
            setCurrentTermArray(availableSpringClasses);
        }
        router.push(`/register/${createQueryString(currentTerm)}`);
    }, [router, createQueryString, currentTerm]);

    const [currentTermArray, setCurrentTermArray] = useState<Class[]>([]);

    const handleSwitchToFallTerm = () => {
        setCurrentTerm('Fall');
        router.push(`/register/${createQueryString('Fall')}`);
    };

    const handleSwitchToWinterTerm = () => {
        setCurrentTerm('Winter');
        router.push(`/register/${createQueryString('Winter')}`);
    };

    const handleSwitchToSpringTerm = () => {
        setCurrentTerm('Spring');
        router.push(`/register/${createQueryString('Spring')}`);
    };

    return (
        <div className="h-fit md:h-[600px] w-full md:w-96 bg-gradient-to-r from-blue-400 to-blue-200 overflow-auto resize-y sm:resize-none rounded-md shadow-md p-4">
            <h1 className="text-2xl text-center font-bold mb-4">Available Classes for your programs</h1>
            {currentCourse && (
                <div className='flex flex-col justify-center items-center'>
                    <h1 className="text-xl font-bold text-center">{currentCourse.name}</h1>
                    <h2>Available Classes:</h2>
                    <div className="flex justify-center gap-4">
                        <Button onClick={handleSwitchToFallTerm} disabled={currentTerm === 'Fall'}>
                            Fall
                        </Button>
                        <Button onClick={handleSwitchToWinterTerm} disabled={currentTerm === 'Winter'}>
                            Winter
                        </Button>
                        <Button onClick={handleSwitchToSpringTerm} disabled={currentTerm === 'Spring'}>
                            Spring
                        </Button>
                    </div>
                    {currentCourse && (
                        <ul>
                            {
                                currentTermArray
                                    .filter((availableClass: Class) => availableClass.courseid === currentCourse.id)
                                    .map((availableClass: Class) => (
                                        <li key={availableClass.id} className="mb-4">
                                            <ButtonClassInfo userEmail={userEmail} className={availableClass.classname} classId={availableClass.id} term={currentTerm} />
                                        </li>
                                    ))
                            }
                        </ul>
                    )}
                </div>
            )}
            <div className="flex justify-center ">
                <Button onClick={handlePrevCourse} disabled={currentCourseIndex === 0}>
                    Prev Course
                </Button>
                <Button
                    onClick={handleNextCourse}
                    disabled={currentCourseIndex === userCourses.length - 1}
                >
                    Next Course
                </Button>
            </div>
        </div>
    );

};


