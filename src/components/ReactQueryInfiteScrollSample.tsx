import {FC, useRef} from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import React from 'react';
import axios from 'axios';
import {useInfiniteQuery} from 'react-query';

export const ReactQueryInfiteScrollSample: FC = () => {
  const containerRef = useRef(null);
  const LIMIT = 10;

  const fetchData = async (page: number) => {
    console.log('fetchData call page', page);
    const response = await axios.get<Post[]>(`https://jsonplaceholder.typicode.com/posts?_page=${page}`);
    const data = response.data;
    return data;
  };

  const {data, isLoading, isFetching, hasNextPage, fetchNextPage} = useInfiniteQuery(
    'todos',
    ({pageParam = 1}) => fetchData(pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = lastPage.length === LIMIT ? allPages.length + 1 : undefined;
        return nextPage;
      },
    }
  );

  if (isLoading) return <div />;

  return (
    <div>
      <div style={{height: '2000px'}}>無限スクロール</div>
      {isFetching && <div className="loading">Loading...</div>}
      <div ref={containerRef}>
        <InfiniteScroll loadMore={(page) => fetchNextPage({pageParam: page})} hasMore={hasNextPage}>
          {data?.pages.map((page, i) => (
            <div key={i}>
              {page.map((item: Post) => (
                <div key={item.id}>
                  <p>
                    {item.id}：{item.title}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}
