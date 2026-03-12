import { useEffect, useState } from "react";
import type { Employee } from "../../types/employee";
import "../../styles/Employee/editEmployeeModal.css";

type ScheduleBlock = {
  shiftType: "Morning" | "Mid" | "Night";
  start: string;
  end: string;
  workSetup: string;
  days: string[];
};

type Props = {
  employee: Employee | null;
  onClose: () => void;
  onSaved: () => void; // 🔥 instead of onSave(updatedEmployee)
};

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const createEmptyBlock = (): ScheduleBlock => ({
  shiftType: "Morning",
  start: "",
  end: "",
  workSetup: "Onsite",
  days: [],
});

const AddEmployeeScheduleModal = ({
  employee,
  onClose,
  onSaved,
}: Props) => {
  const [blocks, setBlocks] = useState<ScheduleBlock[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!employee) return;

    if (!employee.schedules || employee.schedules.length === 0) {
      setBlocks([createEmptyBlock()]);
      return;
    }

    const grouped: { [key: string]: ScheduleBlock } = {};

    employee.schedules.forEach((s: any) => {
      const key = `${s.start}-${s.end}-${s.work_setup}-${s.shift_type}`;

      if (!grouped[key]) {
        grouped[key] = {
          shiftType: s.shift_type || "Morning",
          start: s.start,
          end: s.end,
          workSetup: s.work_setup,
          days: [],
        };
      }

      grouped[key].days.push(s.day);
    });

    setBlocks(Object.values(grouped));
  }, [employee]);

  if (!employee) return null;

  const updateBlock = (
    index: number,
    field: keyof ScheduleBlock,
    value: any
  ) => {
    const updated = [...blocks];
    updated[index] = { ...updated[index], [field]: value };
    setBlocks(updated);
  };

  const toggleDay = (blockIndex: number, day: string) => {
    const updated = [...blocks];
    const block = updated[blockIndex];

    block.days = block.days.includes(day)
      ? block.days.filter((d) => d !== day)
      : [...block.days, day];

    setBlocks(updated);
  };

  const addBlock = () => {
    setBlocks((prev) => [...prev, createEmptyBlock()]);
  };

  const removeBlock = (index: number) => {
    if (blocks.length === 1) {
      alert("At least one schedule block is required.");
      return;
    }
    setBlocks((prev) => prev.filter((_, i) => i !== index));
  };

  const toMinutes = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    const dayMap: Record<string, { start: number; end: number }[]> = {};

    for (const block of blocks) {
      if (!block.start || !block.end) {
        alert("Please complete all time fields.");
        return;
      }

      if (block.days.length === 0) {
        alert("Each schedule must have at least one day.");
        return;
      }

      const startMin = toMinutes(block.start);
      const endMin = toMinutes(block.end);

      for (const day of block.days) {
        if (!dayMap[day]) dayMap[day] = [];

        for (const existing of dayMap[day]) {
          const overlap =
            startMin < existing.end && endMin > existing.start;

          if (overlap) {
            alert(
              `Time conflict on ${day}. Overlapping schedule detected.`
            );
            return;
          }
        }

        dayMap[day].push({ start: startMin, end: endMin });
      }
    }

    const schedules = blocks.flatMap((block) =>
      block.days.map((day) => ({
        day,
        shift_type: block.shiftType,
        start: block.start,
        end: block.end,
        work_setup: block.workSetup,
      }))
    );

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost/hris/backend/employees/add_employee_schedule.php",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employee_id: employee.employee_id,
            schedules,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        onSaved(); // 🔥 refresh parent
        onClose();
      } else {
        alert(data.message || "Failed to save schedule.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="edit-employee-modal modern">
        <h2>Manage Member Schedule</h2>

        <div className="modal-scroll-content">
          {blocks.map((block, index) => (
            <div key={index} className="schedule-block">
              <div className="block-header">
                <h4>Schedule #{index + 1}</h4>
                <button
                  type="button"
                  className="remove-block"
                  onClick={() => removeBlock(index)}
                >
                  ✕
                </button>
              </div>

              <div className="shift-type">
                <label>Shift Type</label>
                <select
                  value={block.shiftType}
                  onChange={(e) =>
                    updateBlock(index, "shiftType", e.target.value)
                  }
                >
                  <option value="Morning">Morning</option>
                  <option value="Mid">Mid</option>
                  <option value="Night">Night</option>
                </select>
              </div>

              <div className="schedule-time-container">
                <div className="time-box">
                  <label>Start Time</label>
                  <input
                    type="time"
                    value={block.start}
                    onChange={(e) =>
                      updateBlock(index, "start", e.target.value)
                    }
                  />
                </div>

                <div className="time-box">
                  <label>End Time</label>
                  <input
                    type="time"
                    value={block.end}
                    onChange={(e) =>
                      updateBlock(index, "end", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="work-setup">
                <label>Work Setup</label>
                <select
                  value={block.workSetup}
                  onChange={(e) =>
                    updateBlock(index, "workSetup", e.target.value)
                  }
                >
                  <option value="Onsite">Onsite</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="WFH">WFH</option>
                </select>
              </div>

              <div className="day-toggle-container">
                {daysOfWeek.map((day) => (
                  <button
                    type="button"
                    key={day}
                    className={`day-btn ${
                      block.days.includes(day) ? "active" : ""
                    }`}
                    onClick={() => toggleDay(index, day)}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="btn-add-schedule"
          onClick={addBlock}
        >
          + Add Another Schedule
        </button>

        <div className="modern-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Schedule"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeScheduleModal;
