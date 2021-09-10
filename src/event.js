const eventPool = []

function customEvent(name, detail) {
  return new CustomEvent(name, {
    detail,
    bubbles: true,//是否冒泡 回调函数中调用，e.stopPropagation();可以阻止冒泡
    cancelable: false,//是否可以取消  为true时，event.preventDefault();才可以阻止默认动作行为
  })
}

function dispatchEvent(eventType, eventData) {
  document.dispatchEvent(customEvent(eventType, eventData))
  // if (!eventPool.includes(eventType)) {
  //   eventPool.push(eventType)
  //   document.dispatchEvent(customEvent(eventType, eventData))
  // } else {
  //   console.log(`${eventType} 重复注册`)
  // }
}

module.exports = {
  customEvent,
  dispatchEvent,
}