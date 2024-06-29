import { getUser } from '@workos-inc/authkit-nextjs'
export default async function Page() {
    const user = await getUser({ ensureSignedIn: true });
    return (
        <>
            <h1>No User Loaded!!!</h1>
        </>
    );
};