import { useEffect, useState } from 'react';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

export default function Header() {
  const { authStatus, user, signOut } = useAuthenticator((ctx) => [ctx.authStatus, ctx.user]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (authStatus === 'authenticated') setOpen(false);
  }, [authStatus]);

  return (
    <header className="topbar">
      <div className="brand">
        <span className="logo">📌</span>
        <span>Campus Board</span>
        <span className="tag">University of Jaffna</span>
      </div>
      <div className="who">
        {authStatus === 'authenticated' ? (
          <>
            <span className="email">{user?.signInDetails?.loginId}</span>
            <button onClick={signOut}>Sign out</button>
          </>
        ) : (
          <button className="primary" onClick={() => setOpen(true)}>
            Sign in
          </button>
        )}
      </div>
      {open && (
        <div className="modal" onClick={() => setOpen(false)}>
          <div className="modal-body" onClick={(e) => e.stopPropagation()}>
            <Authenticator />
          </div>
        </div>
      )}
    </header>
  );
}
