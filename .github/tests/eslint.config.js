import html from "@html-eslint/eslint-plugin";

export default [
  {
    // recommended configuration included in the plugin
    ...html.configs["flat/recommended"],
    files: ["**/*.html"],
    rules: {
      ...html.configs["flat/recommended"].rules, // Must be defined. If not, all recommended rules will be lost
      "@html-eslint/no-inline-styles": "error",
      "@html-eslint/no-skip-heading-levels": "error",
      "@html-eslint/require-button-type": "error",
      "@html-eslint/require-meta-charset": "error",
      "@html-eslint/no-positive-tabindex": "error", // Если вам нужно ставить tabindex явно, то вы что то делаете не так.
      "@html-eslint/no-accesskey-attrs": "error", // https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey#accessibility_concerns
      "@html-eslint/no-aria-hidden-body": "error",
      "@html-eslint/id-naming-convention": ["error", "camelCase"],
      "@html-eslint/lowercase": "error",
      // "@html-eslint/no-multiple-empty-lines": "error", // to much for not having pre commit actions..
      // "@html-eslint/no-trailing-spaces": "error",
    },
  },
];
