const app = getApp();
Page({
  goToQA() { wx.switchTab({ url: '/pages/qa/qa' }); },
  goToTraining() { wx.switchTab({ url: '/pages/training/training' }); },
  goToSummary() { wx.switchTab({ url: '/pages/summary/summary' }); }
});
