import { useEffect, useState } from "react";
import { getMyAttendance } from "../services/attendanceService";
import { formatDate } from "../utils/formatDate";

const Attendance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMyAttendance();
        setRecords(data);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="page"><p>Loading attendance...</p></div>;

  return (
    <div className="page">
      <h2>My Attendance</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Subject</th>
            <th>Status</th>
            <th>Marked By</th>
          </tr>
        </thead>
        <tbody>
          {records.map((item) => (
            <tr key={item._id}>
              <td>{formatDate(item.date)}</td>
              <td>{item.subject}</td>
              <td>{item.status}</td>
              <td>{item.markedBy?.name || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Attendance;
