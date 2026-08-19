// @vitest-environment node
import { describe, it, expect } from "vitest";
import {
  applyDashboardStreamEvent,
  mergeStreamedWithFinal,
  type DashboardEventState,
} from "./dashboardEventAdapter";
import type { ChatMessage } from "./types";

describe("mergeStreamedWithFinal", () => {
  it("uses final when nothing was streamed (remote / suppressed-delta path)", () => {
    expect(mergeStreamedWithFinal("", "Final answer")).toBe("Final answer");
    expect(mergeStreamedWithFinal("   ", "Final answer")).toBe("Final answer");
  });

  it("keeps streamed text when final is empty", () => {
    expect(mergeStreamedWithFinal("Streamed text", "")).toBe("Streamed text");
  });

  it("prefers final when it already contains the streamed text", () => {
    expect(
      mergeStreamedWithFinal("It's sunny.", "Let me check. It's sunny."),
    ).toBe("Let me check. It's sunny.");
  });

  it("prefers streamed when it contains final plus pre-tool-call text", () => {
    expect(
      mergeStreamedWithFinal("Let me check. It's sunny.", "It's sunny."),
    ).toBe("Let me check. It's sunny.");
  });

  it("compares whitespace-insensitively", () => {
    // Differs only by collapsed whitespace ⇒ treated as fully contained.
    expect(mergeStreamedWithFinal("Hello   world", "Hello world")).toBe(
      "Hello world",
    );
  });

  it("concatenates disjoint segments with a blank-line separator", () => {
    expect(
      mergeStreamedWithFinal("Let me check the weather.", "It's sunny."),
    ).toBe("Let me check the weather.\n\nIt's sunny.");
  });

  it("does not mash words when concatenating without trailing punctuation", () => {
    const merged = mergeStreamedWithFinal("Let me check", "It is sunny");
    expect(merged).toBe("Let me check\n\nIt is sunny");
    expect(merged).not.toContain("checkIt");
  });

  // Lossy re-assembly: the content stream dropped chunks (e.g. alternate
  // chunks mis-tagged as `reasoning` upstream), so the streamed bubble is a
  // garbled subsequence of the final answer. The final must REPLACE it —
  // concatenating stacked the partial above the clean answer in one bubble.
  it("replaces a lossy chunk-dropped stream with the final text", () => {
    expect(
      mergeStreamedWithFinal(
        "! What are we working on?",
        "Hey! What are we working on today?",
      ),
    ).toBe("Hey! What are we working on today?");
  });

  it("replaces a longer garbled stream that interleaves into the final", () => {
    expect(
      mergeStreamedWithFinal(
        "Sat planet from the Sun — ring system made ice and rock particles.",
        "Saturn is the sixth planet from the Sun — a gas giant famous for its stunning ring system made of ice and rock particles.",
      ),
    ).toBe(
      "Saturn is the sixth planet from the Sun — a gas giant famous for its stunning ring system made of ice and rock particles.",
    );
  });

  it("still concatenates a short lead-in even if it is a subsequence", () => {
    // Guard: a tiny streamed fragment is a subsequence of almost anything;
    // treat it as the pre-tool-call text it usually is.
    expect(mergeStreamedWithFinal("On it.", "Onwards — it is done.")).toBe(
      "On it.\n\nOnwards — it is done.",
    );
  });

  it("preserves pre-tool-call text that embeds only as scattered characters", () => {
    // Review regression: the streamed text is a plain character subsequence
    // of the final (every char appears in order as 1-char fragments), long
    // enough to pass the length/coverage guards — but it is NOT a
    // chunk-dropped copy, so it must stack, not be erased.
    expect(
      mergeStreamedWithFinal("abcdefghijkl", "a1b2c3d4e5f6g7h8i9j0k1l2"),
    ).toBe("abcdefghijkl\n\na1b2c3d4e5f6g7h8i9j0k1l2");
  });

  it("stitches a re-streamed boundary, dropping the duplicated seam", () => {
    // Tail of streamed repeats the head of final at a word boundary.
    expect(mergeStreamedWithFinal("The answer is 4", "answer is 4.")).toBe(
      "The answer is 4.",
    );
  });

  it("does not stitch a coincidental mid-word overlap", () => {
    // The shared "d" is mid-word ("worl|d") so it must not be spliced.
    expect(mergeStreamedWithFinal("Hello world", "dog runs")).toBe(
      "Hello world\n\ndog runs",
    );
  });

  it("returns trimmed output regardless of branch", () => {
    expect(mergeStreamedWithFinal("  Hello  ", "  Hello there  ")).toBe(
      "Hello there",
    );
  });

  it("keeps a distinct CJK pre-tool segment instead of erasing it (#793)", () => {
    // A Chinese pre-tool segment shares short repeated phrases with the final
    // answer. The 3-char lossy probe used to misread it as a chunk-dropped
    // copy and erase it; CJK text must stay on the concatenate path.
    const streamed = "我来帮你查一下今天的天气。";
    const final = "今天惠州多云转晴，气温 22–30℃。";
    expect(mergeStreamedWithFinal(streamed, final)).toBe(
      `${streamed}\n\n${final}`,
    );
  });

  it("still replaces a genuine CJK superset with the final text", () => {
    // The ⊇ branch still applies: when the final fully contains the streamed
    // text, the final wins (this is the common "final is the fuller version"
    // case, unaffected by the CJK lossy-skip).
    const streamed = "你说得对";
    const final = "你说得对，这是我输出的原始分析报告。";
    expect(mergeStreamedWithFinal(streamed, final)).toBe(final);
  });
});

describe("applyDashboardStreamEvent — message.complete text reconciliation", () => {
  const userTurn = (): ChatMessage => ({
    id: "u1",
    role: "user",
    content: "weather?",
  });

  it("preserves pre-tool-call streamed text on completion (#746)", () => {
    // Model streamed text, called a tool, then finalized with a short
    // last-turn-only final_response. The pre-tool text lives in the last
    // assistant bubble and must not be clobbered.
    const state: DashboardEventState = {
      messages: [
        userTurn(),
        {
          id: "a1",
          role: "agent",
          kind: "assistant",
          content: "Let me check the weather. ",
          pending: true,
        },
        {
          id: "tc1",
          role: "agent",
          kind: "tool_call",
          callId: "c1",
          name: "weather",
          args: "",
        },
        {
          id: "tr1",
          role: "agent",
          kind: "tool_result",
          callId: "c1",
          name: "weather",
          content: "sunny",
        },
      ],
      reasoningSegmentClosed: false,
    };

    const next = applyDashboardStreamEvent(state, {
      type: "message.complete",
      payload: { text: "Done." },
    });

    const bubble = next.messages.find((m) => m.id === "a1");
    expect(bubble).toBeDefined();
    expect((bubble as { content: string }).content).toBe(
      "Let me check the weather.\n\nDone.",
    );
    expect((bubble as { pending?: boolean }).pending).toBe(false);
  });

  it("uses the fuller final_response when it supersets the streamed text", () => {
    const state: DashboardEventState = {
      messages: [
        userTurn(),
        {
          id: "a1",
          role: "agent",
          kind: "assistant",
          content: "Hello",
          pending: true,
        },
      ],
      reasoningSegmentClosed: false,
    };

    const next = applyDashboardStreamEvent(state, {
      type: "message.complete",
      payload: { text: "Hello there, friend." },
    });

    expect(
      (next.messages.find((m) => m.id === "a1") as { content: string }).content,
    ).toBe("Hello there, friend.");
  });

  it("falls back to final_response when deltas are suppressed (remote path)", () => {
    const afterDelta = applyDashboardStreamEvent(
      { messages: [userTurn()], reasoningSegmentClosed: false },
      { type: "message.delta", payload: { text: "ignored stream" } },
      { renderAssistantDeltas: false },
    );
    // No assistant bubble is created while deltas are suppressed.
    expect(afterDelta.messages.some((m) => m.role === "agent")).toBe(false);

    const next = applyDashboardStreamEvent(
      afterDelta,
      { type: "message.complete", payload: { text: "Remote answer" } },
      { renderAssistantDeltas: false },
    );
    const bubble = next.messages.find((m) => m.role === "agent");
    expect(bubble).toBeDefined();
    expect((bubble as { content: string }).content).toBe("Remote answer");
  });
});
