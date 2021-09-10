const utils = require('./utils');
const event = require('./event');

function getConnectStatus() {
  return window.navigator.onLine ? true : false
}

/**
 * 网络速度测试类
 */
function NetSpeedTest(options) {
  this.options = options ?? {}
  this.times = this.options.times ?? 5

  this.timeout = this.options.timeout ?? 60000
  this.defaultSize = 90
  this.defaultImg = 'https://static.uskid.com/uskid-official-site/static/aboutus-3.4be98053.jpg'

  this.speedIntervalTimer = null
  this.networkIntervalTimer = null
  this.speedStatus = null
  this.speed = 0
  this.speedInterval = this.options.speedInterval ?? 5000
  this.reconnectCount = 0
  this.maxReconnectCount = this.timeout / this.speedInterval

  this.onChange = () => {
    console.log(this.speed)
  }
}

NetSpeedTest.prototype.startMonitor = function() {
  this.initRealTimeMonitor()
  this.startSpeed()
}

NetSpeedTest.prototype.endSpeed = function() {
  clearInterval(this.speedIntervalTimer)
  this.speedIntervalTimer = null
}

NetSpeedTest.prototype.endNetMonitor = function() {
  clearInterval(this.networkIntervalTimer)
  this.networkIntervalTimer = null
}

NetSpeedTest.prototype.disconnect = function() {
  event.dispatchEvent('disconnect')
  console.log('reconnectCount: ', this.reconnectCount)
  this.reconnectCount += 1

  // 默认重连接
  this.startSpeed()
  if (this.reconnectCount > this.maxReconnectCount) {
    this.endSpeed()
    this.endNetMonitor()
  }
}

NetSpeedTest.prototype.startSpeed = function() {
  console.log('startSpeed: ')
  this.endSpeed()
  if (getConnectStatus()) {
    this.speedIntervalTimer = setInterval(() => {
      if (getConnectStatus()) {
        this.testWithAjax()
      }
    }, this.speedInterval)
  }
}

NetSpeedTest.prototype.initRealTimeMonitor = function() {
  event.dispatchEvent('init-monitor')
  
  this.networkIntervalTimer = setInterval(() => {
    if (!getConnectStatus()) {
      console.log('断网重连接')
      this.disconnect()
    }
  }, this.speedInterval * 2)
}

/**
 * 设置网速值
 * @param {string} source // image | ajax | downlink | net
 * @param {number} speed 
 */
NetSpeedTest.prototype.setNetSpeed = function (source, speed) {
  // console.log(source, '  ======  ', speed)
  this.speed = speed
  this.setNetSpeedStatus(speed)
  this.onChange(speed)
  event.dispatchEvent('change-net-speed', this.speed)
  event.dispatchEvent('change-net-speed-status', this.speedStatus)
}

NetSpeedTest.prototype.setNetSpeedStatus = function (speed) {
  if (speed > 300) {
    this.speedStatus = 5
  } else if (speed > 200 && speed <= 300) {
    this.speedStatus = 4
  } else if (speed > 100 && speed <= 200) {
    this.speedStatus = 3
  } else if (speed > 50 && speed <= 100) {
    this.speedStatus = 2
  } else if (speed > 0 && speed <= 50) {
    this.speedStatus = 1
  } else {
    this.speedStatus = 0
  }
  return this.speedStatus
}

/**
 * 通过加载图片的方式判断当前的网络速度
 * @param {string} imgUrl 
 * @param {number} fileSize 
 * @returns 
 */
NetSpeedTest.prototype.testWithImage = function (imgUrl, fileSize) {
  const size = fileSize ?? this.defaultSize; // kb

  return new Promise((resolve, reject) => {
    let start = null;
    let end = null;
    let img = document.createElement('img');
    start = new Date().getTime();
    img.onload = (e) => {
      end = new Date().getTime();
      const speed = utils.calculateSpeed(size, start, end)
      this.setNetSpeed('image', speed)
      resolve(speed);
    }
    img.src = imgUrl ?? utils.getNewUrl(this.defaultImg);
  }).catch(err => { throw err });
}

/**
 * 通过 ajax 的方式判断当前的网络速度
 * @param {string} url 
 * @returns 
 */
NetSpeedTest.prototype.testWithAjax = function (url) {
  return new Promise((resolve, reject) => {
    let start = null;
    let end = null;
    let fileSize = 0;
    start = new Date().getTime();
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        end = new Date().getTime();
        // 获取字节大小
        fileSize = xhr.getResponseHeader('Content-Length');
        // fileSize = xhr.responseText.length;
        const speed = utils.calculateSpeed(utils.convertBytesToKb(fileSize), start, end)
        this.setNetSpeed('ajax',speed)
        resolve(speed);
      }
    }
    xhr.open('GET', url ?? utils.getNewUrl(this.defaultImg));
    xhr.send();
  }).catch(err => { throw err });
}

/**
 * 通过 h5 api 
 * @returns number
 */
NetSpeedTest.prototype.testWithDownlink = function () {
  const connection = window.navigator.connection;
  let speed = 0
  if (connection && connection.downlink) {
    // 获取 mps 大小
    speed = utils.convertMbpsToKb(connection.downlink)
  }
  this.setNetSpeed('downlink', speed)
  return speed
}

NetSpeedTest.prototype.netSpeed = function () {
  const arr = [];
  for (let i = 0; i < this.times; i++) {
    arr.push(this.testWithAjax());
  }
  return Promise.all(arr).then(speeds => {
    console.log('speeds: ', speeds)
    let sum = 0;
    speeds.forEach(speed => {
      sum += speed;
    });

    this.setNetSpeed('net', sum / this.times)
    return sum / this.times;
  })
}

module.exports = NetSpeedTest
