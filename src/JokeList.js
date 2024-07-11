import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */

function JokeList({ numJokesToGet=5 }) {
  const [jokes, setJokes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  

  /* retrieve jokes from API */

  useEffect(function fetchJokesWhenMounted(){
    async function fetchJokes(){
      try{
        let j = [];
        let seenJokes = new Set();
        while (j.length < numJokesToGet){
          let res = await axios.get("https://icanhazdadjoke.com");
          let { ...joke } = res.data;  
          if (!seenJokes.has(joke.id)) {
            seenJokes.add(joke.id);
            j.push({ ...joke, votes: 0 });
          } else {
            console.log("duplicate found!");
          }
        }  
        setJokes(j);
        setIsLoading(false);
      }catch(err){
          console.error(err);
        }     
    }
    fetchJokes();
  }, [numJokesToGet])

  /* empty joke list, set to loading state, and then call getJokes */

  function generateNewJokes() {
    setIsLoading(true);
    setJokes([]);
  }

  /* change vote for this id by delta (+1 or -1) */

  function vote(id, delta) {
    setJokes(allJokes =>
      allJokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j))
    );
  }

  /* render: either loading spinner or list of sorted jokes. */


    let sortedJokes = [...this.state.jokes].sort((a, b) => b.votes - a.votes);
    if (isLoading) {
      return (
        <div className="loading">
          <i className="fas fa-4x fa-spinner fa-spin" />
        </div>
      )
    }

    return (
      <div className="JokeList">
        <button
          className="JokeList-getmore"
          onClick={generateNewJokes}
        >
          Get New Jokes
        </button>

        {sortedJokes.map(j => (
          <Joke
            text={j.joke}
            key={j.id}
            id={j.id}
            votes={j.votes}
            vote={vote}
          />
        ))}
      </div>
    );
}

export default JokeList;
