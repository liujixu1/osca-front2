<template>
  <div class="monaco-main">
    <div class="monaco-header">
      <span
        >{{ type === 'local' ? '本地文件' : '开源文件' }}:{{
          lineCount
        }}行</span
      >
      <v-btn small @click="jump" type="text">下一段</v-btn>
    </div>
    <div class="ed">
      <div
        ref="container"
        class="monaco-editor"
        :style="{ height: height, width: '100%' }"
      ></div>
    </div>
  </div>
</template>
<script>
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
export default {
  name: 'MonacoEditor',
  props: {
    opts: {
      type: Object,
      default() {
        return {}
      }
    },
    type: {
      type: String
    },
    getCodeCheckDetail: {
      type: Object
    },
    filePath: {
      type: String
    },
    code: {
      type: String,
      default:
        "#include \"util.h\"\n#include \"linux/string.h\"\n\n#define K 1024LL\n/*\n * perf_atoll()\n * Parse (\\d+)(b|B|kb|KB|mb|MB|gb|GB|tb|TB) (e.g. \"256MB\")\n * and return its numeric value\n */\ns64 perf_atoll(const char *str)\n{\n\ts64 length;\n\tchar *p;\n\tchar c;\n\n\tif (!isdigit(str[0]))\n\t\tgoto out_err;\n\n\tlength = strtoll(str, &p, 10);\n\tswitch (c = *p++) {\n\t\tcase 'b': case 'B':\n\t\t\tif (*p)\n\t\t\t\tgoto out_err;\n\t\tcase '\\0':\n\t\t\treturn length;\n\t\tdefault:\n\t\t\tgoto out_err;\n\t\t/* two-letter suffices */\n\t\tcase 'k': case 'K':\n\t\t\tlength <<= 10;\n\t\t\tbreak;\n\t\tcase 'm': case 'M':\n\t\t\tlength <<= 20;\n\t\t\tbreak;\n\t\tcase 'g': case 'G':\n\t\t\tlength <<= 30;\n\t\t\tbreak;\n\t\tcase 't': case 'T':\n\t\t\tlength <<= 40;\n\t\t\tbreak;\n\t}\n\t/* we want the cases to match */\n\tif (islower(c)) {\n\t\tif (strcmp(p, \"b\") != 0)\n\t\t\tgoto out_err;\n\t} else {\n\t\tif (strcmp(p, \"B\") != 0)\n\t\t\tgoto out_err;\n\t}\n\treturn length;\n\nout_err:\n\treturn -1;\n}\n\n/*\n * Helper function for splitting a string into an argv-like array.\n * originally copied from lib/argv_split.c\n */\nstatic const char *skip_sep(const char *cp)\n{\n\twhile (*cp && isspace(*cp))\n\t\tcp++;\n\n\treturn cp;\n}\n\nstatic const char *skip_arg(const char *cp)\n{\n\twhile (*cp && !isspace(*cp))\n\t\tcp++;\n\n\treturn cp;\n}\n\nstatic int count_argc(const char *str)\n{\n\tint count = 0;\n\n\twhile (*str) {\n\t\tstr = skip_sep(str);\n\t\tif (*str) {\n\t\t\tcount++;\n\t\t\tstr = skip_arg(str);\n\t\t}\n\t}\n\n\treturn count;\n}\n\n/**\n * argv_free - free an argv\n * @argv - the argument vector to be freed\n *\n * Frees an argv and the strings it points to.\n */\nvoid argv_free(char **argv)\n{\n\tchar **p;\n\tfor (p = argv; *p; p++)\n\t\tzfree(p);\n\n\tfree(argv);\n}\n\n/**\n * argv_split - split a string at whitespace, returning an argv\n * @str: the string to be split\n * @argcp: returned argument count\n *\n * Returns an array of pointers to strings which are split out from\n * @str.  This is performed by strictly splitting on white-space; no\n * quote processing is performed.  Multiple whitespace characters are\n * considered to be a single argument separator.  The returned array\n * is always NULL-terminated.  Returns NULL on memory allocation\n * failure.\n */\nchar **argv_split(const char *str, int *argcp)\n{\n\tint argc = count_argc(str);\n\tchar **argv = zalloc(sizeof(*argv) * (argc+1));\n\tchar **argvp;\n\n\tif (argv == NULL)\n\t\tgoto out;\n\n\tif (argcp)\n\t\t*argcp = argc;\n\n\targvp = argv;\n\n\twhile (*str) {\n\t\tstr = skip_sep(str);\n\n\t\tif (*str) {\n\t\t\tconst char *p = str;\n\t\t\tchar *t;\n\n\t\t\tstr = skip_arg(str);\n\n\t\t\tt = strndup(p, str-p);\n\t\t\tif (t == NULL)\n\t\t\t\tgoto fail;\n\t\t\t*argvp++ = t;\n\t\t}\n\t}\n\t*argvp = NULL;\n\nout:\n\treturn argv;\n\nfail:\n\targv_free(argv);\n\treturn NULL;\n}\n\n/* Character class matching */\nstatic bool __match_charclass(const char *pat, char c, const char **npat)\n{\n\tbool complement = false, ret = true;\n\n\tif (*pat == '!') {\n\t\tcomplement = true;\n\t\tpat++;\n\t}\n\tif (*pat++ == c)\t/* First character is special */\n\t\tgoto end;\n\n\twhile (*pat && *pat != ']') {\t/* Matching */\n\t\tif (*pat == '-' && *(pat + 1) != ']') {\t/* Range */\n\t\t\tif (*(pat - 1) <= c && c <= *(pat + 1))\n\t\t\t\tgoto end;\n\t\t\tif (*(pat - 1) > *(pat + 1))\n\t\t\t\tgoto error;\n\t\t\tpat += 2;\n\t\t} else if (*pat++ == c)\n\t\t\tgoto end;\n\t}\n\tif (!*pat)\n\t\tgoto error;\n\tret = false;\n\nend:\n\twhile (*pat && *pat != ']')\t/* Searching closing */\n\t\tpat++;\n\tif (!*pat)\n\t\tgoto error;\n\t*npat = pat + 1;\n\treturn complement ? !ret : ret;\n\nerror:\n\treturn false;\n}\n\n/* Glob/lazy pattern matching */\nstatic bool __match_glob(const char *str, const char *pat, bool ignore_space)\n{\n\twhile (*str && *pat && *pat != '*') {\n\t\tif (ignore_space) {\n\t\t\t/* Ignore spaces for lazy matching */\n\t\t\tif (isspace(*str)) {\n\t\t\t\tstr++;\n\t\t\t\tcontinue;\n\t\t\t}\n\t\t\tif (isspace(*pat)) {\n\t\t\t\tpat++;\n\t\t\t\tcontinue;\n\t\t\t}\n\t\t}\n\t\tif (*pat == '?') {\t/* Matches any single character */\n\t\t\tstr++;\n\t\t\tpat++;\n\t\t\tcontinue;\n\t\t} else if (*pat == '[')\t/* Character classes/Ranges */\n\t\t\tif (__match_charclass(pat + 1, *str, &pat)) {\n\t\t\t\tstr++;\n\t\t\t\tcontinue;\n\t\t\t} else\n\t\t\t\treturn false;\n\t\telse if (*pat == '\\\\') /* Escaped char match as normal char */\n\t\t\tpat++;\n\t\tif (*str++ != *pat++)\n\t\t\treturn false;\n\t}\n\t/* Check wild card */\n\tif (*pat == '*') {\n\t\twhile (*pat == '*')\n\t\t\tpat++;\n\t\tif (!*pat)\t/* Tail wild card matches all */\n\t\t\treturn true;\n\t\twhile (*str)\n\t\t\tif (__match_glob(str++, pat, ignore_space))\n\t\t\t\treturn true;\n\t}\n\treturn !*str && !*pat;\n}\n\n/**\n * strglobmatch - glob expression pattern matching\n * @str: the target string to match\n * @pat: the pattern string to match\n *\n * This returns true if the @str matches @pat. @pat can includes wildcards\n * ('*','?') and character classes ([CHARS], complementation and ranges are\n * also supported). Also, this supports escape character ('\\') to use special\n * characters as normal character.\n *\n * Note: if @pat syntax is broken, this always returns false.\n */\nbool strglobmatch(const char *str, const char *pat)\n{\n\treturn __match_glob(str, pat, false);\n}\n\n/**\n * strlazymatch - matching pattern strings lazily with glob pattern\n * @str: the target string to match\n * @pat: the pattern string to match\n *\n * This is similar to strglobmatch, except this ignores spaces in\n * the target string.\n */\nbool strlazymatch(const char *str, const char *pat)\n{\n\treturn __match_glob(str, pat, true);\n}\n\n/**\n * strtailcmp - Compare the tail of two strings\n * @s1: 1st string to be compared\n * @s2: 2nd string to be compared\n *\n * Return 0 if whole of either string is same as another's tail part.\n */\nint strtailcmp(const char *s1, const char *s2)\n{\n\tint i1 = strlen(s1);\n\tint i2 = strlen(s2);\n\twhile (--i1 >= 0 && --i2 >= 0) {\n\t\tif (s1[i1] != s2[i2])\n\t\t\treturn s1[i1] - s2[i2];\n\t}\n\treturn 0;\n}\n\n/**\n * strxfrchar - Locate and replace character in @s\n * @s:    The string to be searched/changed.\n * @from: Source character to be replaced.\n * @to:   Destination character.\n *\n * Return pointer to the changed string.\n */\nchar *strxfrchar(char *s, char from, char to)\n{\n\tchar *p = s;\n\n\twhile ((p = strchr(p, from)) != NULL)\n\t\t*p++ = to;\n\n\treturn s;\n}\n\n/**\n * ltrim - Removes leading whitespace from @s.\n * @s: The string to be stripped.\n *\n * Return pointer to the first non-whitespace character in @s.\n */\nchar *ltrim(char *s)\n{\n\tint len = strlen(s);\n\n\twhile (len && isspace(*s)) {\n\t\tlen--;\n\t\ts++;\n\t}\n\n\treturn s;\n}\n\n/**\n * rtrim - Removes trailing whitespace from @s.\n * @s: The string to be stripped.\n *\n * Note that the first trailing whitespace is replaced with a %NUL-terminator\n * in the given string @s. Returns @s.\n */\nchar *rtrim(char *s)\n{\n\tsize_t size = strlen(s);\n\tchar *end;\n\n\tif (!size)\n\t\treturn s;\n\n\tend = s + size - 1;\n\twhile (end >= s && isspace(*end))\n\t\tend--;\n\t*(end + 1) = '\\0';\n\n\treturn s;\n}\n\n/**\n * memdup - duplicate region of memory\n * @src: memory region to duplicate\n * @len: memory region length\n */\nvoid *memdup(const void *src, size_t len)\n{\n\tvoid *p;\n\n\tp = malloc(len);\n\tif (p)\n\t\tmemcpy(p, src, len);\n\n\treturn p;\n}\n"
    },
    hits: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      height: '300px',
      lineCount: 0,
      currentLine: '',
      LineList: [],
      // 主要配置
      defaultOpts: {
        value: '', // 编辑器的值
        theme: 'vs', // 编辑器主题：vs, hc-black, or vs-dark，更多选择详见官网
        roundedSelection: true, // 右侧不显示编辑器预览框
        autoIndent: true // 自动缩进
      },
      // 编辑器对象
      monacoEditor: {}
    }
  },
  watch: {
    // row: {
    //   handler() {
    //     this.init()
    //   },
    //   deep: true
    // }
  },
  methods: {
    test() {
      this.monacoEditor.revealLineInCenter(50)
    },
    jump() {
      let index = this.LineList.indexOf(this.currentLine)
      if (index >= 0 && index < this.LineList.length - 1) {
        this.monacoEditor.revealLineInCenter(this.LineList[index + 1] + 10)
        this.currentLine = this.LineList[index + 1]
      } else {
        this.monacoEditor.revealLineInCenter(this.LineList[0] + 10)
        this.currentLine = this.LineList[0]
      }
    },
    async init() {
      // 初始化container的内容，销毁之前生成的编辑器
      this.$refs.container.innerHTML = ''
      // 生成编辑器配置
      let editorOptions = Object.assign(this.defaultOpts, this.opts)
      editorOptions.value = this.code
      debugger
      editorOptions.readOnly = true
      editorOptions.language = 'java'
      this.monacoEditor = monaco.editor.create(
        this.$refs.container,
        editorOptions
      )
      // 生成编辑器配置
      this.monacoEditor.updateOptions({ minimap: { enabled: false } })
      // 获取代码行数
      this.lineCount = this.monacoEditor.getModel().getLineCount()
      this.currentLine = ''
      this.LineList = []
      // 高亮特定行
      this.lineHeight()
      this.jump()
    },
    lineHeight() {
      this.hits=[{startLine:10,endLine:30}]
      this.hits.forEach(item => {
        this.LineList.push(item.startLine)
        this.monacoEditor.deltaDecorations(
          [],
          [
            {
              range: new monaco.Range(item.startLine, 1, item.endLine, 1),
              options: {
                isWholeLine: true,
                className: 'markLines',
                glyphMarginClassName: 'markLines'
              }
            }
          ]
        )
      })
    },
    getVal() {},
    resize() {
      this.height = window.screen.height - 280 + 'px'
      console.log(this.height)
    }
  },
  created() {
    this.resize()
  },
  mounted() {
    this.init()
    // window.addEventListener('resize',this.resize)
  }
  // beforeDestroy(){
  //   window.removeEventListener(this.resize)
  // }
}
</script>
<style scoped lang="scss" scoped>
.monaco-main {
  box-sizing: content-box;
  border: 2px solid red;
  .monaco-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px 5px;
    font-size: 14px;
    span {
      font-weight: 400;
    }
  }
  .ed {
    display: flex;
  }
  .monaco-editor {
    user-select: none !important;
    * {
      user-select: none !important;
    }
  }
}
</style>
<style lang="scss">
.markLines {
  background: #eef07d;
}
.monaco-editor {
  user-select: none !important;
  * {
    user-select: none !important;
  }
}
</style>
