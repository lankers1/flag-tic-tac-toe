import { capitaliseFirst } from "../../utils/capitaliseFirst";
import { removeSnakeCase } from "../../utils/removeSnakeCase";
import { GameboardButton } from "./GameboardButton";
import "./styles.scss";

const squares = [
  { type: "inside", key: "" },
  { type: "inside", key: "" },
  { type: "inside", key: "" },
  { type: "inside", key: "" },
  { type: "inside", key: "" },
  { type: "inside", key: "" },
  { type: "inside", key: "" },
  { type: "inside", key: "" },
  { type: "inside", key: "" },
];

export const Gameboard = ({ data, handleClick }) => {
  return (
    <div className="board-container">
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            gap: "18px",
            justifyContent: "flex-end",
            marginBottom: "0.5rem",
          }}
        >
          <div
            style={{
              height: "auto",
              width: "7rem",
              display: "flex",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {capitaliseFirst(removeSnakeCase(data.first_column))}
          </div>
          <div
            style={{
              height: "auto",
              width: "7rem",
              display: "flex",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {capitaliseFirst(removeSnakeCase(data.second_column))}
          </div>
          <div
            style={{
              height: "auto",
              width: "7rem",
              display: "flex",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {capitaliseFirst(removeSnakeCase(data.third_column))}
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <div
            style={{ display: "flex", maxWidth: "7rem", marginRight: "0.5rem" }}
          >
            <div
              style={{
                display: "flex",
                gap: "18px",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  height: "7rem",
                  width: "auto",
                  display: "flex",
                  alignItems: "center",

                  justifyContent: "center",
                }}
              >
                <p style={{ height: "fit-content", textAlign: "center" }}>
                  {capitaliseFirst(removeSnakeCase(data.first_row))}
                </p>
              </div>
              <div
                style={{
                  height: "7rem",
                  width: "auto",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <p style={{ height: "fit-content", textAlign: "center" }}>
                  {capitaliseFirst(removeSnakeCase(data.second_row))}
                </p>
              </div>
              <div
                style={{
                  height: "7rem",
                  width: "auto",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <p style={{ height: "fit-content", textAlign: "center" }}>
                  {capitaliseFirst(removeSnakeCase(data.third_row))}
                </p>
              </div>
            </div>
          </div>
          <div className="board-grid">
            {squares.map(({ type, key }, index) => (
              <RenderSquare
                handleClick={() => handleClick(index)}
                type={type}
                wording={data[key]}
                key={type + index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const RenderSquare = ({
  type,
  wording,
  handleClick,
}: {
  handleClick: () => void;
  type?: string;
  wording: string;
}) => {
  switch (type) {
    // case "row":
    //   return (
    //     <div className="text-square">
    //       <p>{capitaliseFirst(removeSnakeCase(wording))}</p>
    //     </div>
    //   );
    // case "col":
    //   return (
    //     <div className="text-square vertical">
    //       <p>{capitaliseFirst(removeSnakeCase(wording))}</p>
    //     </div>
    //   );
    case "inside":
      return <GameboardButton handleClick={handleClick} />;
    default:
      return <div />;
  }
};
