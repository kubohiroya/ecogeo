import { GeoLocation } from '../../model/GeoLocation';
import { useCallback, useEffect, useRef } from 'react';

const topMargin = 32;
const labelWidth = 48;
const rightMargin = 32;
const labelHeight = 75; // 24

const backgroundColor = '#f4f4f4';

const chartConfig: Record<
  string,
  {
    min: number;
    max: number;
    oy: number;
    ticks: Array<{
      min: number;
      max: number;
      step: number;
    }>;
    bar?: (region: GeoLocation) => number;
    line?: (region: GeoLocation) => number;
    toFixed: number;
  }
> = {
  'Share of Manufacturing': {
    min: 0,
    max: 1,
    oy: 0,
    ticks: [
      { min: 0, max: 1, step: 0.1 },
      { min: 0, max: 0.25, step: 0.05 },
      { min: 0, max: 0.1, step: 0.02 },
    ],
    bar: (region: GeoLocation) => region.manufacturingShare,
    toFixed: 2,
  },
  'Share of Agriculture': {
    min: 0,
    max: 1,
    oy: 0,
    ticks: [
      { min: 0, max: 1, step: 0.1 },
      { min: 0, max: 0.25, step: 0.05 },
      { min: 0, max: 0.1, step: 0.02 },
    ],
    bar: (region: GeoLocation) => region.agricultureShare,
    toFixed: 2,
  },
  'Price Index': {
    min: 0,
    max: 4,
    oy: 0,
    ticks: [
      { min: 0, max: 4, step: 0.2 },
      { min: 0, max: 0.2, step: 0.05 },
    ],
    line: (region: GeoLocation) => region.priceIndex,
    toFixed: 2,
  },
  'Nominal Wage': {
    min: 0.8,
    max: 1.2,
    oy: 1,
    ticks: [
      { min: 0.8, max: 1.2, step: 0.05 },
      { min: 0.95, max: 1.05, step: 0.005 },
    ],
    line: (region: GeoLocation) => region.nominalWage,
    toFixed: 3,
  },
  'Real Wage': {
    min: 0.8,
    max: 1.2,
    oy: 1,
    ticks: [
      { min: 0.8, max: 1.2, step: 0.05 },
      { min: 0.9, max: 1.1, step: 0.01 },
      { min: 0.95, max: 1.05, step: 0.005 },
    ],
    line: (region: GeoLocation) => region.realWage,
    toFixed: 3,
  },
};

const drawHorizontalLabels = (
  ctx: CanvasRenderingContext2D,
  wScale: number,
  labelWidth: number,
  numRegions: number,
  yBase: number,
  focusedRegionIds: number[],
  selectedRegionIds: number[]
) => {
  ctx.textAlign = 'left';
  let numDrawnHorizontalLines = 0;

  if (numRegions <= 20) {
    const step = 1;
    for (let w = 0; w < numRegions; w += step) {
      const x = labelWidth + (w + 0.5) * wScale;
      if (focusedRegionIds.includes(w) && selectedRegionIds.includes(w)) {
        ctx.fillStyle = 'red';
      } else {
        ctx.fillStyle = '#888';
      }
      ctx.fillText(w.toString(), x + 1, yBase);
      numDrawnHorizontalLines++;
    }
  } else {
    const step = 10;
    for (let w = 10; w < numRegions; w += step) {
      const x = labelWidth + w * wScale;
      if (focusedRegionIds.includes(w) && selectedRegionIds.includes(w)) {
        ctx.fillStyle = 'red';
      } else {
        ctx.fillStyle = '#888';
      }
      ctx.fillText(w.toString(), x + 1, yBase);
      numDrawnHorizontalLines++;
    }
  }
};

export const ChartCanvas = ({
  width,
  height,
  chartTypeKey,
  scale,
  locations,
  focusedIds,
  selectedIds,
  onFocus,
  onUnfocus,
  onSelect,
  onUnselect,
}: {
  width: number;
  height: number;
  chartTypeKey: string;
  scale: number;
  locations: GeoLocation[];
  focusedIds: number[];
  selectedIds: number[];
  onFocus: (indices: number[]) => void;
  onSelect: (indices: number[]) => void;
  onUnfocus: (indices: number[]) => void;
  onUnselect: (indices: number[]) => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getIndex = (event: MouseEvent): number | null => {
    const wScale = (width - labelWidth - rightMargin) / locations.length;

    if (event.offsetX < labelWidth) {
      return null;
    }

    for (let index = 0; index < locations.length; index++) {
      if (event.offsetX < labelWidth + (index + 1) * wScale) {
        return index;
      }
    }
    return null;
  };

  const draw = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(
      labelWidth,
      0,
      canvas.width - labelWidth - rightMargin,
      canvas.height - labelHeight
    );

    const config = chartConfig[chartTypeKey];

    if (!config) {
      throw new Error('ERROR ChartTypeKey=' + chartTypeKey);
    }

    const wScale = (canvas.width - labelWidth - rightMargin) / locations.length;

    ctx.textAlign = 'right';
    const w = canvas.width - labelWidth - rightMargin;
    const graphHeight = canvas.height - labelHeight;

    const convertY = (value: number): number => {
      return _convertY(
        value,
        config.max,
        config.min,
        graphHeight,
        config.oy,
        scale
      );
    };

    const _convertY = (
      value: number,
      max: number,
      min: number,
      graphHeight: number,
      oy: number = 0,
      scale: number = 1
    ): number => {
      const relativeY = (value - oy) / (max - min);
      return graphHeight * scale * relativeY + (oy * graphHeight) / 2;
    };

    const drawVerticalTicks = () => {
      for (let i = 0; i < config.ticks.length; i++) {
        const { min, max, step } = config.ticks[i];
        let numDrawn = 0;
        for (let value = min; value <= max; value += step) {
          ctx.fillStyle = '#ddd';
          const y = canvas.height - labelHeight - convertY(value);
          if (0 <= y && y <= canvas.height - labelHeight) {
            ctx.fillRect(labelWidth, y, w, 1);
            numDrawn++;
          }
        }
        if (numDrawn > 1) {
          break;
        }
      }
    };

    drawVerticalTicks();

    locations.forEach((region, index) => {
      function drawFocusedItemBackground() {
        if (focusedIds.includes(index)) {
          ctx.fillStyle = 'rgb(255,255,0,0.3)';
          ctx.fillRect(
            labelWidth + index * wScale,
            0,
            Math.max(wScale - 1, 1),
            canvas.height - labelHeight + 16
          );
        }
      }

      function drawSelectedBarRect(y: number, style: string) {
        const isFocused = focusedIds.includes(index);
        const isSelected = selectedIds.includes(index);
        if (isFocused || isSelected) {
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#ff0'; // isFocused ? isSelected'#f00':
          if (0 <= y && y <= canvas.height - labelHeight) {
            ctx.strokeRect(
              labelWidth + index * wScale + 2,
              canvas.height - labelHeight - y + 2,
              Math.max(wScale - 1, 1) - 4,
              y - 4
            );
          } else if (canvas.height - labelHeight < y) {
            ctx.strokeRect(
              labelWidth + index * wScale,
              0,
              Math.max(wScale - 1, 1),
              canvas.height - labelHeight
            );
          }
          ctx.strokeStyle = style;
        }
      }

      function drawBarRect(y: number) {
        if (0 <= y && y <= canvas.height - labelHeight) {
          ctx.fillRect(
            labelWidth + index * wScale,
            canvas.height - labelHeight - y,
            Math.max(wScale - 1, 1),
            y
          );
        } else if (canvas.height - labelHeight < y) {
          ctx.fillRect(
            labelWidth + index * wScale,
            0,
            Math.max(wScale - 1, 1),
            canvas.height - labelHeight
          );
        }
      }

      function drawBar() {
        const barValue = config.bar ? config.bar(region) : null;
        if (barValue != null) {
          const style = barValue < 0 ? '#88e' : 'rgb(25,118,210)';
          ctx.strokeStyle = ctx.fillStyle = style;
          const y = convertY(barValue);
          drawBarRect(y);
          drawSelectedBarRect(y, style);
        }
      }

      drawFocusedItemBackground();
      drawBar();
    });

    function drawLines() {
      ctx.beginPath();
      locations.forEach((region, index) => {
        const lineValue = config.line ? config.line(region) : null;
        if (lineValue != null) {
          const y = canvas.height - labelHeight - convertY(lineValue);
          ctx.strokeStyle = '#88e';
          ctx.lineWidth = 2;
          if (index == 0) {
            ctx.moveTo(labelWidth + (index + 0.5) * wScale, y);
          } else {
            ctx.lineTo(labelWidth + (index + 0.5) * wScale, y);
          }

          const isFocused = focusedIds.includes(index);
          const isSelected = selectedIds.includes(index);

          if (isFocused || isSelected) {
            ctx.save();
            ctx.fillStyle = isFocused ? (isSelected ? 'red' : 'blue') : 'blue';
            ctx.fillRect(labelWidth + (index + 0.5) * wScale - 3, y - 3, 6, 6);
            ctx.restore();
          }
        }
      });
      ctx.stroke();
    }

    drawLines();

    const drawVerticalLabels = () => {
      for (let i = 0; i < config.ticks.length; i++) {
        const { min, max, step } = config.ticks[i];
        let numDrawn = 0;
        for (let value = min; value <= max; value += step) {
          ctx.fillStyle = '#ddd';
          const y = canvas.height - labelHeight - convertY(value);
          if (0 <= y && y <= canvas.height - labelHeight) {
            ctx.fillStyle = '#888';
            ctx.fillText(value.toFixed(config.toFixed), labelWidth - 6, y);
            numDrawn++;
          }
        }
        if (numDrawn > 1) {
          break;
        }
      }
    };

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, topMargin);

    drawVerticalLabels();

    drawHorizontalLabels(
      ctx,
      wScale,
      labelWidth,
      locations.length,
      canvas.height - labelHeight + 12,
      focusedIds,
      selectedIds
    );

    // requestAnimationFrame(() => draw(canvas, ctx));
  };

  const onMouseMove = useCallback(
    (event: MouseEvent) => {
      const canvas = canvasRef.current!;
      const index = getIndex(event);
      if (index == null) {
        canvas.style.cursor = 'default';
        onUnfocus(focusedIds);
      } else if (!focusedIds.includes(index)) {
        canvas.style.cursor = 'pointer';
        onUnfocus(focusedIds);
        onFocus([index]);
      } else {
        canvas.style.cursor = 'pointer';
      }
    },
    [canvasRef.current, focusedIds]
  );

  const onMouseLeave = useCallback(
    (event: MouseEvent) => {
      const canvas = canvasRef.current!;
      const index = getIndex(event);
      if (focusedIds.length > 0) {
        onUnfocus(focusedIds);
      }
    },
    [canvasRef.current, focusedIds]
  );

  const onMouseDown = useCallback(
    (event: MouseEvent) => {
      const canvas = canvasRef.current!;
      const index = getIndex(event);
      if (index != null) {
        if (selectedIds.includes(index)) {
          onUnselect([index]);
        } else {
          onSelect([index]);
        }
      }
    },
    [canvasRef.current, selectedIds]
  );

  useEffect(() => {
    const canvas = canvasRef.current!;
    canvas.onmousemove = onMouseMove;
    canvas.onmouseleave = onMouseLeave;
    canvas.onmousedown = onMouseDown;
  }, [canvasRef.current, onMouseMove, onMouseLeave, onMouseDown]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas2D is not supported');
    }
    draw(canvasRef.current!, ctx);
  }, [scale, width, height, chartTypeKey, focusedIds, selectedIds]);

  return <canvas ref={canvasRef} width={width} height={height}></canvas>;
};
