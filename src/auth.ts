import { useEffect, useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import type { AuthUser } from 'aws-amplify/auth';
import type { Post } from './types';

/** True when the signed-in user's access token lists the Admin group. */
export function useIsAdmin(authStatus: string) {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (authStatus !== 'authenticated') {
      setIsAdmin(false);
      return;
    }
    fetchAuthSession().then((session) => {
      const groups = (session.tokens?.accessToken.payload['cognito:groups'] as string[] | undefined) ?? [];
      setIsAdmin(groups.includes('Admin'));
    });
  }, [authStatus]);
  return isAdmin;
}

/** The owner field stores the Cognito identity; accept the forms Amplify may use. */
export function isOwner(post: Post, user: AuthUser | undefined) {
  if (!user || !post.owner) return false;
  return [user.userId, user.username, `${user.userId}::${user.username}`].includes(post.owner);
}
