import { useEffect, useState } from "react";
import { getMyNotices } from "../services/noticeService";
import { formatDate } from "../utils/formatDate";

const Notices = () => {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getMyNotices();
      setNotices(data);
    };

    fetchData();
  }, []);

  return (
    <div className="page">
      <h2>Notices</h2>
      <div className="stack">
        {notices.map((notice) => (
          <div className="card" key={notice._id}>
            <h3>{notice.title}</h3>
            <p>{notice.body}</p>
            <small>
              Audience: {notice.audience} | Posted by {notice.postedBy?.name || "-"} on {formatDate(notice.createdAt)}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notices;
