import { useCallback, useEffect, useRef, useState } from "react";
import { Box, Text, type InputRenderable } from "gloomberb/ui";
import { Button, Notice, TextField, usePaneFooter } from "gloomberb/components";
import { isPlainKey } from "gloomberb/utils";
import { colors } from "gloomberb/theme";
import {
  completeSubstackMagicLink,
  completeSubstackOtpLogin,
  requestSubstackMagicLink,
} from "./api/auth";
import type {
  SubstackAuthState,
} from "./api/types";
import { errorMessage } from "./pane-state";

const LOGIN_FIELD_MAX_WIDTH = 42;

export function SubstackLoginView({
  width,
  height,
  focused,
  onLogin,
}: {
  width: number;
  height: number;
  focused: boolean;
  onLogin: (auth: SubstackAuthState) => void;
}) {
  const [email, setEmail] = useState("");
  const [loginToken, setLoginToken] = useState("");
  const [phase, setPhase] = useState<"email" | "link">("email");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const emailRef = useRef<InputRenderable | null>(null);
  const linkRef = useRef<InputRenderable | null>(null);
  const fieldWidth = Math.max(12, Math.min(LOGIN_FIELD_MAX_WIDTH, width - 2));

  useEffect(() => {
    if (!focused) return;
    const input = phase === "email" ? emailRef.current : linkRef.current;
    input?.focus?.();
  }, [focused, phase]);

  const requestLink = useCallback(() => {
    if (busy) return;
    setBusy(true);
    setError(null);
    requestSubstackMagicLink(email)
      .then(() => {
        setPhase("link");
      })
      .catch((requestError) => setError(errorMessage(requestError)))
      .finally(() => setBusy(false));
  }, [busy, email]);

  const completeLogin = useCallback(() => {
    if (busy) return;
    setBusy(true);
    setError(null);
    const token = loginToken.trim();
    const login = /^\d{6}$/.test(token)
      ? completeSubstackOtpLogin(token, email)
      : completeSubstackMagicLink(token, email);
    login
      .then(onLogin)
      .catch((loginError) => setError(errorMessage(loginError)))
      .finally(() => setBusy(false));
  }, [busy, email, loginToken, onLogin]);

  const changeEmail = useCallback(() => {
    if (busy) return;
    setPhase("email");
    setLoginToken("");
    setError(null);
  }, [busy]);

  // The buttons already say what submits; the footer only carries the request in flight.
  usePaneFooter("substack-login", () => ({
    info: busy
      ? [{ id: "busy", parts: [{ text: phase === "email" ? "sending link" : "logging in", tone: "muted" as const }] }]
      : [],
  }), [busy, phase]);

  return (
    <Box flexDirection="column" width={width} height={height} paddingX={1} paddingY={1} gap={1}>
      <Text fg={colors.textDim} wrapText>
        {phase === "email"
          ? "Sign in to read your subscriptions."
          : `Paste the 6-digit code or the link Substack sent to ${email.trim()}.`}
      </Text>
      {phase === "email" ? (
        <>
          <TextField
            label="Email"
            value={email}
            placeholder="you@example.com"
            width={fieldWidth}
            type="email"
            autoComplete="email"
            inputRef={emailRef}
            focused={focused}
            onChange={setEmail}
            onSubmit={requestLink}
          />
          <Box flexDirection="row" gap={1}>
            <Button
              label={busy ? "Sending..." : "Send magic link"}
              variant="primary"
              disabled={busy || !email.trim()}
              onPress={requestLink}
            />
          </Box>
        </>
      ) : (
        <>
          <TextField
            label="Code or magic link"
            value={loginToken}
            placeholder="123456 or https://substack.com/..."
            width={fieldWidth}
            inputRef={linkRef}
            focused={focused}
            onChange={setLoginToken}
            onSubmit={completeLogin}
            onKeyDown={(event) => {
              if (!isPlainKey(event, "escape")) return;
              event.preventDefault();
              event.stopPropagation();
              changeEmail();
            }}
          />
          <Box flexDirection="row" gap={1}>
            <Button
              label={busy ? "Logging in..." : "Log in"}
              variant="primary"
              disabled={busy || !loginToken.trim()}
              onPress={completeLogin}
            />
            <Button
              label="Change email"
              variant="secondary"
              disabled={busy}
              onPress={changeEmail}
            />
          </Box>
        </>
      )}
      {error ? <Notice tone="negative">{error}</Notice> : null}
    </Box>
  );
}
