import "./Spinner.css";

interface SpinnerProps {
  label?: string;
}

function Spinner({ label = "Loading…" }: SpinnerProps) {
  return (
    <div className="spinner">
      <div className="spinner-ring" />
      <span className="spinner-label">{label}</span>
    </div>
  );
}

export default Spinner;
