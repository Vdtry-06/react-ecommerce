import React, { useEffect } from "react";
import "../../static/style/notification.css";

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getStyleByType = () => {
    switch (type) {
      case "success":
        return { backgroundColor: "#28a745", color: "white" };
      case "error":
        return { backgroundColor: "#dc3545", color: "white" };
      case "warning":
        return { backgroundColor: "#ffc107", color: "black" };
      case "info":
        return { backgroundColor: "#17a2b8", color: "white" };
      default:
        return { backgroundColor: "#28a745", color: "white" };
    }
  };

  return (
    <div className="notification" style={getStyleByType()}>
      {message}
    </div>
  );
};

export default Notification;