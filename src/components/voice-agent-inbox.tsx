"use client";

import { Activity, Bot, Headphones, KeyRound, MessageSquareText, PhoneCall, ShieldCheck, Sparkles } from "lucide-react";
import { useState, useTransition } from "react";
import { clsx } from "clsx";
import { voiceThreads } from "@/lib/demo-data";
import { initTencentRtcChat } from "@/lib/tencent-rtc-chat";
import type { AgentReply, InboxMessage, VoiceThread } from "@/lib/types";

const userId = process.env.NEXT_PUBLIC_DEMO_USER_ID || "founder_alex";
const chatMode = process.env.NEXT_PUBLIC_CHAT_MODE || "mock";
const sdkAppId = Number(process.env.NEXT_PUBLIC_TENCENT_SDK_APP_ID || 0);

function StatusPill({ status }: { status: VoiceThread["status"] }) {
  return (
    <span className={clsx("status-pill", `status-${status}`)}>
      {status === "handoff" ? "Human handoff" : status}
    </span>
  );
}

function buildMessage(reply: AgentReply): InboxMessage {
  return {
    id: `msg-${Date.now()}`,
    author: reply.status === "handoff" ? "human-agent" : "voice-agent",
    name: reply.status === "handoff" ? "Handoff Queue" : "Voice Agent",
    time: new Intl.DateTimeFormat("en", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date()),
    body: `${reply.body} Next action: ${reply.nextAction}`,
  };
}

export function VoiceAgentInbox() {
  const [threads, setThreads] = useState(voiceThreads);
  const [selectedId, setSelectedId] = useState(voiceThreads[0].id);
  const [composer, setComposer] = useState("Can you turn this voice call into a clear handoff note?");
  const [sdkState, setSdkState] = useState(
    chatMode === "tencent" ? "Tencent mode ready to connect" : "Mock mode: runs without credentials",
  );
  const [isPending, startTransition] = useTransition();

  const selected = threads.find((thread) => thread.id === selectedId) || threads[0];

  async function connectTencentChat() {
    if (chatMode !== "tencent") {
      setSdkState("Switch NEXT_PUBLIC_CHAT_MODE=tencent and add credentials to connect.");
      return;
    }

    if (!sdkAppId) {
      setSdkState("Missing NEXT_PUBLIC_TENCENT_SDK_APP_ID.");
      return;
    }

    setSdkState("Requesting backend-issued UserSig...");
    const response = await fetch("/api/usersig", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const payload = await response.json();

    if (!response.ok) {
      setSdkState(payload.error || "Could not issue UserSig.");
      return;
    }

    setSdkState("Logging in to Tencent RTC Chat SDK...");
    await initTencentRtcChat({
      sdkAppId: payload.sdkAppId,
      userId: payload.userId,
      userSig: payload.userSig,
    });
    setSdkState(`Connected as ${payload.userId}. Conversation can now sync through Tencent RTC Chat SDK.`);
  }

  function sendToAgent() {
    const transcript = composer.trim();
    if (!transcript) return;

    startTransition(async () => {
      const response = await fetch("/api/voice-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: selected.customer,
          transcript,
        }),
      });
      const reply = (await response.json()) as AgentReply;
      const message = buildMessage(reply);

      setThreads((current) =>
        current.map((thread) =>
          thread.id === selected.id
            ? {
                ...thread,
                status: reply.status,
                nextAction: reply.nextAction,
                messages: [...thread.messages, message],
              }
            : thread,
        ),
      );
      setComposer("");
    });
  }

  return (
    <main className="shell">
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <Sparkles size={16} />
            Voice agent inbox built with Tencent RTC Chat SDK
          </div>
          <h1>Turn voice agent calls into persistent chat threads.</h1>
          <p>
            This starter shows how a voice AI call becomes a durable inbox with transcript,
            agent summary, unread follow-up, and human handoff instead of disappearing when the call ends.
          </p>
          <div className="hero-actions">
            <button onClick={connectTencentChat} className="primary-action">
              <ShieldCheck size={18} />
              Connect Tencent RTC Chat SDK
            </button>
            <a href="https://console.trtc.io" target="_blank" rel="noreferrer" className="secondary-action">
              <KeyRound size={18} />
              Get SDKAppID
            </a>
          </div>
        </div>
        <div className="signal-card">
          <div className="signal-orbit" />
          <PhoneCall size={30} />
          <h2>Why this needs Chat SDK</h2>
          <p>
            Voice AI can answer a call. Tencent RTC Chat SDK keeps the work alive after the call:
            messages, history, roles, unread state, media, and handoff in one conversation.
          </p>
          <span>{sdkState}</span>
        </div>
      </section>

      <section className="metrics">
        <div>
          <strong>3</strong>
          <span>voice threads</span>
        </div>
        <div>
          <strong>2</strong>
          <span>handoff-ready scenarios</span>
        </div>
        <div>
          <strong>0</strong>
          <span>credentials needed for mock mode</span>
        </div>
      </section>

      <section className="workspace">
        <aside className="thread-list">
          <div className="panel-title">
            <Headphones size={18} />
            Voice Inbox
          </div>
          {threads.map((thread) => (
            <button
              key={thread.id}
              className={clsx("thread-row", selected.id === thread.id && "selected")}
              onClick={() => setSelectedId(thread.id)}
            >
              <div>
                <strong>{thread.customer}</strong>
                <span>{thread.company}</span>
              </div>
              <StatusPill status={thread.status} />
              <p>{thread.intent}</p>
              <small>{thread.lastHeard}</small>
            </button>
          ))}
        </aside>

        <section className="conversation">
          <div className="conversation-head">
            <div>
              <p>{selected.company}</p>
              <h2>{selected.customer}</h2>
            </div>
            <StatusPill status={selected.status} />
          </div>

          <div className="transcript-card">
            <div className="panel-title">
              <Activity size={18} />
              Voice transcript
            </div>
            <p>{selected.transcript}</p>
          </div>

          <div className="summary-grid">
            <div>
              <span>Agent summary</span>
              <p>{selected.summary}</p>
            </div>
            <div>
              <span>Next action</span>
              <p>{selected.nextAction}</p>
            </div>
          </div>

          <div className="message-stack">
            <div className="panel-title">
              <MessageSquareText size={18} />
              Persistent chat thread
            </div>
            {selected.messages.map((message) => (
              <article key={message.id} className={clsx("message", `from-${message.author}`)}>
                <div>
                  <strong>{message.name}</strong>
                  <span>{message.time}</span>
                </div>
                <p>{message.body}</p>
              </article>
            ))}
          </div>

          <div className="composer">
            <textarea
              value={composer}
              onChange={(event) => setComposer(event.target.value)}
              placeholder="Paste a new voice transcript or ask the agent to continue the handoff..."
            />
            <button onClick={sendToAgent} disabled={isPending}>
              <Bot size={18} />
              {isPending ? "Thinking..." : "Ask voice agent"}
            </button>
          </div>
        </section>

        <aside className="agent-panel">
          <div className="panel-title">
            <Bot size={18} />
            Agent workflow
          </div>
          {selected.agentSteps.map((step) => (
            <div key={step.id} className={clsx("step", `step-${step.status}`)}>
              <span />
              <div>
                <strong>{step.label}</strong>
                <p>{step.detail}</p>
              </div>
            </div>
          ))}
          <div className="sdk-box">
            <strong>Tencent RTC Chat SDK owns</strong>
            <p>Conversation ID: {selected.conversationId}</p>
            <p>Secure UserSig route: /api/usersig</p>
            <p>Console: https://console.trtc.io</p>
          </div>
        </aside>
      </section>
    </main>
  );
}
