import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { readDocument } from "@/lib/pdf";
import { attorneyRole } from "@/lib/attorney-auth";

export const runtime = "nodejs";

// Attorney-only PDF stream, scoped to the current login: the requested file
// must belong to a Document on a case owned by this role.
export async function GET(
  _req: Request,
  { params }: { params: { filename: string } }
) {
  const role = attorneyRole();
  if (!role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!params.filename.toLowerCase().endsWith(".pdf")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const doc = await prisma.document.findFirst({
    where: { storageUrl: { endsWith: `/${params.filename}` } },
    include: { case: { select: { ownerRole: true } } },
  });
  if (!doc || doc.case.ownerRole !== role) {
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
