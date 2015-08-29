var consoleExamples = [
  {
    desc: 'clear',
  },
  {
    desc: 'fix c style curlies',
    query: '{`if` | `while`} {PAREN_PAIR}=,0 (~ [NEWLINE])=2,3 {`{`}=,1',
    input: 'if (foo)\n{\n  bar;\n}\n\nwhile (have)\n{\n  weird()\n}',
    handlerargs: 'parenStop, curlyOpen, whiteStart, whiteStop',
    handler: "document.querySelector('#debug').value += 'callback called with '+arguments.length+' arguments\\n\\n';\n\nparenStop.value += ' {';\ncurlyOpen.value = '';\nwhiteStart.value = '';\nwhiteStop.value = '';",
    repeat: 'after',
    copy: 'nocopy',
  },
  {
    desc: 'complex: remove console stuff and useless blocks',
    query: '(({`!`}{`void`})?{`console`}{`.`}{`log`|`warn`|`group`|`groupEnd`|`error`}{PAREN_PAIR}({`&&`}|{`||`}|{`;`}|{`,`})?)=0,1|({`;`}{CURLY_PAIR}=2,3)|[COMMENT]=2,3|(([NEWLINE][!NEWLINE & WHITE]*)=0,1[NEWLINE]): find console expressions, perhaps with `!void` and trailing comma or semi, and blocks that follow semi colons',
    input: 'function query() {\n  // input query: [`b`][`;`]~$$\n  // final query: [`b`][`;`]~$$\n  // query start..\n  var group0 = false;\n  matchedSomething = false;\n  console.group("root start");\n  { // parseAtomMaybe 1 for a white token `[`\n      // white token 1:0\n      group0 = checkTokenWhite(symw() && !void console.log("# 1001 start of literal [`b`] at 4 in query to token " + index + ":", token()) && value(\'b\'));\n  } // `]` 1 for a white token\n\n  if (group0)\n  // white token 2:1\n      group0 = checkTokenWhite(symw() && !void console.log("# 1002 start of literal [`;`] at 9 in query to token " + index + ":", token()) && value(\';\'));\n\n  if (group0)\n  // dont seek for leading ~, just wait for a non-spacy token\n      if (console.log("~ seek() past spaces and tabs at all?", matchedSomething, "start=", index), matchedSomething) {\n          if (isSpaceTabComment()) {\n              console.log("~ skipping spaces and tabs");\n              do ++index;\n              while (isSpaceTabComment()); // ~\n          }\n          group0 = !isWhite(); // if current is white now, seek failed\n          console.log(group0 ? "~ passed" : "~ failed", index);\n      }\n\n  if (group0)\n      console.log("$$ end of file?", index >= tokens.length), (group0 = (index >= tokens.length)); // $$\n  (matchedSomething = true);\n\n  console.groupEnd();\n\n  // query end..\n  return group0;\n}\n   ',
    handlerargs: 'cleanStart, cleanStop, curlyOpen, curlyClose',
    handler: 'try {\n  document.querySelector(\'#debug\').value += \'match callback: \'+arguments.length+\': \'+JSON.stringify([].slice.call(arguments, 0))+\'\\n\\n\';\n} catch (e) {\n  document.querySelector(\'#debug\').value += \'match callback: \'+arguments.length+\': (json stringify failed)\';\n}\n\n// the block is assigned to third and fourth arg, if they exist, only remove them and nothing in between\nif (curlyOpen && curlyClose) {\n  curlyOpen.value = \'\';\n  curlyClose.value = \'\';\n  // it was a match, not a block, so must be a console expression. remove the whole range\n} else if (cleanStart && cleanStop) {\n  for (var i=cleanStart.white; i<=cleanStop.white; ++i) {\n    TOKENS.whites[i].value = \'\';\n  }\n}\n',
    repeat: 'every',
    copy: 'copy',
  },
  {
    desc: 'match parens',
    query: '{PAREN_PAIR}=0,1',
    input: 'switch (x) {\n  case a: break;\n  case \'x\': break;\n  case 15: \n    break;\n  case false\n  : break;\n  case\n  null: break;\n  default:\n  floop;\n}',
    handlerargs: 'match1, match2',
    handler: 'document.querySelector(\'#debug\').value += \'callback called with \'+arguments.length+\' arguments\\n\\n\';\n\nmatch1.value = \'#\';\nmatch2.value = \'#\'',
    repeat: 'after',
    copy: 'nocopy',
  },
  {
    desc: 'match curlies',
    query: '{CURLY_PAIR}=0,1',
    input: 'switch (x) {\n  case a: break;\n  case \'x\': break;\n  case 15: \n    break;\n  case false\n  : break;\n  case\n  null: break;\n  default:\n  floop;\n}',
    handlerargs: 'match1, match2',
    handler: 'document.querySelector(\'#debug\').value += \'callback called with \'+arguments.length+\' arguments\\n\\n\';\n\nmatch1.value = \'#\';\nmatch2.value = \'#\'',
    repeat: 'after',
    copy: 'nocopy',
  },
  {
    desc: 'match simple cases',
    query: '{`case`}=0 {STRING|IDENTIFIER|NUMBER}=1:this is a single token condition but could be any expression {`:`}=2',
    input: 'switch (x) {\n  case a: break;\n  case \'x\': break;\n  case 15: \n    break;\n  case false\n  : break;\n  case\n  null: break;\n  default:\n  floop;\n}',
    handlerargs: 'casekeyword, condition, colon',
    handler: 'document.querySelector(\'#debug\').value += \'callback called with \'+arguments.length+\' arguments\\n\\n\';\n\ncasekeyword.value = \'#\';\ncondition.value = \'$\';\ncolon.value = \'%\';',
    repeat: 'after',
    copy: 'nocopy',
  },
  {
    desc: 'macro example ADDITION',
    query: '(ADDITION) = , 1 : note that 0 is implied to the start unless overriden',
    input: 'var x = 1 + 2 - 3 + 4;',
    handlerargs: 'a, b',
    handler: 'document.querySelector(\'#debug\').value += \'callback called with \'+arguments.length+\' arguments\\n\\n\';\n\na.value = \'#\';\nb.value = \'$\';',
    repeat: 'after',
    copy: 'nocopy',
  },
];

consoleExamplesBak = consoleExamples.slice(0);