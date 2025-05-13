[Jump to content](link#1)

[![Listen to this article](https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Sound-icon.svg/20px-Sound-icon.svg.png)](https://en.wikipedia.org/wiki/File:En-Functional_programming.ogg "Listen to this article")

From Wikipedia, the free encyclopedia

Programming paradigm based on applying and composing functions

For subroutine-oriented programming, see [Procedural programming](link#2 "Procedural programming").

In [computer science](link#3 "Computer science"), **functional programming** is a [programming paradigm](link#4 "Programming paradigm") where programs are constructed by [applying](link#5 "Function application") and [composing](link#6 "Function composition (computer science)") [functions](link#7 "Function (computer science)"). It is a [declarative programming](link#8 "Declarative programming") paradigm in which function definitions are [trees](link#9 "Tree (data structure)") of [expressions](link#10 "Expression (computer science)") that map [values](link#11 "Value (computer science)") to other values, rather than a sequence of [imperative](link#12 "Imperative programming") [statements](link#13 "Statement (computer science)") which update the [running state](link#14 "State (computer science)") of the program.

In functional programming, functions are treated as [first-class citizens](link#15 "First-class citizen"), meaning that they can be bound to names (including local [identifiers](link#16 "Identifier (computer languages)")), passed as [arguments](link#17 "Parameter (computer programming)"), and [returned](link#18 "Return value") from other functions, just as any other [data type](link#19 "Data type") can. This allows programs to be written in a [declarative](link#8 "Declarative programming") and [composable](link#20 "Composability") style, where small functions are combined in a [modular](link#21 "Modular programming") manner.

Functional programming is sometimes treated as synonymous with [purely functional programming](link#22 "Purely functional programming"), a subset of functional programming that treats all functions as [deterministic](link#23 "Deterministic system") mathematical [functions](link#24 "Function (mathematics)"), or [pure functions](link#25 "Pure function"). When a pure function is called with some given arguments, it will always return the same result, and cannot be affected by any mutable [state](link#14 "State (computer science)") or other [side effects](link#26 "Side effect (computer science)"). This is in contrast with impure [procedures](link#27 "Procedure (computer science)"), common in [imperative programming](link#12 "Imperative programming"), which can have side effects (such as modifying the program's state or taking input from a user). Proponents of purely functional programming claim that by restricting side effects, programs can have fewer [bugs](link#28 "Software bug"), be easier to [debug](link#29 "Debugging") and [test](link#30 "Software testing"), and be more suited to [formal verification](link#31 "Formal verification").[note 1](link#32)[note 2](link#33)

Functional programming has its roots in [academia](link#34 "Academia"), evolving from the [lambda calculus](link#35 "Lambda calculus"), a formal system of computation based only on functions. Functional programming has historically been less popular than imperative programming, but many functional languages are seeing use today in industry and education, including [Common Lisp](link#36 "Common Lisp"), [Scheme](link#37 "Scheme (programming language)"),[note 3](link#38)[note 4](link#39)[note 5](link#40)[note 6](link#41) [Clojure](link#42 "Clojure"), [Wolfram Language](link#43 "Wolfram Language"),[note 7](link#44)[note 8](link#45) [Racket](link#46 "Racket (programming language)"),[note 9](link#47) [Erlang](link#48 "Erlang (programming language)"),[note 10](link#49)[note 11](link#50)[note 12](link#51) [Elixir](link#52 "Elixir (programming language)"),[note 13](link#53) [OCaml](link#54 "OCaml"),[note 14](link#55)[note 15](link#56) [Haskell](link#57 "Haskell"),[note 16](link#58)[note 17](link#59) and [F#](link#60 "F Sharp (programming language)").[note 18](link#61)[note 19](link#62) [Lean](link#63 "Lean (proof assistant)") is a functional programming language commonly used for verifying mathematical theorems.[note 20](link#64) Functional programming is also key to some languages that have found success in specific domains, like [JavaScript](link#65 "JavaScript") in the Web,[note 21](link#66) [R](link#67 "R (programming language)") in statistics,[note 22](link#68)[note 23](link#69) [J](link#70 "J (programming language)"), [K](link#71 "K (programming language)") and [Q](link#72 "Q (programming language from Kx Systems)") in financial analysis, and [XQuery](link#73 "XQuery")/ [XSLT](link#74 "XSLT") for [XML](link#75 "XML").[note 24](link#76)[note 25](link#77) Domain-specific declarative languages like [SQL](link#78 "SQL") and [Lex](link#79 "Lex (software)")/ [Yacc](link#80 "Yacc") use some elements of functional programming, such as not allowing [mutable values](link#81 "Mutable object").[note 26](link#82) In addition, many other programming languages support programming in a functional style or have implemented features from functional programming, such as [C++11](link#83 "C++11"), [C#](link#84 "C Sharp (programming language)"),[note 27](link#85) [Kotlin](link#86 "Kotlin (programming language)"),[note 28](link#87) [Perl](link#88 "Perl"),[note 29](link#89) [PHP](link#90 "PHP"),[note 30](link#91) [Python](link#92 "Python (programming language)"),[note 31](link#93) [Go](link#94 "Go (programming language)"),[note 32](link#95) [Rust](link#96 "Rust (programming language)"),[note 33](link#97) [Raku](link#98 "Raku (programming language)"),[note 34](link#99) [Scala](link#100 "Scala (programming language)"),[note 35](link#101) and [Java (since Java 8)](link#102 "Java (programming language)").[note 36](link#103)

## History

\\[ [edit](link#104 "Edit section: History")\\]

The [lambda calculus](link#35 "Lambda calculus"), developed in the 1930s by [Alonzo Church](link#105 "Alonzo Church"), is a [formal system](link#106 "Formal system") of [computation](link#107 "Computation") built from [function application](link#5 "Function application"). In 1937 [Alan Turing](link#108 "Alan Turing") proved that the lambda calculus and [Turing machines](link#109 "Turing machines") are equivalent models of computation,[note 37](link#110) showing that the lambda calculus is [Turing complete](link#111 "Turing complete"). Lambda calculus forms the basis of all functional programming languages. An equivalent theoretical formulation, [combinatory logic](link#112 "Combinatory logic"), was developed by [Moses Schönfinkel](link#113 "Moses Schönfinkel") and [Haskell Curry](link#114 "Haskell Curry") in the 1920s and 1930s.[note 38](link#115)

Church later developed a weaker system, the [simply typed lambda calculus](link#116 "Simply typed lambda calculus"), which extended the lambda calculus by assigning a [data type](link#19 "Data type") to all terms.[note 39](link#117) This forms the basis for statically typed functional programming.

The first [high-level](link#118 "High-level programming language") functional programming language, [Lisp](link#119 "Lisp (programming language)"), was developed in the late 1950s for the [IBM 700/7000 series](link#120 "IBM 700/7000 series") of scientific computers by [John McCarthy](link#121 "John McCarthy (computer scientist)") while at [Massachusetts Institute of Technology](link#122 "Massachusetts Institute of Technology") (MIT).[note 40](link#123) Lisp functions were defined using Church's lambda notation, extended with a label construct to allow [recursive](link#124 "Recursion (computer science)") functions.[note 41](link#125) Lisp first introduced many paradigmatic features of functional programming, though early Lisps were [multi-paradigm languages](link#126 "Programming paradigm"), and incorporated support for numerous programming styles as new paradigms evolved. Later dialects, such as [Scheme](link#37 "Scheme (programming language)") and [Clojure](link#42 "Clojure"), and offshoots such as [Dylan](link#127 "Dylan (programming language)") and [Julia](link#128 "Julia (programming language)"), sought to simplify and rationalise Lisp around a cleanly functional core, while [Common Lisp](link#36 "Common Lisp") was designed to preserve and update the paradigmatic features of the numerous older dialects it replaced.[note 42](link#129)

[Information Processing Language](link#130 "Information Processing Language") (IPL), 1956, is sometimes cited as the first computer-based functional programming language.[note 43](link#131) It is an [assembly-style language](link#132 "Assembly language") for manipulating lists of symbols. It does have a notion of _generator_, which amounts to a function that accepts a function as an argument, and, since it is an assembly-level language, code can be data, so IPL can be regarded as having higher-order functions. However, it relies heavily on the mutating list structure and similar imperative features.

[Kenneth E. Iverson](link#133 "Kenneth E. Iverson") developed [APL](link#134 "APL (programming language)") in the early 1960s, described in his 1962 book _A Programming Language_ ( [ISBN](link#135 "ISBN (identifier)") [9780471430148](link#136 "Special:BookSources/9780471430148")). APL was the primary influence on [John Backus](link#137 "John Backus")'s [FP](link#138 "FP (programming language)"). In the early 1990s, Iverson and [Roger Hui](link#139 "Roger Hui") created [J](link#70 "J (programming language)"). In the mid-1990s, [Arthur Whitney](link#140 "Arthur Whitney (computer scientist)"), who had previously worked with Iverson, created [K](link#71 "K (programming language)"), which is used commercially in financial industries along with its descendant [Q](link#72 "Q (programming language from Kx Systems)").

In the mid-1960s, [Peter Landin](link#141 "Peter Landin") invented [SECD machine](link#142 "SECD machine"),[note 44](link#143) the first [abstract machine](link#144 "Abstract machine") for a functional programming language,[note 45](link#145) described a correspondence between [ALGOL 60](link#146 "ALGOL 60") and the [lambda calculus](link#35 "Lambda calculus"),[note 46](link#147)[note 47](link#148) and proposed the [ISWIM](link#149 "ISWIM") programming language.[note 48](link#150)

[John Backus](link#137 "John Backus") presented [FP](link#138 "FP (programming language)") in his 1977 [Turing Award](link#151 "Turing Award") lecture "Can Programming Be Liberated From the [von Neumann](link#152 "Von Neumann architecture") Style? A Functional Style and its Algebra of Programs".[note 49](link#153) He defines functional programs as being built up in a hierarchical way by means of "combining forms" that allow an "algebra of programs"; in modern language, this means that functional programs follow the [principle of compositionality](link#154 "Principle of compositionality").\\[ _[citation needed](link#155 "Wikipedia:Citation needed")_\\] Backus's paper popularized research into functional programming, though it emphasized [function-level programming](link#156 "Function-level programming") rather than the lambda-calculus style now associated with functional programming.

The 1973 language [ML](link#157 "ML (programming language)") was created by [Robin Milner](link#158 "Robin Milner") at the [University of Edinburgh](link#159 "University of Edinburgh"), and [David Turner](link#160 "David Turner (computer scientist)") developed the language [SASL](link#161 "SASL (programming language)") at the [University of St Andrews](link#162 "University of St Andrews"). Also in Edinburgh in the 1970s, Burstall and Darlington developed the functional language [NPL](link#163 "NPL (programming language)").[note 50](link#164) NPL was based on [Kleene Recursion Equations](link#165 "Kleene's recursion theorem") and was first introduced in their work on program transformation.[note 51](link#166) Burstall, MacQueen and Sannella then incorporated the [polymorphic](link#167 "Polymorphism (computer science)") type checking from ML to produce the language [Hope](link#168 "Hope (programming language)").[note 52](link#169) ML eventually developed into several dialects, the most common of which are now [OCaml](link#54 "OCaml") and [Standard ML](link#170 "Standard ML").

In the 1970s, [Guy L. Steele](link#171 "Guy L. Steele") and [Gerald Jay Sussman](link#172 "Gerald Jay Sussman") developed [Scheme](link#37 "Scheme (programming language)"), as described in the [Lambda Papers](link#173 "Lambda Papers") and the 1985 textbook _[Structure and Interpretation of Computer Programs](link#174 "Structure and Interpretation of Computer Programs")_. Scheme was the first dialect of lisp to use [lexical scoping](link#175 "Lexical scope") and to require [tail-call optimization](link#176 "Tail-call optimization"), features that encourage functional programming.

In the 1980s, [Per Martin-Löf](link#177 "Per Martin-Löf") developed [intuitionistic type theory](link#178 "Intuitionistic type theory") (also called _constructive_ type theory), which associated functional programs with [constructive proofs](link#179 "Constructive proof") expressed as [dependent types](link#180 "Dependent type"). This led to new approaches to [interactive theorem proving](link#181 "Interactive theorem proving") and has influenced the development of subsequent functional programming languages.\\[ _[citation needed](link#155 "Wikipedia:Citation needed")_\\]

The lazy functional language, [Miranda](link#182 "Miranda (programming language)"), developed by David Turner, initially appeared in 1985 and had a strong influence on [Haskell](link#57 "Haskell"). With Miranda being proprietary, Haskell began with a consensus in 1987 to form an [open standard](link#183 "Open standard") for functional programming research; implementation releases have been ongoing as of 1990.

More recently it has found use in niches such as parametric [CAD](link#184 "Computer Aided Design") in the [OpenSCAD](link#185 "OpenSCAD") language built on the [CGAL](link#186 "CGAL") framework, although its restriction on reassigning values (all values are treated as constants) has led to confusion among users who are unfamiliar with functional programming as a concept.[note 53](link#187)

Functional programming continues to be used in commercial settings.[note 54](link#188)[note 55](link#189)[note 56](link#190)

## Concepts

\\[ [edit](link#191 "Edit section: Concepts")\\]

A number of concepts[note 57](link#192) and paradigms are specific to functional programming, and generally foreign to [imperative programming](link#12 "Imperative programming") (including [object-oriented programming](link#193 "Object-oriented programming")). However, programming languages often cater to several programming paradigms, so programmers using "mostly imperative" languages may have utilized some of these concepts.[note 58](link#194)

### First-class and higher-order functions

\\[ [edit](link#195 "Edit section: First-class and higher-order functions")\\]

Main articles: [First-class function](link#196 "First-class function") and [Higher-order function](link#197 "Higher-order function")

[Higher-order functions](link#197 "Higher-order function") are functions that can either take other functions as arguments or return them as results. In calculus, an example of a higher-order function is the [differential operator](link#198 "Differential operator")d/dx{\\\\displaystyle d/dx}![{\\displaystyle d/dx}](image#2), which returns the [derivative](link#199 "Derivative") of a function f{\\\\displaystyle f}![{\\displaystyle f}](image#3).

Higher-order functions are closely related to [first-class functions](link#196 "First-class function") in that higher-order functions and first-class functions both allow functions as arguments and results of other functions. The distinction between the two is subtle: "higher-order" describes a mathematical concept of functions that operate on other functions, while "first-class" is a computer science term for programming language entities that have no restriction on their use (thus first-class functions can appear anywhere in the program that other first-class entities like numbers can, including as arguments to other functions and as their return values).

Higher-order functions enable [partial application](link#200 "Partial application") or [currying](link#201 "Currying"), a technique that applies a function to its arguments one at a time, with each application returning a new function that accepts the next argument. This lets a programmer succinctly express, for example, the [successor function](link#202 "Successor function") as the addition operator partially applied to the [natural number](link#203 "Natural number") one.

### Pure functions

\\[ [edit](link#204 "Edit section: Pure functions")\\]

Main article: [Pure function](link#25 "Pure function")

[Pure functions](link#25 "Pure function") (or expressions) have no [side effects](link#26 "Side effect (computer science)") (memory or I/O). This means that pure functions have several useful properties, many of which can be used to optimize the code:

- If the result of a pure expression is not used, it can be removed without affecting other expressions.
- If a pure function is called with arguments that cause no side-effects, the result is constant with respect to that argument list (sometimes called [referential transparency](link#205 "Referential transparency") or [idempotence](link#206 "Idempotence")), i.e., calling the pure function again with the same arguments returns the same result. (This can enable caching optimizations such as [memoization](link#207 "Memoization").)
- If there is no data dependency between two pure expressions, their order can be reversed, or they can be performed in [parallel](link#208 "Parallelization") and they cannot interfere with one another (in other terms, the evaluation of any pure expression is [thread-safe](link#209 "Thread-safe")).
- If the entire language does not allow side-effects, then any evaluation strategy can be used; this gives the compiler freedom to reorder or combine the evaluation of expressions in a program (for example, using [deforestation](link#210 "Deforestation (computer science)")).

While most compilers for imperative programming languages detect pure functions and perform common-subexpression elimination for pure function calls, they cannot always do this for pre-compiled libraries, which generally do not expose this information, thus preventing optimizations that involve those external functions. Some compilers, such as [gcc](link#211 "GNU Compiler Collection"), add extra keywords for a programmer to explicitly mark external functions as pure, to enable such optimizations. [Fortran 95](link#212 "Fortran 95") also lets functions be designated _pure_.[note 59](link#213) C++11 added \`constexpr\` keyword with similar semantics.

### Recursion

\\[ [edit](link#214 "Edit section: Recursion")\\]

Main article: [Recursion (computer science)](link#124 "Recursion (computer science)")

[Iteration](link#215 "Iteration") (looping) in functional languages is usually accomplished via [recursion](link#216 "Recursion"). [Recursive functions](link#124 "Recursion (computer science)") invoke themselves, letting an operation be repeated until it reaches the [base case](link#124 "Recursion (computer science)"). In general, recursion requires maintaining a [stack](link#217 "Call stack"), which consumes space in a linear amount to the depth of recursion. This could make recursion prohibitively expensive to use instead of imperative loops. However, a special form of recursion known as [tail recursion](link#218 "Tail recursion") can be recognized and optimized by a compiler into the same code used to implement iteration in imperative languages. Tail recursion optimization can be implemented by transforming the program into [continuation passing style](link#219 "Continuation passing style") during compiling, among other approaches.

The [Scheme](link#37 "Scheme (programming language)") language standard requires implementations to support proper tail recursion, meaning they must allow an unbounded number of active tail calls.[note 60](link#220)[note 61](link#221) Proper tail recursion is not simply an optimization; it is a language feature that assures users that they can use recursion to express a loop and doing so would be safe-for-space.[note 62](link#222) Moreover, contrary to its name, it accounts for all tail calls, not just tail recursion. While proper tail recursion is usually implemented by turning code into imperative loops, implementations might implement it in other ways. For example, [Chicken](link#223 "Chicken (Scheme implementation)") intentionally maintains a stack and lets the [stack overflow](link#224 "Stack overflow"). However, when this happens, its [garbage collector](link#225 "Garbage collection (computer science)") will claim space back,[note 63](link#226) allowing an unbounded number of active tail calls even though it does not turn tail recursion into a loop.

Common patterns of recursion can be abstracted away using higher-order functions, with [catamorphisms](link#227 "Catamorphism") and [anamorphisms](link#228 "Anamorphism") (or "folds" and "unfolds") being the most obvious examples. Such recursion schemes play a role analogous to built-in control structures such as [loops](link#229 "Program loops") in [imperative languages](link#230 "Imperative languages").

Most general purpose functional programming languages allow unrestricted recursion and are [Turing complete](link#111 "Turing complete"), which makes the [halting problem](link#231 "Halting problem") [undecidable](link#232 "Undecidable problem"), can cause unsoundness of [equational reasoning](link#233 "Equational reasoning"), and generally requires the introduction of [inconsistency](link#234 "Inconsistency") into the logic expressed by the language's [type system](link#235 "Type system"). Some special purpose languages such as [Coq](link#236 "Coq (software)") allow only [well-founded](link#237 "Well-founded") recursion and are [strongly normalizing](link#238 "Strongly normalizing") (nonterminating computations can be expressed only with infinite streams of values called [codata](link#239 "Codata (computer science)")). As a consequence, these languages fail to be Turing complete and expressing certain functions in them is impossible, but they can still express a wide class of interesting computations while avoiding the problems introduced by unrestricted recursion. Functional programming limited to well-founded recursion with a few other constraints is called [total functional programming](link#240 "Total functional programming").[note 64](link#241)

### Strict versus non-strict evaluation

\\[ [edit](link#242 "Edit section: Strict versus non-strict evaluation")\\]

Main article: [Evaluation strategy](link#243 "Evaluation strategy")

Functional languages can be categorized by whether they use _strict (eager)_ or _non-strict (lazy)_ evaluation, concepts that refer to how function arguments are processed when an expression is being evaluated. The technical difference is in the [denotational semantics](link#244 "Denotational semantics") of expressions containing failing or divergent computations. Under strict evaluation, the evaluation of any term containing a failing subterm fails. For example, the expression:

\`\`\`
print length([2+1, 3*2, 1/0, 5-4])

\`\`\`

fails under strict evaluation because of the division by zero in the third element of the list. Under lazy evaluation, the length function returns the value 4 (i.e., the number of items in the list), since evaluating it does not attempt to evaluate the terms making up the list. In brief, strict evaluation always fully evaluates function arguments before invoking the function. Lazy evaluation does not evaluate function arguments unless their values are required to evaluate the function call itself.

The usual implementation strategy for lazy evaluation in functional languages is [graph reduction](link#245 "Graph reduction").[note 65](link#246) Lazy evaluation is used by default in several pure functional languages, including [Miranda](link#182 "Miranda (programming language)"), [Clean](link#247 "Clean (programming language)"), and [Haskell](link#57 "Haskell").

[Hughes 1984](link#248) argues for lazy evaluation as a mechanism for improving program modularity through [separation of concerns](link#249 "Separation of concerns"), by easing independent implementation of producers and consumers of data streams.[note 2](link#33) Launchbury 1993 describes some difficulties that lazy evaluation introduces, particularly in analyzing a program's storage requirements, and proposes an [operational semantics](link#250 "Operational semantics") to aid in such analysis.[note 66](link#251) Harper 2009 proposes including both strict and lazy evaluation in the same language, using the language's type system to distinguish them.[note 67](link#252)

### Type systems

\\[ [edit](link#253 "Edit section: Type systems")\\]

Main article: [Type system](link#235 "Type system")

Especially since the development of [Hindley–Milner type inference](link#254 "Hindley–Milner type inference") in the 1970s, functional programming languages have tended to use [typed lambda calculus](link#255 "Typed lambda calculus"), rejecting all invalid programs at compilation time and risking [false positive errors](link#256 "False positives and false negatives"), as opposed to the [untyped lambda calculus](link#257 "Untyped lambda calculus"), that accepts all valid programs at compilation time and risks [false negative errors](link#258 "False positives and false negatives"), used in Lisp and its variants (such as [Scheme](link#37 "Scheme (programming language)")), as they reject all invalid programs at runtime when the information is enough to not reject valid programs. The use of [algebraic data types](link#259 "Algebraic data type") makes manipulation of complex data structures convenient; the presence of strong compile-time type checking makes programs more reliable in absence of other reliability techniques like [test-driven development](link#260 "Test-driven development"), while [type inference](link#261 "Type inference") frees the programmer from the need to manually declare types to the compiler in most cases.

Some research-oriented functional languages such as [Coq](link#236 "Coq (software)"), [Agda](link#262 "Agda (programming language)"), [Cayenne](link#263 "Lennart Augustsson"), and [Epigram](link#264 "Epigram (programming language)") are based on [intuitionistic type theory](link#178 "Intuitionistic type theory"), which lets types depend on terms. Such types are called [dependent types](link#180 "Dependent type"). These type systems do not have decidable type inference and are difficult to understand and program with.[note 68](link#265)[note 69](link#266)[note 70](link#267)[note 71](link#268) But dependent types can express arbitrary propositions in [higher-order logic](link#269 "Higher-order logic"). Through the [Curry–Howard isomorphism](link#270 "Curry–Howard isomorphism"), then, well-typed programs in these languages become a means of writing formal [mathematical proofs](link#271 "Mathematical proof") from which a compiler can generate [certified code](link#31 "Formal verification"). While these languages are mainly of interest in academic research (including in [formalized mathematics](link#272 "Formalized mathematics")), they have begun to be used in engineering as well. [Compcert](link#273 "Compcert") is a [compiler](link#274 "Compiler") for a subset of the language [C](link#275 "C (programming language)") that is written in Coq and formally verified.[note 72](link#276)

A limited form of dependent types called [generalized algebraic data types](link#277 "Generalized algebraic data type") (GADT's) can be implemented in a way that provides some of the benefits of dependently typed programming while avoiding most of its inconvenience.[note 73](link#278) GADT's are available in the [Glasgow Haskell Compiler](link#279 "Glasgow Haskell Compiler"), in [OCaml](link#54 "OCaml")[note 74](link#280) and in [Scala](link#100 "Scala (programming language)"),[note 75](link#281) and have been proposed as additions to other languages including Java and C#.[note 76](link#282)

### Referential transparency

\\[ [edit](link#283 "Edit section: Referential transparency")\\]

Main article: [Referential transparency](link#205 "Referential transparency")

Functional programs do not have assignment statements, that is, the value of a variable in a functional program never changes once defined. This eliminates any chances of side effects because any variable can be replaced with its actual value at any point of execution. So, functional programs are referentially transparent.[note 77](link#284)

Consider [C](link#275 "C (programming language)") assignment statement \`x=x*10\`, this changes the value assigned to the variable \`x\`. Let us say that the initial value of \`x\` was \`1\`, then two consecutive evaluations of the variable \`x\` yields \`10\` and \`100\` respectively. Clearly, replacing \`x=x*10\` with either \`10\` or \`100\` gives a program a different meaning, and so the expression _is not_ referentially transparent. In fact, assignment statements are never referentially transparent.

Now, consider another function such as \`int plusone(int x) {return x+1;}\` _is_ transparent, as it does not implicitly change the input x and thus has no such [side effects](link#26 "Side effect (computer science)").
Functional programs exclusively use this type of function and are therefore referentially transparent.

### Data structures

\\[ [edit](link#285 "Edit section: Data structures")\\]

Main article: [Purely functional data structure](link#286 "Purely functional data structure")

Purely functional [data structures](link#287 "Data structure") are often represented in a different way to their [imperative](link#12 "Imperative programming") counterparts.[note 78](link#288) For example, the [array](link#289 "Array data structure") with constant access and update times is a basic component of most imperative languages, and many imperative data-structures, such as the [hash table](link#290 "Hash table") and [binary heap](link#291 "Binary heap"), are based on arrays. Arrays can be replaced by [maps](link#292 "Map (computer science)") or random access lists, which admit purely functional implementation, but have [logarithmic](link#293 "Logarithm") access and update times. Purely functional data structures have [persistence](link#294 "Persistent data structure"), a property of keeping previous versions of the data structure unmodified. In Clojure, persistent data structures are used as functional alternatives to their imperative counterparts. Persistent vectors, for example, use trees for partial updating. Calling the insert method will result in some but not all nodes being created.[note 79](link#295)

## Comparison to imperative programming

\\[ [edit](link#296 "Edit section: Comparison to imperative programming")\\]

Functional programming is very different from [imperative programming](link#12 "Imperative programming"). The most significant differences stem from the fact that functional programming avoids [side effects](link#26 "Side effect (computer science)"), which are used in imperative programming to implement state and I/O. Pure functional programming completely prevents side-effects and provides referential transparency.

Higher-order functions are rarely used in older imperative programming. A traditional imperative program might use a loop to traverse and modify a list. A functional program, on the other hand, would probably use a higher-order "map" function that takes a function and a list, generating and returning a new list by applying the function to each list item.

### Imperative vs. functional programming

\\[ [edit](link#297 "Edit section: Imperative vs. functional programming")\\]

The following two examples (written in [JavaScript](link#65 "JavaScript")) achieve the same effect: they multiply all even numbers in an array by 10 and add them all, storing the final sum in the variable \`result\`.

Traditional imperative loop:

\`\`\`
const numList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let result = 0;
for (let i = 0; i < numList.length; i++) {
  if (numList[i] % 2 === 0) {
    result += numList[i] * 10;
  }
}

\`\`\`

Functional programming with higher-order functions:

\`\`\`
const result = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
               .filter(n => n % 2 === 0)
               .map(a => a * 10)
               .reduce((a, b) => a + b, 0);

\`\`\`

Sometimes the abstractions offered by functional programming might lead to development of more robust code that avoids certain issues that might arise when building upon large amount of complex, imperative code, such as [off-by-one errors](link#298 "Off-by-one error") (see [Greenspun's tenth rule](link#299 "Greenspun's tenth rule")).

### Simulating state

\\[ [edit](link#300 "Edit section: Simulating state")\\]

There are tasks (for example, maintaining a bank account balance) that often seem most naturally implemented with state. Pure functional programming performs these tasks, and I/O tasks such as accepting user input and printing to the screen, in a different way.

The pure functional programming language [Haskell](link#57 "Haskell") implements them using [monads](link#301 "Monad (functional programming)"), derived from [category theory](link#302 "Category theory").[note 80](link#303) Monads offer a way to abstract certain types of computational patterns, including (but not limited to) modeling of computations with mutable state (and other side effects such as I/O) in an imperative manner without losing purity. While existing monads may be easy to apply in a program, given appropriate templates and examples, many students find them difficult to understand conceptually, e.g., when asked to define new monads (which is sometimes needed for certain types of libraries).[note 81](link#304)

Functional languages also simulate states by passing around immutable states. This can be done by making a function accept the state as one of its parameters, and return a new state together with the result, leaving the old state unchanged.[note 82](link#305)

Impure functional languages usually include a more direct method of managing mutable state. [Clojure](link#42 "Clojure"), for example, uses managed references that can be updated by applying pure functions to the current state. This kind of approach enables mutability while still promoting the use of pure functions as the preferred way to express computations.\\[ _[citation needed](link#155 "Wikipedia:Citation needed")_\\]

Alternative methods such as [Hoare logic](link#306 "Hoare logic") and [uniqueness](link#307 "Uniqueness type") have been developed to track side effects in programs. Some modern research languages use [effect systems](link#308 "Effect system") to make the presence of side effects explicit.[note 83](link#309)

### Efficiency issues

\\[ [edit](link#310 "Edit section: Efficiency issues")\\]

Functional programming languages are typically less efficient in their use of [CPU](link#311 "Central processing unit") and memory than imperative languages such as [C](link#275 "C (programming language)") and [Pascal](link#312 "Pascal (programming language)").[note 84](link#313) This is related to the fact that some mutable data structures like arrays have a very straightforward implementation using present hardware. Flat arrays may be accessed very efficiently with deeply pipelined CPUs, prefetched efficiently through caches (with no complex [pointer chasing](link#314 "Pointer chasing (page does not exist)")), or handled with SIMD instructions. It is also not easy to create their equally efficient general-purpose immutable counterparts. For purely functional languages, the worst-case slowdown is logarithmic in the number of memory cells used, because mutable memory can be represented by a purely functional data structure with logarithmic access time (such as a balanced tree).[note 85](link#315) However, such slowdowns are not universal. For programs that perform intensive numerical computations, functional languages such as [OCaml](link#54 "OCaml") and [Clean](link#247 "Clean (programming language)") are only slightly slower than C according to [The Computer Language Benchmarks Game](link#316 "The Computer Language Benchmarks Game").[note 86](link#317) For programs that handle large [matrices](link#318 "Matrix (mathematics)") and multidimensional [databases](link#319 "Database"), [array](link#320 "Array programming") functional languages (such as [J](link#70 "J (programming language)") and [K](link#71 "K (programming language)")) were designed with speed optimizations.

Immutability of data can in many cases lead to execution efficiency by allowing the compiler to make assumptions that are unsafe in an imperative language, thus increasing opportunities for [inline expansion](link#321 "Inline expansion").[note 87](link#322) Even if the involved copying that may seem implicit when dealing with persistent immutable data structures might seem computationally costly, some functional programming languages, like [Clojure](link#42 "Clojure") solve this issue by implementing mechanisms for safe memory sharing between _formally_ _immutable_ data.[note 88](link#323) [Rust](link#96 "Rust (programming language)") distinguishes itself by its approach to data immutability which involves immutable [references](link#324 "Reference (computer science)")[note 89](link#325) and a concept called _lifetimes._[note 90](link#326)

Immutable data with separation of identity and state and [shared-nothing](link#327 "Shared-nothing architecture") schemes can also potentially be more well-suited for [concurrent and parallel](link#328 "Parallel computing") programming by the virtue of reducing or eliminating the risk of certain concurrency hazards, since concurrent operations are usually [atomic](link#329 "Linearizability") and this allows eliminating the need for locks. This is how for example \`java.util.concurrent\` classes are implemented, where some of them are immutable variants of the corresponding classes that are not suitable for concurrent use.[note 91](link#330) Functional programming languages often have a concurrency model that instead of shared state and synchronization, leverages [message passing](link#331 "Message passing") mechanisms (such as the [actor model](link#332 "Actor model"), where each actor is a container for state, behavior, child actors and a message queue).[note 92](link#333)[note 93](link#334) This approach is common in [Erlang](link#48 "Erlang (programming language)")/ [Elixir](link#52 "Elixir (programming language)") or [Akka](link#335 "Akka (toolkit)").

[Lazy evaluation](link#336 "Lazy evaluation") may also speed up the program, even asymptotically, whereas it may slow it down at most by a constant factor (however, it may introduce [memory leaks](link#337 "Memory leak") if used improperly). Launchbury 1993[note 66](link#251) discusses theoretical issues related to memory leaks from lazy evaluation, and O'Sullivan _et al._ 2008[note 94](link#338) give some practical advice for analyzing and fixing them.
However, the most general implementations of lazy evaluation making extensive use of dereferenced code and data perform poorly on modern processors with deep pipelines and multi-level caches (where a cache miss may cost hundreds of cycles) \\[ _[citation needed](link#155 "Wikipedia:Citation needed")_\\].

#### Abstraction cost

\\[ [edit](link#339 "Edit section: Abstraction cost")\\]

Some functional programming languages might not optimize abstractions such as higher order functions like " [map](link#340 "Map (higher-order function)")" or " [filter](link#341 "Filter (higher-order function)")" as efficiently as the underlying imperative operations. Consider, as an example, the following two ways to check if 5 is an even number in [Clojure](link#42 "Clojure"):

\`\`\`
(even? 5)
(.equals (mod 5 2) 0)

\`\`\`

When [benchmarked](link#342 "Benchmarking") using the [Criterium](link#343) tool on a [Ryzen 7900X](link#344 "Zen 3") GNU/Linux PC in a [Leiningen](link#345 "Leiningen (software)") [REPL](link#346 "REPL") 2.11.2, running on [Java VM](link#347 "JVM") version 22 and Clojure version 1.11.1, the first implementation, which is implemented as:

\`\`\`
(defn even?
  "Returns true if n is even, throws an exception if n is not an integer"
  {:added "1.0"
   :static true}
   [n] (if (integer? n)
        (zero? (bit-and (clojure.lang.RT/uncheckedLongCast n) 1))
        (throw (IllegalArgumentException. (str "Argument must be an integer: " n)))))

\`\`\`

has the mean execution time of 4.76 ms, while the second one, in which \`.equals\` is a direct invocation of the underlying [Java](link#102 "Java (programming language)") method, has a mean execution time of 2.8 μs – roughly 1700 times faster. Part of that can be attributed to the type checking and exception handling involved in the implementation of \`even?\`. For instance the [lo library](link#348) for [Go](link#94 "Go (programming language)"), which implements various higher-order functions common in functional programming languages using [generics](link#349 "Generic programming"). In a benchmark provided by the library's author, calling \`map\` is 4% slower than an equivalent \`for\` loop and has the same [allocation](link#350 "Memory management") profile,[note 95](link#351) which can be attributed to various compiler optimizations, such as [inlining](link#352 "Inlining").[note 96](link#353)

One distinguishing feature of [Rust](link#96 "Rust (programming language)") are _zero-cost abstractions_. This means that using them imposes no additional runtime overhead. This is achieved thanks to the compiler using [loop unrolling](link#354 "Loop unrolling"), where each iteration of a loop, be it imperative or using iterators, is converted into a standalone [Assembly](link#132 "Assembly language") instruction, without the overhead of the loop controlling code. If an iterative operation writes to an array, the resulting array's elements [will be stored in specific CPU registers](link#355 "Register allocation"), allowing for [constant-time access](link#356 "Time complexity") at runtime.[note 97](link#357)

### Functional programming in non-functional languages

\\[ [edit](link#358 "Edit section: Functional programming in non-functional languages")\\]

It is possible to use a functional style of programming in languages that are not traditionally considered functional languages.[note 98](link#359) For example, both [D](link#360 "D (programming language)")[note 99](link#361) and [Fortran 95](link#212 "Fortran 95")[note 59](link#213) explicitly support pure functions.

[JavaScript](link#65 "JavaScript"), [Lua](link#362 "Lua (programming language)"),[note 100](link#363) [Python](link#92 "Python (programming language)") and [Go](link#94 "Go (programming language)")[note 101](link#364) had [first class functions](link#196 "First-class function") from their inception.[note 102](link#365) Python had support for " [lambda](link#366 "Anonymous function")", " [map](link#340 "Map (higher-order function)")", " [reduce](link#367 "Fold (higher-order function)")", and " [filter](link#341 "Filter (higher-order function)")" in 1994, as well as closures in Python 2.2,[note 103](link#368) though Python 3 relegated "reduce" to the \`functools\` standard library module.[note 104](link#369) First-class functions have been introduced into other mainstream languages such as [Perl](link#88 "Perl") 5.0 in 1994, [PHP](link#90 "PHP") 5.3, [Visual Basic 9](link#370 "Visual Basic 9"), [C#](link#84 "C Sharp (programming language)") 3.0, [C++11](link#83 "C++11"), and [Kotlin](link#86 "Kotlin (programming language)").[note 28](link#87)\\[ _[citation needed](link#155 "Wikipedia:Citation needed")_\\]

In Perl, [lambda](link#366 "Anonymous function"), [map](link#340 "Map (higher-order function)"), [reduce](link#367 "Fold (higher-order function)"), [filter](link#341 "Filter (higher-order function)"), and [closures](link#371 "Closure (computer science)") are fully supported and frequently used. The book [Higher-Order Perl](link#372 "Higher-Order Perl"), released in 2005, was written to provide an expansive guide on using Perl for functional programming.

In PHP, [anonymous classes](link#373 "Anonymous class"), [closures](link#371 "Closure (computer science)") and lambdas are fully supported. Libraries and language extensions for immutable data structures are being developed to aid programming in the functional style.

In [Java](link#102 "Java (programming language)"), anonymous classes can sometimes be used to simulate closures;[note 105](link#374) however, anonymous classes are not always proper replacements to closures because they have more limited capabilities.[note 106](link#375) Java 8 supports lambda expressions as a replacement for some anonymous classes.[note 107](link#376)

In [C#](link#84 "C Sharp (programming language)"), anonymous classes are not necessary, because closures and lambdas are fully supported. Libraries and language extensions for immutable data structures are being developed to aid programming in the functional style in C#.

Many [object-oriented](link#377 "Object-oriented") [design patterns](link#378 "Design pattern (computer science)") are expressible in functional programming terms: for example, the [strategy pattern](link#379 "Strategy pattern") simply dictates use of a higher-order function, and the [visitor](link#380 "Visitor (design pattern)") pattern roughly corresponds to a [catamorphism](link#227 "Catamorphism"), or [fold](link#367 "Fold (higher-order function)").

Similarly, the idea of immutable data from functional programming is often included in imperative programming languages,[note 108](link#381) for example the tuple in Python, which is an immutable array, and Object.freeze() in JavaScript.[note 109](link#382)

## Comparison to logic programming

\\[ [edit](link#383 "Edit section: Comparison to logic programming")\\]

[Logic programming](link#384 "Logic programming") can be viewed as a generalisation of functional programming, in which functions are a special case of relations.[note 110](link#385)
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

However, the difference between the two representations is simply syntactic. In [Ciao](link#386 "Ciao (programming language)") Prolog, relations can be nested, like functions in functional programming:[note 111](link#387)

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

\\[ [edit](link#388 "Edit section: Applications")\\]

### Text editors

\\[ [edit](link#389 "Edit section: Text editors")\\]

[Emacs](link#390 "Emacs"), a highly extensible text editor family uses its own [Lisp dialect](link#391 "Emacs Lisp") for writing plugins. The original author of the most popular Emacs implementation, [GNU Emacs](link#392 "GNU Emacs") and Emacs Lisp, [Richard Stallman](link#393 "Richard Stallman") considers Lisp one of his favorite programming languages.[note 112](link#394)

[Helix](link#395 "Helix (text editor) (page does not exist)"), since version 24.03 supports previewing [AST](link#396 "Abstract syntax tree") as [S-expressions](link#397 "S-expression"), which are also the core feature of the Lisp programming language family.[note 113](link#398)

### Spreadsheets

\\[ [edit](link#399 "Edit section: Spreadsheets")\\]

[Spreadsheets](link#400 "Spreadsheet") can be considered a form of pure, [zeroth-order](link#197 "Higher-order function"), strict-evaluation functional programming system.[note 114](link#401) However, spreadsheets generally lack higher-order functions as well as code reuse, and in some implementations, also lack recursion. Several extensions have been developed for spreadsheet programs to enable higher-order and reusable functions, but so far remain primarily academic in nature.[note 115](link#402)

### Microservices

\\[ [edit](link#403 "Edit section: Microservices")\\]

Due to their [composability](link#20 "Composability"), functional programming paradigms can be suitable for [microservices](link#404 "Microservices")-based architectures.[note 116](link#405)

### Academia

\\[ [edit](link#406 "Edit section: Academia")\\]

Functional programming is an active area of research in the field of [programming language theory](link#407 "Programming language theory"). There are several [peer-reviewed](link#408 "Peer-review") publication venues focusing on functional programming, including the [International Conference on Functional Programming](link#409 "International Conference on Functional Programming"), the [Journal of Functional Programming](link#410 "Journal of Functional Programming"), and the [Symposium on Trends in Functional Programming](link#411 "Symposium on Trends in Functional Programming").

### Industry

\\[ [edit](link#412 "Edit section: Industry")\\]

Functional programming has been employed in a wide range of industrial applications. For example, [Erlang](link#48 "Erlang (programming language)"), which was developed by the [Swedish](link#413 "Sweden") company [Ericsson](link#414 "Ericsson") in the late 1980s, was originally used to implement [fault-tolerant](link#415 "Fault tolerance") [telecommunications](link#416 "Telecommunications") systems,[note 11](link#50) but has since become popular for building a range of applications at companies such as [Nortel](link#417 "Nortel"), [Facebook](link#418 "Facebook"), [Électricité de France](link#419 "Électricité de France") and [WhatsApp](link#420 "WhatsApp").[note 10](link#49)[note 12](link#51)[note 117](link#421)[note 118](link#422)[note 119](link#423) [Scheme](link#37 "Scheme (programming language)"), a dialect of [Lisp](link#119 "Lisp (programming language)"), was used as the basis for several applications on early [Apple Macintosh](link#424 "Apple Macintosh") computers[note 3](link#38)[note 4](link#39) and has been applied to problems such as training- [simulation software](link#425 "Computer simulation")[note 5](link#40) and [telescope](link#426 "Telescope") control.[note 6](link#41) [OCaml](link#54 "OCaml"), which was introduced in the mid-1990s, has seen commercial use in areas such as financial analysis,[note 14](link#55) [driver](link#427 "Software driver") verification, industrial [robot](link#428 "Robot") programming and static analysis of [embedded software](link#429 "Embedded software").[note 15](link#56) [Haskell](link#57 "Haskell"), though initially intended as a research language,[note 17](link#59) has also been applied in areas such as aerospace systems, hardware design and web programming.[note 16](link#58)[note 17](link#59)

Other functional programming languages that have seen use in industry include [Scala](link#100 "Scala (programming language)"),[note 120](link#430) [F#](link#60 "F Sharp (programming language)"),[note 18](link#61)[note 19](link#62) [Wolfram Language](link#43 "Wolfram Language"),[note 7](link#44) [Lisp](link#119 "Lisp (programming language)"),[note 121](link#431) [Standard ML](link#170 "Standard ML")[note 122](link#432)[note 123](link#433) and Clojure.[note 124](link#434) Scala has been widely used in [Data science](link#435 "Data science"),[note 125](link#436) while [ClojureScript](link#437 "ClojureScript"),[note 126](link#438) [Elm](link#439 "Elm (programming language)")[note 127](link#440) or [PureScript](link#441 "PureScript")[note 128](link#442) are some of the functional frontend programming languages used in production. [Elixir](link#52 "Elixir (programming language)")'s Phoenix framework is also used by some relatively popular commercial projects, such as [Font Awesome](link#443 "Font Awesome") or [Allegro](link#444 "Allegro Platform") (one of the biggest e-commerce platforms in Poland)[note 129](link#445)'s classified ads platform _Allegro Lokalnie._[note 130](link#446)

Functional "platforms" have been popular in finance for risk analytics (particularly with large investment banks). Risk factors are coded as functions that form interdependent graphs (categories) to measure correlations in market shifts, similar in manner to [Gröbner basis](link#447 "Gröbner basis") optimizations but also for regulatory frameworks such as [Comprehensive Capital Analysis and Review](link#448 "Comprehensive Capital Analysis and Review"). Given the use of OCaml and [Caml](link#449 "Caml") variations in finance, these systems are sometimes considered related to a [categorical abstract machine](link#450 "Categorical abstract machine"). Functional programming is heavily influenced by [category theory](link#302 "Category theory").\\[ _[citation needed](link#155 "Wikipedia:Citation needed")_\\]

### Education

\\[ [edit](link#451 "Edit section: Education")\\]

Many [universities](link#452 "University") teach functional programming.[note 131](link#453)[note 132](link#454)[note 133](link#455)[note 134](link#456) Some treat it as an introductory programming concept[note 134](link#456) while others first teach imperative programming methods.[note 133](link#455)[note 135](link#457)

Outside of computer science, functional programming is used to teach problem-solving, algebraic and geometric concepts.[note 136](link#458) It has also been used to teach classical mechanics, as in the book _[Structure and Interpretation of Classical Mechanics](link#459 "Structure and Interpretation of Classical Mechanics")_.

In particular, [Scheme](link#37 "Scheme (programming language)") has been a relatively popular choice for teaching programming for years.[note 137](link#460)[note 138](link#461)

## See also

\\[ [edit](link#462 "Edit section: See also")\\]

- [![icon](https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Octicons-terminal.svg/60px-Octicons-terminal.svg.png)](https://en.wikipedia.org/wiki/File:Octicons-terminal.svg)[Computer programming portal](link#463 "Portal:Computer programming")

- [Eager evaluation](link#464 "Eager evaluation")
- [Functional reactive programming](link#465 "Functional reactive programming")
- [Inductive functional programming](link#466 "Inductive functional programming")
- [List of functional programming languages](link#467 "List of functional programming languages")
- [List of functional programming topics](link#468 "List of functional programming topics")
- [Nested function](link#469 "Nested function")
- [Purely functional programming](link#22 "Purely functional programming")

## Notes and references

\\[ [edit](link#470 "Edit section: Notes and references")\\]

001. **[^](link#471 "Jump up")**[Hudak, Paul](link#472 "Paul Hudak") (September 1989). ["Conception, evolution, and application of functional programming languages"](https://web.archive.org/web/20160131083528/http://www.dbnet.ece.ntua.gr/~adamo/languages/books/p359-hudak.pdf)(PDF). _ACM Computing Surveys_. **21** (3): 359–411\\. [doi](link#474 "Doi (identifier)"): [10.1145/72551.72554](link#475). [S2CID](link#476 "S2CID (identifier)") [207637854](link#477). Archived from [the original](http://www.dbnet.ece.ntua.gr/~adamo/languages/books/p359-hudak.pdf)(PDF) on 2016-01-31. Retrieved 2013-08-10.
002. ^ [Jump up to: _**a**_](link#479) [_**b**_](link#480)[Hughes, John](link#481 "John Hughes (computer scientist)") (1984). ["Why Functional Programming Matters"](link#482).
003. ^ [Jump up to: _**a**_](link#483) [_**b**_](link#484)Clinger, Will (1987). ["MultiTasking and MacScheme"](link#485). _MacTech_. **3** (12). Retrieved 2008-08-28.
004. ^ [Jump up to: _**a**_](link#486) [_**b**_](link#487)Hartheimer, Anne (1987). ["Programming a Text Editor in MacScheme+Toolsmith"](link#488). _MacTech_. **3** (1). Archived from [the original](link#489) on 2011-06-29. Retrieved 2008-08-28.
005. ^ [Jump up to: _**a**_](link#490) [_**b**_](link#491)Kidd, Eric. [_Terrorism Response Training in Scheme_](link#492). CUFP 2007. Archived from [the original](link#493) on 2010-12-21. Retrieved 2009-08-26.
006. ^ [Jump up to: _**a**_](link#494) [_**b**_](link#495)Cleis, Richard. [_Scheme in Space_](link#496). CUFP 2006. Archived from [the original](link#497) on 2010-05-27. Retrieved 2009-08-26.
007. ^ [Jump up to: _**a**_](link#498) [_**b**_](link#499)["Wolfram Language Guide: Functional Programming"](link#500). 2015. Retrieved 2015-08-24.
008. **[^](link#501 "Jump up")**["Functional vs. Procedural Programming Language"](link#502). _Department of Applied Math_. University of Colorado. Archived from [the original](link#503) on 2007-11-13. Retrieved 2006-08-28.
009. **[^](link#504 "Jump up")**["State-Based Scripting in Uncharted 2"](https://web.archive.org/web/20121215014637/http://www.gameenginebook.com/gdc09-statescripting-uncharted2.pdf)(PDF). Archived from [the original](http://www.gameenginebook.com/gdc09-statescripting-uncharted2.pdf)(PDF) on 2012-12-15. Retrieved 2011-08-08.
010. ^ [Jump up to: _**a**_](link#507) [_**b**_](link#508)["Who uses Erlang for product development?"](link#509). _Frequently asked questions about Erlang_. Retrieved 2018-04-27.
011. ^ [Jump up to: _**a**_](link#510) [_**b**_](link#511)Armstrong, Joe (June 2007). "A history of Erlang". _Proceedings of the third ACM SIGPLAN conference on History of programming languages_. Third ACM SIGPLAN Conference on History of Programming Languages. San Diego, California. [doi](link#474 "Doi (identifier)"): [10.1145/1238844.1238850](link#512). [ISBN](link#135 "ISBN (identifier)") [9781595937667](link#513 "Special:BookSources/9781595937667").
012. ^ [Jump up to: _**a**_](link#514) [_**b**_](link#515)Larson, Jim (March 2009). ["Erlang for concurrent programming"](link#516). _Communications of the ACM_. **52** (3): 48. [doi](link#474 "Doi (identifier)"):[10.1145/1467247.1467263](link#516). [S2CID](link#476 "S2CID (identifier)") [524392](link#517).
013. **[^](link#518 "Jump up")**["The Elixir Programming Language"](link#519). Retrieved 2021-02-14.
014. ^ [Jump up to: _**a**_](link#520) [_**b**_](link#521)Minsky, Yaron; Weeks, Stephen (July 2008). "Caml Trading — experiences with functional programming on Wall Street". _Journal of Functional Programming_. **18** (4): 553–564\\. [doi](link#474 "Doi (identifier)"):[10.1017/S095679680800676X](link#522) (inactive 1 November 2024). [S2CID](link#476 "S2CID (identifier)") [30955392](link#523).\`{{cite journal}}\`: CS1 maint: DOI inactive as of November 2024 ( [link](link#525 "Category:CS1 maint: DOI inactive as of November 2024"))
015. ^ [Jump up to: _**a**_](link#526) [_**b**_](link#527)Leroy, Xavier. [_Some uses of Caml in Industry_](https://web.archive.org/web/20111008170929/http://cufp.galois.com/2007/slides/XavierLeroy.pdf)(PDF). CUFP 2007. Archived from [the original](http://cufp.galois.com/2007/slides/XavierLeroy.pdf)(PDF) on 2011-10-08. Retrieved 2009-08-26.
016. ^ [Jump up to: _**a**_](link#530) [_**b**_](link#531)["Haskell in industry"](link#532). _Haskell Wiki_. Retrieved 2009-08-26. Haskell has a diverse range of use commercially, from aerospace and defense, to finance, to web startups, hardware design firms and lawnmower manufacturers.
017. ^ [Jump up to: _**a**_](link#533) [_**b**_](link#534) [_**c**_](link#535)[Hudak, Paul](link#472 "Paul Hudak"); Hughes, J.; Jones, S. P.; Wadler, P. (June 2007). [_A history of Haskell: being lazy with class_](link#536). Third ACM SIGPLAN Conference on History of Programming Languages. San Diego, California. [doi](link#474 "Doi (identifier)"): [10.1145/1238844.1238856](link#537). Retrieved 2013-09-26.
018. ^ [Jump up to: _**a**_](link#538) [_**b**_](link#539)Mansell, Howard (2008). [_Quantitative Finance in F#_](link#540). CUFP 2008. Archived from [the original](link#541) on 2015-07-08. Retrieved 2009-08-29.
019. ^ [Jump up to: _**a**_](link#542) [_**b**_](link#543)Peake, Alex (2009). [_The First Substantial Line of Business Application in F#_](link#544). CUFP 2009. Archived from [the original](link#545) on 2009-10-17. Retrieved 2009-08-29.
020. **[^](link#546 "Jump up")**de Moura, Leonardo; Ullrich, Sebastian (July 2021). "The Lean 4 Theorem Prover and Programming Language". _Lecture Notes in Artificial Intelligence_. Conference on Automated Deduction. Vol. 12699. pp. 625–635\\. [doi](link#474 "Doi (identifier)"):[10.1007/978-3-030-79876-5\\_37](link#547). [ISSN](link#548 "ISSN (identifier)") [1611-3349](link#549).
021. **[^](link#550 "Jump up")**Banz, Matt (2017-06-27). ["An introduction to functional programming in JavaScript"](link#551). _Opensource.com_. Retrieved 2021-01-09.
022. **[^](link#552 "Jump up")**["The useR! 2006 conference schedule includes papers on the commercial use of R"](link#553). R-project.org. 2006-06-08. Retrieved 2011-06-20.
023. **[^](link#554 "Jump up")**[Chambers, John M.](link#555 "John Chambers (programmer)") (1998). _Programming with Data: A Guide to the S Language_. Springer Verlag. pp. 67–70\\. [ISBN](link#135 "ISBN (identifier)") [978-0-387-98503-9](link#556 "Special:BookSources/978-0-387-98503-9").
024. **[^](link#557 "Jump up")**Novatchev, Dimitre. ["The Functional Programming Language XSLT — A proof through examples"](link#558). Retrieved May 27, 2006.
025. **[^](link#559 "Jump up")**Mertz, David. ["XML Programming Paradigms (part four): Functional Programming approached to XML processing"](link#560). _IBM developerWorks_. Retrieved May 27, 2006.
026. **[^](link#561 "Jump up")**[Chamberlin, Donald D.](link#562 "Donald D. Chamberlin"); [Boyce, Raymond F.](link#563 "Raymond F. Boyce") (1974). "SEQUEL: A structured English query language". _Proceedings of the 1974 ACM SIGFIDET_: 249–264.
027. **[^](link#564 "Jump up")**[_Functional Programming with C# - Simon Painter - NDC Oslo 2020_](link#565), 8 August 2021, archived from [the original](link#566) on 2021-10-30, retrieved 2021-10-23
028. ^ [Jump up to: _**a**_](link#567) [_**b**_](link#568)["Functional programming - Kotlin Programming Language"](link#569). _Kotlin_. Retrieved 2019-05-01.
029. **[^](link#570 "Jump up")**[Dominus, Mark J.](link#571 "Mark Jason Dominus") (2005). [_Higher-Order Perl_](link#372 "Higher-Order Perl"). [Morgan Kaufmann](link#572 "Morgan Kaufmann"). [ISBN](link#135 "ISBN (identifier)") [978-1-55860-701-9](link#573 "Special:BookSources/978-1-55860-701-9").
030. **[^](link#574 "Jump up")**Holywell, Simon (2014). _Functional Programming in PHP_. php\\[architect\\]. [ISBN](link#135 "ISBN (identifier)") [9781940111056](link#575 "Special:BookSources/9781940111056").
031. **[^](link#576 "Jump up")**The Cain Gang Ltd. ["Python Metaclasses: Who? Why? When?"](https://web.archive.org/web/20090530030205/http://www.python.org/community/pycon/dc2004/papers/24/metaclasses-pycon.pdf)(PDF). Archived from [the original](https://www.python.org/community/pycon/dc2004/papers/24/metaclasses-pycon.pdf)(PDF) on 30 May 2009. Retrieved 27 June 2009.
032. **[^](link#579 "Jump up")**["GopherCon 2020: Dylan Meeus - Functional Programming with Go"](link#580). _YouTube_. 22 December 2020.
033. **[^](link#581 "Jump up")**["Functional Language Features: Iterators and Closures - The Rust Programming Language"](link#582). _doc.rust-lang.org_. Retrieved 2021-01-09.
034. **[^](link#583 "Jump up")**Vanderbauwhede, Wim (18 July 2020). ["Cleaner code with functional programming"](link#584). Archived from [the original](link#585) on 28 July 2020. Retrieved 6 October 2020.
035. **[^](link#586 "Jump up")**["Effective Scala"](link#587). _Scala Wiki_. Archived from [the original](link#588) on 2012-06-19. Retrieved 2012-02-21. Effective Scala.
036. **[^](link#589 "Jump up")**["Documentation for package java.util.function since Java 8 (also known as Java 1.8)"](link#590). Retrieved 2021-06-16.
037. **[^](link#591 "Jump up")**Turing, A. M. (1937). "Computability and λ-definability". _The Journal of Symbolic Logic_. **2** (4). Cambridge University Press: 153–163\\. [doi](link#474 "Doi (identifier)"): [10.2307/2268280](link#592). [JSTOR](link#593 "JSTOR (identifier)") [2268280](link#594). [S2CID](link#476 "S2CID (identifier)") [2317046](link#595).
038. **[^](link#596 "Jump up")**Haskell Brooks Curry; Robert Feys (1958). [_Combinatory Logic_](link#597). North-Holland Publishing Company. Retrieved 10 February 2013.
039. **[^](link#598 "Jump up")**[Church, A.](link#105 "Alonzo Church") (1940). "A Formulation of the Simple Theory of Types". _Journal of Symbolic Logic_. **5** (2): 56–68\\. [doi](link#474 "Doi (identifier)"): [10.2307/2266170](link#599). [JSTOR](link#593 "JSTOR (identifier)") [2266170](link#600). [S2CID](link#476 "S2CID (identifier)") [15889861](link#601).
040. **[^](link#602 "Jump up")**[McCarthy, John](link#121 "John McCarthy (computer scientist)") (June 1978). [_History of Lisp_](http://jmc.stanford.edu/articles/lisp/lisp.pdf)(PDF). _History of Programming Languages_. Los Angeles, CA. pp. 173–185\\. [doi](link#474 "Doi (identifier)"): [10.1145/800025.808387](link#604).
041. **[^](link#605 "Jump up")**[John McCarthy](link#121 "John McCarthy (computer scientist)") (1960). ["Recursive functions of symbolic expressions and their computation by machine, Part I."](http://jmc.stanford.edu/articles/recursive/recursive.pdf)(PDF). _Communications of the ACM_. **3** (4). ACM New York, NY, US: 184–195\\. [doi](link#474 "Doi (identifier)"): [10.1145/367177.367199](link#607). [S2CID](link#476 "S2CID (identifier)") [1489409](link#608).
042. **[^](link#609 "Jump up")**Guy L. Steele; Richard P. Gabriel (February 1996). "The evolution of Lisp". [_History of programming languages---II_](http://dreamsongs.com/Files/HOPL2-Uncut.pdf)(PDF). pp. 233–330\\. [doi](link#474 "Doi (identifier)"): [10.1145/234286.1057818](link#611). [ISBN](link#135 "ISBN (identifier)") [978-0-201-89502-5](link#612 "Special:BookSources/978-0-201-89502-5"). [S2CID](link#476 "S2CID (identifier)") [47047140](link#613).
043. **[^](link#614 "Jump up")**The memoir of [Herbert A. Simon](link#615 "Herbert A. Simon") (1991), _Models of My Life_ pp.189-190 [ISBN](link#135 "ISBN (identifier)") [0-465-04640-1](link#616 "Special:BookSources/0-465-04640-1") claims that he, Al Newell, and Cliff Shaw are "...commonly adjudged to be the parents of \\[the\\] artificial intelligence \\[field\\]," for writing [Logic Theorist](link#617 "Logic Theorist"), a program that proved theorems from _[Principia Mathematica](link#618 "Principia Mathematica")_ automatically. To accomplish this, they had to invent a language and a paradigm that, viewed retrospectively, embeds functional programming.
044. **[^](link#619 "Jump up")**Landin, Peter J. (1964). ["The mechanical evaluation of expressions"](link#620). _[The Computer Journal](link#621 "The Computer Journal")_. **6** (4). [British Computer Society](link#622 "British Computer Society"): 308–320\\. [doi](link#474 "Doi (identifier)"):[10.1093/comjnl/6.4.308](link#620).
045. **[^](link#623 "Jump up")**Diehl, Stephan; Hartel, Pieter; Sestoft, Peter (2000). "Abstract machines for programming language implementation". _Future Generation Computer Systems_. Vol. 16. pp. 739–751.
046. **[^](link#624 "Jump up")**Landin, Peter J. (February 1965a). ["Correspondence between ALGOL 60 and Church's Lambda-notation: part I"](link#625). _[Communications of the ACM](link#626 "Communications of the ACM")_. **8** (2). [Association for Computing Machinery](link#627 "Association for Computing Machinery"): 89–101\\. [doi](link#474 "Doi (identifier)"):[10.1145/363744.363749](link#625). [S2CID](link#476 "S2CID (identifier)") [6505810](link#628).
047. **[^](link#629 "Jump up")**Landin, Peter J. (March 1965b). ["A correspondence between ALGOL 60 and Church's Lambda-notation: part II"](link#630). _[Communications of the ACM](link#626 "Communications of the ACM")_. **8** (3). [Association for Computing Machinery](link#627 "Association for Computing Machinery"): 158–165\\. [doi](link#474 "Doi (identifier)"):[10.1145/363791.363804](link#630). [S2CID](link#476 "S2CID (identifier)") [15781851](link#631).
048. **[^](link#632 "Jump up")**Landin, Peter J. (March 1966b). ["The next 700 programming languages"](link#633). _[Communications of the ACM](link#626 "Communications of the ACM")_. **9** (3). [Association for Computing Machinery](link#627 "Association for Computing Machinery"): 157–166\\. [doi](link#474 "Doi (identifier)"):[10.1145/365230.365257](link#633). [S2CID](link#476 "S2CID (identifier)") [13409665](link#634).
049. **[^](link#635 "Jump up")**Backus, J. (1978). ["Can programming be liberated from the von Neumann style?: A functional style and its algebra of programs"](link#636). _Communications of the ACM_. **21** (8): 613–641\\. [doi](link#474 "Doi (identifier)"):[10.1145/359576.359579](link#636).
050. **[^](link#637 "Jump up")**R.M. Burstall. Design considerations for a functional programming language. Invited paper, Proc. Infotech State of the Art Conf. "The Software Revolution", Copenhagen, 45–57 (1977)
051. **[^](link#638 "Jump up")**R.M. Burstall and J. Darlington. A transformation system for developing recursive programs. Journal of the Association for Computing Machinery 24(1):44–67 (1977)
052. **[^](link#639 "Jump up")**R.M. Burstall, D.B. MacQueen and D.T. Sannella. HOPE: an experimental applicative language. Proceedings 1980 LISP Conference, Stanford, 136–143 (1980).
053. **[^](link#640 "Jump up")**["Make discovering assign() easier!"](link#641). _OpenSCAD_. Archived from [the original](link#642) on 2023-04-19.
054. **[^](link#643 "Jump up")**Peter Bright (March 13, 2018). ["Developers love trendy new languages but earn more with functional programming"](link#644). _[Ars Technica](link#645 "Ars Technica")_.
055. **[^](link#646 "Jump up")**John Leonard (January 24, 2017). ["The stealthy rise of functional programming"](link#647). Computing.
056. **[^](link#648 "Jump up")**Leo Cheung (May 9, 2017). ["Is functional programming better for your startup?"](link#649). _[InfoWorld](link#650 "InfoWorld")_.
057. **[^](link#651 "Jump up")**Sean Tull - Monoidal Categories for Formal Concept Analysis.
058. **[^](link#652 "Jump up")**Pountain, Dick. ["Functional Programming Comes of Age"](link#653). _[Byte](link#654 "Byte (magazine)") (August 1994)_. Archived from [the original](link#655) on 2006-08-27. Retrieved August 31, 2006.
059. ^ [Jump up to: _**a**_](link#656) [_**b**_](link#657)["ISO/IEC JTC 1/SC 22/WG5/N2137 – Fortran 2015 Committee Draft (J3/17-007r2)"](https://wg5-fortran.org/N2101-N2150/N2137.pdf)(PDF). International Organization for Standardization. July 6, 2017. pp. 336–338.
060. **[^](link#659 "Jump up")**["Revised^6 Report on the Algorithmic Language Scheme"](link#660). R6rs.org. Retrieved 2013-03-21.
061. **[^](link#661 "Jump up")**["Revised^6 Report on the Algorithmic Language Scheme - Rationale"](link#662). R6rs.org. Retrieved 2013-03-21.
062. **[^](link#663 "Jump up")**Clinger, William (1998). "Proper tail recursion and space efficiency". _Proceedings of the ACM SIGPLAN 1998 conference on Programming language design and implementation - PLDI '98_. pp. 174–185\\. [doi](link#474 "Doi (identifier)"): [10.1145/277650.277719](link#664). [ISBN](link#135 "ISBN (identifier)") [0897919874](link#665 "Special:BookSources/0897919874"). [S2CID](link#476 "S2CID (identifier)") [16812984](link#666).
063. **[^](link#667 "Jump up")**Baker, Henry (1994). ["CONS Should Not CONS Its Arguments, Part II: Cheney on the M.T.A."](link#668) Archived from [the original](link#669) on 2006-03-03. Retrieved 2020-04-29.
064. **[^](link#670 "Jump up")**[Turner, D.A.](link#160 "David Turner (computer scientist)") (2004-07-28). ["Total Functional Programming"](link#671). _Journal of Universal Computer Science_. **10** (7): 751–768\\. [doi](link#474 "Doi (identifier)"): [10.3217/jucs-010-07-0751](link#672).
065. **[^](link#673 "Jump up")**[The Implementation of Functional Programming Languages](link#674). Simon Peyton Jones, published by Prentice Hall, 1987
066. ^ [Jump up to: _**a**_](link#675) [_**b**_](link#676)[Launchbury, John](link#677 "John Launchbury") (March 1993). _A Natural Semantics for Lazy Evaluation_. Symposium on Principles of Programming Languages. Charleston, South Carolina: [ACM](link#627 "Association for Computing Machinery"). pp. 144–154\\. [doi](link#474 "Doi (identifier)"):[10.1145/158511.158618](link#678).
067. **[^](link#679 "Jump up")**[Robert W. Harper](link#680 "Robert Harper (computer scientist)") (2009). [_Practical Foundations for Programming Languages_](https://web.archive.org/web/20160407095249/https://www.cs.cmu.edu/~rwh/plbook/book.pdf)(PDF). Archived from [the original](https://www.cs.cmu.edu/~rwh/plbook/book.pdf)(PDF) on 2016-04-07.
068. **[^](link#683 "Jump up")**Huet, Gérard P. (1973). "The Undecidability of Unification in Third Order Logic". _Information and Control_. **22** (3): 257–267\\. [doi](link#474 "Doi (identifier)"): [10.1016/s0019-9958(73)90301-x](link#684).
069. **[^](link#685 "Jump up")**Huet, Gérard (Sep 1976). _Resolution d'Equations dans des Langages d'Ordre 1,2,...ω_ (Ph.D.) (in French). Universite de Paris VII.
070. **[^](link#686 "Jump up")**Huet, Gérard (2002). ["Higher Order Unification 30 years later"](http://pauillac.inria.fr/~huet/PUBLIC/Hampton.pdf)(PDF). In Carreño, V.; Muñoz, C.; Tahar, S. (eds.). _Proceedings, 15th International Conference TPHOL_. LNCS. Vol. 2410. Springer. pp. 3–12.
071. **[^](link#688 "Jump up")**Wells, J. B. (1993). "Typability and type checking in the second-order lambda-calculus are equivalent and undecidable". _Tech. Rep. 93-011_: 176–185\\. [CiteSeerX](link#689 "CiteSeerX (identifier)") [10.1.1.31.3590](link#690).
072. **[^](link#691 "Jump up")**Leroy, Xavier (17 September 2018). ["The Compcert verified compiler"](link#692).
073. **[^](link#693 "Jump up")**Peyton Jones, Simon; Vytiniotis, Dimitrios; [Weirich, Stephanie](link#694 "Stephanie Weirich"); Geoffrey Washburn (April 2006). ["Simple unification-based type inference for GADTs"](link#695). _Icfp 2006_: 50–61.
074. **[^](link#696 "Jump up")**["OCaml Manual"](link#697). _caml.inria.fr_. Retrieved 2021-03-08.
075. **[^](link#698 "Jump up")**["Algebraic Data Types"](link#699). _Scala Documentation_. Retrieved 2021-03-08.
076. **[^](link#700 "Jump up")**Kennedy, Andrew; Russo, Claudio V. (October 2005). [_Generalized Algebraic Data Types and Object-Oriented Programming_](https://web.archive.org/web/20061229164852/http://research.microsoft.com/~akenn/generics/gadtoop.pdf)(PDF). OOPSLA. San Diego, California: [ACM](link#627 "Association for Computing Machinery"). [doi](link#474 "Doi (identifier)"): [10.1145/1094811.1094814](link#702). [ISBN](link#135 "ISBN (identifier)") [9781595930316](link#703 "Special:BookSources/9781595930316"). Archived from [the original](link#704) on 2006-12-29.
077. **[^](link#705 "Jump up")**Hughes, John. ["Why Functional Programming Matters"](http://www.cse.chalmers.se/~rjmh/Papers/whyfp.pdf)(PDF). [Chalmers University of Technology](link#707 "Chalmers University of Technology").
078. **[^](link#708 "Jump up")**[_Purely functional data structures_](link#709) by [Chris Okasaki](link#710 "Chris Okasaki"), [Cambridge University Press](link#711 "Cambridge University Press"), 1998, [ISBN](link#135 "ISBN (identifier)") [0-521-66350-4](link#712 "Special:BookSources/0-521-66350-4")
079. **[^](link#713 "Jump up")**L’orange, Jean Niklas. ["polymatheia - Understanding Clojure's Persistent Vector, pt. 1"](link#714). _Polymatheia_. Retrieved 2018-11-13.
080. **[^](link#715 "Jump up")**Michael Barr, Charles Well - Category theory for computer science.
081. **[^](link#716 "Jump up")**Newbern, J. ["All About Monads: A comprehensive guide to the theory and practice of monadic programming in Haskell"](link#717). Retrieved 2008-02-14.
082. **[^](link#718 "Jump up")**["Thirteen ways of looking at a turtle"](link#719). _fF# for fun and profit_. Retrieved 2018-11-13.
083. **[^](link#720 "Jump up")**Hartmanis, Juris; Hemachandra, Lane (1986). "Complexity classes without machines: On complete languages for UP". [_Automata, Languages and Programming_](link#721). Lecture Notes in Computer Science. Vol. 226. Berlin, Heidelberg: Springer Berlin Heidelberg. pp. 123–135\\. [doi](link#474 "Doi (identifier)"): [10.1007/3-540-16761-7\\_62](link#722). [ISBN](link#135 "ISBN (identifier)") [978-3-540-16761-7](link#723 "Special:BookSources/978-3-540-16761-7"). Retrieved 2024-12-12.
084. **[^](link#724 "Jump up")**[Paulson, Larry C.](link#725 "Lawrence Paulson") (28 June 1996). [_ML for the Working Programmer_](link#726). Cambridge University Press. [ISBN](link#135 "ISBN (identifier)") [978-0-521-56543-1](link#727 "Special:BookSources/978-0-521-56543-1"). Retrieved 10 February 2013.
085. **[^](link#728 "Jump up")**Spiewak, Daniel (26 August 2008). ["Implementing Persistent Vectors in Scala"](link#729). _Code Commit_. Archived from [the original](link#730) on 23 September 2015. Retrieved 17 April 2012.
086. **[^](link#731 "Jump up")**["Which programs are fastest? \\| Computer Language Benchmarks Game"](link#732). benchmarksgame.alioth.debian.org. Archived from [the original](link#733) on 2013-05-20. Retrieved 2011-06-20.
087. **[^](link#734 "Jump up")**Igor Pechtchanski; Vivek Sarkar (2005). "Immutability specification and its applications". _Concurrency and Computation: Practice and Experience_. **17** (5–6): 639–662\\. [doi](link#474 "Doi (identifier)"): [10.1002/cpe.853](link#735). [S2CID](link#476 "S2CID (identifier)") [34527406](link#736).
088. **[^](link#737 "Jump up")**["An In-Depth Look at Clojure Collections"](link#738). _InfoQ_. Retrieved 2024-04-29.
089. **[^](link#739 "Jump up")**["References and Borrowing - The Rust Programming Language"](link#740). _doc.rust-lang.org_. Retrieved 2024-04-29.
090. **[^](link#741 "Jump up")**["Validating References with Lifetimes - The Rust Programming Language"](link#742). _doc.rust-lang.org_. Retrieved 2024-04-29.
091. **[^](link#743 "Jump up")**["Concurrent Collections (The Java™ Tutorials > Essential Java Classes > Concurrency)"](link#744). _docs.oracle.com_. Retrieved 2024-04-29.
092. **[^](link#745 "Jump up")**["Understanding The Actor Model To Build Non-blocking, High-throughput Distributed Systems - Scaleyourapp"](link#746). _scaleyourapp.com_. 2023-01-28. Retrieved 2024-04-29.
093. **[^](link#747 "Jump up")**Cesarini, Francesco; Thompson, Simon (2009). _Erlang programming: a concurrent approach to software development_ (1st ed.). O'Reilly Media, Inc. (published 2009-06-11). p. 6. [ISBN](link#135 "ISBN (identifier)") [978-0-596-55585-6](link#748 "Special:BookSources/978-0-596-55585-6").
094. **[^](link#749 "Jump up")**["Chapter 25. Profiling and optimization"](link#750). Book.realworldhaskell.org. Retrieved 2011-06-20.
095. **[^](link#751 "Jump up")**Berthe, Samuel (2024-04-29), [_samber/lo_](link#348), retrieved 2024-04-29
096. **[^](link#752 "Jump up")**["Go Wiki: Compiler And Runtime Optimizations - The Go Programming Language"](link#753). _go.dev_. Retrieved 2024-04-29.
097. **[^](link#754 "Jump up")**["Comparing Performance: Loops vs. Iterators - The Rust Programming Language"](link#755). _doc.rust-lang.org_. Retrieved 2024-04-29.
098. **[^](link#756 "Jump up")**Hartel, Pieter; Henk Muller; Hugh Glaser (March 2004). ["The Functional C experience"](https://web.archive.org/web/20110719201553/http://www.ub.utwente.nl/webdocs/ctit/1/00000084.pdf)(PDF). _Journal of Functional Programming_. **14** (2): 129–135\\. [doi](link#474 "Doi (identifier)"): [10.1017/S0956796803004817](link#758). [S2CID](link#476 "S2CID (identifier)") [32346900](link#759). Archived from [the original](http://www.ub.utwente.nl/webdocs/ctit/1/00000084.pdf)(PDF) on 2011-07-19. Retrieved 2006-05-28.; David Mertz. ["Functional programming in Python, Part 3"](link#761). _IBM developerWorks_. Archived from [the original](link#762) on 2007-10-16. Retrieved 2006-09-17.( [Part 1](link#763), [Part 2](https://web.archive.org/web/20071016124848/http://www-128.ibm.com/developerworks/linux/library/l-prog2.html))
099. **[^](link#765 "Jump up")**["Functions — D Programming Language 2.0"](link#766). Digital Mars. 30 December 2012.
100. **[^](link#767 "Jump up")**["Lua Unofficial FAQ (uFAQ)"](link#768).
101. **[^](link#769 "Jump up")**["First-Class Functions in Go - The Go Programming Language"](link#770). _golang.org_. Retrieved 2021-01-04.
102. **[^](link#771 "Jump up")**Eich, Brendan (3 April 2008). ["Popularity"](link#772).
103. **[^](link#773 "Jump up")**[van Rossum, Guido](link#774 "Guido van Rossum") (2009-04-21). ["Origins of Python's "Functional" Features"](link#775). Retrieved 2012-09-27.
104. **[^](link#776 "Jump up")**["functools — Higher order functions and operations on callable objects"](link#777). Python Software Foundation. 2011-07-31. Retrieved 2011-07-31.
105. **[^](link#778 "Jump up")**Skarsaune, Martin (2008). _The SICS Java Port Project Automatic Translation of a Large Object Oriented System from Smalltalk to Java_.
106. **[^](link#779 "Jump up")**Gosling, James. ["Closures"](link#780). _James Gosling: on the Java Road_. Oracle. Archived from [the original](link#781) on 2013-04-14. Retrieved 11 May 2013.
107. **[^](link#782 "Jump up")**Williams, Michael (8 April 2013). ["Java SE 8 Lambda Quick Start"](link#783).
108. **[^](link#784 "Jump up")**Bloch, Joshua (2008). "Item 15: Minimize Mutability". [_Effective Java_](link#785) (Second ed.). Addison-Wesley. [ISBN](link#135 "ISBN (identifier)") [978-0321356680](link#786 "Special:BookSources/978-0321356680").
109. **[^](link#787 "Jump up")**["Object.freeze() - JavaScript \\| MDN"](link#788). _developer.mozilla.org_. Retrieved 2021-01-04. The Object.freeze() method freezes an object. A frozen object can no longer be changed; freezing an object prevents new properties from being added to it, existing properties from being removed, prevents changing the enumerability, configurability, or writability of existing properties, and prevents the values of existing properties from being changed. In addition, freezing an object also prevents its prototype from being changed. freeze() returns the same object that was passed in.
110. **[^](link#789 "Jump up")**Daniel Friedman; William Byrd; Oleg Kiselyov; Jason Hemann (2018). _The Reasoned Schemer, Second Edition_. The MIT Press.
111. **[^](link#790 "Jump up")**A. Casas, D. Cabeza, M. V. Hermenegildo. A Syntactic Approach to
      Combining Functional Notation, Lazy Evaluation and Higher-Order in
      LP Systems. The 8th International Symposium on Functional and Logic
      Programming (FLOPS'06), pages 142-162, April 2006.
112. **[^](link#791 "Jump up")**["How I do my Computing"](link#792). _stallman.org_. Retrieved 2024-04-29.
113. **[^](link#793 "Jump up")**["Helix"](link#794). _helix-editor.com_. Retrieved 2024-04-29.
114. **[^](link#795 "Jump up")**Wakeling, David (2007). ["Spreadsheet functional programming"](http://www.activemode.org/webroot/Workers/ActiveTraining/Programming/Pro_SpreadsheetFunctionalProgramming.pdf)(PDF). _Journal of Functional Programming_. **17** (1): 131–143\\. [doi](link#474 "Doi (identifier)"): [10.1017/S0956796806006186](link#797). [ISSN](link#548 "ISSN (identifier)") [0956-7968](link#798). [S2CID](link#476 "S2CID (identifier)") [29429059](link#799).
115. **[^](link#800 "Jump up")**[Peyton Jones, Simon](link#801 "Simon Peyton Jones"); [Burnett, Margaret](link#802 "Margaret Burnett"); [Blackwell, Alan](link#803 "Alan Blackwell") (March 2003). ["Improving the world's most popular functional language: user-defined functions in Excel"](link#804). Archived from [the original](link#805) on 2005-10-16.
116. **[^](link#806 "Jump up")**Rodger, Richard (11 December 2017). _The Tao of Microservices_. Manning. [ISBN](link#135 "ISBN (identifier)") [9781638351733](link#807 "Special:BookSources/9781638351733").
117. **[^](link#808 "Jump up")**Piro, Christopher (2009). [_Functional Programming at Facebook_](link#809). CUFP 2009. Archived from [the original](link#810) on 2009-10-17. Retrieved 2009-08-29.
118. **[^](link#811 "Jump up")**["Sim-Diasca: a large-scale discrete event concurrent simulation engine in Erlang"](link#812). November 2011. Archived from [the original](link#813) on 2013-09-17. Retrieved 2011-11-08.
119. **[^](link#814 "Jump up")**[1 million is so 2011](link#815) [Archived](link#816) 2014-02-19 at the [Wayback Machine](link#817 "Wayback Machine") // WhatsApp blog, 2012-01-06: "the last important piece of our infrastracture is Erlang"
120. **[^](link#818 "Jump up")**Momtahan, Lee (2009). [_Scala at EDF Trading: Implementing a Domain-Specific Language for Derivative Pricing with Scala_](link#819). CUFP 2009. Archived from [the original](link#820) on 2009-10-17. Retrieved 2009-08-29.
121. **[^](link#821 "Jump up")**Graham, Paul (2003). ["Beating the Averages"](link#822). Retrieved 2009-08-29.
122. **[^](link#823 "Jump up")**Sims, Steve (2006). [_Building a Startup with Standard ML_](http://cufp.galois.com/2006/slides/SteveSims.pdf)(PDF). CUFP 2006. Retrieved 2009-08-29.
123. **[^](link#825 "Jump up")**Laurikari, Ville (2007). [_Functional Programming in Communications Security_](link#826). CUFP 2007. Archived from [the original](link#827) on 2010-12-21. Retrieved 2009-08-29.
124. **[^](link#828 "Jump up")**Lorimer, R. J. (19 January 2009). ["Live Production Clojure Application Announced"](link#829). _InfoQ_.
125. **[^](link#830 "Jump up")**Bugnion, Pascal (2016). _Scala for Data Science_ (1st ed.). [Packt](link#831 "Packt"). [ISBN](link#135 "ISBN (identifier)") [9781785281372](link#832 "Special:BookSources/9781785281372").
126. **[^](link#833 "Jump up")**["Why developers like ClojureScript"](link#834). _StackShare_. Retrieved 2024-04-29.
127. **[^](link#835 "Jump up")**Herrick, Justin (2024-04-29), [_jah2488/elm-companies_](link#836), retrieved 2024-04-29
128. **[^](link#837 "Jump up")**["Why developers like PureScript"](link#838). _StackShare_. Retrieved 2024-04-29.
129. **[^](link#839 "Jump up")**Team, Editorial (2019-01-08). ["ALLEGRO - all you need to know about the best Polish online marketplace"](link#840). _E-commerce Germany News_. Retrieved 2024-04-29.
130. **[^](link#841 "Jump up")**["Websites using Phoenix Framework - Wappalyzer"](link#842). _www.wappalyzer.com_. Retrieved 2024-04-29.
131. **[^](link#843 "Jump up")**["Functional Programming: 2019-2020"](link#844). University of Oxford Department of Computer Science. Retrieved 28 April 2020.
132. **[^](link#845 "Jump up")**["Programming I (Haskell)"](link#846). Imperial College London Department of Computing. Retrieved 28 April 2020.
133. ^ [Jump up to: _**a**_](link#847) [_**b**_](link#848)["Computer Science BSc - Modules"](link#849). Retrieved 28 April 2020.
134. ^ [Jump up to: _**a**_](link#850) [_**b**_](link#851)[Abelson, Hal](link#852 "Hal Abelson"); [Sussman, Gerald Jay](link#172 "Gerald Jay Sussman") (1985). ["Preface to the Second Edition"](link#853). [_Structure and Interpretation of Computer Programs_](link#854) (2 ed.). MIT Press. [Bibcode](link#855 "Bibcode (identifier)"): [1985sicp.book.....A](link#856).
135. **[^](link#857 "Jump up")**John DeNero (Fall 2019). ["Computer Science 61A, Berkeley"](link#858). Department of Electrical Engineering and Computer Sciences, Berkeley. Retrieved 2020-08-14.
136. **[^](link#859 "Jump up")**[Emmanuel Schanzer of Bootstrap](link#860) interviewed on the TV show _Triangulation_ on the [TWiT.tv](link#861 "TWiT.tv") network
137. **[^](link#862 "Jump up")**["Why Scheme for Introductory Programming?"](link#863). _home.adelphi.edu_. Retrieved 2024-04-29.
138. **[^](link#864 "Jump up")**Staff, IMACS (2011-06-03). ["What Is Scheme & Why Is it Beneficial for Students?"](link#865). _IMACS – Making Better Thinkers for Life_. Retrieved 2024-04-29.

## Further reading

\\[ [edit](link#866 "Edit section: Further reading")\\]

- [Abelson, Hal](link#852 "Hal Abelson"); [Sussman, Gerald Jay](link#172 "Gerald Jay Sussman") (1985). [_Structure and Interpretation of Computer Programs_](link#867). MIT Press. [Bibcode](link#855 "Bibcode (identifier)"): [1985sicp.book.....A](link#856).
- Cousineau, Guy and Michel Mauny. _The Functional Approach to Programming_. Cambridge, UK: [Cambridge University Press](link#711 "Cambridge University Press"), 1998.
- Curry, Haskell Brooks and Feys, Robert and Craig, William. _Combinatory Logic_. Volume I. North-Holland Publishing Company, Amsterdam, 1958.
- [Curry, Haskell B.](link#114 "Haskell Curry"); [Hindley, J. Roger](link#868 "J. Roger Hindley"); [Seldin, Jonathan P.](link#869 "Jonathan P. Seldin (page does not exist)") (1972). _Combinatory Logic_. Vol. II. Amsterdam: North Holland. [ISBN](link#135 "ISBN (identifier)") [978-0-7204-2208-5](link#870 "Special:BookSources/978-0-7204-2208-5").
- Dominus, Mark Jason. _[Higher-Order Perl](link#871)_. [Morgan Kaufmann](link#572 "Morgan Kaufmann"). 2005.
- Felleisen, Matthias; Findler, Robert; Flatt, Matthew; Krishnamurthi, Shriram (2018). [_How to Design Programs_](link#872). MIT Press.
- Graham, Paul. _ANSI Common LISP_. Englewood Cliffs, New Jersey: [Prentice Hall](link#873 "Prentice Hall"), 1996.
- MacLennan, Bruce J. _Functional Programming: Practice and Theory_. Addison-Wesley, 1990.
- Michaelson, Greg (10 April 2013). _An Introduction to Functional Programming Through Lambda Calculus_. Courier Corporation. [ISBN](link#135 "ISBN (identifier)") [978-0-486-28029-5](link#874 "Special:BookSources/978-0-486-28029-5").
- O'Sullivan, Brian; Stewart, Don; Goerzen, John (2008). [_Real World Haskell_](link#875). O'Reilly.
- Pratt, Terrence W. and [Marvin Victor Zelkowitz](link#876 "Marvin Victor Zelkowitz"). _Programming Languages: Design and Implementation_. 3rd ed. Englewood Cliffs, New Jersey: [Prentice Hall](link#873 "Prentice Hall"), 1996.
- Salus, Peter H. _Functional and Logic Programming Languages_. Vol. 4 of Handbook of Programming Languages. Indianapolis, Indiana: [Macmillan Technical Publishing](link#877 "Macmillan Technical Publishing (page does not exist)"), 1998.
- Thompson, Simon. _Haskell: The Craft of Functional Programming_. Harlow, England: [Addison-Wesley Longman Limited](link#878 "Addison-Wesley Longman Limited (page does not exist)"), 1996.

## External links

\\[ [edit](link#879 "Edit section: External links")\\]

Listen to this article (28 minutes)

[Play audio](link#880 "Play audio") Duration: 27 minutes and 59 seconds.27:59

![Spoken Wikipedia icon](image#5)

[This audio file](link#880 "File:En-Functional programming.ogg") was created from a revision of this article dated 25 August 2011 (2011-08-25), and does not reflect subsequent edits.

( [Audio help](link#881 "Wikipedia:Media help") · [More spoken articles](link#882 "Wikipedia:Spoken articles"))

- Ford, Neal. ["Functional thinking"](link#883). Retrieved 2021-11-10.
- Akhmechet, Slava (2006-06-19). ["defmacro – Functional Programming For The Rest of Us"](link#884). Retrieved 2013-02-24. An introduction
- _Functional programming in Python_ (by David Mertz): [part 1](link#885), [part 2](link#886), [part 3](link#887)

| show<br>[Programming paradigms](link#4 "Programming paradigm") ( [Comparison by language](link#888 "Comparison of multi-paradigm programming languages")) |
| --- |
| [Imperative](link#12 "Imperative programming") | | [Structured](link#889 "Structured programming") | - [Jackson structures](link#890 "Jackson structured programming")<br>- [Block-structured](link#891 "Block (programming)")<br>- [Modular](link#21 "Modular programming")<br>- [Non-structured](link#892 "Non-structured programming")<br>- [Procedural](link#2 "Procedural programming")<br>- [Programming in the large and in the small](link#893 "Programming in the large and programming in the small")<br>- [Design by contract](link#894 "Design by contract")<br>- [Invariant-based](link#895 "Invariant-based programming")<br>- [Nested function](link#469 "Nested function") |
| [Object-oriented](link#193 "Object-oriented programming")<br>( [comparison](link#896 "Comparison of programming languages (object-oriented programming)"), [list](link#897 "List of object-oriented programming languages")) | - [Class-based](link#898 "Class-based programming"), [Prototype-based](link#899 "Prototype-based programming"), [Object-based](link#900 "Object-based language")<br>- [Agent](link#901 "Agent-oriented programming")<br>- [Immutable object](link#902 "Immutable object")<br>- [Persistent](link#903 "Persistent programming language")<br>- [Uniform function call syntax](link#904 "Uniform function call syntax") | |
| [Declarative](link#8 "Declarative programming") | | Functional<br>( [comparison](link#905 "Comparison of functional programming languages")) | - [Recursive](link#124 "Recursion (computer science)")<br>- [Anonymous function](link#366 "Anonymous function") ( [Partial application](link#200 "Partial application"))<br>- [Higher-order](link#906 "Higher-order programming")<br>- [Purely functional](link#22 "Purely functional programming")<br>- [Total](link#240 "Total functional programming")<br>- [Strict](link#907 "Strict programming language")<br>- [GADTs](link#277 "Generalized algebraic data type")<br>- [Dependent types](link#180 "Dependent type")<br>- [Functional logic](link#908 "Functional logic programming")<br>- [Point-free style](link#909 "Tacit programming")<br>- [Expression-oriented](link#910 "Expression-oriented programming language")<br>- [Applicative](link#911 "Applicative programming language"), [Concatenative](link#912 "Concatenative programming language")<br>- [Function-level](link#156 "Function-level programming"), [Value-level](link#913 "Value-level programming") |
| [Dataflow](link#914 "Dataflow programming") | - [Flow-based](link#915 "Flow-based programming")<br>- [Reactive](link#916 "Reactive programming") ( [Functional reactive](link#465 "Functional reactive programming"))<br>- [Signals](link#917 "Signal programming")<br>- [Streams](link#918 "Stream processing")<br>- [Synchronous](link#919 "Synchronous programming language") |
| [Logic](link#384 "Logic programming") | - [Abductive logic](link#920 "Abductive logic programming")<br>- [Answer set](link#921 "Answer set programming")<br>- [Constraint](link#922 "Constraint programming") ( [Constraint logic](link#923 "Constraint logic programming"))<br>- [Inductive logic](link#924 "Inductive logic programming")<br>- [Nondeterministic](link#925 "Nondeterministic programming")<br>- [Ontology](link#926 "Ontology language")<br>- [Probabilistic logic](link#927 "Probabilistic logic programming")<br>- [Query](link#928 "Query language") |
| [DSL](link#929 "Domain-specific language") | - [Algebraic modeling](link#930 "Algebraic modeling language")<br>- [Array](link#320 "Array programming")<br>- [Automata-based](link#931 "Automata-based programming") ( [Action](link#932 "Action language"))<br>- [Command](link#933 "Command language") ( [Spacecraft](link#934 "Spacecraft command language"))<br>- [Differentiable](link#935 "Differentiable programming")<br>- [End-user](link#936 "End-user development")<br>- [Grammar-oriented](link#937 "Grammar-oriented programming")<br>- [Interface description](link#938 "Interface description language")<br>- [Language-oriented](link#939 "Language-oriented programming")<br>- [List comprehension](link#940 "List comprehension")<br>- [Low-code](link#941 "Low-code development platform")<br>- [Modeling](link#942 "Modeling language")<br>- [Natural language](link#943 "Natural-language programming")<br>- [Non-English-based](link#944 "Non-English-based programming languages")<br>- [Page description](link#945 "Page description language")<br>- [Pipes](link#946 "Pipeline (software)") and [filters](link#947 "Filter (software)")<br>- [Probabilistic](link#948 "Probabilistic programming")<br>- [Quantum](link#949 "Quantum programming")<br>- [Scientific](link#950 "Scientific programming language")<br>- [Scripting](link#951 "Scripting language")<br>- [Set-theoretic](link#952 "Set theoretic programming")<br>- [Simulation](link#953 "Simulation language")<br>- [Stack-based](link#954 "Stack-oriented programming")<br>- [System](link#955 "System programming language")<br>- [Tactile](link#956 "Tactile programming language")<br>- [Templating](link#957 "Template processor")<br>- [Transformation](link#958 "Transformation language") ( [Graph rewriting](link#959 "Graph rewriting"), [Production](link#960 "Production system (computer science)"), [Pattern](link#961 "Pattern matching"))<br>- [Visual](link#962 "Visual programming language") | |
| [Concurrent](link#963 "Concurrent computing"),<br>[distributed](link#964 "Distributed computing"),<br>[parallel](link#328 "Parallel computing") | - [Actor-based](link#332 "Actor model")<br>- [Automatic mutual exclusion](link#965 "Automatic mutual exclusion")<br>- [Choreographic programming](link#966 "Choreographic programming")<br>- [Concurrent logic](link#967 "Concurrent logic programming") ( [Concurrent constraint logic](link#968 "Concurrent constraint logic programming"))<br>- [Concurrent OO](link#969 "Concurrent object-oriented programming")<br>- [Macroprogramming](link#970 "Macroprogramming")<br>- [Multitier programming](link#971 "Multitier programming")<br>- [Organic computing](link#972 "Organic computing")<br>- [Parallel programming models](link#973 "Parallel programming model")<br>- [Partitioned global address space](link#974 "Partitioned global address space")<br>- [Process-oriented](link#975 "Process-oriented programming")<br>- [Relativistic programming](link#976 "Relativistic programming")<br>- [Service-oriented](link#977 "Service-oriented programming")<br>- [Structured concurrency](link#978 "Structured concurrency") |
| [Metaprogramming](link#979 "Metaprogramming") | - [Attribute-oriented](link#980 "Attribute-oriented programming")<br>- [Automatic](link#981 "Automatic programming") ( [Inductive](link#982 "Inductive programming"))<br>- [Dynamic](link#983 "Dynamic programming language")<br>- [Extensible](link#984 "Extensible programming")<br>- [Generic](link#349 "Generic programming")<br>- [Homoiconicity](link#985 "Homoiconicity")<br>- [Interactive](link#986 "Interactive programming")<br>- [Macro](link#987 "Macro (computer science)") ( [Hygienic](link#988 "Hygienic macro"))<br>- [Metalinguistic abstraction](link#989 "Metalinguistic abstraction")<br>- [Multi-stage](link#990 "Multi-stage programming")<br>- [Program synthesis](link#991 "Program synthesis") ( [Bayesian](link#992 "Bayesian program synthesis"), [Inferential](link#993 "Inferential programming"), [by demonstration](link#994 "Programming by demonstration"), [by example](link#995 "Programming by example"))<br>- [Reflective](link#996 "Reflective programming")<br>- [Self-modifying code](link#997 "Self-modifying code")<br>- [Symbolic](link#998 "Symbolic programming")<br>- [Template](link#999 "Template metaprogramming") |
| [Separation\\<br>\\<br>of concerns](link#249 "Separation of concerns") | - [Aspects](link#1000 "Aspect-oriented programming")<br>- [Components](link#1001 "Component-based software engineering")<br>- [Data-driven](link#1002 "Data-driven programming")<br>- [Data-oriented](link#1003 "Data-oriented design")<br>- [Event-driven](link#1004 "Event-driven programming")<br>- [Features](link#1005 "Feature-oriented programming")<br>- [Literate](link#1006 "Literate programming")<br>- [Roles](link#1007 "Role-oriented programming")<br>- [Subjects](link#1008 "Subject-oriented programming") |

| show<br>[Types of programming languages](link#4 "Programming paradigm") |
| --- |
| Level | - [Machine](link#1009 "Machine code")<br>- [Assembly](link#132 "Assembly language")<br>- [Compiled](link#1010 "Compiled language")<br>- [Interpreted](link#1011 "Interpreted language")<br>- [Low-level](link#1012 "Low-level programming language")<br>- [High-level](link#118 "High-level programming language")<br>- [Very high-level](link#1013 "Very high-level programming language")<br>- [Esoteric](link#1014 "Esoteric programming language") |
| [Generation](link#1015 "Programming language generations") | - [First](link#1016 "First-generation programming language")<br>- [Second](link#1017 "Second-generation programming language")<br>- [Third](link#1018 "Third-generation programming language")<br>- [Fourth](link#1019 "Fourth-generation programming language")<br>- [Fifth](link#1020 "Fifth-generation programming language") |

| [Authority control databases](link#1021 "Help:Authority control"): National [![Edit this at Wikidata](https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/OOjs_UI_icon_edit-ltr-progressive.svg/20px-OOjs_UI_icon_edit-ltr-progressive.svg.png)](https://www.wikidata.org/wiki/Q193076#identifiers "Edit this at Wikidata") | - [Germany](link#1022)<br>- [United States](link#1023)<br>- [France](link#1024)<br>- [BnF data](link#1025)<br>- [Czech Republic](link#1026)<br>- [Spain](link#1027)<br>- [Israel](link#1028) |

Retrieved from " [https://en.wikipedia.org/w/index.php?title=Functional\\_programming&oldid=1288545228](link#1029)"

[Categories](link#1030 "Help:Category"):

- [Functional programming](link#1031 "Category:Functional programming")
- [Programming paradigms](link#1032 "Category:Programming paradigms")
- [Programming language comparisons](link#1033 "Category:Programming language comparisons")

Hidden categories:

- [CS1 maint: DOI inactive as of November 2024](link#525 "Category:CS1 maint: DOI inactive as of November 2024")
- [CS1 French-language sources (fr)](link#1034 "Category:CS1 French-language sources (fr)")
- [Webarchive template wayback links](link#1035 "Category:Webarchive template wayback links")
- [Articles with short description](link#1036 "Category:Articles with short description")
- [Short description matches Wikidata](link#1037 "Category:Short description matches Wikidata")
- [All articles with unsourced statements](link#1038 "Category:All articles with unsourced statements")
- [Articles with unsourced statements from February 2017](link#1039 "Category:Articles with unsourced statements from February 2017")
- [Articles with unsourced statements from July 2018](link#1040 "Category:Articles with unsourced statements from July 2018")
- [Articles with unsourced statements from June 2014](link#1041 "Category:Articles with unsourced statements from June 2014")
- [Articles with unsourced statements from April 2015](link#1042 "Category:Articles with unsourced statements from April 2015")
- [Articles with unsourced statements from August 2022](link#1043 "Category:Articles with unsourced statements from August 2022")
- [Articles with hAudio microformats](link#1044 "Category:Articles with hAudio microformats")
- [Spoken articles](link#1045 "Category:Spoken articles")
- [Articles with example C code](link#1046 "Category:Articles with example C code")
- [Articles with example JavaScript code](link#1047 "Category:Articles with example JavaScript code")
- [Articles with example Lisp (programming language) code](link#1048 "Category:Articles with example Lisp (programming language) code")

Search

Search

Functional programming

54 languages[Add topic](link#1049)

------------------------------

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

**link#20**: https://en.wikipedia.org/wiki/Composability - "composable"

**link#21**: https://en.wikipedia.org/wiki/Modular_programming - "modular"

**link#22**: https://en.wikipedia.org/wiki/Purely_functional_programming - "purely functional programming"

**link#23**: https://en.wikipedia.org/wiki/Deterministic_system - "deterministic"

**link#24**: https://en.wikipedia.org/wiki/Function_(mathematics) - "functions"

**link#25**: https://en.wikipedia.org/wiki/Pure_function - "pure functions"

**link#26**: https://en.wikipedia.org/wiki/Side_effect_(computer_science) - "side effects"

**link#27**: https://en.wikipedia.org/wiki/Procedure_(computer_science) - "procedures"

**link#28**: https://en.wikipedia.org/wiki/Software_bug - "bugs"

**link#29**: https://en.wikipedia.org/wiki/Debugging - "debug"

**link#30**: https://en.wikipedia.org/wiki/Software_testing - "test"

**link#31**: https://en.wikipedia.org/wiki/Formal_verification - "formal verification"

**link#32**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-hudak1989-1 - "[1]"

**link#33**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-hughesWhyFPMatters-2 - "[2]"

**link#34**: https://en.wikipedia.org/wiki/Academia - "academia"

**link#35**: https://en.wikipedia.org/wiki/Lambda_calculus - "lambda calculus"

**link#36**: https://en.wikipedia.org/wiki/Common_Lisp - "Common Lisp"

**link#37**: https://en.wikipedia.org/wiki/Scheme_(programming_language) - "Scheme"

**link#38**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-clinger1987-3 - "[3]"

**link#39**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-hartheimer1987-4 - "[4]"

**link#40**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-kidd2007-5 - "[5]"

**link#41**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-cleis2006-6 - "[6]"

**link#42**: https://en.wikipedia.org/wiki/Clojure - "Clojure"

**link#43**: https://en.wikipedia.org/wiki/Wolfram_Language - "Wolfram Language"

**link#44**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-reference.wolfram.com-7 - "[7]"

**link#45**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-Amath-CO-8 - "[8]"

**link#46**: https://en.wikipedia.org/wiki/Racket_(programming_language) - "Racket"

**link#47**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-racket-video-games-9 - "[9]"

**link#48**: https://en.wikipedia.org/wiki/Erlang_(programming_language) - "Erlang"

**link#49**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-erlang-faq-10 - "[10]"

**link#50**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-armstrong2007-11 - "[11]"

**link#51**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-larson2009-12 - "[12]"

**link#52**: https://en.wikipedia.org/wiki/Elixir_(programming_language) - "Elixir"

**link#53**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-13 - "[13]"

**link#54**: https://en.wikipedia.org/wiki/OCaml - "OCaml"

**link#55**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-minksy2008-14 - "[14]"

**link#56**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-leroy2007-15 - "[15]"

**link#57**: https://en.wikipedia.org/wiki/Haskell - "Haskell"

**link#58**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-haskell-industry-16 - "[16]"

**link#59**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-hudak2007-17 - "[17]"

**link#60**: https://en.wikipedia.org/wiki/F_Sharp_(programming_language) - "F#"

**link#61**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-quantFSharp-18 - "[18]"

**link#62**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-businessAppsFSharp-19 - "[19]"

**link#63**: https://en.wikipedia.org/wiki/Lean_(proof_assistant) - "Lean"

**link#64**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-20 - "[20]"

**link#65**: https://en.wikipedia.org/wiki/JavaScript - "JavaScript"

**link#66**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-21 - "[21]"

**link#67**: https://en.wikipedia.org/wiki/R_(programming_language) - "R"

**link#68**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-useR-22 - "[22]"

**link#69**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-Chambers-23 - "[23]"

**link#70**: https://en.wikipedia.org/wiki/J_(programming_language) - "J"

**link#71**: https://en.wikipedia.org/wiki/K_(programming_language) - "K"

**link#72**: https://en.wikipedia.org/wiki/Q_(programming_language_from_Kx_Systems) - "Q"

**link#73**: https://en.wikipedia.org/wiki/XQuery - "XQuery"

**link#74**: https://en.wikipedia.org/wiki/XSLT - "XSLT"

**link#75**: https://en.wikipedia.org/wiki/XML - "XML"

**link#76**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-Novatchev-24 - "[24]"

**link#77**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-Mertz-25 - "[25]"

**link#78**: https://en.wikipedia.org/wiki/SQL - "SQL"

**link#79**: https://en.wikipedia.org/wiki/Lex_(software) - "Lex"

**link#80**: https://en.wikipedia.org/wiki/Yacc - "Yacc"

**link#81**: https://en.wikipedia.org/wiki/Mutable_object - "mutable values"

**link#82**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-Chamberlin_Boyce-26 - "[26]"

**link#83**: https://en.wikipedia.org/wiki/C%2B%2B11 - "C++11"

**link#84**: https://en.wikipedia.org/wiki/C_Sharp_(programming_language) - "C#"

**link#85**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-27 - "[27]"

**link#86**: https://en.wikipedia.org/wiki/Kotlin_(programming_language) - "Kotlin"

**link#87**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-:0-28 - "[28]"

**link#88**: https://en.wikipedia.org/wiki/Perl - "Perl"

**link#89**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-29 - "[29]"

**link#90**: https://en.wikipedia.org/wiki/PHP - "PHP"

**link#91**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-30 - "[30]"

**link#92**: https://en.wikipedia.org/wiki/Python_(programming_language) - "Python"

**link#93**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-AutoNT-13-31 - "[31]"

**link#94**: https://en.wikipedia.org/wiki/Go_(programming_language) - "Go"

**link#95**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-32 - "[32]"

**link#96**: https://en.wikipedia.org/wiki/Rust_(programming_language) - "Rust"

**link#97**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-33 - "[33]"

**link#98**: https://en.wikipedia.org/wiki/Raku_(programming_language) - "Raku"

**link#99**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-34 - "[34]"

**link#100**: https://en.wikipedia.org/wiki/Scala_(programming_language) - "Scala"

**link#101**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-effective-scala-35 - "[35]"

**link#102**: https://en.wikipedia.org/wiki/Java_(programming_language) - "Java (since Java 8)"

**link#103**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-java-8-javadoc-36 - "[36]"

**link#104**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=1 - "edit"

**link#105**: https://en.wikipedia.org/wiki/Alonzo_Church - "Alonzo Church"

**link#106**: https://en.wikipedia.org/wiki/Formal_system - "formal system"

**link#107**: https://en.wikipedia.org/wiki/Computation - "computation"

**link#108**: https://en.wikipedia.org/wiki/Alan_Turing - "Alan Turing"

**link#109**: https://en.wikipedia.org/wiki/Turing_machines - "Turing machines"

**link#110**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-37 - "[37]"

**link#111**: https://en.wikipedia.org/wiki/Turing_complete - "Turing complete"

**link#112**: https://en.wikipedia.org/wiki/Combinatory_logic - "combinatory logic"

**link#113**: https://en.wikipedia.org/wiki/Moses_Sch%C3%B6nfinkel - "Moses Schönfinkel"

**link#114**: https://en.wikipedia.org/wiki/Haskell_Curry - "Haskell Curry"

**link#115**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-38 - "[38]"

**link#116**: https://en.wikipedia.org/wiki/Simply_typed_lambda_calculus - "simply typed lambda calculus"

**link#117**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-39 - "[39]"

**link#118**: https://en.wikipedia.org/wiki/High-level_programming_language - "high-level"

**link#119**: https://en.wikipedia.org/wiki/Lisp_(programming_language) - "Lisp"

**link#120**: https://en.wikipedia.org/wiki/IBM_700/7000_series#Scientific_Architecture - "IBM 700/7000 series"

**link#121**: https://en.wikipedia.org/wiki/John_McCarthy_(computer_scientist) - "John McCarthy"

**link#122**: https://en.wikipedia.org/wiki/Massachusetts_Institute_of_Technology - "Massachusetts Institute of Technology"

**link#123**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-40 - "[40]"

**link#124**: https://en.wikipedia.org/wiki/Recursion_(computer_science) - "recursive"

**link#125**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-41 - "[41]"

**link#126**: https://en.wikipedia.org/wiki/Programming_paradigm#Multi-paradigm - "multi-paradigm languages"

**link#127**: https://en.wikipedia.org/wiki/Dylan_(programming_language) - "Dylan"

**link#128**: https://en.wikipedia.org/wiki/Julia_(programming_language) - "Julia"

**link#129**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-42 - "[42]"

**link#130**: https://en.wikipedia.org/wiki/Information_Processing_Language - "Information Processing Language"

**link#131**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-43 - "[43]"

**link#132**: https://en.wikipedia.org/wiki/Assembly_language - "assembly-style language"

**link#133**: https://en.wikipedia.org/wiki/Kenneth_E._Iverson - "Kenneth E. Iverson"

**link#134**: https://en.wikipedia.org/wiki/APL_(programming_language) - "APL"

**link#135**: https://en.wikipedia.org/wiki/ISBN_(identifier) - "ISBN"

**link#136**: https://en.wikipedia.org/wiki/Special:BookSources/9780471430148 - "9780471430148"

**link#137**: https://en.wikipedia.org/wiki/John_Backus - "John Backus"

**link#138**: https://en.wikipedia.org/wiki/FP_(programming_language) - "FP"

**link#139**: https://en.wikipedia.org/wiki/Roger_Hui - "Roger Hui"

**link#140**: https://en.wikipedia.org/wiki/Arthur_Whitney_(computer_scientist) - "Arthur Whitney"

**link#141**: https://en.wikipedia.org/wiki/Peter_Landin - "Peter Landin"

**link#142**: https://en.wikipedia.org/wiki/SECD_machine - "SECD machine"

**link#143**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-44 - "[44]"

**link#144**: https://en.wikipedia.org/wiki/Abstract_machine - "abstract machine"

**link#145**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-45 - "[45]"

**link#146**: https://en.wikipedia.org/wiki/ALGOL_60 - "ALGOL 60"

**link#147**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-46 - "[46]"

**link#148**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-47 - "[47]"

**link#149**: https://en.wikipedia.org/wiki/ISWIM - "ISWIM"

**link#150**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-48 - "[48]"

**link#151**: https://en.wikipedia.org/wiki/Turing_Award - "Turing Award"

**link#152**: https://en.wikipedia.org/wiki/Von_Neumann_architecture - "von Neumann"

**link#153**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-Backus_1977-49 - "[49]"

**link#154**: https://en.wikipedia.org/wiki/Principle_of_compositionality - "principle of compositionality"

**link#155**: https://en.wikipedia.org/wiki/Wikipedia:Citation_needed - "citation needed"

**link#156**: https://en.wikipedia.org/wiki/Function-level_programming - "function-level programming"

**link#157**: https://en.wikipedia.org/wiki/ML_(programming_language) - "ML"

**link#158**: https://en.wikipedia.org/wiki/Robin_Milner - "Robin Milner"

**link#159**: https://en.wikipedia.org/wiki/University_of_Edinburgh - "University of Edinburgh"

**link#160**: https://en.wikipedia.org/wiki/David_Turner_(computer_scientist) - "David Turner"

**link#161**: https://en.wikipedia.org/wiki/SASL_(programming_language) - "SASL"

**link#162**: https://en.wikipedia.org/wiki/University_of_St_Andrews - "University of St Andrews"

**link#163**: https://en.wikipedia.org/wiki/NPL_(programming_language) - "NPL"

**link#164**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-50 - "[50]"

**link#165**: https://en.wikipedia.org/wiki/Kleene%27s_recursion_theorem - "Kleene Recursion Equations"

**link#166**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-51 - "[51]"

**link#167**: https://en.wikipedia.org/wiki/Polymorphism_(computer_science) - "polymorphic"

**link#168**: https://en.wikipedia.org/wiki/Hope_(programming_language) - "Hope"

**link#169**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-52 - "[52]"

**link#170**: https://en.wikipedia.org/wiki/Standard_ML - "Standard ML"

**link#171**: https://en.wikipedia.org/wiki/Guy_L._Steele - "Guy L. Steele"

**link#172**: https://en.wikipedia.org/wiki/Gerald_Jay_Sussman - "Gerald Jay Sussman"

**link#173**: https://en.wikipedia.org/wiki/Lambda_Papers - "Lambda Papers"

**link#174**: https://en.wikipedia.org/wiki/Structure_and_Interpretation_of_Computer_Programs - "Structure and Interpretation of Computer Programs"

**link#175**: https://en.wikipedia.org/wiki/Lexical_scope - "lexical scoping"

**link#176**: https://en.wikipedia.org/wiki/Tail-call_optimization - "tail-call optimization"

**link#177**: https://en.wikipedia.org/wiki/Per_Martin-L%C3%B6f - "Per Martin-Löf"

**link#178**: https://en.wikipedia.org/wiki/Intuitionistic_type_theory - "intuitionistic type theory"

**link#179**: https://en.wikipedia.org/wiki/Constructive_proof - "constructive proofs"

**link#180**: https://en.wikipedia.org/wiki/Dependent_type - "dependent types"

**link#181**: https://en.wikipedia.org/wiki/Interactive_theorem_proving - "interactive theorem proving"

**link#182**: https://en.wikipedia.org/wiki/Miranda_(programming_language) - "Miranda"

**link#183**: https://en.wikipedia.org/wiki/Open_standard - "open standard"

**link#184**: https://en.wikipedia.org/wiki/Computer_Aided_Design - "CAD"

**link#185**: https://en.wikipedia.org/wiki/OpenSCAD - "OpenSCAD"

**link#186**: https://en.wikipedia.org/wiki/CGAL - "CGAL"

**link#187**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-53 - "[53]"

**link#188**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-54 - "[54]"

**link#189**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-55 - "[55]"

**link#190**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-56 - "[56]"

**link#191**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=2 - "edit"

**link#192**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-57 - "[57]"

**link#193**: https://en.wikipedia.org/wiki/Object-oriented_programming - "object-oriented programming"

**link#194**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-58 - "[58]"

**link#195**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=3 - "edit"

**link#196**: https://en.wikipedia.org/wiki/First-class_function - "First-class function"

**link#197**: https://en.wikipedia.org/wiki/Higher-order_function - "Higher-order function"

**link#198**: https://en.wikipedia.org/wiki/Differential_operator - "differential operator"

**link#199**: https://en.wikipedia.org/wiki/Derivative - "derivative"

**link#200**: https://en.wikipedia.org/wiki/Partial_application - "partial application"

**link#201**: https://en.wikipedia.org/wiki/Currying - "currying"

**link#202**: https://en.wikipedia.org/wiki/Successor_function - "successor function"

**link#203**: https://en.wikipedia.org/wiki/Natural_number - "natural number"

**link#204**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=4 - "edit"

**link#205**: https://en.wikipedia.org/wiki/Referential_transparency - "referential transparency"

**link#206**: https://en.wikipedia.org/wiki/Idempotence - "idempotence"

**link#207**: https://en.wikipedia.org/wiki/Memoization - "memoization"

**link#208**: https://en.wikipedia.org/wiki/Parallelization - "parallel"

**link#209**: https://en.wikipedia.org/wiki/Thread-safe - "thread-safe"

**link#210**: https://en.wikipedia.org/wiki/Deforestation_(computer_science) - "deforestation"

**link#211**: https://en.wikipedia.org/wiki/GNU_Compiler_Collection - "gcc"

**link#212**: https://en.wikipedia.org/wiki/Fortran_95 - "Fortran 95"

**link#213**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-fortran95-59 - "[59]"

**link#214**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=5 - "edit"

**link#215**: https://en.wikipedia.org/wiki/Iteration - "Iteration"

**link#216**: https://en.wikipedia.org/wiki/Recursion - "recursion"

**link#217**: https://en.wikipedia.org/wiki/Call_stack - "stack"

**link#218**: https://en.wikipedia.org/wiki/Tail_recursion - "tail recursion"

**link#219**: https://en.wikipedia.org/wiki/Continuation_passing_style - "continuation passing style"

**link#220**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-SchemeProperTailRec-60 - "[60]"

**link#221**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-61 - "[61]"

**link#222**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-62 - "[62]"

**link#223**: https://en.wikipedia.org/wiki/Chicken_(Scheme_implementation) - "Chicken"

**link#224**: https://en.wikipedia.org/wiki/Stack_overflow - "stack overflow"

**link#225**: https://en.wikipedia.org/wiki/Garbage_collection_(computer_science) - "garbage collector"

**link#226**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-63 - "[63]"

**link#227**: https://en.wikipedia.org/wiki/Catamorphism - "catamorphisms"

**link#228**: https://en.wikipedia.org/wiki/Anamorphism - "anamorphisms"

**link#229**: https://en.wikipedia.org/wiki/Program_loops - "loops"

**link#230**: https://en.wikipedia.org/wiki/Imperative_languages - "imperative languages"

**link#231**: https://en.wikipedia.org/wiki/Halting_problem - "halting problem"

**link#232**: https://en.wikipedia.org/wiki/Undecidable_problem - "undecidable"

**link#233**: https://en.wikipedia.org/wiki/Equational_reasoning - "equational reasoning"

**link#234**: https://en.wikipedia.org/wiki/Inconsistency - "inconsistency"

**link#235**: https://en.wikipedia.org/wiki/Type_system - "type system"

**link#236**: https://en.wikipedia.org/wiki/Coq_(software) - "Coq"

**link#237**: https://en.wikipedia.org/wiki/Well-founded - "well-founded"

**link#238**: https://en.wikipedia.org/wiki/Strongly_normalizing - "strongly normalizing"

**link#239**: https://en.wikipedia.org/wiki/Codata_(computer_science) - "codata"

**link#240**: https://en.wikipedia.org/wiki/Total_functional_programming - "total functional programming"

**link#241**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-totalfp-64 - "[64]"

**link#242**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=6 - "edit"

**link#243**: https://en.wikipedia.org/wiki/Evaluation_strategy - "Evaluation strategy"

**link#244**: https://en.wikipedia.org/wiki/Denotational_semantics - "denotational semantics"

**link#245**: https://en.wikipedia.org/wiki/Graph_reduction - "graph reduction"

**link#246**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-65 - "[65]"

**link#247**: https://en.wikipedia.org/wiki/Clean_(programming_language) - "Clean"

**link#248**: https://en.wikipedia.org/wiki/Functional_programming#CITEREFHughes1984 - "Hughes 1984"

**link#249**: https://en.wikipedia.org/wiki/Separation_of_concerns - "separation of concerns"

**link#250**: https://en.wikipedia.org/wiki/Operational_semantics - "operational semantics"

**link#251**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-launchbury1993-66 - "[66]"

**link#252**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-67 - "[67]"

**link#253**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=7 - "edit"

**link#254**: https://en.wikipedia.org/wiki/Hindley%E2%80%93Milner_type_inference - "Hindley–Milner type inference"

**link#255**: https://en.wikipedia.org/wiki/Typed_lambda_calculus - "typed lambda calculus"

**link#256**: https://en.wikipedia.org/wiki/False_positives_and_false_negatives#False_positive_error - "false positive errors"

**link#257**: https://en.wikipedia.org/wiki/Untyped_lambda_calculus - "untyped lambda calculus"

**link#258**: https://en.wikipedia.org/wiki/False_positives_and_false_negatives#False_negative_error - "false negative errors"

**link#259**: https://en.wikipedia.org/wiki/Algebraic_data_type - "algebraic data types"

**link#260**: https://en.wikipedia.org/wiki/Test-driven_development - "test-driven development"

**link#261**: https://en.wikipedia.org/wiki/Type_inference - "type inference"

**link#262**: https://en.wikipedia.org/wiki/Agda_(programming_language) - "Agda"

**link#263**: https://en.wikipedia.org/wiki/Lennart_Augustsson - "Cayenne"

**link#264**: https://en.wikipedia.org/wiki/Epigram_(programming_language) - "Epigram"

**link#265**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-68 - "[68]"

**link#266**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-69 - "[69]"

**link#267**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-70 - "[70]"

**link#268**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-71 - "[71]"

**link#269**: https://en.wikipedia.org/wiki/Higher-order_logic - "higher-order logic"

**link#270**: https://en.wikipedia.org/wiki/Curry%E2%80%93Howard_isomorphism - "Curry–Howard isomorphism"

**link#271**: https://en.wikipedia.org/wiki/Mathematical_proof - "mathematical proofs"

**link#272**: https://en.wikipedia.org/wiki/Formalized_mathematics - "formalized mathematics"

**link#273**: https://en.wikipedia.org/wiki/Compcert - "Compcert"

**link#274**: https://en.wikipedia.org/wiki/Compiler - "compiler"

**link#275**: https://en.wikipedia.org/wiki/C_(programming_language) - "C"

**link#276**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-72 - "[72]"

**link#277**: https://en.wikipedia.org/wiki/Generalized_algebraic_data_type - "generalized algebraic data types"

**link#278**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-73 - "[73]"

**link#279**: https://en.wikipedia.org/wiki/Glasgow_Haskell_Compiler - "Glasgow Haskell Compiler"

**link#280**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-74 - "[74]"

**link#281**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-75 - "[75]"

**link#282**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-76 - "[76]"

**link#283**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=8 - "edit"

**link#284**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-77 - "[77]"

**link#285**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=9 - "edit"

**link#286**: https://en.wikipedia.org/wiki/Purely_functional_data_structure - "Purely functional data structure"

**link#287**: https://en.wikipedia.org/wiki/Data_structure - "data structures"

**link#288**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-78 - "[78]"

**link#289**: https://en.wikipedia.org/wiki/Array_data_structure - "array"

**link#290**: https://en.wikipedia.org/wiki/Hash_table - "hash table"

**link#291**: https://en.wikipedia.org/wiki/Binary_heap - "binary heap"

**link#292**: https://en.wikipedia.org/wiki/Map_(computer_science) - "maps"

**link#293**: https://en.wikipedia.org/wiki/Logarithm - "logarithmic"

**link#294**: https://en.wikipedia.org/wiki/Persistent_data_structure - "persistence"

**link#295**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-79 - "[79]"

**link#296**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=10 - "edit"

**link#297**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=11 - "edit"

**link#298**: https://en.wikipedia.org/wiki/Off-by-one_error - "off-by-one errors"

**link#299**: https://en.wikipedia.org/wiki/Greenspun%27s_tenth_rule - "Greenspun's tenth rule"

**link#300**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=12 - "edit"

**link#301**: https://en.wikipedia.org/wiki/Monad_(functional_programming) - "monads"

**link#302**: https://en.wikipedia.org/wiki/Category_theory - "category theory"

**link#303**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-80 - "[80]"

**link#304**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-81 - "[81]"

**link#305**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-82 - "[82]"

**link#306**: https://en.wikipedia.org/wiki/Hoare_logic - "Hoare logic"

**link#307**: https://en.wikipedia.org/wiki/Uniqueness_type - "uniqueness"

**link#308**: https://en.wikipedia.org/wiki/Effect_system - "effect systems"

**link#309**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-83 - "[83]"

**link#310**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=13 - "edit"

**link#311**: https://en.wikipedia.org/wiki/Central_processing_unit - "CPU"

**link#312**: https://en.wikipedia.org/wiki/Pascal_(programming_language) - "Pascal"

**link#313**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-84 - "[84]"

**link#314**: https://en.wikipedia.org/w/index.php?title=Pointer_chasing&action=edit&redlink=1 - "pointer chasing"

**link#315**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-Spiewak-85 - "[85]"

**link#316**: https://en.wikipedia.org/wiki/The_Computer_Language_Benchmarks_Game - "The Computer Language Benchmarks Game"

**link#317**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-86 - "[86]"

**link#318**: https://en.wikipedia.org/wiki/Matrix_(mathematics) - "matrices"

**link#319**: https://en.wikipedia.org/wiki/Database - "databases"

**link#320**: https://en.wikipedia.org/wiki/Array_programming - "array"

**link#321**: https://en.wikipedia.org/wiki/Inline_expansion - "inline expansion"

**link#322**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-87 - "[87]"

**link#323**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-88 - "[88]"

**link#324**: https://en.wikipedia.org/wiki/Reference_(computer_science) - "references"

**link#325**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-89 - "[89]"

**link#326**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-90 - "[90]"

**link#327**: https://en.wikipedia.org/wiki/Shared-nothing_architecture - "shared-nothing"

**link#328**: https://en.wikipedia.org/wiki/Parallel_computing - "concurrent and parallel"

**link#329**: https://en.wikipedia.org/wiki/Linearizability - "atomic"

**link#330**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-91 - "[91]"

**link#331**: https://en.wikipedia.org/wiki/Message_passing - "message passing"

**link#332**: https://en.wikipedia.org/wiki/Actor_model - "actor model"

**link#333**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-92 - "[92]"

**link#334**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-93 - "[93]"

**link#335**: https://en.wikipedia.org/wiki/Akka_(toolkit) - "Akka"

**link#336**: https://en.wikipedia.org/wiki/Lazy_evaluation - "Lazy evaluation"

**link#337**: https://en.wikipedia.org/wiki/Memory_leak - "memory leaks"

**link#338**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-94 - "[94]"

**link#339**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=14 - "edit"

**link#340**: https://en.wikipedia.org/wiki/Map_(higher-order_function) - "map"

**link#341**: https://en.wikipedia.org/wiki/Filter_(higher-order_function) - "filter"

**link#342**: https://en.wikipedia.org/wiki/Benchmarking - "benchmarked"

**link#343**: https://clojars.org/criterium - "Criterium"

**link#344**: https://en.wikipedia.org/wiki/Zen_3 - "Ryzen 7900X"

**link#345**: https://en.wikipedia.org/wiki/Leiningen_(software) - "Leiningen"

**link#346**: https://en.wikipedia.org/wiki/REPL - "REPL"

**link#347**: https://en.wikipedia.org/wiki/JVM - "Java VM"

**link#348**: https://github.com/samber/lo - "lo library"

**link#349**: https://en.wikipedia.org/wiki/Generic_programming - "generics"

**link#350**: https://en.wikipedia.org/wiki/Memory_management - "allocation"

**link#351**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-95 - "[95]"

**link#352**: https://en.wikipedia.org/wiki/Inlining - "inlining"

**link#353**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-96 - "[96]"

**link#354**: https://en.wikipedia.org/wiki/Loop_unrolling - "loop unrolling"

**link#355**: https://en.wikipedia.org/wiki/Register_allocation - "will be stored in specific CPU registers"

**link#356**: https://en.wikipedia.org/wiki/Time_complexity - "constant-time access"

**link#357**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-97 - "[97]"

**link#358**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=15 - "edit"

**link#359**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-98 - "[98]"

**link#360**: https://en.wikipedia.org/wiki/D_(programming_language) - "D"

**link#361**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-99 - "[99]"

**link#362**: https://en.wikipedia.org/wiki/Lua_(programming_language) - "Lua"

**link#363**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-100 - "[100]"

**link#364**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-101 - "[101]"

**link#365**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-102 - "[102]"

**link#366**: https://en.wikipedia.org/wiki/Anonymous_function - "lambda"

**link#367**: https://en.wikipedia.org/wiki/Fold_(higher-order_function) - "reduce"

**link#368**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-103 - "[103]"

**link#369**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-104 - "[104]"

**link#370**: https://en.wikipedia.org/wiki/Visual_Basic_9 - "Visual Basic 9"

**link#371**: https://en.wikipedia.org/wiki/Closure_(computer_science) - "closures"

**link#372**: https://en.wikipedia.org/wiki/Higher-Order_Perl - "Higher-Order Perl"

**link#373**: https://en.wikipedia.org/wiki/Anonymous_class - "anonymous classes"

**link#374**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-105 - "[105]"

**link#375**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-106 - "[106]"

**link#376**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-107 - "[107]"

**link#377**: https://en.wikipedia.org/wiki/Object-oriented - "object-oriented"

**link#378**: https://en.wikipedia.org/wiki/Design_pattern_(computer_science) - "design patterns"

**link#379**: https://en.wikipedia.org/wiki/Strategy_pattern - "strategy pattern"

**link#380**: https://en.wikipedia.org/wiki/Visitor_(design_pattern) - "visitor"

**link#381**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-108 - "[108]"

**link#382**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-109 - "[109]"

**link#383**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=16 - "edit"

**link#384**: https://en.wikipedia.org/wiki/Logic_programming - "Logic programming"

**link#385**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-110 - "[110]"

**link#386**: https://en.wikipedia.org/wiki/Ciao_(programming_language) - "Ciao"

**link#387**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-111 - "[111]"

**link#388**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=17 - "edit"

**link#389**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=18 - "edit"

**link#390**: https://en.wikipedia.org/wiki/Emacs - "Emacs"

**link#391**: https://en.wikipedia.org/wiki/Emacs_Lisp - "Lisp dialect"

**link#392**: https://en.wikipedia.org/wiki/GNU_Emacs - "GNU Emacs"

**link#393**: https://en.wikipedia.org/wiki/Richard_Stallman - "Richard Stallman"

**link#394**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-112 - "[112]"

**link#395**: https://en.wikipedia.org/w/index.php?title=Helix_(text_editor)&action=edit&redlink=1 - "Helix"

**link#396**: https://en.wikipedia.org/wiki/Abstract_syntax_tree - "AST"

**link#397**: https://en.wikipedia.org/wiki/S-expression - "S-expressions"

**link#398**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-113 - "[113]"

**link#399**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=19 - "edit"

**link#400**: https://en.wikipedia.org/wiki/Spreadsheet - "Spreadsheets"

**link#401**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-Wakeling2007-114 - "[114]"

**link#402**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-excel-115 - "[115]"

**link#403**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=20 - "edit"

**link#404**: https://en.wikipedia.org/wiki/Microservices - "microservices"

**link#405**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-116 - "[116]"

**link#406**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=21 - "edit"

**link#407**: https://en.wikipedia.org/wiki/Programming_language_theory - "programming language theory"

**link#408**: https://en.wikipedia.org/wiki/Peer-review - "peer-reviewed"

**link#409**: https://en.wikipedia.org/wiki/International_Conference_on_Functional_Programming - "International Conference on Functional Programming"

**link#410**: https://en.wikipedia.org/wiki/Journal_of_Functional_Programming - "Journal of Functional Programming"

**link#411**: https://en.wikipedia.org/wiki/Symposium_on_Trends_in_Functional_Programming - "Symposium on Trends in Functional Programming"

**link#412**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=22 - "edit"

**link#413**: https://en.wikipedia.org/wiki/Sweden - "Swedish"

**link#414**: https://en.wikipedia.org/wiki/Ericsson - "Ericsson"

**link#415**: https://en.wikipedia.org/wiki/Fault_tolerance - "fault-tolerant"

**link#416**: https://en.wikipedia.org/wiki/Telecommunications - "telecommunications"

**link#417**: https://en.wikipedia.org/wiki/Nortel - "Nortel"

**link#418**: https://en.wikipedia.org/wiki/Facebook - "Facebook"

**link#419**: https://en.wikipedia.org/wiki/%C3%89lectricit%C3%A9_de_France - "Électricité de France"

**link#420**: https://en.wikipedia.org/wiki/WhatsApp - "WhatsApp"

**link#421**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-117 - "[117]"

**link#422**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-Sim-Diasca-118 - "[118]"

**link#423**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-whatsapp.blog.2012-119 - "[119]"

**link#424**: https://en.wikipedia.org/wiki/Apple_Macintosh - "Apple Macintosh"

**link#425**: https://en.wikipedia.org/wiki/Computer_simulation - "simulation software"

**link#426**: https://en.wikipedia.org/wiki/Telescope - "telescope"

**link#427**: https://en.wikipedia.org/wiki/Software_driver - "driver"

**link#428**: https://en.wikipedia.org/wiki/Robot - "robot"

**link#429**: https://en.wikipedia.org/wiki/Embedded_software - "embedded software"

**link#430**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-120 - "[120]"

**link#431**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-121 - "[121]"

**link#432**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-122 - "[122]"

**link#433**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-123 - "[123]"

**link#434**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-124 - "[124]"

**link#435**: https://en.wikipedia.org/wiki/Data_science - "Data science"

**link#436**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-125 - "[125]"

**link#437**: https://en.wikipedia.org/wiki/ClojureScript - "ClojureScript"

**link#438**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-126 - "[126]"

**link#439**: https://en.wikipedia.org/wiki/Elm_(programming_language) - "Elm"

**link#440**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-127 - "[127]"

**link#441**: https://en.wikipedia.org/wiki/PureScript - "PureScript"

**link#442**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-128 - "[128]"

**link#443**: https://en.wikipedia.org/wiki/Font_Awesome - "Font Awesome"

**link#444**: https://en.wikipedia.org/wiki/Allegro_Platform - "Allegro"

**link#445**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-129 - "[129]"

**link#446**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-130 - "[130]"

**link#447**: https://en.wikipedia.org/wiki/Gr%C3%B6bner_basis - "Gröbner basis"

**link#448**: https://en.wikipedia.org/wiki/Comprehensive_Capital_Analysis_and_Review - "Comprehensive Capital Analysis and Review"

**link#449**: https://en.wikipedia.org/wiki/Caml - "Caml"

**link#450**: https://en.wikipedia.org/wiki/Categorical_abstract_machine - "categorical abstract machine"

**link#451**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=23 - "edit"

**link#452**: https://en.wikipedia.org/wiki/University - "universities"

**link#453**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-oxfordFP-131 - "[131]"

**link#454**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-imperialFP-132 - "[132]"

**link#455**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-nottinghamFP-133 - "[133]"

**link#456**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-mitFP-134 - "[134]"

**link#457**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-61A-135 - "[135]"

**link#458**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-bootstrapworld-136 - "[136]"

**link#459**: https://en.wikipedia.org/wiki/Structure_and_Interpretation_of_Classical_Mechanics - "Structure and Interpretation of Classical Mecha..."

**link#460**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-137 - "[137]"

**link#461**: https://en.wikipedia.org/wiki/Functional_programming#cite_note-138 - "[138]"

**link#462**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=24 - "edit"

**link#463**: https://en.wikipedia.org/wiki/Portal:Computer_programming - "Computer programming portal"

**link#464**: https://en.wikipedia.org/wiki/Eager_evaluation - "Eager evaluation"

**link#465**: https://en.wikipedia.org/wiki/Functional_reactive_programming - "Functional reactive programming"

**link#466**: https://en.wikipedia.org/wiki/Inductive_functional_programming - "Inductive functional programming"

**link#467**: https://en.wikipedia.org/wiki/List_of_functional_programming_languages - "List of functional programming languages"

**link#468**: https://en.wikipedia.org/wiki/List_of_functional_programming_topics - "List of functional programming topics"

**link#469**: https://en.wikipedia.org/wiki/Nested_function - "Nested function"

**link#470**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=25 - "edit"

**link#471**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-hudak1989_1-0 - "^"

**link#472**: https://en.wikipedia.org/wiki/Paul_Hudak - "Hudak, Paul"

**link#473**: https://web.archive.org/web/20160131083528/http://www.dbnet.ece.ntua.gr/~adamo/languages/books/p359-hudak.pdf - ""Conception, evolution, and application of func..."

**link#474**: https://en.wikipedia.org/wiki/Doi_(identifier) - "doi"

**link#475**: https://doi.org/10.1145%2F72551.72554 - "10.1145/72551.72554"

**link#476**: https://en.wikipedia.org/wiki/S2CID_(identifier) - "S2CID"

**link#477**: https://api.semanticscholar.org/CorpusID:207637854 - "207637854"

**link#478**: http://www.dbnet.ece.ntua.gr/~adamo/languages/books/p359-hudak.pdf - "the original"

**link#479**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-hughesWhyFPMatters_2-0 - "Jump up to: a"

**link#480**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-hughesWhyFPMatters_2-1 - "b"

**link#481**: https://en.wikipedia.org/wiki/John_Hughes_(computer_scientist) - "Hughes, John"

**link#482**: http://www.cse.chalmers.se/~rjmh/Papers/whyfp.html - ""Why Functional Programming Matters""

**link#483**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-clinger1987_3-0 - "Jump up to: a"

**link#484**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-clinger1987_3-1 - "b"

**link#485**: http://www.mactech.com/articles/mactech/Vol.03/03.12/Multitasking/index.html - ""MultiTasking and MacScheme""

**link#486**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-hartheimer1987_4-0 - "Jump up to: a"

**link#487**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-hartheimer1987_4-1 - "b"

**link#488**: https://web.archive.org/web/20110629183752/http://www.mactech.com/articles/mactech/Vol.03/03.1/SchemeWindows/index.html - ""Programming a Text Editor in MacScheme+Toolsmith""

**link#489**: http://www.mactech.com/articles/mactech/Vol.03/03.1/SchemeWindows/index.html - "the original"

**link#490**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-kidd2007_5-0 - "Jump up to: a"

**link#491**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-kidd2007_5-1 - "b"

**link#492**: https://web.archive.org/web/20101221110947/http://cufp.galois.com/2007/abstracts.html#EricKidd - "Terrorism Response Training in Scheme"

**link#493**: http://cufp.galois.com/2007/abstracts.html#EricKidd - "the original"

**link#494**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-cleis2006_6-0 - "Jump up to: a"

**link#495**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-cleis2006_6-1 - "b"

**link#496**: https://web.archive.org/web/20100527100429/http://cufp.galois.com/2006/abstracts.html#RichardCleis - "Scheme in Space"

**link#497**: http://cufp.galois.com/2006/abstracts.html#RichardCleis - "the original"

**link#498**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-reference.wolfram.com_7-0 - "Jump up to: a"

**link#499**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-reference.wolfram.com_7-1 - "b"

**link#500**: http://reference.wolfram.com/language/guide/FunctionalProgramming.html - ""Wolfram Language Guide: Functional Programming""

**link#501**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-Amath-CO_8-0 - "^"

**link#502**: https://web.archive.org/web/20071113175801/http://amath.colorado.edu/computing/mmm/funcproc.html - ""Functional vs. Procedural Programming Language""

**link#503**: http://amath.colorado.edu/computing/mmm/funcproc.html - "the original"

**link#504**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-racket-video-games_9-0 - "^"

**link#505**: https://web.archive.org/web/20121215014637/http://www.gameenginebook.com/gdc09-statescripting-uncharted2.pdf - ""State-Based Scripting in Uncharted 2""

**link#506**: http://www.gameenginebook.com/gdc09-statescripting-uncharted2.pdf - "the original"

**link#507**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-erlang-faq_10-0 - "Jump up to: a"

**link#508**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-erlang-faq_10-1 - "b"

**link#509**: http://erlang.org/faq/introduction.html#idp32582608 - ""Who uses Erlang for product development?""

**link#510**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-armstrong2007_11-0 - "Jump up to: a"

**link#511**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-armstrong2007_11-1 - "b"

**link#512**: https://doi.org/10.1145%2F1238844.1238850 - "10.1145/1238844.1238850"

**link#513**: https://en.wikipedia.org/wiki/Special:BookSources/9781595937667 - "9781595937667"

**link#514**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-larson2009_12-0 - "Jump up to: a"

**link#515**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-larson2009_12-1 - "b"

**link#516**: https://doi.org/10.1145%2F1467247.1467263 - ""Erlang for concurrent programming""

**link#517**: https://api.semanticscholar.org/CorpusID:524392 - "524392"

**link#518**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-13 - "^"

**link#519**: https://elixir-lang.org/ - ""The Elixir Programming Language""

**link#520**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-minksy2008_14-0 - "Jump up to: a"

**link#521**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-minksy2008_14-1 - "b"

**link#522**: https://doi.org/10.1017%2FS095679680800676X - "10.1017/S095679680800676X"

**link#523**: https://api.semanticscholar.org/CorpusID:30955392 - "30955392"

**link#524**: https://en.wikipedia.org/wiki/Template:Cite_journal - "cite journal"

**link#525**: https://en.wikipedia.org/wiki/Category:CS1_maint:_DOI_inactive_as_of_November_2024 - "link"

**link#526**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-leroy2007_15-0 - "Jump up to: a"

**link#527**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-leroy2007_15-1 - "b"

**link#528**: https://web.archive.org/web/20111008170929/http://cufp.galois.com/2007/slides/XavierLeroy.pdf - "Some uses of Caml in Industry"

**link#529**: http://cufp.galois.com/2007/slides/XavierLeroy.pdf - "the original"

**link#530**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-haskell-industry_16-0 - "Jump up to: a"

**link#531**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-haskell-industry_16-1 - "b"

**link#532**: http://www.haskell.org/haskellwiki/Haskell_in_industry - ""Haskell in industry""

**link#533**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-hudak2007_17-0 - "Jump up to: a"

**link#534**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-hudak2007_17-1 - "b"

**link#535**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-hudak2007_17-2 - "c"

**link#536**: http://dl.acm.org/citation.cfm?doid=1238844.1238856 - "A history of Haskell: being lazy with class"

**link#537**: https://doi.org/10.1145%2F1238844.1238856 - "10.1145/1238844.1238856"

**link#538**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-quantFSharp_18-0 - "Jump up to: a"

**link#539**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-quantFSharp_18-1 - "b"

**link#540**: https://web.archive.org/web/20150708125937/http://cufp.galois.com/2008/abstracts.html#MansellHoward - "Quantitative Finance in F#"

**link#541**: http://cufp.galois.com/2008/abstracts.html#MansellHoward - "the original"

**link#542**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-businessAppsFSharp_19-0 - "Jump up to: a"

**link#543**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-businessAppsFSharp_19-1 - "b"

**link#544**: https://web.archive.org/web/20091017070140/http://cufp.galois.com/2009/abstracts.html#AlexPeakeAdamGranicz - "The First Substantial Line of Business Applicat..."

**link#545**: http://cufp.galois.com/2009/abstracts.html#AlexPeakeAdamGranicz - "the original"

**link#546**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-20 - "^"

**link#547**: https://doi.org/10.1007%2F978-3-030-79876-5_37 - "10.1007/978-3-030-79876-5_37"

**link#548**: https://en.wikipedia.org/wiki/ISSN_(identifier) - "ISSN"

**link#549**: https://search.worldcat.org/issn/1611-3349 - "1611-3349"

**link#550**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-21 - "^"

**link#551**: https://opensource.com/article/17/6/functional-javascript - ""An introduction to functional programming in J..."

**link#552**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-useR_22-0 - "^"

**link#553**: http://www.r-project.org/useR-2006/program.html - ""The useR! 2006 conference schedule includes pa..."

**link#554**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-Chambers_23-0 - "^"

**link#555**: https://en.wikipedia.org/wiki/John_Chambers_(programmer) - "Chambers, John M."

**link#556**: https://en.wikipedia.org/wiki/Special:BookSources/978-0-387-98503-9 - "978-0-387-98503-9"

**link#557**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-Novatchev_24-0 - "^"

**link#558**: http://fxsl.sourceforge.net/articles/FuncProg/Functional%20Programming.html - ""The Functional Programming Language XSLT — A p..."

**link#559**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-Mertz_25-0 - "^"

**link#560**: http://gnosis.cx/publish/programming/xml_models_fp.html - ""XML Programming Paradigms (part four): Functio..."

**link#561**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-Chamberlin_Boyce_26-0 - "^"

**link#562**: https://en.wikipedia.org/wiki/Donald_D._Chamberlin - "Chamberlin, Donald D."

**link#563**: https://en.wikipedia.org/wiki/Raymond_F._Boyce - "Boyce, Raymond F."

**link#564**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-27 - "^"

**link#565**: https://ghostarchive.org/varchive/youtube/20211030/gvyTB4aMI4o - "Functional Programming with C# - Simon Painter ..."

**link#566**: https://www.youtube.com/watch?v=gvyTB4aMI4o - "the original"

**link#567**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-:0_28-0 - "Jump up to: a"

**link#568**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-:0_28-1 - "b"

**link#569**: https://kotlinlang.org/docs/tutorials/kotlin-for-py/functional-programming.html - ""Functional programming - Kotlin Programming La..."

**link#570**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-29 - "^"

**link#571**: https://en.wikipedia.org/wiki/Mark_Jason_Dominus - "Dominus, Mark J."

**link#572**: https://en.wikipedia.org/wiki/Morgan_Kaufmann - "Morgan Kaufmann"

**link#573**: https://en.wikipedia.org/wiki/Special:BookSources/978-1-55860-701-9 - "978-1-55860-701-9"

**link#574**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-30 - "^"

**link#575**: https://en.wikipedia.org/wiki/Special:BookSources/9781940111056 - "9781940111056"

**link#576**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-AutoNT-13_31-0 - "^"

**link#577**: https://web.archive.org/web/20090530030205/http://www.python.org/community/pycon/dc2004/papers/24/metaclasses-pycon.pdf - ""Python Metaclasses: Who? Why? When?""

**link#578**: https://www.python.org/community/pycon/dc2004/papers/24/metaclasses-pycon.pdf - "the original"

**link#579**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-32 - "^"

**link#580**: https://www.youtube.com/watch?v=wqs8n5Uk5OM - ""GopherCon 2020: Dylan Meeus - Functional Progr..."

**link#581**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-33 - "^"

**link#582**: https://doc.rust-lang.org/book/ch13-00-functional-features.html - ""Functional Language Features: Iterators and Cl..."

**link#583**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-34 - "^"

**link#584**: https://web.archive.org/web/20200728013926/https://wimvanderbauwhede.github.io/articles/decluttering-with-functional-programming/ - ""Cleaner code with functional programming""

**link#585**: https://wimvanderbauwhede.github.io/articles/decluttering-with-functional-programming/ - "the original"

**link#586**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-effective-scala_35-0 - "^"

**link#587**: https://web.archive.org/web/20120619075044/http://twitter.github.com/effectivescala/?sd - ""Effective Scala""

**link#588**: https://twitter.github.com/effectivescala/?sd - "the original"

**link#589**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-java-8-javadoc_36-0 - "^"

**link#590**: https://docs.oracle.com/javase/8/docs/api/java/util/function/package-summary.html - ""Documentation for package java.util.function s..."

**link#591**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-37 - "^"

**link#592**: https://doi.org/10.2307%2F2268280 - "10.2307/2268280"

**link#593**: https://en.wikipedia.org/wiki/JSTOR_(identifier) - "JSTOR"

**link#594**: https://www.jstor.org/stable/2268280 - "2268280"

**link#595**: https://api.semanticscholar.org/CorpusID:2317046 - "2317046"

**link#596**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-38 - "^"

**link#597**: https://archive.org/details/combinatorylogic0002curr - "Combinatory Logic"

**link#598**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-39 - "^"

**link#599**: https://doi.org/10.2307%2F2266170 - "10.2307/2266170"

**link#600**: https://www.jstor.org/stable/2266170 - "2266170"

**link#601**: https://api.semanticscholar.org/CorpusID:15889861 - "15889861"

**link#602**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-40 - "^"

**link#603**: http://jmc.stanford.edu/articles/lisp/lisp.pdf - "History of Lisp"

**link#604**: https://doi.org/10.1145%2F800025.808387 - "10.1145/800025.808387"

**link#605**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-41 - "^"

**link#606**: http://jmc.stanford.edu/articles/recursive/recursive.pdf - ""Recursive functions of symbolic expressions an..."

**link#607**: https://doi.org/10.1145%2F367177.367199 - "10.1145/367177.367199"

**link#608**: https://api.semanticscholar.org/CorpusID:1489409 - "1489409"

**link#609**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-42 - "^"

**link#610**: http://dreamsongs.com/Files/HOPL2-Uncut.pdf - "History of programming languages---II"

**link#611**: https://doi.org/10.1145%2F234286.1057818 - "10.1145/234286.1057818"

**link#612**: https://en.wikipedia.org/wiki/Special:BookSources/978-0-201-89502-5 - "978-0-201-89502-5"

**link#613**: https://api.semanticscholar.org/CorpusID:47047140 - "47047140"

**link#614**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-43 - "^"

**link#615**: https://en.wikipedia.org/wiki/Herbert_A._Simon - "Herbert A. Simon"

**link#616**: https://en.wikipedia.org/wiki/Special:BookSources/0-465-04640-1 - "0-465-04640-1"

**link#617**: https://en.wikipedia.org/wiki/Logic_Theorist - "Logic Theorist"

**link#618**: https://en.wikipedia.org/wiki/Principia_Mathematica - "Principia Mathematica"

**link#619**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-44 - "^"

**link#620**: https://doi.org/10.1093%2Fcomjnl%2F6.4.308 - ""The mechanical evaluation of expressions""

**link#621**: https://en.wikipedia.org/wiki/The_Computer_Journal - "The Computer Journal"

**link#622**: https://en.wikipedia.org/wiki/British_Computer_Society - "British Computer Society"

**link#623**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-45 - "^"

**link#624**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-46 - "^"

**link#625**: https://doi.org/10.1145%2F363744.363749 - ""Correspondence between ALGOL 60 and Church's L..."

**link#626**: https://en.wikipedia.org/wiki/Communications_of_the_ACM - "Communications of the ACM"

**link#627**: https://en.wikipedia.org/wiki/Association_for_Computing_Machinery - "Association for Computing Machinery"

**link#628**: https://api.semanticscholar.org/CorpusID:6505810 - "6505810"

**link#629**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-47 - "^"

**link#630**: https://doi.org/10.1145%2F363791.363804 - ""A correspondence between ALGOL 60 and Church's..."

**link#631**: https://api.semanticscholar.org/CorpusID:15781851 - "15781851"

**link#632**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-48 - "^"

**link#633**: https://doi.org/10.1145%2F365230.365257 - ""The next 700 programming languages""

**link#634**: https://api.semanticscholar.org/CorpusID:13409665 - "13409665"

**link#635**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-Backus_1977_49-0 - "^"

**link#636**: https://doi.org/10.1145%2F359576.359579 - ""Can programming be liberated from the von Neum..."

**link#637**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-50 - "^"

**link#638**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-51 - "^"

**link#639**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-52 - "^"

**link#640**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-53 - "^"

**link#641**: https://web.archive.org/web/20230419060430/https://forum.openscad.org/Make-discovering-assign-easier-td10964.html - ""Make discovering assign() easier!""

**link#642**: https://forum.openscad.org/Make-discovering-assign-easier-td10964.html - "the original"

**link#643**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-54 - "^"

**link#644**: https://arstechnica.com/gadgets/2018/03/developers-love-trendy-new-languages-but-earn-more-with-functional-programming/ - ""Developers love trendy new languages but earn ..."

**link#645**: https://en.wikipedia.org/wiki/Ars_Technica - "Ars Technica"

**link#646**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-55 - "^"

**link#647**: https://www.computing.co.uk/ctg/analysis/3003123/the-slow-but-steady-rise-of-functional-programming - ""The stealthy rise of functional programming""

**link#648**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-56 - "^"

**link#649**: https://www.infoworld.com/article/3190185/software/is-functional-programming-better-for-your-startup.html - ""Is functional programming better for your star..."

**link#650**: https://en.wikipedia.org/wiki/InfoWorld - "InfoWorld"

**link#651**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-57 - "^"

**link#652**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-58 - "^"

**link#653**: https://web.archive.org/web/20060827094123/http://byte.com/art/9408/sec11/art1.htm - ""Functional Programming Comes of Age""

**link#654**: https://en.wikipedia.org/wiki/Byte_(magazine) - "Byte"

**link#655**: http://byte.com/art/9408/sec11/art1.htm - "the original"

**link#656**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-fortran95_59-0 - "Jump up to: a"

**link#657**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-fortran95_59-1 - "b"

**link#658**: https://wg5-fortran.org/N2101-N2150/N2137.pdf - ""ISO/IEC JTC 1/SC 22/WG5/N2137 – Fortran 2015 C..."

**link#659**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-SchemeProperTailRec_60-0 - "^"

**link#660**: http://www.r6rs.org/final/html/r6rs/r6rs-Z-H-8.html#node_sec_5.11 - ""Revised^6 Report on the Algorithmic Language S..."

**link#661**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-61 - "^"

**link#662**: http://www.r6rs.org/final/html/r6rs-rationale/r6rs-rationale-Z-H-7.html#node_sec_5.3 - ""Revised^6 Report on the Algorithmic Language S..."

**link#663**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-62 - "^"

**link#664**: https://doi.org/10.1145%2F277650.277719 - "10.1145/277650.277719"

**link#665**: https://en.wikipedia.org/wiki/Special:BookSources/0897919874 - "0897919874"

**link#666**: https://api.semanticscholar.org/CorpusID:16812984 - "16812984"

**link#667**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-63 - "^"

**link#668**: https://web.archive.org/web/20060303155622/http://home.pipeline.com/~hbaker1/CheneyMTA.html - ""CONS Should Not CONS Its Arguments, Part II: C..."

**link#669**: http://home.pipeline.com/~hbaker1/CheneyMTA.html - "the original"

**link#670**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-totalfp_64-0 - "^"

**link#671**: http://www.jucs.org/jucs_10_7/total_functional_programming - ""Total Functional Programming""

**link#672**: https://doi.org/10.3217%2Fjucs-010-07-0751 - "10.3217/jucs-010-07-0751"

**link#673**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-65 - "^"

**link#674**: http://research.microsoft.com/~simonpj/papers/slpj-book-1987/index.htm - "The Implementation of Functional Programming La..."

**link#675**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-launchbury1993_66-0 - "Jump up to: a"

**link#676**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-launchbury1993_66-1 - "b"

**link#677**: https://en.wikipedia.org/wiki/John_Launchbury - "Launchbury, John"

**link#678**: https://doi.org/10.1145%2F158511.158618 - "10.1145/158511.158618"

**link#679**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-67 - "^"

**link#680**: https://en.wikipedia.org/wiki/Robert_Harper_(computer_scientist) - "Robert W. Harper"

**link#681**: https://web.archive.org/web/20160407095249/https://www.cs.cmu.edu/~rwh/plbook/book.pdf - "Practical Foundations for Programming Languages"

**link#682**: https://www.cs.cmu.edu/~rwh/plbook/book.pdf - "the original"

**link#683**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-68 - "^"

**link#684**: https://doi.org/10.1016%2Fs0019-9958%2873%2990301-x - "10.1016/s0019-9958(73)90301-x"

**link#685**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-69 - "^"

**link#686**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-70 - "^"

**link#687**: http://pauillac.inria.fr/~huet/PUBLIC/Hampton.pdf - ""Higher Order Unification 30 years later""

**link#688**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-71 - "^"

**link#689**: https://en.wikipedia.org/wiki/CiteSeerX_(identifier) - "CiteSeerX"

**link#690**: https://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.31.3590 - "10.1.1.31.3590"

**link#691**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-72 - "^"

**link#692**: http://compcert.inria.fr/doc/index.html - ""The Compcert verified compiler""

**link#693**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-73 - "^"

**link#694**: https://en.wikipedia.org/wiki/Stephanie_Weirich - "Weirich, Stephanie"

**link#695**: http://research.microsoft.com/en-us/um/people/simonpj/papers/gadt/ - ""Simple unification-based type inference for GA..."

**link#696**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-74 - "^"

**link#697**: https://caml.inria.fr/pub/docs/manual-ocaml/gadts.html - ""OCaml Manual""

**link#698**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-75 - "^"

**link#699**: https://docs.scala-lang.org/scala3/book/types-adts-gadts.html - ""Algebraic Data Types""

**link#700**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-76 - "^"

**link#701**: https://web.archive.org/web/20061229164852/http://research.microsoft.com/~akenn/generics/gadtoop.pdf - "Generalized Algebraic Data Types and Object-Ori..."

**link#702**: https://doi.org/10.1145%2F1094811.1094814 - "10.1145/1094811.1094814"

**link#703**: https://en.wikipedia.org/wiki/Special:BookSources/9781595930316 - "9781595930316"

**link#704**: https://www.microsoft.com/en-us/research/publication/generalized-algebraic-data-types-and-object-oriented-programming/ - "the original"

**link#705**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-77 - "^"

**link#706**: http://www.cse.chalmers.se/~rjmh/Papers/whyfp.pdf - ""Why Functional Programming Matters""

**link#707**: https://en.wikipedia.org/wiki/Chalmers_University_of_Technology - "Chalmers University of Technology"

**link#708**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-78 - "^"

**link#709**: http://www.cambridge.org/us/academic/subjects/computer-science/algorithmics-complexity-computer-algebra-and-computational-g/purely-functional-data-structures - "Purely functional data structures"

**link#710**: https://en.wikipedia.org/wiki/Chris_Okasaki - "Chris Okasaki"

**link#711**: https://en.wikipedia.org/wiki/Cambridge_University_Press - "Cambridge University Press"

**link#712**: https://en.wikipedia.org/wiki/Special:BookSources/0-521-66350-4 - "0-521-66350-4"

**link#713**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-79 - "^"

**link#714**: http://www.hypirion.com/musings/understanding-persistent-vector-pt-1 - ""polymatheia - Understanding Clojure's Persiste..."

**link#715**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-80 - "^"

**link#716**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-81 - "^"

**link#717**: http://monads.haskell.cz/html/index.html/html/ - ""All About Monads: A comprehensive guide to the..."

**link#718**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-82 - "^"

**link#719**: https://fsharpforfunandprofit.com/posts/13-ways-of-looking-at-a-turtle/#2-basic-fp---a-module-of-functions-with-immutable-state - ""Thirteen ways of looking at a turtle""

**link#720**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-83 - "^"

**link#721**: https://doi.org/10.1007/3-540-16761-7_62 - "Automata, Languages and Programming"

**link#722**: https://doi.org/10.1007%2F3-540-16761-7_62 - "10.1007/3-540-16761-7_62"

**link#723**: https://en.wikipedia.org/wiki/Special:BookSources/978-3-540-16761-7 - "978-3-540-16761-7"

**link#724**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-84 - "^"

**link#725**: https://en.wikipedia.org/wiki/Lawrence_Paulson - "Paulson, Larry C."

**link#726**: https://books.google.com/books?id=XppZdaDs7e0C - "ML for the Working Programmer"

**link#727**: https://en.wikipedia.org/wiki/Special:BookSources/978-0-521-56543-1 - "978-0-521-56543-1"

**link#728**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-Spiewak_85-0 - "^"

**link#729**: https://web.archive.org/web/20150923205254/http://www.codecommit.com/blog/scala/implementing-persistent-vectors-in-scala - ""Implementing Persistent Vectors in Scala""

**link#730**: http://www.codecommit.com/blog/scala/implementing-persistent-vectors-in-scala - "the original"

**link#731**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-86 - "^"

**link#732**: https://web.archive.org/web/20130520162513/http://benchmarksgame.alioth.debian.org/u32/which-programs-are-fastest.php?gcc=on&ghc=on&clean=on&ocaml=on&sbcl=on&fsharp=on&racket=on&clojure=on&hipe=on&calc=chart - ""Which programs are fastest? | Computer Languag..."

**link#733**: http://benchmarksgame.alioth.debian.org/u32/which-programs-are-fastest.php?gcc=on&ghc=on&clean=on&ocaml=on&sbcl=on&fsharp=on&racket=on&clojure=on&hipe=on&calc=chart - "the original"

**link#734**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-87 - "^"

**link#735**: https://doi.org/10.1002%2Fcpe.853 - "10.1002/cpe.853"

**link#736**: https://api.semanticscholar.org/CorpusID:34527406 - "34527406"

**link#737**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-88 - "^"

**link#738**: https://www.infoq.com/articles/in-depth-look-clojure-collections/ - ""An In-Depth Look at Clojure Collections""

**link#739**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-89 - "^"

**link#740**: https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html - ""References and Borrowing - The Rust Programmin..."

**link#741**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-90 - "^"

**link#742**: https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html - ""Validating References with Lifetimes - The Rus..."

**link#743**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-91 - "^"

**link#744**: https://docs.oracle.com/javase/tutorial/essential/concurrency/collections.html - ""Concurrent Collections (The Java™ Tutorials > ..."

**link#745**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-92 - "^"

**link#746**: https://scaleyourapp.com/actor-model/ - ""Understanding The Actor Model To Build Non-blo..."

**link#747**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-93 - "^"

**link#748**: https://en.wikipedia.org/wiki/Special:BookSources/978-0-596-55585-6 - "978-0-596-55585-6"

**link#749**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-94 - "^"

**link#750**: http://book.realworldhaskell.org/read/profiling-and-optimization.html#x_eK1 - ""Chapter 25. Profiling and optimization""

**link#751**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-95 - "^"

**link#752**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-96 - "^"

**link#753**: https://go.dev/wiki/CompilerOptimizations - ""Go Wiki: Compiler And Runtime Optimizations - ..."

**link#754**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-97 - "^"

**link#755**: https://doc.rust-lang.org/book/ch13-04-performance.html - ""Comparing Performance: Loops vs. Iterators - T..."

**link#756**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-98 - "^"

**link#757**: https://web.archive.org/web/20110719201553/http://www.ub.utwente.nl/webdocs/ctit/1/00000084.pdf - ""The Functional C experience""

**link#758**: https://doi.org/10.1017%2FS0956796803004817 - "10.1017/S0956796803004817"

**link#759**: https://api.semanticscholar.org/CorpusID:32346900 - "32346900"

**link#760**: http://www.ub.utwente.nl/webdocs/ctit/1/00000084.pdf - "the original"

**link#761**: https://web.archive.org/web/20071016124848/http://www-128.ibm.com/developerworks/linux/library/l-prog3.html - ""Functional programming in Python, Part 3""

**link#762**: http://www-128.ibm.com/developerworks/linux/library/l-prog3.html - "the original"

**link#763**: https://web.archive.org/web/20071016124848/http://www-128.ibm.com/developerworks/linux/library/l-prog.html - "Part 1"

**link#764**: https://web.archive.org/web/20071016124848/http://www-128.ibm.com/developerworks/linux/library/l-prog2.html - "Part 2"

**link#765**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-99 - "^"

**link#766**: http://www.digitalmars.com/d/2.0/function.html#pure-functions - ""Functions — D Programming Language 2.0""

**link#767**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-100 - "^"

**link#768**: http://www.luafaq.org/#T1.2 - ""Lua Unofficial FAQ (uFAQ)""

**link#769**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-101 - "^"

**link#770**: https://golang.org/doc/codewalk/functions/ - ""First-Class Functions in Go - The Go Programmi..."

**link#771**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-102 - "^"

**link#772**: https://brendaneich.com/2008/04/popularity/ - ""Popularity""

**link#773**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-103 - "^"

**link#774**: https://en.wikipedia.org/wiki/Guido_van_Rossum - "van Rossum, Guido"

**link#775**: http://python-history.blogspot.de/2009/04/origins-of-pythons-functional-features.html - ""Origins of Python's "Functional" Features""

**link#776**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-104 - "^"

**link#777**: https://docs.python.org/dev/library/functools.html#functools.reduce - ""functools — Higher order functions and operati..."

**link#778**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-105 - "^"

**link#779**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-106 - "^"

**link#780**: https://web.archive.org/web/20130414180002/https://blogs.oracle.com/jag/entry/closures - ""Closures""

**link#781**: http://blogs.oracle.com/jag/entry/closures - "the original"

**link#782**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-107 - "^"

**link#783**: https://blogs.oracle.com/javatraining/entry/java_se_8_lambda_quick - ""Java SE 8 Lambda Quick Start""

**link#784**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-108 - "^"

**link#785**: https://archive.org/details/effectivejava00bloc_0 - "Effective Java"

**link#786**: https://en.wikipedia.org/wiki/Special:BookSources/978-0321356680 - "978-0321356680"

**link#787**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-109 - "^"

**link#788**: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze - ""Object.freeze() - JavaScript | MDN""

**link#789**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-110 - "^"

**link#790**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-111 - "^"

**link#791**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-112 - "^"

**link#792**: https://stallman.org/stallman-computing.html - ""How I do my Computing""

**link#793**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-113 - "^"

**link#794**: https://helix-editor.com/news/release-24-03-highlights/ - ""Helix""

**link#795**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-Wakeling2007_114-0 - "^"

**link#796**: http://www.activemode.org/webroot/Workers/ActiveTraining/Programming/Pro_SpreadsheetFunctionalProgramming.pdf - ""Spreadsheet functional programming""

**link#797**: https://doi.org/10.1017%2FS0956796806006186 - "10.1017/S0956796806006186"

**link#798**: https://search.worldcat.org/issn/0956-7968 - "0956-7968"

**link#799**: https://api.semanticscholar.org/CorpusID:29429059 - "29429059"

**link#800**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-excel_115-0 - "^"

**link#801**: https://en.wikipedia.org/wiki/Simon_Peyton_Jones - "Peyton Jones, Simon"

**link#802**: https://en.wikipedia.org/wiki/Margaret_Burnett - "Burnett, Margaret"

**link#803**: https://en.wikipedia.org/wiki/Alan_Blackwell - "Blackwell, Alan"

**link#804**: https://web.archive.org/web/20051016011341/http://research.microsoft.com/~simonpj/Papers/excel/index.htm - ""Improving the world's most popular functional ..."

**link#805**: http://research.microsoft.com/~simonpj/Papers/excel/index.htm - "the original"

**link#806**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-116 - "^"

**link#807**: https://en.wikipedia.org/wiki/Special:BookSources/9781638351733 - "9781638351733"

**link#808**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-117 - "^"

**link#809**: https://web.archive.org/web/20091017070140/http://cufp.galois.com/2009/abstracts.html#ChristopherPiroEugeneLetuchy - "Functional Programming at Facebook"

**link#810**: http://cufp.galois.com/2009/abstracts.html#ChristopherPiroEugeneLetuchy - "the original"

**link#811**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-Sim-Diasca_118-0 - "^"

**link#812**: https://web.archive.org/web/20130917092159/http://research.edf.com/research-and-the-scientific-community/software/sim-diasca-80704.html - ""Sim-Diasca: a large-scale discrete event concu..."

**link#813**: http://research.edf.com/research-and-the-scientific-community/software/sim-diasca-80704.html - "the original"

**link#814**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-whatsapp.blog.2012_119-0 - "^"

**link#815**: https://blog.whatsapp.com/index.php/2012/01/1-million-is-so-2011/ - "1 million is so 2011"

**link#816**: https://web.archive.org/web/20140219234031/http://blog.whatsapp.com/index.php/2012/01/1-million-is-so-2011/ - "Archived"

**link#817**: https://en.wikipedia.org/wiki/Wayback_Machine - "Wayback Machine"

**link#818**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-120 - "^"

**link#819**: https://web.archive.org/web/20091017070140/http://cufp.galois.com/2009/abstracts.html#LeeMomtahan - "Scala at EDF Trading: Implementing a Domain-Spe..."

**link#820**: http://cufp.galois.com/2009/abstracts.html#LeeMomtahan - "the original"

**link#821**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-121 - "^"

**link#822**: http://www.paulgraham.com/avg.html - ""Beating the Averages""

**link#823**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-122 - "^"

**link#824**: http://cufp.galois.com/2006/slides/SteveSims.pdf - "Building a Startup with Standard ML"

**link#825**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-123 - "^"

**link#826**: https://web.archive.org/web/20101221110947/http://cufp.galois.com/2007/abstracts.html#VilleLaurikari - "Functional Programming in Communications Security"

**link#827**: http://cufp.galois.com/2007/abstracts.html#VilleLaurikari - "the original"

**link#828**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-124 - "^"

**link#829**: http://www.infoq.com/news/2009/01/clojure_production - ""Live Production Clojure Application Announced""

**link#830**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-125 - "^"

**link#831**: https://en.wikipedia.org/wiki/Packt - "Packt"

**link#832**: https://en.wikipedia.org/wiki/Special:BookSources/9781785281372 - "9781785281372"

**link#833**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-126 - "^"

**link#834**: https://stackshare.io/clojurescript - ""Why developers like ClojureScript""

**link#835**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-127 - "^"

**link#836**: https://github.com/jah2488/elm-companies - "jah2488/elm-companies"

**link#837**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-128 - "^"

**link#838**: https://stackshare.io/purescript - ""Why developers like PureScript""

**link#839**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-129 - "^"

**link#840**: https://ecommercegermany.com/blog/allegro-all-you-need-to-know-about-the-best-polish-online-marketplace - ""ALLEGRO - all you need to know about the best ..."

**link#841**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-130 - "^"

**link#842**: https://www.wappalyzer.com/technologies/web-frameworks/phoenix-framework/ - ""Websites using Phoenix Framework - Wappalyzer""

**link#843**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-oxfordFP_131-0 - "^"

**link#844**: https://www.cs.ox.ac.uk/teaching/courses/2019-2020/fp/ - ""Functional Programming: 2019-2020""

**link#845**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-imperialFP_132-0 - "^"

**link#846**: https://www.imperial.ac.uk/computing/current-students/courses/120_1/ - ""Programming I (Haskell)""

**link#847**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-nottinghamFP_133-0 - "Jump up to: a"

**link#848**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-nottinghamFP_133-1 - "b"

**link#849**: https://www.nottingham.ac.uk/ugstudy/course/Computer-Science-BSc#yearsmodules - ""Computer Science BSc - Modules""

**link#850**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-mitFP_134-0 - "Jump up to: a"

**link#851**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-mitFP_134-1 - "b"

**link#852**: https://en.wikipedia.org/wiki/Hal_Abelson - "Abelson, Hal"

**link#853**: https://mitpress.mit.edu/sites/default/files/sicp/full-text/book/book-Z-H-6.html - ""Preface to the Second Edition""

**link#854**: http://mitpress.mit.edu/sicp/ - "Structure and Interpretation of Computer Programs"

**link#855**: https://en.wikipedia.org/wiki/Bibcode_(identifier) - "Bibcode"

**link#856**: https://ui.adsabs.harvard.edu/abs/1985sicp.book.....A - "1985sicp.book.....A"

**link#857**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-61A_135-0 - "^"

**link#858**: https://cs61a.org/articles/about.html - ""Computer Science 61A, Berkeley""

**link#859**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-bootstrapworld_136-0 - "^"

**link#860**: https://twit.tv/shows/triangulation/episodes/196/ - "Emmanuel Schanzer of Bootstrap"

**link#861**: https://en.wikipedia.org/wiki/TWiT.tv - "TWiT.tv"

**link#862**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-137 - "^"

**link#863**: https://home.adelphi.edu/sbloch/class/pbd/testimonials/ - ""Why Scheme for Introductory Programming?""

**link#864**: https://en.wikipedia.org/wiki/Functional_programming#cite_ref-138 - "^"

**link#865**: https://www.imacs.org/learn-computer-programming-using-scheme/ - ""What Is Scheme & Why Is it Beneficial for Stud..."

**link#866**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=26 - "edit"

**link#867**: https://mitpress.mit.edu/9780262510363/structure-and-interpretation-of-computer-programs/ - "Structure and Interpretation of Computer Programs"

**link#868**: https://en.wikipedia.org/wiki/J._Roger_Hindley - "Hindley, J. Roger"

**link#869**: https://en.wikipedia.org/w/index.php?title=Jonathan_P._Seldin&action=edit&redlink=1 - "Seldin, Jonathan P."

**link#870**: https://en.wikipedia.org/wiki/Special:BookSources/978-0-7204-2208-5 - "978-0-7204-2208-5"

**link#871**: http://hop.perl.plover.com/book/pdf/HigherOrderPerl.pdf - "Higher-Order Perl"

**link#872**: http://www.htdp.org/ - "How to Design Programs"

**link#873**: https://en.wikipedia.org/wiki/Prentice_Hall - "Prentice Hall"

**link#874**: https://en.wikipedia.org/wiki/Special:BookSources/978-0-486-28029-5 - "978-0-486-28029-5"

**link#875**: http://book.realworldhaskell.org/read/ - "Real World Haskell"

**link#876**: https://en.wikipedia.org/wiki/Marvin_Victor_Zelkowitz - "Marvin Victor Zelkowitz"

**link#877**: https://en.wikipedia.org/w/index.php?title=Macmillan_Technical_Publishing&action=edit&redlink=1 - "Macmillan Technical Publishing"

**link#878**: https://en.wikipedia.org/w/index.php?title=Addison-Wesley_Longman_Limited&action=edit&redlink=1 - "Addison-Wesley Longman Limited"

**link#879**: https://en.wikipedia.org/w/index.php?title=Functional_programming&action=edit&section=27 - "edit"

**link#880**: https://en.wikipedia.org/wiki/File:En-Functional_programming.ogg

**link#881**: https://en.wikipedia.org/wiki/Wikipedia:Media_help - "Audio help"

**link#882**: https://en.wikipedia.org/wiki/Wikipedia:Spoken_articles - "More spoken articles"

**link#883**: http://nealford.com/functionalthinking.html - ""Functional thinking""

**link#884**: http://www.defmacro.org/ramblings/fp.html - ""defmacro – Functional Programming For The Rest..."

**link#885**: http://gnosis.cx/publish/programming/charming_python_13.html - "part 1"

**link#886**: http://gnosis.cx/publish/programming/charming_python_16.html - "part 2"

**link#887**: http://gnosis.cx/publish/programming/charming_python_19.html - "part 3"

**link#888**: https://en.wikipedia.org/wiki/Comparison_of_multi-paradigm_programming_languages - "Comparison by language"

**link#889**: https://en.wikipedia.org/wiki/Structured_programming - "Structured"

**link#890**: https://en.wikipedia.org/wiki/Jackson_structured_programming - "Jackson structures"

**link#891**: https://en.wikipedia.org/wiki/Block_(programming) - "Block-structured"

**link#892**: https://en.wikipedia.org/wiki/Non-structured_programming - "Non-structured"

**link#893**: https://en.wikipedia.org/wiki/Programming_in_the_large_and_programming_in_the_small - "Programming in the large and in the small"

**link#894**: https://en.wikipedia.org/wiki/Design_by_contract - "Design by contract"

**link#895**: https://en.wikipedia.org/wiki/Invariant-based_programming - "Invariant-based"

**link#896**: https://en.wikipedia.org/wiki/Comparison_of_programming_languages_(object-oriented_programming) - "comparison"

**link#897**: https://en.wikipedia.org/wiki/List_of_object-oriented_programming_languages - "list"

**link#898**: https://en.wikipedia.org/wiki/Class-based_programming - "Class-based"

**link#899**: https://en.wikipedia.org/wiki/Prototype-based_programming - "Prototype-based"

**link#900**: https://en.wikipedia.org/wiki/Object-based_language - "Object-based"

**link#901**: https://en.wikipedia.org/wiki/Agent-oriented_programming - "Agent"

**link#902**: https://en.wikipedia.org/wiki/Immutable_object - "Immutable object"

**link#903**: https://en.wikipedia.org/wiki/Persistent_programming_language - "Persistent"

**link#904**: https://en.wikipedia.org/wiki/Uniform_function_call_syntax - "Uniform function call syntax"

**link#905**: https://en.wikipedia.org/wiki/Comparison_of_functional_programming_languages - "comparison"

**link#906**: https://en.wikipedia.org/wiki/Higher-order_programming - "Higher-order"

**link#907**: https://en.wikipedia.org/wiki/Strict_programming_language - "Strict"

**link#908**: https://en.wikipedia.org/wiki/Functional_logic_programming - "Functional logic"

**link#909**: https://en.wikipedia.org/wiki/Tacit_programming - "Point-free style"

**link#910**: https://en.wikipedia.org/wiki/Expression-oriented_programming_language - "Expression-oriented"

**link#911**: https://en.wikipedia.org/wiki/Applicative_programming_language - "Applicative"

**link#912**: https://en.wikipedia.org/wiki/Concatenative_programming_language - "Concatenative"

**link#913**: https://en.wikipedia.org/wiki/Value-level_programming - "Value-level"

**link#914**: https://en.wikipedia.org/wiki/Dataflow_programming - "Dataflow"

**link#915**: https://en.wikipedia.org/wiki/Flow-based_programming - "Flow-based"

**link#916**: https://en.wikipedia.org/wiki/Reactive_programming - "Reactive"

**link#917**: https://en.wikipedia.org/wiki/Signal_programming - "Signals"

**link#918**: https://en.wikipedia.org/wiki/Stream_processing - "Streams"

**link#919**: https://en.wikipedia.org/wiki/Synchronous_programming_language - "Synchronous"

**link#920**: https://en.wikipedia.org/wiki/Abductive_logic_programming - "Abductive logic"

**link#921**: https://en.wikipedia.org/wiki/Answer_set_programming - "Answer set"

**link#922**: https://en.wikipedia.org/wiki/Constraint_programming - "Constraint"

**link#923**: https://en.wikipedia.org/wiki/Constraint_logic_programming - "Constraint logic"

**link#924**: https://en.wikipedia.org/wiki/Inductive_logic_programming - "Inductive logic"

**link#925**: https://en.wikipedia.org/wiki/Nondeterministic_programming - "Nondeterministic"

**link#926**: https://en.wikipedia.org/wiki/Ontology_language - "Ontology"

**link#927**: https://en.wikipedia.org/wiki/Probabilistic_logic_programming - "Probabilistic logic"

**link#928**: https://en.wikipedia.org/wiki/Query_language - "Query"

**link#929**: https://en.wikipedia.org/wiki/Domain-specific_language - "DSL"

**link#930**: https://en.wikipedia.org/wiki/Algebraic_modeling_language - "Algebraic modeling"

**link#931**: https://en.wikipedia.org/wiki/Automata-based_programming - "Automata-based"

**link#932**: https://en.wikipedia.org/wiki/Action_language - "Action"

**link#933**: https://en.wikipedia.org/wiki/Command_language - "Command"

**link#934**: https://en.wikipedia.org/wiki/Spacecraft_command_language - "Spacecraft"

**link#935**: https://en.wikipedia.org/wiki/Differentiable_programming - "Differentiable"

**link#936**: https://en.wikipedia.org/wiki/End-user_development - "End-user"

**link#937**: https://en.wikipedia.org/wiki/Grammar-oriented_programming - "Grammar-oriented"

**link#938**: https://en.wikipedia.org/wiki/Interface_description_language - "Interface description"

**link#939**: https://en.wikipedia.org/wiki/Language-oriented_programming - "Language-oriented"

**link#940**: https://en.wikipedia.org/wiki/List_comprehension - "List comprehension"

**link#941**: https://en.wikipedia.org/wiki/Low-code_development_platform - "Low-code"

**link#942**: https://en.wikipedia.org/wiki/Modeling_language - "Modeling"

**link#943**: https://en.wikipedia.org/wiki/Natural-language_programming - "Natural language"

**link#944**: https://en.wikipedia.org/wiki/Non-English-based_programming_languages - "Non-English-based"

**link#945**: https://en.wikipedia.org/wiki/Page_description_language - "Page description"

**link#946**: https://en.wikipedia.org/wiki/Pipeline_(software) - "Pipes"

**link#947**: https://en.wikipedia.org/wiki/Filter_(software) - "filters"

**link#948**: https://en.wikipedia.org/wiki/Probabilistic_programming - "Probabilistic"

**link#949**: https://en.wikipedia.org/wiki/Quantum_programming - "Quantum"

**link#950**: https://en.wikipedia.org/wiki/Scientific_programming_language - "Scientific"

**link#951**: https://en.wikipedia.org/wiki/Scripting_language - "Scripting"

**link#952**: https://en.wikipedia.org/wiki/Set_theoretic_programming - "Set-theoretic"

**link#953**: https://en.wikipedia.org/wiki/Simulation_language - "Simulation"

**link#954**: https://en.wikipedia.org/wiki/Stack-oriented_programming - "Stack-based"

**link#955**: https://en.wikipedia.org/wiki/System_programming_language - "System"

**link#956**: https://en.wikipedia.org/wiki/Tactile_programming_language - "Tactile"

**link#957**: https://en.wikipedia.org/wiki/Template_processor - "Templating"

**link#958**: https://en.wikipedia.org/wiki/Transformation_language - "Transformation"

**link#959**: https://en.wikipedia.org/wiki/Graph_rewriting - "Graph rewriting"

**link#960**: https://en.wikipedia.org/wiki/Production_system_(computer_science) - "Production"

**link#961**: https://en.wikipedia.org/wiki/Pattern_matching - "Pattern"

**link#962**: https://en.wikipedia.org/wiki/Visual_programming_language - "Visual"

**link#963**: https://en.wikipedia.org/wiki/Concurrent_computing - "Concurrent"

**link#964**: https://en.wikipedia.org/wiki/Distributed_computing - "distributed"

**link#965**: https://en.wikipedia.org/wiki/Automatic_mutual_exclusion - "Automatic mutual exclusion"

**link#966**: https://en.wikipedia.org/wiki/Choreographic_programming - "Choreographic programming"

**link#967**: https://en.wikipedia.org/wiki/Concurrent_logic_programming - "Concurrent logic"

**link#968**: https://en.wikipedia.org/wiki/Concurrent_constraint_logic_programming - "Concurrent constraint logic"

**link#969**: https://en.wikipedia.org/wiki/Concurrent_object-oriented_programming - "Concurrent OO"

**link#970**: https://en.wikipedia.org/wiki/Macroprogramming - "Macroprogramming"

**link#971**: https://en.wikipedia.org/wiki/Multitier_programming - "Multitier programming"

**link#972**: https://en.wikipedia.org/wiki/Organic_computing - "Organic computing"

**link#973**: https://en.wikipedia.org/wiki/Parallel_programming_model - "Parallel programming models"

**link#974**: https://en.wikipedia.org/wiki/Partitioned_global_address_space - "Partitioned global address space"

**link#975**: https://en.wikipedia.org/wiki/Process-oriented_programming - "Process-oriented"

**link#976**: https://en.wikipedia.org/wiki/Relativistic_programming - "Relativistic programming"

**link#977**: https://en.wikipedia.org/wiki/Service-oriented_programming - "Service-oriented"

**link#978**: https://en.wikipedia.org/wiki/Structured_concurrency - "Structured concurrency"

**link#979**: https://en.wikipedia.org/wiki/Metaprogramming - "Metaprogramming"

**link#980**: https://en.wikipedia.org/wiki/Attribute-oriented_programming - "Attribute-oriented"

**link#981**: https://en.wikipedia.org/wiki/Automatic_programming - "Automatic"

**link#982**: https://en.wikipedia.org/wiki/Inductive_programming - "Inductive"

**link#983**: https://en.wikipedia.org/wiki/Dynamic_programming_language - "Dynamic"

**link#984**: https://en.wikipedia.org/wiki/Extensible_programming - "Extensible"

**link#985**: https://en.wikipedia.org/wiki/Homoiconicity - "Homoiconicity"

**link#986**: https://en.wikipedia.org/wiki/Interactive_programming - "Interactive"

**link#987**: https://en.wikipedia.org/wiki/Macro_(computer_science) - "Macro"

**link#988**: https://en.wikipedia.org/wiki/Hygienic_macro - "Hygienic"

**link#989**: https://en.wikipedia.org/wiki/Metalinguistic_abstraction - "Metalinguistic abstraction"

**link#990**: https://en.wikipedia.org/wiki/Multi-stage_programming - "Multi-stage"

**link#991**: https://en.wikipedia.org/wiki/Program_synthesis - "Program synthesis"

**link#992**: https://en.wikipedia.org/wiki/Bayesian_program_synthesis - "Bayesian"

**link#993**: https://en.wikipedia.org/wiki/Inferential_programming - "Inferential"

**link#994**: https://en.wikipedia.org/wiki/Programming_by_demonstration - "by demonstration"

**link#995**: https://en.wikipedia.org/wiki/Programming_by_example - "by example"

**link#996**: https://en.wikipedia.org/wiki/Reflective_programming - "Reflective"

**link#997**: https://en.wikipedia.org/wiki/Self-modifying_code - "Self-modifying code"

**link#998**: https://en.wikipedia.org/wiki/Symbolic_programming - "Symbolic"

**link#999**: https://en.wikipedia.org/wiki/Template_metaprogramming - "Template"

**link#1000**: https://en.wikipedia.org/wiki/Aspect-oriented_programming - "Aspects"

**link#1001**: https://en.wikipedia.org/wiki/Component-based_software_engineering - "Components"

**link#1002**: https://en.wikipedia.org/wiki/Data-driven_programming - "Data-driven"

**link#1003**: https://en.wikipedia.org/wiki/Data-oriented_design - "Data-oriented"

**link#1004**: https://en.wikipedia.org/wiki/Event-driven_programming - "Event-driven"

**link#1005**: https://en.wikipedia.org/wiki/Feature-oriented_programming - "Features"

**link#1006**: https://en.wikipedia.org/wiki/Literate_programming - "Literate"

**link#1007**: https://en.wikipedia.org/wiki/Role-oriented_programming - "Roles"

**link#1008**: https://en.wikipedia.org/wiki/Subject-oriented_programming - "Subjects"

**link#1009**: https://en.wikipedia.org/wiki/Machine_code - "Machine"

**link#1010**: https://en.wikipedia.org/wiki/Compiled_language - "Compiled"

**link#1011**: https://en.wikipedia.org/wiki/Interpreted_language - "Interpreted"

**link#1012**: https://en.wikipedia.org/wiki/Low-level_programming_language - "Low-level"

**link#1013**: https://en.wikipedia.org/wiki/Very_high-level_programming_language - "Very high-level"

**link#1014**: https://en.wikipedia.org/wiki/Esoteric_programming_language - "Esoteric"

**link#1015**: https://en.wikipedia.org/wiki/Programming_language_generations - "Generation"

**link#1016**: https://en.wikipedia.org/wiki/First-generation_programming_language - "First"

**link#1017**: https://en.wikipedia.org/wiki/Second-generation_programming_language - "Second"

**link#1018**: https://en.wikipedia.org/wiki/Third-generation_programming_language - "Third"

**link#1019**: https://en.wikipedia.org/wiki/Fourth-generation_programming_language - "Fourth"

**link#1020**: https://en.wikipedia.org/wiki/Fifth-generation_programming_language - "Fifth"

**link#1021**: https://en.wikipedia.org/wiki/Help:Authority_control - "Authority control databases"

**link#1022**: https://d-nb.info/gnd/4198740-8 - "Germany"

**link#1023**: https://id.loc.gov/authorities/sh87007844 - "United States"

**link#1024**: https://catalogue.bnf.fr/ark:/12148/cb121910539 - "France"

**link#1025**: https://data.bnf.fr/ark:/12148/cb121910539 - "BnF data"

**link#1026**: https://aleph.nkp.cz/F/?func=find-c&local_base=aut&ccl_term=ica=ph572639&CON_LNG=ENG - "Czech Republic"

**link#1027**: https://datos.bne.es/resource/XX547935 - "Spain"

**link#1028**: https://www.nli.org.il/en/authorities/987007541542105171 - "Israel"

**link#1029**: https://en.wikipedia.org/w/index.php?title=Functional_programming&oldid=1288545228 - "https://en.wikipedia.org/w/index.php?title=Func..."

**link#1030**: https://en.wikipedia.org/wiki/Help:Category - "Categories"

**link#1031**: https://en.wikipedia.org/wiki/Category:Functional_programming - "Functional programming"

**link#1032**: https://en.wikipedia.org/wiki/Category:Programming_paradigms - "Programming paradigms"

**link#1033**: https://en.wikipedia.org/wiki/Category:Programming_language_comparisons - "Programming language comparisons"

**link#1034**: https://en.wikipedia.org/wiki/Category:CS1_French-language_sources_(fr) - "CS1 French-language sources (fr)"

**link#1035**: https://en.wikipedia.org/wiki/Category:Webarchive_template_wayback_links - "Webarchive template wayback links"

**link#1036**: https://en.wikipedia.org/wiki/Category:Articles_with_short_description - "Articles with short description"

**link#1037**: https://en.wikipedia.org/wiki/Category:Short_description_matches_Wikidata - "Short description matches Wikidata"

**link#1038**: https://en.wikipedia.org/wiki/Category:All_articles_with_unsourced_statements - "All articles with unsourced statements"

**link#1039**: https://en.wikipedia.org/wiki/Category:Articles_with_unsourced_statements_from_February_2017 - "Articles with unsourced statements from Februar..."

**link#1040**: https://en.wikipedia.org/wiki/Category:Articles_with_unsourced_statements_from_July_2018 - "Articles with unsourced statements from July 2018"

**link#1041**: https://en.wikipedia.org/wiki/Category:Articles_with_unsourced_statements_from_June_2014 - "Articles with unsourced statements from June 2014"

**link#1042**: https://en.wikipedia.org/wiki/Category:Articles_with_unsourced_statements_from_April_2015 - "Articles with unsourced statements from April 2015"

**link#1043**: https://en.wikipedia.org/wiki/Category:Articles_with_unsourced_statements_from_August_2022 - "Articles with unsourced statements from August ..."

**link#1044**: https://en.wikipedia.org/wiki/Category:Articles_with_hAudio_microformats - "Articles with hAudio microformats"

**link#1045**: https://en.wikipedia.org/wiki/Category:Spoken_articles - "Spoken articles"

**link#1046**: https://en.wikipedia.org/wiki/Category:Articles_with_example_C_code - "Articles with example C code"

**link#1047**: https://en.wikipedia.org/wiki/Category:Articles_with_example_JavaScript_code - "Articles with example JavaScript code"

**link#1048**: https://en.wikipedia.org/wiki/Category:Articles_with_example_Lisp_(programming_language)_code - "Articles with example Lisp (programming languag..."

**link#1049**: https://en.wikipedia.org/wiki/Functional_programming#

**link#1050**: https://en.wikipedia.org/wiki/Functional_programming?action=edit

## Images

**image#1**: https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Sound-icon.svg/20px-Sound-icon.svg.png - Listen to this article

**image#2**: https://wikimedia.org/api/rest_v1/media/math/render/svg/75a0e680edceb47b7d233535262fcacd931585f8 - {\\displaystyle d/dx}

**image#3**: https://wikimedia.org/api/rest_v1/media/math/render/svg/132e57acb643253e7810ee9702d9581f159a1c61 - {\\displaystyle f}

**image#4**: https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Octicons-terminal.svg/60px-Octicons-terminal.svg.png - icon

**image#5**: https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Sound-icon.svg/60px-Sound-icon.svg.png - Spoken Wikipedia icon

**image#6**: https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/OOjs_UI_icon_edit-ltr-progressive.svg/20px-OOjs_UI_icon_edit-ltr-progressive.svg.png - Edit this at Wikidata

## Summary

Total references: **1056**

- Links: 1050
- Images: 6
- Videos: 0
