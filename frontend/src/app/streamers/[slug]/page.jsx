'use client';
import React from 'react';
import StreamerPage from '../../../../components/StreamerPage';
import { notFound } from 'next/navigation';

const STREAMERS = {
  K3soju:     { usernameTagline: 'VIT k3soju #000',      username: 'k3soju',     displayName: 'K3soju' },
  Setsuko:    { usernameTagline: 'VIT setsuko #NA2',      username: 'setsuko',    displayName: 'Setsuko' },
  Robinsongz: { usernameTagline: 'CTG robinsongz #888',   username: 'robinsongz', displayName: 'Robinsongz' },
  Frodan:     { usernameTagline: 'ACAD Frodan #FRO',      username: 'frodan',     displayName: 'Frodan' },
  Dishsoap:   { usernameTagline: 'ACAD Dishsoap #NA3',    username: 'dishsoap',   displayName: 'Dishsoap' },
  Mortdog:    { usernameTagline: 'Riot Mortdog #Mort',    username: 'mortdog',    displayName: 'Riot Mortdog' },
};

const page = ({ params }) => {
  const streamer = STREAMERS[params.slug];
  if (!streamer) notFound();
  return <StreamerPage {...streamer} />;
};

export default page;
