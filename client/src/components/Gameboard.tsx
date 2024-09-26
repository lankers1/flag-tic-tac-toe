import { useGetGameQuery } from "../query-hooks/getGame";
import "./styles.scss";

export const Gameboard = () => {
  const { data, isLoading, isPending, error } = useGetGameQuery();

  if (isLoading || isPending) return <p>loading...</p>;
  if (error) return <p>Error... {error.message}</p>;

  return (
    <div className="board-container">
      <div className="board-grid">
        <div className="row-1 squares">
          <p>{data.game.first_row.split("_").join(" ")}</p>
        </div>
        <div className="row-2 squares">
          <p>{data.game.second_row.split("_").join(" ")}</p>
        </div>
        <div className="row-3 squares">
          <p>{data.game.third_row.split("_").join(" ")}</p>
        </div>
        <div className="col-1 squares">
          <p>{data.game.first_column.split("_").join(" ")}</p>
        </div>
        <div className="col-2 squares">
          <p>{data.game.second_column.split("_").join(" ")}</p>
        </div>
        <div className="col-3 squares">
          <p>{data.game.third_column.split("_").join(" ")}</p>
        </div>
        <div className="one squares guess-square"></div>
        <div className="two squares guess-square"></div>
        <div className="three squares guess-square"></div>
        <div className="four squares guess-square"></div>
        <div className="five squares guess-square"></div>
        <div className="six squares guess-square"></div>
        <div className="seven squares guess-square"></div>
        <div className="eight squares guess-square"></div>
        <div className="nine squares guess-square"></div>
      </div>
    </div>
  );
};
