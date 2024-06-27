import globals from "globals";
import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import antfu from "@antfu/eslint-config";

export default [

  {files: ["**/*.{js,mjs,cjs,vue}"]},
  {languageOptions: { globals: {...globals.browser, google:true,state:true,nextTick:true,watch:true} }},
  pluginJs.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  {
    rules: {
      'no-unused-imports': 'off', 
      'no-unused-vars': 'off', 
    },
  },
];
