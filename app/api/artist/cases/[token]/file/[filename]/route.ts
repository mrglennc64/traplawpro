import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { readDocument } from "@/lib/pdf";

export const runtime = "nodejs";

// Token-authorized PDF stream for artists: the signToken proves access, and the
// requested file must belong to a Document on that case (prevents reading
// arbitrary files or another case's docs).
export async function GET(
  _req: Request,
  { params }: { params: { token: string; filename: string } }
) {
  const c = await prisma.attorneyCase.findUnique({
    where: { signToken: params.token },
    include: { documents: true },
  });
  if (!c || !c.artistViewEnabled) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const owns = c.documents.some(
    (d) => (d.storageUrl.split("/").pop() ?? "") === params.filename
  );
  if (!owns || !params.filename.toLowerCase().endsWith(".pdf")) {
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
