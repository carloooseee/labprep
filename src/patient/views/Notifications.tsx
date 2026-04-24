import { useState, useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { 
  BellAlertIcon as BellAlertIconOutline, 
  XMarkIcon, 
  TrashIcon,
  SpeakerWaveIcon 
} from '@heroicons/react/24/outline';
import { BuildingOfficeIcon, BellAlertIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { collection, addDoc, onSnapshot, query, where, deleteDoc, doc, Timestamp } from 'firebase/firestore';

interface Reminder {
  id: string;
  title: string;
  body: string;
  userId: string;
  createdAt: any;
  type?: 'reminder' | 'broadcast';
}

export default function Notifications() {
  const { testGuides, broadcasts } = useAppContext();
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  // Form & Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState('');
  const [testDate, setTestDate] = useState('');
  const [reminderType, setReminderType] = useState('Fasting');
  const [reminderDateTime, setReminderDateTime] = useState('');
  const [message, setMessage] = useState('');

  // 1. Fetch persistent reminders and sync with state
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'reminders'),
      where('userId', '==', user.uid)
    );


    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        type: 'reminder' as const
      } as Reminder));
      
      // Sort in memory to avoid requiring a composite index immediately
      data.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });

      setReminders(data);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Reminders Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  useEffect(() => {
    if (testGuides.length > 0 && !selectedTestId) {
      setSelectedTestId(testGuides[0].id);
    }
  }, [testGuides]);

  useEffect(() => {
    // Request permission and setup channels on mount
    const setupNotifications = async () => {
      try {
        const perms = await LocalNotifications.requestPermissions();
        if (perms.display === 'granted') {
          // Create channel for Android (required for importance/sound)
          await LocalNotifications.createChannel({
            id: 'reminders',
            name: 'Medical Reminders',
            description: 'Alerts for lab test preparations',
            importance: 5, // High importance
            visibility: 1,
            sound: 'beep.wav', // Fallback to default if not found
            vibration: true,
          });
        }
      } catch (e) {
        console.error("Notification setup error:", e);
      }
    };
    setupNotifications();
  }, []);

  const scheduleReminder = async () => {
    if (!remindersEnabled) {
      alert('Please enable reminders in settings first.');
      return;
    }

    if (!selectedTestId || !reminderDateTime) {
      alert('Please select a test and set a reminder date/time.');
      return;
    }

    const testProc = testGuides.find(p => p.id === selectedTestId);
    const testName = testProc ? (testProc.procedureName || testProc.name) : 'Lab Test';

    const d = new Date(reminderDateTime);
    const bodyText = message || `Time to prepare for your ${testName}.`;
    
    try {
      // A. Schedule Native Notification
      const safeId = Math.floor(Math.random() * 1000000);
      await LocalNotifications.schedule({
        notifications: [
          {
            title: `Prep Alert: ${testName}`,
            body: bodyText,
            id: safeId,
            schedule: { at: d },
            channelId: 'reminders', // Connect to the high-importance channel
            smallIcon: 'ic_stat_name', // Common convention for Android icons
            extra: { testId: selectedTestId }
          },
        ],
      });

      // B. Persist to Firestore
      await addDoc(collection(db, 'reminders'), {
        userId: user?.uid,
        title: testName,
        body: `Scheduled for ${d.toLocaleString()}: ${reminderType}`,
        message: bodyText,
        createdAt: Timestamp.now(),
        scheduledAt: Timestamp.fromDate(d),
        nativeId: safeId
      });

      setIsModalOpen(false);

      // Reset Form
      setMessage('');
      setReminderDateTime('');
      setTestDate('');
    } catch (error) {
      console.error("Error scheduling reminder:", error);
      alert("Failed to save reminder.");
    }
  };

  // Helper for user to test if notifications are working on their APK
  const testNotification = async () => {
    const testTime = new Date(Date.now() + 5000); // 5 seconds from now
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: "🔔 Test Notification",
            body: "Your LabPrep reminders are correctly configured!",
            id: 999,
            schedule: { at: testTime },
            channelId: 'reminders',
          }
        ]
      });
      alert("Test scheduled for 5 seconds from now. You can close the app to see it hit.");
    } catch (e) {
      alert("Test failed. Check permissions.");
    }
  };

  const deleteReminder = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'reminders', id));
    } catch (error) {
      console.error("Error deleting reminder:", error);
    }
  };

  // Combine broadcast messages and personal reminders for the feed
  const allNotifications = [
    ...broadcasts.map(b => ({
      id: b.id,
      title: b.title,
      body: b.message,
      createdAt: b.date,
      type: 'broadcast' as const
    })),
    ...reminders
  ].sort((a, b) => {
    // Basic sorting for the feed
    const dateA = typeof a.createdAt === 'string' ? new Date(a.createdAt).getTime() : a.createdAt?.seconds * 1000;
    const dateB = typeof b.createdAt === 'string' ? new Date(b.createdAt).getTime() : b.createdAt?.seconds * 1000;
    return dateB - dateA;
  });

  return (
    <div className="p-6 pb-24 pt-4">

      {/* Hero Card */}
      <div className="bg-gradient-to-r from-[#fe9a00] to-[#ff3000] rounded-[2rem] p-8 text-white mb-8 shadow-xl shadow-[var(--color-primary)]/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20"><BellAlertIcon className="w-24 h-24" /></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-display font-bold mt-4 leading-tight">Notifications & Reminders</h2>
          <div className="flex items-center mt-6 space-x-2">
            <span className="font-body text-sm font-medium">Stay on track with your test preparations</span>
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="mb-8">
        <h3 className="text-xl font-display font-bold text-[var(--color-on-surface)] mb-4 tracking-tight">Settings</h3>
        <div className="bg-[var(--color-surface-container-lowest)] p-5 rounded-2xl border border-[#e5e9eb] shadow-sm flex items-center justify-between transition-all hover:bg-white hover:shadow-md">
          <div className="pr-4">
            <h4 className="font-bold font-display text-[var(--color-on-surface)] tracking-tight">Enable Reminders</h4>
            <p className="text-xs mt-1 font-body text-[var(--color-on-surface-variant)] leading-relaxed">Receive push notifications for your upcoming tests</p>
          </div>
          {/* Custom Toggle Switch */}
          <button 
            onClick={() => setRemindersEnabled(!remindersEnabled)}
            className={`w-12 h-7 rounded-full flex items-center shrink-0 transition-colors duration-300 focus:outline-none ${remindersEnabled ? 'bg-gradient-to-r from-[#fe9a00] to-[#ff3000]' : 'bg-gray-300'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${remindersEnabled ? 'translate-x-[24px]' : 'translate-x-[4px]'}`} />
          </button>
        </div>
        
        {/* Test Notification Utility */}
        <button 
          onClick={testNotification}
          className="mt-4 flex items-center justify-center space-x-2 w-full py-2.5 border border-dashed border-gray-300 rounded-xl text-gray-500 text-xs font-bold hover:bg-gray-50 transition-colors"
        >
          <BellAlertIconOutline className="w-4 h-4" />
          <span>Test Notification System (5s)</span>
        </button>
      </div>

      <button
        onClick={() => {
          if (!remindersEnabled) {
            alert('Please enable reminders in settings first.');
            return;
          }
          setIsModalOpen(true);
        }}
        className="w-full bg-gradient-to-r from-[#fe9a00] to-[#ff3000] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#ff3000]/20 active:scale-95 transition-all hover:shadow-xl hover:-translate-y-0.5"
      >
        + Add New Reminder
      </button>

      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-display font-bold text-[var(--color-on-surface)] mb-2 tracking-tight">Your Inbox</h3>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          allNotifications.map((notif) => (
            <div key={notif.id} className={`p-5 rounded-2xl flex items-start space-x-4 border transition-all animate-in slide-in-from-bottom-4 duration-300 ${
              notif.type === 'broadcast' 
                ? 'bg-blue-50/50 border-blue-100 shadow-sm' 
                : 'bg-[var(--color-surface-container-lowest)] border-[#e5e9eb]'
            }`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                notif.type === 'broadcast' ? 'bg-blue-500 text-white' : 'bg-orange-50 text-orange-600'
              }`}>
                {notif.type === 'broadcast' ? (
                  <SpeakerWaveIcon className="w-6 h-6" />
                ) : (
                  <BellAlertIconOutline className="w-6 h-6" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className={`font-bold font-display tracking-tight leading-tight ${
                    notif.type === 'broadcast' ? 'text-blue-900' : 'text-[var(--color-on-surface)]'
                  }`}>{notif.title}</h4>
                  
                  {notif.type === 'reminder' && (
                    <button 
                      onClick={() => deleteReminder(notif.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className={`text-xs mt-1.5 font-body leading-relaxed ${
                  notif.type === 'broadcast' ? 'text-blue-700/80' : 'text-[var(--color-on-surface-variant)]'
                }`}>{notif.body}</p>
                
                <div className="mt-3 flex items-center gap-2">
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                    notif.type === 'broadcast' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {notif.type === 'broadcast' ? 'Hospital Alert' : 'Personal Reminder'}
                  </span>
                  {notif.type === 'broadcast' && (
                    <span className="flex items-center text-[9px] font-bold text-emerald-600 uppercase tracking-widest">
                      <CheckCircleIcon className="w-3 h-3 mr-0.5" /> Official
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        
        {!loading && allNotifications.length === 0 && (
          <div className="text-center py-16 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
            <BellAlertIconOutline className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-sm font-body text-[var(--color-on-surface-variant)]">
              No active reminders or messages.
            </p>
          </div>
        )}
      </div>

      {/* Add Reminder Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center p-6 border-b border-[#e5e9eb] shrink-0">
              <h2 className="text-2xl font-bold font-display text-[var(--color-on-surface)] leading-tight">Add New Reminder</h2>
              <button onClick={() => setIsModalOpen(false)} className="w-9 h-9 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors flex items-center justify-center shrink-0">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto no-scrollbar">
              {/* Select Test */}
              <div>
                <label className="block text-sm font-bold text-[var(--color-on-surface)] mb-2 uppercase tracking-wide">Select Test</label>
                <select 
                  className="w-full border-2 border-[#e5e9eb] rounded-xl p-3.5 bg-gray-50 text-[var(--color-on-surface)] font-body focus:border-[#fe9a00] focus:ring-0 outline-none transition-colors font-semibold"
                  value={selectedTestId}
                  onChange={(e) => setSelectedTestId(e.target.value)}
                >
                  {testGuides.map(p => (
                    <option key={p.id} value={p.id}>{p.procedureName || p.name}</option>
                  ))}
                </select>
              </div>

              {/* Test Date */}
              <div>
                <label className="block text-sm font-bold text-[var(--color-on-surface)] mb-2 uppercase tracking-wide">Test Date</label>
                <input 
                  type="date" 
                  className="w-full border-2 border-[#e5e9eb] rounded-xl p-3.5 bg-gray-50 text-[var(--color-on-surface)] font-body cursor-text focus:border-[#fe9a00] focus:ring-0 outline-none transition-colors font-semibold"
                  value={testDate}
                  onChange={(e) => setTestDate(e.target.value)}
                />
              </div>

              {/* Reminder Type */}
              <div>
                <label className="block text-sm font-bold text-[var(--color-on-surface)] mb-2 uppercase tracking-wide">Reminder Type</label>
                <select 
                  className="w-full border-2 border-[#e5e9eb] rounded-xl p-3.5 bg-gray-50 text-[var(--color-on-surface)] font-body focus:border-[#fe9a00] focus:ring-0 outline-none transition-colors font-semibold"
                  value={reminderType}
                  onChange={(e) => setReminderType(e.target.value)}
                >
                  <option>Fasting</option>
                  <option>Sample Collection</option>
                  <option>Medication</option>
                  <option>Diet</option>
                </select>
              </div>

              {/* Reminder Date and Time */}
              <div>
                <label className="block text-sm font-bold text-[var(--color-on-surface)] mb-2 uppercase tracking-wide">Notification Time</label>
                <input 
                  type="datetime-local" 
                  className="w-full border-2 border-[#e5e9eb] rounded-xl p-3.5 bg-gray-50 text-[var(--color-on-surface)] font-body cursor-text focus:border-[#fe9a00] focus:ring-0 outline-none transition-colors font-semibold"
                  value={reminderDateTime}
                  onChange={(e) => setReminderDateTime(e.target.value)}
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-bold text-[var(--color-on-surface)] mb-2 uppercase tracking-wide">Personal Message</label>
                <textarea 
                  rows={3}
                  placeholder="E.g., Stop eating immediately..."
                  className="w-full border-2 border-[#e5e9eb] rounded-xl p-3.5 bg-gray-50 text-[var(--color-on-surface)] font-body focus:border-[#fe9a00] focus:ring-0 outline-none resize-none transition-colors"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="p-6 border-t border-[#e5e9eb] shrink-0 mt-auto flex gap-3 bg-white">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-white border-2 border-gray-100 text-gray-400 font-bold py-4 rounded-xl hover:bg-gray-50 active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={scheduleReminder}
                className="flex-1 bg-gradient-to-r from-[#fe9a00] to-[#ff3000] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#ff3000]/20 active:scale-95 transition-all"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

