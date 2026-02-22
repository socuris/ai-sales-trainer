const app = getApp();
Page({
  data: { question: '', loading: false, answer: null },
  onInput(e) { this.setData({ question: e.detail.value }); },
  async submit() {
    if (!this.data.question) return;
    this.setData({ loading: true });
    try {
      const res = await app.callFunction('ai', { type: 'qa', question: this.data.question });
      if (res.result.success) this.setData({ answer: res.result.data });
    } catch (e) { wx.showToast({ title: e.message, icon: 'none' }); }
    this.setData({ loading: false });
  }
});
