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
import Timer from "./Timer";
import Footer from "./Footer";

const SEC_PER_QUEST = 10;
const initialState = {
  questions: [],
  status: "Loading",
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  correctAnswer: 0,
  incorrectAnswer: 0,
  secRemaining: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
      break;
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return { ...state, status: "active", secRemaining: state.questions.length * SEC_PER_QUEST };
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
    case "tick": {
      if (state.secRemaining === 0) state.highScore = state.points > state.highScore ? state.points : state.highScore;
      return { ...state, secRemaining: state.secRemaining ? state.secRemaining - 1 : 0, status: state.secRemaining === 0 ? "finish" : state.status };
    }
    default:
      break;
  }
};
function App() {
  const [{ questions, status, index, answer, points, highScore, correctAnswer, incorrectAnswer, secRemaining }, dispatch] = useReducer(reducer, initialState);
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
            <Footer>
              <Timer dispatch={dispatch} secRemaining={secRemaining} />
            </Footer>
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
