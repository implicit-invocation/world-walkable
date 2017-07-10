var Walkable = require('walkable');

var RECT_SIZE = 10;

function getX(lng) {
  return (lng + 180) * (RECT_SIZE / 360);
}

function getLng(x) {
  return x / (RECT_SIZE / 360) - 180;
}

function getLat(y) {
  return (y / (RECT_SIZE / 180) - 90) * -1;
}

function getY(lat) {
  return (lat * -1 + 90) * (RECT_SIZE / 180);
}

function getVertices(latlngs) {
  var vertices = [];
  for (var i = 0; i < latlngs.length; i++) {
    var latlng = latlngs[i];
    vertices.push(getX(latlng[1]), getY(latlng[0]));
  }
  return vertices;
}

function WorldWalkable() {
  this.walkable = new Walkable(RECT_SIZE, RECT_SIZE);
}

WorldWalkable.prototype.addPolygon = function(latlngs) {
  var vertices = getVertices(latlngs);
  return this.walkable.addPolygon(vertices);
};

WorldWalkable.prototype.addPolyline = function(latlngs) {
  var vertices = getVertices(latlngs);
  return this.walkable.addPolyline(vertices);
};

WorldWalkable.prototype.removeObstacle = function(obstacle) {
  this.walkable.deleteObstacle(obstacle);
};

WorldWalkable.prototype.findPath = function(startLatlng, endLatlng) {
  var path = this.walkable.findPath(
    getX(startLatlng[1]),
    getY(startLatlng[0]),
    getX(endLatlng[1]),
    getY(endLatlng[0]),
    0
  );
  var pathLatLngs = [];
  for (var i = 0; i < path.length; i += 2) {
    var x = path[i];
    var y = path[i + 1];
    pathLatLngs.push([getLat(y), getLng(x)]);
  }
  return pathLatLngs;
};

module.exports = WorldWalkable;
