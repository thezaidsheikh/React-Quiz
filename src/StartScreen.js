function StartScreen({ numberOfQuestions }) {
  return (
    <div className="start">
      <h2>Welcome to the React Quiz!</h2>
      <h3>{numberOfQuestions} questions to test your react mastery</h3>
      <button className="btn btn-ui">Let's start</button>
    </div>
  );
}
export default StartScreen;
