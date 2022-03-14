import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import agent from '../agent/agent';
import usePlayerContext from '../store/PlayerContext';
import { PlayStatus } from '../store/playerReducer';

const Player = () => {
  const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const { playStatus, currentSong, SetPlay, SetPause, SetLoading } =
    usePlayerContext();
  const [timer, setTimer] = useState(0);
  const [changeTimer, setChangeTimer] = useState(timer);
  const [maxTime, setMaxTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioEngine = useRef<HTMLAudioElement | undefined>(
    typeof Audio !== 'undefined' ? new Audio() : undefined
  );

  const getSource = async () => {
    const data = await agent.Songs.stream(
      currentSong?.streamUrl!,
      currentSong?.artist!
    );
    return apiUrl + data.path;
  };

  useEffect(() => {
    audioEngine.current!.oncanplay = () => {
      setMaxTime(audioEngine.current!.duration);
      audioEngine.current?.play();
      SetPlay!();
    };

    audioEngine.current!.onended = () => {
      SetPause!();
    };

    audioEngine.current!.ontimeupdate = (e: any) => {
      const time = e.target.currentTime;
      setTimer(time);
    };
  }, []);

  useEffect(() => {
    if (!currentSong) return;

    SetLoading!();
    getSource().then((src) => {
      audioEngine.current!.src = src;
    });
  }, [currentSong?.id]);

  useEffect(() => {
    audioEngine.current!.currentTime = changeTimer;
  }, [changeTimer]);

  useEffect(() => {
    audioEngine.current!.volume = volume;
  }, [volume]);

  //handle remote status change
  useEffect(() => {
    handlePlayerPlayStatus();
  }, [playStatus]);

  const handlePlayerPlayStatus = () => {
    switch (playStatus) {
      case PlayStatus.PAUSED:
        return audioEngine.current?.pause();
      case PlayStatus.PLAYING:
        return audioEngine.current?.play();
      default:
        return audioEngine.current?.pause();
    }
  };

  const handlePlayPause = () => {
    switch (playStatus) {
      case PlayStatus.PLAYING:
        return SetPause!();
      case PlayStatus.PAUSED:
        return SetPlay!();
      default:
        return SetPause!();
    }
  };

  const changeTimerHandler = (e: any) => {
    const value = e.target.value;
    setChangeTimer(value);
  };

  const convertTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!currentSong) return null;

  return (
    <div className="w-full fixed bottom-0 flex justify-center pointer-events-none">
      <div className="card lg:w-2/4 lg:rounded-xl w-full bg-neutral-focus rounded-none pointer-events-auto">
        <div className="card-body w-full h-fit flex lg:flex-row flex-col">
          <button
            className={`btn my-auto lg:w-20  w-full flex-row justify-center align-middle ${
              playStatus === PlayStatus.LOADING ? 'loading px-0' : ''
            } `}
            onClick={handlePlayPause}
          >
            {(() => {
              switch (playStatus) {
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
          <div className="flex flex-col w-full">
            <div>
              <h2>{currentSong?.artist}</h2>
              <h2>{currentSong?.title}</h2>
            </div>
            <div className="flex lg:flex-row flex-col-reverse">
              <input
                className="range range-primary"
                type="range"
                value={timer}
                onInput={changeTimerHandler}
                max={maxTime}
              />
              <div className="flex px-5 mx-auto w-fit">
                <p>{convertTime(timer)}</p> /<p>{convertTime(maxTime)}</p>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <span>Volume</span>
            <input
              className="range range-primary"
              type="range"
              value={volume}
              onInput={(e: any) => setVolume(e.target.value)}
              step="0.1"
              max="1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
