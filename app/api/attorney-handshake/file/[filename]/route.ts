import { NextResponse } from "next/server";
import { readDocument } from "@/lib/pdf";
import { isAttorneyUnlocked } from "@/lib/attorney-auth";

export const runtime = "nodejs";

// Attorney-only: stream a generated PDF from storage. The filename is produced
// by saveDocument (e.g. lod-part1-TR-KW-005.pdf); basename() in readDocument
// prevents path traversal.
export async function GET(
  _req: Request,
  { params }: { params: { filename: string } }
) {
  if (!isAttorneyUnlocked()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!params.filename.toLowerCase().endsWith(".pdf")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  try {
    const bytes = await readDocument(params.filename);
    return new NextResponse(Buffer.from(bytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${params.filename}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }
}
