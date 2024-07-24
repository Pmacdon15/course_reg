import { redirect } from 'next/navigation';
import { getUser } from '@workos-inc/authkit-nextjs'

export default async function Page() {
    const user = await getUser({ ensureSignedIn: true });
    //const email = user?.user?.email;
    if (user) {
        redirect(`/register/${user.user.email}`);
    }
    return (
        <>
            <h1>No User Loaded!!!</h1>
        </>
    );
};