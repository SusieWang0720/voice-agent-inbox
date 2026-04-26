# Voice Agent Inbox

用 **Tencent RTC Chat SDK** 把语音 Agent 通话变成可持续处理的会话线程。

这个项目不是普通的 AI 聊天框，而是一个面向真实业务的 Next.js 全栈 starter：用户先和语音 Agent 通话，Agent 总结意图、生成下一步动作，需要人工处理时把会话交给人类同事，并且所有后续消息都保留在 Tencent RTC Chat SDK 的持久会话里。

本项目面向 **Tencent RTC Chat 免费版** 构建。先看免费版入口：[trtc.io/free-chat-api](https://trtc.io/free-chat-api)，然后到 [TRTC Console](https://console.trtc.io) 获取 `SDKAppID`。

## 这个项目解决什么问题

很多 voice agent demo 到“转写文本”就结束了，但真实产品通常还需要：

- 用户通话后继续用文字补充信息
- Agent 把总结、下一步动作、执行结果发回同一个线程
- 人工客服/医生/销售可以带着完整上下文接手
- 产品需要消息历史、未读状态、图片/文件、角色和群组能力

这正是 Tencent RTC Chat SDK 在这个项目里的价值。

## 具体场景

Maya 做完手术后打电话给诊所。语音 Agent 识别出两个任务：预约 7 天内复诊、解释一笔账单编码。项目会把这次语音通话沉淀成一个可继续处理的 chat thread：

1. 自动保存转写和摘要
2. 生成下一步动作
3. 标记需要人工接手
4. 用户不用重复描述问题，可以直接在同一个会话继续发消息
5. 诊所团队看到完整历史并继续处理

## 快速运行

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。

默认是 mock mode，不需要 Tencent RTC Chat SDK 凭证，也不需要 AI API Key。

## 接入 Tencent RTC Chat SDK

1. 先打开 [Tencent RTC Chat 免费版](https://trtc.io/free-chat-api)
2. 再进入 [TRTC Console](https://console.trtc.io)
3. 创建或选择 Tencent RTC Chat 应用
4. 获取 `SDKAppID`
5. `SDKSecretKey` 只能放在服务端
6. 复制 `.env.example` 为 `.env.local`
7. 填入：

```bash
NEXT_PUBLIC_CHAT_MODE=tencent
NEXT_PUBLIC_TENCENT_SDK_APP_ID=your_sdk_app_id
TENCENT_SDK_SECRET_KEY=your_server_only_secret_key
NEXT_PUBLIC_DEMO_USER_ID=founder_alex
```

项目通过 `/api/usersig` 在服务端签发 `UserSig`，不要把 `SDKSecretKey` 放到前端。

## AI API 是否必须

不必须。

如果不配置 `AI_API_KEY`，项目会使用内置 deterministic demo agent，方便开发者立即跑通。需要真实模型输出时，可以配置任意 OpenAI-compatible provider：

```bash
AI_API_KEY=your_key
AI_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4o-mini
```

你可以把 OpenAI 换成其他兼容 OpenAI API 格式的大模型服务。
