

type Props = {
  status?: string | null;
};

const StatusBadge = ({ status }: Props) => {
  if (!status) {
    return (
      <span className="badge gray">
        N/A
      </span>
    );
  }

  const normalized = status.toLowerCase();

  let className = 'gray';

  if (normalized === 'active') className = 'green';
  else if (normalized === 'inactive') className = 'red';
  else if (normalized === 'present') className = 'green';
  else if (normalized === 'late') className = 'orange';
  else if (normalized === 'absent') className = 'red';

  return (
    <span className={`badge ${className}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
