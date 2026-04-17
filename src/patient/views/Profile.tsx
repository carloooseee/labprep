import { useState, useEffect } from 'react';
import { 
  EnvelopeIcon,
  ArrowLeftOnRectangleIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  UserIcon,
  PencilSquareIcon,
  CheckIcon,
  XMarkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function Profile() {
  const { profile, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || '',
        phone: profile.phone || '',
        address: profile.address || '',
        dateOfBirth: profile.dateOfBirth || '',
        gender: profile.gender || 'Male'
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!profile?.uid || !formData) return;
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'users', profile.uid), formData, { merge: true });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!profile) return null;

  return (
    <div className="p-6 pb-24">
      <div className="flex flex-col items-center mt-8 mb-10">
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-[var(--color-surface-container-low)] flex items-center justify-center mb-4 overflow-hidden border-4 border-white shadow-lg">
            <UserCircleIcon className="w-28 h-28 text-[var(--color-primary-container)]" />
          </div>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="absolute bottom-4 right-0 bg-[#1d2530] text-white p-2 rounded-full shadow-lg hover:scale-110 transition-all border-2 border-white"
            >
              <PencilSquareIcon className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {isEditing ? (
          <input 
            type="text"
            value={formData.displayName}
            onChange={(e) => setFormData({...formData, displayName: e.target.value})}
            className="text-2xl font-extrabold font-display text-center bg-gray-50 border-b-2 border-blue-500 outline-none w-full max-w-xs pb-1"
            placeholder="Your Full Name"
          />
        ) : (
          <h1 className="text-3xl font-extrabold font-display text-[var(--color-on-surface)] tracking-tight">
            {profile.displayName || 'Patient'}
          </h1>
        )}
        
        <p className="text-sm font-body text-[var(--color-on-surface-variant)] mt-1 tracking-widest uppercase font-bold opacity-60">
          {profile.role === 'patient' ? 'Patient Portal' : 'Administrator'}
        </p>
      </div>

      <div className="space-y-4">
        {/* Email - Read Only */}
        <div className="bg-[var(--color-surface-container-lowest)] p-5 rounded-2xl border border-[#e5e9eb] flex items-center shadow-sm opacity-60">
          <div className="w-10 h-10 bg-[var(--color-surface-container)] rounded-full flex items-center justify-center mr-4">
            <EnvelopeIcon className="w-5 h-5 text-[var(--color-on-surface-variant)]" />
          </div>
          <div>
            <p className="text-[10px] font-body text-[var(--color-on-surface-variant)] uppercase tracking-widest font-bold">Email Address</p>
            <p className="font-bold font-body text-[var(--color-on-surface)]">{profile.email}</p>
          </div>
        </div>

        {/* Dynamic Fields */}
        <ProfileField 
          icon={<PhoneIcon className="w-5 h-5" />} 
          label="Phone Number" 
          value={isEditing ? formData?.phone : profile.phone || 'No phone set'} 
          isEditing={isEditing}
          onChange={(val: any) => setFormData({...formData, phone: val})}
          type="text"
          placeholder="+63 9xx..."
        />

        <ProfileField 
          icon={<MapPinIcon className="w-5 h-5" />} 
          label="Home Address" 
          value={isEditing ? formData?.address : profile.address || 'No address set'} 
          isEditing={isEditing}
          onChange={(val: any) => setFormData({...formData, address: val})}
          type="textarea"
          placeholder="Complete address"
        />

        <div className="grid grid-cols-2 gap-4">
          <ProfileField 
            icon={<CalendarIcon className="w-5 h-5" />} 
            label="Date of Birth" 
            value={isEditing ? formData?.dateOfBirth : profile.dateOfBirth || 'Not set'} 
            isEditing={isEditing}
            onChange={(val: any) => setFormData({...formData, dateOfBirth: val})}
            type="date"
          />
          <ProfileField 
            icon={<UserIcon className="w-5 h-5" />} 
            label="Gender" 
            value={isEditing ? formData?.gender : profile.gender || 'Not set'} 
            isEditing={isEditing}
            onChange={(val: any) => setFormData({...formData, gender: val})}
            type="select"
            options={['Male', 'Female', 'Other']}
          />
        </div>
      </div>
      
      {isEditing ? (
        <div className="mt-12 flex gap-4">
          <button 
            onClick={() => setIsEditing(false)}
            disabled={isSaving}
            className="flex-1 bg-gray-100 text-gray-700 font-bold py-4 rounded-xl active:scale-95 transition-all flex items-center justify-center border border-gray-200"
          >
            <XMarkIcon className="w-5 h-5 mr-2" />
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 bg-[#1d2530] text-white font-bold py-4 rounded-xl active:scale-95 transition-all flex items-center justify-center shadow-lg disabled:opacity-50"
          >
            {isSaving ? (
              <ArrowPathIcon className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <CheckIcon className="w-5 h-5 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="mt-12 pt-6 border-t border-[#e5e9eb]">
          <button 
            onClick={() => signOut()}
            className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-xl active:scale-95 transition-all flex items-center justify-center border border-red-100 shadow-sm"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-2" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

function ProfileField({ icon, label, value, isEditing, onChange, type, placeholder, options }: any) {
  return (
    <div className="bg-[var(--color-surface-container-lowest)] p-5 rounded-2xl border border-[#e5e9eb] flex items-center shadow-sm">
      <div className="w-10 h-10 bg-[var(--color-surface-container)] rounded-full flex items-center justify-center mr-4 shrink-0">
        <div className="text-[var(--color-on-surface-variant)]">{icon}</div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-body text-[var(--color-on-surface-variant)] uppercase tracking-widest font-bold">{label}</p>
        {isEditing ? (
          type === 'textarea' ? (
            <textarea 
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-lg px-2 py-1 text-sm font-bold mt-1 outline-none focus:border-blue-500"
              placeholder={placeholder}
              rows={2}
            />
          ) : type === 'select' ? (
            <select 
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-lg px-2 py-1 text-sm font-bold mt-1 outline-none focus:border-blue-500"
            >
              {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          ) : (
            <input 
              type={type}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-lg px-2 py-1 text-sm font-bold mt-1 outline-none focus:border-blue-500"
              placeholder={placeholder}
            />
          )
        ) : (
          <p className="font-bold font-body text-[var(--color-on-surface)] truncate">{value}</p>
        )}
      </div>
    </div>
  );
}


