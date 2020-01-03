// Fri Jan 03 2020 09:02:02 GMT+0800 (GMT+08:00)
var owo = {tool: {},state: {},};
/* 方法合集 */
var _owo = {}

/* 运行页面初始化方法 */
_owo.runCreated = function (pageFunction) {
  try {
    // console.log(pageFunction)
    if (pageFunction.show) {
      pageFunction.show.apply(pageFunction)
    }
    if (pageFunction["_isCreated"]) return

    // 确保created事件只被执行一次
    pageFunction._isCreated = true
    
    if (pageFunction.created) {
      pageFunction.created.apply(pageFunction)
    }
    
  } catch (e) {
    console.error(e)
  }
}




// 判断是否为手机
_owo.isMobi = navigator.userAgent.toLowerCase().match(/(ipod|ipad|iphone|android|coolpad|mmp|smartphone|midp|wap|xoom|symbian|j2me|blackberry|wince)/i) != null


_owo._run = function (eventFor, event, newPageFunction) {
  // 复制eventFor防止污染
  var eventForCopy = eventFor
  // 待优化可以单独提出来
  // 取出参数
  var parameterArr = []
  var parameterList = eventForCopy.match(/[^\(\)]+(?=\))/g)
  
  if (parameterList && parameterList.length > 0) {
    // 参数列表
    parameterArr = parameterList[0].split(',')
    // 进一步处理参数
    
    for (var i = 0; i < parameterArr.length; i++) {
      var parameterValue = parameterArr[i].replace(/(^\s*)|(\s*$)/g, "")
      // console.log(parameterValue)
      // 判断参数是否为一个字符串
      
      if (parameterValue.charAt(0) === '"' && parameterValue.charAt(parameterValue.length - 1) === '"') {
        parameterArr[i] = parameterValue.substring(1, parameterValue.length - 1)
      }
      if (parameterValue.charAt(0) === "'" && parameterValue.charAt(parameterValue.length - 1) === "'") {
        parameterArr[i] = parameterValue.substring(1, parameterValue.length - 1)
      }
      // console.log(parameterArr[i])
    }
  }
  eventForCopy = eventFor.replace(/\([\d\D]*\)/, '')
  // console.log(newPageFunction, eventForCopy)
  // 如果有方法,则运行它
  if (newPageFunction && newPageFunction[eventForCopy]) {
    // 绑定window.owo对象
    newPageFunction.$event = event
    newPageFunction.$target = event.target
    newPageFunction[eventForCopy].apply(newPageFunction, parameterArr)
  } else {
    (function (temp) {
      try {return eval(temp)} catch (error) {return undefined}
    }).apply(newPageFunction, [eventFor])
  }
}

_owo.bindEvent = function (eventName, eventFor, tempDom, moudleScript) {
  tempDom['on' + eventName] = function(event) {
    _owo._run(eventFor, event || this, moudleScript)
  }
}

/* owo事件处理 */
// 参数1: 当前正在处理的dom节点
// 参数2: 当前正在处理的模块名称
_owo.handleEvent = function (tempDom, moudleScript, viewName, routeName) {
  if (tempDom.attributes) {
    for (var ind = 0; ind < tempDom.attributes.length; ind++) {
      var attribute = tempDom.attributes[ind]
      // ie不支持startsWith
      var eventFor = attribute.textContent || attribute.value
      // 判断是否为owo的事件
      if (new RegExp("^o-").test(attribute.name)) {
        var eventName = attribute.name.slice(2)
        switch (eventName) {
          case 'tap': {
            // 待优化 可合并
            // 根据手机和PC做不同处理
            if (_owo.isMobi) {
              if (!_owo._event_tap) {console.error('找不到_event_tap方法！'); break;}
              _owo._event_tap(tempDom, eventFor, function (event, eventFor) {
                _owo._run(eventFor, event || this, moudleScript)
              })
            } else _owo.bindEvent('click', eventFor, tempDom, moudleScript)
            break
          }
          case 'show': {
            var eventFor = attribute.textContent || attribute.value
            // 初步先简单处理吧
            var temp = eventFor.replace(/ /g, '')
            function tempRun (temp) {
              return eval(temp)
            }
            if (tempRun.apply(moudleScript, [temp])) {
              tempDom.style.display = ''
            } else {
              tempDom.style.display = 'none'
            }
            break
          }
          case 'html': {
            var temp = eventFor.replace(/ /g, '')
            tempDom.innerHTML = (function (temp) {
              try {
                return eval(temp)
              } catch (error) {
                return undefined
              }
            }).apply(moudleScript, [temp])
            break
          }
          default: {
            _owo.bindEvent(eventName, eventFor, tempDom, moudleScript)
          }
        }
      } else if (attribute.name == 'view') {
        viewName = eventFor
      } else if (attribute.name == 'route') {
        routeName = eventFor
      }
    }
  }
  
  // 判断是否有子节点需要处理
  if (tempDom.children) {
    // 递归处理所有子Dom结点
    for (var i = 0; i < tempDom.children.length; i++) {
      // 获取子节点实例
      var childrenDom = tempDom.children[i]
      // 每个子节点均要判断是否为模块
      const templateName = childrenDom.getAttribute('template')
      if (templateName) {
        // 如果即将遍历进入模块 设置即将进入的模块为当前模块
        // 获取模块的模块名
        if (viewName && routeName) {
          _owo.handleEvent(childrenDom, moudleScript.view[viewName][routeName], viewName, routeName)
        } else {
          _owo.handleEvent(childrenDom, moudleScript.template[templateName], viewName, routeName)
        }
        
      } else {
        _owo.handleEvent(childrenDom, moudleScript, viewName, routeName)
      }
    }
  } else {
    console.info('元素不存在子节点!')
    console.info(tempDom)
  }
}

// 快速选择器
owo.query = function (str) {
  return document.querySelectorAll('.owo[template=' + owo.activePage +'] ' + str)
}

/* 运行页面所属的方法 */
_owo.handlePage = function (newPageFunction, entryDom) {
  /* 判断页面是否有自己的方法 */
  if (!newPageFunction) return
  // console.log(entryDom)
  newPageFunction['$el'] = entryDom
  newPageFunction.$refresh = function () {
    _owo.handleEvent(newPageFunction.$el, newPageFunction)
  }
  // console.log(newPageFunction)
  _owo.runCreated(newPageFunction)
  // debugger
  // 判断页面是否有下属模板,如果有运行所有模板的初始化方法
  for (var key in newPageFunction.template) {
    var templateScript = newPageFunction.template[key]
    var childDom = entryDom.querySelector('[template="' + key +'"]')
    // 判断相关模块是否在存在
    if (!childDom) {continue}
    _owo.handlePage(templateScript, childDom)
  }
  // 判断页面中是否有路由
  for (var viewName in newPageFunction.view) {
    var routeList = newPageFunction.view[viewName]
    var viewDom = entryDom.querySelector('[view="' + viewName +'"] [route]')
    // 判断相关模块是否在存在
    if (!viewDom) {continue}
    routeList[0].$el = viewDom
    viewDom.classList.add('active-route')
    _owo.handlePage(routeList[0], viewDom)
  }
}
/*
 * 传递函数给whenReady()
 * 当文档解析完毕且为操作准备就绪时，函数作为document的方法调用
 */
_owo.ready = (function() {               //这个函数返回whenReady()函数
  var funcs = [];             //当获得事件时，要运行的函数
  
  //当文档就绪时,调用事件处理程序
  function handler(e) {
    //如果发生onreadystatechange事件，但其状态不是complete的话,那么文档尚未准备好
    if(e.type === 'onreadystatechange' && document.readyState !== 'complete') {
      return
    }
    // 确保事件处理程序只运行一次
    if(window.owo.state.isRrady) return
    window.owo.state.isRrady = true
    
    // 运行所有注册函数
    for(var i=0; i<funcs.length; i++) {
      funcs[i].call(document);
    }
    funcs = null;
  }
  //为接收到的任何事件注册处理程序
  if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', handler, false)
    document.addEventListener('readystatechange', handler, false)            //IE9+
    window.addEventListener('load', handler, false)
  } else if(document.attachEvent) {
    document.attachEvent('onreadystatechange', handler)
    window.attachEvent('onload', handler)
  }
  //返回whenReady()函数
  return function whenReady (fn) {
    if (window.owo.state.isRrady) {
      fn.call(document)
    } else {
      funcs.push(fn)
    }
  }
})()

// 单页面-页面资源加载完毕事件
_owo.showPage = function() {
  // 查找入口
  var entryDom = document.querySelector('[template]')
  if (entryDom) {
    owo.entry = entryDom.getAttribute('template')
    owo.activePage = owo.entry
    _owo.handlePage(window.owo.script[owo.activePage], entryDom)
    _owo.handleEvent(entryDom, window.owo.script[owo.activePage])
  } else {
    console.error('找不到页面入口!')
  }
}

// 执行页面加载完毕方法
_owo.ready(_owo.showPage)





// 这是用于代码调试的自动刷新代码，他不应该出现在正式上线版本!
if ("WebSocket" in window) {
  // 打开一个 web socket
  if (!window._owo.ws) window._owo.ws = new WebSocket("ws://" + window.location.host)
  window._owo.ws.onmessage = function (evt) { 
    if (evt.data == 'reload') {
      location.reload()
    }
  }
  window._owo.ws.onclose = function() { 
    console.info('与服务器断开连接')
  }
} else {
  console.error('浏览器不支持WebSocket')
}







function switchPage (oldUrlParam, newUrlParam) {
  var oldPage = oldUrlParam ? oldUrlParam.split('&')[0] : owo.entry
  var newPage = newUrlParam ? newUrlParam.split('&')[0] : owo.entry
  // 查找页面跳转前的page页(dom节点)
  var oldDom = document.querySelector('[template=' + oldPage + ']')
  var newDom = document.querySelector('.owo[template="' + newPage + '"]')
  
  if (!newDom) {
    console.error('页面不存在!')
    return
  }

  if (oldDom) {
    // 隐藏掉旧的节点
    oldDom.style.display = 'none'
  }

  newDom.style.display = 'block'
  // 查找页面跳转后的page
  
  window.owo.activePage = newPage
  // 不可调换位置
  if (!window.owo.script[newPage]._isCreated) {
    _owo.handleEvent(newDom, window.owo.script[newPage])
  }
  // 不可调换位置
  _owo.handlePage(window.owo.script[newPage], newDom)
}