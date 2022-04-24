import { useRouter } from 'next/router';
import { useState } from 'react';
import agent from '../agent/agent';
import { PaginatedResult } from '../models/paginated-result';
import { SongType } from '../models/song';
import usePlayerContext from '../store/PlayerContext';
import { replaceStateWithQuery } from '../utils/utils';

interface Props {
  setLoadedResult: (
    result: PaginatedResult<SongType[]> | null,
    failure: boolean
  ) => void;
}

const SearchBar = ({ setLoadedResult }: Props) => {
  const { autoPlay, SetAutoPlay } = usePlayerContext();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState<string>(
    (router.query.query as string)?.replace('%20', ' ') || ''
  );
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: any) => {
    e.preventDefault();

    setLoading(true);

    try {
      const results = searchValue
        ? await agent.Songs.list(searchValue, 1)
        : await agent.Songs.getMainTracks();
      replaceStateWithQuery({ query: searchValue, page: '1' });
      setLoadedResult(results, false);
    } catch (error) {
      setLoadedResult(null, true);
    }

    setLoading(false);
  };

  return (
    <div className="card mt-2 bg-base-300 rounded-none lg:rounded-xl lg:mx-auto lg:w-3/6 w-full">
      <div className="card-body">
        <form className="flex flex-col" onSubmit={handleSearch}>
          <div className="flex lg:flex-row flex-col lg:gap-10">
            <input
              name="search"
              type="text"
              placeholder="Search a song..."
              className="input input-bordered w-full"
              value={searchValue}
              onInput={(e: any) => setSearchValue(e.target.value)}
            />
            <div className="card-actions justify-center lg:my-auto mt-2 ">
              <button
                className={`btn lg:w-32 w-full ${loading && 'loading'}`}
                type="submit"
              >
                Search
              </button>
            </div>
          </div>
          <div className="form-control w-fit mt-3">
            <label className="label cursor-pointer flex gap-5">
              <span className="label-text">Auto Play Next</span>
              <input
                type="checkbox"
                checked={autoPlay}
                onChange={(e) => SetAutoPlay!(e.target.checked)}
                className="checkbox checkbox-primary"
              />
            </label>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
