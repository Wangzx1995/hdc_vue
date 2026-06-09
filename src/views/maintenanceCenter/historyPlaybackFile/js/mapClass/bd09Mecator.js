import { Projection, addProjection, addCoordinateTransforms } from "ol/proj";
var projzh = require("projzh");

var bd09Mecator = new Projection({
    code: "BD-09",
    // extent: [-20037726.37, -11708041.66, 20037726.37, 12474104.17],
    // extent: [-20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244],
    // extent: applyTransform(extent, projzh.ll2bmerc),
    units: "m",
    // global:true
});

addProjection(bd09Mecator);
addCoordinateTransforms("EPSG:4326", bd09Mecator, projzh.ll2bmerc, projzh.bmerc2ll);
addCoordinateTransforms("EPSG:3857", bd09Mecator, projzh.smerc2bmerc, projzh.bmerc2smerc);

export default bd09Mecator;
