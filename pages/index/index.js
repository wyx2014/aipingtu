// index.js
const app = getApp()

Page({
  data: {
    selectedPhotos: [],
    currentTemplate: 0,
    filteredTemplates: [],
    templates: [
      // 3张图片布局
      {
        name: '3图-经典',
        style: 'background: #fff;',
        gridClass: 'grid-3-classic',
        photoCount: 3,
        cells: [
          { class: 'large' },
          { class: '' },
          { class: '' }
        ]
      },
      {
        name: '3图-横排',
        style: 'background: #fff;',
        gridClass: 'grid-3-horizontal',
        photoCount: 3,
        cells: [
          { class: '' },
          { class: '' },
          { class: '' }
        ]
      },
      {
        name: '3图-竖排',
        style: 'background: #fff;',
        gridClass: 'grid-3-vertical',
        photoCount: 3,
        cells: [
          { class: '' },
          { class: '' },
          { class: '' }
        ]
      },
      // 4张图片布局
      {
        name: '4图-方格',
        style: 'background: #fff;',
        gridClass: 'grid-4-square',
        photoCount: 4,
        cells: [
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' }
        ]
      },
      {
        name: '4图-大小',
        style: 'background: #fff;',
        gridClass: 'grid-4-mixed',
        photoCount: 4,
        cells: [
          { class: 'big' },
          { class: '' },
          { class: '' },
          { class: '' }
        ]
      },
      {
        name: '4图-横条',
        style: 'background: #fff;',
        gridClass: 'grid-4-horizontal',
        photoCount: 4,
        cells: [
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' }
        ]
      },
      // 5张图片布局
      {
        name: '5图-主次',
        style: 'background: #fff;',
        gridClass: 'grid-5-main',
        photoCount: 5,
        cells: [
          { class: 'big' },
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' }
        ]
      },
      {
        name: '5图-分层',
        style: 'background: #fff;',
        gridClass: 'grid-5-layered',
        photoCount: 5,
        cells: [
          { class: '' },
          { class: '' },
          { class: 'wide' },
          { class: '' },
          { class: '' }
        ]
      },
      {
        name: '5图-创意',
        style: 'background: #fff;',
        gridClass: 'grid-5-creative',
        photoCount: 5,
        cells: [
          { class: '' },
          { class: 'tall' },
          { class: '' },
          { class: '' },
          { class: '' }
        ]
      },
      // 6张图片布局
      {
        name: '6图-方阵',
        style: 'background: #fff;',
        gridClass: 'grid-6-matrix',
        photoCount: 6,
        cells: [
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' }
        ]
      },
      {
        name: '6图-混合',
        style: 'background: #fff;',
        gridClass: 'grid-6-mixed',
        photoCount: 6,
        cells: [
          { class: 'big' },
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' }
        ]
      },
      {
        name: '6图-条纹',
        style: 'background: #fff;',
        gridClass: 'grid-6-stripe',
        photoCount: 6,
        cells: [
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' }
        ]
      },
      // 7张图片布局
      {
        name: '7图-主导',
        style: 'background: #fff;',
        gridClass: 'grid-7-main',
        photoCount: 7,
        cells: [
          { class: 'big' },
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' }
        ]
      },
      {
        name: '7图-分组',
        style: 'background: #fff;',
        gridClass: 'grid-7-grouped',
        photoCount: 7,
        cells: [
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' }
        ]
      },
      {
        name: '7图-创意',
        style: 'background: #fff;',
        gridClass: 'grid-7-creative',
        photoCount: 7,
        cells: [
          { class: '' },
          { class: 'tall' },
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' }
        ]
      },
      // 8张图片布局
      {
        name: '8图-方阵',
        style: 'background: #fff;',
        gridClass: 'grid-8-matrix',
        photoCount: 8,
        cells: [
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' }
        ]
      },
      {
        name: '8图-混合',
        style: 'background: #fff;',
        gridClass: 'grid-8-mixed',
        photoCount: 8,
        cells: [
          { class: 'big' },
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' }
        ]
      },
      {
        name: '8图-创意',
        style: 'background: #fff;',
        gridClass: 'grid-8-creative',
        photoCount: 8,
        cells: [
          { class: '' },
          { class: '' },
          { class: '' },
          { class: 'wide' },
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' }
        ]
      },
      // 9张图片布局
      {
        name: '9图-九宫格',
        style: 'background: #fff;',
        gridClass: 'grid-9-classic',
        photoCount: 9,
        cells: [
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' }
        ]
      },
      {
        name: '9图-主次',
        style: 'background: #fff;',
        gridClass: 'grid-9-main',
        photoCount: 9,
        cells: [
          { class: 'big' },
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' }
        ]
      },
      {
        name: '9图-创意',
        style: 'background: #fff;',
        gridClass: 'grid-9-creative',
        photoCount: 9,
        cells: [
          { class: '' },
          { class: '' },
          { class: '' },
          { class: 'wide' },
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' }
        ]
      }
    ]
  },

  // 更新过滤后的模板
  updateFilteredTemplates() {
    const photoCount = this.data.selectedPhotos.length
    let filteredTemplates
    if (photoCount === 0) {
      filteredTemplates = this.data.templates
    } else {
      filteredTemplates = this.data.templates.filter(template => 
        template.photoCount === photoCount || template.photoCount <= photoCount
      )
    }
    this.setData({
      filteredTemplates: filteredTemplates
    })
  },

  onLoad() {
    // 页面加载时的逻辑
    console.log('首页加载完成')
    // 初始化过滤后的模板
    this.updateFilteredTemplates()
  },

  onShow() {
    // 从全局数据中恢复选择的照片
    if (app.globalData.selectedPhotos.length > 0) {
      this.setData({
        selectedPhotos: app.globalData.selectedPhotos
      })
    }
    // 更新过滤后的模板
    this.updateFilteredTemplates()
  },

  // 选择图片
  chooseImage() {
    const that = this
    const maxCount = 9 - this.data.selectedPhotos.length
    
    if (maxCount <= 0) {
      wx.showToast({
        title: '最多选择9张照片',
        icon: 'none'
      })
      return
    }

    wx.chooseMedia({
      count: maxCount,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success(res) {
        const tempFiles = res.tempFiles.map(file => file.tempFilePath)
        const newPhotos = [...that.data.selectedPhotos, ...tempFiles]
        
        that.setData({
          selectedPhotos: newPhotos
        })
        
        // 保存到全局数据
        app.globalData.selectedPhotos = newPhotos
        
        // 更新过滤后的模板
        that.updateFilteredTemplates()
        
        wx.showToast({
          title: `已选择${tempFiles.length}张照片`,
          icon: 'success'
        })
      },
      fail(err) {
        console.error('选择图片失败:', err)
        wx.showToast({
          title: '选择图片失败',
          icon: 'none'
        })
      }
    })
  },

  // 删除照片
  deletePhoto(e) {
    const index = e.currentTarget.dataset.index
    const photos = [...this.data.selectedPhotos]
    photos.splice(index, 1)
    
    this.setData({
      selectedPhotos: photos
    })
    
    // 更新全局数据
    app.globalData.selectedPhotos = photos
    
    // 更新过滤后的模板
    this.updateFilteredTemplates()
  },

  // 选择模板
  selectTemplate(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      currentTemplate: index
    })
    
    // 获取过滤后的模板
    const photoCount = this.data.selectedPhotos.length
    let filteredTemplates
    if (photoCount === 0) {
      filteredTemplates = this.data.templates
    } else {
      filteredTemplates = this.data.templates.filter(template => 
        template.photoCount === photoCount || template.photoCount <= photoCount
      )
    }
    
    // 保存到全局数据
    app.globalData.currentTemplate = filteredTemplates[index]
  },

  // 开始创作
  startCreate() {
    if (this.data.selectedPhotos.length === 0) {
      wx.showToast({
        title: '请先选择照片',
        icon: 'none'
      })
      return
    }

    // 保存当前选择到全局数据
    app.globalData.selectedPhotos = this.data.selectedPhotos
    app.globalData.currentTemplate = this.data.templates[this.data.currentTemplate]

    // 跳转到编辑页面
    wx.navigateTo({
      url: '/pages/editor/editor'
    })
  },

  // 预览照片
  previewPhoto(e) {
    const current = e.currentTarget.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.selectedPhotos
    })
  }
})