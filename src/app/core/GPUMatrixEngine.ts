import { Edge, Vertex } from '../model/Graph';
import { create2DArray } from '../util/arrayUtil';
import { City } from '../model/City';
import { AbstractMatrixEngine } from './MatrixEngine';
import { DISTANCE_SCALE_FACTOR } from './calculateDistanceByLocations';

const initializeAdjacencyMatrixComputeShaderCode = () => `
@group(0) @binding(0) var<uniform> numVertices: u32;
@group(0) @binding(4) var<storage, read_write> adjacencyMatrix: array<f32>;

const WORK_GROUP_SIZE = 64u;
@compute @workgroup_size(WORK_GROUP_SIZE)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let index = global_id.x;
    let totalSize = numVertices * numVertices;
    let items = max(1, totalSize / WORK_GROUP_SIZE);
    // 接続行列の初期化を並列化
    let start = index * items; // このワークアイテムが処理を開始するインデックス
    let end = min((index + 1) * items, totalSize); // このワークアイテムが処理を終了するインデックス

    for (var i: u32 = start; i < end; i++) {
        let rowIndex = i / numVertices;
        let colIndex = i % numVertices;
        if (rowIndex == colIndex) {
           adjacencyMatrix[i] = f32(0); // 対角要素には0をセット
        } else {
            adjacencyMatrix[i] = f32(1e10); // 辺を持たない要素には1e10をセット
        }
    }
}
`;

const createAdjacencyMatrixComputeShaderCode = () => `
struct Vertex {
    x: f32,
    y: f32
};

struct Edge {
    start: u32,
    end: u32
};

fn distance(a: vec2<f32>, b:vec2<f32>) -> f32 {
    let dx: f32 = a.x - b.x;
    let dy: f32 = a.y - b.y;
    return sqrt(dx * dx + dy * dy) * ${DISTANCE_SCALE_FACTOR};
}

fn distance4(ax: f32, ay: f32, bx: f32, by: f32) -> f32 {
    let dx: f32 = ax - bx;
    let dy: f32 = ay - by;
    return sqrt(dx * dx + dy * dy) * ${DISTANCE_SCALE_FACTOR};
}

@group(0) @binding(0) var<uniform> numVertices: u32;
@group(0) @binding(1) var<uniform> numEdges: u32;
@group(0) @binding(2) var<storage, read> vertices: array<vec2<f32>>;
@group(0) @binding(3) var<storage, read> edges: array<u32>;
@group(0) @binding(4) var<storage, read_write> adjacencyMatrix: array<f32>;

const WORK_GROUP_SIZE = 64u;
@compute @workgroup_size(WORK_GROUP_SIZE)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let edgeIndex: u32 = global_id.x;
    let edgeItems: u32 = max(1u, numEdges / WORK_GROUP_SIZE);
    let startEdgeIndex: u32 = edgeIndex * edgeItems; // このワークアイテムが処理を開始するインデックス
    let endEdgeIndex: u32 = min((edgeIndex + 1u) * edgeItems, numEdges); // このワークアイテムが処理を終了するインデックス

    for (var edgeIndex: u32 = startEdgeIndex; edgeIndex < endEdgeIndex; edgeIndex++) {
      //let edge = edges[edgeIndex * 2];
      //let startVertexIndex: u32 = edge.x;
      //let endVertexIndex: u32 = edge.y;
      //let edge = edges[edgeIndex * 2];
      let startVertexIndex: u32 = edges[edgeIndex * 2];
      let endVertexIndex: u32 = edges[edgeIndex * 2 + 1];
      
      let dx = vertices[startVertexIndex][0] - vertices[endVertexIndex][0];
      let dy = vertices[startVertexIndex][1] - vertices[endVertexIndex][1];
      let distance: f32 = sqrt(dx * dx + dy * dy) * ${DISTANCE_SCALE_FACTOR};
      
      let matrixIndex1: u32 = (startVertexIndex * numVertices) + endVertexIndex;
      let matrixIndex2: u32 = (endVertexIndex * numVertices) + startVertexIndex;

      adjacencyMatrix[matrixIndex1] = distance;
      adjacencyMatrix[matrixIndex2] = distance;

/*
      adjacencyMatrix[edgeIndex*4+0u] = f32(startVertexIndex); 
      adjacencyMatrix[edgeIndex*4+1u] = f32(endVertexIndex);
      adjacencyMatrix[edgeIndex*4+2u] = f32(startVertexIndex * numVertices + endVertexIndex);
      adjacencyMatrix[edgeIndex*4+3u] = f32(endVertexIndex * numVertices + startVertexIndex);
      */
      //adjacencyMatrix[edgeIndex*4+3u] = distance;
    }
}
`;

const createDistanceAndPredecessorMatrixComputeShaderCode = () => `
@group(0) @binding(0) var<uniform> numVertices: u32;
@group(0) @binding(4) var<storage, read_write> adjacencyMatrix: array<f32>;
@group(0) @binding(5) var<storage, read_write> distanceMatrix: array<f32>;
@group(0) @binding(6) var<storage, read_write> predecessorMatrix: array<i32>;

const WORKGROUP_SIZE = 64u;

@compute @workgroup_size(WORKGROUP_SIZE)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let numElements = numVertices * numVertices;
    let numElementsPerThread: u32 = (numElements + WORKGROUP_SIZE - 1u) / WORKGROUP_SIZE;
    let startIndex: u32 = global_id.x * numElementsPerThread;
    let endIndex: u32 = min(startIndex + numElementsPerThread, numElements);

    // 初期化と境界ブロックの処理
    for (var index: u32 = startIndex; index < endIndex; index++) {
        let i = index / numVertices;
        let j = index % numVertices;

        // distanceMatrixとpredecessorMatrixの初期化
        if (i < numVertices && j < numVertices) {
            distanceMatrix[index] = adjacencyMatrix[index];
            predecessorMatrix[index] = i32(j);
        }
    }

    // Floyd-Warshallアルゴリズムの本体
    for (var k: u32 = 0; k < numVertices; k++) {
        workgroupBarrier(); // 同期ポイント

        for (var index: u32 = startIndex; index < endIndex; index++) {
            let i = index / numVertices;
            let j = index % numVertices;

            if (i < numVertices && j < numVertices) {
                let ik = i * numVertices + k;
                let kj = k * numVertices + j;
                let newDist = distanceMatrix[ik] + distanceMatrix[kj];

                if (newDist < distanceMatrix[index]) {
                    distanceMatrix[index] = newDist;
                    predecessorMatrix[index] = predecessorMatrix[ik];
                }
            }
        }
    }
}`;

const findMaxValueComputeShaderCode = () => `
@group(0) @binding(0) var<uniform> numVertices: u32;
@group(0) @binding(5) var<storage, read_write> distanceMatrix: array<f32>;
@group(0) @binding(7) var<storage, read_write> maxValueBuffer : array<f32>;

const WORKGROUP_SIZE = 1u;

@compute @workgroup_size(WORKGROUP_SIZE)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>, @builtin(local_invocation_id) local_id : vec3<u32>) {

    var max_value: f32 = -1e10;

    // 配列の各要素を処理
    for (var i: u32 = 0; i < arrayLength(&distanceMatrix); i = i + 1) {
        let value = distanceMatrix[i];
        if (value != 1e10 && value > max_value) {
            max_value = value;
        }
    }
    // 結果を出力バッファに書き込む
    maxValueBuffer[0] = max_value;
}
`;

const createTransportationCostMatrixComputeShaderCode = () => `
@group(0) @binding(0) var<uniform> numVertices: u32;
@group(0) @binding(5) var<storage, read_write> distanceMatrix: array<f32>;
@group(0) @binding(7) var<storage, read_write> maxValueBuffer: array<f32>;
@group(0) @binding(8) var<storage, read_write> transportationCostBuffer: array<f32>;
@group(0) @binding(9) var<storage, read_write> transportationCostMatrix: array<f32>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {

  let i = global_id.x;
  if(distanceMatrix[i] != f32(1e10)) {
    let normalized = exp(transportationCostBuffer[0] * distanceMatrix[i] / maxValueBuffer[0]);
    transportationCostMatrix[i] = normalized;
  }else{
    transportationCostMatrix[i] = f32(1e10);
  }
}
 `;

const createBindGroupLayout = (device: GPUDevice) =>
  device.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.COMPUTE, // シェーダーステージの指定
        buffer: {
          type: 'uniform',
          minBindingSize: 4, // u32のサイズは2バイト
        },
      },
      {
        binding: 1,
        visibility: GPUShaderStage.COMPUTE, // シェーダーステージの指定
        buffer: {
          type: 'uniform',
          minBindingSize: 4, // u32のサイズは4バイト
        },
      },
      {
        binding: 2,
        visibility: GPUShaderStage.COMPUTE,
        buffer: {
          type: 'read-only-storage',
          hasDynamicOffset: false,
        },
      },
      {
        binding: 3,
        visibility: GPUShaderStage.COMPUTE,
        buffer: {
          type: 'read-only-storage',
          hasDynamicOffset: false,
        },
      },
      {
        binding: 4,
        visibility: GPUShaderStage.COMPUTE,
        buffer: {
          type: 'storage',
        },
      },
      {
        binding: 5,
        visibility: GPUShaderStage.COMPUTE,
        buffer: {
          type: 'storage',
        },
      },
      {
        binding: 6,
        visibility: GPUShaderStage.COMPUTE,
        buffer: {
          type: 'storage',
        },
      },
      {
        binding: 7,
        visibility: GPUShaderStage.COMPUTE,
        buffer: {
          type: 'storage',
        },
      },
      {
        binding: 8, // transportationCostのバインディング番号
        visibility: GPUShaderStage.COMPUTE, // シェーダーステージの指定
        buffer: {
          type: 'storage',
          minBindingSize: 4, // f32のサイズは4バイト
        },
      },
      {
        binding: 9,
        visibility: GPUShaderStage.COMPUTE,
        buffer: {
          type: 'storage',
        },
      },
    ],
  });

type EcoGeoMatricesFactoryProps = {
  vertices: Vertex[];
  edges: Edge[];
  transportationCost: number;
};

type EcoGeoMatricesFactoryResult = {
  adjacencyMatrix: number[][];
  distanceMatrix: number[][];
  predecessorMatrix: number[][];
  transportationCostMatrix: number[][];
};

export const getGPUDevice = async (): Promise<GPUDevice> => {
  const adapter = await navigator.gpu?.requestAdapter();
  if (!adapter) throw new Error('GPU Adapter is not available');
  return await adapter.requestDevice();
};

export const updateGPUResources = (
  {
    device,
    vertexBuffer,
    edgeBuffer,
    transportationCostBuffer,
  }: {
    device: GPUDevice;
    vertexBuffer: GPUBuffer;
    edgeBuffer: GPUBuffer;
    transportationCostBuffer: GPUBuffer;
  },
  vertices: City[],
  edges: Edge[],
  transportationCost: number
) => {
  const verticesMap = new Map<number, number>();
  vertices.forEach((vertex, index) => {
    verticesMap.set(vertex.id, index);
  });

  const vertexDataF32 = new Float32Array(vertices.length * 2);
  const edgeDataU32 = new Uint32Array(edges.length * 2);

  vertexDataF32.set(vertices.flatMap((v) => [v.x, v.y]));

  edgeDataU32.set(
    edges.flatMap((e) => {
      const source = verticesMap.get(e.source);
      const target = verticesMap.get(e.target);
      return [
        source != undefined ? source : -1,
        target != undefined ? target : -1,
      ];
    })
  );
  device.queue.writeBuffer(vertexBuffer, 0, vertexDataF32);
  device.queue.writeBuffer(edgeBuffer, 0, edgeDataU32);

  if (transportationCost != undefined) {
    const logTransportationCost = Math.log(transportationCost);
    device.queue.writeBuffer(
      transportationCostBuffer,
      0,
      new Float32Array([logTransportationCost])
    );
  }
};

export const createGPUResources = async (
  numVertices: number,
  numEdges: number
) => {
  const device = await getGPUDevice();
  const bindGroupLayout = createBindGroupLayout(device);

  const initializeAdjacencyMatrixShaderModule = device.createShaderModule({
    code: initializeAdjacencyMatrixComputeShaderCode(),
  });

  const createAdjacencyMatrixShaderModule = device.createShaderModule({
    code: createAdjacencyMatrixComputeShaderCode(),
  });

  const createDistanceAndPredecessorMatrixShaderModule =
    device.createShaderModule({
      code: createDistanceAndPredecessorMatrixComputeShaderCode(),
    });
  const findMaxValueShaderModule = device.createShaderModule({
    code: findMaxValueComputeShaderCode(),
  });
  const createTransportationCostMatrixShaderModule = device.createShaderModule({
    code: createTransportationCostMatrixComputeShaderCode(),
  });

  const matrixSize = numVertices ** 2 * 4; // u32,f32は4バイト

  const numVerticesBuffer = device.createBuffer({
    size: 4,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(
    numVerticesBuffer,
    0,
    new Uint32Array([numVertices])
  );
  const numEdgesBuffer = device.createBuffer({
    size: 4,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(numEdgesBuffer, 0, new Uint32Array([numEdges]));

  const vertexBuffer = device.createBuffer({
    size: numVertices * 2 * 4,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });
  const edgeBuffer = device.createBuffer({
    size: Math.max(4, numEdges * 2 * 4),
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });

  const adjacencyMatrixBuffer = device.createBuffer({
    size: matrixSize,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
  });

  const distanceMatrixBuffer = device.createBuffer({
    size: matrixSize,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
  });

  const predecessorMatrixBuffer = device.createBuffer({
    size: matrixSize,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
  });

  const maxValueBuffer = device.createBuffer({
    size: 4,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
  });

  const transportationCostBuffer = device.createBuffer({
    size: 4,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });

  const transportationCostMatrixBuffer = device.createBuffer({
    size: matrixSize,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
  });

  const vertexData = new ArrayBuffer(numVertices * 4 * 2);
  const edgeData = new ArrayBuffer(Math.max(4, numEdges * 4 * 2));

  const bindGroup = device.createBindGroup({
    entries: [
      { binding: 0, resource: { buffer: numVerticesBuffer } },
      { binding: 1, resource: { buffer: numEdgesBuffer } },

      { binding: 2, resource: { buffer: vertexBuffer } },
      { binding: 3, resource: { buffer: edgeBuffer } },
      {
        binding: 4,
        resource: { buffer: adjacencyMatrixBuffer },
      },
      {
        binding: 5,
        resource: { buffer: distanceMatrixBuffer },
      },
      {
        binding: 6,
        resource: { buffer: predecessorMatrixBuffer },
      },
      { binding: 7, resource: { buffer: maxValueBuffer } },
      { binding: 8, resource: { buffer: transportationCostBuffer } },
      {
        binding: 9,
        resource: { buffer: transportationCostMatrixBuffer },
      },
    ],
    layout: bindGroupLayout,
  });

  const initializeAdjacencyMatrixPipeline = device.createComputePipeline({
    layout: device.createPipelineLayout({
      bindGroupLayouts: [bindGroupLayout],
    }),
    compute: {
      module: initializeAdjacencyMatrixShaderModule,
      entryPoint: 'main',
    },
  });

  const createAdjacencyMatrixPipeline = device.createComputePipeline({
    layout: device.createPipelineLayout({
      bindGroupLayouts: [bindGroupLayout],
    }),
    compute: {
      module: createAdjacencyMatrixShaderModule,
      entryPoint: 'main',
    },
  });

  const createDistanceAndPredecessorMatrixPipeline =
    device.createComputePipeline({
      layout: device.createPipelineLayout({
        bindGroupLayouts: [bindGroupLayout],
      }),
      compute: {
        module: createDistanceAndPredecessorMatrixShaderModule,
        entryPoint: 'main',
      },
    });

  const findMaxValuePipeline = device.createComputePipeline({
    layout: device.createPipelineLayout({
      bindGroupLayouts: [bindGroupLayout],
    }),
    compute: {
      module: findMaxValueShaderModule,
      entryPoint: 'main',
    },
  });

  const createTransportationCostMatrixPipeline = device.createComputePipeline({
    layout: device.createPipelineLayout({
      bindGroupLayouts: [bindGroupLayout],
    }),
    compute: {
      module: createTransportationCostMatrixShaderModule,
      entryPoint: 'main',
    },
  });

  return {
    device,
    numVertices,
    numEdges,
    matrixSize,

    vertexData,
    edgeData,
    vertexBuffer,
    edgeBuffer,

    bindGroup,

    initializeAdjacencyMatrixShaderModule,
    createAdjacencyMatrixShaderModule,
    createDistanceAndPredecessorMatrixShaderModule,
    findMaxValueShaderModule,
    createTransportationCostMatrixShaderModule,

    adjacencyMatrixBuffer,
    distanceMatrixBuffer,
    predecessorMatrixBuffer,
    maxValueBuffer,
    transportationCostBuffer,
    transportationCostMatrixBuffer,

    initializeAdjacencyMatrixPipeline,
    createAdjacencyMatrixPipeline,
    createDistanceAndPredecessorMatrixPipeline,
    findMaxValuePipeline,
    createTransportationCostMatrixPipeline,
  };
};

type GPUResourcesType = {
  device: GPUDevice;
  numVertices: number;
  numEdges: number;
  matrixSize: number;

  vertexBuffer: GPUBuffer;
  edgeBuffer: GPUBuffer;

  bindGroup: GPUBindGroup;

  initializeAdjacencyMatrixShaderModule: GPUShaderModule;
  createAdjacencyMatrixShaderModule: GPUShaderModule;
  createDistanceAndPredecessorMatrixShaderModule: GPUShaderModule;
  findMaxValueShaderModule: GPUShaderModule;
  createTransportationCostMatrixShaderModule: GPUShaderModule;

  initializeAdjacencyMatrixPipeline: GPUComputePipeline;
  createAdjacencyMatrixPipeline: GPUComputePipeline;
  createDistanceAndPredecessorMatrixPipeline: GPUComputePipeline;
  findMaxValuePipeline: GPUComputePipeline;
  createTransportationCostMatrixPipeline: GPUComputePipeline;

  adjacencyMatrixBuffer: GPUBuffer;
  distanceMatrixBuffer: GPUBuffer;
  predecessorMatrixBuffer: GPUBuffer;
  maxValueBuffer: GPUBuffer;
  transportationCostBuffer: GPUBuffer;
  transportationCostMatrixBuffer: GPUBuffer;
};

const createCommandEncoder = (
  device: GPUDevice,
  bindGroupIndex: number,
  bindGroup: GPUBindGroup,
  computePipeline: GPUComputePipeline,
  workgroupCountX: number,
  workgroupCountY?: number,
  workgroupCountZ?: number
) => {
  const commandEncoder = device.createCommandEncoder();
  const passEncoder = commandEncoder.beginComputePass();
  passEncoder.setPipeline(computePipeline);
  passEncoder.setBindGroup(bindGroupIndex, bindGroup);
  passEncoder.dispatchWorkgroups(
    workgroupCountX,
    workgroupCountY,
    workgroupCountZ
  );
  passEncoder.end();
  return commandEncoder;
};

// -------------------------------------------- //
export const prepareAdjacencyMatrix = (
  resources: GPUResourcesType
): {
  adjacencyMatrixReadBuffer: GPUBuffer;
  gpuCommandBuffers: GPUCommandBuffer[];
} => {
  const commandEncoders = [
    createCommandEncoder(
      resources.device,
      0,
      resources.bindGroup,
      resources.initializeAdjacencyMatrixPipeline,
      Math.ceil(resources.matrixSize / 64)
    ),
    createCommandEncoder(
      resources.device,
      0,
      resources.bindGroup,
      resources.createAdjacencyMatrixPipeline,
      Math.max(1, Math.ceil(resources.numEdges / 64))
    ),
  ];

  const adjacencyMatrixReadBuffer = resources.device.createBuffer({
    size: resources.matrixSize, // 読み取りたいバッファのサイズ
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ, // マッピングとコピーのための使用設定
  });

  // データをコピーするための読み取り用のバッファを作成
  commandEncoders[1].copyBufferToBuffer(
    resources.adjacencyMatrixBuffer, // 読み取りたいバッファ
    0,
    adjacencyMatrixReadBuffer, // データをコピーする読み取り用バッファ
    0,
    resources.matrixSize // コピーするデータのサイズ
  );

  return {
    adjacencyMatrixReadBuffer,
    gpuCommandBuffers: commandEncoders.map((encoder) => encoder.finish()),
  };
};

export const readAdjacencyMatrix = async (
  adjacencyMatrixReadBuffer: GPUBuffer,
  numVertices: number
): Promise<number[][]> => {
  await adjacencyMatrixReadBuffer.mapAsync(GPUMapMode.READ);
  const adjacencyArray = new Float32Array(
    adjacencyMatrixReadBuffer.getMappedRange()
  );
  // 距離行列を2次元配列に変換
  const adjacencyMatrix: number[][] = create2DArray(
    numVertices,
    (i: number, j: number) => adjacencyArray[i * numVertices + j]
  );
  adjacencyMatrixReadBuffer.unmap();
  return adjacencyMatrix;
};

export const calculateAdjacencyMatrix = async (
  resources: GPUResourcesType
): Promise<number[][]> => {
  const { adjacencyMatrixReadBuffer, gpuCommandBuffers } =
    await prepareAdjacencyMatrix(resources);
  resources.device.queue.submit(gpuCommandBuffers);
  return readAdjacencyMatrix(adjacencyMatrixReadBuffer, resources.numVertices);
};

// -------------------------------------- //

export const prepareDistanceAndPredecessorMatrix = (
  resources: GPUResourcesType
): {
  distanceMatrixReadBuffer: GPUBuffer;
  predecessorMatrixReadBuffer: GPUBuffer;
  gpuCommandBuffer: GPUCommandBuffer;
} => {
  const commandEncoder = createCommandEncoder(
    resources.device,
    0,
    resources.bindGroup,
    resources.createDistanceAndPredecessorMatrixPipeline,
    Math.ceil(resources.numVertices / 64)
  );

  const distanceMatrixReadBuffer = resources.device.createBuffer({
    size: resources.matrixSize,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
  });

  const predecessorMatrixReadBuffer = resources.device.createBuffer({
    size: resources.matrixSize,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
  });

  commandEncoder.copyBufferToBuffer(
    resources.distanceMatrixBuffer, // ここを書き換え
    0,
    distanceMatrixReadBuffer, // ここを書き換え
    0,
    resources.matrixSize // ここを書き換え
  );
  commandEncoder.copyBufferToBuffer(
    resources.predecessorMatrixBuffer, // ここを書き換え
    0,
    predecessorMatrixReadBuffer, // ここを書き換え
    0,
    resources.matrixSize // ここを書き換え
  );

  const gpuCommandBuffer = commandEncoder.finish();

  return {
    distanceMatrixReadBuffer,
    predecessorMatrixReadBuffer,
    gpuCommandBuffer,
  };
};

export const readDistanceMatrix = async (
  distanceMatrixReadBuffer: GPUBuffer,
  numVertices: number
): Promise<number[][]> => {
  await distanceMatrixReadBuffer.mapAsync(GPUMapMode.READ);
  const distanceArray = new Float32Array(
    distanceMatrixReadBuffer.getMappedRange()
  );
  // 距離行列を2次元配列に変換
  const distanceMatrix: number[][] = create2DArray(
    numVertices,
    (i: number, j: number) => distanceArray[i * numVertices + j]
  );
  distanceMatrixReadBuffer.unmap();
  return distanceMatrix;
};

export const readPredecessorMatrix = async (
  predecessorMatrixReadBuffer: GPUBuffer,
  numVertices: number
): Promise<number[][]> => {
  await predecessorMatrixReadBuffer.mapAsync(GPUMapMode.READ);
  const predecessorArray = new Int32Array(
    predecessorMatrixReadBuffer.getMappedRange()
  );
  // 距離行列を2次元配列に変換
  const predecessorMatrix: number[][] = create2DArray(
    numVertices,
    (i: number, j: number) => predecessorArray[i * numVertices + j]
  );
  predecessorMatrixReadBuffer.unmap();
  return predecessorMatrix;
};

export const calculateDistanceMatrix = (resources: GPUResourcesType) => {
  const {
    distanceMatrixReadBuffer,
    predecessorMatrixReadBuffer,
    gpuCommandBuffer,
  } = prepareDistanceAndPredecessorMatrix(resources);
  resources.device.queue.submit([gpuCommandBuffer]);
  return {
    distanceMatrix: readDistanceMatrix(
      distanceMatrixReadBuffer,
      resources.numVertices
    ),
    predecessorMatrix: readPredecessorMatrix(
      predecessorMatrixReadBuffer,
      resources.numVertices
    ),
  };
};

// -------------------------------------- //

export const prepareFindMaxValue = (
  resources: GPUResourcesType
): {
  maxValueReadBuffer: GPUBuffer;
  gpuCommandBuffer: GPUCommandBuffer;
} => {
  const commandEncoder = createCommandEncoder(
    resources.device,
    0,
    resources.bindGroup,
    resources.findMaxValuePipeline,
    1
  );

  // データをコピーするための読み取り用のバッファを作成
  const maxValueReadBuffer = resources.device.createBuffer({
    size: 4, // 読み取りたいバッファのサイズ
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ, // マッピングとコピーのための使用設定
  });

  commandEncoder.copyBufferToBuffer(
    resources.maxValueBuffer, // 読み取りたいバッファ
    0,
    maxValueReadBuffer, // データをコピーする読み取り用バッファ
    0,
    4 // コピーするデータのサイズ
  );

  const gpuCommandBuffer = commandEncoder.finish();

  return {
    maxValueReadBuffer,
    gpuCommandBuffer,
  };
};

export const readMaxValue = async (
  maxValueReadBuffer: GPUBuffer
): Promise<number> => {
  await maxValueReadBuffer.mapAsync(GPUMapMode.READ);
  const maxValueArray = new Float32Array(maxValueReadBuffer.getMappedRange());
  const maxValue = maxValueArray[0];
  maxValueReadBuffer.unmap();
  return maxValue;
};

export const findMaxValue = (resources: GPUResourcesType): Promise<number> => {
  const { maxValueReadBuffer, gpuCommandBuffer } =
    prepareFindMaxValue(resources);
  resources.device.queue.submit([gpuCommandBuffer]);
  return readMaxValue(maxValueReadBuffer);
};

// -------------------------------------- //

export const prepareTransportationCostMatrix = (
  resources: GPUResourcesType
): {
  transportationCostMatrixReadBuffer: GPUBuffer;
  gpuCommandBuffer: GPUCommandBuffer;
} => {
  const commandEncoder = createCommandEncoder(
    resources.device,
    0,
    resources.bindGroup,
    resources.createTransportationCostMatrixPipeline,
    Math.ceil((resources.numVertices * resources.numVertices) / 64)
  );

  // データをコピーするための読み取り用のバッファを作成
  const transportationCostMatrixReadBuffer = resources.device.createBuffer({
    size: resources.matrixSize, // 読み取りたいバッファのサイズ
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ, // マッピングとコピーのための使用設定
  });

  commandEncoder.copyBufferToBuffer(
    resources.transportationCostMatrixBuffer, // 読み取りたいバッファ
    0,
    transportationCostMatrixReadBuffer, // データをコピーする読み取り用バッファ
    0,
    resources.matrixSize // コピーするデータのサイズ
  );

  const gpuCommandBuffer = commandEncoder.finish();

  return {
    transportationCostMatrixReadBuffer,
    gpuCommandBuffer,
  };
};

export const readTransportationCostMatrix = async (
  transportationCostMatrixReadBuffer: GPUBuffer,
  numVertices: number
): Promise<number[][]> => {
  await transportationCostMatrixReadBuffer.mapAsync(GPUMapMode.READ);
  const transportationCostMatrixArray = new Float32Array(
    transportationCostMatrixReadBuffer.getMappedRange()
  );
  // 距離行列を2次元配列に変換
  const transportationCostMatrix: number[][] = create2DArray(
    numVertices,
    (i: number, j: number) => transportationCostMatrixArray[i * numVertices + j]
  );
  transportationCostMatrixReadBuffer.unmap();
  return transportationCostMatrix;
};

export const calculateTransportationCostMatrix = (
  resources: GPUResourcesType
): Promise<number[][]> => {
  const { transportationCostMatrixReadBuffer, gpuCommandBuffer } =
    prepareTransportationCostMatrix(resources);

  resources.device.queue.submit([gpuCommandBuffer]);

  return readTransportationCostMatrix(
    transportationCostMatrixReadBuffer,
    resources.numVertices
  );
};

export class GPUMatrixEngine extends AbstractMatrixEngine {
  resources?: GPUResourcesType;

  constructor(numLocations: number, numEdges: number) {
    super(numLocations, numEdges);
  }

  async update(locations: City[], edges: Edge[], transportationCost: number) {
    if (
      !this.resources ||
      this.resources.numVertices != locations.length ||
      this.resources.numEdges != edges.length
    ) {
      this.resources = await createGPUResources(locations.length, edges.length);
    }
    updateGPUResources(this.resources, locations, edges, transportationCost);
    return this.resources;
  }

  async createAdjacencyMatrix(
    locations: City[],
    edges: Edge[],
    transportationCost: number
  ) {
    const resources = await this.update(locations, edges, transportationCost);

    const {
      gpuCommandBuffers: adjacencyCommands,
      adjacencyMatrixReadBuffer: adjacencyMatrixReadBuffer,
    } = prepareAdjacencyMatrix(resources);

    resources.device.queue.submit(adjacencyCommands);

    const adjacencyMatrix = await readAdjacencyMatrix(
      adjacencyMatrixReadBuffer,
      resources.numVertices
    );

    return (this.adjacencyMatrix = adjacencyMatrix);
  }

  async createDistanceAndPredecessorMatrix(
    locations: City[],
    edges: Edge[],
    transportationCost: number
  ): Promise<[number[][], number[][]]> {
    const resources = await this.update(locations, edges, transportationCost);

    updateGPUResources(resources, locations, edges, transportationCost);

    const {
      adjacencyMatrixReadBuffer: adjacencyMatrixReadBuffer,
      gpuCommandBuffers: adjacencyCommands,
    } = prepareAdjacencyMatrix(resources);

    const {
      distanceMatrixReadBuffer,
      predecessorMatrixReadBuffer,
      gpuCommandBuffer: distanceMatrixAndPredecessorMatrixCommands,
    } = prepareDistanceAndPredecessorMatrix(resources);

    resources.device.queue.submit(
      adjacencyCommands.concat(distanceMatrixAndPredecessorMatrixCommands)
    );

    const adjacencyMatrix = await readAdjacencyMatrix(
      adjacencyMatrixReadBuffer,
      resources.numVertices
    );
    const distanceMatrix = await readDistanceMatrix(
      distanceMatrixReadBuffer,
      resources.numVertices
    );
    const predecessorMatrix = await readPredecessorMatrix(
      predecessorMatrixReadBuffer,
      resources.numVertices
    );

    this.adjacencyMatrix = adjacencyMatrix;
    this.distanceMatrix = distanceMatrix;
    this.predecessorMatrix = predecessorMatrix;

    return Promise.resolve([distanceMatrix, predecessorMatrix]);
  }

  async createTransportationCostMatrix(
    locations: City[],
    edges: Edge[],
    transportationCost: number
  ) {
    const resources = await this.update(locations, edges, transportationCost);

    const {
      adjacencyMatrixReadBuffer: adjacencyMatrixReadBuffer,
      gpuCommandBuffers: adjacencyCommands,
    } = prepareAdjacencyMatrix(resources);

    const {
      distanceMatrixReadBuffer,
      predecessorMatrixReadBuffer,
      gpuCommandBuffer: distanceMatrixAndPredecessorMatrixCommands,
    } = prepareDistanceAndPredecessorMatrix(resources);

    const { maxValueReadBuffer, gpuCommandBuffer: maxValueCommands } =
      prepareFindMaxValue(resources);

    const {
      transportationCostMatrixReadBuffer,
      gpuCommandBuffer: transportationCostCommands,
    } = prepareTransportationCostMatrix(resources);

    resources.device.queue.submit(
      adjacencyCommands
        .concat(distanceMatrixAndPredecessorMatrixCommands)
        .concat([maxValueCommands, transportationCostCommands])
    );

    const adjacencyMatrix = await readAdjacencyMatrix(
      adjacencyMatrixReadBuffer,
      resources.numVertices
    );
    const distanceMatrix = await readDistanceMatrix(
      distanceMatrixReadBuffer,
      resources.numVertices
    );
    const predecessorMatrix = await readPredecessorMatrix(
      predecessorMatrixReadBuffer,
      resources.numVertices
    );
    const transportationCostMatrix = await readTransportationCostMatrix(
      transportationCostMatrixReadBuffer,
      resources.numVertices
    );

    this.adjacencyMatrix = adjacencyMatrix;
    this.distanceMatrix = distanceMatrix;
    this.predecessorMatrix = predecessorMatrix;
    this.transportationCostMatrix = transportationCostMatrix;

    return Promise.resolve(transportationCostMatrix);
  }
}
