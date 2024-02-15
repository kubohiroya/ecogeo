import { City } from "~/app/models/City";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { chartConfig } from "./ChartConfig";

const topMargin = 32;
const labelWidth = 48;
const rightMargin = 32;
const labelHeight = 95;

const backgroundColor = '#f5f5f5';

const drawHorizontalLabels = (
  ctx: CanvasRenderingContext2D,
  wScale: number,
  labelWidth: number,
  numLocations: number,
  yBase: number,
  focusedLocationIndices: number[],
  selectedLocationIndices: number[],
) => {
  ctx.textAlign = 'left';
  let numDrawnHorizontalLines = 0;

  if (numLocations <= 20) {
    const step = 1;
    for (let w = 0; w < numLocations; w += step) {
      const x = labelWidth + (w + 1 / 2) * wScale - (w < 10 ? 4 : 8);
      if (
        focusedLocationIndices.includes(w) &&
        selectedLocationIndices.includes(w)
      ) {
        ctx.fillStyle = 'red';
      } else {
        ctx.fillStyle = '#888';
      }
      ctx.fillText(w.toString(), x, yBase);
      numDrawnHorizontalLines++;
    }
  } else {
    const step = 10;
    for (let w = 10; w < numLocations; w += step) {
      const x = labelWidth / 2 + w * wScale;
      if (
        focusedLocationIndices.includes(w) &&
        selectedLocationIndices.includes(w)
      ) {
        ctx.fillStyle = 'red';
      } else {
        ctx.fillStyle = '#888';
      }
      ctx.fillText(w.toString(), x, yBase);
      numDrawnHorizontalLines++;
    }
  }
};

export const ChartCanvas = React.memo(
  ({
    width,
    height,
    chartTypeKey,
    scale,
    locations,
    focusedIndices,
    selectedIndices,
    onFocus,
    onUnfocus,
    onSelect,
    onUnselect,
  }: {
    width: number;
    height: number;
    chartTypeKey: string;
    scale: number;
    locations: City[];
    focusedIndices: number[];
    selectedIndices: number[];
    onFocus: (indices: number[]) => void;
    onSelect: (prevIndices: number[], indices: number[]) => void;
    onUnfocus: (indices: number[]) => void;
    onUnselect: (prevIndices: number[], indices: number[]) => void;
  }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [pointerPosition, setPointerPosition] = useState<{
      x: number;
      y: number;
    } | null>(null);

    const getIndex = (
      position: {
        x: number;
        y: number;
      } | null,
    ): number | null => {
      if (!locations || locations.length === 0) {
        return null;
      }

      const wScale = (width - labelWidth - rightMargin) / locations.length;

      if (position) {
        if (position.x < labelWidth) {
          return null;
        }
        for (let index = 0; index < locations.length; index++) {
          if (position.x < labelWidth + (index + 1) * wScale) {
            return index;
          }
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
        canvas.height - labelHeight,
      );

      const config = chartConfig[chartTypeKey];

      if (!config) {
        throw new Error('ERROR ChartTypeKey=' + chartTypeKey);
      }
      if (!locations || locations.length === 0) {
        return;
      }

      const wScale =
        (canvas.width - labelWidth - rightMargin) / locations.length;

      ctx.textAlign = 'right';
      const w = canvas.width - labelWidth - rightMargin;
      const graphHeight = canvas.height - topMargin - labelHeight;

      const convertY = (value: number): number => {
        return _convertY(
          value,
          config.max,
          config.min,
          graphHeight,
          config.oy,
          scale,
        );
      };

      const _convertY = (
        value: number,
        max: number,
        min: number,
        graphHeight: number,
        oy: number = 0,
        scale: number = 1,
      ): number => {
        const relativeY = (value - oy) / (max - min);
        return graphHeight * scale * relativeY + (oy * graphHeight) / 2;
      };

      const drawVerticalTicks = () => {
        for (let i = 0; i < config.ticks.length; i++) {
          const { min, max, step, lineDash } = config.ticks[i];
          ctx.lineWidth = 1;
          ctx.setLineDash(lineDash);
          ctx.strokeStyle = '#ddd';
          // ctx.fillStyle = '#ddd';
          let numDrawn = 0;
          for (let value = min; value <= max; value += step) {
            const y = canvas.height - labelHeight - convertY(value);
            if (0 <= y && y <= canvas.height - labelHeight) {
              ctx.beginPath();
              ctx.moveTo(labelWidth, y);
              ctx.lineTo(labelWidth + w, y);
              ctx.stroke();
              // ctx.fillRect(labelWidth, y, w, 1);
              numDrawn++;
            }
          }
          if (numDrawn > 3) {
            break;
          }
        }
        ctx.setLineDash([]);
      };

      drawVerticalTicks();

      locations.forEach((location, index) => {
        function drawFocusedItemBackground() {
          if (focusedIndices.includes(index)) {
            ctx.fillStyle = 'rgb(255,255,0,0.3)';
            ctx.fillRect(
              labelWidth + index * wScale,
              0,
              Math.max(wScale - 1, 1),
              canvas.height - labelHeight,
            );
          }
        }

        function drawSelectedBarRect(y: number, style: string) {
          const isFocused = focusedIndices.includes(index);
          const isSelected = selectedIndices.includes(index);
          if (isFocused || isSelected) {
            ctx.lineWidth = 2;
            ctx.strokeStyle = isSelected ? '#f83' : '#ff0';
            if (0 <= y && y <= canvas.height - labelHeight) {
              ctx.strokeRect(
                labelWidth + index * wScale + 2,
                canvas.height - labelHeight - y + 2,
                Math.max(wScale - 1, 1) - 4,
                y - 4,
              );
            } else if (canvas.height - labelHeight < y) {
              ctx.strokeRect(
                labelWidth + index * wScale,
                0,
                Math.max(wScale - 1, 1),
                canvas.height - labelHeight,
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
              y,
            );
          } else if (canvas.height - labelHeight < y) {
            ctx.fillRect(
              labelWidth + index * wScale,
              0,
              Math.max(wScale - 1, 1),
              canvas.height - labelHeight,
            );
          }
        }

        function drawBar() {
          const isSelected = selectedIndices.includes(index);
          const barValue = config.bar ? config.bar(location) : null;
          if (barValue !== null) {
            const style =
              barValue < 0 ? '#88e' : isSelected ? '#ff8' : 'rgb(25,118,210)';
            //ctx.fillStyle =  ? '#ff3' : 'rgb(25,118,210)';
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
        locations.forEach((location, index) => {
          const lineValue = config.line ? config.line(location) : null;
          if (lineValue !== null) {
            const y = canvas.height - labelHeight - convertY(lineValue);
            ctx.strokeStyle = '#88e';
            ctx.lineWidth = 2;
            if (index === 0) {
              ctx.moveTo(labelWidth + (index + 0.5) * wScale, y);
            } else {
              ctx.lineTo(labelWidth + (index + 0.5) * wScale, y);
            }

            const isFocused = focusedIndices.includes(index);
            const isSelected = selectedIndices.includes(index);

            if (isFocused || isSelected) {
              ctx.save();
              ctx.fillStyle = isFocused
                ? isSelected
                  ? 'red'
                  : 'blue'
                : 'blue';
              ctx.fillRect(
                labelWidth + (index + 0.5) * wScale - 3,
                y - 3,
                6,
                6,
              );
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
          let numLabelsDrawn = 0;

          for (let value = min; value <= max; value += step) {
            //ctx.fillStyle = '#ddd';
            const y = canvas.height - labelHeight - convertY(value);
            if (
              topMargin <= y &&
              y <= canvas.height - topMargin + labelHeight
            ) {
              ctx.fillStyle = '#888';
              const label = value.toFixed(config.toFixed);
              ctx.fillText(label, labelWidth - 6, y);
              numLabelsDrawn++;
            }
          }
          if (numLabelsDrawn > 3) {
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
        canvas.height - labelHeight + 13,
        focusedIndices,
        selectedIndices,
      );

      function drawFocusedItemTooltip(index: number | null) {
        if (
          index !== null &&
          focusedIndices.includes(index) &&
          pointerPosition !== null
        ) {
          ctx.fillStyle = 'rgb(10,10,10,0.3)';
          ctx.fillRect(
            Math.min(width - 230, pointerPosition.x),
            pointerPosition.y + 12,
            230,
            20,
          );
          ctx.fillStyle = 'rgb(255,255,255,1)';
          ctx.textAlign = 'left';
          ctx.fillText(
            locations[index].label,
            Math.min(width - 230 + 16, pointerPosition.x + 8),
            pointerPosition.y + 26,
          );
        }
      }

      drawFocusedItemTooltip(getIndex(pointerPosition));
    };

    const onMouseMove = useCallback(
      (event: MouseEvent) => {
        const canvas = canvasRef.current!;
        const focusedIndex = getIndex({ x: event.offsetX, y: event.offsetY });
        if (focusedIndex === null) {
          onUnfocus(focusedIndices);
        } else if (!focusedIndices.includes(focusedIndex)) {
          canvas.style.cursor = 'pointer';
          onUnfocus(focusedIndices);
          onFocus([focusedIndex]);
        } else {
          canvas.style.cursor = 'pointer';
        }
        setPointerPosition({ x: event.offsetX, y: event.offsetY });
      },
      [canvasRef.current, focusedIndices],
    );

    const onMouseLeave = useCallback(
      (event: MouseEvent) => {
        const canvas = canvasRef.current!;
        const selectedIndex = getIndex({ x: event.offsetX, y: event.offsetY });
        if (focusedIndices.length > 0) {
          onUnfocus(focusedIndices);
        }
      },
      [canvasRef.current, focusedIndices],
    );

    const onMouseDown = useCallback(
      (event: MouseEvent) => {
        const canvas = canvasRef.current!;
        const selectedIndex = getIndex({ x: event.offsetX, y: event.offsetY });
        if (selectedIndex !== null) {
          if (selectedIndices.includes(selectedIndex)) {
            onUnselect(selectedIndices, [selectedIndex]);
          } else {
            onSelect(selectedIndices, [selectedIndex]);
          }
        }
      },
      [canvasRef.current, selectedIndices],
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
    }, [
      scale,
      width,
      height,
      chartTypeKey,
      focusedIndices,
      selectedIndices,
      locations,
    ]);

    return <canvas ref={canvasRef} width={width} height={height}></canvas>;
  },
);
