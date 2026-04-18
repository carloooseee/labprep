import { useState, useEffect } from 'react';
import { PaperAirplaneIcon, BellAlertIcon, CheckCircleIcon, ArrowPathIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { db } from '../../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';


export default function Notifications() {
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState('All Users');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'broadcasts'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBroadcasts(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSend = async () => {
    if (!title || !message) {
      alert("Please fill in both title and message.");
      return;
    }
    setSending(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, 'broadcasts', editingId), {
          title,
          message,
          recipients: target
        });
        alert("Broadcast updated successfully!");
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'broadcasts'), {
          title,
          message,
          recipients: target,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          status: 'Sent'
        });
        alert("Broadcast sent successfully!");
      }
      setTitle('');
      setMessage('');
      setTarget('All Users');
    } catch (error) {
      console.error("Error saving broadcast:", error);
      alert("Failed to save broadcast.");
    } finally {
      setSending(false);
    }
  };

  const handleEdit = (broadcast: any) => {
    setEditingId(broadcast.id);
    setTitle(broadcast.title);
    setMessage(broadcast.message);
    setTarget(broadcast.recipients);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setMessage('');
    setTarget('All Users');
  };

  const handleDelete = async (id: string) => {
    // Try to delete directly, bypassing prompt in case the environment suppresses window prompts.
    console.log("Attempting to delete broadcast with ID:", id);
    try {
      const docRef = doc(db, 'broadcasts', id);
      await deleteDoc(docRef);
      console.log("Broadcast deleted successfully");
      if (editingId === id) {
        cancelEdit();
      }
    } catch (error) {
      console.error("Error deleting broadcast:", error);
      alert("Failed to delete broadcast: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <ArrowPathIcon className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-[#e5e9eb]">
        <div>
          <h2 className="text-2xl font-display font-semibold text-gray-900">Push Notifications</h2>
          <p className="text-gray-500 mt-1">Send broadcast messages to patients and hospital staff.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Compose Notification */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-[#e5e9eb] p-6 h-fit">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between">
            <span className="flex items-center">
              {editingId ? <PencilIcon className="w-5 h-5 mr-2 text-blue-500" /> : <PaperAirplaneIcon className="w-5 h-5 mr-2 text-blue-500" />}
              {editingId ? 'Edit Broadcast' : 'New Broadcast'}
            </span>
            {editingId && (
              <button 
                onClick={cancelEdit}
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Cancel
              </button>
            )}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
              <select 
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none font-bold"
              >
                <option>All Users</option>
                <option>Patients Only</option>
                <option>Hospitals Only</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Notification Title" 
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none font-bold" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea 
                rows={4} 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..." 
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none resize-none font-medium"
              ></textarea>
            </div>
            <button 
              onClick={handleSend}
              disabled={sending}
              className={`w-full ${sending ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold py-3 rounded-xl transition-colors shadow-sm flex justify-center items-center`}
            >
              {sending ? <ArrowPathIcon className="w-5 h-5 animate-spin mr-2" /> : null}
              <span>{sending ? (editingId ? 'Updating...' : 'Sending...') : (editingId ? 'Save Changes' : 'Send Now')}</span>
            </button>
          </div>
        </div>

        {/* History */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-[#e5e9eb] p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <BellAlertIcon className="w-5 h-5 mr-2 text-emerald-500" />
            Broadcast History
          </h3>
          <div className="space-y-4">
            {broadcasts.map((broadcast) => (
              <div key={broadcast.id} className="p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-colors animate-in slide-in-from-right-4 duration-300">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-gray-900">{broadcast.title}</h4>
                    <span className="text-xs text-gray-400 font-medium">{broadcast.date}</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleEdit(broadcast);
                      }}
                      className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-500 rounded-lg transition-all shadow-sm hover:shadow active:scale-95"
                      title="Edit Notification"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(broadcast.id);
                      }}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-all shadow-sm hover:shadow active:scale-95"
                      title="Delete Notification"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">{broadcast.message}</p>
                <div className="flex items-center justify-between text-[10px] font-bold tracking-wider uppercase">
                  <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded-md">Audience: {broadcast.recipients}</span>
                  <span className="flex items-center text-green-600">
                    <CheckCircleIcon className="w-4 h-4 mr-1" />
                    {broadcast.status}
                  </span>
                </div>
              </div>
            ))}
            {broadcasts.length === 0 && (
              <div className="text-center py-12 text-gray-400 italic">No broadcast history available.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
