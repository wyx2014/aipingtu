// templates.js
const app = getApp()

Page({
  data: {
    templates: [
      {
        id: 'template_2',
        name: '大图配小图',
        description: '突出主图，配以小图点缀，层次分明',
        category: 'creative',
        photoCount: 3,
        tag: '推荐',
        scene: '重点展示',
        ratio: '4:3',
        containerStyle: 'background: #fff;',
        cells: [
          { style: 'width: 60%; height: 60%; margin: 2%;' },
          { style: 'width: 35%; height: 28%; margin: 2%;' },
          { style: 'width: 35%; height: 28%; margin: 2%;' }
        ]
      }
    ]
  }
})