import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import Progress from "./Progress";
import NextQuestion from "./NextQuestion";
import FinishScreen from "./FinishScreen";

const initialState = {
  questions: [],
  status: "Loading",
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  correctAnswer: 0,
  incorrectAnswer: 0,
};

const reducer = (state, action) => {
  debugger;
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "finish" };
      break;
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return { ...state, status: "active" };
    case "newAnswer": {
      const question = state.questions[state.index];
      let points = state.points || 0;
      let correctAnswer = state.correctAnswer || 0;
      let incorrectAnswer = state.incorrectAnswer || 0;
      if (action.payload === question.correctOption) {
        points = state.points + question.points;
        correctAnswer = state.correctAnswer + 1;
      } else incorrectAnswer = state.incorrectAnswer + 1;

      return { ...state, answer: action.payload, points: points, correctAnswer: correctAnswer, incorrectAnswer: incorrectAnswer };
    }
    case "nextQuestion": {
      return { ...state, index: state.index + 1, answer: null };
    }
    case "finish": {
      state.highScore = state.points > state.highScore ? state.points : state.highScore;
      return { ...state, status: "finish" };
    }
    case "restart": {
      return { ...initialState, questions: state.questions, highScore: state.highScore, status: "ready" };
    }
    default:
      break;
  }
};
function App() {
  const [{ questions, status, index, answer, points, highScore, correctAnswer, incorrectAnswer }, dispatch] = useReducer(reducer, initialState);
  const numberOfQuestions = questions.length;

  const maxPossiblePoints = questions.reduce((prev, curr) => prev + curr.points, 0);
  useEffect(function () {
    fetch(`http://localhost:9000/question`)
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: "dataReceived", payload: data });
      })
      .catch((error) => dispatch({ type: "dataFailed" }));
  }, []);
  return (
    <div className="app">
      <Header />
      <Main>
        {status == "Loading" && <Loader />}
        {status == "error" && <Error />}
        {status == "ready" && <StartScreen numberOfQuestions={numberOfQuestions} dispatch={dispatch} />}
        {status == "active" && (
          <>
            <Progress numberOfQuestions={numberOfQuestions} index={index} points={points} maxPossiblePoints={maxPossiblePoints} answer={answer} />
            <Question question={questions[index]} dispatch={dispatch} answer={answer} />
            <NextQuestion dispatch={dispatch} numberOfQuestions={numberOfQuestions} index={index} answer={answer} />
          </>
        )}
        {status == "finish" && (
          <>
            <FinishScreen points={points} maxPossiblePoints={maxPossiblePoints} dispatch={dispatch} highScore={highScore} correctAnswer={correctAnswer} incorrectAnswer={incorrectAnswer} />
          </>
        )}
      </Main>
    </div>
  );
}

export default App;
