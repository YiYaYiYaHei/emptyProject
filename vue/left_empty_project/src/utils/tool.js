import { Message } from 'element-ui';

/**
 *  日期转换方法
 *  @param YYYY-MM-DD hh:mm:ss
 */
let dateFormat = (type, val) => {
  let date = val ? new Date(/^[0-9]*$/g.test(val) ? val * 1 : val) : new Date();
  let YYYY = date.getFullYear() + '';
  let m = date.getMonth() + 1;
  let MM = m > 9 ? m + '' : '0' + m;
  let d = date.getDate();
  let DD = d > 9 ? d + '' : '0' + d;
  let h = date.getHours();
  let hh = h > 9 ? h + '' : '0' + h;
  let $m = date.getMinutes();
  let mm = $m > 9 ? $m + '' : '0' + $m;
  let s = date.getSeconds();
  let ss = s > 9 ? s + '' : '0' + s;
  let obj = {YYYY, MM, DD, hh, mm, ss};

  return type.replace(/(YYYY)|(MM)|(DD)|(hh)|(mm)|(ss)/g, (key) => obj[key]);
};

/**
 *  去掉字段的两端空格
 *  @param Object
 */
let trimObject = (obj) => {
  let res = {};
  for (let name in obj) {
    if (obj.hasOwnProperty(name)) {
      res[name] = obj[name].replace(/(^\s*)|(\s*$)/g, '');
    }
  }

  return res;
};


/**
 * formatFileSize. 文件大小格式化
 *
 * @param      {<type>}    [fileSize]      文件大小,单位字节
 * @param      {string}    [unit]          文件单位
 */
let formatFileSize = (fileSize, unit = 'B') => {
  if (fileSize == null || fileSize === '' || !fileSize || fileSize === '0') {
    return '0' + unit;
  }
  let unitArr = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
  let index = 0;
  let srcSize = parseFloat(fileSize);
  index = Math.floor(Math.log(srcSize) / Math.log(1024));
  let size = srcSize / Math.pow(1024, index);
  size = size.toFixed(2);
  return size + unitArr[index] + unit;
};

/**
 **
 * @feature 用千分位表示数字 以','隔开
 * @param {number} 传入数字
 * @return {string} 返回千分位表示的数字
 */
let numberWithCommas = (x, unit = '') => {
  if (x === undefined) {
    return '0';
  }
  if (typeof x !== 'number') x = parseInt(x);
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + unit;
};

/**
 * 打开新页签
 * @param url      [String]      新页签地址
 * @param flag     {Boolean}     是否直接用地址打开
 */
let openTabByUrl = (url, flag) => {
  let el = document.createElement("a");
  document.body.appendChild(el);
  el.href = flag ? url : encodeURI(`${location.protocol}//${location.host}${location.pathname}#${url}`);
  el.target = '_blank';

  el.click();
  document.body.removeChild(el);
};


/**
 * 文件上传，返回dom节点
 * isMultiple是否多文件上传
 * acceptType 上传文件类型
 */
let fileUploadNode = (key, cb, isMultiple, acceptType) => {

  let box = document.createElement('div');
  document.body.appendChild(box);
  box.setAttribute('style', 'display: block; height: 0; width: 0; overflow: hidden;');

  let input = document.createElement('input');
  input.setAttribute('name', key);
  input.setAttribute('type', 'file');
  if (isMultiple) input.setAttribute('multiple', 'multiple');
  if (acceptType) input.setAttribute('accept', acceptType);
  box.appendChild(input);

  input.addEventListener('change', function () {

    let file = null;
    if (input.files && input.files.length > 0) {
      file = input.files;
      cb(file);
    } else {
      cb('ERROR_CODE');
    }

    setTimeout(() => {
      document.body.removeChild(box);
    });
  });

  input.click();
};

/**
 *  日期转换方法 时间粒度(15分钟为一粒度：9:00 9:15 9:30 9:45 10:00)
 *  @param YYYY-MM-DD hh:mm:ss
 */
let formatTimeGranularity = (type, val) => {
  let date = val ? new Date(/^[0-9]*$/g.test(val) ? val * 1 : val) : new Date();
  let y = date.getFullYear();
  let m = date.getMonth();
  let d = date.getDate();
  let h = date.getHours();
  let mm = date.getMinutes();
  mm = Math.ceil(mm / 15) * 15;
  let s = date.getSeconds();
  let source = new Date(y, m, d, h, mm, s);

  return dateFormat(type, source);
};

/**
 * 取小数，不四舍五入
 * @define {Number} dist 目标数据
 * @define {Number} dot 小数数据
 */
let numberFixed = (dist, dot) => {
  let str = dist + '';
  let idx = str.lastIndexOf('.') + 1;
  let dotLen = str.length - idx;
  if (idx > 0) str = str.substring(0, idx + dot);
  if (dotLen < dot) {
    str += '0'.repeat(dot - dotLen);
  }
  return str;
};

/**
 * Shows the tip. 显示提示
 *
 * @param      {<string>}  [type]        提示框类型
 * @param      {<string>}  [text]        提示文字内容
 * @param      {<string>}  [code]        提示代码
 */
let showMessage = (type, text, duration = 3000) => {
  Message({
    title: '消息',
    showClose: false,
    customClass: 'atd-message',
    message: text,
    type: type || 'success',
    duration
  });
};

/**
 * Hides the tip. 关闭提示框
 */
let hideMessage = () => {
  Message.close();
};

/* 获取字符串长度 */
let getStringLength = (str) => {
  let num = 0;
  for (let it of str) {
    num += (/^[\u4e00-\u9fa5]+$/.test(it)) ? 2 : ['【', '】', '，', '：'].includes(it) ? 2 : 1;
  }
  return num;
};

/**
 * 判断输入的字符串是否全中文
 * @param {string} str - 待判断的字符串
 * @return {boolean}
 */
let isChinese = function (str) {
  return /^[\u4e00-\u9fa5]*$/g.test(str);
};

/**
 * 判断输入的字符串是否全英文
 * @param {string} str - 待判断的字符串
 * @return {boolean}
 */
let isEnglish = function (str) {
  return /[\u4e00-\u9fa5]/g.test(str);
};

/* 判断是否是正确的IP格式 192.136.23.6 */
let isIp = function (str) {
  let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
  return reg.test(str);
};

/**
 * 判断输入的字符串是否是url
 * @param {string} str - 待判断的字符串
 * @return {boolean}
 */
let isUrl = function (str) {
  return /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/.test(str);
};

/**
 * 判断输入的字符串是否是uri
 * @param {string} str - 待判断的字符串
 * @return {boolean}
 */
let isUri = function (str) {
  return /^\/[\s\S]+/.test(str.replace(/(^\s*)|(\s*$)/g, ''));
};

/**
 * 判断输入的字符串是否是IP地址段: 192.168.33.22/32格式
 * @param {string} str - 待判断的字符串
 * @return {boolean}
 */
let isCidr = function (str) {
  let ipArr = str.split('/');
  if (isIp(ipArr[0]) && ipArr[1] >= 0 && ipArr[1] <= 32) {
    return true;
  }
  return false;
};

/* 端口是否合法 */
let isPort = function (str) {
  str = str * 1;
  return Number.isInteger(str) && !(str < 0 || str > 65535);
};

/**
 * @feature 判断输入的域名格式是否正确
 * @param {string} 待判断的域名 www.123.co
 * @return {boolean}
 */
let isDomain = function (str) {
  let reg = '(^([a-z0-9]{2,}\.)+(abogado|ac|academy|accountants|active|actor|ad|adult|' +
    'ae|aero|af|ag|agency|ai|airforce|al|allfinanz|alsace|am|amsterdam|an|android|ao|aq|aquarelle' +
    '|ar|archi|army|arpa|as|asia|associates|at|attorney|au|auction|audio|autos|aw|ax|axa|az|ba' +
    '|band|bank|bar|barclaycard|barclays|bargains|bayern|bb|bd|be|beer|berlin|best|bf|bg|bh|bi' +
    '|bid|bike|bingo|bio|biz|bj|black|blackfriday|bloomberg|blue|bm|bmw|bn|bnpparibas|bo|boo' +
    '|boutique|br|brussels|bs|bt|budapest|build|builders|business|buzz|bv|bw|by|bz|bzh|ca|cal' +
    '|camera|camp|cancerresearch|canon|capetown|capital|caravan|cards|care|career|careers|cartier' +
    '|casa|cash|cat|catering|cc|cd|center|ceo|cern|cf|cg|ch|channel|chat|cheap|christmas|chrome' +
    '|church|ci|citic|city|ck|cl|claims|cleaning|click|clinic|clothing|club|cm|cn|co|coach' +
    '|codes|coffee|college|cologne|com|community|company|computer|condos|construction|consulting' +
    '|contractors|cooking|cool|coop|country|cr|credit|creditcard|cricket|crs|cruises|cu|cuisinella' +
    '|cv|cw|cx|cy|cymru|cz|dabur|dad|dance|dating|day|dclk|de|deals|degree|delivery|democrat|dental' +
    '|dentist|desi|design|dev|diamonds|diet|digital|direct|directory|discount|dj|dk|dm|dnp|do|docs' +
    '|domains|doosan|durban|dvag|dz|eat|ec|edu|education|ee|eg|email|emerck|energy|engineer|engineering' +
    '|enterprises|equipment|er|es|esq|estate|et|eu|eurovision|eus|events|everbank|exchange|expert' +
    '|exposed|fail|farm|fashion|feedback|fi|finance|financial|firmdale|fish|fishing|fit|fitness' +
    '|fj|fk|flights|florist|flowers|flsmidth|fly|fm|fo|foo|forsale|foundation|fr|frl|frogans|fund' +
    '|furniture|futbol|ga|gal|gallery|garden|gb|gbiz|gd|ge|gent|gf|gg|ggee|gh|gi|gift|gifts|gives' +
    '|gl|glass|gle|global|globo|gm|gmail|gmo|gmx|gn|goog|google|gop|gov|gp|gq|gr|graphics|gratis' +
    '|green|gripe|gs|gt|gu|guide|guitars|guru|gw|gy|hamburg|hangout|haus|healthcare|help|here|hermes' +
    '|hiphop|hiv|hk|hm|hn|holdings|holiday|homes|horse|host|hosting|house|how|hr|ht|hu|ibm|id|ie|ifm' +
    '|il|im|immo|immobilien|in|industries|info|ing|ink|institute|insure|int|international|investments' +
    '|io|iq|ir|irish|is|it|iwc|jcb|je|jetzt|jm|jo|jobs|joburg|jp|juegos|kaufen|kddi|ke|kg|kh|ki|kim' +
    '|kitchen|kiwi|km|kn|koeln|kp|kr|krd|kred|kw|ky|kyoto|kz|la|lacaixa|land|lat|latrobe|lawyer|lb' +
    '|lc|lds|lease|legal|lgbt|li|lidl|life|lighting|limited|limo|link|lk|loans|london|lotte|lotto' +
    '|lr|ls|lt|ltda|lu|luxe|luxury|lv|ly|ma|madrid|maison|management|mango|market|marketing|marriott' +
    '|mc|md|me|media|meet|melbourne|meme|memorial|menu|mg|mh|miami|mil|mini|mk|ml|mm|mn|mo|mobi|moda' +
    '|moe|monash|money|mormon|mortgage|moscow|motorcycles|mov|mp|mq|mr|ms|mt|mu|museum|mv|mw|mx|my|mz' +
    '|na|nagoya|name|navy|nc|ne|net|network|neustar|new|nexus|nf|ng|ngo|nhk|ni|ninja|nl|no|np|nr|nra' +
    '|nrw|ntt|nu|nyc|nz|okinawa|om|one|ong|onl|ooo|org|organic|osaka|otsuka|ovh|pa|paris|partners|parts' +
    '|party|pe|pf|pg|ph|pharmacy|photo|photography|photos|physio|pics|pictures|pink|pizza|pk|pl|place' +
    '|plumbing|pm|pn|pohl|poker|porn|post|pr|praxi|press|pro|prod|productions|prof|properties|property' +
    '|ps|pt|pub|pw|qa|qpon|quebec|re|realtor|recipes|red|rehab|reise|reisen|reit|ren|rentals|repair' +
    '|report|republican|rest|restaurant|reviews|rich|rio|rip|ro|rocks|rodeo|rs|rsvp|ru|ruhr|rw|ryukyu' +
    '|sa|saarland|sale|samsung|sarl|sb|sc|sca|scb|schmidt|schule|schwarz|science|scot|sd|se|services' +
    '|sew|sexy|sg|sh|shiksha|shoes|shriram|si|singles|sj|sk|sky|sl|sm|sn|so|social|software|sohu|solar' +
    '|solutions|soy|space|spiegel|sr|st|style|su|supplies|supply|support|surf|surgery|suzuki|sv|sx|sy' +
    '|sydney|systems|sz|taipei|tatar|tattoo|tax|tc|td|technology|tel|temasek|tennis|tf|tg|th|tienda|tips' +
    '|tires|tirol|tj|tk|tl|tm|tn|to|today|tokyo|tools|top|toshiba|town|toys|tp|tr|trade|training|travel' +
    '|trust|tt|tui|tv|tw|tz|ua|ug|uk|university|uno|uol|us|uy|uz|va|vacations|vc|ve|vegas|ventures|versicherung' +
    '|vet|vg|vi|viajes|video|villas|vision|vlaanderen|vn|vodka|vote|voting|voto|voyage|vu|wales|wang|watch' +
    '|webcam|website|wed|wedding|wf|whoswho|wien|wiki|williamhill|wme|work|works|world|ws|wtc|wtf|xyz|yachts' +
    '|yandex|ye|yoga|yokohama|youtube|yt|za|zm|zone|zuerich|zw)$)';
  return new RegExp(reg).test(str);
};

/**
 * @feature 判断输入的密码格式是否正确（密码为6到16位的大小写字母、数字和特殊字符混合）
 * @param {string} 待判断密码
 * @return {boolean}
 */
let isValidPwd = function (pwd, setting) {
  let pwdLength = setting.minLength || 4;
  let isHasSpecialChart = (setting.complexity || 'WNS').length === 3;
  let finallyCount = isHasSpecialChart ? 5 : 4;

  let count = 0;
  // 判断密码长度
  if (pwd.length >= pwdLength) ++count;

  // 判断密码是否包含大写字母
  if (/[A-Z]+/.test(pwd)) ++count;

  // 判断密码是否包含小写字母
  if (/[a-z]+/.test(pwd)) ++count;

  // 判断密码是否包含数字
  if (/[0-9]+/.test(pwd)) ++count;

  // 判断密码是否包含特殊字符
  if (/[~@#%\+\-=\/\(_\)\*\&\<\>\[\"\;\'\|\$\^\?\!.\{\}\`]+/.test(pwd)) ++count;

  return count === finallyCount;
};

/**
 * @isPhone 判断输入的电话号码格式是否正确
 * @param {string} 待判断MD5值 32位16进制
 * @return {boolean}
 */
let isPhone = function (phone) {
  let reg = /^1[3-9][0-9]\d{8}$/;
  return reg.test(phone);
};

/**
 * @feature 判断输入的hash格式是否正确
 * @param {string} 16/32/64/128/256 位
 * @return {boolean}
 */
let isHash = (str) => {
  let reg = /^([A-Fa-f0-9]{16}|[A-Fa-f0-9]{32}|[A-Fa-f0-9]{64}|[A-Fa-f0-9]{128}|[A-Fa-f0-9]{256})$/;
  return reg.test(str);
};

/**
 * @feature 判断输入的邮箱（email）格式是否正确
 * @param {string} 123@qq.com
 * @return {boolean}
 */
let isEmail = (str) => {
  let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  return reg.test(str);
};

export default {
  dateFormat,
  trimObject,
  formatFileSize,
  numberWithCommas,
  openTabByUrl,
  fileUploadNode,
  formatTimeGranularity,
  numberFixed,
  showMessage,
  hideMessage,
  getStringLength,
  isChinese,
  isEnglish,
  isIp,
  isUrl,
  isUri,
  isCidr,
  isPort,
  isDomain,
  isValidPwd,
  isPhone,
  isHash,
  isEmail,
};
