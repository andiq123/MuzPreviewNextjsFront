import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { PaginatedResult } from '../models/paginated-result';
import { SongType } from '../models/song';

interface Props {
  pagination: PaginatedResult<SongType[]>;
}

const Pagination = ({ pagination }: Props) => {
  const router = useRouter();
  const pagi = { ...pagination, items: undefined };

  useEffect(() => {
    for (let i = 0; i < pagi.totalPages; i++) {
      if (i === pagi.pageNumber) return;
      router.prefetch(`/?query=${router.query.query}&page=${i + 1}`, '/', {
        priority: true,
      });
    }
  }, [router]);

  const pages = new Array(
    pagi.totalPages < pagi.pageNumber ? pagi.totalPages + 1 : pagi.totalPages
  )
    .fill(1)
    .map((_, i) => i + 1);

  return (
    <div className="btn-group w-fit mx-auto mt-5">
      {pages.map((x) => (
        <Link
          key={x}
          href={{
            pathname: '/',
            query: {
              query: router.query.query,
              page: x,
            },
          }}
        >
          <button
            className={`btn ${pagi.pageNumber === x ? 'btn-active' : ''}`}
          >
            {x}
          </button>
        </Link>
      ))}
    </div>
  );
};

export default Pagination;
