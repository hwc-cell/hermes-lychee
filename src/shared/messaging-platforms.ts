export interface MessagingEnvVarInfo {
  advanced: boolean;
  description: string;
  is_password: boolean;
  is_set: boolean;
  key: string;
  prompt: string;
  redacted_value: string | null;
  required: boolean;
  url: string | null;
}

export interface MessagingHomeChannel {
  chat_id: string;
  name: string;
  platform: string;
  thread_id?: string;
}

export interface MessagingPlatformInfo {
  configured: boolean;
  description: string;
  docs_url: string;
  enabled: boolean;
  env_vars: MessagingEnvVarInfo[];
  error_code?: string | null;
  error_message?: string | null;
  gateway_running: boolean;
  home_channel?: MessagingHomeChannel | null;
  id: string;
  name: string;
  state?: string | null;
  toolsets: MessagingToolsetInfo[];
  updated_at?: string | null;
}

export interface MessagingPlatformsResponse {
  editable: boolean;
  message?: string;
  platforms: MessagingPlatformInfo[];
  source: "desktop" | "remote-api";
}

export interface MessagingPlatformRuntimeState {
  error_code?: string | null;
  error_message?: string | null;
  state?: string | null;
  updated_at?: string | null;
}

export interface MessagingPlatformUpdate {
  clear_env?: string[];
  enabled?: boolean;
  env?: Record<string, string>;
  toolsets?: Record<string, boolean>;
}

export interface MessagingPlatformTestResponse {
  message: string;
  ok: boolean;
  state?: string | null;
}

export type MessagingToolsetRisk = "normal" | "high";

export interface MessagingToolsetInfo {
  description: string;
  enabled: boolean;
  key: string;
  label: string;
  risk: MessagingToolsetRisk;
}

interface MessagingEnvDefinition {
  advanced?: boolean;
  description: string;
  is_password?: boolean;
  key: string;
  prompt: string;
  url?: string;
}

interface MessagingPlatformDefinition {
  description: string;
  docs_url: string;
  env_vars: string[];
  id: string;
  name: string;
  required_env: string[];
}

interface MessagingToolsetDefinition {
  description: string;
  key: string;
  label: string;
  risk?: MessagingToolsetRisk;
}

export const DEFAULT_MESSAGING_PLATFORM_TOOLSETS = [
  "clarify",
  "cronjob",
  "kanban",
  "memory",
  "messaging",
  "session_search",
  "skills",
  "todo",
  "tts",
  "vision",
  "web",
];

export const MESSAGING_TOOLSET_DEFINITIONS: MessagingToolsetDefinition[] = [
  {
    key: "web",
    label: "Web 搜索",
    description: "使用已配置的搜索后端进行联网搜索（需在服务商页设置搜索 Key）。",
  },
  {
    key: "browser",
    label: "浏览器",
    description: "启动本地浏览器会话，无需额外搜索服务商即可访问网页。",
  },
  {
    key: "terminal",
    label: "终端",
    description: "在此机器上执行 Shell 命令。",
    risk: "high",
  },
  {
    key: "file",
    label: "文件",
    description: "读写 Hermes 可访问的本地文件。",
    risk: "high",
  },
  {
    key: "code_execution",
    label: "代码执行",
    description: "运行本地代码执行工具。",
    risk: "high",
  },
  {
    key: "vision",
    label: "视觉识别",
    description: "分析通过平台发送的图片。",
  },
  {
    key: "image_gen",
    label: "图片生成",
    description: "通过平台生成 AI 图片。",
  },
  {
    key: "tts",
    label: "文字转语音",
    description: "将文字转换为语音回复。",
  },
  {
    key: "skills",
    label: "技能",
    description: "查看、管理 Hermes 技能。",
  },
  {
    key: "memory",
    label: "记忆",
    description: "读写 Hermes 长期记忆。",
  },
  {
    key: "session_search",
    label: "会话搜索",
    description: "搜索历史对话记录。",
  },
  {
    key: "clarify",
    label: "追问确认",
    description: "执行操作前先向用户确认。",
  },
  {
    key: "cronjob",
    label: "Schedules",
    description: "创建和管理定时任务。",
  },
  {
    key: "todo",
    label: "待办",
    description: "管理任务列表和临时待办。",
  },
  {
    key: "messaging",
    label: "消息发送",
    description: "通过已配置的平台发送消息。",
  },
  {
    key: "kanban",
    label: "看板",
    description: "查看和管理看板任务。",
  },
  {
    key: "delegation",
    label: "委托",
    description: "将工作委托给其他 Agent。",
  },
  {
    key: "moa",
    label: "多 Agent 协同",
    description: "使用多个 Agent 进行对比或共识决策。",
  },
];

const HERMES_MESSAGING_DOCS =
  "https://hermes-agent.nousresearch.com/docs/user-guide/messaging";

function messagingDocs(slug: string): string {
  return `${HERMES_MESSAGING_DOCS}/${slug}/`;
}

const ENV_DEFINITIONS: Record<string, MessagingEnvDefinition> = {
  TELEGRAM_BOT_TOKEN: {
    key: "TELEGRAM_BOT_TOKEN",
    prompt: "Bot token",
    description: "Telegram bot token from BotFather",
    is_password: true,
    url: "https://core.telegram.org/bots/features#botfather",
  },
  TELEGRAM_ALLOWED_USERS: {
    key: "TELEGRAM_ALLOWED_USERS",
    prompt: "Allowed Telegram users",
    description: "Comma-separated Telegram user IDs allowed to use the bot",
  },
  TELEGRAM_PROXY: {
    key: "TELEGRAM_PROXY",
    prompt: "Telegram proxy",
    description: "Optional proxy URL used by the Telegram adapter",
    advanced: true,
  },
  DISCORD_BOT_TOKEN: {
    key: "DISCORD_BOT_TOKEN",
    prompt: "Bot token",
    description: "Discord bot token from the Developer Portal",
    is_password: true,
    url: "https://discord.com/developers/applications",
  },
  DISCORD_ALLOWED_USERS: {
    key: "DISCORD_ALLOWED_USERS",
    prompt: "Allowed Discord users",
    description: "Comma-separated Discord user IDs allowed to use the bot",
  },
  DISCORD_ALLOWED_CHANNELS: {
    key: "DISCORD_ALLOWED_CHANNELS",
    prompt: "Allowed Discord channels",
    description: "Legacy allow-list for Discord channels",
    advanced: true,
  },
  DISCORD_REPLY_TO_MODE: {
    key: "DISCORD_REPLY_TO_MODE",
    prompt: "Reply mode",
    description: "Discord reply behavior used by the gateway",
    advanced: true,
  },
  SLACK_BOT_TOKEN: {
    key: "SLACK_BOT_TOKEN",
    prompt: "Bot token",
    description: "Slack bot token (xoxb-...)",
    is_password: true,
    url: "https://api.slack.com/apps",
  },
  SLACK_APP_TOKEN: {
    key: "SLACK_APP_TOKEN",
    prompt: "App token",
    description: "Slack Socket Mode app token (xapp-...)",
    is_password: true,
  },
  MATTERMOST_URL: {
    key: "MATTERMOST_URL",
    prompt: "Mattermost URL",
    description: "Mattermost server base URL",
  },
  MATTERMOST_TOKEN: {
    key: "MATTERMOST_TOKEN",
    prompt: "Mattermost token",
    description: "Mattermost personal access token",
    is_password: true,
  },
  MATTERMOST_ALLOWED_USERS: {
    key: "MATTERMOST_ALLOWED_USERS",
    prompt: "Allowed Mattermost users",
    description: "Comma-separated Mattermost users allowed to use the bot",
  },
  MATRIX_HOMESERVER: {
    key: "MATRIX_HOMESERVER",
    prompt: "Homeserver",
    description: "Matrix homeserver URL",
  },
  MATRIX_ACCESS_TOKEN: {
    key: "MATRIX_ACCESS_TOKEN",
    prompt: "Access token",
    description: "Matrix account access token",
    is_password: true,
  },
  MATRIX_USER_ID: {
    key: "MATRIX_USER_ID",
    prompt: "User ID",
    description: "Matrix user ID, e.g. @hermes:example.org",
  },
  MATRIX_ALLOWED_USERS: {
    key: "MATRIX_ALLOWED_USERS",
    prompt: "Allowed Matrix users",
    description: "Comma-separated Matrix users allowed to use the bot",
  },
  SIGNAL_HTTP_URL: {
    key: "SIGNAL_HTTP_URL",
    prompt: "Signal bridge URL",
    description: "signal-cli REST API base URL, e.g. http://127.0.0.1:8080",
    url: "https://github.com/bbernhard/signal-cli-rest-api",
  },
  SIGNAL_ACCOUNT: {
    key: "SIGNAL_ACCOUNT",
    prompt: "Signal account",
    description: "Signal account phone number registered with the bridge",
  },
  SIGNAL_ALLOWED_USERS: {
    key: "SIGNAL_ALLOWED_USERS",
    prompt: "Allowed Signal users",
    description: "Comma-separated Signal users allowed to use the bot",
  },
  SIGNAL_PHONE_NUMBER: {
    key: "SIGNAL_PHONE_NUMBER",
    prompt: "Signal phone number",
    description: "Legacy Desktop Signal phone number setting",
    advanced: true,
  },
  WHATSAPP_ENABLED: {
    key: "WHATSAPP_ENABLED",
    prompt: "Enable WhatsApp",
    description: "Enable the WhatsApp gateway adapter",
    advanced: true,
  },
  WHATSAPP_MODE: {
    key: "WHATSAPP_MODE",
    prompt: "WhatsApp mode",
    description: "WhatsApp bridge mode",
    advanced: true,
  },
  WHATSAPP_ALLOWED_USERS: {
    key: "WHATSAPP_ALLOWED_USERS",
    prompt: "Allowed WhatsApp users",
    description: "Comma-separated WhatsApp users allowed to use the bot",
  },
  WHATSAPP_API_URL: {
    key: "WHATSAPP_API_URL",
    prompt: "WhatsApp API URL",
    description: "Legacy Desktop WhatsApp bridge URL",
    advanced: true,
  },
  WHATSAPP_API_TOKEN: {
    key: "WHATSAPP_API_TOKEN",
    prompt: "WhatsApp API token",
    description: "Legacy Desktop WhatsApp bridge token",
    is_password: true,
    advanced: true,
  },
  BLUEBUBBLES_SERVER_URL: {
    key: "BLUEBUBBLES_SERVER_URL",
    prompt: "Server URL",
    description: "BlueBubbles server URL",
    url: "https://bluebubbles.app/",
  },
  BLUEBUBBLES_PASSWORD: {
    key: "BLUEBUBBLES_PASSWORD",
    prompt: "Password",
    description: "BlueBubbles server password",
    is_password: true,
  },
  BLUEBUBBLES_ALLOWED_USERS: {
    key: "BLUEBUBBLES_ALLOWED_USERS",
    prompt: "Allowed iMessage users",
    description: "Comma-separated iMessage senders allowed to use the bot",
  },
  BLUEBUBBLES_URL: {
    key: "BLUEBUBBLES_URL",
    prompt: "BlueBubbles URL",
    description: "Legacy Desktop BlueBubbles server URL",
    advanced: true,
  },
  HASS_URL: {
    key: "HASS_URL",
    prompt: "Home Assistant URL",
    description:
      "Home Assistant base URL, e.g. https://homeassistant.local:8123",
    url: "https://www.home-assistant.io/docs/authentication/",
  },
  HASS_TOKEN: {
    key: "HASS_TOKEN",
    prompt: "Home Assistant access token",
    description: "Long-lived access token from Home Assistant",
    is_password: true,
  },
  EMAIL_ADDRESS: {
    key: "EMAIL_ADDRESS",
    prompt: "Email address",
    description: "Email address to send and receive from",
  },
  EMAIL_PASSWORD: {
    key: "EMAIL_PASSWORD",
    prompt: "Email password",
    description: "Email account password or app password",
    is_password: true,
  },
  EMAIL_IMAP_HOST: {
    key: "EMAIL_IMAP_HOST",
    prompt: "IMAP host",
    description: "IMAP server host, e.g. imap.gmail.com",
  },
  EMAIL_SMTP_HOST: {
    key: "EMAIL_SMTP_HOST",
    prompt: "SMTP host",
    description: "SMTP server host, e.g. smtp.gmail.com",
  },
  EMAIL_IMAP_SERVER: {
    key: "EMAIL_IMAP_SERVER",
    prompt: "IMAP server",
    description: "Legacy Desktop IMAP server setting",
    advanced: true,
  },
  EMAIL_SMTP_SERVER: {
    key: "EMAIL_SMTP_SERVER",
    prompt: "SMTP server",
    description: "Legacy Desktop SMTP server setting",
    advanced: true,
  },
  TWILIO_ACCOUNT_SID: {
    key: "TWILIO_ACCOUNT_SID",
    prompt: "Twilio Account SID",
    description: "Twilio Account SID",
    url: "https://www.twilio.com/console",
  },
  TWILIO_AUTH_TOKEN: {
    key: "TWILIO_AUTH_TOKEN",
    prompt: "Twilio Auth Token",
    description: "Twilio Auth Token",
    is_password: true,
  },
  TWILIO_PHONE_NUMBER: {
    key: "TWILIO_PHONE_NUMBER",
    prompt: "Twilio phone number",
    description: "Legacy Desktop Twilio sender number",
    advanced: true,
  },
  SMS_PROVIDER: {
    key: "SMS_PROVIDER",
    prompt: "SMS provider",
    description: "Legacy Desktop SMS provider setting",
    advanced: true,
  },
  DINGTALK_CLIENT_ID: {
    key: "DINGTALK_CLIENT_ID",
    prompt: "客户端 ID",
    description: "钉钉客户端 ID（App Key）",
  },
  DINGTALK_CLIENT_SECRET: {
    key: "DINGTALK_CLIENT_SECRET",
    prompt: "客户端密钥",
    description: "钉钉客户端密钥（App Secret）",
    is_password: true,
  },
  DINGTALK_APP_KEY: {
    key: "DINGTALK_APP_KEY",
    prompt: "旧版 App Key",
    description: "旧版桌面端钉钉 App Key",
    advanced: true,
  },
  DINGTALK_APP_SECRET: {
    key: "DINGTALK_APP_SECRET",
    prompt: "旧版 App Secret",
    description: "旧版桌面端钉钉 App Secret",
    is_password: true,
    advanced: true,
  },
  FEISHU_APP_ID: {
    key: "FEISHU_APP_ID",
    prompt: "应用 ID",
    description: "飞书 / Lark 应用 ID",
  },
  FEISHU_APP_SECRET: {
    key: "FEISHU_APP_SECRET",
    prompt: "应用密钥",
    description: "飞书 / Lark 应用密钥",
    is_password: true,
  },
  FEISHU_ENCRYPT_KEY: {
    key: "FEISHU_ENCRYPT_KEY",
    prompt: "加密密钥",
    description: "飞书 / Lark 加密密钥",
    is_password: true,
  },
  FEISHU_VERIFICATION_TOKEN: {
    key: "FEISHU_VERIFICATION_TOKEN",
    prompt: "验证令牌",
    description: "飞书 / Lark 验证令牌",
    is_password: true,
  },
  WECOM_BOT_ID: {
    key: "WECOM_BOT_ID",
    prompt: "企业微信机器人 ID",
    description: "企业微信群机器人 ID",
  },
  WECOM_SECRET: {
    key: "WECOM_SECRET",
    prompt: "企业微信 Secret",
    description: "企业微信群机器人密钥",
    is_password: true,
  },
  WECOM_CALLBACK_CORP_ID: {
    key: "WECOM_CALLBACK_CORP_ID",
    prompt: "企业微信 Corp ID",
    description: "企业微信企业 ID",
  },
  WECOM_CALLBACK_CORP_SECRET: {
    key: "WECOM_CALLBACK_CORP_SECRET",
    prompt: "企业微信 Corp Secret",
    description: "企业微信应用密钥",
    is_password: true,
  },
  WECOM_CALLBACK_AGENT_ID: {
    key: "WECOM_CALLBACK_AGENT_ID",
    prompt: "企业微信 Agent ID",
    description: "企业微信应用 Agent ID",
  },
  WECOM_CALLBACK_TOKEN: {
    key: "WECOM_CALLBACK_TOKEN",
    prompt: "企业微信 Token",
    description: "企业微信回调验证 Token",
  },
  WECOM_CALLBACK_ENCODING_AES_KEY: {
    key: "WECOM_CALLBACK_ENCODING_AES_KEY",
    prompt: "企业微信 AES 密钥",
    description: "企业微信回调 AES 加密密钥",
    is_password: true,
  },
  WECOM_CORP_ID: {
    key: "WECOM_CORP_ID",
    prompt: "旧版 Corp ID",
    description: "旧版桌面端企业微信 Corp ID",
    advanced: true,
  },
  WECOM_AGENT_ID: {
    key: "WECOM_AGENT_ID",
    prompt: "旧版 Agent ID",
    description: "旧版桌面端企业微信 Agent ID",
    advanced: true,
  },
  WEIXIN_ACCOUNT_ID: {
    key: "WEIXIN_ACCOUNT_ID",
    prompt: "账号 ID",
    description: "微信公众号 App ID",
  },
  WEIXIN_TOKEN: {
    key: "WEIXIN_TOKEN",
    prompt: "令牌",
    description: "微信公众号回调 Token",
    is_password: true,
  },
  WEIXIN_BASE_URL: {
    key: "WEIXIN_BASE_URL",
    prompt: "基础地址",
    description: "微信平台基础 URL",
  },
  WEIXIN_BOT_TOKEN: {
    key: "WEIXIN_BOT_TOKEN",
    prompt: "旧版 Bot Token",
    description: "旧版桌面端微信 Bot Token",
    is_password: true,
    advanced: true,
  },
  QQ_APP_ID: {
    key: "QQ_APP_ID",
    prompt: "QQ App ID",
    description: "QQ 机器人 App ID",
  },
  QQ_CLIENT_SECRET: {
    key: "QQ_CLIENT_SECRET",
    prompt: "QQ 客户端密钥",
    description: "QQ 机器人客户端密钥",
    is_password: true,
  },
  QQ_ALLOWED_USERS: {
    key: "QQ_ALLOWED_USERS",
    prompt: "允许的 QQ 用户",
    description: "允许使用机器人的 QQ 用户，英文逗号分隔",
  },
  WEBHOOK_ENABLED: {
    key: "WEBHOOK_ENABLED",
    prompt: "Enable webhooks",
    description: "Enable webhook ingestion",
    advanced: true,
  },
  WEBHOOK_PORT: {
    key: "WEBHOOK_PORT",
    prompt: "Webhook port",
    description: "HTTP port for webhook delivery",
    advanced: true,
  },
  WEBHOOK_SECRET: {
    key: "WEBHOOK_SECRET",
    prompt: "Webhook secret",
    description: "Shared secret used to verify webhook senders",
    is_password: true,
  },
  API_SERVER_ENABLED: {
    key: "API_SERVER_ENABLED",
    prompt: "启用 API 服务",
    description: "通过 OpenAI 兼容的 HTTP API 暴露 Hermes",
    advanced: true,
  },
  API_SERVER_KEY: {
    key: "API_SERVER_KEY",
    prompt: "API 密钥",
    description: "本地 API 服务所需的 Bearer Token",
    is_password: true,
  },
  API_SERVER_PORT: {
    key: "API_SERVER_PORT",
    prompt: "API 端口",
    description: "API 服务监听的端口",
    advanced: true,
  },
  API_SERVER_HOST: {
    key: "API_SERVER_HOST",
    prompt: "API 主机",
    description: "API 服务绑定的网络接口",
    advanced: true,
  },
  API_SERVER_MODEL_NAME: {
    key: "API_SERVER_MODEL_NAME",
    prompt: "API 模型名",
    description: "API 服务对外暴露的模型名称",
    advanced: true,
  },
};

/** Chinese translations for platform names & descriptions. Omitted keys fall
 *  through to the original English value. */
const ZH_NAMES: Record<string, string> = {
  telegram: "Telegram",
  discord: "Discord",
  slack: "Slack",
  mattermost: "Mattermost",
  matrix: "Matrix",
  whatsapp: "WhatsApp",
  signal: "Signal",
  bluebubbles: "iMessage（BlueBubbles）",
  homeassistant: "Home Assistant 智能家居",
  email: "邮件",
  sms: "短信（Twilio）",
  dingtalk: "钉钉",
  feishu: "飞书",
  wecom: "企业微信（群机器人）",
  wecom_callback: "企业微信（应用）",
  weixin: "微信公众号",
  qqbot: "QQ Bot",
  yuanbao: "元宝",
  api_server: "API 服务器",
  webhook: "Webhooks",
};

const ZH_DESCS: Record<string, string> = {
  telegram: "在 Telegram 私聊、群组中使用 Hermes。",
  discord: "在 Discord 服务器中使用 Hermes。",
  slack: "在 Slack 工作区中使用 Hermes。",
  mattermost: "在 Mattermost 团队中使用 Hermes。",
  whatsapp: "在 WhatsApp 对话中使用 Hermes。",
  dingtalk: "将 Hermes 接入钉钉群聊。",
  feishu: "在飞书中使用 Hermes。",
  wecom: "通过 Webhook 向企业微信群发送消息。",
  wecom_callback: "通过回调应用实现企业微信双向互通。",
  weixin: "接入微信公众号。",
  qqbot: "接入 QQ Bot。",
  email: "通过邮件与 Hermes 交互。",
  sms: "通过短信与 Hermes 交互（需 Twilio）。",
};

function translatePlatform(p: MessagingPlatformDefinition): MessagingPlatformDefinition {
  return {
    ...p,
    name: ZH_NAMES[p.id] ?? p.name,
    description: ZH_DESCS[p.id] ?? p.description,
  };
}

// ── Catalog ──

export const MESSAGING_PLATFORM_CATALOG: MessagingPlatformDefinition[] = [
  {
    id: "telegram",
    name: "Telegram",
    description: "DMs, groups, and topics",
    docs_url: messagingDocs("telegram"),
    env_vars: [
      "TELEGRAM_BOT_TOKEN",
      "TELEGRAM_ALLOWED_USERS",
      "TELEGRAM_PROXY",
    ],
    required_env: ["TELEGRAM_BOT_TOKEN"],
  },
  {
    id: "discord",
    name: "Discord",
    description: "DMs, channels, and threads",
    docs_url: messagingDocs("discord"),
    env_vars: [
      "DISCORD_BOT_TOKEN",
      "DISCORD_ALLOWED_USERS",
      "DISCORD_ALLOWED_CHANNELS",
      "DISCORD_REPLY_TO_MODE",
    ],
    required_env: ["DISCORD_BOT_TOKEN"],
  },
  {
    id: "slack",
    name: "Slack",
    description: "Socket Mode",
    docs_url: messagingDocs("slack"),
    env_vars: ["SLACK_BOT_TOKEN", "SLACK_APP_TOKEN"],
    required_env: ["SLACK_BOT_TOKEN", "SLACK_APP_TOKEN"],
  },
  {
    id: "mattermost",
    name: "Mattermost",
    description: "Channels and direct messages",
    docs_url: messagingDocs("mattermost"),
    env_vars: [
      "MATTERMOST_URL",
      "MATTERMOST_TOKEN",
      "MATTERMOST_ALLOWED_USERS",
    ],
    required_env: ["MATTERMOST_URL", "MATTERMOST_TOKEN"],
  },
  {
    id: "matrix",
    name: "Matrix",
    description: "Rooms and direct messages",
    docs_url: messagingDocs("matrix"),
    env_vars: [
      "MATRIX_HOMESERVER",
      "MATRIX_ACCESS_TOKEN",
      "MATRIX_USER_ID",
      "MATRIX_ALLOWED_USERS",
    ],
    required_env: [
      "MATRIX_HOMESERVER",
      "MATRIX_ACCESS_TOKEN",
      "MATRIX_USER_ID",
    ],
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    description: "Bundled bridge, QR sign-in",
    docs_url: messagingDocs("whatsapp"),
    env_vars: [
      "WHATSAPP_ENABLED",
      "WHATSAPP_MODE",
      "WHATSAPP_ALLOWED_USERS",
      "WHATSAPP_API_URL",
      "WHATSAPP_API_TOKEN",
    ],
    required_env: [],
  },
  {
    id: "signal",
    name: "Signal",
    description: "Connect through a signal-cli REST bridge.",
    docs_url: messagingDocs("signal"),
    env_vars: [
      "SIGNAL_HTTP_URL",
      "SIGNAL_ACCOUNT",
      "SIGNAL_ALLOWED_USERS",
      "SIGNAL_PHONE_NUMBER",
    ],
    required_env: ["SIGNAL_HTTP_URL", "SIGNAL_ACCOUNT"],
  },
  {
    id: "bluebubbles",
    name: "BlueBubbles (iMessage)",
    description: "Via a BlueBubbles server",
    docs_url: messagingDocs("bluebubbles"),
    env_vars: [
      "BLUEBUBBLES_SERVER_URL",
      "BLUEBUBBLES_PASSWORD",
      "BLUEBUBBLES_ALLOWED_USERS",
      "BLUEBUBBLES_URL",
    ],
    required_env: ["BLUEBUBBLES_SERVER_URL", "BLUEBUBBLES_PASSWORD"],
  },
  {
    id: "homeassistant",
    name: "Home Assistant",
    description: "Smart home via Home Assistant",
    docs_url: messagingDocs("homeassistant"),
    env_vars: ["HASS_URL", "HASS_TOKEN"],
    required_env: ["HASS_URL", "HASS_TOKEN"],
  },
  {
    id: "email",
    name: "Email",
    description: "Talk to Hermes through an IMAP/SMTP mailbox.",
    docs_url: messagingDocs("email"),
    env_vars: [
      "EMAIL_ADDRESS",
      "EMAIL_PASSWORD",
      "EMAIL_IMAP_HOST",
      "EMAIL_SMTP_HOST",
      "EMAIL_IMAP_SERVER",
      "EMAIL_SMTP_SERVER",
    ],
    required_env: [
      "EMAIL_ADDRESS",
      "EMAIL_PASSWORD",
      "EMAIL_IMAP_HOST",
      "EMAIL_SMTP_HOST",
    ],
  },
  {
    id: "sms",
    name: "SMS (Twilio)",
    description: "Send and receive text messages via Twilio.",
    docs_url: messagingDocs("sms"),
    env_vars: [
      "TWILIO_ACCOUNT_SID",
      "TWILIO_AUTH_TOKEN",
      "TWILIO_PHONE_NUMBER",
      "SMS_PROVIDER",
    ],
    required_env: ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN"],
  },
  {
    id: "dingtalk",
    name: "DingTalk",
    description: "DingTalk groups",
    docs_url: messagingDocs("dingtalk"),
    env_vars: [
      "DINGTALK_CLIENT_ID",
      "DINGTALK_CLIENT_SECRET",
      "DINGTALK_APP_KEY",
      "DINGTALK_APP_SECRET",
    ],
    required_env: ["DINGTALK_CLIENT_ID", "DINGTALK_CLIENT_SECRET"],
  },
  {
    id: "feishu",
    name: "Feishu / Lark",
    description: "Groups and direct messages",
    docs_url: messagingDocs("feishu"),
    env_vars: [
      "FEISHU_APP_ID",
      "FEISHU_APP_SECRET",
      "FEISHU_ENCRYPT_KEY",
      "FEISHU_VERIFICATION_TOKEN",
    ],
    required_env: ["FEISHU_APP_ID", "FEISHU_APP_SECRET"],
  },
  {
    id: "wecom",
    name: "WeCom (group bot)",
    description: "Send-only WeCom group bot via webhook.",
    docs_url: messagingDocs("wecom"),
    env_vars: [
      "WECOM_BOT_ID",
      "WECOM_SECRET",
      "WECOM_CORP_ID",
      "WECOM_AGENT_ID",
    ],
    required_env: ["WECOM_BOT_ID"],
  },
  {
    id: "wecom_callback",
    name: "WeCom (app)",
    description: "Two-way WeCom integration via callback app.",
    docs_url: messagingDocs("wecom-callback"),
    env_vars: [
      "WECOM_CALLBACK_CORP_ID",
      "WECOM_CALLBACK_CORP_SECRET",
      "WECOM_CALLBACK_AGENT_ID",
      "WECOM_CALLBACK_TOKEN",
      "WECOM_CALLBACK_ENCODING_AES_KEY",
    ],
    required_env: [
      "WECOM_CALLBACK_CORP_ID",
      "WECOM_CALLBACK_CORP_SECRET",
      "WECOM_CALLBACK_AGENT_ID",
    ],
  },
  {
    id: "weixin",
    name: "WeChat (Official Account)",
    description: "Connect a WeChat Official Account.",
    docs_url: messagingDocs("weixin"),
    env_vars: [
      "WEIXIN_ACCOUNT_ID",
      "WEIXIN_TOKEN",
      "WEIXIN_BASE_URL",
      "WEIXIN_BOT_TOKEN",
    ],
    required_env: ["WEIXIN_ACCOUNT_ID", "WEIXIN_TOKEN"],
  },
  {
    id: "qqbot",
    name: "QQ Bot",
    description: "QQ Open Platform bot",
    docs_url: messagingDocs("qqbot"),
    env_vars: ["QQ_APP_ID", "QQ_CLIENT_SECRET", "QQ_ALLOWED_USERS"],
    required_env: ["QQ_APP_ID", "QQ_CLIENT_SECRET"],
  },
  {
    id: "yuanbao",
    name: "Yuanbao",
    description: "Tencent Yuanbao",
    docs_url: messagingDocs("yuanbao"),
    env_vars: [],
    required_env: [],
  },
  {
    id: "api_server",
    name: "API server",
    description:
      "Expose Hermes as an OpenAI-compatible HTTP API for tools like Open WebUI.",
    docs_url: messagingDocs("open-webui"),
    env_vars: [
      "API_SERVER_ENABLED",
      "API_SERVER_KEY",
      "API_SERVER_PORT",
      "API_SERVER_HOST",
      "API_SERVER_MODEL_NAME",
    ],
    required_env: [],
  },
  {
    id: "webhook",
    name: "Webhooks",
    description:
      "Receive events from GitHub, GitLab, and other webhook sources.",
    docs_url: messagingDocs("webhooks"),
    env_vars: ["WEBHOOK_ENABLED", "WEBHOOK_PORT", "WEBHOOK_SECRET"],
    required_env: [],
  },
];

export function getMessagingPlatformIds(): string[] {
  return MESSAGING_PLATFORM_CATALOG.map((platform) => platform.id);
}

export function getMessagingPlatformDefinition(
  platformId: string,
): MessagingPlatformDefinition | undefined {
  return MESSAGING_PLATFORM_CATALOG.find(
    (platform) => platform.id === platformId,
  );
}

export function getMessagingPlatformEnvKeys(platformId: string): Set<string> {
  return new Set(getMessagingPlatformDefinition(platformId)?.env_vars ?? []);
}

export function getMessagingToolsetKeys(): Set<string> {
  return new Set(MESSAGING_TOOLSET_DEFINITIONS.map((toolset) => toolset.key));
}

export function buildMessagingPlatforms(
  env: Record<string, string>,
  enabled: Record<string, boolean>,
  gatewayRunning: boolean,
  platformToolsets: Record<string, string[]> = {},
  platformStates: Record<string, MessagingPlatformRuntimeState> = {},
): MessagingPlatformsResponse {
  return {
    editable: true,
    source: "desktop",
    platforms: MESSAGING_PLATFORM_CATALOG.map(translatePlatform).map((platform) =>
      buildMessagingPlatform(
        platform,
        env,
        enabled,
        gatewayRunning,
        platformToolsets[platform.id],
        platformStates[platform.id],
      ),
    ),
  };
}

function buildMessagingPlatform(
  platform: MessagingPlatformDefinition,
  env: Record<string, string>,
  enabled: Record<string, boolean>,
  gatewayRunning: boolean,
  enabledToolsets?: string[],
  runtimeState?: MessagingPlatformRuntimeState,
): MessagingPlatformInfo {
  const env_vars = platform.env_vars.map((key) =>
    buildEnvVar(key, env[key] ?? "", platform.required_env.includes(key)),
  );
  const configured = isPlatformConfigured(platform, env);
  const isEnabled = enabled[platform.id] ?? configured;
  let state = "disabled";
  if (isEnabled && !configured) state = "not_configured";
  else if (isEnabled && gatewayRunning)
    state = runtimeState?.state || "configured";
  else if (isEnabled) state = "gateway_stopped";

  return {
    configured,
    description: platform.description,
    docs_url: platform.docs_url,
    enabled: isEnabled,
    error_code: gatewayRunning ? (runtimeState?.error_code ?? null) : null,
    error_message: gatewayRunning
      ? (runtimeState?.error_message ?? null)
      : null,
    env_vars,
    gateway_running: gatewayRunning,
    id: platform.id,
    name: platform.name,
    state,
    toolsets: buildMessagingToolsets(enabledToolsets),
    updated_at: gatewayRunning ? (runtimeState?.updated_at ?? null) : null,
  };
}

function buildMessagingToolsets(
  enabledToolsets?: string[],
): MessagingToolsetInfo[] {
  const enabled = new Set(
    enabledToolsets ?? DEFAULT_MESSAGING_PLATFORM_TOOLSETS,
  );
  return MESSAGING_TOOLSET_DEFINITIONS.map((toolset) => ({
    description: toolset.description,
    enabled: enabled.has(toolset.key),
    key: toolset.key,
    label: toolset.label,
    risk: toolset.risk ?? "normal",
  }));
}

function isPlatformConfigured(
  platform: MessagingPlatformDefinition,
  env: Record<string, string>,
): boolean {
  const has = (key: string): boolean => !!(env[key] ?? "").trim();
  switch (platform.id) {
    case "bluebubbles":
      return (
        (has("BLUEBUBBLES_SERVER_URL") || has("BLUEBUBBLES_URL")) &&
        has("BLUEBUBBLES_PASSWORD")
      );
    case "dingtalk":
      return (
        (has("DINGTALK_CLIENT_ID") && has("DINGTALK_CLIENT_SECRET")) ||
        (has("DINGTALK_APP_KEY") && has("DINGTALK_APP_SECRET"))
      );
    case "email":
      return (
        has("EMAIL_ADDRESS") &&
        has("EMAIL_PASSWORD") &&
        (has("EMAIL_IMAP_HOST") || has("EMAIL_IMAP_SERVER")) &&
        (has("EMAIL_SMTP_HOST") || has("EMAIL_SMTP_SERVER"))
      );
    case "signal":
      return (
        (has("SIGNAL_HTTP_URL") && has("SIGNAL_ACCOUNT")) ||
        has("SIGNAL_PHONE_NUMBER")
      );
    case "wecom":
      return (
        has("WECOM_BOT_ID") ||
        (has("WECOM_CORP_ID") && has("WECOM_AGENT_ID") && has("WECOM_SECRET"))
      );
    case "weixin":
      return (
        (has("WEIXIN_ACCOUNT_ID") && has("WEIXIN_TOKEN")) ||
        has("WEIXIN_BOT_TOKEN")
      );
    default:
      return (
        platform.required_env.length === 0 ||
        platform.required_env.every((key) => has(key))
      );
  }
}

function buildEnvVar(
  key: string,
  value: string,
  required: boolean,
): MessagingEnvVarInfo {
  const def = ENV_DEFINITIONS[key] ?? {
    key,
    prompt: key,
    description: "",
  };
  const trimmed = value.trim();
  return {
    advanced: !!def.advanced,
    description: def.description,
    is_password: !!def.is_password,
    is_set: !!trimmed,
    key,
    prompt: def.prompt,
    redacted_value: trimmed ? redactValue(trimmed) : null,
    required,
    url: def.url ?? null,
  };
}

export function redactValue(value: string): string {
  if (value.length <= 6) return "••••";
  return `${value.slice(0, 3)}••••${value.slice(-3)}`;
}

export function validateMessagingPlatformUpdate(
  platformId: string,
  update: MessagingPlatformUpdate,
): void {
  const platform = getMessagingPlatformDefinition(platformId);
  if (!platform) {
    throw new Error(`Unknown messaging platform: ${platformId}`);
  }
  const allowed = getMessagingPlatformEnvKeys(platformId);
  for (const key of Object.keys(update.env ?? {})) {
    if (!allowed.has(key)) {
      throw new Error(`${key} is not configurable for ${platform.name}`);
    }
  }
  for (const key of update.clear_env ?? []) {
    if (!allowed.has(key)) {
      throw new Error(`${key} is not configurable for ${platform.name}`);
    }
  }
  const allowedToolsets = getMessagingToolsetKeys();
  for (const key of Object.keys(update.toolsets ?? {})) {
    if (!allowedToolsets.has(key)) {
      throw new Error(`${key} is not a supported messaging toolset`);
    }
  }
}

export function testMessagingPlatformStatus(
  platform: MessagingPlatformInfo,
): MessagingPlatformTestResponse {
  if (!platform.enabled) {
    return {
      ok: false,
      state: platform.state,
      message: `${platform.name} is disabled. Enable it, then restart the gateway.`,
    };
  }
  if (!platform.configured) {
    const missing = platform.env_vars
      .filter((field) => field.required && !field.is_set)
      .map((field) => field.key);
    return {
      ok: false,
      state: platform.state,
      message: missing.length
        ? `Missing required setup: ${missing.join(", ")}`
        : "Platform setup is incomplete.",
    };
  }
  if (!platform.gateway_running) {
    return {
      ok: false,
      state: platform.state,
      message:
        "Gateway is not running. Start the gateway to load this platform.",
    };
  }
  if (platform.state === "connected") {
    return {
      ok: true,
      state: platform.state,
      message: `${platform.name} is connected.`,
    };
  }
  if (platform.error_message) {
    return {
      ok: false,
      state: platform.state,
      message: platform.error_message,
    };
  }
  return {
    ok: false,
    state: platform.state,
    message:
      "Setup looks complete. Desktop can verify the config, but local gateway connection reporting is not available yet.",
  };
}
