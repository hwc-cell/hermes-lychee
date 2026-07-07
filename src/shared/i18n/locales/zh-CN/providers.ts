export default {
  title: "服务商",
  subtitle: "配置大模型服务商、API Key 和凭据池",
  oauth: {
    sectionTitle: "订阅 / OAuth 套餐",
    sectionHint: "通过服务商订阅登录，无需 API Key。授权将在浏览器中完成。",
    signIn: "登录",
    runningHint: "请按下方步骤完成登录。",
    successHint: "登录成功。现在可以使用该服务商了。",
    failed: "登录失败。",
    codexDesc: "使用 ChatGPT Codex 套餐",
    xaiDesc: "使用 xAI Grok 订阅",
    qwenDesc: "使用 Qwen 订阅",
    geminiDesc: "使用 Google AI Pro / Gemini 套餐",
    minimaxDesc: "使用 MiniMax 订阅",
    nousDesc: "使用 Nous Portal 订阅",
  },
} as const;
