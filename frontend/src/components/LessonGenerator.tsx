import ReactMarkdown from 'react-markdown';
import { toast } from 'react-toastify';

interface Category {
  id: number;
  name: string;
  subCategories: { id: number; name: string }[];
}

interface LessonGeneratorProps {
  categories: Category[];
  selectedCatId: number | '';
  setSelectedCatId: (id: number | '') => void;
  selectedSubCatId: number | '';
  setSelectedSubCatId: (id: number | '') => void;
  userPrompt: string;
  setUserPrompt: (val: string) => void;
  loading: boolean;
  generatedLesson: string | null;
  onSend: (e: React.FormEvent) => void;
}

export function LessonGenerator({
  categories, selectedCatId, setSelectedCatId,
  selectedSubCatId, setSelectedSubCatId,
  userPrompt, setUserPrompt, loading, generatedLesson, onSend
}: LessonGeneratorProps) {
  
  const currentSubCategories = categories.find(c => c.id === Number(selectedCatId))?.subCategories || [];
  const isButtonDisabled = loading || !selectedCatId || !selectedSubCatId || !userPrompt.trim();

  return (
    <div style={{ flex: 2, border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
      <form onSubmit={onSend}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <div style={{ flex: 1 }}>
            <label>בחר תחום:</label>
            <select value={selectedCatId} onChange={e => { setSelectedCatId(e.target.value ? Number(e.target.value) : ''); setSelectedSubCatId(''); }} style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
              <option value="">-- בחר קטגוריה --</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label>בחר נושא:</label>
            <select value={selectedSubCatId} onChange={e => setSelectedSubCatId(e.target.value ? Number(e.target.value) : '')} disabled={!selectedCatId} style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
              <option value="">-- בחר תת-קטגוריה --</option>
              {currentSubCategories.map(sc => <option key={sc.id} value={sc.id}>{sc.name}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>מה תרצה לדעת? (Prompt):</label>
          <textarea value={userPrompt} onChange={e => setUserPrompt(e.target.value)} style={{ width: '100%', height: '100px', padding: '8px', marginTop: '5px' }} placeholder="לדוגמה: ספר לי על ההיסטוריה של המחשב..."></textarea>
        </div>
        <button 
          type="submit" 
          disabled={isButtonDisabled} 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: isButtonDisabled ? '#A0AEC0' : '#28A745', 
            color: 'white', border: 'none', borderRadius: '5px', 
            cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s ease'
          }}
        >
          {loading ? 'ה-AI מייצר עבורך שיעור... ⏳' : 'שלח בקשה ל-AI ✨'}
        </button>
      </form>

      {loading && (
        <div style={{ marginTop: '25px', padding: '30px', border: '2px dashed #007BFF', borderRadius: '5px', backgroundColor: '#E3F2FD', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #007BFF', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '10px' }}></div>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <h3 style={{ color: '#007BFF', margin: 0 }}>הבינה המלאכותית מכינה עבורך מערך שיעור... 🧠✨</h3>
        </div>
      )}

      {generatedLesson && (
        <div style={{ marginTop: '25px', padding: '15px', border: '2px solid #28A745', borderRadius: '5px', backgroundColor: '#E8F5E9' }}>
          <h3>השיעור שנוצר:</h3>
          <div style={{ lineHeight: '1.6' }}>
            <button onClick={() => { navigator.clipboard.writeText(generatedLesson); navigator.clipboard.writeText(generatedLesson); 
                toast.success('השיעור הועתק ללוח בהצלחה! 📋'); }} style={{ marginBottom: '10px', padding: '5px 10px', cursor: 'pointer', backgroundColor: '#e0e0e0', border: '1px solid #ccc', borderRadius: '4px' }}>📋 העתק שיעור</button>
            <button onClick={() => {
              const element = document.createElement("a");
              const file = new Blob([generatedLesson], {type: 'text/plain'});
              element.href = URL.createObjectURL(file);
              element.download = "my_lesson.txt";
              document.body.appendChild(element);
              element.click();
            }} style={{ marginBottom: '10px', marginRight: '10px', padding: '5px 10px', cursor: 'pointer', backgroundColor: '#e0e0e0', border: '1px solid #ccc', borderRadius: '4px' }}>💾 הורד כקובץ TXT</button>
            <ReactMarkdown>{generatedLesson}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}