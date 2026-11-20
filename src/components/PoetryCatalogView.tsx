import React, { useState, useMemo } from 'react';
import { Search, MapPin, BookOpen } from 'lucide-react';
import { TrajectoryStop, LiteraryWork } from '../data/suShiChronicle';
import { filterLiteraryWorks } from '../utils/trajectoryMath';

interface PoetryCatalogViewProps {
  stops: TrajectoryStop[];
  onJumpToMapStop: (stopIndex: number) => void;
}

const GENRES: Array<LiteraryWork['genre'] | 'all'> = ['all', '词', '诗', '赋', '文', '书迹'];

export const PoetryCatalogView: React.FC<PoetryCatalogViewProps> = ({
  stops,
  onJumpToMapStop,
}) => {
  const [selectedGenre, setSelectedGenre] = useState<LiteraryWork['genre'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(
    () => filterLiteraryWorks(stops, selectedGenre, searchQuery),
    [stops, selectedGenre, searchQuery]
  );

  return (
    <div className="space-y-6">
      {/* Filter & Search Toolbar */}
      <div className="bg-[#FBF9F5] border border-[#D6CBB8] rounded-lg p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="font-serif text-xl font-bold text-[#1C1917]">
            东坡传世诗文 · 历史地理坐标汇编
          </h2>
          <p className="text-xs text-[#57534E]">
            每一篇诗词赋文皆系于真实北宋州郡坐标，可按体裁或关键词检索，并一键跳转至北宋舆图探看创作地水陆形势。
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Genre Segmented Control */}
          <div
            role="group"
            aria-label="按文学体裁筛选"
            className="flex items-center gap-1 bg-[#EAE0CE] p-1 rounded-md"
          >
            {GENRES.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setSelectedGenre(g)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                  selectedGenre === g
                    ? 'bg-[#1C1917] text-[#F7F3EA]'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                {g === 'all' ? '全部体裁' : g}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative">
            <label htmlFor="poetry-search-input" className="sr-only">
              检索诗词名句或创作州郡
            </label>
            <Search className="w-4 h-4 text-[#786B59] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="poetry-search-input"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜寻诗题、名句或州郡（如：赤壁、密州）"
              className="pl-9 pr-3 py-1.5 text-xs bg-[#F4EFE4] border border-[#D6CBB8] rounded-md text-[#1C1917] placeholder:text-[#786B59] w-72 sm:w-80 focus:outline-none focus:border-[#9A3412]"
            />
          </div>
        </div>
      </div>

      {/* Results Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-[#FBF9F5] border border-[#D6CBB8] rounded-lg p-12 text-center space-y-3">
          <BookOpen className="w-8 h-8 text-[#9A3412] mx-auto" />
          <h3 className="font-serif text-base font-bold text-[#1C1917]">
            未检索到匹配的东坡诗文
          </h3>
          <p className="text-xs text-[#57534E]">
            请尝试清空关键词或切换体裁分类（如搜索“明月”、“西湖”、“黄州”或“儋耳”）。
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedGenre('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-[#9A3412] text-[#F7F3EA] text-xs font-medium rounded-md"
          >
            重置检索条件
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredItems.map(({ work, stop }) => {
            const stopIndex = stops.findIndex((s) => s.id === stop.id);
            return (
              <article
                key={work.id}
                className="bg-[#FBF9F5] border border-[#D6CBB8] rounded-lg p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Unboxed Metadata Line */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#57534E]">
                    <span>
                      {work.genre} · {work.year} · 作于{stop.songName}
                    </span>
                    <span className="font-mono tabular-nums">
                      {stop.coordinates[0].toFixed(2)}°E, {stop.coordinates[1].toFixed(2)}°N
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-[#1C1917]">
                    《{work.title}》
                  </h3>

                  <blockquote className="font-serif text-sm text-[#1C1917] leading-loose whitespace-pre-line py-3 px-4 bg-[#F4EFE4] rounded border border-[#E5DEC9]">
                    {work.fullText}
                  </blockquote>

                  <p className="text-xs text-[#44403C] leading-relaxed">
                    <strong>史地本事：</strong>
                    {work.annotation}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E5DEC9] flex items-center justify-between gap-2">
                  <span className="text-xs text-[#57534E]">
                    今址：{stop.modernName}（{stop.ageRange}）
                  </span>
                  <button
                    type="button"
                    onClick={() => onJumpToMapStop(stopIndex)}
                    className="px-3 py-1.5 bg-[#EAE0CE] hover:bg-[#9A3412] text-[#1C1917] hover:text-[#F7F3EA] text-xs font-medium rounded flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>于舆图中定位创作地</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
