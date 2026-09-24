import { useCallback, type ReactNode, type RefObject } from "react";
import { TextAttributes, type ScrollBoxRenderable } from "gloomberb/ui";
import {
  DataTableStackView,
  loadingText,
  type DataTableCell,
  type DataTableKeyEvent,
} from "gloomberb/components";
import { colors } from "gloomberb/theme";
import {
  formatPublishedAt,
  formatReadTime,
} from "./table";
import type {
  SubstackArticleSummary,
  SubstackColumn,
  SubstackPublication,
  SubstackSortColumnId,
  SubstackSortDirection,
} from "./types";
import type { ActiveFeedState } from "./pane-state";

export function SubstackArticleStack({
  focused,
  detailOpen,
  selectedArticle,
  selectedArticleId,
  readArticleIds,
  detailContent,
  activePublication,
  activeFeedState,
  sortedRows,
  sort,
  columns,
  tableScrollRef,
  width,
  height,
  onBack,
  onActivate,
  onSelectionChange,
  onRootKeyDown,
  onDetailKeyDown,
  onBodyScrollActivity,
  onHeaderClick,
}: {
  focused: boolean;
  detailOpen: boolean;
  selectedArticle: SubstackArticleSummary | null;
  selectedArticleId: string | null;
  readArticleIds: ReadonlySet<string>;
  detailContent: ReactNode;
  activePublication: SubstackPublication | null;
  activeFeedState: ActiveFeedState;
  sortedRows: SubstackArticleSummary[];
  sort: { columnId: SubstackSortColumnId; direction: SubstackSortDirection };
  columns: SubstackColumn[];
  tableScrollRef: RefObject<ScrollBoxRenderable | null>;
  width: number;
  height: number;
  onBack: () => void;
  onActivate: (article: SubstackArticleSummary) => void;
  onSelectionChange: (id: string) => void;
  onRootKeyDown: (event: DataTableKeyEvent) => boolean;
  onDetailKeyDown: (event: DataTableKeyEvent) => boolean;
  onBodyScrollActivity: () => void;
  onHeaderClick: (columnId: string) => void;
}) {
  const renderCell = useCallback((
    article: SubstackArticleSummary,
    column: SubstackColumn,
    _index: number,
    rowState: { selected: boolean },
  ): DataTableCell => {
    const selectedColor = rowState.selected ? colors.selectedText : undefined;
    switch (column.id) {
      case "published":
        return { text: formatPublishedAt(article.publishedAt), color: selectedColor ?? colors.textDim };
      case "publication":
        return { text: article.publicationName ?? "-", color: selectedColor ?? colors.textBright };
      case "title":
        return {
          text: article.title,
          color: selectedColor ?? colors.text,
          attributes: readArticleIds.has(article.id)
            ? TextAttributes.NONE
            : TextAttributes.BOLD,
        };
      case "read":
        return {
          text: formatReadTime(article.readMinutes),
          color: selectedColor ?? colors.textDim,
        };
    }
  }, [readArticleIds]);

  // Loading and failures are footer status; the empty body only names the state.
  const emptyStateTitle = activeFeedState.loading
    ? loadingText("articles")
    : activeFeedState.error
      ? activePublication ? "Archive unavailable." : "Feed unavailable."
      : "No articles.";

  return (
    <DataTableStackView<SubstackArticleSummary, SubstackColumn>
      focused={focused}
      detailOpen={detailOpen}
      onBack={onBack}
      detailTitle={selectedArticle?.title}
      detailContent={detailContent}
      selection={{
        kind: "id",
        selectedId: selectedArticleId,
        getId: (article) => article.id,
        onChange: onSelectionChange,
      }}
      onActivate={onActivate}
      onRootKeyDown={onRootKeyDown}
      onDetailKeyDown={onDetailKeyDown}
      onBodyScrollActivity={onBodyScrollActivity}
      scrollRef={tableScrollRef}
      rootWidth={width}
      rootHeight={height}
      columns={columns}
      items={sortedRows}
      sortColumnId={sort.columnId}
      sortDirection={sort.direction}
      onHeaderClick={onHeaderClick}
      getItemKey={(article) => article.id}
      renderCell={renderCell}
      emptyStateTitle={emptyStateTitle}
    />
  );
}
