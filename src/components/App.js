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
};

const reducer = (state, action) => {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
      break;
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return { ...state, status: "active" };
    case "newAnswer": {
      const question = state.questions[state.index];
      return { ...state, answer: action.payload, points: action.payload === question.correctOption ? state.points + question.points : state.points };
    }
    case "nextQuestion": {
      return { ...state, index: state.index + 1, answer: null };
    }
    case "finish": {
      return { ...state, status: "finish" };
    }
    default:
      break;
  }
};
function App() {
  const [{ questions, status, index, answer, points }, dispatch] = useReducer(reducer, initialState);
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
            <FinishScreen points={points} maxPossiblePoints={maxPossiblePoints} />
          </>
        )}
      </Main>
    </div>
  );
}

export default App;
