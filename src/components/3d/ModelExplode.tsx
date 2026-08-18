import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props {
  isExploded: boolean
  selectedDeviceId: string | null
  onDeviceClick?: (id: string) => void
}

const EXPLODE_OFFSET = 1.8

const deviceParts = [
  {
    id: 'base',
    deviceId: 'dev-001',
    geo: 'box' as const,
    pos: [0, 0.15, 0] as [number, number, number],
    size: [4, 0.3, 2.5] as [number, number, number],
    color: '#1a3466',
    metalness: 0.7,
    roughness: 0.35,
  },
  {
    id: 'base-plate',
    deviceId: 'dev-001',
    geo: 'box' as const,
    pos: [0, 0.02, 0] as [number, number, number],
    size: [4.2, 0.04, 2.7] as [number, number, number],
    color: '#0f2447',
    metalness: 0.5,
    roughness: 0.5,
  },
  {
    id: 'motor-body',
    deviceId: 'dev-001',
    geo: 'cylinder' as const,
    pos: [-1.2, 0.85, 0] as [number, number, number],
    size: [0.6, 0.6, 1.6, 32] as [number, number, number, number],
    color: '#254888',
    metalness: 0.75,
    roughness: 0.3,
    rot: [0, 0, Math.PI / 2] as [number, number, number],
  },
  {
    id: 'motor-fan-housing',
    deviceId: 'dev-001',
    geo: 'cylinder' as const,
    pos: [-2.05, 0.85, 0] as [number, number, number],
    size: [0.55, 0.55, 0.3, 24] as [number, number, number, number],
    color: '#1a3466',
    metalness: 0.6,
    roughness: 0.4,
    rot: [0, 0, Math.PI / 2] as [number, number, number],
  },
  {
    id: 'motor-fan-cover',
    deviceId: 'dev-001',
    geo: 'cylinder' as const,
    pos: [-2.2, 0.85, 0] as [number, number, number],
    size: [0.58, 0.58, 0.1, 24] as [number, number, number, number],
    color: '#3a5a8a',
    metalness: 0.4,
    roughness: 0.6,
    rot: [0, 0, Math.PI / 2] as [number, number, number],
  },
  {
    id: 'motor-terminal-box',
    deviceId: 'dev-001',
    geo: 'box' as const,
    pos: [-0.85, 1.55, 0] as [number, number, number],
    size: [0.4, 0.3, 0.35] as [number, number, number],
    color: '#1a3466',
    metalness: 0.5,
    roughness: 0.45,
  },
  {
    id: 'motor-cooling-fin-1',
    deviceId: 'dev-001',
    geo: 'box' as const,
    pos: [-1.2, 1.2, 0.45] as [number, number, number],
    size: [0.85, 0.02, 0.04] as [number, number, number],
    color: '#2d4066',
    metalness: 0.8,
    roughness: 0.2,
  },
  {
    id: 'motor-cooling-fin-2',
    deviceId: 'dev-001',
    geo: 'box' as const,
    pos: [-1.2, 1.2, 0.35] as [number, number, number],
    size: [0.85, 0.02, 0.04] as [number, number, number],
    color: '#2d4066',
    metalness: 0.8,
    roughness: 0.2,
  },
  {
    id: 'motor-cooling-fin-3',
    deviceId: 'dev-001',
    geo: 'box' as const,
    pos: [-1.2, 1.2, 0.25] as [number, number, number],
    size: [0.85, 0.02, 0.04] as [number, number, number],
    color: '#2d4066',
    metalness: 0.8,
    roughness: 0.2,
  },
  {
    id: 'motor-cooling-fin-4',
    deviceId: 'dev-001',
    geo: 'box' as const,
    pos: [-1.2, 1.2, -0.25] as [number, number, number],
    size: [0.85, 0.02, 0.04] as [number, number, number],
    color: '#2d4066',
    metalness: 0.8,
    roughness: 0.2,
  },
  {
    id: 'motor-cooling-fin-5',
    deviceId: 'dev-001',
    geo: 'box' as const,
    pos: [-1.2, 1.2, -0.35] as [number, number, number],
    size: [0.85, 0.02, 0.04] as [number, number, number],
    color: '#2d4066',
    metalness: 0.8,
    roughness: 0.2,
  },
  {
    id: 'motor-cooling-fin-6',
    deviceId: 'dev-001',
    geo: 'box' as const,
    pos: [-1.2, 1.2, -0.45] as [number, number, number],
    size: [0.85, 0.02, 0.04] as [number, number, number],
    color: '#2d4066',
    metalness: 0.8,
    roughness: 0.2,
  },
  {
    id: 'shaft-coupling',
    deviceId: 'dev-001',
    geo: 'cylinder' as const,
    pos: [-0.3, 0.85, 0] as [number, number, number],
    size: [0.12, 0.12, 0.3, 16] as [number, number, number, number],
    color: '#94a3b8',
    metalness: 0.9,
    roughness: 0.15,
    rot: [0, 0, Math.PI / 2] as [number, number, number],
  },
  {
    id: 'coupling-guard',
    deviceId: 'dev-001',
    geo: 'box' as const,
    pos: [-0.3, 0.85, 0] as [number, number, number],
    size: [0.45, 0.35, 0.4] as [number, number, number],
    color: '#0f2447',
    metalness: 0.5,
    roughness: 0.5,
  },
  {
    id: 'pump-body',
    deviceId: 'dev-001',
    geo: 'cylinder' as const,
    pos: [0.5, 0.75, 0] as [number, number, number],
    size: [0.65, 0.65, 0.6, 32] as [number, number, number, number],
    color: '#254888',
    metalness: 0.7,
    roughness: 0.32,
    rot: [0, 0, Math.PI / 2] as [number, number, number],
  },
  {
    id: 'pump-front-cover',
    deviceId: 'dev-001',
    geo: 'cylinder' as const,
    pos: [0.9, 0.75, 0] as [number, number, number],
    size: [0.55, 0.55, 0.08, 32] as [number, number, number, number],
    color: '#1a3466',
    metalness: 0.6,
    roughness: 0.4,
    rot: [0, 0, Math.PI / 2] as [number, number, number],
  },
  {
    id: 'pump-impeller-housing',
    deviceId: 'dev-001',
    geo: 'cylinder' as const,
    pos: [0.5, 0.75, 0.4] as [number, number, number],
    size: [0.35, 0.35, 0.2, 24] as [number, number, number, number],
    color: '#1a3466',
    metalness: 0.55,
    roughness: 0.42,
    rot: [Math.PI / 2, 0, 0] as [number, number, number],
  },
  {
    id: 'pump-flange-inlet',
    deviceId: 'dev-001',
    geo: 'cylinder' as const,
    pos: [0.5, 0.75, 0.85] as [number, number, number],
    size: [0.28, 0.28, 0.06, 24] as [number, number, number, number],
    color: '#2d4066',
    metalness: 0.65,
    roughness: 0.35,
    rot: [Math.PI / 2, 0, 0] as [number, number, number],
  },
  {
    id: 'inlet-pipe',
    deviceId: 'dev-001',
    geo: 'cylinder' as const,
    pos: [0.5, 0.75, 1.15] as [number, number, number],
    size: [0.12, 0.12, 0.5, 16] as [number, number, number, number],
    color: '#2d4066',
    metalness: 0.8,
    roughness: 0.25,
  },
  {
    id: 'outlet-pipe',
    deviceId: 'dev-001',
    geo: 'cylinder' as const,
    pos: [0.5, 1.35, 0] as [number, number, number],
    size: [0.12, 0.12, 0.65, 16] as [number, number, number, number],
    color: '#2d4066',
    metalness: 0.8,
    roughness: 0.25,
    rot: [Math.PI / 2, 0, 0] as [number, number, number],
  },
  {
    id: 'outlet-flange',
    deviceId: 'dev-001',
    geo: 'cylinder' as const,
    pos: [0.5, 1.75, 0] as [number, number, number],
    size: [0.22, 0.22, 0.04, 24] as [number, number, number, number],
    color: '#3a5a8a',
    metalness: 0.7,
    roughness: 0.3,
  },
  {
    id: 'junction-box',
    deviceId: 'dev-001',
    geo: 'box' as const,
    pos: [-1.2, 1.55, 0] as [number, number, number],
    size: [0.5, 0.35, 0.4] as [number, number, number],
    color: '#1a3466',
    metalness: 0.55,
    roughness: 0.42,
  },
  {
    id: 'junction-box-cover',
    deviceId: 'dev-001',
    geo: 'box' as const,
    pos: [-1.2, 1.74, 0] as [number, number, number],
    size: [0.46, 0.03, 0.36] as [number, number, number],
    color: '#3a5a8a',
    metalness: 0.6,
    roughness: 0.38,
  },
  {
    id: 'bolt-1',
    deviceId: 'dev-001',
    geo: 'cylinder' as const,
    pos: [-1.5, 0.38, 0.95] as [number, number, number],
    size: [0.04, 0.04, 0.16, 8] as [number, number, number, number],
    color: '#64748b',
    metalness: 0.9,
    roughness: 0.15,
  },
  {
    id: 'bolt-2',
    deviceId: 'dev-001',
    geo: 'cylinder' as const,
    pos: [-1.5, 0.38, -0.95] as [number, number, number],
    size: [0.04, 0.04, 0.16, 8] as [number, number, number, number],
    color: '#64748b',
    metalness: 0.9,
    roughness: 0.15,
  },
  {
    id: 'bolt-3',
    deviceId: 'dev-001',
    geo: 'cylinder' as const,
    pos: [1.5, 0.38, 0.95] as [number, number, number],
    size: [0.04, 0.04, 0.16, 8] as [number, number, number, number],
    color: '#64748b',
    metalness: 0.9,
    roughness: 0.15,
  },
  {
    id: 'bolt-4',
    deviceId: 'dev-001',
    geo: 'cylinder' as const,
    pos: [1.5, 0.38, -0.95] as [number, number, number],
    size: [0.04, 0.04, 0.16, 8] as [number, number, number, number],
    color: '#64748b',
    metalness: 0.9,
    roughness: 0.15,
  },
  {
    id: 'led-indicator',
    deviceId: 'dev-001',
    geo: 'sphere' as const,
    pos: [-1.05, 1.75, 0] as [number, number, number],
    size: [0.05, 16, 16] as unknown as [number, number, number, number],
    color: '#e53935',
    metalness: 0.3,
    roughness: 0.2,
    emissive: '#e53935',
    emissiveIntensity: 0.8,
  },
]

export default function ModelExplode({ isExploded, selectedDeviceId, onDeviceClick }: Props) {
  const groupRef = useRef<THREE.Group>(null)
  const partsRef = useRef<Map<string, THREE.Mesh>>(new Map())
  const originPositions = useRef<Map<string, THREE.Vector3>>(new Map())
  const targetPositions = useRef<Map<string, THREE.Vector3>>(new Map())
  const currentPositions = useRef<Map<string, THREE.Vector3>>(new Map())

  useMemo(() => {
    deviceParts.forEach((p) => {
      const origin = new THREE.Vector3(...p.pos)
      originPositions.current.set(p.id, origin)
      targetPositions.current.set(p.id, origin.clone())
      currentPositions.current.set(p.id, origin.clone())
    })
  }, [])

  useEffect(() => {
    deviceParts.forEach((p) => {
      const origin = originPositions.current.get(p.id)
      if (!origin) return
      if (isExploded) {
        targetPositions.current.set(
          p.id,
          new THREE.Vector3(
            origin.x + origin.x * EXPLODE_OFFSET,
            origin.y + origin.y * EXPLODE_OFFSET + 0.3,
            origin.z + origin.z * EXPLODE_OFFSET,
          ),
        )
      } else {
        targetPositions.current.set(p.id, origin.clone())
      }
    })
  }, [isExploded])

  useFrame((_, delta) => {
    const lerpFactor = 1 - Math.pow(0.001, delta)
    deviceParts.forEach((p) => {
      const mesh = partsRef.current.get(p.id)
      const target = targetPositions.current.get(p.id)
      const current = currentPositions.current.get(p.id)
      if (!mesh || !target || !current) return
      current.lerp(target, lerpFactor)
      mesh.position.copy(current)
    })
  })

  const renderGeometry = (part: (typeof deviceParts)[0]) => {
    const setRef = (el: THREE.Mesh | null) => {
      if (el) partsRef.current.set(part.id, el)
    }

    const handleClick = (e: { stopPropagation: () => void }) => {
      e.stopPropagation()
      onDeviceClick?.(part.deviceId)
    }

    const isSelected = selectedDeviceId === part.deviceId
    const isEmissive = part.emissive

    const materialProps = {
      color: part.color,
      metalness: part.metalness,
      roughness: part.roughness,
      ...(isEmissive ? { emissive: new THREE.Color(part.emissive!), emissiveIntensity: part.emissiveIntensity ?? 0.5 } : {}),
    }

    const commonProps = {
      ref: setRef,
      position: part.pos,
      rotation: part.rot || [0, 0, 0] as [number, number, number],
      onClick: handleClick,
      castShadow: true,
      receiveShadow: true,
    }

    if (part.geo === 'box') {
      return (
        <mesh key={part.id} {...commonProps}>
          <boxGeometry args={part.size as [number, number, number]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
      )
    }

    if (part.geo === 'cylinder') {
      return (
        <mesh key={part.id} {...commonProps}>
          <cylinderGeometry args={part.size as [number, number, number, number]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
      )
    }

    if (part.geo === 'sphere') {
      return (
        <mesh key={part.id} {...commonProps}>
          <sphereGeometry args={part.size as unknown as [number, number, number]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
      )
    }

    return null
  }

  return (
    <group ref={groupRef}>
      {deviceParts.map(renderGeometry)}
    </group>
  )
}
