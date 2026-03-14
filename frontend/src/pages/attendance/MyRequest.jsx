import { useEffect, useState } from 'react';
import Sidebar from '../../components/Navbar/Sidebar';
import AttendanceHistoryHighlights from '../../components/AttendanceHistoryHighlights';
import DataPanel from '../../components/DataPanel';
import { buildRequestHighlights, fetchMyRequests } from '../../api/requests';

export default function MyRequest() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchMyRequests()
      .then((response) => setRequests(Array.isArray(response) ? response : []))
      .catch(() => setRequests([]));
  }, []);

  return (
    <div className="attendance-page">
      <Sidebar />
      <main className="attendance-main">
        <div className="attendance-header">
          <h1>MY REQUESTS</h1>
        </div>
        <AttendanceHistoryHighlights highlights={buildRequestHighlights(requests)} />
        <DataPanel type="requests" records={requests} />
      </main>
    </div>
  );
}
