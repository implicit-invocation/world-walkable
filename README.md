# world-walkable
walkable on latlng

## Installation

```sh
npm install world-walkable --save
```

## Usage

```Javascript
var WorldWalkable = require('world-walkable');
var worldWalkable = new WorldWalkable([[minLat, minLng], [maxLat, maxLng]]);

// add a polygon
worldWalkable.addPolygon([[lat1, lng1], [lat2, lng2], [lat3, lng3]]);

// add a polyline
var polyline = worldWalkable.addPolyline([[lat1, lng1], [lat2, lng2], [lat3, lng3]]);

// delete an obstacle
worldWalkable.removeObstacle(polyline);

// find path
var path = worldWalkable.findPath([lat1, lng1], [lat2, lng2], radius);
```
