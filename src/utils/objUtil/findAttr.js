
/**
 * 
 * 查找数组里对象是否有某个特定的属性
 * 举例: [{}] 中查找name = 1 的对象
 * @params return {ifhave:boolean,nodeList:Array}
 *  */
function findAttr (listArray, attrName, attrvalue) {
    if(!listArray){
        return { ifHave: false, nodeList: [] }
    }
    let tempList = deepCopy(listArray);
    let list = [];
    keysToArray(list, tempList);
    let res = list.filter((item) => {
        return item[attrName] === attrvalue;
    });
    return { ifHave: res.length !== 0, nodeList: res }
}
function keysToArray(arrayList, listObj) {
    listObj.forEach((item) => {
        arrayList.push(item);
        if (item.children && item.children.length > 0) {
            keysToArray(arrayList, item.children);
        }
    })
}

/**
 * 
 * @description 两个对象，后一个对象覆盖前一个对象里的属性,如果前者有属性为null，赋值变成undifend,不改变对象引用指针,不考虑原型上的属性
 * @param {Object,Object} 
 * 
 *  */
function coverAttr(oldObj, newObj) {
    if (!oldObj instanceof Object || !newObj instanceof Object) {
        return;
    }
    let tempObj = JSON.parse(JSON.stringify(newObj));
    let oldKeyList = Object.keys(oldObj);
    Object.keys(newObj).forEach((key) => {
        if (!oldKeyList.includes(key)) {
            delete tempObj[key];
        }
    })
    Object.assign(oldObj, tempObj);
    Object.keys(oldObj).forEach((key) => {
        if (oldObj[key] === null) {
            oldObj[key] = undefined
        }
    });
}
export {
    findAttr,
    coverAttr,
}

