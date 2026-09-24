/**
 * SARANG PORTFOLIO CONFIGURATION
 * 
 * Keep all personal links, metadata, and 3D model paths in this configuration file.
 * To replace the procedural headphone with your own custom GLB / GLTF 3D model,
 * update the `headphoneModel.glbPath` property below and place your .glb file
 * in the /public directory (e.g. /public/models/headphone.glb).
 */

export interface PortfolioConfig {
  artist: {
    name: string;
    title: string;
    location: string;
    year: string;
    tagline: string;
    about: string;
  };
  destinations: {
    films: {
      id: 'films';
      title: string;
      subtitle: string;
      platform: string;
      buttonLabel: string;
      url: string;
      shortcutKey: string;
      description: string;
      tags: string[];
      featuredWorks: Array<{ title: string; year: string; category: string; note: string; }>;
    };
    music: {
      id: 'music';
      title: string;
      subtitle: string;
      platform: string;
      buttonLabel: string;
      url: string;
      shortcutKey: string;
      description: string;
      tags: string[];
      featuredWorks: Array<{ title: string; type: string; duration: string; note: string; }>;
    };
  };
  headphoneModel: {
    useCustomGLB: boolean;
    glbPath: string | null;
    scale: number;
    initialRotation: [number, number, number];
  };
}

export const PORTFOLIO_CONFIG: PortfolioConfig = {
  artist: {
    name: 'SARANG',
    title: 'CINEMA & SOUND CURATOR',
    location: 'SEOUL / TOKYO / WORLD',
    year: '2026',
    tagline: 'Physical navigation through soundscapes and motion pictures.',
    about: 'Independent director, archivist, and acoustic sound designer exploring tactile audio interfaces and cinematic narratives.',
  },
  destinations: {
    films: {
      id: 'films',
      title: 'FILMS',
      subtitle: 'SARANGHAEYO',
      platform: 'LETTERBOXD',
      buttonLabel: 'OPEN LETTERBOXD',
      url: 'https://boxd.it/c3cfd',
      shortcutKey: 'F',
      description: 'A passionate cinephile with a love for films from every corner of the world. I’m here to discover unfamiliar stories, revisit old favourites, and get lost in the magic of cinema.',
      tags: ['Film Diary', 'Cinema Lover', 'World Cinema'],
      featuredWorks: [
        { title: 'Miracle in Cell No. 7', year: '2013', category: 'Korean Cinema', note: '' },
        { title: 'Transformers', year: '2007', category: 'Action / Sci-Fi', note: '' },
        { title: 'Musize', year: '2015', category: 'Favourite Movie', note: '' },
        { title: '96', year: '2018', category: 'Favourite Movie', note: '' },
        { title: 'Raid', year: '2011', category: 'Favourite Movie', note: '' },
        { title: 'Decision to Leave', year: '2022', category: 'Park Chan-wook', note: 'Symphonic obsession' },
        { title: 'Yi Yi', year: '2000', category: 'Edward Yang', note: 'Quiet human architecture' }
      ]
    },
    music: {
      id: 'music',
      title: 'MUSIC',
      subtitle: 'PLAYLIST BGM',
      platform: 'INSTAGRAM',
      buttonLabel: 'OPEN INSTAGRAM',
      url: 'https://www.instagram.com/playlist_bgm/?stkn=bGZreTVkcXFxNHFj',
      shortcutKey: 'M',
      description: 'Background score curation, ambient frequencies, analog tape loops, and atmospheric music archives.',
      tags: ['BGM Curation', 'Tape Loops', 'Ambient Architecture', 'Instagram Series', 'Acoustic Space'],
      featuredWorks: [
        { title: 'Late Night Rain in Kyoto', type: 'Ambient / Field', duration: '44:12', note: 'Subtle warm vinyl hiss' },
        { title: 'Seoul Underground Cafe', type: 'Lo-Fi Jazz / Soul', duration: '58:00', note: 'Rhodes & muted drums' },
        { title: 'Midnight Cinema Corridor', type: 'Drone / Neo-Classical', duration: '36:40', note: 'Cello harmonics' },
        { title: 'Early Morning Fog', type: 'Minimalist Acoustic', duration: '41:15', note: 'Felted piano reverberation' }
      ]
    }
  },
  headphoneModel: {
    useCustomGLB: false,
    glbPath: null,
    scale: 1.0,
    initialRotation: [0.15, -0.35, 0.05],
  }
};
