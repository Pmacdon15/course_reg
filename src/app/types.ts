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
  classid: number
  courseid: number
  grade: number
  term: string
}

export type Class ={
  id: number
  courseid: number
  classname: string
  availableFall: boolean,
  availableWinter: boolean,
  availableSpring: boolean,
  prerequisite1: string,
  prerequisite2: string,
  prerequisite3: string,
  prerequisite4: string,
}

