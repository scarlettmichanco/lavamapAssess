import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js'
class SceneController {
	constructor(scene, groundPlane, camera, controller, threeViewport, colorPickerRef) {
		this.scene = scene
		this.sceneObjects = []
		this.groundPlane = groundPlane
		this.camera = camera
		this.controller = controller
		this.viewport = threeViewport
		this.colorPickerRef = colorPickerRef
		this.mousePosition = new THREE.Vector2()
		this.viewport.addEventListener('mousedown', this.mouseCapture)
		this.viewport.addEventListener('mousemove', this.setMousePosition)
		// this.viewport.addEventListener('click', this.move)
	}
	setMousePosition = (event) => {
		const bounds = this.viewport.getBoundingClientRect()
		const positionX = (event.clientX - bounds.left) * this.viewport.clientWidth / bounds.width
		const positionY = (event.clientY - bounds.top) * this.viewport.clientHeight / bounds.height
		this.mousePosition.x = (positionX / this.viewport.clientWidth) * 2 - 1
		this.mousePosition.y = (positionY / this.viewport.clientHeight) * -2 + 1
	}
	createObject(color, positionX, positionZ) {
		const hex = `0x${color}`
		const box = new THREE.BoxGeometry(25, 25, 25)
		const material = new THREE.MeshBasicMaterial({
			color: parseInt(hex, 16)
		})
		const mesh = new THREE.Mesh(box, material)
		mesh.position.set(positionX, 10, positionZ)
		this.scene.add(mesh)
		this.sceneObjects.push({
			box,
			material,
			mesh
		})
	}
	mouseCapture = (event) => {
		if (event.button === 0) {
			const raycaster = new THREE.Raycaster()
			raycaster.setFromCamera(this.mousePosition, this.camera)
			const intersect = raycaster.intersectObject(this.groundPlane)
			if (intersect.length) {
				this.createObject(this.colorPickerRef.selectedColor, intersect[0].point.x, intersect[0].point.z)
			}
		}
	}
	move(direction, xVal, yVal) {
		console.log('direction', direction)
		// since we only care about the most recent scene object to move
		const recent = this.sceneObjects[this.sceneObjects.length - 1];
		// console.log(this.camera.getWorldDirection)
		const grid = new THREE.Vector3(0, 0, -1).unproject(this.camera);
		const gridX = new THREE.Vector3(this.viewport.clientWidth, 0, -1)
                           .unproject(this.camera);
		const gridY = new THREE.Vector3(0, this.viewport.clientHeight, -1)
                           .unproject(this.camera);
		const xAxis = gridX.sub(grid).normalize();
		const yAxis = gridY.sub(grid).normalize();
		const latMovement = xAxis.multiplyScalar(xVal);
		const longMovement = yAxis.multiplyScalar(yVal);
		const speed = latMovement.add(longMovement);
		const placement = recent.mesh.position.add(speed);
		switch (direction) {
			case 'up':
				recent.mesh.position.y = placement.y;
				recent.mesh.position.z = placement.z;
				break;
			case 'down':
				recent.mesh.position.y = placement.y;
				recent.mesh.position.z = placement.z;
				break;
			case 'left':
				recent.mesh.position.y = placement.y;
				recent.mesh.position.x = placement.x;
				break;
			case 'right':
				recent.mesh.position.y = placement.y;
				recent.mesh.position.x = placement.x;
				break;
		}
		event.preventDefault();
	}
	reset() {
		this.sceneObjects.forEach(({
			box,
			material,
			mesh
		}) => {
			this.scene.remove(mesh)
			box.dispose()
			material.dispose()
		})
		this.sceneObjects = []
	}
}
export {
	SceneController
}
