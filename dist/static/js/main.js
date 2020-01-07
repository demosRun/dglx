if (navigator.userAgent.indexOf('WebKit') < 0 || navigator.userAgent.indexOf('Chrome') < 0) {
  document.body.classList.add('no-suport')
}

var setWidth = 1920
var setHeight = 1080
var setScale = setHeight / setWidth
var screenScale = window.innerHeight / window.innerWidth
var boxList = document.getElementsByClassName('auto-zoom-box')

for (var index = 0; index < boxList.length; index++) {
  var element = boxList[index];
  element.style.height = window.innerWidth * setScale + 'px'
}
// 长宽最小比
var gapWidth = window.innerWidth / setWidth
var gapHeight = window.innerHeight / setHeight
var minScale = gapWidth > gapHeight ? gapHeight : gapWidth
var scaleBoxList = document.getElementsByClassName('zoom-box')
for (var index = 0; index < scaleBoxList.length; index++) {
  var element = scaleBoxList[index];
  element.style.transform = 'scale(' + minScale + ', ' + minScale + ')'
}
// 判断横屏还是竖屏
document.body.classList.add(setScale > screenScale ? 'horizontal' : 'vertical')

// 活跃指定的菜单项目
function activeMenu(name) {
  var menuBarList = document.querySelectorAll('.menu-bar li')
  for (var key in menuBarList) {
    if (menuBarList.hasOwnProperty(key)) {
      var element = menuBarList[key];
      element.classList.remove('active')
    }
  }
  document.querySelector('.menu-bar .' + name).classList.add('active')
}

// 隐藏菜单
function hideMenu() {
  document.querySelector('.menu-bar').classList.remove('show')
}


function switchMenu() {
  if (document.querySelector('.menu-bar').classList.contains('show')) {
    document.querySelector('.menu-bar').classList.remove('show')
  } else {
    document.querySelector('.menu-bar').classList.add('show')
  }
}

var isRunning = false

var scrollFunc = function (e) {
  if (isRunning) return
  isRunning = true
  setTimeout(function () {
    isRunning = false
  }, 1500)
  e = e || window.event;  
  if (e.wheelDelta) {  //判断浏览器IE，谷歌滑轮事件               
      if (e.wheelDelta > 0) { //当滑轮向上滚动时  
        if (owo.script[owo.activePage] && owo.script[owo.activePage].before) {
          owo.script[owo.activePage].before()
        }
      }  
      if (e.wheelDelta < 0) { //当滑轮向下滚动时  
        if (owo.script[owo.activePage] && owo.script[owo.activePage].next) {
          owo.script[owo.activePage].next()
        }
      }  
  } else if (e.detail) {  //Firefox滑轮事件  
      if (e.detail> 0) { //当滑轮向下滚动时  
        if (owo.script[owo.activePage] && owo.script[owo.activePage].next) {
          owo.script[owo.activePage].next()
        }
      }  
      if (e.detail< 0) { //当滑轮向上滚动时  
        if (owo.script[owo.activePage] && owo.script[owo.activePage].before) {
          owo.script[owo.activePage].before()
        } 
      }  
  }  
} 
/*IE、Opera注册事件*/
if(document.attachEvent){
  document.attachEvent('onmousewheel',scrollFunc);

}
//Firefox使用addEventListener添加滚轮事件  
if (document.addEventListener) {//firefox  
  document.addEventListener('DOMMouseScroll', scrollFunc, false);  
}  
//Safari与Chrome属于同一类型
window.onmousewheel = document.onmousewheel = scrollFunc; 