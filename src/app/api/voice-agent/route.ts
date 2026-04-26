import OpenAI from "openai";
import { NextResponse } from "next/server";
import type { AgentReply, InboxStatus } from "@/lib/types";

type VoiceAgentRequest = {
  transcript?: string;
  customer?: string;
};

function fallbackReply(transcript: string): AgentReply {
  const needsHuman =
    /billing|refund|doctor|appointment|invoice|human|agent|urgent/i.test(transcript);

  return {
    status: needsHuman ? "handoff" : "active",
    nextAction: needsHuman
      ? "Keep the thread open and route it to a human teammate with the call summary attached."
      : "Ask one precise follow-up question and continue collecting context in the same thread.",
    body: needsHuman
      ? "I summarized the voice call, preserved the transcript, and marked this conversation for human handoff. The user can continue in the same chat thread without repeating the story."
      : "I captured the request and added a follow-up prompt to the thread. The next message should ask for the missing detail before the task moves forward.",
  };
}

export async function POST(request: Request) {
  const { transcript = "", customer = "the caller" }: VoiceAgentRequest =
    await request.json().catch(() => ({}));

  if (!transcript.trim()) {
    return NextResponse.json({ error: "Missing transcript" }, { status: 400 });
  }

  const apiKey = process.env.AI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(fallbackReply(transcript));
  }

  const client = new OpenAI({
    apiKey,
    baseURL: process.env.AI_BASE_URL || undefined,
  });

  const completion = await client.chat.completions.create({
    model: process.env.AI_MODEL || "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a voice agent inbox assistant. Return compact JSON with body, nextAction, and status. status must be active, handoff, or resolved. The app uses Tencent RTC Chat SDK as the persistent messaging layer after a voice call.",
      },
      {
        role: "user",
        content: `Caller: ${customer}\nTranscript: ${transcript}`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const raw = completion.choices[0]?.message.content || "{}";
  const parsed = JSON.parse(raw) as Partial<AgentReply>;
  const status: InboxStatus =
    parsed.status === "handoff" || parsed.status === "resolved" ? parsed.status : "active";

  return NextResponse.json({
    body: parsed.body || fallbackReply(transcript).body,
    nextAction: parsed.nextAction || fallbackReply(transcript).nextAction,
    status,
  });
}
