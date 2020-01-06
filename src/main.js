// 活跃指定的菜单项目
function activeMenu(name) {
  const menuBarList = document.querySelectorAll('.menu-bar li')
  for (const key in menuBarList) {
    if (menuBarList.hasOwnProperty(key)) {
      const element = menuBarList[key];
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
