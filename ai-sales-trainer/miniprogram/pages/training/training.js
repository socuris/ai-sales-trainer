const app = getApp();
Page({
  data: { question: null, answer: '', loading: false, result: null },
  async start() {
    this.setData({ loading: true });
    const res = await app.callFunction('ai', { type: 'training', question: '生成销售训练题目' });
    if (res.result.success) this.setData({ question: res.result.data });
    this.setData({ loading: false });
  },
  onAnswer(e) { this.setData({ answer: e.detail.value }); },
  async submit() {
    if (!this.data.answer) return;
    this.setData({ loading: true });
    const res = await app.callFunction('ai', { type: 'training', question: this.data.question.题目, context: { user_answer: this.data.answer } });
    if (res.result.success) this.setData({ result: res.result.data });
    this.setData({ loading: false });
  },
  next() { this.setData({ question: null, answer: '', result: null }); this.start(); }
});
