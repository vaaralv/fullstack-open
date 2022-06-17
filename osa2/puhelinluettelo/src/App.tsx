import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import personService from "./services/persons";

interface Person {
  id?: number;
  name: string;
  number: string;
}

const Filter: React.FC<{
  searchTerm: string;
  setSearchTerm: (e: any) => void;
}> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div>
      filter:{" "}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

const AddNew: React.FC<{
  newName: string;
  setNewName: (e: any) => void;
  newNumber: string;
  setNewNumber: (e: any) => void;
  addName: (e: any) => void;
}> = ({ newName, setNewName, newNumber, setNewNumber, addName }) => {
  return (
    <div>
      <h2>Add new number</h2>
      <form onSubmit={(e) => addName(e)}>
        <div>
          name:{" "}
          <input value={newName} onChange={(e) => setNewName(e.target.value)} />
        </div>
        <div>
          number:{" "}
          <input
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  );
};

const Numbers: React.FC<{
  persons: Person[];
  searchTerm: string;
  setPersons: (persons: Person[]) => void;
  setMessage: (message: { message: string | null; error: boolean }) => void;
}> = ({ persons, searchTerm, setPersons, setMessage }) => {
  const handleDeleteClick = (personToDelete: Person) => {
    if (
      window.confirm(`Are you sure you want to delete ${personToDelete.name}?`)
    ) {
      personToDelete.id &&
        personService.remove(personToDelete.id).then((data) => {
          setPersons(
            persons.filter(
              (person) => person.id && person.id !== personToDelete.id
            )
          );
          setMessage({
            error: false,
            message: `${personToDelete.name} deleted`,
          });
          setTimeout(() => {
            setMessage({ message: null, error: false });
          }, 3000);
        });
    }
  };
  return (
    <div>
      <h2>Numbers</h2>
      {persons
        .filter((person) =>
          person.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((person, i) => (
          <p key={`person${i}`}>
            {person.name} {person.number}
            <button onClick={() => handleDeleteClick(person)}>delete</button>
          </p>
        ))}
    </div>
  );
};

const Notification: React.FC<{ error: boolean; message: string | null }> = ({
  error,
  message,
}) => {
  if (message === null) {
    return null;
  }

  return <div className={`${error ? "error" : "success"}`}>{message}</div>;
};

const App = () => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState<{
    error: boolean;
    message: string | null;
  }>({ error: false, message: null });

  useEffect(() => {
    personService.getAll().then((data) => {
      setPersons(data);
    });
  }, []);

  const addName = (event: any) => {
    event.preventDefault();
    if (persons.map((person) => person.name).includes(newName)) {
      if (
        window.confirm(
          `${newName} already has a number. Do you want to replace it?`
        )
      ) {
        const person = persons.find((person) => person.name === newName);
        person &&
          person.id &&
          personService
            .update(person.id, { ...person, number: newNumber })
            .catch((error) => {
              console.log(error);
              setMessage({
                error: true,
                message: `Information of ${person.name} has already been removed from server`,
              });
              setTimeout(() => {
                setMessage({ message: null, error: false });
              }, 3000);
              setPersons(persons.filter((p) => p.id !== person.id));
            })
            .then((updatedPerson) => {
              setPersons(
                persons.map((person) =>
                  person.id !== updatedPerson.id ? person : updatedPerson
                )
              );
              setMessage({
                error: false,
                message: `Number of ${updatedPerson.name} replaced`,
              });
              setTimeout(() => {
                setMessage({ message: null, error: false });
              }, 3000);
              setNewName("");
              setNewNumber("");
            })
            .catch((error) => {
              setMessage({
                error: true,
                message: error.response.data.error,
              });
              setTimeout(() => {
                setMessage({ message: null, error: false });
              }, 3000);
            });
      }
    } else {
      personService
        .create({ name: newName, number: newNumber })
        .then((newPerson) => {
          setPersons(persons.concat(newPerson));
          setNewName("");
          setNewNumber("");
          setMessage({ error: false, message: `${newPerson.name} added` });
          setTimeout(() => {
            setMessage({ message: null, error: false });
          }, 3000);
        })
        .catch((error) => {
          setMessage({
            error: true,
            message: error.response.data.error,
          });
          setTimeout(() => {
            setMessage({ message: null, error: false });
          }, 3000);
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message.message} error={message.error} />
      <Filter searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <AddNew
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
        addName={addName}
      />
      {persons && (
        <Numbers
          persons={persons}
          searchTerm={searchTerm}
          setPersons={setPersons}
          setMessage={setMessage}
        />
      )}
    </div>
  );
};

export default App;
