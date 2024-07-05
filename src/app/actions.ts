import { sql } from "@vercel/postgres";
import { Course, UserCourse, UserGradedClass, Class } from '@/app/types';

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
export async function getUserCourses(email: string) {
    'use server'
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
    try {
        const results = await sql`
        SELECT
            id,
            classId,
            courseId,
            grade,
            term
        FROM CRUserGradedClasses
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
    try {
        const results = await sql`
        SELECT
            crClasses.id,
            crClasses.courseId,
            crClasses.className,
            crClasses.availableFall,
            crClasses.availableWinter,
            crClasses.availableSpring
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
