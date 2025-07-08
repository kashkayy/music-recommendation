import {useState, useEffect} from 'react';
import { Spinner } from "react-spinner-toolkit";
export default function PlaybackModal({artist, title, onClose}){
    const [previewUrl, setPreviewUrl] = useState(null);
    const [error, setError] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const query = `${artist} ${title}`
    async function fetchPreviewUrl() {
        try {
            const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}`)
            const data = await response.json()
            const song = data.results
            if(song.length > 0 && song[0].previewUrl){
                setPreviewUrl(song[0].previewUrl)
                setIsPlaying(true)
            }else{
                setError('No preview available for this song at this time')
            }
        }catch (error) {
            setError('Error fetching preview URL')
        }
    }
    useEffect(() => {
        fetchPreviewUrl()
    },[artist, title])
    return(
        <>
            <div className="modal">
                <h2>{`${title} by ${artist}`}</h2>
                {error && <p>{error}</p>}
                {!isPlaying && <Spinner shape="circle" color="#888" loading speed={1} size={50} transition={true} />}
                {previewUrl && (
                <audio controls autoPlay>
                <source src={previewUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
                </audio>
                )}
                <button onClick={onClose}>Close</button>
            </div>
        </>
    )
}
