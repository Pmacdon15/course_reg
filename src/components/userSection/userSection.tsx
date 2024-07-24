import { UserCourse} from "@/types/types";
import UserInfo from "@/components/userSection/userInfo";
import UserCourses from "@/components/userSection/userCourses";
export default function UserSection({ user, userCourses }: { user: any, userCourses: UserCourse[] }) {
    return (
        <div className='flex flex-col w-full md:w-96 gap-5 '>
            <UserInfo user={user} />
            <UserCourses usersCourses={userCourses} />
        </div>
    );
};