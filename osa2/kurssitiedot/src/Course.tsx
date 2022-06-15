const Header: React.FC<{ course: string }> = ({ course }) => {
  return <h2>{course}</h2>;
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
  parts: { name: string; exercises: number; id: number }[];
}> = ({ parts }) => {
  return (
    <div>
      {parts.map((part, i) => (
        <Part
          key={`part${i}`}
          partName={part.name}
          exerciseAmount={part.exercises}
        />
      ))}
    </div>
  );
};

const Total: React.FC<{
  parts: { name: string; exercises: number }[];
}> = ({ parts }) => {
  const amount: number = parts.reduce((a, b) => a + b.exercises, 0);
  return <b>Total exercises {amount}</b>;
};

const Course: React.FC<{
  course: {
    name: string;
    id: number;
    parts: { name: string; exercises: number; id: number }[];
  };
}> = ({ course }) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

export default Course;
