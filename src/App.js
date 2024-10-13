import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";

const initialState = {
  questions: [],
  status: "Loading",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
      break;
    case "dataFailed":
      return { ...state, status: "error" };
    default:
      break;
  }
};
function App() {
  const [{ questions, status }, dispatch] = useReducer(reducer, initialState);
  const numberOfQuestions = questions.length;
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
        {status == "ready" && <StartScreen numberOfQuestions={numberOfQuestions} />}
      </Main>
    </div>
  );
}

export default App;
