import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

export default function StudentLayout() {
  const { user, logout } = useAuth();
  return <div className="app-shell">
    <aside className="sidebar">
      <h1>Exam Hub</h1><p className="muted">Espace étudiant</p>
      <nav>
        <NavLink to="/student" end>Examens disponibles</NavLink>
        <NavLink to="/student/results">Mes résultats</NavLink>
      </nav>
      <div className="sidebar-footer"><small>{user?.name}</small><button onClick={logout}>Déconnexion</button></div>
    </aside>
    <main className="content"><Outlet /></main>
  </div>;
}
