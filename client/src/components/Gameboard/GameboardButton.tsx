export const GameboardButton = ({ handleClick }) => {
  return (
    <button
      onClick={handleClick}
      style={{
        borderRadius: "28px",
        backgroundColor: "#F7F7F9",
        cursor: "pointer",
        border: "2px solid black",
        boxShadow: "3px 3px rgba(0, 0, 0, 0.5)",
        height: "7rem",
        width: "7rem",
      }}
    ></button>
  );
};
