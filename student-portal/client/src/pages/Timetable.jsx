import { useEffect, useState } from "react";
import { getMyTimetable } from "../services/timetableService";
import { getTodayDay } from "../utils/getTodayDay";

const Timetable = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getMyTimetable();
      setItems(data);
    };

    fetchData();
  }, []);

  const today = getTodayDay();

  return (
    <div className="page">
      <h2>My Timetable</h2>
      <p className="muted">Today: {today}</p>
      <table>
        <thead>
          <tr>
            <th>Day</th>
            <th>Subject</th>
            <th>Time</th>
            <th>Room</th>
            <th>Teacher</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id} className={item.day === today ? "row-highlight" : ""}>
              <td>{item.day}</td>
              <td>{item.subject}</td>
              <td>{item.startTime} - {item.endTime}</td>
              <td>{item.room || "-"}</td>
              <td>{item.teacher || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Timetable;
