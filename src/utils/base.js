export default {
    name: "Base",

    /**
     * 判断是否为空
     * @param {string} value 字符串
     * @return {boolean}
     */
    isEmpty(value) {
        if (typeof value == "string") {
            return value.trim() === "";
        }
        return value === null || value === undefined;
    },

    /**
     * key mirror
     * @param {Object} obj 对象
     * @return {Object}
     */
    keyMirror(obj) {
        let ret = {};
        let key;
        for (key in obj) {
            if (!obj.hasOwnProperty(key)) {
                continue;
            }
            ret[key] = key;
        }
        return ret;
    },

    /**
     * 载入 JS 文件
     * @param {string} url JS URL
     */
    loadScript(url) {
        const httpReq = new XMLHttpRequest();

        httpReq.open("GET", url, true);
        httpReq.send(null);
    },

    /**
     * 转换string中的html标签
     * @param {string}
     * @return {string}
     */
    escapeChars(str) {
        str = str.replace(/&/g, "&amp;");
        str = str.replace(/</g, "&lt;");
        str = str.replace(/>/g, "&gt;");
        str = str.replace(/'/g, "&acute;");
        str = str.replace(/"/g, "&quot;");
        str = str.replace(/\|/g, "&brvbar;");
        return str;
    },

    /**
     *  数字 保留n位小数并格式化输出（不足的部分补0）
     *  */
    formatFloat(value, n) {
        var f = Math.round(value * Math.pow(10, n)) / Math.pow(10, n);
        var s = f.toString();
        var rs = s.indexOf(".");
        if (rs < 0) {
            s += ".";
        }
        for (var i = s.length - s.indexOf("."); i <= n; i++) {
            s += "0";
        }
        return s;
    },

    /**
     *  下载文件方法
     *  */
    download(url, filename) {
        var $a = document.createElement("a");
        $a.setAttribute("href", url);
        $a.setAttribute("download", filename);
        $a.setAttribute("target", "_self");

        var evObj = document.createEvent("MouseEvents");
        evObj.initMouseEvent(
            "click",
            true,
            true,
            window,
            0,
            0,
            0,
            0,
            0,
            false,
            false,
            true,
            false,
            0,
            null
        );
        $a.dispatchEvent(evObj);
    },
    /**
     * 表格固定表头，获取表格高度
     */
    getTableHeight(...refNames) {
        let height = document.body.clientHeight;
        let headerHeight = document.getElementById("header-bar-box")
            ? document.getElementById("header-bar-box").clientHeight
            : 48;
        let tableHeight = height - headerHeight;
        if (refNames.length > 1 && refNames[0] === true) {
            let className = "." + refNames[1] + " .el-tabs__header";
            let ele = document.querySelector(className);
            let h = 0;
            h = ele.offsetHeight;
            h = Math.ceil(h);
            tableHeight = tableHeight - h;
            refNames.splice(0, 2);
        }

        for (var refName of refNames) {
            let h = 0;
            if (this.$refs[refName]) {
                h =
                    this.$refs[refName].offsetHeight ||
                    this.$refs[refName].$el.offsetHeight;
            }
            tableHeight = tableHeight - h;
        }
        return tableHeight;
    },
    /**
     * toFlatArray
     * @description: 将树的数据扁平化处理
     * @param {Array} tree 树的全数据
     * @param {String} parentId 父节点属性名
     * @param {String} childrenId 子节点属性名
     * @return 返回符合过滤条件的扁平化数组
     */
    toFlatArray(tree, parentId = "parentId", childrenId = "children") {
        return tree.reduce((t, _) => {
            const child = _[childrenId];
            return [
                ...t,
                parentId ? { ..._, parentId } : _,
                ...(child && child.length
                    ? this.toFlatArray(child, parentId, childrenId)
                    : []),
            ];
        }, []);
    },
    xhrPullFile(url, cb) {
        return new Promise((resolve) => {
            let xhrMsg = {
                status: null,
                msg: "",
            };
            const xhr = new window.XMLHttpRequest();
            xhr.responseType = "blob";
            xhr.onload = () => {
                xhrMsg = {
                    status: "success",
                    msg: xhr.response,
                };
                cb(xhrMsg);
                resolve();
            };
            xhr.onerror = (e) => {
                xhrMsg = {
                    status: "error",
                    msg: e,
                };
                cb(xhrMsg);
                resolve();
            };
            xhr.addEventListener("progress", (e) => {
                let progress = parseInt((e.loaded / e.total) * 100);
                xhrMsg = {
                    status: "progress",
                    msg: progress,
                };
                cb(xhrMsg);
            });
            xhr.open("GET", url, true);
            xhr.send();
            xhrMsg = {
                status: "begin",
                msg: xhr,
            };
            cb(xhrMsg);
        });
    },
};
