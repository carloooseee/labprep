import { useState, useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { BellAlertIcon as BellAlertIconOutline, XMarkIcon } from '@heroicons/react/24/outline';
import { EllipsisHorizontalCircleIcon, BuildingOfficeIcon, BellAlertIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import { proceduresCollection } from '../data/Procedures';

interface Reminder {
  id: number;
  title: string;
  body: string;
}

export default function Notifications() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  // Form & Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState(proceduresCollection[0]?.id || '');
  const [testDate, setTestDate] = useState('');
  const [reminderType, setReminderType] = useState('Fasting');
  const [reminderDateTime, setReminderDateTime] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Request permission on mount
    LocalNotifications.requestPermissions();
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

    const testProc = proceduresCollection.find(p => p.id === selectedTestId);
    const testName = testProc ? testProc.name : 'Lab Test';

    const safeId = Math.floor(Math.random() * 1000000);
    const d = new Date(reminderDateTime);
    
    await LocalNotifications.schedule({
      notifications: [
        {
          title: `Prep: ${testName} (${reminderType})`,
          body: message || `Time to prepare for your ${testName}.`,
          id: safeId,
          schedule: { at: d },
          sound: undefined,
          attachments: undefined,
          actionTypeId: '',
          extra: null,
        },
      ],
    });

    setReminders([{ id: safeId, title: testName, body: `Scheduled for ${d.toLocaleString()}` }, ...reminders]);
    setIsModalOpen(false);

    // Reset Form
    setMessage('');
    setReminderDateTime('');
    setTestDate('');
  };

  return (
    <div className="p-6 pb-24">
      <header className="mb-10 flex justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-display text-[var(--color-primary)] tracking-tight mb-1">LabPrep</h1>
          <p className="text-xs font-body text-[var(--color-on-surface-variant)] font-semibold uppercase tracking-widest">Prepare Right. Test Right.</p>
        </div>
        <div className="flex space-x-3 shrink-0">
          <Link to="/patient/hospitals" className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-[#e5e9eb] shadow-sm hover:scale-105 transition-transform">
            <BuildingOfficeIcon className="w-6 h-6 text-[var(--color-primary)]" />
          </Link>
          <Link to="/patient/notifications" className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-[#e5e9eb] shadow-sm hover:scale-105 transition-transform">
            <BellAlertIcon className="w-6 h-6 text-emerald-600" />
          </Link>
        </div>
      </header>

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
        <h3 className="text-xl font-display font-bold text-[var(--color-on-surface)] mb-4">Settings</h3>
        <div className="bg-[var(--color-surface-container-lowest)] p-5 rounded-2xl border border-[#e5e9eb] shadow-sm flex items-center justify-between">
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
      </div>

      <button
        onClick={() => {
          if (!remindersEnabled) {
            alert('Please enable reminders in settings first.');
            return;
          }
          setIsModalOpen(true);
        }}
        className="w-full bg-gradient-to-r from-[#fe9a00] to-[#ff3000] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#ff3000]/20 active:scale-95 transition-transform"
      >
        + Add New Reminder
      </button>

      <div className="mt-8 space-y-4">
        {reminders.map((reminder) => (
          <div key={reminder.id} className="bg-[var(--color-surface-container-lowest)] p-5 rounded-2xl flex items-start space-x-4">
            <div className="w-10 h-10 rounded-full bg-[var(--color-surface-container-low)] flex items-center justify-center shrink-0">
              <BellAlertIconOutline className="w-5 h-5 text-[#ff3000]" />
            </div>
            <div>
              <h4 className="font-bold font-display text-[var(--color-on-surface)]">{reminder.title}</h4>
              <p className="text-xs mt-1 font-body text-[var(--color-on-surface-variant)]">{reminder.body}</p>
            </div>
          </div>
        ))}
        {reminders.length === 0 && (
          <p className="text-center text-sm font-body text-[var(--color-on-surface-variant)] mt-12">
            No active reminders.
          </p>
        )}
      </div>

      {/* Add Reminder Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 transition-opacity" onClick={() => setIsModalOpen(false)}></div>
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
                <label className="block text-sm font-bold text-[var(--color-on-surface)] mb-2">Select Test</label>
                <select 
                  className="w-full border-2 border-[#e5e9eb] rounded-xl p-3.5 bg-white text-[var(--color-on-surface)] font-body focus:border-[#fe9a00] focus:ring-0 outline-none transition-colors"
                  value={selectedTestId}
                  onChange={(e) => setSelectedTestId(e.target.value)}
                >
                  {proceduresCollection.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* Test Date */}
              <div>
                <label className="block text-sm font-bold text-[var(--color-on-surface)] mb-2">Test Date</label>
                <input 
                  type="date" 
                  className="w-full border-2 border-[#e5e9eb] rounded-xl p-3.5 bg-white text-[var(--color-on-surface)] font-body cursor-text focus:border-[#fe9a00] focus:ring-0 outline-none transition-colors"
                  value={testDate}
                  onChange={(e) => setTestDate(e.target.value)}
                />
              </div>

              {/* Reminder Type */}
              <div>
                <label className="block text-sm font-bold text-[var(--color-on-surface)] mb-2">Reminder Type</label>
                <select 
                  className="w-full border-2 border-[#e5e9eb] rounded-xl p-3.5 bg-white text-[var(--color-on-surface)] font-body focus:border-[#fe9a00] focus:ring-0 outline-none transition-colors"
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
                <label className="block text-sm font-bold text-[var(--color-on-surface)] mb-2">Notification Date & Time</label>
                <input 
                  type="datetime-local" 
                  className="w-full border-2 border-[#e5e9eb] rounded-xl p-3.5 bg-white text-[var(--color-on-surface)] font-body cursor-text focus:border-[#fe9a00] focus:ring-0 outline-none transition-colors"
                  value={reminderDateTime}
                  onChange={(e) => setReminderDateTime(e.target.value)}
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-bold text-[var(--color-on-surface)] mb-2">Message</label>
                <textarea 
                  rows={3}
                  placeholder="E.g., Stop eating immediately..."
                  className="w-full border-2 border-[#e5e9eb] rounded-xl p-3.5 bg-white text-[var(--color-on-surface)] font-body focus:border-[#fe9a00] focus:ring-0 outline-none resize-none transition-colors"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="p-6 border-t border-[#e5e9eb] shrink-0 mt-auto flex gap-3 bg-[var(--color-surface)]">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-white border-2 border-[#e5e9eb] text-gray-500 font-bold py-4 rounded-xl hover:bg-gray-50 active:scale-95 transition-transform"
              >
                Cancel
              </button>
              <button 
                onClick={scheduleReminder}
                className="flex-1 bg-gradient-to-r from-[#fe9a00] to-[#ff3000] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#ff3000]/20 active:scale-95 transition-transform"
              >
                Add Reminder
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
