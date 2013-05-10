Minecraft SkinProfile
===========

This is a client-side library that will render a Minecraft 3d model of the player with his or her skin, using either a canvas or WebGL renderer.  This client-side library is included with the WebSocketServices package found at the dev.bukkit website.  Please see the links below.

* Website: [http://www.caffeinatedrat.com](http://www.caffeinatedrat.com)
* Bukkit: [http://dev.bukkit.org/server-mods/websocketservices/] (http://dev.bukkit.org/server-mods/websocketservices/)
* Bugs/Suggestions: CaffeinatedRat at gmail dot com

NOTES
-----------

* An image proxy is required in order to use the WebGL functionality due to the security constraints of CORS on the Minecraft Skin server.

Change Log
-----------

The following contains information about new features, bug fixes, and other version changes.

#### 4.0.0 (5/9/14)

Added functionality to the property positionVector3, so that now models will be translated to that position.

#### 3.0.0 (3/14/13)

* Fixed the stop method so it calls the cancelAnimationFrame rather than clearTimeout.

#### 2.0.0 (3/9/13)

* Added an exception for browsers that do not support webgl.

#### 1.0.0

* Initial Release.
