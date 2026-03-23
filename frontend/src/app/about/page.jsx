import React from 'react';
import './about.scss';

const page = () => {
  return (
    <div className='about-page'>
      <p className='about-eyebrow'>About</p>
      <h1 className='about-title'>Built for the TFT Community</h1>
      <p className='about-body'>
        Streamer Tracker TFT is a real-time analytics platform that tracks top
        Teamfight Tactics streamers, showing their most-played comps, item
        choices, and placement stats pulled directly from the Riot Games API.
      </p>
      <p className='about-body'>
        Built by Alan Zhang and Charles Lu. Not affiliated with Riot Games.
      </p>
      <div className='about-team'>
        <a
          href='https://github.com/alanzhang03'
          target='_blank'
          rel='noopener noreferrer'
          className='about-team-card'
        >
          <span className='about-team-name'>Alan Zhang</span>
          <span className='about-team-github'>github.com/alanzhang03 →</span>
        </a>
        <a
          href='https://github.com/charlielu04'
          target='_blank'
          rel='noopener noreferrer'
          className='about-team-card'
        >
          <span className='about-team-name'>Charles Lu</span>
          <span className='about-team-github'>github.com/charlielu04 →</span>
        </a>
      </div>
    </div>
  );
};

export default page;
