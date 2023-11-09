import { GeoLocation } from '../model/GeoLocation';

export function drawRegionDetail(
  ctx: CanvasRenderingContext2D,
  center: {
    x: number;
    y: number;
  },
  focusedRegionIds: number[],
  regions: GeoLocation[],
  avgRealWage: number
) {
  if (focusedRegionIds.length > 0) {
    ctx.save();

    const offsetX = -80;
    const offsetY = -60;

    const region = regions[focusedRegionIds[0]];

    if (!region) return;

    const highlow: string =
      region.realWage > avgRealWage
        ? '↑'
        : region.realWage < avgRealWage
        ? '↓'
        : '';

    ctx.fillStyle = `black`;
    [
      'Region #' + region.index,
      ' Share of manufacturing = ' + region.manufacturingShare.toFixed(4),
      ' Share of agriculture = ' + region.agricultureShare.toFixed(4),
      ' Price index = ' + region.priceIndex.toFixed(4),
      ' Income = ' + region.income.toFixed(4),
      ' Nominal wage = ' + region.nominalWage.toFixed(4),
      ' Real wage = ' + region.realWage.toFixed(4) + ' ' + highlow,
      ' Average real wage = ' + avgRealWage.toFixed(4),
    ].forEach((text, index) => {
      const c = new DOMPoint(
        center.x + offsetX,
        center.y + offsetY + index * 15
      );
      ctx.fillText(text, c.x, c.y);
    });

    ctx.restore();
  }
}
