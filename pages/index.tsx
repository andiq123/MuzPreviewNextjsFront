import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import agent from '../agent/agent';
import Pagination from '../components/pagination';
import Player from '../components/player';
import SearchBar from '../components/search-bar';
import Song from '../components/song';
import { PaginatedResult } from '../models/paginated-result';
import { SongType } from '../models/song';

interface Props {
  serverPaginatedResult: PaginatedResult<SongType[]> | null;
  error: boolean;
}

const Home: NextPage<Props> = ({ serverPaginatedResult, error }: Props) => {
  const [paginatedResult, setPaginatedResult] = useState<PaginatedResult<
    SongType[]
  > | null>(serverPaginatedResult);
  const songs = useMemo(() => paginatedResult?.items, [paginatedResult]);

  const setLoadedResult = (result: PaginatedResult<SongType[]>) => {
    setPaginatedResult(result);
  };

  return (
    <div className="w-full">
      <SearchBar setLoadedResult={setLoadedResult} />

      {error || !paginatedResult ? (
        <div className="card mt-2 bg-base-300 rounded-none lg:rounded-xl lg:mx-auto lg:w-fit w-full">
          <div className="card-body">
            <p>No music found with this criteria</p>
          </div>
        </div>
      ) : (
        <div className="mx-auto my-5 lg:w-3/5 w-full">
          {songs?.map((x) => (
            <Song key={x.id} song={x} />
          ))}
        </div>
      )}

      {paginatedResult!.totalPages > 0 && (
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
