
import { useState } from "react";
import Chatbot from "./Chatbot";

const ChatbotProvider = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);

  const handleToggleMinimize = () => {
    setIsMinimized(!isMinimized);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(true);
  };

  return (
    <>
      {(isOpen || isMinimized) && (
        <Chatbot
          isMinimized={isMinimized}
          onToggleMinimize={handleToggleMinimize}
          onClose={handleClose}
        />
      )}
    </>
  );
};

export default ChatbotProvider;
