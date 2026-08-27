export default function Message({ error, success }) {
  if (error) return <div className="alert error">{error}</div>;
  if (success) return <div className="alert success">{success}</div>;
  return null;
}
