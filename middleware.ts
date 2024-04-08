import { withAuth } from 'next-auth/middleware';

import { default as middleware } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/login',
  },
});

const config = {
  matcher: ['/employee'],
};

export { middleware, config };
