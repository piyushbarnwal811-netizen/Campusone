import { useEffect, useState } from "react";
import { getMyExams } from "../services/examService";
import { formatDate } from "../utils/formatDate";

const Exams = () => {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getMyExams();
      setExams(data);
    };

    fetchData();
  }, []);

  return (
    <div className="page">
      <h2>Exam Schedule</h2>
      <table>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Date</th>
            <th>Time</th>
            <th>Room</th>
            <th>Max Marks</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((exam) => (
            <tr key={exam._id}>
              <td>{exam.subject}</td>
              <td>{formatDate(exam.date)}</td>
              <td>{exam.startTime} - {exam.endTime}</td>
              <td>{exam.room || "-"}</td>
              <td>{exam.maxMarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Exams;
