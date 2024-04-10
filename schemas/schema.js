const pool = require('../neon-db/db');

async function createTables() {
  const usersTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      name VARCHAR(100),
      email VARCHAR(100) PRIMARY KEY,
      profiile  VARCHAR(1000),
      password VARCHAR(100),
      isSuperAdmin boolean DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(usersTableQuery);
    console.log('user Table created successfully.');
  } catch (error) {
    console.error('Error creating table:', error);
  }
}

async function createCourseTable() {
    const courseTableQuery = `
    CREATE TABLE  IF NOT EXISTS  courses(
        course_id VARCHAR(36) PRIMARY KEY NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(50),
        level INTEGER ,
        photo VARCHAR(1000),
        price DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
  
    try {
      await pool.query(courseTableQuery);
      console.log('course Table created successfully.');
    } catch (error) {
      console.error('Error creating table:', error);
    }
  }

async function createEnrollmentTable(){
    const enrollmentQuery=`
    CREATE TABLE IF NOT EXISTS enrollments (
        user_id VARCHAR(36),
        course_id VARCHAR(36),
        enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, course_id),
        CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(email) ON DELETE CASCADE,
        CONSTRAINT fk_course_id FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
      );
    `
    try {
        await pool.query(enrollmentQuery);
        console.log('enrollment Table created successfully.');
      } catch (error) {
        console.error('Error creating table:', error);
      }
}

createTables();
createCourseTable();
createEnrollmentTable();