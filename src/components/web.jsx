import React, { useState, useRef } from 'react';

const Web = () => {
  const [videoPlayed, setVideoPlayed] = useState(false);
  const [audioAllowed, setAudioAllowed] = useState(false);
  const audioRef = useRef(null);

  const handleUserInteraction = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setAudioAllowed(true);
    }
  };

  const handleVideoEnd = () => {
    setVideoPlayed(true);
  };

  return (
    <div className="content mx-auto w-full ">
      {!audioAllowed && (
        <div className='flex h-[80vh] items-center'>
        <button  onClick={handleUserInteraction} className="shiny-cta mx-auto">
        <span>Launch</span>
      </button>
      </div>
      )}

      {audioAllowed && (
        <>
          {!videoPlayed ? (
            <video
              width="100%"
              className="h-full mx-auto"
              autoPlay
              muted
              onEnded={handleVideoEnd}
            >
              <source src="title-last1.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="last">
              <p className="text-5xl">Aventura Cash App</p>
              <button className="shiny-cta">
                <a href='https://cashapp.hayleysaventura.com/#/'>Click here to continue</a>
              </button>
            </div>
          )}
        </>
      )}

      <audio ref={audioRef} src="track.mp3" />
    </div>
  );
};

export default Web;
