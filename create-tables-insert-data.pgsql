CREATE TABLE
  CRAvailableCourses (
    id SERIAL4 PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    brief_description VARCHAR(255) NOT NULL,
    long_description TEXT,
    terms INTEGER NOT NULL,
    credential VARCHAR(255) NOT NULL,
    school VARCHAR(255) NOT NULL
  );

CREATE TABLE
  crUsersCourses (
    userEmail VARCHAR(255) PRIMARY KEY,
    courseID INTEGER REFERENCES CRAvailableCourses (id) ON DELETE CASCADE,
    registered BOOLEAN DEFAULT FALSE,
    UNIQUE (userEmail, courseID)
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
  ('your email here', 1, TRUE);