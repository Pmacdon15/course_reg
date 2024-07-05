'use client';
import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
    // Get the classes with prerequisites
    const classesWithPrerequisitesMap = buildClassMap(availableClasses);

    // Get Current Course
    const currentCourse = userCourses[currentCourseIndex];

    // Get the classes that are part of the current course
    const currentCourseClasses = availableClasses.filter(availableClass => availableClass.courseid === currentCourse.id);  

    // Loop over currentCourseClasses and remove classes that are not available in the current term
    const classesAvailableForTerm = currentCourseClasses.filter(availableClass => {
        if (availableClass.availablefall && currentTerm === 'Fall') {
            return true;
        }
        if (availableClass.availablewinter && currentTerm === 'Winter') {
            return true;
        }
        if (availableClass.availablespring && currentTerm === 'Spring') {
            return true;
        }
        return false;
    });

    // Extract the class IDs that are already graded
    const gradedClassIds = userGradedClasses.map(gradedClass => gradedClass.classid);

    // Remove Graded classes from classesWithPrerequisitesMap
    gradedClassIds.forEach(gradedClassId => {
        classesWithPrerequisitesMap.delete(gradedClassId);
    });

    // Loop over classesWithPrerequisitesMap and remove classes that are already graded or registered from the map value, which is an array of prerequisites
    classesWithPrerequisitesMap.forEach((prerequisites, classId) => {
        const gradedClasses = userGradedClasses.map(gradedClass => gradedClass.classid);
        const registeredClasses = userRegisteredClasses.map(registeredClass => registeredClass.classid);

        const updatedPrerequisites = prerequisites.filter(prerequisite =>
            !gradedClasses.includes(prerequisite) && !registeredClasses.includes(prerequisite)
        );

        // Update the map with filtered prerequisites
        if (updatedPrerequisites.length === 0) {
            classesWithPrerequisitesMap.delete(classId);
        } else {
            classesWithPrerequisitesMap.set(classId, updatedPrerequisites);
        }
    });   
    // Loop over classesAvailableForTerm and remove classes that are already graded
    const classesWithoutGrades = classesAvailableForTerm.filter(availableClass => {
        return !gradedClassIds.includes(availableClass.id);
    });
    //Loop over classesAvailableForTerm and remove classes that have prerequisites as a key in classesWithPrerequisitesMap
    const classesWithoutPrerequisites = classesWithoutGrades.filter(availableClass => {
        return !classesWithPrerequisitesMap.has(availableClass.id);
    });
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


