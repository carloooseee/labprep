import { useState, useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { BellAlertIcon } from '@heroicons/react/24/outline';

interface Reminder {
  id: number;
  title: string;
  body: string;
}

export default function Notifications() {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    // Request permission on mount
    LocalNotifications.requestPermissions();
  }, []);

  const scheduleReminder = async () => {
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
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold font-display text-[var(--color-on-surface)] tracking-tight">Alerts</h1>
        <p className="text-sm font-body text-[var(--color-on-surface-variant)] mt-2">
          Manage your upcoming test preparation reminders.
        </p>
      </header>

      <button
        onClick={scheduleReminder}
        className="w-full gradient-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-[var(--color-primary)]/20 active:scale-95 transition-transform"
      >
        Simulate Prep Reminder (5s)
      </button>

      <div className="mt-8 space-y-4">
        {reminders.map((reminder) => (
          <div key={reminder.id} className="bg-[var(--color-surface-container-lowest)] p-5 rounded-2xl flex items-start space-x-4">
            <div className="w-10 h-10 rounded-full bg-[var(--color-surface-container-low)] flex items-center justify-center shrink-0">
              <BellAlertIcon className="w-5 h-5 text-[var(--color-primary)]" />
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
