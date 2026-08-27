import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  return <div className="app-shell">
    <aside className="sidebar">
      <h1>Exam Hub</h1><p className="muted">Administration</p>
      <nav>
        <NavLink to="/admin" end>Tableau de bord</NavLink>
        <NavLink to="/admin/students">Étudiants</NavLink>
        <NavLink to="/admin/courses">Cours</NavLink>
        <NavLink to="/admin/exams">Examens</NavLink>
      </nav>
      <div className="sidebar-footer"><small>{user?.name}</small><button onClick={logout}>Déconnexion</button></div>
    </aside>
    <main className="content"><Outlet /></main>
  </div>;
}
