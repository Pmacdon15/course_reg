'use client';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { UserCourse, UserGradedClass } from '@/app/dashboard/types';
import { useState, useEffect } from 'react';
import { Button } from '@mui/material';

export default function ClassesAndGrades({ usersCourses, userGradedClasses }: { usersCourses: UserCourse[], userGradedClasses: UserGradedClass[] }) {
  const [currentCourseIndex, setCurrentCourseIndex] = useState(0);

  const handleNextCourse = () => {
    setCurrentCourseIndex((prevIndex) => prevIndex + 1);
  };

  const handlePrevCourse = () => {
    setCurrentCourseIndex((prevIndex) => prevIndex - 1);
  };

  usersCourses.sort((a, b) => {
    if (a.registered && !b.registered) return -1;
    if (!a.registered && b.registered) return 1;
    return 0;
  });

  const currentCourse = usersCourses[currentCourseIndex];

  const numberOfGradedClassesForCurrentCourse = userGradedClasses.filter(gradedClass => gradedClass.courseid === currentCourse.id);
  const termMap = new Map();
  numberOfGradedClassesForCurrentCourse.forEach(gradedClass => {
    const term = gradedClass.term
    const grade = gradedClass.grade;

    const currentTerm = termMap.get(term);
    if (currentTerm) {
      currentTerm.sum += grade;
      currentTerm.count++;
    } else {
      termMap.set(term, { sum: grade, count: 1 });
    }
  });

  function getGPA(average:number) {
    if (average >= 95) return 4.0;
    if (average >= 90) return 4.0;
    if (average >= 85) return 3.67;
    if (average >= 80) return 3.33;
    if (average >= 75) return 3.0;
    if (average >= 70) return 2.67;
    if (average >= 67) return 2.33;
    if (average >= 64) return 2.0;
    if (average >= 60) return 1.67;
    if (average >= 57) return 1.33;
    if (average >= 50) return 1.0;
    return 0.0;
  }

  return (
    <div className="w-full md:w-96 justify-center text-center content-center bg-gradient-to-r from-blue-400 to-blue-200 rounded-lg shadow-md p-4">

      <h1 className="text-xl font-bold text-center">Classes and Grades</h1>
      {currentCourse && (
        <div className='flex flex-col justify-center items-center'>
          <h2>{currentCourse.name}</h2>
          <Gauge
            value={numberOfGradedClassesForCurrentCourse.length / currentCourse.total_classes * 100}
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
              ({ value, valueMax }) => `${numberOfGradedClassesForCurrentCourse.length} / ${currentCourse.total_classes}`
            }
          />
          <h3>
            <p>Classes: {numberOfGradedClassesForCurrentCourse.length}/{currentCourse.total_classes} Completed.</p>
          </h3>          
            {Array.from(termMap).map(([term, value]) => (
              <div key={term}>
                 <p>Term {term}: GPA {getGPA(value.sum / value.count)}</p>
              </div>
            ))}
          
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




