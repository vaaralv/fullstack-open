const Header = (course) => {
  return <h1>{course}</h1>;
};

const Part = (partName, exerciseAmount) => {
  return (
    <p>
      {partName} {exerciseAmount}
    </p>
  );
};

const Content = (p1, e1, p2, e2, p3, e3) => {
  return (
    <div>
      <Part partName={p1} exerciseAmount={e1} />
      <Part partName={p2} exerciseAmount={e2} />
      <Part partName={p3} exerciseAmount={e3} />
    </div>
  );
};

const Total = (amount) => {
  <p>Number of exercises {amount}</p>;
};

const App = () => {
  const course = "Half Stack application development";
  const part1 = "Fundamentals of React";
  const exercises1 = 10;
  const part2 = "Using props to pass data";
  const exercises2 = 7;
  const part3 = "State of a component";
  const exercises3 = 14;

  return (
    <div>
      <Header course={course} />
      <Content
        p1={part1}
        p2={part2}
        p3={part3}
        e1={exercises1}
        e2={exercises2}
        e3={exercises3}
      />
      <Total amount={exercises1 + exercises2 + exercises3} />
    </div>
  );
};

export default App;