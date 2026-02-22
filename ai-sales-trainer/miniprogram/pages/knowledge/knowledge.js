const app = getApp();
Page({
  data: { title: '', content: '', loading: false, docs: [] },
  onLoad() { this.load(); },
  onTitle(e) { this.setData({ title: e.detail.value }); },
  onContent(e) { this.setData({ content: e.detail.value }); },
  async add() {
    if (!this.data.title || !this.data.content) return;
    this.setData({ loading: true });
    await app.callFunction('knowledge', { action: 'add', data: { title: this.data.title, content: this.data.content } });
    this.setData({ title: '', content: '', loading: false });
    this.load();
  },
  async load() {
    const res = await app.callFunction('knowledge', { action: 'list' });
    if (res.result.success) this.setData({ docs: res.result.data });
  }
});
