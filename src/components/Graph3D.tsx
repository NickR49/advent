import { createEffect, onCleanup } from 'solid-js'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type { Coord3D, Edge } from '~/utils/3dUtils'

interface Props {
  nodes: Coord3D[]
  edges: Edge[]
  debug?: boolean
}

const Graph3D = (props: Props) => {
  let containerRef: HTMLDivElement | undefined
  let renderer: THREE.WebGLRenderer | undefined
  let animationId: number | undefined
  let controls: OrbitControls | undefined
  let resizeHandler: (() => void) | undefined

  // Cleanup function to dispose of Three.js resources
  const cleanup = () => {
    if (animationId !== undefined) {
      cancelAnimationFrame(animationId)
      animationId = undefined
    }
    if (resizeHandler) {
      window.removeEventListener('resize', resizeHandler)
      resizeHandler = undefined
    }
    if (controls) {
      controls.dispose()
      controls = undefined
    }
    if (renderer) {
      renderer.dispose()
      if (containerRef && renderer.domElement.parentNode === containerRef) {
        containerRef.removeChild(renderer.domElement)
      }
      renderer = undefined
    }
  }

  // Use createEffect to react to prop changes
  createEffect(() => {
    // Access props to create dependency tracking
    const nodes = props.nodes
    const edges = props.edges
    const debug = props.debug

    // Clean up previous scene
    cleanup()

    if (!containerRef) return

    if (debug) {
      console.log(
        'Graph3D received nodes:',
        nodes?.length,
        'edges:',
        edges?.length,
      )
    }

    // Handle empty data
    if (!nodes || nodes.length === 0) {
      console.warn('Graph3D: No nodes to render')
      return
    }

    const width = containerRef.clientWidth || 800
    const height = 600

    // Create scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x1a1a2e)

    // Create camera - set far plane very high initially, will adjust after calculating bounds
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000000)

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.appendChild(renderer.domElement)

    // Add orbit controls for rotation and zoom
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enableZoom = true
    controls.enablePan = true

    // Calculate bounds for auto-fit
    const bounds = {
      minX: Infinity,
      maxX: -Infinity,
      minY: Infinity,
      maxY: -Infinity,
      minZ: Infinity,
      maxZ: -Infinity,
    }

    nodes.forEach((node) => {
      bounds.minX = Math.min(bounds.minX, node.x)
      bounds.maxX = Math.max(bounds.maxX, node.x)
      bounds.minY = Math.min(bounds.minY, node.y)
      bounds.maxY = Math.max(bounds.maxY, node.y)
      bounds.minZ = Math.min(bounds.minZ, node.z)
      bounds.maxZ = Math.max(bounds.maxZ, node.z)
    })

    // Calculate center and size of bounds
    const center = new THREE.Vector3(
      (bounds.minX + bounds.maxX) / 2,
      (bounds.minY + bounds.maxY) / 2,
      (bounds.minZ + bounds.maxZ) / 2,
    )

    const size = Math.max(
      bounds.maxX - bounds.minX,
      bounds.maxY - bounds.minY,
      bounds.maxZ - bounds.minZ,
      1, // Minimum size to avoid division issues
    )

    // Position camera to fit all nodes
    const fov = camera.fov * (Math.PI / 180)
    const cameraDistance = Math.max((size / (2 * Math.tan(fov / 2))) * 1.5, 10)

    // Adjust camera clipping planes based on scene size
    camera.near = cameraDistance * 0.01
    camera.far = cameraDistance * 10
    camera.updateProjectionMatrix()

    camera.position.set(
      center.x + cameraDistance,
      center.y + cameraDistance * 0.5,
      center.z + cameraDistance,
    )
    camera.lookAt(center)
    controls.target.copy(center)

    // Add axes helper at center for debugging (red=X, green=Y, blue=Z)
    const axesHelper = new THREE.AxesHelper(size / 4)
    axesHelper.position.copy(center)
    scene.add(axesHelper)

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(
      center.x + size,
      center.y + size,
      center.z + size,
    )
    scene.add(directionalLight)

    // Create node spheres - scale radius to be visible at this zoom level
    const nodeRadius = Math.max(size / 200, 100)
    const nodeGeometry = new THREE.SphereGeometry(nodeRadius, 16, 16)
    const nodeMaterial = new THREE.MeshPhongMaterial({ color: 0x4fc3f7 })

    nodes.forEach((node) => {
      const mesh = new THREE.Mesh(nodeGeometry, nodeMaterial)
      mesh.position.set(node.x, node.y, node.z)
      scene.add(mesh)
    })

    // Create edges as lines - only render "used" edges to avoid overwhelming the scene
    const usedEdges = edges.filter((e) => e.used)
    if (debug) {
      console.log(
        'Rendering',
        usedEdges.length,
        'used edges out of',
        edges.length,
        'total',
      )
    }

    const usedEdgeMaterial = new THREE.LineBasicMaterial({
      color: 0x4caf50,
      linewidth: 2,
    })

    usedEdges.forEach((edge) => {
      const startNode = nodes[edge.u]
      const endNode = nodes[edge.v]

      if (startNode && endNode) {
        const points = [
          new THREE.Vector3(startNode.x, startNode.y, startNode.z),
          new THREE.Vector3(endNode.x, endNode.y, endNode.z),
        ]
        const geometry = new THREE.BufferGeometry().setFromPoints(points)
        const line = new THREE.Line(geometry, usedEdgeMaterial)
        scene.add(line)
      }
    })

    // Animation loop
    const currentRenderer = renderer
    const currentControls = controls

    const animate = () => {
      animationId = requestAnimationFrame(animate)
      currentControls.update()
      currentRenderer.render(scene, camera)
    }

    animate()

    // Handle resize
    resizeHandler = () => {
      if (!containerRef || !currentRenderer) return
      const newWidth = containerRef.clientWidth
      camera.aspect = newWidth / height
      camera.updateProjectionMatrix()
      currentRenderer.setSize(newWidth, height)
    }

    window.addEventListener('resize', resizeHandler)
  })

  // Cleanup on unmount
  onCleanup(cleanup)

  return (
    <div
      ref={containerRef}
      class='w-full h-[600px] rounded-lg overflow-hidden'
    />
  )
}

export default Graph3D
