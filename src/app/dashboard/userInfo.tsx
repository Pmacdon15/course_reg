import Image from "next/image";
export default function userInfo({ user }: { user: any }) {
    console.log(user);
    return (
        <div className="flex flex-col h-2/6 h-min w-96 bg-gradient-to-r from-blue-400 to-blue-200 rounded-lg text-center shadow-md p-4">
            <div>
                Hello {user.user?.firstName} {user.user?.lastName}!
            </div>
            <div className="flex justify-center"> 
                <Image
                    src={user.user?.profilePictureUrl}
                    alt="user picture"
                    width={50}
                    height={50}
                    objectFit="cover"
                    className="rounded-full"
                />
            </div>
            <div>
                Email: {user.user?.email}
            </div>
        </div>
    );
};