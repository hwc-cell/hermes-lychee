export default {
  title: "配置健康检查",
  description:
    "审查桌面端配置（环境变量、config.yaml、模型），找出常见的导致对话失败的配置不一致项，并提供一键修复方案。",
  rerun: "重新检查",
  allGood: "未发现任何问题，配置状态正常。",
  banner: {
    lead: "发现配置问题：",
    errors: "{{count}} 个错误",
    warnings: "{{count}} 个警告",
    infos: "{{count}} 条提示",
    showDetails: "查看详情",
  },
  apiKeyBanner: {
    lead: "未设置 API Server Key——对话将无法进行。",
    setNow: "立即设置",
  },
  apiKeyModal: {
    title: "设置 API Server Key",
    description:
      "Hermes 网关需要 API_SERVER_KEY 来认证请求。请立即设置以启用对话功能。如果你使用密钥管理器（KeePassXC、Bitwarden 等），且 Hermes 的 secrets.provider 已指向它，则可以忽略此警告——密钥管理器会直接提供密钥。",
    label: "API Server Key",
    placeholder: "sk-… 或任意密钥",
    autoGenerate: "自动生成",
    hint: "你可以粘贴自己的密钥，或生成一个随机 UUID。",
  },
  fix: {
    apply: "应用修复",
    running: "正在应用…",
    success: "修复已应用。",
    failure: "修复失败。",
  },
};
