/** Helpers for hierarchical product/project categories. */

export function buildCategoryTree(categories) {
  const nodes = new Map(
    categories.map((category) => [category.id, { ...category, children: [] }])
  );
  const roots = [];

  for (const category of categories) {
    const node = nodes.get(category.id);
    if (category.parentId && nodes.has(category.parentId)) {
      nodes.get(category.parentId).children.push(node);
    } else {
      roots.push(node);
    }
  }

  const sortNodes = (list) =>
    list.sort(
      (a, b) =>
        (a.sortOrder ?? 0) - (b.sortOrder ?? 0) ||
        a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
    );

  const walk = (list) => {
    sortNodes(list);
    list.forEach((node) => walk(node.children));
  };

  walk(roots);
  return roots;
}

export function categoryOptionPath(parentPath, name) {
  return parentPath ? `${parentPath} › ${name}` : name;
}

export function flattenCategoryOptions(categories, type) {
  const filtered = categories.filter((category) => category.type === type);
  const tree = buildCategoryTree(filtered);
  const options = [];

  const walk = (nodes, parentPath = '') => {
    for (const node of nodes) {
      const value = categoryOptionPath(parentPath, node.name);
      options.push({
        id: node.id,
        value,
        label: value,
        name: node.name,
        parentId: node.parentId,
        depth: value.split(' › ').length - 1,
      });
      if (node.children.length) walk(node.children, value);
    }
  };

  walk(tree);
  return options;
}

export function descendantCategoryValues(categoryId, categories) {
  const tree = buildCategoryTree(categories.filter((category) => category.type === 'PRODUCT'));
  const values = new Set();

  const walk = (node, path = '') => {
    const value = categoryOptionPath(path, node.name);
    values.add(value);
    values.add(node.name);
    node.children.forEach((child) => walk(child, value));
  };

  const find = (nodes) => {
    for (const node of nodes) {
      if (node.id === categoryId) {
        walk(node);
        return true;
      }
      if (find(node.children)) return true;
    }
    return false;
  };

  find(tree);
  return [...values];
}

export function productMatchesCategory(productCategory, filterValue, categories) {
  if (!filterValue || filterValue === 'All') return true;
  if (!productCategory) return false;
  if (productCategory === filterValue) return true;

  const matched = categories.find(
    (category) =>
      category.type === 'PRODUCT' &&
      (category.name === filterValue ||
        categoryOptionPath('', category.name) === filterValue)
  );

  if (!matched) {
    return productCategory === filterValue || productCategory.startsWith(`${filterValue} ›`);
  }

  const allowed = descendantCategoryValues(matched.id, categories);
  return allowed.some(
    (value) => productCategory === value || productCategory.startsWith(`${value} ›`)
  );
}

export function rootProductCategories(categories) {
  return buildCategoryTree(categories.filter((category) => category.type === 'PRODUCT'));
}

export function getCategoryPath(categoryId, categories) {
  const byId = new Map(categories.map((category) => [category.id, category]));
  const parts = [];
  let current = byId.get(categoryId);

  while (current) {
    parts.unshift(current.name);
    current = current.parentId ? byId.get(current.parentId) : null;
  }

  return parts.join(' › ');
}

export function replaceCategoryPathPrefix(categoryValue, oldPrefix, newPrefix) {
  if (!categoryValue) return categoryValue;
  if (categoryValue === oldPrefix) return newPrefix;
  if (categoryValue.startsWith(`${oldPrefix} ›`)) {
    return `${newPrefix}${categoryValue.slice(oldPrefix.length)}`;
  }
  return categoryValue;
}
