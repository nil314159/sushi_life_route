import React, { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  Download,
  Video,
  Sparkles,
  RotateCcw,
  Volume2,
  VolumeX,
  SkipForward,
  SkipBack,
} from 'lucide-react';
import { TrajectoryStop } from '../data/suShiChronicle';
import {
  THREE_PERIOD_LEGEND,
  RELIEF_MAP_CITIES,
  CURVED_TRAJECTORY_ARCS,
  getActiveTargetCityId,
} from '../data/reliefMapLayout';
import {
  calculateCumulativeDistance,
  getPartialSvgPath,
  getPointAlongSvgPath,
  getTravelerStateOnReliefMap,
} from '../utils/trajectoryMath';

type CanvasThemeId = 'relief-classic' | 'xuan-paper' | 'rubbing-gold';

interface TheaterVideoStudioProps {
  stops: TrajectoryStop[];
  activeStopIndex: number;
  legProgress: number;
  isPlaying: boolean;
  playbackSpeed: number;
  isAudioEnabled: boolean;
  onTogglePlay: () => void;
  onSelectStop: (index: number) => void;
  onPrevStop: () => void;
  onNextStop: () => void;
  onReset: () => void;
  onChangeSpeed: (speed: number) => void;
  onToggleAudio: () => void;
}

const RELIEF_BASEMAP_URL =
  '/src/assets/images/song_relief_basemap_portrait_1795009481013.jpg';

const THEMES: Record<
  CanvasThemeId,
  {
    name: string;
    outerBg: string;
    cardBg: string;
    cardBorder: string;
    textMain: string;
    textSub: string;
    accent: string;
    canvasFilter: string;
  }
> = {
  'relief-classic': {
    name: '地形浮雕 · 三期原色',
    outerBg: '#EBF0EE',
    cardBg: 'rgba(251, 249, 245, 0.96)',
    cardBorder: '#C7B299',
    textMain: '#1C1917',
    textSub: '#57534E',
    accent: '#1E6F56',
    canvasFilter: 'none',
  },
  'xuan-paper': {
    name: '古本宣纸 · 暖金设色',
    outerBg: '#E8DFCA',
    cardBg: 'rgba(247, 243, 234, 0.96)',
    cardBorder: '#B8A386',
    textMain: '#1C1917',
    textSub: '#57534E',
    accent: '#9A3412',
    canvasFilter: 'sepia(0.22) contrast(1.03)',
  },
  'rubbing-gold': {
    name: '夜航雅集 · 深色剧场',
    outerBg: '#181816',
    cardBg: 'rgba(28, 25, 23, 0.95)',
    cardBorder: '#57534E',
    textMain: '#F5F5F4',
    textSub: '#A8A29E',
    accent: '#D97706',
    canvasFilter: 'brightness(0.92) contrast(1.06)',
  },
};

export const TheaterVideoStudio: React.FC<TheaterVideoStudioProps> = ({
  stops,
  activeStopIndex,
  legProgress,
  isPlaying,
  playbackSpeed,
  isAudioEnabled,
  onTogglePlay,
  onSelectStop,
  onPrevStop,
  onNextStop,
  onReset,
  onChangeSpeed,
  onToggleAudio,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const [bgLoaded, setBgLoaded] = useState(false);
  const [themeId, setThemeId] = useState<CanvasThemeId>('relief-classic');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState<string>('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const activeStop = stops[activeStopIndex] || stops[0];
  const stats =
    activeStopIndex <= 0
      ? calculateCumulativeDistance(stops, 0, 0)
      : calculateCumulativeDistance(stops, activeStopIndex - 1, legProgress);
  const primaryWork = activeStop.works[0];

  // Preload the high-res topographic relief image for canvas drawing
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = RELIEF_BASEMAP_URL;
    img.onload = () => {
      bgImageRef.current = img;
      setBgLoaded(true);
    };
  }, []);

  // Draw the animated documentary frame onto the 1280x720 HTML5 Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width; // 1280
    const H = canvas.height; // 720
    const theme = THEMES[themeId];

    // 1. Fill outer background
    ctx.fillStyle = theme.outerBg;
    ctx.fillRect(0, 0, W, H);

    // 2. Transform into the 900x1200 portrait relief map space on the left side
    // Scale = 0.6 -> 900*0.6 = 540px wide, 1200*0.6 = 720px tall
    const mapScale = 0.6;
    const mapOffsetX = 140;
    const mapOffsetY = 0;

    ctx.save();
    ctx.translate(mapOffsetX, mapOffsetY);
    ctx.scale(mapScale, mapScale);

    if (bgImageRef.current && bgLoaded) {
      ctx.filter = theme.canvasFilter;
      ctx.drawImage(bgImageRef.current, 0, 0, 900, 1200);
      ctx.filter = 'none';
    } else {
      ctx.fillStyle = '#DFC798';
      ctx.fillRect(0, 0, 900, 1200);
    }

    // Draw Top-Left Map Title & Legend inside the 900x1200 space
    ctx.fillStyle = '#1E6F56';
    ctx.font = 'bold 52px "Noto Serif SC", serif';
    ctx.fillText('苏东坡人生轨迹', 36, 76);
    ctx.fillText('示意图', 36, 138);

    ctx.fillStyle = '#1C1917';
    ctx.font = '600 15px "Noto Serif SC", serif';
    ctx.fillText('线路说明', 40, 174);

    THREE_PERIOD_LEGEND.forEach((item, idx) => {
      const ly = 190 + idx * 26;
      ctx.fillStyle = '#F7F8F6';
      ctx.strokeStyle = '#57534E';
      ctx.lineWidth = 1;
      ctx.fillRect(40, ly, 44, 16);
      ctx.strokeRect(40, ly, 44, 16);

      ctx.strokeStyle = item.color;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(45, ly + 8);
      ctx.lineTo(78, ly + 8);
      ctx.stroke();

      ctx.fillStyle = '#1C1917';
      ctx.font = '14px "Noto Serif SC", serif';
      ctx.fillText(item.label, 92, ly + 13);
    });

    // Draw Curved Bézier Trajectory Arcs (synchronized with legProgress)
    CURVED_TRAJECTORY_ARCS.forEach((arc) => {
      const isPreviousCompleted = arc.toStopIndex < activeStopIndex;
      const isCurrentLeg = arc.toStopIndex === activeStopIndex;
      const isInTransitLeg =
        isCurrentLeg && legProgress > 0.005 && legProgress < 0.995;
      const isCompleted =
        isPreviousCompleted || (isCurrentLeg && legProgress >= 0.995);
      const isFuture = arc.toStopIndex > activeStopIndex;
      const periodMeta = THREE_PERIOD_LEGEND.find((p) => p.id === arc.period)!;

      // During active playback, only draw arcs up to the current growing leg
      if (isFuture && isPlaying) {
        return;
      }

      const activePartialD =
        isCurrentLeg && legProgress < 0.995
          ? getPartialSvgPath(arc.d, Math.max(0.01, Math.min(1, legProgress)))
          : arc.d;

      const path2d = new Path2D(activePartialD);
      if (isInTransitLeg) {
        ctx.strokeStyle = 'rgba(254, 243, 199, 0.85)';
        ctx.lineWidth = 6.5;
        ctx.lineCap = 'round';
        ctx.stroke(path2d);
      }

      if (!isCurrentLeg || legProgress > 0.005) {
        ctx.strokeStyle = periodMeta.color;
        ctx.lineWidth = isInTransitLeg ? 3.4 : isCompleted ? 2.4 : 1.5;
        ctx.globalAlpha = isInTransitLeg ? 1 : isCompleted ? 0.9 : 0.3;
        if (isFuture) {
          ctx.setLineDash([6, 5]);
        } else {
          ctx.setLineDash([]);
        }
        ctx.lineCap = 'round';
        ctx.stroke(path2d);
        ctx.setLineDash([]);

        // Draw arrowhead at the tip of the arc
        if (isPreviousCompleted || (isCurrentLeg && legProgress > 0.04)) {
          const tipState = getPointAlongSvgPath(
            arc.d,
            isCurrentLeg ? Math.min(1, legProgress) : 1
          );
          ctx.save();
          ctx.translate(tipState.x, tipState.y);
          ctx.rotate((tipState.angle * Math.PI) / 180);
          ctx.beginPath();
          ctx.moveTo(4, 0);
          ctx.lineTo(-8, -4.5);
          ctx.lineTo(-5.5, 0);
          ctx.lineTo(-8, 4.5);
          ctx.closePath();
          ctx.fillStyle = periodMeta.color;
          ctx.fill();
          ctx.restore();
        }
        ctx.globalAlpha = 1;
      }
    });

    const travelerState = getTravelerStateOnReliefMap(
      activeStopIndex,
      legProgress
    );
    const activeTargetCityId = getActiveTargetCityId(
      activeStopIndex,
      legProgress
    );

    // Draw White-Ringed City Hub Nodes
    RELIEF_MAP_CITIES.forEach((city) => {
      const isCurrentCity = city.id === activeTargetCityId;

      if (isCurrentCity) {
        ctx.beginPath();
        ctx.arc(city.x, city.y, 18, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(166, 43, 43, 0.24)';
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(
        city.x,
        city.y,
        isCurrentCity ? 8.2 : 5.8,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = isCurrentCity ? '#FEF2F2' : '#FFFDF9';
      ctx.fill();
      ctx.strokeStyle = isCurrentCity ? '#A62B2B' : '#1C1917';
      ctx.lineWidth = isCurrentCity ? 3 : 2.2;
      ctx.stroke();

      // City Label
      ctx.font = `${isCurrentCity ? 'bold 19px' : '600 17px'} "Noto Serif SC", serif`;
      ctx.strokeStyle = '#EFE4CC';
      ctx.lineWidth = 3.5;
      ctx.fillStyle = isCurrentCity ? '#881337' : '#1C1917';

      let dx = 12;
      let dy = 6;
      if (city.labelPosition === 'left') {
        dx = -46;
      } else if (city.labelPosition === 'top') {
        dx = -18;
        dy = -12;
      } else if (city.labelPosition === 'bottom') {
        dx = -18;
        dy = 22;
      }
      ctx.strokeText(city.name, city.x + dx, city.y + dy);
      ctx.fillText(city.name, city.x + dx, city.y + dy);
    });

    // Live Circular Traveler Marker locked to the growing tip of the trajectory line
    ctx.beginPath();
    ctx.arc(travelerState.x, travelerState.y, 14, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(166, 43, 43, 0.24)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(travelerState.x, travelerState.y, 7.5, 0, Math.PI * 2);
    ctx.fillStyle = '#A62B2B';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2.6;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(travelerState.x, travelerState.y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = '#FEF2F2';
    ctx.fill();

    ctx.restore();

    // 3. Right-Side Documentary Chronicle & Poetry Overlay Card on Canvas
    const panelX = 760;
    const panelY = 26;
    const panelW = 492;
    const panelH = H - 52;

    ctx.fillStyle = theme.cardBg;
    ctx.fillRect(panelX, panelY, panelW, panelH);
    ctx.strokeStyle = theme.cardBorder;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(panelX, panelY, panelW, panelH);

    // Seal Stamp in Top Right of Panel
    ctx.fillStyle = '#A62B2B';
    ctx.fillRect(panelX + panelW - 66, panelY + 22, 42, 42);
    ctx.fillStyle = '#F7F3EA';
    ctx.font = 'bold 14px "Noto Serif SC", serif';
    ctx.fillText('东坡', panelX + panelW - 59, panelY + 40);
    ctx.fillText('行迹', panelX + panelW - 59, panelY + 58);

    // Header Kicker
    ctx.fillStyle = theme.accent;
    ctx.font = '600 13px "JetBrains Mono", monospace';
    ctx.fillText(
      `第 ${String(activeStop.id).padStart(2, '0')} 站 · 公元 ${activeStop.yearStart} 年 · ${activeStop.ageRange}`,
      panelX + 26,
      panelY + 42
    );

    // Stop Title
    ctx.fillStyle = theme.textMain;
    ctx.font = 'bold 26px "Noto Serif SC", serif';
    ctx.fillText(activeStop.songName, panelX + 26, panelY + 80);

    ctx.fillStyle = theme.textSub;
    ctx.font = '14px "Noto Serif SC", serif';
    ctx.fillText(
      `今${activeStop.modernName} · ${activeStop.officialTitle}`,
      panelX + 26,
      panelY + 108
    );

    // Divider line
    ctx.strokeStyle = theme.cardBorder;
    ctx.beginPath();
    ctx.moveTo(panelX + 26, panelY + 126);
    ctx.lineTo(panelX + panelW - 26, panelY + 126);
    ctx.stroke();

    // Wrapped Narrative Text helper
    const drawWrappedText = (
      text: string,
      startX: number,
      startY: number,
      maxWidth: number,
      lineHeight: number,
      font: string,
      color: string
    ): number => {
      ctx.font = font;
      ctx.fillStyle = color;
      let line = '';
      let y = startY;
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === '\n') {
          ctx.fillText(line, startX, y);
          line = '';
          y += lineHeight;
          continue;
        }
        const testLine = line + ch;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && line.length > 0) {
          ctx.fillText(line, startX, y);
          line = ch;
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      if (line) {
        ctx.fillText(line, startX, y);
        y += lineHeight;
      }
      return y;
    };

    let nextY = drawWrappedText(
      activeStop.summary,
      panelX + 26,
      panelY + 154,
      panelW - 52,
      24,
      '14px "Noto Serif SC", serif',
      theme.textMain
    );

    // Poem Showcase Box
    if (primaryWork) {
      nextY += 18;
      ctx.strokeStyle = theme.cardBorder;
      ctx.beginPath();
      ctx.moveTo(panelX + 26, nextY);
      ctx.lineTo(panelX + panelW - 26, nextY);
      ctx.stroke();

      nextY += 28;
      ctx.fillStyle = theme.accent;
      ctx.font = 'bold 17px "Noto Serif SC", serif';
      ctx.fillText(
        `《${primaryWork.title}》 · ${primaryWork.year}`,
        panelX + 26,
        nextY
      );

      nextY += 28;
      nextY = drawWrappedText(
        primaryWork.fullText,
        panelX + 26,
        nextY,
        panelW - 52,
        25,
        '15px "Noto Serif SC", serif',
        theme.textMain
      );
    }

    // Bottom Cumulative Distance Footer inside Canvas
    ctx.fillStyle = theme.textSub;
    ctx.font = '13px "JetBrains Mono", monospace';
    ctx.fillText(
      `累计行旅：${stats.totalSongLi.toLocaleString()} 宋里 (${stats.totalKm.toLocaleString()} km) · 方式：${activeStop.transportMode}`,
      panelX + 26,
      panelY + panelH - 22
    );
  }, [
    stops,
    activeStopIndex,
    legProgress,
    themeId,
    activeStop,
    primaryWork,
    stats,
    bgLoaded,
  ]);

  // Export High-Resolution PNG Poster
  const handleDownloadPoster = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `东坡行旅图_${activeStop.yearStart}_${activeStop.shortSongName}.png`;
    a.click();
    setRecordingStatus(`已导出《${activeStop.shortSongName}》高清浮雕舆图海报 (.png)`);
  };

  // Record WebM Animated Video directly from the HTML5 Canvas
  const handleToggleRecordVideo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isRecording && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      return;
    }

    try {
      const stream = canvas.captureStream(30);
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';
      const recorder = new MediaRecorder(stream, { mimeType });
      recordedChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `东坡行旅动态纪录片_${activeStop.yearStart}.webm`;
        a.click();
        setRecordingStatus('动态轨迹视频 (.webm) 已生成并下载完成');
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setRecordingStatus(
        '正在录制画布动态轨迹视频，点击“停止并保存视频”即可下载 .webm 文件...'
      );
      if (!isPlaying) {
        onTogglePlay();
      }
    } catch {
      setRecordingStatus(
        '当前浏览器环境不支持 MediaRecorder 视频流录制，请使用右侧高清海报导出。'
      );
    }
  };

  return (
    <div className="space-y-5">
      {/* Studio Control Header */}
      <div className="bg-[#FBF9F5] border border-[#D6CBB8] rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-[#1C1917]">
            东坡行旅 · 沉浸式动图与纪录片展映台
          </h2>
          <p className="text-xs text-[#57534E] mt-0.5">
            融合高精度北宋地形浮雕底图、三期彩色弧线与诗词吟诵画卷，支持在线连播、一键录制导出动态视频（.webm）或高清海报（.png）。
          </p>
        </div>

        {/* Visual Style Switcher + Export Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div
            role="group"
            aria-label="画卷视觉设色风格"
            className="flex items-center gap-1 bg-[#EAE0CE] p-1 rounded-md"
          >
            {(Object.keys(THEMES) as CanvasThemeId[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setThemeId(key)}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                  themeId === key
                    ? 'bg-[#1C1917] text-[#F7F3EA]'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                {THEMES[key].name}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleToggleRecordVideo}
            className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              isRecording
                ? 'bg-[#DC2626] text-white'
                : 'bg-[#1A4B6E] hover:bg-[#172554] text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>
              {isRecording ? '停止并保存视频 (.webm)' : '录制动态视频 (.webm)'}
            </span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPoster}
            className="px-3 py-1.5 text-xs font-medium bg-[#1E6F56] hover:bg-[#155440] text-white rounded-md flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>导出当前帧海报 (.png)</span>
          </button>
        </div>
      </div>

      {recordingStatus && (
        <div className="px-4 py-2 bg-[#F3ECE0] border border-[#D6CBB8] rounded-md text-xs text-[#78350F] flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#9A3412]" />
            <span>{recordingStatus}</span>
          </span>
          <button
            type="button"
            onClick={() => setRecordingStatus('')}
            className="text-[#57534E] hover:text-[#1C1917]"
          >
            关闭提示
          </button>
        </div>
      )}

      {/* Main 16:9 Cinema Canvas Frame */}
      <div className="bg-[#1C1917] p-3 rounded-lg border border-[#44403C]">
        <div className="relative w-full aspect-video rounded overflow-hidden bg-[#141413]">
          <canvas
            ref={canvasRef}
            width={1280}
            height={720}
            data-testid="theater-video-canvas"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Theater Playback Bar Below Screen */}
        <div className="mt-3 pt-3 border-t border-[#292524] flex flex-wrap items-center justify-between gap-4 text-[#F5F5F4]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onTogglePlay}
              className="px-4 py-1.5 bg-[#9A3412] hover:bg-[#B91C1C] text-white text-xs font-medium rounded flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>暂停展映</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>播放动态画卷</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onPrevStop}
              disabled={activeStopIndex === 0}
              className="px-2.5 py-1.5 bg-[#292524] hover:bg-[#44403C] disabled:opacity-40 text-xs rounded flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
            >
              <SkipBack className="w-3.5 h-3.5" />
              <span>上一幕</span>
            </button>

            <button
              type="button"
              onClick={onNextStop}
              className="px-2.5 py-1.5 bg-[#292524] hover:bg-[#44403C] text-xs rounded flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
            >
              <span>下一幕</span>
              <SkipForward className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={onReset}
              className="px-2.5 py-1.5 bg-[#292524] hover:bg-[#44403C] text-xs rounded flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>从头开始</span>
            </button>
          </div>

          {/* Chapter Quick Scrubber */}
          <div className="flex-1 max-w-md flex items-center gap-3">
            <label
              htmlFor="theater-scrubber"
              className="text-xs text-[#A8A29E] whitespace-nowrap"
            >
              剧场章节：{activeStop.id}/{stops.length}
            </label>
            <input
              id="theater-scrubber"
              type="range"
              min={0}
              max={stops.length - 1}
              step={1}
              value={activeStopIndex}
              onChange={(e) => onSelectStop(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-[#44403C] rounded-lg appearance-none cursor-pointer accent-[#9A3412]"
            />
          </div>

          <div className="flex items-center gap-2">
            {[0.5, 1, 2, 4].map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => onChangeSpeed(spd)}
                className={`px-2 py-1 text-xs font-mono tabular-nums rounded transition-colors whitespace-nowrap shrink-0 ${
                  playbackSpeed === spd
                    ? 'bg-[#9A3412] text-white'
                    : 'bg-[#292524] text-[#A8A29E] hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}

            <button
              type="button"
              onClick={onToggleAudio}
              className={`px-3 py-1 text-xs rounded flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
                isAudioEnabled
                  ? 'bg-[#1E6F56] text-white'
                  : 'bg-[#292524] text-[#A8A29E] hover:text-white'
              }`}
            >
              {isAudioEnabled ? (
                <Volume2 className="w-3.5 h-3.5" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
              <span>古琴配乐</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
