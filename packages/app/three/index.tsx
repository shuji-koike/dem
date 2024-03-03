import { css } from "@emotion/react"
import {
  OrbitControls,
  OrthographicCamera,
  TrackballControls,
} from "@react-three/drei"
import { Canvas, useLoader } from "@react-three/fiber"
import { Suspense, useMemo } from "react"
import * as THREE from "three"

// https://docs.pmnd.rs/react-three-fiber/getting-started/introduction
// https://blog.maximeheckel.com/posts/the-magical-world-of-particles-with-react-three-fiber-and-shaders/
// https://qiita.com/Quarter-lab/items/151f06bddea1fc9cf4d7
// https://discoverthreejs.com/tips-and-tricks/

import { assetsMapRadar } from "../assets"
import { getMapData, teamColor } from "../demo"
import { useMatch } from "../hooks/useMatch"

export function ThreeView() {
  const frame = useMatch((state) => state.frame)
  const light = [1e3, -2e3, 5e2] satisfies THREE.Vector3Tuple
  const vector = frame?.Players.at(0)
  const target =
    vector && ([vector.X, vector.Y, vector.Z] satisfies THREE.Vector3Tuple)
  return (
    <div css={style} onWheel={(e) => e.stopPropagation()}>
      <Canvas gl={{ logarithmicDepthBuffer: true }}>
        <OrthographicCamera
          makeDefault
          far={1e10}
          position={[0, 0, 1e4]}
          zoom={0.1}
        />
        <Suspense fallback={null}>
          <Map />
        </Suspense>
        <TrackballControls rotateSpeed={10} target={target} />
        {/* <OrbitControls enableDamping={false} target={target} /> */}
        <TrailPoints />
        {frame?.Players.map((e) => <Box key={e.ID} player={e} />)}
        <mesh position={light}>
          <boxGeometry args={[100, 100, 100]} />
          <meshStandardMaterial />
        </mesh>
        <ambientLight />
        <pointLight position={light} intensity={10} decay={0.1} />
      </Canvas>
    </div>
  )
}

function Map() {
  const match = useMatch((state) => state.match)
  const round = useMatch((state) => state.round)
  const data = getMapData(match?.MapName)
  const texture = useLoader(
    THREE.TextureLoader,
    (match && assetsMapRadar[match.MapName]) || "",
  )
  const minZ = useMemo(
    () =>
      round?.Frames.flatMap((frame) => frame?.Players).reduce(
        (a, b) => Math.min(a, b.Z),
        0,
      ) || 0,
    [round],
  )
  if (!data) return null
  return (
    <mesh
      position={[
        data.pos_x + 512 * data.scale,
        data.pos_y - 512 * data.scale,
        minZ - 1,
      ]}
    >
      <planeGeometry
        attach="geometry"
        args={[1024 * data.scale, 1024 * data.scale]}
      />
      <meshBasicMaterial
        attach="material"
        map={texture}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function Box({ player }: { player: Player }) {
  if (!player.Hp) return null
  return (
    <mesh position={[player.X, player.Y, player.Z + 50]}>
      <boxGeometry args={[50, 50, 100]} />
      <meshStandardMaterial color={teamColor(player.Team)} />
    </mesh>
  )
}

function TrailPoints() {
  const round = useMatch((state) => state.round)
  const particlesPosition = useMemo(() => {
    if (!round) return new Float32Array(0)
    const positions = new Float32Array(round.Frames.length * 3 * 10)
    for (let i = 0; i < round.Frames.length; i++) {
      const frame = round.Frames[i]
      if (!frame) continue
      for (let j = 0; j < frame.Players.length; j++) {
        const player = frame.Players[j]
        if (!player) continue
        positions.set(
          [player.X, player.Y, player.Z],
          i * 3 + round.Frames.length * j * 3,
        )
      }
    }
    return positions
  }, [round])
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#295FCC" size={1} sizeAttenuation />
    </points>
  )
}

const style = css`
  position: absolute;
  inset: 0;
  background-color: #000;
`
