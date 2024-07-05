import { redirect } from 'next/navigation';
import { getUser } from '@workos-inc/authkit-nextjs'

export default async function Page() {
    const user = await getUser({ ensureSignedIn: true });
    if (user) {
        redirect(`/dashboard/${user.user.email}`);
    }
    return (
        <>
            <h1>No User Loaded!!!</h1>
        </>
    );
};