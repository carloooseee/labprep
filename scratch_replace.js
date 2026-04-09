import fs from 'fs';
let content = fs.readFileSync('src/patient/views/TestGuides.tsx', 'utf8');

content = content.replaceAll(
  '<div className="flex overflow-x-auto pb-4 gap-3 snap-x -mx-6 px-6 no-scrollbar">',
  '<div className="grid grid-cols-2 gap-3 pb-4">'
);

content = content.replaceAll(
  'className="shrink-0 snap-start bg-white border border-[#e5e9eb] rounded-2xl p-4 w-[110px] flex flex-col items-center text-center shadow-sm"',
  'className="bg-white border border-[#e5e9eb] rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm hover:border-[#427cf2]/30 transition-colors"'
);

fs.writeFileSync('src/patient/views/TestGuides.tsx', content);
console.log("Done");
