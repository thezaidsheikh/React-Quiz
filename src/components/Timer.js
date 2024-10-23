import { useEffect } from "react";

function Timer({ secRemaining, dispatch }) {
  const min = Math.floor(secRemaining / 60);
  const seconds = secRemaining % 60;
  useEffect(
    function () {
      const id = setInterval(() => {
        dispatch({ type: "tick" });
      }, 1000);

      return () => clearInterval(id);
    },
    [dispatch]
  );
  return (
    <div className="timer">
      {min < 10 && "0"}
      {min} : {seconds < 10 && "0"}
      {seconds}
    </div>
  );
}

export default Timer;
