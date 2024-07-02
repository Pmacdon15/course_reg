import { sql } from "@vercel/postgres";
import { Course, UserCourse } from '@/app/dashboard/types';

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
    const results = await sql`
       SELECT 
        AC.name, 
        AC.brief_description,
        AC.school,
        AC.terms,
        CC.registered,
        COUNT(CR.id)::int AS total_classes
        FROM 
        CRAvailableCourses AC
        JOIN crUsersCourses CC ON AC.id = CC.courseID
        LEFT JOIN CRClasses CR ON AC.id = CR.courseId
        WHERE 
            CC.userEmail = ${email}
        GROUP BY 
  AC.name, AC.brief_description, AC.school, AC.terms, CC.registered
    `;
    if (results.rows.length > 0) {
        return results.rows as UserCourse[];
    }
    return [];
}
