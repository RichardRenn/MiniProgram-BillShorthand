// miniprogram/pages/bills/bills.js
var app = getApp()
var util = require('../../utils/util.js')
var calExp = require('../../utils/calExp.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        iconSize: 25,
        isEditMode: true,
        title: "",
        lineData: [],
        totalAmount: "0.00",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // try {
        //   // var lineData = wx.getStorageSync('billLineData')
        //   var encodeBillLineData = options.encodeBillLineData
        //   if (typeof (encodeBillLineData) != "undefined") {
        //     var lineData = JSON.parse(decodeURIComponent(encodeBillLineData))
        //     var title = options.title
        //     console.log('onLoad数据 - 来自URL参数:' + title + '--' + lineData)
        //   } else {
        //     var lineData = wx.getStorageSync('billLineData')
        //     var title = wx.getStorageSync('billTitle')
        //     console.log('onLoad数据 - 来自本地存储:' + title + '--' + lineData)
        //   }

        //   if (lineData) {
        //     this.refreshLineData(lineData)
        //   }
        // } catch (e) {
        //   console.log('onLoad数据加载错误: ' + e)
        // }
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
            var that = this
            // 获取当前小程序的页面栈
            var pages = getCurrentPages()
            // 数组中索引最大的页面--当前页面
            var currentPage = pages[pages.length - 1]
            var options = currentPage.options
            // 打印出当前页面中的 options
            // console.log(options)
            // var lineData = wx.getStorageSync('billLineData')
            var encodeBillLineData = options.encodeBillLineData
            if (typeof (encodeBillLineData) != "undefined") {
                var lineData = JSON.parse(decodeURIComponent(encodeBillLineData))
                var title = options.title
                var isEditMode = false
                console.log('onShow数据 - 来自URL参数:' + title + '--' + lineData)
            } else {
                var lineData = wx.getStorageSync('billLineData')
                var title = wx.getStorageSync('billTitle')
                var isEditMode = true
                console.log('onShow数据 - 来自本地存储:' + title + '--' + lineData)
            }
            that.setData({
                title: title,
                isEditMode: isEditMode
            })
            if (lineData) {
                that.refreshLineData(lineData)
            }
        } catch (e) {
            console.log('onShow数据加载错误: ' + e)
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        var that = this
        wx.setStorage({
            key: "billTitle",
            data: that.data.title,
        })
        wx.setStorage({
            key: "billLineData",
            data: that.data.lineData,
        })
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        var that = this
        wx.setStorage({
            key: "billTitle",
            data: that.data.title,
        })
        wx.setStorage({
            key: "billLineData",
            data: that.data.lineData,
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
     * 用户点击右上角分享/转发
     */
    onShareAppMessage: function () {
        try {
            var that = this
            var curTime = util.formatTime(new Date())
            var encodeBillLineData = encodeURIComponent(JSON.stringify(that.data.lineData))
            var title = that.data.title
            // console.log('onShare数据: ' + encodeBillLineData)
            return {
                title: title + " " + curTime,
                desc: title,
                path: '/pages/bills/bills?title=' + title + '&encodeBillLineData=' + encodeBillLineData // 路径，传递参数到指定页面。
            }
        } catch (e) {
            console.log('账单页分享错误: ' + e)
        }
    },

    /**
     * 改变标题
     */
    changeTitle: function (e) {
        var that = this
        var dataset = e.currentTarget.dataset
        var title = e.detail.value
        console.log(title)
        that.setData({
            title: title,
        })
        wx.setStorage({
            key: "billTitle",
            data: that.data.title,
        })
    },

    /**
     * 增加一行
     */
    addLine: function () {
        var that = this
        var lineData = that.data.lineData
        var newLineData = {
            name: "",
            money: "0.00",
        }
        lineData.push(newLineData) // 添加数组内容，使for循环多一次
        that.setData({
            lineData: lineData,
        })
        wx.setStorage({
            key: "billLineData",
            data: that.data.lineData,
        })
    },

    /**
     * 删除所有行
     */
    delAllLine: function () {
        var that = this
        wx.showModal({
            title: '清空账单',
            content: '确定要清空当前账单吗？',
            confirmColor: app.globalData.red,
            success(res) {
                if (res.confirm) {
                    console.log('清空账单操作: 用户点击确定')
                    that.setData({
                        lineData: [],
                        title: "",
                        totalAmount: "0.00",
                    })
                    wx.setStorage({
                        key: "billTitle",
                        data: that.data.title,
                    })
                    wx.setStorage({
                        key: "billLineData",
                        data: that.data.lineData,
                    })
                } else if (res.cancel) {
                    console.log('清空账单操作: 用户点击取消')
                }
            }
        })

    },

    /**
     * 改变一行的金额
     */
    changeLineData: function (e) {
        var that = this
        var lineData = that.data.lineData
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

        // console.log(lineData[idx].price)
        // console.log(typeof(lineData[idx].price))
        if (typeof (lineData[idx].num) == "undefined" || typeof (lineData[idx].price) == "undefined") {
            console.log("数量或者单价未定义")
        } else {
            lineData[idx].money = (calExp.calExp(lineData[idx].num) * calExp.calExp(lineData[idx].price)).toFixed(2)
            that.refreshLineData(lineData)
        }
    },

    /**
     * 在当前行后增加一行
     */
    addPosLine: function (e) {
        var that = this
        var lineData = that.data.lineData
        // console.log(e)
        var dataset = e.currentTarget.dataset
        var idx = dataset.idx
        var newLineData = {
            name: "",
            money: "0.00",
        }
        lineData.splice(idx + 1, 0, newLineData) // 在数组中对应位置增加元素

        that.refreshLineData(lineData)
    },

    /**
     * 删除当前行
     */
    delPosLine: function (e) {
        var that = this
        var lineData = that.data.lineData
        // console.log(e)
        var dataset = e.currentTarget.dataset
        var idx = dataset.idx
        lineData.splice(idx, 1) // 删除数组中对应的元素

        that.refreshLineData(lineData)
    },

    /**
     * 刷新数据
     */
    refreshLineData: function (lineData) {
        try {
            var that = this
            var totalAmount = 0.00
            for (let j = 0, len = lineData.length; j < len; j++) {
                totalAmount += parseFloat(lineData[j].money)
            }
            that.setData({
                lineData: lineData,
                totalAmount: totalAmount.toFixed(2),
            })
            console.log('totalAmount: ' + that.data.totalAmount)
            wx.setStorage({
                key: "billLineData",
                data: that.data.lineData,
            })
        } catch (e) {
            console.log('刷新数据错误: ' + e)
        }
    },

    /**
     * 保存
     */
    // clickSave: function () {
    //   this.setData({
    //     isEditMode: false
    //   })
    // },

    /**
     * 编辑
     */
    clickEdit: function () {
        var that = this
        var isEditMode = that.data.isEditMode
        that.setData({
            isEditMode: !isEditMode
        })
    },

})
