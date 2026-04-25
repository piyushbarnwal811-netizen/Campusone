export const COMPLAINT_DEPARTMENTS = [
  { value: "student_section", label: "Student Section" },
  { value: "fee_department", label: "Fee Department" },
  { value: "admission_office", label: "Admission Office" },
  { value: "library_department", label: "Library Department" },
  { value: "hostel_department", label: "Hostel Department" },
  { value: "technical_department", label: "Technical Department" },
  { value: "management_department", label: "Management Department" }
];

export const getComplaintDepartmentLabel = (value) =>
  COMPLAINT_DEPARTMENTS.find((item) => item.value === value)?.label || value || "-";
