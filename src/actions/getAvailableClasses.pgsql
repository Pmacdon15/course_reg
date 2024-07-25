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
    -- crClasses.id >11;
    crClasses.id NOT IN (
        SELECT
            classId
        FROM
            crUserClasses
        WHERE
            userEmail = 'pmacdonald15@gmail.com'
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