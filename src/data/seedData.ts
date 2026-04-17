export const hospitals = [
  {
    id: 'h1',
    name: 'General Hospital Memorial',
    address: '123 Medical Way',
    contact: '555-0101',
    status: 'Active',
    location: { _lat: 14.5995, _long: 120.9842 } // Manila area
  },
  {
    id: 'h2',
    name: 'Westside Clinic',
    address: '456 Care Blvd',
    contact: '555-0202',
    status: 'Active',
    location: { _lat: 14.5547, _long: 121.0244 } // Makati area
  }
];

export const testGuides = [
  {
    id: 'p1',
    procedureName: 'Fasting Blood Sugar (FBS)',
    category: 'Blood Test',
    description: 'Measures your blood glucose level after fasting to check for diabetes or prediabetes.',
    fastingRequired: '8 Hr Fast',
    duration: 15,
    status: 'Active',
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800',
    defaultInstructions: 'Arrive 15 minutes early. A phlebotomist will draw blood from a vein in your arm.',
    preparationSteps: [
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
        procedureName: 'Fasting Blood Sugar (FBS)',
        description: 'Sinusukat ang antas ng asukal sa iyong dugo matapos mag-ayuno upang suriin ang diabetes.',
        preparationSteps: [
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
    id: 'p2',
    procedureName: 'Lipid Profile',
    category: 'Blood Test',
    description: 'Measures cholesterol and triglycerides to assess cardiovascular disease risk.',
    fastingRequired: '12 Hr Fast',
    duration: 15,
    status: 'Active',
    imageUrl: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800',
    defaultInstructions: 'Fast for 12 hours. Only water is permitted.',
    preparationSteps: [
      { icon: '🍽️', title: 'Fasting', description: 'Complete fasting for 12 hours', timing: 'Night before test' },
      { icon: '💧', title: 'Hydration', description: 'Drink only plain water', timing: 'During fasting' },
      { icon: '🚫', title: 'Alcohol', description: 'Avoid alcohol for 24 hours', timing: '24 hours before' }
    ],
    guidelines: {
      dos: [
        { icon: '💧', text: 'Stay hydrated with water' },
        { icon: '🧘', text: 'Remain calm during blood draw' }
      ],
      donts: [
        { icon: '🍔', text: 'Do not eat fatty meals 24 hours before' },
        { icon: '🍷', text: 'Do not consume alcohol' }
      ]
    },
    translations: {
      tl: {
        procedureName: 'Lipid Profile',
        description: 'Sinusukat ang kolesterol at triglycerides upang malaman ang panganib sa sakit sa puso.',
        preparationSteps: [
          { icon: '🍽️', title: 'Pag-aayuno', description: 'Huwag kumain ng 12 oras', timing: 'Gabi bago ang test' }
        ],
        guidelines: {
          dos: [
            { icon: '💧', text: 'Uminom ng tubig' }
          ],
          donts: [
            { icon: '🍔', text: 'Huwag kumain ng mamantika 24 oras bago ang test' }
          ]
        }
      }
    }
  },
  {
    id: 'p3',
    procedureName: 'Urinalysis',
    category: 'Urinalysis',
    description: 'Examines urine to detect and manage various diseases and conditions.',
    duration: 10,
    status: 'Active',
    imageUrl: 'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?auto=format&fit=crop&q=80&w=800',
    defaultInstructions: 'Collect a midstream urine sample using a sterile cup.',
    preparationSteps: [
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
        procedureName: 'Urinalysis (Pagsusuri ng Ihi)',
        description: 'Sinusuri ang ihi upang matukoy ang iba\'t ibang sakit at kondisyon.',
        preparationSteps: [
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
  },
  {
    id: 'p5',
    procedureName: 'Stool Examination (Fecalysis)',
    category: 'Stool Test',
    description: 'Analyzes stool sample to detect digestive problems, infections, or bleeding.',
    duration: 10,
    status: 'Active',
    imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800',
    defaultInstructions: 'Collect a small pea-sized sample in the provided sterile container.',
    preparationSteps: [
      { icon: '💩', title: 'Collection', description: 'Use the spoon provided in the kit', timing: 'Morning of test' },
      { icon: '🧼', title: 'Hygiene', description: 'Wash hands before and after collection', timing: 'During collection' }
    ],
    guidelines: {
      dos: [
        { icon: '📦', text: 'Ensure the container is tightly sealed' },
        { icon: '⏰', text: 'Submit sample within 2 hours' }
      ],
      donts: [
        { icon: '🚽', text: 'Avoid mixing with toilet water' },
        { icon: '💦', text: 'Do not mix with urine' }
      ]
    },
    translations: {
      tl: {
        procedureName: 'Pagsusuri ng Tae (Fecalysis)',
        description: 'Sinusuri ang dumi upang matukoy ang mga problema sa pagtunaw o impeksyon.',
        preparationSteps: [
          { icon: '💩', title: 'Pagkolekta', description: 'Gamitin ang kutsarang kasama sa kit', timing: 'Umaga ng test' }
        ],
        guidelines: {
          dos: [
            { icon: '📦', text: 'Siguraduhing selyado ang lalagyan' }
          ],
          donts: [
            { icon: '🚽', text: 'Iwasang mahaluan ng tubig mula sa toilet' }
          ]
        }
      }
    }
  },
  {
    id: 'p6',
    procedureName: 'Complete Blood Count (CBC)',
    category: 'Blood Test',
    description: 'A comprehensive test that evaluates your overall health and detects various disorders.',
    duration: 15,
    status: 'Active',
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800',
    defaultInstructions: 'No fasting required unless specified by your doctor.',
    preparationSteps: [
      { icon: '💉', title: 'Blood Draw', description: 'Sample will be taken from a vein', timing: 'During test' }
    ],
    guidelines: {
      dos: [
        { icon: '📋', text: 'Inform staff of any medications you are taking' },
        { icon: '🩹', text: 'Keep the bandage on for 15 minutes' }
      ],
      donts: [
        { icon: '🏋️', text: 'Avoid heavy lifting with the tested arm' }
      ]
    },
    translations: {
      tl: {
        procedureName: 'Complete Blood Count (CBC)',
        description: 'Isang komprehensibong test na sumusuri sa iyong pangkalahatang kalusugan.',
        preparationSteps: [
          { icon: '💉', title: 'Pagkuha ng Dugo', description: 'Kukuha ng sample mula sa ugat', timing: 'Habang nagte-test' }
        ]
      }
    }
  },
  {
    id: 'p7',
    procedureName: 'Thyroid Function Test (TFT)',
    category: 'Blood Test',
    description: 'Measures thyroid hormone levels to check how well your thyroid is working.',
    duration: 20,
    status: 'Active',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
    defaultInstructions: 'Standard blood draw. No fasting required.',
    preparationSteps: [
      { icon: '🦋', title: 'Thyroid Check', description: 'Checks for hyper/hypothyroidism', timing: 'During test' }
    ],
    guidelines: {
      dos: [
        { icon: '⏰', text: 'Note the time of your last thyroid medication' }
      ],
      donts: [
        { icon: '☕', text: 'Avoid large amounts of caffeine before test' }
      ]
    },
    translations: {
      tl: {
        procedureName: 'Thyroid Function Test (TFT)',
        description: 'Sinusukat ang antas ng thyroid hormone sa iyong katawan.'
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
      fastingRequired: '6 Hr Hydration'
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
    uid: 'admin_primary',
    displayName: 'Hospital Admin',
    email: 'admin@hospital.com',
    role: 'admin',
    hospitalId: 'h1',
    preferredLanguage: 'en'
  },
  {
    uid: 'patient_nash',
    displayName: 'Nash Soriano',
    email: 'nash@soriano.com',
    role: 'patient',
    hospitalId: 'h1',
    preferredLanguage: 'en',
    phone: '+63 912 345 6789',
    address: 'Brgy. San Jose, Pasig City',
    dateOfBirth: '1992-05-15',
    gender: 'Male',
    status: 'Active'
  },
  {
    uid: 'patient_rizelle',
    displayName: 'Rizelle Vergara',
    email: 'rizelle@vergara.com',
    role: 'patient',
    hospitalId: 'h1',
    preferredLanguage: 'en',
    phone: '+63 923 456 7890',
    address: 'Bicutan, Parañaque City',
    dateOfBirth: '1995-11-20',
    gender: 'Female',
    status: 'Active'
  },
  {
    uid: 'patient_rich',
    displayName: 'Rich Villaflores',
    email: 'rich@villaflores.com',
    role: 'patient',
    hospitalId: 'h1',
    preferredLanguage: 'en',
    phone: '+63 934 567 8901',
    address: 'Taft Ave, Manila',
    dateOfBirth: '1988-08-08',
    gender: 'Male',
    status: 'Active'
  }
];

