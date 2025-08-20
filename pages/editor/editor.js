// editor.js
const app = getApp()

Page({
  data: {
    canvasWidth: 300,
    canvasHeight: 400,
    gridCells: [],
    currentTemplate: null,
    remainingPhotos: [],
    draggingCell: -1,
    dragOverCell: -1,
    touchStartTime: 0,
    lastTapTime: 0, // 用于双击检测
    
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
    
    // 图片裁剪相关
    showCropModal: false,
    cropImageSrc: '',
    cropCellIndex: -1,
    cropX: 0,
    cropY: 0,
    cropWidth: 100,
    cropHeight: 100,
    imageWidth: 0,
    imageHeight: 0,
    cropScale: 1,
    originalCropWidth: 100,
    originalCropHeight: 100,
    
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

  async onLoad() {
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync()
    const canvasWidth = systemInfo.windowWidth - 60
    const canvasHeight = canvasWidth
    
    this.setData({
      canvasWidth,
      canvasHeight
    })
    
    // 初始化画布和照片
    await this.initCanvas()
    this.loadPhotos()
  },

  // 初始化画布
  async initCanvas() {
    const query = wx.createSelectorQuery().in(this)
    const canvas = await new Promise((resolve) => {
      query.select('#puzzleCanvas')
        .fields({ node: true, size: true })
        .exec((res) => {
          resolve(res[0])
        })
    })
    
    const canvasNode = canvas.node
    const ctx = canvasNode.getContext('2d')
    
    // 设置canvas实际尺寸（提高清晰度）- 使用更高的分辨率倍数
    const dpr = wx.getSystemInfoSync().pixelRatio
    const scaleFactor = Math.max(dpr, 2) * 2 // 进一步提高分辨率
    canvasNode.width = this.data.canvasWidth * scaleFactor
    canvasNode.height = this.data.canvasHeight * scaleFactor
    ctx.scale(scaleFactor, scaleFactor)
    
    // 设置高质量渲染选项
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    
    this.canvasNode = canvasNode
    this.canvasContext = ctx
    this.scaleFactor = scaleFactor
    
    // 设置画布背景
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, this.data.canvasWidth, this.data.canvasHeight)
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
    
    // 初始化九宫格数据
    this.initGridLayout(selectedPhotos, template)
  },

  // 初始化九宫格布局
  initGridLayout(photos, template) {
    const gridCells = []
    
    // 设置当前模板
    this.setData({
      currentTemplate: template || { gridClass: 'grid-3x3', cells: [] }
    })
    
    // 创建九宫格格子
    const cellCount = template && template.cells ? template.cells.length : 9
    
    for (let i = 0; i < cellCount; i++) {
      const cell = template && template.cells ? template.cells[i] : {}
      const photo = photos[i] || null
      
      gridCells.push({
        index: i,
        class: cell.class || '',
        photoSrc: photo,
        originalPhotoSrc: photo // 保存原始图片路径
      })
    }
    
    // 计算剩余照片
    const remainingPhotos = photos.slice(cellCount)
    
    this.setData({
      gridCells,
      remainingPhotos
    })
    
    console.log('初始化九宫格:', { gridCells, remainingPhotos, template })
  },

  // 解析样式值（已废弃，保留以防其他地方调用）
  parseStyleValue(style, property, baseValue) {
    if (!style || typeof style !== 'string') {
      return baseValue / 4 // 默认值
    }
    const regex = new RegExp(`${property}:\\s*(\\d+)%`)
    const match = style.match(regex)
    if (match) {
      return (parseInt(match[1]) / 100) * baseValue
    }
    return baseValue / 4 // 默认值
  },

  // 照片触摸开始
  // 格子触摸开始
  onCellTouchStart(e) {
    const cellIndex = e.currentTarget.dataset.cellIndex
    const cell = this.data.gridCells[cellIndex]
    
    // 只有有图片的格子才能拖拽
    if (!cell.photoSrc) return
    
    this.setData({
      draggingCell: cellIndex,
      touchStartTime: Date.now()
    })
  },

  // 格子触摸移动
  onCellTouchMove(e) {
    if (this.data.draggingCell === -1) return
    
    // 检测拖拽到哪个格子上
    const touch = e.touches[0]
    const element = wx.createSelectorQuery().in(this)
    
    // 简化处理：通过坐标计算目标格子
    this.detectDragOverCell(touch.clientX, touch.clientY)
  },

  // 格子触摸结束
  onCellTouchEnd(e) {
    const dragOverCell = this.data.dragOverCell
    const draggingCell = this.data.draggingCell
    
    if (draggingCell !== -1 && dragOverCell !== -1 && dragOverCell !== draggingCell) {
      // 交换两个格子的图片
      this.swapCellPhotos(draggingCell, dragOverCell)
    }
    
    this.setData({
      draggingCell: -1,
      dragOverCell: -1
    })
  },

  // 格子点击事件
  onCellTap(e) {
    const cellIndex = e.currentTarget.dataset.cellIndex
    const touchEndTime = Date.now()
    const timeSinceLastTap = touchEndTime - this.data.lastTapTime
    
    // 如果是快速点击（不是拖拽）
    if (touchEndTime - this.data.touchStartTime < 200) {
      // 检测双击（两次点击间隔小于300ms）
      if (timeSinceLastTap < 300 && timeSinceLastTap > 50) {
        this.onCellDoubleTap(cellIndex)
      } else {
        this.selectCellPhoto(cellIndex)
      }
    }
    
    // 更新最后点击时间
    this.setData({
      lastTapTime: touchEndTime
    })
  },

  // 双击格子事件
  onCellDoubleTap(cellIndex) {
    const cell = this.data.gridCells[cellIndex]
    
    if (cell.photoSrc) {
      // 有图片，打开裁剪工具，使用原始图片
      const imageSrc = cell.originalPhotoSrc || cell.photoSrc
      this.openCropTool(cellIndex, imageSrc)
    } else {
      // 空格子，选择照片
      this.addPhotoToCell(cellIndex)
    }
  },

  // 打开图片裁剪工具
  openCropTool(cellIndex, imageSrc) {
    // 获取图片尺寸
    wx.getImageInfo({
      src: imageSrc,
      success: (res) => {
        const imageWidth = res.width
        const imageHeight = res.height
        
        // 格子是正方形，所以裁剪框也应该是正方形（1:1比例）
        const cellAspectRatio = 1 // 格子宽高比为1:1
        
        // 计算当前aspectFill模式下图片的显示区域
        // aspectFill会保持图片宽高比，裁剪多余部分，填满容器
        const imageAspectRatio = imageWidth / imageHeight
        let displayWidth, displayHeight, offsetX, offsetY
        
        if (imageAspectRatio > cellAspectRatio) {
          // 图片更宽，以高度为准，左右裁剪
          displayHeight = imageHeight
          displayWidth = imageHeight * cellAspectRatio
          offsetX = (imageWidth - displayWidth) / 2
          offsetY = 0
        } else {
          // 图片更高，以宽度为准，上下裁剪
          displayWidth = imageWidth
          displayHeight = imageWidth / cellAspectRatio
          offsetX = 0
          offsetY = (imageHeight - displayHeight) / 2
        }
        
        this.setData({
          showCropModal: true,
          cropImageSrc: imageSrc,
          cropCellIndex: cellIndex,
          imageWidth: imageWidth,
          imageHeight: imageHeight,
          cropX: offsetX,
          cropY: offsetY,
          cropWidth: displayWidth,
          cropHeight: displayHeight,
          cropScale: 1,
          originalCropWidth: displayWidth,
          originalCropHeight: displayHeight
        })
      },
      fail: (err) => {
        console.error('获取图片信息失败:', err)
        wx.showToast({
          title: '图片加载失败',
          icon: 'none'
        })
      }
    })
  },

  // 关闭裁剪工具
  closeCropModal() {
    this.setData({
      showCropModal: false,
      cropImageSrc: '',
      cropCellIndex: -1
    })
  },

  // 裁剪框触摸开始
  onCropTouchStart(e) {
    const touch = e.touches[0]
    this.cropTouchStart = {
      x: touch.clientX,
      y: touch.clientY,
      cropX: this.data.cropX,
      cropY: this.data.cropY
    }
  },

  // 裁剪框触摸移动
  onCropTouchMove(e) {
    if (!this.cropTouchStart) return
    
    const touch = e.touches[0]
    // 考虑图片缩放后的坐标变换
    const displayScale = 300 / this.data.imageWidth
    const totalScale = displayScale * this.data.cropScale
    const deltaX = (touch.clientX - this.cropTouchStart.x) / totalScale
    const deltaY = (touch.clientY - this.cropTouchStart.y) / totalScale
    
    const newX = this.cropTouchStart.cropX + deltaX
    const newY = this.cropTouchStart.cropY + deltaY
    
    const maxX = this.data.imageWidth - this.data.cropWidth
    const maxY = this.data.imageHeight - this.data.cropHeight
    
    this.setData({
      cropX: Math.max(0, Math.min(maxX, newX)),
      cropY: Math.max(0, Math.min(maxY, newY))
    })
  },

  // 裁剪框触摸结束
  onCropTouchEnd(e) {
    this.cropTouchStart = null
  },

  // 图片缩放（裁剪框大小保持不变）
  onCropScale(e) {
    const scale = e.detail.value
    
    // 缩放的是图片，裁剪框大小保持原始大小
    const newCropWidth = this.data.originalCropWidth / scale
    const newCropHeight = this.data.originalCropHeight / scale
    
    // 保持裁剪框中心位置
    const centerX = this.data.cropX + this.data.cropWidth / 2
    const centerY = this.data.cropY + this.data.cropHeight / 2
    
    const newX = centerX - newCropWidth / 2
    const newY = centerY - newCropHeight / 2
    
    // 确保裁剪框不超出图片边界
    const maxX = this.data.imageWidth - newCropWidth
    const maxY = this.data.imageHeight - newCropHeight
    
    this.setData({
      cropScale: scale,
      cropWidth: newCropWidth,
      cropHeight: newCropHeight,
      cropX: Math.max(0, Math.min(maxX, newX)),
      cropY: Math.max(0, Math.min(maxY, newY))
    })
  },

  // 确认裁剪
  confirmCrop() {
    const { cropImageSrc, cropX, cropY, cropWidth, cropHeight, cropCellIndex } = this.data
    
    // 使用canvas进行图片裁剪
    const query = wx.createSelectorQuery().in(this)
    query.select('#cropCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0]
        const canvasNode = canvas.node
        const ctx = canvasNode.getContext('2d')
        
        // 设置canvas尺寸
        canvasNode.width = cropWidth
        canvasNode.height = cropHeight
        
        // 创建图片对象
        const img = canvasNode.createImage()
        img.onload = () => {
          // 绘制裁剪后的图片
          ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight)
          
          // 导出裁剪后的图片
          wx.canvasToTempFilePath({
            canvas: canvasNode,
            success: (res) => {
              // 更新格子中的图片，但保留原始图片路径
              const gridCells = [...this.data.gridCells]
              gridCells[cropCellIndex].photoSrc = res.tempFilePath
              // 确保originalPhotoSrc存在，如果不存在则设置为当前的photoSrc
              if (!gridCells[cropCellIndex].originalPhotoSrc) {
                gridCells[cropCellIndex].originalPhotoSrc = cropImageSrc
              }
              
              this.setData({
                gridCells: gridCells
              })
              
              this.closeCropModal()
              
              wx.showToast({
                title: '裁剪成功',
                icon: 'success'
              })
            },
            fail: (err) => {
              console.error('裁剪失败:', err)
              wx.showToast({
                title: '裁剪失败',
                icon: 'none'
              })
            }
          })
        }
        img.src = cropImageSrc
      })
  },

  // 检测拖拽悬停的格子
  detectDragOverCell(clientX, clientY) {
    // 简化实现：根据触摸位置计算目标格子
    // 实际项目中可以使用更精确的元素位置检测
    const query = wx.createSelectorQuery().in(this)
    query.selectAll('.grid-cell').boundingClientRect((rects) => {
      let targetCell = -1
      
      rects.forEach((rect, index) => {
        if (clientX >= rect.left && clientX <= rect.right &&
            clientY >= rect.top && clientY <= rect.bottom) {
          targetCell = index
        }
      })
      
      this.setData({
        dragOverCell: targetCell
      })
    }).exec()
  },

  // 交换两个格子的图片
  swapCellPhotos(fromIndex, toIndex) {
    const gridCells = [...this.data.gridCells]
    const fromPhoto = gridCells[fromIndex].photoSrc
    const toPhoto = gridCells[toIndex].photoSrc
    const fromOriginalPhoto = gridCells[fromIndex].originalPhotoSrc
    const toOriginalPhoto = gridCells[toIndex].originalPhotoSrc
    
    // 交换图片和原始图片
    gridCells[fromIndex].photoSrc = toPhoto
    gridCells[toIndex].photoSrc = fromPhoto
    gridCells[fromIndex].originalPhotoSrc = toOriginalPhoto
    gridCells[toIndex].originalPhotoSrc = fromOriginalPhoto
    
    this.setData({
      gridCells
    })
    
    wx.showToast({
      title: '图片已交换',
      icon: 'success',
      duration: 1000
    })
  },

  // 选择格子照片
  selectCellPhoto(cellIndex) {
    const cell = this.data.gridCells[cellIndex]
    
    if (cell.photoSrc) {
      wx.showToast({
        title: `选中第${cellIndex + 1}个格子`,
        icon: 'none',
        duration: 1000
      })
    } else {
      // 空格子，可以添加照片
      this.addPhotoToCell(cellIndex)
    }
  },

  // 向格子添加照片
  addPhotoToCell(cellIndex) {
    const remainingPhotos = this.data.remainingPhotos
    
    if (remainingPhotos.length > 0) {
      const gridCells = [...this.data.gridCells]
      const newRemainingPhotos = [...remainingPhotos]
      
      const photoSrc = newRemainingPhotos.shift()
      gridCells[cellIndex].photoSrc = photoSrc
      gridCells[cellIndex].originalPhotoSrc = photoSrc // 同时设置原始图片路径
      
      this.setData({
        gridCells,
        remainingPhotos: newRemainingPhotos
      })
    } else {
      wx.showToast({
        title: '没有更多照片',
        icon: 'none'
      })
    }
  },

  // 添加照片到画布
  addPhotoToCanvas(e) {
    const src = e.currentTarget.dataset.src
    
    // 找到第一个空的格子
    const gridCells = [...this.data.gridCells]
    const emptyIndex = gridCells.findIndex(cell => !cell.photoSrc)
    
    if (emptyIndex !== -1) {
      // 添加到空格子
      this.addPhotoToCell(emptyIndex)
    } else {
      wx.showToast({
        title: '所有格子都已填满',
        icon: 'none'
      })
    }
  },

  // 删除照片项
  deletePhotoFromCell(cellIndex) {
    const gridCells = [...this.data.gridCells]
    const remainingPhotos = [...this.data.remainingPhotos]
    
    if (cellIndex >= 0 && cellIndex < gridCells.length && gridCells[cellIndex].photoSrc) {
      const deletedPhoto = gridCells[cellIndex].photoSrc
      remainingPhotos.push(deletedPhoto)
      gridCells[cellIndex].photoSrc = null
      gridCells[cellIndex].originalPhotoSrc = null // 同时清除原始图片路径
      
      this.setData({
        gridCells,
        remainingPhotos
      })
      
      wx.showToast({
        title: '照片已移除',
        icon: 'success',
        duration: 1000
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
  async savePuzzle() {
    this.setData({
      isLoading: true,
      loadingText: '正在保存...'
    })
    
    try {
      // 绘制最终图片
      await this.drawFinalImage()
      
      // 导出图片 - 使用最高质量设置
      wx.canvasToTempFilePath({
        canvas: this.canvasNode,
        x: 0,
        y: 0,
        width: this.data.canvasWidth,
        height: this.data.canvasHeight,
        destWidth: this.data.canvasWidth * this.scaleFactor,
        destHeight: this.data.canvasHeight * this.scaleFactor,
        quality: 1.0, // 最高质量
        fileType: 'png', // 使用PNG格式保持最佳质量
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
        fail: (err) => {
          console.error('生成图片失败:', err)
          this.setData({
            isLoading: false
          })
          wx.showToast({
            title: '生成图片失败',
            icon: 'none'
          })
        }
      }, this)
    } catch (error) {
      console.error('绘制图片失败:', error)
      this.setData({
        isLoading: false
      })
      wx.showToast({
        title: '绘制图片失败',
        icon: 'none'
      })
    }
  },

  // 绘制最终图片
  drawFinalImage() {
    return new Promise(async (resolve) => {
      const ctx = this.canvasContext
      
      // 清空画布
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, this.data.canvasWidth, this.data.canvasHeight)
      
      // 绘制九宫格中的图片
      const gridCells = this.data.gridCells || []
      const cellsWithPhotos = gridCells.filter(cell => cell.photoSrc)
      
      if (cellsWithPhotos.length === 0) {
        resolve()
        return
      }
      
      // 计算每个格子的位置和大小
      const cellWidth = this.data.canvasWidth / 3
      const cellHeight = this.data.canvasHeight / 3
      
      // 加载并绘制所有图片
      const imagePromises = cellsWithPhotos.map((cell) => {
        return new Promise((imageResolve) => {
          const img = this.canvasNode.createImage()
          img.onload = () => {
            const row = Math.floor(cell.index / 3)
            const col = cell.index % 3
            const x = col * cellWidth
            const y = row * cellHeight
            
            // 保存当前状态
            ctx.save()
            
            // 设置高质量绘制选项
            ctx.imageSmoothingEnabled = true
            ctx.imageSmoothingQuality = 'high'
            
            // 计算图片的宽高比和最佳绘制尺寸
            const imgAspectRatio = img.width / img.height
            const cellAspectRatio = cellWidth / cellHeight
            
            let drawWidth, drawHeight, drawX, drawY
            
            if (imgAspectRatio > cellAspectRatio) {
              // 图片更宽，以高度为准
              drawHeight = cellHeight
              drawWidth = drawHeight * imgAspectRatio
              drawX = x - (drawWidth - cellWidth) / 2
              drawY = y
            } else {
              // 图片更高，以宽度为准
              drawWidth = cellWidth
              drawHeight = drawWidth / imgAspectRatio
              drawX = x
              drawY = y - (drawHeight - cellHeight) / 2
            }
            
            // 设置裁剪区域确保图片不超出格子边界
            ctx.beginPath()
            ctx.rect(x, y, cellWidth, cellHeight)
            ctx.clip()
            
            // 使用高质量算法绘制图片
            ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
            
            // 恢复状态
            ctx.restore()
            
            imageResolve()
          }
          img.onerror = () => {
            console.error('图片加载失败:', cell.photoSrc)
            imageResolve()
          }
          img.src = cell.photoSrc
        })
      })
      
      // 等待所有图片加载完成
      await Promise.all(imagePromises)
      resolve()
    })
  },

  // 返回
  goBack() {
    wx.navigateBack()
  }
})