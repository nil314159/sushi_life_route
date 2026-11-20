import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Volume2,
  VolumeX,
  RotateCcw,
} from 'lucide-react';
import { TrajectoryStop, LIFE_PHASES, LifePhaseId } from '../data/suShiChronicle';

interface TimelineControllerProps {
  stops: TrajectoryStop[];
  activeStopIndex: number;
  legProgress: number;
  isPlaying: boolean;
  playbackSpeed: number;
  isLooping: boolean;
  isAudioEnabled: boolean;
  selectedPhase: LifePhaseId | 'all';
  cumulativeKm: number;
  cumulativeSongLi: number;
  onTogglePlay: () => void;
  onSelectStop: (index: number) => void;
  onPrevStop: () => void;
  onNextStop: () => void;
  onReset: () => void;
  onChangeSpeed: (speed: number) => void;
  onToggleLoop: () => void;
  onToggleAudio: () => void;
  onSelectPhase: (phase: LifePhaseId | 'all') => void;
}

export const TimelineController: React.FC<TimelineControllerProps> = ({
  stops,
  activeStopIndex,
  legProgress,
  isPlaying,
  playbackSpeed,
  isLooping,
  isAudioEnabled,
  selectedPhase,
  cumulativeKm,
  cumulativeSongLi,
  onTogglePlay,
  onSelectStop,
  onPrevStop,
  onNextStop,
  onReset,
  onChangeSpeed,
  onToggleLoop,
  onToggleAudio,
  onSelectPhase,
}) => {
  const activeStop = stops[activeStopIndex] || stops[0];
  const progressValue =
    activeStopIndex <= 0
      ? 0
      : Number((activeStopIndex - 1 + legProgress).toFixed(2));

  return (
    <section
      aria-label="生平时间轴与动态推演控制栏"
      className="bg-[#F7F3EA] border border-[#D6CBB8] rounded-lg p-4 space-y-3"
    >
      {/* Row 1: Life Phase Segmented Filter & Quantitative Mileage Readout */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-[#E5DEC9]">
        {/* Interactive Phase Filter Buttons */}
        <div
          role="group"
          aria-label="按人生阶段筛选轨迹"
          className="flex flex-wrap items-center gap-1 bg-[#EAE0CE] p-1 rounded-md"
        >
          <button
            type="button"
            onClick={() => onSelectPhase('all')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
              selectedPhase === 'all'
                ? 'bg-[#1C1917] text-[#F7F3EA]'
                : 'text-[#57534E] hover:text-[#1C1917]'
            }`}
          >
            全部六十六载
          </button>
          {LIFE_PHASES.map((phase) => (
            <button
              key={phase.id}
              type="button"
              onClick={() => onSelectPhase(phase.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                selectedPhase === phase.id
                  ? 'bg-[#9A3412] text-[#F7F3EA]'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              {phase.label}
            </button>
          ))}
        </div>

        {/* Clean Unboxed Quantitative Telemetry */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#57534E] font-mono tabular-nums">
          <span>
            纪年：<strong className="text-[#1C1917]">{activeStop.yearStart}–{activeStop.yearEnd}年</strong>
          </span>
          <span aria-hidden="true">·</span>
          <span>
            累计行程：<strong className="text-[#9A3412]">{cumulativeSongLi.toLocaleString()} 宋里</strong>（约 {cumulativeKm.toLocaleString()} km）
          </span>
        </div>
      </div>

      {/* Row 2: Scrubber Slider + 20 Chronological Node Ticks */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-[#57534E]">
          <label htmlFor="trajectory-timeline-slider" className="font-medium text-[#1C1917]">
            生平驿站进度：{activeStop.id} / {stops.length} 站（{activeStop.shortSongName} · {activeStop.ageRange}）
          </label>
          <span className="font-mono tabular-nums">
            公元 {activeStop.yearStart} 年 · 进度 {Math.round((progressValue / (stops.length - 1)) * 100)}%
          </span>
        </div>

        <input
          id="trajectory-timeline-slider"
          type="range"
          min={0}
          max={stops.length - 1}
          step={0.05}
          value={progressValue}
          onChange={(e) => onSelectStop(Math.round( parseFloat(e.target.value) ))}
          className="w-full h-2 bg-[#DFD3BE] rounded-lg appearance-none cursor-pointer accent-[#9A3412]"
        />

        {/* Quick Stop Tick Strip */}
        <div className="grid grid-cols-10 sm:grid-cols-20 gap-1 pt-1">
          {stops.map((stop, idx) => {
            const isCurrent = idx === activeStopIndex;
            const isPassed = idx < activeStopIndex;
            const isDimmed = selectedPhase !== 'all' && stop.phase !== selectedPhase;
            return (
              <button
                key={stop.id}
                type="button"
                onClick={() => onSelectStop(idx)}
                title={`${stop.id}. ${stop.shortSongName} (${stop.yearStart}年)`}
                className={`py-1 px-0.5 rounded text-center transition-colors border ${
                  isCurrent
                    ? 'bg-[#9A3412] text-[#F7F3EA] border-[#9A3412] font-bold'
                    : isPassed
                    ? 'bg-[#EAE0CE] text-[#1C1917] border-[#D6CBB8] hover:border-[#9A3412]'
                    : 'bg-[#FBF9F5] text-[#57534E] border-[#E5DEC9] hover:border-[#9A3412]'
                } ${isDimmed ? 'opacity-35' : ''}`}
              >
                <div className="text-[10px] font-mono tabular-nums leading-none">
                  {stop.yearStart}
                </div>
                <div className="text-[11px] font-serif truncate mt-0.5">
                  {stop.shortSongName.slice(0, 2)}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 3: Playback Controls, Speed & Guqin Soundscape */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onTogglePlay}
            className="px-4 py-2 bg-[#9A3412] hover:bg-[#7F1D1D] text-[#F7F3EA] text-xs font-medium rounded-md flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>暂停推演</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>播放行旅轨迹</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onPrevStop}
            disabled={activeStopIndex === 0}
            aria-label="上一驿站"
            className="px-2.5 py-2 bg-[#EAE0CE] hover:bg-[#DFD3BE] disabled:opacity-40 text-[#1C1917] text-xs font-medium rounded-md flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
          >
            <SkipBack className="w-3.5 h-3.5" />
            <span>上一站</span>
          </button>

          <button
            type="button"
            onClick={onNextStop}
            disabled={activeStopIndex === stops.length - 1 && !isLooping}
            aria-label="下一驿站"
            className="px-2.5 py-2 bg-[#EAE0CE] hover:bg-[#DFD3BE] disabled:opacity-40 text-[#1C1917] text-xs font-medium rounded-md flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
          >
            <span>下一站</span>
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onReset}
            aria-label="重置至起点眉州"
            className="px-2.5 py-2 bg-[#EAE0CE] hover:bg-[#DFD3BE] text-[#44403C] text-xs font-medium rounded-md flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>归零</span>
          </button>
        </div>

        {/* Speed Selector, Loop GIF Toggle & Guqin Audio */}
        <div className="flex flex-wrap items-center gap-2">
          <div
            role="group"
            aria-label="推演倍速选择"
            className="flex items-center gap-1 bg-[#EAE0CE] p-1 rounded-md"
          >
            {[0.5, 1, 2, 4].map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => onChangeSpeed(spd)}
                className={`px-2 py-1 text-xs font-mono tabular-nums rounded transition-colors whitespace-nowrap shrink-0 ${
                  playbackSpeed === spd
                    ? 'bg-[#1C1917] text-[#F7F3EA]'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onToggleLoop}
            className={`px-3 py-1.5 text-xs font-medium rounded-md border flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              isLooping
                ? 'bg-[#1C1917] text-[#F7F3EA] border-[#1C1917]'
                : 'bg-[#FBF9F5] text-[#44403C] border-[#D6CBB8] hover:bg-[#EAE0CE]'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>循环动图模式</span>
          </button>

          <button
            type="button"
            onClick={onToggleAudio}
            className={`px-3 py-1.5 text-xs font-medium rounded-md border flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              isAudioEnabled
                ? 'bg-[#2E5A44] text-[#F7F3EA] border-[#2E5A44]'
                : 'bg-[#FBF9F5] text-[#44403C] border-[#D6CBB8] hover:bg-[#EAE0CE]'
            }`}
          >
            {isAudioEnabled ? (
              <Volume2 className="w-3.5 h-3.5" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
            <span>{isAudioEnabled ? '古琴雅音：开启' : '古琴雅音：静音'}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
