import { MortonNumbers } from "~/app/models/geo/MortonNumbers";
import { TypedArray } from "@deck.gl/core/typed/types/types";
import { Properties } from "maplibre-gl";

interface PositionDataType {}

//type PointFeatureProperties = any;
//type LineStringFeatureProperties = {};
//type PolygonFeatureProperties = {};

interface BinaryFeatureCollection {
  points?:
    | {
        // Array of x, y or x, y, z positions
        positions: { value: PositionDataType; size: number };
        // Array of original feature indexes by vertex
        globalFeatureIds: {
          value: TypedArray;
          size: number;
        };
        // Array of Point feature indexes by vertex
        featureIds: { value: TypedArray; size: number };
        // Object with accessor objects for numeric properties
        // Numeric properties are sized to have one value per vertex
        numericProps: {
          // numericProperty: { value: Float32Array; size: number };
        };
        // Array of objects with non-numeric properties from Point geometries
        properties: any[] | Properties<any>; //{ PointFeatureProperties: any }[];
        // Non-standard top-level fields
        fields?:
          | any[]
          | Properties<any>
          | [
              {
                // Feature ids of source data (if present)
                id?: string | number | undefined;
              },
            ];
      }
    | undefined;
  lines?:
    | {
        // Array of x, y or x, y, z positions
        positions: { value: PositionDataType; size: number };
        // Indices within positions of the start of each individual LineString
        pathIndices: { value: TypedArray; size: number };
        // Array of original feature indexes by vertex
        globalFeatureIds: { value: TypedArray; size: number };
        // Array of LineString feature indexes by vertex
        featureIds: { value: TypedArray; size: number };
        // Object with accessor objects for numeric properties
        // Numeric properties are sized to have one value per vertex
        numericProps: {
          // numericProperty: { value: TypedArray; size: number };
        };
        // Array of objects with non-numeric properties from LineString geometries
        properties: any[]; //[{ LineStringFeatureProperties }];
        // Non-standard top-level fields
        fields?:
          | any[]
          | [
              {
                // Feature ids of source data (if present)
                id?: string | number | undefined;
              },
            ];
      }
    | undefined;
  polygons?:
    | {
        // Array of x, y or x, y, z positions
        positions: { value: PositionDataType; size: number };
        // Indices within positions of the start of each complex Polygon
        polygonIndices: { value: TypedArray; size: number };
        // Indices within positions of the start of each primitive Polygon/ring
        primitivePolygonIndices: { value: TypedArray; size: number };
        // Triangle indices. Allows deck.gl to skip performing costly triangulation on main thread. Not present if `options.triangulate` is `false`
        triangles?: { value: TypedArray; size: number };
        // Array of original feature indexes by vertex
        globalFeatureIds: { value: TypedArray; size: number };
        // Array of Polygon feature indexes by vertex
        featureIds: { value: TypedArray; size: number };
        // Object with accessor objects for numeric properties
        // Numeric properties are sized to have one value per vertex
        numericProps: {
          //numericProperty: { value: TypedArray; size: 1 };
        };
        // Array of objects with non-numeric properties from Polygon geometries
        properties: any[]; //[{ PolygonFeatureProperties }];
        // Non-standard top-level fields
        fields?:
          | any[]
          | [
              {
                // Feature ids of source data (if present)
                id?: string | number;
              },
            ];
      }
    | undefined;
}

export interface GeoJsonEntity extends MortonNumbers {
  id: number;
  resourceIdRef: string;
  name: string | undefined;
  gid_0: string;
  gid_1?: string | undefined;
  gid_2?: string | undefined;
  country: string;
  name_1?: string | undefined;
  name_2?: string | undefined;
  binaryFeatures: BinaryFeatureCollection;
}
