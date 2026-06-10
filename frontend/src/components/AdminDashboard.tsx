import { AdminUser } from '../types';

interface AdminDashboardProps {
  adminData: AdminUser[];
}

export function AdminDashboard({ adminData }: AdminDashboardProps) {
  return (
    <div>
      <h2>ניהול מערכת - היסטוריית למידה 📊</h2>
      {adminData.map(u => (
        <div key={u.id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '15px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
          <h3>משתמש: {u.name} (@{u.username})</h3>
          {u.prompts.length === 0 ? <p>אין היסטוריית למידה.</p> : (
            <ul>
              {u.prompts.map(p => (
                <li key={p.id} style={{ marginBottom: '10px' }}>
                  <strong>{p.category.name} - {p.subCategory.name}:</strong> "{p.prompt}"
                  <blockquote style={{ background: '#eee', padding: '10px', marginTop: '5px', borderRadius: '4px', whiteSpace: 'pre-wrap' }}>{p.response}</blockquote>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}