import { useState } from 'react';
import '../styles/Employee/addemployee.css';

type Props = {
  onClose: () => void;
};

/* ================= OPTIONS ================= */

const positions = [
  "President","HR Lead","Service Delivery Manager","HR Coordinator",
  "IT Administrator","Administrative Support","Accounting",
  "Accounting Associate","Sr. Recruitment Specialist",
  "Jr. Recruitment Specialist","Head of Training",
  "Tier 1 Technical Support","Tier 2 Technical Support",
  "Tier 3 Technical Support","NOC Tier 1 Support",
  "NOC Tier 2 Support","NOC Tier 3 Support",
  "SIP NOC Support Engineer","VOIP Support Technician 1",
  "VOIP Support Technician 2","Help Desk Support 1",
  "Help Desk Support 2","Junior Support Engineer",
  "Software QA Engineer","Project Coordinator",
  "Pre Sales Support","LNP Specialist","Carrier Specialist",
  "Order Manager","Customer Support Representative",
  "Billing Coordinator","PHP Developer","Full Stack Developer",
  "JAVA Developer","Technical Support Engineer",
  "Graphic Designer","Bookkeeper","Technical Trainer",
  "Junior IT Technician"
];

const accounts = [
  "iReply Back Office Services","In-Telecom Consulting","SIPPIO",
  "Teammate Technology LLC","Viirtue LLC","RingLogix Technologies",
  "RabbitRun","Telco Experts","Crexendo",
  "Advanced Network Solutions","NUSO","Sourcetoad",
  "ATL Communications","Total CX","Element IQ","Telepath",
  "Vitale ENT","Cloud Service Networks","Business VOIP",
  "Rotolo - Bravo 1","Advanced Data Infrastructure",
  "Rotolo - Oxfresh","Level1 - YDC","VoxRush",
  "Clarity Voice","Spectrum VOIP","Rotolo","test client",
  "VoIP CX","VOIP.MS","Rotolo - Rainbow Restoration",
  "UnitedCloud Inc.","Sonicetel","YD Level 1",
  "Palmers Relocations","Atheral","Numhub","Internship",
  "Advanced Network Services","Rotolo (Valet Waste)",
  "Recent Communication","Kevlar IT Solutions","Smart Choice"
];

// const clusters = [
//   "Cluster A","Cluster B","Cluster C","Cluster D",
//   "Night Support","Technical Team","NOC Team","Development Team"
// ];

const employeeTypes = ["Regular","Probationary","Contractual","Intern"];
const civilStatuses = ["Single","Married","Widowed","Separated"];

/* ================= COMPONENT ================= */

const AddEmployee = ({ onClose }: Props) => {

  const [activeTab, setActiveTab] =
    useState<'personal' | 'employment' | 'benefits'>('personal');

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    address: '',
    birthdate: '',
    contact_number: '',
    civil_status: '',
    personal_email: '',
    email: '',
    position: '',
    account: '',
    // cluster: '',
    employee_type: ''
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  /* ================= VALIDATION ================= */

  const validateForm = () => {

    if (!formData.first_name || !formData.last_name || !formData.email) {
      alert("Please complete required Personal Information.");
      setActiveTab('personal');
      return false;
    }

    // || !formData.cluster
    if (!formData.position || !formData.account || !formData.employee_type) {
      alert("Please complete Employment Details.");
      setActiveTab('employment');
      return false;
    }

    return true;
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const res = await fetch(
        'http://localhost/hris/backend/employees/add_employee.php',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(formData),
        }
      );

      const text = await res.text(); // safer debugging
      const data = JSON.parse(text);

      if (data.success) {
        alert(
          `Employee Created!\n\nEmail: ${data.generated_account.email}\nPassword: ${data.generated_account.password}`
        );
        onClose();
      } else {
        alert(data.message || "Failed to create employee.");
      }

    } catch (err) {
      console.error(err);
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="form-container">

          <form onSubmit={handleSubmit}>

            <h2>Add Employee</h2>

            {/* Tabs */}
            <div className="tabs">
              <button type="button"
                className={activeTab==='personal'?'active':''}
                onClick={() => setActiveTab('personal')}>
                Personal Information
              </button>

              <button type="button"
                className={activeTab==='employment'?'active':''}
                onClick={() => setActiveTab('employment')}>
                Employment Details
              </button>

              <button type="button"
                className={activeTab==='benefits'?'active':''}
                onClick={() => setActiveTab('benefits')}>
                Benefit Details
              </button>
            </div>

            {/* PERSONAL TAB */}
            {activeTab === 'personal' && (
              <>
                <input name="first_name" placeholder="First Name"
                  value={formData.first_name} onChange={handleChange} />

                <input name="middle_name" placeholder="Middle Name"
                  value={formData.middle_name} onChange={handleChange} />

                <input name="last_name" placeholder="Last Name"
                  value={formData.last_name} onChange={handleChange} />

                <input name="address" placeholder="Address"
                  value={formData.address} onChange={handleChange} />

                <input type="date" name="birthdate"
                  value={formData.birthdate} onChange={handleChange} />

                <input name="contact_number" placeholder="Contact Number"
                  value={formData.contact_number} onChange={handleChange} />

                <select name="civil_status"
                  value={formData.civil_status}
                  onChange={handleChange}>
                  <option value="">Civil Status</option>
                  {civilStatuses.map(c => <option key={c}>{c}</option>)}
                </select>

                <input name="personal_email" placeholder="Personal Email"
                  value={formData.personal_email} onChange={handleChange} />

                <input type="email" name="email" placeholder="Work Email"
                  value={formData.email} onChange={handleChange} />
              </>
            )}

            {/* EMPLOYMENT TAB */}
            {activeTab === 'employment' && (
              <>
                <select name="position"
                  value={formData.position}
                  onChange={handleChange}>
                  <option value="">Select Position</option>
                  {positions.map(p => <option key={p}>{p}</option>)}
                </select>

                <select name="account"
                  value={formData.account}
                  onChange={handleChange}>
                  <option value="">Select Account</option>
                  {accounts.map(a => <option key={a}>{a}</option>)}
                </select>

                {/* <select name="cluster"
                  value={formData.cluster}
                  onChange={handleChange}>
                  <option value="">Select Cluster</option>
                  {clusters.map(c => <option key={c}>{c}</option>)}
                </select> */}

                <select name="employee_type"
                  value={formData.employee_type}
                  onChange={handleChange}>
                  <option value="">Select Employee Type</option>
                  {employeeTypes.map(t => <option key={t}>{t}</option>)}
                </select>
              </>
            )}

            {activeTab === 'benefits' && (
              <p>Benefits module coming soon...</p>
            )}

            <div className="submit-btn">
              <button type="button" onClick={onClose}>
                Close
              </button>

              <button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create"}
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};

export default AddEmployee;