

import Vue from "vue";
/** 
 * 给有可能会覆盖到控件的元素添加自定义指令，添加的时候注册，消失的时候取消注册(模型还需要再思考一下)
 * */
// Vue.directive('registerObx', {
//     bind(el, binding, vnode) {
//         // 设置observer的配置选项
//         var config = {
//             childList: true, // 子节点的变动（新增、删除或者更改）
//             attributes: true, // 属性的变动
//             characterData: true, // 节点内容或节点文本的变动
//             subtree: true, // 是否将观察器应用于该节点的所有后代节点
//             attributeFilter: ['class', 'style'], // 观察特定属性
//             attributeOldValue: true, // 观察 attributes 变动时，是否需要记录变动前的属性值
//             characterDataOldValue: true // 观察 characterData 变动，是否需要记录变动前的值
//         }
//         // 当节点发生变化时的需要执行的函数
//         var callback = function (mutationsList, observer) {
//             debugger
//             for (var mutation of mutationsList) {
//                 if (mutation.type == 'childList') {
//                     console.log('A child node has been added or removed.');
//                 }
//                 else if (mutation.type == 'attributes') {
//                     console.log('The ' + mutation.attributeName + ' attribute was modified.');
//                 }
//             }
//         };
//         // 创建一个observer示例与回调函数相关联
//         var observer = new MutationObserver(callback);
//         //使用配置文件对目标节点进行观测
//         observer.observe(el, config);
//     },
//     update(el, binding, vnode, oldVnode) {
//         debugger
//         console.log(getComputedStyle(el)['display'], '@@@@@@@@@@');
//     },
//     unbind(el, binding) {
//         // 解除事件监听
//         document.removeEventListener("click", el.__vueClickOutside__);
//         delete el.__vueClickOutside__;
//     },
//     componentUpdated() {
//         debugger

//     }
// })

const requireClass = require.context("./lib", true, /\.js$/);
requireClass.keys().forEach(className => {
    let { name, control } = requireClass(className).default;
    window[name] = control;
});
