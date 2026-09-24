import { usePaneFooter } from "gloomberb/components";
import type { SubstackAuthState } from "./api/types";
import {
  SUBSTACK_PANE_ID,
  type SubstackArticleSummary,
} from "./types";
import { cacheStatusLabel, type ActiveFeedState, type DetailState } from "./pane-state";

export function useSubstackPaneFooter({
  auth,
  detailOpen,
  activeFeedState,
  activeDetail,
  selectedArticle,
  errorInBody,
  openSelectedArticle,
}: {
  auth: SubstackAuthState | null;
  detailOpen: boolean;
  activeFeedState: ActiveFeedState;
  activeDetail: DetailState;
  selectedArticle: SubstackArticleSummary | null;
  /** The body already shows the feed failure, so the footer does not repeat it. */
  errorInBody: boolean;
  openSelectedArticle: () => void;
}) {
  const statusLabel = cacheStatusLabel(activeFeedState.fetchedAt, activeFeedState.stale);

  usePaneFooter(SUBSTACK_PANE_ID, () => ({
    info: [
      ...(activeFeedState.loading || activeFeedState.loadingMore ? [{ id: "loading", parts: [{ text: activeFeedState.loadingMore ? "loading more" : "loading", tone: "muted" as const }] }] : []),
      ...(activeDetail.loading && detailOpen ? [{ id: "detail-loading", parts: [{ text: "loading article", tone: "muted" as const }] }] : []),
      ...(statusLabel && auth ? [{ id: "cache", parts: [{ text: statusLabel, tone: activeFeedState.stale ? "warning" as const : "muted" as const }] }] : []),
      ...(activeFeedState.error && !errorInBody ? [{ id: "error", parts: [{ text: activeFeedState.error, tone: "warning" as const }] }] : []),
      ...(activeDetail.error && detailOpen ? [{ id: "detail-error", parts: [{ text: activeDetail.error, tone: "warning" as const }] }] : []),
    ],
    hints: auth
      ? [{ id: "open", key: "o", label: "pen", onPress: openSelectedArticle, disabled: !selectedArticle?.url }]
      : [],
  }), [
    activeDetail.error,
    activeDetail.loading,
    activeFeedState.error,
    activeFeedState.fetchedAt,
    activeFeedState.loading,
    activeFeedState.loadingMore,
    activeFeedState.stale,
    auth,
    detailOpen,
    errorInBody,
    openSelectedArticle,
    selectedArticle?.url,
    statusLabel,
  ]);
}
