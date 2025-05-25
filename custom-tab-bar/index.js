Component({
  data: {
    selected: 0
  },
  attached() {
    this.updateSelected();
  },
  methods: {
    switchTab(e) {
      const path = e.currentTarget.dataset.path;
      wx.switchTab({ url: path });
      this.updateSelected();
    },
    onPlus() {
      wx.navigateTo({ url: '/pages/create/create' });
    },
    updateSelected() {
      const pages = getCurrentPages();
      if (!pages.length) return;
      const route = pages[pages.length - 1].route;
      console.log("zy:", route, pages);
      if (route === 'pages/profile/profile') {
        this.setData({ selected: 0 });
      } else if (route === 'pages/discover/discover') {
        this.setData({ selected: 1 });
      }
    }
  },
  pageLifetimes: {
    show() {
      this.updateSelected();
    }
  }
});
