'use client';
import { Button } from '@mui/material';
import { useFormState } from 'react-dom'
import { registerUserForClass } from '@/actions/actions';
import { Class } from '@/types/types';

const initialState = {
  message: '',
}

export default function RegisterForClass({ classInfo, email, classId, term }: { classInfo: Class, email: string, classId: number, term: string }) {
  const updateFormWithWithInfo = registerUserForClass.bind(null, email, classId, term);
  const [state, formAction] = useFormState(updateFormWithWithInfo, initialState);
  return (
    <div className="flex flex-col w-96 gap-5 rounded-md shadow-md  bg-gradient-to-r from-blue-400 to-blue-200">
      <h1>Register for class</h1>
      <h2>{classInfo?.classname}</h2>
      <p>{decodeURIComponent(email)}</p>
      <p>Register for the {classInfo?.classname}</p>
      <p>in the {term} Term</p>
      <form action={formAction}>
        <Button type="submit">Register</Button>
      </form>
    </div>
  );
}