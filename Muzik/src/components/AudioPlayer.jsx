import {useState, useEffect, useRef} from 'react';
export default function AudioPlayer({song, selectedArtist, selectedTitle, onEnd, isPlaying}){
    const [previewUrl, setPreviewUrl] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const query = `${selectedArtist} ${selectedTitle}`;
    const isSelected = (song.artist === selectedArtist && song.title === selectedTitle);
    const audioRef = useRef(null)
    async function fetchPreviewUrl() {
        setIsLoading(true);
        try {
            const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}`);
            const data = await response.json();
            const song = data.results;
            if (song.length > 0 && song[0].previewUrl) {
                setPreviewUrl(song[0].previewUrl);
            } else {
                setError('No preview available at this time');
                setPreviewUrl(null);
            }
        } catch (error) {
            setError('Error loading preview');
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        if (!isSelected) return;
        fetchPreviewUrl()
    }, [selectedArtist, selectedTitle]);
    useEffect(() => {
        if (!isSelected || !previewUrl) return;
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) {
            audio.play();
        } else {
            audio.pause();
        }
    }, [previewUrl, isPlaying, isSelected]);
    if (!isSelected) return null;
    return (
        <div className="inline-audio-player">
            {isLoading && <span>Loading preview...</span>}
            {error && <span>{error}</span>}
            {previewUrl && (
                <><audio ref={audioRef} onEnded={onEnd}className="inline-audio-controls">
                    <source src={previewUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
                </>
            )}
        </div>
    );
}
