import React from 'react';
import { MapPin, Compass, ArrowUpRight } from 'lucide-react';
import { TrajectoryStop, LIFE_PHASES, LifePhaseId } from '../data/suShiChronicle';
import { calculateLegDistanceKm, kmToSongLi } from '../utils/trajectoryMath';

interface ChronicleHandscrollViewProps {
  stops: TrajectoryStop[];
  activeStopIndex: number;
  selectedPhase: LifePhaseId | 'all';
  onSelectPhase: (phase: LifePhaseId | 'all') => void;
  onJumpToMapStop: (index: number) => void;
}

export const ChronicleHandscrollView: React.FC<ChronicleHandscrollViewProps> = ({
  stops,
  activeStopIndex,
  selectedPhase,
  onSelectPhase,
  onJumpToMapStop,
}) => {
  const filteredStops =
    selectedPhase === 'all'
      ? stops
      : stops.filter((s) => s.phase === selectedPhase);

  // Dual-curve SVG dimensions
  const chartW = 960;
  const chartH = 240;
  const padL = 48;
  const padR = 28;
  const padT = 24;
  const padB = 38;
  const plotW = chartW - padL - padR;
  const plotH = chartH - padT - padB;

  const getPointX = (idx: number) =>
    Number((padL + (idx / (stops.length - 1)) * plotW).toFixed(1));
  const getPointY = (val: number) =>
    Number((padT + ((100 - val) / 100) * plotH).toFixed(1));

  const politicalPath = stops
    .map((s, idx) => `${idx === 0 ? 'M' : 'L'} ${getPointX(idx)} ${getPointY(s.politicalAltitude)}`)
    .join(' ');

  const literaryPath = stops
    .map((s, idx) => `${idx === 0 ? 'M' : 'L'} ${getPointX(idx)} ${getPointY(s.literaryAltitude)}`)
    .join(' ');

  return (
    <div className="space-y-8">
      {/* Section 1: Dual Curve Interactive Chart (仕途境遇 vs 文学哲思巅峰对照图) */}
      <section className="bg-[#FBF9F5] border border-[#D6CBB8] rounded-lg p-6 space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#1C1917]">
              仕途沉浮与文学气象对照图（1037–1101）
            </h2>
            <p className="text-xs text-[#57534E] mt-1">
              点击曲线上任意历史节点即可检视考据详情：可见乌台诗案（#9）、黄州（#10）、惠州（#17）、儋州（#18）每逢仕途跌入谷底，其文学与生命哲思反登极境。
            </p>
          </div>

          <div className="flex items-center gap-5 text-xs">
            <span className="inline-flex items-center gap-2 text-[#9A3412] font-medium">
              <span className="w-3.5 h-0.5 bg-[#9A3412] inline-block" />
              <span>▲ 文学哲思气象指数</span>
            </span>
            <span className="inline-flex items-center gap-2 text-[#1E3A5F] font-medium">
              <span className="w-3.5 h-0.5 bg-[#1E3A5F] inline-block" />
              <span>● 朝堂仕途境遇指数</span>
            </span>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartW} ${chartH}`}
            className="w-full min-w-[680px] h-auto bg-[#F4EFE4] border border-[#E5DEC9] rounded"
            role="img"
            aria-label="苏轼生平仕途境遇与文学成就双折线对照图"
          >
            {/* Horizontal Reference Lines */}
            {[20, 50, 80, 100].map((v) => {
              const y = getPointY(v);
              return (
                <g key={v}>
                  <line
                    x1={padL}
                    y1={y}
                    x2={chartW - padR}
                    y2={y}
                    stroke="#D6CBB8"
                    strokeDasharray="3 4"
                  />
                  <text
                    x={padL - 8}
                    y={y + 4}
                    textAnchor="end"
                    fill="#786B59"
                    fontSize={10}
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {v}
                  </text>
                </g>
              );
            })}

            {/* Political Rank Curve */}
            <path
              d={politicalPath}
              fill="none"
              stroke="#1E3A5F"
              strokeWidth={2.2}
              strokeDasharray="5 3"
            />

            {/* Literary Resonance Curve */}
            <path
              d={literaryPath}
              fill="none"
              stroke="#9A3412"
              strokeWidth={2.8}
            />

            {/* Interactive Stop Nodes */}
            {stops.map((s, idx) => {
              const x = getPointX(idx);
              const yp = getPointY(s.politicalAltitude);
              const yl = getPointY(s.literaryAltitude);
              const isSelected = idx === activeStopIndex;

              return (
                <g
                  key={s.id}
                  className="cursor-pointer"
                  onClick={() => onJumpToMapStop(idx)}
                >
                  <line
                    x1={x}
                    y1={padT}
                    x2={x}
                    y2={chartH - padB}
                    stroke={isSelected ? '#9A3412' : '#D6CBB8'}
                    strokeWidth={isSelected ? 1.5 : 0.7}
                    strokeOpacity={isSelected ? 0.8 : 0.5}
                  />
                  <circle
                    cx={x}
                    cy={yp}
                    r={isSelected ? 5.5 : 3.8}
                    fill="#1E3A5F"
                    stroke="#FBF9F5"
                    strokeWidth={1.2}
                  />
                  <circle
                    cx={x}
                    cy={yl}
                    r={isSelected ? 6 : 4.2}
                    fill="#9A3412"
                    stroke="#FBF9F5"
                    strokeWidth={1.5}
                  />
                  <text
                    x={x}
                    y={chartH - 18}
                    textAnchor="middle"
                    fill={isSelected ? '#9A3412' : '#44403C'}
                    fontSize={9.5}
                    fontWeight={isSelected ? 700 : 500}
                    fontFamily="Noto Serif SC, serif"
                  >
                    {s.shortSongName.slice(0, 2)}
                  </text>
                  <text
                    x={x}
                    y={chartH - 6}
                    textAnchor="middle"
                    fill="#786B59"
                    fontSize={8.5}
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {s.yearStart}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </section>

      {/* Section 2: Six Major Life Phases Summary Grid */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-serif text-xl font-bold text-[#1C1917]">
            六大人生阶段分期考
          </h2>
          {selectedPhase !== 'all' && (
            <button
              type="button"
              onClick={() => onSelectPhase('all')}
              className="text-xs font-medium text-[#9A3412] hover:underline"
            >
              显示全部六个阶段（共 20 站）
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {LIFE_PHASES.map((phase, idx) => {
            const isSelected = selectedPhase === phase.id;
            const phaseStops = stops.filter((s) => s.phase === phase.id);
            return (
              <button
                key={phase.id}
                type="button"
                onClick={() =>
                  onSelectPhase(isSelected ? 'all' : phase.id)
                }
                className={`text-left p-5 rounded-lg border transition-colors ${
                  isSelected
                    ? 'bg-[#F3ECE0] border-[#9A3412]'
                    : 'bg-[#FBF9F5] border-[#D6CBB8] hover:border-[#9A3412]/60'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-[#57534E]">
                  <span className="font-mono tabular-nums">
                    0{idx + 1} · {phase.period}
                  </span>
                  <span className="font-mono tabular-nums text-[#9A3412]">
                    含 {phaseStops.length} 驿站
                  </span>
                </div>
                <h3 className="mt-1.5 font-serif text-lg font-bold text-[#1C1917]">
                  {phase.label}
                </h3>
                <p className="mt-2 text-xs text-[#44403C] leading-relaxed">
                  {phase.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Section 3: Complete Chronological Handscroll Table */}
      <section className="bg-[#FBF9F5] border border-[#D6CBB8] rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5DEC9] flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-serif text-lg font-bold text-[#1C1917]">
            《东坡行旅编年全谱》 · 驿站水陆里程与古今地名考
          </h2>
          <span className="text-xs text-[#57534E] font-mono tabular-nums">
            当前展示 {filteredStops.length} / {stops.length} 站
          </span>
        </div>

        <div className="divide-y divide-[#E5DEC9]">
          {filteredStops.map((stop) => {
            const fullIdx = stops.findIndex((s) => s.id === stop.id);
            const prev = fullIdx > 0 ? stops[fullIdx - 1] : undefined;
            const legKm = prev ? calculateLegDistanceKm(prev, stop) : 0;
            const legLi = kmToSongLi(legKm);

            return (
              <article
                key={stop.id}
                className="p-5 hover:bg-[#F4EFE4] transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#57534E]">
                    <span className="font-mono tabular-nums font-semibold text-[#9A3412]">
                      #{String(stop.id).padStart(2, '0')}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">
                      公元 {stop.yearStart}–{stop.yearEnd} 年（{stop.reignEra}）
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{stop.ageRange}</span>
                    <span aria-hidden="true">·</span>
                    <span>{stop.transportMode}</span>
                    {legLi > 0 && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">
                          本段行程约 {legLi.toLocaleString()} 宋里（{legKm.toLocaleString()} km）
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex flex-wrap items-baseline gap-3">
                    <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                      {stop.songName}
                    </h3>
                    <span className="text-xs text-[#78350F]">
                      今址：{stop.modernName}（{stop.coordinates[0].toFixed(2)}°E,{' '}
                      {stop.coordinates[1].toFixed(2)}°N）
                    </span>
                    <span className="text-xs text-[#57534E]">
                      · 官职：{stop.officialTitle}
                    </span>
                  </div>

                  <p className="text-xs text-[#292524] leading-relaxed font-serif">
                    {stop.summary}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#57534E]">
                    <Compass className="w-3.5 h-3.5 text-[#9A3412] shrink-0" />
                    <span>
                      代表作：
                      {stop.works.map((w) => `《${w.title}》`).join('、')}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onJumpToMapStop(fullIdx)}
                    className="px-3.5 py-2 bg-[#EAE0CE] hover:bg-[#9A3412] text-[#1C1917] hover:text-[#F7F3EA] text-xs font-medium rounded-md flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>在北宋舆图中定位</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};
