import React, { useState } from 'react';
import { BookOpen, MapPin, Compass, ScrollText } from 'lucide-react';
import { TrajectoryStop } from '../data/suShiChronicle';

interface StopDetailInspectorProps {
  stop: TrajectoryStop;
  prevStop?: TrajectoryStop;
  legDistanceKm: number;
  totalStops: number;
  onSelectWorkInModal?: (workId: string) => void;
}

export const StopDetailInspector: React.FC<StopDetailInspectorProps> = ({
  stop,
  prevStop,
  legDistanceKm,
  totalStops,
}) => {
  const [selectedWorkIndex, setSelectedWorkIndex] = useState(0);
  const [imgError, setImgError] = useState<Record<string, boolean>>({});

  const activeWork = stop.works[selectedWorkIndex] || stop.works[0];

  // Reset selectedWorkIndex if out of bounds when stop changes
  const safeWork =
    selectedWorkIndex < stop.works.length ? stop.works[selectedWorkIndex] : stop.works[0];

  return (
    <aside
      aria-label="当前行旅驿站考据与诗词详情"
      className="bg-[#FBF9F5] border border-[#D6CBB8] rounded-lg p-5 flex flex-col justify-between space-y-5"
    >
      <div className="space-y-4">
        {/* Clean Unboxed Metadata Kicker (Zero-Pill Discipline) */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#57534E]">
          <span className="font-mono tabular-nums font-semibold text-[#9A3412]">
            驿站 {String(stop.id).padStart(2, '0')}/{totalStops}
          </span>
          <span aria-hidden="true">·</span>
          <span>{stop.phaseLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{stop.reignEra}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">{stop.ageRange}</span>
        </div>

        {/* Primary Historical Place Title & Official Rank */}
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#1C1917] tracking-tight text-balance">
            {stop.songName}
          </h2>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-[#57534E]">
            <span>今址：{stop.modernName}</span>
            <span aria-hidden="true">·</span>
            <span>官职/身份：{stop.officialTitle}</span>
          </div>
        </div>

        {/* Museum Scroll Painting Visual with Resilient Fallback */}
        {stop.featuredImage && (
          <figure className="rounded-md overflow-hidden border border-[#D6CBB8] bg-[#EAE0CE]">
            {!imgError[stop.featuredImage] ? (
              <img
                src={stop.featuredImage}
                alt={`${stop.songName} 北宋画卷意境图`}
                referrerPolicy="no-referrer"
                onError={() =>
                  setImgError((prev) => ({ ...prev, [stop.featuredImage!]: true }))
                }
                className="w-full h-40 object-cover"
              />
            ) : (
              <div className="w-full h-36 flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-[#EDE3D2] to-[#DFD3BE]">
                <Compass className="w-6 h-6 text-[#9A3412] mb-1.5" />
                <span className="font-serif text-sm font-semibold text-[#1C1917]">
                  {stop.songName} · 山水舆图画卷
                </span>
              </div>
            )}
            <figcaption className="px-3 py-1.5 text-[11px] font-serif italic text-[#57534E] bg-[#F4EFE4] border-t border-[#E5DEC9]">
              图卷：{stop.shortSongName}行旅意境 · 坐标 {stop.coordinates[0].toFixed(2)}°E,{' '}
              {stop.coordinates[1].toFixed(2)}°N
            </figcaption>
          </figure>
        )}

        {/* Historical Chronicle Narrative */}
        <div className="space-y-2 pt-1 border-t border-[#E5DEC9]">
          <h3 className="text-xs font-semibold text-[#1C1917] flex items-center gap-1.5">
            <ScrollText className="w-3.5 h-3.5 text-[#9A3412]" />
            <span>生平本末考</span>
          </h3>
          <p className="text-sm text-[#292524] leading-relaxed font-serif">
            {stop.summary}
          </p>
        </div>

        {/* Authentic Northern Song Geographical Context Note */}
        <div className="p-3.5 rounded-md bg-[#F3ECE0] border border-[#DFD3BE] space-y-1.5">
          <div className="flex items-center justify-between text-xs text-[#78350F] font-semibold">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#9A3412]" />
              <span>北宋历史地理与水陆考</span>
            </span>
            {prevStop && legDistanceKm > 0 && (
              <span className="font-mono tabular-nums text-[11px] text-[#57534E]">
                自{prevStop.shortSongName}行约 {legDistanceKm * 2} 宋里
              </span>
            )}
          </div>
          <p className="text-xs text-[#44403C] leading-relaxed">
            {stop.historicalGeographyNote}
          </p>
        </div>

        {/* Representative Poems & Prose Written at This Stop */}
        {safeWork && (
          <div className="pt-2 border-t border-[#E5DEC9] space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs font-semibold text-[#1C1917] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#9A3412]" />
                <span>此地代表名篇（{stop.works.length} 篇）</span>
              </h3>

              {stop.works.length > 1 && (
                <div className="flex items-center gap-1 bg-[#EAE0CE] p-0.5 rounded">
                  {stop.works.map((w, idx) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setSelectedWorkIndex(idx)}
                      className={`px-2 py-0.5 text-[11px] rounded transition-colors whitespace-nowrap shrink-0 ${
                         (selectedWorkIndex < stop.works.length ? selectedWorkIndex : 0) === idx
                          ? 'bg-[#9A3412] text-[#F7F3EA]'
                          : 'text-[#57534E] hover:text-[#1C1917]'
                      }`}
                    >
                      篇 {idx + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 rounded-md bg-[#F7F3EA] border border-[#D6CBB8] space-y-2.5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h4 className="font-serif text-base font-bold text-[#1C1917]">
                  《{safeWork.title}》
                </h4>
                <span className="text-xs text-[#57534E]">
                  {safeWork.genre} · {safeWork.year}
                </span>
              </div>

              <blockquote className="font-serif text-sm text-[#1C1917] leading-loose whitespace-pre-line py-2 border-y border-[#E5DEC9]">
                {safeWork.fullText}
              </blockquote>

              <p className="text-xs text-[#57534E] leading-relaxed">
                题解：{safeWork.annotation}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Quantitative Rank vs Literary Resonance Comparison */}
      <div className="pt-3 border-t border-[#E5DEC9] grid grid-cols-2 gap-4 text-xs">
        <div>
          <div className="flex items-center justify-between text-[#57534E] mb-1">
            <span>朝堂境遇指数</span>
            <span className="font-mono tabular-nums font-semibold text-[#1C1917]">
              {stop.politicalAltitude} / 100
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#EAE0CE] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1E3A5F]"
              style={{ width: `${stop.politicalAltitude}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-[#57534E] mb-1">
            <span>文学哲思气象</span>
            <span className="font-mono tabular-nums font-semibold text-[#9A3412]">
              {stop.literaryAltitude} / 100
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#EAE0CE] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#9A3412]"
              style={{ width: `${stop.literaryAltitude}%` }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
};
