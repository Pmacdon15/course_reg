import { sql } from "@vercel/postgres";
import ButtonCourseInfo from "@/app/dashboard/buttonCourseInfo";
type Course = {
    id: number;
    name: string;
    brief_description: string;
    terms: string;
    credential: string;
    school: string;
}

async function getAllCourses() {
    'use server';
    try {
        const results = await sql`select * from cravailablecourses`;
        // console.log(results.rows);
        if (results.rows.length > 0) {
            return results.rows as Course[];
        }
        throw new Error('No courses found');
    } catch (error) {
        console.error((error as Error).message);
        return [];
    }
}

export default async function AllCourses() {
    const courses = await getAllCourses();
    return (
        <div className="min-h-96 w-full md:w-96  bg-gradient-to-r from-blue-400 to-blue-200 rounded-lg shadow-md p-4" >
            <h1 className="text-2xl text-center font-bold mb-4">Available Courses</h1>
            <ul>
                {courses.map((course: Course) => (
                    <li key={course.id} className="mb-4">
                        <ButtonCourseInfo courseName={course.name} />
                        <p>{course.brief_description}</p>
                        <p>Level: {course.credential}</p>
                        <p>{course.school}</p>
                    </li>
                ))}
            </ul>
        </div >

    );
};

{/* <ul>
//         {courses.map((course: Course ) => (
//             <li key={course.id} className="mb-4">                        
//                 <ButtonCourseInfo courseName={course.name} />
//                 <p>{course.description}</p>
//                 <p>{course.duration}</p>
//                 <p>{course.level}</p>
//                 <p>{course.department}</p>
//             </li>
//         ))}
//     </ul> */}