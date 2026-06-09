// import WebGLVectorLayerRenderer from "ol/renderer/webgl/VectorLayer.js";
// import { packColor } from "ol/renderer/webgl/shaders.js";
// import Layer from "ol/layer/Layer.js";

// class WebGLLayer extends Layer {
//     createRenderer() {
//         return new WebGLVectorLayerRenderer(this, {
//             fill: {
//                 attributes: {
//                     color: function () {
//                         return packColor('red');
//                     },
//                     opacity: function() {
//                         return 1;
//                     }
//                 }
//             },
//             stroke: {
//                 attributes: {
//                     color: function (feature) {
//                         let color = 'red';
//                         if (feature.drawStyle) {
//                             color = feature.drawStyle.color;
//                         }
//                         return packColor(color);
//                     },
//                     width: function (feature) {
//                         let width = 3;

//                         if (feature.drawStyle) {
//                             width = feature.drawStyle.width;
//                         };
//                         return width;
//                     },
//                     opacity: function(feature) {
//                         return 1;
//                     }
//                 }
//             }
//         });
//     }
// }

// export { WebGLLayer };
