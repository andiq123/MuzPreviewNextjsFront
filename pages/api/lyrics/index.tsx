import type { NextApiRequest, NextApiResponse } from 'next';
import { TrackDetailsResponse } from '../../../utils/interfaces/track-details-reponse.interface';
const API_KEY = process.env.NEXT_PUBLIC_MUSIXMATCH_API_KEY;
const BASE_API_URL = 'https://api.musixmatch.com/ws/1.1/';

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const songName = req.query.songName as string;

  const artist = songName.split('-')[0]?.trim();
  const title = songName.split('-')[1]?.trim();
  if (!artist || !title) {
    return res.status(404).json({
      error: 'Invalid song name',
    });
  }

  const songGet = encodeURI(
    `${BASE_API_URL}track.search?apikey=${API_KEY}&q_artist=${artist}&q_track=${title}&page_size=1&page=1&s_track_rating=desc&f_has_lyrics=1`
  );

  try {
    const songResponse = await fetch(songGet);
    const songData: TrackDetailsResponse = await songResponse.json();

    if (
      songData.message.header.status_code !== 200 ||
      songData.message.header.available === 0
    ) {
      return res.status(404).json({ error: 'Not found' });
    }

    const songId = songData.message.body.track_list[0].track.track_id;

    const lyricsGet = encodeURI(
      `${BASE_API_URL}track.lyrics.get?apikey=${API_KEY}&track_id=${songId}`
    );
    const lyricsResponse = await fetch(lyricsGet);
    const lyricsData = await lyricsResponse.json();

    return res
      .status(200)
      .json({ lyrics: lyricsData.message.body.lyrics.lyrics_body });
  } catch (error) {
    return res.status(404).json({ error: 'Not found' });
  }
};
