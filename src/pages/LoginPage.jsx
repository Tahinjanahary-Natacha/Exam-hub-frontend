import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import Message from '../components/Message.jsx';

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@examhub.local');
  const [password, setPassword] = useState('Admin123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />;

  async function submit(event) {
    event.preventDefault();
    setError(''); setLoading(true);
    try {
      const loggedUser = await login(email, password);
      navigate(loggedUser.role === 'admin' ? '/admin' : '/student', { replace: true });
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  return <div className="login-page">
    <form className="card login-card" onSubmit={submit}>
      <div><span className="badge">QCM</span><h1>Connexion à Exam Hub</h1><p className="muted">Administrateur et étudiants utilisent la même page.</p></div>
      <Message error={error} />
      <label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></label>
      <label>Mot de passe<input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></label>
      <button className="primary" disabled={loading}>{loading ? 'Connexion…' : 'Se connecter'}</button>
    </form>
  </div>;
}
