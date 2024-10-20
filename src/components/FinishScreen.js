function FinishScreen({ points, maxPossiblePoints, highScore, correctAnswer, incorrectAnswer, dispatch }) {
  const percentage = (points / maxPossiblePoints) * 100;
  return (
    <>
      <p className="result">
        You scored <strong>{points}</strong> out of {maxPossiblePoints} ({Math.ceil(percentage)}%)
      </p>
      <div class="highscore">
        <p>
          <strong>High Score: </strong>
          {highScore}
        </p>
        <p>
          <strong>Correct Ans: </strong>
          {correctAnswer}
        </p>
        <p>
          <strong>Incorrect Ans: </strong>
          {incorrectAnswer}
        </p>
      </div>
      <button
        className="btn btn-ui"
        onClick={() => {
          dispatch({ type: "restart" });
        }}
      >
        Restart
      </button>
    </>
  );
}

export default FinishScreen;
