import { getClassById } from "@/app/actions";
import { Button } from '@mui/material';
export default async function Page({ params }: { params: { email: string, classId: number, term: string } }) {
    const classInfo = await getClassById(params.classId);
    console.log(classInfo);
    return (
        <div className="flex flex-col h-full content-center align-middle text-center items-center justify-center">
            <div className="flex flex-col w-96 gap-5 rounded shadow-md  bg-gradient-to-r from-blue-400 to-blue-200">
                <h1>Register for class</h1>
                <h2>{classInfo?.classname}</h2>
                <p>{decodeURIComponent(params.email)}</p>
                <p>Register for the {classInfo?.classname}</p>
                <p>in the {params.term} Term</p>
                <form>
                    <Button type="submit">Register</Button>
                </form>
            </div>
        </div>
    );
};