export async function readAllChunks(
  reader: ReadableStreamDefaultReader<Uint8Array>,
): Promise<ArrayBuffer> {
  const chunks: Uint8Array[] = [];
  let totalLength = 0;

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    chunks.push(value);
    totalLength += value.length;
  }

  const fullArray = new Uint8Array(totalLength);
  let position = 0;
  for (const chunk of chunks) {
    fullArray.set(chunk, position);
    position += chunk.length;
  }

  return fullArray.buffer;
}
