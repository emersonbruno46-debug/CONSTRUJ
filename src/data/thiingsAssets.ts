export interface ThiingAsset {
  id: string;
  name: string;
  localFile: string;
  sourceUrl: string;
  alt: string;
  opticalScale: number; // Compensação óptica (ex: objetos largos vs esguios)
  fallbackIconName: string;
}

export const thiingsAssets: Record<string, ThiingAsset> = {
  'mosaic-tile': {
    id: 'mosaic-tile',
    name: 'Mosaic Tile',
    localFile: '/assets/thiings/mosaic-tile.webp',
    sourceUrl: 'https://www.thiings.co/things/mosaic-tile',
    alt: '',
    opticalScale: 1.04,
    fallbackIconName: 'Layers'
  },
  'painting-bucket': {
    id: 'painting-bucket',
    name: 'Painting Bucket',
    localFile: '/assets/thiings/painting-bucket.webp',
    sourceUrl: 'https://www.thiings.co/things/painting-bucket',
    alt: '',
    opticalScale: 0.98,
    fallbackIconName: 'Paintbrush'
  },
  'power-drill': {
    id: 'power-drill',
    name: 'Power Drill',
    localFile: '/assets/thiings/power-drill.webp',
    sourceUrl: 'https://www.thiings.co/things/power-drill',
    alt: '',
    opticalScale: 1.0,
    fallbackIconName: 'Wrench'
  },
  'faucet': {
    id: 'faucet',
    name: 'Faucet',
    localFile: '/assets/thiings/faucet.webp',
    sourceUrl: 'https://www.thiings.co/things/faucet',
    alt: '',
    opticalScale: 1.02,
    fallbackIconName: 'Droplets'
  },
  'led-bulb': {
    id: 'led-bulb',
    name: 'LED Bulb',
    localFile: '/assets/thiings/led-bulb.webp',
    sourceUrl: 'https://www.thiings.co/things/led-bulb',
    alt: '',
    opticalScale: 1.12, // Lâmpada mais estreita recebe boost óptico para igualar peso visual
    fallbackIconName: 'Zap'
  },
  'brick': {
    id: 'brick',
    name: 'Brick',
    localFile: '/assets/thiings/brick.webp',
    sourceUrl: 'https://www.thiings.co/things/brick',
    alt: '',
    opticalScale: 0.96, // Bloco sólido compensado levemente
    fallbackIconName: 'Building2'
  },
  'location-pin': {
    id: 'location-pin',
    name: 'Location Pin',
    localFile: '/assets/thiings/location-pin.webp',
    sourceUrl: 'https://www.thiings.co/things/location-pin',
    alt: '',
    opticalScale: 1.0,
    fallbackIconName: 'MapPin'
  },
  'smartphone': {
    id: 'smartphone',
    name: 'Smartphone',
    localFile: '/assets/thiings/smartphone.webp',
    sourceUrl: 'https://www.thiings.co/things/smartphone',
    alt: '',
    opticalScale: 1.05,
    fallbackIconName: 'MessageCircle'
  },
  'wall-clock': {
    id: 'wall-clock',
    name: 'Wall Clock',
    localFile: '/assets/thiings/wall-clock.webp',
    sourceUrl: 'https://www.thiings.co/things/wall-clock',
    alt: '',
    opticalScale: 1.0,
    fallbackIconName: 'Clock'
  },
  'clipboard': {
    id: 'clipboard',
    name: 'Clipboard',
    localFile: '/assets/thiings/clipboard.webp',
    sourceUrl: 'https://www.thiings.co/things/clipboard',
    alt: '',
    opticalScale: 1.02,
    fallbackIconName: 'ClipboardList'
  },
  'hard-hat': {
    id: 'hard-hat',
    name: 'Hard Hat',
    localFile: '/assets/thiings/hard-hat.webp',
    sourceUrl: 'https://www.thiings.co/things/hard-hat',
    alt: '',
    opticalScale: 1.04,
    fallbackIconName: 'HardHat'
  }
};
