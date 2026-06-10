interface HeaderProps {
    onLogout: () => void;
    onAdminDashboard: () => void;
  }
  
  export function Header({ onLogout, onAdminDashboard }: HeaderProps) {
    return (
      <header style={{ borderBottom: '2px solid #ccc', paddingBottom: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>פלטפורמת למידה מבוססת AI 🚀</h1>
        <div>
          <button onClick={onLogout} style={{ marginLeft: '10px', padding: '8px', cursor: 'pointer' }}>התנתק / בית</button>
          <button onClick={onAdminDashboard} style={{ backgroundColor: '#4A5568', color: 'white', padding: '8px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>דשבורד מנהל</button>
        </div>
      </header>
    );
  }