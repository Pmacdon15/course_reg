'use client';
import { useState } from 'react';
import { Class, UserGradedClass, UserCourse } from "@/app/types";
import { Button } from '@mui/material';
export default function AvailableClasses({ availableClasses = [], userGradedClasses, userCourses }: {  availableClasses: Class[], userGradedClasses: UserGradedClass[], userCourses: UserCourse[] }) {
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
    const classesForCurrentCourse = availableClasses.filter((availableClass: Class) => availableClass.courseid === currentCourse.id);
    const ungradedClasses = classesForCurrentCourse.filter((availableClass: Class) => !userGradedClasses.some((gradedClass: UserGradedClass) => gradedClass.classid === availableClass.id));
    // console.log(userGradedClasses);
    // console.log(ungradedClasses);


    return (
        <div className="h-96 md:h-[600px] w-full md:w-96 bg-gradient-to-r from-blue-400 to-blue-200 overflow-auto resize-y sm:resize-none rounded-md shadow-md p-4">
            <h1 className="text-2xl text-center font-bold mb-4">Available Classes for your programs</h1>
            
            {currentCourse && (
                <div className='flex flex-col justify-center items-center'>
                    <h1 className="text-xl font-bold text-center">{currentCourse.name}</h1>
                    <h2>Available Classes:</h2>
                    {currentCourse && (
                        <ul>
                            {                                
                                ungradedClasses.map((availableClass: Class) => (
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