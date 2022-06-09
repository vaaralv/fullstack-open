const Header: React.FC<{ course: string }> = ({ course }) => {
  return <h1>{course}</h1>;
};

const Part: React.FC<{ partName: string; exerciseAmount: number }> = ({
  partName,
  exerciseAmount,
}) => {
  return (
    <p>
      {partName} {exerciseAmount}
    </p>
  );
};

const Content: React.FC<{
  parts: { name: string; exercises: number }[];
}> = ({ parts }) => {
  return (
    <div>
      {parts.map((part) => (
        <Part partName={part.name} exerciseAmount={part.exercises} />
      ))}
    </div>
  );
};

const Total: React.FC<{
  parts: { name: string; exercises: number }[];
}> = ({ parts }) => {
  const amount: number = parts.reduce((a,b) => a + b.exercises, 0)
  return <p>Number of exercises {amount}</p>;
};

const App = () => {
  const course = "Half Stack application development";
  const parts = [
    {
      name: "Fundamentals of React",
      exercises: 10,
    },
    {
      name: "Using props to pass data",
      exercises: 7,
    },
    {
      name: "State of a component",
      exercises: 14,
    },
  ];

  return (
    <div>
      <Header course={course} />
      <Content
        parts={parts}
      />
      <Total parts={parts} />
    </div>
  );
};

export default App;
