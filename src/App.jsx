import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Header from './components/shared/Header';
import LoginModal from './components/shared/LoginModal';
import WorkerPanel from './components/worker/WorkerPanel';
import AdminPanel from './components/admin/AdminPanel';

export default function App() {
  const { user, isLoading, login, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLoginSuccess = async (name, password) => {
    await login(name, password);
    setShowLoginModal(false);
  };

  const isAdmin = user?.role === 'admin';
  const headerTitle = isAdmin ? 'ዋና ፓነል' : 'ትዕዛዝ አስተዳደር ስርዓት';

  if (isLoading) {
    return <div className="loading-state">Loading…</div>;
  }

  return (
    <div className="app-shell">
      <Header
        title={headerTitle}
        user={user}
        onLoginClick={() => setShowLoginModal(true)}
        onLogout={logout}
      />

      {isAdmin ? <AdminPanel /> : <WorkerPanel />}

      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}
