import { getClassById } from "@/actions/actions";
import RegisterForClass from "@/components/registerForClass";

export default async function Page({ params }: { params: { email: string, classId: number, term: string } }) {
    const classInfo = await getClassById(params.classId);
    // console.log(classInfo);
    const decodedEmail = decodeURIComponent(params.email);

    return (
        <div className="flex flex-col h-full content-center align-middle text-center items-center justify-center">
            <RegisterForClass classInfo={classInfo} email={decodedEmail} classId={params.classId} term={params.term} />
        </div>
    );
};