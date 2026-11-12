export default function Alerta({ error, onClose }) {
  if (!error) return null;
  return (
    <div className="alert alert-danger alert-dismissible py-2">
      {error}
      {onClose && <button type="button" className="btn-close" onClick={onClose} />}
    </div>
  );
}
