// index.js
const app = getApp()

// 动态生成CSS Grid样式
function generateGridStyle(gridConfig) {
  const { columns, rows, gap } = gridConfig;
  
  // 将数组转换为CSS Grid的fr单位
  const gridTemplateColumns = columns.map(col => `${col}fr`).join(' ');
  const gridTemplateRows = rows.map(row => `${row}fr`).join(' ');
  
  return `grid-template-columns: ${gridTemplateColumns}; grid-template-rows: ${gridTemplateRows}; gap: ${gap}rpx;`;
}

Page({
  data: {
    selectedPhotos: [],
    currentTemplate: 0,
    templates: require('../../utils/templates').templates
  },

  computed: {
    canStart() {
      return this.data.selectedPhotos.length > 0
    }
  },

  onLoad() {
    // 页面加载时的逻辑
    console.log('首页加载完成')
    
    // 为每个模板生成动态样式
    const templates = this.data.templates.map(template => {
      const gridStyle = generateGridStyle(template.gridConfig);
      return {
        ...template,
        style: `background: #fff; ${gridStyle}`
      };
    });
    
    this.setData({
      templates: templates
    });
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