import Storage from "@/utils/sessionStorage";
let watermarkOption = {}
let watermarkSetInterval = null
let id = null
let div = null
let zIndex = 10000
let content = Storage.get('username')

let setWatermarkContent = () => {
    id = '1.23452384164.123412415'
    if (document.getElementById(id) !== null) {
        document.body.removeChild(document.getElementById(id))
    }
    
    let ele = document.createElement('canvas')
    ele.width = 250
    ele.height = 125
    
    let getCanvas = ele.getContext('2d')
    getCanvas.rotate(-12 * Math.PI / 180)
    getCanvas.font = '15px Vedana'
    getCanvas.fillStyle = 'rgba(200, 200, 200, 0.25)'
    getCanvas.textAlign = 'center'
    getCanvas.textBaseline = 'Middle'
    getCanvas.fillText(new Date().format("YYYY/MM/DD"),ele.width/3, ele.height / 1.5)
    getCanvas.fillText(content, ele.width/3, ele.height /2.5)
    div = document.createElement('div')
    div.id = id
    div.style.pointerEvents = 'none'
    div.style.top = '50px'    // 水印距离 上边的距离
    div.style.left = '0px'  // 水印距离 左边的距离
    div.style.position = 'fixed'
    div.style.zIndex = zIndex
    div.style.width =  document.documentElement.clientWidth-32+ 'px'    // 生成水印画布大小的宽度
    div.style.height = document.documentElement.clientHeight+ 'px'  // 生成水印画布大小的高度
    div.style.background = 'url(' + ele.toDataURL('image/png') + ') left top repeat'
    document.body.appendChild(div)
}
    
// 该方法只允许调用一次
watermarkOption.set = () => {
    setWatermarkContent()
    watermarkSetInterval = setInterval(() => {
        if (document.getElementById(id) === null) {
            setWatermarkContent()
        }
    }, 500)
    window.addEventListener("resize", watermarkOption.resize, true);
}
watermarkOption.resize = () => {
    setWatermarkContent()
}
//清除水印
watermarkOption.clear = () => {
    if(watermarkSetInterval){
        window.clearInterval(watermarkSetInterval)
        window.removeEventListener("resize", watermarkOption.resize, true);
        watermarkSetInterval = null
        if (document.getElementById(id) !== null) {
            document.body.removeChild(document.getElementById(id))
        }
    }
}
//提高水印index
watermarkOption.index = (index) => {
    div.style.zIndex = index
    zIndex = index
}
export default watermarkOption