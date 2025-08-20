/**
 * 工具函数库
 */

// 格式化时间
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

// 防抖函数
const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// 节流函数
const throttle = (func, limit) => {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// 图片压缩
const compressImage = (src, quality = 0.8, maxWidth = 1080) => {
  return new Promise((resolve, reject) => {
    const canvas = wx.createCanvasContext('compressCanvas')
    
    wx.getImageInfo({
      src: src,
      success: (res) => {
        const { width, height } = res
        let newWidth = width
        let newHeight = height
        
        // 按比例缩放
        if (width > maxWidth) {
          newWidth = maxWidth
          newHeight = (height * maxWidth) / width
        }
        
        canvas.drawImage(src, 0, 0, newWidth, newHeight)
        canvas.draw(false, () => {
          wx.canvasToTempFilePath({
            canvasId: 'compressCanvas',
            quality: quality,
            success: resolve,
            fail: reject
          })
        })
      },
      fail: reject
    })
  })
}

// 计算两点距离
const getDistance = (p1, p2) => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
}

// 计算角度
const getAngle = (p1, p2) => {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI
}

// 限制数值范围
const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max)
}

// 深拷贝
const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  if (typeof obj === 'object') {
    const clonedObj = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
}

// 生成唯一ID
const generateId = () => {
  return 'id_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

// 检查是否在矩形内
const isPointInRect = (point, rect) => {
  return point.x >= rect.x && 
         point.x <= rect.x + rect.width && 
         point.y >= rect.y && 
         point.y <= rect.y + rect.height
}

// 获取设备信息
const getSystemInfo = () => {
  return new Promise((resolve) => {
    wx.getSystemInfo({
      success: resolve,
      fail: () => resolve({})
    })
  })
}

// 显示加载提示
const showLoading = (title = '加载中...') => {
  wx.showLoading({
    title: title,
    mask: true
  })
}

// 隐藏加载提示
const hideLoading = () => {
  wx.hideLoading()
}

// 显示成功提示
const showSuccess = (title) => {
  wx.showToast({
    title: title,
    icon: 'success',
    duration: 2000
  })
}

// 显示错误提示
const showError = (title) => {
  wx.showToast({
    title: title,
    icon: 'none',
    duration: 2000
  })
}

// 确认对话框
const showConfirm = (content, title = '提示') => {
  return new Promise((resolve) => {
    wx.showModal({
      title: title,
      content: content,
      success: (res) => {
        resolve(res.confirm)
      },
      fail: () => resolve(false)
    })
  })
}

// 保存图片到相册
const saveImageToAlbum = (filePath) => {
  return new Promise((resolve, reject) => {
    wx.saveImageToPhotosAlbum({
      filePath: filePath,
      success: () => {
        showSuccess('保存成功')
        resolve(true)
      },
      fail: (err) => {
        if (err.errMsg.includes('auth deny')) {
          wx.showModal({
            title: '提示',
            content: '需要您授权保存相册',
            showCancel: false,
            confirmText: '去设置',
            success: () => {
              wx.openSetting()
            }
          })
        } else {
          showError('保存失败')
        }
        reject(err)
      }
    })
  })
}

// 检查网络状态
const checkNetworkStatus = () => {
  return new Promise((resolve) => {
    wx.getNetworkType({
      success: (res) => {
        resolve(res.networkType !== 'none')
      },
      fail: () => resolve(false)
    })
  })
}

// 本地存储
const storage = {
  set: (key, value) => {
    try {
      wx.setStorageSync(key, value)
      return true
    } catch (e) {
      console.error('Storage set error:', e)
      return false
    }
  },
  
  get: (key, defaultValue = null) => {
    try {
      const value = wx.getStorageSync(key)
      return value !== '' ? value : defaultValue
    } catch (e) {
      console.error('Storage get error:', e)
      return defaultValue
    }
  },
  
  remove: (key) => {
    try {
      wx.removeStorageSync(key)
      return true
    } catch (e) {
      console.error('Storage remove error:', e)
      return false
    }
  },
  
  clear: () => {
    try {
      wx.clearStorageSync()
      return true
    } catch (e) {
      console.error('Storage clear error:', e)
      return false
    }
  }
}

// 性能监控
const performance = {
  start: (name) => {
    const startTime = Date.now()
    return {
      end: () => {
        const endTime = Date.now()
        const duration = endTime - startTime
        console.log(`Performance [${name}]: ${duration}ms`)
        return duration
      }
    }
  }
}

module.exports = {
  formatTime,
  debounce,
  throttle,
  compressImage,
  getDistance,
  getAngle,
  clamp,
  deepClone,
  generateId,
  isPointInRect,
  getSystemInfo,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  showConfirm,
  saveImageToAlbum,
  checkNetworkStatus,
  storage,
  performance
}