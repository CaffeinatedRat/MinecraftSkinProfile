Minecraft SkinProfile
===========

This is a client-side library that will render a Minecraft 3d model of the player with his or her skin, using either a canvas or WebGL renderer.  This client-side library is included with the WebSocketServices package found at the dev.bukkit website.  Please see the links below.

* Website: [http://www.caffeinatedrat.com](http://www.caffeinatedrat.com)
* Bukkit: [http://dev.bukkit.org/server-mods/websocketservices/](http://dev.bukkit.org/server-mods/websocketservices/)
* Bugs/Suggestions: CaffeinatedRat at gmail dot com

NOTES
-----------

* An image proxy is required in order to use the WebGL functionality due to the security constraints of CORS on the Minecraft Skin server.
* This project now relies on [CRLib](https://github.com/CaffeinatedRat/CRLib).  The compiled version under the build folder will contain the library embedded in it.

Compilation
-----------

This project is minimized and obscured by the [Google Closure Compiler](https://developers.google.com/closure/compiler/).  To compile the library, you'll need to supply a few arguments when running the compiler.jar, as shown below.  There needs to be at least two input javascript files, one that is the skinprofile.js and the other that is the core.js file from the CRLib.

<pre>
java -jar "compiler.jar" --js="skinprofile.js" "core.js" --js_output_file="skinprofile.min.js"
</pre>
 

Coding and Pull Request Conventions
-----------

A set of standards I borrowed from the [https://github.com/Bukkit/CraftBukkit] (bukkit) project, since it seems to apply generally to everything.

* No tabs; use 4 spaces instead.
* No trailing whitespaces.
* No CRLF line endings, LF only, put your gits 'core.autocrlf' on 'true'.
* No 80 column limit or 'weird' midstatement newlines.
* The pull request must contain code that builds without errors.
* The pull request must contain code that has been united tested to some degree as to not fail on runtime.
* The description of your pull request should provide detailed information on the pull along with justification of the changes where applicable.

Change Log
-----------

The following contains information about new features, bug fixes, and other version changes.

#### 4.0.0 (5/9/13)

Added functionality to the property positionVector3, so that now models will be translated to that position.

#### 3.0.0 (3/14/13)

* Fixed the stop method so it calls the cancelAnimationFrame rather than clearTimeout.

#### 2.0.0 (3/9/13)

* Added an exception for browsers that do not support webgl.

#### 1.0.0

* Initial Release.
