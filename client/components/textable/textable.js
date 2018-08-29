// components/textable/textable.js
Component({
  behaviors: ['wx://form-field'],
  externalClasses: ['textable-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder: String,
    width: String,
    height: String,
    textClass: String
  },
  attached() {},
  /**
   * 组件的初始数据
   */
  data: {
    width: '60px',
    height: '30px',
    value: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _clickEvent: function(e) {
      this.triggerEvent("click");
    }
  }
})