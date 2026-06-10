import { useState } from 'react';

interface AuthFormProps {
  authMode: 'login' | 'register';
  setAuthMode: (mode: 'login' | 'register') => void;
  onSubmit: (e: React.FormEvent, data: any) => void;
}

export function AuthForm({ authMode, setAuthMode, onSubmit }: AuthFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    onSubmit(e, { username, password, fullName });
    // ניקוי שדות מקומי
    if (authMode === 'register') setFullName('');
    setUsername('');
    setPassword('');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff' }}>
      <h2>{authMode === 'login' ? 'התחברות למערכת 🔑' : 'הרשמת משתמש חדש 👤'}</h2>
      <form onSubmit={handleSubmit}>
        {authMode === 'register' && (
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>שם מלא:</label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
          </div>
        )}
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>שם משתמש (Username):</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>סיסמה:</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          {authMode === 'login' ? 'התחבר' : 'בצע הרשמה והכנס'}
        </button>
      </form>
      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        {authMode === 'login' ? (
          <p>אין לך חשבון? <span onClick={() => setAuthMode('register')} style={{ color: '#007BFF', cursor: 'pointer', textDecoration: 'underline' }}>הירשם כאן</span></p>
        ) : (
          <p>כבר יש לך חשבון? <span onClick={() => setAuthMode('login')} style={{ color: '#007BFF', cursor: 'pointer', textDecoration: 'underline' }}>התחבר כאן</span></p>
        )}
      </div>
    </div>
  );
}