export const CAMPUS_MAP_EMBED_URL = (import.meta.env.VITE_CAMPUS_MAP_EMBED_URL || "").trim();

export const CAMPUS_LOCATIONS = [
  {
    id: "block-a",
    title: "Academic Block A",
    zone: "North Wing",
    details: "CSE, AI/ML, Data Science classrooms and labs."
  },
  {
    id: "block-b",
    title: "Academic Block B",
    zone: "Central Wing",
    details: "ECE, EE and Mechanical classrooms."
  },
  {
    id: "library",
    title: "Central Library",
    zone: "Academic Core",
    details: "Reference section, digital library and study hall."
  },
  {
    id: "mess",
    title: "Student Mess",
    zone: "Hostel Side",
    details: "Daily meal service for hostellers."
  },
  {
    id: "canteen",
    title: "Campus Canteen",
    zone: "Near Main Ground",
    details: "Snacks, beverages and quick meals."
  },
  {
    id: "hostel",
    title: "Hostel Block",
    zone: "South Campus",
    details: "Boys and girls hostel facilities."
  }
];
