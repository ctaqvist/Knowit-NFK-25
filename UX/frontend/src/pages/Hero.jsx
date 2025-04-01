import { useState } from 'react';

function Hero() {
  const [click, setClick] = useState(0);

  function handleClick() {
    setClick((click) => click + 1);
  }

  return (
    <>
      <p>This is the Hero component</p>
      <button onClick={handleClick}>Click to increase: {click}</button>
    </>
  );
}

export default Hero;
