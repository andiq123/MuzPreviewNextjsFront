import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SongType } from '../models/song';
import { faDownload, faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { PlayStatus } from '../store/playerReducer';
import { useEffect, useState } from 'react';
import usePlayerContext from '../store/PlayerContext';
import agent from '../agent/agent';
import { saveAs } from 'file-saver';

interface Props {
  song: SongType;
}

const Song = ({ song }: Props) => {
  const LIMIT_CHARS = 40;
  const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const { playStatus, currentSong, SetPause, SetPlay, SetCurrentSong } =
    usePlayerContext();
  const [playStatusLocal, setPlayStatusLocal] = useState(PlayStatus.PAUSED);

  useEffect(() => {
    if (currentSong?.id !== song.id) {
      setPlayStatusLocal(PlayStatus.PAUSED);
      return;
    }

    setPlayStatusLocal(playStatus);
  }, [playStatus, currentSong?.id]);

  const handleSetCurrentSong = () => {
    if (currentSong?.id !== song.id) {
      return SetCurrentSong!(song);
    }

    switch (playStatusLocal) {
      case PlayStatus.PLAYING:
        return SetPause!();
      case PlayStatus.PAUSED:
        return SetPlay!();
      default:
        return SetPause!();
    }
  };

  const trimIfTooLong = (str: string, limit: number) =>
    str.length > limit ? `${str.substring(0, limit)}...` : str;

  const downloadFile = async () => {
    const data = await agent.Songs.stream(song.streamUrl, song.artist);
    const downloadLink = apiUrl + data.path;
    saveAs(downloadLink, song.artist + '.mp3');
  };

  song = {
    ...song,
    artist: trimIfTooLong(song.artist, LIMIT_CHARS),
    title: trimIfTooLong(song.title, LIMIT_CHARS),
  };

  return (
    <>
      <div className="card w-full bg-base-300 my-1 rounded-none lg:rounded-xl">
        <div className="card-body flex flex-row py-1 px-4 text-xs">
          <button
            onClick={handleSetCurrentSong}
            // disabled={playStatus === PlayStatus.LOADING}
            className={`btn w-20 my-auto flex-row justify-center align-middle ${
              playStatusLocal === PlayStatus.LOADING ? 'loading px-0' : ''
            }`}
          >
            {(() => {
              switch (playStatusLocal) {
                case PlayStatus.PLAYING:
                  return <FontAwesomeIcon icon={faPause} />;
                case PlayStatus.PAUSED:
                  return <FontAwesomeIcon icon={faPlay} />;
                case PlayStatus.LOADING:
                  return <></>;
                default:
                  return <FontAwesomeIcon icon={faPlay} />;
              }
            })()}
          </button>

          <div className="flex flex-col">
            <h2 className="card-title">{song.artist}</h2>
            <p>{song.title}</p>
            <p>{song.duration}</p>
          </div>
          <button onClick={downloadFile} className="btn ml-auto my-auto">
            <FontAwesomeIcon icon={faDownload} />
          </button>
        </div>
      </div>
    </>
  );
};
export default Song;
