import type { NextPage } from 'next';
import Head from 'next/head';
import { useMemo, useState } from 'react';
import { easings, useSpring, config, animated } from 'react-spring';
import agent from '../agent/agent';
import Pagination from '../components/pagination';
import Player from '../components/player';
import SearchBar from '../components/search-bar';
import Song from '../components/song';
import { PaginatedResult } from '../models/paginated-result';
import { SongType } from '../models/song';
import usePlayerContext from '../store/PlayerContext';

interface Props {
  serverPaginatedResult: PaginatedResult<SongType[]> | null;
  error: boolean;
}

const Home: NextPage<Props> = ({ serverPaginatedResult, error }: Props) => {
  const props = useSpring({
    to: { opacity: 1, transform: 'translateX(0)' },
    from: { opacity: 0, transform: 'translateY(5rem)' },
    config: {
      duration: 200,
      easing: easings.easeInSine,
    },
  });
  const { currentSong } = usePlayerContext();
  const [paginatedResult, setPaginatedResult] = useState<PaginatedResult<
    SongType[]
  > | null>(serverPaginatedResult);
  const [errorSongs, setErrorSongs] = useState(error);
  const songs = useMemo(() => paginatedResult?.items, [paginatedResult]);

  const setLoadedResult = (
    result: PaginatedResult<SongType[]> | null,
    failure: boolean
  ) => {
    setErrorSongs(failure);
    if (failure) {
      return setPaginatedResult(null);
    }
    setPaginatedResult(result);
  };

  return (
    <div className="w-full">
      <div>
        <Head>
          <title>
            {currentSong ? currentSong?.artist : 'Listen to any song!'}
          </title>
        </Head>
      </div>
      <SearchBar setLoadedResult={setLoadedResult} />

      {errorSongs || !paginatedResult ? (
        <animated.div
          style={props}
          className="card mt-2 bg-base-300 rounded-none lg:rounded-xl lg:mx-auto lg:w-fit w-full"
        >
          <div className="card-body">
            <p>No music found with this criteria</p>
          </div>
        </animated.div>
      ) : (
        <animated.div style={props} className="mx-auto my-5 lg:w-3/5 w-full">
          {songs?.map((x) => (
            <Song key={x.id} song={x} />
          ))}
        </animated.div>
      )}

      {paginatedResult && paginatedResult?.totalPages > 0 && (
        <div className="mb-64">
          <Pagination pagination={serverPaginatedResult!} />
        </div>
      )}
      <Player />
    </div>
  );
};

export async function getServerSideProps(context: any) {
  try {
    const { query, page } = context.query;
    if (query) {
      const result = await agent.Songs.list(query, page ?? 1);
      return {
        props: {
          serverPaginatedResult: result,
        },
      };
    }

    const result = await agent.Songs.getMainTracks();

    return {
      props: {
        serverPaginatedResult: result,
      } as Props, // will be passed to the page component as props
    };
  } catch (error) {
    return {
      props: {
        serverPaginatedResult: null,
        error: true,
      } as Props,
    };
  }
}

export default Home;
