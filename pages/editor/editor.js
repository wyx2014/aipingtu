// editor.js
const app = getApp()

Page({
  data: {
    canvasWidth: 300,
    canvasHeight: 400,
    photoItems: [],
    remainingPhotos: [],
    selectedItemIndex: -1,
    
    // 滤镜相关
    showFilterModal: false,
    currentFilter: 'none',
    filters: [
      { name: 'none', label: '原图', style: 'background: linear-gradient(45deg, #ff6b6b, #4ecdc4);' },
      { name: 'vintage', label: '复古', style: 'background: linear-gradient(45deg, #d4a574, #8b4513); filter: sepia(0.5);' },
      { name: 'bw', label: '黑白', style: 'background: linear-gradient(45deg, #666, #ccc); filter: grayscale(1);' },
      { name: 'warm', label: '暖色', style: 'background: linear-gradient(45deg, #ff9a56, #ff6b35); filter: hue-rotate(30deg);' },
      { name: 'cool', label: '冷色', style: 'background: linear-gradient(45deg, #74b9ff, #0984e3); filter: hue-rotate(-30deg);' }
    ],
    
    // 文字相关
    showTextModal: false,
    textContent: '',
    textColor: '#000000',
    textSize: 40,
    textColors: ['#000000', '#ffffff', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b'],
    
    // 加载状态
    isLoading: false,
    loadingText: '处理中...',
    
    // 触摸相关
    touchStartX: 0,
    touchStartY: 0,
    isDragging: false,
    isResizing: false,
    isRotating: false
  },

  onLoad() {
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync()
    const canvasWidth = Math.min(systemInfo.windowWidth - 60, 300)
    const canvasHeight = Math.floor(canvasWidth * 4 / 3)
    
    this.setData({
      canvasWidth,
      canvasHeight
    })
    
    // 初始化画布和照片
    this.initCanvas()
    this.loadPhotos()
  },

  // 初始化画布
  initCanvas() {
    const ctx = wx.createCanvasContext('puzzleCanvas', this)
    this.canvasContext = ctx
    
    // 设置画布背景
    ctx.setFillStyle('#ffffff')
    ctx.fillRect(0, 0, this.data.canvasWidth, this.data.canvasHeight)
    ctx.draw()
  },

  // 加载照片
  loadPhotos() {
    const selectedPhotos = app.globalData.selectedPhotos || []
    const template = app.globalData.currentTemplate
    
    if (selectedPhotos.length === 0) {
      wx.showToast({
        title: '没有选择照片',
        icon: 'none'
      })
      return
    }
    
    // 根据模板自动布局照片
    this.autoLayoutPhotos(selectedPhotos, template)
  },

  // 自动布局照片
  autoLayoutPhotos(photos, template) {
    const photoItems = []
    const remainingPhotos = [...photos]
    
    if (template && template.cells) {
      // 根据模板布局
      const cellCount = Math.min(template.cells.length, photos.length)
      
      for (let i = 0; i < cellCount; i++) {
        const cell = template.cells[i]
        const photo = photos[i]
        
        // 解析模板样式
        const width = this.parseStyleValue(cell.style, 'width', this.data.canvasWidth)
        const height = this.parseStyleValue(cell.style, 'height', this.data.canvasHeight)
        
        photoItems.push({
          id: `photo_${i}`,
          src: photo,
          x: (this.data.canvasWidth - width) / 2 + i * 10, // 简单偏移避免重叠
          y: (this.data.canvasHeight - height) / 2 + i * 10,
          width: width,
          height: height,
          rotation: 0,
          selected: false,
          zIndex: i
        })
        
        remainingPhotos.shift()
      }
    } else {
      // 默认布局
      photos.forEach((photo, index) => {
        const size = Math.min(this.data.canvasWidth, this.data.canvasHeight) / 3
        photoItems.push({
          id: `photo_${index}`,
          src: photo,
          x: 50 + (index % 3) * (size + 10),
          y: 50 + Math.floor(index / 3) * (size + 10),
          width: size,
          height: size,
          rotation: 0,
          selected: false,
          zIndex: index
        })
      })
    }
    
    this.setData({
      photoItems,
      remainingPhotos
    })
  },

  // 解析样式值
  parseStyleValue(style, property, baseValue) {
    const regex = new RegExp(`${property}:\\s*(\\d+)%`)
    const match = style.match(regex)
    if (match) {
      return (parseInt(match[1]) / 100) * baseValue
    }
    return baseValue / 4 // 默认值
  },

  // 照片触摸开始
  onPhotoTouchStart(e) {
    const index = e.currentTarget.dataset.index
    const touch = e.touches[0]
    
    // 选中当前照片
    this.selectPhoto(index)
    
    this.setData({
      touchStartX: touch.clientX,
      touchStartY: touch.clientY,
      isDragging: true
    })
  },

  // 照片触摸移动
  onPhotoTouchMove(e) {
    if (!this.data.isDragging || this.data.selectedItemIndex === -1) return
    
    const touch = e.touches[0]
    const deltaX = touch.clientX - this.data.touchStartX
    const deltaY = touch.clientY - this.data.touchStartY
    
    const photoItems = [...this.data.photoItems]
    const item = photoItems[this.data.selectedItemIndex]
    
    item.x += deltaX
    item.y += deltaY
    
    this.setData({
      photoItems,
      touchStartX: touch.clientX,
      touchStartY: touch.clientY
    })
  },

  // 照片触摸结束
  onPhotoTouchEnd() {
    this.setData({
      isDragging: false
    })
  },

  // 选中照片
  selectPhoto(index) {
    const photoItems = [...this.data.photoItems]
    
    // 取消所有选中状态
    photoItems.forEach(item => item.selected = false)
    
    // 选中当前照片
    if (index >= 0 && index < photoItems.length) {
      photoItems[index].selected = true
    }
    
    this.setData({
      photoItems,
      selectedItemIndex: index
    })
  },

  // 添加照片到画布
  addPhotoToCanvas(e) {
    const src = e.currentTarget.dataset.src
    const photoItems = [...this.data.photoItems]
    const remainingPhotos = [...this.data.remainingPhotos]
    
    // 从剩余照片中移除
    const index = remainingPhotos.indexOf(src)
    if (index > -1) {
      remainingPhotos.splice(index, 1)
    }
    
    // 添加到画布
    const newItem = {
      id: `photo_${Date.now()}`,
      src: src,
      x: this.data.canvasWidth / 2 - 50,
      y: this.data.canvasHeight / 2 - 50,
      width: 100,
      height: 100,
      rotation: 0,
      selected: true,
      zIndex: photoItems.length
    }
    
    // 取消其他选中状态
    photoItems.forEach(item => item.selected = false)
    photoItems.push(newItem)
    
    this.setData({
      photoItems,
      remainingPhotos,
      selectedItemIndex: photoItems.length - 1
    })
  },

  // 删除照片项
  deletePhotoItem(e) {
    const index = e.currentTarget.dataset.index
    const photoItems = [...this.data.photoItems]
    const remainingPhotos = [...this.data.remainingPhotos]
    
    if (index >= 0 && index < photoItems.length) {
      const item = photoItems[index]
      remainingPhotos.push(item.src)
      photoItems.splice(index, 1)
      
      this.setData({
        photoItems,
        remainingPhotos,
        selectedItemIndex: -1
      })
    }
  },

  // 添加文字
  addText() {
    this.setData({
      showTextModal: true,
      textContent: '',
      textColor: '#000000',
      textSize: 40
    })
  },

  // 文字输入
  onTextInput(e) {
    this.setData({
      textContent: e.detail.value
    })
  },

  // 选择文字颜色
  selectTextColor(e) {
    this.setData({
      textColor: e.currentTarget.dataset.color
    })
  },

  // 文字大小改变
  onTextSizeChange(e) {
    this.setData({
      textSize: e.detail.value
    })
  },

  // 确认添加文字
  confirmAddText() {
    if (!this.data.textContent.trim()) {
      wx.showToast({
        title: '请输入文字内容',
        icon: 'none'
      })
      return
    }
    
    const photoItems = [...this.data.photoItems]
    
    // 添加文字项
    const textItem = {
      id: `text_${Date.now()}`,
      type: 'text',
      content: this.data.textContent,
      x: this.data.canvasWidth / 2 - 50,
      y: this.data.canvasHeight / 2,
      width: 100,
      height: 40,
      color: this.data.textColor,
      fontSize: this.data.textSize,
      rotation: 0,
      selected: true,
      zIndex: photoItems.length
    }
    
    // 取消其他选中状态
    photoItems.forEach(item => item.selected = false)
    photoItems.push(textItem)
    
    this.setData({
      photoItems,
      selectedItemIndex: photoItems.length - 1,
      showTextModal: false
    })
  },

  // 关闭文字模态框
  closeTextModal() {
    this.setData({
      showTextModal: false
    })
  },

  // 应用滤镜
  applyFilter() {
    this.setData({
      showFilterModal: true
    })
  },

  // 选择滤镜
  selectFilter(e) {
    const filter = e.currentTarget.dataset.filter
    this.setData({
      currentFilter: filter,
      showFilterModal: false
    })
    
    // 这里可以实现滤镜效果
    wx.showToast({
      title: `已应用${this.data.filters.find(f => f.name === filter).label}滤镜`,
      icon: 'success'
    })
  },

  // 关闭滤镜模态框
  closeFilterModal() {
    this.setData({
      showFilterModal: false
    })
  },

  // 调整背景
  adjustBackground() {
    wx.showActionSheet({
      itemList: ['白色背景', '透明背景', '渐变背景', '自定义颜色'],
      success: (res) => {
        const backgrounds = ['#ffffff', 'transparent', 'linear-gradient(45deg, #ff6b6b, #4ecdc4)', '#custom']
        const selected = backgrounds[res.tapIndex]
        
        if (selected === '#custom') {
          // 这里可以打开颜色选择器
          wx.showToast({
            title: '自定义颜色功能开发中',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: '背景已更改',
            icon: 'success'
          })
        }
      }
    })
  },

  // 保存拼图
  savePuzzle() {
    this.setData({
      isLoading: true,
      loadingText: '正在保存...'
    })
    
    // 绘制最终图片
    this.drawFinalImage().then(() => {
      wx.canvasToTempFilePath({
        canvasId: 'puzzleCanvas',
        success: (res) => {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              wx.showToast({
                title: '保存成功',
                icon: 'success'
              })
            },
            fail: () => {
              wx.showToast({
                title: '保存失败',
                icon: 'none'
              })
            },
            complete: () => {
              this.setData({
                isLoading: false
              })
            }
          })
        },
        fail: () => {
          this.setData({
            isLoading: false
          })
          wx.showToast({
            title: '生成图片失败',
            icon: 'none'
          })
        }
      }, this)
    })
  },

  // 绘制最终图片
  drawFinalImage() {
    return new Promise((resolve) => {
      const ctx = this.canvasContext
      
      // 清空画布
      ctx.setFillStyle('#ffffff')
      ctx.fillRect(0, 0, this.data.canvasWidth, this.data.canvasHeight)
      
      // 按z-index排序绘制所有元素
      const sortedItems = [...this.data.photoItems].sort((a, b) => a.zIndex - b.zIndex)
      
      let loadedCount = 0
      const totalCount = sortedItems.filter(item => !item.type).length
      
      if (totalCount === 0) {
        ctx.draw(false, resolve)
        return
      }
      
      sortedItems.forEach((item) => {
        if (item.type === 'text') {
          // 绘制文字
          ctx.save()
          ctx.translate(item.x + item.width / 2, item.y + item.height / 2)
          ctx.rotate(item.rotation * Math.PI / 180)
          ctx.setFillStyle(item.color)
          ctx.setFontSize(item.fontSize)
          ctx.fillText(item.content, -item.width / 2, 0)
          ctx.restore()
        } else {
          // 绘制图片
          ctx.save()
          ctx.translate(item.x + item.width / 2, item.y + item.height / 2)
          ctx.rotate(item.rotation * Math.PI / 180)
          ctx.drawImage(item.src, -item.width / 2, -item.height / 2, item.width, item.height)
          ctx.restore()
          
          loadedCount++
          if (loadedCount === totalCount) {
            ctx.draw(false, resolve)
          }
        }
      })
    })
  },

  // 返回
  goBack() {
    wx.navigateBack()
  }
})