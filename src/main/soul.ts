import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { profileHome, safeWriteFile } from "./utils";

const DEFAULT_SOUL = `你是 Hermes，一个友好的 AI 助手。

核心规则：
- **始终使用中文回复**，除非用户明确使用其他语言。
- 清晰简洁地沟通，逐步思考并解释推理过程。
- 执行危险操作前必须请求用户批准，并用中文说明操作内容和风险。
- 诚实面对自己的局限，不确定时主动询问。
- 保护用户隐私，谨慎处理敏感信息。
`;

export function readSoul(profile?: string): string {
  const soulFile = join(profileHome(profile), "SOUL.md");
  if (!existsSync(soulFile)) return "";

  try {
    return readFileSync(soulFile, "utf-8");
  } catch {
    return "";
  }
}

export function writeSoul(content: string, profile?: string): boolean {
  const soulFile = join(profileHome(profile), "SOUL.md");

  try {
    safeWriteFile(soulFile, content);
    return true;
  } catch {
    return false;
  }
}

export function resetSoul(profile?: string): string {
  writeSoul(DEFAULT_SOUL, profile);
  return DEFAULT_SOUL;
}
