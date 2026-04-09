export interface Procedure {
  id: string;
  hospitalId: string;
  name: string;
  category: 'Blood' | 'Urine' | 'Stool' | 'Other';
  instructions: string;
  fastingRequirement?: string;
}

export const proceduresCollection: Procedure[] = [
  {
    id: 'p1',
    hospitalId: 'h1',
    name: 'Fasting Blood Sugar',
    category: 'Blood',
    instructions: 'Measures your blood glucose level after fasting to check for diabetes or prediabetes.',
    fastingRequirement: '8 Hr Fast',
  },
  {
    id: 'p2',
    hospitalId: 'h1',
    name: 'Lipid Profile',
    category: 'Blood',
    instructions: 'Measures cholesterol and triglycerides to assess cardiovascular disease risk.',
    fastingRequirement: '12 Hr Fast',
  },
  {
    id: 'p3',
    hospitalId: 'h1',
    name: 'Urinalysis',
    category: 'Urine',
    instructions: 'Examines urine to detect and manage various diseases and conditions.',
  },
  {
    id: 'p5',
    hospitalId: 'h1',
    name: 'Stool Examination',
    category: 'Stool',
    instructions: 'Analyzes stool sample to detect digestive problems, infections, or bleeding.',
  },
  {
    id: 'p6',
    hospitalId: 'h1',
    name: 'Complete Blood Count (CBC)',
    category: 'Blood',
    instructions: 'A comprehensive test that evaluates your overall health and detects various disorders.',
  },
  {
    id: 'p7',
    hospitalId: 'h1',
    name: 'Thyroid Function Test (TFT)',
    category: 'Blood',
    instructions: 'Measures thyroid hormone levels to check how well your thyroid is working.',
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
