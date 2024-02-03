import * as THREE from "three";

import React from "react";
import { Billboard, Text, TrackballControls, OrbitControls, type BillboardProps } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

interface Props extends BillboardProps {
  children: React.ReactNode;
}

export function Word({ children, ...props }: Props) {
  const fontProps = {
    font: "/Inter-Bold.woff",
    fontSize: 2.5,
    letterSpacing: -0.05,
    lineHeight: 1,
    "material-toneMapped": false,
  };
  const ref = React.useRef();

  return (
    <Billboard {...props}>
      <Text ref={ref} children={children} {...fontProps} />
    </Billboard>
  );
}

export function Cloud() {
  const count = 8;
  const radius = 20;
  const words = React.useMemo(() => {
    const temp = [];
    const spherical = new THREE.Spherical();
    const theta = (Math.PI * 2) / count;
    const phi = Math.PI / (count + 1);
    for (let i = 1; i < count + 1; i++)
      for (let j = 0; j < count; j++)
        temp.push([new THREE.Vector3().setFromSpherical(spherical.set(radius, phi * i, theta * j)), "About me"]);

    return temp;
  }, [count, radius]);

  return words?.map(([pos, word], index) => <Word key={index} position={pos as THREE.Vector3} children={word} />);
}

export function CloudComponent() {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 35], fov: 91 }} className="!pointer-events-none">
      <fog attach="fog" args={["#202025", 0, 25]} />
      <React.Suspense fallback={null}>
        <group rotation={[10, 10.5, 10]}>
          <Cloud />
        </group>
      </React.Suspense>

      <OrbitControls autoRotate={true} enableZoom={false} enableRotate={false} />
    </Canvas>
  );
}
