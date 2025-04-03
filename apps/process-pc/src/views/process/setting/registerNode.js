const registerNode = G6Editor => {
  const { Flow } = G6Editor;

  Flow.registerNode('common-node', {
    draw(item) {
      const group = item.getGraphicGroup();
      const model = item.getModel();
      const width = 240;
      const height = 36;
      const x = -width / 2;
      const y = -height / 2;
      const borderRadius = 18;
      const keyShape = group.addShape('rect', {
        attrs: {
          x,
          y,
          width,
          height,
          radius: borderRadius
        }
      });
      group.addShape('path', {
        attrs: {
          fill: '#1890ff'
        }
      });
      group.addShape('text', {
        attrs: {
          text: model.title,
          x: x + this.text_x,
          y: y + 25,
          fill: '#fff',
          fontSize: 14
        }
      });
      return keyShape;
    }
  });
  Flow.registerNode('business-node', {
    draw(item) {
      const group = item.getGraphicGroup();
      const model = item.getModel();
      const width = 240;
      const height = 72;
      const x = -width / 2;
      const y = -height / 2;
      const borderRadius = 2;
      const keyShape = group.addShape('rect', {
        attrs: {
          x,
          y,
          width,
          height,
          radius: borderRadius,
          fill: 'white',
          stroke: '#dadce0'
        }
      });
      group.addShape('rect', {
        attrs: {
          x,
          y,
          width,
          height: height / 2,
          radius: borderRadius,
          fill: this.color_type
        }
      });
      group.addShape('text', {
        attrs: {
          text: model.title,
          x: x + 10,
          y: y + 27,
          fill: '#fff',
          fontSize: 14
        }
      });
      const content = model.content ? model.content : this.content;
      const color = model.content ? '#333' : '#BFBFBF';
      group.addShape('text', {
        attrs: {
          text: content,
          x: x + 10,
          y: y + 62,
          fill: color,
          fontSize: 12
        }
      });
      return keyShape;
    },
    anchor: [
      [0.5, 0],
      [0.5, 1]
    ]
  });
  Flow.registerNode('condition-node', {
    draw(item) {
      const group = item.getGraphicGroup();
      const model = item.getModel();
      const width = 240;
      const height = 72;
      const x = -width / 2;
      const y = -height / 2;
      const borderRadius = 2;
      const keyShape = group.addShape('rect', {
        attrs: {
          x,
          y,
          width,
          height,
          radius: borderRadius,
          fill: 'white',
          stroke: '#dadce0'
        }
      });
      group.addShape('rect', {
        attrs: {
          x,
          y: y + height / 2,
          width,
          height: 1,
          fill: '#E0E0E0'
        }
      });
      group.addShape('text', {
        attrs: {
          text: model.title,
          x: x + 10,
          y: y + 27,
          fill: '#FCA315',
          fontSize: 14
        }
      });
      const content = model.content ? model.content : '请添加条件';
      const color = model.content ? '#333' : '#BFBFBF';
      group.addShape('text', {
        attrs: {
          text: content,
          x: x + 10,
          y: y + 62,
          fill: color,
          fontSize: 12
        }
      });
      return keyShape;
    },
    anchor: [
      [0.5, 0],
      [0.5, 1]
    ]
  });
  Flow.registerNode('rhombus-node', {
    draw(item) {
      const group = item.getGraphicGroup();
      const model = item.getModel();
      const width = 240;
      const height = 72;
      const x = -width / 2;
      const y = -height / 2;
      const keyShape = group.addShape('rect', {
        attrs: {
          x,
          y,
          width,
          height,
          fill: this.color_type,
          lineWidth: 0,
          stroke: 'white'
        }
      });
      group.addShape('rect', {
        attrs: {
          x,
          y,
          width,
          height,
          fill: this.color_type,
          stroke: 'white'
        }
      });
      group.addShape('path', {
        attrs: {
          path: [
            ['M', x, y + height / 2],
            ['L', x, y],
            ['A', x, y - width / 4],
            ['L', x + width / 2, y]
          ],
          fill: 'white'
        }
      });
      group.addShape('path', {
        attrs: {
          path: [
            ['M', x + width, y + height / 2],
            ['L', x + width, y],
            ['A', x, y - width / 4],
            ['L', x + width / 2, y]
          ],
          fill: 'white'
        }
      });
      group.addShape('path', {
        attrs: {
          path: [
            ['M', x, y + height],
            ['L', x, y + height / 2],
            ['A', x, y + height],
            ['L', x + width / 2, y + height]
          ],
          fill: 'white'
        }
      });
      group.addShape('path', {
        attrs: {
          path: [
            ['M', x + width, y + height],
            ['L', x + width, y + height / 2],
            ['A', x, y + height],
            ['L', x + width / 2, y + height]
          ],
          fill: 'white'
        }
      });
      group.addShape('text', {
        attrs: {
          text: model.title,
          x: x + 90,
          y: y + 45,
          fill: '#fff',
          fontSize: 14
        }
      });
      return keyShape;
    }
  });
  Flow.registerNode(
    'start-node',
    {
      text_x: 100,
      anchor: [[0.5, 1]]
    },
    'common-node'
  );
  Flow.registerNode(
    'end-node',
    {
      text_x: 107,
      anchor: [[0.5, 0]]
    },
    'common-node'
  );
  Flow.registerNode(
    'approve-node',
    {
      color_type: '#FB602D',
      content: '请添加审批人'
    },
    'business-node'
  );
  Flow.registerNode(
    'copy-node',
    {
      color_type: '#6BC2FC',
      content: '请添加抄送人'
    },
    'business-node'
  );
  Flow.registerNode(
    'handle-node',
    {
      color_type: '#FF9552',
      content: '请添加办理人'
    },
    'business-node'
  );
  Flow.registerNode(
    'parallel-approve-node',
    {
      color_type: '#576A95',
      content: '请添加并行审批人'
    },
    'business-node'
  );
  Flow.registerNode(
    'parallel-handle-node',
    {
      color_type: '#1FCE76',
      content: '请添加并行办理人'
    },
    'business-node'
  );
  Flow.registerNode(
    'condition-start-node',
    {
      color_type: '#D7613F'
    },
    'rhombus-node'
  );
  Flow.registerNode(
    'parallel-start-node',
    {
      color_type: '#5624D4'
    },
    'rhombus-node'
  );
};

export default registerNode;
