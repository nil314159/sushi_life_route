import { TrajectoryStop, LifePhaseId, LiteraryWork } from '../data/suShiChronicle';
import {
  CURVED_TRAJECTORY_ARCS,
  STOP_RELIEF_COORDS,
} from '../data/reliefMapLayout';

export interface MapBounds {
  minLon: number;
  maxLon: number;
  minLat: number;
  maxLat: number;
  width: number;
  height: number;
}

export const DEFAULT_SONG_MAP_BOUNDS: MapBounds = {
  minLon: 98.5,
  maxLon: 123.5,
  minLat: 17.5,
  maxLat: 41.8,
  width: 1000,
  height: 820,
};

/**
 * Converts geographic [longitude, latitude] into SVG [x, y] coordinates
 * using a cosine-corrected equirectangular projection centered at 30°N (Central China).
 */
export function lonLatToSvg(
  lon: number,
  lat: number,
  bounds: MapBounds = DEFAULT_SONG_MAP_BOUNDS
): [number, number] {
  const xRatio = (lon - bounds.minLon) / (bounds.maxLon - bounds.minLon);
  const yRatio = (bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat);

  const x = Number((xRatio * bounds.width).toFixed(2));
  const y = Number((yRatio * bounds.height).toFixed(2));
  return [x, y];
}

/**
 * Converts a polyline of [lon, lat][] into an SVG path string (M x y L x y ...)
 */
export function coordinatesToSvgPath(
  coords: [number, number][],
  bounds: MapBounds = DEFAULT_SONG_MAP_BOUNDS,
  closed = false
): string {
  if (coords.length === 0) return '';
  const parts = coords.map(([lon, lat], index) => {
    const [x, y] = lonLatToSvg(lon, lat, bounds);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  });
  if (closed) parts.push('Z');
  return parts.join(' ');
}

/**
 * Converts a polyline of [lon, lat][] into a smooth Catmull-Rom / quadratic curve SVG path
 * for natural river and travel route rendering.
 */
export function coordinatesToSmoothSvgPath(
  coords: [number, number][],
  bounds: MapBounds = DEFAULT_SONG_MAP_BOUNDS
): string {
  if (coords.length === 0) return '';
  const pts = coords.map(([lon, lat]) => lonLatToSvg(lon, lat, bounds));
  if (pts.length === 1) return `M ${pts[0][0]} ${pts[0][1]}`;
  if (pts.length === 2) return `M ${pts[0][0]} ${pts[0][1]} L ${pts[1][0]} ${pts[1][1]}`;

  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];

    const cp1x = Number((p1[0] + (p2[0] - p0[0]) / 6).toFixed(2));
    const cp1y = Number((p1[1] + (p2[1] - p0[1]) / 6).toFixed(2));
    const cp2x = Number((p2[0] - (p3[0] - p1[0]) / 6).toFixed(2));
    const cp2y = Number((p2[1] - (p3[1] - p1[1]) / 6).toFixed(2));

    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

/**
 * Computes great-circle distance in kilometers between two [lon, lat] points using Haversine formula,
 * multiplied by a realistic historical terrain winding factor (1.28x for Song Dynasty river/mountain routes).
 */
export function calculateHistoricalRouteKm(
  coordA: [number, number],
  coordB: [number, number],
  windingFactor = 1.28
): number {
  const R = 6371; // Earth radius in km
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(coordB[1] - coordA[1]);
  const dLon = toRad(coordB[0] - coordA[0]);
  const lat1 = toRad(coordA[1]);
  const lat2 = toRad(coordB[1]);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * windingFactor);
}

/**
 * Returns the full sequence of [lon, lat] waypoints between stop[i-1] and stop[i]
 */
export function getLegWaypoints(
  prevStop: TrajectoryStop,
  nextStop: TrajectoryStop
): [number, number][] {
  const intermediate = nextStop.routeWaypointsFromPrev ?? [];
  return [prevStop.coordinates, ...intermediate, nextStop.coordinates];
}

/**
 * Computes the route distance in km for a single leg (stop[i-1] -> stop[i])
 * summing across all intermediate historical waypoints.
 */
export function calculateLegDistanceKm(
  prevStop: TrajectoryStop,
  nextStop: TrajectoryStop
): number {
  const pts = getLegWaypoints(prevStop, nextStop);
  let total = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    total += calculateHistoricalRouteKm(pts[i], pts[i + 1]);
  }
  return total;
}

/**
 * Converts modern kilometers into Northern Song Dynasty Li (北宋里制，1宋里 ≈ 500米 = 0.5公里)
 */
export function kmToSongLi(km: number): number {
  return Math.round(km * 2);
}

/**
 * Computes cumulative travel distance (km and Song Li) from Stop 1 up to a given stop index (0-based)
 * and optional fractional leg progress [0..1] toward the next stop.
 */
export function calculateCumulativeDistance(
  stops: TrajectoryStop[],
  currentIndex: number,
  legProgress = 0
): { totalKm: number; totalSongLi: number; currentLegKm: number } {
  if (stops.length === 0 || currentIndex <= 0) {
    const firstLegKm =
      stops.length > 1 && currentIndex === 0 && legProgress > 0
        ? Math.round(calculateLegDistanceKm(stops[0], stops[1]) * legProgress)
        : 0;
    return {
      totalKm: firstLegKm,
      totalSongLi: kmToSongLi(firstLegKm),
      currentLegKm: firstLegKm,
    };
  }

  const safeIndex = Math.min(currentIndex, stops.length - 1);
  let totalKm = 0;
  let lastCompletedLegKm = 0;

  for (let i = 1; i <= safeIndex; i++) {
    const legKm = calculateLegDistanceKm(stops[i - 1], stops[i]);
    totalKm += legKm;
    if (i === safeIndex) {
      lastCompletedLegKm = legKm;
    }
  }

  if (legProgress > 0 && safeIndex < stops.length - 1) {
    const nextLegKm = calculateLegDistanceKm(stops[safeIndex], stops[safeIndex + 1]);
    const partialKm = Math.round(nextLegKm * Math.min(1, Math.max(0, legProgress)));
    totalKm += partialKm;
    lastCompletedLegKm = nextLegKm;
  }

  return {
    totalKm,
    totalSongLi: kmToSongLi(totalKm),
    currentLegKm: lastCompletedLegKm,
  };
}

/**
 * Interpolates a [lon, lat] position along a multi-segment leg for smooth animation
 */
export function interpolateAlongWaypoints(
  waypoints: [number, number][],
  t: number
): [number, number] {
  if (waypoints.length === 0) return [114.3, 34.8];
  if (waypoints.length === 1 || t <= 0) return waypoints[0];
  if (t >= 1) return waypoints[waypoints.length - 1];

  // Calculate segment lengths in degree space for visual uniformity
  const segLengths: number[] = [];
  let totalLen = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    const dx = waypoints[i + 1][0] - waypoints[i][0];
    const dy = waypoints[i + 1][1] - waypoints[i][1];
    const len = Math.hypot(dx, dy);
    segLengths.push(len);
    totalLen += len;
  }

  if (totalLen === 0) return waypoints[0];

  const targetDist = t * totalLen;
  let accumulated = 0;

  for (let i = 0; i < segLengths.length; i++) {
    const segLen = segLengths[i];
    if (accumulated + segLen >= targetDist || i === segLengths.length - 1) {
      const localT = segLen > 0 ? (targetDist - accumulated) / segLen : 0;
      const lon = waypoints[i][0] + (waypoints[i + 1][0] - waypoints[i][0]) * localT;
      const lat = waypoints[i][1] + (waypoints[i + 1][1] - waypoints[i][1]) * localT;
      return [Number(lon.toFixed(4)), Number(lat.toFixed(4))];
    }
    accumulated += segLen;
  }

  return waypoints[waypoints.length - 1];
}

/**
 * Filters stops by life phase and search query
 */
export function filterStops(
  stops: TrajectoryStop[],
  phase: LifePhaseId | 'all',
  query = ''
): TrajectoryStop[] {
  const q = query.trim().toLowerCase();
  return stops.filter((stop) => {
    const matchesPhase = phase === 'all' || stop.phase === phase;
    if (!matchesPhase) return false;
    if (!q) return true;
    const inBasic =
      stop.songName.toLowerCase().includes(q) ||
      stop.shortSongName.toLowerCase().includes(q) ||
      stop.modernName.toLowerCase().includes(q) ||
      stop.reignEra.toLowerCase().includes(q) ||
      stop.officialTitle.toLowerCase().includes(q) ||
      stop.summary.toLowerCase().includes(q) ||
      String(stop.yearStart).includes(q);
    const inWorks = stop.works.some(
      (w) =>
        w.title.toLowerCase().includes(q) ||
        w.excerpt.toLowerCase().includes(q) ||
        w.fullText.toLowerCase().includes(q)
    );
    return inBasic || inWorks;
  });
}

export interface FlattenedWorkItem {
  work: LiteraryWork;
  stop: TrajectoryStop;
}

/**
 * Extracts and filters all literary works across Su Shi's stops
 */
export function filterLiteraryWorks(
  stops: TrajectoryStop[],
  genre: LiteraryWork['genre'] | 'all',
  query = ''
): FlattenedWorkItem[] {
  const q = query.trim().toLowerCase();
  const items: FlattenedWorkItem[] = [];
  for (const stop of stops) {
    for (const work of stop.works) {
      if (genre !== 'all' && work.genre !== genre) continue;
      if (q) {
        const matches =
          work.title.toLowerCase().includes(q) ||
          work.excerpt.toLowerCase().includes(q) ||
          work.fullText.toLowerCase().includes(q) ||
          work.annotation.toLowerCase().includes(q) ||
          stop.shortSongName.toLowerCase().includes(q) ||
          stop.modernName.toLowerCase().includes(q);
        if (!matches) continue;
      }
      items.push({ work, stop });
    }
  }
  return items;
}

/**
 * Maps a chronological stop index (0-based, 0..19) to one of the 3 canonical trajectory periods
 * from the reference map:
 * - 'pre-utai': 乌台诗案前轨迹 (Stops 0..8, 1037–1079)
 * - 'huangzhou-yuanyou': 贬居黄州至调任兵部尚书期间轨迹 (Stops 9..14, 1080–1092)
 * - 'south-exile': 南下轨迹图 (Stops 15..19, 1093–1101)
 */
export function getStopThreePeriodCategory(
  stopIndex: number
): 'pre-utai' | 'huangzhou-yuanyou' | 'south-exile' {
  if (stopIndex <= 8) return 'pre-utai';
  if (stopIndex <= 14) return 'huangzhou-yuanyou';
  return 'south-exile';
}

export interface Point2D {
  x: number;
  y: number;
}

export type BezierSegment =
  | { type: 'L'; p0: Point2D; p1: Point2D }
  | { type: 'Q'; p0: Point2D; p1: Point2D; p2: Point2D }
  | { type: 'C'; p0: Point2D; p1: Point2D; p2: Point2D; p3: Point2D };

interface ArcLengthSample {
  segIndex: number;
  u: number;
  s: number;
  x: number;
  y: number;
}

interface SampledPathTable {
  startPoint: Point2D;
  segments: BezierSegment[];
  samples: ArcLengthSample[];
  totalLength: number;
}

const pathTableCache = new Map<string, SampledPathTable>();

function lerpPoint(a: Point2D, b: Point2D, u: number): Point2D {
  return {
    x: a.x + (b.x - a.x) * u,
    y: a.y + (b.y - a.y) * u,
  };
}

function fmt(n: number): number {
  return Number(n.toFixed(2));
}

/**
 * Splits a single line, quadratic, or cubic Bézier segment at parameter u in [0, 1]
 * using De Casteljau's algorithm. Returns the exact point on the curve, the tangent angle in degrees,
 * and the SVG path command for the sub-segment [0..u].
 */
function evaluateAndSplitSegment(
  seg: BezierSegment,
  u: number
): { point: Point2D; angle: number; svgCommand: string } {
  const clampedU = Math.max(0, Math.min(1, u));

  if (seg.type === 'L') {
    const pt = lerpPoint(seg.p0, seg.p1, clampedU);
    const dx = seg.p1.x - seg.p0.x;
    const dy = seg.p1.y - seg.p0.y;
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    return {
      point: { x: fmt(pt.x), y: fmt(pt.y) },
      angle: fmt(angle),
      svgCommand: `L ${fmt(pt.x)} ${fmt(pt.y)}`,
    };
  }

  if (seg.type === 'Q') {
    const q0 = lerpPoint(seg.p0, seg.p1, clampedU);
    const q1 = lerpPoint(seg.p1, seg.p2, clampedU);
    const r0 = lerpPoint(q0, q1, clampedU);
    const dx = q1.x - q0.x;
    const dy = q1.y - q0.y;
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    return {
      point: { x: fmt(r0.x), y: fmt(r0.y) },
      angle: fmt(angle),
      svgCommand: `Q ${fmt(q0.x)} ${fmt(q0.y)} ${fmt(r0.x)} ${fmt(r0.y)}`,
    };
  }

  // Cubic Bézier 'C'
  const q0 = lerpPoint(seg.p0, seg.p1, clampedU);
  const q1 = lerpPoint(seg.p1, seg.p2, clampedU);
  const q2 = lerpPoint(seg.p2, seg.p3, clampedU);
  const r0 = lerpPoint(q0, q1, clampedU);
  const r1 = lerpPoint(q1, q2, clampedU);
  const s0 = lerpPoint(r0, r1, clampedU);
  const dx = r1.x - r0.x;
  const dy = r1.y - r0.y;
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  return {
    point: { x: fmt(s0.x), y: fmt(s0.y) },
    angle: fmt(angle),
    svgCommand: `C ${fmt(q0.x)} ${fmt(q0.y)}, ${fmt(r0.x)} ${fmt(r0.y)}, ${fmt(s0.x)} ${fmt(s0.y)}`,
  };
}

function segmentToFullCommand(seg: BezierSegment): string {
  if (seg.type === 'L') {
    return `L ${fmt(seg.p1.x)} ${fmt(seg.p1.y)}`;
  }
  if (seg.type === 'Q') {
    return `Q ${fmt(seg.p1.x)} ${fmt(seg.p1.y)} ${fmt(seg.p2.x)} ${fmt(seg.p2.y)}`;
  }
  return `C ${fmt(seg.p1.x)} ${fmt(seg.p1.y)}, ${fmt(seg.p2.x)} ${fmt(seg.p2.y)}, ${fmt(seg.p3.x)} ${fmt(seg.p3.y)}`;
}

/**
 * Parses an SVG path string containing M, L, Q, C commands and builds a dense
 * arc-length lookup table for uniform-speed sampling and exact curve slicing.
 */
function getSampledPathTable(d: string): SampledPathTable {
  const cached = pathTableCache.get(d);
  if (cached) return cached;

  const tokens = d.match(/[MLQC]|-?\d+(?:\.\d+)?/g) || [];
  let idx = 0;
  let curr: Point2D = { x: 0, y: 0 };
  let startPoint: Point2D = { x: 0, y: 0 };
  const segments: BezierSegment[] = [];

  while (idx < tokens.length) {
    const cmd = tokens[idx++];
    if (cmd === 'M') {
      const x = Number(tokens[idx++]);
      const y = Number(tokens[idx++]);
      curr = { x, y };
      if (segments.length === 0) {
        startPoint = { x, y };
      }
    } else if (cmd === 'L') {
      const x = Number(tokens[idx++]);
      const y = Number(tokens[idx++]);
      const next = { x, y };
      segments.push({ type: 'L', p0: curr, p1: next });
      curr = next;
    } else if (cmd === 'Q') {
      const cx = Number(tokens[idx++]);
      const cy = Number(tokens[idx++]);
      const x = Number(tokens[idx++]);
      const y = Number(tokens[idx++]);
      const next = { x, y };
      segments.push({ type: 'Q', p0: curr, p1: { x: cx, y: cy }, p2: next });
      curr = next;
    } else if (cmd === 'C') {
      const c1x = Number(tokens[idx++]);
      const c1y = Number(tokens[idx++]);
      const c2x = Number(tokens[idx++]);
      const c2y = Number(tokens[idx++]);
      const x = Number(tokens[idx++]);
      const y = Number(tokens[idx++]);
      const next = { x, y };
      segments.push({
        type: 'C',
        p0: curr,
        p1: { x: c1x, y: c1y },
        p2: { x: c2x, y: c2y },
        p3: next,
      });
      curr = next;
    }
  }

  const STEPS_PER_SEG = 80;
  const samples: ArcLengthSample[] = [];
  let cumulativeS = 0;
  let prevPt = startPoint;

  segments.forEach((seg, segIndex) => {
    for (let step = 0; step <= STEPS_PER_SEG; step++) {
      if (segIndex > 0 && step === 0) continue; // Avoid duplicate boundary sample
      const u = step / STEPS_PER_SEG;
      const { point } = evaluateAndSplitSegment(seg, u);
      const dist = Math.hypot(point.x - prevPt.x, point.y - prevPt.y);
      cumulativeS += dist;
      samples.push({
        segIndex,
        u,
        s: cumulativeS,
        x: point.x,
        y: point.y,
      });
      prevPt = point;
    }
  });

  const table: SampledPathTable = {
    startPoint,
    segments,
    samples,
    totalLength: cumulativeS,
  };
  pathTableCache.set(d, table);
  return table;
}

/**
 * Resolves normalized arc-length progress t in [0, 1] to the exact segment index and local Bezier parameter u.
 */
function resolveSegmentAndU(
  table: SampledPathTable,
  t: number
): { segIndex: number; u: number } {
  if (table.segments.length === 0) {
    return { segIndex: 0, u: 0 };
  }
  if (t <= 0 || table.totalLength <= 0) {
    return { segIndex: 0, u: 0 };
  }
  if (t >= 1) {
    return { segIndex: table.segments.length - 1, u: 1 };
  }

  const targetS = t * table.totalLength;
  const { samples } = table;

  // Binary search in cumulative arc length samples
  let lo = 0;
  let hi = samples.length - 1;
  while (lo < hi - 1) {
    const mid = (lo + hi) >> 1;
    if (samples[mid].s <= targetS) {
      lo = mid;
    } else {
      hi = mid;
    }
  }

  const s0 = samples[lo];
  const s1 = samples[hi];
  const segSpan = s1.s - s0.s;
  const frac = segSpan > 1e-6 ? (targetS - s0.s) / segSpan : 0;

  if (s0.segIndex === s1.segIndex) {
    return {
      segIndex: s0.segIndex,
      u: s0.u + (s1.u - s0.u) * frac,
    };
  }
  // Boundary between two segments: s0 is at u=1 of prev segment, s1 is at u=1/STEPS of next segment
  return {
    segIndex: s1.segIndex,
    u: s1.u * frac,
  };
}

/**
 * Returns the total pixel length of an SVG path string in 900x1200 map coordinates.
 */
export function getSvgPathLength(d: string): number {
  return getSampledPathTable(d).totalLength;
}

/**
 * Returns the exact [x, y] coordinate and tangent angle (in degrees) at normalized
 * arc-length progress t in [0, 1] along an SVG Bézier path `d`.
 */
export function getPointAlongSvgPath(
  d: string,
  t: number
): { x: number; y: number; angle: number } {
  const table = getSampledPathTable(d);
  if (table.segments.length === 0) {
    return { x: table.startPoint.x, y: table.startPoint.y, angle: 0 };
  }
  const { segIndex, u } = resolveSegmentAndU(table, t);
  const { point, angle } = evaluateAndSplitSegment(table.segments[segIndex], u);
  return { x: point.x, y: point.y, angle };
}

/**
 * Returns an exact analytical SVG sub-path string from progress 0 up to progress t in [0, 1]
 * using De Casteljau subdivision. Its final endpoint is guaranteed to be identical to
 * getPointAlongSvgPath(d, t).
 */
export function getPartialSvgPath(d: string, t: number): string {
  const table = getSampledPathTable(d);
  if (table.segments.length === 0 || t <= 0) {
    return `M ${fmt(table.startPoint.x)} ${fmt(table.startPoint.y)}`;
  }
  if (t >= 1) {
    return d;
  }

  const { segIndex, u } = resolveSegmentAndU(table, t);
  const parts: string[] = [
    `M ${fmt(table.startPoint.x)} ${fmt(table.startPoint.y)}`,
  ];

  for (let i = 0; i < segIndex; i++) {
    parts.push(segmentToFullCommand(table.segments[i]));
  }

  if (u > 0) {
    const { svgCommand } = evaluateAndSplitSegment(table.segments[segIndex], u);
    parts.push(svgCommand);
  }

  return parts.join(' ');
}

/**
 * Computes the exact [x, y] coordinate and tangent angle on the 900x1200 relief map
 * along the real curved trajectory arc for (activeStopIndex, legProgress).
 * - For activeStopIndex === 0 (birthplace Meizhou), returns STOP_RELIEF_COORDS[0].
 * - For activeStopIndex >= 1, evaluates CURVED_TRAJECTORY_ARCS[activeStopIndex - 1].d at legProgress in [0, 1].
 */
export function getTravelerStateOnReliefMap(
  activeStopIndex: number,
  legProgress: number
): { x: number; y: number; angle: number } {
  if (activeStopIndex <= 0) {
    const [x, y] = STOP_RELIEF_COORDS[0] || [226, 708];
    return { x, y, angle: 0 };
  }
  const arc = CURVED_TRAJECTORY_ARCS.find(
    (a) => a.toStopIndex === activeStopIndex
  );
  if (!arc) {
    const safeIdx = Math.min(STOP_RELIEF_COORDS.length - 1, activeStopIndex);
    const [x, y] = STOP_RELIEF_COORDS[safeIdx];
    return { x, y, angle: 0 };
  }
  return getPointAlongSvgPath(arc.d, Math.max(0, Math.min(1, legProgress)));
}

/**
 * Interpolates [x, y] on the 900x1200 relief map along the actual curved Bézier trajectory arc.
 */
export function interpolateReliefCoord(
  _coords: [number, number][],
  activeStopIndex: number,
  legProgress: number
): [number, number] {
  const { x, y } = getTravelerStateOnReliefMap(activeStopIndex, legProgress);
  return [x, y];
}

