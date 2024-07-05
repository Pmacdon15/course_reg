'use client';
import { useState, useCallback, useEffect } from 'react';
import { useRouter,useSearchParams } from 'next/navigation';
import { Class, UserGradedClass, UserCourse, UserRegisteredClass } from "@/app/types";
import { Button } from '@mui/material';
import ButtonClassInfo from '@/app/register/buttonClassInfo';

function buildClassMap(availableClasses: Class[]): Map<number, number[]> {
    const classMap: Map<number, number[]> = new Map();
    availableClasses.forEach((availableClass: Class) => {
        const prerequisites: number[] = [];
        if (availableClass.prerequisite1) {
            prerequisites.push(availableClass.prerequisite1);
        }
        if (availableClass.prerequisite2) {
            prerequisites.push(availableClass.prerequisite2);
        }
        if (availableClass.prerequisite3) {
            prerequisites.push(availableClass.prerequisite3);
        }
        if (availableClass.prerequisite4) {
            prerequisites.push(availableClass.prerequisite4);
        }
        if (prerequisites.length > 0) {
            classMap.set(availableClass.id, prerequisites);
        }
    });
    return classMap;
}
function filterClasses({ availableClasses, userGradedClasses, userRegisteredClasses, userCourses, currentCourseIndex, currentTerm }: {
    userEmail: string,
    availableClasses: Class[],
    userGradedClasses: UserGradedClass[],
    userCourses: UserCourse[],
    userRegisteredClasses: UserRegisteredClass[],
    currentCourseIndex: number,
    currentTerm: string
}) {
    // Get the current course based on currentCourseIndex
    const currentCourse = userCourses[currentCourseIndex];
    // Filter classes for the current course
    const classesForCurrentCourse = availableClasses.filter((availableClass) => availableClass.courseid === currentCourse.id);

    // Filter classes that are available for the current term
    const classesFilteredByTerm = classesForCurrentCourse.filter((availableClass) => {
        if (currentTerm === 'Fall') {
            return availableClass.availablefall === true;
        } else if (currentTerm === 'Winter') {
            return availableClass.availablewinter === true;
        } else if (currentTerm === 'Spring') {
            return availableClass.availablespring === true;
        }
        return false; // Default to false if term doesn't match any condition
    });

    // Filter classes that the user has not graded
    const ungradedClasses = classesFilteredByTerm.filter((availableClass) => !userGradedClasses.some((gradedClass) => gradedClass.classid === availableClass.id));

    // Build a map of class id to prerequisites
    const prerequisitesMap = buildClassMap(availableClasses);

    // Remove registered classes from prerequisitesMap
    userRegisteredClasses.forEach((registeredClass) => {
        const classId = registeredClass.classid;

        if (prerequisitesMap.has(classId)) {
            prerequisitesMap.delete(classId);
        }

        prerequisitesMap.forEach((value, key) => {
            // Remove the classId from the prerequisites
            if (value.includes(classId)) {
                prerequisitesMap.set(key, value.filter((prerequisite) => prerequisite !== classId));
            }
            if (prerequisitesMap.get(key)?.length === 0) {
                prerequisitesMap.delete(key);
            }
        });
    });
    // Remove graded classes from prerequisitesMap
    prerequisitesMap.forEach((value, key) => {
        if (value.some((prerequisite) => userGradedClasses.some((gradedClass) => gradedClass.classid === prerequisite))) {
            prerequisitesMap.delete(key);
        }
    });

    // Filter out classes that have prerequisites that are ungraded and not registered for
    const classesWithoutPrerequisites = ungradedClasses.filter((availableClass) => !prerequisitesMap.has(availableClass.id));

    return classesWithoutPrerequisites;
}

//MARK: Start of page
export default function AvailableClasses(
    { userEmail, availableClasses, userGradedClasses, userCourses, userRegisteredClasses }:
        {
            userEmail: string,
            availableClasses: Class[],
            userGradedClasses: UserGradedClass[],
            userCourses: UserCourse[],
            userRegisteredClasses: UserRegisteredClass[]
        }
) {
    const router = useRouter();
    const searchParams = useSearchParams()
    // Handle switching between courses
    const [currentCourseIndex, setCurrentCourseIndex] = useState(0);

    const handleNextCourse = () => {
        setCurrentCourseIndex((prevIndex) => prevIndex + 1);
    };

    const handlePrevCourse = () => {
        setCurrentCourseIndex((prevIndex) => prevIndex - 1);
    };

    // Handle switching between terms    
    const [currentTerm, setCurrentTerm] = useState('Fall');
    // Create query string for url
    const createQueryString = useCallback(
        (currentTerm: string)
            : string => {
            return `${userEmail}/?term=${currentTerm}`;
        },
        [currentTerm]
    );
    // get term from url then set it to currentTerm
    useEffect(() => {
        const newTerm = searchParams.get('term');
        if (newTerm) {
            setCurrentTerm(newTerm);
        }       
    }, [router]);   

    // Update url when term changes
    useEffect(() => {
        router.push(`/register/${createQueryString(currentTerm)}`);
    }, [currentTerm]);

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

    userCourses.sort((a, b) => {
        if (a.registered && !b.registered) return -1;
        if (!a.registered && b.registered) return 1;
        return 0;
    });

    const currentCourse = userCourses[currentCourseIndex];
    const classesWithoutPrerequisites = filterClasses({ userEmail, availableClasses, userGradedClasses, userRegisteredClasses, userCourses, currentCourseIndex, currentTerm });


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
                                classesWithoutPrerequisites.map((availableClass: Class) => (
                                    <li key={availableClass.id} className="mb-4">
                                        <ButtonClassInfo className={availableClass.classname} term={currentTerm} />
                                    </li>
                                ))}
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


