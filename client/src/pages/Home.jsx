import React, { useEffect, useState } from 'react';
// import Gift from '../components/gift';

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
              {/* { <Gift />} */}
            </div>
          ))}
    </div>
  )
}

export default Home
