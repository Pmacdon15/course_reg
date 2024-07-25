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
                WHERE
                    grade IS NOT NULL
            )
            OR crClasses.prerequisite1 IS NULL
        )
        AND (
            crClasses.prerequisite2 IN (
                SELECT
                    classId
                FROM
                    CRUserClasses
                WHERE
                    grade IS NOT NULL
            )
            OR crClasses.prerequisite2 IS NULL
        )
        AND (
            crClasses.prerequisite3 IN (
                SELECT
                    classId
                FROM
                    CRUserClasses
                WHERE
                    grade IS NOT NULL
            )
            OR crClasses.prerequisite3 IS NULL
        )
        AND (
            crClasses.prerequisite4 IN (
                SELECT
                    classId
                FROM
                    CRUserClasses
                WHERE
                    grade IS NOT NULL
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
// export async function registerUserForClass(email: string, classId: number, termSeason: string, prevState: any, formData: FormData) {
//     'use server'
//     if (!await auth(email)) return [];
//     console.log(email, classId, termSeason);
//     try {
//         // currentTermValue will = the highest term with with 1 or many ungraded classes or 1 + the highest term with all graded classes 
//         let currentTermValueResult = await sql`
//         WITH maxTermNumber AS (
//             SELECT MAX(CASE WHEN grade IS NULL THEN termNumber ELSE termNumber + 1 END) AS maxTermNumber
//             FROM CRUserClasses
//             WHERE userEmail = ${email}
//         )
//         SELECT maxTermNumber
//         FROM maxTermNumber;
//     `;

//         // Extract currentTermValue from the result
//         const currentTermValue = currentTermValueResult.rows[0].maxtermnumber;
//         console.log('Current Term Number:', currentTermValue);

//         // Step 2: Fetch termSeason for currentTermValue
//         const currentTermSeasonResult = await sql`
//         SELECT termSeason
//         FROM CRUserClasses
//         WHERE userEmail = ${email} AND termNumber = ${currentTermValue};
//     `;

//         // Extract currentTermSeason from the result
//         const currentTermSeason = currentTermSeasonResult.rows.length > 0 ? currentTermSeasonResult.rows[0].termseason : null;

//         console.log('Current Term Season:', currentTermSeason);

//         // Step 3: if currentTermSeason is not null then check if class is available in currentTermSeason
//         let classAvailabilityResult = null;
//         if (currentTermSeason) {
//             classAvailabilityResult = await sql`
//                 SELECT 
//                     *
//                 FROM crClasses
//                 WHERE id = ${classId}
//                 AND (
//                     (availableFall = true AND ${termSeason} = 'fall')
//                     OR (availableWinter = true AND ${termSeason} = 'winter')
//                     OR (availableSpring = true AND ${termSeason} = 'spring')
//                 )
//             `;
//         }
//         const availableClasses = classAvailabilityResult?.rows;
//         console.log('Available Classes:', availableClasses);





//         return true;
//     } catch (error) {
//         console.error((error as Error).message);
//         return { message: 'Error registering for class' + (error as Error).message };
//     }
// }

export async function registerUserForClass(email: string, classId: number, termSeason: string, prevState: any, formData: FormData) {
    'use server';
    if (!await auth(email)) return [];
    try {
        // 1. Is term number for user grater than 0
        // If not, set term number to 1
        // 2. Once one class is selected that term season with be the same until the next term
        // Term season must also match the term season of the class or the class with be added to the next term, 
        // as long as there is no season picked for that class or it matches that terms current class
        // Allow up to 5 classes a term, for a total of two terms of ungraded classes    
        // Allow 5 more classes when all classes are graded for the term number
        // 3. Will be similar to checking availability of classes for user but with take out the grade is not null part after 1 term of 
        // ungraded classes are added

        // Get the first available term number is null with no ungraded classes        
        const firstAvailableTermNumber = await getTermNumber(email)+ 1;
        const secondAvailable = firstAvailableTermNumber + 1;
        console.log("First Available Term:", firstAvailableTermNumber);
        console.log("Second available Term:",secondAvailable);
        // Return null if no ungraded classes in the first term
        const firstAvailableTermSeason = await getTermSeason(email, firstAvailableTermNumber);
        console.log("First Season:",firstAvailableTermSeason);
        // Second term season
        const secondAvailableTermSeason = await getTermSeason(email, secondAvailable);
        console.log("Second Season",secondAvailableTermSeason);








        // if (results.rows.length < 1) {
        //     throw new Error('No classes found');
        // }
        // return results.rows as UserRegisteredClass[];
    } catch (error) {
        console.error((error as Error).message);
        return [];
    }

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

