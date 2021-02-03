// 贾-#67C23A; 史：#F56C6C; 王：#2acaca; 薛: #f69e6e
const NODES = [
  /*  {name: '贾府', level: 0, color: '#67C23A', children: [
       {name: '贾演', level: 1, color: '#67C23A', children: [
           {name: '贾代化（宁国府）', level: 2, color: '#67C23A', children: [
               {name: '贾敬', level: 3, color: '#67C23A', children: [
                   {name: '贾珍', level: 4, color: '#67C23A', children: [
                       {name: '贾惜春', level: 5, color: '#67C23A'},
                       {name: '贾荣', level: 5, relation: '秦可卿', color: '#67C23A'}
                   ]}
               ]}
           ]}
       ]},
       {name: '贾源', level: 1, color: '#67C23A', children: [
           {name: '贾代善（荣国府）', level: 2, color: '#F56C6C', relation: '贾母', relationFamily: '史', children: [
               {name: '贾赦', level: 3, relation: '邢夫人', color: '#67C23A', children: [
                   {name: '贾琏', level: 4, relation: '王熙凤', relationFamily: '王', color: '#2acaca', children: [
                       {name: '贾巧姐', level: 5, color: '#67C23A'}
                   ]},
                   {name: '贾迎春', level: 4, relation: '孙绍祖', color: '#67C23A'}
               ]},
               {name: '贾政', level: 3, relation: '王夫人', relationFamily: '王', color: '#2acaca', children: [
                   {name: '贾珠', level: 4, relation: '李纨', color: '#67C23A', children: [
                       {name: '贾兰', level: 5, color: '#67C23A'}
                   ]},
                   {name: '贾元春', level: 4, color: '#67C23A'},
                   {name: '贾宝玉', level: 4, relation: '薛宝钗', relationFamily: '薛', color: '#f69e6e'},
                   {name: '贾探春', level: 4, color: '#67C23A'},
                   {name: '贾环', level: 4, color: '#67C23A'}
               ]},
               {name: '贾敏', level: 3, relation: '林如海', color: '#67C23A', children: [
                   {name: '林黛玉', level: 4, color: '#67C23A'}
               ]}
           ]}
       ]}
   ]}, */
  {
    name: '史',
    level: 0,
    color: '#F56C6C',
    children: [{
      name: '史侯',
      level: 1,
      color: '#F56C6C',
      children: [{
          name: '史湘云祖父',
          level: 2,
          color: '#F56C6C',
          children: [{
              name: '史湘云父母',
              level: 3,
              color: '#F56C6C',
              children: [{
                  name: '史湘云',
                  level: 4,
                  color: '#F56C6C'
                },
                {
                  name: '卫若兰',
                  level: 4,
                  color: '#F56C6C'
                }
              ]
            },
            {
              name: '贾鼐',
              level: 3,
              color: '#F56C6C'
            },
            {
              name: '贾鼎',
              level: 3,
              color: '#F56C6C'
            }
          ]
        },
        {
          name: '贾母',
          level: 2,
          color: '#F56C6C'
        }
      ]
    }]
  },
  /* {name: '王', level: 0, color: '#2acaca', children: [
      {name: '身份不详', level: 1, color: '#2acaca', children: [
          {name: '王夫人之父', level: 2, color: '#2acaca', children: [
              {name: '王熙凤父母', level: 3, color: '#2acaca', children: [
                  {name: '王仁', level: 4, color: '#2acaca'},
                  {name: '巧姐之二舅', level: 4, color: '#2acaca'},
                  {name: '王熙凤', level: 4, color: '#2acaca'}
              ]},
              {name: '王子腾', level: 3, color: '#2acaca', children: [
                  {name: '王子腾之女', level: 4, relation: '保宁侯之子', color: '#2acaca'}
              ]},
              {name: '王夫人', level: 3, color: '#2acaca'},
              {name: '薛姨妈', level: 3, color: '#2acaca'}
          ]}
      ]}
  ]},
  {name: '薛', level: 0, color: '#f69e6e', children: [
      {name: '身份未知', level: 1, color: '#f69e6e', children: [
          {name: '身份未知', level: 2, color: '#f69e6e', children: [
              {name: '薛蟠之父', level: 3, relation: '薛姨妈', relationFamily: '王', color: '#2acaca', children: [
                  {name: '薛蟠', level: 4, relation: '夏金桂', color: '#f69e6e', children: [
                      {name: '（妾）甄英莲', level: 5, color: '#f69e6e'},
                      {name: '（妾）宝蟾', level: 5, color: '#f69e6e'}
                  ]},
                  {name: '薛宝钗', level: 4, color: '#f69e6e'}
              ]}, 
              {name: '薛宝琴父母', level: 3, color: '#f69e6e', children: [
                  {name: '薛蝌', level: 4, relation: '邢轴烟', color: '#f69e6e'},
                  {name: '薛宝琴', level: 4, relation: '梅翰林之子', color: '#f69e6e'}
              ]}
          ]}
      ]}
  ]} */
]

export default {
  NODES,
}
