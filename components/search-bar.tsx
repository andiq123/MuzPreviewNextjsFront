import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const SearchBar = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState<string>(
    (router.query.query as string) || ''
  );

  useEffect(() => {
    setLoading(false);
  }, [router]);

  const [loading, setLoading] = useState(false);

  return (
    <div className="card mt-2 bg-base-300 rounded-none lg:rounded-xl lg:mx-auto lg:w-fit w-full">
      <div className="card-body">
        <form className="flex lg:flex-row flex-col lg:gap-10">
          <input
            name="search"
            type="text"
            placeholder="Search a song..."
            className="input input-bordered w-full"
            value={searchValue}
            onInput={(e: any) => setSearchValue(e.target.value)}
          />
          <div className="card-actions justify-center lg:my-auto mt-2 ">
            <Link
              href={{
                pathname: '/',
                query: {
                  query: searchValue,
                  page: 1,
                },
              }}
            >
              <button
                className={`btn w-full ${loading ? 'loading' : ''}`}
                onClick={() => setLoading(true)}
                type="submit"
              >
                Search
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
