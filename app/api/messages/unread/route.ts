import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { attorneyRole } from "@/lib/attorney-auth";

export const runtime = "nodejs";

// Unread count for the current login (messages from the other side, not yet
// read) — drives the sidebar badge.
export async function GET() {
  const role = attorneyRole();
  if (!role) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const count = await prisma.directMessage.count({
    where: { sender: { not: role }, readAt: null },
  });
  return NextResponse.json({ unread: count });
}
