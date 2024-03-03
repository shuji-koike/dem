import { css } from "@emotion/react"
import { OrbitControls, OrthographicCamera } from "@react-three/drei"
import { Canvas, useLoader } from "@react-three/fiber"
import { Suspense, useMemo } from "react"
import * as THREE from "three"

// https://docs.pmnd.rs/react-three-fiber/getting-started/introduction
// https://blog.maximeheckel.com/posts/the-magical-world-of-particles-with-react-three-fiber-and-shaders/
// https://qiita.com/Quarter-lab/items/151f06bddea1fc9cf4d7

import { assetsMapRadar } from "../assets"
import { getMapData, teamColor } from "../demo"
import { useMatch } from "../hooks/useMatch"

export function ThreeView() {
  const frame = useMatch((state) => state.frame)
  return (
    <div css={style}>
      <Canvas gl={{ logarithmicDepthBuffer: true, antialias: false }}>
        <OrthographicCamera
          makeDefault
          far={1e10}
          position={[100, 0, 1e4]}
          zoom={0.1}
        />
        <Suspense fallback={null}>
          <Map />
        </Suspense>
        <OrbitControls />
        <ambientLight intensity={Math.PI / 2} />
        <TrailPoints />
        {frame?.Players.map((e) => <Box key={e.ID} player={e} />)}
      </Canvas>
    </div>
  )
}

function Map() {
  const match = useMatch((state) => state.match)
  const data = getMapData(match?.MapName)
  const texture = useLoader(
    THREE.TextureLoader,
    (match && assetsMapRadar[match.MapName]) || "",
  )
  if (!data) return null
  return (
    <mesh
      position={[
        data.pos_x + 512 * data.scale,
        512 * data.scale - data.pos_y,
        -400,
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
  return (
    <mesh position={[player.X, player.Y, player.Z]}>
      <boxGeometry args={[100, 100, 100]} />
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
`
