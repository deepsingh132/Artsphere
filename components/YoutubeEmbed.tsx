import React from "react";
import PropTypes from "prop-types";
import "./embed.css"

const YoutubeEmbed = ({ embedId }) => (
  // make the video responsive

  <div
    data-testid="post-youtube-embed"
    className={`video-responsive md:max-w-[600px]  rounded-lg border border-[#CFD9DE] max-h-80 w-full object-cover`}
  >
    <iframe
      src={`https://www.youtube.com/embed/${embedId}`}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="Embedded youtube"
    />
  </div>
);

YoutubeEmbed.propTypes = {
  embedId: PropTypes.string.isRequired,
};

export default YoutubeEmbed;
