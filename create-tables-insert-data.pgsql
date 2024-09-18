-- Drop existing tables to reset the database
DROP TABLE IF EXISTS PreReqs;

DROP TABLE IF EXISTS CRUserClasses;

DROP TABLE IF EXISTS CRUserTerms;

DROP TABLE IF EXISTS CRSeasonsClassAvailable;

DROP TABLE IF EXISTS CRClasses;

DROP TABLE IF EXISTS crUsersCourses;

DROP TABLE IF EXISTS CRSeasons;

DROP TABLE IF EXISTS CRAvailableCourses;

-- MARK: CRAvailableCourses
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

-- MARK: CRSeasons
CREATE TABLE
  CRSeasons (
    id SERIAL PRIMARY KEY,
    season VARCHAR(255) UNIQUE NOT NULL
  );

-- MARK: CRClasses
CREATE TABLE
  CRClasses (
    id SERIAL PRIMARY KEY,
    classCode VARCHAR(255) UNIQUE NOT NULL,
    className VARCHAR(255) NOT NULL,
    courseId INTEGER,
    CONSTRAINT fk_courseId FOREIGN KEY (courseId) REFERENCES CRAvailableCourses (id)
  );

-- MARK: CRSeasonsClassAvailable
CREATE TABLE
  CRSeasonsClassAvailable (
    classId INTEGER REFERENCES CRClasses (id) ON DELETE CASCADE,
    seasonId INTEGER REFERENCES CRSeasons (id) ON DELETE CASCADE,
    UNIQUE (classId, seasonId)
  );

-- MARK: crUsersCourses
-- If a user is not registered for a course, it is completed.
CREATE TABLE
  crUsersCourses (
    id SERIAL PRIMARY KEY,
    userEmail VARCHAR(255),
    courseID INTEGER REFERENCES CRAvailableCourses (id) ON DELETE CASCADE,
    registered BOOLEAN DEFAULT FALSE,
    UNIQUE (userEmail, courseID)
  );

-- MARK: CRUserTerms
CREATE TABLE
  CRUserTerms (
    id SERIAL PRIMARY KEY,
    userEmail VARCHAR(255),
    termNumber INTEGER NOT NULL,
    doneRegistration BOOLEAN DEFAULT FALSE,
    seasonId INTEGER REFERENCES CRSeasons (id) ON DELETE CASCADE
  );

-- MARK: CRUserClasses
CREATE TABLE
  CRUserClasses (
    id SERIAL PRIMARY KEY,
    userEmail VARCHAR(255),
    classId INTEGER REFERENCES CRClasses (id) ON DELETE CASCADE,
    grade INTEGER,
    termId INTEGER REFERENCES CRUserTerms (id) ON DELETE CASCADE
  );

-- MARK: Pre-reqs
CREATE TABLE
  PreReqs (
    classId INTEGER REFERENCES CRClasses (id) ON DELETE CASCADE,
    preReqId INTEGER REFERENCES CRClasses (id) ON DELETE CASCADE,
    PRIMARY KEY (classId, preReqId)
  );

-- MARK: Insert Data into CraAvailableCourses
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

-- MARK: Insert Data into Season
INSERT INTO
  CRSeasons (season)
VALUES
  ('Fall'),
  ('Winter'),
  ('Spring');

-- MARK: Insert Data into CRClasses
INSERT INTO
  CRClasses (classCode, className, courseId)
VALUES
  ('MATH901', 'Math for the computer industry', 1),
  (
    'MGMT1103',
    'Essential skills for teams collaboration',
    1
  ),
  ('SODV1101', 'Programming Fundamentals', 1),
  ('TECH1101', 'Web and Internet fundamentals', 1),
  ('TECH1102', 'Internet of Things', 1),
  (
    'DATA1201',
    'Introduction to Relational Databases',
    1
  ),
  ('DESN2301', 'User Experience Design', 1),
  ('SODV1201', 'Introduction to Web Programming', 1),
  (
    'SODV1202',
    'Introduction to object oriented programming',
    1
  ),
  ('TECH1201', 'Networking Essentials', 1),
  ('DATA2201', 'Relational Databases', 1),
  ('MGMT1104', 'Project Management in Software', 1),
  ('SODV2101', 'Rapid Application Development', 1),
  ('SODV2201', 'Web Programing', 1),
  ('SODV2202', 'Object Oriented Programing', 1),
  (
    'SODV2203',
    'Introduction to Game and Simulation Programming',
    1
  ),
  ('SODV3202', 'Mobile Application Development', 1),
  ('SODV2401', 'Algorithms and Data Structures', 1),
  (
    'SODV2999',
    'Software Development Capstone Project',
    1
  ),
  ('TECH2102', 'Enterprise Computing', 1);

-- MARK: Insert Data into CRSeasonsClassAvailable
INSERT INTO
  CRSeasonsClassAvailable (classId, seasonId)
VALUES
  (1, 1),
  (1, 2),
  (2, 1),
  (2, 2),
  (3, 1),
  (3, 2),
  (4, 1),
  (4, 2),
  (5, 1),
  (5, 2),
  (6, 2),
  (6, 3),
  (7, 2),
  (7, 3),
  (8, 2),
  (8, 3),
  (9, 2),
  (9, 3),
  (10, 2),
  (10, 3),
  (11, 1),
  (12, 1),
  (13, 1),
  (14, 1),
  (15, 1),
  (16, 2),
  (17, 2),
  (18, 2),
  (19, 2),
  (20, 2);

-- MARK: Insert Data into crUsersCourses
INSERT INTO
  crUsersCourses (userEmail, courseID, registered)
VALUES
  ('pmacdonald15@gmail.com', 1, TRUE),
  ('pmacdonald15@gmail.com', 2, FALSE);

-- MARK: Insert Data into CRUserTerms
INSERT INTO
  CRUserTerms (userEmail, termNumber, doneRegistration, seasonId)
VALUES
  ('pmacdonald15@gmail.com', 1, TRUE, 1),
  ('pmacdonald15@gmail.com', 2, TRUE, 2),
  ('pmacdonald15@gmail.com', 3, FALSE, 1);


-- Mark: Insert Data into CRUserClasses
INSERT INTO
  CRUserClasses (userEmail, classId, grade, termId)
VALUES
  ('pmacdonald15@gmail.com', 1, 93, 1),
  ('pmacdonald15@gmail.com', 2, 95, 1),
  ('pmacdonald15@gmail.com', 3, 89, 1),
  ('pmacdonald15@gmail.com', 4, 100, 1),
  ('pmacdonald15@gmail.com', 5, 93, 1),
  ('pmacdonald15@gmail.com', 6, 92, 2),
  ('pmacdonald15@gmail.com', 7, 91, 2),
  ('pmacdonald15@gmail.com', 8, 94, 2),
  ('pmacdonald15@gmail.com', 9, 100, 2),
  ('pmacdonald15@gmail.com', 10, 98, 2),
  ('pmacdonald15@gmail.com', 11, NULL, 3);

INSERT INTO
  PreReqs (classId, preReqId)
VALUES
  (6, 3),
  (8, 3),
  (8, 4),
  (9, 1),
  (9, 3),
  (11, 6),
  (12, 2),
  (13, 6),
  (13, 9),
  (14, 6),
  (14, 8),
  (14, 9),
  (15, 6),
  (15, 9),
  (16, 15),
  (18, 9),
  (19, 7),
  (19, 12),
  (19, 13),
  (19, 15),
  (20, 10),
  (20, 14);

-- -- cruserscourses
-- -- cravailablecourses
-- -- crclasses