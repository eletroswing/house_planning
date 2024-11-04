import fs from 'fs';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { Canvas } from 'canvas';
import { Blob, FileReader } from 'vblob';
import crypto from 'crypto';

function createModel(data) {
    return new Promise(async (resolve, reject) => {
        const name = crypto.randomBytes(16).toString('hex');
        const filePath = `./public/models/${name}.glb`;

        global.window = global;
        global.Blob = Blob;
        global.FileReader = FileReader;
        global.document = {
            createElement: (nodeName) => {
                if (nodeName !== 'canvas') throw new Error(`Cannot create node ${nodeName}`);
                return new Canvas(256, 256);
            }
        };

        function createWall(width, height, depth, position) {
            const wallGeometry = new THREE.BoxGeometry(width, height, depth);
            const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
            const wall = new THREE.Mesh(wallGeometry, wallMaterial);
            wall.position.copy(position);
            scene.add(wall);
        }

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        camera.position.set(0, 5, 10);

        const wallHeight = 100;

        const json = data;
        for (const currentWall of json.walls) {
            const wall = currentWall.position;
            const [start, end] = wall;
            const [startX, startY] = start;
            const [endX, endY] = end;

            const isHorizontal = startX === endX;
            const positionX = startX + ((endX - startX) / 2);
            const positionY = startY + ((endY - startY) / 2);

            if (isHorizontal) {
                const depth = (Math.abs(endY - startY));
                createWall(2, wallHeight, depth, new THREE.Vector3(positionX, wallHeight / 2, positionY));
                continue;
            }

            const depth = (Math.abs(endX - startX));
            createWall(depth, wallHeight, 2, new THREE.Vector3(positionX, wallHeight / 2, positionY));
        }

        const exporter = new GLTFExporter();
        const result = await new Promise((resolve) => exporter.parse(
            scene,
            (result) => {
                const glbData = result instanceof ArrayBuffer ? result : JSON.stringify(result);
                fs.writeFileSync(filePath, Buffer.from(glbData));
                resolve(filePath);
            },
            { binary: true } // Set binary to true for .glb export
        ));

        resolve(filePath);
    });
}

export default {
    createModel
};
