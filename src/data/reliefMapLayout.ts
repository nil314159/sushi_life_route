/**
 * Calibrated cartographic layout for the high-resolution Northern Song Topographic Relief Base Map
 * (900 x 1200 image coordinate space, with every city aligned to its exact river/basin/coast landmark).
 */

export type ThreePeriodCategory = 'pre-utai' | 'huangzhou-yuanyou' | 'south-exile';

export interface PeriodLegendMeta {
  id: ThreePeriodCategory;
  label: string;
  years: string;
  color: string;
  arrowId: string;
}

export const THREE_PERIOD_LEGEND: PeriodLegendMeta[] = [
  {
    id: 'pre-utai',
    label: '乌台诗案前轨迹',
    years: '1037–1079年',
    color: '#48882B',
    arrowId: 'arrow-pre-utai',
  },
  {
    id: 'huangzhou-yuanyou',
    label: '贬居黄州至调任兵部尚书期间轨迹',
    years: '1080–1093年',
    color: '#1A4B6E',
    arrowId: 'arrow-huangzhou-yuanyou',
  },
  {
    id: 'south-exile',
    label: '南下轨迹图',
    years: '1093–1101年',
    color: '#A62B2B',
    arrowId: 'arrow-south-exile',
  },
];

export interface MapHubCity {
  id: string;
  name: string;
  modernName: string;
  /** Exact position on the 900 x 1200 portrait relief base map */
  x: number;
  y: number;
  isMajorHub?: boolean;
  labelPosition: 'left' | 'right' | 'top' | 'bottom' | 'bottom-left' | 'top-right';
  specialBadge?: string;
  /** Primary stop index (0-based in SU_SHI_STOPS) when user clicks this city hub */
  primaryStopIndex: number;
  /** All stop indices associated with this city */
  relatedStopIndices: number[];
}

export const RELIEF_MAP_CITIES: MapHubCity[] = [
  {
    id: 'meizhou',
    name: '眉州',
    modernName: '四川眉山',
    x: 226,
    y: 708,
    labelPosition: 'left',
    specialBadge: '1037年\n眉山出生',
    primaryStopIndex: 0,
    relatedStopIndices: [0],
  },
  {
    id: 'chengdu',
    name: '成都',
    modernName: '四川成都',
    x: 246,
    y: 666,
    labelPosition: 'right',
    primaryStopIndex: 0,
    relatedStopIndices: [],
  },
  {
    id: 'fengxiang',
    name: '凤翔',
    modernName: '陕西凤翔',
    x: 365,
    y: 526,
    labelPosition: 'bottom',
    primaryStopIndex: 3,
    relatedStopIndices: [3],
  },
  {
    id: 'jingzhaofu',
    name: '京兆府',
    modernName: '陕西西安',
    x: 426,
    y: 538,
    labelPosition: 'bottom',
    primaryStopIndex: 3,
    relatedStopIndices: [],
  },
  {
    id: 'ruzhou',
    name: '汝州',
    modernName: '河南汝州',
    x: 528,
    y: 520,
    labelPosition: 'left',
    primaryStopIndex: 10,
    relatedStopIndices: [],
  },
  {
    id: 'kaifeng',
    name: '开封',
    modernName: '河南开封',
    x: 592,
    y: 490,
    isMajorHub: true,
    labelPosition: 'right',
    primaryStopIndex: 1,
    relatedStopIndices: [1, 4, 12],
  },
  {
    id: 'dingzhou',
    name: '定州',
    modernName: '河北定州',
    x: 612,
    y: 306,
    labelPosition: 'right',
    primaryStopIndex: 15,
    relatedStopIndices: [15],
  },
  {
    id: 'dengzhou',
    name: '登州',
    modernName: '山东蓬莱',
    x: 742,
    y: 348,
    labelPosition: 'right',
    primaryStopIndex: 11,
    relatedStopIndices: [11],
  },
  {
    id: 'mizhou',
    name: '密州',
    modernName: '山东诸城',
    x: 696,
    y: 426,
    labelPosition: 'left',
    primaryStopIndex: 6,
    relatedStopIndices: [6],
  },
  {
    id: 'xuzhou',
    name: '徐州',
    modernName: '江苏徐州',
    x: 688,
    y: 506,
    labelPosition: 'left',
    primaryStopIndex: 7,
    relatedStopIndices: [7],
  },
  {
    id: 'yingzhou-ah',
    name: '颍州',
    modernName: '安徽阜阳',
    x: 628,
    y: 558,
    labelPosition: 'left',
    primaryStopIndex: 14,
    relatedStopIndices: [],
  },
  {
    id: 'yangzhou',
    name: '扬州',
    modernName: '江苏扬州',
    x: 762,
    y: 580,
    labelPosition: 'right',
    primaryStopIndex: 14,
    relatedStopIndices: [10, 14],
  },
  {
    id: 'changzhou',
    name: '常州',
    modernName: '江苏常州',
    x: 780,
    y: 614,
    labelPosition: 'left',
    specialBadge: '1101年\n卒于常州',
    primaryStopIndex: 19,
    relatedStopIndices: [19],
  },
  {
    id: 'huzhou',
    name: '湖州',
    modernName: '浙江湖州',
    x: 782,
    y: 654,
    labelPosition: 'left',
    primaryStopIndex: 8,
    relatedStopIndices: [8],
  },
  {
    id: 'hangzhou',
    name: '杭州',
    modernName: '浙江杭州',
    x: 798,
    y: 690,
    labelPosition: 'bottom',
    primaryStopIndex: 5,
    relatedStopIndices: [5, 13],
  },
  {
    id: 'jingzhou',
    name: '荆州',
    modernName: '湖北荆州',
    x: 520,
    y: 686,
    labelPosition: 'top',
    primaryStopIndex: 2,
    relatedStopIndices: [2],
  },
  {
    id: 'huangzhou',
    name: '黄州',
    modernName: '湖北黄冈',
    x: 626,
    y: 666,
    labelPosition: 'bottom',
    primaryStopIndex: 9,
    relatedStopIndices: [9],
  },
  {
    id: 'yingzhou-gd',
    name: '英州',
    modernName: '广东英德',
    x: 592,
    y: 922,
    labelPosition: 'left',
    primaryStopIndex: 18,
    relatedStopIndices: [18],
  },
  {
    id: 'huizhou',
    name: '惠州',
    modernName: '广东惠州',
    x: 656,
    y: 972,
    labelPosition: 'right',
    primaryStopIndex: 16,
    relatedStopIndices: [16],
  },
  {
    id: 'danzhou',
    name: '儋州',
    modernName: '海南儋州',
    x: 472,
    y: 1142,
    labelPosition: 'right',
    primaryStopIndex: 17,
    relatedStopIndices: [17],
  },
];

/**
 * Maps each of the 20 chronological stops (index 0..19) to its unique destination [x, y] on the 900x1200 relief map
 * (matching the exact endpoint of each stop's trajectory arc).
 */
export const STOP_RELIEF_COORDS: [number, number][] = [
  [226, 708], // #1 眉州 (起点)
  [592, 490], // #2 东京开封府
  [520, 686], // #3 嘉州·三峡·江陵 (荆州)
  [365, 526], // #4 凤翔府
  [592, 490], // #5 还朝汴京 (开封)
  [798, 690], // #6 杭州（首任）
  [696, 426], // #7 密州
  [688, 506], // #8 徐州
  [782, 654], // #9 湖州
  [626, 666], // #10 黄州（东坡）
  [762, 580], // #11 量移汝州 · 庐山 · 于扬州上表乞常州居住
  [742, 348], // #12 登州
  [592, 490], // #13 元祐翰林 (开封)
  [798, 690], // #14 杭州（知州）
  [762, 580], // #15 颍州 · 扬州
  [612, 306], // #16 定州
  [656, 972], // #17 南迁英州 · 贬惠州安置
  [472, 1142], // #18 儋州（海南）
  [592, 922], // #19 渡海北归 · 英州
  [780, 614], // #20 常州终老
];

/**
 * Deterministic 1-to-1 mapping from each stop index (0..19) to the single target city ID
 * on the Northern Song relief map. Prevents any historical or waypoint city from co-highlighting.
 */
export const STOP_TARGET_CITY_ID: readonly string[] = [
  'meizhou',     // #1 (index 0) 眉州
  'kaifeng',     // #2 (index 1) 东京开封府
  'jingzhou',    // #3 (index 2) 嘉州·三峡·江陵 (荆州)
  'fengxiang',   // #4 (index 3) 凤翔府
  'kaifeng',     // #5 (index 4) 还朝汴京 (开封)
  'hangzhou',    // #6 (index 5) 杭州（首任）
  'mizhou',      // #7 (index 6) 密州
  'xuzhou',      // #8 (index 7) 徐州
  'huzhou',      // #9 (index 8) 湖州
  'huangzhou',   // #10 (index 9) 黄州（东坡）
  'yangzhou',    // #11 (index 10) 量移汝州 · 庐山 · 于扬州上表乞常州居住
  'dengzhou',    // #12 (index 11) 登州
  'kaifeng',     // #13 (index 12) 元祐翰林 (开封)
  'hangzhou',    // #14 (index 13) 杭州（知州）
  'yangzhou',    // #15 (index 14) 颍州 · 扬州
  'dingzhou',    // #16 (index 15) 定州
  'huizhou',     // #17 (index 16) 惠州
  'danzhou',     // #18 (index 17) 儋州（海南）
  'yingzhou-gd', // #19 (index 18) 渡海北归 · 英州
  'changzhou',   // #20 (index 19) 常州终老
];

/**
 * Returns the single target city ID that should highlight when path deduction finishes
 * (legProgress >= 0.995 or at initial stop 0), or null while the traveler dot is in transit.
 */
export function getActiveTargetCityId(
  activeStopIndex: number,
  legProgress: number
): string | null {
  if (activeStopIndex < 0 || activeStopIndex >= STOP_TARGET_CITY_ID.length) {
    return null;
  }
  if (activeStopIndex > 0 && legProgress < 0.995) {
    return null;
  }
  return STOP_TARGET_CITY_ID[activeStopIndex] ?? null;
}

export interface CurvedTrajectoryArc {
  id: string;
  /** Index of the destination stop (1..19) in SU_SHI_STOPS */
  toStopIndex: number;
  period: ThreePeriodCategory;
  label: string;
  /** SVG cubic/quadratic Bézier path in 900x1200 coordinate space */
  d: string;
  /** Optional reversed path strictly for left-to-right readable <textPath> rendering */
  textPathD?: string;
  textOffset?: string;
}

/**
 * Curated sweeping Bézier trajectory arcs matching the reference map's fan separation.
 * Every arc[k] starts at the exact [x, y] endpoint of arc[k - 1] and ends at the exact
 * city center of STOP_RELIEF_COORDS[k].
 */
export const CURVED_TRAJECTORY_ARCS: CurvedTrajectoryArc[] = [
  {
    id: 'arc-1-kaifeng',
    toStopIndex: 1,
    period: 'pre-utai',
    label: '1056年，至汴梁应试',
    d: 'M 226 708 Q 234 686 246 666 Q 285 572 365 526 Q 395 532 426 538 Q 505 498 592 490',
    textPathD: 'M 246 666 Q 285 572 365 526 Q 480 495 592 490',
    textOffset: '14%',
  },
  {
    id: 'arc-2-jingzhou',
    toStopIndex: 2,
    period: 'pre-utai',
    label: '1057年返川服母丧 · 1059年出峡抵荆州',
    d: 'M 592 490 C 460 565, 310 595, 226 708 C 280 785, 410 645, 520 686',
    textPathD: 'M 226 708 C 310 595, 460 565, 592 490',
    textOffset: '18%',
  },
  {
    id: 'arc-3-fengxiang',
    toStopIndex: 3,
    period: 'pre-utai',
    label: '1060年返京 · 1061年十二月赴凤翔任签判',
    d: 'M 520 686 C 510 605, 540 535, 592 490 C 495 452, 415 468, 365 526',
    textPathD: 'M 365 526 C 415 468, 495 452, 592 490',
    textOffset: '14%',
  },
  {
    id: 'arc-4-kaifeng-return',
    toStopIndex: 4,
    period: 'pre-utai',
    label: '1065年任直史馆 · 1066归蜀服父丧 · 1068返京',
    d: 'M 365 526 C 425 422, 515 422, 592 490',
    textPathD: 'M 365 526 C 425 422, 515 422, 592 490',
    textOffset: '8%',
  },
  {
    id: 'arc-5-hangzhou1',
    toStopIndex: 5,
    period: 'pre-utai',
    label: '1071年，任杭州通判',
    d: 'M 592 490 C 685 520, 738 552, 762 580 C 782 612, 795 648, 798 690',
    textPathD: 'M 592 490 C 705 528, 780 605, 798 690',
    textOffset: '36%',
  },
  {
    id: 'arc-6-mizhou',
    toStopIndex: 6,
    period: 'pre-utai',
    label: '1074年，任密州知州',
    d: 'M 798 690 C 818 585, 685 495, 696 426',
    textPathD: 'M 696 426 C 685 495, 818 585, 798 690',
    textOffset: '18%',
  },
  {
    id: 'arc-7-xuzhou',
    toStopIndex: 7,
    period: 'pre-utai',
    label: '1077年，调任徐州知州',
    d: 'M 696 426 C 682 458, 682 480, 688 506',
    textPathD: 'M 688 506 C 682 480, 682 458, 696 426',
    textOffset: '8%',
  },
  {
    id: 'arc-8-huzhou',
    toStopIndex: 8,
    period: 'pre-utai',
    label: '1079年，调任湖州知州',
    d: 'M 688 506 C 732 552, 772 600, 782 654',
    textPathD: 'M 688 506 C 732 552, 772 600, 782 654',
    textOffset: '15%',
  },
  {
    id: 'arc-9-huangzhou',
    toStopIndex: 9,
    period: 'huangzhou-yuanyou',
    label: '1079年乌台诗案押解回京 · 1080年贬居黄州',
    d: 'M 782 654 C 845 578, 735 478, 592 490 C 582 565, 596 622, 626 666',
    textPathD: 'M 592 490 C 582 565, 596 622, 626 666',
    textOffset: '18%',
  },
  {
    id: 'arc-10-lushan-changzhou',
    toStopIndex: 10,
    period: 'huangzhou-yuanyou',
    label: '1084年，量移汝州，于扬州上表乞常州居住',
    d: 'M 626 666 C 692 645, 736 615, 762 580',
    textPathD: 'M 626 666 C 692 645, 736 615, 762 580',
    textOffset: '10%',
  },
  {
    id: 'arc-11-dengzhou',
    toStopIndex: 11,
    period: 'huangzhou-yuanyou',
    label: '1085年，自常州出发，任登州知州',
    d: 'M 762 580 C 778 492, 712 412, 742 348',
    textPathD: 'M 762 580 C 778 492, 712 412, 742 348',
    textOffset: '18%',
  },
  {
    id: 'arc-12-yuanyou-kaifeng',
    toStopIndex: 12,
    period: 'huangzhou-yuanyou',
    label: '1085年，任翰林学士等职',
    d: 'M 742 348 C 655 362, 622 405, 592 490',
    textPathD: 'M 592 490 C 622 405, 655 362, 742 348',
    textOffset: '18%',
  },
  {
    id: 'arc-13-hangzhou2',
    toStopIndex: 13,
    period: 'huangzhou-yuanyou',
    label: '1089年，任杭州知州',
    d: 'M 592 490 C 682 542, 832 568, 798 690',
    textPathD: 'M 592 490 C 682 542, 832 568, 798 690',
    textOffset: '15%',
  },
  {
    id: 'arc-14-yingzhou-yangzhou',
    toStopIndex: 14,
    period: 'huangzhou-yuanyou',
    label: '1091年任颍州太守 · 1092年移知扬州',
    d: 'M 798 690 C 708 655, 652 602, 628 558 C 682 582, 725 586, 762 580',
    textPathD: 'M 628 558 C 682 582, 725 586, 762 580',
    textOffset: '10%',
  },
  {
    id: 'arc-15-dingzhou',
    toStopIndex: 15,
    period: 'south-exile',
    label: '1092年召还兵部尚书 · 1093年任定州知州',
    d: 'M 762 580 C 695 555, 642 525, 592 490 C 612 418, 616 365, 612 306',
    textPathD: 'M 612 306 C 616 365, 612 418, 592 490',
    textOffset: '18%',
  },
  {
    id: 'arc-16-huizhou',
    toStopIndex: 16,
    period: 'south-exile',
    label: '1094年，贬宁远军节度副使，惠州安置',
    d: 'M 612 306 C 578 395, 552 465, 528 520 C 592 595, 652 715, 592 922 C 616 942, 636 958, 656 972',
    textPathD: 'M 528 520 C 592 595, 652 715, 592 922',
    textOffset: '36%',
  },
  {
    id: 'arc-17-danzhou',
    toStopIndex: 17,
    period: 'south-exile',
    label: '1097年，贬居儋州',
    d: 'M 656 972 C 528 925, 448 985, 472 1142',
    textPathD: 'M 472 1142 C 448 985, 528 925, 656 972',
    textOffset: '26%',
  },
  {
    id: 'arc-18-beigui',
    toStopIndex: 18,
    period: 'south-exile',
    label: '1100年，离开海南北归',
    d: 'M 472 1142 C 412 1002, 495 912, 592 922',
    textPathD: 'M 472 1142 C 412 1002, 495 912, 592 922',
    textOffset: '25%',
  },
  {
    id: 'arc-19-changzhou',
    toStopIndex: 19,
    period: 'south-exile',
    label: '1101年，北归卒于常州',
    d: 'M 592 922 C 675 805, 742 708, 780 614',
    textPathD: 'M 592 922 C 675 805, 742 708, 780 614',
    textOffset: '28%',
  },
];
