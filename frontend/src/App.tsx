import { useState, useEffect } from 'react';
import { apiService } from './services/api';
import { Header } from './components/Header';
import { AuthForm } from './components/AuthForm';
import { LessonGenerator } from './components/LessonGenerator';
import { AdminDashboard } from './components/AdminDashboard';
import { Category, LessonHistory, AdminUser } from './types'; 
import { ToastContainer, toast } from 'react-toastify';
import { useUser } from './context/UserContext'; 
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { user, setUser } = useUser(); 
  const currentUser = user; 

  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const [selectedCatId, setSelectedCatId] = useState<number | ''>('');
  const [selectedSubCatId, setSelectedSubCatId] = useState<number | ''>('');
  const [userPrompt, setUserPrompt] = useState('');
  const [generatedLesson, setGeneratedLesson] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userHistory, setUserHistory] = useState<LessonHistory[]>([]);
  const [adminData, setAdminData] = useState<AdminUser[]>([]);

  useEffect(() => {
    apiService.getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    if (currentUser) { loadUserHistory(currentUser.id); }
  }, [currentUser]);

  const loadUserHistory = async (userId: number) => {
    try {
      const history = await apiService.getUserHistory(userId);
      setUserHistory(history);
    } catch (err) { console.error(err); }
  };

  const loadAdminDashboard = async () => {
    try {
      const data = await apiService.getAdminDashboard();
      setAdminData(data);
      setIsAdmin(true);
    } catch (err) { toast.error('שגיאה בטעינת נתוני מנהל ❌'); }
  };

  const handleAuthSubmit = async (e: React.FormEvent, formData: any) => {
    e.preventDefault();
    try {
      if (authMode === 'register') {
        const userData = await apiService.registerUser(formData.username, formData.password, formData.fullName);
        toast.success('הרישום בוצע בהצלחה! 🎉');
        setUser({ id: userData.id, name: userData.name }); // שימוש ב-setUser מה-Context
        localStorage.setItem('user', JSON.stringify({ id: userData.id, name: userData.name }));
      } else {
        const userData = await apiService.loginUser(formData.username, formData.password);
        toast.success(`ברוך הבא, ${userData.name}! 👋`);
        setUser({ id: userData.id, name: userData.name }); // שימוש ב-setUser מה-Context
        localStorage.setItem('user', JSON.stringify({ id: userData.id, name: userData.name }));
      }
    } catch (err: any) {
        toast.error(err.response?.data?.error || 'הפעולה נכשלה, אנא נסה שנית ❌');
    }
  };

  const handleSendPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedCatId || !selectedSubCatId || !userPrompt) return;
    setLoading(true);
    setGeneratedLesson(null);
    try {
      const result = await apiService.createLesson(currentUser.id, Number(selectedCatId), Number(selectedSubCatId), userPrompt);
      setGeneratedLesson(result.response);
      setUserPrompt('');
      loadUserHistory(currentUser.id);
      toast.success('השיעור נוצר בהצלחה! ✨');
    } catch (err) { toast.error('שגיאה ביצירת השיעור ❌'); } finally { setLoading(false); }
  };

  const handleLogout = () => {
    setUser(null); // ניקוי משתמש מה-Context
    localStorage.removeItem('user');
    setIsAdmin(false);
    setSelectedCatId('');
    setSelectedSubCatId('');
    setUserPrompt('');
    setGeneratedLesson(null);
    setUserHistory([]);
    setAuthMode('login');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', direction: 'rtl', maxWidth: '1200px', margin: '0 auto' }}>
      <Header onLogout={handleLogout} onAdminDashboard={loadAdminDashboard} />

      {isAdmin ? (
        <AdminDashboard adminData={adminData} />
      ) : !currentUser ? (
        <AuthForm authMode={authMode} setAuthMode={setAuthMode} onSubmit={handleAuthSubmit} />
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          <LessonGenerator 
            categories={categories} selectedCatId={selectedCatId} setSelectedCatId={setSelectedCatId}
            selectedSubCatId={selectedSubCatId} setSelectedSubCatId={setSelectedSubCatId}
            userPrompt={userPrompt} setUserPrompt={setUserPrompt} loading={loading}
            generatedLesson={generatedLesson} onSend={handleSendPrompt}
          />
          
          <div style={{ flex: 1, border: '1px solid #ccc', padding: '20px', borderRadius: '8px', maxHeight: '600px', overflowY: 'auto' }}>
            <h3>היסטוריית הלמידה שלך 📚</h3>
            {userHistory.length === 0 ? <p>אין שיעורים שמורים.</p> : (
              userHistory.map(h => (
                <div key={h.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
                  <small style={{ color: '#666' }}>{new Date(h.createdAt).toLocaleDateString()}</small>
                  <h4 style={{ margin: '5px 0' }}>{h.category.name} {'->'} {h.subCategory.name}</h4>
                  <p style={{ margin: '0 0 5px 0', fontStyle: 'italic', color: '#444' }}>"{h.prompt}"</p>
                  <button onClick={() => setGeneratedLesson(h.response)} style={{ padding: '3px 8px', fontSize: '12px', cursor: 'pointer' }}>הצג שוב 📋</button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      <ToastContainer position="top-left" autoClose={3000} rtl />
    </div>
  );
}

export default App;