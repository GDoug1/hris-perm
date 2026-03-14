import Sidebar from '../../components/Navbar/Sidebar';
import FilingCenterPanel from '../../components/FilingCenterPanel';
import '../../styles/attendance.css';

export default function MyFilingCenter() {
  return (
    <div className="attendance-page">
      <Sidebar />
      <main className="attendance-main">
        <div className="attendance-header">
          <h1>MY FILING CENTER</h1>
        </div>
        <FilingCenterPanel />
      </main>
    </div>
  );
}
