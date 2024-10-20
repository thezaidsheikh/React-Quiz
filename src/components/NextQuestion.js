function NextQuestion({ index, numberOfQuestions, dispatch, answer }) {
  if (answer == null) return <></>;
  return (
    <div>
      <button
        className="btn btn-ui"
        onClick={() => {
          dispatch({ type: index == numberOfQuestions - 1 ? "finish" : "nextQuestion" });
        }}
      >
        {index == numberOfQuestions - 1 ? "Finish" : "Next"}
      </button>
    </div>
  );
}

export default NextQuestion;
