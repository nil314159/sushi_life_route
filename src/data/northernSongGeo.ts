/**
 * Authentic Northern Song Dynasty (北宋元丰/元祐年间, c. 1080–1100 AD)
 * historical geographical vector layers in WGS84 [longitude, latitude] coordinates.
 */

export interface HistoricalRiver {
  id: string;
  name: string;
  songName: string;
  category: 'major' | 'canal' | 'historical-yellow';
  description: string;
  coordinates: [number, number][];
}

export interface RegimeTerritory {
  id: string;
  name: string;
  subLabel: string;
  labelCoordinates: [number, number];
  borderCoordinates: [number, number][];
  fillColor: string;
  strokeColor: string;
}

export interface NorthernSongCircuit {
  id: string;
  name: string;
  seat: string;
  coordinates: [number, number];
  note: string;
}

export interface HistoricalLandmark {
  id: string;
  name: string;
  type: 'mountain' | 'pass' | 'strait';
  coordinates: [number, number];
  note: string;
}

/**
 * Coastline & Islands of East Asia relevant to the Northern Song map frame
 * Bounding box roughly: Lon 97°E to 124°E, Lat 18°N to 42°N
 */
export const MAINLAND_COASTLINE: [number, number][] = [
  [121.5, 40.9], // 辽东湾北
  [120.0, 40.0], // 山海关外
  [119.5, 39.8], // 秦皇岛
  [117.7, 39.0], // 塘沽/渤海湾
  [118.0, 38.2], // 沧州北宋海岸（较今略偏内陆）
  [119.0, 37.3], // 莱州湾
  [120.76, 37.81], // 登州（蓬莱）
  [122.4, 37.4], // 成山头
  [120.4, 36.06], // 胶州湾
  [119.4, 35.4], // 密州板桥镇海岸
  [119.22, 34.6], // 海州（连云港）
  [119.8, 34.0], // 北宋淮口海岸（当时海岸线在盐城-楚州东侧）
  [120.8, 32.5], // 通州（南通）
  [121.5, 31.3], // 秀州青龙镇/松江口
  [120.2, 30.3], // 杭州钱塘江口
  [121.6, 29.9], // 明州（宁波）
  [120.7, 28.0], // 温州
  [119.3, 26.0], // 福州
  [118.6, 24.9], // 泉州
  [116.7, 23.3], // 潮州
  [114.6, 22.6], // 惠州大亚湾
  [113.5, 22.2], // 广州香山/珠江口
  [111.0, 21.4], // 高州/化州海岸
  [110.3, 21.2], // 雷州半岛东侧
  [110.15, 20.25], // 徐闻递角场（雷州半岛南端）
  [109.8, 20.9], // 雷州半岛西侧
  [109.2, 21.65], // 廉州（合浦）
  [108.0, 21.5], // 钦州/交趾界
  [106.6, 20.8], // 交趾海口
];

export const HAINAN_ISLAND_POLYGON: [number, number][] = [
  [110.33, 20.05], // 琼州（海口）
  [110.8, 19.65], // 文昌
  [110.4, 18.8], // 万安军（万宁）
  [109.5, 18.25], // 朱崖军（三亚）
  [108.65, 19.1], // 感恩（东方）
  [109.35, 19.73], // 昌化军（儋州）
  [109.95, 19.95], // 澄迈
  [110.33, 20.05],
];

export const TAIWAN_ISLAND_POLYGON: [number, number][] = [
  [121.5, 25.2],
  [121.9, 24.8],
  [121.4, 23.2],
  [120.8, 21.9],
  [120.1, 23.1],
  [120.6, 24.4],
  [121.5, 25.2],
];

/**
 * Northern Song Border vs. Liao (契丹/辽), Western Xia (西夏), Dali (大理), Tubo (吐蕃)
 */
export const NORTHERN_SONG_BORDER: [number, number][] = [
  [117.7, 39.0], // 泥沽海口（宋辽白沟河东端，天津南）
  [116.4, 39.1], // 霸州/雄州（白沟河界）
  [115.0, 39.0], // 定州北界
  [114.0, 39.2], // 雁门关北侧（代州）
  [112.4, 39.4], // 朔州南界
  [111.1, 39.1], // 府州/麟州黄河界
  [109.5, 37.8], // 延安府北（宋夏横山界）
  [107.6, 36.6], // 庆阳/环州
  [106.2, 36.0], // 原州/渭州（固原）
  [104.0, 35.8], // 熙州/兰州的熙河路界
  [103.0, 34.5], // 岷州/阶州
  [103.2, 31.8], // 茂州/威州（川西茶马界）
  [102.2, 29.5], // 雅州/黎州（大渡河宋与大理界）
  [104.2, 28.2], // 叙州/泸州南界
  [106.5, 26.0], // 播州/贵州羁縻界
  [107.2, 22.8], // 邕州（南宁）左江宋与交趾界
  [108.0, 21.5], // 钦州海口
];

export const LIAO_BORDER_LINE: [number, number][] = [
  [111.1, 39.1],
  [112.4, 39.4],
  [114.0, 39.2],
  [115.0, 39.0],
  [116.4, 39.1],
  [117.7, 39.0],
];

export const XIXIA_BORDER_LINE: [number, number][] = [
  [104.0, 35.8],
  [106.2, 36.0],
  [107.6, 36.6],
  [109.5, 37.8],
  [111.1, 39.1],
];

export const DALI_BORDER_LINE: [number, number][] = [
  [102.2, 29.5],
  [103.2, 27.6],
  [104.8, 25.5],
  [106.8, 23.5],
];

export const REGIME_LABELS: {
  id: string;
  name: string;
  sub: string;
  coordinates: [number, number];
  isPrimary?: boolean;
}[] = [
  {
    id: 'song',
    name: '北 宋',
    sub: '元丰·元祐二十三路疆域',
    coordinates: [112.0, 31.8],
    isPrimary: true,
  },
  {
    id: 'liao',
    name: '契 丹 · 辽',
    sub: '燕云十六州及塞北',
    coordinates: [115.5, 40.6],
  },
  {
    id: 'xixia',
    name: '西 夏',
    sub: '党项兴庆府疆域',
    coordinates: [106.0, 38.4],
  },
  {
    id: 'tufan',
    name: '吐蕃诸部',
    sub: '唃厮啰及青唐诸部',
    coordinates: [100.2, 34.5],
  },
  {
    id: 'dali',
    name: '大 理 国',
    sub: '大渡河以南段氏疆域',
    coordinates: [101.2, 25.5],
  },
  {
    id: 'jiaozhi',
    name: '交 趾',
    sub: '安南李朝',
    coordinates: [105.8, 21.2],
  },
];

/**
 * Authentic Northern Song Rivers & Canals
 */
export const HISTORICAL_RIVERS: HistoricalRiver[] = [
  {
    id: 'yellow-river-song',
    name: '北宋黄河故道（商胡北流道）',
    songName: '大河（庆历八年北流故道）',
    category: 'historical-yellow',
    description:
      '北宋仁宗庆历八年（1048）黄河于澶州商胡埽决口，改道北流经大名府、恩州、沧州于今天津附近入渤海；熙宁十年（1077）又决于澶州曹村埽泛滥徐州。',
    coordinates: [
      [100.5, 35.5],
      [103.8, 36.05], // 兰州
      [106.2, 38.5], // 兴庆府（银川）
      [108.5, 40.7], // 河套北
      [111.15, 39.2], // 府州晋陕峡谷
      [110.35, 34.6], // 潼关折东
      [112.45, 34.85], // 洛阳北孟津
      [114.3, 35.05], // 东京开封府北（滑州/澶州）
      [115.05, 35.75], // 澶州商胡埽（今濮阳）折向东北！
      [115.3, 36.3], // 大名府
      [116.3, 37.4], // 德州/恩州
      [116.85, 38.3], // 沧州
      [117.65, 39.0], // 天津泥沽海口入渤海
    ],
  },
  {
    id: 'yellow-river-1077-flood',
    name: '熙宁十年黄河决口南泛道',
    songName: '熙宁十年澶州决口泛徐州故道',
    category: 'historical-yellow',
    description:
      '熙宁十年（1077）秋黄河决于澶州曹村埽，洪峰南下夺泗水围困徐州，苏轼率全城军民筑长堤抗洪保城。',
    coordinates: [
      [115.05, 35.75], // 澶州曹村埽
      [116.0, 35.2], // 郓州/济州巨野泽
      [117.185, 34.261], // 徐州城下入泗水
      [118.9, 33.6], // 楚州入淮
    ],
  },
  {
    id: 'bian-canal',
    name: '汴河与江南运河（北宋漕运大动脉）',
    songName: '汴水 · 通济渠 · 江南河',
    category: 'canal',
    description:
      '自黄河引水经东京开封府，东南流经宋州（商丘）、宿州、泗州入淮，再经扬州、润州、常州、苏州直抵杭州，是苏轼一生往返南北最频繁的舟行水道。',
    coordinates: [
      [113.5, 34.9], // 河阴汴口
      [114.307, 34.797], // 东京开封府
      [115.65, 34.45], // 应天府南京（商丘）
      [116.98, 33.63], // 宿州
      [118.3, 33.05], // 泗州（盱眙对岸）入淮
      [119.01, 33.59], // 楚州（山阳渎）
      [119.412, 32.394], // 扬州
      [119.45, 32.2], // 润州（镇江京口）
      [119.954, 31.778], // 常州
      [120.62, 31.3], // 苏州
      [120.75, 30.75], // 秀州（嘉兴）
      [120.155, 30.274], // 杭州
    ],
  },
  {
    id: 'yangtze-river',
    name: '长江（大江）',
    songName: '大江（蜀江 · 荆江 · 扬子江）',
    category: 'major',
    description:
      '苏轼青年出蜀、中年贬谪黄州、量移过庐山金陵、晚年自岭南北归常州，皆泛舟于万里长江之上。',
    coordinates: [
      [101.7, 26.6], // 金沙江
      [104.64, 28.75], // 戎州（宜宾，岷江汇入处）
      [105.44, 28.89], // 泸州
      [106.55, 29.56], // 渝州（重庆）
      [108.03, 30.3], // 忠州
      [109.5, 31.02], // 夔州（三峡瞿塘峡）
      [111.28, 30.69], // 峡州（宜昌）
      [112.24, 30.335], // 江陵府（荆州）
      [113.1, 29.4], // 岳州（洞庭湖口）
      [114.3, 30.55], // 鄂州（武昌）
      [114.872, 30.453], // 黄州赤壁
      [115.99, 29.7], // 江州（九江庐山/湖口）
      [117.06, 30.52], // 池州
      [118.38, 31.33], // 太平州（采石矶）
      [118.796, 32.06], // 江宁府（南京）
      [119.45, 32.2], // 润州（镇江金山）/ 真州
      [120.9, 31.9], // 江阴/通州入东海
    ],
  },
  {
    id: 'min-river',
    name: '岷江',
    songName: '岷水 · 锦江',
    category: 'major',
    description:
      '纵贯成都府路，流经成都、眉州（苏轼故里）、嘉州（乐山），于戎州（宜宾）汇入长江。',
    coordinates: [
      [103.6, 31.5], // 茂州/都江堰
      [104.06, 30.67], // 成都府
      [103.848, 30.075], // 眉州眉山
      [103.766, 29.552], // 嘉州（乐山大佛）
      [104.64, 28.75], // 戎州汇入长江
    ],
  },
  {
    id: 'wei-river',
    name: '渭水',
    songName: '渭水',
    category: 'major',
    description: '流经秦凤路凤翔府（苏轼初仕之地）、京兆府（长安），于潼关汇入黄河。',
    coordinates: [
      [105.7, 34.58], // 秦州
      [107.399, 34.38], // 凤翔府南渭水
      [108.94, 34.35], // 京兆府（长安）
      [110.35, 34.6], // 潼关入河
    ],
  },
  {
    id: 'huai-river',
    name: '淮水',
    songName: '长淮',
    category: 'major',
    description: '流经淮南西路、京西北路（颍州颍水汇入）及淮南东路泗州、楚州入海。',
    coordinates: [
      [113.8, 32.4], // 桐柏山
      [115.0, 32.4], // 光州
      [115.814, 32.89], // 颍州（颍水入淮支流）
      [116.5, 32.6], // 寿州
      [118.3, 33.05], // 泗州/洪泽
      [119.01, 33.59], // 楚州（淮安）
      [119.8, 34.0], // 云梯关入黄海
    ],
  },
  {
    id: 'gan-pearl-river',
    name: '赣水与珠江东江（岭南驿道水系）',
    songName: '赣水 · 浈水 · 东江',
    category: 'major',
    description: '苏轼贬谪惠州、儋州及北归时，溯赣水至虔州，翻大庾岭入北江、珠江与惠州东江。',
    coordinates: [
      [116.1, 29.2], // 鄱阳湖
      [115.85, 28.68], // 洪州（南昌）
      [114.98, 27.1], // 吉州（吉安）
      [114.935, 25.831], // 虔州（赣州）
      [114.38, 25.32], // 大庾岭（陆路分水岭）
      [113.59, 24.81], // 韶州（北江）
      [113.26, 23.13], // 广州
      [114.416, 23.111], // 惠州（东江与西湖）
    ],
  },
];

export const NORTHERN_SONG_CIRCUITS: NorthernSongCircuit[] = [
  { id: 'jingji', name: '京畿路', seat: '东京开封府', coordinates: [114.3, 34.4], note: '北宋首都核心区' },
  { id: 'jingdong', name: '京东路', seat: '应天府/青州', coordinates: [118.4, 36.1], note: '含徐州、密州、登州' },
  { id: 'jingxi', name: '京西路', seat: '西京河南府', coordinates: [112.5, 33.6], note: '含洛阳、汝州、颍州' },
  { id: 'hebei', name: '河北路', seat: '大名府/定州', coordinates: [115.3, 37.9], note: '抗辽最前线，含定州' },
  { id: 'shaanxi', name: '陕西路', seat: '京兆府/凤翔', coordinates: [108.2, 35.1], note: '分永兴军路与秦凤路' },
  { id: 'chengdu', name: '成都府路', seat: '成都府', coordinates: [103.5, 30.8], note: '含眉州、嘉州，苏氏故里' },
  { id: 'jinghu', name: '荆湖北路', seat: '江陵府', coordinates: [113.2, 30.7], note: '含江陵、鄂州、黄州' },
  { id: 'huainan', name: '淮南路', seat: '扬州/寿州', coordinates: [117.6, 32.3], note: '江淮漕运枢纽' },
  { id: 'liangzhe', name: '两浙路', seat: '杭州', coordinates: [120.3, 29.4], note: '含杭州、湖州、常州、苏州' },
  { id: 'jiangnandong', name: '江南东路', seat: '江宁府', coordinates: [118.2, 30.7], note: '含江宁、太平州、池州' },
  { id: 'jiangnanxi', name: '江南西路', seat: '洪州', coordinates: [115.4, 27.6], note: '含江州（庐山）、虔州（赣州）' },
  { id: 'guangnandong', name: '广南东路', seat: '广州', coordinates: [113.8, 23.9], note: '含广州、韶州、英州、惠州' },
  { id: 'guangnanxi', name: '广南西路', seat: '桂州', coordinates: [109.2, 23.2], note: '含桂州、廉州及海南琼州、昌化军（儋州）' },
];

export const HISTORICAL_LANDMARKS: HistoricalLandmark[] = [
  { id: 'qinling', name: '秦岭蜀道', type: 'pass', coordinates: [107.6, 33.7], note: '苏氏父子初出蜀翻越之天险' },
  { id: 'sanxia', name: '夔门三峡', type: 'pass', coordinates: [109.6, 30.9], note: '嘉祐四年南行出峡水道' },
  { id: 'lushan', name: '庐山', type: 'mountain', coordinates: [115.99, 29.56], note: '“不识庐山真面目”题壁处' },
  { id: 'dayuling', name: '大庾岭梅关', type: 'pass', coordinates: [114.38, 25.32], note: '进出岭南必经之五岭咽喉' },
  { id: 'qiongzhou-strait', name: '琼州海峡', type: 'strait', coordinates: [110.2, 20.12], note: '六十二岁贬儋州、六十五岁夜渡北归处' },
];
