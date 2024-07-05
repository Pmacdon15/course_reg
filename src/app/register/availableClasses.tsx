'use client';
import { useState } from 'react';
import { Class, UserGradedClass, UserCourse } from "@/app/types";
import { Button } from '@mui/material';

function buildClassMap(availableClasses: Class[]): Map<number, string[]> {
    const classMap: Map<number, string[]> = new Map();
    availableClasses.forEach((availableClass: Class) => {
        const prerequisites: string[] = [];
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

export default function AvailableClasses({ availableClasses, userGradedClasses, userCourses }: { availableClasses: Class[], userGradedClasses: UserGradedClass[], userCourses: UserCourse[] }) {

    const [currentCourseIndex, setCurrentCourseIndex] = useState(0);

    const handleNextCourse = () => {
        setCurrentCourseIndex((prevIndex) => prevIndex + 1);
    };

    const handlePrevCourse = () => {
        setCurrentCourseIndex((prevIndex) => prevIndex - 1);
    };

    userCourses.sort((a, b) => {
        if (a.registered && !b.registered) return -1;
        if (!a.registered && b.registered) return 1;
        return 0;
    });

    const currentCourse = userCourses[currentCourseIndex];
    // Filter classes for the current course
    const classesForCurrentCourse = availableClasses.filter((availableClass: Class) => availableClass.courseid === currentCourse.id);
    // Filter classes that the user has not graded
    const ungradedClasses = classesForCurrentCourse.filter((availableClass: Class) => !userGradedClasses.some((gradedClass: UserGradedClass) => gradedClass.classid === availableClass.id));
    // Build a map of class id to prerequisites
    const prerequisitesMap = buildClassMap(availableClasses);
    //Todo remove classes that have prerequisites that is registered for or has been graded, add db table for classes registered by user
    const  ungradedNotRegisteredClassesWithoutPrerequisites = "";
    //filter out classes that have prerequisites  that are ungraded and not registered for
    const classesWithoutPrerequisites = ungradedClasses.filter((availableClass: Class) => !prerequisitesMap.has(availableClass.id));
   
    //Todo  test  ungradedNotRegisteredWithoutPrerequisitesClasses
    console.log( classesWithoutPrerequisites);




    return (
        <div className="h-fit md:h-[600px] w-full md:w-96 bg-gradient-to-r from-blue-400 to-blue-200 overflow-auto resize-y sm:resize-none rounded-md shadow-md p-4">
            <h1 className="text-2xl text-center font-bold mb-4">Available Classes for your programs</h1>

            {currentCourse && (
                <div className='flex flex-col justify-center items-center'>
                    <h1 className="text-xl font-bold text-center">{currentCourse.name}</h1>
                    <h2>Available Classes:</h2>
                    {currentCourse && (
                        <ul>
                            {//Todo  replace classesWithoutPrerequisites with ungradedNotRegisteredClasses after applying filtering
                                classesWithoutPrerequisites.map((availableClass: Class) => (
                                    <li key={availableClass.id} className="mb-4">
                                        <p>{availableClass.classname}</p>
                                    </li>
                                ))}
                        </ul>
                    )}
                </div>
            )}
            <div className="flex justify-center mt-4 ">
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