import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float } from '@react-three/drei';
import * as THREE from 'three';

function LeafModel({ spotPosition = [0.5, 0.2, 0.1] }) {
  const mesh = useRef();

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={mesh} rotation={[-Math.PI / 4, 0, 0]}>
        {/* We use a plane and fold it slightly in our minds, or just keep it flat for clarity */}
        <planeGeometry args={[3, 4, 32, 32]} /> 
        <meshStandardMaterial 
          color="#1b4332" 
          side={THREE.DoubleSide} 
          roughness={0.3}
          metalness={0.1}
          flatShading={false}
        />
        
        {/* The Infection Spot - Placed slightly above the leaf surface */}
        <mesh position={[spotPosition[0], spotPosition[1], 0.05]}>
          <circleGeometry args={[0.15, 32]} />
          <meshStandardMaterial color="#432818" emissive="#2b170c" />
        </mesh>
      </mesh>
    </Float>
  );
}

export default function LeafCanvas() {
  return (
    <div style={{ width: '100%', height: '350px', background: '#f8fafc', borderRadius: '12px', overflow: 'hidden' }}>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        
        <LeafModel />
        
        <OrbitControls enableZoom={true} />
      </Canvas>
      <div style={{ textAlign: 'center', fontSize: '11px', color: '#64748b', paddingBottom: '10px' }}>
        🖱️ Click and drag to rotate the leaf specimen
      </div>
    </div>
  );
}