// index.js
const app = getApp()

Page({
  data: {
    selectedPhotos: [],
    currentTemplate: 0,
    templates: [
      {
        name: '经典九宫格',
        style: 'background: #fff;',
        gridClass: 'grid-3x3',
        gridConfig: {
          columns: [1, 1, 1], // 1fr 1fr 1fr
          rows: [1, 1, 1],    // 1fr 1fr 1fr
          gap: 8
        },
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
        name: '大图配小图',
        style: 'background: #fff;',
        gridClass: 'grid-big-small',
        gridConfig: {
          columns: [2, 1], // 2fr 1fr
          rows: [2, 1, 1], // 2fr 1fr 1fr
          gap: 8
        },
        cells: [
          { class: '', columnSpan: 2, rowSpan: 2 },
          { class: '' },
          { class: '' },
        ]
      },
      {
        name: '横向拼接',
        style: 'background: #fff;',
        gridClass: 'grid-horizontal',
        gridConfig: {
          columns: [1, 1], // 1fr 1fr
          rows: [1],       // 1fr
          gap: 8
        },
        cells: [
          { class: '' },
          { class: '' }
        ]
      },
      {
        name: '竖向拼接',
        style: 'background: #fff;',
        gridClass: 'grid-vertical',
        gridConfig: {
          columns: [1],    // 1fr
          rows: [1, 1],    // 1fr 1fr
          gap: 8
        },
        cells: [
          { class: '' },
          { class: '' }
        ]
      },
      {
        name: '创意布局',
        style: 'background: #fff;',
        gridClass: 'grid-creative',
        gridConfig: {
          columns: [2, 1, 1], // 2fr 1fr 1fr
          rows: [2, 1, 1],    // 2fr 1fr 1fr
          gap: 8
        },
        cells: [
          { class: '', columnSpan: 2, rowSpan: 2 },
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' },
          { class: '' }
        ]
      },
      // 3张图片布局模板
      {
        name: '横向三联',
        style: 'background: #fff;',
        gridClass: 'grid-3-horizontal',
        gridConfig: {
          columns: [1, 1, 1], // 1fr 1fr 1fr
          rows: [1],          // 1fr
          gap: 8
        },
        cells: [
          { class: '' },
          { class: '' },
          { class: '' }
        ]
      },
      {
        name: '竖向三联',
        style: 'background: #fff;',
        gridClass: 'grid-3-vertical',
        gridConfig: {
          columns: [1],       // 1fr
          rows: [1, 1, 1],    // 1fr 1fr 1fr
          gap: 8
        },
        cells: [
          { class: '' },
          { class: '' },
          { class: '' }
        ]
      },
      {
        name: 'T型布局',
        style: 'background: #fff;',
        gridClass: 'grid-3-T-shape',
        gridConfig: {
          columns: [1, 1], // 1fr 1fr
          rows: [1, 1],    // 1fr 1fr
          gap: 8
        },
        cells: [
          { class: '', columnSpan: 2 },
          { class: '' },
          { class: '' }
        ]
      },
      {
         name: '倒T型布局',
         style: 'background: #fff;',
         gridClass: 'grid-3-T-shape',
         gridConfig: {
           columns: [1, 1], // 1fr 1fr
           rows: [1, 1],    // 1fr 1fr
           gap: 8
         },
         cells: [
           { class: '' },
           { class: '' },
           { class: '', columnSpan: 2 }
         ]
       },
       {
        name: '左T型布局',
        style: 'background: #fff;',
        gridClass: 'grid-3-T-shape',
        gridConfig: {
          columns: [1, 1], // 1fr 1fr
          rows: [1, 1],    // 1fr 1fr
          gap: 8
        },
        cells: [
          { class: '', rowSpan: 2  },
          { class: '' },
          { class: '' }
        ]
      },
      {
        name: '右T型布局',
        style: 'background: #fff;',
        gridClass: 'grid-3-T-shape',
        gridConfig: {
          columns: [1, 1], // 1fr 1fr
          rows: [1, 1],    // 1fr 1fr
          gap: 8
        },
        cells: [
          { class: '' },
          { class: '', rowSpan: 2 },
          { class: '' }
        ]
      },
       // 4张图片布局模板
       {
         name: '田字格',
         style: 'background: #fff;',
         gridClass: 'grid-4-square',
         gridConfig: {
           columns: [1, 1], // 1fr 1fr
           rows: [1, 1],    // 1fr 1fr
           gap: 8
         },
         cells: [
           { class: '' },
           { class: '' },
           { class: '' },
           { class: '' }
         ]
       },
       {
         name: '横向四联',
         style: 'background: #fff;',
         gridClass: 'grid-4-horizontal',
         gridConfig: {
           columns: [1, 1, 1, 1], // 1fr 1fr 1fr 1fr
           rows: [1],             // 1fr
           gap: 8
         },
         cells: [
           { class: '' },
           { class: '' },
           { class: '' },
           { class: '' }
         ]
       },
       {
         name: '竖向四联',
         style: 'background: #fff;',
         gridClass: 'grid-4-vertical',
         gridConfig: {
           columns: [1],          // 1fr
           rows: [1, 1, 1, 1],    // 1fr 1fr 1fr 1fr
           gap: 8
         },
         cells: [
           { class: '' },
           { class: '' },
           { class: '' },
           { class: '' }
         ]
       },
       {
         name: '正双T型布局',
         style: 'background: #fff;',
         gridClass: 'grid-4-2t-shape',
         gridConfig: {
           columns: [1, 1, 1], // 1fr 1fr 1fr
           rows: [1, 1],       // 1fr 1fr
           gap: 8
         },
         cells: [
           { class: '', columnSpan: 3 },
           { class: '' },
           { class: '' },
           { class: '' }
         ]
       }
    ]
  },

  computed: {
    canStart() {
      return this.data.selectedPhotos.length > 0
    }
  },

  onLoad() {
    // 页面加载时的逻辑
    console.log('首页加载完成')
  },

  onShow() {
    // 从全局数据中恢复选择的照片
    if (app.globalData.selectedPhotos.length > 0) {
      this.setData({
        selectedPhotos: app.globalData.selectedPhotos
      })
    }
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
  },

  // 选择模板
  selectTemplate(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      currentTemplate: index
    })
    
    // 保存到全局数据
    app.globalData.currentTemplate = this.data.templates[index]
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