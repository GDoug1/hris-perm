import { useEffect, useState } from 'react';
import type { Employee } from '../../types/employee';
import '../../styles/Employee/editEmployee.css';

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


const employeeTypes = ["Regular","Probationary","Contractual","Intern"];

type Props = {
  employee: Employee | null;
  onClose: () => void;
  onSave: (updatedEmployee: Employee) => void;
};

const EditEmployee = ({ employee, onClose, onSave }: Props) => {

  const [formData, setFormData] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (employee) {
      setFormData(employee);
    }
  }, [employee]);

  if (!employee || !formData) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({
      ...prev!,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        'http://localhost/hris/backend/employees/update_employee.php',
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (data.success) {
        onSave(formData); // update parent state
        onClose();
      } else {
        alert('Update failed');
      }

    } catch (err) {
      console.error(err);
      alert('Server error');
    } finally {
      setLoading(false);
    }
  };
return (
  <div className="edit-overlay" onClick={onClose}>
    <div
      className="edit-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="edit-header">
        <h2>Edit Employee Information</h2>
      </div>

      <div className="edit-form">

        <div className="edit-field">
          <label>First Name</label>
          <input
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
          />
        </div>

        <div className="edit-field">
          <label>Middle Name</label>
          <input
            name="middle_name"
            value={formData.middle_name || ''}
            onChange={handleChange}
          />
        </div>

        <div className="edit-field">
          <label>Last Name</label>
          <input
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />
        </div>

        <div className="edit-field">
          <label>Personal Email</label>
          <input
            type="email"
            name="personal_email"
            value={formData.personal_email || ''}
            onChange={handleChange}
          />
        </div>

        <div className="edit-field full">
          <label>Company Email</label>
          <input
           type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        
        <div className="edit-field">
          <label>Position</label>
          <select
            name="position"
            value={formData.position || ''}
            onChange={handleChange}
          >
            <option value="">Select Position</option>
            {positions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="edit-field">
          <label>Account</label>
          <select
            name="account"
            value={formData.account || ''}
            onChange={handleChange}
          >
            <option value="">Select Account</option>
            {accounts.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <div className="edit-field">
          <label>Employee Type</label>
          <select
            name="employee_type"
            value={formData.employee_type || ''}
            onChange={handleChange}
          >
            <option value="">Select Employee Type</option>
            {employeeTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

      </div>

      <div className="edit-actions">
        <button className="edit-btn-secondary" onClick={onClose}>
          Cancel
        </button>

        <button
          className="edit-btn-primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  </div>
);

};

export default EditEmployee;
