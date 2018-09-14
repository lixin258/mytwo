var log = function (s1, s2) {
  console.log(s1);
  console.log(s2);
};

function closeWin() {
  api.closeWin();
}

var Enum = {
  RechargeStatus: [{"key": "0,1,2,3", "value": "全部"}, {"key": "0", "value": "充值中"}, {
    "key": "1",
    "value": "待审核",
    "fontColor": "aui-text-info"
  }, {"key": "2", "value": "充值成功", "fontColor": "aui-text-success"}, {
    "key": "3",
    "value": "充值失败",
    "fontColor": "aui-text-danger"
  }],
  WithdrawStatus: [{"key": "0,1,2,3", "value": "全部"}, {
    "key": "1",
    "value": "待审核",
    "fontColor": "aui-text-info"
  }, {"key": "2", "value": "提现成功", "fontColor": "aui-text-success"}, {
    "key": "3",
    "value": "提现失败",
    "fontColor": "aui-text-danger"
  }],
  RecordType: {Recharge: 1, Withdraw: 2},
  DealType: {Buy: 0, Sell: 1},
  UserStatus: [{"key": "0", "value": "待审核", "fontColor": "aui-text-info"}, {
    "key": "1",
    "value": "审核通过",
    "fontColor": "aui-text-success"
  }, {"key": "2", "value": "审核未通过", "fontColor": "aui-text-danger"}],
  BonusLevel: [{"key": "0", "value": "一级推广"}, {"key": "1", "value": "二级推广"}],
  OrderStatus: [{"key": "1", "value": "待支付", "fontColor": "aui-text-info"}, {
    "key": "2",
    "value": "待发货",
    "fontColor": "aui-text-info"
  }, {"key": "3", "value": "待签收", "fontColor": "aui-text-info"}, {
    "key": "4",
    "value": "交易完成",
    "fontColor": "aui-text-success"
  }, {"key": "5", "value": "交易取消", "fontColor": "aui-text-danger"}],
};
var Tool = {
  /**
   * 打开一个新窗口
   */
  openWin: function (param) {
    api.openWin({
      name: param.name || new Date().getTime(),
      url: api.wgtRootDir + param.url,
      reload: true,
      vScrollBarEnabled: false,
      slidBackEnabled: false,
      bounces: false,
      delay: param.delay || 300,
      animation: {
        type: "movein",
        subType: "from_right",
        duration: 300
      },
      pageParam: param.param
    });
  },
  openHeader: function (param) {
    api.openWin({
      name: param.name || new Date().getTime(),
      url: api.wgtRootDir + '/publicWin.html',
      reload: true,
      bounces: false,
      vScrollBarEnabled: false,
      slidBackEnabled: false,
      delay: param.delay || 300,
      pageParam: {
        title: param.frame.title,
        frameName: param.frame.name || new Date().getTime(),
        frameUrl: param.frame.url,
        text: param.frame.text,
        eveObj: param.frame.eveObj,
        param: param.frame.param || {}
      }
    });
  },
  openFullWin: function (param) {
    api.openWin({
      name: param.name || new Date().getTime(),
      url: api.wgtRootDir + '/publicFullWin.html',
      reload: true,
      bounces: false,
      vScrollBarEnabled: false,
      slidBackEnabled: false,
      delay: param.delay || 300,
      pageParam: {
        frameName: param.frame.name || new Date().getTime(),
        frameUrl: param.frame.url,
        eveObj: param.frame.eveObj,
        param: param.frame.param || {}
      }
    });
  },
  confirm: function (msg, event) {
    api.openFrame({
      name: 'dialog',
      url: api.wgtRootDir + '/html/dialog.html',
      rect: {
        x: 0,
        y: 0,
        w: api.winWidth,
        h: api.winHeight
      },
      pageParam: {
        msg: msg,
        event: event
      }
    });
  },
  /**
   * 关闭当前窗口
   */
  closeWin: function () {
    api.closeWin();
  },
  /**
   * 关闭到指定 window，最上面显示的 window 到指定 name 的 window 间的所有 window 都会被关闭
   */
  closeToWin: function (name) {
    api.closeToWin({
      name: name
    });
  },
  /**
   * 监听安卓返回键,执行closeToWin
   */
  keyBackToWin: function (name) {
    api.addEventListener({
      name: 'keyback'
    }, function (ret, err) {
      Tool.closeToWin(name);
    });
  },
  /**
   * 退出App
   */
  exitApp: function (str) {
    var tip = str || '您即将退出App?';
    if (confirm(tip)) {
      api.closeWidget({
        id: api.appId,
        silent: true
      });
    }
  },
  /**
   * 判断登陆状态，进入登录界面
   */
  isLogin: function () {
    var isLogin = $api.getStorage('isLogin');
    if (isLogin === 'false') {
      api.addEventListener({
        name: 'goLogin'
      }, function (ret, err) {
        Tool.openWin({
          name: 'signIn',
          url: '/html/signIn.html'
        });
      });
      Tool.confirm('请先登录', 'goLogin');
    }
  },
  isCertify: function () {
    var isCertify = $api.getStorage('status');
    var character = $api.getStorage('character');
    if (isCertify === "0" && character === "1") {
      api.addEventListener({
        name: 'goCertify'
      }, function (ret, err) {
        Tool.openHeader({
          name: 'sup-certify',
          frame: {
            title: "店铺认证",
            url: api.wgtRootDir + '/html/supplier/sup-certify.html'
            //pageParam:
          }
        });
      });
      Tool.confirm('请先认证', 'goCertify');
    }
  },
  /**
   * 验证交易密码
   */
  hasDealPwd: function (event) {
    if ($api.getStorage('hasDealPwd') === 'true') {
      api.sendEvent({
        name: event,
        extra: {
          hasDealPwd: true
        }
      });
      return;
    }
    api.ajax({
      url: SERVER_PATH + 'User/checkDealPasswordIsSet',
      method: 'post',
      data: {
        values: {
          accessToken: $api.getStorage('token'),
          userId: $api.getStorage('userId')
        }
      }
    }, function (ret, err) {
      var bool = false;
      if (ret && ret.code === 0) {
        $api.setStorage('hasDealPwd', 'true');
        bool = true;
      }
      api.sendEvent({
        name: event,
        extra: {
          hasDealPwd: bool
        }
      });
    });
  },
  /**
   * 验证交易密码
   */
  checkDealPwd: function (event) {
    api.openFrame({
      name: 'dialog',
      url: api.wgtRootDir + '/html/dialog.html',
      rect: {
        x: 0,
        y: 0,
        w: api.winWidth,
        h: api.winHeight
      },
      pageParam: {
        title: '输入交易密码',
        event: event,
        input: true,
        inputType: 'password',
      }
    });
  },
  /**
   * toast提示信息
   */
  toastInfo: function (msg, time, pos) {
    var _time = time || 1500;
    api.toast({
      msg: msg,
      duration: _time,
      location: pos || 'middle'
    });
  },
  /**
   * toast提示并关闭当前窗口
   */
  toastInfoThenClose: function (msg, time, pos) {
    var _time = time || 1500;
    api.toast({
      msg: msg,
      duration: _time,
      location: pos || 'middle'
    });
    setTimeout(function () {
      closeWin();
    }, (_time + 500));
  },
  cancelAjax: function (tag) {
    if (!tag || Object.prototype.toString.call(tag) != "[object String]") return;
    api.cancelAjax({
      tag: tag
    });
  },
  /**
   * 加载更多
   */
  loadMore: function (fn) {
    api.addEventListener({
      name: 'scrolltobottom',
      extra: {
        threshold: 30
      }
    }, function (ret, err) {
      fn();
    });
  },
  loadMores: function (fn) {
    api.addEventListener({
      name: 'scrolltoTop',
      extra: {
        threshold: 30
      }
    }, function (ret, err) {
      fn();
    });
  },
  /**
   * 刷新
   */
  refreshPage: function (fn) {
    api.setRefreshHeaderInfo({
      visible: true,
      loadingImg: 'widget://image/refresh.png',
      bgColor: '#ccc',
      textColor: '#fff',
      textDown: '下拉刷新...',
      textUp: '松开刷新...',
      showTime: true
    }, function (ret, err) {
      //这里写重新渲染页面的方法
      api.refreshHeaderLoadDone();
      fn();
    });
  },
  /**
   * 选择上传图片方式
   */
  getPicture: function (type, event) {
    api.getPicture({
      sourceType: type,
      encodingType: 'png',
      mediaValue: 'pic',
      destinationType: 'url',
      allowEdit: false,
      targetWidth: 750,
      saveToPhotoAlbum: false
    }, function (ret, err) {
      Tool.sendEvent(event, ret, err);
    });
  },
  /**
   * 上传图片
   */
  uploadImage: function (url, file, event) {
    api.showProgress();
    api.ajax({
      url: url,
      method: 'POST',
      cache: false,
      dataType: 'json',
      data: {
        files: {
          file: file
        }
      }
    }, function (ret, err) {
      api.hideProgress();
      Tool.sendEvent(event, ret, err);
    });
  },
  /**
   * 查看图片
   */
  viewImage: function (imgArr, index) {
    var imageBrowser = api.require('imageBrowser');
    imageBrowser.openImages({
      imageUrls: imgArr,
      showList: false,
      activeIndex: index
    });
  },
  /**
   * 格式化金额
   */
  formatMoney: function (money) {
    if (isNaN(+money)) {
      return money;
    }
    money = +money;
    money = money.toFixed(2);
    money += '';
    int = money.substring(0, money.indexOf(".")).replace(/\B(?=(?:\d{3})+$)/g, ',');//取到整数部分
    dot = money.substring(money.length, money.indexOf("."));//取到小数部分
    money = int + dot;
    return money;
  },
  /**
   * 格式化日期
   * date : new Date()
   * fmt : "yyyy-mm-dd"
   */
  formatDate: function (date, fmt) {
    var o = {
      "m+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "H+": date.getHours(), //小时
      "i+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  },
  sendEvent: function (event, ret, err) {
    api.sendEvent({
      name: event,
      extra: {
        ret: ret,
        err: err
      }
    });
  },
  /**
   * 倒计时
   */
  timeCount: function (date) {
    if (!/^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/.test(date)) {
      return '未知';
    }
    date = date.replace(/-/g, '/');
    if (new Date(date).getTime() - new Date().getTime() < 0) {
      return '0天0小时0分钟';
    }
    var diff = (new Date(date).getTime() - new Date().getTime()) / 1000;
    return parseInt(diff / 60 / 60 / 24, 10) + '天' + parseInt(diff / 60 / 60 % 24, 10) + '小时' + parseInt(diff / 60 % 60, 10) + '分钟';
  },
  /**
   * 排序函数 type:-1 从小到大；type:1 从大到小
   */
  arrSort: function (arr, key, type) {
    var _arr = [].concat(arr);
    var _type = type || -1;
    _arr.sort(function (a, b) {
      if (a[key] > b[key]) {
        return _type;
      } else if (a[key] < b[key]) {
        return _type * -1;
      } else {
        return 0;
      }
    });
    return _arr;
  },
  /**
   * 版本号比较
   */
  cpr_version: function (a, b) {
    var _a = toNum(a), _b = toNum(b);
    if (_a > _b) {
      return true;
    } else {
      return false;
    }

    function toNum(a) {
      var a = a.toString();
      //也可以这样写 var c=a.split(/\./);
      var c = a.split('.');
      var num_place = ["", "0", "00", "000", "0000"], r = num_place.reverse();
      for (var i = 0; i < c.length; i++) {
        var len = c[i].length;
        c[i] = r[len] + c[i];
      }
      var res = c.join('');
      return res;
    }
  }
};

//正则验证
/**
 * 手机号验证
 */
var isPhone = function (phone) {
  return /^((17[0-9])|(14[0-9])|(13[0-9])|(15[^4,\D])|(18[0-9]))\d{8}$/.test(phone);
};
/**
 * 匹配正整数
 */
var isInt = function (num) {
  return /^[1-9]\d*$/.test(num);
};
/**
 * 匹配金额
 */
var isMoney = function (text) {
  return /^[0-9]+(.[0-9]{1,2})?$/.test(text) && (text !== 0);
};
/**
 * 密码验证,6~16位数字字母
 */
var isPwd = function (pwd) {
  return /^[0-9A-Za-z]{6,16}$/.test(pwd);
};
/**
 * 验证码验证,4位数字
 */
var isCaptcha = function (captcha) {
  return /^[0-9]{6}$/.test(captcha);
};
//验证身份证号
var isIdCard = function (text) {
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(text);
};
//验证银行卡号
var isBankCard = function (text) {
  return /^(\d{16,21})$/.test(text);
};
