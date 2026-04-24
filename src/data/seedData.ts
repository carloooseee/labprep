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
    id: 'p0',
    procedureName: 'General Rule for Blood Chemistry Tests',
    category: 'Blood Chemistry',
    description: 'Do not eat or drink anything (except plain water) for 10 to 12 hours before your blood test.',
    imageUrl: 'https://www.hospitals.com.au/images/hospitals.jpg',
    preparationSteps: [
      { icon: '🍽️', title: 'Stop Eating', description: 'Stop eating at 10:00 PM the night before if your test is in the morning.', timing: '10:00 PM' },
      { icon: '💧', title: 'Water Only', description: 'You may drink plain water only (no coffee, tea, juice, soda, or milk).', timing: 'Fast period' },
      { icon: '💊', title: 'Medicines', description: 'Take your regular medicines unless your doctor tells you otherwise.', timing: 'Morning' }
    ],
    guidelines: {
      dos: [
        { icon: '💡', text: 'For tests regardless of fasting status, it makes them more consistent and reliable.' },
        { icon: '💧', text: 'Drink extra water to stay hydrated.' }
      ],
      donts: [
        { icon: '🍽️', text: 'Some tests truly require fasting (Blood Sugar, Triglycerides). If you eat, those results will be wrong.' }
      ]
    },
    status: 'Active'
  },
  {
    id: 'p1',
    procedureName: 'Fasting Blood Sugar (FBS)',
    category: 'Blood Chemistry',
    description: 'Checks your blood sugar level after not eating.',
    fastingRequired: '8 to 10 hours',
    duration: 15,
    status: 'Active',
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800',
    preparationSteps: [
      { icon: '🍽️', title: 'Fasting', description: 'Do not eat or drink anything (except water) for 8 to 10 hours.', timing: '8-10h fast' },
      { icon: '🌅', title: 'Morning', description: 'Take your blood sample in the morning.', timing: 'Morning' }
    ],
    guidelines: {
      dos: [
        { icon: '💧', text: 'Drink plenty of water' }
      ],
      donts: [
        { icon: '☕', text: 'Avoid any food, juice, tea with sugar, or coffee with cream.' }
      ]
    }
  },
  {
    id: 'p2',
    procedureName: 'Lipid Profile (Cholesterol and Fats)',
    category: 'Blood Chemistry',
    description: 'Checks your cholesterol and fat levels.',
    fastingRequired: '10 to 12 hours',
    duration: 15,
    status: 'Active',
    imageUrl: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800',
    preparationSteps: [
      { icon: '🍽️', title: 'Strict Fasting', description: 'Strictly fast for 10 to 12 hours (water only).', timing: '10-12h fast' },
      { icon: '🥩', title: 'Normal Diet', description: 'Eat your normal meals for the two weeks before the test.', timing: '2 weeks before' }
    ],
    guidelines: {
      dos: [
        { icon: '💧', text: 'Drink only plain water.' }
      ],
      donts: [
        { icon: '🍷', text: 'No alcohol at all for 24 hours before the test.' },
        { icon: '🍔', text: 'No heavy, oily, or fried food the night before.' }
      ]
    }
  },
  {
    id: 'p8',
    procedureName: 'Oral Glucose Tolerance Test',
    category: 'Blood Chemistry',
    description: 'Checks how your body handles sugar over time.',
    fastingRequired: '10 to 12 hours',
    status: 'Active',
    imageUrl: 'https://images.unsplash.com/photo-1576669801945-7a346954da5a?auto=format&fit=crop&q=80&w=800',
    preparationSteps: [
      { icon: '🌙', title: 'Overnight Fast', description: 'Fast for 10 to 12 hours overnight.', timing: 'Night before' },
      { icon: '🥤', title: 'Glucose Drink', description: 'Drink a sweet glucose liquid given by the lab.', timing: 'At lab' },
      { icon: '💉', title: 'Samples', description: 'Blood samples at 1 hour and 2 hours after drinking.', timing: 'During test' }
    ],
    guidelines: {
      dos: [
        { icon: '🪑', text: 'Stay seated. Only small sips of water if needed.' }
      ],
      donts: [
        { icon: '🍽️', text: 'Do not eat anything during the test.' },
        { icon: '🚶', text: 'Do not walk around, exercise, or smoke.' }
      ]
    }
  },
  {
    id: 'p9',
    procedureName: 'Blood Urea Nitrogen (BUN)',
    category: 'Blood Chemistry',
    description: 'Checks how well your kidneys remove waste from protein.',
    status: 'Active',
    imageUrl: 'https://images.unsplash.com/photo-1559000357-f6b52ddfbe37?auto=format&fit=crop&q=80&w=800',
    preparationSteps: [
      { icon: '💧', title: 'Hydration', description: 'Drink 1 to 2 glasses of plain water before coming.', timing: 'Before arrival' }
    ],
    guidelines: {
      dos: [
        { icon: '💧', text: 'Drink plain water' }
      ],
      donts: [
        { icon: '🥩', text: 'No high-protein meals for 12 hours before.' },
        { icon: '🏋️', text: 'No heavy exercise for 24 hours before.' }
      ]
    }
  },
  {
    id: 'p10',
    procedureName: 'Creatinine',
    category: 'Blood Chemistry',
    description: 'Checks another waste product from your muscles to assess kidney health.',
    status: 'Active',
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800',
    preparationSteps: [
      { icon: '💧', title: 'Water', description: 'Drink normal amount of water.', timing: 'Ongoing' }
    ],
    guidelines: {
      dos: [
        { icon: '💧', text: 'Stay hydrated with normal water intake.' }
      ],
      donts: [
        { icon: '🥩', text: 'No cooked red meat for 12 hours before.' },
        { icon: '🏃', text: 'No heavy exercise (weightlifting, running) for 24 hours before.' }
      ]
    }
  },
  {
    id: 'p11',
    procedureName: 'Uric Acid',
    category: 'Blood Chemistry',
    description: 'Checks waste product linked to gout and kidney stones.',
    status: 'Active',
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800',
    preparationSteps: [
      { icon: '💧', title: 'Hydration', description: 'Drink normal amount of water.', timing: 'Ongoing' }
    ],
    guidelines: {
      dos: [
        { icon: '💧', text: 'Drink extra water to stay hydrated.' }
      ],
      donts: [
        { icon: '🍺', text: 'No alcohol (especially beer) for 24 hours before.' },
        { icon: '🥩', text: 'No organ meats (liver, kidney, heart) for 24 hours before.' },
        { icon: '🦐', text: 'No seafood for 24 hours before.' }
      ]
    }
  },
  {
    id: 'p12',
    procedureName: 'Liver Enzyme Test (Called SGPT or ALT)',
    category: 'Blood Chemistry',
    description: 'Checks a liver enzyme that rises when liver cells are injured.',
    status: 'Active',
    imageUrl: 'https://images.unsplash.com/photo-1576669801945-7a346954da5a?auto=format&fit=crop&q=80&w=800',
    preparationSteps: [
      { icon: '💧', title: 'Water', description: 'Drink normal amount of water.', timing: 'Ongoing' }
    ],
    guidelines: {
      dos: [
        { icon: '💊', text: 'Avoid large doses of pain relievers (like paracetamol) if possible.' }
      ],
      donts: [
        { icon: '🍷', text: 'No alcohol for 48 hours before.' },
        { icon: '🏋️', text: 'No heavy exercise for 24 hours before.' }
      ]
    }
  },
  {
    id: 'p13',
    procedureName: 'Liver Enzyme Test (Called SGOT or AST)',
    category: 'Blood Chemistry',
    description: 'Checks another liver enzyme also found in muscles and heart.',
    fastingRequired: '8 to 12 hours',
    status: 'Active',
    imageUrl: 'https://images.unsplash.com/photo-1576669801945-7a346954da5a?auto=format&fit=crop&q=80&w=800',
    preparationSteps: [
      { icon: '🍽️', title: 'Fasting', description: 'Fast for 8 to 12 hours.', timing: 'Fasting' }
    ],
    guidelines: {
      dos: [
        { icon: '💧', text: 'Drink normal amount of water.' }
      ],
      donts: [
        { icon: '🍷', text: 'No alcohol for 48 hours before.' },
        { icon: '🏃', text: 'No heavy exercise for 24-48 hours before.' },
        { icon: '💉', text: 'No intramuscular injections if possible.' }
      ]
    }
  },
  {
    id: 'p14',
    procedureName: '24-Hour Urine Collection Instructions',
    category: 'Urinalysis',
    description: 'Instructions for collecting all urine over a full 24-hour period.',
    status: 'Active',
    imageUrl: 'https://images.unsplash.com/photo-1576089172869-4f5f6f315620?auto=format&fit=crop&q=80&w=800',
    preparationSteps: [
      { icon: '🌅', title: 'Start Memory', description: 'As soon as you wake up, empty your bladder into the toilet (do NOT collect this first urine). Write down the date and time.', timing: 'Start Time' },
      { icon: '🍶', title: 'Collect All', description: 'Every time you urinate for the rest of the day and night, collect it in the container. Includes urine passed during bowel movements.', timing: '24-hour period' },
      { icon: '❄️', title: 'Storage', description: 'Keep the container in the refrigerator during the entire collection period.', timing: 'During collection' },
      { icon: '🏁', title: 'Finish', description: 'At the same time as your start time the next morning, urinate one last time and add it to the container.', timing: 'Next morning' }
    ],
    guidelines: {
      dos: [
        { icon: '⏰', text: 'Return the sample to the lab as soon as possible (within 24 hours after finishing).' }
      ],
      donts: [
        { icon: '🚫', text: 'Do NOT collect the first urine when you wake up on the first day.' },
        { icon: '⌛', text: 'Do NOT miss any urine during the 24-hour period.' },
        { icon: '🧻', text: 'Avoid mixing urine with stool, toilet paper, or anything else.' },
        { icon: '❄️', text: 'Do NOT leave the container unrefrigerated for long periods.' }
      ]
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
    status: 'Active',
    imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800',
    preparationSteps: [
      { icon: '🚿', title: 'Prep', description: 'Urinate first before collecting your stool. Wash your hands before and after.', timing: 'Before collection' },
      { icon: '📦', title: 'Collection', description: 'Pass stool into a clean container or use plastic wrap over the toilet. Use the stick to collect a small amount (2–3 small pieces).', timing: 'During collection' },
      { icon: '🧪', title: 'Seal', description: 'Place stool into the sterile container and close the lid tightly.', timing: 'Final step' }
    ],
    guidelines: {
      dos: [
        { icon: '💩', text: 'You may collect solid or liquid stool. If you have diarrhea, use a plastic bag over the toilet.' },
        { icon: '⏰', text: 'Deliver the sample the same day.' }
      ],
      donts: [
        { icon: '💧', text: 'Do NOT let urine mix with the stool sample or collect from toilet bowl water.' },
        { icon: '🧻', text: 'Do NOT mix with toilet paper, water, soap, or touch the inside of the container.' }
      ]
    }
  },
  {
    id: 'p6',
    procedureName: 'Complete Blood Count (CBC) & Platelet Count',
    category: 'Hematology',
    description: 'Measures your red cells, white cells, and platelets. Silent partner of accurate results.',
    status: 'Active',
    imageUrl: 'https://images.ctfassets.net/4f3rgqwzdznj/01mInT7wKiz3nm147wWwp0/9bcb511703708f114400b35906fec7ae/closeup_patient_blood_drawn_1366739379.jpg',
    preparationSteps: [
      { icon: '🥛', title: 'Hydration', description: 'Drink plenty of water. Well-hydrated veins are easier to access and reduce clotted sample risk.', timing: 'Ongoing' }
    ],
    guidelines: {
      dos: [
        { icon: '🍽️', text: 'Fasting: Not Required. You may eat and drink normally.' },
        { icon: '💡', text: 'If ordered with Glucose or Cholesterol, check if fasting is required for those.' }
      ],
      donts: [
        { icon: '🏋️', text: 'Avoid vigorous exercise 1 hour before the draw (can spike white cells/platelets).' }
      ]
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
  },
  {
    id: 'p15',
    procedureName: 'Typhidot Test (Typhoid Fever Test)',
    category: 'Blood Test',
    description: 'Checks for Typhoid fever, an infection from contaminated food/water.',
    status: 'Active',
    imageUrl: 'https://www.hospitals.com.au/images/hospitals.jpg',
    preparationSteps: [
      { icon: '💧', title: 'Hydrate', description: 'Drink water before test to help make veins easier to find and blood draw smoother.', timing: 'Before test' },
      { icon: '💊', title: 'Medications', description: 'Inform doctor of all meds (including antibiotics). Follow advice if any need stopping.', timing: 'Ongoing' }
    ],
    guidelines: {
      dos: [
        { icon: '📋', text: 'Follow all doctor advice regarding medicine adjustments.' }
      ],
      donts: [
        { icon: '🏋️', text: 'Avoid heavy exercise 24 hours before test.' },
        { icon: '🍷', text: 'Avoid drinking alcohol before your test.' }
      ]
    }
  },
  {
    id: 'p16',
    procedureName: 'Dengue Test',
    category: 'Blood Test',
    description: 'Checks for Dengue fever, a viral infection spread by mosquitoes.',
    status: 'Active',
    imageUrl: 'https://www.hospitals.com.au/images/hospitals.jpg',
    preparationSteps: [
      { icon: '📋', title: 'Symptoms', description: 'Inform provider about fever duration and symptoms (headache, body pain, rash).', timing: 'On arrival' },
      { icon: '💧', title: 'Hydrate', description: 'Stay hydrated before and after the test.', timing: 'Ongoing' }
    ],
    guidelines: {
      dos: [
        { icon: '💧', text: 'Keep maintaining good fluid intake.' }
      ],
      donts: [
        { icon: '💊', text: 'Do NOT take aspirin or ibuprofen unless prescribed (bleeding risk).' },
        { icon: '⏰', text: 'Do NOT delay testing if symptoms are present.' }
      ]
    }
  },
  {
    id: 'p17',
    procedureName: 'RPR Test (Syphilis Screening)',
    category: 'Blood Test',
    description: 'Checks for Syphilis, a sexually transmitted infection.',
    status: 'Active',
    imageUrl: 'https://www.hospitals.com.au/images/hospitals.jpg',
    preparationSteps: [
      { icon: '📋', title: 'Disclosure', description: 'Be honest with your healthcare provider about unprotected sex or rashes/sores.', timing: 'Pre-test' },
      { icon: '🧘', title: 'Persistence', description: 'Go back for follow-up visits and repeat testing as instructed.', timing: 'Ongoing' }
    ],
    guidelines: {
      dos: [
        { icon: '⏰', text: 'Go for testing as early as possible if you think you were exposed.' }
      ],
      donts: [
        { icon: '💊', text: 'Do NOT self-medicate or take antibiotics without a doctor’s advice.' },
        { icon: '⌛', text: 'Do NOT delay testing if exposure is suspected.' }
      ]
    }
  },
  {
    id: 'p18',
    procedureName: 'HIV Test',
    category: 'Blood Test',
    description: 'Checks for HIV, a virus that weakens the body’s defense system.',
    status: 'Active',
    imageUrl: 'https://www.hospitals.com.au/images/hospitals.jpg',
    preparationSteps: [
      { icon: '📋', title: 'Exposure Risk', description: 'Inform your provider about unprotected sex, shared needles, or blood exposure.', timing: 'Pre-test' },
      { icon: '📅', title: 'Repeat Testing', description: 'Follow instructions for repeat testing; early infection may not show immediately.', timing: 'Follow-up' }
    ],
    guidelines: {
      dos: [
        { icon: '⏰', text: 'Get tested early after possible exposure. Attend counseling if offered.' }
      ],
      donts: [
        { icon: '🧐', text: 'Do NOT assume negative status just because you are symptom-free.' },
        { icon: '🚫', text: 'Do NOT skip repeat tests if recommended by your doctor.' }
      ]
    }
  },
  {
    id: 'p19',
    procedureName: 'HBsAg Test (Hepatitis B Screening)',
    category: 'Blood Test',
    description: 'Checks for Hepatitis B, a virus that affects the liver.',
    status: 'Active',
    imageUrl: 'https://www.hospitals.com.au/images/hospitals.jpg',
    preparationSteps: [
      { icon: '📋', title: 'Health History', description: 'Be honest with your doctor about your history and any exposure/symptoms.', timing: 'Pre-test' }
    ],
    guidelines: {
      dos: [
        { icon: '📅', text: 'Follow your doctor’s advice for follow-up tests.' }
      ],
      donts: [
        { icon: '🧐', text: 'Do NOT assume you are safe just because you feel fine.' },
        { icon: '⌛', text: 'Do NOT delay testing after possible exposure.' }
      ]
    }
  },
  {
    id: 'p20',
    procedureName: 'General Rule for Hematology',
    category: 'Hematology',
    description: 'Most hematology tests require minimal physical preparation, but strict timing and disclosure are critical.',
    status: 'Active',
    imageUrl: 'https://www.hospitals.com.au/images/hospitals.jpg',
    preparationSteps: [
      { icon: '🗣️', title: 'Communication', description: 'Always notify the technician if you have a history of fainting or feel lightheaded.', timing: 'Always' }
    ],
    guidelines: {
      dos: [
        { icon: '📋', text: 'Follow strict adherence to timing and medication disclosure.' }
      ],
      donts: []
    }
  },
  {
    id: 'p21',
    procedureName: 'Coagulation Tests (PT / PTT / INR)',
    category: 'Hematology',
    description: 'Measures how quickly your blood clots. Focuses on timing and medications.',
    status: 'Active',
    imageUrl: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=800',
    preparationSteps: [
      { icon: '💊', title: 'Med Disclosure', description: 'Inform the phlebotomist if taking blood thinners (Ex. Warfarin, Heparin, Aspirin).', timing: 'Pre-test' },
      { icon: '💉', title: 'Heparin Timing', description: 'If on Heparin injections, blood should be drawn 1 hour before your next dose.', timing: '1h before dose' }
    ],
    guidelines: {
      dos: [
        { icon: '⏰', text: 'For INR monitoring, try to have blood drawn at the same time of day each time.' }
      ],
      donts: [
        { icon: '🍔', text: 'Avoid a high-fat meal immediately before the test (can interfere with sensors).' }
      ]
    }
  },
  {
    id: 'p22',
    procedureName: 'Blood Typing (ABO & Rh)',
    category: 'Hematology',
    description: 'Determines your blood group and Rh factor.',
    status: 'Active',
    imageUrl: 'https://images.ctfassets.net/4f3rgqwzdznj/01mInT7wKiz3nm147wWwp0/9bcb511703708f114400b35906fec7ae/closeup_patient_blood_drawn_1366739379.jpg',
    preparationSteps: [
      { icon: '🆔', title: 'ID Verification', description: 'State and spell your full name and date of birth multiple times for verification.', timing: 'During test' },
      { icon: '🏥', title: 'History', description: 'Inform staff if you had a blood transfusion or bone marrow transplant in the last 3 months.', timing: 'Pre-test' }
    ],
    guidelines: {
      dos: [
        { icon: '✅', text: 'Identification is the most critical preparation for this test.' }
      ],
      donts: []
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

