import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js'

class CameraController {
  constructor(camera, controller, threeViewport, bounds) {
    this.camera = camera
    this.controller = controller
    this.viewport = threeViewport

    this.mouseOriginal = 0
    this.mouseCurrent = 0
    this.delta = 0
    this.isRotating = false

    this.maxZoom = 20
    this.minZoom = 120

    this.bounds = bounds
    this.speed = 5
    this.forward = false
    this.backward = false
    this.left = false
    this.right = false

    this.viewport.addEventListener('mouseenter', this.startMouseCapture)
    this.viewport.addEventListener('mouseleave', this.stopMouseCapture)
    this.viewport.addEventListener('mousedown', this.startCameraControl)
    this.viewport.addEventListener('mouseup', this.stopCameraControl)
    this.viewport.addEventListener('wheel', this.zoomCamera)
    this.viewport.addEventListener('contextmenu', event => event.preventDefault())
  }

  setMousePosition = (event) => {
    this.mouseCurrent = event.clientX
    if (this.isRotating) {
      this.delta = this.mouseCurrent - this.mouseOriginal
    }
  }

  startCameraControl = (event) => {
    if (event.button === 2) {
      this.mouseOriginal = event.clientX
      this.isRotating = true
    }
  }

  stopCameraControl = (event) => {
    if (event.button === 2) {
      this.isRotating = false
      this.delta = 0
    }
  }

  startMouseCapture = () => {
    this.viewport.addEventListener('mousemove', this.setMousePosition)
    this.viewport.focus()
  }

  stopMouseCapture = () => {
    this.isRotating = false
    this.delta = 0
    this.viewport.removeEventListener('mousemove', this.setMousePosition)
    this.viewport.blur()
    this.forward = false
    this.backward = false
    this.left = false
    this.right = false
  }

  rotateCamera() {
    if (this.delta) {
      this.controller.rotation.y -= THREE.Math.degToRad(this.delta * 0.015)
    }
  }

  zoomCamera = event => {
    const cam = this.camera
    cam.fov -= event.deltaY * 0.05
    if (cam.fov <= this.maxZoom) cam.fov = this.maxZoom
    if (cam.fov >= this.minZoom) cam.fov = this.minZoom
    cam.updateProjectionMatrix()
  }

  checkBounds = () => {
    const {bounds, controller} = this
    if (controller.position.z > bounds) controller.position.z = bounds
    if (controller.position.z < -bounds) controller.position.z = -bounds
    if (controller.position.x > bounds) controller.position.x = bounds
    if (controller.position.x < -bounds) controller.position.x = -bounds
  }

  reset() {
    const cam = this.camera
    cam.position.set(0, 1500, 0)
    cam.rotation.x = -Math.PI / 2
    cam.updateProjectionMatrix()
    this.controller.rotation.y = 0
  }
}

export {CameraController}
