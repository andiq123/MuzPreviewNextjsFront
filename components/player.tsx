import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import agent from '../agent/agent';
import usePlayerContext from '../store/PlayerContext';
import { PlayStatus } from '../store/playerReducer';
import { useSpring, animated, easings } from 'react-spring';

const Player = () => {
  const props = useSpring({
    to: { opacity: 1, transform: 'translateX(0)' },
    from: { opacity: 0, transform: 'translateY(5rem)' },
    config: {
      duration: 1500,
      easing: easings.easeInSine,
    },
  });
  const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const { playStatus, currentSong, SetPlay, SetPause, SetLoading, SetStopped } =
    usePlayerContext();
  const [timer, setTimer] = useState(0);
  const [changeTimer, setChangeTimer] = useState(timer);
  const [maxTime, setMaxTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [iconState, setIconState] = useState(faPlay);
  const audioEngine = useRef<HTMLAudioElement | undefined>(
    typeof Audio !== 'undefined' ? new Audio() : undefined
  );

  useEffect(() => {
    audioEngine.current!.oncanplay = () => {
      const duration = audioEngine.current!.duration;
      setMaxTime(duration);
      SetPlay!();
      audioEngine.current!.play();
    };

    audioEngine.current!.ontimeupdate = (e: any) => {
      const time = e.target.currentTime;
      setTimer(time);
    };

    audioEngine.current!.onended = () => {
      SetStopped!();
    };
  }, []);

  useEffect(() => {
    (async () => {
      if (!currentSong) return;
      SetLoading!();
      const src = await getSource();
      audioEngine.current!.src = src;
      audioEngine.current!.load();
    })();
  }, [currentSong]);

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

  const getSource = async () => {
    const data = await agent.Songs.stream(
      currentSong?.streamUrl!,
      currentSong?.artist! + currentSong?.duration!
    );
    return apiUrl + data.path;
  };

  //handle audio engine by status
  const handlePlayerPlayStatus = () => {
    switch (playStatus) {
      case PlayStatus.PAUSED:
        audioEngine.current?.pause();
        setIconState(faPlay);
        break;
      case PlayStatus.PLAYING:
        audioEngine.current?.play();
        setIconState(faPause);
        break;
      case PlayStatus.STOPPED:
        audioEngine.current?.pause();
        setIconState(faPlay);
        break;
      default:
        setIconState(faPause);
        break;
    }
  };

  //set status by opositing status
  const handlePlayPause = () => {
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
        break;
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
      <animated.div
        style={props}
        className={`
        card 
        lg:w-2/4
        bg-neutral-focus
        lg:rounded-xl
        w-full
        rounded-none
        pointer-events-auto 
        `}
      >
        <div className="card-body text-white w-full h-fit flex lg:flex-row flex-col">
          <button
            className={`btn my-auto lg:w-20  w-full flex-row justify-center align-middle ${
              playStatus === PlayStatus.LOADING ? 'loading px-0' : ''
            } `}
            onClick={handlePlayPause}
          >
            {playStatus !== PlayStatus.LOADING && (
              <FontAwesomeIcon icon={iconState} />
            )}
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
      </animated.div>
    </div>
  );
};

export default Player;
