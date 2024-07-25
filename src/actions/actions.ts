'use server';
import { sql } from "@vercel/postgres";
import { Course, UserCourse, UserGradedClass, Class, UserRegisteredClass } from '@/types/types';
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

//MARK: Get all courses
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
export async function getClassesAvailableForUser(email: string) {
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
            crClasses.availableSpring
        FROM 
            crClasses
        WHERE 
            crClasses.prerequisite1 IS NULL
            AND crClasses.prerequisite2 IS NULL
            AND crClasses.prerequisite3 IS NULL
            AND crClasses.prerequisite4 IS NULL
            AND crClasses.id NOT IN (
                SELECT classId
                FROM CRUserClasses
            )
            OR 
            (
                -- Class has prerequisites, but user has already taken or registered for them
                (crClasses.prerequisite1 IN (SELECT classId FROM CRUserClasses) OR crClasses.prerequisite1 IS NULL)
                AND (crClasses.prerequisite2 IN (SELECT classId FROM CRUserClasses) OR crClasses.prerequisite2 IS NULL)
                AND (crClasses.prerequisite3 IN (SELECT classId FROM CRUserClasses) OR crClasses.prerequisite3 IS NULL)
                AND (crClasses.prerequisite4 IN (SELECT classId FROM CRUserClasses) OR crClasses.prerequisite4 IS NULL)
            )
            AND 
            -- Class is not already taken or registered by user
            crClasses.id NOT IN (SELECT classId FROM CRUserClasses)
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
            CRUserClasses.id,
            classId,
            crclasses.courseid,
            grade,
            termNumber
        FROM CRUserClasses
        JOIN CRClasses ON CRUserClasses.classId = CRClasses.id
        WHERE userEmail = ${email} AND grade IS NOT NULL
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
//MARK: Register user for class
export async function registerUserForClass(email:string, classId:number, termSeason:string, prevState: any, formData: FormData) {
    'use server'
    // if (!await auth(email)) return [];
    try {
        // const results = await sql`
        //     WITH highestTerm AS (
        //         SELECT MAX(termNumber) AS highestTerm
        //         FROM CRUserClasses
        //         WHERE userEmail = ${email} AND grade IS NULL
        //     )
        //     INSERT INTO CRUserClasses (userEmail, classId, termNumber, termSeason)
        //     SELECT ${email}, ${classId}, highestTerm.highestTerm, ${termSeason}
        //     FROM highestTerm
        //     RETURNING *
        // `;
        // if (results.rows.length < 1) {
        //     throw new Error('No classes found');
        // }
        console.log(email, classId, termSeason, );

        return true;
    } catch (error) {
        console.error((error as Error).message);
        return { message: 'Error registering for class' + (error as Error).message };
    }
}