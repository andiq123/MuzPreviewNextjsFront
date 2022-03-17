import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { PaginatedResult } from '../models/paginated-result';
import { SongType } from '../models/song';

interface Props {
  pagination: PaginatedResult<SongType[]>;
}

const Pagination = ({ pagination }: Props) => {
  const url = new URL(window.location.toString());
  const query = url.searchParams.get('query');

  const pages = new Array(
    pagination.totalPages < pagination.pageNumber
      ? pagination.totalPages + 1
      : pagination.totalPages
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
              query: query,
              page: x,
            },
          }}
        >
          <button
            className={`btn ${pagination.pageNumber === x ? 'btn-active' : ''}`}
          >
            {x}
          </button>
        </Link>
      ))}
    </div>
  );
};

export default Pagination;
