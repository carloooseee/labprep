export interface Procedure {
  id: string;
  hospitalId: string;
  name: string;
  category: 'Blood' | 'Urine' | 'Stool' | 'Other';
  instructions: string;
  fastingRequirement?: string;
  imageUrl?: string;
  guidelines?: string;
}

export const proceduresCollection: Procedure[] = [
  {
    id: 'p1',
    hospitalId: 'h1',
    name: 'Fasting Blood Sugar',
    category: 'Blood',
    instructions: 'Measures your blood glucose level after fasting to check for diabetes or prediabetes.',
    fastingRequirement: '8 Hr Fast',
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800',
    guidelines: 'Arrive 15 minutes early. A phlebotomist will draw blood from a vein in your arm. The process takes less than 5 minutes. You may resume normal diet immediately after.',
  },
  {
    id: 'p2',
    hospitalId: 'h1',
    name: 'Lipid Profile',
    category: 'Blood',
    instructions: 'Measures cholesterol and triglycerides to assess cardiovascular disease risk.',
    fastingRequirement: '12 Hr Fast',
    imageUrl: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800',
    guidelines: 'Blood will be drawn from your arm. Pressure will be applied to stop bleeding. Results typically available within 24-48 hours.',
  },
  {
    id: 'p3',
    hospitalId: 'h1',
    name: 'Urinalysis',
    category: 'Urine',
    instructions: 'Examines urine to detect and manage various diseases and conditions.',
    imageUrl: 'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?auto=format&fit=crop&q=80&w=800',
    guidelines: 'You will be given a sterile cup. Wash your hands, cleanse the genital area, and collect a midstream urine sample. Secure the lid tightly.',
  },
  {
    id: 'p5',
    hospitalId: 'h1',
    name: 'Stool Examination',
    category: 'Stool',
    instructions: 'Analyzes stool sample to detect digestive problems, infections, or bleeding.',
    imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800',
    guidelines: 'Use the provided sterile container and spoon. Avoid scooping areas that touch toilet water. Ensure cap is tightened securely and return to lab immediately.',
  },
  {
    id: 'p6',
    hospitalId: 'h1',
    name: 'Complete Blood Count (CBC)',
    category: 'Blood',
    instructions: 'A comprehensive test that evaluates your overall health and detects various disorders.',
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800',
    guidelines: 'A healthcare professional will clean an area on your arm and draw blood using a small needle. Keep bandage on for 15 minutes to prevent minor bruising.',
  },
  {
    id: 'p7',
    hospitalId: 'h1',
    name: 'Thyroid Function Test (TFT)',
    category: 'Blood',
    instructions: 'Measures thyroid hormone levels to check how well your thyroid is working.',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
    guidelines: 'No specific preparation needed. A phlebotomist will take a small sample from a vein. Wait for your doctor to discuss results regarding any medication changes.',
  }
];

export interface Hospital {
  id: string;
  name: string;
  address: string;
}

export const hospitalsCollection: Hospital[] = [
  { id: 'h1', name: 'General Hospital Memorial', address: '123 Medical Way' },
  { id: 'h2', name: 'Westside Clinic', address: '456 Care Blvd' },
];
