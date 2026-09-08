"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  MAJOR_SPOKES,
  MINUTES_PER_MAJOR,
  minutesToAngle,
} from "@/lib/konark";

/**
 * The Konark chariot wheel in 3D — authored from the same parametric numbers as
 * the SVG game wheel: 8 major spokes, 8 minor spokes at the midpoints, a beaded
 * rim ring, a hub, and a gnomon that casts a real shadow onto the wheel face.
 *
 * No external mesh, no texture files. Everything is a primitive or a lathe.
 */

const STONE = new THREE.Color("#B2966E");
const STONE_DARK = new THREE.Color("#8C7355");
const GOLD = new THREE.Color("#D9A63F");

function Spoke({ angle, major }: { angle: number; major: boolean }) {
  const len = 1.9;
  const w = major ? 0.16 : 0.07;
  return (
    <mesh
      rotation={[0, 0, (angle * Math.PI) / 180]}
      position={[
        Math.cos((angle * Math.PI) / 180) * (len / 2),
        Math.sin((angle * Math.PI) / 180) * (len / 2),
        0,
      ]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[len, w, 0.22]} />
      <meshStandardMaterial color={major ? STONE : STONE_DARK} roughness={0.9} />
    </mesh>
  );
}

function Wheel({ minutes, layer }: { minutes: number; layer: string }) {
  const group = useRef<THREE.Group>(null);
  const gnomon = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.z = Math.sin(clock.elapsedTime * 0.12) * 0.04;
  });

  const beads = useMemo(() => {
    const arr: [number, number, number][] = [];
    const N = 96; // representative ring, not all 480, for perf
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2;
      arr.push([Math.cos(a) * 2.18, Math.sin(a) * 2.18, 0]);
    }
    return arr;
  }, []);

  const shadowAngle = (minutesToAngle(minutes) * Math.PI) / 180;

  const dim = (want: string) => (layer === "all" || layer === want ? 1 : 0.18);

  return (
    <group ref={group}>
      {/* rim */}
      <mesh castShadow receiveShadow>
        <torusGeometry args={[2.05, 0.16, 16, 64]} />
        <meshStandardMaterial color={STONE_DARK} roughness={0.95} transparent opacity={dim("rim")} />
      </mesh>
      {/* inner ring */}
      <mesh>
        <torusGeometry args={[1.75, 0.05, 12, 48]} />
        <meshStandardMaterial color={STONE_DARK} roughness={0.95} />
      </mesh>
      {/* beads */}
      <group visible={layer === "all" || layer === "rim"}>
        {beads.map((p, i) => (
          <mesh key={i} position={p} castShadow>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color={STONE} roughness={0.8} />
          </mesh>
        ))}
      </group>
      {/* spokes */}
      {Array.from({ length: MAJOR_SPOKES * 2 }).map((_, i) => {
        const major = i % 2 === 0;
        const angle = minutesToAngle(i * (MINUTES_PER_MAJOR / 2)) + 90; // face frame
        const on = major ? dim("major") : dim("minor");
        return (
          <group key={i} visible={on > 0.3 || layer === "all"}>
            <Spoke angle={angle} major={major} />
          </group>
        );
      })}
      {/* hub */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.42, 0.42, 0.4, 24]} />
        <meshStandardMaterial color={STONE} roughness={0.85} transparent opacity={dim("hub")} />
      </mesh>
      {/* gnomon — the axle that casts the reading shadow */}
      <mesh ref={gnomon} position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.07, 1.0, 12]} />
        <meshStandardMaterial color={GOLD} metalness={0.3} roughness={0.5} />
      </mesh>
      {/* the shadow line drawn on the face */}
      <mesh
        rotation={[0, 0, shadowAngle]}
        position={[Math.cos(shadowAngle) * 1.0, Math.sin(shadowAngle) * 1.0, 0.16]}
      >
        <boxGeometry args={[2.0, 0.06, 0.02]} />
        <meshBasicMaterial color="#1B1712" transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

export function WheelScene({
  minutes,
  layer,
}: {
  minutes: number;
  layer: string;
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 6.4], fov: 42 }}
      style={{ width: "100%", height: "100%" }}
    >
      <color attach="background" args={["#D9C29A"]} />
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[3.5, 4, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-4, -2, 2]} intensity={0.3} color="#26406B" />
      <Wheel minutes={minutes} layer={layer} />
      <mesh position={[0, 0, -0.6]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#C4A97B" roughness={1} />
      </mesh>
    </Canvas>
  );
}
