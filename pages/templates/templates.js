// templates.js
const app = getApp()

Page({
  data: {
    searchKeyword: '',
    currentCategory: 'all',
    selectedTemplate: null,
    showPreview: false,
    hasMore: true,
    
    categories: [
      { id: 'all', name: '全部' },
      { id: 'classic', name: '经典' },
      { id: 'creative', name: '创意' },
      { id: 'simple', name: '简约' },
      { id: 'artistic', name: '艺术' },
      { id: 'holiday', name: '节日' }
    ],
    
    templates: [
      {
        id: 'template_1',
        name: '经典九宫格',
        description: '最经典的九宫格布局，适合展示多张照片的精彩瞬间',
        category: 'classic',
        photoCount: 9,
        tag: '热门',
        scene: '日常分享',
        ratio: '1:1',
        containerStyle: 'background: #fff;',
        cells: [
          { style: 'width: 30%; height: 30%; margin: 1.5%;' },
          { style: 'width: 30%; height: 30%; margin: 1.5%;' },
          { style: 'width: 30%; height: 30%; margin: 1.5%;' },
          { style: 'width: 30%; height: 30%; margin: 1.5%;' },
          { style: 'width: 30%; height: 30%; margin: 1.5%;' },
          { style: 'width: 30%; height: 30%; margin: 1.5%;' },
          { style: 'width: 30%; height: 30%; margin: 1.5%;' },
          { style: 'width: 30%; height: 30%; margin: 1.5%;' },
          { style: 'width: 30%; height: 30%; margin: 1.5%;' }
        ]
      },
      {
        id: 'template_2',
        name: '大图配小图',
        description: '突出主图，配以小图点缀，层次分明',
        category: 'creative',
        photoCount: 5,
        tag: '推荐',
        scene: '重点展示',
        ratio: '4:3',
        containerStyle: 'background: #fff;',
        cells: [
          { style: 'width: 60%; height: 60%; margin: 2%;' },
          { style: 'width: 30%; height: 28%; margin: 2%;' },
          { style: 'width: 30%; height: 28%; margin: 2%;' },
          { style: 'width: 30%; height: 28%; margin: 2%;' },
          { style: 'width: 30%; height: 28%; margin: 2%;' }
        ]
      },
      {
        id: 'template_3',
        name: '横向双拼',
        description: '简洁的横向双图布局，适合对比展示',
        category: 'simple',
        photoCount: 2,
        tag: '简约',
        scene: '对比展示',
        ratio: '2:1',
        containerStyle: 'background: #fff;',
        cells: [
          { style: 'width: 48%; height: 100%; margin: 1%;' },
          { style: 'width: 48%; height: 100%; margin: 1%;' }
        ]
      },
      {
        id: 'template_4',
        name: '竖向双拼',
        description: '竖向双图布局，适合展示全身照或风景',
        category: 'simple',
        photoCount: 2,
        tag: '简约',
        scene: '风景人像',
        ratio: '1:2',
        containerStyle: 'background: #fff;',
        cells: [
          { style: 'width: 100%; height: 48%; margin: 1% 0;' },
          { style: 'width: 100%; height: 48%; margin: 1% 0;' }
        ]
      },
      {
        id: 'template_5',
        name: '创意拼接',
        description: '不规则的创意布局，让你的照片更有艺术感',
        category: 'artistic',
        photoCount: 6,
        tag: '艺术',
        scene: '创意展示',
        ratio: '3:4',
        containerStyle: 'background: #fff;',
        cells: [
          { style: 'width: 40%; height: 40%; margin: 2%;' },
          { style: 'width: 50%; height: 25%; margin: 2%;' },
          { style: 'width: 50%; height: 25%; margin: 2%;' },
          { style: 'width: 30%; height: 25%; margin: 2%;' },
          { style: 'width: 30%; height: 25%; margin: 2%;' },
          { style: 'width: 30%; height: 25%; margin: 2%;' }
        ]
      },
      {
        id: 'template_6',
        name: '心形拼图',
        description: '浪漫的心形布局，适合情侣照片或表达爱意',
        category: 'holiday',
        photoCount: 7,
        tag: '浪漫',
        scene: '情侣纪念',
        ratio: '1:1',
        containerStyle: 'background: #fff;',
        cells: [
          { style: 'width: 25%; height: 25%; margin: 2%; border-radius: 50%;' },
          { style: 'width: 25%; height: 25%; margin: 2%; border-radius: 50%;' },
          { style: 'width: 30%; height: 20%; margin: 2%;' },
          { style: 'width: 35%; height: 20%; margin: 2%;' },
          { style: 'width: 40%; height: 15%; margin: 2%;' },
          { style: 'width: 30%; height: 15%; margin: 2%;' },
          { style: 'width: 20%; height: 10%; margin: 2%;' }
        ]
      },
      {
        id: 'template_7',
        name: '杂志风格',
        description: '时尚杂志风格的不对称布局，展现个性魅力',
        category: 'artistic',
        photoCount: 4,
        tag: '时尚',
        scene: '时尚大片',
        ratio: '3:4',
        containerStyle: 'background: #fff;',
        cells: [
          { style: 'width: 70%; height: 50%; margin: 2%;' },
          { style: 'width: 25%; height: 50%; margin: 2%;' },
          { style: 'width: 45%; height: 45%; margin: 2%;' },
          { style: 'width: 50%; height: 45%; margin: 2%;' }
        ]
      },
      {
        id: 'template_8',
        name: '圆形拼图',
        description: '优雅的圆形布局，给照片增添柔美感觉',
        category: 'artistic',
        photoCount: 5,
        tag: '优雅',
        scene: '柔美风格',
        ratio: '1:1',
        containerStyle: 'background: #fff;',
        cells: [
          { style: 'width: 40%; height: 40%; margin: 5%; border-radius: 50%;' },
          { style: 'width: 25%; height: 25%; margin: 2%; border-radius: 50%;' },
          { style: 'width: 25%; height: 25%; margin: 2%; border-radius: 50%;' },
          { style: 'width: 25%; height: 25%; margin: 2%; border-radius: 50%;' },
          { style: 'width: 25%; height: 25%; margin: 2%; border-radius: 50%;' }
        ]
      }
    ],
    
    filteredTemplates: []
  },

  onLoad() {
    this.filterTemplates()
  },

  onShow() {
    // 检查是否有已选择的模板
    if (app.globalData.currentTemplate) {
      const selectedId = app.globalData.currentTemplate.id
      const template = this.data.templates.find(t => t.id === selectedId)
      if (template) {
        this.setData({
          selectedTemplate: template
        })
      }
    }
  },

  // 搜索输入
  onSearchInput(e) {
    this.setData({
      searchKeyword: e.detail.value
    })
    this.filterTemplates()
  },

  // 执行搜索
  onSearch() {
    this.filterTemplates()
  },

  // 选择分类
  selectCategory(e) {
    const categoryId = e.currentTarget.dataset.id
    this.setData({
      currentCategory: categoryId
    })
    this.filterTemplates()
  },

  // 过滤模板
  filterTemplates() {
    let filtered = [...this.data.templates]
    
    // 按分类过滤
    if (this.data.currentCategory !== 'all') {
      filtered = filtered.filter(template => template.category === this.data.currentCategory)
    }
    
    // 按关键词过滤
    if (this.data.searchKeyword.trim()) {
      const keyword = this.data.searchKeyword.toLowerCase()
      filtered = filtered.filter(template => 
        template.name.toLowerCase().includes(keyword) ||
        template.description.toLowerCase().includes(keyword) ||
        template.scene.toLowerCase().includes(keyword)
      )
    }
    
    this.setData({
      filteredTemplates: filtered
    })
  },

  // 选择模板
  selectTemplate(e) {
    const template = e.currentTarget.dataset.template
    this.setData({
      selectedTemplate: template
    })
  },

  // 预览模板
  previewTemplate() {
    if (!this.data.selectedTemplate) {
      wx.showToast({
        title: '请先选择模板',
        icon: 'none'
      })
      return
    }
    
    this.setData({
      showPreview: true
    })
  },

  // 关闭预览
  closePreview() {
    this.setData({
      showPreview: false
    })
  },

  // 使用模板
  useTemplate() {
    if (!this.data.selectedTemplate) {
      wx.showToast({
        title: '请先选择模板',
        icon: 'none'
      })
      return
    }
    
    this.applyTemplate(this.data.selectedTemplate)
  },

  // 确认使用模板
  confirmUseTemplate() {
    this.setData({
      showPreview: false
    })
    this.applyTemplate(this.data.selectedTemplate)
  },

  // 应用模板
  applyTemplate(template) {
    // 保存选择的模板到全局数据
    app.globalData.currentTemplate = template
    
    wx.showToast({
      title: `已选择${template.name}`,
      icon: 'success'
    })
    
    // 检查是否有选择的照片
    if (app.globalData.selectedPhotos && app.globalData.selectedPhotos.length > 0) {
      // 如果有照片，直接跳转到编辑器
      wx.navigateTo({
        url: '/pages/editor/editor'
      })
    } else {
      // 如果没有照片，跳转到首页选择照片
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
  },

  // 分享模板
  shareTemplate() {
    if (!this.data.selectedTemplate) {
      wx.showToast({
        title: '请先选择模板',
        icon: 'none'
      })
      return
    }
    
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  // 收藏模板
  favoriteTemplate() {
    if (!this.data.selectedTemplate) {
      wx.showToast({
        title: '请先选择模板',
        icon: 'none'
      })
      return
    }
    
    // 这里可以实现收藏功能
    wx.showToast({
      title: '收藏成功',
      icon: 'success'
    })
  },

  // 加载更多模板
  loadMoreTemplates() {
    // 这里可以实现分页加载更多模板
    wx.showToast({
      title: '暂无更多模板',
      icon: 'none'
    })
    
    this.setData({
      hasMore: false
    })
  },

  // 页面分享
  onShareAppMessage() {
    return {
      title: '发现超棒的拼图模板，快来试试吧！',
      path: '/pages/templates/templates',
      imageUrl: '/images/share-template.png'
    }
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '创意拼图 - 让你的照片更有趣',
      query: 'from=timeline',
      imageUrl: '/images/share-template.png'
    }
  }
})