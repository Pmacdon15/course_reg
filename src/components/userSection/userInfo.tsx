import Image from "next/image";
export default function userInfo({ user }: { user: any }) {
    return (
        <div className="flex flex-col h-2/6 justify-center w-full bg-gradient-to-r from-blue-400 to-blue-200 rounded-lg text-center shadow-md p-4 ">
            <div className="text-xl font-bold">
                Hello {user.user?.firstName} {user.user?.lastName}!
            </div>
            <div className="flex justify-center "> 
                <Image
                    src={user.user?.profilePictureUrl}
                    alt="user picture"
                    width={50}
                    height={50}
                    className="rounded-full"
                />
            </div>
            <div>
                Email: {user.user?.email}
            </div>
        </div>
    );
};