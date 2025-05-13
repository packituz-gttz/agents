`[Jump to content](link#1)

[![Listen to this article](https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Sound-icon.svg/20px-Sound-icon.svg.png)](https://en.wikipedia.org/wiki/File:En-Functional_programming.ogg 'Listen to this article')

From Wikipedia, the free encyclopedia

Programming paradigm based on applying and composing functions

For subroutine-oriented programming, see [Procedural programming](link#1106 'Procedural programming').

In [computer science](link#3 'Computer science'), **functional programming** is a [programming paradigm](link#1241 'Programming paradigm') where programs are constructed by [applying](link#112 'Function application') and [composing](link#6 'Function composition (computer science)') [functions](link#7 'Function (computer science)'). It is a [declarative programming](link#1121 'Declarative programming') paradigm in which function definitions are [trees](link#9 'Tree (data structure)') of [expressions](link#10 'Expression (computer science)') that map [values](link#11 'Value (computer science)') to other values, rather than a sequence of [imperative](link#1100 'Imperative programming') [statements](link#13 'Statement (computer science)') which update the [running state](link#27 'State (computer science)') of the program.

In functional programming, functions are treated as [first-class citizens](link#15 'First-class citizen'), meaning that they can be bound to names (including local [identifiers](link#16 'Identifier (computer languages)')), passed as [arguments](link#17 'Parameter (computer programming)'), and [returned](link#18 'Return value') from other functions, just as any other [data type](link#122 'Data type') can. This allows programs to be written in a [declarative](link#1121 'Declarative programming') and [composable](link#496 'Composability') style, where small functions are combined in a [modular](link#1104 'Modular programming') manner.

Functional programming is sometimes treated as synonymous with [purely functional programming](link#1127 'Purely functional programming'), a subset of functional programming that treats all functions as [deterministic](link#24 'Deterministic system') mathematical [functions](link#25 'Function (mathematics)'), or [pure functions](link#228 'Pure function'). When a pure function is called with some given arguments, it will always return the same result, and cannot be affected by any mutable [state](link#27 'State (computer science)') or other [side effects](link#343 'Side effect (computer science)'). This is in contrast with impure [procedures](link#29 'Procedure (computer science)'), common in [imperative programming](link#1100 'Imperative programming'), which can have side effects (such as modifying the program's state or taking input from a user). Proponents of purely functional programming claim that by restricting side effects, programs can have fewer [bugs](link#31 'Software bug'), be easier to [debug](link#32 'Debugging') and [test](link#33 'Software testing'), and be more suited to [formal verification](link#310 'Formal verification').[\\[1\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-hudak1989-1)[\\[2\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-hughesWhyFPMatters-2)

Functional programming has its roots in [academia](link#37 'Academia'), evolving from the [lambda calculus](link#159 'Lambda calculus'), a formal system of computation based only on functions. Functional programming has historically been less popular than imperative programming, but many functional languages are seeing use today in industry and education, including [Common Lisp](link#137 'Common Lisp'), [Scheme](link#583 'Scheme (programming language)'),[\\[3\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-clinger1987-3)[\\[4\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-hartheimer1987-4)[\\[5\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-kidd2007-5)[\\[6\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-cleis2006-6) [Clojure](link#404 'Clojure'), [Wolfram Language](link#545 'Wolfram Language'),[\\[7\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-reference.wolfram.com-7)[\\[8\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-Amath-CO-8) [Racket](link#49 'Racket (programming language)'),[\\[9\\]](link#50) [Erlang](link#506 'Erlang (programming language)'),[\\[10\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-erlang-faq-10)[\\[11\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-armstrong2007-11)[\\[12\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-larson2009-12) [Elixir](link#561 'Elixir (programming language)'),[\\[13\\]](link#56) [OCaml](link#530 'OCaml'),[\\[14\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-minksy2008-14)[\\[15\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-leroy2007-15) [Haskell](link#536 'Haskell'),[\\[16\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-haskell-industry-16)[\\[17\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-hudak2007-17) and [F#](link#542 'F Sharp (programming language)').[\\[18\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-quantFSharp-18)[\\[19\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-businessAppsFSharp-19) [Lean](link#66 'Lean (proof assistant)') is a functional programming language commonly used for verifying mathematical theorems.[\\[20\\]](link#67) Functional programming is also key to some languages that have found success in specific domains, like [JavaScript](link#431 'JavaScript') in the Web,[\\[21\\]](link#69) [R](link#70 'R (programming language)') in statistics,[\\[22\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-useR-22)[\\[23\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-Chambers-23) [J](link#375 'J (programming language)'), [K](link#376 'K (programming language)') and [Q](link#152 'Q (programming language from Kx Systems)') in financial analysis, and [XQuery](link#76 'XQuery')/ [XSLT](link#77 'XSLT') for [XML](link#78 'XML').[\\[24\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-Novatchev-24)[\\[25\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-Mertz-25) Domain-specific declarative languages like [SQL](link#81 'SQL') and [Lex](link#82 'Lex (software)')/ [Yacc](link#83 'Yacc') use some elements of functional programming, such as not allowing [mutable values](link#84 'Mutable object').[\\[26\\]](link#85) In addition, many other programming languages support programming in a functional style or have implemented features from functional programming, such as [C++11](link#449 'C++11'), [C#](link#465 'C Sharp (programming language)'),[\\[27\\]](link#88) [Kotlin](link#450 'Kotlin (programming language)'),[\\[28\\]](link#451) [Perl](link#445 'Perl'),[\\[29\\]](link#92) [PHP](link#446 'PHP'),[\\[30\\]](link#94) [Python](link#434 'Python (programming language)'),[\\[31\\]](link#96) [Go](link#435 'Go (programming language)'),[\\[32\\]](link#98) [Rust](link#419 'Rust (programming language)'),[\\[33\\]](link#100) [Raku](link#101 'Raku (programming language)'),[\\[34\\]](link#102) [Scala](link#540 'Scala (programming language)'),[\\[35\\]](link#104) and [Java (since Java 8)](link#461 'Java (programming language)').[\\[36\\]](link#106)

## History

\\[ [edit](link#107 'Edit section: History')\\]

The [lambda calculus](link#159 'Lambda calculus'), developed in the 1930s by [Alonzo Church](link#740 'Alonzo Church'), is a [formal system](link#110 'Formal system') of [computation](link#111 'Computation') built from [function application](link#112 'Function application'). In 1937 [Alan Turing](link#113 'Alan Turing') proved that the lambda calculus and [Turing machines](link#114 'Turing machines') are equivalent models of computation,[\\[37\\]](link#115) showing that the lambda calculus is [Turing complete](link#260 'Turing complete'). Lambda calculus forms the basis of all functional programming languages. An equivalent theoretical formulation, [combinatory logic](link#117 'Combinatory logic'), was developed by [Moses Schönfinkel](link#118 'Moses Schönfinkel') and [Haskell Curry](link#1072 'Haskell Curry') in the 1920s and 1930s.[\\[38\\]](link#120)

Church later developed a weaker system, the [simply typed lambda calculus](link#121 'Simply typed lambda calculus'), which extended the lambda calculus by assigning a [data type](link#122 'Data type') to all terms.[\\[39\\]](link#123) This forms the basis for statically typed functional programming.

The first [high-level](link#1247 'High-level programming language') functional programming language, [Lisp](link#547 'Lisp (programming language)'), was developed in the late 1950s for the [IBM 700/7000 series](link#126 'IBM 700/7000 series') of scientific computers by [John McCarthy](link#753 'John McCarthy (computer scientist)') while at [Massachusetts Institute of Technology](link#128 'Massachusetts Institute of Technology') (MIT).[\\[40\\]](link#129) Lisp functions were defined using Church's lambda notation, extended with a label construct to allow [recursive](link#1123 'Recursion (computer science)') functions.[\\[41\\]](link#131) Lisp first introduced many paradigmatic features of functional programming, though early Lisps were [multi-paradigm languages](link#132 'Programming paradigm'), and incorporated support for numerous programming styles as new paradigms evolved. Later dialects, such as [Scheme](link#583 'Scheme (programming language)') and [Clojure](link#404 'Clojure'), and offshoots such as [Dylan](link#135 'Dylan (programming language)') and [Julia](link#136 'Julia (programming language)'), sought to simplify and rationalise Lisp around a cleanly functional core, while [Common Lisp](link#137 'Common Lisp') was designed to preserve and update the paradigmatic features of the numerous older dialects it replaced.[\\[42\\]](link#138)

[Information Processing Language](link#139 'Information Processing Language') (IPL), 1956, is sometimes cited as the first computer-based functional programming language.[\\[43\\]](link#140) It is an [assembly-style language](link#1243 'Assembly language') for manipulating lists of symbols. It does have a notion of _generator_, which amounts to a function that accepts a function as an argument, and, since it is an assembly-level language, code can be data, so IPL can be regarded as having higher-order functions. However, it relies heavily on the mutating list structure and similar imperative features.

[Kenneth E. Iverson](link#142 'Kenneth E. Iverson') developed [APL](link#143 'APL (programming language)') in the early 1960s, described in his 1962 book _A Programming Language_ ( [ISBN](link#1081 'ISBN (identifier)') [9780471430148](link#145 'Special:BookSources/9780471430148')). APL was the primary influence on [John Backus](link#164 'John Backus')'s [FP](link#165 'FP (programming language)'). In the early 1990s, Iverson and [Roger Hui](link#148 'Roger Hui') created [J](link#375 'J (programming language)'). In the mid-1990s, [Arthur Whitney](link#150 'Arthur Whitney (computer scientist)'), who had previously worked with Iverson, created [K](link#376 'K (programming language)'), which is used commercially in financial industries along with its descendant [Q](link#152 'Q (programming language from Kx Systems)').

In the mid-1960s, [Peter Landin](link#153 'Peter Landin') invented [SECD machine](link#154 'SECD machine'),[\\[44\\]](link#155) the first [abstract machine](link#156 'Abstract machine') for a functional programming language,[\\[45\\]](link#157) described a correspondence between [ALGOL 60](link#158 'ALGOL 60') and the [lambda calculus](link#159 'Lambda calculus'),[\\[46\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-46)[\\[47\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-47) and proposed the [ISWIM](link#162 'ISWIM') programming language.[\\[48\\]](link#163)

[John Backus](link#164 'John Backus') presented [FP](link#165 'FP (programming language)') in his 1977 [Turing Award](link#166 'Turing Award') lecture "Can Programming Be Liberated From the [von Neumann](link#167 'Von Neumann architecture') Style? A Functional Style and its Algebra of Programs".[\\[49\\]](link#168) He defines functional programs as being built up in a hierarchical way by means of "combining forms" that allow an "algebra of programs"; in modern language, this means that functional programs follow the [principle of compositionality](link#169 'Principle of compositionality').\\[ _[citation needed](link#571 'Wikipedia:Citation needed')_\\] Backus's paper popularized research into functional programming, though it emphasized [function-level programming](link#1137 'Function-level programming') rather than the lambda-calculus style now associated with functional programming.

The 1973 language [ML](link#172 'ML (programming language)') was created by [Robin Milner](link#173 'Robin Milner') at the [University of Edinburgh](link#174 'University of Edinburgh'), and [David Turner](link#845 'David Turner (computer scientist)') developed the language [SASL](link#176 'SASL (programming language)') at the [University of St Andrews](link#177 'University of St Andrews'). Also in Edinburgh in the 1970s, Burstall and Darlington developed the functional language [NPL](link#178 'NPL (programming language)').[\\[50\\]](link#179) NPL was based on [Kleene Recursion Equations](link#180 "Kleene's recursion theorem") and was first introduced in their work on program transformation.[\\[51\\]](link#181) Burstall, MacQueen and Sannella then incorporated the [polymorphic](link#182 'Polymorphism (computer science)') type checking from ML to produce the language [Hope](link#183 'Hope (programming language)').[\\[52\\]](link#184) ML eventually developed into several dialects, the most common of which are now [OCaml](link#530 'OCaml') and [Standard ML](link#549 'Standard ML').

In the 1970s, [Guy L. Steele](link#187 'Guy L. Steele') and [Gerald Jay Sussman](link#1067 'Gerald Jay Sussman') developed [Scheme](link#583 'Scheme (programming language)'), as described in the [Lambda Papers](link#190 'Lambda Papers') and the 1985 textbook _[Structure and Interpretation of Computer Programs](link#191 'Structure and Interpretation of Computer Programs')_. Scheme was the first dialect of lisp to use [lexical scoping](link#192 'Lexical scope') and to require [tail-call optimization](link#193 'Tail-call optimization'), features that encourage functional programming.

In the 1980s, [Per Martin-Löf](link#194 'Per Martin-Löf') developed [intuitionistic type theory](link#301 'Intuitionistic type theory') (also called _constructive_ type theory), which associated functional programs with [constructive proofs](link#196 'Constructive proof') expressed as [dependent types](link#1131 'Dependent type'). This led to new approaches to [interactive theorem proving](link#198 'Interactive theorem proving') and has influenced the development of subsequent functional programming languages.\\[ _[citation needed](link#571 'Wikipedia:Citation needed')_\\]

The lazy functional language, [Miranda](link#277 'Miranda (programming language)'), developed by David Turner, initially appeared in 1985 and had a strong influence on [Haskell](link#536 'Haskell'). With Miranda being proprietary, Haskell began with a consensus in 1987 to form an [open standard](link#202 'Open standard') for functional programming research; implementation releases have been ongoing as of 1990.

More recently it has found use in niches such as parametric [CAD](link#203 'Computer Aided Design') in the [OpenSCAD](link#204 'OpenSCAD') language built on the [CGAL](link#205 'CGAL') framework, although its restriction on reassigning values (all values are treated as constants) has led to confusion among users who are unfamiliar with functional programming as a concept.[\\[53\\]](link#206)

Functional programming continues to be used in commercial settings.[\\[54\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-54)[\\[55\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-55)[\\[56\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-56)

## Concepts

\\[ [edit](link#210 'Edit section: Concepts')\\]

A number of concepts[\\[57\\]](link#211) and paradigms are specific to functional programming, and generally foreign to [imperative programming](link#1100 'Imperative programming') (including [object-oriented programming](link#1111 'Object-oriented programming')). However, programming languages often cater to several programming paradigms, so programmers using "mostly imperative" languages may have utilized some of these concepts.[\\[58\\]](link#214)

### First-class and higher-order functions

\\[ [edit](link#215 'Edit section: First-class and higher-order functions')\\]

Main articles: [First-class function](link#437 'First-class function') and [Higher-order function](link#492 'Higher-order function')

[Higher-order functions](link#492 'Higher-order function') are functions that can either take other functions as arguments or return them as results. In calculus, an example of a higher-order function is the [differential operator](link#219 'Differential operator')d/dx{\\\\displaystyle d/dx}![{\displaystyle d/dx}](image#2), which returns the [derivative](link#220 'Derivative') of a function f{\\\\displaystyle f}![{\displaystyle f}](image#3).

Higher-order functions are closely related to [first-class functions](link#437 'First-class function') in that higher-order functions and first-class functions both allow functions as arguments and results of other functions. The distinction between the two is subtle: "higher-order" describes a mathematical concept of functions that operate on other functions, while "first-class" is a computer science term for programming language entities that have no restriction on their use (thus first-class functions can appear anywhere in the program that other first-class entities like numbers can, including as arguments to other functions and as their return values).

Higher-order functions enable [partial application](link#1125 'Partial application') or [currying](link#223 'Currying'), a technique that applies a function to its arguments one at a time, with each application returning a new function that accepts the next argument. This lets a programmer succinctly express, for example, the [successor function](link#224 'Successor function') as the addition operator partially applied to the [natural number](link#225 'Natural number') one.

### Pure functions

\\[ [edit](link#226 'Edit section: Pure functions')\\]

Main article: [Pure function](link#228 'Pure function')

[Pure functions](link#228 'Pure function') (or expressions) have no [side effects](link#343 'Side effect (computer science)') (memory or I/O). This means that pure functions have several useful properties, many of which can be used to optimize the code:

- If the result of a pure expression is not used, it can be removed without affecting other expressions.
- If a pure function is called with arguments that cause no side-effects, the result is constant with respect to that argument list (sometimes called [referential transparency](link#325 'Referential transparency') or [idempotence](link#231 'Idempotence')), i.e., calling the pure function again with the same arguments returns the same result. (This can enable caching optimizations such as [memoization](link#232 'Memoization').)
- If there is no data dependency between two pure expressions, their order can be reversed, or they can be performed in [parallel](link#233 'Parallelization') and they cannot interfere with one another (in other terms, the evaluation of any pure expression is [thread-safe](link#234 'Thread-safe')).
- If the entire language does not allow side-effects, then any evaluation strategy can be used; this gives the compiler freedom to reorder or combine the evaluation of expressions in a program (for example, using [deforestation](link#235 'Deforestation (computer science)')).

While most compilers for imperative programming languages detect pure functions and perform common-subexpression elimination for pure function calls, they cannot always do this for pre-compiled libraries, which generally do not expose this information, thus preventing optimizations that involve those external functions. Some compilers, such as [gcc](link#236 'GNU Compiler Collection'), add extra keywords for a programmer to explicitly mark external functions as pure, to enable such optimizations. [Fortran 95](link#429 'Fortran 95') also lets functions be designated _pure_.[\\[59\\]](link#430) C++11 added \`constexpr\` keyword with similar semantics.

### Recursion

\\[ [edit](link#239 'Edit section: Recursion')\\]

Main article: [Recursion (computer science)](link#1123 'Recursion (computer science)')

[Iteration](link#241 'Iteration') (looping) in functional languages is usually accomplished via [recursion](link#242 'Recursion'). [Recursive functions](link#1123 'Recursion (computer science)') invoke themselves, letting an operation be repeated until it reaches the [base case](link#1123 'Recursion (computer science)'). In general, recursion requires maintaining a [stack](link#245 'Call stack'), which consumes space in a linear amount to the depth of recursion. This could make recursion prohibitively expensive to use instead of imperative loops. However, a special form of recursion known as [tail recursion](link#246 'Tail recursion') can be recognized and optimized by a compiler into the same code used to implement iteration in imperative languages. Tail recursion optimization can be implemented by transforming the program into [continuation passing style](link#247 'Continuation passing style') during compiling, among other approaches.

The [Scheme](link#583 'Scheme (programming language)') language standard requires implementations to support proper tail recursion, meaning they must allow an unbounded number of active tail calls.[\\[60\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-SchemeProperTailRec-60)[\\[61\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-61) Proper tail recursion is not simply an optimization; it is a language feature that assures users that they can use recursion to express a loop and doing so would be safe-for-space.[\\[62\\]](link#251) Moreover, contrary to its name, it accounts for all tail calls, not just tail recursion. While proper tail recursion is usually implemented by turning code into imperative loops, implementations might implement it in other ways. For example, [Chicken](link#252 'Chicken (Scheme implementation)') intentionally maintains a stack and lets the [stack overflow](link#253 'Stack overflow'). However, when this happens, its [garbage collector](link#254 'Garbage collection (computer science)') will claim space back,[\\[63\\]](link#255) allowing an unbounded number of active tail calls even though it does not turn tail recursion into a loop.

Common patterns of recursion can be abstracted away using higher-order functions, with [catamorphisms](link#470 'Catamorphism') and [anamorphisms](link#257 'Anamorphism') (or "folds" and "unfolds") being the most obvious examples. Such recursion schemes play a role analogous to built-in control structures such as [loops](link#258 'Program loops') in [imperative languages](link#259 'Imperative languages').

Most general purpose functional programming languages allow unrestricted recursion and are [Turing complete](link#260 'Turing complete'), which makes the [halting problem](link#261 'Halting problem') [undecidable](link#262 'Undecidable problem'), can cause unsoundness of [equational reasoning](link#263 'Equational reasoning'), and generally requires the introduction of [inconsistency](link#264 'Inconsistency') into the logic expressed by the language's [type system](link#287 'Type system'). Some special purpose languages such as [Coq](link#297 'Coq (software)') allow only [well-founded](link#267 'Well-founded') recursion and are [strongly normalizing](link#268 'Strongly normalizing') (nonterminating computations can be expressed only with infinite streams of values called [codata](link#269 'Codata (computer science)')). As a consequence, these languages fail to be Turing complete and expressing certain functions in them is impossible, but they can still express a wide class of interesting computations while avoiding the problems introduced by unrestricted recursion. Functional programming limited to well-founded recursion with a few other constraints is called [total functional programming](link#1128 'Total functional programming').[\\[64\\]](link#271)

### Strict versus non-strict evaluation

\\[ [edit](link#272 'Edit section: Strict versus non-strict evaluation')\\]

Main article: [Evaluation strategy](link#273 'Evaluation strategy')

Functional languages can be categorized by whether they use _strict (eager)_ or _non-strict (lazy)_ evaluation, concepts that refer to how function arguments are processed when an expression is being evaluated. The technical difference is in the [denotational semantics](link#274 'Denotational semantics') of expressions containing failing or divergent computations. Under strict evaluation, the evaluation of any term containing a failing subterm fails. For example, the expression:

\`\`\`
print length([2+1, 3*2, 1/0, 5-4])

\`\`\`

fails under strict evaluation because of the division by zero in the third element of the list. Under lazy evaluation, the length function returns the value 4 (i.e., the number of items in the list), since evaluating it does not attempt to evaluate the terms making up the list. In brief, strict evaluation always fully evaluates function arguments before invoking the function. Lazy evaluation does not evaluate function arguments unless their values are required to evaluate the function call itself.

The usual implementation strategy for lazy evaluation in functional languages is [graph reduction](link#275 'Graph reduction').[\\[65\\]](link#276) Lazy evaluation is used by default in several pure functional languages, including [Miranda](link#277 'Miranda (programming language)'), [Clean](link#369 'Clean (programming language)'), and [Haskell](link#536 'Haskell').

[Hughes 1984](link#280) argues for lazy evaluation as a mechanism for improving program modularity through [separation of concerns](link#1231 'Separation of concerns'), by easing independent implementation of producers and consumers of data streams.[\\[2\\]](link#282) Launchbury 1993 describes some difficulties that lazy evaluation introduces, particularly in analyzing a program's storage requirements, and proposes an [operational semantics](link#283 'Operational semantics') to aid in such analysis.[\\[66\\]](link#398) Harper 2009 proposes including both strict and lazy evaluation in the same language, using the language's type system to distinguish them.[\\[67\\]](link#285)

### Type systems

\\[ [edit](link#286 'Edit section: Type systems')\\]

Main article: [Type system](link#287 'Type system')

Especially since the development of [Hindley–Milner type inference](link#288 'Hindley–Milner type inference') in the 1970s, functional programming languages have tended to use [typed lambda calculus](link#289 'Typed lambda calculus'), rejecting all invalid programs at compilation time and risking [false positive errors](link#290 'False positives and false negatives'), as opposed to the [untyped lambda calculus](link#291 'Untyped lambda calculus'), that accepts all valid programs at compilation time and risks [false negative errors](link#292 'False positives and false negatives'), used in Lisp and its variants (such as [Scheme](link#583 'Scheme (programming language)')), as they reject all invalid programs at runtime when the information is enough to not reject valid programs. The use of [algebraic data types](link#294 'Algebraic data type') makes manipulation of complex data structures convenient; the presence of strong compile-time type checking makes programs more reliable in absence of other reliability techniques like [test-driven development](link#295 'Test-driven development'), while [type inference](link#296 'Type inference') frees the programmer from the need to manually declare types to the compiler in most cases.

Some research-oriented functional languages such as [Coq](link#297 'Coq (software)'), [Agda](link#298 'Agda (programming language)'), [Cayenne](link#299 'Lennart Augustsson'), and [Epigram](link#300 'Epigram (programming language)') are based on [intuitionistic type theory](link#301 'Intuitionistic type theory'), which lets types depend on terms. Such types are called [dependent types](link#1131 'Dependent type'). These type systems do not have decidable type inference and are difficult to understand and program with.[\\[68\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-68)[\\[69\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-69)[\\[70\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-70)[\\[71\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-71) But dependent types can express arbitrary propositions in [higher-order logic](link#307 'Higher-order logic'). Through the [Curry–Howard isomorphism](link#308 'Curry–Howard isomorphism'), then, well-typed programs in these languages become a means of writing formal [mathematical proofs](link#309 'Mathematical proof') from which a compiler can generate [certified code](link#310 'Formal verification'). While these languages are mainly of interest in academic research (including in [formalized mathematics](link#311 'Formalized mathematics')), they have begun to be used in engineering as well. [Compcert](link#312 'Compcert') is a [compiler](link#313 'Compiler') for a subset of the language [C](link#363 'C (programming language)') that is written in Coq and formally verified.[\\[72\\]](link#315)

A limited form of dependent types called [generalized algebraic data types](link#1130 'Generalized algebraic data type') (GADT's) can be implemented in a way that provides some of the benefits of dependently typed programming while avoiding most of its inconvenience.[\\[73\\]](link#317) GADT's are available in the [Glasgow Haskell Compiler](link#318 'Glasgow Haskell Compiler'), in [OCaml](link#530 'OCaml')[\\[74\\]](link#320) and in [Scala](link#540 'Scala (programming language)'),[\\[75\\]](link#322) and have been proposed as additions to other languages including Java and C#.[\\[76\\]](link#323)

### Referential transparency

\\[ [edit](link#324 'Edit section: Referential transparency')\\]

Main article: [Referential transparency](link#325 'Referential transparency')

Functional programs do not have assignment statements, that is, the value of a variable in a functional program never changes once defined. This eliminates any chances of side effects because any variable can be replaced with its actual value at any point of execution. So, functional programs are referentially transparent.[\\[77\\]](link#326)

Consider [C](link#363 'C (programming language)') assignment statement \`x=x*10\`, this changes the value assigned to the variable \`x\`. Let us say that the initial value of \`x\` was \`1\`, then two consecutive evaluations of the variable \`x\` yields \`10\` and \`100\` respectively. Clearly, replacing \`x=x*10\` with either \`10\` or \`100\` gives a program a different meaning, and so the expression _is not_ referentially transparent. In fact, assignment statements are never referentially transparent.

Now, consider another function such as \`int plusone(int x) {return x+1;}\` _is_ transparent, as it does not implicitly change the input x and thus has no such [side effects](link#343 'Side effect (computer science)').
Functional programs exclusively use this type of function and are therefore referentially transparent.

### Data structures

\\[ [edit](link#329 'Edit section: Data structures')\\]

Main article: [Purely functional data structure](link#330 'Purely functional data structure')

Purely functional [data structures](link#331 'Data structure') are often represented in a different way to their [imperative](link#1100 'Imperative programming') counterparts.[\\[78\\]](link#333) For example, the [array](link#334 'Array data structure') with constant access and update times is a basic component of most imperative languages, and many imperative data-structures, such as the [hash table](link#335 'Hash table') and [binary heap](link#336 'Binary heap'), are based on arrays. Arrays can be replaced by [maps](link#337 'Map (computer science)') or random access lists, which admit purely functional implementation, but have [logarithmic](link#338 'Logarithm') access and update times. Purely functional data structures have [persistence](link#339 'Persistent data structure'), a property of keeping previous versions of the data structure unmodified. In Clojure, persistent data structures are used as functional alternatives to their imperative counterparts. Persistent vectors, for example, use trees for partial updating. Calling the insert method will result in some but not all nodes being created.[\\[79\\]](link#340)

## Comparison to imperative programming

\\[ [edit](link#341 'Edit section: Comparison to imperative programming')\\]

Functional programming is very different from [imperative programming](link#1100 'Imperative programming'). The most significant differences stem from the fact that functional programming avoids [side effects](link#343 'Side effect (computer science)'), which are used in imperative programming to implement state and I/O. Pure functional programming completely prevents side-effects and provides referential transparency.

Higher-order functions are rarely used in older imperative programming. A traditional imperative program might use a loop to traverse and modify a list. A functional program, on the other hand, would probably use a higher-order "map" function that takes a function and a list, generating and returning a new list by applying the function to each list item.

### Imperative vs. functional programming

\\[ [edit](link#344 'Edit section: Imperative vs. functional programming')\\]

The following two examples (written in [JavaScript](link#431 'JavaScript')) achieve the same effect: they multiply all even numbers in an array by 10 and add them all, storing the final sum in the variable \`result\`.

Traditional imperative loop:

\`\`\`
const numList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let result = 0;
for (let i = 0; i < numList.length; i++) {
if (numList[i] % 2 === 0) {
result += numList[i] \* 10;
}
}

\`\`\`

Functional programming with higher-order functions:

\`\`\`
const result = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
.filter(n => n % 2 === 0)
.map(a => a \* 10)
.reduce((a, b) => a + b, 0);

\`\`\`

Sometimes the abstractions offered by functional programming might lead to development of more robust code that avoids certain issues that might arise when building upon large amount of complex, imperative code, such as [off-by-one errors](link#346 'Off-by-one error') (see [Greenspun's tenth rule](link#347 "Greenspun's tenth rule")).

### Simulating state

\\[ [edit](link#348 'Edit section: Simulating state')\\]

There are tasks (for example, maintaining a bank account balance) that often seem most naturally implemented with state. Pure functional programming performs these tasks, and I/O tasks such as accepting user input and printing to the screen, in a different way.

The pure functional programming language [Haskell](link#536 'Haskell') implements them using [monads](link#350 'Monad (functional programming)'), derived from [category theory](link#570 'Category theory').[\\[80\\]](link#352) Monads offer a way to abstract certain types of computational patterns, including (but not limited to) modeling of computations with mutable state (and other side effects such as I/O) in an imperative manner without losing purity. While existing monads may be easy to apply in a program, given appropriate templates and examples, many students find them difficult to understand conceptually, e.g., when asked to define new monads (which is sometimes needed for certain types of libraries).[\\[81\\]](link#353)

Functional languages also simulate states by passing around immutable states. This can be done by making a function accept the state as one of its parameters, and return a new state together with the result, leaving the old state unchanged.[\\[82\\]](link#354)

Impure functional languages usually include a more direct method of managing mutable state. [Clojure](link#404 'Clojure'), for example, uses managed references that can be updated by applying pure functions to the current state. This kind of approach enables mutability while still promoting the use of pure functions as the preferred way to express computations.\\[ _[citation needed](link#571 'Wikipedia:Citation needed')_\\]

Alternative methods such as [Hoare logic](link#357 'Hoare logic') and [uniqueness](link#358 'Uniqueness type') have been developed to track side effects in programs. Some modern research languages use [effect systems](link#359 'Effect system') to make the presence of side effects explicit.[\\[83\\]](link#360)

### Efficiency issues

\\[ [edit](link#361 'Edit section: Efficiency issues')\\]

Functional programming languages are typically less efficient in their use of [CPU](link#362 'Central processing unit') and memory than imperative languages such as [C](link#363 'C (programming language)') and [Pascal](link#364 'Pascal (programming language)').[\\[84\\]](link#365) This is related to the fact that some mutable data structures like arrays have a very straightforward implementation using present hardware. Flat arrays may be accessed very efficiently with deeply pipelined CPUs, prefetched efficiently through caches (with no complex [pointer chasing](link#366 'Pointer chasing (page does not exist)')), or handled with SIMD instructions. It is also not easy to create their equally efficient general-purpose immutable counterparts. For purely functional languages, the worst-case slowdown is logarithmic in the number of memory cells used, because mutable memory can be represented by a purely functional data structure with logarithmic access time (such as a balanced tree).[\\[85\\]](link#367) However, such slowdowns are not universal. For programs that perform intensive numerical computations, functional languages such as [OCaml](link#530 'OCaml') and [Clean](link#369 'Clean (programming language)') are only slightly slower than C according to [The Computer Language Benchmarks Game](link#370 'The Computer Language Benchmarks Game').[\\[86\\]](link#371) For programs that handle large [matrices](link#372 'Matrix (mathematics)') and multidimensional [databases](link#373 'Database'), [array](link#1158 'Array programming') functional languages (such as [J](link#375 'J (programming language)') and [K](link#376 'K (programming language)')) were designed with speed optimizations.

Immutability of data can in many cases lead to execution efficiency by allowing the compiler to make assumptions that are unsafe in an imperative language, thus increasing opportunities for [inline expansion](link#377 'Inline expansion').[\\[87\\]](link#378) Even if the involved copying that may seem implicit when dealing with persistent immutable data structures might seem computationally costly, some functional programming languages, like [Clojure](link#404 'Clojure') solve this issue by implementing mechanisms for safe memory sharing between _formally_ _immutable_ data.[\\[88\\]](link#380) [Rust](link#419 'Rust (programming language)') distinguishes itself by its approach to data immutability which involves immutable [references](link#382 'Reference (computer science)')[\\[89\\]](link#383) and a concept called _lifetimes._[\\[90\\]](link#384)

Immutable data with separation of identity and state and [shared-nothing](link#385 'Shared-nothing architecture') schemes can also potentially be more well-suited for [concurrent and parallel](link#1193 'Parallel computing') programming by the virtue of reducing or eliminating the risk of certain concurrency hazards, since concurrent operations are usually [atomic](link#387 'Linearizability') and this allows eliminating the need for locks. This is how for example \`java.util.concurrent\` classes are implemented, where some of them are immutable variants of the corresponding classes that are not suitable for concurrent use.[\\[91\\]](link#388) Functional programming languages often have a concurrency model that instead of shared state and synchronization, leverages [message passing](link#389 'Message passing') mechanisms (such as the [actor model](link#1194 'Actor model'), where each actor is a container for state, behavior, child actors and a message queue).[\\[92\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-92)[\\[93\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-93) This approach is common in [Erlang](link#506 'Erlang (programming language)')/ [Elixir](link#561 'Elixir (programming language)') or [Akka](link#395 'Akka (toolkit)').

[Lazy evaluation](link#396 'Lazy evaluation') may also speed up the program, even asymptotically, whereas it may slow it down at most by a constant factor (however, it may introduce [memory leaks](link#397 'Memory leak') if used improperly). Launchbury 1993[\\[66\\]](link#398) discusses theoretical issues related to memory leaks from lazy evaluation, and O'Sullivan _et al._ 2008[\\[94\\]](link#399) give some practical advice for analyzing and fixing them.
However, the most general implementations of lazy evaluation making extensive use of dereferenced code and data perform poorly on modern processors with deep pipelines and multi-level caches (where a cache miss may cost hundreds of cycles) \\[ _[citation needed](link#571 'Wikipedia:Citation needed')_\\].

#### Abstraction cost

\\[ [edit](link#401 'Edit section: Abstraction cost')\\]

Some functional programming languages might not optimize abstractions such as higher order functions like " [map](link#454 'Map (higher-order function)')" or " [filter](link#456 'Filter (higher-order function)')" as efficiently as the underlying imperative operations. Consider, as an example, the following two ways to check if 5 is an even number in [Clojure](link#404 'Clojure'):

\`\`\`
(even? 5)
(.equals (mod 5 2) 0)

\`\`\`

When [benchmarked](link#405 'Benchmarking') using the [Criterium](link#406) tool on a [Ryzen 7900X](link#407 'Zen 3') GNU/Linux PC in a [Leiningen](link#408 'Leiningen (software)') [REPL](link#409 'REPL') 2.11.2, running on [Java VM](link#410 'JVM') version 22 and Clojure version 1.11.1, the first implementation, which is implemented as:

\`\`\`
(defn even?
"Returns true if n is even, throws an exception if n is not an integer"
{:added "1.0"
:static true}
[n] (if (integer? n)
(zero? (bit-and (clojure.lang.RT/uncheckedLongCast n) 1))
(throw (IllegalArgumentException. (str "Argument must be an integer: " n)))))

\`\`\`

has the mean execution time of 4.76 ms, while the second one, in which \`.equals\` is a direct invocation of the underlying [Java](link#461 'Java (programming language)') method, has a mean execution time of 2.8 μs – roughly 1700 times faster. Part of that can be attributed to the type checking and exception handling involved in the implementation of \`even?\`. For instance the [lo library](link#941) for [Go](link#435 'Go (programming language)'), which implements various higher-order functions common in functional programming languages using [generics](link#1215 'Generic programming'). In a benchmark provided by the library's author, calling \`map\` is 4% slower than an equivalent \`for\` loop and has the same [allocation](link#415 'Memory management') profile,[\\[95\\]](link#416) which can be attributed to various compiler optimizations, such as [inlining](link#417 'Inlining').[\\[96\\]](link#418)

One distinguishing feature of [Rust](link#419 'Rust (programming language)') are _zero-cost abstractions_. This means that using them imposes no additional runtime overhead. This is achieved thanks to the compiler using [loop unrolling](link#420 'Loop unrolling'), where each iteration of a loop, be it imperative or using iterators, is converted into a standalone [Assembly](link#1243 'Assembly language') instruction, without the overhead of the loop controlling code. If an iterative operation writes to an array, the resulting array's elements [will be stored in specific CPU registers](link#422 'Register allocation'), allowing for [constant-time access](link#423 'Time complexity') at runtime.[\\[97\\]](link#424)

### Functional programming in non-functional languages

\\[ [edit](link#425 'Edit section: Functional programming in non-functional languages')\\]

It is possible to use a functional style of programming in languages that are not traditionally considered functional languages.[\\[98\\]](link#426) For example, both [D](link#427 'D (programming language)')[\\[99\\]](link#428) and [Fortran 95](link#429 'Fortran 95')[\\[59\\]](link#430) explicitly support pure functions.

[JavaScript](link#431 'JavaScript'), [Lua](link#432 'Lua (programming language)'),[\\[100\\]](link#433) [Python](link#434 'Python (programming language)') and [Go](link#435 'Go (programming language)')[\\[101\\]](link#436) had [first class functions](link#437 'First-class function') from their inception.[\\[102\\]](link#438) Python had support for " [lambda](link#1124 'Anonymous function')", " [map](link#454 'Map (higher-order function)')", " [reduce](link#471 'Fold (higher-order function)')", and " [filter](link#456 'Filter (higher-order function)')" in 1994, as well as closures in Python 2.2,[\\[103\\]](link#443) though Python 3 relegated "reduce" to the \`functools\` standard library module.[\\[104\\]](link#444) First-class functions have been introduced into other mainstream languages such as [Perl](link#445 'Perl') 5.0 in 1994, [PHP](link#446 'PHP') 5.3, [Visual Basic 9](link#447 'Visual Basic 9'), [C#](link#465 'C Sharp (programming language)') 3.0, [C++11](link#449 'C++11'), and [Kotlin](link#450 'Kotlin (programming language)').[\\[28\\]](link#451)\\[ _[citation needed](link#571 'Wikipedia:Citation needed')_\\]

In Perl, [lambda](link#1124 'Anonymous function'), [map](link#454 'Map (higher-order function)'), [reduce](link#471 'Fold (higher-order function)'), [filter](link#456 'Filter (higher-order function)'), and [closures](link#460 'Closure (computer science)') are fully supported and frequently used. The book [Higher-Order Perl](link#708 'Higher-Order Perl'), released in 2005, was written to provide an expansive guide on using Perl for functional programming.

In PHP, [anonymous classes](link#459 'Anonymous class'), [closures](link#460 'Closure (computer science)') and lambdas are fully supported. Libraries and language extensions for immutable data structures are being developed to aid programming in the functional style.

In [Java](link#461 'Java (programming language)'), anonymous classes can sometimes be used to simulate closures;[\\[105\\]](link#462) however, anonymous classes are not always proper replacements to closures because they have more limited capabilities.[\\[106\\]](link#463) Java 8 supports lambda expressions as a replacement for some anonymous classes.[\\[107\\]](link#464)

In [C#](link#465 'C Sharp (programming language)'), anonymous classes are not necessary, because closures and lambdas are fully supported. Libraries and language extensions for immutable data structures are being developed to aid programming in the functional style in C#.

Many [object-oriented](link#466 'Object-oriented') [design patterns](link#467 'Design pattern (computer science)') are expressible in functional programming terms: for example, the [strategy pattern](link#468 'Strategy pattern') simply dictates use of a higher-order function, and the [visitor](link#469 'Visitor (design pattern)') pattern roughly corresponds to a [catamorphism](link#470 'Catamorphism'), or [fold](link#471 'Fold (higher-order function)').

Similarly, the idea of immutable data from functional programming is often included in imperative programming languages,[\\[108\\]](link#472) for example the tuple in Python, which is an immutable array, and Object.freeze() in JavaScript.[\\[109\\]](link#473)

## Comparison to logic programming

\\[ [edit](link#474 'Edit section: Comparison to logic programming')\\]

[Logic programming](link#1146 'Logic programming') can be viewed as a generalisation of functional programming, in which functions are a special case of relations.[\\[110\\]](link#476)
For example, the function, mother(X) = Y, (every X has only one mother Y) can be represented by the relation mother(X, Y). Whereas functions have a strict input-output pattern of arguments, relations can be queried with any pattern of inputs and outputs. Consider the following logic program:

\`\`\`
mother(charles, elizabeth).
mother(harry, diana).

\`\`\`

The program can be queried, like a functional program, to generate mothers from children:

\`\`\`
?- mother(harry, X).
X = diana.
?- mother(charles, X).
X = elizabeth.

\`\`\`

But it can also be queried _backwards_, to generate children:

\`\`\`
?- mother(X, elizabeth).
X = charles.
?- mother(X, diana).
X = harry.

\`\`\`

It can even be used to generate all instances of the mother relation:

\`\`\`
?- mother(X, Y).
X = charles,
Y = elizabeth.
X = harry,
Y = diana.

\`\`\`

Compared with relational syntax, functional syntax is a more compact notation for nested functions. For example, the definition of maternal grandmother in functional syntax can be written in the nested form:

\`\`\`
maternal_grandmother(X) = mother(mother(X)).

\`\`\`

The same definition in relational notation needs to be written in the unnested form:

\`\`\`
maternal_grandmother(X, Y) :- mother(X, Z), mother(Z, Y).

\`\`\`

Here \`:-\` means _if_ and \` , \` means _and_.

However, the difference between the two representations is simply syntactic. In [Ciao](link#477 'Ciao (programming language)') Prolog, relations can be nested, like functions in functional programming:[\\[111\\]](link#478)

\`\`\`
grandparent(X) := parent(parent(X)).
parent(X) := mother(X).
parent(X) := father(X).

mother(charles) := elizabeth.
father(charles) := phillip.
mother(harry) := diana.
father(harry) := charles.

?- grandparent(X,Y).
X = harry,
Y = elizabeth.
X = harry,
Y = phillip.

\`\`\`

Ciao transforms the function-like notation into relational form and executes the resulting logic program using the standard Prolog execution strategy.

## Applications

\\[ [edit](link#479 'Edit section: Applications')\\]

### Text editors

\\[ [edit](link#480 'Edit section: Text editors')\\]

[Emacs](link#481 'Emacs'), a highly extensible text editor family uses its own [Lisp dialect](link#482 'Emacs Lisp') for writing plugins. The original author of the most popular Emacs implementation, [GNU Emacs](link#483 'GNU Emacs') and Emacs Lisp, [Richard Stallman](link#484 'Richard Stallman') considers Lisp one of his favorite programming languages.[\\[112\\]](link#485)

[Helix](link#486 'Helix (text editor) (page does not exist)'), since version 24.03 supports previewing [AST](link#487 'Abstract syntax tree') as [S-expressions](link#488 'S-expression'), which are also the core feature of the Lisp programming language family.[\\[113\\]](link#489)

### Spreadsheets

\\[ [edit](link#490 'Edit section: Spreadsheets')\\]

[Spreadsheets](link#491 'Spreadsheet') can be considered a form of pure, [zeroth-order](link#492 'Higher-order function'), strict-evaluation functional programming system.[\\[114\\]](link#493) However, spreadsheets generally lack higher-order functions as well as code reuse, and in some implementations, also lack recursion. Several extensions have been developed for spreadsheet programs to enable higher-order and reusable functions, but so far remain primarily academic in nature.[\\[115\\]](link#494)

### Microservices

\\[ [edit](link#495 'Edit section: Microservices')\\]

Due to their [composability](link#496 'Composability'), functional programming paradigms can be suitable for [microservices](link#497 'Microservices')-based architectures.[\\[116\\]](link#498)

### Academia

\\[ [edit](link#499 'Edit section: Academia')\\]

Functional programming is an active area of research in the field of [programming language theory](link#500 'Programming language theory'). There are several [peer-reviewed](link#501 'Peer-review') publication venues focusing on functional programming, including the [International Conference on Functional Programming](link#502 'International Conference on Functional Programming'), the [Journal of Functional Programming](link#503 'Journal of Functional Programming'), and the [Symposium on Trends in Functional Programming](link#504 'Symposium on Trends in Functional Programming').

### Industry

\\[ [edit](link#505 'Edit section: Industry')\\]

Functional programming has been employed in a wide range of industrial applications. For example, [Erlang](link#506 'Erlang (programming language)'), which was developed by the [Swedish](link#507 'Sweden') company [Ericsson](link#508 'Ericsson') in the late 1980s, was originally used to implement [fault-tolerant](link#509 'Fault tolerance') [telecommunications](link#510 'Telecommunications') systems,[\\[11\\]](link#511) but has since become popular for building a range of applications at companies such as [Nortel](link#512 'Nortel'), [Facebook](link#513 'Facebook'), [Électricité de France](link#514 'Électricité de France') and [WhatsApp](link#515 'WhatsApp').[\\[10\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-erlang-faq-10)[\\[12\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-larson2009-12)[\\[117\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-117)[\\[118\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-Sim-Diasca-118)[\\[119\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-whatsapp.blog.2012-119) [Scheme](link#583 'Scheme (programming language)'), a dialect of [Lisp](link#547 'Lisp (programming language)'), was used as the basis for several applications on early [Apple Macintosh](link#523 'Apple Macintosh') computers[\\[3\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-clinger1987-3)[\\[4\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-hartheimer1987-4) and has been applied to problems such as training- [simulation software](link#526 'Computer simulation')[\\[5\\]](link#527) and [telescope](link#528 'Telescope') control.[\\[6\\]](link#529) [OCaml](link#530 'OCaml'), which was introduced in the mid-1990s, has seen commercial use in areas such as financial analysis,[\\[14\\]](link#531) [driver](link#532 'Software driver') verification, industrial [robot](link#533 'Robot') programming and static analysis of [embedded software](link#534 'Embedded software').[\\[15\\]](link#535) [Haskell](link#536 'Haskell'), though initially intended as a research language,[\\[17\\]](link#539) has also been applied in areas such as aerospace systems, hardware design and web programming.[\\[16\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-haskell-industry-16)[\\[17\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-hudak2007-17)

Other functional programming languages that have seen use in industry include [Scala](link#540 'Scala (programming language)'),[\\[120\\]](link#541) [F#](link#542 'F Sharp (programming language)'),[\\[18\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-quantFSharp-18)[\\[19\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-businessAppsFSharp-19) [Wolfram Language](link#545 'Wolfram Language'),[\\[7\\]](link#546) [Lisp](link#547 'Lisp (programming language)'),[\\[121\\]](link#548) [Standard ML](link#549 'Standard ML')[\\[122\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-122)[\\[123\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-123) and Clojure.[\\[124\\]](link#552) Scala has been widely used in [Data science](link#553 'Data science'),[\\[125\\]](link#554) while [ClojureScript](link#555 'ClojureScript'),[\\[126\\]](link#556) [Elm](link#557 'Elm (programming language)')[\\[127\\]](link#558) or [PureScript](link#559 'PureScript')[\\[128\\]](link#560) are some of the functional frontend programming languages used in production. [Elixir](link#561 'Elixir (programming language)')'s Phoenix framework is also used by some relatively popular commercial projects, such as [Font Awesome](link#562 'Font Awesome') or [Allegro](link#563 'Allegro Platform') (one of the biggest e-commerce platforms in Poland)[\\[129\\]](link#564)'s classified ads platform _Allegro Lokalnie._[\\[130\\]](link#565)

Functional "platforms" have been popular in finance for risk analytics (particularly with large investment banks). Risk factors are coded as functions that form interdependent graphs (categories) to measure correlations in market shifts, similar in manner to [Gröbner basis](link#566 'Gröbner basis') optimizations but also for regulatory frameworks such as [Comprehensive Capital Analysis and Review](link#567 'Comprehensive Capital Analysis and Review'). Given the use of OCaml and [Caml](link#568 'Caml') variations in finance, these systems are sometimes considered related to a [categorical abstract machine](link#569 'Categorical abstract machine'). Functional programming is heavily influenced by [category theory](link#570 'Category theory').\\[ _[citation needed](link#571 'Wikipedia:Citation needed')_\\]

### Education

\\[ [edit](link#572 'Edit section: Education')\\]

Many [universities](link#573 'University') teach functional programming.[\\[131\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-oxfordFP-131)[\\[132\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-imperialFP-132)[\\[133\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-nottinghamFP-133)[\\[134\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-mitFP-134) Some treat it as an introductory programming concept[\\[134\\]](link#578) while others first teach imperative programming methods.[\\[133\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-nottinghamFP-133)[\\[135\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-61A-135)

Outside of computer science, functional programming is used to teach problem-solving, algebraic and geometric concepts.[\\[136\\]](link#581) It has also been used to teach classical mechanics, as in the book _[Structure and Interpretation of Classical Mechanics](link#582 'Structure and Interpretation of Classical Mechanics')_.

In particular, [Scheme](link#583 'Scheme (programming language)') has been a relatively popular choice for teaching programming for years.[\\[137\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-137)[\\[138\\]](https://en.wikipedia.org/wiki/Functional_programming#cite_note-138)

## See also

\\[ [edit](link#586 'Edit section: See also')\\]

- [![icon](https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Octicons-terminal.svg/60px-Octicons-terminal.svg.png)](https://en.wikipedia.org/wiki/File:Octicons-terminal.svg)[Computer programming portal](link#587 'Portal:Computer programming')

- [Eager evaluation](link#588 'Eager evaluation')
- [Functional reactive programming](link#1142 'Functional reactive programming')
- [Inductive functional programming](link#590 'Inductive functional programming')
- [List of functional programming languages](link#591 'List of functional programming languages')
- [List of functional programming topics](link#592 'List of functional programming topics')
- [Nested function](link#1110 'Nested function')
- [Purely functional programming](link#1127 'Purely functional programming')

## Notes and references

\\[ [edit](link#595 'Edit section: Notes and references')\\]

1. **[^](link#596 'Jump up')**[Hudak, Paul](link#668 'Paul Hudak') (September 1989). ["Conception, evolution, and application of functional programming languages"](https://web.archive.org/web/20160131083528/http://www.dbnet.ece.ntua.gr/~adamo/languages/books/p359-hudak.pdf)(PDF). _ACM Computing Surveys_. **21** (3): 359–411\\. [doi](link#990 'Doi (identifier)'): [10.1145/72551.72554](link#600). [S2CID](link#994 'S2CID (identifier)') [207637854](link#602). Archived from [the original](http://www.dbnet.ece.ntua.gr/~adamo/languages/books/p359-hudak.pdf)(PDF) on 2016-01-31. Retrieved 2013-08-10.
2. ^ [Jump up to: _**a**_](link#604) [_**b**_](link#605)[Hughes, John](link#606 'John Hughes (computer scientist)') (1984). ["Why Functional Programming Matters"](link#607).
3. ^ [Jump up to: _**a**_](link#608) [_**b**_](link#609)Clinger, Will (1987). ["MultiTasking and MacScheme"](link#610). _MacTech_. **3** (12). Retrieved 2008-08-28.
4. ^ [Jump up to: _**a**_](link#611) [_**b**_](link#612)Hartheimer, Anne (1987). ["Programming a Text Editor in MacScheme+Toolsmith"](link#613). _MacTech_. **3** (1). Archived from [the original](link#614) on 2011-06-29. Retrieved 2008-08-28.
5. ^ [Jump up to: _**a**_](link#615) [_**b**_](link#616)Kidd, Eric. [_Terrorism Response Training in Scheme_](link#617). CUFP 2007. Archived from [the original](link#618) on 2010-12-21. Retrieved 2009-08-26.
6. ^ [Jump up to: _**a**_](link#619) [_**b**_](link#620)Cleis, Richard. [_Scheme in Space_](link#621). CUFP 2006. Archived from [the original](link#622) on 2010-05-27. Retrieved 2009-08-26.
7. ^ [Jump up to: _**a**_](link#623) [_**b**_](link#624)["Wolfram Language Guide: Functional Programming"](link#625). 2015. Retrieved 2015-08-24.
8. **[^](link#626 'Jump up')**["Functional vs. Procedural Programming Language"](link#627). _Department of Applied Math_. University of Colorado. Archived from [the original](link#628) on 2007-11-13. Retrieved 2006-08-28.
9. **[^](link#629 'Jump up')**["State-Based Scripting in Uncharted 2"](https://web.archive.org/web/20121215014637/http://www.gameenginebook.com/gdc09-statescripting-uncharted2.pdf)(PDF). Archived from [the original](http://www.gameenginebook.com/gdc09-statescripting-uncharted2.pdf)(PDF) on 2012-12-15. Retrieved 2011-08-08.
10. ^ [Jump up to: _**a**_](link#632) [_**b**_](link#633)["Who uses Erlang for product development?"](link#634). _Frequently asked questions about Erlang_. Retrieved 2018-04-27.
11. ^ [Jump up to: _**a**_](link#635) [_**b**_](link#636)Armstrong, Joe (June 2007). "A history of Erlang". _Proceedings of the third ACM SIGPLAN conference on History of programming languages_. Third ACM SIGPLAN Conference on History of Programming Languages. San Diego, California. [doi](link#990 'Doi (identifier)'): [10.1145/1238844.1238850](link#638). [ISBN](link#1081 'ISBN (identifier)') [9781595937667](link#640 'Special:BookSources/9781595937667').
12. ^ [Jump up to: _**a**_](link#641) [_**b**_](link#642)Larson, Jim (March 2009). ["Erlang for concurrent programming"](link#645). _Communications of the ACM_. **52** (3): 48. [doi](link#990 'Doi (identifier)'):[10.1145/1467247.1467263](link#645). [S2CID](link#994 'S2CID (identifier)') [524392](link#647).
13. **[^](link#648 'Jump up')**["The Elixir Programming Language"](link#649). Retrieved 2021-02-14.
14. ^ [Jump up to: _**a**_](link#650) [_**b**_](link#651)Minsky, Yaron; Weeks, Stephen (July 2008). "Caml Trading — experiences with functional programming on Wall Street". _Journal of Functional Programming_. **18** (4): 553–564\\. [doi](link#990 'Doi (identifier)'):[10.1017/S095679680800676X](link#653) (inactive 1 November 2024). [S2CID](link#994 'S2CID (identifier)') [30955392](link#655).\`{{cite journal}}\`: CS1 maint: DOI inactive as of November 2024 ( [link](link#1269 'Category:CS1 maint: DOI inactive as of November 2024'))
15. ^ [Jump up to: _**a**_](link#658) [_**b**_](link#659)Leroy, Xavier. [_Some uses of Caml in Industry_](https://web.archive.org/web/20111008170929/http://cufp.galois.com/2007/slides/XavierLeroy.pdf)(PDF). CUFP 2007. Archived from [the original](http://cufp.galois.com/2007/slides/XavierLeroy.pdf)(PDF) on 2011-10-08. Retrieved 2009-08-26.
16. ^ [Jump up to: _**a**_](link#662) [_**b**_](link#663)["Haskell in industry"](link#664). _Haskell Wiki_. Retrieved 2009-08-26. Haskell has a diverse range of use commercially, from aerospace and defense, to finance, to web startups, hardware design firms and lawnmower manufacturers.
17. ^ [Jump up to: _**a**_](link#665) [_**b**_](link#666) [_**c**_](link#667)[Hudak, Paul](link#668 'Paul Hudak'); Hughes, J.; Jones, S. P.; Wadler, P. (June 2007). [_A history of Haskell: being lazy with class_](link#669). Third ACM SIGPLAN Conference on History of Programming Languages. San Diego, California. [doi](link#990 'Doi (identifier)'): [10.1145/1238844.1238856](link#671). Retrieved 2013-09-26.
18. ^ [Jump up to: _**a**_](link#672) [_**b**_](link#673)Mansell, Howard (2008). [_Quantitative Finance in F#_](link#674). CUFP 2008. Archived from [the original](link#675) on 2015-07-08. Retrieved 2009-08-29.
19. ^ [Jump up to: _**a**_](link#676) [_**b**_](link#677)Peake, Alex (2009). [_The First Substantial Line of Business Application in F#_](link#678). CUFP 2009. Archived from [the original](link#679) on 2009-10-17. Retrieved 2009-08-29.
20. **[^](link#680 'Jump up')**de Moura, Leonardo; Ullrich, Sebastian (July 2021). "The Lean 4 Theorem Prover and Programming Language". _Lecture Notes in Artificial Intelligence_. Conference on Automated Deduction. Vol. 12699. pp. 625–635\\. [doi](link#990 'Doi (identifier)'):[10.1007/978-3-030-79876-5\\\_37](link#682). [ISSN](link#992 'ISSN (identifier)') [1611-3349](link#684).
21. **[^](link#685 'Jump up')**Banz, Matt (2017-06-27). ["An introduction to functional programming in JavaScript"](link#686). _Opensource.com_. Retrieved 2021-01-09.
22. **[^](link#687 'Jump up')**["The useR! 2006 conference schedule includes papers on the commercial use of R"](link#688). R-project.org. 2006-06-08. Retrieved 2011-06-20.
23. **[^](link#689 'Jump up')**[Chambers, John M.](link#690 'John Chambers (programmer)') (1998). _Programming with Data: A Guide to the S Language_. Springer Verlag. pp. 67–70\\. [ISBN](link#1081 'ISBN (identifier)') [978-0-387-98503-9](link#692 'Special:BookSources/978-0-387-98503-9').
24. **[^](link#693 'Jump up')**Novatchev, Dimitre. ["The Functional Programming Language XSLT — A proof through examples"](link#694). Retrieved May 27, 2006.
25. **[^](link#695 'Jump up')**Mertz, David. ["XML Programming Paradigms (part four): Functional Programming approached to XML processing"](link#696). _IBM developerWorks_. Retrieved May 27, 2006.
26. **[^](link#697 'Jump up')**[Chamberlin, Donald D.](link#698 'Donald D. Chamberlin'); [Boyce, Raymond F.](link#699 'Raymond F. Boyce') (1974). "SEQUEL: A structured English query language". _Proceedings of the 1974 ACM SIGFIDET_: 249–264.
27. **[^](link#700 'Jump up')**[_Functional Programming with C# - Simon Painter - NDC Oslo 2020_](link#701), 8 August 2021, archived from [the original](link#702) on 2021-10-30, retrieved 2021-10-23
28. ^ [Jump up to: _**a**_](link#703) [_**b**_](link#704)["Functional programming - Kotlin Programming Language"](link#705). _Kotlin_. Retrieved 2019-05-01.
29. **[^](link#706 'Jump up')**[Dominus, Mark J.](link#707 'Mark Jason Dominus') (2005). [_Higher-Order Perl_](link#708 'Higher-Order Perl'). [Morgan Kaufmann](link#1078 'Morgan Kaufmann'). [ISBN](link#1081 'ISBN (identifier)') [978-1-55860-701-9](link#711 'Special:BookSources/978-1-55860-701-9').
30. **[^](link#712 'Jump up')**Holywell, Simon (2014). _Functional Programming in PHP_. php\\[architect\\]. [ISBN](link#1081 'ISBN (identifier)') [9781940111056](link#714 'Special:BookSources/9781940111056').
31. **[^](link#715 'Jump up')**The Cain Gang Ltd. ["Python Metaclasses: Who? Why? When?"](https://web.archive.org/web/20090530030205/http://www.python.org/community/pycon/dc2004/papers/24/metaclasses-pycon.pdf)(PDF). Archived from [the original](https://www.python.org/community/pycon/dc2004/papers/24/metaclasses-pycon.pdf)(PDF) on 30 May 2009. Retrieved 27 June 2009.
32. **[^](link#718 'Jump up')**["GopherCon 2020: Dylan Meeus - Functional Programming with Go"](link#719). _YouTube_. 22 December 2020.
33. **[^](link#720 'Jump up')**["Functional Language Features: Iterators and Closures - The Rust Programming Language"](link#721). _doc.rust-lang.org_. Retrieved 2021-01-09.
34. **[^](link#722 'Jump up')**Vanderbauwhede, Wim (18 July 2020). ["Cleaner code with functional programming"](link#723). Archived from [the original](link#724) on 28 July 2020. Retrieved 6 October 2020.
35. **[^](link#725 'Jump up')**["Effective Scala"](link#726). _Scala Wiki_. Archived from [the original](link#727) on 2012-06-19. Retrieved 2012-02-21. Effective Scala.
36. **[^](link#728 'Jump up')**["Documentation for package java.util.function since Java 8 (also known as Java 1.8)"](link#729). Retrieved 2021-06-16.
37. **[^](link#730 'Jump up')**Turing, A. M. (1937). "Computability and λ-definability". _The Journal of Symbolic Logic_. **2** (4). Cambridge University Press: 153–163\\. [doi](link#990 'Doi (identifier)'): [10.2307/2268280](link#732). [JSTOR](link#743 'JSTOR (identifier)') [2268280](link#734). [S2CID](link#994 'S2CID (identifier)') [2317046](link#736).
38. **[^](link#737 'Jump up')**Haskell Brooks Curry; Robert Feys (1958). [_Combinatory Logic_](link#738). North-Holland Publishing Company. Retrieved 10 February 2013.
39. **[^](link#739 'Jump up')**[Church, A.](link#740 'Alonzo Church') (1940). "A Formulation of the Simple Theory of Types". _Journal of Symbolic Logic_. **5** (2): 56–68\\. [doi](link#990 'Doi (identifier)'): [10.2307/2266170](link#742). [JSTOR](link#743 'JSTOR (identifier)') [2266170](link#744). [S2CID](link#994 'S2CID (identifier)') [15889861](link#746).
40. **[^](link#747 'Jump up')**[McCarthy, John](link#753 'John McCarthy (computer scientist)') (June 1978). [_History of Lisp_](http://jmc.stanford.edu/articles/lisp/lisp.pdf)(PDF). _History of Programming Languages_. Los Angeles, CA. pp. 173–185\\. [doi](link#990 'Doi (identifier)'): [10.1145/800025.808387](link#751).
41. **[^](link#752 'Jump up')**[John McCarthy](link#753 'John McCarthy (computer scientist)') (1960). ["Recursive functions of symbolic expressions and their computation by machine, Part I."](http://jmc.stanford.edu/articles/recursive/recursive.pdf)(PDF). _Communications of the ACM_. **3** (4). ACM New York, NY, US: 184–195\\. [doi](link#990 'Doi (identifier)'): [10.1145/367177.367199](link#756). [S2CID](link#994 'S2CID (identifier)') [1489409](link#758).
42. **[^](link#759 'Jump up')**Guy L. Steele; Richard P. Gabriel (February 1996). "The evolution of Lisp". [_History of programming languages---II_](http://dreamsongs.com/Files/HOPL2-Uncut.pdf)(PDF). pp. 233–330\\. [doi](link#990 'Doi (identifier)'): [10.1145/234286.1057818](link#762). [ISBN](link#1081 'ISBN (identifier)') [978-0-201-89502-5](link#764 'Special:BookSources/978-0-201-89502-5'). [S2CID](link#994 'S2CID (identifier)') [47047140](link#766).
43. **[^](link#767 'Jump up')**The memoir of [Herbert A. Simon](link#768 'Herbert A. Simon') (1991), _Models of My Life_ pp.189-190 [ISBN](link#1081 'ISBN (identifier)') [0-465-04640-1](link#770 'Special:BookSources/0-465-04640-1') claims that he, Al Newell, and Cliff Shaw are "...commonly adjudged to be the parents of \\[the\\] artificial intelligence \\[field\\]," for writing [Logic Theorist](link#771 'Logic Theorist'), a program that proved theorems from _[Principia Mathematica](link#772 'Principia Mathematica')_ automatically. To accomplish this, they had to invent a language and a paradigm that, viewed retrospectively, embeds functional programming.
44. **[^](link#773 'Jump up')**Landin, Peter J. (1964). ["The mechanical evaluation of expressions"](link#778). _[The Computer Journal](link#775 'The Computer Journal')_. **6** (4). [British Computer Society](link#776 'British Computer Society'): 308–320\\. [doi](link#990 'Doi (identifier)'):[10.1093/comjnl/6.4.308](link#778).
45. **[^](link#779 'Jump up')**Diehl, Stephan; Hartel, Pieter; Sestoft, Peter (2000). "Abstract machines for programming language implementation". _Future Generation Computer Systems_. Vol. 16. pp. 739–751.
46. **[^](link#780 'Jump up')**Landin, Peter J. (February 1965a). ["Correspondence between ALGOL 60 and Church's Lambda-notation: part I"](link#785). _[Communications of the ACM](link#798 'Communications of the ACM')_. **8** (2). [Association for Computing Machinery](link#881 'Association for Computing Machinery'): 89–101\\. [doi](link#990 'Doi (identifier)'):[10.1145/363744.363749](link#785). [S2CID](link#994 'S2CID (identifier)') [6505810](link#787).
47. **[^](link#788 'Jump up')**Landin, Peter J. (March 1965b). ["A correspondence between ALGOL 60 and Church's Lambda-notation: part II"](link#793). _[Communications of the ACM](link#798 'Communications of the ACM')_. **8** (3). [Association for Computing Machinery](link#881 'Association for Computing Machinery'): 158–165\\. [doi](link#990 'Doi (identifier)'):[10.1145/363791.363804](link#793). [S2CID](link#994 'S2CID (identifier)') [15781851](link#795).
48. **[^](link#796 'Jump up')**Landin, Peter J. (March 1966b). ["The next 700 programming languages"](link#801). _[Communications of the ACM](link#798 'Communications of the ACM')_. **9** (3). [Association for Computing Machinery](link#881 'Association for Computing Machinery'): 157–166\\. [doi](link#990 'Doi (identifier)'):[10.1145/365230.365257](link#801). [S2CID](link#994 'S2CID (identifier)') [13409665](link#803).
49. **[^](link#804 'Jump up')**Backus, J. (1978). ["Can programming be liberated from the von Neumann style?: A functional style and its algebra of programs"](link#807). _Communications of the ACM_. **21** (8): 613–641\\. [doi](link#990 'Doi (identifier)'):[10.1145/359576.359579](link#807).
50. **[^](link#808 'Jump up')**R.M. Burstall. Design considerations for a functional programming language. Invited paper, Proc. Infotech State of the Art Conf. "The Software Revolution", Copenhagen, 45–57 (1977)
51. **[^](link#809 'Jump up')**R.M. Burstall and J. Darlington. A transformation system for developing recursive programs. Journal of the Association for Computing Machinery 24(1):44–67 (1977)
52. **[^](link#810 'Jump up')**R.M. Burstall, D.B. MacQueen and D.T. Sannella. HOPE: an experimental applicative language. Proceedings 1980 LISP Conference, Stanford, 136–143 (1980).
53. **[^](link#811 'Jump up')**["Make discovering assign() easier!"](link#812). _OpenSCAD_. Archived from [the original](link#813) on 2023-04-19.
54. **[^](link#814 'Jump up')**Peter Bright (March 13, 2018). ["Developers love trendy new languages but earn more with functional programming"](link#815). _[Ars Technica](link#816 'Ars Technica')_.
55. **[^](link#817 'Jump up')**John Leonard (January 24, 2017). ["The stealthy rise of functional programming"](link#818). Computing.
56. **[^](link#819 'Jump up')**Leo Cheung (May 9, 2017). ["Is functional programming better for your startup?"](link#820). _[InfoWorld](link#821 'InfoWorld')_.
57. **[^](link#822 'Jump up')**Sean Tull - Monoidal Categories for Formal Concept Analysis.
58. **[^](link#823 'Jump up')**Pountain, Dick. ["Functional Programming Comes of Age"](link#824). _[Byte](link#825 'Byte (magazine)') (August 1994)_. Archived from [the original](link#826) on 2006-08-27. Retrieved August 31, 2006.
59. ^ [Jump up to: _**a**_](link#827) [_**b**_](link#828)["ISO/IEC JTC 1/SC 22/WG5/N2137 – Fortran 2015 Committee Draft (J3/17-007r2)"](https://wg5-fortran.org/N2101-N2150/N2137.pdf)(PDF). International Organization for Standardization. July 6, 2017. pp. 336–338.
60. **[^](link#830 'Jump up')**["Revised^6 Report on the Algorithmic Language Scheme"](link#831). R6rs.org. Retrieved 2013-03-21.
61. **[^](link#832 'Jump up')**["Revised^6 Report on the Algorithmic Language Scheme - Rationale"](link#833). R6rs.org. Retrieved 2013-03-21.
62. **[^](link#834 'Jump up')**Clinger, William (1998). "Proper tail recursion and space efficiency". _Proceedings of the ACM SIGPLAN 1998 conference on Programming language design and implementation - PLDI '98_. pp. 174–185\\. [doi](link#990 'Doi (identifier)'): [10.1145/277650.277719](link#836). [ISBN](link#1081 'ISBN (identifier)') [0897919874](link#838 'Special:BookSources/0897919874'). [S2CID](link#994 'S2CID (identifier)') [16812984](link#840).
63. **[^](link#841 'Jump up')**Baker, Henry (1994). ["CONS Should Not CONS Its Arguments, Part II: Cheney on the M.T.A."](link#842) Archived from [the original](link#843) on 2006-03-03. Retrieved 2020-04-29.
64. **[^](link#844 'Jump up')**[Turner, D.A.](link#845 'David Turner (computer scientist)') (2004-07-28). ["Total Functional Programming"](link#846). _Journal of Universal Computer Science_. **10** (7): 751–768\\. [doi](link#990 'Doi (identifier)'): [10.3217/jucs-010-07-0751](link#848).
65. **[^](link#849 'Jump up')**[The Implementation of Functional Programming Languages](link#850). Simon Peyton Jones, published by Prentice Hall, 1987
66. ^ [Jump up to: _**a**_](link#851) [_**b**_](link#852)[Launchbury, John](link#853 'John Launchbury') (March 1993). _A Natural Semantics for Lazy Evaluation_. Symposium on Principles of Programming Languages. Charleston, South Carolina: [ACM](link#881 'Association for Computing Machinery'). pp. 144–154\\. [doi](link#990 'Doi (identifier)'):[10.1145/158511.158618](link#856).
67. **[^](link#857 'Jump up')**[Robert W. Harper](link#858 'Robert Harper (computer scientist)') (2009). [_Practical Foundations for Programming Languages_](https://web.archive.org/web/20160407095249/https://www.cs.cmu.edu/~rwh/plbook/book.pdf)(PDF). Archived from [the original](https://www.cs.cmu.edu/~rwh/plbook/book.pdf)(PDF) on 2016-04-07.
68. **[^](link#861 'Jump up')**Huet, Gérard P. (1973). "The Undecidability of Unification in Third Order Logic". _Information and Control_. **22** (3): 257–267\\. [doi](link#990 'Doi (identifier)'): [10.1016/s0019-9958(73)90301-x](link#863).
69. **[^](link#864 'Jump up')**Huet, Gérard (Sep 1976). _Resolution d'Equations dans des Langages d'Ordre 1,2,...ω_ (Ph.D.) (in French). Universite de Paris VII.
70. **[^](link#865 'Jump up')**Huet, Gérard (2002). ["Higher Order Unification 30 years later"](http://pauillac.inria.fr/~huet/PUBLIC/Hampton.pdf)(PDF). In Carreño, V.; Muñoz, C.; Tahar, S. (eds.). _Proceedings, 15th International Conference TPHOL_. LNCS. Vol. 2410. Springer. pp. 3–12.
71. **[^](link#867 'Jump up')**Wells, J. B. (1993). "Typability and type checking in the second-order lambda-calculus are equivalent and undecidable". _Tech. Rep. 93-011_: 176–185\\. [CiteSeerX](link#868 'CiteSeerX (identifier)') [10.1.1.31.3590](link#869).
72. **[^](link#870 'Jump up')**Leroy, Xavier (17 September 2018). ["The Compcert verified compiler"](link#871).
73. **[^](link#872 'Jump up')**Peyton Jones, Simon; Vytiniotis, Dimitrios; [Weirich, Stephanie](link#873 'Stephanie Weirich'); Geoffrey Washburn (April 2006). ["Simple unification-based type inference for GADTs"](link#874). _Icfp 2006_: 50–61.
74. **[^](link#875 'Jump up')**["OCaml Manual"](link#876). _caml.inria.fr_. Retrieved 2021-03-08.
75. **[^](link#877 'Jump up')**["Algebraic Data Types"](link#878). _Scala Documentation_. Retrieved 2021-03-08.
76. **[^](link#879 'Jump up')**Kennedy, Andrew; Russo, Claudio V. (October 2005). [_Generalized Algebraic Data Types and Object-Oriented Programming_](https://web.archive.org/web/20061229164852/http://research.microsoft.com/~akenn/generics/gadtoop.pdf)(PDF). OOPSLA. San Diego, California: [ACM](link#881 'Association for Computing Machinery'). [doi](link#990 'Doi (identifier)'): [10.1145/1094811.1094814](link#883). [ISBN](link#1081 'ISBN (identifier)') [9781595930316](link#885 'Special:BookSources/9781595930316'). Archived from [the original](link#886) on 2006-12-29.
77. **[^](link#887 'Jump up')**Hughes, John. ["Why Functional Programming Matters"](http://www.cse.chalmers.se/~rjmh/Papers/whyfp.pdf)(PDF). [Chalmers University of Technology](link#889 'Chalmers University of Technology').
78. **[^](link#890 'Jump up')**[_Purely functional data structures_](link#891) by [Chris Okasaki](link#892 'Chris Okasaki'), [Cambridge University Press](link#1071 'Cambridge University Press'), 1998, [ISBN](link#1081 'ISBN (identifier)') [0-521-66350-4](link#895 'Special:BookSources/0-521-66350-4')
79. **[^](link#896 'Jump up')**L’orange, Jean Niklas. ["polymatheia - Understanding Clojure's Persistent Vector, pt. 1"](link#897). _Polymatheia_. Retrieved 2018-11-13.
80. **[^](link#898 'Jump up')**Michael Barr, Charles Well - Category theory for computer science.
81. **[^](link#899 'Jump up')**Newbern, J. ["All About Monads: A comprehensive guide to the theory and practice of monadic programming in Haskell"](link#900). Retrieved 2008-02-14.
82. **[^](link#901 'Jump up')**["Thirteen ways of looking at a turtle"](link#902). _fF# for fun and profit_. Retrieved 2018-11-13.
83. **[^](link#903 'Jump up')**Hartmanis, Juris; Hemachandra, Lane (1986). "Complexity classes without machines: On complete languages for UP". [_Automata, Languages and Programming_](link#904). Lecture Notes in Computer Science. Vol. 226. Berlin, Heidelberg: Springer Berlin Heidelberg. pp. 123–135\\. [doi](link#990 'Doi (identifier)'): [10.1007/3-540-16761-7\\\_62](link#906). [ISBN](link#1081 'ISBN (identifier)') [978-3-540-16761-7](link#908 'Special:BookSources/978-3-540-16761-7'). Retrieved 2024-12-12.
84. **[^](link#909 'Jump up')**[Paulson, Larry C.](link#910 'Lawrence Paulson') (28 June 1996). [_ML for the Working Programmer_](link#911). Cambridge University Press. [ISBN](link#1081 'ISBN (identifier)') [978-0-521-56543-1](link#913 'Special:BookSources/978-0-521-56543-1'). Retrieved 10 February 2013.
85. **[^](link#914 'Jump up')**Spiewak, Daniel (26 August 2008). ["Implementing Persistent Vectors in Scala"](link#915). _Code Commit_. Archived from [the original](link#916) on 23 September 2015. Retrieved 17 April 2012.
86. **[^](link#917 'Jump up')**["Which programs are fastest? \\| Computer Language Benchmarks Game"](link#918). benchmarksgame.alioth.debian.org. Archived from [the original](link#919) on 2013-05-20. Retrieved 2011-06-20.
87. **[^](link#920 'Jump up')**Igor Pechtchanski; Vivek Sarkar (2005). "Immutability specification and its applications". _Concurrency and Computation: Practice and Experience_. **17** (5–6): 639–662\\. [doi](link#990 'Doi (identifier)'): [10.1002/cpe.853](link#922). [S2CID](link#994 'S2CID (identifier)') [34527406](link#924).
88. **[^](link#925 'Jump up')**["An In-Depth Look at Clojure Collections"](link#926). _InfoQ_. Retrieved 2024-04-29.
89. **[^](link#927 'Jump up')**["References and Borrowing - The Rust Programming Language"](link#928). _doc.rust-lang.org_. Retrieved 2024-04-29.
90. **[^](link#929 'Jump up')**["Validating References with Lifetimes - The Rust Programming Language"](link#930). _doc.rust-lang.org_. Retrieved 2024-04-29.
91. **[^](link#931 'Jump up')**["Concurrent Collections (The Java™ Tutorials > Essential Java Classes > Concurrency)"](link#932). _docs.oracle.com_. Retrieved 2024-04-29.
92. **[^](link#933 'Jump up')**["Understanding The Actor Model To Build Non-blocking, High-throughput Distributed Systems - Scaleyourapp"](link#934). _scaleyourapp.com_. 2023-01-28. Retrieved 2024-04-29.
93. **[^](link#935 'Jump up')**Cesarini, Francesco; Thompson, Simon (2009). _Erlang programming: a concurrent approach to software development_ (1st ed.). O'Reilly Media, Inc. (published 2009-06-11). p. 6. [ISBN](link#1081 'ISBN (identifier)') [978-0-596-55585-6](link#937 'Special:BookSources/978-0-596-55585-6').
94. **[^](link#938 'Jump up')**["Chapter 25. Profiling and optimization"](link#939). Book.realworldhaskell.org. Retrieved 2011-06-20.
95. **[^](link#940 'Jump up')**Berthe, Samuel (2024-04-29), [_samber/lo_](link#941), retrieved 2024-04-29
96. **[^](link#942 'Jump up')**["Go Wiki: Compiler And Runtime Optimizations - The Go Programming Language"](link#943). _go.dev_. Retrieved 2024-04-29.
97. **[^](link#944 'Jump up')**["Comparing Performance: Loops vs. Iterators - The Rust Programming Language"](link#945). _doc.rust-lang.org_. Retrieved 2024-04-29.
98. **[^](link#946 'Jump up')**Hartel, Pieter; Henk Muller; Hugh Glaser (March 2004). ["The Functional C experience"](https://web.archive.org/web/20110719201553/http://www.ub.utwente.nl/webdocs/ctit/1/00000084.pdf)(PDF). _Journal of Functional Programming_. **14** (2): 129–135\\. [doi](link#990 'Doi (identifier)'): [10.1017/S0956796803004817](link#949). [S2CID](link#994 'S2CID (identifier)') [32346900](link#951). Archived from [the original](http://www.ub.utwente.nl/webdocs/ctit/1/00000084.pdf)(PDF) on 2011-07-19. Retrieved 2006-05-28.; David Mertz. ["Functional programming in Python, Part 3"](link#953). _IBM developerWorks_. Archived from [the original](link#954) on 2007-10-16. Retrieved 2006-09-17.( [Part 1](link#955), [Part 2](https://web.archive.org/web/20071016124848/http://www-128.ibm.com/developerworks/linux/library/l-prog2.html))
99. **[^](link#957 'Jump up')**["Functions — D Programming Language 2.0"](link#958). Digital Mars. 30 December 2012.
100. **[^](link#959 'Jump up')**["Lua Unofficial FAQ (uFAQ)"](link#960).
101. **[^](link#961 'Jump up')**["First-Class Functions in Go - The Go Programming Language"](link#962). _golang.org_. Retrieved 2021-01-04.
102. **[^](link#963 'Jump up')**Eich, Brendan (3 April 2008). ["Popularity"](link#964).
103. **[^](link#965 'Jump up')**[van Rossum, Guido](link#966 'Guido van Rossum') (2009-04-21). ["Origins of Python's "Functional" Features"](link#967). Retrieved 2012-09-27.
104. **[^](link#968 'Jump up')**["functools — Higher order functions and operations on callable objects"](link#969). Python Software Foundation. 2011-07-31. Retrieved 2011-07-31.
105. **[^](link#970 'Jump up')**Skarsaune, Martin (2008). _The SICS Java Port Project Automatic Translation of a Large Object Oriented System from Smalltalk to Java_.
106. **[^](link#971 'Jump up')**Gosling, James. ["Closures"](link#972). _James Gosling: on the Java Road_. Oracle. Archived from [the original](link#973) on 2013-04-14. Retrieved 11 May 2013.
107. **[^](link#974 'Jump up')**Williams, Michael (8 April 2013). ["Java SE 8 Lambda Quick Start"](link#975).
108. **[^](link#976 'Jump up')**Bloch, Joshua (2008). "Item 15: Minimize Mutability". [_Effective Java_](link#977) (Second ed.). Addison-Wesley. [ISBN](link#1081 'ISBN (identifier)') [978-0321356680](link#979 'Special:BookSources/978-0321356680').
109. **[^](link#980 'Jump up')**["Object.freeze() - JavaScript \\| MDN"](link#981). _developer.mozilla.org_. Retrieved 2021-01-04. The Object.freeze() method freezes an object. A frozen object can no longer be changed; freezing an object prevents new properties from being added to it, existing properties from being removed, prevents changing the enumerability, configurability, or writability of existing properties, and prevents the values of existing properties from being changed. In addition, freezing an object also prevents its prototype from being changed. freeze() returns the same object that was passed in.
110. **[^](link#982 'Jump up')**Daniel Friedman; William Byrd; Oleg Kiselyov; Jason Hemann (2018). _The Reasoned Schemer, Second Edition_. The MIT Press.
111. **[^](link#983 'Jump up')**A. Casas, D. Cabeza, M. V. Hermenegildo. A Syntactic Approach to
     Combining Functional Notation, Lazy Evaluation and Higher-Order in
     LP Systems. The 8th International Symposium on Functional and Logic
     Programming (FLOPS'06), pages 142-162, April 2006.
112. **[^](link#984 'Jump up')**["How I do my Computing"](link#985). _stallman.org_. Retrieved 2024-04-29.
113. **[^](link#986 'Jump up')**["Helix"](link#987). _helix-editor.com_. Retrieved 2024-04-29.
114. **[^](link#988 'Jump up')**Wakeling, David (2007). ["Spreadsheet functional programming"](http://www.activemode.org/webroot/Workers/ActiveTraining/Programming/Pro_SpreadsheetFunctionalProgramming.pdf)(PDF). _Journal of Functional Programming_. **17** (1): 131–143\\. [doi](link#990 'Doi (identifier)'): [10.1017/S0956796806006186](link#991). [ISSN](link#992 'ISSN (identifier)') [0956-7968](link#993). [S2CID](link#994 'S2CID (identifier)') [29429059](link#995).
115. **[^](link#996 'Jump up')**[Peyton Jones, Simon](link#997 'Simon Peyton Jones'); [Burnett, Margaret](link#998 'Margaret Burnett'); [Blackwell, Alan](link#999 'Alan Blackwell') (March 2003). ["Improving the world's most popular functional language: user-defined functions in Excel"](link#1000). Archived from [the original](link#1001) on 2005-10-16.
116. **[^](link#1002 'Jump up')**Rodger, Richard (11 December 2017). _The Tao of Microservices_. Manning. [ISBN](link#1081 'ISBN (identifier)') [9781638351733](link#1004 'Special:BookSources/9781638351733').
117. **[^](link#1005 'Jump up')**Piro, Christopher (2009). [_Functional Programming at Facebook_](link#1006). CUFP 2009. Archived from [the original](link#1007) on 2009-10-17. Retrieved 2009-08-29.
118. **[^](link#1008 'Jump up')**["Sim-Diasca: a large-scale discrete event concurrent simulation engine in Erlang"](link#1009). November 2011. Archived from [the original](link#1010) on 2013-09-17. Retrieved 2011-11-08.
119. **[^](link#1011 'Jump up')**[1 million is so 2011](link#1012) [Archived](link#1013) 2014-02-19 at the [Wayback Machine](link#1014 'Wayback Machine') // WhatsApp blog, 2012-01-06: "the last important piece of our infrastracture is Erlang"
120. **[^](link#1015 'Jump up')**Momtahan, Lee (2009). [_Scala at EDF Trading: Implementing a Domain-Specific Language for Derivative Pricing with Scala_](link#1016). CUFP 2009. Archived from [the original](link#1017) on 2009-10-17. Retrieved 2009-08-29.
121. **[^](link#1018 'Jump up')**Graham, Paul (2003). ["Beating the Averages"](link#1019). Retrieved 2009-08-29.
122. **[^](link#1020 'Jump up')**Sims, Steve (2006). [_Building a Startup with Standard ML_](http://cufp.galois.com/2006/slides/SteveSims.pdf)(PDF). CUFP 2006. Retrieved 2009-08-29.
123. **[^](link#1022 'Jump up')**Laurikari, Ville (2007). [_Functional Programming in Communications Security_](link#1023). CUFP 2007. Archived from [the original](link#1024) on 2010-12-21. Retrieved 2009-08-29.
124. **[^](link#1025 'Jump up')**Lorimer, R. J. (19 January 2009). ["Live Production Clojure Application Announced"](link#1026). _InfoQ_.
125. **[^](link#1027 'Jump up')**Bugnion, Pascal (2016). _Scala for Data Science_ (1st ed.). [Packt](link#1028 'Packt'). [ISBN](link#1081 'ISBN (identifier)') [9781785281372](link#1030 'Special:BookSources/9781785281372').
126. **[^](link#1031 'Jump up')**["Why developers like ClojureScript"](link#1032). _StackShare_. Retrieved 2024-04-29.
127. **[^](link#1033 'Jump up')**Herrick, Justin (2024-04-29), [_jah2488/elm-companies_](link#1034), retrieved 2024-04-29
128. **[^](link#1035 'Jump up')**["Why developers like PureScript"](link#1036). _StackShare_. Retrieved 2024-04-29.
129. **[^](link#1037 'Jump up')**Team, Editorial (2019-01-08). ["ALLEGRO - all you need to know about the best Polish online marketplace"](link#1038). _E-commerce Germany News_. Retrieved 2024-04-29.
130. **[^](link#1039 'Jump up')**["Websites using Phoenix Framework - Wappalyzer"](link#1040). _www.wappalyzer.com_. Retrieved 2024-04-29.
131. **[^](link#1041 'Jump up')**["Functional Programming: 2019-2020"](link#1042). University of Oxford Department of Computer Science. Retrieved 28 April 2020.
132. **[^](link#1043 'Jump up')**["Programming I (Haskell)"](link#1044). Imperial College London Department of Computing. Retrieved 28 April 2020.
133. ^ [Jump up to: _**a**_](link#1045) [_**b**_](link#1046)["Computer Science BSc - Modules"](link#1047). Retrieved 28 April 2020.
134. ^ [Jump up to: _**a**_](link#1048) [_**b**_](link#1049)[Abelson, Hal](link#1066 'Hal Abelson'); [Sussman, Gerald Jay](link#1067 'Gerald Jay Sussman') (1985). ["Preface to the Second Edition"](link#1052). [_Structure and Interpretation of Computer Programs_](link#1053) (2 ed.). MIT Press. [Bibcode](link#1069 'Bibcode (identifier)'): [1985sicp.book.....A](link#1070).
135. **[^](link#1056 'Jump up')**John DeNero (Fall 2019). ["Computer Science 61A, Berkeley"](link#1057). Department of Electrical Engineering and Computer Sciences, Berkeley. Retrieved 2020-08-14.
136. **[^](link#1058 'Jump up')**[Emmanuel Schanzer of Bootstrap](link#1059) interviewed on the TV show _Triangulation_ on the [TWiT.tv](link#1060 'TWiT.tv') network
137. **[^](link#1061 'Jump up')**["Why Scheme for Introductory Programming?"](link#1062). _home.adelphi.edu_. Retrieved 2024-04-29.
138. **[^](link#1063 'Jump up')**Staff, IMACS (2011-06-03). ["What Is Scheme & Why Is it Beneficial for Students?"](link#1064). _IMACS – Making Better Thinkers for Life_. Retrieved 2024-04-29.

## Further reading

\\[ [edit](link#1065 'Edit section: Further reading')\\]

- [Abelson, Hal](link#1066 'Hal Abelson'); [Sussman, Gerald Jay](link#1067 'Gerald Jay Sussman') (1985). [_Structure and Interpretation of Computer Programs_](link#1068). MIT Press. [Bibcode](link#1069 'Bibcode (identifier)'): [1985sicp.book.....A](link#1070).
- Cousineau, Guy and Michel Mauny. _The Functional Approach to Programming_. Cambridge, UK: [Cambridge University Press](link#1071 'Cambridge University Press'), 1998.
- Curry, Haskell Brooks and Feys, Robert and Craig, William. _Combinatory Logic_. Volume I. North-Holland Publishing Company, Amsterdam, 1958.
- [Curry, Haskell B.](link#1072 'Haskell Curry'); [Hindley, J. Roger](link#1073 'J. Roger Hindley'); [Seldin, Jonathan P.](link#1074 'Jonathan P. Seldin (page does not exist)') (1972). _Combinatory Logic_. Vol. II. Amsterdam: North Holland. [ISBN](link#1081 'ISBN (identifier)') [978-0-7204-2208-5](link#1076 'Special:BookSources/978-0-7204-2208-5').
- Dominus, Mark Jason. _[Higher-Order Perl](link#1077)_. [Morgan Kaufmann](link#1078 'Morgan Kaufmann'). 2005.
- Felleisen, Matthias; Findler, Robert; Flatt, Matthew; Krishnamurthi, Shriram (2018). [_How to Design Programs_](link#1079). MIT Press.
- Graham, Paul. _ANSI Common LISP_. Englewood Cliffs, New Jersey: [Prentice Hall](link#1085 'Prentice Hall'), 1996.
- MacLennan, Bruce J. _Functional Programming: Practice and Theory_. Addison-Wesley, 1990.
- Michaelson, Greg (10 April 2013). _An Introduction to Functional Programming Through Lambda Calculus_. Courier Corporation. [ISBN](link#1081 'ISBN (identifier)') [978-0-486-28029-5](link#1082 'Special:BookSources/978-0-486-28029-5').
- O'Sullivan, Brian; Stewart, Don; Goerzen, John (2008). [_Real World Haskell_](link#1083). O'Reilly.
- Pratt, Terrence W. and [Marvin Victor Zelkowitz](link#1084 'Marvin Victor Zelkowitz'). _Programming Languages: Design and Implementation_. 3rd ed. Englewood Cliffs, New Jersey: [Prentice Hall](link#1085 'Prentice Hall'), 1996.
- Salus, Peter H. _Functional and Logic Programming Languages_. Vol. 4 of Handbook of Programming Languages. Indianapolis, Indiana: [Macmillan Technical Publishing](link#1086 'Macmillan Technical Publishing (page does not exist)'), 1998.
- Thompson, Simon. _Haskell: The Craft of Functional Programming_. Harlow, England: [Addison-Wesley Longman Limited](link#1087 'Addison-Wesley Longman Limited (page does not exist)'), 1996.

## External links

\\[ [edit](link#1088 'Edit section: External links')\\]

Listen to this article (28 minutes)

[Play audio](link#1090 'Play audio') Duration: 27 minutes and 59 seconds.27:59

![Spoken Wikipedia icon](image#5)

[This audio file](link#1090 'File:En-Functional programming.ogg') was created from a revision of this article dated 25 August 2011 (2011-08-25), and does not reflect subsequent edits.

( [Audio help](link#1091 'Wikipedia:Media help') · [More spoken articles](link#1092 'Wikipedia:Spoken articles'))

- Ford, Neal. ["Functional thinking"](link#1093). Retrieved 2021-11-10.
- Akhmechet, Slava (2006-06-19). ["defmacro – Functional Programming For The Rest of Us"](link#1094). Retrieved 2013-02-24. An introduction
- _Functional programming in Python_ (by David Mertz): [part 1](link#1095), [part 2](link#1096), [part 3](link#1097)

| show<br>[Programming paradigms](link#1241 'Programming paradigm') ( [Comparison by language](link#1099 'Comparison of multi-paradigm programming languages'))                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Imperative](link#1100 'Imperative programming')                                                                                                                                                                                |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | [Structured](link#1101 'Structured programming')                                          | - [Jackson structures](link#1102 'Jackson structured programming')<br>- [Block-structured](link#1103 'Block (programming)')<br>- [Modular](link#1104 'Modular programming')<br>- [Non-structured](link#1105 'Non-structured programming')<br>- [Procedural](link#1106 'Procedural programming')<br>- [Programming in the large and in the small](link#1107 'Programming in the large and programming in the small')<br>- [Design by contract](link#1108 'Design by contract')<br>- [Invariant-based](link#1109 'Invariant-based programming')<br>- [Nested function](link#1110 'Nested function')                                                                                                                                                                                                                                                                                                                                                                                                  |
| [Object-oriented](link#1111 'Object-oriented programming')<br>( [comparison](link#1112 'Comparison of programming languages (object-oriented programming)'), [list](link#1113 'List of object-oriented programming languages')) | - [Class-based](link#1114 'Class-based programming'), [Prototype-based](link#1115 'Prototype-based programming'), [Object-based](link#1116 'Object-based language')<br>- [Agent](link#1117 'Agent-oriented programming')<br>- [Immutable object](link#1118 'Immutable object')<br>- [Persistent](link#1119 'Persistent programming language')<br>- [Uniform function call syntax](link#1120 'Uniform function call syntax')                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |                                                                                           |
| [Declarative](link#1121 'Declarative programming')                                                                                                                                                                              |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Functional<br>( [comparison](link#1122 'Comparison of functional programming languages')) | - [Recursive](link#1123 'Recursion (computer science)')<br>- [Anonymous function](link#1124 'Anonymous function') ( [Partial application](link#1125 'Partial application'))<br>- [Higher-order](link#1126 'Higher-order programming')<br>- [Purely functional](link#1127 'Purely functional programming')<br>- [Total](link#1128 'Total functional programming')<br>- [Strict](link#1129 'Strict programming language')<br>- [GADTs](link#1130 'Generalized algebraic data type')<br>- [Dependent types](link#1131 'Dependent type')<br>- [Functional logic](link#1132 'Functional logic programming')<br>- [Point-free style](link#1133 'Tacit programming')<br>- [Expression-oriented](link#1134 'Expression-oriented programming language')<br>- [Applicative](link#1135 'Applicative programming language'), [Concatenative](link#1136 'Concatenative programming language')<br>- [Function-level](link#1137 'Function-level programming'), [Value-level](link#1138 'Value-level programming') |
| [Dataflow](link#1139 'Dataflow programming')                                                                                                                                                                                    | - [Flow-based](link#1140 'Flow-based programming')<br>- [Reactive](link#1141 'Reactive programming') ( [Functional reactive](link#1142 'Functional reactive programming'))<br>- [Signals](link#1143 'Signal programming')<br>- [Streams](link#1144 'Stream processing')<br>- [Synchronous](link#1145 'Synchronous programming language')                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| [Logic](link#1146 'Logic programming')                                                                                                                                                                                          | - [Abductive logic](link#1147 'Abductive logic programming')<br>- [Answer set](link#1148 'Answer set programming')<br>- [Constraint](link#1149 'Constraint programming') ( [Constraint logic](link#1150 'Constraint logic programming'))<br>- [Inductive logic](link#1151 'Inductive logic programming')<br>- [Nondeterministic](link#1152 'Nondeterministic programming')<br>- [Ontology](link#1153 'Ontology language')<br>- [Probabilistic logic](link#1154 'Probabilistic logic programming')<br>- [Query](link#1155 'Query language')                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| [DSL](link#1156 'Domain-specific language')                                                                                                                                                                                     | - [Algebraic modeling](link#1157 'Algebraic modeling language')<br>- [Array](link#1158 'Array programming')<br>- [Automata-based](link#1159 'Automata-based programming') ( [Action](link#1160 'Action language'))<br>- [Command](link#1161 'Command language') ( [Spacecraft](link#1162 'Spacecraft command language'))<br>- [Differentiable](link#1163 'Differentiable programming')<br>- [End-user](link#1164 'End-user development')<br>- [Grammar-oriented](link#1165 'Grammar-oriented programming')<br>- [Interface description](link#1166 'Interface description language')<br>- [Language-oriented](link#1167 'Language-oriented programming')<br>- [List comprehension](link#1168 'List comprehension')<br>- [Low-code](link#1169 'Low-code development platform')<br>- [Modeling](link#1170 'Modeling language')<br>- [Natural language](link#1171 'Natural-language programming')<br>- [Non-English-based](link#1172 'Non-English-based programming languages')<br>- [Page description](link#1173 'Page description language')<br>- [Pipes](link#1174 'Pipeline (software)') and [filters](link#1175 'Filter (software)')<br>- [Probabilistic](link#1176 'Probabilistic programming')<br>- [Quantum](link#1177 'Quantum programming')<br>- [Scientific](link#1178 'Scientific programming language')<br>- [Scripting](link#1179 'Scripting language')<br>- [Set-theoretic](link#1180 'Set theoretic programming')<br>- [Simulation](link#1181 'Simulation language')<br>- [Stack-based](link#1182 'Stack-oriented programming')<br>- [System](link#1183 'System programming language')<br>- [Tactile](link#1184 'Tactile programming language')<br>- [Templating](link#1185 'Template processor')<br>- [Transformation](link#1186 'Transformation language') ( [Graph rewriting](link#1187 'Graph rewriting'), [Production](link#1188 'Production system (computer science)'), [Pattern](link#1189 'Pattern matching'))<br>- [Visual](link#1190 'Visual programming language') |                                                                                           |
| [Concurrent](link#1191 'Concurrent computing'),<br>[distributed](link#1192 'Distributed computing'),<br>[parallel](link#1193 'Parallel computing')                                                                              | - [Actor-based](link#1194 'Actor model')<br>- [Automatic mutual exclusion](link#1195 'Automatic mutual exclusion')<br>- [Choreographic programming](link#1196 'Choreographic programming')<br>- [Concurrent logic](link#1197 'Concurrent logic programming') ( [Concurrent constraint logic](link#1198 'Concurrent constraint logic programming'))<br>- [Concurrent OO](link#1199 'Concurrent object-oriented programming')<br>- [Macroprogramming](link#1200 'Macroprogramming')<br>- [Multitier programming](link#1201 'Multitier programming')<br>- [Organic computing](link#1202 'Organic computing')<br>- [Parallel programming models](link#1203 'Parallel programming model')<br>- [Partitioned global address space](link#1204 'Partitioned global address space')<br>- [Process-oriented](link#1205 'Process-oriented programming')<br>- [Relativistic programming](link#1206 'Relativistic programming')<br>- [Service-oriented](link#1207 'Service-oriented programming')<br>- [Structured concurrency](link#1208 'Structured concurrency')                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| [Metaprogramming](link#1209 'Metaprogramming')                                                                                                                                                                                  | - [Attribute-oriented](link#1210 'Attribute-oriented programming')<br>- [Automatic](link#1211 'Automatic programming') ( [Inductive](link#1212 'Inductive programming'))<br>- [Dynamic](link#1213 'Dynamic programming language')<br>- [Extensible](link#1214 'Extensible programming')<br>- [Generic](link#1215 'Generic programming')<br>- [Homoiconicity](link#1216 'Homoiconicity')<br>- [Interactive](link#1217 'Interactive programming')<br>- [Macro](link#1218 'Macro (computer science)') ( [Hygienic](link#1219 'Hygienic macro'))<br>- [Metalinguistic abstraction](link#1220 'Metalinguistic abstraction')<br>- [Multi-stage](link#1221 'Multi-stage programming')<br>- [Program synthesis](link#1222 'Program synthesis') ( [Bayesian](link#1223 'Bayesian program synthesis'), [Inferential](link#1224 'Inferential programming'), [by demonstration](link#1225 'Programming by demonstration'), [by example](link#1226 'Programming by example'))<br>- [Reflective](link#1227 'Reflective programming')<br>- [Self-modifying code](link#1228 'Self-modifying code')<br>- [Symbolic](link#1229 'Symbolic programming')<br>- [Template](link#1230 'Template metaprogramming')                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| [Separation\\<br>\\<br>of concerns](link#1231 'Separation of concerns')                                                                                                                                                         | - [Aspects](link#1232 'Aspect-oriented programming')<br>- [Components](link#1233 'Component-based software engineering')<br>- [Data-driven](link#1234 'Data-driven programming')<br>- [Data-oriented](link#1235 'Data-oriented design')<br>- [Event-driven](link#1236 'Event-driven programming')<br>- [Features](link#1237 'Feature-oriented programming')<br>- [Literate](link#1238 'Literate programming')<br>- [Roles](link#1239 'Role-oriented programming')<br>- [Subjects](link#1240 'Subject-oriented programming')                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |

| show<br>[Types of programming languages](link#1241 'Programming paradigm') |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Level                                                                      | - [Machine](link#1242 'Machine code')<br>- [Assembly](link#1243 'Assembly language')<br>- [Compiled](link#1244 'Compiled language')<br>- [Interpreted](link#1245 'Interpreted language')<br>- [Low-level](link#1246 'Low-level programming language')<br>- [High-level](link#1247 'High-level programming language')<br>- [Very high-level](link#1248 'Very high-level programming language')<br>- [Esoteric](link#1249 'Esoteric programming language') |
| [Generation](link#1250 'Programming language generations')                 | - [First](link#1251 'First-generation programming language')<br>- [Second](link#1252 'Second-generation programming language')<br>- [Third](link#1253 'Third-generation programming language')<br>- [Fourth](link#1254 'Fourth-generation programming language')<br>- [Fifth](link#1255 'Fifth-generation programming language')                                                                                                                         |

| [Authority control databases](link#1256 'Help:Authority control'): National [![Edit this at Wikidata](https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/OOjs_UI_icon_edit-ltr-progressive.svg/20px-OOjs_UI_icon_edit-ltr-progressive.svg.png)](https://www.wikidata.org/wiki/Q193076#identifiers 'Edit this at Wikidata') | - [Germany](link#1257)<br>- [United States](link#1258)<br>- [France](link#1259)<br>- [BnF data](link#1260)<br>- [Czech Republic](link#1261)<br>- [Spain](link#1262)<br>- [Israel](link#1263) |

Retrieved from " [https://en.wikipedia.org/w/index.php?title=Functional\\\_programming&oldid=1288545228](link#1264)"

[Categories](link#1265 'Help:Category'):

- [Functional programming](link#1266 'Category:Functional programming')
- [Programming paradigms](link#1267 'Category:Programming paradigms')
- [Programming language comparisons](link#1268 'Category:Programming language comparisons')

Hidden categories:

- [CS1 maint: DOI inactive as of November 2024](link#1269 'Category:CS1 maint: DOI inactive as of November 2024')
- [CS1 French-language sources (fr)](link#1270 'Category:CS1 French-language sources (fr)')
- [Webarchive template wayback links](link#1271 'Category:Webarchive template wayback links')
- [Articles with short description](link#1272 'Category:Articles with short description')
- [Short description matches Wikidata](link#1273 'Category:Short description matches Wikidata')
- [All articles with unsourced statements](link#1274 'Category:All articles with unsourced statements')
- [Articles with unsourced statements from February 2017](link#1275 'Category:Articles with unsourced statements from February 2017')
- [Articles with unsourced statements from July 2018](link#1276 'Category:Articles with unsourced statements from July 2018')
- [Articles with unsourced statements from June 2014](link#1277 'Category:Articles with unsourced statements from June 2014')
- [Articles with unsourced statements from April 2015](link#1278 'Category:Articles with unsourced statements from April 2015')
- [Articles with unsourced statements from August 2022](link#1279 'Category:Articles with unsourced statements from August 2022')
- [Articles with hAudio microformats](link#1280 'Category:Articles with hAudio microformats')
- [Spoken articles](link#1281 'Category:Spoken articles')
- [Articles with example C code](link#1282 'Category:Articles with example C code')
- [Articles with example JavaScript code](link#1283 'Category:Articles with example JavaScript code')
- [Articles with example Lisp (programming language) code](link#1284 'Category:Articles with example Lisp (programming language) code')

Search

Search

Functional programming

54 languages[Add topic](link#1292)`

---

# References

## Links

**link#1**: https://en.wikipedia.org/wiki/Functional_programming#bodyContent - "Jump to content"

**link#2**: https://en.wikipedia.org/wiki/Procedural_programming - "Procedural programming"

**link#3**: https://en.wikipedia.org/wiki/Computer_science - "computer science"

**link#4**: https://en.wikipedia.org/wiki/Programming_paradigm - "programming paradigm"

**link#5**: https://en.wikipedia.org/wiki/Function_application - "applying"

**link#6**: https://en.wikipedia.org/wiki/Function_composition_(computer_science) - "composing"

**link#7**: https://en.wikipedia.org/wiki/Function_(computer_science) - "functions"

**link#8**: https://en.wikipedia.org/wiki/Declarative_programming - "declarative programming"

**link#9**: https://en.wikipedia.org/wiki/Tree_(data_structure) - "trees"

**link#10**: https://en.wikipedia.org/wiki/Expression_(computer_science) - "expressions"

**link#11**: https://en.wikipedia.org/wiki/Value_(computer_science) - "values"

**link#12**: https://en.wikipedia.org/wiki/Imperative_programming - "imperative"

**link#13**: https://en.wikipedia.org/wiki/Statement_(computer_science) - "statements"

**link#14**: https://en.wikipedia.org/wiki/State_(computer_science) - "running state"

**link#15**: https://en.wikipedia.org/wiki/First-class_citizen - "first-class citizens"

**link#16**: https://en.wikipedia.org/wiki/Identifier_(computer_languages) - "identifiers"

**link#17**: https://en.wikipedia.org/wiki/Parameter_(computer_programming) - "arguments"

**link#18**: https://en.wikipedia.org/wiki/Return_value - "returned"

**link#19**: https://en.wikipedia.org/wiki/Data_type - "data type"

**link#20**: https://en.wikipedia.org/wiki/Declarative_programming - "declarative"

**link#21**: https://en.wikipedia.org/wiki/Composability - "composable"

**link#22**: https://en.wikipedia.org/wiki/Modular_programming - "modular"

**link#23**: https://en.wikipedia.org/wiki/Purely_functional_programming - "purely functional programming"

**link#24**: https://en.wikipedia.org/wiki/Deterministic_system - "deterministic"

**link#25**: https://en.wikipedia.org/wiki/Function_(mathematics) - "functions"

**link#26**: https://en.wikipedia.org/wiki/Pure_function - "pure functions"

**link#27**: https://en.wikipedia.org/wiki/State_(computer_science) - "state"

**link#28**: https://en.wikipedia.org/wiki/Side_effect_(computer_science) - "side effects"

**link#29**: https://en.wikipedia.org/wiki/Procedure_(computer_science) - "procedures"

**link#30**: https://en.wikipedia.org/wiki/Imperative_programming - "imperative programming"

**link#31**: https://en.wikipedia.org/wiki/Software_bug - "bugs"

**link#32**: https://en.wikipedia.org/wiki/Debugging - "debug"

**link#33**: https://en.wikipedia.org/wiki/Software_testing - "test"

**link#34**: https://en.wikipedia.org/wiki/Formal_verification - "formal verification"

**link#35**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-hudak1989-1 - "[1]"

**link#36**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-hughesWhyFPMatters-2 - "[2]"

**link#37**: https://en.wikipedia.org/wiki/Academia - "academia"

**link#38**: https://en.wikipedia.org/wiki/Lambda_calculus - "lambda calculus"

**link#39**: https://en.wikipedia.org/wiki/Common_Lisp - "Common Lisp"

**link#40**: https://en.wikipedia.org/wiki/Scheme_(programming_language) - "Scheme"

**link#41**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-clinger1987-3 - "[3]"

**link#42**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-hartheimer1987-4 - "[4]"

**link#43**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-kidd2007-5 - "[5]"

**link#44**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-cleis2006-6 - "[6]"

**link#45**: https://en.wikipedia.org/wiki/Clojure - "Clojure"

**link#46**: https://en.wikipedia.org/wiki/Wolfram_Language - "Wolfram Language"

**link#47**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-reference.wolfram.com-7 - "[7]"

**link#48**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-Amath-CO-8 - "[8]"

**link#49**: https://en.wikipedia.org/wiki/Racket_(programming_language) - "Racket"

**link#50**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-racket-video-games-9 - "[9]"

**link#51**: https://en.wikipedia.org/wiki/Erlang_(programming_language) - "Erlang"

**link#52**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-erlang-faq-10 - "[10]"

**link#53**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-armstrong2007-11 - "[11]"

**link#54**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-larson2009-12 - "[12]"

**link#55**: https://en.wikipedia.org/wiki/Elixir_(programming_language) - "Elixir"

**link#56**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-13 - "[13]"

**link#57**: https://en.wikipedia.org/wiki/OCaml - "OCaml"

**link#58**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-minksy2008-14 - "[14]"

**link#59**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-leroy2007-15 - "[15]"

**link#60**: https://en.wikipedia.org/wiki/Haskell - "Haskell"

**link#61**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-haskell-industry-16 - "[16]"

**link#62**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-hudak2007-17 - "[17]"

**link#63**: https://en.wikipedia.org/wiki/F_Sharp_(programming_language) - "F#"

**link#64**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-quantFSharp-18 - "[18]"

**link#65**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-businessAppsFSharp-19 - "[19]"

**link#66**: https://en.wikipedia.org/wiki/Lean_(proof_assistant) - "Lean"

**link#67**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-20 - "[20]"

**link#68**: https://en.wikipedia.org/wiki/JavaScript - "JavaScript"

**link#69**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-21 - "[21]"

**link#70**: https://en.wikipedia.org/wiki/R_(programming_language) - "R"

**link#71**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-useR-22 - "[22]"

**link#72**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-Chambers-23 - "[23]"

**link#73**: https://en.wikipedia.org/wiki/J_(programming_language) - "J"

**link#74**: https://en.wikipedia.org/wiki/K_(programming_language) - "K"

**link#75**: https://en.wikipedia.org/wiki/Q_(programming_language_from_Kx_Systems) - "Q"

**link#76**: https://en.wikipedia.org/wiki/XQuery - "XQuery"

**link#77**: https://en.wikipedia.org/wiki/XSLT - "XSLT"

**link#78**: https://en.wikipedia.org/wiki/XML - "XML"

**link#79**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-Novatchev-24 - "[24]"

**link#80**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-Mertz-25 - "[25]"

**link#81**: https://en.wikipedia.org/wiki/SQL - "SQL"

**link#82**: https://en.wikipedia.org/wiki/Lex_(software) - "Lex"

**link#83**: https://en.wikipedia.org/wiki/Yacc - "Yacc"

**link#84**: https://en.wikipedia.org/wiki/Mutable_object - "mutable values"

**link#85**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-Chamberlin_Boyce-26 - "[26]"

**link#86**: https://en.wikipedia.org/wiki/C%2B%2B11 - "C++11"

**link#87**: https://en.wikipedia.org/wiki/C_Sharp_(programming_language) - "C#"

**link#88**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-27 - "[27]"

**link#89**: https://en.wikipedia.org/wiki/Kotlin_(programming_language) - "Kotlin"

**link#90**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-:0-28 - "[28]"

**link#91**: https://en.wikipedia.org/wiki/Perl - "Perl"

**link#92**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-29 - "[29]"

**link#93**: https://en.wikipedia.org/wiki/PHP - "PHP"

**link#94**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-30 - "[30]"

**link#95**: https://en.wikipedia.org/wiki/Python_(programming_language) - "Python"

**link#96**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-AutoNT-13-31 - "[31]"

**link#97**: https://en.wikipedia.org/wiki/Go_(programming_language) - "Go"

**link#98**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-32 - "[32]"

**link#99**: https://en.wikipedia.org/wiki/Rust_(programming_language) - "Rust"

**link#100**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-33 - "[33]"

**link#101**: https://en.wikipedia.org/wiki/Raku_(programming_language) - "Raku"

**link#102**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-34 - "[34]"

**link#103**: https://en.wikipedia.org/wiki/Scala_(programming_language) - "Scala"

**link#104**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-effective-scala-35 - "[35]"

**link#105**: https://en.wikipedia.org/wiki/Java_(programming_language) - "Java (since Java 8)"

**link#106**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-java-8-javadoc-36 - "[36]"

**link#107**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=1 - "edit"

**link#108**: https://en.wikipedia.org/wiki/Lambda_calculus - "lambda calculus"

**link#109**: https://en.wikipedia.org/wiki/Alonzo_Church - "Alonzo Church"

**link#110**: https://en.wikipedia.org/wiki/Formal_system - "formal system"

**link#111**: https://en.wikipedia.org/wiki/Computation - "computation"

**link#112**: https://en.wikipedia.org/wiki/Function_application - "function application"

**link#113**: https://en.wikipedia.org/wiki/Alan_Turing - "Alan Turing"

**link#114**: https://en.wikipedia.org/wiki/Turing_machines - "Turing machines"

**link#115**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-37 - "[37]"

**link#116**: https://en.wikipedia.org/wiki/Turing_complete - "Turing complete"

**link#117**: https://en.wikipedia.org/wiki/Combinatory_logic - "combinatory logic"

**link#118**: https://en.wikipedia.org/wiki/Moses_Sch%C3%B6nfinkel - "Moses Schönfinkel"

**link#119**: https://en.wikipedia.org/wiki/Haskell_Curry - "Haskell Curry"

**link#120**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-38 - "[38]"

**link#121**: https://en.wikipedia.org/wiki/Simply_typed_lambda_calculus - "simply typed lambda calculus"

**link#122**: https://en.wikipedia.org/wiki/Data_type - "data type"

**link#123**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-39 - "[39]"

**link#124**: https://en.wikipedia.org/wiki/High-level_programming_language - "high-level"

**link#125**: https://en.wikipedia.org/wiki/Lisp_(programming_language) - "Lisp"

**link#126**: https://en.wikipedia.org/wiki/IBM_700/7000_series#Scientific_Architecture - "IBM 700/7000 series"

**link#127**: https://en.wikipedia.org/wiki/John_McCarthy_(computer_scientist) - "John McCarthy"

**link#128**: https://en.wikipedia.org/wiki/Massachusetts_Institute_of_Technology - "Massachusetts Institute of Technology"

**link#129**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-40 - "[40]"

**link#130**: https://en.wikipedia.org/wiki/Recursion_(computer_science) - "recursive"

**link#131**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-41 - "[41]"

**link#132**: https://en.wikipedia.org/wiki/Programming_paradigm#Multi-paradigm - "multi-paradigm languages"

**link#133**: https://en.wikipedia.org/wiki/Scheme_(programming_language) - "Scheme"

**link#134**: https://en.wikipedia.org/wiki/Clojure - "Clojure"

**link#135**: https://en.wikipedia.org/wiki/Dylan_(programming_language) - "Dylan"

**link#136**: https://en.wikipedia.org/wiki/Julia_(programming_language) - "Julia"

**link#137**: https://en.wikipedia.org/wiki/Common_Lisp - "Common Lisp"

**link#138**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-42 - "[42]"

**link#139**: https://en.wikipedia.org/wiki/Information_Processing_Language - "Information Processing Language"

**link#140**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-43 - "[43]"

**link#141**: https://en.wikipedia.org/wiki/Assembly_language - "assembly-style language"

**link#142**: https://en.wikipedia.org/wiki/Kenneth_E._Iverson - "Kenneth E. Iverson"

**link#143**: https://en.wikipedia.org/wiki/APL_(programming_language) - "APL"

**link#144**: https://en.wikipedia.org/wiki/ISBN_(identifier) - "ISBN"

**link#145**: https://en.wikipedia.org/wiki/Special:BookSources/9780471430148 - "9780471430148"

**link#146**: https://en.wikipedia.org/wiki/John_Backus - "John Backus"

**link#147**: https://en.wikipedia.org/wiki/FP_(programming_language) - "FP"

**link#148**: https://en.wikipedia.org/wiki/Roger_Hui - "Roger Hui"

**link#149**: https://en.wikipedia.org/wiki/J_(programming_language) - "J"

**link#150**: https://en.wikipedia.org/wiki/Arthur_Whitney_(computer_scientist) - "Arthur Whitney"

**link#151**: https://en.wikipedia.org/wiki/K_(programming_language) - "K"

**link#152**: https://en.wikipedia.org/wiki/Q_(programming_language_from_Kx_Systems) - "Q"

**link#153**: https://en.wikipedia.org/wiki/Peter_Landin - "Peter Landin"

**link#154**: https://en.wikipedia.org/wiki/SECD_machine - "SECD machine"

**link#155**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-44 - "[44]"

**link#156**: https://en.wikipedia.org/wiki/Abstract_machine - "abstract machine"

**link#157**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-45 - "[45]"

**link#158**: https://en.wikipedia.org/wiki/ALGOL_60 - "ALGOL 60"

**link#159**: https://en.wikipedia.org/wiki/Lambda_calculus - "lambda calculus"

**link#160**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-46 - "[46]"

**link#161**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-47 - "[47]"

**link#162**: https://en.wikipedia.org/wiki/ISWIM - "ISWIM"

**link#163**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-48 - "[48]"

**link#164**: https://en.wikipedia.org/wiki/John_Backus - "John Backus"

**link#165**: https://en.wikipedia.org/wiki/FP_(programming_language) - "FP"

**link#166**: https://en.wikipedia.org/wiki/Turing_Award - "Turing Award"

**link#167**: https://en.wikipedia.org/wiki/Von_Neumann_architecture - "von Neumann"

**link#168**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-Backus_1977-49 - "[49]"

**link#169**: https://en.wikipedia.org/wiki/Principle_of_compositionality - "principle of compositionality"

**link#170**: https://en.wikipedia.org/wiki/Wikipedia:Citation_needed - "citation needed"

**link#171**: https://en.wikipedia.org/wiki/Function-level_programming - "function-level programming"

**link#172**: https://en.wikipedia.org/wiki/ML_(programming_language) - "ML"

**link#173**: https://en.wikipedia.org/wiki/Robin_Milner - "Robin Milner"

**link#174**: https://en.wikipedia.org/wiki/University_of_Edinburgh - "University of Edinburgh"

**link#175**: https://en.wikipedia.org/wiki/David_Turner_(computer_scientist) - "David Turner"

**link#176**: https://en.wikipedia.org/wiki/SASL_(programming_language) - "SASL"

**link#177**: https://en.wikipedia.org/wiki/University_of_St_Andrews - "University of St Andrews"

**link#178**: https://en.wikipedia.org/wiki/NPL_(programming_language) - "NPL"

**link#179**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-50 - "[50]"

**link#180**: https://en.wikipedia.org/wiki/Kleene%27s_recursion_theorem - "Kleene Recursion Equations"

**link#181**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-51 - "[51]"

**link#182**: https://en.wikipedia.org/wiki/Polymorphism_(computer_science) - "polymorphic"

**link#183**: https://en.wikipedia.org/wiki/Hope_(programming_language) - "Hope"

**link#184**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-52 - "[52]"

**link#185**: https://en.wikipedia.org/wiki/OCaml - "OCaml"

**link#186**: https://en.wikipedia.org/wiki/Standard_ML - "Standard ML"

**link#187**: https://en.wikipedia.org/wiki/Guy_L._Steele - "Guy L. Steele"

**link#188**: https://en.wikipedia.org/wiki/Gerald_Jay_Sussman - "Gerald Jay Sussman"

**link#189**: https://en.wikipedia.org/wiki/Scheme_(programming_language) - "Scheme"

**link#190**: https://en.wikipedia.org/wiki/Lambda_Papers - "Lambda Papers"

**link#191**: https://en.wikipedia.org/wiki/Structure_and_Interpretation_of_Computer_Programs - "Structure and Interpretation of Computer Programs"

**link#192**: https://en.wikipedia.org/wiki/Lexical_scope - "lexical scoping"

**link#193**: https://en.wikipedia.org/wiki/Tail-call_optimization - "tail-call optimization"

**link#194**: https://en.wikipedia.org/wiki/Per_Martin-L%C3%B6f - "Per Martin-Löf"

**link#195**: https://en.wikipedia.org/wiki/Intuitionistic_type_theory - "intuitionistic type theory"

**link#196**: https://en.wikipedia.org/wiki/Constructive_proof - "constructive proofs"

**link#197**: https://en.wikipedia.org/wiki/Dependent_type - "dependent types"

**link#198**: https://en.wikipedia.org/wiki/Interactive_theorem_proving - "interactive theorem proving"

**link#199**: https://en.wikipedia.org/wiki/Wikipedia:Citation_needed - "citation needed"

**link#200**: https://en.wikipedia.org/wiki/Miranda_(programming_language) - "Miranda"

**link#201**: https://en.wikipedia.org/wiki/Haskell - "Haskell"

**link#202**: https://en.wikipedia.org/wiki/Open_standard - "open standard"

**link#203**: https://en.wikipedia.org/wiki/Computer_Aided_Design - "CAD"

**link#204**: https://en.wikipedia.org/wiki/OpenSCAD - "OpenSCAD"

**link#205**: https://en.wikipedia.org/wiki/CGAL - "CGAL"

**link#206**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-53 - "[53]"

**link#207**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-54 - "[54]"

**link#208**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-55 - "[55]"

**link#209**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-56 - "[56]"

**link#210**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=2 - "edit"

**link#211**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-57 - "[57]"

**link#212**: https://en.wikipedia.org/wiki/Imperative_programming - "imperative programming"

**link#213**: https://en.wikipedia.org/wiki/Object-oriented_programming - "object-oriented programming"

**link#214**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-58 - "[58]"

**link#215**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=3 - "edit"

**link#216**: https://en.wikipedia.org/wiki/First-class_function - "First-class function"

**link#217**: https://en.wikipedia.org/wiki/Higher-order_function - "Higher-order function"

**link#218**: https://en.wikipedia.org/wiki/Higher-order_function - "Higher-order functions"

**link#219**: https://en.wikipedia.org/wiki/Differential_operator - "differential operator"

**link#220**: https://en.wikipedia.org/wiki/Derivative - "derivative"

**link#221**: https://en.wikipedia.org/wiki/First-class_function - "first-class functions"

**link#222**: https://en.wikipedia.org/wiki/Partial_application - "partial application"

**link#223**: https://en.wikipedia.org/wiki/Currying - "currying"

**link#224**: https://en.wikipedia.org/wiki/Successor_function - "successor function"

**link#225**: https://en.wikipedia.org/wiki/Natural_number - "natural number"

**link#226**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=4 - "edit"

**link#227**: https://en.wikipedia.org/wiki/Pure_function - "Pure function"

**link#228**: https://en.wikipedia.org/wiki/Pure_function - "Pure functions"

**link#229**: https://en.wikipedia.org/wiki/Side_effect_(computer_science) - "side effects"

**link#230**: https://en.wikipedia.org/wiki/Referential_transparency - "referential transparency"

**link#231**: https://en.wikipedia.org/wiki/Idempotence - "idempotence"

**link#232**: https://en.wikipedia.org/wiki/Memoization - "memoization"

**link#233**: https://en.wikipedia.org/wiki/Parallelization - "parallel"

**link#234**: https://en.wikipedia.org/wiki/Thread-safe - "thread-safe"

**link#235**: https://en.wikipedia.org/wiki/Deforestation_(computer_science) - "deforestation"

**link#236**: https://en.wikipedia.org/wiki/GNU_Compiler_Collection - "gcc"

**link#237**: https://en.wikipedia.org/wiki/Fortran_95 - "Fortran 95"

**link#238**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-fortran95-59 - "[59]"

**link#239**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=5 - "edit"

**link#240**: https://en.wikipedia.org/wiki/Recursion_(computer_science) - "Recursion (computer science)"

**link#241**: https://en.wikipedia.org/wiki/Iteration - "Iteration"

**link#242**: https://en.wikipedia.org/wiki/Recursion - "recursion"

**link#243**: https://en.wikipedia.org/wiki/Recursion_(computer_science) - "Recursive functions"

**link#244**: https://en.wikipedia.org/wiki/Recursion_(computer_science) - "base case"

**link#245**: https://en.wikipedia.org/wiki/Call_stack - "stack"

**link#246**: https://en.wikipedia.org/wiki/Tail_recursion - "tail recursion"

**link#247**: https://en.wikipedia.org/wiki/Continuation_passing_style - "continuation passing style"

**link#248**: https://en.wikipedia.org/wiki/Scheme_(programming_language) - "Scheme"

**link#249**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-SchemeProperTailRec-60 - "[60]"

**link#250**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-61 - "[61]"

**link#251**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-62 - "[62]"

**link#252**: https://en.wikipedia.org/wiki/Chicken_(Scheme_implementation) - "Chicken"

**link#253**: https://en.wikipedia.org/wiki/Stack_overflow - "stack overflow"

**link#254**: https://en.wikipedia.org/wiki/Garbage_collection_(computer_science) - "garbage collector"

**link#255**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-63 - "[63]"

**link#256**: https://en.wikipedia.org/wiki/Catamorphism - "catamorphisms"

**link#257**: https://en.wikipedia.org/wiki/Anamorphism - "anamorphisms"

**link#258**: https://en.wikipedia.org/wiki/Program_loops - "loops"

**link#259**: https://en.wikipedia.org/wiki/Imperative_languages - "imperative languages"

**link#260**: https://en.wikipedia.org/wiki/Turing_complete - "Turing complete"

**link#261**: https://en.wikipedia.org/wiki/Halting_problem - "halting problem"

**link#262**: https://en.wikipedia.org/wiki/Undecidable_problem - "undecidable"

**link#263**: https://en.wikipedia.org/wiki/Equational_reasoning - "equational reasoning"

**link#264**: https://en.wikipedia.org/wiki/Inconsistency - "inconsistency"

**link#265**: https://en.wikipedia.org/wiki/Type_system - "type system"

**link#266**: https://en.wikipedia.org/wiki/Coq_(software) - "Coq"

**link#267**: https://en.wikipedia.org/wiki/Well-founded - "well-founded"

**link#268**: https://en.wikipedia.org/wiki/Strongly_normalizing - "strongly normalizing"

**link#269**: https://en.wikipedia.org/wiki/Codata_(computer_science) - "codata"

**link#270**: https://en.wikipedia.org/wiki/Total_functional_programming - "total functional programming"

**link#271**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-totalfp-64 - "[64]"

**link#272**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=6 - "edit"

**link#273**: https://en.wikipedia.org/wiki/Evaluation_strategy - "Evaluation strategy"

**link#274**: https://en.wikipedia.org/wiki/Denotational_semantics - "denotational semantics"

**link#275**: https://en.wikipedia.org/wiki/Graph_reduction - "graph reduction"

**link#276**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-65 - "[65]"

**link#277**: https://en.wikipedia.org/wiki/Miranda_(programming_language) - "Miranda"

**link#278**: https://en.wikipedia.org/wiki/Clean_(programming_language) - "Clean"

**link#279**: https://en.wikipedia.org/wiki/Haskell - "Haskell"

**link#280**: https://en.wikipedia.org/wiki/Functional_programming#CITEREFHughes1984 - "Hughes 1984"

**link#281**: https://en.wikipedia.org/wiki/Separation_of_concerns - "separation of concerns"

**link#282**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-hughesWhyFPMatters-2 - "[2]"

**link#283**: https://en.wikipedia.org/wiki/Operational_semantics - "operational semantics"

**link#284**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-launchbury1993-66 - "[66]"

**link#285**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-67 - "[67]"

**link#286**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=7 - "edit"

**link#287**: https://en.wikipedia.org/wiki/Type_system - "Type system"

**link#288**: https://en.wikipedia.org/wiki/Hindley%E2%80%93Milner_type_inference - "Hindley–Milner type inference"

**link#289**: https://en.wikipedia.org/wiki/Typed_lambda_calculus - "typed lambda calculus"

**link#290**: https://en.wikipedia.org/wiki/False_positives_and_false_negatives#False_positive_error - "false positive errors"

**link#291**: https://en.wikipedia.org/wiki/Untyped_lambda_calculus - "untyped lambda calculus"

**link#292**: https://en.wikipedia.org/wiki/False_positives_and_false_negatives#False_negative_error - "false negative errors"

**link#293**: https://en.wikipedia.org/wiki/Scheme_(programming_language) - "Scheme"

**link#294**: https://en.wikipedia.org/wiki/Algebraic_data_type - "algebraic data types"

**link#295**: https://en.wikipedia.org/wiki/Test-driven_development - "test-driven development"

**link#296**: https://en.wikipedia.org/wiki/Type_inference - "type inference"

**link#297**: https://en.wikipedia.org/wiki/Coq_(software) - "Coq"

**link#298**: https://en.wikipedia.org/wiki/Agda_(programming_language) - "Agda"

**link#299**: https://en.wikipedia.org/wiki/Lennart_Augustsson - "Cayenne"

**link#300**: https://en.wikipedia.org/wiki/Epigram_(programming_language) - "Epigram"

**link#301**: https://en.wikipedia.org/wiki/Intuitionistic_type_theory - "intuitionistic type theory"

**link#302**: https://en.wikipedia.org/wiki/Dependent_type - "dependent types"

**link#303**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-68 - "[68]"

**link#304**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-69 - "[69]"

**link#305**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-70 - "[70]"

**link#306**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-71 - "[71]"

**link#307**: https://en.wikipedia.org/wiki/Higher-order_logic - "higher-order logic"

**link#308**: https://en.wikipedia.org/wiki/Curry%E2%80%93Howard_isomorphism - "Curry–Howard isomorphism"

**link#309**: https://en.wikipedia.org/wiki/Mathematical_proof - "mathematical proofs"

**link#310**: https://en.wikipedia.org/wiki/Formal_verification - "certified code"

**link#311**: https://en.wikipedia.org/wiki/Formalized_mathematics - "formalized mathematics"

**link#312**: https://en.wikipedia.org/wiki/Compcert - "Compcert"

**link#313**: https://en.wikipedia.org/wiki/Compiler - "compiler"

**link#314**: https://en.wikipedia.org/wiki/C_(programming_language) - "C"

**link#315**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-72 - "[72]"

**link#316**: https://en.wikipedia.org/wiki/Generalized_algebraic_data_type - "generalized algebraic data types"

**link#317**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-73 - "[73]"

**link#318**: https://en.wikipedia.org/wiki/Glasgow_Haskell_Compiler - "Glasgow Haskell Compiler"

**link#319**: https://en.wikipedia.org/wiki/OCaml - "OCaml"

**link#320**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-74 - "[74]"

**link#321**: https://en.wikipedia.org/wiki/Scala_(programming_language) - "Scala"

**link#322**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-75 - "[75]"

**link#323**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-76 - "[76]"

**link#324**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=8 - "edit"

**link#325**: https://en.wikipedia.org/wiki/Referential_transparency - "Referential transparency"

**link#326**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-77 - "[77]"

**link#327**: https://en.wikipedia.org/wiki/C_(programming_language) - "C"

**link#328**: https://en.wikipedia.org/wiki/Side_effect_(computer_science) - "side effects"

**link#329**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=9 - "edit"

**link#330**: https://en.wikipedia.org/wiki/Purely_functional_data_structure - "Purely functional data structure"

**link#331**: https://en.wikipedia.org/wiki/Data_structure - "data structures"

**link#332**: https://en.wikipedia.org/wiki/Imperative_programming - "imperative"

**link#333**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-78 - "[78]"

**link#334**: https://en.wikipedia.org/wiki/Array_data_structure - "array"

**link#335**: https://en.wikipedia.org/wiki/Hash_table - "hash table"

**link#336**: https://en.wikipedia.org/wiki/Binary_heap - "binary heap"

**link#337**: https://en.wikipedia.org/wiki/Map_(computer_science) - "maps"

**link#338**: https://en.wikipedia.org/wiki/Logarithm - "logarithmic"

**link#339**: https://en.wikipedia.org/wiki/Persistent_data_structure - "persistence"

**link#340**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-79 - "[79]"

**link#341**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=10 - "edit"

**link#342**: https://en.wikipedia.org/wiki/Imperative_programming - "imperative programming"

**link#343**: https://en.wikipedia.org/wiki/Side_effect_(computer_science) - "side effects"

**link#344**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=11 - "edit"

**link#345**: https://en.wikipedia.org/wiki/JavaScript - "JavaScript"

**link#346**: https://en.wikipedia.org/wiki/Off-by-one_error - "off-by-one errors"

**link#347**: https://en.wikipedia.org/wiki/Greenspun%27s_tenth_rule - "Greenspun's tenth rule"

**link#348**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=12 - "edit"

**link#349**: https://en.wikipedia.org/wiki/Haskell - "Haskell"

**link#350**: https://en.wikipedia.org/wiki/Monad_(functional_programming) - "monads"

**link#351**: https://en.wikipedia.org/wiki/Category_theory - "category theory"

**link#352**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-80 - "[80]"

**link#353**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-81 - "[81]"

**link#354**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-82 - "[82]"

**link#355**: https://en.wikipedia.org/wiki/Clojure - "Clojure"

**link#356**: https://en.wikipedia.org/wiki/Wikipedia:Citation_needed - "citation needed"

**link#357**: https://en.wikipedia.org/wiki/Hoare_logic - "Hoare logic"

**link#358**: https://en.wikipedia.org/wiki/Uniqueness_type - "uniqueness"

**link#359**: https://en.wikipedia.org/wiki/Effect_system - "effect systems"

**link#360**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-83 - "[83]"

**link#361**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=13 - "edit"

**link#362**: https://en.wikipedia.org/wiki/Central_processing_unit - "CPU"

**link#363**: https://en.wikipedia.org/wiki/C_(programming_language) - "C"

**link#364**: https://en.wikipedia.org/wiki/Pascal_(programming_language) - "Pascal"

**link#365**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-84 - "[84]"

**link#366**: https://en.wikipedia.org/w/index.php?title=Pointer_chasing&action=edit&redlink=1 - "pointer chasing"

**link#367**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-Spiewak-85 - "[85]"

**link#368**: https://en.wikipedia.org/wiki/OCaml - "OCaml"

**link#369**: https://en.wikipedia.org/wiki/Clean_(programming_language) - "Clean"

**link#370**: https://en.wikipedia.org/wiki/The_Computer_Language_Benchmarks_Game - "The Computer Language Benchmarks Game"

**link#371**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-86 - "[86]"

**link#372**: https://en.wikipedia.org/wiki/Matrix_(mathematics) - "matrices"

**link#373**: https://en.wikipedia.org/wiki/Database - "databases"

**link#374**: https://en.wikipedia.org/wiki/Array_programming - "array"

**link#375**: https://en.wikipedia.org/wiki/J_(programming_language) - "J"

**link#376**: https://en.wikipedia.org/wiki/K_(programming_language) - "K"

**link#377**: https://en.wikipedia.org/wiki/Inline_expansion - "inline expansion"

**link#378**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-87 - "[87]"

**link#379**: https://en.wikipedia.org/wiki/Clojure - "Clojure"

**link#380**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-88 - "[88]"

**link#381**: https://en.wikipedia.org/wiki/Rust_(programming_language) - "Rust"

**link#382**: https://en.wikipedia.org/wiki/Reference_(computer_science) - "references"

**link#383**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-89 - "[89]"

**link#384**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-90 - "[90]"

**link#385**: https://en.wikipedia.org/wiki/Shared-nothing_architecture - "shared-nothing"

**link#386**: https://en.wikipedia.org/wiki/Parallel_computing - "concurrent and parallel"

**link#387**: https://en.wikipedia.org/wiki/Linearizability - "atomic"

**link#388**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-91 - "[91]"

**link#389**: https://en.wikipedia.org/wiki/Message_passing - "message passing"

**link#390**: https://en.wikipedia.org/wiki/Actor_model - "actor model"

**link#391**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-92 - "[92]"

**link#392**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-93 - "[93]"

**link#393**: https://en.wikipedia.org/wiki/Erlang_(programming_language) - "Erlang"

**link#394**: https://en.wikipedia.org/wiki/Elixir_(programming_language) - "Elixir"

**link#395**: https://en.wikipedia.org/wiki/Akka_(toolkit) - "Akka"

**link#396**: https://en.wikipedia.org/wiki/Lazy_evaluation - "Lazy evaluation"

**link#397**: https://en.wikipedia.org/wiki/Memory_leak - "memory leaks"

**link#398**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-launchbury1993-66 - "[66]"

**link#399**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-94 - "[94]"

**link#400**: https://en.wikipedia.org/wiki/Wikipedia:Citation_needed - "citation needed"

**link#401**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=14 - "edit"

**link#402**: https://en.wikipedia.org/wiki/Map_(higher-order_function) - "map"

**link#403**: https://en.wikipedia.org/wiki/Filter_(higher-order_function) - "filter"

**link#404**: https://en.wikipedia.org/wiki/Clojure - "Clojure"

**link#405**: https://en.wikipedia.org/wiki/Benchmarking - "benchmarked"

**link#406**: https://clojars.org/criterium - "Criterium"

**link#407**: https://en.wikipedia.org/wiki/Zen_3 - "Ryzen 7900X"

**link#408**: https://en.wikipedia.org/wiki/Leiningen_(software) - "Leiningen"

**link#409**: https://en.wikipedia.org/wiki/REPL - "REPL"

**link#410**: https://en.wikipedia.org/wiki/JVM - "Java VM"

**link#411**: https://en.wikipedia.org/wiki/Java_(programming_language) - "Java"

**link#412**: https://github.com/samber/lo - "lo library"

**link#413**: https://en.wikipedia.org/wiki/Go_(programming_language) - "Go"

**link#414**: https://en.wikipedia.org/wiki/Generic_programming - "generics"

**link#415**: https://en.wikipedia.org/wiki/Memory_management - "allocation"

**link#416**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-95 - "[95]"

**link#417**: https://en.wikipedia.org/wiki/Inlining - "inlining"

**link#418**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-96 - "[96]"

**link#419**: https://en.wikipedia.org/wiki/Rust_(programming_language) - "Rust"

**link#420**: https://en.wikipedia.org/wiki/Loop_unrolling - "loop unrolling"

**link#421**: https://en.wikipedia.org/wiki/Assembly_language - "Assembly"

**link#422**: https://en.wikipedia.org/wiki/Register_allocation - "will be stored in specific CPU registers"

**link#423**: https://en.wikipedia.org/wiki/Time_complexity - "constant-time access"

**link#424**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-97 - "[97]"

**link#425**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=15 - "edit"

**link#426**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-98 - "[98]"

**link#427**: https://en.wikipedia.org/wiki/D_(programming_language) - "D"

**link#428**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-99 - "[99]"

**link#429**: https://en.wikipedia.org/wiki/Fortran_95 - "Fortran 95"

**link#430**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-fortran95-59 - "[59]"

**link#431**: https://en.wikipedia.org/wiki/JavaScript - "JavaScript"

**link#432**: https://en.wikipedia.org/wiki/Lua_(programming_language) - "Lua"

**link#433**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-100 - "[100]"

**link#434**: https://en.wikipedia.org/wiki/Python_(programming_language) - "Python"

**link#435**: https://en.wikipedia.org/wiki/Go_(programming_language) - "Go"

**link#436**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-101 - "[101]"

**link#437**: https://en.wikipedia.org/wiki/First-class_function - "first class functions"

**link#438**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-102 - "[102]"

**link#439**: https://en.wikipedia.org/wiki/Anonymous_function - "lambda"

**link#440**: https://en.wikipedia.org/wiki/Map_(higher-order_function) - "map"

**link#441**: https://en.wikipedia.org/wiki/Fold_(higher-order_function) - "reduce"

**link#442**: https://en.wikipedia.org/wiki/Filter_(higher-order_function) - "filter"

**link#443**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-103 - "[103]"

**link#444**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-104 - "[104]"

**link#445**: https://en.wikipedia.org/wiki/Perl - "Perl"

**link#446**: https://en.wikipedia.org/wiki/PHP - "PHP"

**link#447**: https://en.wikipedia.org/wiki/Visual_Basic_9 - "Visual Basic 9"

**link#448**: https://en.wikipedia.org/wiki/C_Sharp_(programming_language) - "C#"

**link#449**: https://en.wikipedia.org/wiki/C%2B%2B11 - "C++11"

**link#450**: https://en.wikipedia.org/wiki/Kotlin_(programming_language) - "Kotlin"

**link#451**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-:0-28 - "[28]"

**link#452**: https://en.wikipedia.org/wiki/Wikipedia:Citation_needed - "citation needed"

**link#453**: https://en.wikipedia.org/wiki/Anonymous_function - "lambda"

**link#454**: https://en.wikipedia.org/wiki/Map_(higher-order_function) - "map"

**link#455**: https://en.wikipedia.org/wiki/Fold_(higher-order_function) - "reduce"

**link#456**: https://en.wikipedia.org/wiki/Filter_(higher-order_function) - "filter"

**link#457**: https://en.wikipedia.org/wiki/Closure_(computer_science) - "closures"

**link#458**: https://en.wikipedia.org/wiki/Higher-Order_Perl - "Higher-Order Perl"

**link#459**: https://en.wikipedia.org/wiki/Anonymous_class - "anonymous classes"

**link#460**: https://en.wikipedia.org/wiki/Closure_(computer_science) - "closures"

**link#461**: https://en.wikipedia.org/wiki/Java_(programming_language) - "Java"

**link#462**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-105 - "[105]"

**link#463**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-106 - "[106]"

**link#464**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-107 - "[107]"

**link#465**: https://en.wikipedia.org/wiki/C_Sharp_(programming_language) - "C#"

**link#466**: https://en.wikipedia.org/wiki/Object-oriented - "object-oriented"

**link#467**: https://en.wikipedia.org/wiki/Design_pattern_(computer_science) - "design patterns"

**link#468**: https://en.wikipedia.org/wiki/Strategy_pattern - "strategy pattern"

**link#469**: https://en.wikipedia.org/wiki/Visitor_(design_pattern) - "visitor"

**link#470**: https://en.wikipedia.org/wiki/Catamorphism - "catamorphism"

**link#471**: https://en.wikipedia.org/wiki/Fold_(higher-order_function) - "fold"

**link#472**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-108 - "[108]"

**link#473**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-109 - "[109]"

**link#474**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=16 - "edit"

**link#475**: https://en.wikipedia.org/wiki/Logic_programming - "Logic programming"

**link#476**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-110 - "[110]"

**link#477**: https://en.wikipedia.org/wiki/Ciao_(programming_language) - "Ciao"

**link#478**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-111 - "[111]"

**link#479**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=17 - "edit"

**link#480**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=18 - "edit"

**link#481**: https://en.wikipedia.org/wiki/Emacs - "Emacs"

**link#482**: https://en.wikipedia.org/wiki/Emacs_Lisp - "Lisp dialect"

**link#483**: https://en.wikipedia.org/wiki/GNU_Emacs - "GNU Emacs"

**link#484**: https://en.wikipedia.org/wiki/Richard_Stallman - "Richard Stallman"

**link#485**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-112 - "[112]"

**link#486**: https://en.wikipedia.org/w/index.php?title=Helix_(text_editor)&action=edit&redlink=1 - "Helix"

**link#487**: https://en.wikipedia.org/wiki/Abstract_syntax_tree - "AST"

**link#488**: https://en.wikipedia.org/wiki/S-expression - "S-expressions"

**link#489**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-113 - "[113]"

**link#490**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=19 - "edit"

**link#491**: https://en.wikipedia.org/wiki/Spreadsheet - "Spreadsheets"

**link#492**: https://en.wikipedia.org/wiki/Higher-order_function - "zeroth-order"

**link#493**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-Wakeling2007-114 - "[114]"

**link#494**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-excel-115 - "[115]"

**link#495**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=20 - "edit"

**link#496**: https://en.wikipedia.org/wiki/Composability - "composability"

**link#497**: https://en.wikipedia.org/wiki/Microservices - "microservices"

**link#498**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-116 - "[116]"

**link#499**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=21 - "edit"

**link#500**: https://en.wikipedia.org/wiki/Programming_language_theory - "programming language theory"

**link#501**: https://en.wikipedia.org/wiki/Peer-review - "peer-reviewed"

**link#502**: https://en.wikipedia.org/wiki/International_Conference_on_Functional_Programming - "International Conference on Functional Programming"

**link#503**: https://en.wikipedia.org/wiki/Journal_of_Functional_Programming - "Journal of Functional Programming"

**link#504**: https://en.wikipedia.org/wiki/Symposium_on_Trends_in_Functional_Programming - "Symposium on Trends in Functional Programming"

**link#505**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=22 - "edit"

**link#506**: https://en.wikipedia.org/wiki/Erlang_(programming_language) - "Erlang"

**link#507**: https://en.wikipedia.org/wiki/Sweden - "Swedish"

**link#508**: https://en.wikipedia.org/wiki/Ericsson - "Ericsson"

**link#509**: https://en.wikipedia.org/wiki/Fault_tolerance - "fault-tolerant"

**link#510**: https://en.wikipedia.org/wiki/Telecommunications - "telecommunications"

**link#511**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-armstrong2007-11 - "[11]"

**link#512**: https://en.wikipedia.org/wiki/Nortel - "Nortel"

**link#513**: https://en.wikipedia.org/wiki/Facebook - "Facebook"

**link#514**: https://en.wikipedia.org/wiki/%C3%89lectricit%C3%A9_de_France - "Électricité de France"

**link#515**: https://en.wikipedia.org/wiki/WhatsApp - "WhatsApp"

**link#516**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-erlang-faq-10 - "[10]"

**link#517**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-larson2009-12 - "[12]"

**link#518**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-117 - "[117]"

**link#519**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-Sim-Diasca-118 - "[118]"

**link#520**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-whatsapp.blog.2012-119 - "[119]"

**link#521**: https://en.wikipedia.org/wiki/Scheme_(programming_language) - "Scheme"

**link#522**: https://en.wikipedia.org/wiki/Lisp_(programming_language) - "Lisp"

**link#523**: https://en.wikipedia.org/wiki/Apple_Macintosh - "Apple Macintosh"

**link#524**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-clinger1987-3 - "[3]"

**link#525**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-hartheimer1987-4 - "[4]"

**link#526**: https://en.wikipedia.org/wiki/Computer_simulation - "simulation software"

**link#527**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-kidd2007-5 - "[5]"

**link#528**: https://en.wikipedia.org/wiki/Telescope - "telescope"

**link#529**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-cleis2006-6 - "[6]"

**link#530**: https://en.wikipedia.org/wiki/OCaml - "OCaml"

**link#531**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-minksy2008-14 - "[14]"

**link#532**: https://en.wikipedia.org/wiki/Software_driver - "driver"

**link#533**: https://en.wikipedia.org/wiki/Robot - "robot"

**link#534**: https://en.wikipedia.org/wiki/Embedded_software - "embedded software"

**link#535**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-leroy2007-15 - "[15]"

**link#536**: https://en.wikipedia.org/wiki/Haskell - "Haskell"

**link#537**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-hudak2007-17 - "[17]"

**link#538**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-haskell-industry-16 - "[16]"

**link#539**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-hudak2007-17 - "[17]"

**link#540**: https://en.wikipedia.org/wiki/Scala_(programming_language) - "Scala"

**link#541**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-120 - "[120]"

**link#542**: https://en.wikipedia.org/wiki/F_Sharp_(programming_language) - "F#"

**link#543**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-quantFSharp-18 - "[18]"

**link#544**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-businessAppsFSharp-19 - "[19]"

**link#545**: https://en.wikipedia.org/wiki/Wolfram_Language - "Wolfram Language"

**link#546**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-reference.wolfram.com-7 - "[7]"

**link#547**: https://en.wikipedia.org/wiki/Lisp_(programming_language) - "Lisp"

**link#548**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-121 - "[121]"

**link#549**: https://en.wikipedia.org/wiki/Standard_ML - "Standard ML"

**link#550**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-122 - "[122]"

**link#551**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-123 - "[123]"

**link#552**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-124 - "[124]"

**link#553**: https://en.wikipedia.org/wiki/Data_science - "Data science"

**link#554**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-125 - "[125]"

**link#555**: https://en.wikipedia.org/wiki/ClojureScript - "ClojureScript"

**link#556**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-126 - "[126]"

**link#557**: https://en.wikipedia.org/wiki/Elm_(programming_language) - "Elm"

**link#558**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-127 - "[127]"

**link#559**: https://en.wikipedia.org/wiki/PureScript - "PureScript"

**link#560**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-128 - "[128]"

**link#561**: https://en.wikipedia.org/wiki/Elixir_(programming_language) - "Elixir"

**link#562**: https://en.wikipedia.org/wiki/Font_Awesome - "Font Awesome"

**link#563**: https://en.wikipedia.org/wiki/Allegro_Platform - "Allegro"

**link#564**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-129 - "[129]"

**link#565**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-130 - "[130]"

**link#566**: https://en.wikipedia.org/wiki/Gr%C3%B6bner_basis - "Gröbner basis"

**link#567**: https://en.wikipedia.org/wiki/Comprehensive_Capital_Analysis_and_Review - "Comprehensive Capital Analysis and Review"

**link#568**: https://en.wikipedia.org/wiki/Caml - "Caml"

**link#569**: https://en.wikipedia.org/wiki/Categorical_abstract_machine - "categorical abstract machine"

**link#570**: https://en.wikipedia.org/wiki/Category_theory - "category theory"

**link#571**: https://en.wikipedia.org/wiki/Wikipedia:Citation_needed - "citation needed"

**link#572**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=23 - "edit"

**link#573**: https://en.wikipedia.org/wiki/University - "universities"

**link#574**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-oxfordFP-131 - "[131]"

**link#575**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-imperialFP-132 - "[132]"

**link#576**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-nottinghamFP-133 - "[133]"

**link#577**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-mitFP-134 - "[134]"

**link#578**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-mitFP-134 - "[134]"

**link#579**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-nottinghamFP-133 - "[133]"

**link#580**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-61A-135 - "[135]"

**link#581**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-bootstrapworld-136 - "[136]"

**link#582**: https://en.wikipedia.org/wiki/Structure_and_Interpretation_of_Classical_Mechanics - "Structure and Interpretation of Classical Mecha..."

**link#583**: https://en.wikipedia.org/wiki/Scheme_(programming_language) - "Scheme"

**link#584**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-137 - "[137]"

**link#585**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-138 - "[138]"

**link#586**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=24 - "edit"

**link#587**: https://en.wikipedia.org/wiki/Portal:Computer_programming - "Computer programming portal"

**link#588**: https://en.wikipedia.org/wiki/Eager_evaluation - "Eager evaluation"

**link#589**: https://en.wikipedia.org/wiki/Functional_reactive_programming - "Functional reactive programming"

**link#590**: https://en.wikipedia.org/wiki/Inductive_functional_programming - "Inductive functional programming"

**link#591**: https://en.wikipedia.org/wiki/List_of_functional_programming_languages - "List of functional programming languages"

**link#592**: https://en.wikipedia.org/wiki/List_of_functional_programming_topics - "List of functional programming topics"

**link#593**: https://en.wikipedia.org/wiki/Nested_function - "Nested function"

**link#594**: https://en.wikipedia.org/wiki/Purely_functional_programming - "Purely functional programming"

**link#595**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=25 - "edit"

**link#596**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-hudak1989_1-0 - "^"

**link#597**: https://en.wikipedia.org/wiki/Paul_Hudak - "Hudak, Paul"

**link#598**: https://web.archive.org/web/20160131083528/http://www.dbnet.ece.ntua.gr/~adamo/languages/books/p359-hudak.pdf - ""Conception, evolution, and application of func..."

**link#599**: https://en.wikipedia.org/wiki/Doi_(identifier) - "doi"

**link#600**: https://doi.org/10.1145%2F72551.72554 - "10.1145/72551.72554"

**link#601**: https://en.wikipedia.org/wiki/S2CID_(identifier) - "S2CID"

**link#602**: https://api.semanticscholar.org/CorpusID:207637854 - "207637854"

**link#603**: http://www.dbnet.ece.ntua.gr/~adamo/languages/books/p359-hudak.pdf - "the original"

**link#604**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-hughesWhyFPMatters_2-0 - "Jump up to: a"

**link#605**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-hughesWhyFPMatters_2-1 - "b"

**link#606**: https://en.wikipedia.org/wiki/John_Hughes_(computer_scientist) - "Hughes, John"

**link#607**: http://www.cse.chalmers.se/~rjmh/Papers/whyfp.html - ""Why Functional Programming Matters""

**link#608**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-clinger1987_3-0 - "Jump up to: a"

**link#609**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-clinger1987_3-1 - "b"

**link#610**: http://www.mactech.com/articles/mactech/Vol.03/03.12/Multitasking/index.html - ""MultiTasking and MacScheme""

**link#611**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-hartheimer1987_4-0 - "Jump up to: a"

**link#612**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-hartheimer1987_4-1 - "b"

**link#613**: https://web.archive.org/web/20110629183752/http://www.mactech.com/articles/mactech/Vol.03/03.1/SchemeWindows/index.html - ""Programming a Text Editor in MacScheme+Toolsmith""

**link#614**: http://www.mactech.com/articles/mactech/Vol.03/03.1/SchemeWindows/index.html - "the original"

**link#615**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-kidd2007_5-0 - "Jump up to: a"

**link#616**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-kidd2007_5-1 - "b"

**link#617**: https://web.archive.org/web/20101221110947/http://cufp.galois.com/2007/abstracts.html#EricKidd - "Terrorism Response Training in Scheme"

**link#618**: http://cufp.galois.com/2007/abstracts.html#EricKidd - "the original"

**link#619**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-cleis2006_6-0 - "Jump up to: a"

**link#620**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-cleis2006_6-1 - "b"

**link#621**: https://web.archive.org/web/20100527100429/http://cufp.galois.com/2006/abstracts.html#RichardCleis - "Scheme in Space"

**link#622**: http://cufp.galois.com/2006/abstracts.html#RichardCleis - "the original"

**link#623**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-reference.wolfram.com_7-0 - "Jump up to: a"

**link#624**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-reference.wolfram.com_7-1 - "b"

**link#625**: http://reference.wolfram.com/language/guide/FunctionalProgramming.html - ""Wolfram Language Guide: Functional Programming""

**link#626**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-Amath-CO_8-0 - "^"

**link#627**: https://web.archive.org/web/20071113175801/http://amath.colorado.edu/computing/mmm/funcproc.html - ""Functional vs. Procedural Programming Language""

**link#628**: http://amath.colorado.edu/computing/mmm/funcproc.html - "the original"

**link#629**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-racket-video-games_9-0 - "^"

**link#630**: https://web.archive.org/web/20121215014637/http://www.gameenginebook.com/gdc09-statescripting-uncharted2.pdf - ""State-Based Scripting in Uncharted 2""

**link#631**: http://www.gameenginebook.com/gdc09-statescripting-uncharted2.pdf - "the original"

**link#632**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-erlang-faq_10-0 - "Jump up to: a"

**link#633**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-erlang-faq_10-1 - "b"

**link#634**: http://erlang.org/faq/introduction.html#idp32582608 - ""Who uses Erlang for product development?""

**link#635**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-armstrong2007_11-0 - "Jump up to: a"

**link#636**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-armstrong2007_11-1 - "b"

**link#637**: https://en.wikipedia.org/wiki/Doi_(identifier) - "doi"

**link#638**: https://doi.org/10.1145%2F1238844.1238850 - "10.1145/1238844.1238850"

**link#639**: https://en.wikipedia.org/wiki/ISBN_(identifier) - "ISBN"

**link#640**: https://en.wikipedia.org/wiki/Special:BookSources/9781595937667 - "9781595937667"

**link#641**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-larson2009_12-0 - "Jump up to: a"

**link#642**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-larson2009_12-1 - "b"

**link#643**: https://doi.org/10.1145%2F1467247.1467263 - ""Erlang for concurrent programming""

**link#644**: https://en.wikipedia.org/wiki/Doi_(identifier) - "doi"

**link#645**: https://doi.org/10.1145%2F1467247.1467263 - "10.1145/1467247.1467263"

**link#646**: https://en.wikipedia.org/wiki/S2CID_(identifier) - "S2CID"

**link#647**: https://api.semanticscholar.org/CorpusID:524392 - "524392"

**link#648**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-13 - "^"

**link#649**: https://elixir-lang.org/ - ""The Elixir Programming Language""

**link#650**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-minksy2008_14-0 - "Jump up to: a"

**link#651**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-minksy2008_14-1 - "b"

**link#652**: https://en.wikipedia.org/wiki/Doi_(identifier) - "doi"

**link#653**: https://doi.org/10.1017%2FS095679680800676X - "10.1017/S095679680800676X"

**link#654**: https://en.wikipedia.org/wiki/S2CID_(identifier) - "S2CID"

**link#655**: https://api.semanticscholar.org/CorpusID:30955392 - "30955392"

**link#656**: https://en.wikipedia.org/wiki/Template:Cite_journal - "cite journal"

**link#657**: https://en.wikipedia.org/wiki/Category:CS1_maint:_DOI_inactive_as_of_November_2024 - "link"

**link#658**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-leroy2007_15-0 - "Jump up to: a"

**link#659**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-leroy2007_15-1 - "b"

**link#660**: https://web.archive.org/web/20111008170929/http://cufp.galois.com/2007/slides/XavierLeroy.pdf - "Some uses of Caml in Industry"

**link#661**: http://cufp.galois.com/2007/slides/XavierLeroy.pdf - "the original"

**link#662**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-haskell-industry_16-0 - "Jump up to: a"

**link#663**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-haskell-industry_16-1 - "b"

**link#664**: http://www.haskell.org/haskellwiki/Haskell_in_industry - ""Haskell in industry""

**link#665**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-hudak2007_17-0 - "Jump up to: a"

**link#666**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-hudak2007_17-1 - "b"

**link#667**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-hudak2007_17-2 - "c"

**link#668**: https://en.wikipedia.org/wiki/Paul_Hudak - "Hudak, Paul"

**link#669**: http://dl.acm.org/citation.cfm?doid=1238844.1238856 - "A history of Haskell: being lazy with class"

**link#670**: https://en.wikipedia.org/wiki/Doi_(identifier) - "doi"

**link#671**: https://doi.org/10.1145%2F1238844.1238856 - "10.1145/1238844.1238856"

**link#672**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-quantFSharp_18-0 - "Jump up to: a"

**link#673**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-quantFSharp_18-1 - "b"

**link#674**: https://web.archive.org/web/20150708125937/http://cufp.galois.com/2008/abstracts.html#MansellHoward - "Quantitative Finance in F#"

**link#675**: http://cufp.galois.com/2008/abstracts.html#MansellHoward - "the original"

**link#676**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-businessAppsFSharp_19-0 - "Jump up to: a"

**link#677**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-businessAppsFSharp_19-1 - "b"

**link#678**: https://web.archive.org/web/20091017070140/http://cufp.galois.com/2009/abstracts.html#AlexPeakeAdamGranicz - "The First Substantial Line of Business Applicat..."

**link#679**: http://cufp.galois.com/2009/abstracts.html#AlexPeakeAdamGranicz - "the original"

**link#680**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-20 - "^"

**link#681**: https://en.wikipedia.org/wiki/Doi_(identifier) - "doi"

**link#682**: https://doi.org/10.1007%2F978-3-030-79876-5_37 - "10.1007/978-3-030-79876-5_37"

**link#683**: https://en.wikipedia.org/wiki/ISSN_(identifier) - "ISSN"

**link#684**: https://search.worldcat.org/issn/1611-3349 - "1611-3349"

**link#685**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-21 - "^"

**link#686**: https://opensource.com/article/17/6/functional-javascript - ""An introduction to functional programming in J..."

**link#687**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-useR_22-0 - "^"

**link#688**: http://www.r-project.org/useR-2006/program.html - ""The useR! 2006 conference schedule includes pa..."

**link#689**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-Chambers_23-0 - "^"

**link#690**: https://en.wikipedia.org/wiki/John_Chambers_(programmer) - "Chambers, John M."

**link#691**: https://en.wikipedia.org/wiki/ISBN_(identifier) - "ISBN"

**link#692**: https://en.wikipedia.org/wiki/Special:BookSources/978-0-387-98503-9 - "978-0-387-98503-9"

**link#693**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-Novatchev_24-0 - "^"

**link#694**: http://fxsl.sourceforge.net/articles/FuncProg/Functional%20Programming.html - ""The Functional Programming Language XSLT — A p..."

**link#695**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-Mertz_25-0 - "^"

**link#696**: http://gnosis.cx/publish/programming/xml_models_fp.html - ""XML Programming Paradigms (part four): Functio..."

**link#697**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-Chamberlin_Boyce_26-0 - "^"

**link#698**: https://en.wikipedia.org/wiki/Donald_D._Chamberlin - "Chamberlin, Donald D."

**link#699**: https://en.wikipedia.org/wiki/Raymond_F._Boyce - "Boyce, Raymond F."

**link#700**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-27 - "^"

**link#701**: https://ghostarchive.org/varchive/youtube/20211030/gvyTB4aMI4o - "Functional Programming with C# - Simon Painter ..."

**link#702**: https://www.youtube.com/watch?v=gvyTB4aMI4o - "the original"

**link#703**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-:0_28-0 - "Jump up to: a"

**link#704**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-:0_28-1 - "b"

**link#705**: https://kotlinlang.org/docs/tutorials/kotlin-for-py/functional-programming.html - ""Functional programming - Kotlin Programming La..."

**link#706**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-29 - "^"

**link#707**: https://en.wikipedia.org/wiki/Mark_Jason_Dominus - "Dominus, Mark J."

**link#708**: https://en.wikipedia.org/wiki/Higher-Order_Perl - "Higher-Order Perl"

**link#709**: https://en.wikipedia.org/wiki/Morgan_Kaufmann - "Morgan Kaufmann"

**link#710**: https://en.wikipedia.org/wiki/ISBN_(identifier) - "ISBN"

**link#711**: https://en.wikipedia.org/wiki/Special:BookSources/978-1-55860-701-9 - "978-1-55860-701-9"

**link#712**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-30 - "^"

**link#713**: https://en.wikipedia.org/wiki/ISBN_(identifier) - "ISBN"

**link#714**: https://en.wikipedia.org/wiki/Special:BookSources/9781940111056 - "9781940111056"

**link#715**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-AutoNT-13_31-0 - "^"

**link#716**: https://web.archive.org/web/20090530030205/http://www.python.org/community/pycon/dc2004/papers/24/metaclasses-pycon.pdf - ""Python Metaclasses: Who? Why? When?""

**link#717**: https://www.python.org/community/pycon/dc2004/papers/24/metaclasses-pycon.pdf - "the original"

**link#718**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-32 - "^"

**link#719**: https://www.youtube.com/watch?v=wqs8n5Uk5OM - ""GopherCon 2020: Dylan Meeus - Functional Progr..."

**link#720**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-33 - "^"

**link#721**: https://doc.rust-lang.org/book/ch13-00-functional-features.html - ""Functional Language Features: Iterators and Cl..."

**link#722**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-34 - "^"

**link#723**: https://web.archive.org/web/20200728013926/https://wimvanderbauwhede.github.io/articles/decluttering-with-functional-programming/ - ""Cleaner code with functional programming""

**link#724**: https://wimvanderbauwhede.github.io/articles/decluttering-with-functional-programming/ - "the original"

**link#725**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-effective-scala_35-0 - "^"

**link#726**: https://web.archive.org/web/20120619075044/http://twitter.github.com/effectivescala/?sd - ""Effective Scala""

**link#727**: https://twitter.github.com/effectivescala/?sd - "the original"

**link#728**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-java-8-javadoc_36-0 - "^"

**link#729**: https://docs.oracle.com/javase/8/docs/api/java/util/function/package-summary.html - ""Documentation for package java.util.function s..."

**link#730**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-37 - "^"

**link#731**: https://en.wikipedia.org/wiki/Doi_(identifier) - "doi"

**link#732**: https://doi.org/10.2307%2F2268280 - "10.2307/2268280"

**link#733**: https://en.wikipedia.org/wiki/JSTOR_(identifier) - "JSTOR"

**link#734**: https://www.jstor.org/stable/2268280 - "2268280"

**link#735**: https://en.wikipedia.org/wiki/S2CID_(identifier) - "S2CID"

**link#736**: https://api.semanticscholar.org/CorpusID:2317046 - "2317046"

**link#737**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-38 - "^"

**link#738**: https://archive.org/details/combinatorylogic0002curr - "Combinatory Logic"

**link#739**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-39 - "^"

**link#740**: https://en.wikipedia.org/wiki/Alonzo_Church - "Church, A."

**link#741**: https://en.wikipedia.org/wiki/Doi_(identifier) - "doi"

**link#742**: https://doi.org/10.2307%2F2266170 - "10.2307/2266170"

**link#743**: https://en.wikipedia.org/wiki/JSTOR_(identifier) - "JSTOR"

**link#744**: https://www.jstor.org/stable/2266170 - "2266170"

**link#745**: https://en.wikipedia.org/wiki/S2CID_(identifier) - "S2CID"

**link#746**: https://api.semanticscholar.org/CorpusID:15889861 - "15889861"

**link#747**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-40 - "^"

**link#748**: https://en.wikipedia.org/wiki/John_McCarthy_(computer_scientist) - "McCarthy, John"

**link#749**: http://jmc.stanford.edu/articles/lisp/lisp.pdf - "History of Lisp"

**link#750**: https://en.wikipedia.org/wiki/Doi_(identifier) - "doi"

**link#751**: https://doi.org/10.1145%2F800025.808387 - "10.1145/800025.808387"

**link#752**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-41 - "^"

**link#753**: https://en.wikipedia.org/wiki/John_McCarthy_(computer_scientist) - "John McCarthy"

**link#754**: http://jmc.stanford.edu/articles/recursive/recursive.pdf - ""Recursive functions of symbolic expressions an..."

**link#755**: https://en.wikipedia.org/wiki/Doi_(identifier) - "doi"

**link#756**: https://doi.org/10.1145%2F367177.367199 - "10.1145/367177.367199"

**link#757**: https://en.wikipedia.org/wiki/S2CID_(identifier) - "S2CID"

**link#758**: https://api.semanticscholar.org/CorpusID:1489409 - "1489409"

**link#759**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-42 - "^"

**link#760**: http://dreamsongs.com/Files/HOPL2-Uncut.pdf - "History of programming languages---II"

**link#761**: https://en.wikipedia.org/wiki/Doi_(identifier) - "doi"

**link#762**: https://doi.org/10.1145%2F234286.1057818 - "10.1145/234286.1057818"

**link#763**: https://en.wikipedia.org/wiki/ISBN_(identifier) - "ISBN"

**link#764**: https://en.wikipedia.org/wiki/Special:BookSources/978-0-201-89502-5 - "978-0-201-89502-5"

**link#765**: https://en.wikipedia.org/wiki/S2CID_(identifier) - "S2CID"

**link#766**: https://api.semanticscholar.org/CorpusID:47047140 - "47047140"

**link#767**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-43 - "^"

**link#768**: https://en.wikipedia.org/wiki/Herbert_A._Simon - "Herbert A. Simon"

**link#769**: https://en.wikipedia.org/wiki/ISBN_(identifier) - "ISBN"

**link#770**: https://en.wikipedia.org/wiki/Special:BookSources/0-465-04640-1 - "0-465-04640-1"

**link#771**: https://en.wikipedia.org/wiki/Logic_Theorist - "Logic Theorist"

**link#772**: https://en.wikipedia.org/wiki/Principia_Mathematica - "Principia Mathematica"

**link#773**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-44 - "^"

**link#774**: https://doi.org/10.1093%2Fcomjnl%2F6.4.308 - ""The mechanical evaluation of expressions""

**link#775**: https://en.wikipedia.org/wiki/The_Computer_Journal - "The Computer Journal"

**link#776**: https://en.wikipedia.org/wiki/British_Computer_Society - "British Computer Society"

**link#777**: https://en.wikipedia.org/wiki/Doi_(identifier) - "doi"

**link#778**: https://doi.org/10.1093%2Fcomjnl%2F6.4.308 - "10.1093/comjnl/6.4.308"

**link#779**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-45 - "^"

**link#780**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-46 - "^"

**link#781**: https://doi.org/10.1145%2F363744.363749 - ""Correspondence between ALGOL 60 and Church's L..."

**link#782**: https://en.wikipedia.org/wiki/Communications_of_the_ACM - "Communications of the ACM"

**link#783**: https://en.wikipedia.org/wiki/Association_for_Computing_Machinery - "Association for Computing Machinery"

**link#784**: https://en.wikipedia.org/wiki/Doi_(identifier) - "doi"

**link#785**: https://doi.org/10.1145%2F363744.363749 - "10.1145/363744.363749"

**link#786**: https://en.wikipedia.org/wiki/S2CID_(identifier) - "S2CID"

**link#787**: https://api.semanticscholar.org/CorpusID:6505810 - "6505810"

**link#788**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-47 - "^"

**link#789**: https://doi.org/10.1145%2F363791.363804 - ""A correspondence between ALGOL 60 and Church's..."

**link#790**: https://en.wikipedia.org/wiki/Communications_of_the_ACM - "Communications of the ACM"

**link#791**: https://en.wikipedia.org/wiki/Association_for_Computing_Machinery - "Association for Computing Machinery"

**link#792**: https://en.wikipedia.org/wiki/Doi_(identifier) - "doi"

**link#793**: https://doi.org/10.1145%2F363791.363804 - "10.1145/363791.363804"

**link#794**: https://en.wikipedia.org/wiki/S2CID_(identifier) - "S2CID"

**link#795**: https://api.semanticscholar.org/CorpusID:15781851 - "15781851"

**link#796**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-48 - "^"

**link#797**: https://doi.org/10.1145%2F365230.365257 - ""The next 700 programming languages""

**link#798**: https://en.wikipedia.org/wiki/Communications_of_the_ACM - "Communications of the ACM"

**link#799**: https://en.wikipedia.org/wiki/Association_for_Computing_Machinery - "Association for Computing Machinery"

**link#800**: https://en.wikipedia.org/wiki/Doi_(identifier) - "doi"

**link#801**: https://doi.org/10.1145%2F365230.365257 - "10.1145/365230.365257"

**link#802**: https://en.wikipedia.org/wiki/S2CID_(identifier) - "S2CID"

**link#803**: https://api.semanticscholar.org/CorpusID:13409665 - "13409665"

**link#804**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-Backus_1977_49-0 - "^"

**link#805**: https://doi.org/10.1145%2F359576.359579 - ""Can programming be liberated from the von Neum..."

**link#806**: https://en.wikipedia.org/wiki/Doi_(identifier) - "doi"

**link#807**: https://doi.org/10.1145%2F359576.359579 - "10.1145/359576.359579"

**link#808**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-50 - "^"

**link#809**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-51 - "^"

**link#810**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-52 - "^"

**link#811**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-53 - "^"

**link#812**: https://web.archive.org/web/20230419060430/https://forum.openscad.org/Make-discovering-assign-easier-td10964.html - ""Make discovering assign() easier!""

**link#813**: https://forum.openscad.org/Make-discovering-assign-easier-td10964.html - "the original"

**link#814**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-54 - "^"

**link#815**: https://arstechnica.com/gadgets/2018/03/developers-love-trendy-new-languages-but-earn-more-with-functional-programming/ - ""Developers love trendy new languages but earn ..."

**link#816**: https://en.wikipedia.org/wiki/Ars_Technica - "Ars Technica"

**link#817**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-55 - "^"

**link#818**: https://www.computing.co.uk/ctg/analysis/3003123/the-slow-but-steady-rise-of-functional-programming - ""The stealthy rise of functional programming""

**link#819**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-56 - "^"

**link#820**: https://www.infoworld.com/article/3190185/software/is-functional-programming-better-for-your-startup.html - ""Is functional programming better for your star..."

**link#821**: https://en.wikipedia.org/wiki/InfoWorld - "InfoWorld"

**link#822**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-57 - "^"

**link#823**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-58 - "^"

**link#824**: https://web.archive.org/web/20060827094123/http://byte.com/art/9408/sec11/art1.htm - ""Functional Programming Comes of Age""

**link#825**: https://en.wikipedia.org/wiki/Byte_(magazine) - "Byte"

**link#826**: http://byte.com/art/9408/sec11/art1.htm - "the original"

**link#827**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-fortran95_59-0 - "Jump up to: a"

**link#828**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-fortran95_59-1 - "b"

**link#829**: https://wg5-fortran.org/N2101-N2150/N2137.pdf - ""ISO/IEC JTC 1/SC 22/WG5/N2137 – Fortran 2015 C..."

**link#830**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-SchemeProperTailRec_60-0 - "^"

**link#831**: http://www.r6rs.org/final/html/r6rs/r6rs-Z-H-8.html#node_sec_5.11 - ""Revised^6 Report on the Algorithmic Language S..."

**link#832**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-61 - "^"

**link#833**: http://www.r6rs.org/final/html/r6rs-rationale/r6rs-rationale-Z-H-7.html#node_sec_5.3 - ""Revised^6 Report on the Algorithmic Language S..."

**link#834**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-62 - "^"

**link#835**: https://en.wikipedia.org/wiki/Doi_(identifier) - "doi"

**link#836**: https://doi.org/10.1145%2F277650.277719 - "10.1145/277650.277719"

**link#837**: https://en.wikipedia.org/wiki/ISBN_(identifier) - "ISBN"

**link#838**: https://en.wikipedia.org/wiki/Special:BookSources/0897919874 - "0897919874"

**link#839**: https://en.wikipedia.org/wiki/S2CID_(identifier) - "S2CID"

**link#840**: https://api.semanticscholar.org/CorpusID:16812984 - "16812984"

**link#841**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-63 - "^"

**link#842**: https://web.archive.org/web/20060303155622/http://home.pipeline.com/~hbaker1/CheneyMTA.html - ""CONS Should Not CONS Its Arguments, Part II: C..."

**link#843**: http://home.pipeline.com/~hbaker1/CheneyMTA.html - "the original"

**link#844**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-totalfp_64-0 - "^"

**link#845**: https://en.wikipedia.org/wiki/David_Turner_(computer_scientist) - "Turner, D.A."

**link#846**: http://www.jucs.org/jucs_10_7/total_functional_programming - ""Total Functional Programming""

**link#847**: https://en.wikipedia.org/wiki/Doi_(identifier) - "doi"

**link#848**: https://doi.org/10.3217%2Fjucs-010-07-0751 - "10.3217/jucs-010-07-0751"

**link#849**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-65 - "^"

**link#850**: http://research.microsoft.com/~simonpj/papers/slpj-book-1987/index.htm - "The Implementation of Functional Programming La..."

**link#851**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-launchbury1993_66-0 - "Jump up to: a"

**link#852**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-launchbury1993_66-1 - "b"

**link#853**: https://en.wikipedia.org/wiki/John_Launchbury - "Launchbury, John"

**link#854**: https://en.wikipedia.org/wiki/Association_for_Computing_Machinery - "ACM"

**link#855**: https://en.wikipedia.org/wiki/Doi_(identifier) - "doi"

**link#856**: https://doi.org/10.1145%2F158511.158618 - "10.1145/158511.158618"

**link#857**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-67 - "^"

**link#858**: https://en.wikipedia.org/wiki/Robert_Harper_(computer_scientist) - "Robert W. Harper"

**link#859**: https://web.archive.org/web/20160407095249/https://www.cs.cmu.edu/~rwh/plbook/book.pdf - "Practical Foundations for Programming Languages"

**link#860**: https://www.cs.cmu.edu/~rwh/plbook/book.pdf - "the original"

**link#861**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-68 - "^"

**link#862**: https://en.wikipedia.org/wiki/Doi_(identifier) - "doi"

**link#863**: https://doi.org/10.1016%2Fs0019-9958%2873%2990301-x - "10.1016/s0019-9958(73)90301-x"

**link#864**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-69 - "^"

**link#865**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-70 - "^"

**link#866**: http://pauillac.inria.fr/~huet/PUBLIC/Hampton.pdf - ""Higher Order Unification 30 years later""

**link#867**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-71 - "^"

**link#868**: https://en.wikipedia.org/wiki/CiteSeerX_(identifier) - "CiteSeerX"

**link#869**: https://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.31.3590 - "10.1.1.31.3590"

**link#870**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-72 - "^"

**link#871**: http://compcert.inria.fr/doc/index.html - ""The Compcert verified compiler""

**link#872**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-73 - "^"

**link#873**: https://en.wikipedia.org/wiki/Stephanie_Weirich - "Weirich, Stephanie"

**link#874**: http://research.microsoft.com/en-us/um/people/simonpj/papers/gadt/ - ""Simple unification-based type inference for GA..."

**link#875**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-74 - "^"

**link#876**: https://caml.inria.fr/pub/docs/manual-ocaml/gadts.html - ""OCaml Manual""

**link#877**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-75 - "^"

**link#878**: https://docs.scala-lang.org/scala3/book/types-adts-gadts.html - ""Algebraic Data Types""

**link#879**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-76 - "^"

**link#880**: https://web.archive.org/web/20061229164852/http://research.microsoft.com/~akenn/generics/gadtoop.pdf - "Generalized Algebraic Data Types and Object-Ori..."

**link#881**: https://en.wikipedia.org/wiki/Association_for_Computing_Machinery - "ACM"

**link#882**: https://en.wikipedia.org/wiki/Doi_(identifier) - "doi"

**link#883**: https://doi.org/10.1145%2F1094811.1094814 - "10.1145/1094811.1094814"

**link#884**: https://en.wikipedia.org/wiki/ISBN_(identifier) - "ISBN"

**link#885**: https://en.wikipedia.org/wiki/Special:BookSources/9781595930316 - "9781595930316"

**link#886**: https://www.microsoft.com/en-us/research/publication/generalized-algebraic-data-types-and-object-oriented-programming/ - "the original"

**link#887**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-77 - "^"

**link#888**: http://www.cse.chalmers.se/~rjmh/Papers/whyfp.pdf - ""Why Functional Programming Matters""

**link#889**: https://en.wikipedia.org/wiki/Chalmers_University_of_Technology - "Chalmers University of Technology"

**link#890**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-78 - "^"

**link#891**: http://www.cambridge.org/us/academic/subjects/computer-science/algorithmics-complexity-computer-algebra-and-computational-g/purely-functional-data-structures - "Purely functional data structures"

**link#892**: https://en.wikipedia.org/wiki/Chris_Okasaki - "Chris Okasaki"

**link#893**: https://en.wikipedia.org/wiki/Cambridge_University_Press - "Cambridge University Press"

**link#894**: https://en.wikipedia.org/wiki/ISBN_(identifier) - "ISBN"

**link#895**: https://en.wikipedia.org/wiki/Special:BookSources/0-521-66350-4 - "0-521-66350-4"

**link#896**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-79 - "^"

**link#897**: http://www.hypirion.com/musings/understanding-persistent-vector-pt-1 - ""polymatheia - Understanding Clojure's Persiste..."

**link#898**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-80 - "^"

**link#899**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-81 - "^"

**link#900**: http://monads.haskell.cz/html/index.html/html/ - ""All About Monads: A comprehensive guide to the..."

**link#901**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-82 - "^"

**link#902**: https://fsharpforfunandprofit.com/posts/13-ways-of-looking-at-a-turtle/#2-basic-fp---a-module-of-functions-with-immutable-state - ""Thirteen ways of looking at a turtle""

**link#903**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-83 - "^"

**link#904**: https://doi.org/10.1007/3-540-16761-7_62 - "Automata, Languages and Programming"

**link#905**: https://en.wikipedia.org/wiki/Doi_(identifier) - "doi"

**link#906**: https://doi.org/10.1007%2F3-540-16761-7_62 - "10.1007/3-540-16761-7_62"

**link#907**: https://en.wikipedia.org/wiki/ISBN_(identifier) - "ISBN"

**link#908**: https://en.wikipedia.org/wiki/Special:BookSources/978-3-540-16761-7 - "978-3-540-16761-7"

**link#909**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-84 - "^"

**link#910**: https://en.wikipedia.org/wiki/Lawrence_Paulson - "Paulson, Larry C."

**link#911**: https://books.google.com/books?id=XppZdaDs7e0C - "ML for the Working Programmer"

**link#912**: https://en.wikipedia.org/wiki/ISBN_(identifier) - "ISBN"

**link#913**: https://en.wikipedia.org/wiki/Special:BookSources/978-0-521-56543-1 - "978-0-521-56543-1"

**link#914**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-Spiewak_85-0 - "^"

**link#915**: https://web.archive.org/web/20150923205254/http://www.codecommit.com/blog/scala/implementing-persistent-vectors-in-scala - ""Implementing Persistent Vectors in Scala""

**link#916**: http://www.codecommit.com/blog/scala/implementing-persistent-vectors-in-scala - "the original"

**link#917**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-86 - "^"

**link#918**: https://web.archive.org/web/20130520162513/http://benchmarksgame.alioth.debian.org/u32/which-programs-are-fastest.php?gcc=on&ghc=on&clean=on&ocaml=on&sbcl=on&fsharp=on&racket=on&clojure=on&hipe=on&calc=chart - ""Which programs are fastest? | Computer Languag..."

**link#919**: http://benchmarksgame.alioth.debian.org/u32/which-programs-are-fastest.php?gcc=on&ghc=on&clean=on&ocaml=on&sbcl=on&fsharp=on&racket=on&clojure=on&hipe=on&calc=chart - "the original"

**link#920**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-87 - "^"

**link#921**: https://en.wikipedia.org/wiki/Doi_(identifier) - "doi"

**link#922**: https://doi.org/10.1002%2Fcpe.853 - "10.1002/cpe.853"

**link#923**: https://en.wikipedia.org/wiki/S2CID_(identifier) - "S2CID"

**link#924**: https://api.semanticscholar.org/CorpusID:34527406 - "34527406"

**link#925**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-88 - "^"

**link#926**: https://www.infoq.com/articles/in-depth-look-clojure-collections/ - ""An In-Depth Look at Clojure Collections""

**link#927**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-89 - "^"

**link#928**: https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html - ""References and Borrowing - The Rust Programmin..."

**link#929**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-90 - "^"

**link#930**: https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html - ""Validating References with Lifetimes - The Rus..."

**link#931**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-91 - "^"

**link#932**: https://docs.oracle.com/javase/tutorial/essential/concurrency/collections.html - ""Concurrent Collections (The Java™ Tutorials > ..."

**link#933**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-92 - "^"

**link#934**: https://scaleyourapp.com/actor-model/ - ""Understanding The Actor Model To Build Non-blo..."

**link#935**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-93 - "^"

**link#936**: https://en.wikipedia.org/wiki/ISBN_(identifier) - "ISBN"

**link#937**: https://en.wikipedia.org/wiki/Special:BookSources/978-0-596-55585-6 - "978-0-596-55585-6"

**link#938**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-94 - "^"

**link#939**: http://book.realworldhaskell.org/read/profiling-and-optimization.html#x_eK1 - ""Chapter 25. Profiling and optimization""

**link#940**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-95 - "^"

**link#941**: https://github.com/samber/lo - "samber/lo"

**link#942**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-96 - "^"

**link#943**: https://go.dev/wiki/CompilerOptimizations - ""Go Wiki: Compiler And Runtime Optimizations - ..."

**link#944**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-97 - "^"

**link#945**: https://doc.rust-lang.org/book/ch13-04-performance.html - ""Comparing Performance: Loops vs. Iterators - T..."

**link#946**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-98 - "^"

**link#947**: https://web.archive.org/web/20110719201553/http://www.ub.utwente.nl/webdocs/ctit/1/00000084.pdf - ""The Functional C experience""

**link#948**: https://en.wikipedia.org/wiki/Doi_(identifier) - "doi"

**link#949**: https://doi.org/10.1017%2FS0956796803004817 - "10.1017/S0956796803004817"

**link#950**: https://en.wikipedia.org/wiki/S2CID_(identifier) - "S2CID"

**link#951**: https://api.semanticscholar.org/CorpusID:32346900 - "32346900"

**link#952**: http://www.ub.utwente.nl/webdocs/ctit/1/00000084.pdf - "the original"

**link#953**: https://web.archive.org/web/20071016124848/http://www-128.ibm.com/developerworks/linux/library/l-prog3.html - ""Functional programming in Python, Part 3""

**link#954**: http://www-128.ibm.com/developerworks/linux/library/l-prog3.html - "the original"

**link#955**: https://web.archive.org/web/20071016124848/http://www-128.ibm.com/developerworks/linux/library/l-prog.html - "Part 1"

**link#956**: https://web.archive.org/web/20071016124848/http://www-128.ibm.com/developerworks/linux/library/l-prog2.html - "Part 2"

**link#957**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-99 - "^"

**link#958**: http://www.digitalmars.com/d/2.0/function.html#pure-functions - ""Functions — D Programming Language 2.0""

**link#959**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-100 - "^"

**link#960**: http://www.luafaq.org/#T1.2 - ""Lua Unofficial FAQ (uFAQ)""

**link#961**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-101 - "^"

**link#962**: https://golang.org/doc/codewalk/functions/ - ""First-Class Functions in Go - The Go Programmi..."

**link#963**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-102 - "^"

**link#964**: https://brendaneich.com/2008/04/popularity/ - ""Popularity""

**link#965**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-103 - "^"

**link#966**: https://en.wikipedia.org/wiki/Guido_van_Rossum - "van Rossum, Guido"

**link#967**: http://python-history.blogspot.de/2009/04/origins-of-pythons-functional-features.html - ""Origins of Python's "Functional" Features""

**link#968**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-104 - "^"

**link#969**: https://docs.python.org/dev/library/functools.html#functools.reduce - ""functools — Higher order functions and operati..."

**link#970**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-105 - "^"

**link#971**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-106 - "^"

**link#972**: https://web.archive.org/web/20130414180002/https://blogs.oracle.com/jag/entry/closures - ""Closures""

**link#973**: http://blogs.oracle.com/jag/entry/closures - "the original"

**link#974**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-107 - "^"

**link#975**: https://blogs.oracle.com/javatraining/entry/java_se_8_lambda_quick - ""Java SE 8 Lambda Quick Start""

**link#976**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-108 - "^"

**link#977**: https://archive.org/details/effectivejava00bloc_0 - "Effective Java"

**link#978**: https://en.wikipedia.org/wiki/ISBN_(identifier) - "ISBN"

**link#979**: https://en.wikipedia.org/wiki/Special:BookSources/978-0321356680 - "978-0321356680"

**link#980**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-109 - "^"

**link#981**: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze - ""Object.freeze() - JavaScript | MDN""

**link#982**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-110 - "^"

**link#983**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-111 - "^"

**link#984**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-112 - "^"

**link#985**: https://stallman.org/stallman-computing.html - ""How I do my Computing""

**link#986**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-113 - "^"

**link#987**: https://helix-editor.com/news/release-24-03-highlights/ - ""Helix""

**link#988**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-Wakeling2007_114-0 - "^"

**link#989**: http://www.activemode.org/webroot/Workers/ActiveTraining/Programming/Pro_SpreadsheetFunctionalProgramming.pdf - ""Spreadsheet functional programming""

**link#990**: https://en.wikipedia.org/wiki/Doi_(identifier) - "doi"

**link#991**: https://doi.org/10.1017%2FS0956796806006186 - "10.1017/S0956796806006186"

**link#992**: https://en.wikipedia.org/wiki/ISSN_(identifier) - "ISSN"

**link#993**: https://search.worldcat.org/issn/0956-7968 - "0956-7968"

**link#994**: https://en.wikipedia.org/wiki/S2CID_(identifier) - "S2CID"

**link#995**: https://api.semanticscholar.org/CorpusID:29429059 - "29429059"

**link#996**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-excel_115-0 - "^"

**link#997**: https://en.wikipedia.org/wiki/Simon_Peyton_Jones - "Peyton Jones, Simon"

**link#998**: https://en.wikipedia.org/wiki/Margaret_Burnett - "Burnett, Margaret"

**link#999**: https://en.wikipedia.org/wiki/Alan_Blackwell - "Blackwell, Alan"

**link#1000**: https://web.archive.org/web/20051016011341/http://research.microsoft.com/~simonpj/Papers/excel/index.htm - ""Improving the world's most popular functional ..."

**link#1001**: http://research.microsoft.com/~simonpj/Papers/excel/index.htm - "the original"

**link#1002**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-116 - "^"

**link#1003**: https://en.wikipedia.org/wiki/ISBN_(identifier) - "ISBN"

**link#1004**: https://en.wikipedia.org/wiki/Special:BookSources/9781638351733 - "9781638351733"

**link#1005**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-117 - "^"

**link#1006**: https://web.archive.org/web/20091017070140/http://cufp.galois.com/2009/abstracts.html#ChristopherPiroEugeneLetuchy - "Functional Programming at Facebook"

**link#1007**: http://cufp.galois.com/2009/abstracts.html#ChristopherPiroEugeneLetuchy - "the original"

**link#1008**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-Sim-Diasca_118-0 - "^"

**link#1009**: https://web.archive.org/web/20130917092159/http://research.edf.com/research-and-the-scientific-community/software/sim-diasca-80704.html - ""Sim-Diasca: a large-scale discrete event concu..."

**link#1010**: http://research.edf.com/research-and-the-scientific-community/software/sim-diasca-80704.html - "the original"

**link#1011**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-whatsapp.blog.2012_119-0 - "^"

**link#1012**: https://blog.whatsapp.com/index.php/2012/01/1-million-is-so-2011/ - "1 million is so 2011"

**link#1013**: https://web.archive.org/web/20140219234031/http://blog.whatsapp.com/index.php/2012/01/1-million-is-so-2011/ - "Archived"

**link#1014**: https://en.wikipedia.org/wiki/Wayback_Machine - "Wayback Machine"

**link#1015**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-120 - "^"

**link#1016**: https://web.archive.org/web/20091017070140/http://cufp.galois.com/2009/abstracts.html#LeeMomtahan - "Scala at EDF Trading: Implementing a Domain-Spe..."

**link#1017**: http://cufp.galois.com/2009/abstracts.html#LeeMomtahan - "the original"

**link#1018**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-121 - "^"

**link#1019**: http://www.paulgraham.com/avg.html - ""Beating the Averages""

**link#1020**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-122 - "^"

**link#1021**: http://cufp.galois.com/2006/slides/SteveSims.pdf - "Building a Startup with Standard ML"

**link#1022**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-123 - "^"

**link#1023**: https://web.archive.org/web/20101221110947/http://cufp.galois.com/2007/abstracts.html#VilleLaurikari - "Functional Programming in Communications Security"

**link#1024**: http://cufp.galois.com/2007/abstracts.html#VilleLaurikari - "the original"

**link#1025**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-124 - "^"

**link#1026**: http://www.infoq.com/news/2009/01/clojure_production - ""Live Production Clojure Application Announced""

**link#1027**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-125 - "^"

**link#1028**: https://en.wikipedia.org/wiki/Packt - "Packt"

**link#1029**: https://en.wikipedia.org/wiki/ISBN_(identifier) - "ISBN"

**link#1030**: https://en.wikipedia.org/wiki/Special:BookSources/9781785281372 - "9781785281372"

**link#1031**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-126 - "^"

**link#1032**: https://stackshare.io/clojurescript - ""Why developers like ClojureScript""

**link#1033**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-127 - "^"

**link#1034**: https://github.com/jah2488/elm-companies - "jah2488/elm-companies"

**link#1035**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-128 - "^"

**link#1036**: https://stackshare.io/purescript - ""Why developers like PureScript""

**link#1037**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-129 - "^"

**link#1038**: https://ecommercegermany.com/blog/allegro-all-you-need-to-know-about-the-best-polish-online-marketplace - ""ALLEGRO - all you need to know about the best ..."

**link#1039**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-130 - "^"

**link#1040**: https://www.wappalyzer.com/technologies/web-frameworks/phoenix-framework/ - ""Websites using Phoenix Framework - Wappalyzer""

**link#1041**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-oxfordFP_131-0 - "^"

**link#1042**: https://www.cs.ox.ac.uk/teaching/courses/2019-2020/fp/ - ""Functional Programming: 2019-2020""

**link#1043**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-imperialFP_132-0 - "^"

**link#1044**: https://www.imperial.ac.uk/computing/current-students/courses/120_1/ - ""Programming I (Haskell)""

**link#1045**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-nottinghamFP_133-0 - "Jump up to: a"

**link#1046**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-nottinghamFP_133-1 - "b"

**link#1047**: https://www.nottingham.ac.uk/ugstudy/course/Computer-Science-BSc#yearsmodules - ""Computer Science BSc - Modules""

**link#1048**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-mitFP_134-0 - "Jump up to: a"

**link#1049**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-mitFP_134-1 - "b"

**link#1050**: https://en.wikipedia.org/wiki/Hal_Abelson - "Abelson, Hal"

**link#1051**: https://en.wikipedia.org/wiki/Gerald_Jay_Sussman - "Sussman, Gerald Jay"

**link#1052**: https://mitpress.mit.edu/sites/default/files/sicp/full-text/book/book-Z-H-6.html - ""Preface to the Second Edition""

**link#1053**: http://mitpress.mit.edu/sicp/ - "Structure and Interpretation of Computer Programs"

**link#1054**: https://en.wikipedia.org/wiki/Bibcode_(identifier) - "Bibcode"

**link#1055**: https://ui.adsabs.harvard.edu/abs/1985sicp.book.....A - "1985sicp.book.....A"

**link#1056**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-61A_135-0 - "^"

**link#1057**: https://cs61a.org/articles/about.html - ""Computer Science 61A, Berkeley""

**link#1058**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-bootstrapworld_136-0 - "^"

**link#1059**: https://twit.tv/shows/triangulation/episodes/196/ - "Emmanuel Schanzer of Bootstrap"

**link#1060**: https://en.wikipedia.org/wiki/TWiT.tv - "TWiT.tv"

**link#1061**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-137 - "^"

**link#1062**: https://home.adelphi.edu/sbloch/class/pbd/testimonials/ - ""Why Scheme for Introductory Programming?""

**link#1063**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-138 - "^"

**link#1064**: https://www.imacs.org/learn-computer-programming-using-scheme/ - ""What Is Scheme & Why Is it Beneficial for Stud..."

**link#1065**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=26 - "edit"

**link#1066**: https://en.wikipedia.org/wiki/Hal_Abelson - "Abelson, Hal"

**link#1067**: https://en.wikipedia.org/wiki/Gerald_Jay_Sussman - "Sussman, Gerald Jay"

**link#1068**: https://mitpress.mit.edu/9780262510363/structure-and-interpretation-of-computer-programs/ - "Structure and Interpretation of Computer Programs"

**link#1069**: https://en.wikipedia.org/wiki/Bibcode_(identifier) - "Bibcode"

**link#1070**: https://ui.adsabs.harvard.edu/abs/1985sicp.book.....A - "1985sicp.book.....A"

**link#1071**: https://en.wikipedia.org/wiki/Cambridge_University_Press - "Cambridge University Press"

**link#1072**: https://en.wikipedia.org/wiki/Haskell_Curry - "Curry, Haskell B."

**link#1073**: https://en.wikipedia.org/wiki/J._Roger_Hindley - "Hindley, J. Roger"

**link#1074**: https://en.wikipedia.org/w/index.php?title=Jonathan_P._Seldin&action=edit&redlink=1 - "Seldin, Jonathan P."

**link#1075**: https://en.wikipedia.org/wiki/ISBN_(identifier) - "ISBN"

**link#1076**: https://en.wikipedia.org/wiki/Special:BookSources/978-0-7204-2208-5 - "978-0-7204-2208-5"

**link#1077**: http://hop.perl.plover.com/book/pdf/HigherOrderPerl.pdf - "Higher-Order Perl"

**link#1078**: https://en.wikipedia.org/wiki/Morgan_Kaufmann - "Morgan Kaufmann"

**link#1079**: http://www.htdp.org/ - "How to Design Programs"

**link#1080**: https://en.wikipedia.org/wiki/Prentice_Hall - "Prentice Hall"

**link#1081**: https://en.wikipedia.org/wiki/ISBN_(identifier) - "ISBN"

**link#1082**: https://en.wikipedia.org/wiki/Special:BookSources/978-0-486-28029-5 - "978-0-486-28029-5"

**link#1083**: http://book.realworldhaskell.org/read/ - "Real World Haskell"

**link#1084**: https://en.wikipedia.org/wiki/Marvin_Victor_Zelkowitz - "Marvin Victor Zelkowitz"

**link#1085**: https://en.wikipedia.org/wiki/Prentice_Hall - "Prentice Hall"

**link#1086**: https://en.wikipedia.org/w/index.php?title=Macmillan_Technical_Publishing&action=edit&redlink=1 - "Macmillan Technical Publishing"

**link#1087**: https://en.wikipedia.org/w/index.php?title=Addison-Wesley_Longman_Limited&action=edit&redlink=1 - "Addison-Wesley Longman Limited"

**link#1088**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=27 - "edit"

**link#1089**: https://en.wikipedia.org/wiki/File:En-Functional_programming.ogg

**link#1090**: https://en.wikipedia.org/wiki/File:En-Functional_programming.ogg - "This audio file"

**link#1091**: https://en.wikipedia.org/wiki/Wikipedia:Media_help - "Audio help"

**link#1092**: https://en.wikipedia.org/wiki/Wikipedia:Spoken_articles - "More spoken articles"

**link#1093**: http://nealford.com/functionalthinking.html - ""Functional thinking""

**link#1094**: http://www.defmacro.org/ramblings/fp.html - ""defmacro – Functional Programming For The Rest..."

**link#1095**: http://gnosis.cx/publish/programming/charming_python_13.html - "part 1"

**link#1096**: http://gnosis.cx/publish/programming/charming_python_16.html - "part 2"

**link#1097**: http://gnosis.cx/publish/programming/charming_python_19.html - "part 3"

**link#1098**: https://en.wikipedia.org/wiki/Programming_paradigm - "Programming paradigms"

**link#1099**: https://en.wikipedia.org/wiki/Comparison_of_multi-paradigm_programming_languages - "Comparison by language"

**link#1100**: https://en.wikipedia.org/wiki/Imperative_programming - "Imperative"

**link#1101**: https://en.wikipedia.org/wiki/Structured_programming - "Structured"

**link#1102**: https://en.wikipedia.org/wiki/Jackson_structured_programming - "Jackson structures"

**link#1103**: https://en.wikipedia.org/wiki/Block_(programming) - "Block-structured"

**link#1104**: https://en.wikipedia.org/wiki/Modular_programming - "Modular"

**link#1105**: https://en.wikipedia.org/wiki/Non-structured_programming - "Non-structured"

**link#1106**: https://en.wikipedia.org/wiki/Procedural_programming - "Procedural"

**link#1107**: https://en.wikipedia.org/wiki/Programming_in_the_large_and_programming_in_the_small - "Programming in the large and in the small"

**link#1108**: https://en.wikipedia.org/wiki/Design_by_contract - "Design by contract"

**link#1109**: https://en.wikipedia.org/wiki/Invariant-based_programming - "Invariant-based"

**link#1110**: https://en.wikipedia.org/wiki/Nested_function - "Nested function"

**link#1111**: https://en.wikipedia.org/wiki/Object-oriented_programming - "Object-oriented"

**link#1112**: https://en.wikipedia.org/wiki/Comparison_of_programming_languages_(object-oriented_programming) - "comparison"

**link#1113**: https://en.wikipedia.org/wiki/List_of_object-oriented_programming_languages - "list"

**link#1114**: https://en.wikipedia.org/wiki/Class-based_programming - "Class-based"

**link#1115**: https://en.wikipedia.org/wiki/Prototype-based_programming - "Prototype-based"

**link#1116**: https://en.wikipedia.org/wiki/Object-based_language - "Object-based"

**link#1117**: https://en.wikipedia.org/wiki/Agent-oriented_programming - "Agent"

**link#1118**: https://en.wikipedia.org/wiki/Immutable_object - "Immutable object"

**link#1119**: https://en.wikipedia.org/wiki/Persistent_programming_language - "Persistent"

**link#1120**: https://en.wikipedia.org/wiki/Uniform_function_call_syntax - "Uniform function call syntax"

**link#1121**: https://en.wikipedia.org/wiki/Declarative_programming - "Declarative"

**link#1122**: https://en.wikipedia.org/wiki/Comparison_of_functional_programming_languages - "comparison"

**link#1123**: https://en.wikipedia.org/wiki/Recursion_(computer_science) - "Recursive"

**link#1124**: https://en.wikipedia.org/wiki/Anonymous_function - "Anonymous function"

**link#1125**: https://en.wikipedia.org/wiki/Partial_application - "Partial application"

**link#1126**: https://en.wikipedia.org/wiki/Higher-order_programming - "Higher-order"

**link#1127**: https://en.wikipedia.org/wiki/Purely_functional_programming - "Purely functional"

**link#1128**: https://en.wikipedia.org/wiki/Total_functional_programming - "Total"

**link#1129**: https://en.wikipedia.org/wiki/Strict_programming_language - "Strict"

**link#1130**: https://en.wikipedia.org/wiki/Generalized_algebraic_data_type - "GADTs"

**link#1131**: https://en.wikipedia.org/wiki/Dependent_type - "Dependent types"

**link#1132**: https://en.wikipedia.org/wiki/Functional_logic_programming - "Functional logic"

**link#1133**: https://en.wikipedia.org/wiki/Tacit_programming - "Point-free style"

**link#1134**: https://en.wikipedia.org/wiki/Expression-oriented_programming_language - "Expression-oriented"

**link#1135**: https://en.wikipedia.org/wiki/Applicative_programming_language - "Applicative"

**link#1136**: https://en.wikipedia.org/wiki/Concatenative_programming_language - "Concatenative"

**link#1137**: https://en.wikipedia.org/wiki/Function-level_programming - "Function-level"

**link#1138**: https://en.wikipedia.org/wiki/Value-level_programming - "Value-level"

**link#1139**: https://en.wikipedia.org/wiki/Dataflow_programming - "Dataflow"

**link#1140**: https://en.wikipedia.org/wiki/Flow-based_programming - "Flow-based"

**link#1141**: https://en.wikipedia.org/wiki/Reactive_programming - "Reactive"

**link#1142**: https://en.wikipedia.org/wiki/Functional_reactive_programming - "Functional reactive"

**link#1143**: https://en.wikipedia.org/wiki/Signal_programming - "Signals"

**link#1144**: https://en.wikipedia.org/wiki/Stream_processing - "Streams"

**link#1145**: https://en.wikipedia.org/wiki/Synchronous_programming_language - "Synchronous"

**link#1146**: https://en.wikipedia.org/wiki/Logic_programming - "Logic"

**link#1147**: https://en.wikipedia.org/wiki/Abductive_logic_programming - "Abductive logic"

**link#1148**: https://en.wikipedia.org/wiki/Answer_set_programming - "Answer set"

**link#1149**: https://en.wikipedia.org/wiki/Constraint_programming - "Constraint"

**link#1150**: https://en.wikipedia.org/wiki/Constraint_logic_programming - "Constraint logic"

**link#1151**: https://en.wikipedia.org/wiki/Inductive_logic_programming - "Inductive logic"

**link#1152**: https://en.wikipedia.org/wiki/Nondeterministic_programming - "Nondeterministic"

**link#1153**: https://en.wikipedia.org/wiki/Ontology_language - "Ontology"

**link#1154**: https://en.wikipedia.org/wiki/Probabilistic_logic_programming - "Probabilistic logic"

**link#1155**: https://en.wikipedia.org/wiki/Query_language - "Query"

**link#1156**: https://en.wikipedia.org/wiki/Domain-specific_language - "DSL"

**link#1157**: https://en.wikipedia.org/wiki/Algebraic_modeling_language - "Algebraic modeling"

**link#1158**: https://en.wikipedia.org/wiki/Array_programming - "Array"

**link#1159**: https://en.wikipedia.org/wiki/Automata-based_programming - "Automata-based"

**link#1160**: https://en.wikipedia.org/wiki/Action_language - "Action"

**link#1161**: https://en.wikipedia.org/wiki/Command_language - "Command"

**link#1162**: https://en.wikipedia.org/wiki/Spacecraft_command_language - "Spacecraft"

**link#1163**: https://en.wikipedia.org/wiki/Differentiable_programming - "Differentiable"

**link#1164**: https://en.wikipedia.org/wiki/End-user_development - "End-user"

**link#1165**: https://en.wikipedia.org/wiki/Grammar-oriented_programming - "Grammar-oriented"

**link#1166**: https://en.wikipedia.org/wiki/Interface_description_language - "Interface description"

**link#1167**: https://en.wikipedia.org/wiki/Language-oriented_programming - "Language-oriented"

**link#1168**: https://en.wikipedia.org/wiki/List_comprehension - "List comprehension"

**link#1169**: https://en.wikipedia.org/wiki/Low-code_development_platform - "Low-code"

**link#1170**: https://en.wikipedia.org/wiki/Modeling_language - "Modeling"

**link#1171**: https://en.wikipedia.org/wiki/Natural-language_programming - "Natural language"

**link#1172**: https://en.wikipedia.org/wiki/Non-English-based_programming_languages - "Non-English-based"

**link#1173**: https://en.wikipedia.org/wiki/Page_description_language - "Page description"

**link#1174**: https://en.wikipedia.org/wiki/Pipeline_(software) - "Pipes"

**link#1175**: https://en.wikipedia.org/wiki/Filter_(software) - "filters"

**link#1176**: https://en.wikipedia.org/wiki/Probabilistic_programming - "Probabilistic"

**link#1177**: https://en.wikipedia.org/wiki/Quantum_programming - "Quantum"

**link#1178**: https://en.wikipedia.org/wiki/Scientific_programming_language - "Scientific"

**link#1179**: https://en.wikipedia.org/wiki/Scripting_language - "Scripting"

**link#1180**: https://en.wikipedia.org/wiki/Set_theoretic_programming - "Set-theoretic"

**link#1181**: https://en.wikipedia.org/wiki/Simulation_language - "Simulation"

**link#1182**: https://en.wikipedia.org/wiki/Stack-oriented_programming - "Stack-based"

**link#1183**: https://en.wikipedia.org/wiki/System_programming_language - "System"

**link#1184**: https://en.wikipedia.org/wiki/Tactile_programming_language - "Tactile"

**link#1185**: https://en.wikipedia.org/wiki/Template_processor - "Templating"

**link#1186**: https://en.wikipedia.org/wiki/Transformation_language - "Transformation"

**link#1187**: https://en.wikipedia.org/wiki/Graph_rewriting - "Graph rewriting"

**link#1188**: https://en.wikipedia.org/wiki/Production_system_(computer_science) - "Production"

**link#1189**: https://en.wikipedia.org/wiki/Pattern_matching - "Pattern"

**link#1190**: https://en.wikipedia.org/wiki/Visual_programming_language - "Visual"

**link#1191**: https://en.wikipedia.org/wiki/Concurrent_computing - "Concurrent"

**link#1192**: https://en.wikipedia.org/wiki/Distributed_computing - "distributed"

**link#1193**: https://en.wikipedia.org/wiki/Parallel_computing - "parallel"

**link#1194**: https://en.wikipedia.org/wiki/Actor_model - "Actor-based"

**link#1195**: https://en.wikipedia.org/wiki/Automatic_mutual_exclusion - "Automatic mutual exclusion"

**link#1196**: https://en.wikipedia.org/wiki/Choreographic_programming - "Choreographic programming"

**link#1197**: https://en.wikipedia.org/wiki/Concurrent_logic_programming - "Concurrent logic"

**link#1198**: https://en.wikipedia.org/wiki/Concurrent_constraint_logic_programming - "Concurrent constraint logic"

**link#1199**: https://en.wikipedia.org/wiki/Concurrent_object-oriented_programming - "Concurrent OO"

**link#1200**: https://en.wikipedia.org/wiki/Macroprogramming - "Macroprogramming"

**link#1201**: https://en.wikipedia.org/wiki/Multitier_programming - "Multitier programming"

**link#1202**: https://en.wikipedia.org/wiki/Organic_computing - "Organic computing"

**link#1203**: https://en.wikipedia.org/wiki/Parallel_programming_model - "Parallel programming models"

**link#1204**: https://en.wikipedia.org/wiki/Partitioned_global_address_space - "Partitioned global address space"

**link#1205**: https://en.wikipedia.org/wiki/Process-oriented_programming - "Process-oriented"

**link#1206**: https://en.wikipedia.org/wiki/Relativistic_programming - "Relativistic programming"

**link#1207**: https://en.wikipedia.org/wiki/Service-oriented_programming - "Service-oriented"

**link#1208**: https://en.wikipedia.org/wiki/Structured_concurrency - "Structured concurrency"

**link#1209**: https://en.wikipedia.org/wiki/Metaprogramming - "Metaprogramming"

**link#1210**: https://en.wikipedia.org/wiki/Attribute-oriented_programming - "Attribute-oriented"

**link#1211**: https://en.wikipedia.org/wiki/Automatic_programming - "Automatic"

**link#1212**: https://en.wikipedia.org/wiki/Inductive_programming - "Inductive"

**link#1213**: https://en.wikipedia.org/wiki/Dynamic_programming_language - "Dynamic"

**link#1214**: https://en.wikipedia.org/wiki/Extensible_programming - "Extensible"

**link#1215**: https://en.wikipedia.org/wiki/Generic_programming - "Generic"

**link#1216**: https://en.wikipedia.org/wiki/Homoiconicity - "Homoiconicity"

**link#1217**: https://en.wikipedia.org/wiki/Interactive_programming - "Interactive"

**link#1218**: https://en.wikipedia.org/wiki/Macro_(computer_science) - "Macro"

**link#1219**: https://en.wikipedia.org/wiki/Hygienic_macro - "Hygienic"

**link#1220**: https://en.wikipedia.org/wiki/Metalinguistic_abstraction - "Metalinguistic abstraction"

**link#1221**: https://en.wikipedia.org/wiki/Multi-stage_programming - "Multi-stage"

**link#1222**: https://en.wikipedia.org/wiki/Program_synthesis - "Program synthesis"

**link#1223**: https://en.wikipedia.org/wiki/Bayesian_program_synthesis - "Bayesian"

**link#1224**: https://en.wikipedia.org/wiki/Inferential_programming - "Inferential"

**link#1225**: https://en.wikipedia.org/wiki/Programming_by_demonstration - "by demonstration"

**link#1226**: https://en.wikipedia.org/wiki/Programming_by_example - "by example"

**link#1227**: https://en.wikipedia.org/wiki/Reflective_programming - "Reflective"

**link#1228**: https://en.wikipedia.org/wiki/Self-modifying_code - "Self-modifying code"

**link#1229**: https://en.wikipedia.org/wiki/Symbolic_programming - "Symbolic"

**link#1230**: https://en.wikipedia.org/wiki/Template_metaprogramming - "Template"

**link#1231**: https://en.wikipedia.org/wiki/Separation_of_concerns - "Separationof concerns"

**link#1232**: https://en.wikipedia.org/wiki/Aspect-oriented_programming - "Aspects"

**link#1233**: https://en.wikipedia.org/wiki/Component-based_software_engineering - "Components"

**link#1234**: https://en.wikipedia.org/wiki/Data-driven_programming - "Data-driven"

**link#1235**: https://en.wikipedia.org/wiki/Data-oriented_design - "Data-oriented"

**link#1236**: https://en.wikipedia.org/wiki/Event-driven_programming - "Event-driven"

**link#1237**: https://en.wikipedia.org/wiki/Feature-oriented_programming - "Features"

**link#1238**: https://en.wikipedia.org/wiki/Literate_programming - "Literate"

**link#1239**: https://en.wikipedia.org/wiki/Role-oriented_programming - "Roles"

**link#1240**: https://en.wikipedia.org/wiki/Subject-oriented_programming - "Subjects"

**link#1241**: https://en.wikipedia.org/wiki/Programming_paradigm - "Types of programming languages"

**link#1242**: https://en.wikipedia.org/wiki/Machine_code - "Machine"

**link#1243**: https://en.wikipedia.org/wiki/Assembly_language - "Assembly"

**link#1244**: https://en.wikipedia.org/wiki/Compiled_language - "Compiled"

**link#1245**: https://en.wikipedia.org/wiki/Interpreted_language - "Interpreted"

**link#1246**: https://en.wikipedia.org/wiki/Low-level_programming_language - "Low-level"

**link#1247**: https://en.wikipedia.org/wiki/High-level_programming_language - "High-level"

**link#1248**: https://en.wikipedia.org/wiki/Very_high-level_programming_language - "Very high-level"

**link#1249**: https://en.wikipedia.org/wiki/Esoteric_programming_language - "Esoteric"

**link#1250**: https://en.wikipedia.org/wiki/Programming_language_generations - "Generation"

**link#1251**: https://en.wikipedia.org/wiki/First-generation_programming_language - "First"

**link#1252**: https://en.wikipedia.org/wiki/Second-generation_programming_language - "Second"

**link#1253**: https://en.wikipedia.org/wiki/Third-generation_programming_language - "Third"

**link#1254**: https://en.wikipedia.org/wiki/Fourth-generation_programming_language - "Fourth"

**link#1255**: https://en.wikipedia.org/wiki/Fifth-generation_programming_language - "Fifth"

**link#1256**: https://en.wikipedia.org/wiki/Help:Authority_control - "Authority control databases"

**link#1257**: https://d-nb.info/gnd/4198740-8 - "Germany"

**link#1258**: https://id.loc.gov/authorities/sh87007844 - "United States"

**link#1259**: https://catalogue.bnf.fr/ark:/12148/cb121910539 - "France"

**link#1260**: https://data.bnf.fr/ark:/12148/cb121910539 - "BnF data"

**link#1261**: https://aleph.nkp.cz/F/?func=find-c&local_base=aut&ccl_term=ica=ph572639&CON_LNG=ENG - "Czech Republic"

**link#1262**: https://datos.bne.es/resource/XX547935 - "Spain"

**link#1263**: https://www.nli.org.il/en/authorities/987007541542105171 - "Israel"

**link#1264**: https://en.wikipedia.org/w/index.php?title=Functional_programming&oldid=1288545228 - "https://en.wikipedia.org/w/index.php?title=Func..."

**link#1265**: https://en.wikipedia.org/wiki/Help:Category - "Categories"

**link#1266**: https://en.wikipedia.org/wiki/Category:Functional_programming - "Functional programming"

**link#1267**: https://en.wikipedia.org/wiki/Category:Programming_paradigms - "Programming paradigms"

**link#1268**: https://en.wikipedia.org/wiki/Category:Programming_language_comparisons - "Programming language comparisons"

**link#1269**: https://en.wikipedia.org/wiki/Category:CS1_maint:_DOI_inactive_as_of_November_2024 - "CS1 maint: DOI inactive as of November 2024"

**link#1270**: https://en.wikipedia.org/wiki/Category:CS1_French-language_sources_(fr) - "CS1 French-language sources (fr)"

**link#1271**: https://en.wikipedia.org/wiki/Category:Webarchive_template_wayback_links - "Webarchive template wayback links"

**link#1272**: https://en.wikipedia.org/wiki/Category:Articles_with_short_description - "Articles with short description"

**link#1273**: https://en.wikipedia.org/wiki/Category:Short_description_matches_Wikidata - "Short description matches Wikidata"

**link#1274**: https://en.wikipedia.org/wiki/Category:All_articles_with_unsourced_statements - "All articles with unsourced statements"

**link#1275**: https://en.wikipedia.org/wiki/Category:Articles_with_unsourced_statements_from_February_2017 - "Articles with unsourced statements from Februar..."

**link#1276**: https://en.wikipedia.org/wiki/Category:Articles_with_unsourced_statements_from_July_2018 - "Articles with unsourced statements from July 2018"

**link#1277**: https://en.wikipedia.org/wiki/Category:Articles_with_unsourced_statements_from_June_2014 - "Articles with unsourced statements from June 2014"

**link#1278**: https://en.wikipedia.org/wiki/Category:Articles_with_unsourced_statements_from_April_2015 - "Articles with unsourced statements from April 2015"

**link#1279**: https://en.wikipedia.org/wiki/Category:Articles_with_unsourced_statements_from_August_2022 - "Articles with unsourced statements from August ..."

**link#1280**: https://en.wikipedia.org/wiki/Category:Articles_with_hAudio_microformats - "Articles with hAudio microformats"

**link#1281**: https://en.wikipedia.org/wiki/Category:Spoken_articles - "Spoken articles"

**link#1282**: https://en.wikipedia.org/wiki/Category:Articles_with_example_C_code - "Articles with example C code"

**link#1283**: https://en.wikipedia.org/wiki/Category:Articles_with_example_JavaScript_code - "Articles with example JavaScript code"

**link#1284**: https://en.wikipedia.org/wiki/Category:Articles_with_example_Lisp_(programming_language)_code - "Articles with example Lisp (programming languag..."

**link#1285**: https://en.wikipedia.org/wiki/Functional_programming#

**link#1286**: https://en.wikipedia.org/wiki/Functional_programming#

**link#1287**: https://en.wikipedia.org/wiki/Functional_programming#

**link#1288**: https://en.wikipedia.org/wiki/Functional_programming#

**link#1289**: https://en.wikipedia.org/wiki/Functional_programming#

**link#1290**: https://en.wikipedia.org/wiki/Functional_programming#

**link#1291**: https://en.wikipedia.org/wiki/Functional_programming#

**link#1292**: https://en.wikipedia.org/wiki/Functional_programming# - "Add topic"

**link#1293**: https://en.wikipedia.org/wiki/Functional_programming?action=edit

## Images

**image#1**: https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Sound-icon.svg/20px-Sound-icon.svg.png - Listen to this article

**image#2**: https://wikimedia.org/api/rest_v1/media/math/render/svg/75a0e680edceb47b7d233535262fcacd931585f8 - {\\displaystyle d/dx}

**image#3**: https://wikimedia.org/api/rest_v1/media/math/render/svg/132e57acb643253e7810ee9702d9581f159a1c61 - {\\displaystyle f}

**image#4**: https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Octicons-terminal.svg/60px-Octicons-terminal.svg.png - icon

**image#5**: https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Sound-icon.svg/60px-Sound-icon.svg.png - Spoken Wikipedia icon

**image#6**: https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/OOjs_UI_icon_edit-ltr-progressive.svg/20px-OOjs_UI_icon_edit-ltr-progressive.svg.png - Edit this at Wikidata

## Summary

Total references: **1299**

- Links: 1293
- Images: 6
- Videos: 0

_Generated on: 5/13/2025, 4:39:25 PM_
