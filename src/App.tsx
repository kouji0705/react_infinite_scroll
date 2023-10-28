import React, { useRef } from 'react';
import { useInfinityScroll } from './hooks/useInfinityScroll'

function App() {
  const containerRef = useRef(null);

  const fetchData = async (page: number) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}`);
    const data = await response.json();
    return data;
  };

  const data: Post[] = useInfinityScroll(containerRef, fetchData);

  return (
    <div>
      <div style={{height: '2000px'}}>Scroll down</div>
      <div ref={containerRef}>
        {data.map((item: Post) => (
          <div key={item.id}>
            <p>
              {item.id}：{item.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}
