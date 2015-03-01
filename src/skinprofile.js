/** @license
* Copyright (c) 2013-2015, Ken Anderson <caffeinatedrat at gmail dot com>
* All rights reserved.
* Redistribution and use in source and binary forms, with or without
* modification, are permitted provided that the following conditions are met:
*
*     * Redistributions of source code must retain the above copyright
*       notice, this list of conditions and the following disclaimer.
*     * Redistributions in binary form must reproduce the above copyright
*       notice, this list of conditions and the following disclaimer in the
*       documentation and/or other materials provided with the distribution.
*
* THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY
* EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
* WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
* DISCLAIMED. IN NO EVENT SHALL THE AUTHOR AND CONTRIBUTORS BE LIABLE FOR ANY
* DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
* (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
* LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
* ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
* (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
* SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

* -----------------------------------------------------------------
* Required Libraries:
* 1) Three.js
* -----------------------------------------------------------------

* -----------------------------------------------------------------
* Change Log
* Version 2 (3/9/13) --  Added an exception for browsers that do not support webgl.
* Version 3 (3/14/13) --  Fixed the stop method so it calls the cancelAnimationFrame rather than clearTimeout.
* Version 4 (5/5/13) --  Added functionality to the property positionVector3, so that now models will be translated to that position.
* Version 5 (6/23/13) -- Added an arm motion animation, and some head motion.
*
* Version 6 (7/7/13)
* 1) Started using the CaffeinatedRat namespace and crlib library and a new version object.
* 2) Changed the way the prototype methods are written.
* -----------------------------------------------------------------
*/

"use strict";

//-----------------------------------------------------------------
// Namespace
//-----------------------------------------------------------------
var CaffeinatedRat = CaffeinatedRat || {};
CaffeinatedRat.Minecraft = CaffeinatedRat.Minecraft || {};

//-----------------------------------------------------------------
// ComputedModel Class
//-----------------------------------------------------------------

/**
* @constructor
*/
CaffeinatedRat.Minecraft.ComputedModel = function (parameters) {

    //-----------------------------------------------------------------
    // Parameterization
    //-----------------------------------------------------------------

    parameters = parameters || {};

    if (parameters.skinImage !== undefined) {

        this._skinImage = parameters.skinImage;

    }
    else {

        this._skinImage = null;

    }

    if (parameters.hideHelmet !== undefined) {

        this._hideHelment = parameters.hideHelmet;

    }
    else {

        this._hideHelmet = false;

    }

    if (parameters.scale !== undefined) {

        this._scale = parameters.scale;

    }
    else {

        this._scale = 300;

    }

    if (parameters.positionVector3 !== undefined) {

        this._positionVector3 = parameters.positionVector3;

    }
    else {

        this._positionVector3 = new THREE.Vector3(0.0, 0.0, 0.0);

    }

    //3d Model
    this._helmetMesh = null;
    this._rightArmMesh = null;
    this._leftArmMesh = null;
    this._headGroup = null;
    this._playerModel = null;

};

CaffeinatedRat.Minecraft.ComputedModel.prototype = {

    constructor: CaffeinatedRat.Minecraft.ComputedModel,

    init: function (scene) {

        //Throw an exception if the scene is undefined since we cannot attach to an undefined scene.
        if (scene === undefined) {

            throw new CaffeinatedRat.Minecraft.ComputedModel.SceneNotDefinedException('constructor');

        }

        this._scene = scene;

        var texture = new THREE.Texture(this._skinImage);
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        texture.needsUpdate = true;

        //----------------------------------------------
        // Define Geometries and texture mapping UV.
        //----------------------------------------------

        //Each face texture is 8x8.
        var headGeometry = new THREE.CubeGeometry(this._scale, this._scale, this._scale);

        //Right-side of the head.
        headGeometry.faceVertexUvs[0][1][0] = new THREE.Vector2(0.0, 0.75);
        headGeometry.faceVertexUvs[0][1][1] = new THREE.Vector2(0.0, 0.5);
        headGeometry.faceVertexUvs[0][1][2] = new THREE.Vector2(0.125, 0.5);
        headGeometry.faceVertexUvs[0][1][3] = new THREE.Vector2(0.125, 0.75);

        //Face...
        headGeometry.faceVertexUvs[0][4][0] = new THREE.Vector2(0.125, 0.75);
        headGeometry.faceVertexUvs[0][4][1] = new THREE.Vector2(0.125, 0.5);
        headGeometry.faceVertexUvs[0][4][2] = new THREE.Vector2(0.25, 0.5);
        headGeometry.faceVertexUvs[0][4][3] = new THREE.Vector2(0.25, 0.75);

        //Left-side of the head.
        headGeometry.faceVertexUvs[0][0][0] = new THREE.Vector2(0.25, 0.75);
        headGeometry.faceVertexUvs[0][0][1] = new THREE.Vector2(0.25, 0.5);
        headGeometry.faceVertexUvs[0][0][2] = new THREE.Vector2(0.375, 0.5);
        headGeometry.faceVertexUvs[0][0][3] = new THREE.Vector2(0.375, 0.75);

        //Back of the head.
        headGeometry.faceVertexUvs[0][5][0] = new THREE.Vector2(0.375, 0.75);
        headGeometry.faceVertexUvs[0][5][1] = new THREE.Vector2(0.375, 0.5);
        headGeometry.faceVertexUvs[0][5][2] = new THREE.Vector2(0.5, 0.5);
        headGeometry.faceVertexUvs[0][5][3] = new THREE.Vector2(0.5, 0.75);

        //Top of the head.
        headGeometry.faceVertexUvs[0][2][0] = new THREE.Vector2(0.125, 1.00);
        headGeometry.faceVertexUvs[0][2][1] = new THREE.Vector2(0.125, 0.75);
        headGeometry.faceVertexUvs[0][2][2] = new THREE.Vector2(0.25, 0.75);
        headGeometry.faceVertexUvs[0][2][3] = new THREE.Vector2(0.25, 1.00);

        //Bottom of the head.
        // --- CR (6/3/13) --- Fixed the bottom as it was flipped.
        headGeometry.faceVertexUvs[0][3][0] = new THREE.Vector2(0.25, 0.75);
        headGeometry.faceVertexUvs[0][3][1] = new THREE.Vector2(0.25, 1.00);
        headGeometry.faceVertexUvs[0][3][2] = new THREE.Vector2(0.375, 1.00);
        headGeometry.faceVertexUvs[0][3][3] = new THREE.Vector2(0.375, 0.75);

        //Each face texture is 8x8.
        var helmetGeometry = new THREE.CubeGeometry(1.125 * this._scale, 1.125 * this._scale, 1.125 * this._scale);

        //Right-side of the head.
        helmetGeometry.faceVertexUvs[0][1][0] = new THREE.Vector2(0.5, 0.75);
        helmetGeometry.faceVertexUvs[0][1][1] = new THREE.Vector2(0.5, 0.5);
        helmetGeometry.faceVertexUvs[0][1][2] = new THREE.Vector2(0.625, 0.5);
        helmetGeometry.faceVertexUvs[0][1][3] = new THREE.Vector2(0.625, 0.75);

        //Face...
        helmetGeometry.faceVertexUvs[0][4][0] = new THREE.Vector2(0.625, 0.75);
        helmetGeometry.faceVertexUvs[0][4][1] = new THREE.Vector2(0.625, 0.5);
        helmetGeometry.faceVertexUvs[0][4][2] = new THREE.Vector2(0.75, 0.5);
        helmetGeometry.faceVertexUvs[0][4][3] = new THREE.Vector2(0.75, 0.75);

        //Left-side of the head.
        helmetGeometry.faceVertexUvs[0][0][0] = new THREE.Vector2(0.75, 0.75);
        helmetGeometry.faceVertexUvs[0][0][1] = new THREE.Vector2(0.75, 0.5);
        helmetGeometry.faceVertexUvs[0][0][2] = new THREE.Vector2(0.875, 0.5);
        helmetGeometry.faceVertexUvs[0][0][3] = new THREE.Vector2(0.875, 0.75);

        //Back of the head.
        helmetGeometry.faceVertexUvs[0][5][0] = new THREE.Vector2(0.875, 0.75);
        helmetGeometry.faceVertexUvs[0][5][1] = new THREE.Vector2(0.875, 0.5);
        helmetGeometry.faceVertexUvs[0][5][2] = new THREE.Vector2(1.0, 0.5);
        helmetGeometry.faceVertexUvs[0][5][3] = new THREE.Vector2(1.0, 0.75);

        //Top of the head.
        helmetGeometry.faceVertexUvs[0][2][0] = new THREE.Vector2(0.625, 1.00);
        helmetGeometry.faceVertexUvs[0][2][1] = new THREE.Vector2(0.625, 0.75);
        helmetGeometry.faceVertexUvs[0][2][2] = new THREE.Vector2(0.75, 0.75);
        helmetGeometry.faceVertexUvs[0][2][3] = new THREE.Vector2(0.75, 1.00);

        //Bottom of the head.
        helmetGeometry.faceVertexUvs[0][3][0] = new THREE.Vector2(0.75, 1.00);
        helmetGeometry.faceVertexUvs[0][3][1] = new THREE.Vector2(0.75, 0.75);
        helmetGeometry.faceVertexUvs[0][3][2] = new THREE.Vector2(0.875, 0.75);
        helmetGeometry.faceVertexUvs[0][3][3] = new THREE.Vector2(0.875, 1.00);

        //Each body texture is 8 x 12 x 4
        var bodyGeometry = new THREE.CubeGeometry(this._scale, this._scale * 1.5, this._scale * 0.5);

        //Right-side of the body.
        bodyGeometry.faceVertexUvs[0][1][0] = new THREE.Vector2(0.25, 0.375);
        bodyGeometry.faceVertexUvs[0][1][1] = new THREE.Vector2(0.25, 0.0);
        bodyGeometry.faceVertexUvs[0][1][2] = new THREE.Vector2(0.3125, 0.0);
        bodyGeometry.faceVertexUvs[0][1][3] = new THREE.Vector2(0.3125, 0.375);

        //Front...
        bodyGeometry.faceVertexUvs[0][4][0] = new THREE.Vector2(0.3125, 0.375);
        bodyGeometry.faceVertexUvs[0][4][1] = new THREE.Vector2(0.3125, 0.0);
        bodyGeometry.faceVertexUvs[0][4][2] = new THREE.Vector2(0.4375, 0.0);
        bodyGeometry.faceVertexUvs[0][4][3] = new THREE.Vector2(0.4375, 0.375);

        //Left-side of the body.
        bodyGeometry.faceVertexUvs[0][0][0] = new THREE.Vector2(0.4375, 0.375);
        bodyGeometry.faceVertexUvs[0][0][1] = new THREE.Vector2(0.4375, 0.0);
        bodyGeometry.faceVertexUvs[0][0][2] = new THREE.Vector2(0.5, 0.0);
        bodyGeometry.faceVertexUvs[0][0][3] = new THREE.Vector2(0.5, 0.375);

        //Back
        bodyGeometry.faceVertexUvs[0][5][0] = new THREE.Vector2(0.5, 0.375);
        bodyGeometry.faceVertexUvs[0][5][1] = new THREE.Vector2(0.5, 0.0);
        bodyGeometry.faceVertexUvs[0][5][2] = new THREE.Vector2(0.625, 0.0);
        bodyGeometry.faceVertexUvs[0][5][3] = new THREE.Vector2(0.625, 0.375);

        //Neck Hole
        bodyGeometry.faceVertexUvs[0][2][0] = new THREE.Vector2(0.3125, 0.375);
        bodyGeometry.faceVertexUvs[0][2][1] = new THREE.Vector2(0.3125, 0.5);
        bodyGeometry.faceVertexUvs[0][2][2] = new THREE.Vector2(0.4375, 0.5);
        bodyGeometry.faceVertexUvs[0][2][3] = new THREE.Vector2(0.4375, 0.375);

        //Waist.
        bodyGeometry.faceVertexUvs[0][3][0] = new THREE.Vector2(0.4375, 0.375);
        bodyGeometry.faceVertexUvs[0][3][1] = new THREE.Vector2(0.4375, 0.5);
        bodyGeometry.faceVertexUvs[0][3][2] = new THREE.Vector2(0.5625, 0.5);
        bodyGeometry.faceVertexUvs[0][3][3] = new THREE.Vector2(0.5625, 0.375);

        //Each arm texture is 4 x 12 x 4
        var armGeometry = new THREE.CubeGeometry(this._scale * 0.5, this._scale * 1.5, this._scale * 0.5);

        //Right-side of the arm.
        armGeometry.faceVertexUvs[0][1][0] = new THREE.Vector2(0.625, 0.375);
        armGeometry.faceVertexUvs[0][1][1] = new THREE.Vector2(0.625, 0.0);
        armGeometry.faceVertexUvs[0][1][2] = new THREE.Vector2(0.6875, 0.0);
        armGeometry.faceVertexUvs[0][1][3] = new THREE.Vector2(0.6875, 0.375);

        //Front...
        armGeometry.faceVertexUvs[0][4][0] = new THREE.Vector2(0.6875, 0.375);
        armGeometry.faceVertexUvs[0][4][1] = new THREE.Vector2(0.6875, 0.0);
        armGeometry.faceVertexUvs[0][4][2] = new THREE.Vector2(0.75, 0.0);
        armGeometry.faceVertexUvs[0][4][3] = new THREE.Vector2(0.75, 0.375);

        //Left-side of the arm.
        armGeometry.faceVertexUvs[0][0][0] = new THREE.Vector2(0.75, 0.375);
        armGeometry.faceVertexUvs[0][0][1] = new THREE.Vector2(0.75, 0.0);
        armGeometry.faceVertexUvs[0][0][2] = new THREE.Vector2(0.8125, 0.0);
        armGeometry.faceVertexUvs[0][0][3] = new THREE.Vector2(0.8125, 0.375);

        //Back
        armGeometry.faceVertexUvs[0][5][0] = new THREE.Vector2(0.8125, 0.375);
        armGeometry.faceVertexUvs[0][5][1] = new THREE.Vector2(0.8125, 0.0);
        armGeometry.faceVertexUvs[0][5][2] = new THREE.Vector2(0.875, 0.0);
        armGeometry.faceVertexUvs[0][5][3] = new THREE.Vector2(0.875, 0.375);

        //Shoulder
        armGeometry.faceVertexUvs[0][2][0] = new THREE.Vector2(0.6875, 0.375);
        armGeometry.faceVertexUvs[0][2][1] = new THREE.Vector2(0.6875, 0.5);
        armGeometry.faceVertexUvs[0][2][2] = new THREE.Vector2(0.75, 0.5);
        armGeometry.faceVertexUvs[0][2][3] = new THREE.Vector2(0.75, 0.375);

        //Hand.
        armGeometry.faceVertexUvs[0][3][0] = new THREE.Vector2(0.75, 0.375);
        armGeometry.faceVertexUvs[0][3][1] = new THREE.Vector2(0.75, 0.5);
        armGeometry.faceVertexUvs[0][3][2] = new THREE.Vector2(0.8125, 0.5);
        armGeometry.faceVertexUvs[0][3][3] = new THREE.Vector2(0.8125, 0.375);

        //Each leg texture is 4 x 8 and 4 x 4
        var legGeometry = new THREE.CubeGeometry(this._scale * 0.5, this._scale * 1.5, this._scale * 0.5);

        //Right-side of the leg.
        legGeometry.faceVertexUvs[0][1][0] = new THREE.Vector2(0.0, 0.375);
        legGeometry.faceVertexUvs[0][1][1] = new THREE.Vector2(0.0, 0.0);
        legGeometry.faceVertexUvs[0][1][2] = new THREE.Vector2(0.0625, 0.0);
        legGeometry.faceVertexUvs[0][1][3] = new THREE.Vector2(0.0625, 0.375);

        //Front...
        legGeometry.faceVertexUvs[0][4][0] = new THREE.Vector2(0.0625, 0.375);
        legGeometry.faceVertexUvs[0][4][1] = new THREE.Vector2(0.0625, 0.0);
        legGeometry.faceVertexUvs[0][4][2] = new THREE.Vector2(0.125, 0.0);
        legGeometry.faceVertexUvs[0][4][3] = new THREE.Vector2(0.125, 0.375);

        //Left-side of the legt.
        legGeometry.faceVertexUvs[0][0][0] = new THREE.Vector2(0.125, 0.375);
        legGeometry.faceVertexUvs[0][0][1] = new THREE.Vector2(0.125, 0.0);
        legGeometry.faceVertexUvs[0][0][2] = new THREE.Vector2(0.1875, 0.0);
        legGeometry.faceVertexUvs[0][0][3] = new THREE.Vector2(0.1875, 0.375);

        //Back
        legGeometry.faceVertexUvs[0][5][0] = new THREE.Vector2(0.1875, 0.375);
        legGeometry.faceVertexUvs[0][5][1] = new THREE.Vector2(0.1875, 0.0);
        legGeometry.faceVertexUvs[0][5][2] = new THREE.Vector2(0.25, 0.0);
        legGeometry.faceVertexUvs[0][5][3] = new THREE.Vector2(0.25, 0.375);

        //Top
        legGeometry.faceVertexUvs[0][2][0] = new THREE.Vector2(0.6875, 0.375);
        legGeometry.faceVertexUvs[0][2][1] = new THREE.Vector2(0.6875, 0.5);
        legGeometry.faceVertexUvs[0][2][2] = new THREE.Vector2(0.75, 0.5);
        legGeometry.faceVertexUvs[0][2][3] = new THREE.Vector2(0.75, 0.375);

        //Foot.
        legGeometry.faceVertexUvs[0][3][0] = new THREE.Vector2(0.75, 0.375);
        legGeometry.faceVertexUvs[0][3][1] = new THREE.Vector2(0.75, 0.5);
        legGeometry.faceVertexUvs[0][3][2] = new THREE.Vector2(0.8125, 0.5);
        legGeometry.faceVertexUvs[0][3][3] = new THREE.Vector2(0.8125, 0.375);

        //----------------------------------------------
        // Vertex adjustments.
        //----------------------------------------------

        //NOTE: Reduces readability a bit, but also reduces overhead by condensing all loops into one for vertex adjustment.
        for (var i = 0; i < 8; i++) {

            headGeometry.vertices[i].y += (this._scale * 0.50);
            helmetGeometry.vertices[i].y += (this._scale * 0.50);
            armGeometry.vertices[i].y -= (this._scale * 0.50);

        }

        //----------------------------------------------
        // Material management.
        //----------------------------------------------

        //Lump all of the mesh and grouping in one area...
        var headMaterial = new THREE.MeshBasicMaterial({ map: texture });
        var helmetMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide });
        //helmetMaterial.side = THREE.DoubleSide;
        var bodyMaterial = new THREE.MeshBasicMaterial({ map: texture });
        var armMaterial = new THREE.MeshBasicMaterial({ map: texture });
        var legMaterial = new THREE.MeshBasicMaterial({ map: texture });

        //----------------------------------------------
        // Mesh management.
        //----------------------------------------------

        //Global meshes...
        this._helmetMesh = new THREE.Mesh(helmetGeometry, helmetMaterial);
        this._leftArmMesh = new THREE.Mesh(armGeometry, armMaterial);
        this._rightArmMesh = new THREE.Mesh(armGeometry, armMaterial);

        //Local meshes...
        var headMesh = new THREE.Mesh(headGeometry, headMaterial);
        var bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
        var leftLegMesh = new THREE.Mesh(legGeometry, legMaterial);
        var rightLegMesh = new THREE.Mesh(legGeometry, legMaterial);

        //The body's y-position will be: (Body / 2) + (Head / 2)
        bodyMesh.position.y -= ((this._scale * 0.75) + (this._scale / 2));

        //The left arms's y-position will be: (Body / 2) + (Head / 2)
        //The left arms's x-position will be: (Body / 2) + (Arm / 2)
        this._leftArmMesh.position.y -= (this._scale / 2) + (this._scale * 0.25);
        this._leftArmMesh.position.x += (this._scale / 4) + (this._scale / 2);

        //The right arms's y-position will be: (Body / 2) + (Head / 2)
        //The right arms's x-position will be: (Body / 2) + (Arm / 2)
        this._rightArmMesh.position.y -= (this._scale / 2) + (this._scale * 0.25);
        this._rightArmMesh.position.x -= (this._scale / 4) + (this._scale / 2);

        //The left leg's y-position will be: Body + (Head / 2) + (Leg / 2)
        //The left leg's x-position will be: (leg / 2)
        leftLegMesh.position.y -= (this._scale * 1.5) + (this._scale / 2) + (this._scale * 0.75);
        leftLegMesh.position.x -= (this._scale * 0.25);

        //The right leg's y-position will be: Body + (Head / 2) + (Leg / 2)
        //The right leg's x-position will be: (leg / 2)
        rightLegMesh.position.y -= (this._scale * 1.5) + (this._scale / 2) + (this._scale * 0.75);
        rightLegMesh.position.x += (this._scale * 0.25);

        //----------------------------------------------
        // Model management.
        //----------------------------------------------
        this._playerModel = new THREE.Object3D();
        this._headGroup = new THREE.Object3D();

        this._headGroup.add(headMesh);
        this._headGroup.add(this._helmetMesh);
        this._headGroup.position.y -= (this._scale * 0.50);

        this._playerModel.add(this._headGroup);
        this._playerModel.add(bodyMesh);
        this._playerModel.add(this._leftArmMesh);
        this._playerModel.add(this._rightArmMesh);
        this._playerModel.add(leftLegMesh);
        this._playerModel.add(rightLegMesh);

        this._scene.add(this._playerModel);

        if (this._positionVector3 !== undefined) {

            this._playerModel.position.x += this._positionVector3.x;
            this._playerModel.position.y += this._positionVector3.y;
            this._playerModel.position.z += this._positionVector3.z;

        }

    },

    animate: function (time, screenX, screenY, canvasWidth, canvasHeight, camera) {

        var cameraToHeadVector = new THREE.Vector3(camera.position.x - (this._positionVector3.x + this._headGroup.position.x), camera.position.y - (this._positionVector3.y + this._headGroup.position.y), camera.position.z - (this._positionVector3.z + this._headGroup.position.z));
        var cursorVector = new THREE.Vector2(screenX - (canvasWidth / 2), screenY - (canvasHeight / 2));
        var halfPI = Math.PI / 2;

        //Precomputed values PI / 32 = 0.098175
        //Precomputed values PI / 64 = 0.049087
        this._rightArmMesh.rotation.x = 0.098175 * Math.sin(time);
        this._rightArmMesh.rotation.y = 0.049087 * Math.cos(time);
        this._rightArmMesh.rotation.z = -(0.098175 + (0.098175 * Math.sin(time)));

        this._leftArmMesh.rotation.x = 0.098175 * Math.sin(time);
        this._leftArmMesh.rotation.y = 0.049087 * Math.cos(time);
        this._leftArmMesh.rotation.z = (0.098175 + (0.098175 * Math.sin(time)));

        var theta = Math.atan2(cameraToHeadVector.x, cameraToHeadVector.z);
        var thetaInv = Math.atan2(cameraToHeadVector.x, -cameraToHeadVector.z);
        //var phi = Math.atan2(cameraToHeadVector.y, cameraToHeadVector.z);
        //var omega = Math.atan2(cameraToHeadVector.y, cameraToHeadVector.x);

        var depth = cameraToHeadVector.length();

        //Calculate the view depth.
        //var viewDepth = Math.tan(camera.fov / 2) / cursorVector.x;

        //Calculate the ratio.
        //var ratio = 1 / depth;

        //theta = theta + ((ratio) * cursorVector.x);
        //thetaInv = thetaInv - ((ratio) * cursorVector.x);

        if ((theta >= -halfPI) && (theta <= halfPI)) {

            this._headGroup.rotation.y = theta;

        }
        else {

            this._headGroup.rotation.y = thetaInv;

        }

        //    if ((phi >= -halfPI) && (phi <= halfPI)) {

        //        this._headGroup.rotation.x = Math.cos(theta) * -phi;

        //    }

        //    if ((omega >= -halfPI) && (omega <= halfPI)) {

        //        this._headGroup.rotation.z = Math.sin(theta) * omega;
        //    }

        this._helmetMesh.visible = !this._hideHelmet;

    },

    showHelmet: function () {

        this._hideHelmet = false;

    },


    hideHelmet: function () {

        this._hideHelmet = true;

    }

};

//-----------------------------------------------------------------
// SkinProfile Class
//-----------------------------------------------------------------

/**
* @constructor
*/
CaffeinatedRat.Minecraft.SkinProfile = function (parameters) {

    //Check for browser support.
    if (!window.WebGLRenderingContext) {

        throw new CaffeinatedRat.Minecraft.SkinProfile.BrowserNotSupported('constructor');

    }

    //-----------------------------------------------------------------
    // Versioning
    //-----------------------------------------------------------------
    //CaffeinatedRat.Minecraft.SkinProfile.VERSION = '5';
    CaffeinatedRat.Minecraft.SkinProfile.VERSION = new CaffeinatedRat.Version(6, 0, 0);

    console.log('CaffeinatedRat.Minecraft.SkinProfile.Version: ' + CaffeinatedRat.Minecraft.SkinProfile.VERSION.toString());

    //-----------------------------------------------------------------
    // Parameterization
    //-----------------------------------------------------------------

    parameters = parameters || {};

    if (parameters.skinImage !== undefined) {

        this._skinImage = parameters.skinImage;

    }
    else {

        this._skinImage = null;

    }

    if (parameters.container !== undefined) {

        this._container = parameters.container;

    }
    else {

        this._container = null;

    }

    if (parameters.useWebGL !== undefined) {

        this._useWebGL = parameters.useWebGL;

    }
    else {

        this._useWebGL = false;

    }

    if (parameters.canvasWidth !== undefined) {

        this._canvasWidth = parameters.canvasWidth;

    }
    else {

        this._canvasWidth = 540;

    }

    if (parameters.canvasHeight !== undefined) {

        this._canvasHeight = parameters.canvasHeight;

    }
    else {

        this._canvasHeight = 540;

    }

    if (parameters.hideHelmet !== undefined) {

        this._hideHelmet = parameters._hideHelmet;

    }
    else {

        this._hideHelmet = false;

    }

    if (parameters.positionVector3 !== undefined) {

        this._positionVector3 = parameters.positionVector3;

    }
    else {

        this._positionVector3 = new THREE.Vector3(0.0, 0.0, 0.0);

    }

    if (parameters.scale !== undefined) {

        this._scale = parameters.scale;

    }
    else {

        this._scale = 300;

    }

    this._camera = null;
    this._scene = null;
    this._renderer = null;
    this._controls = null;
    this._animationId = 0;
    this._tick = 0;

    this._3dModel = new CaffeinatedRat.Minecraft.ComputedModel({

        hideHelmet: this._hideHelmet,
        skinImage: this._skinImage,
        scale: this._scale,
        positionVector3: this._positionVector3

    });

    this._mousePosX = this._canvasWidth / 2;
    this._mousePosY = this._canvasHeight / 2;
}

CaffeinatedRat.Minecraft.SkinProfile.prototype = {

    constructor: CaffeinatedRat.Minecraft.SkinProfile,

    init: function () {

        var that = this;

//        $('#skinWrapper').live('mousemove', function (event) {

//            that._mousePosX = event.offsetX;
//            that._mousePosY = event.offsetY;

//        });

        clearTimeout(this._animationId);

        this._tick = 0;

        this._camera = new THREE.PerspectiveCamera(75, (this._canvasWidth / this._canvasHeight), 1, 10000);
        this._camera.position.z = 200;

        this._scene = new THREE.Scene();

        this._3dModel.init(this._scene);

        //----------------------------------------------
        // Define the canvas & renderer
        //----------------------------------------------

        var canvas = document.createElement('canvas');
        canvas.style.width = '100%';
        canvas.style.height = '100%';

        if (this._useWebGL) {

            this._renderer = new THREE.WebGLRenderer({ antialias: false, canvas: canvas });

        }
        else {

            this._renderer = new THREE.CanvasRenderer({ canvas: canvas });

        }

        this._renderer.setSize(this._canvasWidth, this._canvasHeight);
        this._renderer.setClearColor(new THREE.Color(0x000000), 0.0);

        if (this._container != null) {

            this._container.append(this._renderer.domElement);

        }

        //----------------------------------------------
        // Attach the camera controls.
        //----------------------------------------------

        this._controls = new THREE.TrackballControls(this._camera, canvas);

    },

    animate: function () {

        var that = this;
        this._tick = (this._tick + (Math.PI / 128)) % (Math.PI * 2);

        //Wrapper
        var callMethod = function () { that.animate(); }

        this._controls.update();

        // note: three.js includes requestAnimationFrame shim
        this._animationId = requestAnimationFrame(callMethod);

        try {

            this._3dModel.animate(this._tick, this._mousePosX, this._mousePosY, this._canvasWidth, this._canvasHeight, this._camera);

            if (this._renderer != null) {

                this._renderer.render(this._scene, this._camera);

            }

        }
        catch (err) {

            this.stop();
            console.log(err);
            throw new CaffeinatedRat.Minecraft.SkinProfile.BrowserNotSupported('animate');

        }

    },

    stop: function () {

        if ((this._animationId !== undefined) && (this._animationId > 0)) {

            window.cancelAnimationFrame(this._animationId);

        }

    },

    showHelmet: function () {

        this._3dModel.showHelmet();

    },

    hideHelmet: function () {

        this._3dModel.hideHelmet();

    }

};

//-----------------------------------------------------------------
// Exceptions
//-----------------------------------------------------------------


/**
* @constructor
*/
CaffeinatedRat.Minecraft.SkinProfile.SceneNotDefinedException = function (caller) {

    CaffeinatedRat.Exception.call(this, 'Minecraft.SkinProfile.' + caller, 'A scene must be defined for this model.');

}

/**
* @constructor
*/
CaffeinatedRat.Minecraft.SkinProfile.BrowserNotSupported = function (caller) {

    CaffeinatedRat.Exception.call(this, 'Minecraft.SkinProfile.' + caller, 'This browser does not support WebGL.');

}

