import { sql } from "@vercel/postgres";

type UserCourse = {
    id: number;
    name: string;
    description: string;
    duration: string;
    registered: boolean;
}

async function getUserCourses(email: string) {
    const results = await sql`
        SELECT 
        AC.name, 
        CC.registered
        FROM 
        CRAvailableCourses AC
        JOIN 
        crUsersCourses CC ON  AC.id= CC.courseID
        WHERE 
        CC.userEmail = ${email}
    `;
    if (results.rows.length > 0) {
        return results.rows as UserCourse[];
    }
    return [];
}


export default async function UserCourses({ email }: { email: string }) {
    const userCourses = await getUserCourses(email);
    console.log(userCourses);
    return (
        <>        <div className="md:h-4/6 h-min w-full bg-gradient-to-r from-blue-400 to-blue-200 rounded-lg shadow-md gap- p-4">
            <div>
                <h2 className="text-center text-xl font-bold">Your Current Courses:</h2>
                {userCourses.length === 0 ? (
                    <p>No current courses to list</p>
                ) : (
                    userCourses.filter((course) => course.registered).map((course) => (
                        <div key={(course.id)} className="mb-4">
                            <h4>{course.name}</h4>
                        </div>
                    ))
                )}
            </div>
            <div>
                <h2 className="text-center text-xl font-bold">Past Courses:</h2>
                {userCourses.filter((course) => !course.registered).length === 0 ? (
                    <p>No past courses to list</p>
                ) : (
                    userCourses.filter((course) => !course.registered).map((course) => (
                        <div key={(course.id)} className="mb-4">
                            <h4>{course.name}</h4>
                        </div>
                    ))
                )}
            </div >
        </div >
        </>

    );
};