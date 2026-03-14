import { useEffect, useState } from 'react';
import Sidebar from '../../components/Navbar/Sidebar';
import AttendanceHistoryHighlights from '../../components/AttendanceHistoryHighlights';
import DataPanel from '../../components/DataPanel';
import {
  buildRequestHighlights,
  fetchTeamRequests,
  updateTeamRequestStatus,
} from '../../api/requests';

export default function EmployeeRequest() {
  const [requests, setRequests] = useState([]);
  const [requestActionLoadingId, setRequestActionLoadingId] = useState('');

  useEffect(() => {
    fetchTeamRequests()
      .then((response) => setRequests(Array.isArray(response) ? response : []))
      .catch(() => setRequests([]));
  }, []);

  const handleAction = async (request, status) => {
    if (!request?.id || !request?.request_source) return;

    setRequestActionLoadingId(request.id);
    try {
      await updateTeamRequestStatus({
        request_source: request.request_source,
        request_id: request.source_id,
        status,
      });
      setRequests((prev) => prev.map((item) => (item.id === request.id ? { ...item, status } : item)));
    } finally {
      setRequestActionLoadingId('');
    }
  };

  return (
    <div className="attendance-page">
      <Sidebar />
      <main className="attendance-main">
        <div className="attendance-header">
          <h1>TEAM REQUEST</h1>
        </div>
        <AttendanceHistoryHighlights highlights={buildRequestHighlights(requests)} />
        <DataPanel
          type="requests"
          records={requests}
          requestActionLoadingId={requestActionLoadingId}
          requestActions={[
            { label: 'Endorse', status: 'endorsed' },
            { label: 'Reject', status: 'rejected' },
          ]}
          onRequestAction={handleAction}
        />
      </main>
    </div>
  );
}
