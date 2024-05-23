import React, { useEffect, useState } from 'react';

function Home() {
  const [giftes, setGiftes] = useState();

  useEffect(() => {
    const url = `http://localhost:3000/home`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setGiftes(data);
      })
  }, []);
  return (
    <div>
        { 
          giftes.map((gift, index) => (
            <div key={index}>
              {/* <Todo todo={todo} todos={todos} searchCriteria={searchCriteria} sortCriteria={sortCriteria} setTodos={setTodos} indexUpdateTask={indexUpdateTask} setIndexUpdateTask={setIndexUpdateTask} /> */}
            </div>
          ))}
    </div>
  )
}

export default Home
