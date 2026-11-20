import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { SU_SHI_STOPS, LifePhaseId } from './data/suShiChronicle';
import { CURVED_TRAJECTORY_ARCS } from './data/reliefMapLayout';
import {
  calculateCumulativeDistance,
  calculateLegDistanceKm,
  getSvgPathLength,
} from './utils/trajectoryMath';
import { guqinAudio } from './utils/guqinAudio';
import { NorthernSongMap, MapLayerState } from './components/NorthernSongMap';
import { TimelineController } from './components/TimelineController';
import { StopDetailInspector } from './components/StopDetailInspector';
import { TheaterVideoStudio } from './components/TheaterVideoStudio';
import { ChronicleHandscrollView } from './components/ChronicleHandscrollView';
import { PoetryCatalogView } from './components/PoetryCatalogView';

type ActiveTab = 'map' | 'theater' | 'chronicle' | 'poetry';

export default function App() {
  const isAutoStart = useMemo(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('autostart') === '1';
    }
    return false;
  }, []);

  const [activeTab, setActiveTab] = useState<ActiveTab>('map');
  // When autostart=1, start at leg 1 (眉州 -> 开封) with progress 0; otherwise default to #10 黄州（东坡） completed (progress 1)
  const [activeStopIndex, setActiveStopIndex] = useState<number>(
    isAutoStart ? 1 : 9
  );
  const [legProgress, setLegProgress] = useState<number>(isAutoStart ? 0 : 1);
  const [isPlaying, setIsPlaying] = useState<boolean>(isAutoStart);
  const [isStepAnimating, setIsStepAnimating] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(false);
  const [selectedPhase, setSelectedPhase] = useState<LifePhaseId | 'all'>('all');

  const [mapLayers, setMapLayers] = useState<MapLayerState>({
    showRegimes: true,
    showRivers: true,
    showCircuits: true,
    showModernNames: false,
    showFullTrajectory: true,
    cameraFollow: false,
  });

  // Authoritative animation refs for 60fps lockstep curve + marker updates
  const animRef = useRef<{
    stopIndex: number;
    progress: number;
    dwellMs: number;
  }>({
    stopIndex: isAutoStart ? 1 : 9,
    progress: isAutoStart ? 0 : 1,
    dwellMs: 0,
  });
  const lastFrameTimeRef = useRef<number | null>(null);

  // Keep animRef in sync when state is updated externally
  useEffect(() => {
    animRef.current.stopIndex = activeStopIndex;
    animRef.current.progress = legProgress;
  }, [activeStopIndex, legProgress]);

  // Smooth 60fps trajectory animation loop: drives both the growing curved arc and the moving dot together
  useEffect(() => {
    if (!isPlaying && !isStepAnimating) {
      lastFrameTimeRef.current = null;
      return;
    }

    let rafId: number;
    const step = (timestamp: number) => {
      if (lastFrameTimeRef.current === null) {
        lastFrameTimeRef.current = timestamp;
      }
      const rawElapsed = timestamp - lastFrameTimeRef.current;
      const deltaMs = Math.min(64, Math.max(0, rawElapsed));
      lastFrameTimeRef.current = timestamp;

      const state = animRef.current;

      // Handle brief arrival dwell between consecutive legs during continuous playback
      if (isPlaying && state.dwellMs > 0) {
        state.dwellMs -= deltaMs * playbackSpeed;
        if (state.dwellMs <= 0) {
          state.dwellMs = 0;
          if (state.stopIndex >= SU_SHI_STOPS.length - 1) {
            if (isLooping) {
              state.stopIndex = 1;
              state.progress = 0;
              guqinAudio.playChord(1);
              setActiveStopIndex(1);
              setLegProgress(0);
            } else {
              setIsPlaying(false);
              return;
            }
          } else {
            const nextIdx = state.stopIndex + 1;
            state.stopIndex = nextIdx;
            state.progress = 0;
            guqinAudio.playChord(nextIdx);
            setActiveStopIndex(nextIdx);
            setLegProgress(0);
          }
        }
        rafId = requestAnimationFrame(step);
        return;
      }

      // If at stop 0 (birthplace Meizhou) during playback, immediately start Leg 1 (Meizhou -> Kaifeng)
      if (isPlaying && state.stopIndex === 0) {
        state.stopIndex = 1;
        state.progress = 0;
        setActiveStopIndex(1);
        setLegProgress(0);
        rafId = requestAnimationFrame(step);
        return;
      }

      // Compute natural duration proportional to the curved arc's visual length
      const activeArc = CURVED_TRAJECTORY_ARCS.find(
        (a) => a.toStopIndex === state.stopIndex
      );
      const arcLengthPx = activeArc ? getSvgPathLength(activeArc.d) : 280;
      const baseLegDurationMs = isPlaying
        ? Math.max(1350, Math.min(2900, arcLengthPx * 4.1)) / playbackSpeed
        : 780;

      const nextProg = state.progress + deltaMs / baseLegDurationMs;
      if (nextProg >= 1) {
        state.progress = 1;
        setLegProgress(1);

        if (isPlaying) {
          state.dwellMs = 520;
          rafId = requestAnimationFrame(step);
        } else {
          setIsStepAnimating(false);
        }
        return;
      }

      state.progress = nextProg;
      setLegProgress(nextProg);
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying, isStepAnimating, playbackSpeed, isLooping]);

  const activeStop = SU_SHI_STOPS[activeStopIndex] || SU_SHI_STOPS[0];
  const prevStop =
    activeStopIndex > 0 ? SU_SHI_STOPS[activeStopIndex - 1] : undefined;

  const cumulativeStats = useMemo(
    () =>
      activeStopIndex <= 0
        ? calculateCumulativeDistance(SU_SHI_STOPS, 0, 0)
        : calculateCumulativeDistance(
            SU_SHI_STOPS,
            activeStopIndex - 1,
            legProgress
          ),
    [activeStopIndex, legProgress]
  );

  const fullLifeStats = useMemo(
    () => calculateCumulativeDistance(SU_SHI_STOPS, SU_SHI_STOPS.length - 1, 0),
    []
  );

  const currentLegKm = useMemo(
    () => (prevStop ? calculateLegDistanceKm(prevStop, activeStop) : 0),
    [prevStop, activeStop]
  );

  const handleSelectStop = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(SU_SHI_STOPS.length - 1, index));
    animRef.current.dwellMs = 0;
    setActiveStopIndex(clamped);
    if (clamped === 0) {
      setLegProgress(1);
      setIsStepAnimating(false);
    } else {
      setLegProgress(0);
      setIsStepAnimating(true);
    }
    guqinAudio.playPluck(clamped);
  }, []);

  const handleTogglePlay = useCallback(() => {
    setIsStepAnimating(false);
    setIsPlaying((prev) => {
      const next = !prev;
      if (next) {
        animRef.current.dwellMs = 0;
        if (
          activeStopIndex === 0 ||
          (activeStopIndex >= SU_SHI_STOPS.length - 1 && legProgress >= 1)
        ) {
          setActiveStopIndex(1);
          setLegProgress(0);
          guqinAudio.playChord(1);
        } else if (legProgress >= 1) {
          const nextIdx = activeStopIndex + 1;
          setActiveStopIndex(nextIdx);
          setLegProgress(0);
          guqinAudio.playChord(nextIdx);
        } else {
          guqinAudio.playChord(activeStopIndex);
        }
      }
      return next;
    });
  }, [activeStopIndex, legProgress]);

  const handleStartFromBeginning = useCallback(() => {
    setIsStepAnimating(false);
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      animRef.current = { stopIndex: 1, progress: 0, dwellMs: 0 };
      setActiveStopIndex(1);
      setLegProgress(0);
      setIsPlaying(true);
      guqinAudio.playChord(1);
    }
  }, [isPlaying]);

  const handlePrevStop = useCallback(() => {
    setIsPlaying(false);
    animRef.current.dwellMs = 0;
    const prevIdx = Math.max(0, activeStopIndex - 1);
    setActiveStopIndex(prevIdx);
    if (prevIdx === 0) {
      setLegProgress(1);
      setIsStepAnimating(false);
    } else {
      setLegProgress(0);
      setIsStepAnimating(true);
    }
  }, [activeStopIndex]);

  const handleNextStop = useCallback(() => {
    setIsPlaying(false);
    animRef.current.dwellMs = 0;
    const nextIdx =
      activeStopIndex >= SU_SHI_STOPS.length - 1
        ? isLooping
          ? 1
          : activeStopIndex
        : activeStopIndex + 1;
    setActiveStopIndex(nextIdx);
    setLegProgress(0);
    setIsStepAnimating(true);
  }, [activeStopIndex, isLooping]);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setIsStepAnimating(false);
    animRef.current = { stopIndex: 0, progress: 1, dwellMs: 0 };
    setActiveStopIndex(0);
    setLegProgress(1);
  }, []);

  const handleToggleAudio = useCallback(() => {
    setIsAudioEnabled((prev) => {
      const next = !prev;
      guqinAudio.setEnabled(next);
      return next;
    });
  }, []);

  const handleToggleMapLayer = useCallback((key: keyof MapLayerState) => {
    setMapLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleJumpToMapStop = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(SU_SHI_STOPS.length - 1, index));
    animRef.current.dwellMs = 0;
    setActiveStopIndex(clamped);
    if (clamped === 0) {
      setLegProgress(1);
      setIsStepAnimating(false);
    } else {
      setLegProgress(0);
      setIsStepAnimating(true);
    }
    setActiveTab('map');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div
      data-state={isPlaying ? 'playing' : 'paused'}
      className="min-h-screen flex flex-col bg-[#F7F3EA] text-[#1C1917]"
    >
      {/* Top Bar Contract: Strictly 1 row, 3 zones separated by gap-8 */}
      <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-[#FBF9F5] border-b border-[#D6CBB8]">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('map');
          }}
          className="font-serif text-xl font-bold tracking-tight text-[#1C1917] whitespace-nowrap shrink-0"
        >
          东坡行旅图
        </a>

        {/* Zone 2: 4 concise single-line navigation links */}
        <nav
          aria-label="主视图切换"
          className="flex items-center gap-6 text-sm font-medium text-[#57534E]"
        >
          <button
            type="button"
            onClick={() => setActiveTab('map')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === 'map'
                ? 'text-[#1C1917] border-[#9A3412] font-semibold'
                : 'border-transparent hover:text-[#1C1917]'
            }`}
          >
            北宋舆图
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('theater')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === 'theater'
                ? 'text-[#1C1917] border-[#9A3412] font-semibold'
                : 'border-transparent hover:text-[#1C1917]'
            }`}
          >
            动图剧场
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('chronicle')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === 'chronicle'
                ? 'text-[#1C1917] border-[#9A3412] font-semibold'
                : 'border-transparent hover:text-[#1C1917]'
            }`}
          >
            生平长卷
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('poetry')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === 'poetry'
                ? 'text-[#1C1917] border-[#9A3412] font-semibold'
                : 'border-transparent hover:text-[#1C1917]'
            }`}
          >
            诗词名篇
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={handleStartFromBeginning}
            className="px-4 py-2 text-xs font-medium text-[#F7F3EA] bg-[#9A3412] hover:bg-[#7F1D1D] rounded-md transition-colors whitespace-nowrap shrink-0"
          >
            {isPlaying ? '暂停推演行迹' : '从头推演行迹'}
          </button>
        </div>
      </header>

      {/* Editorial Curatorial Ribbon */}
      <div className="px-6 py-3 bg-[#EFE8D8] border-b border-[#D6CBB8]">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-[#57534E]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-serif font-semibold text-[#1C1917]">
              北宋元丰九域生平轨躅志（1037–1101）
            </span>
            <span aria-hidden="true">·</span>
            <span>
              以北宋真实政区路份、庆历黄河故道与汴河漕运水系为底图，考据苏子瞻六十六载宦海行迹
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono tabular-nums text-[#44403C]">
            <span>20 历史驿站</span>
            <span aria-hidden="true">·</span>
            <span>总计 {fullLifeStats.totalSongLi.toLocaleString()} 宋里（{fullLifeStats.totalKm.toLocaleString()} km）</span>
            <span aria-hidden="true">·</span>
            <span>黄州 · 惠州 · 儋州</span>
          </div>
        </div>
      </div>

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 py-5">
        {activeTab === 'map' && (
          <div className="space-y-5">
            {/* Two-Zone Sandbox Layout: Left Interactive Map Stage (8 cols) + Right Stop Inspector (4 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              <div className="lg:col-span-8 flex flex-col space-y-4">
                <div>
                  <NorthernSongMap
                    stops={SU_SHI_STOPS}
                    activeStopIndex={activeStopIndex}
                    legProgress={legProgress}
                    isPlaying={isPlaying}
                    selectedPhase={selectedPhase}
                    layers={mapLayers}
                    onSelectStop={handleSelectStop}
                    onToggleLayer={handleToggleMapLayer}
                  />
                </div>

                {/* Timeline & Animation Controller directly beneath map */}
                <TimelineController
                  stops={SU_SHI_STOPS}
                  activeStopIndex={activeStopIndex}
                  legProgress={legProgress}
                  isPlaying={isPlaying}
                  playbackSpeed={playbackSpeed}
                  isLooping={isLooping}
                  isAudioEnabled={isAudioEnabled}
                  selectedPhase={selectedPhase}
                  cumulativeKm={cumulativeStats.totalKm}
                  cumulativeSongLi={cumulativeStats.totalSongLi}
                  onTogglePlay={handleTogglePlay}
                  onSelectStop={handleSelectStop}
                  onPrevStop={handlePrevStop}
                  onNextStop={handleNextStop}
                  onReset={handleReset}
                  onChangeSpeed={setPlaybackSpeed}
                  onToggleLoop={() => setIsLooping((l) => !l)}
                  onToggleAudio={handleToggleAudio}
                  onSelectPhase={setSelectedPhase}
                />
              </div>

              {/* Right Column: Detailed Historical & Poetic Inspector */}
              <div className="lg:col-span-4 flex flex-col">
                <StopDetailInspector
                  stop={activeStop}
                  prevStop={prevStop}
                  legDistanceKm={currentLegKm}
                  totalStops={SU_SHI_STOPS.length}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'theater' && (
          <TheaterVideoStudio
            stops={SU_SHI_STOPS}
            activeStopIndex={activeStopIndex}
            legProgress={legProgress}
            isPlaying={isPlaying}
            playbackSpeed={playbackSpeed}
            isAudioEnabled={isAudioEnabled}
            onTogglePlay={handleTogglePlay}
            onSelectStop={handleSelectStop}
            onPrevStop={handlePrevStop}
            onNextStop={handleNextStop}
            onReset={handleReset}
            onChangeSpeed={setPlaybackSpeed}
            onToggleAudio={handleToggleAudio}
          />
        )}

        {activeTab === 'chronicle' && (
          <ChronicleHandscrollView
            stops={SU_SHI_STOPS}
            activeStopIndex={activeStopIndex}
            selectedPhase={selectedPhase}
            onSelectPhase={setSelectedPhase}
            onJumpToMapStop={handleJumpToMapStop}
          />
        )}

        {activeTab === 'poetry' && (
          <PoetryCatalogView
            stops={SU_SHI_STOPS}
            onJumpToMapStop={handleJumpToMapStop}
          />
        )}
      </main>

      {/* Quiet Archival Footer */}
      <footer className="mt-8 px-6 py-4 bg-[#EFE8D8] border-t border-[#D6CBB8] text-xs text-[#57534E]">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <span>
            底图考据：《元丰九域志》《中国历史地图集（北宋时期）》《苏轼年谱》（孔凡礼撰）
          </span>
          <span>
            “心似已灰之木，身如不系之舟。问汝平生功业，黄州惠州儋州。” —— 苏轼《自题金山画像》
          </span>
        </div>
      </footer>
    </div>
  );
}
