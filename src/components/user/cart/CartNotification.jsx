import React from "react";
import Notification from "../../../components/common/Notification";

const CartNotification = ({ notification, onClose }) => {
  return notification ? (
    <Notification
      message={notification.message}
      type={notification.type}
      onClose={onClose}
    />
  ) : null;
};

export default CartNotification;