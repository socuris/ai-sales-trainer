App({
  onLaunch() {
    // 初始化云开发
    if (wx.cloud) {
      wx.cloud.init({
        env: 'your-env-id' // TODO: 替换为你的云环境ID
      });
    }
  },
  
  // 调用云函数
  callFunction(name, data) {
    return wx.cloud.callFunction({ name, data });
  }
});
