/* http://prismjs.com/download.html?themes=prism&languages=markup+css+clike+javascript+bash+css-extras+dart+diff+docker+json+less+markdown+jsx+sass+scss+typescript&plugins=line-numbers+autolinker+toolbar+previewer-base+previewer-color+previewer-gradient+previewer-easing */
var _self =
    'undefined' != typeof window
      ? window
      : 'undefined' != typeof WorkerGlobalScope &&
        self instanceof WorkerGlobalScope
        ? self
        : {},
  Prism = (function() {
    var e = /\blang(?:uage)?-(\w+)\b/i,
      t = 0,
      n = (_self.Prism = {
        manual: _self.Prism && _self.Prism.manual,
        util: {
          encode: function(e) {
            return e instanceof a
              ? new a(e.type, n.util.encode(e.content), e.alias)
              : 'Array' === n.util.type(e)
                ? e.map(n.util.encode)
                : e
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/\u00a0/g, ' ')
          },
          type: function(e) {
            return Object.prototype.toString
              .call(e)
              .match(/\[object (\w+)\]/)[1]
          },
          objId: function(e) {
            return (
              e.__id || Object.defineProperty(e, '__id', {value: ++t}), e.__id
            )
          },
          clone: function(e) {
            var t = n.util.type(e)
            switch (t) {
              case 'Object':
                var a = {}
                for (var r in e)
                  e.hasOwnProperty(r) && (a[r] = n.util.clone(e[r]))
                return a
              case 'Array':
                return (
                  e.map &&
                  e.map(function(e) {
                    return n.util.clone(e)
                  })
                )
            }
            return e
          },
        },
        languages: {
          extend: function(e, t) {
            var a = n.util.clone(n.languages[e])
            for (var r in t) a[r] = t[r]
            return a
          },
          insertBefore: function(e, t, a, r) {
            r = r || n.languages
            var l = r[e]
            if (2 == arguments.length) {
              a = arguments[1]
              for (var i in a) a.hasOwnProperty(i) && (l[i] = a[i])
              return l
            }
            var o = {}
            for (var s in l)
              if (l.hasOwnProperty(s)) {
                if (s == t)
                  for (var i in a) a.hasOwnProperty(i) && (o[i] = a[i])
                o[s] = l[s]
              }
            return (
              n.languages.DFS(n.languages, function(t, n) {
                n === r[e] && t != e && (this[t] = o)
              }),
              (r[e] = o)
            )
          },
          DFS: function(e, t, a, r) {
            r = r || {}
            for (var l in e)
              e.hasOwnProperty(l) &&
                (t.call(e, l, e[l], a || l),
                'Object' !== n.util.type(e[l]) || r[n.util.objId(e[l])]
                  ? 'Array' !== n.util.type(e[l]) ||
                    r[n.util.objId(e[l])] ||
                    ((r[n.util.objId(e[l])] = !0),
                    n.languages.DFS(e[l], t, l, r))
                  : ((r[n.util.objId(e[l])] = !0),
                    n.languages.DFS(e[l], t, null, r)))
          },
        },
        plugins: {},
        highlightAll: function(e, t) {
          var a = {
            callback: t,
            selector:
              'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code',
          }
          n.hooks.run('before-highlightall', a)
          for (
            var r,
              l = a.elements || document.querySelectorAll(a.selector),
              i = 0;
            (r = l[i++]);

          )
            n.highlightElement(r, e === !0, a.callback)
        },
        highlightElement: function(t, a, r) {
          for (var l, i, o = t; o && !e.test(o.className); ) o = o.parentNode
          o &&
            ((l = (o.className.match(e) || [, ''])[1].toLowerCase()),
            (i = n.languages[l])),
            (t.className =
              t.className.replace(e, '').replace(/\s+/g, ' ') +
              ' language-' +
              l),
            (o = t.parentNode),
            /pre/i.test(o.nodeName) &&
              (o.className =
                o.className.replace(e, '').replace(/\s+/g, ' ') +
                ' language-' +
                l)
          var s = t.textContent,
            u = {element: t, language: l, grammar: i, code: s}
          if ((n.hooks.run('before-sanity-check', u), !u.code || !u.grammar))
            return (
              u.code && (u.element.textContent = u.code),
              n.hooks.run('complete', u),
              void 0
            )
          if ((n.hooks.run('before-highlight', u), a && _self.Worker)) {
            var g = new Worker(n.filename)
            ;(g.onmessage = function(e) {
              ;(u.highlightedCode = e.data),
                n.hooks.run('before-insert', u),
                (u.element.innerHTML = u.highlightedCode),
                r && r.call(u.element),
                n.hooks.run('after-highlight', u),
                n.hooks.run('complete', u)
            }),
              g.postMessage(
                JSON.stringify({
                  language: u.language,
                  code: u.code,
                  immediateClose: !0,
                }),
              )
          } else
            (u.highlightedCode = n.highlight(u.code, u.grammar, u.language)),
              n.hooks.run('before-insert', u),
              (u.element.innerHTML = u.highlightedCode),
              r && r.call(t),
              n.hooks.run('after-highlight', u),
              n.hooks.run('complete', u)
        },
        highlight: function(e, t, r) {
          var l = n.tokenize(e, t)
          return a.stringify(n.util.encode(l), r)
        },
        tokenize: function(e, t) {
          var a = n.Token,
            r = [e],
            l = t.rest
          if (l) {
            for (var i in l) t[i] = l[i]
            delete t.rest
          }
          e: for (var i in t)
            if (t.hasOwnProperty(i) && t[i]) {
              var o = t[i]
              o = 'Array' === n.util.type(o) ? o : [o]
              for (var s = 0; s < o.length; ++s) {
                var u = o[s],
                  g = u.inside,
                  c = !!u.lookbehind,
                  h = !!u.greedy,
                  f = 0,
                  d = u.alias
                if (h && !u.pattern.global) {
                  var p = u.pattern.toString().match(/[imuy]*$/)[0]
                  u.pattern = RegExp(u.pattern.source, p + 'g')
                }
                u = u.pattern || u
                for (var m = 0, y = 0; m < r.length; y += r[m].length, ++m) {
                  var v = r[m]
                  if (r.length > e.length) break e
                  if (!(v instanceof a)) {
                    u.lastIndex = 0
                    var b = u.exec(v),
                      k = 1
                    if (!b && h && m != r.length - 1) {
                      if (((u.lastIndex = y), (b = u.exec(e)), !b)) break
                      for (
                        var w = b.index + (c ? b[1].length : 0),
                          _ = b.index + b[0].length,
                          P = m,
                          A = y,
                          j = r.length;
                        j > P && _ > A;
                        ++P
                      )
                        (A += r[P].length), w >= A && (++m, (y = A))
                      if (r[m] instanceof a || r[P - 1].greedy) continue
                      ;(k = P - m), (v = e.slice(y, A)), (b.index -= y)
                    }
                    if (b) {
                      c && (f = b[1].length)
                      var w = b.index + f,
                        b = b[0].slice(f),
                        _ = w + b.length,
                        x = v.slice(0, w),
                        O = v.slice(_),
                        S = [m, k]
                      x && S.push(x)
                      var N = new a(i, g ? n.tokenize(b, g) : b, d, b, h)
                      S.push(N),
                        O && S.push(O),
                        Array.prototype.splice.apply(r, S)
                    }
                  }
                }
              }
            }
          return r
        },
        hooks: {
          all: {},
          add: function(e, t) {
            var a = n.hooks.all
            ;(a[e] = a[e] || []), a[e].push(t)
          },
          run: function(e, t) {
            var a = n.hooks.all[e]
            if (a && a.length) for (var r, l = 0; (r = a[l++]); ) r(t)
          },
        },
      }),
      a = (n.Token = function(e, t, n, a, r) {
        ;(this.type = e),
          (this.content = t),
          (this.alias = n),
          (this.length = 0 | (a || '').length),
          (this.greedy = !!r)
      })
    if (
      ((a.stringify = function(e, t, r) {
        if ('string' == typeof e) return e
        if ('Array' === n.util.type(e))
          return e
            .map(function(n) {
              return a.stringify(n, t, e)
            })
            .join('')
        var l = {
          type: e.type,
          content: a.stringify(e.content, t, r),
          tag: 'span',
          classes: ['token', e.type],
          attributes: {},
          language: t,
          parent: r,
        }
        if (
          ('comment' == l.type && (l.attributes.spellcheck = 'true'), e.alias)
        ) {
          var i = 'Array' === n.util.type(e.alias) ? e.alias : [e.alias]
          Array.prototype.push.apply(l.classes, i)
        }
        n.hooks.run('wrap', l)
        var o = Object.keys(l.attributes)
          .map(function(e) {
            return (
              e + '="' + (l.attributes[e] || '').replace(/"/g, '&quot;') + '"'
            )
          })
          .join(' ')
        return (
          '<' +
          l.tag +
          ' class="' +
          l.classes.join(' ') +
          '"' +
          (o ? ' ' + o : '') +
          '>' +
          l.content +
          '</' +
          l.tag +
          '>'
        )
      }),
      !_self.document)
    )
      return _self.addEventListener
        ? (_self.addEventListener(
            'message',
            function(e) {
              var t = JSON.parse(e.data),
                a = t.language,
                r = t.code,
                l = t.immediateClose
              _self.postMessage(n.highlight(r, n.languages[a], a)),
                l && _self.close()
            },
            !1,
          ),
          _self.Prism)
        : _self.Prism
    var r =
      document.currentScript ||
      [].slice.call(document.getElementsByTagName('script')).pop()
    return (
      r &&
        ((n.filename = r.src),
        !document.addEventListener ||
          n.manual ||
          r.hasAttribute('data-manual') ||
          ('loading' !== document.readyState
            ? window.requestAnimationFrame
              ? window.requestAnimationFrame(n.highlightAll)
              : window.setTimeout(n.highlightAll, 16)
            : document.addEventListener('DOMContentLoaded', n.highlightAll))),
      _self.Prism
    )
  })()
'undefined' != typeof module && module.exports && (module.exports = Prism),
  'undefined' != typeof global && (global.Prism = Prism)
;(Prism.languages.markup = {
  comment: /<!--[\w\W]*?-->/,
  prolog: /<\?[\w\W]+?\?>/,
  doctype: /<!DOCTYPE[\w\W]+?>/i,
  cdata: /<!\[CDATA\[[\w\W]*?]]>/i,
  tag: {
    pattern: /<\/?(?!\d)[^\s>\/=$<]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\\1|\\?(?!\1)[\w\W])*\1|[^\s'">=]+))?)*\s*\/?>/i,
    inside: {
      tag: {
        pattern: /^<\/?[^\s>\/]+/i,
        inside: {punctuation: /^<\/?/, namespace: /^[^\s>\/:]+:/},
      },
      'attr-value': {
        pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/i,
        inside: {punctuation: /[=>"']/},
      },
      punctuation: /\/?>/,
      'attr-name': {pattern: /[^\s>\/]+/, inside: {namespace: /^[^\s>\/:]+:/}},
    },
  },
  entity: /&#?[\da-z]{1,8};/i,
}),
  Prism.hooks.add('wrap', function(a) {
    'entity' === a.type &&
      (a.attributes.title = a.content.replace(/&amp;/, '&'))
  }),
  (Prism.languages.xml = Prism.languages.markup),
  (Prism.languages.html = Prism.languages.markup),
  (Prism.languages.mathml = Prism.languages.markup),
  (Prism.languages.svg = Prism.languages.markup)
;(Prism.languages.css = {
  comment: /\/\*[\w\W]*?\*\//,
  atrule: {pattern: /@[\w-]+?.*?(;|(?=\s*\{))/i, inside: {rule: /@[\w-]+/}},
  url: /url\((?:(["'])(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
  selector: /[^\{\}\s][^\{\};]*?(?=\s*\{)/,
  string: {pattern: /("|')(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1/, greedy: !0},
  property: /(\b|\B)[\w-]+(?=\s*:)/i,
  important: /\B!important\b/i,
  function: /[-a-z0-9]+(?=\()/i,
  punctuation: /[(){};:]/,
}),
  (Prism.languages.css.atrule.inside.rest = Prism.util.clone(
    Prism.languages.css,
  )),
  Prism.languages.markup &&
    (Prism.languages.insertBefore('markup', 'tag', {
      style: {
        pattern: /(<style[\w\W]*?>)[\w\W]*?(?=<\/style>)/i,
        lookbehind: !0,
        inside: Prism.languages.css,
        alias: 'language-css',
      },
    }),
    Prism.languages.insertBefore(
      'inside',
      'attr-value',
      {
        'style-attr': {
          pattern: /\s*style=("|').*?\1/i,
          inside: {
            'attr-name': {
              pattern: /^\s*style/i,
              inside: Prism.languages.markup.tag.inside,
            },
            punctuation: /^\s*=\s*['"]|['"]\s*$/,
            'attr-value': {pattern: /.+/i, inside: Prism.languages.css},
          },
          alias: 'language-css',
        },
      },
      Prism.languages.markup.tag,
    ))
Prism.languages.clike = {
  comment: [
    {pattern: /(^|[^\\])\/\*[\w\W]*?\*\//, lookbehind: !0},
    {pattern: /(^|[^\\:])\/\/.*/, lookbehind: !0},
  ],
  string: {pattern: /(["'])(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/, greedy: !0},
  'class-name': {
    pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/i,
    lookbehind: !0,
    inside: {punctuation: /(\.|\\)/},
  },
  keyword: /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
  boolean: /\b(true|false)\b/,
  function: /[a-z0-9_]+(?=\()/i,
  number: /\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)\b/i,
  operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
  punctuation: /[{}[\];(),.:]/,
}
;(Prism.languages.javascript = Prism.languages.extend('clike', {
  keyword: /\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
  number: /\b-?(0x[\dA-Fa-f]+|0b[01]+|0o[0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/,
  function: /[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*(?=\()/i,
  operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*\*?|\/|~|\^|%|\.{3}/,
})),
  Prism.languages.insertBefore('javascript', 'keyword', {
    regex: {
      pattern: /(^|[^\/])\/(?!\/)(\[.+?]|\\.|[^\/\\\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,
      lookbehind: !0,
      greedy: !0,
    },
  }),
  Prism.languages.insertBefore('javascript', 'string', {
    'template-string': {
      pattern: /`(?:\\\\|\\?[^\\])*?`/,
      greedy: !0,
      inside: {
        interpolation: {
          pattern: /\$\{[^}]+\}/,
          inside: {
            'interpolation-punctuation': {
              pattern: /^\$\{|\}$/,
              alias: 'punctuation',
            },
            rest: Prism.languages.javascript,
          },
        },
        string: /[\s\S]+/,
      },
    },
  }),
  Prism.languages.markup &&
    Prism.languages.insertBefore('markup', 'tag', {
      script: {
        pattern: /(<script[\w\W]*?>)[\w\W]*?(?=<\/script>)/i,
        lookbehind: !0,
        inside: Prism.languages.javascript,
        alias: 'language-javascript',
      },
    }),
  (Prism.languages.js = Prism.languages.javascript)
!(function(e) {
  var t = {
    variable: [
      {
        pattern: /\$?\(\([\w\W]+?\)\)/,
        inside: {
          variable: [
            {pattern: /(^\$\(\([\w\W]+)\)\)/, lookbehind: !0},
            /^\$\(\(/,
          ],
          number: /\b-?(?:0x[\dA-Fa-f]+|\d*\.?\d+(?:[Ee]-?\d+)?)\b/,
          operator: /--?|-=|\+\+?|\+=|!=?|~|\*\*?|\*=|\/=?|%=?|<<=?|>>=?|<=?|>=?|==?|&&?|&=|\^=?|\|\|?|\|=|\?|:/,
          punctuation: /\(\(?|\)\)?|,|;/,
        },
      },
      {pattern: /\$\([^)]+\)|`[^`]+`/, inside: {variable: /^\$\(|^`|\)$|`$/}},
      /\$(?:[a-z0-9_#\?\*!@]+|\{[^}]+\})/i,
    ],
  }
  e.languages.bash = {
    shebang: {pattern: /^#!\s*\/bin\/bash|^#!\s*\/bin\/sh/, alias: 'important'},
    comment: {pattern: /(^|[^"{\\])#.*/, lookbehind: !0},
    string: [
      {
        pattern: /((?:^|[^<])<<\s*)(?:"|')?(\w+?)(?:"|')?\s*\r?\n(?:[\s\S])*?\r?\n\2/g,
        lookbehind: !0,
        greedy: !0,
        inside: t,
      },
      {pattern: /(["'])(?:\\\\|\\?[^\\])*?\1/g, greedy: !0, inside: t},
    ],
    variable: t.variable,
    function: {
      pattern: /(^|\s|;|\||&)(?:alias|apropos|apt-get|aptitude|aspell|awk|basename|bash|bc|bg|builtin|bzip2|cal|cat|cd|cfdisk|chgrp|chmod|chown|chroot|chkconfig|cksum|clear|cmp|comm|command|cp|cron|crontab|csplit|cut|date|dc|dd|ddrescue|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|du|egrep|eject|enable|env|ethtool|eval|exec|expand|expect|export|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|getopts|git|grep|groupadd|groupdel|groupmod|groups|gzip|hash|head|help|hg|history|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|jobs|join|kill|killall|less|link|ln|locate|logname|logout|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|make|man|mkdir|mkfifo|mkisofs|mknod|more|most|mount|mtools|mtr|mv|mmv|nano|netstat|nice|nl|nohup|notify-send|npm|nslookup|open|op|passwd|paste|pathchk|ping|pkill|popd|pr|printcap|printenv|printf|ps|pushd|pv|pwd|quota|quotacheck|quotactl|ram|rar|rcp|read|readarray|readonly|reboot|rename|renice|remsync|rev|rm|rmdir|rsync|screen|scp|sdiff|sed|seq|service|sftp|shift|shopt|shutdown|sleep|slocate|sort|source|split|ssh|stat|strace|su|sudo|sum|suspend|sync|tail|tar|tee|test|time|timeout|times|touch|top|traceroute|trap|tr|tsort|tty|type|ulimit|umask|umount|unalias|uname|unexpand|uniq|units|unrar|unshar|uptime|useradd|userdel|usermod|users|uuencode|uudecode|v|vdir|vi|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yes|zip)(?=$|\s|;|\||&)/,
      lookbehind: !0,
    },
    keyword: {
      pattern: /(^|\s|;|\||&)(?:let|:|\.|if|then|else|elif|fi|for|break|continue|while|in|case|function|select|do|done|until|echo|exit|return|set|declare)(?=$|\s|;|\||&)/,
      lookbehind: !0,
    },
    boolean: {
      pattern: /(^|\s|;|\||&)(?:true|false)(?=$|\s|;|\||&)/,
      lookbehind: !0,
    },
    operator: /&&?|\|\|?|==?|!=?|<<<?|>>|<=?|>=?|=~/,
    punctuation: /\$?\(\(?|\)\)?|\.\.|[{}[\];]/,
  }
  var a = t.variable[1].inside
  ;(a['function'] = e.languages.bash['function']),
    (a.keyword = e.languages.bash.keyword),
    (a.boolean = e.languages.bash.boolean),
    (a.operator = e.languages.bash.operator),
    (a.punctuation = e.languages.bash.punctuation)
})(Prism)
;(Prism.languages.css.selector = {
  pattern: /[^\{\}\s][^\{\}]*(?=\s*\{)/,
  inside: {
    'pseudo-element': /:(?:after|before|first-letter|first-line|selection)|::[-\w]+/,
    'pseudo-class': /:[-\w]+(?:\(.*\))?/,
    class: /\.[-:\.\w]+/,
    id: /#[-:\.\w]+/,
    attribute: /\[[^\]]+\]/,
  },
}),
  Prism.languages.insertBefore('css', 'function', {
    hexcode: /#[\da-f]{3,6}/i,
    entity: /\\[\da-f]{1,8}/i,
    number: /[\d%\.]+/,
  })
;(Prism.languages.dart = Prism.languages.extend('clike', {
  string: [
    {pattern: /r?("""|''')[\s\S]*?\1/, greedy: !0},
    {pattern: /r?("|')(\\?.)*?\1/, greedy: !0},
  ],
  keyword: [
    /\b(?:async|sync|yield)\*/,
    /\b(?:abstract|assert|async|await|break|case|catch|class|const|continue|default|deferred|do|dynamic|else|enum|export|external|extends|factory|final|finally|for|get|if|implements|import|in|library|new|null|operator|part|rethrow|return|set|static|super|switch|this|throw|try|typedef|var|void|while|with|yield)\b/,
  ],
  operator: /\bis!|\b(?:as|is)\b|\+\+|--|&&|\|\||<<=?|>>=?|~(?:\/=?)?|[+\-*\/%&^|=!<>]=?|\?/,
})),
  Prism.languages.insertBefore('dart', 'function', {
    metadata: {pattern: /@\w+/, alias: 'symbol'},
  })
Prism.languages.diff = {
  coord: [/^(?:\*{3}|-{3}|\+{3}).*$/m, /^@@.*@@$/m, /^\d+.*$/m],
  deleted: /^[-<].*$/m,
  inserted: /^[+>].*$/m,
  diff: {pattern: /^!(?!!).+$/m, alias: 'important'},
}
Prism.languages.docker = {
  keyword: {
    pattern: /(^\s*)(?:ONBUILD|FROM|MAINTAINER|RUN|EXPOSE|ENV|ADD|COPY|VOLUME|USER|WORKDIR|CMD|LABEL|ENTRYPOINT)(?=\s)/im,
    lookbehind: !0,
  },
  string: /("|')(?:(?!\1)[^\\\r\n]|\\(?:\r\n|[\s\S]))*?\1/,
  comment: /#.*/,
  punctuation: /---|\.\.\.|[:[\]{}\-,|>?]/,
}
;(Prism.languages.json = {
  property: /"(?:\\.|[^\\"])*"(?=\s*:)/gi,
  string: /"(?!:)(?:\\.|[^\\"])*"(?!:)/g,
  number: /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee][+-]?\d+)?)\b/g,
  punctuation: /[{}[\]);,]/g,
  operator: /:/g,
  boolean: /\b(true|false)\b/gi,
  null: /\bnull\b/gi,
}),
  (Prism.languages.jsonp = Prism.languages.json)
;(Prism.languages.less = Prism.languages.extend('css', {
  comment: [/\/\*[\w\W]*?\*\//, {pattern: /(^|[^\\])\/\/.*/, lookbehind: !0}],
  atrule: {
    pattern: /@[\w-]+?(?:\([^{}]+\)|[^(){};])*?(?=\s*\{)/i,
    inside: {punctuation: /[:()]/},
  },
  selector: {
    pattern: /(?:@\{[\w-]+\}|[^{};\s@])(?:@\{[\w-]+\}|\([^{}]*\)|[^{};@])*?(?=\s*\{)/,
    inside: {variable: /@+[\w-]+/},
  },
  property: /(?:@\{[\w-]+\}|[\w-])+(?:\+_?)?(?=\s*:)/i,
  punctuation: /[{}();:,]/,
  operator: /[+\-*\/]/,
})),
  Prism.languages.insertBefore('less', 'punctuation', {
    function: Prism.languages.less.function,
  }),
  Prism.languages.insertBefore('less', 'property', {
    variable: [
      {pattern: /@[\w-]+\s*:/, inside: {punctuation: /:/}},
      /@@?[\w-]+/,
    ],
    'mixin-usage': {
      pattern: /([{;]\s*)[.#](?!\d)[\w-]+.*?(?=[(;])/,
      lookbehind: !0,
      alias: 'function',
    },
  })
;(Prism.languages.markdown = Prism.languages.extend('markup', {})),
  Prism.languages.insertBefore('markdown', 'prolog', {
    blockquote: {pattern: /^>(?:[\t ]*>)*/m, alias: 'punctuation'},
    code: [
      {pattern: /^(?: {4}|\t).+/m, alias: 'keyword'},
      {pattern: /``.+?``|`[^`\n]+`/, alias: 'keyword'},
    ],
    title: [
      {
        pattern: /\w+.*(?:\r?\n|\r)(?:==+|--+)/,
        alias: 'important',
        inside: {punctuation: /==+$|--+$/},
      },
      {
        pattern: /(^\s*)#+.+/m,
        lookbehind: !0,
        alias: 'important',
        inside: {punctuation: /^#+|#+$/},
      },
    ],
    hr: {
      pattern: /(^\s*)([*-])([\t ]*\2){2,}(?=\s*$)/m,
      lookbehind: !0,
      alias: 'punctuation',
    },
    list: {
      pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,
      lookbehind: !0,
      alias: 'punctuation',
    },
    'url-reference': {
      pattern: /!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,
      inside: {
        variable: {pattern: /^(!?\[)[^\]]+/, lookbehind: !0},
        string: /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,
        punctuation: /^[\[\]!:]|[<>]/,
      },
      alias: 'url',
    },
    bold: {
      pattern: /(^|[^\\])(\*\*|__)(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
      lookbehind: !0,
      inside: {punctuation: /^\*\*|^__|\*\*$|__$/},
    },
    italic: {
      pattern: /(^|[^\\])([*_])(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
      lookbehind: !0,
      inside: {punctuation: /^[*_]|[*_]$/},
    },
    url: {
      pattern: /!?\[[^\]]+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)| ?\[[^\]\n]*\])/,
      inside: {
        variable: {pattern: /(!?\[)[^\]]+(?=\]$)/, lookbehind: !0},
        string: {pattern: /"(?:\\.|[^"\\])*"(?=\)$)/},
      },
    },
  }),
  (Prism.languages.markdown.bold.inside.url = Prism.util.clone(
    Prism.languages.markdown.url,
  )),
  (Prism.languages.markdown.italic.inside.url = Prism.util.clone(
    Prism.languages.markdown.url,
  )),
  (Prism.languages.markdown.bold.inside.italic = Prism.util.clone(
    Prism.languages.markdown.italic,
  )),
  (Prism.languages.markdown.italic.inside.bold = Prism.util.clone(
    Prism.languages.markdown.bold,
  ))
!(function(a) {
  var e = a.util.clone(a.languages.javascript)
  ;(a.languages.jsx = a.languages.extend('markup', e)),
    (a.languages.jsx.tag.pattern = /<\/?[\w\.:-]+\s*(?:\s+(?:[\w\.:-]+(?:=(?:("|')(\\?[\w\W])*?\1|[^\s'">=]+|(\{[\w\W]*?\})))?|\{\.{3}\w+\})\s*)*\/?>/i),
    (a.languages.jsx.tag.inside[
      'attr-value'
    ].pattern = /=[^\{](?:('|")[\w\W]*?(\1)|[^\s>]+)/i),
    a.languages.insertBefore(
      'inside',
      'attr-name',
      {
        spread: {
          pattern: /\{\.{3}\w+\}/,
          inside: {punctuation: /\{|\}|\./, 'attr-value': /\w+/},
        },
      },
      a.languages.jsx.tag,
    )
  var s = a.util.clone(a.languages.jsx)
  delete s.punctuation,
    (s = a.languages.insertBefore(
      'jsx',
      'operator',
      {punctuation: /=(?={)|[{}[\];(),.:]/},
      {jsx: s},
    )),
    a.languages.insertBefore(
      'inside',
      'attr-value',
      {
        script: {
          pattern: /=(\{(?:\{[^}]*\}|[^}])+\})/i,
          inside: s,
          alias: 'language-javascript',
        },
      },
      a.languages.jsx.tag,
    )
})(Prism)
!(function(e) {
  ;(e.languages.sass = e.languages.extend('css', {
    comment: {
      pattern: /^([ \t]*)\/[\/*].*(?:(?:\r?\n|\r)\1[ \t]+.+)*/m,
      lookbehind: !0,
    },
  })),
    e.languages.insertBefore('sass', 'atrule', {
      'atrule-line': {
        pattern: /^(?:[ \t]*)[@+=].+/m,
        inside: {atrule: /(?:@[\w-]+|[+=])/m},
      },
    }),
    delete e.languages.sass.atrule
  var a = /((\$[-_\w]+)|(#\{\$[-_\w]+\}))/i,
    t = [
      /[+*\/%]|[=!]=|<=?|>=?|\b(?:and|or|not)\b/,
      {pattern: /(\s+)-(?=\s)/, lookbehind: !0},
    ]
  e.languages.insertBefore('sass', 'property', {
    'variable-line': {
      pattern: /^[ \t]*\$.+/m,
      inside: {punctuation: /:/, variable: a, operator: t},
    },
    'property-line': {
      pattern: /^[ \t]*(?:[^:\s]+ *:.*|:[^:\s]+.*)/m,
      inside: {
        property: [/[^:\s]+(?=\s*:)/, {pattern: /(:)[^:\s]+/, lookbehind: !0}],
        punctuation: /:/,
        variable: a,
        operator: t,
        important: e.languages.sass.important,
      },
    },
  }),
    delete e.languages.sass.property,
    delete e.languages.sass.important,
    delete e.languages.sass.selector,
    e.languages.insertBefore('sass', 'punctuation', {
      selector: {
        pattern: /([ \t]*)\S(?:,?[^,\r\n]+)*(?:,(?:\r?\n|\r)\1[ \t]+\S(?:,?[^,\r\n]+)*)*/,
        lookbehind: !0,
      },
    })
})(Prism)
;(Prism.languages.scss = Prism.languages.extend('css', {
  comment: {pattern: /(^|[^\\])(?:\/\*[\w\W]*?\*\/|\/\/.*)/, lookbehind: !0},
  atrule: {
    pattern: /@[\w-]+(?:\([^()]+\)|[^(])*?(?=\s+[{;])/,
    inside: {rule: /@[\w-]+/},
  },
  url: /(?:[-a-z]+-)*url(?=\()/i,
  selector: {
    pattern: /(?=\S)[^@;\{\}\(\)]?([^@;\{\}\(\)]|&|#\{\$[-_\w]+\})+(?=\s*\{(\}|\s|[^\}]+(:|\{)[^\}]+))/m,
    inside: {
      parent: {pattern: /&/, alias: 'important'},
      placeholder: /%[-_\w]+/,
      variable: /\$[-_\w]+|#\{\$[-_\w]+\}/,
    },
  },
})),
  Prism.languages.insertBefore('scss', 'atrule', {
    keyword: [
      /@(?:if|else(?: if)?|for|each|while|import|extend|debug|warn|mixin|include|function|return|content)/i,
      {pattern: /( +)(?:from|through)(?= )/, lookbehind: !0},
    ],
  }),
  (Prism.languages.scss.property = {
    pattern: /(?:[\w-]|\$[-_\w]+|#\{\$[-_\w]+\})+(?=\s*:)/i,
    inside: {variable: /\$[-_\w]+|#\{\$[-_\w]+\}/},
  }),
  Prism.languages.insertBefore('scss', 'important', {
    variable: /\$[-_\w]+|#\{\$[-_\w]+\}/,
  }),
  Prism.languages.insertBefore('scss', 'function', {
    placeholder: {pattern: /%[-_\w]+/, alias: 'selector'},
    statement: {pattern: /\B!(?:default|optional)\b/i, alias: 'keyword'},
    boolean: /\b(?:true|false)\b/,
    null: /\bnull\b/,
    operator: {
      pattern: /(\s)(?:[-+*\/%]|[=!]=|<=?|>=?|and|or|not)(?=\s)/,
      lookbehind: !0,
    },
  }),
  (Prism.languages.scss.atrule.inside.rest = Prism.util.clone(
    Prism.languages.scss,
  ))
;(Prism.languages.typescript = Prism.languages.extend('javascript', {
  keyword: /\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield|false|true|module|declare|constructor|string|Function|any|number|boolean|Array|enum|symbol|namespace|abstract|require|type)\b/,
})),
  (Prism.languages.ts = Prism.languages.typescript)
!(function() {
  'undefined' != typeof self &&
    self.Prism &&
    self.document &&
    Prism.hooks.add('complete', function(e) {
      if (e.code) {
        var t = e.element.parentNode,
          s = /\s*\bline-numbers\b\s*/
        if (
          t &&
          /pre/i.test(t.nodeName) &&
          (s.test(t.className) || s.test(e.element.className)) &&
          !e.element.querySelector('.line-numbers-rows')
        ) {
          s.test(e.element.className) &&
            (e.element.className = e.element.className.replace(s, '')),
            s.test(t.className) || (t.className += ' line-numbers')
          var n,
            a = e.code.match(/\n(?!$)/g),
            l = a ? a.length + 1 : 1,
            r = new Array(l + 1)
          ;(r = r.join('<span></span>')),
            (n = document.createElement('span')),
            n.setAttribute('aria-hidden', 'true'),
            (n.className = 'line-numbers-rows'),
            (n.innerHTML = r),
            t.hasAttribute('data-start') &&
              (t.style.counterReset =
                'linenumber ' +
                (parseInt(t.getAttribute('data-start'), 10) - 1)),
            e.element.appendChild(n)
        }
      }
    })
})()
!(function() {
  if (
    ('undefined' == typeof self || self.Prism) &&
    ('undefined' == typeof global || global.Prism)
  ) {
    var i = /\b([a-z]{3,7}:\/\/|tel:)[\w\-+%~\/.:#=?&amp;]+/,
      n = /\b\S+@[\w.]+[a-z]{2}/,
      e = /\[([^\]]+)]\(([^)]+)\)/,
      t = ['comment', 'url', 'attr-value', 'string']
    ;(Prism.plugins.autolinker = {
      processGrammar: function(a) {
        a &&
          !a['url-link'] &&
          (Prism.languages.DFS(a, function(a, r, l) {
            t.indexOf(l) > -1 &&
              'Array' !== Prism.util.type(r) &&
              (r.pattern || (r = this[a] = {pattern: r}),
              (r.inside = r.inside || {}),
              'comment' == l && (r.inside['md-link'] = e),
              'attr-value' == l
                ? Prism.languages.insertBefore(
                    'inside',
                    'punctuation',
                    {'url-link': i},
                    r,
                  )
                : (r.inside['url-link'] = i),
              (r.inside['email-link'] = n))
          }),
          (a['url-link'] = i),
          (a['email-link'] = n))
      },
    }),
      Prism.hooks.add('before-highlight', function(i) {
        Prism.plugins.autolinker.processGrammar(i.grammar)
      }),
      Prism.hooks.add('wrap', function(i) {
        if (/-link$/.test(i.type)) {
          i.tag = 'a'
          var n = i.content
          if ('email-link' == i.type && 0 != n.indexOf('mailto:'))
            n = 'mailto:' + n
          else if ('md-link' == i.type) {
            var t = i.content.match(e)
            ;(n = t[2]), (i.content = t[1])
          }
          i.attributes.href = n
        }
      })
  }
})()
!(function() {
  if ('undefined' != typeof self && self.Prism && self.document) {
    var t = [],
      e = {},
      n = function() {}
    Prism.plugins.toolbar = {}
    var a = (Prism.plugins.toolbar.registerButton = function(n, a) {
        var o
        ;(o =
          'function' == typeof a
            ? a
            : function(t) {
                var e
                return (
                  'function' == typeof a.onClick
                    ? ((e = document.createElement('button')),
                      (e.type = 'button'),
                      e.addEventListener('click', function() {
                        a.onClick.call(this, t)
                      }))
                    : 'string' == typeof a.url
                      ? ((e = document.createElement('a')), (e.href = a.url))
                      : (e = document.createElement('span')),
                  (e.textContent = a.text),
                  e
                )
              }),
          t.push((e[n] = o))
      }),
      o = (Prism.plugins.toolbar.hook = function(a) {
        var o = a.element.parentNode
        if (
          o &&
          /pre/i.test(o.nodeName) &&
          !o.classList.contains('code-toolbar')
        ) {
          o.classList.add('code-toolbar')
          var r = document.createElement('div')
          r.classList.add('toolbar'),
            document.body.hasAttribute('data-toolbar-order') &&
              (t = document.body
                .getAttribute('data-toolbar-order')
                .split(',')
                .map(function(t) {
                  return e[t] || n
                })),
            t.forEach(function(t) {
              var e = t(a)
              if (e) {
                var n = document.createElement('div')
                n.classList.add('toolbar-item'),
                  n.appendChild(e),
                  r.appendChild(n)
              }
            }),
            o.appendChild(r)
        }
      })
    a('label', function(t) {
      var e = t.element.parentNode
      if (e && /pre/i.test(e.nodeName) && e.hasAttribute('data-label')) {
        var n,
          a,
          o = e.getAttribute('data-label')
        try {
          a = document.querySelector('template#' + o)
        } catch (r) {}
        return (
          a
            ? (n = a.content)
            : (e.hasAttribute('data-url')
                ? ((n = document.createElement('a')),
                  (n.href = e.getAttribute('data-url')))
                : (n = document.createElement('span')),
              (n.textContent = o)),
          n
        )
      }
    }),
      Prism.hooks.add('complete', o)
  }
})()
!(function() {
  if (
    'undefined' != typeof self &&
    self.Prism &&
    self.document &&
    Function.prototype.bind
  ) {
    var t = function(t) {
        var e = 0,
          s = 0,
          i = t
        if (i.parentNode) {
          do (e += i.offsetLeft), (s += i.offsetTop)
          while ((i = i.offsetParent) && i.nodeType < 9)
          i = t
          do (e -= i.scrollLeft), (s -= i.scrollTop)
          while ((i = i.parentNode) && !/body/i.test(i.nodeName))
        }
        return {
          top: s,
          right: innerWidth - e - t.offsetWidth,
          bottom: innerHeight - s - t.offsetHeight,
          left: e,
        }
      },
      e = /(?:^|\s)token(?=$|\s)/,
      s = /(?:^|\s)active(?=$|\s)/g,
      i = /(?:^|\s)flipped(?=$|\s)/g,
      o = function(t, e, s, i) {
        ;(this._elt = null),
          (this._type = t),
          (this._clsRegexp = RegExp('(?:^|\\s)' + t + '(?=$|\\s)')),
          (this._token = null),
          (this.updater = e),
          (this._mouseout = this.mouseout.bind(this)),
          (this.initializer = i)
        var n = this
        s || (s = ['*']),
          'Array' !== Prism.util.type(s) && (s = [s]),
          s.forEach(function(t) {
            'string' != typeof t && (t = t.lang),
              o.byLanguages[t] || (o.byLanguages[t] = []),
              o.byLanguages[t].indexOf(n) < 0 && o.byLanguages[t].push(n)
          }),
          (o.byType[t] = this)
      }
    ;(o.prototype.init = function() {
      this._elt ||
        ((this._elt = document.createElement('div')),
        (this._elt.className = 'prism-previewer prism-previewer-' + this._type),
        document.body.appendChild(this._elt),
        this.initializer && this.initializer())
    }),
      (o.prototype.check = function(t) {
        do if (e.test(t.className) && this._clsRegexp.test(t.className)) break
        while ((t = t.parentNode))
        t && t !== this._token && ((this._token = t), this.show())
      }),
      (o.prototype.mouseout = function() {
        this._token.removeEventListener('mouseout', this._mouseout, !1),
          (this._token = null),
          this.hide()
      }),
      (o.prototype.show = function() {
        if ((this._elt || this.init(), this._token))
          if (this.updater.call(this._elt, this._token.textContent)) {
            this._token.addEventListener('mouseout', this._mouseout, !1)
            var e = t(this._token)
            ;(this._elt.className += ' active'),
              e.top - this._elt.offsetHeight > 0
                ? ((this._elt.className = this._elt.className.replace(i, '')),
                  (this._elt.style.top = e.top + 'px'),
                  (this._elt.style.bottom = ''))
                : ((this._elt.className += ' flipped'),
                  (this._elt.style.bottom = e.bottom + 'px'),
                  (this._elt.style.top = '')),
              (this._elt.style.left =
                e.left + Math.min(200, this._token.offsetWidth / 2) + 'px')
          } else this.hide()
      }),
      (o.prototype.hide = function() {
        this._elt.className = this._elt.className.replace(s, '')
      }),
      (o.byLanguages = {}),
      (o.byType = {}),
      (o.initEvents = function(t, e) {
        var s = []
        o.byLanguages[e] && (s = s.concat(o.byLanguages[e])),
          o.byLanguages['*'] && (s = s.concat(o.byLanguages['*'])),
          t.addEventListener(
            'mouseover',
            function(t) {
              var e = t.target
              s.forEach(function(t) {
                t.check(e)
              })
            },
            !1,
          )
      }),
      (Prism.plugins.Previewer = o),
      Prism.hooks.add('after-highlight', function(t) {
        ;(o.byLanguages['*'] || o.byLanguages[t.language]) &&
          o.initEvents(t.element, t.language)
      })
  }
})()
!(function() {
  if (
    ('undefined' == typeof self || self.Prism) &&
    ('undefined' == typeof global || global.Prism)
  ) {
    var e = {
      css: !0,
      less: !0,
      markup: {
        lang: 'markup',
        before: 'punctuation',
        inside: 'inside',
        root:
          Prism.languages.markup &&
          Prism.languages.markup.tag.inside['attr-value'],
      },
      sass: [
        {
          lang: 'sass',
          before: 'punctuation',
          inside: 'inside',
          root: Prism.languages.sass && Prism.languages.sass['variable-line'],
        },
        {
          lang: 'sass',
          inside: 'inside',
          root: Prism.languages.sass && Prism.languages.sass['property-line'],
        },
      ],
      scss: !0,
      stylus: [
        {
          lang: 'stylus',
          before: 'hexcode',
          inside: 'rest',
          root:
            Prism.languages.stylus &&
            Prism.languages.stylus['property-declaration'].inside,
        },
        {
          lang: 'stylus',
          before: 'hexcode',
          inside: 'rest',
          root:
            Prism.languages.stylus &&
            Prism.languages.stylus['variable-declaration'].inside,
        },
      ],
    }
    Prism.hooks.add('before-highlight', function(a) {
      if (a.language && e[a.language] && !e[a.language].initialized) {
        var i = e[a.language]
        'Array' !== Prism.util.type(i) && (i = [i]),
          i.forEach(function(i) {
            var r, l, n, s
            i === !0
              ? ((r = 'important'), (l = a.language), (i = a.language))
              : ((r = i.before || 'important'),
                (l = i.inside || i.lang),
                (n = i.root || Prism.languages),
                (s = i.skip),
                (i = a.language)),
              !s &&
                Prism.languages[i] &&
                (Prism.languages.insertBefore(
                  l,
                  r,
                  {
                    color: /\B#(?:[0-9a-f]{3}){1,2}\b|\b(?:rgb|hsl)\(\s*\d{1,3}\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*\)\B|\b(?:rgb|hsl)a\(\s*\d{1,3}\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*,\s*(?:0|0?\.\d+|1)\s*\)\B|\b(?:AliceBlue|AntiqueWhite|Aqua|Aquamarine|Azure|Beige|Bisque|Black|BlanchedAlmond|Blue|BlueViolet|Brown|BurlyWood|CadetBlue|Chartreuse|Chocolate|Coral|CornflowerBlue|Cornsilk|Crimson|Cyan|DarkBlue|DarkCyan|DarkGoldenRod|DarkGray|DarkGreen|DarkKhaki|DarkMagenta|DarkOliveGreen|DarkOrange|DarkOrchid|DarkRed|DarkSalmon|DarkSeaGreen|DarkSlateBlue|DarkSlateGray|DarkTurquoise|DarkViolet|DeepPink|DeepSkyBlue|DimGray|DodgerBlue|FireBrick|FloralWhite|ForestGreen|Fuchsia|Gainsboro|GhostWhite|Gold|GoldenRod|Gray|Green|GreenYellow|HoneyDew|HotPink|IndianRed|Indigo|Ivory|Khaki|Lavender|LavenderBlush|LawnGreen|LemonChiffon|LightBlue|LightCoral|LightCyan|LightGoldenRodYellow|LightGray|LightGreen|LightPink|LightSalmon|LightSeaGreen|LightSkyBlue|LightSlateGray|LightSteelBlue|LightYellow|Lime|LimeGreen|Linen|Magenta|Maroon|MediumAquaMarine|MediumBlue|MediumOrchid|MediumPurple|MediumSeaGreen|MediumSlateBlue|MediumSpringGreen|MediumTurquoise|MediumVioletRed|MidnightBlue|MintCream|MistyRose|Moccasin|NavajoWhite|Navy|OldLace|Olive|OliveDrab|Orange|OrangeRed|Orchid|PaleGoldenRod|PaleGreen|PaleTurquoise|PaleVioletRed|PapayaWhip|PeachPuff|Peru|Pink|Plum|PowderBlue|Purple|Red|RosyBrown|RoyalBlue|SaddleBrown|Salmon|SandyBrown|SeaGreen|SeaShell|Sienna|Silver|SkyBlue|SlateBlue|SlateGray|Snow|SpringGreen|SteelBlue|Tan|Teal|Thistle|Tomato|Turquoise|Violet|Wheat|White|WhiteSmoke|Yellow|YellowGreen)\b/i,
                  },
                  n,
                ),
                (a.grammar = Prism.languages[i]),
                (e[a.language] = {initialized: !0}))
          })
      }
    }),
      Prism.plugins.Previewer &&
        new Prism.plugins.Previewer('color', function(e) {
          return (
            (this.style.backgroundColor = ''),
            (this.style.backgroundColor = e),
            !!this.style.backgroundColor
          )
        })
  }
})()
!(function() {
  if (
    ('undefined' == typeof self || self.Prism) &&
    ('undefined' == typeof global || global.Prism)
  ) {
    var e = {
      css: !0,
      less: !0,
      sass: [
        {
          lang: 'sass',
          before: 'punctuation',
          inside: 'inside',
          root: Prism.languages.sass && Prism.languages.sass['variable-line'],
        },
        {
          lang: 'sass',
          before: 'punctuation',
          inside: 'inside',
          root: Prism.languages.sass && Prism.languages.sass['property-line'],
        },
      ],
      scss: !0,
      stylus: [
        {
          lang: 'stylus',
          before: 'func',
          inside: 'rest',
          root:
            Prism.languages.stylus &&
            Prism.languages.stylus['property-declaration'].inside,
        },
        {
          lang: 'stylus',
          before: 'func',
          inside: 'rest',
          root:
            Prism.languages.stylus &&
            Prism.languages.stylus['variable-declaration'].inside,
        },
      ],
    }
    Prism.hooks.add('before-highlight', function(i) {
      if (i.language && e[i.language] && !e[i.language].initialized) {
        var t = e[i.language]
        'Array' !== Prism.util.type(t) && (t = [t]),
          t.forEach(function(t) {
            var r, s, a, n
            t === !0
              ? ((r =
                  Prism.plugins.Previewer &&
                  Prism.plugins.Previewer.byType.color
                    ? 'color'
                    : 'important'),
                (s = i.language),
                (t = i.language))
              : ((r = t.before || 'important'),
                (s = t.inside || t.lang),
                (a = t.root || Prism.languages),
                (n = t.skip),
                (t = i.language)),
              !n &&
                Prism.languages[t] &&
                (Prism.languages.insertBefore(
                  s,
                  r,
                  {
                    gradient: {
                      pattern: /(?:\b|\B-[a-z]{1,10}-)(?:repeating-)?(?:linear|radial)-gradient\((?:(?:rgb|hsl)a?\(.+?\)|[^\)])+\)/gi,
                      inside: {function: /[\w-]+(?=\()/, punctuation: /[(),]/},
                    },
                  },
                  a,
                ),
                (i.grammar = Prism.languages[t]),
                (e[i.language] = {initialized: !0}))
          })
      }
    })
    var i = {},
      t = function(e, i, t) {
        var r = '180deg'
        return (
          /^(?:-?\d*\.?\d+(?:deg|rad)|to\b|top|right|bottom|left)/.test(t[0]) &&
            ((r = t.shift()),
            r.indexOf('to ') < 0 &&
              (r.indexOf('top') >= 0
                ? (r =
                    r.indexOf('left') >= 0
                      ? 'to bottom right'
                      : r.indexOf('right') >= 0
                        ? 'to bottom left'
                        : 'to bottom')
                : r.indexOf('bottom') >= 0
                  ? (r =
                      r.indexOf('left') >= 0
                        ? 'to top right'
                        : r.indexOf('right') >= 0 ? 'to top left' : 'to top')
                  : r.indexOf('left') >= 0
                    ? (r = 'to right')
                    : r.indexOf('right') >= 0
                      ? (r = 'to left')
                      : e &&
                        (r.indexOf('deg') >= 0
                          ? (r = 90 - parseFloat(r) + 'deg')
                          : r.indexOf('rad') >= 0 &&
                            (r = Math.PI / 2 - parseFloat(r) + 'rad')))),
          i + '(' + r + ',' + t.join(',') + ')'
        )
      },
      r = function(e, i, t) {
        if (t[0].indexOf('at') < 0) {
          var r = 'center',
            s = 'ellipse',
            a = 'farthest-corner'
          if (
            (/\bcenter|top|right|bottom|left\b|^\d+/.test(t[0]) &&
              (r = t.shift().replace(/\s*-?\d+(?:rad|deg)\s*/, '')),
            /\bcircle|ellipse|closest|farthest|contain|cover\b/.test(t[0]))
          ) {
            var n = t.shift().split(/\s+/)
            !n[0] ||
              ('circle' !== n[0] && 'ellipse' !== n[0]) ||
              (s = n.shift()),
              n[0] && (a = n.shift()),
              'cover' === a
                ? (a = 'farthest-corner')
                : 'contain' === a && (a = 'clothest-side')
          }
          return i + '(' + s + ' ' + a + ' at ' + r + ',' + t.join(',') + ')'
        }
        return i + '(' + t.join(',') + ')'
      },
      s = function(e) {
        if (i[e]) return i[e]
        var s = e.match(
            /^(\b|\B-[a-z]{1,10}-)((?:repeating-)?(?:linear|radial)-gradient)/,
          ),
          a = s && s[1],
          n = s && s[2],
          l = e
            .replace(
              /^(?:\b|\B-[a-z]{1,10}-)(?:repeating-)?(?:linear|radial)-gradient\(|\)$/g,
              '',
            )
            .split(/\s*,\s*/)
        return (i[e] =
          n.indexOf('linear') >= 0
            ? t(a, n, l)
            : n.indexOf('radial') >= 0
              ? r(a, n, l)
              : n + '(' + l.join(',') + ')')
      }
    Prism.plugins.Previewer &&
      new Prism.plugins.Previewer(
        'gradient',
        function(e) {
          return (
            (this.firstChild.style.backgroundImage = ''),
            (this.firstChild.style.backgroundImage = s(e)),
            !!this.firstChild.style.backgroundImage
          )
        },
        '*',
        function() {
          this._elt.innerHTML = '<div></div>'
        },
      )
  }
})()
!(function() {
  if (
    ('undefined' == typeof self || self.Prism) &&
    ('undefined' == typeof global || global.Prism)
  ) {
    var e = {
      css: !0,
      less: !0,
      sass: [
        {
          lang: 'sass',
          inside: 'inside',
          before: 'punctuation',
          root: Prism.languages.sass && Prism.languages.sass['variable-line'],
        },
        {
          lang: 'sass',
          inside: 'inside',
          root: Prism.languages.sass && Prism.languages.sass['property-line'],
        },
      ],
      scss: !0,
      stylus: [
        {
          lang: 'stylus',
          before: 'hexcode',
          inside: 'rest',
          root:
            Prism.languages.stylus &&
            Prism.languages.stylus['property-declaration'].inside,
        },
        {
          lang: 'stylus',
          before: 'hexcode',
          inside: 'rest',
          root:
            Prism.languages.stylus &&
            Prism.languages.stylus['variable-declaration'].inside,
        },
      ],
    }
    Prism.hooks.add('before-highlight', function(r) {
      if (r.language && e[r.language] && !e[r.language].initialized) {
        var s = e[r.language]
        'Array' !== Prism.util.type(s) && (s = [s]),
          s.forEach(function(s) {
            var i, a, n, t
            s === !0
              ? ((i = 'important'), (a = r.language), (s = r.language))
              : ((i = s.before || 'important'),
                (a = s.inside || s.lang),
                (n = s.root || Prism.languages),
                (t = s.skip),
                (s = r.language)),
              !t &&
                Prism.languages[s] &&
                (Prism.languages.insertBefore(
                  a,
                  i,
                  {
                    easing: /\bcubic-bezier\((?:-?\d*\.?\d+,\s*){3}-?\d*\.?\d+\)\B|\b(?:linear|ease(?:-in)?(?:-out)?)(?=\s|[;}]|$)/i,
                  },
                  n,
                ),
                (r.grammar = Prism.languages[s]),
                (e[r.language] = {initialized: !0}))
          })
      }
    }),
      Prism.plugins.Previewer &&
        new Prism.plugins.Previewer(
          'easing',
          function(e) {
            e =
              {
                linear: '0,0,1,1',
                ease: '.25,.1,.25,1',
                'ease-in': '.42,0,1,1',
                'ease-out': '0,0,.58,1',
                'ease-in-out': '.42,0,.58,1',
              }[e] || e
            var r = e.match(/-?\d*\.?\d+/g)
            if (4 === r.length) {
              ;(r = r.map(function(e, r) {
                return 100 * (r % 2 ? 1 - e : e)
              })),
                this.querySelector('path').setAttribute(
                  'd',
                  'M0,100 C' +
                    r[0] +
                    ',' +
                    r[1] +
                    ', ' +
                    r[2] +
                    ',' +
                    r[3] +
                    ', 100,0',
                )
              var s = this.querySelectorAll('line')
              return (
                s[0].setAttribute('x2', r[0]),
                s[0].setAttribute('y2', r[1]),
                s[1].setAttribute('x2', r[2]),
                s[1].setAttribute('y2', r[3]),
                !0
              )
            }
            return !1
          },
          '*',
          function() {
            this._elt.innerHTML =
              '<svg viewBox="-20 -20 140 140" width="100" height="100"><defs><marker id="prism-previewer-easing-marker" viewBox="0 0 4 4" refX="2" refY="2" markerUnits="strokeWidth"><circle cx="2" cy="2" r="1.5" /></marker></defs><path d="M0,100 C20,50, 40,30, 100,0" /><line x1="0" y1="100" x2="20" y2="50" marker-start="url(' +
              location.href +
              '#prism-previewer-easing-marker)" marker-end="url(' +
              location.href +
              '#prism-previewer-easing-marker)" /><line x1="100" y1="0" x2="40" y2="30" marker-start="url(' +
              location.href +
              '#prism-previewer-easing-marker)" marker-end="url(' +
              location.href +
              '#prism-previewer-easing-marker)" /></svg>'
          },
        )
  }
})()
