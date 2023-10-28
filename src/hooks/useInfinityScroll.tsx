import {RefObject, useCallback, useEffect, useState} from 'react';

const options ={
    root: null, // ルート要素 (viewport) を使用
    rootMargin: '0px',
    threshold: 0, // 要素が完全に表示された場合にコールバックを呼び出す
}

export const useInfinityScroll = <T,>(ref: RefObject<HTMLElement | null>, fetch: (page: number) => Promise<T[]>) => {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false); // 読み込み中のフラグ
  const [hasMoreData, setHasMoreData] = useState(true); // 追加データがあるかどうかを追跡

  const scrollObserver = useCallback(
    () =>
      new IntersectionObserver((entries) => {
        console.log('entries', entries);
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoading && hasMoreData) {
            setIsLoading(true); // 読み込み中フラグを設定
            fetch(page).then((_data) => {
              console.log('fetch call page', page);
              if (_data.length > 0) {
                setPage(page + 1);
                setData((oldValue) => [...oldValue, ..._data]);
              } else {
                // 追加データがない場合
                setHasMoreData(false);
              }
              setIsLoading(false);
            });
          }
        });
      },options),
    [page, fetch, isLoading, hasMoreData]
  );
  useEffect(() => {
    const target = ref.current;
    if (target) {
      const observer = scrollObserver();
      observer.observe(target);
      return () => {
        observer.unobserve(target);
      };
    }
  }, [scrollObserver, ref]);

  return data;
};
