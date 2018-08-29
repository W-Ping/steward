// components/selectable.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  // externalClasses: ['selectable','selectable-box'],
  attached: function() {

  },
  /**
   * 组件的属性列表
   */
  properties: {
    selectItems: Array,
    selectedItem: Object,
    multiSelect: Boolean,
    name_key: String,
    value_key: String,
    image_key: String,
  },

  /**
   * 组件的初始数据
   */
  data: {
    isHidden: true,
    multiSelect: false, //false:单选；true:多选
    selectItems: [], //数据
    selectedItems: [], //选中的数据
    name_key: 'name',
    value_key: 'value',
    image_key: 'image'
  },
  detached: function() {},
  /**
   * 组件的方法列表
   */
  methods: {
    closeSelect(e) {
      this.setData({
        isHidden: !this.data.isHidden,
      })
      this.triggerEvent("closeSelect");
    },
    showSelect(e) {
      console.log(e);
      var selectItems = this.data.selectItems;
      console.log("数据格式转换前", selectItems)
      var name_key = this.data.name_key;
      var value_key = this.data.value_key;
      var image_key = this.data.image_key;
      if (selectItems && selectItems.length > 0) {
        //数据格式转换
        for (var i = 0; i < selectItems.length; i++) {
          // var converItem = {};
          var item = selectItems[i]
          item['name'] = item[name_key];
          item['value'] = item[value_key];
          item['image'] = item[image_key];
          // selectItems[i] = converItem;
        }
        console.log("数据格式转换后", selectItems)
      }
      this.setData({
        isHidden: !this.data.isHidden,
        selectItems: selectItems
      })
    },
    _selectedItem: function(e) {
      // console.log(e);
      var checked = e.detail.value
      var index = e.currentTarget.dataset.index;
      var changed = {}
      var selectItems = this.data.selectItems;
      var selectedItems = this.data.selectedItems;
      var multiSelect = this.data.multiSelect
      for (var i = 0; i < selectItems.length; i++) {
        if (index == i) {
          var currIndex = selectedItems.indexOf(selectItems[i]);
          if (currIndex !== -1) {
            changed['selectItems[' + i + '].checked'] = false;
            selectedItems.splice(currIndex, 1);
          } else {
            if (!multiSelect) { //单选
              selectedItems = [];
              changed['selectItems[' + i + '].checked'] = true;
              selectedItems.push(selectItems[i]);
            } else {
              changed['selectItems[' + i + '].checked'] = true;
              selectedItems.push(selectItems[i]);
            }
          }
        } else {
          if (!multiSelect) {
            changed['selectItems[' + i + '].checked'] = false;
          }
        }
      }
      changed.selectedItems = selectedItems;
      this.setData(changed)
      this.triggerEvent("selected", {
        composed: true
      });
    }
  }
})