import test from 'node:test';
import assert from 'node:assert/strict';
import {
  lonLatToSvg,
  calculateHistoricalRouteKm,
  calculateCumulativeDistance,
  interpolateAlongWaypoints,
  filterStops,
  filterLiteraryWorks,
  DEFAULT_SONG_MAP_BOUNDS,
} from './trajectoryMath';
import { SU_SHI_STOPS } from '../data/suShiChronicle';

test('lonLatToSvg projects Meizhou west/south of Kaifeng within bounds', () => {
  const [meizhouX, meizhouY] = lonLatToSvg(103.848, 30.075);
  const [kaifengX, kaifengY] = lonLatToSvg(114.307, 34.797);

  assert.ok(meizhouX > 0 && meizhouX < DEFAULT_SONG_MAP_BOUNDS.width);
  assert.ok(meizhouY > 0 && meizhouY < DEFAULT_SONG_MAP_BOUNDS.height);
  assert.ok(meizhouX < kaifengX, 'Meizhou should be west (smaller X) of Kaifeng');
  assert.ok(meizhouY > kaifengY, 'Meizhou should be south (larger Y) of Kaifeng');
});

test('calculateHistoricalRouteKm computes positive distance between Meizhou and Kaifeng', () => {
  const distKm = calculateHistoricalRouteKm([103.848, 30.075], [114.307, 34.797]);
  assert.ok(distKm > 1100 && distKm < 1800, `Expected realistic distance, got ${distKm} km`);
});

test('calculateCumulativeDistance accumulates over 20,000 km across all 20 life stops', () => {
  const startStats = calculateCumulativeDistance(SU_SHI_STOPS, 0, 0);
  assert.equal(startStats.totalKm, 0);
  assert.equal(startStats.totalSongLi, 0);

  const fullLifeStats = calculateCumulativeDistance(SU_SHI_STOPS, SU_SHI_STOPS.length - 1, 0);
  assert.ok(
    fullLifeStats.totalKm > 20000,
    `Expected Su Shi lifetime travel > 20,000 km, got ${fullLifeStats.totalKm}`
  );
  assert.equal(fullLifeStats.totalSongLi, fullLifeStats.totalKm * 2);
});

test('interpolateAlongWaypoints accurately interpolates start, midpoint, and end', () => {
  const waypoints: [number, number][] = [
    [100, 30],
    [110, 30],
    [110, 40],
  ];
  assert.deepEqual(interpolateAlongWaypoints(waypoints, 0), [100, 30]);
  assert.deepEqual(interpolateAlongWaypoints(waypoints, 0.5), [110, 30]);
  assert.deepEqual(interpolateAlongWaypoints(waypoints, 1), [110, 40]);
});

test('filterStops filters by phase and search keyword', () => {
  const huangzhouStops = filterStops(SU_SHI_STOPS, 'huangzhou');
  assert.equal(huangzhouStops.length, 2);
  assert.equal(huangzhouStops[0].shortSongName, '黄州（东坡）');

  const queryStops = filterStops(SU_SHI_STOPS, 'all', '赤壁');
  assert.ok(queryStops.some((s) => s.id === 10));
});

test('filterLiteraryWorks filters by genre and keyword', () => {
  const ciWorks = filterLiteraryWorks(SU_SHI_STOPS, '词');
  assert.ok(ciWorks.length >= 6);

  const shuidiao = filterLiteraryWorks(SU_SHI_STOPS, 'all', '明月几时有');
  assert.equal(shuidiao.length, 1);
  assert.equal(shuidiao[0].stop.shortSongName, '密州');
});

test('getStopThreePeriodCategory classifies stops into the 3 reference trajectory periods', async () => {
  const { getStopThreePeriodCategory } = await import('./trajectoryMath');

  assert.equal(getStopThreePeriodCategory(0), 'pre-utai');
  assert.equal(getStopThreePeriodCategory(8), 'pre-utai');
  assert.equal(getStopThreePeriodCategory(9), 'huangzhou-yuanyou');
  assert.equal(getStopThreePeriodCategory(14), 'huangzhou-yuanyou');
  assert.equal(getStopThreePeriodCategory(15), 'south-exile');
  assert.equal(getStopThreePeriodCategory(19), 'south-exile');
});

test('getPointAlongSvgPath and getPartialSvgPath move dot and line tip together along true curved Bézier arcs', async () => {
  const {
    getPointAlongSvgPath,
    getPartialSvgPath,
    interpolateReliefCoord,
  } = await import('./trajectoryMath');
  const { CURVED_TRAJECTORY_ARCS, STOP_RELIEF_COORDS } = await import(
    '../data/reliefMapLayout'
  );

  // 1. Verify all 19 arcs form a continuous chain (end of arc[i-1] === start of arc[i])
  for (let i = 0; i < CURVED_TRAJECTORY_ARCS.length; i++) {
    const arc = CURVED_TRAJECTORY_ARCS[i];
    const startPt = getPointAlongSvgPath(arc.d, 0);
    const endPt = getPointAlongSvgPath(arc.d, 1);

    if (i === 0) {
      assert.deepEqual([startPt.x, startPt.y], STOP_RELIEF_COORDS[0]);
    } else {
      const prevEnd = getPointAlongSvgPath(CURVED_TRAJECTORY_ARCS[i - 1].d, 1);
      assert.deepEqual(
        [startPt.x, startPt.y],
        [prevEnd.x, prevEnd.y],
        `Arc ${arc.id} start should match previous arc end`
      );
    }
    assert.ok(endPt.x > 0 && endPt.y > 0);
  }

  // 2. Verify the dot follows the curved path (not a straight line) and matches the growing tip of getPartialSvgPath
  const arc1 = CURVED_TRAJECTORY_ARCS[0]; // 眉州 (226, 708) -> 成都 -> 凤翔 -> 京兆府 -> 开封 (592, 490)
  const midCurve = getPointAlongSvgPath(arc1.d, 0.5);
  const straightMidY = (708 + 490) / 2; // 599 on a straight line
  // Because arc-1 curves northwest through Chengdu and Fengxiang (y=526), its midpoint Y is significantly north (< 550) of the straight line (599)
  assert.ok(
    midCurve.y < straightMidY - 45,
    `Expected curved midpoint Y (${midCurve.y}) to follow northern curve through Fengxiang (< ${straightMidY - 45})`
  );

  // 3. Verify that for every progress t, the tip of getPartialSvgPath(d, t) equals getPointAlongSvgPath(d, t)
  for (const t of [0.15, 0.35, 0.5, 0.75, 0.92]) {
    const pt = getPointAlongSvgPath(arc1.d, t);
    const partialD = getPartialSvgPath(arc1.d, t);
    const nums = partialD.match(/-?\d+(?:\.\d+)?/g)?.map(Number) || [];
    const tipX = nums[nums.length - 2];
    const tipY = nums[nums.length - 1];
    assert.equal(tipX, pt.x, `Partial path tip X at t=${t} must match dot X`);
    assert.equal(tipY, pt.y, `Partial path tip Y at t=${t} must match dot Y`);
  }

  // 4. Verify interpolateReliefCoord evaluates along the active stop's curved arc
  const [ix, iy] = interpolateReliefCoord(STOP_RELIEF_COORDS, 1, 0.5);
  assert.equal(ix, midCurve.x);
  assert.equal(iy, midCurve.y);
});

test('every stop 0..19 highlights strictly one destination city when stopped and zero cities while in transit', async () => {
  const { getTravelerStateOnReliefMap } = await import('./trajectoryMath');
  const {
    RELIEF_MAP_CITIES,
    STOP_TARGET_CITY_ID,
    getActiveTargetCityId,
  } = await import('../data/reliefMapLayout');

  assert.equal(STOP_TARGET_CITY_ID.length, SU_SHI_STOPS.length);

  for (let stopIdx = 0; stopIdx < SU_SHI_STOPS.length; stopIdx++) {
    // While in transit on legs 1..19, no city should highlight prematurely
    if (stopIdx > 0) {
      for (const midProgress of [0.1, 0.5, 0.95, 0.98]) {
        assert.equal(
          getActiveTargetCityId(stopIdx, midProgress),
          null,
          `Expected null target city while in transit at stop ${stopIdx} (progress=${midProgress})`
        );
      }
    }

    // When path deduction ends (legProgress = 1), strictly 1 target city highlights
    const targetId = getActiveTargetCityId(stopIdx, 1);
    assert.ok(targetId, `Expected a target city ID at stop ${stopIdx}`);

    const activeCities = RELIEF_MAP_CITIES.filter((c) => c.id === targetId);
    assert.equal(
      activeCities.length,
      1,
      `Stop ${stopIdx} (${SU_SHI_STOPS[stopIdx].shortSongName}) must highlight strictly 1 city`
    );

    const traveler = getTravelerStateOnReliefMap(stopIdx, 1);
    assert.equal(
      activeCities[0].x,
      traveler.x,
      `Stop ${stopIdx} highlighted city X (${activeCities[0].x}) must match resting dot X (${traveler.x})`
    );
    assert.equal(
      activeCities[0].y,
      traveler.y,
      `Stop ${stopIdx} highlighted city Y (${activeCities[0].y}) must match resting dot Y (${traveler.y})`
    );

    // Ensure Ruzhou, Chengdu, Jingzhaofu, Yingzhou (Anhui) never highlight on any stop
    for (const waypointId of ['ruzhou', 'chengdu', 'jingzhaofu', 'yingzhou-ah']) {
      assert.notEqual(
        activeCities[0].id,
        waypointId,
        `Waypoint city ${waypointId} should never highlight on stop ${stopIdx}`
      );
    }

    // Specifically on final stop 19 (Changzhou), strictly Changzhou is active
    if (stopIdx === 19) {
      assert.equal(activeCities[0].id, 'changzhou');
      assert.equal(activeCities[0].name, '常州');
    }
  }
});

