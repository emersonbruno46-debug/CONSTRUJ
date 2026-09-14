import React, { useState } from 'react';
import {
  Layers,
  Paintbrush,
  Wrench,
  Droplets,
  Zap,
  Building2,
  MapPin,
  MessageCircle,
  Clock,
  ClipboardList,
  HardHat,
  HelpCircle
} from 'lucide-react';
import { thiingsAssets } from '../../data/thiingsAssets';
import './ThiingIllustration.css';

export interface ThiingIllustrationProps {
  name: string;
  size?: number | string;
  width?: number;
  height?: number;
  alt?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  style?: React.CSSProperties;
}

export const ThiingIllustration: React.FC<ThiingIllustrationProps> = ({
  name,
  size = 64,
  width,
  height,
  alt = '',
  className = '',
  loading = 'lazy',
  style
}) => {
  const [hasError, setHasError] = useState(false);
  const asset = thiingsAssets[name];

  const actualWidth = width || (typeof size === 'number' ? size : undefined);
  const actualHeight = height || (typeof size === 'number' ? size : undefined);

  // Renderiza ícone de fallback caso a imagem falhe ou asset não exista
  const renderFallback = () => {
    const iconProps = {
      size: typeof size === 'number' ? Math.round(size * 0.55) : 24,
      'aria-hidden': true
    };

    switch (asset?.fallbackIconName || name) {
      case 'Layers':
        return <Layers {...iconProps} />;
      case 'Paintbrush':
        return <Paintbrush {...iconProps} />;
      case 'Wrench':
        return <Wrench {...iconProps} />;
      case 'Droplets':
        return <Droplets {...iconProps} />;
      case 'Zap':
        return <Zap {...iconProps} />;
      case 'Building2':
        return <Building2 {...iconProps} />;
      case 'MapPin':
        return <MapPin {...iconProps} />;
      case 'MessageCircle':
        return <MessageCircle {...iconProps} />;
      case 'Clock':
        return <Clock {...iconProps} />;
      case 'ClipboardList':
        return <ClipboardList {...iconProps} />;
      case 'HardHat':
        return <HardHat {...iconProps} />;
      default:
        return <HelpCircle {...iconProps} />;
    }
  };

  if (!asset || hasError) {
    return (
      <div
        className={`thiing-illustration-wrapper thiing-illustration-fallback ${className}`}
        style={{
          width: actualWidth,
          height: actualHeight,
          ...style
        }}
        aria-hidden={!alt}
      >
        {renderFallback()}
      </div>
    );
  }

  const opticalScale = asset.opticalScale || 1.0;

  return (
    <div
      className={`thiing-illustration-wrapper ${className}`}
      style={{
        width: actualWidth,
        height: actualHeight,
        ...style
      }}
    >
      <img
        src={asset.localFile}
        alt={alt}
        width={actualWidth}
        height={actualHeight}
        loading={loading}
        decoding="async"
        className="thiing-illustration-img"
        style={{
          transform: `scale(${opticalScale})`
        }}
        onError={() => setHasError(true)}
      />
    </div>
  );
};
