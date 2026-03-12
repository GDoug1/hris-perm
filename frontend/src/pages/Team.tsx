import '../styles/team.css';
import Sidebar from '../components/Navbar/Sidebar';

const Team = () => {
  return (
    <div className="team-page">
      <Sidebar />

      <main className="team-main">
        {/* Header */}
        <div className="team-header">
          <h1>TEAM</h1>
          <span>0:00 PM &nbsp; Wed, January 22, 2026</span>
        </div>

        {/* Add Cluster Bar */}
        <div className="cluster-bar">
          <button className="add-cluster-btn">
            <span className="plus">+</span>
            Add Cluster
          </button>
        </div>

        {/* Content Area (for future clusters) */}
        <div className="team-content">
          {/* clusters will go here */}
        </div>
      </main>
    </div>
  );
};

export default Team;
