export const hospitals = [
  {
    id: 'h1',
    name: 'General Hospital Memorial',
    address: '123 Medical Way',
    contactNumber: '555-0101',
    location: { _lat: 14.5995, _long: 120.9842 } // Manila area
  },
  {
    id: 'h2',
    name: 'Westside Clinic',
    address: '456 Care Blvd',
    contactNumber: '555-0202',
    location: { _lat: 14.5547, _long: 121.0244 } // Makati area
  }
];

export const testGuides = [
  {
    id: 'p1',
    name: 'Fasting Blood Sugar (FBS)',
    category: 'Blood',
    description: 'Measures your blood glucose level after fasting to check for diabetes or prediabetes.',
    fastingRequirement: '8 Hr Fast',
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800',
    defaultInstructions: 'Arrive 15 minutes early. A phlebotomist will draw blood from a vein in your arm.',
    preparations: [
      { icon: '🍽️', title: 'Fasting', description: 'Fast for 8-12 hours before the test', timing: 'Night before test' },
      { icon: '💧', title: 'Water', description: 'Only drink plain water during fasting', timing: 'During fasting period' },
      { icon: '📌', title: 'Timing', description: 'Schedule test early in the morning', timing: 'Morning' }
    ],
    guidelines: {
      dos: [
        { icon: '💧', text: 'Drink plenty of water' },
        { icon: '😴', text: 'Get adequate sleep the night before' },
        { icon: '💊', text: 'Take your morning medications after the test' }
      ],
      donts: [
        { icon: '🍽️', text: "Don't eat or drink anything except water" },
        { icon: '🚭', text: "Don't smoke during fasting period" },
        { icon: '🍬', text: "Don't chew gum" },
        { icon: '🏃', text: "Don't exercise before the test" }
      ]
    },
    translations: {
      tl: {
        name: 'Fasting Blood Sugar (FBS)',
        description: 'Sinusukat ang antas ng asukal sa iyong dugo matapos mag-ayuno upang suriin ang diabetes.',
        preparations: [
          { icon: '🍽️', title: 'Pag-aayuno', description: 'Huwag kumain ng 8-12 oras bago ang test', timing: 'Gabi bago ang test' },
          { icon: '💧', title: 'Tubig', description: 'Tubig lamang ang maaaring inumin habang nag-aayuno', timing: 'Habang nag-aayuno' }
        ],
        guidelines: {
          dos: [
            { icon: '💧', text: 'Uminom ng maraming tubig' },
            { icon: '😴', text: 'Matulog nang sapat sa gabi bago ang test' }
          ],
          donts: [
            { icon: '🍽️', text: 'Huwag kumain o uminom ng kahit ano maliban sa tubig' }
          ]
        }
      }
    }
  },
  {
    id: 'p3',
    name: 'Urinalysis',
    category: 'Urine',
    description: 'Examines urine to detect and manage various diseases and conditions.',
    imageUrl: 'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?auto=format&fit=crop&q=80&w=800',
    defaultInstructions: 'Collect a midstream urine sample using a sterile cup.',
    preparations: [
      { icon: '🌅', title: 'Morning Sample', description: 'Collect first morning urine sample', timing: 'Morning of test' },
      { icon: '📌', title: 'Container', description: 'Use a clean, dry sterile container', timing: 'During collection' },
      { icon: '🥛', title: 'Midstream', description: 'Collect midstream urine (discard first burst)', timing: 'During collection' }
    ],
    guidelines: {
      dos: [
        { icon: '🧼', text: 'Clean the genital area before collection' },
        { icon: '📋', text: 'Use provided sterile container' },
        { icon: '⏰', text: 'Deliver sample within 1 hour' }
      ],
      donts: [
        { icon: '🚫', text: "Don't touch inside of container" },
        { icon: '🩸', text: "Don't collect during menstruation" }
      ]
    },
    translations: {
      tl: {
        name: 'Urinalysis (Pagsusuri ng Ihi)',
        description: 'Sinusuri ang ihi upang matukoy ang iba\'t ibang sakit at kondisyon.',
        preparations: [
          { icon: '🌅', title: 'Unang Ihi', description: 'Kolektahin ang unang ihi sa umaga', timing: 'Umaga ng test' }
        ],
        guidelines: {
          dos: [
            { icon: '🧼', text: 'Linisin ang ari bago kumuha ng ihi' }
          ],
          donts: [
            { icon: '🚫', text: 'Huwag hawakan ang loob ng lalagyan' }
          ]
        }
      }
    }
  }
];

export const hospitalOverrides = [
  {
    id: 'h2_p3',
    hospitalId: 'h2',
    testGuideId: 'p3',
    overrides: {
      description: 'OVERRIDDEN: Please collect sample in our specific clinic containers at Westside.',
      fastingRequirement: '6 Hr Hydration'
    }
  }
];

export const stats = [
  {
    hospitalId: 'h1',
    totalPatients: 1250,
    testsCompleted: 4500,
    notificationsSent: 8200
  }
];

export const activity = [
  {
    hospitalId: 'h1',
    user: 'Admin Sarah',
    action: 'Updated FBS Guide',
    timestamp: new Date()
  },
  {
    hospitalId: 'h1',
    user: 'System',
    action: 'Automated Backup Completed',
    timestamp: new Date()
  }
];

export const broadcasts = [
  { id: 'b1', title: 'System Maintenance', message: 'The portal will be down for 2 hours tonight.', date: 'Oct 15, 2026', recipients: 'All Users', status: 'Sent' },
  { id: 'b2', title: 'New Hospital Added', message: 'Metro General is now accepting online schedules.', date: 'Oct 10, 2026', recipients: 'Patients', status: 'Sent' }
];

export const initialUsers = [
  {
    uid: 'admin1',
    displayName: 'Hospital Admin',
    email: 'admin@genhosp.com',
    role: 'admin',
    hospitalId: 'h1',
    preferredLanguage: 'en'
  },
  {
    uid: 'patient1',
    displayName: 'Juan Dela Cruz',
    email: 'juan@example.com',
    role: 'patient',
    hospitalId: 'h1',
    preferredLanguage: 'tl'
  }
];
