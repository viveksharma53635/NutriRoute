import { useEffect } from "react";

function Toast({ msg, onClose }) {

  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="toast">
      {msg}
    </div>
  );
}
export default Toast;

