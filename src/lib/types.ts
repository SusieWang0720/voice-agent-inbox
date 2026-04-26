export type InboxStatus = "active" | "handoff" | "resolved";

export type AgentStepStatus = "done" | "running" | "queued";

export type AgentStep = {
  id: string;
  label: string;
  status: AgentStepStatus;
  detail: string;
};

export type InboxMessage = {
  id: string;
  author: "customer" | "voice-agent" | "human-agent" | "system";
  name: string;
  time: string;
  body: string;
};

export type VoiceThread = {
  id: string;
  conversationId: string;
  customer: string;
  company: string;
  status: InboxStatus;
  intent: string;
  priority: "low" | "medium" | "high";
  lastHeard: string;
  transcript: string;
  summary: string;
  nextAction: string;
  agentSteps: AgentStep[];
  messages: InboxMessage[];
};

export type AgentReply = {
  body: string;
  nextAction: string;
  status: InboxStatus;
};
