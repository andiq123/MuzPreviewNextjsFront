import { SongType } from '../models/song';

export const enum PlayStatus {
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  LOADING = 'LOADING',
}

export interface PlayerState {
  playStatus: PlayStatus;
  currentSong: SongType | null;
  SetPlay?: () => void;
  SetPause?: () => void;
  SetLoading?: () => void;
  SetCurrentSong?: (song: SongType) => void;
}

export const initialState: PlayerState = {
  playStatus: PlayStatus.PAUSED,
  currentSong: null,
};

export const enum Actions {
  SET_PLAY = 'SET_PLAY',
  SET_PAUSE = 'SET_PAUSE',
  SET_LOADING = 'SET_LOADING',
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
      return state;
  }
};
