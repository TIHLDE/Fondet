import { useEffect } from 'react';

export default function useInView(func: () => void, threshold: number, ref: React.RefObject<Element>): void {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        observer.disconnect();
        func();
      }
    },
    { threshold },
  );

  useEffect(() => {
    observer.observe(ref.current as Element);
    return () => {
      observer.disconnect();
    };
  }, []);
}
