import '../../styles/Employee/filterModal.css';

type Filters = {
  account: string;
  status: string;
  position: string;
  sort: 'asc' | 'desc';
};

type Props = {
  filters: Filters;
  accounts: string[];
  positions: string[];
  onApply: (filters: Filters) => void;
  onClose: () => void;
};

const FilterModal = ({
  filters,
  accounts,
  positions,
  onApply,
  onClose,
}: Props) => {
  return (
    <div className="modal-overlay">
      <div className="modal-card filter-modal">
        {/* HEADER */}
        <div className="filter-header">
          <h3>Filter Employees</h3>
        </div>

        {/* BODY */}
        <div className="filter-body">
          <div className="filter-group">
            <label>Account</label>
            <select
              value={filters.account}
              onChange={(e) =>
                onApply({ ...filters, account: e.target.value })
              }
            >
              <option value="">All</option>
              {accounts.map((acc) => (
                <option key={acc} value={acc}>
                  {acc}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) =>
                onApply({ ...filters, status: e.target.value })
              }
            >
              <option value="">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Position</label>
            <select
              value={filters.position}
              onChange={(e) =>
                onApply({ ...filters, position: e.target.value })
              }
            >
              <option value="">All</option>
              {positions.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Date Joined</label>
            <select
              value={filters.sort}
              onChange={(e) =>
                onApply({
                  ...filters,
                  sort: e.target.value as 'asc' | 'desc',
                })
              }
            >
              <option value="asc">Oldest</option>
              <option value="desc">Newest</option>
            </select>
          </div>
        </div>

        {/* FOOTER */}
        <div className="filter-actions">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
