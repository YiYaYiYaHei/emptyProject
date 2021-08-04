/**
 * 拿到指定路径下面的模块，减少index.js文件 require.context - dir reg 不能用变量（注意：export default 才可以被引入）
 * @param {string} name
 * @return {Object}
 */
const getModules = (name) => {
  let modulesFiles;
  switch (name) {
    case 'directives':
      modulesFiles = require.context('@/common/directives/', true, /^.+(?<!index)\.js$/);
      break;
    case 'components':
      modulesFiles = require.context('@/common/components/', true, /^.+(?<!index)\.(js|vue)$/);
      break;
    case 'mixins':
      modulesFiles = require.context('@/mixins/', true, /^.+(?<!index)\.(js|vue)$/);
      break;
    case 'apis':
      modulesFiles = require.context('@/apis/', true, /^.+(?<!index)\.js$/);
      break;
    case 'prototype':
      modulesFiles = require.context('@/utils/', true, /^.+(?<!request)\.(js|vue)$/);
      break;
  }
  return modulesFiles.keys().reduce((modules, modulePath) => {
    const moduleName = modulePath.replace(/^\.\/(.+)\.(js|vue)$/, '$1');
    const value = modulesFiles(modulePath);
    value.default && (modules[moduleName] = value.default);
    return modules;
  }, {});
};

// 根据权限跳转首页
const jumpHome = (userRole) => {
  return userRole === '管理员' ? '/system/user' : '/home';
};

/**
 * 获取完整的（接口）请求地址
 * @param {string} url - 接口地址，以'/'开头的接口地址
 * @param {string} urlPrefix - 接口前缀: 类似BASE_URL
 * @param {Boolean} isAxios - 是否是ajax请求前缀
 * @return {string}
 */
const getFullUrl = (url, urlPrefix = 'BASE_URL', isAxios = true) => {
  urlPrefix = isAxios ? `VUE_APP_AXIOS_${urlPrefix}` : false;
  return /^(http|https):/g.test(url) ? url : (process.env[urlPrefix] + url);
};

// 根据header里的contenteType转换请求参数
const transformRequestData = (contentType, requestData) => {
  requestData = requestData || {};
  if (contentType.includes('application/x-www-form-urlencoded')) {
    // formData格式：key1=value1&key2=value2，方式二：qs.stringify(requestData)
    let str = '';
    for (const key in requestData) {
      if (Object.prototype.hasOwnProperty.call(requestData, key)) {
        str += `${key}=${requestData[key]}&`;
      }
    }
    return encodeURI(str.slice(0, str.length - 1));
  } else if (contentType.includes('multipart/form-data')) {
    const formData = new FormData();
    for (const key in requestData) {
      const files = requestData[key];
      // 判断是否是文件流
      if (!!files && files.constructor === FileList) {
        for (let i = 0; i < files.length; i++) {
          formData.append(key, files[i]);
        }
        // formData.append(key, files);
      } else {
        formData.append(key, files);
      }
    }
    return formData;
  }
  // json字符串{key: value}
  return Object.keys(requestData).length ? JSON.stringify(requestData) : '';
};

/**
 * 日期格式化  YYYY-MM-DD hh:mm:ss ww qq (年-月-日 时:分:秒 星期 季度)
 * @param {string} [type='YYYY-MM-DD hh:mm:ss'] - 日期格式
 * @param {Date|number|string} [val] - Date或者是时间戳
 * @param {number} [granularity=1] 分粒度 默认为1，若为10可能显示为 10:10 10:20等
 * @return {string} 格式化后的时间
 */
const formatDate = (type = 'YYYY-MM-DD hh:mm:ss', val, granularity = 1) => {
  const date = val instanceof Date ? val : new Date(/^[0-9]*$/g.test(val) ? val * 1 : Date.now());
  const YYYY = date.getFullYear() + '';
  const m = date.getMonth() + 1;
  const MM = m > 9 ? m + '' : '0' + m;
  const d = date.getDate();
  const DD = d > 9 ? d + '' : '0' + d;
  const h = date.getHours();
  const hh = h > 9 ? h + '' : '0' + h;
  const $m = Math.ceil(date.getMinutes() / granularity) * granularity;
  const mm = $m > 9 ? $m + '' : '0' + $m;
  const s = date.getSeconds();
  const ss = s > 9 ? s + '' : '0' + s;
  const week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const ww = week[date.getDay()];
  const quarter = ['第一季度', '第二季度', '第三季度', '第四季度'];
  const qq = quarter[Math.floor((date.getMonth() + 3) / 3) - 1];
  const obj = {YYYY, MM, DD, hh, mm, ss, ww, qq};

  return type.replace(/(YYYY)|(MM)|(DD)|(hh)|(mm)|(ss)|(ww)|(qq)/g, (key) => obj[key]);
};

// 格式化字节 bytes单位B
const formatByteSize = (bytes) => {
  if (!bytes) return '0B';
  const unitList = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = (bytes / Math.pow(1024, index)).toFixed(2);
  return `${size}${unitList[index]}`;
};

/**
 * 根据输入的国家中文名 输出该国家国旗路径
 * @param {string} nation - 输入的国家中文名
 * @param {string} [basePath='/'] - 图片基础路径
 * @return {string}
 * @example <img :src="$tools.getNationalFlagSrc('中国')" />
 */
const getNationalFlagSrc = (nation, basePath = process.env.BASE_URL + 'nationalFlag/') => {
  nation = nation || '';
  const nationWithFlagPath = {
    本地局域网: 'bdjyw.png',
    内网IP: 'bdjyw.png',
    中国: 'zg.png',
    香港: 'zg.png',
    台湾: 'zg.png',
    澳门: 'zg.png',
    日本: 'rb.png',
    韩国: 'hg.png',
    美国: 'mg.png',
    俄罗斯: 'els.png',
    朝鲜: 'cx.png',
    老挝: 'lw.png',
    印度: 'yd.png',
    印尼: 'yn.png',
    约旦: 'yued.png',
    缅甸: 'md.png',
    蒙古: 'mgu.png',
    不丹: 'bd.png',
    泰国: 'tg.png',
    越南: 'yuen.png',
    阿曼: 'am.png',
    也门: 'ym.png',
    沙特: 'st.png',
    阿富汗: 'afh.png',
    阿联酋: 'alq.png',
    巴林: 'bl.png',
    科威特: 'kwt.png',
    土耳其: 'teq.png',
    文莱: 'wl.png',
    黎巴嫩: 'lbn.png',
    孟加拉: 'mjl.png',
    新加坡: 'xjp.png',
    格鲁吉亚: 'gljy.png',
    马尔代夫: 'medf.png',
    伊朗: 'yl.png',
    以色列: 'ysl.png',
    叙利亚: 'xly.png',
    卡塔尔: 'kte.png',
    柬埔寨: 'jpz.png',
    塞浦路斯: 'spls.png',
    土库曼: 'tkm.png',
    尼泊尔: 'nbe.png',
    乌兹别克: 'wzbk.png',
    伊拉克: 'ylk.png',
    哈萨克: 'hsk.png',
    斯里兰卡: 'sllk.png',
    马来西亚: 'mlxy.png',
    菲律宾: 'flb.png',
    巴勒斯坦: 'blst.png',
    加蓬: 'jp.png',
    亚美尼亚: 'ymny.png',
    埃及: 'aj.png',
    多哥: 'dg.png',
    刚果: 'gg.png',
    加纳: 'jn.png',
    马里: 'ml.png',
    中非: 'zf.png',
    苏丹: 'sd.png',
    卢旺达: 'lwd.png',
    安哥拉: 'agl.png',
    佛得角: 'fdj.png',
    冈比亚: 'gby.png',
    吉布提: 'jbt.png',
    利比亚: 'lby.png',
    科麦隆: 'kml.png',
    科摩罗: 'keml.png',
    莱索托: 'lst.png',
    尼日尔: 'nre.png',
    突尼斯: 'tns.png',
    赞比亚: 'zby.png',
    马拉维: 'mlw.png',
    乌干达: 'wgd.png',
    摩洛哥: 'mlg.png',
    博茨瓦纳: 'bzwl.png',
    利比里亚: 'lbly.png',
    科特迪瓦: 'ktdw.png',
    毛里求斯: 'mlqs.png',
    民主刚果: 'mzgg.png',
    尼日利亚: 'nrly.png',
    塞拉利昂: 'slla.png',
    南非: 'nf.png',
    布隆迪: 'bld.png',
    莫桑比克: 'msbk.png',
    津巴布韦: 'jbbw.png',
    几内亚: 'jny.png',
    厄立特里亚: 'eltly.png',
    坦桑尼亚: 'tsny.png',
    肯尼亚: 'kny.png',
    斯威士兰: 'swsl.png',
    西撒哈拉: 'xshl.png',
    塞舌尔: 'sse.png',
    布基纳法索: 'bjnlfs.png',
    赤道几内亚: 'cdjny.png',
    索马里: 'sml.png',
    几内亚比绍: 'jnybs.png',
    圣多美和普林西比: 'plxb.png',
    阿尔及利亚: 'aejly.png',
    毛里塔尼亚: 'mltny.png',
    冰岛: 'bdao.png',
    纳米比亚: 'nmby.png',
    埃塞俄比亚: 'aseby.png',
    马达加斯加: 'mdjsj.png',
    波黑: 'bh.png',
    德国: 'germany.png',
    波兰: 'poland.png',
    法国: 'france.png',
    捷克: 'Chech.png',
    荷兰: 'Netherlands.png',
    瑞士: 'Switzerland.png',
    英国: 'England.png',
    希腊: 'Greece.png',
    瑞典: 'Sweden.png',
    爱尔兰: 'Ireland.png',
    安道尔: 'Andorra.png',
    奥地利: 'Austria.png',
    比利时: 'Belgium.png',
    梵蒂冈: 'Vatican.png',
    马耳他: 'Malta.png',
    西班牙: 'Spain.png',
    乌克兰: 'Ukraine.png',
    葡萄牙: 'Portugal.png',
    意大利: 'Italy.png',
    匈牙利: 'Hungary.png',
    白俄罗斯: 'Belarus.png',
    南斯拉夫: 'Yugoslavia.png',
    克罗地亚: 'Croatia.png',
    拉脱维亚: 'Latvia.png',
    保加利亚: 'Bulgaria.png',
    罗马尼亚: 'Romania.png',
    摩尔多瓦: 'Moldova.png',
    斯洛文尼亚: 'Slovenia.png',
    阿尔巴尼亚: 'Albania.png',
    列支敦士登: 'Liechtenstein.png',
    芬兰: 'Finland.png',
    卢森堡: 'Luxembourg.png',
    立陶宛: 'Lithuania.png',
    挪威: 'Norway.png',
    摩纳哥: 'Monaco.png',
    所罗门群岛: 'Solomon.png',
    爱沙尼亚: 'Estonia.png',
    斯洛伐克: 'Slovakia.png',
    智利: 'Chile.png',
    古巴: 'Cuba.png',
    海地: 'Haiti.png',
    圭亚那: 'Guyana.png',
    委内瑞拉: 'Venezuela.png',
    安提瓜和巴布达: 'AntiguaAndBarbuda.png',
    伯利兹: 'Belize.png',
    巴哈马: 'Bahamas.png',
    巴拿马: 'Panama.png',
    墨西哥: 'Mexico.png',
    苏里南: 'Suriname.png',
    加拿大: 'Canada.png',
    厄瓜多尔: 'Ecuador.png',
    格林纳达: 'Grenada.png',
    洪都拉斯: 'Honduras.png',
    巴西: 'Brazil.png',
    玻利维亚: 'Bolivia.png',
    秘鲁: 'Peru.png',
    阿根廷: 'Argentina.png',
    圣卢西亚: 'SaintLucia.png',
    多米尼克: 'Dominican.png',
    巴拉圭: 'Paraguay.png',
    尼加拉瓜: 'Nicaragua.png',
    哥伦比亚: 'Columbia.png',
    乌拉圭: 'Uruguay.png',
    巴巴多斯: 'Barbados.png',
    瑙鲁: 'Nauru.png',
    牙买加: 'Jamaica.png',
    危地马拉: 'Guatemala.png',
    斐济: 'Fiji.png',
    哥斯达黎加: 'CostaRita.png',
    圣基茨和尼维斯: 'SaintKittsAndNevis.png',
    新西兰: 'NewZealand.png',
    特立尼达和多巴哥: 'TrinidadAndTobago.png',
    圣文森特和格林纳丁斯: 'SaintVincentAndGrenadines.png',
    基里巴斯: 'Kiribati.png',
    纽埃: 'Niue.png',
    巴新: 'PapuaNewGuinea.png',
    萨摩亚: 'Samoa.png',
    汤加: 'Tonga.png',
    帕劳: 'Palau.png',
    澳大利亚: 'Australian.png',
    瓦努阿图: 'Vanuatu.png',
    图瓦卢: 'Tuvalu.png',
    密克罗尼西亚: 'Micronesia.png',
    库克群岛: 'Cook.png',
    马绍尔群岛: 'Marshall.png',
    科索沃: 'Kosovo.png',
    东帝汶: 'TimorLeste.png',
    黑山: 'Montenegro.png'
  };
  let src = 'default.png';
  for (const key in nationWithFlagPath) {
    if (nation.includes(key)) {
      src = nationWithFlagPath[key];
      break;
    }
  }
  return basePath + src;
};

// 数组转字符串
const arrayToString = (arr, separator = ',', emptyVal = '-') => {
  if (Array.isArray(arr)) return !arr.length ? emptyVal : arr.join(separator);
  return arr || emptyVal;
};

// 字符串转数组
const stringToArray = (str, separator = ',', emptyVal = '-') => {
  if (typeof str === 'string') return !str ? emptyVal : str.split(separator);
  return str || emptyVal;
};

// 去除字符串首尾空格
const trim = (str) => {
  return str.replace(/(^\s*)|(\s*$)/g, '');
};

// 用千分位表示数字 以','隔开
const numberWithCommas = (val) => {
  if (!val) return '0';
  val = val * 1;
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * 取小数
 * @param {number|string} val - 目标数据
 * @param {number} [fixedLen=2] - 保留小数长度，默认保留2位
 * @param {boolean} [isCeil=true] - 是否四舍五入
 * @return {string}
 */
const numberFixed = (val, fixedLen = 2, isCeil = true) => {
  if (isCeil) return parseFloat(val).toFixed(fixedLen);
  let str = val + '';
  const index = str.lastIndexOf('.') + 1;
  // 小数部分的长度
  const fractionalPartLen = str.length - index;
  if (index > 0) str = str.substring(0, index + fixedLen);
  // 不足补0
  if (fractionalPartLen < fixedLen) {
    str += '0'.repeat(fixedLen - fractionalPartLen);
  }
  return str;
};

/**
 * 简单过滤字符串输入输出，将部分字符转换为字符实体，避免XSS攻击（URL请用 encodeURI() encodeURIComponent()来处理）
 * @param {string} str - 需要过滤的字符串
 * @return {string}
 */
const escapeStr = (str) => {
  const signs = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;'
  };
  const reg = /[&<>"'/]/g;
  return (str && reg.test(str)) ? str.replace(reg, chr => signs[chr]) : str;
};

/* 获取字符串长度 */
const getStringLength = (str) => {
  let num = 0;
  for (const it of str) {
    num += (/^[\u4e00-\u9fa5]+$/.test(it)) ? 2 : ['【', '】', '，', '：'].includes(it) ? 2 : 1;
  }
  return num;
};

/**
 * 判断输入的域名格式是否正确
 * @param {string} str - 待判断的域名
 * @return {boolean}
 * @example isDomain('www.123.co')
 */
const isDomain = (str) => {
  // 先做一个简单的域名格式判断，下一个正则虽然判断的更全面但是效率很低，如果字符串长了很浪费时间 // (([a-z0-9\\-]{2,}\\[?\\.\\]?)+
  const regFirst = /[a-zA-Z0-9][a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][a-zA-Z0-9]{0,62})+\.?/;
  if (!regFirst.test(str)) return false;

  // eslint-disable-next-line
  const reg = '(^([a-z0-9]{2,}\.)+(abogado|ac|academy|accountants|active|actor|ad|adult|' +
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
 * 判断输入的密码格式是否正确（密码为8到20位的大小写字母、数字和特殊字符混合）
 * @param {string} pwd - 待判断密码
 * @param {boolean} [isMustSpecialChar = true] - 是否必须包含特殊字符
 * @return {boolean}
 */
const isValidPwd = (pwd, isMustSpecialChar = true) => {
  let count = 0;
  // 判断密码长度是8-20位
  if (pwd.length >= 8 && pwd.length <= 20) ++count;

  // 判断密码是否包含大写字母
  if (/[A-Z]+/.test(pwd)) ++count;

  // 判断密码是否包含小写字母
  if (/[a-z]+/.test(pwd)) ++count;

  // 判断密码是否包含数字
  if (/[0-9]+/.test(pwd)) ++count;

  if (!isMustSpecialChar) return count === 4;

  // 判断密码是否包含特殊字符
  // eslint-disable-next-line
  if (/[~@#%\+\-=\/\(_\)\*\&\<\>\[\"\;\'\|\$\^\?\!.\{\}\`]+/.test(pwd)) ++count;

  return count === 5;
};

/**
 * 判断输入的电话号码格式是否正确
 * @param {string} phone - 电话号码
 * @return {boolean}
 */
const isPhone = (phone) => {
  const reg = /^1[3|4|5|8][0-9]\d{8}$/;
  return reg.test(phone);
};

/**
 * 判断输入的ip格式（包含模糊匹配）是否正确
 * @param {string} str - 待判断的IP
 * @return {boolean}
 * @example isIp('192.168.33.22')   isIp('192.168.33.22/89')   isIp('192.168.33.*')
 */
const isIp = (str) => {
  // 判断是否是正确的IP格式 192.136.23.6 192.136.23.*
  const isIp = function (str) {
    const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    return str.charAt(0) !== '0' && reg.test(str);
  };

  // 这里是IP段的分割，后面最好做智能判断
  const ipArr = str.split('/');
  if (ipArr.length === 1) {
    const ipParts = ipArr[0].split('.');
    return ipParts[ipParts.length - 1] === '*' ? true : isIp(ipArr[0]);
  } else if (ipArr.length === 2) {
    if (isIp(ipArr[0])) {
      const ipStart = ipArr[0].split('.')[3];
      const ipEnd = ipArr[1];
      return !!(parseInt(ipStart) < parseInt(ipEnd) && parseInt(ipEnd) >= 255);
    }
    return false;
  }
};

// 判断端口合法性
const isPort = (str) => {
  return Number.isInteger(str * 1) && !(str < 0 || str >= 65535);
};

// 判断输入hash格式是否正确（16/32/64/128/256位）
const isHash = (str, lengthArr = [16, 32, 64, 128, 256]) => {
  return lengthArr.includes(str.length) && /^[A-Fa-f0-9]*$/.test(str);
};

// 判断输入的邮箱（email）格式是否正确
const isEmail = str => {
  return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(str);
};

// 判断输入的字符串是否是url
const isUrl = (str) => {
  // eslint-disable-next-line no-useless-escape
  return /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/.test(str);
};

// 判断输入的字符串是否是uri
const isUri = (str) => {
  return /^\/[\s\S]+/.test(str.replace(/(^\s*)|(\s*$)/g, ''));
};

// 判断输入的字符串是否全中文
const isChinese = (str) => {
  return /^[\u4e00-\u9fa5]*$/g.test(str);
};

// 判断输入的字符串是否全英文
const isEnglish = (str) => {
  return /[\u4e00-\u9fa5]/g.test(str);
};

/**
 * 判断文件名是否是指定类型
 * @param {String} fileName - 文件名
 * @param {String} acceptType - 接受的文件类型 '.zip,.rar,.doc'
 * @param {String} [type] - 文件类型 acceptType="image/*"时，需要此参数
 */
const isSpecifyFileType = (fileName, acceptType, type) => {
  const pointIndex = fileName.lastIndexOf('.');
  const fileType = fileName.slice(pointIndex);
  if (acceptType === 'image/*') return type.startsWith('image/');
  if (acceptType !== 'image/*') {
    const accept = acceptType.split(',');
    return accept.includes(fileType);
  }
};

export {
  getModules,
  jumpHome
};

export default {
  isSpecifyFileType,
  getFullUrl,
  transformRequestData,
  formatDate,
  formatByteSize,
  getNationalFlagSrc,
  arrayToString,
  stringToArray,
  trim,
  numberWithCommas,
  numberFixed,
  escapeStr,
  getStringLength,
  isDomain,
  isValidPwd,
  isPhone,
  isIp,
  isPort,
  isHash,
  isEmail,
  isUrl,
  isUri,
  isChinese,
  isEnglish
};
