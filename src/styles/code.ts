import { tint } from "@theme-ui/color"

export default {
  "[data-name='live-editor']": {
    padding: (t: any) => `${t.space[2]} !important`,
    fontSize: 1,
  },
  "[data-name='live-preview']": {
    padding: (t: any) => `calc(${t.space[2]} + 10px) !important`,
    backgroundColor: tint(`primary`, 0.7),
  },
  ".prism-code": {
    fontSize: 1,
    padding: 3,
    webkitOverflowScrolling: `touch`,
    backgroundColor: `transparent`,
    overflow: `initial`,
    float: `left`,
    minWidth: `100%`,
    mb: 0,
    '&[data-linenumber="false"]': {
      ".token-line": {
        pl: 3,
      },
    },
  },
  ".token": {
    display: `inline-block`,
  },
  "p > code": {
    fontSize: [2, 2, 3],
  },
  "ol code": {
    fontSize: 2,
  },
  "ul code": {
    fontSize: 2,
  },
  ".gatsby-highlight": {
    fontSize: 1,
    position: `relative`,
    webkitOverflowScrolling: `touch`,
    bg: `rgb(246, 248, 250)`,
    overflow: `auto`,
    mb: [3, 3, 4],
    ".token-line": {
    },
    "pre.language-": {
      mt: 0,
    },
    "pre.language-noLineNumbers": {
      mt: 0,
    },
    'pre[class*="language-"]:before': {
      bg: `white`,
      borderRadius: `0 0 0.25rem 0.25rem`,
      color: `black`,
      fontSize: `12px`,
      letterSpacing: `0.025rem`,
      padding: `0.1rem 0.5rem`,
      position: `absolute`,
      left: `1rem`,
      textAlign: `right`,
      textTransform: `uppercase`,
      top: 0,
    },
    'pre[class~="language-javascript"]:before': {
      content: `"js"`,
      background: `#f7df1e`,
      color: `black`,
    },
    'pre[class~="language-js"]:before': {
      content: `"js"`,
      background: `#f7df1e`,
      color: `black`,
    },
    'pre[class~="language-html"]:before': {
      content: `"html"`,
      background: `#005a9c`,
      color: `#fff`
    },
    'pre[class~="language-css"]:before': {
      content: `"css"`,
      background: `#ff9800`,
      color: `black`,
    },
    'pre[class~="language-text"]:before': {
      content: `"text"`,
    },
    "pre[class='language-shell']:before": {
      content: `'shell'`,
    },
    "pre[class='language-sh']:before": {
      content: `'sh'`,
    },
    "pre[class='language-json']:before, pre[class='language-json5']:before": {
      content: `'json'`,
      background: `linen`,
    },
    "pre[class~='language-vim']:before": {
      content: `'vim'`,
      background: `#019833`,
    },
    "pre[class~='language-rust']:before": {
      content: `'rust'`,
      background: `#C69F7C`,
    },
    "pre[class~='language-ruby']:before": {
      content: `'ruby'`,
      background: `#CD342D`,
    },
    "pre[class~='language-swift']:before": {
      content: `'swift'`,
      background: `#F48236`,
    },
    "pre[class~='language-scss']:before": {
      content: `'scss'`,
      background: `#CD6899`,
    },
    "pre[class~='language-json']:before": {
      content: `'json'`,
      background: `#3A9E28`,
    },
    "pre[class='language-diff']:before": {
      content: `'diff'`,
      background: `#e6ffed`,
    },
  },
  '.gatsby-highlight > code[class*="language-"], .gatsby-highlight > pre[class=*="language-"]': {
    wordSpacing: `normal`,
    wordBreak: `normal`,
    overflowWrap: `normal`,
    lineHeight: 1.5,
    tabSize: 4,
    hyphens: `none`,
  },
  ".line-number-style": {
    display: `inline-block`,
    width: `3em`,
    userSelect: `none`,
    opacity: 0.3,
    textAlign: `center`,
    position: `relative`,
  },
  ".code-title": {
    color: `black`,
    fontSize: 0,
    pb: 2,
    fontFamily: `monospace`,
  },
  "[data-name='live-preview'], [data-name='live-editor']": {
  },
  ".token-line": {
    pr: 3,
  },
  ".highlight-line": {
    backgroundColor: `#D7F0D2`,
    borderLeft: `4px solid #5DCF34`,
    ".line-number-style": {
      width: `calc(3em - 4px)`,
      opacity: 0.5,
      left: `-2px`,
    },
  },
}
