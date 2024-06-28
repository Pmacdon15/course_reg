import { sql } from "@vercel/postgres";
async function getAllCourses() {
    'use server';
    // Todo - get courses from the database
    // for now just return a list of courses
    return [
        {
            id: 1,
            name: 'Software Development Diploma',
            description: 'Learn software development',
            duration: '4 terms',
            level: 'Diploma',
            department: 'School of technology'
        },
        {
            id: 2,
            name: 'Software Development Apprenticeship',
            description: 'Learn software development',
            duration: '4 terms',
            level: 'Apprenticeship',
            department: 'School of technology'
        },
        {
            id: 3,
            name: 'Software Development Certificate',
            description: 'Learn software development',
            duration: '4 terms',
            level: 'Certificate',
            department: 'School of technology'
        },
        {
            id: 4,
            name: 'Software Development Degree',
            description: 'Learn software development',
            duration: '4 terms',
            level: 'Degree',
            department: 'School of technology'
        }
    ];
}

export default async function AllCourses() {
    const courses = await getAllCourses();
    return (
        <div className="h-200 w-96 md:max-min-w-full  bg-gradient-to-r from-blue-400 to-blue-200 rounded-lg shadow-md p-4" >
            <h1 className="text-2xl font-bold mb-4">Available Courses</h1>
            <ul>
                {courses.map((course) => (
                    <li key={course.id} className="mb-4">
                        <h2 className="text-xl font-bold">{course.name}</h2>
                        <p>{course.description}</p>
                        <p>{course.duration}</p>
                        <p>{course.level}</p>
                        <p>{course.department}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};