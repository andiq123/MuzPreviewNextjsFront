import { useRouter } from 'next/router';
import { useState } from 'react';
import usePlayerContext from '../store/PlayerContext';

interface Props {
  handleSearch: (searchValue: string) => void;
  loading: boolean;
}

const SearchBar = ({ handleSearch, loading }: Props) => {
  const { autoPlay, SetAutoPlay } = usePlayerContext();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState<string>(
    decodeURI((router.query.query as string) || '') || ''
  );

  const handleSearchClick = async (e: any) => {
    e.preventDefault();
    handleSearch(searchValue);
  };

  return (
    <div className="card mt-2 bg-base-300 bg-opacity-50 backdrop-blur-3xl shadow-lg rounded-none lg:rounded-xl lg:mx-auto lg:w-3/6 w-full">
      <div className="card-body">
        <form className="flex flex-col" onSubmit={handleSearchClick}>
          <div className="flex lg:flex-row flex-col lg:gap-10">
            <input
              name="search"
              type="text"
              placeholder="Search a song..."
              className="input input-bordered w-full max-w-xs bg-opacity-50"
              value={searchValue}
              onInput={(e: any) => setSearchValue(e.target.value)}
            />
            <div className="card-actions justify-center lg:my-auto mt-2 ">
              <button
                className={`btn border-none bg-opacity-50 lg:w-32 w-full ${
                  loading && 'loading'
                }`}
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
