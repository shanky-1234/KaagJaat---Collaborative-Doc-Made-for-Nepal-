import type { Descendant } from "slate";
import type { PaginatedContent } from "@/types/pagination";

interface PaginateContentOptions {
  content: Descendant[];
  usableHeight: number;
  blockHeights: number[];
}

export const calculatePage = ({
  content,
  usableHeight,
  blockHeights,
}: PaginateContentOptions): PaginatedContent => {
  const pages: PaginatedContent = [];

  let currentPage: Descendant[] = [];
  let currentHeight = 0;

  content.forEach((block, index) => {
    const blockHeight = blockHeights[index] ?? 0;

    if (
      currentPage.length > 0 &&
      currentHeight + blockHeight > usableHeight
    ) {
      pages.push(currentPage);

      currentPage = [];
      currentHeight = 0;
    }

    currentPage.push(block);
    currentHeight += blockHeight;
  });

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return pages;
};