import type { CollectionEntry } from "astro:content";
import { postFilter } from "./postFilter";
import { slugifyStr } from "./slugify";

export function getUniqueCategories(posts: CollectionEntry<"posts">[]) {
  return posts
    .filter(postFilter)
    .flatMap(post => post.data.categories)
    .map(category => ({
      category: slugifyStr(category),
      categoryName: category,
    }))
    .filter(
      (value, index, self) =>
        self.findIndex(item => item.category === value.category) === index
    )
    .sort((a, b) => a.category.localeCompare(b.category));
}
