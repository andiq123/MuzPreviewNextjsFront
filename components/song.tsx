import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SongType } from '../models/song';
import { faDownload, faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { PlayStatus } from '../store/playerReducer';
import { useEffect, useState } from 'react';
import usePlayerContext from '../store/PlayerContext';
import agent from '../agent/agent';
import { saveAs } from 'file-saver';
import { trimIfTooLong } from '../utils/utils';

interface Props {
  song: SongType;
}

const Song = ({ song }: Props) => {
  const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const { playStatus, currentSong, SetPause, SetPlay, SetCurrentSong } =
    usePlayerContext();
  const [iconState, setIconState] = useState(faPlay);
  const [loadingDownload, setDownloadLoading] = useState(false);
  const [playLoading, setPlayLoading] = useState(false);

  useEffect(() => {
    if (currentSong?.id !== song.id) {
      setIconState(faPlay);
      return;
    }
    setIconStatus();
  }, [playStatus]);

  const handleSetCurrentSong = () => {
    if (currentSong?.id !== song.id) {
      SetCurrentSong!(song);
      return;
    }
    setRemotePlayStatus();
  };

  //set the oposite status on click
  const setRemotePlayStatus = () => {
    switch (playStatus) {
      case PlayStatus.PLAYING:
        SetPause!();
        break;
      case PlayStatus.PAUSED:
        SetPlay!();
        break;
      case PlayStatus.STOPPED:
        SetPlay!();
        break;
      default:
        SetPause!();
        break;
    }
  };

  //set the icon status direct
  const setIconStatus = () => {
    switch (playStatus) {
      case PlayStatus.PLAYING:
        setIconState(faPause);
        setPlayLoading(false);
        break;
      case PlayStatus.PAUSED:
        setIconState(faPlay);
        break;
      case PlayStatus.STOPPED:
        setIconState(faPlay);
        break;
      case PlayStatus.LOADING:
        setPlayLoading(true);
        break;
      default:
        setIconState(faPlay);
        break;
    }
  };

  const downloadFile = async () => {
    setDownloadLoading(true);
    const data = await agent.Songs.stream(
      song.streamUrl,
      song.artist + song.duration
    );
    const downloadLink = apiUrl + data.path;
    saveAs(downloadLink, song.artist + '.mp3');
    setDownloadLoading(false);
  };

  song = {
    ...song,
    artist: trimIfTooLong(song.artist),
    title: trimIfTooLong(song.title),
  };

  return (
    <>
      <div className="card w-full bg-base-300 my-1 rounded-none lg:rounded-xl">
        <div className="card-body text-white flex flex-row py-1 px-4 text-xs">
          <button
            onClick={handleSetCurrentSong}
            disabled={playStatus === PlayStatus.LOADING}
            className={`btn w-20 my-auto flex-row justify-center align-middle ${
              playLoading ? 'loading px-0' : ''
            }`}
          >
            {!playLoading && <FontAwesomeIcon icon={iconState} />}
          </button>

          <div className="flex flex-col">
            <h2 className="card-title">{song.artist}</h2>
            <p>{song.title}</p>
            <p>{song.duration}</p>
          </div>
          <button
            onClick={downloadFile}
            className={`btn ml-auto my-auto ${
              loadingDownload && 'loading w-fit'
            }`}
          >
            {!loadingDownload && <FontAwesomeIcon icon={faDownload} />}
          </button>
        </div>
      </div>
    </>
  );
};
export default Song;
