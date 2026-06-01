import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { attorneyRole } from "@/lib/attorney-auth";

export const runtime = "nodejs";

// Shared admin<->attorney secure channel. The role cookie decides which side
// you are; you read the other side's messages and send as yourself.

// GET: full thread (oldest first) + mark the other side's messages as read.
export async function GET() {
  const role = attorneyRole();
  if (!role) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.directMessage.updateMany({
    where: { sender: { not: role }, readAt: null },
    data: { readAt: new Date() },
  });

  const messages = await prisma.directMessage.findMany({
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({
    me: role,
    messages: messages.map((m) => ({
      id: m.id,
      sender: m.sender,
      body: m.body,
      createdAt: m.createdAt,
      mine: m.sender === role,
    })),
  });
}

// POST { body }: send a message as the current role.
export async function POST(req: Request) {
  const role = attorneyRole();
  if (!role) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { body } = await req.json();
    const text = String(body || "").trim();
    if (!text) return NextResponse.json({ error: "Empty message" }, { status: 400 });
    if (text.length > 5000) return NextResponse.json({ error: "Message too long" }, { status: 400 });
    const msg = await prisma.directMessage.create({ data: { sender: role, body: text } });
    return NextResponse.json({ success: true, id: msg.id });
  } catch {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
