import React from "react";
import * as Three from "three";
import ThreeGlobe, { type GlobeMethods } from "react-globe.gl";
import countries from "@/utils/custom.geo.json";

export default function Globe() {
  const globeRef = React.useRef<GlobeMethods | undefined>(undefined);
  const arcsData = [...Array(20).keys()].map(() => ({
    startLat: (Math.random() - 0.5) * 180,
    startLng: (Math.random() - 0.5) * 360,
    endLat: (Math.random() - 0.5) * 180,
    endLng: (Math.random() - 0.5) * 360,
    color: [
      ["red", "white", "blue", "green"][Math.round(Math.random() * 3)],
      ["red", "white", "blue", "green"][Math.round(Math.random() * 3)],
    ],
  }));

  const globeReady = React.useCallback(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().enableZoom = false;
    }
  }, []);

  return (
    <ThreeGlobe
      ref={globeRef}
      onGlobeReady={globeReady}
      rendererConfig={{ antialias: true, alpha: true }}
      pointsData={[arcsData]}
      pointColor="#5784a7"
      backgroundColor="rgba(0,0,0,0)"
      globeMaterial={
        new Three.MeshPhongMaterial({
          color: "#18181b",
          opacity: 1,

          transparent: false,
        })
      }
      hexPolygonColor={() => "rgba(255,255,255, 1)"}
      customThreeObject={(sliceData: any) => {
        const { size, color } = sliceData;
        return new Three.Mesh(new Three.SphereGeometry(size), new Three.MeshBasicMaterial({ color }));
      }}
      customLayerData={[...Array(500).keys()].map(() => ({
        lat: (Math.random() - 1) * 360,
        lng: (Math.random() - 1) * 360,
        altitude: Math.random() * 2,
        size: Math.random() * 1,
        color: "#3e4040",
      }))}
      customThreeObjectUpdate={(obj, sliceData: any) => {
        const { lat, lng, altitude } = sliceData;
        return Object.assign(obj.position, globeRef.current?.getCoords(lat, lng, altitude));
      }}
      hexPolygonsData={countries.features}
      hexPolygonResolution={3}
      hexPolygonMargin={0.8}
      showAtmosphere={false}
      atmosphereAltitude={0.25}
      arcDashLength={() => Math.random()}
      arcDashGap={() => Math.random()}
      arcDashAnimateTime={() => Math.random() * 4000 + 500}
    />
  );
}
