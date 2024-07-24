import { sql } from "@vercel/postgres";
import { Course, UserCourse, UserGradedClass, Class, UserRegisteredClass } from '@/app/types';
import { getUser } from '@workos-inc/authkit-nextjs'

async function auth(email: string) {
    'use server';
    try {
        const user = await getUser({ ensureSignedIn: true });
        if (user.user?.email != email) throw new Error('Unauthorized user');
    } catch (error) {
        console.error((error as Error).message);
        return false;
    }
    return true;
}

export async function getAllCourses() {
    'use server';
    try {
        const results = await sql`select * from cravailablecourses`;
        if (results.rows.length > 0) {
            return results.rows as Course[];
        }
        throw new Error('No courses found');
    } catch (error) {
        console.error((error as Error).message);
        return [];
    }
}
//MARK: Get courses available for user, based on user email
// To return courses available for user, we need to check if the user is authenticated
// and then return the courses available for the user courses have upto 4 prerequisites,
// so if the user has the prerequisites graded or is registered for the class, the class is available
// Also removing the classes the user has graded from the list
export async function getClassesAvailableForUser(email: string) {
    'use server'
    if (!await auth(email)) return [];
    try {
        const results = await sql`
        SELECT
        
        `;

        if (results.rows.length < 1) {
            throw new Error('No classes found');
        }
        return results.rows as Class[];
    } catch (error) {
        console.error((error as Error).message);
        return [];
    }
}



export async function getUserCourses(email: string) {
    'use server'
    if (!await auth(email)) return [];
    try {
        const results = await sql`
       SELECT 
            AC.id,
            AC.name, 
            AC.brief_description,
            AC.school,
            AC.terms,
            CC.registered,
            COUNT(CR.id)::int AS total_classes
        FROM CRAvailableCourses AC
        JOIN crUsersCourses CC ON AC.id = CC.courseID
        LEFT JOIN CRClasses CR ON AC.id = CR.courseId
        WHERE 
            CC.userEmail = ${email}
        GROUP BY 
    AC.id, AC.name, AC.brief_description, AC.school, AC.terms, CC.registered
    `;
        return results.rows as UserCourse[];

    } catch (error) {
        console.error((error as Error).message);
        return [];
    }
}

export async function getUserGradedClasses(email: string) {
    'use server'
    if (!await auth(email)) return [];
    try {
        const results = await sql`
        SELECT
            CRUserGradedClasses.id,
            classId,
            crclasses.courseid,
            grade,
            termNumber
        FROM CRUserGradedClasses
        JOIN CRClasses ON CRUserGradedClasses.classId = CRClasses.id
        WHERE userEmail = ${email}
        `;
        if (results.rows.length < 1) {
            throw new Error('No graded classes found');
        }
        return results.rows as UserGradedClass[];
    } catch (error) {
        console.error((error as Error).message);
        return [];
    }
}

export async function getClassesForUserRegisteredCourses(email: string) {
    'use server'
    if (!await auth(email)) return [];
    try {
        const results = await sql`
        SELECT
            crClasses.id,
            crClasses.courseId,
            crClasses.className,
            crClasses.availableFall,
            crClasses.availableWinter,
            crClasses.availableSpring,
            crClasses.prerequisite1,
            crClasses.prerequisite2,
            crClasses.prerequisite3,
            crClasses.prerequisite4
        FROM crClasses 
        JOIN crUsersCourses ON CRClasses.courseId = crUsersCourses.courseID
        WHERE crUsersCourses.userEmail = ${email}
        `;
        if (results.rows.length < 1) {
            throw new Error('No classes found');
        }
        return results.rows as Class[];
    } catch (error) {
        console.error((error as Error).message);
        return [];
    }
}

export async function getRegisteredClasses(email: string) {
    'use server'
    if (!await auth(email)) return [];
    try {
        const results = await sql`
            SELECT
                classid
            FROM CRUserRegisteredClasses 
            WHERE userEmail = ${email}
        `;
        if (results.rows.length < 1) {
            throw new Error('No classes found');
        }
        return results.rows as UserRegisteredClass[];
    } catch (error) {
        console.error((error as Error).message);
        return [];
    }
}

// MARK: Can user register for a class
// export async function canUserRegisterForClass(email: string, className: string) {
//     'use server'
//     if (!await auth(email)) return false;
//     try {
//         const results = await sql`
//             SELECT
//                 crClasses.id
//             FROM crClasses
//             JOIN crUsersCourses ON crClasses.courseId = crUsersCourses.courseID
//             WHERE crUsersCourses.userEmail = ${email} AND crClasses.className = ${className}
//         `;
//         if (results.rows.length < 1) {
//             throw new Error('No classes found');
//         }
//         return true;
//     } catch (error) {
//         console.error((error as Error).message);
//         return false;
//     }
// }
//MARK: Get class by id
export async function getClassById(classId: number) {
    'use server'
    try {
        const results = await sql`
        SELECT
            *
        FROM crClasses
        WHERE id = ${classId}
        `;
        if (results.rows.length < 1) {
            throw new Error('No classes found');
        }
        return results.rows[0] as Class;
    } catch (error) {
        console.error((error as Error).message);
        return {} as Class;
    }
}