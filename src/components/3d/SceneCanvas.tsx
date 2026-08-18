import { Canvas } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Html, Grid } from '@react-three/drei'
import ModelExplode from './ModelExplode'
import { useSceneStore } from '@/store/useSceneStore'
import './SceneCanvas.css'

interface Props {
  className?: string
}

function SceneContent() {
  const { isExploded, selectedDeviceId, setSelectedDevice } = useSceneStore()

  return (
    <>
      <ambientLight intensity={0.4} color="#b0c4de" />
      <directionalLight
        position={[8, 12, 6]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[-6, 6, -4]} intensity={0.5} color="#2196F3" distance={20} decay={2} />
      <pointLight position={[4, 8, 6]} intensity={0.4} color="#00C853" distance={15} decay={2} />
      <pointLight position={[0, 3, 0]} intensity={0.6} color="#ffffff" distance={10} decay={2} />
      <hemisphereLight args={['#1a3466', '#0a1830', 0.3]} />

      <ModelExplode
        isExploded={isExploded}
        selectedDeviceId={selectedDeviceId}
        onDeviceClick={setSelectedDevice}
      />

      <ContactShadows
        position={[0, -0.01, 0]}
        opacity={0.5}
        scale={16}
        blur={3}
        far={6}
        resolution={1024}
      />

      <Grid
        args={[20, 20]}
        position={[0, 0, 0]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#2D4066"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#3a5a8a"
        fadeDistance={18}
        fadeStrength={1}
        infiniteGrid
      />

      {selectedDeviceId && (
        <group position={[-1.2, 2.5, 0]}>
          <Html center distanceFactor={8} position={[0, 0, 0]}>
            <div className="device-selected-label">设备已选中</div>
          </Html>
        </group>
      )}

      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minDistance={2}
        maxDistance={20}
        target={[0, 0.8, 0]}
        enableDamping
        dampingFactor={0.05}
        maxPolarAngle={Math.PI / 2 - 0.05}
      />
    </>
  )
}

export default function SceneCanvas({ className }: Props) {
  return (
    <div className={`scene-canvas ${className || ''}`}>
      <Canvas
        shadows
        camera={{ position: [6, 5, 7], fov: 45, near: 0.1, far: 100 }}
        gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#0A1830']} />
        <fog attach="fog" args={['#0A1830', 15, 30]} />
        <SceneContent />
      </Canvas>
    </div>
  )
}
