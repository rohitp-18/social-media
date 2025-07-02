import React from "react";

function NoChat() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-lg font-medium mb-1 opacity-70">No Chat Selected</h2>
      <p className="text-gray-400 text-sm opacity-60">
        Please select a user or chat to start messaging.
      </p>
    </div>
  );
}

export default NoChat;
