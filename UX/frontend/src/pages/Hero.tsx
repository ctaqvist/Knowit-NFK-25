import axios from 'axios';
import { useEffect, useState } from 'react';

type Content = any;

function Hero() {
  const [content, setContent] = useState<Content | null>(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/pages/hero`)
      .then((result) => {
        console.log(result)
        setContent(result.data)
      })
      .catch(console.error);
  }, []);

  return <h1>Testing content: {content?.h1}</h1>;
}

export default Hero;