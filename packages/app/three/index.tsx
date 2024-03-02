import { css } from "@emotion/react"
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber"
import React, { useRef } from "react"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

import { getMapData, teamColor } from "../demo"
import { useMatch } from "../hooks/useMatch"

extend({ OrbitControls })

function Box({ player }: { player: Player }) {
  return (
    <mesh
      position={[player.X / 100, player.Y / 100, player.Z / 100]}
      scale={0.5}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={teamColor(player.Team)} />
    </mesh>
  )
}

// https://qiita.com/Quarter-lab/items/151f06bddea1fc9cf4d7
export const Controls: React.FC = () => {
  const controlsRef = useRef<OrbitControls>()
  const { camera, gl } = useThree()

  useFrame(() => controlsRef.current?.update())

  return (
    <orbitControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      rotateSpeed={0.4}
    />
  )
}

export function ThreeView() {
  const match = useMatch((state) => state.match)
  const frame = useMatch((state) => state.frame)
  const data = getMapData(match?.MapName)
  if (!data) return null
  return (
    <div css={style}>
      <Canvas
        camera={{
          fov: 1,
          far: 100000,
          position: [0, 0, 4000],
        }}
      >
        <Controls />
        <ambientLight intensity={Math.PI / 2} />
        {frame?.Players.map((e) => <Box key={e.ID} player={e} />)}
      </Canvas>
    </div>
  )
}

const style = css`
  position: absolute;
  inset: 0;
`
