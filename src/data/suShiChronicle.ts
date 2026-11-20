export type LifePhaseId =
  | 'youth'
  | 'rising'
  | 'provincial'
  | 'huangzhou'
  | 'yuanyou'
  | 'exile';

export interface LiteraryWork {
  id: string;
  title: string;
  year: string;
  genre: '词' | '诗' | '赋' | '文' | '书迹';
  excerpt: string;
  fullText: string;
  annotation: string;
}

export interface TrajectoryStop {
  id: number;
  yearStart: number;
  yearEnd: number;
  reignEra: string;
  ageRange: string;
  songName: string;
  shortSongName: string;
  modernName: string;
  /** [longitude, latitude] in WGS84 */
  coordinates: [number, number];
  /** Optional intermediate waypoints [lon, lat] from previous stop to trace authentic river/post-road paths */
  routeWaypointsFromPrev?: [number, number][];
  phase: LifePhaseId;
  phaseLabel: string;
  officialTitle: string;
  transportMode: '舟行水路' | '鞍马驿道' | '水陆兼程' | '渡海扁舟' | '故里居停';
  /** 0 - 100 scale representing political rank / court standing */
  politicalAltitude: number;
  /** 0 - 100 scale representing literary & philosophical resonance */
  literaryAltitude: number;
  summary: string;
  historicalGeographyNote: string;
  featuredImage?: string;
  works: LiteraryWork[];
}

export interface LifePhaseMeta {
  id: LifePhaseId;
  label: string;
  period: string;
  color: string;
  description: string;
}

export const LIFE_PHASES: LifePhaseMeta[] = [
  {
    id: 'youth',
    label: '蜀中求学与出川',
    period: '1037–1060年（1–24岁）',
    color: '#2E5A44',
    description: '生于成都府路眉州，奉母训发愤向学；嘉祐二年偕父弟出峡赴汴京应试，轰动京师。',
  },
  {
    id: 'rising',
    label: '初入仕途与直史馆',
    period: '1061–1071年（25–35岁）',
    color: '#1E3A5F',
    description: '签判凤翔府历练民事，还朝入直史馆；值王安石变法，上书切谏新法之弊，遂自请外任。',
  },
  {
    id: 'provincial',
    label: '外放江南与山东',
    period: '1071–1079年（36–44岁）',
    color: '#8C5A2B',
    description: '历任杭州通判、密州知州、徐州知州、湖州知州；抗洪救灾、词风豪放，终因乌台诗案罹祸。',
  },
  {
    id: 'huangzhou',
    label: '黄州谪居 · 东坡觉醒',
    period: '1080–1084年（45–49岁）',
    color: '#9A3412',
    description: '九死一生贬为黄州团练副使，躬耕东坡，完成了由少年才子向旷达哲人的精神涅槃。',
  },
  {
    id: 'yuanyou',
    label: '元祐更化与两莅西湖',
    period: '1085–1094年（50–58岁）',
    color: '#5B4636',
    description: '起知登州，召入翰林院知制诰；因不阿附旧党偏激之议，复请外知杭州、颍州、扬州、定州。',
  },
  {
    id: 'exile',
    label: '岭海万里与北归终老',
    period: '1094–1101年（59–66岁）',
    color: '#7F1D1D',
    description: '哲宗亲政后一贬惠州、再贬琼州昌化军（儋州），渡海敷教海南；徽宗即位赦归，病逝于常州。',
  },
];

export const SU_SHI_STOPS: TrajectoryStop[] = [
  {
    id: 1,
    yearStart: 1037,
    yearEnd: 1055,
    reignEra: '景祐四年至至和二年',
    ageRange: '1–19岁',
    songName: '成都府路 · 眉州眉山县',
    shortSongName: '眉州',
    modernName: '四川眉山',
    coordinates: [103.848, 30.075],
    phase: 'youth',
    phaseLabel: '蜀中求学与出川',
    officialTitle: '蜀中布衣学子',
    transportMode: '故里居停',
    politicalAltitude: 25,
    literaryAltitude: 62,
    summary:
      '北宋仁宗景祐三年十二月十九日（公元1037年初）诞于眉州眉山纱縠行。幼承母程夫人诵读《范滂传》，立“奋厉当世”之志；十八岁娶青神王弗，遍读经史百家。',
    historicalGeographyNote:
      '北宋时眉州属成都府路，枕岷江中游沃野，水运发达，雕版印刷冠绝天下，为宋代蜀学与文风鼎盛之枢要。',
    featuredImage: '/src/assets/images/sushi_portrait_scroll_1795002190251.jpg',
    works: [
      {
        id: 'meizhou-1',
        title: '记先夫人不残鸟雀',
        year: '少时追忆',
        genre: '文',
        excerpt: '吾昔少年时，所居书室前，有竹柏杂花，丛生满庭，众鸟巢其上。',
        fullText:
          '吾昔少年时，所居书室前，有竹柏杂花，丛生满庭，众鸟巢其上。武阳君恶杀生，儿童婢仆，皆不得捕取鸟雀。数年间，皆巢于低枝，其鷇可俯而窥也。',
        annotation: '追忆眉山故宅与母亲程夫人仁厚家风，奠定苏轼一生万物并育之仁心。',
      },
    ],
  },
  {
    id: 2,
    yearStart: 1056,
    yearEnd: 1057,
    reignEra: '嘉祐元年至二年',
    ageRange: '20–21岁',
    songName: '京畿路 · 东京开封府',
    shortSongName: '东京开封府',
    modernName: '河南开封',
    coordinates: [114.307, 34.797],
    routeWaypointsFromPrev: [
      [104.06, 30.67], // 成都
      [105.58, 32.43], // 剑门关
      [107.02, 33.07], // 汉中
      [108.94, 34.26], // 京兆府（长安）
      [112.45, 34.62], // 西京洛阳
    ],
    phase: 'youth',
    phaseLabel: '蜀中求学与出川',
    officialTitle: '礼部进士 · 金榜题名',
    transportMode: '鞍马驿道',
    politicalAltitude: 65,
    literaryAltitude: 78,
    summary:
      '嘉祐元年春，苏洵携苏轼、苏辙父子三人自眉州北上，经蜀道过秦岭抵东京开封府。嘉祐二年春礼部贡举，主考官欧阳修读苏轼《刑赏忠厚之至论》惊叹不已，殿试中乙科，名动京师。',
    historicalGeographyNote:
      '北宋东京开封府地处黄淮平原核心，四水（汴河、黄河、惠民河、广济河）贯通，人口逾百万，为当时世界最繁华之都城。',
    featuredImage: '/src/assets/images/kaifeng_bianhe_scroll_1795002193681.jpg',
    works: [
      {
        id: 'kaifeng-1',
        title: '刑赏忠厚之至论',
        year: '嘉祐二年（1057）',
        genre: '文',
        excerpt: '尧、舜、禹、汤、文、武、成、康之际，何其爱民之深，忧民之切，而待天下以君子长者之道也。',
        fullText:
          '尧、舜、禹、汤、文、武、成、康之际，何其爱民之深，忧民之切，而待天下以君子长者之道也。有一善，从而赏之，又从而咏歌嗟叹之，所以乐其始而勉其终；有一不善，从而罚之，又从而哀矜惩创之，所以弃其旧而开其新。故其吁俞之声，欢休惨戚，见于虞、夏、商、周之书。',
        annotation: '嘉祐二年千年科举第一榜代表作，欧阳修赞曰：“读轼书，不觉汗出，快哉快哉！老夫当避路，放他出一头地也。”',
      },
    ],
  },
  {
    id: 3,
    yearStart: 1057,
    yearEnd: 1060,
    reignEra: '嘉祐二年至五年',
    ageRange: '21–24岁',
    songName: '成都府路眉州 → 荆湖北路江陵府',
    shortSongName: '嘉州·三峡·江陵',
    modernName: '四川乐山至湖北荆州',
    coordinates: [112.24, 30.335], // 江陵府节点，代表自蜀出峡水路
    routeWaypointsFromPrev: [
      [108.94, 34.26],
      [103.848, 30.075], // 归眉州奔丧
      [103.766, 29.552], // 嘉州（乐山）
      [104.64, 28.75], // 戎州（宜宾）
      [106.55, 29.56], // 渝州（重庆）
      [108.68, 30.98], // 夔州（奉节白帝城）
      [111.28, 30.69], // 峡州（宜昌）
    ],
    phase: 'youth',
    phaseLabel: '蜀中求学与出川',
    officialTitle: '丁母忧服阕 · 舟行出峡',
    transportMode: '舟行水路',
    politicalAltitude: 50,
    literaryAltitude: 80,
    summary:
      '嘉祐二年四月母程夫人病逝，苏轼赶回眉山丁忧守制。嘉祐四年十月服阕，全家改走岷江、长江水路东下，过嘉州、戎州、渝州、忠州，穿瞿塘、巫峡抵荆州（江陵府），再北上返京，合撰《南行集》。',
    historicalGeographyNote:
      '北宋蜀道有陆路（金牛道、褒斜道）与川江水路之分。此次苏氏父子乘舟顺岷江入大江（长江），历三峡天险至江陵转陆路赴汴京。',
    works: [
      {
        id: 'sanxia-1',
        title: '初发嘉州',
        year: '嘉祐四年（1059）',
        genre: '诗',
        excerpt: '朝发鼓阗阗，西风猎画旃。故乡飘已远，往意浩无边。',
        fullText:
          '朝发鼓阗阗，西风猎画旃。故乡飘已远，往意浩无边。锦水细不见，蛮江清更鲜。奔腾过佛脚，旷荡造平川。野市有禅客，钓台寻暮烟。相期定先到，久立水潺潺。',
        annotation: '出蜀舟行第一篇纪行诗，满怀青年苏轼辞别故土、奔赴广阔天地的豪情。',
      },
      {
        id: 'sanxia-2',
        title: '入峡',
        year: '嘉祐四年（1059）',
        genre: '诗',
        excerpt: '自昔怀清赏，今兹得纵探。长江连楚蜀，万派泻东南。',
        fullText:
          '自昔怀清赏，今兹得纵探。长江连楚蜀，万派泻东南。合水来如电，黔波绿似蓝。余流细不数，远势竞相参。',
        annotation: '纪长江三峡奇崛地貌与楚蜀水道交汇之壮观。',
      },
    ],
  },
  {
    id: 4,
    yearStart: 1061,
    yearEnd: 1064,
    reignEra: '嘉祐六年至治平元年',
    ageRange: '25–28岁',
    songName: '秦凤路 · 凤翔府',
    shortSongName: '凤翔府',
    modernName: '陕西宝鸡凤翔',
    coordinates: [107.399, 34.521],
    routeWaypointsFromPrev: [
      [112.53, 33.0], // 南阳
      [114.307, 34.797], // 开封制科受命
      [111.76, 34.76], // 渑池
      [108.94, 34.26], // 京兆府（长安）
    ],
    phase: 'rising',
    phaseLabel: '初入仕途与直史馆',
    officialTitle: '大正寺评事 · 凤翔府签书判官',
    transportMode: '鞍马驿道',
    politicalAltitude: 68,
    literaryAltitude: 84,
    summary:
      '嘉祐六年应制科入第三等（宋代制科最高等），授大理评事、签书凤翔府判官厅公事。这是苏轼平生第一任地方实职，改革衙前役弊政、祷雨太白山、筑“喜雨亭”，寄弟苏辙《和子由渑池怀旧》。',
    historicalGeographyNote:
      '凤翔府属北宋陕西秦凤路，控扼关中西部与渭水北岸，紧邻西夏前线后勤要冲，多秦汉古迹与终南、太白名山。',
    works: [
      {
        id: 'fengxiang-1',
        title: '和子由渑池怀旧',
        year: '嘉祐六年（1061）',
        genre: '诗',
        excerpt: '人生到处知何似，应似飞鸿踏雪泥。泥上偶然留指爪，鸿飞那复计东西。',
        fullText:
          '人生到处知何似，应似飞鸿踏雪泥。泥上偶然留指爪，鸿飞那复计东西。老僧已死成新塔，坏壁无由见旧题。往日崎岖还记否，路长人困蹇驴嘶。',
        annotation: '赴任凤翔途中怀念与弟苏辙昔年同宿渑池寺之作，“雪泥鸿爪”遂成千古哲思名句。',
      },
      {
        id: 'fengxiang-2',
        title: '喜雨亭记',
        year: '嘉祐七年（1062）',
        genre: '文',
        excerpt: '亭以雨名，志喜也。古者有喜，则以名物，示不忘也。',
        fullText:
          '亭以雨名，志喜也。古者有喜，则以名物，示不忘也……弥月不雨，民方以为忧。越三月，乙卯乃雨，甲子又雨，民以为未足。丁卯大雨，三日乃止。官吏相与庆于庭，商贾相与歌于市，农夫相与忭于野，忧者以喜，病者以愈，而吾亭适成。',
        annotation: '凤翔任上与民同乐之散文名篇，展现青年苏轼体恤稼穑之政风。',
      },
    ],
  },
  {
    id: 5,
    yearStart: 1065,
    yearEnd: 1071,
    reignEra: '治平二年至熙宁四年',
    ageRange: '29–35岁',
    songName: '京畿路 · 东京开封府（护丧往返眉州）',
    shortSongName: '还朝汴京',
    modernName: '河南开封',
    coordinates: [114.35, 34.81],
    routeWaypointsFromPrev: [
      [108.94, 34.26],
      [112.45, 34.62],
    ],
    phase: 'rising',
    phaseLabel: '初入仕途与直史馆',
    officialTitle: '殿中丞 · 直史馆 · 判官告院',
    transportMode: '水陆兼程',
    politicalAltitude: 72,
    literaryAltitude: 82,
    summary:
      '凤翔任满还朝判登闻鼓院，入直史馆。治平二年妻王弗卒；治平三年父苏洵病逝于京师，苏轼兄弟扶柩水陆万里归葬眉山。熙宁二年还朝，正值神宗任王安石变法，苏轼连上《上神宗皇帝书》等力陈新法操切扰民，遭新党排挤，遂自请外放。',
    historicalGeographyNote:
      '护送父丧由汴河入淮、溯长江返眉州，守制期满复经峡江还汴京，往返万余里，饱览东南与川陕民生实况。',
    featuredImage: '/src/assets/images/kaifeng_bianhe_scroll_1795002193681.jpg',
    works: [
      {
        id: 'kaifeng-return-1',
        title: '上神宗皇帝书（万言书）',
        year: '熙宁四年（1071）',
        genre: '文',
        excerpt: '臣之所欲言者三：曰结人心，曰厚风俗，曰存纪纲而已。',
        fullText:
          '今议者谓王安石一切以富国强兵之术启迪上心……臣之所欲言者三：曰结人心，曰厚风俗，曰存纪纲而已。人主所恃者人心也，自古及今，未有和易同众而不安，刚果自用而不危者也。',
        annotation: '针对熙宁变法写下的政论巨制，主张政贵稳健、顺应民心，由此开启半生外放与贬谪之路。',
      },
    ],
  },
  {
    id: 6,
    yearStart: 1071,
    yearEnd: 1074,
    reignEra: '熙宁四年至七年',
    ageRange: '36–39岁',
    songName: '两浙路 · 杭州',
    shortSongName: '杭州（首任）',
    modernName: '浙江杭州',
    coordinates: [120.155, 30.274],
    routeWaypointsFromPrev: [
      [115.65, 34.45], // 宋州（商丘）
      [117.85, 33.3], // 泗州
      [119.41, 32.39], // 扬州
      [119.45, 32.2], // 润州（镇江）
      [120.62, 31.3], // 苏州
    ],
    phase: 'provincial',
    phaseLabel: '外放江南与山东',
    officialTitle: '杭州通判',
    transportMode: '舟行水路',
    politicalAltitude: 58,
    literaryAltitude: 88,
    summary:
      '熙宁四年自汴河顺江南下赴任杭州通判。协助知州陈襄治理六井、巡行浙西诸县体察灾荒，寄情西湖山水与孤山竹阁，写下《饮湖上初晴后雨》等千古绝唱。',
    historicalGeographyNote:
      '北宋杭州号称“东南第一州”，处江南运河终点与钱塘江口交汇处，市舶贸易繁盛，西湖在城西群山环抱之中。',
    works: [
      {
        id: 'hangzhou-1',
        title: '饮湖上初晴后雨二首·其二',
        year: '熙宁六年（1073）',
        genre: '诗',
        excerpt: '水光潋滟晴方好，山色空蒙雨亦奇。欲把西湖比西子，淡妆浓抹总相宜。',
        fullText:
          '水光潋滟晴方好，山色空蒙雨亦奇。欲把西湖比西子，淡妆浓抹总相宜。',
        annotation: '从此西湖得“西子湖”之美名，诗画交融，冠绝古今咏西湖诗。',
      },
      {
        id: 'hangzhou-2',
        title: '六月二十七日望湖楼醉书',
        year: '熙宁五年（1072）',
        genre: '诗',
        excerpt: '黑云翻墨未遮山，白雨跳珠乱入船。卷地风来忽吹散，望湖楼下水如天。',
        fullText:
          '黑云翻墨未遮山，白雨跳珠乱入船。卷地风来忽吹散，望湖楼下水如天。',
        annotation: '于杭州昭庆寺前望湖楼即景挥毫，捕捉盛夏骤雨疾来疾去之神韵。',
      },
    ],
  },
  {
    id: 7,
    yearStart: 1074,
    yearEnd: 1076,
    reignEra: '熙宁七年至九年',
    ageRange: '39–41岁',
    songName: '京东东路 · 密州（高密郡）',
    shortSongName: '密州',
    modernName: '山东诸城',
    coordinates: [119.41, 35.995],
    routeWaypointsFromPrev: [
      [120.62, 31.3], // 苏州
      [119.45, 32.2], // 润州
      [119.01, 33.59], // 楚州（淮安）
      [119.22, 34.6], // 海州（连云港）
    ],
    phase: 'provincial',
    phaseLabel: '外放江南与山东',
    officialTitle: '尚书祠部员外郎 · 知密州军州事',
    transportMode: '水陆兼程',
    politicalAltitude: 62,
    literaryAltitude: 95,
    summary:
      '为与在齐州（济南）任掌书记的弟弟苏辙相近，自请北上知密州。时逢旱蝗连年、盗贼四起，苏轼掘地捕蝗、收养弃婴、整饬武备，葺“超然台”。熙宁八年梦亡妻王弗作《江城子》；熙宁九年中秋大醉作《水调歌头》，开创豪放词派先河。',
    historicalGeographyNote:
      '北宋密州属京东东路，地处山东半岛东南部潍水流域，东临黄海（板桥镇市舶港），为京东海防与盐铁重地。',
    works: [
      {
        id: 'mizhou-1',
        title: '水调歌头·明月几时有',
        year: '熙宁九年（1076）丙辰中秋',
        genre: '词',
        excerpt: '人有悲欢离合，月有阴晴圆缺，此事古难全。但愿人长久，千里共婵娟。',
        fullText:
          '丙辰中秋，欢饮达旦，大醉，作此篇，兼怀子由。\n明月几时有？把酒问青天。不知天上宫阙，今夕是何年。我欲乘风归去，又恐琼楼玉宇，高处不胜寒。起舞弄清影，何似在人间。\n转朱阁，低绮户，照无眠。不应有恨，何事长向别时圆？人有悲欢离合，月有阴晴圆缺，此事古难全。但愿人长久，千里共婵娟。',
        annotation: '胡仔《苕溪渔隐丛话》誉为：“中秋词自东坡《水调歌头》一出，余词尽废。”',
      },
      {
        id: 'mizhou-2',
        title: '江城子·密州出猎',
        year: '熙宁八年（1075）',
        genre: '词',
        excerpt: '会挽雕弓如满月，西北望，射天狼。',
        fullText:
          '老夫聊发少年狂，左牵黄，右擎苍，锦帽貂裘，千骑卷平冈。为报倾城随太守，亲射虎，看孙郎。\n酒酣胸胆尚开张，鬓微霜，又何妨！持节云中，何日遣冯唐？会挽雕弓如满月，西北望，射天狼。',
        annotation: '苏轼第一首豪放词，致书鲜于侁自云：“令东州壮士抵掌顿足而歌之，吹笛击鼓以为节，颇壮观也。”',
      },
      {
        id: 'mizhou-3',
        title: '江城子·乙卯正月二十日夜记梦',
        year: '熙宁八年（1075）',
        genre: '词',
        excerpt: '十年生死两茫茫，不思量，自难忘。千里孤坟，无处话凄凉。',
        fullText:
          '十年生死两茫茫，不思量，自难忘。千里孤坟，无处话凄凉。纵使相逢应不识，尘满面，鬓如霜。\n夜来幽梦忽还乡，小轩窗，正梳妆。相顾无言，惟有泪千行。料得年年肠断处，明月夜，短松冈。',
        annotation: '悼念结发妻子王弗逝世十周年之血泪篇章，情真意切，感人肺腑。',
      },
    ],
  },
  {
    id: 8,
    yearStart: 1077,
    yearEnd: 1079,
    reignEra: '熙宁十年至元丰二年',
    ageRange: '42–44岁',
    songName: '京东西路 · 徐州（彭城郡）',
    shortSongName: '徐州',
    modernName: '江苏徐州',
    coordinates: [117.185, 34.261],
    routeWaypointsFromPrev: [
      [118.35, 35.06], // 沂州（临沂）
    ],
    phase: 'provincial',
    phaseLabel: '外放江南与山东',
    officialTitle: '尚书度支员外郎 · 知徐州军州事',
    transportMode: '鞍马驿道',
    politicalAltitude: 66,
    literaryAltitude: 90,
    summary:
      '熙宁十年四月赴任徐州知州。七月，黄河决于澶州曹村埽，洪峰南下直逼徐州城垣，水高出城中平地二丈八尺。苏轼身先士卒，布衣草履庐于城上四十余日，率虎翼军与百姓筑长堤完城；水退后筑“黄楼”以土克水，神宗下诏嘉奖。又探访利国监铁冶，首倡以石炭（煤炭）冶铁。',
    historicalGeographyNote:
      '徐州位于汴河（通济渠）与泗水交汇要害，为南北漕运咽喉。熙宁十年（1077）黄河澶州大决口，夺泗入淮，是北宋黄河南泛淮河之历史大事，苏轼亲历并成功保住徐州城。',
    works: [
      {
        id: 'xuzhou-1',
        title: '放鹤亭记',
        year: '元丰元年（1078）',
        genre: '文',
        excerpt: '鹤归来兮，东山之阴。其下有人兮，黄冠草履，葛衣而鼓琴。',
        fullText:
          '熙宁十年秋，彭城大水，云龙山人张君之草堂，水及其半扉。明年春，水落，迁于故居之东，东山之麓，升高而望，得异境焉，作亭于其上……归来归来兮，西山不可以久留！',
        annotation: '抗洪获胜后与隐士张天骥游云龙山所作，旷达超逸，传诵一时。',
      },
      {
        id: 'xuzhou-2',
        title: '浣溪沙·徐门石潭谢雨道上作五首（其四）',
        year: '元丰元年（1078）',
        genre: '词',
        excerpt: '簌簌衣巾落枣花，村南村北响缲车。牛衣古柳卖黄瓜。',
        fullText:
          '簌簌衣巾落枣花，村南村北响缲车。牛衣古柳卖黄瓜。\n酒困路长惟欲睡，日高人渴漫思茶。敲门试问野人家。',
        annotation: '徐州谢雨途中描绘北宋初夏农村蚕桑市井画卷，清新质朴。',
      },
    ],
  },
  {
    id: 9,
    yearStart: 1079,
    yearEnd: 1079,
    reignEra: '元丰二年',
    ageRange: '44岁',
    songName: '两浙路湖州 → 东京御史台狱',
    shortSongName: '湖州 · 乌台狱',
    modernName: '浙江湖州至河南开封',
    coordinates: [120.087, 30.894], // 湖州位置
    routeWaypointsFromPrev: [
      [118.78, 32.06],
      [119.95, 31.78],
    ],
    phase: 'provincial',
    phaseLabel: '外放江南与山东',
    officialTitle: '知湖州军州事 · 罹“乌台诗案”下狱',
    transportMode: '舟行水路',
    politicalAltitude: 10,
    literaryAltitude: 86,
    summary:
      '元丰二年三月调知湖州，上《湖州谢上表》，言“知其愚不适时，难以追陪新进；察其老不生事，或能牧养小民”。御史中丞李定、舒亶、何正臣等摘引其诗句弹劾“讪谤朝政”。七月二十八日皇甫遵率兵卒抵湖州捉拿，八月十八日押入东京御史台狱（乌台），系狱百有余日，几死，幸得太皇太后曹氏、王安石、章惇等救护，岁末贬黄州。',
    historicalGeographyNote:
      '湖州地处太湖南岸苕溪之滨。苏轼被捕后经运河押解北上，过太湖、扬州、宿州、南京应天府（商丘）入汴京御史台狱，成为北宋最大文字狱“乌台诗案”。',
    works: [
      {
        id: 'huzhou-1',
        title: '予以事系御史台狱，作二诗以遗子由（其一）',
        year: '元丰二年（1079）狱中绝笔',
        genre: '诗',
        excerpt: '是处青山可埋骨，他年夜雨独伤神。与君世世为兄弟，更结来生未了因。',
        fullText:
          '圣主如天万物春，小臣愚暗自亡身。百年未满先偿债，十口无归更累人。是处青山可埋骨，他年夜雨独伤神。与君世世为兄弟，更结来生未了因。',
        annotation: '乌台狱中自度必死，托狱卒梁成密交弟弟苏辙之绝命诗，兄弟至情催人泪下。',
      },
    ],
  },
  {
    id: 10,
    yearStart: 1080,
    yearEnd: 1084,
    reignEra: '元丰三年至七年',
    ageRange: '45–49岁',
    songName: '荆湖北路 · 黄州（齐安郡）',
    shortSongName: '黄州（东坡）',
    modernName: '湖北黄冈',
    coordinates: [114.872, 30.453],
    routeWaypointsFromPrev: [
      [114.307, 34.797], // 自东京御史台出狱南下
      [114.07, 32.12], // 信阳
      [114.88, 31.2], // 麻城岐亭
    ],
    phase: 'huangzhou',
    phaseLabel: '黄州谪居 · 东坡觉醒',
    officialTitle: '检校尚书水部员外郎 · 黄州团练副使（本州安置）',
    transportMode: '鞍马驿道',
    politicalAltitude: 18,
    literaryAltitude: 100,
    summary:
      '元丰三年二月朔抵黄州，寓定慧院、迁临皋亭，无俸禄以赡家，故人马梦得为请故营地数十亩躬耕，自号“东坡居士”，筑东坡雪堂。在黄州四年余，苏轼完成了生命哲学的彻底升华，创作出《赤壁赋》《后赤壁赋》《念奴娇·赤壁怀古》《定风波》及天下第三行书《黄州寒食诗帖》，登顶中国文学与艺术最高峰。',
    historicalGeographyNote:
      '北宋黄州属荆湖北路，濒临长江北岸，城西北有赤鼻矶（东坡赤壁）突入江心，隔江与武昌（今鄂州）相望，江流浩瀚，山川雄奇。',
    featuredImage: '/src/assets/images/huangzhou_red_cliff_scroll_1795002192111.jpg',
    works: [
      {
        id: 'huangzhou-1',
        title: '念奴娇·赤壁怀古',
        year: '元丰五年（1082）七月',
        genre: '词',
        excerpt: '大江东去，浪淘尽，千古风流人物。故垒西边，人道是，三国周郎赤壁。',
        fullText:
          '大江东去，浪淘尽，千古风流人物。故垒西边，人道是，三国周郎赤壁。乱石穿空，惊涛拍岸，卷起千堆雪。江山如画，一时多少豪杰。\n遥想公瑾当年，小乔初嫁了，雄姿英发。羽扇纶巾，谈笑间，樯橹灰飞烟灭。故国神游，多情应笑我，早生华发。人生如梦，一尊还酹江月。',
        annotation: '豪放词之冠冕，将赤壁江山与千古兴亡融为一炉，气吞万里。',
      },
      {
        id: 'huangzhou-2',
        title: '定风波·莫听穿林打叶声',
        year: '元丰五年（1082）三月七日',
        genre: '词',
        excerpt: '竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生。',
        fullText:
          '三月七日，沙湖道中遇雨，雨具先去，同行皆狼狈，余独不觉。已而遂晴，故作此词。\n莫听穿林打叶声，何妨吟啸且徐行。竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生。\n料峭春风吹酒醒，微冷，山头斜照却相迎。回首向来萧瑟处，归去，也无风雨也无晴。',
        annotation: '苏轼处世哲学的最高写照：超越顺逆宠辱，归于澄明自在。',
      },
      {
        id: 'huangzhou-3',
        title: '前赤壁赋',
        year: '元丰五年（1082）七月既望',
        genre: '赋',
        excerpt: '惟江上之清风，与山间之明月，耳得之而为声，目遇之而成色，取之无禁，用之不竭。',
        fullText:
          '壬戌之秋，七月既望，苏子与客泛舟游于赤壁之下。清风徐来，水波不兴……客亦知夫水与月乎？逝者如斯，而未尝往也；盈虚者如彼，而卒莫消长也。盖将自其变者而观之，则天地曾不能以一瞬；自其不变者而观之，则物与我皆无尽也，而又何羡乎！且夫天地之间，物各有主，苟非吾之所有，虽一毫而莫取。惟江上之清风，与山间之明月，耳得之而为声，目遇之而成色，取之无禁，用之不竭，是造物者之无尽藏也，而吾与子之所共适。',
        annotation: '泛舟黄州赤壁，以水月之变与不变化解宇宙人生之悲感，辞采与玄理并绝千古。',
      },
      {
        id: 'huangzhou-4',
        title: '寒食雨二首（黄州寒食诗帖）',
        year: '元丰五年（1082）寒食节',
        genre: '书迹',
        excerpt: '自我来黄州，已过三寒食。年年欲惜春，春去不容惜。',
        fullText:
          '自我来黄州，已过三寒食。年年欲惜春，春去不容惜。今年又苦雨，两月秋萧瑟。卧闻海棠花，泥污燕支雪。暗中偷负去，夜半真有力，何殊病少年，病起头已白。\n春江欲入户，雨势来不已。小屋如渔舟，濛濛水云里。空庖煮寒菜，破灶烧湿苇。那知是寒食，但见乌衔纸。君门深九重，坟墓在万里。也拟哭途穷，死灰吹不起。',
        annotation: '诗书合璧之绝品，被尊为“天下第三行书”，黄庭坚跋曰：“试使东坡复为之，未必及此。”',
      },
    ],
  },
  {
    id: 11,
    yearStart: 1084,
    yearEnd: 1084,
    reignEra: '元丰七年',
    ageRange: '49岁',
    songName: '江南西路江州庐山 → 江南东路江宁府',
    shortSongName: '庐山 · 江宁府',
    modernName: '江西九江至江苏南京',
    coordinates: [118.796, 32.06], // 江宁府（南京），途经九江庐山
    routeWaypointsFromPrev: [
      [115.99, 29.7], // 江州（九江庐山）
      [117.06, 30.52], // 池州（安庆）
      [118.38, 31.33], // 太平州（芜湖）
    ],
    phase: 'huangzhou',
    phaseLabel: '黄州谪居 · 东坡觉醒',
    officialTitle: '奉诏量移汝州 · 舟行江淮',
    transportMode: '舟行水路',
    politicalAltitude: 35,
    literaryAltitude: 96,
    summary:
      '元丰七年四月奉诏量移汝州团练副使。别黄州顺江东下，至瑞昌亭子山、游庐山十余日，书《题西林壁》；七月抵江宁府（今南京），与退居半山的旧日政敌王安石野服骑驴、把酒论文，王安石叹曰：“不知更几百年，方有如此人物！”后因长途困顿、幼子苏遁夭折于金陵，上表请于常州居住。',
    historicalGeographyNote:
      '自黄州顺长江东下，经九江庐山、湖口石钟山（送长子苏迈赴饶州德兴尉），再顺流抵江宁府（南京），展现北宋长江黄金水道之人文盛景。',
    works: [
      {
        id: 'lushan-1',
        title: '题西林壁',
        year: '元丰七年（1084）五月',
        genre: '诗',
        excerpt: '横看成岭侧成峰，远近高低各不同。不识庐山真面目，只缘身在此山中。',
        fullText:
          '横看成岭侧成峰，远近高低各不同。不识庐山真面目，只缘身在此山中。',
        annotation: '游庐山乾明寺（西林寺）即兴题壁，宋代哲理诗之巅峰代表。',
      },
      {
        id: 'lushan-2',
        title: '石钟山记',
        year: '元丰七年（1084）六月',
        genre: '文',
        excerpt: '事不目见耳闻，而臆断其有无，可乎？',
        fullText:
          '元丰七年六月丁丑，余自齐安舟行适临汝，而长子迈将赴饶之德兴尉，送之至湖口，因得观所谓石钟者……叹曰：噫！此世之所以不传也！而陋者乃以斧斤考击而求之，自以为得其实。余是以记之，盖叹郦元之简，而笑李渤之陋也。',
        annotation: '夜乘小舟实地考察鄱阳湖口石钟山得名之由，体现宋代士人格物实证之科学精神。',
      },
    ],
  },
  {
    id: 12,
    yearStart: 1085,
    yearEnd: 1085,
    reignEra: '元丰八年',
    ageRange: '50岁',
    songName: '京东东路 · 登州（东牟郡）',
    shortSongName: '登州',
    modernName: '山东蓬莱',
    coordinates: [120.758, 37.811],
    routeWaypointsFromPrev: [
      [119.95, 31.78], // 常州
      [119.41, 32.39], // 扬州
      [119.01, 33.59], // 楚州
      [119.41, 35.99], // 密州
    ],
    phase: 'yuanyou',
    phaseLabel: '元祐更化与两莅西湖',
    officialTitle: '朝奉郎 · 知登州军州事',
    transportMode: '水陆兼程',
    politicalAltitude: 75,
    literaryAltitude: 88,
    summary:
      '元丰八年三月神宗崩，哲宗即位，宣仁太后高氏垂帘听政，起苏轼知登州。十月十五日抵登州任，虽在任仅五日即奉诏以礼部郎中召还朝廷，仍留心海防，撰《登州召还议水军状》与《乞罢登莱榷盐状》，并得观秋冬之际罕见的蓬莱海市奇景。',
    historicalGeographyNote:
      '北宋登州地处胶东半岛最北端，北临渤海海峡，与辽东、高丽隔海相望，设有刀鱼巡检水军，为北宋北方最重海防门户。',
    works: [
      {
        id: 'dengzhou-1',
        title: '登州海市（并叙）',
        year: '元丰八年（1085）十月',
        genre: '诗',
        excerpt: '东方云海空复空，群仙出没空明中。荡摇浮世生万象，岂有贝阙藏珠宫。',
        fullText:
          '予闻登州海市旧矣，父老云：常出于春夏，今岁晚不复见矣。予到官五日而去，以不见为恨，祷于海神广德王之庙，明日见焉，乃作此诗。\n东方云海空复空，群仙出没空明中。荡摇浮世生万象，岂有贝阙藏珠宫。心知所见皆幻影，敢以耳目烦神工。岁寒水冷天地闭，为我起蛰鞭鱼龙。重楼翠阜出霜晓，异事惊倒百岁翁……',
        annotation: '苏轼一生足迹最北东端之纪胜名篇，将海市蜃楼之奇幻与民生关怀熔铸一炉。',
      },
    ],
  },
  {
    id: 13,
    yearStart: 1085,
    yearEnd: 1089,
    reignEra: '元祐元年至四年',
    ageRange: '50–54岁',
    songName: '京畿路 · 东京开封府（翰林学士院）',
    shortSongName: '元祐翰林',
    modernName: '河南开封',
    coordinates: [114.307, 34.797],
    routeWaypointsFromPrev: [
      [118.5, 36.8], // 青州
      [117.0, 36.65], // 齐州（济南）
    ],
    phase: 'yuanyou',
    phaseLabel: '元祐更化与两莅西湖',
    officialTitle: '中书舍人 · 翰林学士 · 知制诰 · 知礼部贡举',
    transportMode: '鞍马驿道',
    politicalAltitude: 95,
    literaryAltitude: 92,
    summary:
      '元祐元年还朝，半载之内连迁起居舍人、中书舍人、翰林学士知制诰，位列三品，蒙高太后赐坐赐茶、撤金莲烛送归院，仕途臻于极盛。然司马光等旧党执意尽废新法，苏轼基于地方实历，力争免役法有利于民不可尽废，遂既不见容于新党，亦遭旧党洛派攻讦，屡请外任。',
    historicalGeographyNote:
      '重返东京开封大内学士院，苏轼以亲历黄淮、江南之实政经验审视朝局，拒绝党同伐异。',
    featuredImage: '/src/assets/images/kaifeng_bianhe_scroll_1795002193681.jpg',
    works: [
      {
        id: 'yuanyou-1',
        title: '书李世南所画秋景（其一）',
        year: '元祐三年（1088）',
        genre: '诗',
        excerpt: '人间斤斧日创夷，谁见龙蛇百尺姿。不是溪山曾独往，何人解作挂猿枝。',
        fullText:
          '野水参差落涨痕，疏林欹倒出霜根。扁舟一棹归何处？家在江南黄叶村。',
        annotation: '身处紫禁玉堂之巅而心念江湖扁舟，流露厌倦朝堂党争、渴望外任济民之志。',
      },
    ],
  },
  {
    id: 14,
    yearStart: 1089,
    yearEnd: 1091,
    reignEra: '元祐四年至六年',
    ageRange: '54–56岁',
    songName: '两浙路 · 杭州（再莅西湖）',
    shortSongName: '杭州（知州）',
    modernName: '浙江杭州',
    coordinates: [120.145, 30.25],
    routeWaypointsFromPrev: [
      [117.85, 33.3],
      [119.41, 32.39],
      [120.62, 31.3],
    ],
    phase: 'yuanyou',
    phaseLabel: '元祐更化与两莅西湖',
    officialTitle: '龙图阁学士 · 知杭州军州事 · 浙西兵马钤辖',
    transportMode: '舟行水路',
    politicalAltitude: 85,
    literaryAltitude: 92,
    summary:
      '阔别十五载后，以龙图阁学士出知杭州。针对浙西水旱疫疠，苏轼倾囊捐金建立中国最早公立医坊“安乐坊”；疏浚城内茅山、盐桥二河；并于元祐五年上《乞开杭州西湖状》，募民浚除西湖葑草，取湖泥筑长堤贯通南北，夹道植芙蓉杨柳，后人感念名曰“苏公堤”（苏堤），并于湖心立三石塔（三潭印月）。',
    historicalGeographyNote:
      '北宋杭州饮水与航运全赖西湖与运河水系。苏轼主持的西湖全面疏浚工程与苏堤修筑，彻底拯救了日渐淤塞的西湖水生态，奠定延续千年的西湖空间格局。',
    works: [
      {
        id: 'hangzhou2-1',
        title: '乞开杭州西湖状',
        year: '元祐五年（1090）四月',
        genre: '文',
        excerpt: '杭州之有西湖，如人之有眉目，盖不可废也。',
        fullText:
          '臣闻天下所在，陂湖河渠之利，废兴成毁，皆若有数。惟圣人在上，则兴利除害，不遗余力……杭州之有西湖，如人之有眉目，盖不可废也。唐长庆中，白居易为刺史，方是时，湖溉田千余顷。及钱氏有国，置撩湖兵士千人，日夜开浚。自国初以来，稍废不治，水涸草生，渐成葑田……',
        annotation: '中国古代城市水利与景观规划史上最伟大的奏议文献，直接催生了西湖苏堤。',
      },
      {
        id: 'hangzhou2-2',
        title: '八声甘州·寄参寥子',
        year: '元祐六年（1091）春别杭作',
        genre: '词',
        excerpt: '有情风万里卷潮来，无情送潮归。问钱塘江上，西兴浦口，几度斜晖。',
        fullText:
          '有情风万里卷潮来，无情送潮归。问钱塘江上，西兴浦口，几度斜晖。不用思量今古，俯仰昔人非。谁似东坡老，白首忘机。\n记取西湖西畔，正春山好处，空翠烟霏。算诗人相得，如我与君稀。约他年、东还海道，愿谢公、雅志莫相违。西州路，不应回首，为我沾衣。',
        annotation: '奉诏离杭赴阙之际赠诗僧参寥子，苍凉雄浑，寄托重归西湖之夙愿。',
      },
    ],
  },
  {
    id: 15,
    yearStart: 1091,
    yearEnd: 1092,
    reignEra: '元祐六年至七年',
    ageRange: '56–57岁',
    songName: '京西北路颍州 → 淮南东路扬州',
    shortSongName: '颍州 · 扬州',
    modernName: '安徽阜阳至江苏扬州',
    coordinates: [119.412, 32.394], // 扬州（途经颍州 115.81, 32.89）
    routeWaypointsFromPrev: [
      [114.307, 34.797], // 短暂还朝任吏部尚书
      [115.814, 32.89], // 颍州（安徽阜阳）
      [117.85, 33.3], // 泗州
    ],
    phase: 'yuanyou',
    phaseLabel: '元祐更化与两莅西湖',
    officialTitle: '龙图阁学士 · 历知颍州、扬州军州事',
    transportMode: '水陆兼程',
    politicalAltitude: 80,
    literaryAltitude: 87,
    summary:
      '元祐六年短暂还朝后，乞外知颍州（今安徽阜阳），追怀恩师欧阳修，疏浚颍州西湖；元祐七年春移知淮南重镇扬州，奏免积欠税赋、罢斥劳民伤财的“万花会”。秋九月复以兵部尚书兼侍读召还京师。',
    historicalGeographyNote:
      '颍州有颍州西湖，与杭州西湖并称；扬州扼守江淮漕运交汇处，为北宋东南盐漕总枢。',
    works: [
      {
        id: 'yingzhou-1',
        title: '木兰花令·次欧公西湖韵',
        year: '元祐六年（1091）颍州作',
        genre: '词',
        excerpt: '西湖虽小亦西子，萦流作态清而丰。千顷芙蕖放棹入，水天一色琉璃宫。',
        fullText:
          '霜余已失长淮阔，空听潺潺清颍咽。佳人犹唱醉翁词，四十三年如电抹。\n草头秋露流珠滑，三五盈盈还二八。与余同是识翁人，惟有西湖波底月。',
        annotation: '于颍州西湖步欧阳修旧韵，感念恩师知遇四十三年光阴如电。',
      },
    ],
  },
  {
    id: 16,
    yearStart: 1093,
    yearEnd: 1094,
    reignEra: '元祐八年至绍圣元年',
    ageRange: '58–59岁',
    songName: '河北西路 · 定州（中山府）',
    shortSongName: '定州',
    modernName: '河北定州',
    coordinates: [114.99, 38.516],
    routeWaypointsFromPrev: [
      [114.307, 34.797], // 开封
      [114.5, 36.1], // 相州（安阳）
      [114.51, 38.04], // 真定府（正定）
    ],
    phase: 'yuanyou',
    phaseLabel: '元祐更化与两莅西湖',
    officialTitle: '端明殿学士 · 兼翰林侍读学士 · 知定州军州事',
    transportMode: '鞍马驿道',
    politicalAltitude: 78,
    literaryAltitude: 85,
    summary:
      '元祐八年八月继室王闰之病逝；九月高太后崩，苏轼以两学士出知河北西路边防重镇定州，整顿河北边军弓箭社、修缮营房，偶得黑质白脉奇石名曰“雪浪石”并筑雪浪斋。绍圣元年（1094）哲宗亲政，起用章惇等新党，尽贬元祐旧臣，苏轼自定州连遭贬谪，踏上万里南迁之途。',
    historicalGeographyNote:
      '定州（古中山国）属北宋河北西路，北距宋辽界河（白沟河、燕云十六州南界）咫尺之遥，为北宋防御契丹（辽）铁骑南下的核心帅府重镇。',
    works: [
      {
        id: 'dingzhou-1',
        title: '雪浪石',
        year: '绍圣元年（1094）四月',
        genre: '诗',
        excerpt: '太行西来万马屯，势与岱岳争雄尊。飞狐上党天下脊，半掩落日先黄昏。',
        fullText:
          '太行西来万马屯，势与岱岳争雄尊。飞狐上党天下脊，半掩落日先黄昏。削成山东二百郡，气格偶似峨眉孙。画师争摹雪浪势，天工不见雷斧痕。',
        annotation: '在定州最后时光所作，借太行奇石抒写苍茫雄浑之胸襟，旋即奉旨南贬。',
      },
    ],
  },
  {
    id: 17,
    yearStart: 1094,
    yearEnd: 1097,
    reignEra: '绍圣元年至四年',
    ageRange: '59–62岁',
    songName: '广南东路 · 惠州（博罗郡）',
    shortSongName: '惠州',
    modernName: '广东惠州',
    coordinates: [114.416, 23.111],
    routeWaypointsFromPrev: [
      [114.307, 34.797], // 绕过开封外城南下
      [113.38, 34.26], // 汝州郏城
      [115.99, 29.7], // 九江
      [115.85, 28.68], // 洪州（南昌）
      [114.93, 25.83], // 虔州（赣州）
      [114.38, 25.32], // 大庾岭（梅关古道）
      [113.59, 24.81], // 韶州（韶关）
      [113.26, 23.13], // 广州清远/增城转东江
    ],
    phase: 'exile',
    phaseLabel: '岭海万里与北归终老',
    officialTitle: '宁远军节度副使 · 惠州安置',
    transportMode: '水陆兼程',
    politicalAltitude: 15,
    literaryAltitude: 96,
    summary:
      '自定州南下，途中一贬知英州，未至再贬宁远军节度副使、惠州安置。翻越大庾岭（梅关），于绍圣元年十月二日抵惠州。寓嘉祐寺、合江楼，筑白鹤峰新居；倡修惠州东新桥、西新桥，改良农具“秧马”，引蒲涧山滴水入广州城。绍圣三年七月，相伴二十余载的红颜知己王朝云病逝于惠州，葬于丰湖栖禅寺松林。',
    historicalGeographyNote:
      '北宋广南东路在五岭（大庾岭）以南，当时视作烟瘴之地。苏轼自江西虔州逆赣水而上，翻梅关古道入粤北浈水、北江，再转东江舟行抵惠州。',
    works: [
      {
        id: 'huizhou-1',
        title: '惠州一绝（食荔枝）',
        year: '绍圣三年（1096）',
        genre: '诗',
        excerpt: '日啖荔枝三百颗，不辞长作岭南人。',
        fullText:
          '罗浮山下四时春，卢橘杨梅次第新。日啖荔枝三百颗，不辞长作岭南人。',
        annotation: '把万里投荒之苦化作对岭南风物的深情礼赞，旷达乐观震古烁今。',
      },
      {
        id: 'huizhou-2',
        title: '纵笔',
        year: '绍圣四年（1097）春',
        genre: '诗',
        excerpt: '报道先生春睡美，道人轻打五更钟。',
        fullText:
          '白头萧散满霜风，小阁藤床寄病容。报道先生春睡美，道人轻打五更钟。',
        annotation: '相传此诗传至汴京，章惇读之恨曰：“苏子瞻尚尔快活耶？”遂再贬海南儋州。',
      },
      {
        id: 'huizhou-3',
        title: '西江月·梅花（悼朝云）',
        year: '绍圣三年（1096）冬',
        genre: '词',
        excerpt: '高情已逐晓云空，不与梨花同梦。',
        fullText:
          '玉骨那愁瘴雾，冰姿自有仙风。海仙时遣探芳丛，倒挂绿毛幺凤。\n素面翻嫌粉涴，洗妆不褪唇红。高情已逐晓云空，不与梨花同梦。',
        annotation: '借岭南梅花悼念患难相随而逝于惠州的侍妾王朝云。',
      },
    ],
  },
  {
    id: 18,
    yearStart: 1097,
    yearEnd: 1100,
    reignEra: '绍圣四年至元符三年',
    ageRange: '62–65岁',
    songName: '广南西路 · 昌化军（儋州）',
    shortSongName: '儋州（海南）',
    modernName: '海南儋州中和镇',
    coordinates: [109.349, 19.728],
    routeWaypointsFromPrev: [
      [113.26, 23.13], // 广州
      [111.27, 23.48], // 梧州
      [110.28, 22.63], // 容州/藤州
      [110.1, 20.62], // 雷州（海康）
      [110.15, 20.25], // 徐闻递角场渡琼州海峡
      [110.33, 20.04], // 琼州（海口）
    ],
    phase: 'exile',
    phaseLabel: '岭海万里与北归终老',
    officialTitle: '琼州别驾 · 昌化军安置',
    transportMode: '渡海扁舟',
    politicalAltitude: 10,
    literaryAltitude: 99,
    summary:
      '绍圣四年四月再贬琼州别驾、昌化军（儋州）安置，在当时仅次于满门抄斩。五月中旬在藤州与同贬雷州的弟弟苏辙相遇同行，六月十一日于雷州海康诀别渡海，七月二日抵儋州。黎汉百姓助筑桄榔庵、载酒堂；苏轼以“我本儋耳人”自居，敷扬文教，指导姜唐佐成海南首位举人，并完成一生学术结晶《东坡易传》《论语说》《书传》。',
    historicalGeographyNote:
      '昌化军（儋州）位于海南岛西北部，属北宋广南西路最南端海疆。渡琼州海峡在宋代被称为“鬼门关”，苏轼成为将中原礼乐诗书深植海南岛之文化宗师。',
    featuredImage: '/src/assets/images/danzhou_hainan_scroll_1795002194697.jpg',
    works: [
      {
        id: 'danzhou-1',
        title: '别海南黎民表',
        year: '元符三年（1100）离儋作',
        genre: '诗',
        excerpt: '我本儋耳人，寄生西蜀州。忽然跨海去，譬如事远游。',
        fullText:
          '我本儋耳人，寄生西蜀州。忽然跨海去，譬如事远游。平生生死梦，三者无劣优。知君不再见，欲去且少留。',
        annotation: '把被贬绝域天涯三年视作归家，把眉山故里反视作寄生，境界通透无碍。',
      },
      {
        id: 'danzhou-2',
        title: '汲江煎茶',
        year: '元符三年（1100）',
        genre: '诗',
        excerpt: '枯肠未易禁三椀，坐听荒城长短更。',
        fullText:
          '活水还须活火烹，自临钓石取深清。大瓢贮月归春瓮，小杓分江入夜瓶。雪乳已翻煎处脚，松风忽作泻时声。枯肠未易禁三椀，坐听荒城长短更。',
        annotation: '身处天涯荒城而能“大瓢贮月归春瓮”，于一碗清茶中照见天地诗心。',
      },
    ],
  },
  {
    id: 19,
    yearStart: 1100,
    yearEnd: 1101,
    reignEra: '元符三年至建中靖国元年',
    ageRange: '65–66岁',
    songName: '广南西路廉州 → 江南西路虔州',
    shortSongName: '渡海北归 · 虔州',
    modernName: '广西合浦至江西赣州',
    coordinates: [114.935, 25.831], // 虔州（赣州）
    routeWaypointsFromPrev: [
      [110.33, 20.04], // 琼州渡海
      [110.1, 20.62], // 雷州
      [109.2, 21.67], // 廉州（广西合浦）
      [110.28, 22.63], // 郁林/梧州
      [113.26, 23.13], // 广州
      [113.59, 24.81], // 韶州
      [114.38, 25.32], // 大庾岭
    ],
    phase: 'exile',
    phaseLabel: '岭海万里与北归终老',
    officialTitle: '廉州安置 · 永州安置 · 复朝奉郎提举成都玉局观',
    transportMode: '渡海扁舟',
    politicalAltitude: 45,
    literaryAltitude: 97,
    summary:
      '元符三年正月哲宗崩，徽宗即位，向太后听政大赦，五月苏轼获量移廉州（今广西合浦）。六月二十日夜渡琼州海峡北归，吟出“九死南荒吾不恨，兹游奇绝冠平生”！抵廉州未久再奉命内迁永州，行至英州、韶州获复朝奉郎、提举成都府玉局观，任便居住。建中靖国元年春翻越大庾岭抵虔州（赣州），因赣江水涸居停两月余，为百姓题诗义诊。',
    historicalGeographyNote:
      '北归路线自儋州东行至澄迈通潮阁渡琼州海峡，西折广西合浦（廉州），再溯西江、转北江翻大庾岭入江西赣江顺流北上，横跨两广与江南西路。',
    works: [
      {
        id: 'beigui-1',
        title: '六月二十日夜渡海',
        year: '元符三年（1100）六月二十日',
        genre: '诗',
        excerpt: '九死南荒吾不恨，兹游奇绝冠平生！',
        fullText:
          '参横斗转欲三更，苦雨终风也解晴。云散月明谁点缀？天容海色本澄清。空余鲁叟乘桴意，粗识轩辕奏乐声。九死南荒吾不恨，兹游奇绝冠平生！',
        annotation: '年届六十五岁夜渡琼州海峡北归之凯歌，“天容海色本澄清”乃其一生人格之绝响。',
      },
    ],
  },
  {
    id: 20,
    yearStart: 1101,
    yearEnd: 1101,
    reignEra: '建中靖国元年七月廿八',
    ageRange: '66岁',
    songName: '两浙路 · 常州（毗陵郡）',
    shortSongName: '常州终老',
    modernName: '江苏常州藤花旧馆',
    coordinates: [119.954, 31.778],
    routeWaypointsFromPrev: [
      [115.85, 28.68], // 洪州（南昌）
      [116.6, 29.9], // 湖口
      [117.7, 30.9], // 铜陵
      [118.79, 32.06], // 江宁
      [119.15, 32.28], // 真州（仪征）
      [119.45, 32.2], // 润州（镇江金山寺）
    ],
    phase: 'exile',
    phaseLabel: '岭海万里与北归终老',
    officialTitle: '朝奉郎 · 提举成都府玉局观 · 致仕（南宋追赠太师，谥文忠）',
    transportMode: '舟行水路',
    politicalAltitude: 55,
    literaryAltitude: 100,
    summary:
      '建中靖国元年五月顺长江过金陵、真州，于润州金山寺观李公麟所绘自身画像，题写一生总括《自题金山画像》：“问汝平生功业，黄州惠州儋州。”六月舟抵常州，两岸百姓夹运河瞻仰；时酷暑瘴毒并发，上表请老致仕。七月二十八日（公元1101年8月24日），于常州顾塘桥孙氏馆安然长逝，享年六十六岁，次年归葬汝州郏城小峨眉山。',
    historicalGeographyNote:
      '常州位于江南运河中枢，距苏轼平生挚爱的太湖、西湖咫尺之遥。自眉山出蜀，至常州阖目，苏轼一生行程逾五万余里（合今二万六千余公里），踏遍北宋南北十四路。',
    featuredImage: '/src/assets/images/sushi_portrait_scroll_1795002190251.jpg',
    works: [
      {
        id: 'changzhou-1',
        title: '自题金山画像',
        year: '建中靖国元年（1101）六月',
        genre: '诗',
        excerpt: '心似已灰之木，身如不系之舟。问汝平生功业，黄州惠州儋州。',
        fullText:
          '心似已灰之木，身如不系之舟。问汝平生功业，黄州惠州儋州。',
        annotation: '辞世前两月于镇江金山寺题写的一生自挽与总结：将三次最惨烈之贬谪化作最骄傲之人生勋章。',
      },
    ],
  },
];
