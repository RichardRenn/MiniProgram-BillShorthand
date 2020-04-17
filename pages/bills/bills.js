// miniprogram/pages/bills/bills.js
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconSize: 25,
    lineData: [],
    totalAmount: "0.00",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try {
      // var lineData = wx.getStorageSync('billLineData')
      var encodeBillLineData = options.encodeBillLineData
      if (typeof (encodeBillLineData) != "undefined") {
        var lineData = JSON.parse(decodeURIComponent(encodeBillLineData))
        // console.log('lineData1:' + lineData)
      } else {
        var lineData = wx.getStorageSync('billLineData')
        // console.log('lineData2:' + lineData)
      }
      // console.log('lineData3:' + lineData)
      console.log('onLoad数据: ' + lineData)

      if (lineData) {
        this.refreshData(lineData)
      }
    } catch (e) {
      console.log('onLoad数据加载错误: ' + e)
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
      var lineData = wx.getStorageSync('billLineData')
      console.log('onShow数据: ' + lineData)
      if (lineData) {
        this.refreshData(lineData)
      }
    } catch (e) {
      console.log('onShow数据加载错误: ' + e)
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.setStorage({
      key: "billLineData",
      data: this.data.lineData,
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.setStorage({
      key: "billLineData",
      data: this.data.lineData,
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
    try {
      var curTime = util.formatTime(new Date());
      var encodeBillLineData = encodeURIComponent(JSON.stringify(this.data.lineData))
      console.log('onShare数据: ' + encodeBillLineData)
      return {
        title: curTime,
        desc: '我创建的账单',
        path: '/pages/bills/bills?encodeBillLineData=' + encodeBillLineData // 路径，传递参数到指定页面。
      }
    } catch (e) {
      console.log('分享数据错误: ' + e)
    }
  },

  /**
   * 增加一行
   */
  addLine: function () {
    var lineData = this.data.lineData
    var newLineData = {
      name: "",
      num: 0.00,
      price: 0.00,
      money: "0.00",
    }
    lineData.push(newLineData) // 添加数组内容，使for循环多一次
    this.setData({
      lineData: lineData,
    })
    wx.setStorage({
      key: "billLineData",
      data: this.data.lineData,
    })
  },

  /**
   * 删除所有行
   */
  delAllLine: function () {
    this.setData({
      lineData: [],
    })
    wx.setStorage({
      key: "billLineData",
      data: this.data.lineData,
    })
  },
  
  /**
   * 改变一行的金额
   */
  changeLineData: function (e) {
    var lineData = this.data.lineData
    // console.log(e)
    var dataset = e.currentTarget.dataset
    var value = e.detail.value
    var idx = dataset.idx
    var prop = dataset.prop
    if (prop == "name") {
      lineData[idx].name = value
    } else if (prop == "num") {
      lineData[idx].num = value
    } else if (prop == "price") {
      lineData[idx].price = value
    }
    lineData[idx].money = (lineData[idx].num * lineData[idx].price).toFixed(2)

    this.refreshData(lineData)
    // console.log(this.data.lineData)
  },

  /**
   * 在当前行后增加一行
   */
  addPosLine: function (e) {
    var lineData = this.data.lineData
    // console.log(e)
    var dataset = e.currentTarget.dataset
    var idx = dataset.idx
    var newLineData = {
      name: "",
      num: 0.00,
      price: 0.00,
      money: "0.00",
    }
    lineData.splice(idx+1, 0, newLineData) // 在数组中对应位置增加元素

    this.refreshData(lineData)
  },

  /**
   * 删除当前行
   */
  delPosLine: function(e) {
    var lineData = this.data.lineData
    // console.log(e)
    var dataset = e.currentTarget.dataset
    var idx = dataset.idx
    lineData.splice(idx, 1) // 删除数组中对应的元素
    
    this.refreshData(lineData)
  },
  
  /**
   * 刷新数据
   */
  refreshData: function (lineData) {
    try {
      var totalAmount = 0.00
      for (let j = 0, len = lineData.length; j < len; j++) {
        totalAmount += parseFloat(lineData[j].money)
      }
      this.setData({
        lineData: lineData,
        totalAmount: totalAmount.toFixed(2),
      })
      wx.setStorage({
        key: "billLineData",
        data: this.data.lineData,
      })
    } catch (e) {
      console.log('刷新数据错误: ' + e)
    }
  },
})
