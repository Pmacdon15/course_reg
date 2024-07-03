export type Course = {
  id: number;
  name: string;
  brief_description: string;
  terms: string;
  credential: string;
  school: string;
}
export type UserCourse = {
  id: number;
  name: string;
  brief_description: string;
  school: string;
  terms: string;
  registered: boolean;
  total_classes: number;
}

export type UserGradedClass = {
  id: number
  classId: number
  courseid: number
  grade: number
}


