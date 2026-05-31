import { promises as fs } from "fs";
import path from "path";

/**
 * Local-disk document storage. Writes bytes under a storage directory and
 * returns a reference to the saved file. This is the SINGLE swap point for the
 * planned MinIO/S3 migration on the backend VPS — replace the body of
 * saveDocument (and readDocument) with a MinIO putObject / presigned-URL flow
 * without touching the flow logic or PDF renderers.
 */
export interface SavedDocument {
  storageUrl: string;
  filePath: string;
}

function storageDir(): string {
  return process.env.DOCUMENT_STORAGE_DIR
    ? path.resolve(process.env.DOCUMENT_STORAGE_DIR)
    : path.join(process.cwd(), "storage");
}

export async function saveDocument(
  filename: string,
  bytes: Uint8Array
): Promise<SavedDocument> {
  const dir = storageDir();
  await fs.mkdir(dir, { recursive: true });
  const filePath = path.join(dir, filename);
  await fs.writeFile(filePath, bytes);

  return {
    // Served through the gated /api/attorney-handshake/file route, not statically.
    storageUrl: `/api/attorney-handshake/file/${filename}`,
    filePath,
  };
}

/** Read a previously saved document back from storage (used by the file route). */
export async function readDocument(filename: string): Promise<Uint8Array> {
  const filePath = path.join(storageDir(), path.basename(filename));
  return fs.readFile(filePath);
}
