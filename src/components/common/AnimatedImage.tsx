import React from 'react';

interface AnimatedImageProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  containerRounded?: string;
  imageRounded?: string;
  maskClassName?: string;
  children?: React.ReactNode;
}

export const AnimatedImage: React.FC<AnimatedImageProps> = ({
  src,
  alt,
  className = '',
  imageClassName = '',
  containerRounded = 'rounded-sm',
  imageRounded = 'rounded-sm',
  maskClassName = 'bg-[#120E0D]',
  children
}) => {
  return (
    <div className={`relative overflow-hidden group ${containerRounded} ${className}`}>
      {/* Animated Gold Border Background */}
      <div className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,transparent_0_270deg,#C5A059_360deg)] animate-border-spin-1"></div>
      
      {/* Inner Container to hold the border and clip the image */}
      <div className={`absolute inset-[2px] overflow-hidden ${imageRounded} ${maskClassName}`}>
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${imageClassName}`}
        />
        {children}
      </div>
    </div>
  );
};
