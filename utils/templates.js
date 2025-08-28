// 共享的模板数据
const templates = [
  {
    name: '经典九宫格',
    style: 'background: #fff;',
    gridConfig: {
      columns: [1, 1, 1], // 1fr 1fr 1fr
      rows: [1, 1, 1],    // 1fr 1fr 1fr
      gap: 8
    },
    cells: [
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {}
    ]
  },
  {
    name: '大图配小图',
    style: 'background: #fff;',
    gridConfig: {
      columns: [2, 1], // 2fr 1fr
      rows: [2, 1, 1], // 2fr 1fr 1fr
      gap: 8
    },
    cells: [
      { columnSpan: 2, rowSpan: 2 },
      {},
      {},
    ]
  },
  {
    name: '横向拼接',
    style: 'background: #fff;',
    gridConfig: {
      columns: [1, 1], // 1fr 1fr
      rows: [1],       // 1fr
      gap: 8
    },
    cells: [
      {},
      {}
    ]
  },
  {
    name: '竖向拼接',
    style: 'background: #fff;',
    gridConfig: {
      columns: [1],    // 1fr
      rows: [1, 1],    // 1fr 1fr
      gap: 8
    },
    cells: [
      {},
      {}
    ]
  },
  {
    name: '创意布局',
    style: 'background: #fff;',
    gridConfig: {
      columns: [2, 1, 1], // 2fr 1fr 1fr
      rows: [2, 1, 1],    // 2fr 1fr 1fr
      gap: 8
    },
    cells: [
      { columnSpan: 2, rowSpan: 2 },
      {},
      {},
      {},
      {},
      {}
    ]
  },
  // 3张图片布局模板
  {
    name: '横向三联',
    style: 'background: #fff;',
    gridConfig: {
      columns: [1, 1, 1], // 1fr 1fr 1fr
      rows: [1],          // 1fr
      gap: 8
    },
    cells: [
      {},
      {},
      {}
    ]
  },
  {
    name: '竖向三联',
    style: 'background: #fff;',
    gridConfig: {
      columns: [1],       // 1fr
      rows: [1, 1, 1],    // 1fr 1fr 1fr
      gap: 8
    },
    cells: [
      {},
      {},
      {}
    ]
  },
  {
    name: 'T型布局',
    style: 'background: #fff;',
    gridConfig: {
      columns: [1, 1], // 1fr 1fr
      rows: [1, 1],    // 1fr 1fr
      gap: 8
    },
    cells: [
      { columnSpan: 2 },
      {},
      {}
    ]
  },
  {
    name: '倒T型布局',
    style: 'background: #fff;',
    gridConfig: {
      columns: [1, 1], // 1fr 1fr
      rows: [1, 1],    // 1fr 1fr
      gap: 8
    },
    cells: [
      {},
      {},
      { columnSpan: 2 }
    ]
  },
  {
    name: '左T型布局',
    style: 'background: #fff;',
    gridConfig: {
      columns: [1, 1], // 1fr 1fr
      rows: [1, 1],    // 1fr 1fr
      gap: 8
    },
    cells: [
      { rowSpan: 2 },
      {},
      {}
    ]
  },
  {
    name: '右T型布局',
    style: 'background: #fff;',
    gridConfig: {
      columns: [1, 1], // 1fr 1fr
      rows: [1, 1],    // 1fr 1fr
      gap: 8
    },
    cells: [
      {},
      { rowSpan: 2 },
      {}
    ]
  },
  // 4张图片布局模板
  {
    name: '田字格',
    style: 'background: #fff;',
    gridConfig: {
      columns: [1, 1], // 1fr 1fr
      rows: [1, 1],    // 1fr 1fr
      gap: 8
    },
    cells: [
      {},
      {},
      {},
      {}
    ]
  },
  {
    name: '横向四联',
    style: 'background: #fff;',
    gridConfig: {
      columns: [1, 1, 1, 1], // 1fr 1fr 1fr 1fr
      rows: [1],             // 1fr
      gap: 8
    },
    cells: [
      {},
      {},
      {},
      {}
    ]
  },
  {
    name: '竖向四联',
    style: 'background: #fff;',
    gridConfig: {
      columns: [1],          // 1fr
      rows: [1, 1, 1, 1],    // 1fr 1fr 1fr 1fr
      gap: 8
    },
    cells: [
      {},
      {},
      {},
      {}
    ]
  },
  {
    name: '正双T型布局',
    style: 'background: #fff;',
    gridConfig: {
      columns: [1, 1, 1], // 1fr 1fr 1fr
      rows: [1, 1],       // 1fr 1fr
      gap: 8
    },
    cells: [
      { columnSpan: 3 },
      {},
      {},
      {}
    ]
  },
  {
    name: '反双T型布局',
    style: 'background: #fff;',
    gridConfig: {
      columns: [1, 1, 1], // 1fr 1fr 1fr
      rows: [1, 1],       // 1fr 1fr
      gap: 8
    },
    cells: [
      {},
      {},
      {},
      { columnSpan: 3 }
    ]
  },
  {
    name: '左双T型布局',
    style: 'background: #fff;',
    gridConfig: {
      columns: [1, 1], // 1fr 1fr
      rows: [1, 1, 1], // 1fr 1fr 1fr
      gap: 8
    },
    cells: [
      { rowSpan: 3 },
      {},
      {},
      {}
    ]
  },
  {
    name: '右双T型布局',
    style: 'background: #fff;',
    gridConfig: {
      columns: [1, 1], // 1fr 1fr
      rows: [1, 1, 1], // 1fr 1fr 1fr
      gap: 8
    },
    cells: [
      {},
      { rowSpan: 3 },
      {},
      {}
    ]
  }
]

module.exports = {
  templates
}