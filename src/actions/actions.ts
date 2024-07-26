'use server';
import { sql } from "@vercel/postgres";
import { Course, UserCourse, UserGradedClass, Class, UserRegisteredClass } from '@/types/types';
import { getUser } from '@workos-inc/authkit-nextjs'
import { get } from "http";

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
    crClasses.id NOT IN (
        SELECT
            classId
        FROM
            crUserClasses
        WHERE
            userEmail = ${email}
    )
    AND (
        (
            crClasses.prerequisite1 IN (
                SELECT
                    classId
                FROM
                    CRUserClasses
            )
            OR crClasses.prerequisite1 IS NULL
        )
        AND (
            crClasses.prerequisite2 IN (
                SELECT
                    classId
                FROM
                    CRUserClasses
            )
            OR crClasses.prerequisite2 IS NULL
        )
        AND (
            crClasses.prerequisite3 IN (
                SELECT
                    classId
                FROM
                    CRUserClasses
                
            )
            OR crClasses.prerequisite3 IS NULL
        )
        AND (
            crClasses.prerequisite4 IN (
                SELECT
                    classId
                FROM
                    CRUserClasses
            )
            OR crClasses.prerequisite4 IS NULL
        )
        OR (
            crClasses.prerequisite1 IS NULL
            AND crClasses.prerequisite2 IS NULL
            AND crClasses.prerequisite3 IS NULL
            AND crClasses.prerequisite4 IS NULL
        )
    );   
     `;
        console.log(email);
        // console.log(results.rows);
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
export async function registerUserForClass(email: string, classId: number, termSeason: string, prevState: any, formData: FormData) {
    'use server';
    if (!await auth(email)) return [];

    // Get the first available term number is null with no ungraded classes        
    const firstAvailableTermNumber = await getTermNumber(email) + 1;
    const secondAvailable = firstAvailableTermNumber + 1;
    console.log("First Available Term:", firstAvailableTermNumber);
    console.log("Second available Term:", secondAvailable);
    // Return null if no ungraded classes in the first term
    const firstAvailableTermSeason = await getTermSeason(email, firstAvailableTermNumber);
    console.log("First Season:", firstAvailableTermSeason);
    // Second term season
    const secondAvailableTermSeason = await getTermSeason(email, secondAvailable);
    console.log("Second Season", secondAvailableTermSeason);

    // If first term season is null allow a class from any season to be added
    if (!firstAvailableTermSeason) {
        // Add class to first term season
        console.log("First Term Season is null");
        if (await addClassToUserClasses(email, classId,firstAvailableTermNumber, termSeason)) {
            return { message: "Class added to first term season" };
        }
    } else {

    }


    // Else first season is not null, check incoming class is available and selected in the first term season

    // If not available, check if second term season is null and add class to second term season

    // Else second term season is not null, check incoming class is available available and selected in the second term season

    // If not available, return error message







}

async function getTermSeason(email: string, termNumber: number) {
    'use server';
    if (!await auth(email)) return [];
    try {
        const termSeason = await sql`
            SELECT
            CASE
                    WHEN COUNT(*) > 0 THEN MAX(termSeason)
                    ELSE NULL
                END AS termSeason
            FROM
            CRUserClasses
            WHERE
            userEmail = ${email}
                AND termNumber = ${termNumber}
                AND grade IS NULL;
            `;
        return termSeason.rows[0].termseason;

    } catch (error) {
        console.error((error as Error).message);
        return 0;
    }
}

async function getTermNumber(email: string) {
    'use server';
    if (!await auth(email)) return [];
    try {
        const termNumber = await sql`
            SELECT
            MAX(termNumber) AS termNumber
        FROM CRUserClasses
        WHERE userEmail = ${email} AND grade IS NOT NULL
                `;
        // console.log(termNumber.rows[0].termnumber);
        return termNumber.rows[0].termnumber;
    } catch (error) {
        console.error((error as Error).message);
        return 0;
    }
}

//MARK: Add class to user classes by class id and termSeason if available that season return true or false
export async function addClassToUserClasses(email: string, classId: number, termNumber: number, termSeason: string) {
    'use server';
    if (!await auth(email)) return [];
    try {
        console.log("hi");
        const results = await sql`
        INSERT INTO CRUserClasses (userEmail, classId,termNumber, termSeason)
        VALUES (${email}, ${classId},${termNumber} ,${termSeason})
        RETURNING *
        `;
        if (results.rows.length < 1) {
            throw new Error('No classes found');
        }
        return true;
    } catch (error) {
        console.error((error as Error).message);
        return false;
    }
}
