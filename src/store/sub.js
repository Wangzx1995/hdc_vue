import store from "@/store";

function getAttr(params, obj) {
    let getSingle = (param, obj) => {
        return obj[param];
    };
    let value;
    let tempObj = deepCopy(obj);
    for (let i = 0; i <= params.length - 1; i++) {
        if (i !== params.length - 1 && tempObj[params[i]] instanceof Object && tempObj[params[i]] !== null) {
            tempObj = getSingle(params[i], tempObj);
        } else if (i === params.length - 1) {
            value = getSingle(params[i], tempObj);
        } else {
            value = "_404_";
            break;
        }
    }
    return value;
}
/**
 * @description 引入sub类是为了解决如下场景带来的问题，
 * 由于权限控制使用的是vuex，但是获取权限需要去向后台请求接口，请求接口之后再进行commit，这一步通常放在hearbar组件中（这里有待考究，不知道有没有更好的方案，暂时想不出来）
 * 而由于某些业务场景需要依赖具体权限--比如存储化时间，自定义指令设置组件pickoption的步骤放在了bind指令中，完全有可能去拿vuex里的数据的时候，数据还没返回，这个时候就需要
 * 发布订阅来实现。
 * @promise 约定属性为null表示暂未请求成功（后面可以自行修改，默认为null）;其他情况均为请求成功（包括undefind）
 *  */

class sub {
    /**
     * @function  commitSub   提交订阅(静态方法)
     * @param { Function }  fn 需要调用的函数
     * @param { Object } context  执行上下文
     * @param { Array } arg 函数执行参数
     *  -----------------------前三个是函数参数
     * @param { String } subName 需要订阅的字段 xx || xx.xx || xx.xx.xx
     * @param { String } commitName 执行发布指令的commitName
     * @param { All }  subValue 订阅字段的初始值，默认null,不能设置为_404_
     * -----------------------后三个是订阅参数
     *  */
    static commitSub(fn, context, arg, subName, commitName, subValue = null) {
        if (!fn instanceof Function) {
            return;
        }
        if (typeof subName !== "string") {
            return;
        }

        let params = subName.split(".");
        let value = getAttr(params, store.state.configView);
        if (value === "_404_") {
            return;
        }
        //如果和设定的订阅值相等，说明后台没有数据返回,则发布订阅
        if (value === subValue) {
            let _fn = fn.bind(context, ...arg);
            sub.subs[commitName] ? sub.subs[commitName].push(_fn) : (sub.subs[commitName] = [_fn]);
        }
        //不相等说明不需要订阅，直接执行即可
        else {
            fn.apply(context, arg);
        }
    }
}
/* 静态对象，发布订阅的载体 */
sub.subs = {};
export default sub;
