'use client';
import Button from '@mui/material/Button';
import {useRouter} from 'next/navigation';

export default function SignInButton(signInUrl: any) {
    const router = useRouter();
    //console.log(signInUrl);
    return (
        <Button onClick={() => router.push(`${signInUrl.signInUrl}`)} color="inherit">Login</Button>
    );
}