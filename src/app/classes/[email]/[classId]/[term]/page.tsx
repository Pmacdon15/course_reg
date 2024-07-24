import { getClassById } from "@/app/actions";
export default async function Page({ params }: { params: { email: string, classId: number, term: string } }) {
    const classInfo = await getClassById(params.classId);
    console.log(classInfo);
    return (
        <div className="flex flex-col h-full content-center align-middle items-center justify-center">
            <div className="flex flex-col w-4/6 gap-5 bg-gradient-to-r from-blue-400 to-blue-200">
                <h1>Register for class</h1>
                <h2> {classInfo?.classname}</h2>
                {decodeURIComponent(params.email)}
                {params.term}
                {params.classId}
                {classInfo?.classname}
            </div>
        </div>
    );
};