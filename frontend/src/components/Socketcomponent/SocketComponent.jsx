import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SocketComponent = () => {
  const [latestToast, setLatestToast] = useState(null);

  useEffect(() => {
    const socket = io(process.env.REACT_APP_BASE_URL);

    socket.on("progress", (message) => {
      // Display the new toast message

      toast.info(message);
    });

    socket.on("compare", (message) => {
      console.log(message);
      toast.info(message, { autoClose: false });
    });

    socket.on("download", (message) => {
      toast.dismiss();
      toast.info(message, {
        autoClose: 2000, // Close after 3 seconds
      });
    });

    return () => {
      // Clean up the event listener
      socket.off("progress");
      socket.off("compare");
      socket.off("download");

      socket.disconnect(); // to disconnect the connection
    };
  }, []);

  return (
    <div>
      <ToastContainer />
    </div>
  );
};

export default SocketComponent;
