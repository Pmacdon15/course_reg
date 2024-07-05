import {Class} from "@/app/types";
export default function AvailableClasses({ classes}:{classes: Class[]}) {
    return (
        <div className="h-96 md:h-[600px] w-full md:w-96 bg-gradient-to-r from-blue-400 to-blue-200 overflow-auto resize-y sm:resize-none rounded-md shadow-md p-4">
            <h1 className="text-2xl text-center font-bold mb-4">Available Classes for your programs</h1>
            <ul>
                {classes.map((course: Class) => (
                    <li key={course.id} className="mb-4">
                    </li>
                ))}
            </ul>
        </div>

    );
};