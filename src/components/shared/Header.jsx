export default function Header({ title, user, onLoginClick, onLogout }) {
  return (
    <header className="app-header">
      <div className="app-header__title">{title}</div>
      <div className="app-header__right">
        {user ? (
          <>
            <span className="app-header__greeting">Hey {user.name}</span>
            <button className="btn btn--ghost-light" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <button className="btn btn--primary" onClick={onLoginClick}>
            Login
          </button>
        )}
      </div>
    </header>
  );
}
