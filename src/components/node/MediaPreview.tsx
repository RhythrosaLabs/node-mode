import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

interface MediaPreviewProps {
  type: 'video' | 'audio' | '3d';
  url: string;
}

const Model3DPreview: React.FC<{ url: string }> = ({ url }) => {
  const { scene } = useGLTF(url);
  
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <primitive object={scene} />
      <OrbitControls />
    </Canvas>
  );
};

export const MediaPreview: React.FC<MediaPreviewProps> = ({ type, url }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (type === 'audio' && audioRef.current) {
      audioRef.current.load();
    }
  }, [url]);

  switch (type) {
    case 'video':
      return (
        <video
          src={url}
          controls
          className="w-full rounded-lg"
          style={{ maxHeight: '200px' }}
        />
      );
    
    case 'audio':
      return (
        <audio ref={audioRef} controls className="w-full">
          <source src={url} />
        </audio>
      );
    
    case '3d':
      return (
        <div className="w-full h-64">
          <Model3DPreview url={url} />
        </div>
      );
    
    default:
      return null;
  }
};