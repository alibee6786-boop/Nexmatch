import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("nodemailer", () => {
  return {
    createTransport: vi.fn(() => ({
      sendMail: vi.fn(async (opts: any) => ({ messageId: "mocked-id", accepted: [opts.to] }))
    }))
  };
});

import { sendVerificationEmail, sendPasswordResetEmail } from "../../lib/mail";

describe("mail helpers", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("sends a verification email", async () => {
    const result = await sendVerificationEmail({ identifier: "test@example.com", url: "https://example.com/verify?token=abc", provider: {} });
    expect(result).toHaveProperty("messageId");
  });

  it("sends a password reset email", async () => {
    const result = await sendPasswordResetEmail({ email: "test@example.com", token: "abc", pid: "pid123" });
    expect(result).toHaveProperty("messageId");
  });
});
