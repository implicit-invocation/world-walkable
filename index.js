var Walkable = require('walkable');

var R = 6378.137; // Radius of earth in KM

function dst(lat1, lon1, lat2, lon2) {
  // generally used geo measurement function
  var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
  var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d * 1000; // meters
}

function WorldWalkable(bounds) {
  var p1 = bounds[0];
  var p2 = bounds[1];

  var minLat = Math.min(p1[0], p2[0]);
  var maxLat = Math.max(p1[0], p2[0]);
  var minLng = Math.min(p1[1], p2[1]);
  var maxLng = Math.max(p1[1], p2[1]);

  var width = dst(minLat, minLng, minLat, maxLng);
  var height = dst(minLat, minLng, maxLat, minLng);

  this.minLat = minLat;
  this.minLng = minLng;
  this.verticalScale = height / (maxLat - minLat);
  this.horizontalScale = width / (maxLng - minLng);
  this.walkable = new Walkable(width, height);
}

WorldWalkable.prototype.getXY = function(lat, lng) {
  var x = (lng - this.minLng) * this.horizontalScale;
  var y = (lat - this.minLat) * this.verticalScale;
  return [x, y];
};

WorldWalkable.prototype.getLatLng = function(x, y) {
  var lng = x / this.horizontalScale + this.minLng;
  var lat = y / this.verticalScale + this.minLat;
  return [lat, lng];
};

WorldWalkable.prototype.getVertices = function(latlngs) {
  var vertices = [];
  for (var i = 0; i < latlngs.length; i++) {
    var xy = this.getXY(latlngs[i][0], latlngs[i][1]);
    vertices.push(xy[0], xy[1]);
  }
  return vertices;
};

WorldWalkable.prototype.getPath = function(path) {
  var pathLatLngs = [];
  for (var i = 0; i < path.length; i += 2) {
    var latlng = this.getLatLng(path[i], path[i + 1]);
    pathLatLngs.push(latlng);
  }
  return pathLatLngs;
};

WorldWalkable.prototype.addPolygon = function(latlngs) {
  var vertices = this.getVertices(latlngs);
  return this.walkable.addPolygon(vertices);
};

WorldWalkable.prototype.addPolyline = function(latlngs) {
  var vertices = this.getVertices(latlngs);
  return this.walkable.addPolyline(vertices);
};

WorldWalkable.prototype.removeObstacle = function(obstacle) {
  this.walkable.deleteObstacle(obstacle);
};

WorldWalkable.prototype.findPath = function(startLatlng, endLatlng, radius) {
  var startXY = this.getXY(startLatlng[0], startLatlng[1]);
  var endXY = this.getXY(endLatlng[0], endLatlng[1]);
  var path = this.walkable.findPath(
    startXY[0],
    startXY[1],
    endXY[0],
    endXY[1],
    radius || 0
  );
  return this.getPath(path);
};

module.exports = WorldWalkable;
