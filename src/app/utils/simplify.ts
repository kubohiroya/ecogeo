export type Coordinate = [number, number];

/*
Original Code from simplify.js
(c) 2017, Vladimir Agafonkin
Simplify.js, a high-performance JS polyline simplification library
mourner.github.io/simplify-js
*/

function getSqDist(p1: Coordinate, p2: Coordinate) {
  const dx = p1[0] - p2[0],
    dy = p1[1] - p2[1];

  return dx * dx + dy * dy;
}

// square distance from a point to a segment
function getSqSegDist(p: Coordinate, p1: Coordinate, p2: Coordinate): number {
  let x = p1[0],
    y = p1[1],
    dx = p2[0] - x,
    dy = p2[1] - y;

  if (dx !== 0 || dy !== 0) {
    const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);

    if (t > 1) {
      x = p2[0];
      y = p2[1];
    } else if (t > 0) {
      x += dx * t;
      y += dy * t;
    }
  }

  dx = p[0] - x;
  dy = p[1] - y;

  return dx * dx + dy * dy;
}

// rest of the code doesn't care about point format

// basic distance-based simplification
function simplifyRadialDist(
  points: Coordinate[],
  sqTolerance: number,
): Coordinate[] {
  let prevPoint = points[0];
  const newPoints = [prevPoint];
  let point: Coordinate | null = null;

  for (let i = 1, len = points.length; i < len; i++) {
    point = points[i];

    if (getSqDist(point, prevPoint) > sqTolerance) {
      newPoints.push(point);
      prevPoint = point;
    }
  }

  if (prevPoint !== point) newPoints.push(point!);

  return newPoints;
}

function simplifyDPStep(
  points: Coordinate[],
  first: number,
  last: number,
  sqTolerance: number,
  simplified: Coordinate[],
) {
  let maxSqDist = sqTolerance;
  let index: number = 0;

  for (let i = first + 1; i < last; i++) {
    const sqDist = getSqSegDist(points[i], points[first], points[last]);

    if (sqDist > maxSqDist) {
      index = i;
      maxSqDist = sqDist;
    }
  }

  if (maxSqDist > sqTolerance) {
    if (index - first > 1)
      simplifyDPStep(points, first, index, sqTolerance, simplified);
    simplified.push(points[index]);
    if (last - index > 1)
      simplifyDPStep(points, index, last, sqTolerance, simplified);
  }
}

// simplification using Ramer-Douglas-Peucker algorithm
function simplifyDouglasPeucker(
  points: Coordinate[],
  sqTolerance: number,
): Coordinate[] {
  const last = points.length - 1;

  const simplified = [points[0]];
  simplifyDPStep(points, 0, last, sqTolerance, simplified);
  simplified.push(points[last]);

  return simplified;
}

// both algorithms combined for awesome performance
function simplify(
  points: Coordinate[],
  tolerance: number,
  highestQuality: boolean,
): Coordinate[] {
  if (points.length <= 2) return points;

  const sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1;
  points = highestQuality ? points : simplifyRadialDist(points, sqTolerance);
  points = simplifyDouglasPeucker(points, sqTolerance);
  return points;
}

function calculateCombinedValue(coord: Coordinate, accuracy = 10000): number {
  return (
    Math.round((coord[0] + 180) * accuracy) * (1000 * accuracy) +
    Math.round((coord[1] + 90) * accuracy)
  );
}

function check(coord: Coordinate) {
  return coord[0] === 133.6928 && coord[1] === 34.01;
}

function calculateCoord(
  combinedValue: number,
  accuracy = 100,
): [number, number] {
  const factor = 180 * accuracy;
  // 分離するために経度の係数を使用して緯度を抽出
  const latitude = (combinedValue % (factor * accuracy)) / accuracy - 90;
  // 経度を抽出
  const longitude =
    Math.floor(combinedValue / (factor * accuracy)) / accuracy - 180;
  return [longitude, latitude];
}

/**
 * sourceを走査して点の列を取り出し、その個々の点について、mapに登録されているか否かによって、boolean[]型の配列をつくる。この配列を走査し、配列内でtrueとなる範囲の最初のインデックスと最後のインデックスのリストとして、{trueValueStartIndex: number, trueValueEndIndex:number}[] をつくり、関数の返値として返す。
 * @param source
 * @param map
 */
function colorizeSegments(
  source: Coordinate[],
  map: Map<number, number>,
): { isCached: boolean; startIndex: number; endIndex: number }[] {
  // 結果を格納する配列
  const result: { isCached: boolean; startIndex: number; endIndex: number }[] =
    [];

  // sourceの各点列に対して処理を行う
  const boolArray: boolean[] = source.map((coord) => {
    const combinedValue = calculateCombinedValue(coord);
    return map.has(combinedValue);
  });

  let startIndex = 0;
  let currentValue = boolArray[0];

  for (let i = 1; i <= boolArray.length; i++) {
    if (i === boolArray.length || boolArray[i] !== currentValue) {
      result.push({
        isCached: currentValue,
        startIndex: startIndex,
        endIndex: i - 1,
      });
      startIndex = i;
      currentValue = i < boolArray.length ? boolArray[i] : !currentValue;
    }
  }

  return result;
}

function updateSimplifiedMap(
  name: string,
  source: Coordinate[],
  simplified: Coordinate[],
  map: Map<number, number>,
): Map<number, number> {
  let i = 0;
  let j = 0;
  while (i < source.length && j < simplified.length) {
    const simplifiedSegment = simplified[j];
    const simplifiedCombinedValue = calculateCombinedValue(simplifiedSegment);
    const sourceSegment = source[i];
    const sourceCombinedValue = calculateCombinedValue(sourceSegment);
    /*
    if (
      name.startsWith('Japan\tTokushima') ||
      name.startsWith('Japan\tKagawa')
    ) {
      console.log(
        `${i} / ${source.length}`,
        // source,
        sourceSegment,
        // sourceCombinedValue,
        `${j} / ${simplified.length}`,
        // simplified,
        simplifiedSegment,
        // simplifiedCombinedValue
        sourceCombinedValue === simplifiedCombinedValue,
      );
    }
     */
    // i: a, b, c, d, e, f, g, h, i, j
    // j: a,    c,       f,    h, i, j

    map.set(sourceCombinedValue, simplifiedCombinedValue);
    if (sourceCombinedValue === simplifiedCombinedValue) {
      i++;
      j++;
    } else {
      i++;
    }
  }
  return map;
}

export const combinedValueMap = new Map<number, number>();

export function simplifyPolygons(
  name: string,
  polygons: Coordinate[][][],
  tolerance: number,
  highestQuality: boolean,
  combinedValueMap: Map<number, number>,
): Coordinate[][][] {
  return polygons
    .map((polygon, polygonIndex) => {
      return polygon
        .map((polygonCoords, polygonCoordIndex) => {
          const polygonCoordsSimplified: Coordinate[] = [];
          const segments = colorizeSegments(polygonCoords, combinedValueMap);
          segments.forEach((segment, segmentIndex) => {
            /*
            segment.isCached &&
              console.log(
                name,
                `${polygonIndex}/${polygons.length - 1}`,
                `${polygonCoordIndex}/${polygonCoords.length - 1}`,
                `${segmentIndex}/${segments.length - 1}`,
                `${segment.startIndex}-${segment.endIndex} (${segment.endIndex - segment.startIndex + 1}個)`,
                segment.isCached,
              );
             */
            if (segment.isCached) {
              for (let i = segment.startIndex; i <= segment.endIndex; i++) {
                const currentCoord = polygonCoords[i];
                const combinedValue = calculateCombinedValue(currentCoord);
                if (combinedValueMap.get(combinedValue) === combinedValue) {
                  polygonCoordsSimplified.push(currentCoord);
                }
              }
            } else {
              const segmentCoords = polygonCoords.slice(
                segment.startIndex,
                segment.endIndex + 1,
              );
              const segmentCoordsSimplified = simplify(
                segmentCoords,
                tolerance,
                highestQuality,
              );

              if (
                segmentCoords.length > 0 &&
                segmentCoordsSimplified.length > 0
              ) {
                if (
                  calculateCombinedValue(segmentCoords[0]) !==
                  calculateCombinedValue(segmentCoordsSimplified[0])
                ) {
                  segmentCoordsSimplified.unshift(segmentCoords[0]);
                }
                if (
                  calculateCombinedValue(
                    segmentCoords[segmentCoords.length - 1],
                  ) !==
                  calculateCombinedValue(
                    segmentCoordsSimplified[segmentCoordsSimplified.length - 1],
                  )
                ) {
                  segmentCoordsSimplified.push(
                    segmentCoords[segmentCoords.length - 1],
                  );
                }
              }

              polygonCoordsSimplified.push(...segmentCoordsSimplified);

              updateSimplifiedMap(
                name,
                segmentCoords,
                segmentCoordsSimplified,
                combinedValueMap,
              );
            }
          });
          // ---vvv---
          /*
          if (polygonCoords.length > 0 && polygonCoordsSimplified.length > 0) {
            if (
              calculateCombinedValue(polygonCoords[0]) !==
              calculateCombinedValue(polygonCoordsSimplified[0])
            ) {
              console.log('NG', name, polygonCoords, polygonCoordsSimplified);
            }
            if (
              calculateCombinedValue(
                polygonCoords[polygonCoords.length - 1],
              ) !==
              calculateCombinedValue(
                polygonCoordsSimplified[polygonCoordsSimplified.length - 1],
              )
            ) {
              // console.log('NG', polygonCoords, polygonCoordsSimplified);
              polygonCoordsSimplified.push(polygonCoordsSimplified[0]);
            }
          }
          // ---^^^---
           */
          return polygonCoordsSimplified.filter((coords) => coords.length > 3);
        })
        .filter((polygon) => polygon.length > 2);
    })
    .filter((polygons) => polygons.length > 0);
}
