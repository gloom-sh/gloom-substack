import { memo, useMemo } from "react";
import { Box } from "gloomberb/ui";
import { Tabs } from "gloomberb/components";
import { tabIdForPublication } from "./table";
import {
  SUBSTACK_FEED_TAB_ID,
  type SubstackPublication,
} from "./types";
import { tabLabel } from "./pane-state";

export interface SubstackFeedTab {
  label: string;
  value: string;
}

export function useSubstackFeedTabs(subscriptions: SubstackPublication[]): SubstackFeedTab[] {
  return useMemo(() => [
    { label: "Feed", value: SUBSTACK_FEED_TAB_ID },
    ...subscriptions.map((publication) => ({
      label: tabLabel(publication.name),
      value: tabIdForPublication(publication),
    })),
  ], [subscriptions]);
}

// The terminal title bar has no room for tabs, so there the strip stays in the body.
export const SubstackFeedTabs = memo(function SubstackFeedTabs({
  tabs,
  activeTab,
  focused,
  onSelect,
}: {
  tabs: SubstackFeedTab[];
  activeTab: string;
  focused: boolean;
  onSelect: (tabId: string) => void;
}) {
  return (
    <Box height={1}>
      <Tabs
        tabs={tabs}
        activeValue={activeTab}
        onSelect={onSelect}
        compact
        variant="pill"
        focused={focused}
      />
    </Box>
  );
});
