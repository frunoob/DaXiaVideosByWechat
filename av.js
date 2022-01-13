    // 获取 AV 命名空间的方式根据不同的安装方式而异，这里假设是通过手动导入文件的方式安装的 SDK
    export var AV = require('./libs/av-core-min.js');
    export var adapters = require('./libs/leancloud-adapters-weapp.js');
    
    AV.setAdapters(adapters);
    AV.init({
      appId: 'EMvWB4MFkVYX9zOu8mPrXden-MdYXbMMI',
      appKey: 'uYYPYEbPfEbUKUym6Bf3Qco4',
      // 请将 xxx.example.com 替换为你的应用绑定的自定义 API 域名
    });