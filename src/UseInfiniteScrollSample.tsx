import React, { useRef } from 'react';
import { useInfiniteScroll } from './hooks/useInfiniteScroll'
import { Post } from './type'

export function UseInfiniteScrollSample() {
    const containerRef = useRef(null);
  
    const fetchData = async (page: number) => {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}`);
      const data = await response.json();
      return data;
    };
  
    const data: Post[] = useInfiniteScroll(containerRef, fetchData);
  
    return (
      <div>
        <div style={{height: '2000px'}}>無限スクロール開始</div>
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
