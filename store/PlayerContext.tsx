import { createContext, useContext, useReducer } from 'react';
import { SongType } from '../models/song';
import { Actions, initialState, PlayerReducer } from './playerReducer';

const PlayerContext = createContext(initialState);

interface Props {
  children: React.ReactNode;
}

export const PlayerContextProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(PlayerReducer, initialState);

  const SetPlay = () => {
    dispatch({ type: Actions.SET_PLAY });
  };

  const SetPause = () => {
    dispatch({ type: Actions.SET_PAUSE });
  };

  const SetStopped = () => {
    dispatch({ type: Actions.SET_STOPPED });
  };

  const SetLoading = () => {
    dispatch({ type: Actions.SET_LOADING });
  };

  const SetCurrentSong = (song: SongType) => {
    dispatch({ type: Actions.SET_CURRENT_SONG, payload: song });
  };

  const value = {
    playStatus: state.playStatus,
    currentSong: state.currentSong,
    SetPlay,
    SetPause,
    SetStopped,
    SetLoading,
    SetCurrentSong,
  };
  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
};

const usePlayerContext = () => {
  return useContext(PlayerContext);
};

export default usePlayerContext;
