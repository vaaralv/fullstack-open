import { useState } from "react";

type Index = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface Votes {
  0: number;
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
  6: number;
  7: number;
}

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.",
  ];

  const [selected, setSelected] = useState<Index>(0);
  const [votes, setVotes] = useState<Votes>({
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
  });
  const [highestVotes, setHighestVotes] = useState(0);
  const random = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min)) + min;

  const handleNextClick = () => {
    let index: Index = random(0, anecdotes.length - 1) as Index;

    while (index === selected) {
      index = random(0, anecdotes.length - 1) as Index;
    }

    setSelected(index);
  };

  const handleVoteClick = () => {
    const copy = { ...votes };
    copy[selected] += 1;
    setVotes(copy);
    if (copy[selected] > highestVotes) setHighestVotes(copy[selected]);
  };

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
      <button onClick={handleVoteClick}>vote</button>
      <button onClick={handleNextClick}>next andecdote</button>
      <h1>Anecdote(s) with the most votes</h1>
      {Object.values(votes).filter((x) => x !== 0).length > 0 ? (
        <div>
          {Object.keys(votes)
            .filter((key) => votes[key as unknown as Index] === highestVotes)
            .map((index) => (
              <p>{anecdotes[index as unknown as Index]}</p>
            ))}
          <p>With {highestVotes} votes</p>
        </div>
      ) : (
        <p>No votes yet</p>
      )}
    </div>
  );
};

export default App;
