/**
 * 性能优化配置
 */

// 图片处理配置
const imageConfig = {
  // 最大上传尺寸
  maxUploadSize: 10 * 1024 * 1024, // 10MB
  
  // 压缩质量
  compressQuality: 0.8,
  
  // 最大显示宽度
  maxDisplayWidth: 1080,
  
  // 缩略图尺寸
  thumbnailSize: 200,
  
  // 支持的图片格式
  supportedFormats: ['jpg', 'jpeg', 'png', 'webp'],
  
  // 预加载数量
  preloadCount: 3
}

// 渲染优化配置
const renderConfig = {
  // 最大同时渲染的图片数量
  maxConcurrentRender: 5,
  
  // 防抖延迟时间
  debounceDelay: 300,
  
  // 节流间隔时间
  throttleInterval: 100,
  
  // Canvas缓存大小
  canvasCacheSize: 10,
  
  // 是否启用硬件加速
  enableHardwareAcceleration: true,
  
  // 渲染帧率限制
  maxFPS: 60
}

// 内存管理配置
const memoryConfig = {
  // 最大缓存图片数量
  maxCacheImages: 20,
  
  // 内存警告阈值 (MB)
  memoryWarningThreshold: 100,
  
  // 自动清理间隔 (ms)
  autoCleanInterval: 30000,
  
  // 最大历史记录数量
  maxHistoryCount: 10
}

// 网络优化配置
const networkConfig = {
  // 请求超时时间
  timeout: 10000,
  
  // 重试次数
  retryCount: 3,
  
  // 重试间隔
  retryInterval: 1000,
  
  // 并发请求数量限制
  maxConcurrentRequests: 3
}

// 用户体验配置
const uxConfig = {
  // 加载动画延迟显示时间
  loadingDelay: 500,
  
  // 操作反馈延迟时间
  feedbackDelay: 100,
  
  // 自动保存间隔
  autoSaveInterval: 30000,
  
  // 手势识别灵敏度
  gestureSensitivity: 10,
  
  // 最小缩放比例
  minScale: 0.1,
  
  // 最大缩放比例
  maxScale: 5.0
}

// 性能监控配置
const monitorConfig = {
  // 是否启用性能监控
  enabled: true,
  
  // 监控采样率
  sampleRate: 0.1,
  
  // 性能数据上报间隔
  reportInterval: 60000,
  
  // 监控的性能指标
  metrics: [
    'renderTime',
    'imageLoadTime',
    'memoryUsage',
    'operationLatency'
  ]
}

// 获取设备性能等级
const getDevicePerformanceLevel = () => {
  return new Promise((resolve) => {
    wx.getSystemInfo({
      success: (res) => {
        const { platform, model, pixelRatio } = res
        let level = 'medium'
        
        // 根据设备信息判断性能等级
        if (platform === 'ios') {
          // iOS设备性能相对较好
          level = 'high'
        } else if (platform === 'android') {
          // Android设备根据型号判断
          if (model.includes('高端机型关键词')) {
            level = 'high'
          } else if (model.includes('低端机型关键词')) {
            level = 'low'
          }
        }
        
        // 根据像素比调整
        if (pixelRatio >= 3) {
          level = level === 'low' ? 'medium' : 'high'
        }
        
        resolve(level)
      },
      fail: () => resolve('medium')
    })
  })
}

// 根据设备性能调整配置
const getOptimizedConfig = async () => {
  const performanceLevel = await getDevicePerformanceLevel()
  
  const configs = {
    low: {
      ...imageConfig,
      maxDisplayWidth: 720,
      compressQuality: 0.6,
      preloadCount: 1,
      ...renderConfig,
      maxConcurrentRender: 2,
      maxFPS: 30,
      ...memoryConfig,
      maxCacheImages: 10,
      maxHistoryCount: 5
    },
    medium: {
      ...imageConfig,
      ...renderConfig,
      ...memoryConfig
    },
    high: {
      ...imageConfig,
      maxDisplayWidth: 1440,
      compressQuality: 0.9,
      preloadCount: 5,
      ...renderConfig,
      maxConcurrentRender: 8,
      ...memoryConfig,
      maxCacheImages: 30,
      maxHistoryCount: 20
    }
  }
  
  return configs[performanceLevel]
}

// 性能优化工具函数
const performanceUtils = {
  // 图片预加载
  preloadImages: (urls) => {
    return Promise.all(
      urls.slice(0, imageConfig.preloadCount).map(url => {
        return new Promise((resolve) => {
          wx.getImageInfo({
            src: url,
            success: resolve,
            fail: resolve
          })
        })
      })
    )
  },
  
  // 内存清理
  cleanMemory: () => {
    // 清理图片缓存
    wx.clearStorage()
    
    // 触发垃圾回收（如果支持）
    if (typeof wx.triggerGC === 'function') {
      wx.triggerGC()
    }
  },
  
  // 监控内存使用
  monitorMemory: () => {
    if (typeof wx.getPerformance === 'function') {
      const performance = wx.getPerformance()
      const memory = performance.memory
      
      if (memory && memory.usedJSHeapSize > memoryConfig.memoryWarningThreshold * 1024 * 1024) {
        console.warn('Memory usage is high, consider cleaning up')
        performanceUtils.cleanMemory()
      }
    }
  },
  
  // 优化Canvas渲染
  optimizeCanvas: (canvasId) => {
    const context = wx.createCanvasContext(canvasId)
    
    // 启用硬件加速
    if (renderConfig.enableHardwareAcceleration) {
      context.setGlobalCompositeOperation('source-over')
    }
    
    return context
  }
}

module.exports = {
  imageConfig,
  renderConfig,
  memoryConfig,
  networkConfig,
  uxConfig,
  monitorConfig,
  getDevicePerformanceLevel,
  getOptimizedConfig,
  performanceUtils
}