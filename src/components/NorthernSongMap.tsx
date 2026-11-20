import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Compass,
  Navigation,
  Ship,
  Footprints,
  Anchor,
  Home,
  Layers,
} from 'lucide-react';
import { TrajectoryStop, LifePhaseId } from '../data/suShiChronicle';
import {
  THREE_PERIOD_LEGEND,
  ThreePeriodCategory,
  RELIEF_MAP_CITIES,
  CURVED_TRAJECTORY_ARCS,
  getActiveTargetCityId,
} from '../data/reliefMapLayout';
import {
  getPartialSvgPath,
  getTravelerStateOnReliefMap,
  getStopThreePeriodCategory,
} from '../utils/trajectoryMath';

export interface MapLayerState {
  showRegimes: boolean;
  showRivers: boolean;
  showCircuits: boolean;
  showModernNames: boolean;
  showFullTrajectory: boolean;
  cameraFollow: boolean;
}

interface NorthernSongMapProps {
  stops: TrajectoryStop[];
  activeStopIndex: number;
  legProgress: number;
  isPlaying: boolean;
  selectedPhase: LifePhaseId | 'all';
  layers: MapLayerState;
  onSelectStop: (index: number) => void;
  onToggleLayer: (key: keyof MapLayerState) => void;
  isTheaterMode?: boolean;
}

const RELIEF_BASEMAP_URL =
  '/src/assets/images/song_relief_basemap_portrait_1795009481013.jpg';
const REFERENCE_ORIGINAL_URL =
  '/assets/aistudio/____________________1_______________d41b86b4.jpg';

const VIEWBOX_W = 900;
const VIEWBOX_H = 1200;

export const NorthernSongMap: React.FC<NorthernSongMapProps> = ({
  stops,
  activeStopIndex,
  legProgress,
  isPlaying,
  layers,
  onSelectStop,
  onToggleLayer,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{
    x: number;
    y: number;
    panX: number;
    panY: number;
  } | null>(null);

  const [selectedPeriod, setSelectedPeriod] = useState<
    ThreePeriodCategory | 'all'
  >('all');
  const [showArcLabels, setShowArcLabels] = useState<boolean>(true);
  const [useReferenceOverlay, setUseReferenceOverlay] =
    useState<boolean>(false);
  const [hoveredCityId, setHoveredCityId] = useState<string | null>(null);

  const activeStop = stops[activeStopIndex] || stops[0];

  // Compute traveler position along the exact curved Bézier arc in 900x1200 relief coordinate space
  const travelerState = useMemo(
    () => getTravelerStateOnReliefMap(activeStopIndex, legProgress),
    [activeStopIndex, legProgress]
  );
  const travelerXY: [number, number] = [travelerState.x, travelerState.y];

  // Smooth camera follow when enabled
  useEffect(() => {
    if (!layers.cameraFollow) return;
    const targetZoom = Math.max(zoom, 1.35);
    const centerX = VIEWBOX_W / 2;
    const centerY = VIEWBOX_H / 2;
    const targetPanX = (centerX - travelerXY[0]) * targetZoom * 0.45;
    const targetPanY = (centerY - travelerXY[1]) * targetZoom * 0.45;

    setPan({
      x: Math.max(-320, Math.min(320, targetPanX)),
      y: Math.max(-360, Math.min(360, targetPanY)),
    });
  }, [layers.cameraFollow, travelerXY, activeStopIndex, zoom]);

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging || !dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan({
      x: Math.max(-450, Math.min(450, dragStartRef.current.panX + dx)),
      y: Math.max(-450, Math.min(450, dragStartRef.current.panY + dy)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const currentTransportMode = activeStop.transportMode;

  const activePeriod = getStopThreePeriodCategory(activeStopIndex);

  return (
    <div className="relative w-full h-full flex flex-col bg-[#EBF0EC] border border-[#C7C2B4] rounded-lg overflow-hidden select-none">
      {/* Top Map Layer & Period Filter Control Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 bg-[#F7F3EA]/95 border-b border-[#D6CBB8] z-10">
        <div className="flex items-center gap-2 text-xs text-[#57534E]">
          <Compass className="w-4 h-4 text-[#1B6A53] shrink-0" />
          <span className="font-serif font-semibold text-[#1C1917] whitespace-nowrap">
            北宋地形浮雕生平轨迹图
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums whitespace-nowrap hidden xl:inline">
            三期弧线与山川地貌底图
          </span>
        </div>

        {/* Period & Layer Segmented Controls */}
        <div className="flex flex-wrap items-center gap-1.5">
          <div
            role="group"
            aria-label="按三期轨迹筛选"
            className="flex items-center gap-1 bg-[#EAE0CE] p-1 rounded-md"
          >
            <button
              type="button"
              onClick={() => setSelectedPeriod('all')}
              className={`px-2 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                selectedPeriod === 'all'
                  ? 'bg-[#1C1917] text-[#F7F3EA]'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              全部三期轨迹
            </button>
            <button
              type="button"
              onClick={() =>
                setSelectedPeriod(
                  selectedPeriod === 'pre-utai' ? 'all' : 'pre-utai'
                )
              }
              className={`px-2 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                selectedPeriod === 'pre-utai'
                  ? 'bg-[#48882B] text-white'
                  : 'text-[#366820] hover:bg-[#DFD3BE]'
              }`}
            >
              乌台案前
            </button>
            <button
              type="button"
              onClick={() =>
                setSelectedPeriod(
                  selectedPeriod === 'huangzhou-yuanyou'
                    ? 'all'
                    : 'huangzhou-yuanyou'
                )
              }
              className={`px-2 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                selectedPeriod === 'huangzhou-yuanyou'
                  ? 'bg-[#1A4B6E] text-white'
                  : 'text-[#1A4B6E] hover:bg-[#DFD3BE]'
              }`}
            >
              黄州至元祐
            </button>
            <button
              type="button"
              onClick={() =>
                setSelectedPeriod(
                  selectedPeriod === 'south-exile' ? 'all' : 'south-exile'
                )
              }
              className={`px-2 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                selectedPeriod === 'south-exile'
                  ? 'bg-[#A62B2B] text-white'
                  : 'text-[#A62B2B] hover:bg-[#DFD3BE]'
              }`}
            >
              南下与北归
            </button>
          </div>

          <div className="flex items-center gap-1 bg-[#EAE0CE] p-1 rounded-md">
            <button
              type="button"
              onClick={() => setShowArcLabels((v) => !v)}
              className={`px-2 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                showArcLabels
                  ? 'bg-[#1B6A53] text-white'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              弧线纪年注记
            </button>
            <button
              type="button"
              onClick={() => onToggleLayer('showModernNames')}
              className={`px-2 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                layers.showModernNames
                  ? 'bg-[#9A3412] text-white'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              今名对照
            </button>
            <button
              type="button"
              onClick={() => onToggleLayer('showFullTrajectory')}
              className={`px-2 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                layers.showFullTrajectory
                  ? 'bg-[#1C1917] text-white'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              全览弧线
            </button>
            <button
              type="button"
              onClick={() => setUseReferenceOverlay((v) => !v)}
              title="切换精绘交互浮雕底图与原版示意图底本"
              className={`px-2 py-1 text-xs font-medium rounded flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 ${
                useReferenceOverlay
                  ? 'bg-[#78350F] text-white'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>{useReferenceOverlay ? '原版示意图' : '浮雕净底图'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Topographic Relief Map Canvas */}
      <div className="relative w-full h-[600px] lg:h-[660px] overflow-hidden bg-[#DCE5E2]">
        <svg
          data-testid="northern-song-map-svg"
          viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
          preserveAspectRatio="xMidYMid meet"
          className={`w-full h-full block ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          role="img"
          aria-label="北宋时期苏轼生平轨迹地形浮雕交互地图"
        >
          <defs>
            {/* Three-Period Arrowhead Markers matching the Reference Legend */}
            {THREE_PERIOD_LEGEND.map((p) => (
              <marker
                key={p.arrowId}
                id={p.arrowId}
                viewBox="0 0 12 12"
                refX="8"
                refY="6"
                markerWidth="6.5"
                markerHeight="6.5"
                orient="auto-start-reverse"
              >
                <path
                  d="M 1 2 L 10 6 L 1 10 L 3 6 Z"
                  fill={p.color}
                />
              </marker>
            ))}

            {/* Path definitions for curved <textPath> labels */}
            {CURVED_TRAJECTORY_ARCS.map((arc) => (
              <path
                key={`def-${arc.id}`}
                id={`text-path-${arc.id}`}
                d={arc.textPathD || arc.d}
              />
            ))}

            {/* Soft drop shadow for city markers */}
            <filter id="nodeShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.28" />
            </filter>
          </defs>

          <g
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
              transition: isDragging
                ? 'none'
                : 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* 1. High-Resolution Shaded Relief Topographic Base Map */}
            <image
              href={
                useReferenceOverlay
                  ? REFERENCE_ORIGINAL_URL
                  : RELIEF_BASEMAP_URL
              }
              x={0}
              y={0}
              width={VIEWBOX_W}
              height={VIEWBOX_H}
              preserveAspectRatio="none"
            />

            {/* When using the clean relief basemap, render the interactive vector elements, title, legend, curved arcs & city hubs */}
            {!useReferenceOverlay && (
              <>
                {/* 2. Top-Left Poster Title & 3-Period Route Legend (Matching Reference Style) */}
                <g transform="translate(38, 76)">
                  <text
                    x={0}
                    y={0}
                    fill="#1E6F56"
                    fontSize={56}
                    fontWeight={700}
                    letterSpacing="0.04em"
                    fontFamily="Noto Serif SC, serif"
                  >
                    苏东坡人生轨迹
                  </text>
                  <text
                    x={0}
                    y={66}
                    fill="#1E6F56"
                    fontSize={56}
                    fontWeight={700}
                    letterSpacing="0.08em"
                    fontFamily="Noto Serif SC, serif"
                  >
                    示意图
                  </text>

                  {/* Route Legend Box ("线路说明") */}
                  <g transform="translate(4, 102)">
                    <text
                      x={0}
                      y={0}
                      fill="#292524"
                      fontSize={15}
                      fontWeight={600}
                      fontFamily="Noto Serif SC, serif"
                    >
                      线路说明
                    </text>

                    {THREE_PERIOD_LEGEND.map((item, idx) => {
                      const rowY = 14 + idx * 26;
                      const isDimmed =
                        selectedPeriod !== 'all' && selectedPeriod !== item.id;
                      return (
                        <g
                          key={item.id}
                          transform={`translate(0, ${rowY})`}
                          className="cursor-pointer"
                          style={{ opacity: isDimmed ? 0.35 : 1 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPeriod((prev) =>
                              prev === item.id ? 'all' : item.id
                            );
                          }}
                        >
                          <rect
                            x={0}
                            y={0}
                            width={48}
                            height={18}
                            fill="#F7F8F6"
                            stroke="#57534E"
                            strokeWidth={0.9}
                          />
                          <line
                            x1={5}
                            y1={9}
                            x2={39}
                            y2={9}
                            stroke={item.color}
                            strokeWidth={2.2}
                            markerEnd={`url(#${item.arrowId})`}
                          />
                          <text
                            x={56}
                            y={14}
                            fill="#1C1917"
                            fontSize={14.5}
                            fontWeight={500}
                            fontFamily="Noto Serif SC, serif"
                          >
                            {item.label}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                </g>

                {/* 3. Sweeping Curved Bézier Trajectory Arcs & <textPath> Annotations */}
                <g>
                  {CURVED_TRAJECTORY_ARCS.map((arc) => {
                    const periodMeta = THREE_PERIOD_LEGEND.find(
                      (p) => p.id === arc.period
                    )!;
                    const isPreviousCompleted =
                      arc.toStopIndex < activeStopIndex;
                    const isCurrentLeg = arc.toStopIndex === activeStopIndex;
                    const isInTransitLeg =
                      isCurrentLeg &&
                      legProgress > 0.005 &&
                      legProgress < 0.995;
                    const isCompleted =
                      isPreviousCompleted ||
                      (isCurrentLeg && legProgress >= 0.995);
                    const isFuture = arc.toStopIndex > activeStopIndex;
                    const isPeriodFilteredOut =
                      selectedPeriod !== 'all' && selectedPeriod !== arc.period;

                    // During active playback, future arcs stay hidden until the dot & line draw them;
                    // when paused, future arcs are shown as faint dashed preview if showFullTrajectory is enabled.
                    if (isFuture && (isPlaying || !layers.showFullTrajectory)) {
                      return null;
                    }

                    const activePartialD =
                      isCurrentLeg && legProgress < 0.995
                        ? getPartialSvgPath(
                            arc.d,
                            Math.max(0.01, Math.min(1, legProgress))
                          )
                        : arc.d;

                    const strokeOpacity = isPeriodFilteredOut
                      ? 0.14
                      : isInTransitLeg
                      ? 1
                      : isCompleted
                      ? 0.88
                      : 0.34;

                    return (
                      <g
                        key={arc.id}
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectStop(arc.toStopIndex);
                        }}
                      >
                        {/* Optional faint dashed guide for current leg while paused */}
                        {isCurrentLeg &&
                          !isPlaying &&
                          layers.showFullTrajectory &&
                          legProgress < 0.995 && (
                            <path
                              d={arc.d}
                              fill="none"
                              stroke={periodMeta.color}
                              strokeWidth={1.5}
                              strokeOpacity={0.22}
                              strokeDasharray="5 4"
                            />
                          )}

                        {/* Growing outer halo strictly while the active leg is in transit (clears when deduction ends) */}
                        {isInTransitLeg && (
                          <path
                            d={activePartialD}
                            fill="none"
                            stroke="#FEF3C7"
                            strokeWidth={6}
                            strokeOpacity={0.8}
                            strokeLinecap="round"
                          />
                        )}

                        {/* Main Curved Trajectory Line (grows from 0 -> legProgress in lockstep with the moving dot) */}
                        {(!isCurrentLeg || legProgress > 0.005) && (
                          <path
                            d={activePartialD}
                            fill="none"
                            stroke={periodMeta.color}
                            strokeWidth={
                              isInTransitLeg
                                ? 3.2
                                : isCompleted
                                ? 2.3
                                : 1.5
                            }
                            strokeOpacity={strokeOpacity}
                            strokeDasharray={isFuture ? '5 4' : undefined}
                            strokeLinecap="round"
                            markerEnd={
                              !isCurrentLeg || legProgress > 0.03
                                ? `url(#${periodMeta.arrowId})`
                                : undefined
                            }
                          />
                        )}

                        {/* Curved <textPath> Historical Annotation along the Arc */}
                        {showArcLabels &&
                          !isPeriodFilteredOut &&
                          (isCompleted ||
                            (isCurrentLeg && legProgress >= 0.25) ||
                            (isFuture &&
                              !isPlaying &&
                              layers.showFullTrajectory)) && (
                            <text
                              dy={-4}
                              fill={isInTransitLeg ? '#7F1D1D' : '#1C1917'}
                              fillOpacity={
                                isCompleted || isInTransitLeg ? 0.92 : 0.62
                              }
                              fontSize={11.5}
                              fontWeight={isInTransitLeg ? 700 : 600}
                              fontFamily="Noto Serif SC, serif"
                              stroke="#EAD8B3"
                              strokeWidth={3.2}
                              paintOrder="stroke"
                            >
                              <textPath
                                href={`#text-path-${arc.id}`}
                                startOffset={arc.textOffset || '18%'}
                              >
                                {arc.label}
                              </textPath>
                            </text>
                          )}
                      </g>
                    );
                  })}
                </g>

                {/* 4. White-Ringed City Hub Nodes & Classical Typography Labels */}
                <g>
                  {(() => {
                    const activeTargetCityId = getActiveTargetCityId(
                      activeStopIndex,
                      legProgress
                    );
                    return RELIEF_MAP_CITIES.map((city) => {
                      const isCurrentCity = city.id === activeTargetCityId;
                      const isHovered = hoveredCityId === city.id;

                      // Compute label anchor & offset relative to city circle
                      let labelDx = 0;
                      let labelDy = 0;
                      let textAnchor: 'start' | 'middle' | 'end' = 'middle';

                      switch (city.labelPosition) {
                        case 'left':
                          labelDx = -12;
                          labelDy = 6;
                          textAnchor = 'end';
                          break;
                        case 'right':
                          labelDx = 13;
                          labelDy = 6;
                          textAnchor = 'start';
                          break;
                        case 'top':
                          labelDx = 0;
                          labelDy = -13;
                          textAnchor = 'middle';
                          break;
                        case 'bottom':
                          labelDx = 0;
                          labelDy = 24;
                          textAnchor = 'middle';
                          break;
                        case 'bottom-left':
                          labelDx = -10;
                          labelDy = 20;
                          textAnchor = 'end';
                          break;
                        case 'top-right':
                          labelDx = 10;
                          labelDy = -10;
                          textAnchor = 'start';
                          break;
                      }

                      const displayLabel = layers.showModernNames
                        ? `${city.name} (${city.modernName})`
                        : city.name;

                      return (
                        <g
                          key={city.id}
                          data-city-id={city.id}
                          data-city-active={isCurrentCity ? 'true' : 'false'}
                          transform={`translate(${city.x}, ${city.y})`}
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectStop(city.primaryStopIndex);
                          }}
                          onMouseEnter={() => setHoveredCityId(city.id)}
                          onMouseLeave={() => setHoveredCityId(null)}
                        >
                          {/* Active Stop Arrival Halo (strictly on the single target city when path deduction completes) */}
                          {isCurrentCity && (
                            <>
                              <circle
                                r={19}
                                fill="#A62B2B"
                                fillOpacity={0.22}
                              />
                              <circle
                                r={13}
                                fill="none"
                                stroke="#A62B2B"
                                strokeWidth={2}
                                strokeDasharray="4 2"
                              />
                            </>
                          )}

                          {/* Crisp White-Filled Circle: strictly uniform for all non-target cities, enlarged crimson ring only for current target stop */}
                          <circle
                            r={
                              isCurrentCity
                                ? 8.5
                                : isHovered
                                ? 6.8
                                : 5.8
                            }
                            fill={isCurrentCity ? '#FEF2F2' : '#FFFDF9'}
                            stroke={isCurrentCity ? '#A62B2B' : '#1C1917'}
                            strokeWidth={isCurrentCity ? 3 : 2.2}
                            filter="url(#nodeShadow)"
                          />

                          {/* City Name Label: strictly uniform ink for all non-target cities, crimson highlight only for current target stop */}
                          <text
                            x={labelDx}
                            y={labelDy}
                            textAnchor={textAnchor}
                            fill={isCurrentCity ? '#881337' : '#1C1917'}
                            fontSize={isCurrentCity ? 20.5 : 18.5}
                            fontWeight={isCurrentCity ? 700 : 600}
                            fontFamily="Noto Serif SC, serif"
                            stroke="#EFE4CC"
                            strokeWidth={4}
                            paintOrder="stroke"
                          >
                            {displayLabel}
                          </text>

                          {/* Special Birth/Death Red Callout Box: rendered strictly when this city is the active target stop */}
                          {isCurrentCity && city.specialBadge && (
                            <g
                              transform={
                                city.id === 'meizhou'
                                  ? 'translate(-44, 14)'
                                  : 'translate(-46, 12)'
                              }
                            >
                              {city.specialBadge
                                .split('\n')
                                .map((line, lIdx) => (
                                  <text
                                    key={line}
                                    x={0}
                                    y={lIdx * 15 + 12}
                                    textAnchor="middle"
                                    fill="#991B1B"
                                    fontSize={12.5}
                                    fontWeight={700}
                                    fontFamily="Noto Serif SC, serif"
                                    stroke="#F5EBDC"
                                    strokeWidth={3}
                                    paintOrder="stroke"
                                  >
                                    {line}
                                  </text>
                                ))}
                            </g>
                          )}
                        </g>
                      );
                    });
                  })()}
                </g>

                {/* 5. Live Animated Circular Traveler Marker locked to the growing tip of the trajectory line */}
                <g
                  data-testid="traveler-marker-dot"
                  transform={`translate(${travelerXY[0]}, ${travelerXY[1]})`}
                  className="pointer-events-none"
                >
                  {/* Soft outer pulse ring */}
                  <circle r={15} fill="#A62B2B" fillOpacity={0.25} />
                  {/* Crisp high-contrast circular dot right at the tip of the growing curved route */}
                  <circle
                    r={7}
                    fill="#A62B2B"
                    stroke="#FFFDF9"
                    strokeWidth={2.6}
                    filter="url(#nodeShadow)"
                  />
                  <circle r={2.5} fill="#FEF2F2" />

                  {/* Floating Year & Destination Callout Pill */}
                  <rect
                    x={-72}
                    y={-38}
                    width={144}
                    height={22}
                    rx={4}
                    fill="#1C1917"
                    fillOpacity={0.92}
                    stroke="#F7F3EA"
                    strokeWidth={1.2}
                  />
                  <text
                    x={0}
                    y={-23}
                    textAnchor="middle"
                    fill="#F7F3EA"
                    fontSize={11.5}
                    fontWeight={600}
                    fontFamily="Noto Serif SC, serif"
                  >
                    {legProgress < 0.96 && activeStopIndex > 0
                      ? `${activeStop.yearStart}年 · 赴${activeStop.shortSongName}`
                      : `${activeStop.yearStart}年 · ${activeStop.shortSongName}`}
                  </text>
                </g>

                {/* 6. Bottom-Right Architectural Compass Rose ("N") */}
                <g transform="translate(835, 1135)">
                  <text
                    x={0}
                    y={-26}
                    textAnchor="middle"
                    fill="#334155"
                    fontSize={22}
                    fontWeight={700}
                    fontFamily="Noto Serif SC, serif"
                  >
                    N
                  </text>
                  <circle
                    cx={0}
                    cy={0}
                    r={20}
                    fill="none"
                    stroke="#334155"
                    strokeWidth={2}
                  />
                  <path d="M 0 -22 L -9 14 L 0 7 Z" fill="#CBD5E1" stroke="#334155" strokeWidth={1.5} />
                  <path d="M 0 -22 L 9 14 L 0 7 Z" fill="#334155" stroke="#334155" strokeWidth={1.5} />
                </g>
              </>
            )}
          </g>
        </svg>

        {/* Active Stop Status Pill (Top-Right Floating Overlay) */}
        <div className="absolute top-3 right-3 bg-[#FBF9F5]/95 border border-[#C7B299] rounded-md px-3.5 py-2 shadow-sm pointer-events-none max-w-xs">
          <div className="flex items-center gap-1.5 text-[11px] text-[#57534E]">
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{
                backgroundColor:
                  activePeriod === 'pre-utai'
                    ? '#48882B'
                    : activePeriod === 'huangzhou-yuanyou'
                    ? '#1A4B6E'
                    : '#A62B2B',
              }}
            />
            <span>
              第 {activeStop.id}/{stops.length} 站 · {activeStop.reignEra}（{activeStop.ageRange}）
            </span>
          </div>
          <div className="mt-0.5 flex items-baseline justify-between gap-3">
            <span className="font-serif text-base font-bold text-[#1C1917]">
              {activeStop.songName}
            </span>
            <span className="text-xs text-[#9A3412] font-medium whitespace-nowrap">
              今{activeStop.modernName}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#44403C]">
            {currentTransportMode === '舟行水路' && (
              <Ship className="w-3.5 h-3.5 text-[#1A4B6E]" />
            )}
            {currentTransportMode === '渡海扁舟' && (
              <Anchor className="w-3.5 h-3.5 text-[#A62B2B]" />
            )}
            {currentTransportMode === '鞍马驿道' && (
              <Footprints className="w-3.5 h-3.5 text-[#78350F]" />
            )}
            {currentTransportMode === '水陆兼程' && (
              <Ship className="w-3.5 h-3.5 text-[#48882B]" />
            )}
            {currentTransportMode === '故里居停' && (
              <Home className="w-3.5 h-3.5 text-[#48882B]" />
            )}
            <span>{currentTransportMode}</span>
            {isPlaying && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#A62B2B] font-semibold">动态推演中</span>
              </>
            )}
          </div>
        </div>

        {/* Floating Zoom & Camera Controls (Bottom Left) */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-[#FBF9F5]/95 border border-[#C7B299] rounded-md p-1 shadow-sm">
          <button
            type="button"
            onClick={() => onToggleLayer('cameraFollow')}
            aria-label="切换镜头自动跟随"
            title="镜头跟随苏轼行迹"
            className={`px-2.5 py-1.5 text-xs font-medium rounded flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 ${
              layers.cameraFollow
                ? 'bg-[#1B6A53] text-white'
                : 'text-[#44403C] hover:bg-[#EAE0CE]'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>跟随镜头</span>
          </button>
          <button
            type="button"
            onClick={() =>
              setZoom((z) => Math.min(2.6, Number((z + 0.25).toFixed(2))))
            }
            aria-label="放大舆图"
            title="放大舆图"
            className="p-1.5 text-[#44403C] hover:bg-[#EAE0CE] rounded transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() =>
              setZoom((z) => Math.max(0.85, Number((z - 0.25).toFixed(2))))
            }
            aria-label="缩小舆图"
            title="缩小舆图"
            className="p-1.5 text-[#44403C] hover:bg-[#EAE0CE] rounded transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleResetView}
            aria-label="重置舆图视野"
            title="重置视野"
            className="p-1.5 text-[#44403C] hover:bg-[#EAE0CE] rounded transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
