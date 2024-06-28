async function getUserCourses(email: string) {
    //Todo - get courses from the database
    //for now just return a list of courses
    return [
        {
            id: 1,
            name: 'Software Development Diploma',
            description: 'Learn software development',
            duration: '4 terms'
        }
    ];
}

export default async function UserCourses({ email }: { email: string }) {
    const userCourses = await getUserCourses(email);
    return (
        <div className="h-4/6 h-min w-full bg-gradient-to-r from-blue-400 to-blue-200 rounded-lg shadow-md p-4">
            test
        </div>
    );
};