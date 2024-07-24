// This file is only used in conjunction with the authkit-nextjs library
import { authkitMiddleware } from '@workos-inc/authkit-nextjs';
import LogInLogOuButtons from '@/components/appBar/loginLogoutButtons';

export default authkitMiddleware({ debug: true });

// Match against pages that require auth, e.g.:
// export const config = { matcher: ['/','/LogInLogOuButtons', '/authenticatedRoute'] };