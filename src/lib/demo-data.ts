import type { VoiceThread } from "./types";

export const voiceThreads: VoiceThread[] = [
  {
    id: "thread-voice-001",
    conversationId: "C2C_customer_maya_founder_alex",
    customer: "Maya Chen",
    company: "Northstar Clinics",
    status: "handoff",
    intent: "Book a post-surgery follow-up and ask about billing",
    priority: "high",
    lastHeard: "2 min ago",
    transcript:
      "Hi, I am calling because my discharge note said I need a follow-up within seven days. I also received a bill that looks higher than expected. Can someone help me book the visit and explain the billing code?",
    summary:
      "Maya needs a follow-up appointment within 7 days and wants a human explanation for a billing discrepancy.",
    nextAction: "Human agent should confirm available appointment windows and review billing code 99214.",
    agentSteps: [
      {
        id: "step-1",
        label: "Transcribed caller intent",
        status: "done",
        detail: "Detected appointment scheduling + billing clarification.",
      },
      {
        id: "step-2",
        label: "Created persistent chat thread",
        status: "done",
        detail: "Mapped voice call into Tencent RTC Chat SDK conversation C2C_customer_maya_founder_alex.",
      },
      {
        id: "step-3",
        label: "Requested human handoff",
        status: "running",
        detail: "Billing questions should stay in the same conversation thread for auditability.",
      },
    ],
    messages: [
      {
        id: "msg-1",
        author: "customer",
        name: "Maya Chen",
        time: "09:42",
        body: "I need the follow-up this week and I am confused by the billing code.",
      },
      {
        id: "msg-2",
        author: "voice-agent",
        name: "Voice Agent",
        time: "09:43",
        body: "I found two tasks: schedule a follow-up within 7 days, and ask a human agent to review billing code 99214.",
      },
      {
        id: "msg-3",
        author: "system",
        name: "Tencent RTC Chat SDK",
        time: "09:43",
        body: "Voice call converted into a durable conversation with unread state, message history, and handoff context.",
      },
    ],
  },
  {
    id: "thread-voice-002",
    conversationId: "GROUP_shopify_ops_voice_returns",
    customer: "Leo Park",
    company: "Copper & Pine",
    status: "active",
    intent: "Return a damaged order",
    priority: "medium",
    lastHeard: "14 min ago",
    transcript:
      "The ceramic lamp arrived cracked. I want a replacement, not a refund, and I can send photos if needed.",
    summary:
      "Customer reports damaged item and prefers replacement. Agent should collect photo proof and order number.",
    nextAction: "Ask for order number and photo, then route to operations.",
    agentSteps: [
      {
        id: "step-1",
        label: "Detected commerce return",
        status: "done",
        detail: "Intent: damaged item replacement.",
      },
      {
        id: "step-2",
        label: "Prepared media request",
        status: "running",
        detail: "Tencent RTC Chat SDK supports continuing the thread with images and follow-up messages.",
      },
      {
        id: "step-3",
        label: "Route to ops",
        status: "queued",
        detail: "Waiting for order number.",
      },
    ],
    messages: [
      {
        id: "msg-1",
        author: "customer",
        name: "Leo Park",
        time: "09:27",
        body: "The lamp arrived cracked. I can send pictures.",
      },
      {
        id: "msg-2",
        author: "voice-agent",
        name: "Voice Agent",
        time: "09:28",
        body: "Please send your order number and a photo of the damage. I will keep this open for the operations team.",
      },
    ],
  },
  {
    id: "thread-voice-003",
    conversationId: "C2C_sam_builder_success",
    customer: "Sam Rivera",
    company: "Launchpad AI",
    status: "resolved",
    intent: "Ask whether the setup needs OpenAI",
    priority: "low",
    lastHeard: "1 hr ago",
    transcript:
      "Do I need OpenAI specifically for the voice agent, or can I use another OpenAI-compatible model provider?",
    summary:
      "Developer asks whether the AI backend is provider-specific.",
    nextAction: "Resolved. AI provider is optional and can be OpenAI-compatible.",
    agentSteps: [
      {
        id: "step-1",
        label: "Answered provider question",
        status: "done",
        detail: "AI provider can be OpenAI-compatible; Tencent RTC Chat SDK handles messaging.",
      },
      {
        id: "step-2",
        label: "Saved setup note",
        status: "done",
        detail: "Conversation remains searchable later.",
      },
    ],
    messages: [
      {
        id: "msg-1",
        author: "customer",
        name: "Sam Rivera",
        time: "08:46",
        body: "Can I use another LLM provider?",
      },
      {
        id: "msg-2",
        author: "voice-agent",
        name: "Voice Agent",
        time: "08:46",
        body: "Yes. The AI provider is optional. Use any OpenAI-compatible endpoint, or keep the deterministic demo agent.",
      },
    ],
  },
];
