var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var utils = require("../../utils/util.js");
Page({
  data: {
    commercialTotal: 1000000,
    lpr:4.65,
    or:4.9,
    jj:3.25,
    gjjTotal: 500000,
    lprs:[3.85,4.65],
    ors:[4.35,4.90],
    jjs:[2.75,3.25],
    tabs: ["商业贷款", "公积金贷款", "组合贷款"],
    activeIndex: 0,
    loansType: ['按房价总额', '按贷款总额'],
    loanIndex: 0,
    rateMethodsName:[
      "按最新LPR","按旧版基准利率"
    ],
    ratesName: [
       [],[]
    ],
    rates: [
      [],
      []
    ],
    rateIndex:0,
    rateIndex0: 6,
    rateIndex1: 6,
    percentArr: [7, 6, 5, 4, 3, 2],
    percentIndex: 0,
    years: [30, 25, 20, 15, 10],
    yearIndex: 20,

    sliderOffset: 0,
    sliderLeft: 0
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    this.setRatesName()
  },
  loanChange(e) {
    this.setData({
      loanIndex: e.detail.value
    });
  },
  rateMethods(e) {
    
    this.setRatesName(e.detail.value)
     
    this.setData({
      rateIndex: e.detail.value
    });
   
  },
  rateChange0(e) {
    this.setData({
      rateIndex0: e.detail.value
    });
  },
  rateChange1(e) {
    this.setData({
      rateIndex1: e.detail.value
    });
  },
  percentChange(e) {
    this.setData({
      percentIndex: e.detail.value
    });
  },
  setRatesName(index){
    let ratesName = utils.deepCopy(this.data.ratesName) 
    let rates = utils.deepCopy(this.data.rates) 
    let arr =[],
        arr1=[],
        jjarr=[],//公积金
        jjarr1=[]
    let rate=[-7,-7.5,-8,-8.5,-9,-9.5,0,0.5,1,1.5,2,2.5,3,3.5,4]
    let type = this.data.lpr
    let text = 'lpr'
    let jj = this.data.jj
    let rateIndex = index || this.data.rateIndex
    if(rateIndex == 0){//lpr
      type = this.data.lpr
      text = 'lpr'
      
    }else if(rateIndex == 1){//基准利率
      type = this.data.or
      text = '固定'
    }
    rate.forEach(list=>{
      let {l,r} = this.calc(list,type)
      let o = this.calc(list,jj)
      let jl=o.l,jr=o.r
      let str = list>0?`${text}基准值的${1+list/10}倍（${r}%）`:list==0?`${text}基准值（${r}%）`:`${text}基准值打${-list}折（${r}%）`
      let jjstr = list>0?`公积金基准值的${1+list/10}倍（${jr}%）`:list==0?`公积金基准值（${jr}%）`:`公积金基准值打${-list}折（${jr}%）`
      arr.push(str)
      arr1.push(l/10000)
      jjarr.push(jjstr)
      jjarr1.push(jl/10000)
    })
    ratesName[0] = arr
    ratesName[1] = jjarr
    rates[0] = arr1
    rates[1] = jjarr1
    this.setData({
      ratesName: ratesName,
      rates:rates
    });
  },
  calc(ll,t){
    let l =0
    if(ll<0){
      l = Math.round((-ll*0.1*t)*100)
    }else  l = Math.round((Number(t)+Number(ll*0.1*t))*100)
    let r =  utils.insertStr(l,-2,'.')
    return {l,r}
  },
  yearChange(e) {
    let or =this.data.or ;
    let lpr =this.data.lpr;
    let jj = this.data.jj ;
    if(this.data.activeIndex == 0){
      if(e.detail.value<5){
         or = this.data.ors[0];
         lpr = this.data.lprs[0];
      }else {
        or = this.data.ors[1];
        lpr = this.data.lprs[1];
      }
    }
    if(this.data.activeIndex == 1){
      if(e.detail.value<5){
        jj = this.data.jjs[0];
         
      }else {
        jj = this.data.jjs[1];
       
      }
    }
    if(this.data.activeIndex == 2){
      if(e.detail.value<5){
         or = this.data.ors[0];
         lpr = this.data.lprs[0];
         jj = this.data.jjs[0];
      }else {
        or = this.data.ors[1];
        lpr = this.data.lprs[1];
        jj = this.data.jjs[1];
      }
    }
   
    this.setData({
      yearIndex: e.detail.value,
      or,
      lpr,
      jj
    });
    setTimeout(()=>{
      this.setRatesName()
    })
  },
  lprChange(e) {
    this.setData({
      lpr: e.detail.value
    });
    setTimeout(()=>{
      this.setRatesName()
    })
  },
  orChange(e) {
    this.setData({
      or: e.detail.value
    });
    setTimeout(()=>{
      this.setRatesName()
    })
  },
  commercialTotalChange(e) {
    this.setData({
      commercialTotal: e.detail.value
    });
  },
  gjjTotalChange(e) {
    this.setData({
      gjjTotal: e.detail.value
    });
  },
  showDetail() {
    var commercialTotal;
    var gjjTotal;
    var interestRatePerMou0;
    var interestRatePerMou1;
    var totalMouths;
    commercialTotal = this.data.loanIndex == 1 || this.data.activeIndex == 2 ? this.data.commercialTotal : this.data.commercialTotal * this.data.percentArr[this.data.percentIndex] / 10;
    gjjTotal = this.data.loanIndex == 1 || this.data.activeIndex == 2 ? this.data.gjjTotal : this.data.gjjTotal * this.data.percentArr[this.data.percentIndex] / 10;
    interestRatePerMou0 = this.data.rates[0][this.data.rateIndex0];
    interestRatePerMou1 = this.data.rates[1][this.data.rateIndex1];
    totalMouths = this.data.yearIndex * 12;
    wx.navigateTo({
      url: './detail/detail?parentActiveIndex=' + this.data.activeIndex + '&commercialTotal=' + commercialTotal + '&gjjTotal=' + gjjTotal + '&interestRatePerMou0=' + interestRatePerMou0 + '&interestRatePerMou1=' + interestRatePerMou1 + '&totalMouths=' + totalMouths
    })
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    setTimeout(()=>{
      this.setRatesName()
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '房贷计算',
      path: '/pages/mortgage/mortgage',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
});