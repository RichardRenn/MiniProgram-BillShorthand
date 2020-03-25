// miniprogram/pages/bills/bills.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconSize: 25,
    lineDatas: [],
    totalAmount: 0.0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try {
      var totalAmount = 0.0
      var lineDatas = wx.getStorageSync('billLineDatas')

      if (lineDatas) {
        for (let j = 0, len = lineDatas.length; j < len; j++) {
          totalAmount += lineDatas[j].money
        }
        this.setData({
          lineDatas: lineDatas,
          totalAmount: totalAmount,
        })
      }
    } catch (e) {
      console.log(e)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    try {
      var totalAmount = 0.0
      var lineDatas = wx.getStorageSync('billLineDatas')

      if (lineDatas) {
        for (let j = 0, len = lineDatas.length; j < len; j++) {
          totalAmount += lineDatas[j].money
        }
        this.setData({
          lineDatas: lineDatas,
          totalAmount: totalAmount,
        })
      }
    } catch (e) {
      console.log(e)
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.setStorage({
      key: "billLineDatas",
      data: this.data.lineDatas,
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.setStorage({
      key: "billLineDatas",
      data: this.data.lineDatas,
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 增加一行
   */
  addLine: function () {
    var lineDatas = this.data.lineDatas
    var newLineData = {
      name: "",
      num: 0.0,
      price: 0.0,
      money: 0.0
    }
    lineDatas.push(newLineData) // 添加数组内容，使for循环多一次
    this.setData({
      lineDatas: lineDatas,
    })
    wx.setStorage({
      key: "billLineDatas",
      data: this.data.lineDatas,
    })
  },

  /**
   * 删除所有行
   */
  delAllLine: function () {
    this.setData({
      lineDatas: [],
    })
    wx.setStorage({
      key: "billLineDatas",
      data: this.data.lineDatas,
    })
  },
  
  /**
   * 改变一行的金额
   */
  changeMoney: function (e) {
    var totalAmount = 0.0
    var lineDatas = this.data.lineDatas
    // console.log(e)
    var dataset = e.currentTarget.dataset
    var value = e.detail.value
    var idx = dataset.idx
    var prop = dataset.prop
    if (prop == "name") {
      lineDatas[idx].name = value
    } else if (prop == "num") {
      lineDatas[idx].num = value
    } else if (prop == "price") {
      lineDatas[idx].price = value
    }
    lineDatas[idx].money = lineDatas[idx].num * lineDatas[idx].price

    for (let j = 0, len = lineDatas.length; j < len; j++) {
      totalAmount += lineDatas[j].money
    }
    this.setData({
      lineDatas: lineDatas,
      totalAmount: totalAmount,
    })
    wx.setStorage({
      key: "billLineDatas",
      data: this.data.lineDatas,
    })
    // console.log(this.data.lineDatas)
  },

  /**
   * 在当前行后增加一行
   */
  addPosLine: function (e) {
    var lineDatas = this.data.lineDatas
    // console.log(e)
    var dataset = e.currentTarget.dataset
    var idx = dataset.idx
    var newLineData = {
      name: "",
      num: 0.0,
      price: 0.0,
      money: 0.0
    }
    lineDatas.splice(idx+1, 0, newLineData) // 在数组中对应位置增加元素

    this.setData({
      lineDatas: lineDatas,
    })
    wx.setStorage({
      key: "billLineDatas",
      data: this.data.lineDatas,
    })
  },

  /**
   * 删除当前行
   */
  delPosLine: function(e) {
    var totalAmount = 0.0
    var lineDatas = this.data.lineDatas
    // console.log(e)
    var dataset = e.currentTarget.dataset
    var idx = dataset.idx
    lineDatas.splice(idx, 1) // 删除数组中对应的元素

    for (let j = 0, len = lineDatas.length; j < len; j++) {
      totalAmount += lineDatas[j].money
    }
    this.setData({
      lineDatas: lineDatas,
      totalAmount: totalAmount,
    })
    wx.setStorage({
      key: "billLineDatas",
      data: this.data.lineDatas,
    })
  },
})