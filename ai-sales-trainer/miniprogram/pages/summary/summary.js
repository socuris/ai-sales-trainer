const app = getApp();
Page({
  data: { name: '', need: '', budget: '', isDeal: false, loading: false, result: null },
  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [field === 'need' ? 'need' : field]: e.detail.value });
  },
  onDeal(e) { this.setData({ isDeal: e.detail.value }); },
  async generate() {
    if (!this.data.name || !this.data.need) return wx.showToast({ title: '请填写姓名和需求', icon: 'none' });
    this.setData({ loading: true });
    const res = await app.callFunction('ai', { 
      type: 'summary', 
      context: { 
        customer_name: this.data.name, 
        需求: this.data.need, 
        budget: this.data.budget, 
        is_deal: this.data.isDeal 
      }
    });
    if (res.result.success) this.setData({ result: res.result.data });
    this.setData({ loading: false });
  },
  copy() { wx.setClipboardData({ data: this.data.result.微信草稿 }); }
});
