export interface Procedure {
  id: string;
  hospitalId: string;
  name: string;
  category: 'Blood' | 'Urine' | 'Stool' | 'Imaging' | 'Other';
  instructions: string[];
}

export const proceduresCollection: Procedure[] = [
  {
    id: 'p1',
    hospitalId: 'h1',
    name: 'Fasting Blood Sugar',
    category: 'Blood',
    instructions: [
      'Fast for exactly 8 to 10 hours before the test.',
      'Do not eat or drink anything except water.',
      'Take your regular medications unless instructed otherwise.',
    ],
  },
  {
    id: 'p2',
    hospitalId: 'h1',
    name: 'Lipid Profile',
    category: 'Blood',
    instructions: [
      'Fast for 10-12 hours prior to the test.',
      'Avoid alcohol for 24 hours before the test.',
    ],
  },
  {
    id: 'p3',
    hospitalId: 'h2',
    name: 'Urinalysis',
    category: 'Urine',
    instructions: [
      'Collect the first morning urine using the sterile container provided.',
      'Clean the genital area thoroughly before collection.',
    ],
  },
  {
    id: 'p4',
    hospitalId: 'h1',
    name: 'MRI Scan',
    category: 'Imaging',
    instructions: [
      'Remove all metal objects, including jewelry and watches.',
      'Notify the technician of any implants or pacemakers.',
      'Avoid eating 4 hours prior if contrast is used.',
    ],
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
