import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState({ game: null, loading: true });
  const effectRan = useRef(false);

  useEffect(() => {
    if (!effectRan.current) {
      (async () => {
        console.log("i fire once");

        const res = await fetch("http://localhost:8080/game");
        const data = await res.json();
        setData({ game: data, loading: false });
      })();
    }
    return () => (effectRan.current = true);
  }, []);

  if (data.loading) {
    return <p>loading</p>;
  }

  if (data.error) {
    return <p>ERROR</p>;
  }

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
}

export default App;
