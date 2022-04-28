import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SongType } from '../models/song';
import {
  faDownload,
  faMusic,
  faPause,
  faPlay,
} from '@fortawesome/free-solid-svg-icons';
import { PlayStatus } from '../store/playerReducer';
import { useEffect, useState } from 'react';
import usePlayerContext from '../store/PlayerContext';
import agent from '../agent/agent';
import { saveAs } from 'file-saver';
import { trimIfTooLong } from '../utils/utils';
import { LyricsResponse } from '../utils/interfaces/lyrics-response.interface';

interface Props {
  song: SongType;
  setLyricsModal: (data: { lyrics: string; title: string }) => void;
}

const Song = ({ song, setLyricsModal }: Props) => {
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

  const [lyricsLoading, setLyricsLoading] = useState(false);
  const [noLyrics, setNoLyrics] = useState(false);
  const getLyrics = async () => {
    setLyricsLoading(true);
    const data = await fetch(`api/lyrics?songName=${song.artist}`);
    const lyricsData: LyricsResponse = await data.json();
    if (lyricsData.error) {
      setLyricsLoading(false);
      setNoLyrics(true);
      return;
    }
    setLyricsLoading(false);
    setLyricsModal({ lyrics: lyricsData.lyrics!, title: song.artist });
  };

  return (
    <>
      <div className="card w-full bg-base-300 bg-opacity-50 backdrop-blur-3xl my-1 rounded-none lg:rounded-xl shadow-lg">
        <div className="card-body flex flex-row py-1 px-4 text-xs">
          <button
            onClick={handleSetCurrentSong}
            disabled={playStatus === PlayStatus.LOADING}
            className={`btn bg-opacity-50 border-none w-20 my-auto flex-row justify-center align-middle ${
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

          <div className="flex flex-row align-middle ml-auto my-auto gap-5">
            {noLyrics && (
              <p className="my-auto font-bold text-secondary text-xl">
                No lyrics found
              </p>
            )}
            <button
              className={`btn bg-opacity-50 border-none ${
                lyricsLoading && 'loading w-fit'
              }`}
              onClick={getLyrics}
            >
              <FontAwesomeIcon icon={faMusic} />
            </button>
            <button
              onClick={downloadFile}
              className={`btn bg-opacity-50 border-none ${
                loadingDownload && 'loading w-fit'
              }`}
            >
              {!loadingDownload && <FontAwesomeIcon icon={faDownload} />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Song;
