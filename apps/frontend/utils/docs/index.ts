"server only";

import fs from "fs";
import path from "path";

export interface DocItem {
  id: string;
  href: string;
  routePath: string;
  children?: DocItem[];
}

const walkDocs = (dir: string, baseRoute: string = "/docs"): DocItem[] => {
  try {
    return fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((item) => item.isDirectory())
      .map((dirItem) => {
        const fullPath = path.join(dir, dirItem.name);
        const routePath = `${baseRoute}/${dirItem.name}`;
        const hasPage =
          fs.existsSync(path.join(fullPath, "page.md")) ||
          fs.existsSync(path.join(fullPath, "page.mdx")) ||
          fs.existsSync(path.join(fullPath, "page.tsx"));
        const children = walkDocs(fullPath, routePath);

        return {
          id: dirItem.name,
          href: hasPage ? routePath : "",
          routePath,
          ...(children.length > 0 ? { children } : {}),
        };
      })
      .filter((item) => item.href || item.children?.length);
  } catch {
    return [];
  }
};

export const getDocsPaths = () => {
  const docsDir = path.join(process.cwd(), "src/app/(main)/docs");

  // 1. Get the sub-tree
  const tree = walkDocs(docsDir);

  // 2. Check if the root docs has a page (Introduction)
  const hasRootPage =
    fs.existsSync(path.join(docsDir, "page.md")) ||
    fs.existsSync(path.join(docsDir, "page.mdx")) ||
    fs.existsSync(path.join(docsDir, "page.tsx"));

  if (hasRootPage) {
    return [
      {
        id: "introduction",
        href: "/docs",
        routePath: "/docs",
      },
      ...tree,
    ];
  }

  return tree;
};
