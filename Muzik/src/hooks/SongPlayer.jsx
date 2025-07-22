import { useCallback, useState } from "react";
export default function useSongPlayer() {
  const [artist, setArtist] = useState(null);
  const [title, setTitle] = useState(null);
  const [isClicked, setIsClicked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currSong, setCurrSong] = useState(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleCardClick = useCallback((song) => {
    setArtist(song.artist);
    setTitle(song.title);
    setIsClicked(true);
    setCurrSong(song);
    setIsPlaying(true);
  });
  const handlePlayPauseClick = useCallback((song, event) => {
    event.stopPropagation();
    if (song === currSong) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrSong(song);
      setIsPlaying(true);
      setArtist(song.artist);
      setTitle(song.title);
      setIsClicked(true);
    }
  });
  const handleMouseEnter = useCallback(
    (song) => {
      setCurrSong(song);
      setIsPlaying(true);
      setArtist(song.artist);
      setTitle(song.title);
      setIsClicked(true);
      setIsHovering(true);
    },
  );
  const handleMouseLeave = useCallback(() => {
    setIsPlaying(false);
    setIsClicked(false);
    setCurrSong(null);
    setIsHovering(false);
  });
  const handleEnd = useCallback(() => {
    setCurrSong(null);
    setIsClicked(false);
    setArtist(null);
    setTitle(null);
  });
  const checkSongPlaying = useCallback((song) => {
    return currSong === song;
  });
  return {
    artist,
    title,
    isClicked,
    isPlaying,
    currSong,
    handleCardClick,
    handlePlayPauseClick,
    handleEnd,
    checkSongPlaying,
    handleMouseEnter,
    handleMouseLeave,
    isHovering,
  };
}
