import { useState, useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { BellAlertIcon as BellAlertIconOutline } from '@heroicons/react/24/outline';
import { EllipsisHorizontalCircleIcon, BuildingOfficeIcon, BellAlertIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';

interface Reminder {
  id: number;
  title: string;
  body: string;
}

export default function Notifications() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  useEffect(() => {
    // Request permission on mount
    LocalNotifications.requestPermissions();
  }, []);

  const scheduleReminder = async () => {
    if (!remindersEnabled) {
      alert('Please enable reminders in settings first.');
      return;
    }
    const id = Date.now();
    const d = new Date(Date.now() + 5000); // 5 seconds from now for demo
    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'Prep Reminder: Fasting Blood Sugar',
          body: 'Remember to start fasting now. Do not eat or drink anything but water for the next 8-10 hours.',
          id: id,
          schedule: { at: d },
          sound: undefined,
          attachments: undefined,
          actionTypeId: '',
          extra: null,
        },
      ],
    });

    setReminders([{ id, title: 'Fasting Blood Sugar', body: 'Scheduled for 5 seconds from now' }, ...reminders]);
    alert('Reminder scheduled for 5 seconds from now!');
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
        onClick={scheduleReminder}
        className="w-full bg-gradient-to-r from-[#fe9a00] to-[#ff3000] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#ff3000]/20 active:scale-95 transition-transform"
      >
        Simulate Prep Reminder (5s)
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
    </div>
  );
}
