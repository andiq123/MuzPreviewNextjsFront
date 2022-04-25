import { useRouter } from 'next/router';
import { PaginatedResult } from '../models/paginated-result';
import { SongType } from '../models/song';

interface Props {
  pagination: PaginatedResult<SongType[]>;
  handleSearch: (searchValue: string, page: number) => Promise<void>;
}

const Pagination = ({ pagination, handleSearch }: Props) => {
  const router = useRouter();

  const pages = new Array(
    pagination.totalPages < pagination.pageNumber
      ? pagination.totalPages + 1
      : pagination.totalPages
  )
    .fill(1)
    .map((_, i) => i + 1);

  const handlePageClick = async (page: number) => {
    if (page === pagination.pageNumber) {
      return;
    }
    const searchValue = router.query.query as string;
    await handleSearch(searchValue, page);
    router.push(`/?query=${searchValue}&page=${page}`, undefined, {
      shallow: true,
      scroll: true,
    });
  };

  return (
    <div className="btn-group w-fit mx-auto mt-5 shadow-lg">
      {pages.map((x) => (
        <button
          key={x}
          onClick={(e) => handlePageClick(x)}
          className={`btn bg-opacity-50 border-none ${
            pagination.pageNumber === x ? 'btn-active' : ''
          }`}
        >
          {x}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
