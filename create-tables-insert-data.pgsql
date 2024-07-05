CREATE TABLE
  CRAvailableCourses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    brief_description VARCHAR(255) NOT NULL,
    long_description TEXT,
    terms INTEGER NOT NULL,
    credential VARCHAR(255) NOT NULL,
    school VARCHAR(255) NOT NULL
  );

CREATE TABLE
  crUsersCourses (
    id SERIAL PRIMARY KEY,
    userEmail VARCHAR(255),
    courseID INTEGER REFERENCES CRAvailableCourses (id) ON DELETE CASCADE,
    registered BOOLEAN DEFAULT FALSE,
    UNIQUE (userEmail, courseID)
  );

CREATE TABLE
  CRClasses (
    id SERIAL PRIMARY KEY,
    classCode VARCHAR(255) UNIQUE NOT NULL,
    className VARCHAR(255) NOT NULL,
    courseId INTEGER,
    CONSTRAINT fk_courseId FOREIGN KEY (courseId) REFERENCES CRAvailableCourses (id),
    availableDurringFall BOOLEAN,
    availableDurringWinter BOOLEAN,
    availableDurringSpring BOOLEAN,
    prerequisite1 INTEGER REFERENCES CRClasses (id) ON DELETE CASCADE NULL,
    prerequisite2 INTEGER REFERENCES CRClasses (id) ON DELETE CASCADE NULL,
    prerequisite3 INTEGER REFERENCES CRClasses (id) ON DELETE CASCADE NULL,
    prerequisite4 INTEGER REFERENCES CRClasses (id) ON DELETE CASCADE NULL
  );


CREATE TABLE
  CRUserGradedClasses (
    id SERIAL PRIMARY KEY,
    userEmail VARCHAR(255),
    classId INTEGER REFERENCES CRClasses (id) ON DELETE CASCADE,
    courseId INTEGER REFERENCES CRAvailableCourses (id) ON DELETE CASCADE,
    grade INTEGER NOT NULL,
    term INTEGER NOT NULL
  );

INSERT INTO
  CRAvailableCourses (
    name,
    brief_description,
    terms,
    credential,
    school
  )
VALUES
  (
    'Software Development Diploma',
    'Learn software development',
    4,
    'Diploma',
    'School of Technology'
  ),
  (
    'Software Development Apprenticeship',
    'Learn software development',
    4,
    'Apprenticeship',
    'School of Technology'
  ),
  (
    'Software Development Certificate',
    'Learn software development',
    4,
    'Certificate',
    'School of Technology'
  ),
  (
    'Software Development Degree',
    'Learn software development',
    4,
    'Degree',
    'School of Technology'
  );

INSERT INTO
  crUsersCourses (userEmail, courseID, registered)
VALUES
  ('Your email here', 1, TRUE),
  ('Your email here', 2, FALSE);

INSERT INTO
  CRClasses (
    classCode,
    className,
    courseId,
    availableFall,
    availableWinter,
    availableSpring,
    prerequisite1,
    prerequisite2,
    prerequisite3,
    prerequisite4
  )
VALUES
  (
    'MATH901',
    'Math for the computer industry',
    1,
    TRUE,
    TRUE,
    FALSE,
    NULL,
    NULL,
    NULL,
    NULL
  ),
  (
    'MGMT1103',
    'Essential skills for teams collaboration',
    1,
    TRUE,
    TRUE,
    FALSE,
    NULL,
    NULL,
    NULL,
    NULL
  ),
  (
    'SODV1101',
    'Programming Fundamentals',
    1,
    TRUE,
    TRUE,
    FALSE,
    NULL,
    NULL,
    NULL,
    NULL
  ),
  (
    'TECH1101',
    'Web and Internet fundamentals',
    1,
    TRUE,
    TRUE,
    FALSE,
    NULL,
    NULL,
    NULL,
    NULL
  ),
  (
    'TECH1102',
    'Internet of Things',
    1,
    TRUE,
    TRUE,
    FALSE,
    NULL,
    NULL,
    NULL,
    NULL
  ),
  (
    'DATA1201',
    'Introduction to Relational Databases',
    1,
    FALSE,
    TRUE,
    TRUE,
    3,
    NULL,
    NULL,
    NULL
  ),
  (
    'DESN2301',
    'User Experience Design',
    1,
    FALSE,
    TRUE,
    TRUE,
    NULL,
    NULL,
    NULL,
    NULL
  ),
  (
    'SODV1201',
    'Introduction to Web Programming',
    1,
    FALSE,
    TRUE,
    TRUE,
    3,
    4,
    NULL,
    NULL
  ),
  (
    'SODV1202',
    'Introduction to object oriented programming',
    1,
    FALSE,
    TRUE,
    TRUE,
    1,
    3,
    NULL,
    NULL
  ),
  (
    'TECH1201',
    'Networking Essentials',
    1,
    FALSE,
    TRUE,
    TRUE,
    NULL,
    NULL,
    NULL,
    NULL
  ),
  (
    'DATA2201',
    'Relational Databases',
    1,
    TRUE,
    FALSE,
    FALSE,
    6,
    NULL,
    NULL,
    NULL
  ),
  (
    'MGMT1104',
    'Project Management in Software',
    1,
    TRUE,
    FALSE,
    FALSE,
    2,
    NULL,
    NULL,
    NULL
  ),
  (
    'SODV2101',
    'Rapid Application Development',
    1,
    TRUE,
    FALSE,
    FALSE,
    6,
    9,
    NULL,
    NULL
  ),
  (
    'SODV2201',
    'Web Programing',
    1,
    TRUE,
    FALSE,
    FALSE,
    6,
    8,
    9,
    NULL
  ),
  (
    'SODV2202',
    'Object Oriented Programing',
    1,
    TRUE,
    FALSE,
    FALSE,
    6,
    9,
    NULL,
    NULL
  ),
  (
    'SODV2203',
    'Introduction to Game and Simulation Programming',
    1,
    FALSE,
    TRUE,
    FALSE,
    15,
    NULL,
    NULL,
    NULL
  ),
  (
    'SODV3202',
    'Mobile Application Development',
    1,
    FALSE,
    TRUE,
    FALSE,
    NULL,
    NULL,
    NULL,
    NULL
  ),
  (
    'SODV2401',
    'Algorithms and Data Structures',
    1,
    FALSE,
    TRUE,
    FALSE,
    9,
    NULL,
    NULL,
    NULL
  ),
  (
    'SODV2999',
    'Software Development Capstone Project',
    1,
    FALSE,
    TRUE,
    FALSE,
    7,
    12,
    13,
    15
  ),
  (
    'TECH2102',
    'Enterprise Computing',
    1,
    FALSE,
    TRUE,
    FALSE,
    10,
    14,
    NULL,
    NULL
  );

INSERT INTO
  CRUserGradedClasses (userEmail, classId, courseId, grade, term)
VALUES
  ('Your email here', 1, 1, 93, 1),
  ('Your email here', 2, 1, 95, 1),
  ('Your email here', 3, 1, 89, 1),
  ('Your email here', 4, 1, 100, 1),
  ('Your email here', 5, 1, 93, 1),
  ('Your email here', 6, 1, 92, 2),
  ('Your email here', 7, 1, 91, 2),
  ('Your email here', 8, 1, 94, 2),
  ('Your email here', 9, 1, 100, 2),
  ('Your email here', 10, 1, 98, 2);

-- select * from CRClasses
-- Drop Table CRClasses
-- select * from  crUsersCourses