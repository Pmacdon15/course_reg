'use client';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { UserCourse } from '@/app/dashboard/types';
import { useState } from 'react';
import { Button } from '@mui/material';

export default function ClassesAndGrades({ usersCourses }: { usersCourses: UserCourse[] }) {
  const [currentCourseIndex, setCurrentCourseIndex] = useState(0);

  const handleNextCourse = () => {
    setCurrentCourseIndex((prevIndex) => prevIndex + 1);
  };

  const handlePrevCourse = () => {
    setCurrentCourseIndex((prevIndex) => prevIndex - 1);
  };

  const currentCourse = usersCourses[currentCourseIndex];

  return (
    <div className="w-full md:w-96 justify-center text-center content-center bg-gradient-to-r from-blue-400 to-blue-200 rounded-lg shadow-md p-4">
     
      <h1 className="text-xl font-bold text-center">Classes and Grades</h1>
      {currentCourse && (
        <div className='flex flex-col justify-center items-center'>
          <h2>{currentCourse.name}</h2>
          <Gauge
            value={75}
            width={200}
            height={200}
            startAngle={-110}
            endAngle={110}
            // style={{ backgroundColor: '#f5f5f5' }}
            sx={{
              [`& .${gaugeClasses.valueText}`]: {
                fontSize: 40,
                transform: 'translate(0px, 0px)',
              },
            }}
            text={
              ({ value, valueMax }) => `${value} / ${valueMax}`
            }
          />
          <h3>
           <p>Classes: 15/20 Complete.</p>
          </h3>
        </div>
      )}
      <div className="flex justify-center mt-4">
        <Button onClick={handlePrevCourse} disabled={currentCourseIndex === 0}>
          Prev Course
        </Button>
        <Button
          onClick={handleNextCourse}
          disabled={currentCourseIndex === usersCourses.length - 1}
        >
          Next Course
        </Button>
      </div>
    </div>
  );
};




