import { SongType } from '../models/song';

export const enum PlayStatus {
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  STOPPED = 'STOPPED',
  LOADING = 'LOADING',
}

export interface PlayerState {
  playStatus: PlayStatus;
  currentSong: SongType | null;
  SetPlay?: () => void;
  SetPause?: () => void;
  SetLoading?: () => void;
  SetStopped?: () => void;
  SetCurrentSong?: (song: SongType) => void;
}

export const initialState: PlayerState = {
  playStatus: PlayStatus.STOPPED,
  currentSong: null,
};

export const enum Actions {
  SET_PLAY = 'SET_PLAY',
  SET_PAUSE = 'SET_PAUSE',
  SET_LOADING = 'SET_LOADING',
  SET_STOPPED = 'SET_STOPPED',
  SET_CURRENT_SONG = 'SET_CURRENT_SONG',
  SET_PROGRESS = 'SET_PROGRESS',
}

export const PlayerReducer = (
  state = initialState,
  action: { type: Actions; payload?: any }
) => {
  switch (action.type) {
    case Actions.SET_PLAY:
      return {
        ...state,
        playStatus: PlayStatus.PLAYING,
      };
    case Actions.SET_PAUSE:
      return {
        ...state,
        playStatus: PlayStatus.PAUSED,
      };
    case Actions.SET_STOPPED:
      return {
        ...state,
        playStatus: PlayStatus.STOPPED,
      };
    case Actions.SET_LOADING:
      return {
        ...state,
        playStatus: PlayStatus.LOADING,
      };
    case Actions.SET_CURRENT_SONG:
      return {
        ...state,
        currentSong: action.payload,
      };
    default:
      console.log('error in reducer');
      return state;
  }
};
