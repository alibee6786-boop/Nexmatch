import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("nodemailer", () => {
  return {
    createTransport: vi.fn(() => ({
      sendMail: vi.fn(async (opts: any) => ({ messageId: "mocked-id", accepted: [opts.to] }))
    }))
  };
});

import { sendVerificationEmail } from "../../lib/mail";

describe("sendVerificationEmail", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("sends an email via nodemailer", async () => {
    const result = await sendVerificationEmail({ identifier: "test@example.com", url: "https://example.com/verify?token=abc", provider: {} });
    expect(result).toHaveProperty("messageId");
  });
});
