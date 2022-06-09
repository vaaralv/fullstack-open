import { useState } from "react";

const StatisticsLine: React.FC<{
  text: string;
  value: number;
  percentage?: boolean;
}> = ({ text, value, percentage }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>
        {value} {percentage && "%"}
      </td>
    </tr>
  );
};

const Statistics: React.FC<{
  stats: { name: string; value: number; percentage?: boolean }[];
}> = ({ stats }) => {
  if (stats.map((stat) => stat.value).includes(NaN)) {
    return <p>No feeback given</p>;
  } else
    return (
      <table>
        <tbody>
          {stats.map((stat, i) => (
            <StatisticsLine
              key={`stat-${i}`}
              text={stat.name}
              value={stat.value}
              percentage={stat.percentage}
            />
          ))}
        </tbody>
      </table>
    );
};

const Button: React.FC<{ text: string; click: () => void }> = ({
  text,
  click,
}) => {
  return <button onClick={click}>{text}</button>;
};

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <h1>give feedback</h1>
      <Button text="good" click={() => setGood(good + 1)} />
      <Button text="neutral" click={() => setNeutral(neutral + 1)} />
      <Button text="bad" click={() => setBad(bad + 1)} />
      <h1>statistics</h1>
      <Statistics
        stats={[
          { name: "good", value: good },
          { name: "neutral", value: neutral },
          { name: "bad", value: bad },
          { name: "all", value: good + neutral + bad },
          { name: "average", value: (good - bad) / (good + neutral + bad) },
          {
            name: "positive",
            value: (good / (good + neutral + bad)) * 100,
            percentage: true,
          },
        ]}
      />
    </div>
  );
};

export default App;
