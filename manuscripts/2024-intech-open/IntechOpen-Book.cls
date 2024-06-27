%%
%% This is file `IntechOpen-Book.cls',
%% generated with the docstrip utility.
%%
%% The original source files were:
%%
%% classes.dtx  (with options: `IntechOpen-Book')
%%
%% This is a generated file.
%%
%% Copyright 1993 1994 1995 1996 1997 1998 1999 2000 2001 2002 2003 2004 2005 2006 2007 2008 2009
%% The LaTeX3 Project and any individual authors listed elsewhere
%% in this file.
%%
%% This file was generated from file(s) of the LaTeX base system.
%% --------------------------------------------------------------
%%
%% It may be distributed and/or modified under the
%% conditions of the LaTeX Project Public License, either version 1.3c
%% of this license or (at your option) any later version.
%% The latest version of this license is in
%%    http://www.latex-project.org/lppl.txt
%% and version 1.3c or later is part of all distributions of LaTeX
%% version 2005/12/01 or later.
%%
%% This file has the LPPL maintenance status "maintained".
%%
%% This file may only be distributed together with a copy of the LaTeX
%% base system. You may however distribute the LaTeX base system without
%% such generated files.
%%
%% The list of all files belonging to the LaTeX base distribution is
%% given in the file `manifest.txt'. See also `legal.txt' for additional
%% information.
%%
%% The list of derived (unpacked) files belonging to the distribution
%% and covered by LPPL is defined by the unpacking scripts (with
%% extension .ins) which are part of the distribution.
%% \CharacterTable
%%  {Upper-case    \A\B\C\D\E\F\G\H\I\J\K\L\M\N\O\P\Q\R\S\T\U\V\W\X\Y\Z
%%   Lower-case    \a\b\c\d\e\f\g\h\i\j\k\l\m\n\o\p\q\r\s\t\u\v\w\x\y\z
%%   Digits        \0\1\2\3\4\5\6\7\8\9
%%   Exclamation   \!     Double quote  \"     Hash (number) \#
%%   Dollar        \$     Percent       \%     Ampersand     \&
%%   Acute accent  \'     Left paren    \(     Right paren   \)
%%   Asterisk      \*     Plus          \+     Comma         \,
%%   Minus         \-     Point         \.     Solidus       \/
%%   Colon         \:     Semicolon     \;     Less than     \<
%%   Equals        \=     Greater than  \>     Question mark \?
%%   Commercial at \@     Left bracket  \[     Backslash     \\
%%   Right bracket \]     Circumflex    \^     Underscore    \_
%%   Grave accent  \`     Left brace    \{     Vertical bar  \|
%%   Right brace   \}     Tilde         \~}
\NeedsTeXFormat{LaTeX2e}[1995/12/01]
\ProvidesClass{IntechOpen-Book}
              [2018/03/26 v1.0
 IntechOpen Standard LaTeX document class]
\newcommand\@ptsize{}
\newif\if@restonecol
\newif\if@titlepage
\newif\if@Sectref\@Sectreffalse
\newif\if@AddtoToc\global\@AddtoTocfalse
\@titlepagetrue
\newif\if@openright



\if@compatibility\else
\DeclareOption{a4paper}
   {\setlength\paperheight {297mm}%
    \setlength\paperwidth  {210mm}}
\DeclareOption{a5paper}
   {\setlength\paperheight {210mm}%
    \setlength\paperwidth  {148mm}}
\DeclareOption{b5paper}
   {\setlength\paperheight {250mm}%
    \setlength\paperwidth  {176mm}}
\DeclareOption{letterpaper}
   {\setlength\paperheight {11in}%
    \setlength\paperwidth  {8.5in}}
\DeclareOption{legalpaper}
   {\setlength\paperheight {14in}%
    \setlength\paperwidth  {8.5in}}
\DeclareOption{executivepaper}
   {\setlength\paperheight {10.5in}%
    \setlength\paperwidth  {7.25in}}
\DeclareOption{landscape}
   {\setlength\@tempdima   {\paperheight}%
    \setlength\paperheight {\paperwidth}%
    \setlength\paperwidth  {\@tempdima}}
\fi
\if@compatibility
  \renewcommand\@ptsize{0}
\else
\DeclareOption{10pt}{\renewcommand\@ptsize{0}}
\fi
\DeclareOption{11pt}{\renewcommand\@ptsize{1}}
\DeclareOption{12pt}{\renewcommand\@ptsize{2}}
\if@compatibility\else
\DeclareOption{oneside}{\@twosidefalse \@mparswitchfalse}
\fi
\DeclareOption{twoside}{\@twosidetrue  \@mparswitchtrue}
\DeclareOption{draft}{\setlength\overfullrule{5pt}}
\if@compatibility\else
\DeclareOption{final}{\setlength\overfullrule{0pt}}
\fi
\DeclareOption{titlepage}{\@titlepagetrue}
\if@compatibility\else
\DeclareOption{notitlepage}{\@titlepagefalse}
\fi
\if@compatibility
\@openrighttrue
\else
\DeclareOption{openright}{\@openrighttrue}
\DeclareOption{openany}{\@openrightfalse}
\fi
\if@compatibility\else
\DeclareOption{onecolumn}{\@twocolumnfalse}
\fi
\DeclareOption{twocolumn}{\@twocolumntrue}
\DeclareOption{leqno}{\input{leqno.clo}}
\DeclareOption{fleqn}{\input{fleqn.clo}}
\DeclareOption{openbib}{%
  \AtEndOfPackage{%
   \renewcommand\@openbib@code{%
      \advance\leftmargin\bibindent
      \itemindent -\bibindent
      \listparindent \itemindent
      \parsep \z@
      }%
   \renewcommand\newblock{\par}}%
}
\DeclareOption{authoryear}{\xdef\@biboptions{round,authoryear}}
\DeclareOption{numbers}{\xdef\@biboptions{numbers}}
\DeclareOption{sectref}{\global\@Sectreftrue\PassOptionsToPackage{sectionbib}{natbib}}
\DeclareOption{sort}{\PassOptionsToPackage{sort}{natbib}}
\DeclareOption{compress}{\PassOptionsToPackage{compress}{natbib}}
\DeclareOption{sort&compress}{\PassOptionsToPackage{sort&compress}{natbib}}
%
\ExecuteOptions{a4paper,10pt,twoside,onecolumn,final,openright,numbers}
\ProcessOptions
\input{bk1\@ptsize.clo}
%%%%%%%%%%%%%%%
%
\setlength\lineskip{1\p@}
\setlength\normallineskip{1\p@}
\renewcommand\baselinestretch{}
\setlength\parskip{0\p@}
\@lowpenalty   51
\@medpenalty  151
\@highpenalty 301
\setcounter{topnumber}{2}
\renewcommand\topfraction{.7}
\setcounter{bottomnumber}{1}
\renewcommand\bottomfraction{.3}
\setcounter{totalnumber}{3}
\renewcommand\textfraction{.2}
\renewcommand\floatpagefraction{.5}
\setcounter{dbltopnumber}{2}
\renewcommand\dbltopfraction{.7}
\renewcommand\dblfloatpagefraction{.5}
\setlength{\parskip}{0pt}
%
\newcommand*\chaptermark[1]{}
\setcounter{secnumdepth}{3}
\newcounter {part}
\newcounter {chapter}
\newcounter {section}[chapter]
\newcounter {subsection}[section]
\newcounter {subsubsection}[subsection]
\newcounter {paragraph}[subsubsection]
\newcounter {subparagraph}[paragraph]
\renewcommand \thepart {\@Roman\c@part}
\renewcommand \thechapter {\@arabic\c@chapter}
\renewcommand \thesection {\@arabic\c@section}
\renewcommand\thesubsection   {\thesection.\@arabic\c@subsection}
\renewcommand\thesubsubsection{\thesubsection.\@arabic\c@subsubsection}
\renewcommand\theparagraph    {\thesubsubsection.\@arabic\c@paragraph}
\renewcommand\thesubparagraph {\theparagraph.\@arabic\c@subparagraph}
\newcommand\@chapapp{\chaptername}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%% MAIN ELEMENTS %%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
\def\cleardoublepage{\clearpage\ifodd\c@page\else
    \clearpage\thispagestyle{empty}\hbox{~}\newpage%%
    \fi}%
%
\newcommand{\clearemptydoublepage}{\clearpage{\thispagestyle{empty}\cleardoublepage}}
%
\newcommand{\startnewpage}{\if@openright\cleardoublepage\else\clearpage\fi}
%
%
\newif\if@frontmatter\@frontmatterfalse
\newif\if@mainmatter \@mainmatterfalse
\newif\if@backmatter \@backmatterfalse
%
\newcommand\Frontmatter{\startnewpage
            \global\@frontmattertrue\global\@mainmatterfalse\global\@backmatterfalse\gdef\tocauthors{}\pagenumbering{Roman}}
%
\newcommand\Mainmatter{\cleardoublepage
       \global\@frontmatterfalse\global\@mainmattertrue\global\@backmatterfalse\pagenumbering{arabic}}
%
\newcommand\Backmatter{\cleardoublepage\global\@frontmatterfalse\global\@mainmatterfalse\global\@backmattertrue}
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\renewcommand{\rmdefault}{upl}
\renewcommand{\sfdefault}{phv}
\renewcommand{\ttdefault}{pcr}


\renewcommand\normalsize{%
   \@setfontsize\normalsize{10bp}{12bp}
   \abovedisplayskip 12\p@ \@plus2\p@ \@minus0\p@
   \abovedisplayshortskip 12\p@ \@plus3\p@
   \belowdisplayshortskip 12\p@ \@plus3\p@ \@minus3\p@
   \belowdisplayskip \abovedisplayskip
   \let\@listi\@listI}
\normalsize
\renewcommand\small{%
   \@setfontsize\small{9bp}{12bp}%
   \abovedisplayskip 6\p@ \@plus3\p@ \@minus4\p@
   \abovedisplayshortskip \z@ \@plus2\p@
   \belowdisplayshortskip 6\p@ \@plus2\p@ \@minus2\p@
   \def\@listi{\leftmargin\leftmargini
               \topsep 4\p@ \@plus2\p@ \@minus2\p@
               \parsep 2\p@ \@plus\p@ \@minus\p@
               \itemsep \parsep}%
   \belowdisplayskip \abovedisplayskip
}
\renewcommand\footnotesize{%
   \@setfontsize\footnotesize{8bp}{12bp}%
   \abovedisplayskip 6\p@ \@plus2\p@ \@minus4\p@
   \abovedisplayshortskip \z@ \@plus\p@
   \belowdisplayshortskip 3\p@ \@plus\p@ \@minus2\p@
   \def\@listi{\leftmargin\leftmargini
               \topsep 3\p@ \@plus\p@ \@minus\p@
               \parsep 2\p@ \@plus\p@ \@minus\p@
               \itemsep \parsep}%
   \belowdisplayskip \abovedisplayskip
}

\newdimen\normbaselineskip
\normbaselineskip=12bp

\global\setlength{\paperwidth}{180truemm}
\global\setlength{\paperheight}{260truemm}
\setlength\topskip   {8\p@}
\setlength{\textheight}{52\normbaselineskip}
\addtolength{\textheight}{\topskip}
\setlength{\textwidth}{127truemm}%
%
%\setlength\marginparwidth{48mm}%{136pt}
%\setlength\marginparsep{4mm}%{12\p@}
%\addtolength{\textheight}{-12pt}
%
\setlength{\oddsidemargin}{26.5truemm}
\setlength{\evensidemargin}{\paperwidth}
\addtolength{\evensidemargin}{-\textwidth}
\addtolength{\evensidemargin}{-\oddsidemargin}
%\addtolength{\evensidemargin}{-\marginparwidth}
%\addtolength{\evensidemargin}{-\marginparsep}
\addtolength{\oddsidemargin}{-1in}
\addtolength{\evensidemargin}{-1in}
\def\oddsideskip{26.5mm}%
\def\evensideskip{26.5mm}%
%
\setlength{\topmargin}{17.5bp}
\addtolength{\topmargin}{-1in}
\setlength{\headheight}{10pt}
\setlength{\headsep}{36bp}
\addtolength\headsep {-\topskip}%%headsep from Base of RH to Base of First Text Line
\setlength{\footskip}{25.25pt}
\setlength{\maxdepth}{3pt}
%
\global\columnsep=12bp%
\parskip=\z@%
\parindent=5mm%

\RequirePackage{ragged2e}
%\setlength{\RaggedRightRightskip}{\z@ plus 1.08\hsize}
\RaggedRight
  \setlength{\RaggedRightParindent}{12pt}%
  \setlength{\JustifyingParindent}{12pt}%
  \setlength{\parindent}{5mm}%
  \setlength{\parskip}{0pt}%


\RequirePackage[dvips,a4,center]{crop}
    %%\CROP@size{\paperwidth}{\paperheight}%
\crop[cam]


%%%%%%%%%%%%%%%%%%%%%%%%%% BOOK CONFIG %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%%%%%%%%%%%%%%%%%%%%%%%% HEADERS & FOOTERS
%
\def\booktitle#1{\gdef\@bktitle{#1}}
\booktitle{}
%
\def\DOI#1{\gdef\@doititle{DOI:\space#1}}
\DOI{}
%
\def\runheadstyle{\rmfamily\fontsize{9bp}{11bp}\selectfont\itshape}
\def\foliostyle{\rmfamily\fontsize{8bp}{10bp}\selectfont\bfseries}
%
\def\ps@headings{\let\@mkboth\markboth%
   \def\@oddfoot{\hbox to \textwidth{\hbox{\foliostyle\thepage}\hfill}}%
   \def\@evenfoot{\hbox to \textwidth{\hbox{\foliostyle\thepage}\hfill}}%
   \def\@evenhead{\hbox to \textwidth{{\runheadstyle\leftmark}\hfill}}%
   \def\@oddhead{\hbox to \textwidth{\runheadstyle\rightmark\hfill}}
        \def\chaptermark##1{\markboth{{##1}}%\if@numberedchap{\thechapter\hskip.5em}\fi
        {{##1}}}%\if@numberedchap{\thechapter\hskip.5em}\fi
        \def\sectionmark##1{\markright{{{##1}}}}%\thesection\hskip.91em\letterspacerhtext
}%
\pagestyle{headings}
%
\def\ps@plain{\let\@mkboth\markboth%
   \def\@oddfoot{\hbox to \textwidth{\hbox{\foliostyle\thepage}\hfill\raisebox{-2.1pt}[0pt][0pt]{\includegraphics{InTechOpen.eps}}}}%
   \def\@evenfoot{\hbox to \textwidth{\hbox{\foliostyle\thepage}\hfill\raisebox{-2.1pt}[0pt][0pt]{\includegraphics{InTechOpen.eps}}}}%
   \def\@evenhead{}%
   \def\@oddhead{}
}%

\def\ps@secplain{\let\@mkboth\markboth%
   \def\@oddfoot{\hbox to \textwidth{\hbox{\foliostyle\thepage}\hfill}}%
   \def\@evenfoot{\hbox to \textwidth{\hbox{\foliostyle\thepage}\hfill}}%
   \def\@evenhead{}%
   \def\@oddhead{}
}%


\pagenumbering{arabic}
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Footnote Style
%
\RequirePackage[bottom]{footmisc}
%
\setlength{\footnotesep}{8.5\p@}
\setlength{\skip\footins}{12\p@ \@plus 2 \p@} % \@minus 4\p@
%
\renewcommand\footnoterule{%
  \kern-3\p@
  \hrule\@width6pc \@height0.22pt
  \kern1.6\p@}
\@addtoreset{footnote}{chapter}
\renewcommand\@makefntext[1]{\def\@makefnmark{\hbox{\@textsuperscript{\normalfont\@thefnmark\hskip3.5pt}}}\raggedright%
    \parindent 1em%
    \noindent
    {\@makefnmark}#1}
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Mainmatter Elements%
%
\newcommand\partname{Part}
\newcommand\chaptername{Chapter}
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Part style
%
\newcommand\part{%
  \if@openright
    \cleardoublepage
  \else
    \clearpage
  \fi
  \thispagestyle{plain}%
  \if@twocolumn
    \onecolumn
    \@tempswatrue
  \else
    \@tempswafalse
  \fi
  \null\vfil
  \secdef\@part\@spart}

\def\@part[#1]#2{%
    \ifnum \c@secnumdepth >-2\relax
      \refstepcounter{part}%
      \addcontentsline{toc}{part}{\thepart\hspace{1em}#1}%
    \else
      \addcontentsline{toc}{part}{#1}%
    \fi
    \markboth{}{}%
    {\centering
     \interlinepenalty \@M
     \normalfont
     \ifnum \c@secnumdepth >-2\relax
       \huge\bfseries \partname\nobreakspace\thepart
       \par
       \vskip 20\p@
     \fi
     \Huge \bfseries #2\par}%
    \@endpart}
\def\@spart#1{%
    {\centering
     \interlinepenalty \@M
     \normalfont
     \Huge \bfseries #1\par}%
    \@endpart}
\def\@endpart{\vfil\newpage
              \if@twoside
               \if@openright
                \null
                \thispagestyle{empty}%
                \newpage
               \fi
              \fi
              \if@tempswa
                \twocolumn
              \fi}
%%%%%%%
\RequirePackage{color}
\definecolor{hndrdcyan}{cmyk}{0,1,1,0}
%%%%%%%%%%%%%%%%%%%%%%%
%
\newenvironment{frontmatter}%
{\let\quote\openerquote\let\endquote\endopenerquote}%
{\gdef\copauthors{}\gdef\tocauthors{}\gdef\@subtitle{}\ifx\@@chcode\@contentcode\aftergroup\@afterheading\else\aftergroup\@afterindentfalse\fi}
%
\newif\if@Parapresent\global\@Parapresentfalse
%
\newcommand*{\@noindent@fpara}{%
  \everypar{{\setbox\z@\lastbox\global\@Parapresenttrue}\everypar{}}%\global\@Parapresenttrue
}

\def\@prefacecode{Preface}
\def\@contentcode{Contents}
\newenvironment{frontchapter}[1][]{\let\source\fmsource\gdef\@@chcode{#1}\ifx\@@chcode\@prefacecode\parskip12pt\parindent\z@\fi}{\par\gdef\@@chcode{}}
%
\def\fmsource#1{\par\vspace*{38.2pt}\begin{flushright}#1\end{flushright}}
%%%%%%%%%%%%%%%%%%%%%%%% Chapter style
%
\def\chapnumstyle{\reset@font\rmfamily\fontsize{11bp}{12bp}\selectfont\bfseries\raggedright\color{hndrdcyan}}
\def\chaptextstyle{\reset@font\fontsize{24bp}{27bp}\selectfont\raggedright}
\def\unnumchaptextstyle{\reset@font\ifx\@@chcode\@prefacecode\fontsize{27bp}{34bp}\selectfont\centering\color{hndrdcyan}\else\fontsize{20bp}{22bp}\selectfont\raggedright\fi}
\def\chapsubtitlestyle{\reset@font\rmfamily\fontsize{12bp}{14bp}\selectfont\itshape}
\def\authorstyle{\reset@font\fontsize{14bp}{20bp}\selectfont\itshape\raggedright}

\newif\if@numberedchap\@numberedchapfalse%
%
%
\newcommand\chapter{\if@openright\cleardoublepage\else\clearpage\fi
                    \if@mainmatter\thispagestyle{plain}\else\thispagestyle{empty}\fi%
                    \global\@topnum\z@
                    \@afterindentfalse
                    \secdef{\global\@numberedchaptrue\@chapter}{\global\@numberedchapfalse\@schapter}}
%
\def\@chapter[#1]#2{\ifnum \c@secnumdepth >\m@ne
                       \if@mainmatter
                         \refstepcounter{chapter}%
                         \typeout{\@chapapp\space\thechapter.}%
                         \addcontentsline{toc}{chapter}%
                                   {\protect\numberline{\thechapter}#1}%
                       \else
                         \addcontentsline{toc}{chapter}{#1}%
                       \fi
                    \else
                      \addcontentsline{toc}{chapter}{#1}%
                    \fi
                    \chaptermark{#1}%
                    \addtocontents{lof}{\protect\addvspace{10\p@}}%
                    \addtocontents{lot}{\protect\addvspace{10\p@}}%
                    \gdef\@chaptertitle{#2}%%
%%                    \if@twocolumn
%%                      \@topnewpage[\@makechapterhead{#2}]%
%%                    \else
%%                      \@makechapterhead{#2}%
%%                      \@afterheading
%%                    \fi
                    }
%
\def\@makechapterhead#1{%
  \null\vspace*{-8\p@}\nointerlineskip%
  {\parindent \z@\normalfont\overfullrule=0pt%
    \ifnum \c@secnumdepth >\m@ne%
%      \if@mainmatter%
        {{\chapnumstyle\@chapapp\space\thechapter\par}}\vskip3\p@%
%      \fi%
    \fi%
    \interlinepenalty\@M%%
    {\chaptextstyle#1\vphantom{hypg}\par}%%
    \global\punctcount\aucount%
    \ifx\@subtitle\@empty\else\vskip14bp{\chapsubtitlestyle\@subtitle\vphantom{hypg}\par}\fi%
    \ifx\copauthors\@empty\else\vskip9.5pt{\copauthors\vphantom{hypg}\par}\fi%
    \vskip34bp%
  }}
%
%
\def\@schapter#1{\gdef\@chaptertitle{#1}%
%%                \if@twocolumn
%%                   \@topnewpage[\@makeschapterhead{#1}]%
%%                 \else
%%                   \@makeschapterhead{#1}%
%%                   \@afterheading
%%                 \fi
                 }
%
\def\@makeschapterhead#1{%
  \ifx\@@chcode\@prefacecode\null\vspace*{-12\p@}\else\null\vspace*{6.5\p@}\fi\nointerlineskip%
  {\parskip\z@\parindent \z@
    \normalfont
    \interlinepenalty\@M
    \unnumchaptextstyle#1\par\nobreak
    \ifx\@@chcode\@prefacecode\vskip 48\p@\else\vskip 108.5\p@\fi%
  }}
%
\newcommand\makechaptertitle{%
                \if@numberedchap%
                    \if@twocolumn%
                      \twocolumn[\@makechapterhead{\@chaptertitle}]%
                    \else%
                      \@makechapterhead{\@chaptertitle}%
                    \fi%
                \else%
                     \if@twocolumn%
                       \twocolumn[\@makeschapterhead{\@chaptertitle}]%
                     \else%
                       \@makeschapterhead{\@chaptertitle}%
                     \fi\markboth{\@chaptertitle}{\@chaptertitle}%
                \fi\addtocontents{toc}{\global\punctcount\the\aucount}\ifx\tocauthors\@empty\else\addcontentsline{toc}{author}{\tocauthors}\fi%
                \@afterheading}%
%%%
\def\subtitle#1{\gdef\@subtitle{#1}}
\gdef\@subtitle{}%
%%%
%%\def\author#1{\gdef\@copauthors{\authorstyle#1\par}}
%%\gdef\@copauthors{}
%
\newif\ifcorrauthor\global\corrauthorfalse
\newif\if@authorpresent\global\@authorpresentfalse
\let\ausep\@empty%
\let\authorsep\@empty%
\newcount\aucount%
\newif\if@auemail%
\gdef\tocauthors#1{#1}
\gdef\copauthors#1{#1}
\gdef\@ckauthor{}


\def\author{\global\@authorpresenttrue\advance\aucount by 1\@ifstar{\protect\g@addto@macro\copauthors{\protect\global\corrauthortrue}\@@corrauthor}{\protect\g@addto@macro\copauthors{\protect\global\corrauthorfalse}\@@author}}%


\newcount\punctcount%
\def\au@and{\ifnum\punctcount=2\ and \else\unskip, \advance\punctcount by -1 \fi}%

\newcommand{\@@author}[2][]{\g@addto@macro\copauthors{%
    \authorstyle%
    \def\baselinestretch{1}%
    \authorsep{{#2}}\ifx\@authfoot\@empty\else\def\@authfoot{}\fi\unskip%
    \def\authorsep{\au@and}%%%
    \global\let\ausep\@empty\global\let\@corref\@empty}%
    \ifnum\aucount=1\g@addto@macro\tocauthors{#2}\g@addto@macro\@ckauthor{#2}\else\g@addto@macro\tocauthors{\protect\tocauthorsep{#2}}\g@addto@macro\@ckauthor{, #2}\fi}%

%%%%%%%%%%% Abstract & Keywords
%
\newenvironment{abstract}
{\bgroup\parskip12pt\noindent{\fontsize{11bp}{12bp}\selectfont\bfseries\color{hndrdcyan}Abstract\par}}
{\par\egroup}
%%%%%
\newenvironment{keywords}
{\bgroup\vskip12pt\noindent{\bfseries Keywords:}\space}
{\par\addvspace{12pt}\egroup}
%%%%%%%%%%%%%%%%%%%%%%%%
%
%%%%%%%%%%%%%%%%%%%%%%%% Section Title %%%%%%%%%%%%%%%%%%%%%%
\newenvironment{sectionfrontmatter}{\thispagestyle{empty}\@afterindentfalse}{\setcounter{Section}{0}\aftergroup\@afterheading\aftergroup\@afterindentfalse}

\def\sectionnumstyle{\reset@font\rmfamily\fontsize{18bp}{20bp}\selectfont\centering\color{hndrdcyan}}
\def\sectiontitlestyle{\reset@font\fontsize{28bp}{30bp}\selectfont\centering\color{hndrdcyan}}
%
\newif\if@numberedsection\global\@numberedsectiontrue
\newif\if@sectiontext\global\@sectiontextfalse
\def\@sectiontitle{}

\def\@sectionsubtitle{}
\def\sectionsubtitle#1{\gdef\@sectionsubtitle{#1}}
\newcounter{Section}
\def\sectionname{Section}
%
\newenvironment{sectiontext}{\par
    \global\@sectiontexttrue%
    \let\frontmatter\sectionfrontmatter
    \let\endfrontmatter\endsectionfrontmatter
    %%\renewcommand \thepart {\@Roman\c@part}
    \renewcommand \thesection {\thepart.\@arabic\c@section}
    \renewcommand\thesubsection   {\thesection.\@arabic\c@subsection}
    \renewcommand\thesubsubsection{\thesubsection.\@arabic\c@subsubsection}
    \renewcommand\theparagraph    {\thesubsubsection.\@arabic\c@paragraph}
    \renewcommand\thesubparagraph {\theparagraph.\@arabic\c@subparagraph}
    %
    \let\subtitle\sectionsubtitle%
    \let\author\Sectauthor%
    %
}{\par\global\@sectiontextfalse\gdef\oupauthors{}\relax}

\newcommand\Section{%\stepcounter{chapcnt}\stepcounter{chapqry}%
%
   \if@noskipsec \leavevmode \fi
   \par
   \addvspace{4ex}%
   \@afterindentfalse
   \thispagestyle{secplain}%
   \secdef{\global\@numberedsectiontrue\@Section}{\global\@numberedsectionfalse\@SSection}}


\def\@Section[#1]#2{%
    \ifnum \c@secnumdepth >\m@ne
      \refstepcounter{Section}%
      \addcontentsline{toc}{secchap}{\protect\numberline{\theSection}#1}%
    \else%
      \addcontentsline{toc}{secchap}{#1}%
    \fi%
\gdef\@sectiontitle{#2}}
%
\def\@SSection#1{%
\gdef\@sectiontitle{#1}%
}

\def\@makesectionhead#1{\null\vspace*{71.2pt}\nointerlineskip%
    {\parindent \z@
     \interlinepenalty \@M
     \normalfont\color{hndrdcyan}%
     \rule{\textwidth}{0.63bp}\par\vskip199.5pt%
     \ifnum \c@secnumdepth >\m@ne
       \sectionnumstyle \sectionname\nobreakspace\theSection\par\vskip12pt
     \fi
     \sectiontitlestyle #1\par\vskip178pt%
     \rule{\textwidth}{0.63bp}\par}%
    \vskip 20\p@
    \@afterheading}

\def\@makessectionhead#1{%
    {\parindent \z@ \raggedright
     \interlinepenalty \@M
     \normalfont
     \huge \bfseries #1\par}%
     \ifx\@sectionsubtitle\@empty\else\vskip20pt\noindent{\large\@sectionsubtitle\par}\fi
    \vskip 20\p@
    \global\punctcount\aucount
    \ifx\oupauthors\@empty\else
    \normalsize\oupauthors\par\vskip10pt
%    \footnotesize\itshape\elsaddress\par
    \fi
    \nobreak
     \vskip 3ex
     \@afterheading}

\newcommand\makesectiontitle{%%\gdef\@xmpstartpage{\thepage}%%%\xmpchaptertitle{\@parttitle}}%
                \if@numberedsection
                    \if@twocolumn
                      \twocolumn[\@makesectionhead{\@sectiontitle}]%
                    \else
                      \@makesectionhead{\@sectiontitle}%
                    \fi\@afterheading
                \else
                     \if@twocolumn
                       \twocolumn[\@makessectionhead{\@sectiontitle}]%
                     \else
                       \@makessectionhead{\@sectiontitle}%
                     \fi\@afterheading
                \fi
                }
%%%%%%%%%%%%%%%%%%%
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Section Heading Style
%%%%%%%%%%%
\def\secsize{\reset@font\fontsize{11bp}{12bp}\selectfont\bfseries\raggedright}%
\def\subsecsize{\reset@font\fontsize{10bp}{12bp}\selectfont\bfseries\raggedright}%
\def\subsubsecsize{\reset@font\fontsize{10bp}{12bp}\selectfont\itshape\raggedright}%
\def\paragraphsize{\reset@font\fontsize{10bp}{12bp}\selectfont\raggedright}%
\def\subparagraphsize{\reset@font\fontsize{12bp}{14bp}\selectfont\raggedright}%
%
%

\newcommand\section{\def\@seccntformat##1{{\csname the##1\endcsname.\nobreakspace}}\@startsection {section}{1}{\z@}%
                                   {24bp \@plus 2pt \@minus 0pt}%
                                   {12bp}%
                                   {\secsize}}
\newcommand\subsection{\def\@seccntformat##1{{\csname the##1\endcsname\nobreakspace}}\@startsection{subsection}{2}{\z@}%
                                     {12pt  \@plus 2pt \@minus 0pt}%
                                     {12pt}%
                                     {\subsecsize}}
\newcommand\subsubsection{\def\@seccntformat##1{{\csname the##1\endcsname\nobreakspace}}\@startsection{subsubsection}{3}{\z@}%
                                     {12pt  \@plus 2pt \@minus 0pt}%
                                     {12pt}%
                                     {\subsubsecsize}}
\newcommand\paragraph{\def\@seccntformat##1{{\csname the##1\endcsname\nobreakspace}}\@startsection{paragraph}{4}{\z@}%
                                    {3.25ex \@plus1ex \@minus.2ex}%
                                    {-1em}%
                                    {\paragraphsize}}
\newcommand\subparagraph{\@startsection{subparagraph}{5}{\parindent}%
                                       {3.25ex \@plus1ex \@minus .2ex}%
                                       {-1em}%
                                      {\subparagraphsize}}
%
\def\@seccntformat#1{{\csname the#1\endcsname\nobreakspace}}
%
\def\@sect#1#2#3#4#5#6[#7]#8{%
  \ifnum #2>\c@secnumdepth
    \let\@svsec\@empty
  \else
    \refstepcounter{#1}%
    \protected@edef\@svsec{\@seccntformat{#1}\relax}%
  \fi
  \@tempskipa #5\relax
  \ifdim \@tempskipa>\z@
    \begingroup
      #6{%
        {\hskip #3\relax\@svsec}%\@hangfrom
          \interlinepenalty \@M #8\@@par}%
    \endgroup
    \csname #1mark\endcsname{#7}%
    \addcontentsline{toc}{#1}{%
      \ifnum #2>\c@secnumdepth \else
        \protect\numberline{\csname the#1\endcsname}%
      \fi
      #7}%
  \else
    \def\@svsechd{%
      #6{\hskip #3\relax
      \@svsec #8}%
      \csname #1mark\endcsname{#7}%
      \addcontentsline{toc}{#1}{%
        \ifnum #2>\c@secnumdepth \else
          \protect\numberline{\csname the#1\endcsname}%
        \fi
        #7}}%
  \fi
  \@xsect{#5}}
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Lists style
%
\if@twocolumn
  \setlength\leftmargini  {2em}
\else
  \setlength\leftmargini  {2.5em}
\fi
\leftmargin  \leftmargini
\setlength\leftmarginii  {2.2em}
\setlength\leftmarginiii {1.87em}
\setlength\leftmarginiv  {1.7em}
\if@twocolumn
  \setlength\leftmarginv  {.5em}
  \setlength\leftmarginvi {.5em}
\else
  \setlength\leftmarginv  {1em}
  \setlength\leftmarginvi {1em}
\fi
\setlength  \labelsep  {.5em}
\setlength  \labelwidth{\leftmargini}
\addtolength\labelwidth{-\labelsep}
\@beginparpenalty -\@lowpenalty
\@endparpenalty   -\@lowpenalty
\@itempenalty     -\@lowpenalty
\renewcommand\theenumi{\@arabic\c@enumi}
\renewcommand\theenumii{\@alph\c@enumii}
\renewcommand\theenumiii{\@roman\c@enumiii}
\renewcommand\theenumiv{\@Alph\c@enumiv}
\newcommand\labelenumi{\theenumi.}
\newcommand\labelenumii{\theenumii.}
\newcommand\labelenumiii{\theenumiii.}
\newcommand\labelenumiv{\theenumiv.}
\renewcommand\p@enumii{\theenumi}
\renewcommand\p@enumiii{\theenumi(\theenumii)}
\renewcommand\p@enumiv{\p@enumiii\theenumiii}
\newcommand\labelitemi{\textbullet}
\newcommand\labelitemii{\normalfont\bfseries \textendash}
\newcommand\labelitemiii{\textasteriskcentered}
\newcommand\labelitemiv{\textperiodcentered}
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Numbered list
%
\def\listfont{\fontsize{10bp}{12bp}\selectfont}
%
\def\enumargs{%
   \listfont%
   \leftmargini12pt%
   \leftmarginii7pt%
   \leftmarginiii0pt%
   \ifx\@@chcode\@prefacecode\topsep 0pt\else\topsep 12pt\fi%
   \partopsep     \z@%
   \itemsep       12\p@%
   \parsep        \z@%
   \labelsep      4.3pt%
   \rightmargin   \z@%
   \raggedright%
   \listparindent \parindent%
   \itemindent    \z@}%

\def\enumerate{%
    \@ifnextchar[{\@numerate}{\@numerate[0.]}}

\def\@numerate[#1]{\par%
     \ifnum \@enumdepth >5 \@toodeep\else
     \advance\@enumdepth \@ne
     \edef\@enumctr{enum\romannumeral\the\@enumdepth}
     \list{\csname label\@enumctr\endcsname}{%
       \enumargs%
       \setlength{\leftmargin}{\csname leftmargin\romannumeral\the\@enumdepth\endcsname}
       \usecounter{\@enumctr}
       \settowidth\labelwidth{#1}
       \addtolength{\leftmargin}{\labelwidth}
       \addtolength{\leftmargin}{\labelsep}
       \def\makelabel##1{\ifnum \@enumdepth >1\hbox to \labelwidth{##1\hfill}\else\hss\llap{##1}\fi}}%
     \fi
   }
\let\endenumerate\endlist
%
\def\itemargs{%
\ifnum \@itemdepth>1\topsep0\p@\else\ifnum \@enumdepth>0\topsep12\p@\else\topsep12\p@\fi\fi%
\ifnum \@itemdepth>1\leftmargini\z@\else\ifnum\@enumdepth>0\leftmargini\z@\else\leftmargini12\p@\fi\fi%
   \leftmarginii  \z@%
   \leftmarginiii \z@%
   \partopsep     \z@%
   \itemsep 12\p@%
   \parsep        \z@%
   \labelsep5\p@%
   \rightmargin   \z@%
   \listparindent \parindent%
   \itemindent    \z@}
%
\DeclareFontEncoding{TS1}{}{}
\AtBeginDocument{\def\textbullet{{\fontencoding{TS1}\fontfamily{\rmdefault}\selectfont\char136}}}
%\def\listtextbullet{{\fontencoding{U}\fontfamily{pzd}\fontsize{6bp}{6bp}\selectfont\char110}}%
%
\def\@@ndash{--}
%
\def\itemize{%
   \@ifnextchar[{\@itemize}{\@itemize[\textbullet]}}

\def\@itemize[#1]{%
     \def\@@@ndash{#1}
     \ifnum \@itemdepth >3 \@toodeep\else
     \advance\@itemdepth \@ne
     \edef\@itemctr{item\romannumeral\the\@itemdepth}
     \list{\csname label\@itemctr\endcsname}{%
       \itemargs
       \setlength{\leftmargin}{\csname leftmargin\romannumeral\the\@itemdepth\endcsname}
       \settowidth\labelwidth{#1}
%       \ifx\@@ndash\@@@ndash\addtolength{\labelsep}{.5pt}\fi%
       \addtolength{\leftmargin}{\labelwidth}
       \addtolength{\leftmargin}{\labelsep}
       \def\makelabel##1{{##1}}}%\hss \llap
     \fi\listfont}%
\def\enditemize{\endlist}
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Unnumbered list%%
%
\def\listfont{}%
\def\unenumargs{%
   \listfont%
   \leftmargini\parindent%
   \topsep6pt%
   \partopsep     \z@%
   \itemsep       \z@%
   \parsep        \z@%
   \labelsep      0\p@%
   \rightmargin   \z@%
   \raggedright%
   \listparindent \parindent%
   \itemindent    -10pt}%

\def\unenumerate{%
    \@ifnextchar[{\@unenumerate}{\@unenumerate[0.]}}

\def\@unenumerate[#1]{\par%
     \ifnum \@enumdepth >3 \@toodeep\else
     \advance\@enumdepth \@ne
     \edef\@enumctr{enum\romannumeral\the\@enumdepth}
     \list{}{%\csname label\@enumctr\endcsname
       \unenumargs
       \setlength{\leftmargin}{\csname leftmargin\romannumeral\the\@enumdepth\endcsname}
       \usecounter{\@enumctr}
       \settowidth\labelwidth{#1}
       \addtolength{\leftmargin}{\labelwidth}
       \addtolength{\leftmargin}{\labelsep}
       \def\makelabel##1{\hss\llap{##1}}}%
     \fi
   }
\let\endunenumerate\endlist%
%%%%%%%%%
\newenvironment{otherlist}{}{}
%
%%%%%%%%%
\newenvironment{description}
               {\list{}{\labelwidth\z@ \itemindent-\leftmargin
                        \let\makelabel\descriptionlabel}}
               {\endlist}
\newcommand*\descriptionlabel[1]{\hspace\labelsep
                                \normalfont\bfseries #1}
%%%%%%%%
\newenvironment{verse}
               {\let\\\@centercr
                \list{}{\itemsep      \z@
                        \itemindent   -1.5em%
                        \listparindent\itemindent
                        \rightmargin  \leftmargin
                        \advance\leftmargin 1.5em}%
                \item\relax}
               {\endlist}
%%%%%%%%
\newenvironment{quotation}
               {\list{}{\listparindent 1.5em%
                        \itemindent    \listparindent
                        \rightmargin   \leftmargin
                        \parsep        \z@ \@plus\p@}%
                \item\relax}
               {\endlist}
%%%%%%%%
\newenvironment{quote}
               {\list{}{\leftmargin=10mm\topsep12pt\rightmargin\leftmargin%
               \partopsep0pt\parindent9pt\listparindent9pt\parsep\z@\labelwidth=0pt%
               \fontsize{9bp}{12bp}\selectfont\itshape}%
                \item\relax}
               {\endlist}
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%\if@compatibility
%\newenvironment{titlepage}
%    {%
%      \cleardoublepage
%      \if@twocolumn
%        \@restonecoltrue\onecolumn
%      \else
%        \@restonecolfalse\newpage
%      \fi
%      \thispagestyle{empty}%
%      \setcounter{page}\z@
%    }%
%    {\if@restonecol\twocolumn \else \newpage \fi
%    }
%\else
%\newenvironment{titlepage}
%    {%
%      \cleardoublepage
%      \if@twocolumn
%        \@restonecoltrue\onecolumn
%      \else
%        \@restonecolfalse\newpage
%      \fi
%      \thispagestyle{empty}%
%      \setcounter{page}\@ne
%    }%
%    {\if@restonecol\twocolumn \else \newpage \fi
%     \if@twoside\else
%        \setcounter{page}\@ne
%     \fi
%    }
%\fi
%
%%%%%%%%%%%%%%%%%%%%%%%% Tables and Figures Style%
%
\setlength\arraycolsep{5\p@}
\setlength\tabcolsep{6\p@}
\setlength\arrayrulewidth{.4\p@}
\setlength\doublerulesep{2\p@}
\setlength\tabbingsep{\labelsep}
\skip\@mpfootins = \skip\footins
\setlength\fboxsep{3\p@}
\setlength\fboxrule{.4\p@}
\@addtoreset {equation}{chapter}
%
\renewcommand\theequation{\ifnum \c@chapter>\z@\fi\@arabic\c@equation}
%
\newcommand\figurename{Figure}
\newcommand\tablename{Table}
%
\newcounter{figure}[chapter]
%
\renewcommand \thefigure
     {\ifnum \c@chapter>\z@ \fi\@arabic\c@figure}%
\def\fps@figure{tbp}%
\def\ftype@figure{1}
\def\ext@figure{lof}
\def\fnum@figure{\figurename\nobreakspace\thefigure.}%
%
\newenvironment{figure}
               {\@float{figure}}
               {\end@float}
\newenvironment{figure*}
               {\@dblfloat{figure}}
               {\end@dblfloat}
%
\def\schemaname{Schema}
\newcounter{schema}[chapter]
%
\renewcommand \theschema
     {\ifnum \c@chapter>\z@ \fi\@arabic\c@schema}%
\def\fps@schema{tbp}%
\def\ftype@schema{1}
\def\ext@schema{lof}
\def\fnum@schema{\schemaname\nobreakspace\theschema.}%

\newenvironment{schema}
               {\@float{schema}}
               {\end@float}
%
%
\newcounter{table}[chapter]
\renewcommand \thetable{\ifnum \c@chapter>\z@\fi\@arabic\c@table}%
%
\def\fps@table{tbp}
\def\ftype@table{2}
\def\ext@table{lot}
\def\fnum@table{\tablename\nobreakspace\thetable.}
%
\newenvironment{table}
               {\@float{table}}
               {\end@float}
\newenvironment{table*}
               {\@dblfloat{table}}
               {\end@dblfloat}
%

%
\newlength\abovecaptionskip
\newlength\belowcaptionskip
\setlength\abovecaptionskip{9\p@}
\setlength\belowcaptionskip{0\p@}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
\DeclareOldFontCommand{\rm}{\normalfont\rmfamily}{\mathrm}
\DeclareOldFontCommand{\sf}{\normalfont\sffamily}{\mathsf}
\DeclareOldFontCommand{\tt}{\normalfont\ttfamily}{\mathtt}
\DeclareOldFontCommand{\bf}{\normalfont\bfseries}{\mathbf}
\DeclareOldFontCommand{\it}{\normalfont\itshape}{\mathit}
\DeclareOldFontCommand{\sl}{\normalfont\slshape}{\@nomath\sl}
\DeclareOldFontCommand{\sc}{\normalfont\scshape}{\@nomath\sc}
\DeclareRobustCommand*\cal{\@fontswitch\relax\mathcal}
\DeclareRobustCommand*\mit{\@fontswitch\relax\mathnormal}
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Frontmatter Elements
%
%%%%%%%%%%%%%%%%%%%%%%%% maketitle
%
\newcommand\maketitle{\par
  \begingroup
    \renewcommand\thefootnote{\@fnsymbol\c@footnote}%
    \def\@makefnmark{\rlap{\@textsuperscript{\normalfont\@thefnmark}}}%
    \long\def\@makefntext##1{\parindent 1em\noindent
            \hb@xt@1.8em{%
                \hss\@textsuperscript{\normalfont\@thefnmark}}##1}%
    \if@twocolumn
      \ifnum \col@number=\@ne
        \@maketitle
      \else
        \twocolumn[\@maketitle]%
      \fi
    \else
      \newpage
      \global\@topnum\z@   % Prevents figures from going at top of page.
      \@maketitle
    \fi
    \thispagestyle{plain}\@thanks
  \endgroup
  \setcounter{footnote}{0}%
  \global\let\thanks\relax
  \global\let\maketitle\relax
  \global\let\@maketitle\relax
  \global\let\@thanks\@empty
  \global\let\@author\@empty
  \global\let\@date\@empty
  \global\let\@title\@empty
  \global\let\title\relax
  \global\let\author\relax
  \global\let\date\relax
  \global\let\and\relax
}
\def\@maketitle{%
  \newpage
  \null
  \vskip 2em%
  \begin{center}%
  \let \footnote \thanks
    {\LARGE \@title \par}%
    \vskip 1.5em%
    {\large
      \lineskip .5em%
      \begin{tabular}[t]{c}%
        \@author
      \end{tabular}\par}%
    \vskip 1em%
    {\large \@date}%
  \end{center}%
  \par
  \vskip 1.5em}
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
\newcommand\contentsname{Contents}
\newcommand\listfigurename{List of Figures}
\newcommand\listtablename{List of Tables}
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Table of Contents
%
\newcommand\@pnumwidth{1.55em}
\newcommand\@tocrmarg{33pt}
\newcommand\@dotsep{4.5}
\setcounter{tocdepth}{0}
\newcommand\tableofcontents{%
    \if@twocolumn
      \@restonecoltrue\onecolumn
    \else
      \@restonecolfalse
    \fi
%    \chapter*{\contentsname
%        \@mkboth{%
%           \MakeUppercase\contentsname}{\MakeUppercase\contentsname}}%
    \@starttoc{toc}%
    \if@restonecol\twocolumn\fi
    }
%
\def\tocchapstyle{\reset@font\fontsize{10bp}{12bp}\selectfont}
\def\tocauthorfont{\reset@font\rmfamily\fontsize{10bp}{12bp}\selectfont\itshape}
\def\tocfmchapterstyle{\reset@font\rmfamily\fontsize{10bp}{12bp}\selectfont\bfseries\color{hndrdcyan}}
\def\tocbmchapterstyle{\reset@font\rmfamily\fontsize{10bp}{12bp}\selectfont\bfseries\color{hndrdcyan}}
%
\newcommand*\l@part[2]{%
  \ifnum \c@tocdepth >-2\relax
    \addpenalty{-\@highpenalty}%
    \addvspace{2.25em \@plus\p@}%
    \setlength\@tempdima{3em}%
    \begingroup
      \parindent \z@ \rightskip \@pnumwidth
      \parfillskip -\@pnumwidth
      {\leavevmode
       \large \bfseries #1\hfil \hb@xt@\@pnumwidth{\hss #2}}\par
       \nobreak
         \global\@nobreaktrue
         \everypar{\global\@nobreakfalse\everypar{}}%
    \endgroup
  \fi}
%
\newcommand*\l@chapter[2]{\bgroup%
  \ifnum \c@tocdepth >\m@ne
    \addpenalty{-\@highpenalty}%
    \if@nobreak\else\ifnum\c@tocdepth>0\vskip 12\p@\else\vskip 12\p@\fi\fi%
    \setlength\@tempdima{\tocchapnum}%
    \begingroup\def\numberline##1{\hb@xt@\@tempdima{\color{hndrdcyan}\bfseries Chapter\space##1}\hfil\nobreak\hb@xt@\@pnumwidth{\reset@font\color{hndrdcyan}\bfseries\hss#2}\newline}
      \parindent \z@ \rightskip \@tocrmarg\advance\rightskip by \z@ \@plus 2cm%
      \parfillskip -\@tocrmarg
      \leavevmode
      %\advance\leftskip\@tempdima%
      %\hskip -\@tempdima%
      \tocchapstyle#1\nobreak\hfil \nobreak\hb@xt@\@pnumwidth{}\par%#2\vskip4pt%
      \penalty\@highpenalty
    \endgroup%
  \fi\egroup}
%
\newcommand*\l@secchap[2]{\bgroup%
  \ifnum \c@tocdepth >\m@ne
    \addpenalty{-\@highpenalty}%
    \if@nobreak\else\ifnum\c@tocdepth>0\vskip 12\p@\else\vskip 12\p@\fi\fi%
    \setlength\@tempdima{\tocchapnum}%
    \begingroup\def\numberline##1{\hb@xt@\@tempdima{\color{hndrdcyan}\bfseries Section\space##1}\hfil\nobreak\hb@xt@\@pnumwidth{\reset@font\color{hndrdcyan}\bfseries\hss#2}\newline}
      \parindent \z@ \rightskip \@tocrmarg\advance\rightskip by \z@ \@plus 2cm%
      \parfillskip -\@tocrmarg
      \leavevmode
      %\advance\leftskip\@tempdima%
      %\hskip -\@tempdima%
      \tocchapstyle#1\nobreak\hfil \nobreak\hb@xt@\@pnumwidth{}\par%#2\vskip4pt%
      \penalty\@highpenalty
    \endgroup%
  \fi\egroup}

\newcommand*\l@fmchapter[2]{%
  \ifnum \c@tocdepth >\m@ne
    \addpenalty{-\@highpenalty}%
    \addvspace{0\p@}%
    \setlength\@tempdima{\tocchapnum}%
    \begingroup
      \parindent \z@ \rightskip \@pnumwidth
      \parfillskip -\@pnumwidth
      {\leavevmode \tocfmchapterstyle
      \advance\leftskip\@tempdima%
      \hskip -\@tempdima
      #1\nobreak\hfil \nobreak\hb@xt@\@pnumwidth{\hss#2}\par}%\vskip3pt%#2
      \penalty\@highpenalty
    \endgroup
  \fi}
%
\newcommand*\l@bmchapter[2]{%
  \ifnum \c@tocdepth >\m@ne
    \addpenalty{-\@highpenalty}\addvspace{0\p@}%
    \setlength\@tempdima{\tocchapnum}%
    \begingroup
      \parindent \z@ \rightskip \@pnumwidth
      \parfillskip -\@pnumwidth
      \leavevmode \tocbmchapterstyle%
      \advance\leftskip\@tempdima%
      \hskip -\@tempdima%
      #1\nobreak\hfil \nobreak\hb@xt@\@pnumwidth{\hss#2}\par%\vskip3pt%#2
      \penalty\@highpenalty
    \endgroup
  \fi}

\gdef\tocauthorsep{\ifnum\punctcount=2\protect\space and \else\unskip, \advance\punctcount by -1 \fi}%

\newcommand*\l@author[2]{\bgroup%\def\footnote##1{}%\def\schangecase##1{\MakeUppercase{##1}}%%
%\def\numberline##1{}%{\hbox to \chap@toc@num@dim{Chapter\nobreakspace##1\hskip5\p@}}
  \ifnum \c@tocdepth >\m@ne
    \addpenalty\@secpenalty
    \if@nobreak\else\addvspace{0\p@}\fi%
    \setlength\@tempdima{0em}%
    \begingroup%
      \parindent \z@%
      \rightskip \@pnumwidth%
      \advance\rightskip\z@ plus1fil%
      \parfillskip -\@pnumwidth%
      \leavevmode \tocauthorfont%
      %\advance\leftskip\tocchapnum%
      by #1\hfill%\nobreak\tocdots
      \nobreak\hb@xt@\@pnumwidth{}\par\vskip0pt%\vskip4.4pt%
    \endgroup
  \fi\egroup}
%


\newcommand*\l@section{\@dottedtocline{1}{1.5em}{2.3em}}
\newcommand*\l@subsection{\@dottedtocline{2}{3.8em}{3.2em}}
\newcommand*\l@subsubsection{\@dottedtocline{3}{7.0em}{4.1em}}
\newcommand*\l@paragraph{\@dottedtocline{4}{10em}{5em}}
\newcommand*\l@subparagraph{\@dottedtocline{5}{12em}{6em}}
%
%
\newdimen\tocchapnum
\newdimen\tocsecnum
\newdimen\tocsbsecnum
\newdimen\tocsbsbsecnum
\newdimen\tocsectotalnum
\newdimen\tocsbsectotalnum
\newdimen\tocsbsbsectotalnum
\newdimen\tocunsbsectotalnum

\gdef\MaxmTocnum#1#2#3#4{%
\setbox\@tempboxa\hbox{\tocchapstyle Chapter\space#1}\global\tocchapnum=\wd\@tempboxa%
%\setbox\@tempboxa\hbox{\tocsecheadingstyle#2\hskip5\p@}\global\tocsecnum=\wd\@tempboxa%
%\setbox\@tempboxa\hbox{\tocsubsecheadingstyle#3\hskip5\p@}\global\tocsbsecnum=\wd\@tempboxa%
%\setbox\@tempboxa\hbox{\tocheadingstyle#4\hskip5\p@}\global\tocsbsbsecnum=\wd\@tempboxa%
%\global\tocsectotalnum=\tocchapnum%
%\global\tocsbsectotalnum=\tocchapnum\advance\tocsbsectotalnum by \tocsecnum%
%\global\tocsbsbsectotalnum=\tocsbsectotalnum\advance\tocsbsbsectotalnum by \tocsbsecnum%
%\global\tocunsbsectotalnum=\tocchapnum\advance\tocunsbsectotalnum by 9pt
}
%
\MaxmTocnum{10}{9.4}{3.9.9}{}
%


\def\@dottedtocline#1#2#3#4#5{\bgroup%
  \ifnum #1>\c@tocdepth \else%%
    \if@nobreak\else\vskip0pt\fi%
    {\leftskip #2\relax \rightskip \@tocrmarg \parfillskip -\rightskip%
     \parindent #2\relax%\@afterindenttrue
     \interlinepenalty\@M%
     \leavevmode%
     \@tempdima #3\relax\def\numberline##1{\hb@xt@\@tempdima{##1\hfill}}%
     \advance\leftskip \@tempdima%
     \hskip -\leftskip%
     #4\nobreak%
%%     \leaders\hbox{$\m@th
%%        \mkern \@dotsep mu\hbox{.}\mkern \@dotsep
%%        mu$}
        \hfill
     \nobreak
     \hb@xt@\@pnumwidth{\hfil\normalfont\rmfamily\selectfont#5}%#5
     \par}%
  \fi\egroup}

%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% List of Figures
%
\newcommand\listoffigures{%
    \if@twocolumn
      \@restonecoltrue\onecolumn
    \else
      \@restonecolfalse
    \fi
%%    \chapter*{\listfigurename}%
      \@mkboth{\MakeUppercase\listfigurename}%
              {\MakeUppercase\listfigurename}%
    \@starttoc{lof}%
    \if@restonecol\twocolumn\fi
    }
\newcommand*\l@figure{\@dottedtocline{1}{1.5em}{2.3em}}
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% List of Tables
%
\newcommand\listoftables{%
    \if@twocolumn
      \@restonecoltrue\onecolumn
    \else
      \@restonecolfalse
    \fi
%%    \chapter*{\listtablename}%
      \@mkboth{%
          \MakeUppercase\listtablename}%
         {\MakeUppercase\listtablename}%
    \@starttoc{lot}%
    \if@restonecol\twocolumn\fi
    }
\let\l@table\l@figure
%
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Backmatter Elements%%%%%%%%%%
%
\newenvironment{backmatter}{}{}
\newenvironment{backchapter}[1][]{\par}{\par}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Appendix
%
\newcommand\appendixname{Appendix}
\newcommand\appendix{\par
  \setcounter{chapter}{0}%
  \setcounter{section}{0}%
  \gdef\@chapapp{\appendixname}%
  \gdef\thechapter{\@Alph\c@chapter}}
%
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Bibliography
%
\newcommand\bibname{Bibliography}
%
\newdimen\bibindent
\setlength\bibindent{1.5em}
%
\newenvironment{thebibliography}[1]
     {\chapter*{\bibname}%
      \@mkboth{\MakeUppercase\bibname}{\MakeUppercase\bibname}%
      \list{\@biblabel{\@arabic\c@enumiv}}%
           {\settowidth\labelwidth{\@biblabel{#1}}%
            \leftmargin\labelwidth
            \advance\leftmargin\labelsep
            \@openbib@code
            \usecounter{enumiv}%
            \let\p@enumiv\@empty
            \renewcommand\theenumiv{\@arabic\c@enumiv}}%
      \sloppy
      \clubpenalty4000
      \@clubpenalty \clubpenalty
      \widowpenalty4000%
      \sfcode`\.\@m}
     {\def\@noitemerr
       {\@latex@warning{Empty `thebibliography' environment}}%
      \endlist}
\newcommand\newblock{\hskip .11em\@plus.33em\@minus.07em}
\let\@openbib@code\@empty
%
\RequirePackage[\@biboptions]{natbib}
%
\renewcommand\bibsection{\clearpage\section*{\refname}}%
\def\bibfont{\fontsize{10bp}{12bp}\selectfont\raggedright}%
\bibsep=12\p@
\bibhang12\p@
%\renewcommand\@biblabel[1]{#1.}
%
\def\unnumbiblio{\let\@bibsetup\NAT@bibsetup}%
%
\renewcommand\@biblabel[1]{{\fontsize{8.5bp}{12bp}\selectfont[#1]}}
\renewcommand\NAT@bibsetnum[1]{\settowidth\labelwidth{\@biblabel{#1}}\labelsep=3pt%
   %\setlength{\leftmargin}{\labelwidth}\addtolength{\leftmargin}{\labelsep}%
   \leftmargin\z@\labelwidth\z@\itemindent\labelsep%\labelsep\z@
   \setlength{\itemsep}{\bibsep}\setlength{\parsep}{\z@}%
   \ifNAT@openbib
     %\addtolength{\leftmargin}{\bibindent}%
     %\setlength{\itemindent}{-\bibindent}%
     %\setlength{\listparindent}{\itemindent}%
     \setlength{\parsep}{0pt}%
   \fi
}
%
\renewenvironment{thebibliography}[1]{%
 \bibsection
 \parindent\z@
 \bibpreamble\columnsep12pt\columnseprule \z@\multicolsep = 0pt plus 0pt minus 0pt%
 \begin{multicols}{2}
 \bibfont
 \list{\@biblabel{\the\c@NAT@ctr}}{\@bibsetup{#1}\global\c@NAT@ctr\z@}%
 \ifNAT@openbib
   \renewcommand\newblock{\par}%
 \else
   \renewcommand\newblock{\hskip .11em \@plus.33em \@minus.07em}%
 \fi
 \sloppy\clubpenalty4000\widowpenalty4000
 \sfcode`\.\@m
 \let\NAT@bibitem@first@sw\@firstoftwo
    \let\citeN\cite \let\shortcite\cite
    \let\citeasnoun\cite
}{%
 \bibitem@fin
 \bibpostamble
 \def\@noitemerr{%
  \PackageWarning{natbib}{Empty `thebibliography' environment}%
 }%
 \endlist\end{multicols}
 \bibcleanup
}%

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Index
%
\RequirePackage{multicol}
%
\newcommand\indexname{Index}
\setlength\columnsep{10\p@}
\setlength\columnseprule{0\p@}
%
\newenvironment{theindex}
               {\if@twocolumn
                  \@restonecolfalse
                \else
                  \@restonecoltrue
                \fi
                \twocolumn[\@makeschapterhead{\indexname}]%
                \@mkboth{\MakeUppercase\indexname}%
                        {\MakeUppercase\indexname}%
                \thispagestyle{plain}\parindent\z@
                \parskip\z@\relax
                \columnseprule \z@
                \columnsep 35\p@
                \let\item\@idxitem}
               {\if@restonecol\onecolumn\else\clearpage\fi}
\newcommand\@idxitem{\par\hangindent 40\p@}
\newcommand\subitem{\@idxitem \hspace*{20\p@}}
\newcommand\subsubitem{\@idxitem \hspace*{30\p@}}
\newcommand\indexspace{\par \vskip 10\p@ \@plus5\p@ \@minus3\p@\relax}
%
\def\today{\ifcase\month\or
  January\or February\or March\or April\or May\or June\or
  July\or August\or September\or October\or November\or December\fi
  \space\number\day, \number\year}
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\widowpenalty=10000 \clubpenalty=10000 \hyphenpenalty=1000
\tolerance=1000 \lefthyphenmin=3 \righthyphenmin=3
\raggedbottom%
%\flushbottom
\frenchspacing
\emergencystretch=1em
%%%%%%%%%%%%%%%%%%
\RequirePackage{amsmath}%

\RequirePackage{amssymb,latexsym,upgreek,caption,graphicx}

\RequirePackage[figuresright]{rotating}

\RequirePackage{makeidx}

\makeindex

\RequirePackage{newtxmath}

\DeclareSymbolFont{num}{\encodingdefault}{\rmdefault}{m}{n}
\DeclareSymbolFont{alph}{\encodingdefault}{\rmdefault}{m}{it}

\SetSymbolFont{alph}{normal}{\encodingdefault}{\rmdefault}{m}{it}
\SetSymbolFont{num}{normal}{\encodingdefault}{\rmdefault}{m}{n}

\SetSymbolFont{alph}{bold}{\encodingdefault}{\rmdefault}{b}{it}
\SetSymbolFont{num}{bold}{\encodingdefault}{\rmdefault}{b}{n}

\DeclareMathSymbol{0}{\mathalpha}{num}{"30}
\DeclareMathSymbol{1}{\mathalpha}{num}{"31}
\DeclareMathSymbol{2}{\mathalpha}{num}{"32}
\DeclareMathSymbol{3}{\mathalpha}{num}{"33}
\DeclareMathSymbol{4}{\mathalpha}{num}{"34}
\DeclareMathSymbol{5}{\mathalpha}{num}{"35}
\DeclareMathSymbol{6}{\mathalpha}{num}{"36}
\DeclareMathSymbol{7}{\mathalpha}{num}{"37}
\DeclareMathSymbol{8}{\mathalpha}{num}{"38}
\DeclareMathSymbol{9}{\mathalpha}{num}{"39}

\DeclareMathSymbol{A}{\mathalpha}{alph}{"41}
\DeclareMathSymbol{B}{\mathalpha}{alph}{"42}
\DeclareMathSymbol{C}{\mathalpha}{alph}{"43}
\DeclareMathSymbol{D}{\mathalpha}{alph}{"44}
\DeclareMathSymbol{E}{\mathalpha}{alph}{"45}
\DeclareMathSymbol{F}{\mathalpha}{alph}{"46}
\DeclareMathSymbol{G}{\mathalpha}{alph}{"47}
\DeclareMathSymbol{H}{\mathalpha}{alph}{"48}
\DeclareMathSymbol{I}{\mathalpha}{alph}{"49}
\DeclareMathSymbol{J}{\mathalpha}{alph}{"4A}
\DeclareMathSymbol{K}{\mathalpha}{alph}{"4B}
\DeclareMathSymbol{L}{\mathalpha}{alph}{"4C}
\DeclareMathSymbol{M}{\mathalpha}{alph}{"4D}
\DeclareMathSymbol{N}{\mathalpha}{alph}{"4E}
\DeclareMathSymbol{O}{\mathalpha}{alph}{"4F}
\DeclareMathSymbol{P}{\mathalpha}{alph}{"50}
\DeclareMathSymbol{Q}{\mathalpha}{alph}{"51}
\DeclareMathSymbol{R}{\mathalpha}{alph}{"52}
\DeclareMathSymbol{S}{\mathalpha}{alph}{"53}
\DeclareMathSymbol{T}{\mathalpha}{alph}{"54}
\DeclareMathSymbol{U}{\mathalpha}{alph}{"55}
\DeclareMathSymbol{V}{\mathalpha}{alph}{"56}
\DeclareMathSymbol{W}{\mathalpha}{alph}{"57}
\DeclareMathSymbol{X}{\mathalpha}{alph}{"58}
\DeclareMathSymbol{Y}{\mathalpha}{alph}{"59}
\DeclareMathSymbol{Z}{\mathalpha}{alph}{"5A}

\DeclareMathSymbol{a}{\mathalpha}{alph}{"61}
\DeclareMathSymbol{b}{\mathalpha}{alph}{"62}
\DeclareMathSymbol{c}{\mathalpha}{alph}{"63}
\DeclareMathSymbol{d}{\mathalpha}{alph}{"64}
\DeclareMathSymbol{e}{\mathalpha}{alph}{"65}
\DeclareMathSymbol{f}{\mathalpha}{alph}{"66}
\DeclareMathSymbol{g}{\mathalpha}{alph}{"67}
\DeclareMathSymbol{h}{\mathalpha}{alph}{"68}
\DeclareMathSymbol{i}{\mathalpha}{alph}{"69}
\DeclareMathSymbol{j}{\mathalpha}{alph}{"6A}
\DeclareMathSymbol{k}{\mathalpha}{alph}{"6B}
\DeclareMathSymbol{l}{\mathalpha}{alph}{"6C}
\DeclareMathSymbol{m}{\mathalpha}{alph}{"6D}
\DeclareMathSymbol{n}{\mathalpha}{alph}{"6E}
\DeclareMathSymbol{o}{\mathalpha}{alph}{"6F}
\DeclareMathSymbol{p}{\mathalpha}{alph}{"70}
\DeclareMathSymbol{q}{\mathalpha}{alph}{"71}
\DeclareMathSymbol{r}{\mathalpha}{alph}{"72}
\DeclareMathSymbol{s}{\mathalpha}{alph}{"73}
\DeclareMathSymbol{t}{\mathalpha}{alph}{"74}
\DeclareMathSymbol{u}{\mathalpha}{alph}{"75}
\DeclareMathSymbol{v}{\mathalpha}{alph}{"76}
\DeclareMathSymbol{w}{\mathalpha}{alph}{"77}
\DeclareMathSymbol{x}{\mathalpha}{alph}{"78}
\DeclareMathSymbol{y}{\mathalpha}{alph}{"79}
\DeclareMathSymbol{z}{\mathalpha}{alph}{"7A}

\@ifpackageloaded{amsmath}{%
\def\tagform@#1{\maketag@@@{(\ignorespaces#1\unskip\@@italiccorr)\hskip12pt}}%
}{}



%\RequirePackage{txfonts}

\def\@@eqncr{\let\reserved@a\relax
    \ifcase\@eqcnt \def\reserved@a{& & &}\or \def\reserved@a{& &}%
     \or \def\reserved@a{&}\else
       \let\reserved@a\@empty
       \@latex@error{Too many columns in eqnarray environment}\@ehc\fi
     \reserved@a %\if@eqnsw\@eqnnum\stepcounter{equation}\fi
     \global\@eqnswtrue\global\@eqcnt\z@\cr}

\def\eqnarray{%
   \stepcounter{equation}%
   \def\@currentlabel{\p@equation\theequation}%
   \global\@eqnswtrue
   \m@th
   \global\@eqcnt\z@
   \tabskip\@centering
   \let\\\@eqncr
   $$\everycr{}\halign to\displaywidth\bgroup
       \hskip\@centering$\displaystyle\tabskip\z@skip{\if@eqnsw\@eqnnum\stepcounter{equation}\fi##}$\@eqnsel
      &\global\@eqcnt\@ne\hskip \tw@\arraycolsep \hfil${##}$\hfil
      &\global\@eqcnt\tw@ \hskip \tw@\arraycolsep
         $\displaystyle{##}$\hfil\tabskip\@centering
      &\global\@eqcnt\thr@@ \hb@xt@\z@\bgroup\hss##\egroup
         \tabskip\z@skip
      \cr
}
%%%%%%%%
\RequirePackage{vruler}
%\setvruler[\normbaselineskip][1][1][2][0][20pt][20pt][5.5pt][\textheight]%

\def\makevruler[#1][#2][#3][#4][#5]{\begingroup\offinterlineskip
\textheight=#5\vbadness=10000\vfuzz=120ex\overfullrule=0pt%
\global\setbox\bufferbox=\vbox to \textheight{%
{\parskip=0pt\hfuzz=150em\b@xheight=\textheight
\lineh@ight=#1\global\rulercount=#2%
\tot@l\b@xheight\divide\tot@l\lineh@ight\advance\tot@l2%
\refn@1\vskip-\lineh@ight\vskip1ex%
\loop\setbox\tempb@x=\hbox to0cm{{\reset@font\normalcolor\normalsize\hfil\fillzeros[#4]\rulercount}}%
\ht\tempb@x\lineh@ight\dp\tempb@x0pt\box\tempb@x\break
\advance\refn@1\global\advance\rulercount#3\relax
\ifnum\refn@<\tot@l\repeat}}\endgroup}
%%%%%%%%
%
%%%%%%%%%%%%%%%%%% Figure style
%
\def\fignumstyle{\reset@font\fontsize{8bp}{9bp}\selectfont\bfseries}
\def\figtextstyle{\reset@font\fontsize{8bp}{9bp}\selectfont\itshape}
\def\tblnumstyle{\reset@font\fontsize{8bp}{9bp}\selectfont\bfseries}
\def\tbltextstyle{\reset@font\fontsize{8bp}{9bp}\selectfont\itshape}
%
\long\def\@makecaption#1#2{%
%\ifx\@captype\fig@type%
  \vskip\abovecaptionskip
  \sbox\@tempboxa{{\figtextstyle#2}}%
  \ifdim \wd\@tempboxa >\hsize
    {\fignumstyle#1\par}{\figtextstyle#2\par}
  \else
    \global \@minipagefalse
    {\fignumstyle#1\par}{\figtextstyle#2\par}%
    %\hb@xt@\hsize{}%
  \fi
%%  \vskip\belowcaptionskip
}%
%
\newcommand\FIG[2]{%\setbox\Figbox\hbox{#1}
#1\par#2\par%
}
%%%%%%%%%%%%%%%%%% Table style
%
\RequirePackage{threeparttable}
\RequirePackage{booktabs}
%
\def\tblbdysize{\reset@font\fontsize{7.5bp}{10bp}\selectfont}%
\def\tblnotesize{\reset@font\fontsize{7.5bp}{9bp}\selectfont\itshape\raggedright}
\newcommand\TCH[1]{{\bf #1}}
%
\long\def\TBL#1#2#3{\def\arraystretch{1}\abovecaptionskip=10.5pt\let\hline\hlinerule
\let\footnotemark\tnote%
\renewcommand\footnotetext[2][]{\def\@tblftarg{##1}\ifx\@tblftarg\empty\item[]##2\else\item[##1]##2\fi}%
\begin{threeparttable}
{\tblbdysize#2}{#3}\par#1
\end{threeparttable}}
%
\def\endtablenotes{\vphantom{hypg}\par\vskip1pt\hrule \@height0.22pt\par\vskip2pt\endlist}
%
\def\TPTnoteSettings{%
 \setlength\leftmargin{3pt}%
 \setlength\labelwidth{0em}%
 \setlength\labelsep{.2em}\itemindent0.2em%
 \rightskip\tabcolsep \leftskip\tabcolsep\tblnotesize
}
%
\heavyrulewidth=0.22pt
\lightrulewidth=0.22pt
\cmidrulewidth=0.22pt
\abovetopsep=0pt
\aboverulesep=2pt
\belowrulesep=2.5pt
%
\def\toprule{\noalign{\ifnum0=`}\fi
  \@aboverulesep=\abovetopsep
  \global\@belowrulesep=3pt %global cos for use in the next noalign
  \global\@thisruleclass=\@ne
  \@ifnextchar[{\@BTrule}{\@BTrule[\heavyrulewidth]}}
%
\def\midrule{\noalign{\ifnum0=`}\fi
  \@aboverulesep=2.3pt
  \global\@belowrulesep=\belowrulesep
  \global\@thisruleclass=\@ne
  \@ifnextchar[{\@BTrule}{\@BTrule[0.22pt]}}
\def\botrule{\noalign{\ifnum0=`}\fi
  \@aboverulesep=\aboverulesep
  \global\@belowrulesep=1pt%\belowbottomsep
  \global\@thisruleclass=\@ne
  \@ifnextchar[{\@BTrule}{\@BTrule[\heavyrulewidth]}}
\def\hlinerule{\noalign{\ifnum0=`}\fi
  \@aboverulesep=2.3pt
  \global\@belowrulesep=\belowrulesep
  \global\@thisruleclass=\@ne
  \@ifnextchar[{\@BTrule}{\@BTrule[\lightrulewidth]}}
%
%%%%%%%%%%%%%%%%%% Author details
%
\newenvironment{authordetails}
{\clearpage\phantom{a}\vfill\parindent\z@\let\author\chpbkauth\let\address\chapbkaddress\color{hndrdcyan}
\noindent{\fontsize{11bp}{12bp}\selectfont\bfseries Author details\par}\vskip12pt\fontsize{10bp}{12bp}\selectfont}
{\par}
%
\newcounter{addrscnt}[chapter]
\def\chpbkauth#1{#1\par}
\newcommand\chapbkaddress[2][]{\def\@bkaddrss{#1}\stepcounter{addrscnt}%
\ifx\@bkaddrss\@empty\ifnum\theaddrscnt>1\vskip12pt\fi\else\vskip12pt#1\space\fi#2\par}
\def\IntechOpentext#1{\vskip16pt\noindent{\sffamily\selectfont\bfseries IntechOpen\par}\vskip-5.5pt\rule{\textwidth}{0.5pt}\par\vskip0.7mm%
#1\nobreakspace\includegraphics{license.eps}\par}
%%%%%%%%%
%%%%%%%%%%%%%%%%%% Box text
%
\RequirePackage[many]{tcolorbox}

\newcounter{boxcnt}

\newenvironment{Boxtext}[2][]
{\par\addvspace{12pt}\def\frstarg{#1}\def\boxsncarg{#2}\begin{tcolorbox}[breakable,arc=0pt,outer arc=0pt,boxrule=0pt,boxsep=0pt,top=6pt,left=6pt,right=6pt,bottom=6pt,middle=0pt,
toprule=0.75bp,bottomrule=0.75bp,leftrule=0.75bp,rightrule=0.75bp,colback=white, colbacktitle=white,colframe=black,%
coltitle=black, notitle, titlerule=0pt,fontupper=\fontsize{7.5bp}{10bp}\selectfont\raggedright,
]\parindent5mm\ifx\frstarg\@empty\else\noindent{\bfseries\frstarg}\par\vskip3pt\fi}
{\vphantom{hypg}\par\vspace*{-2pt}\end{tcolorbox}\vskip6pt\refstepcounter{boxcnt}{{\fontsize{8bp}{9bp}\selectfont\noindent{\bfseries Box\space\theboxcnt.\par}\noindent\itshape\boxsncarg\par}}
\addvspace{12pt}}
%
\let\theBoxA\relax
\newenvironment{BoxA}[2][]
{\par\addvspace{12pt plus2pt}%
\def\@xfloat##1[{\@ifnextchar{H}{\@float@HH{##1}[}{\@float@Hx{##1}[}}%% reinstate float.sty macro (over floatpag)
\gdef\@envopt{#1}%
\def\boxsection{\@startsection {section}{1}{\z@}%
                                   {-6pt \@plus -1pt}%
                                   {3pt}%
                                   {\bfseries}}
\let\section\boxsection
\renewcommand\normalsize{%
   \@setfontsize\normalsize{7.5bp}{10bp}
   \abovedisplayskip 10\p@ \@plus2\p@ \@minus0\p@
   \abovedisplayshortskip 10\p@ \@plus3\p@
   \belowdisplayshortskip 10\p@ \@plus3\p@ \@minus3\p@
   \belowdisplayskip \abovedisplayskip
   \let\@listi\@listI}
\normalsize
\ifx\@envopt\empty\begin{BoxTypeA*}{#2}\else\begin{BoxTypeA}[#1]{#2}\fi\parindent5mm}
{\vphantom{hypg}\par\vspace*{-2pt}\ifx\@envopt\empty\end{BoxTypeA*}\else\end{BoxTypeA}\fi\@endparenv}
%
%%\let\theBoxA\relax
%
\newtcolorbox[auto counter,number freestyle={\theBoxA}]{BoxTypeA}[2][]{%
label={#1},
breakable,
title={\boxnameA~\thetcbcounter\quad #2}
}
%
\newtcolorbox{BoxTypeA*}[2][]{%
breakable,
title={#2}
}
%
\gdef\theBoxA{\@arabic\c@tcb@cnt@BoxTypeA}
%
\renewtcolorbox[use counter from=BoxTypeA,number freestyle={\theBoxA}]{BoxTypeA}[2][]{%
label={#1},enhanced,%
breakable,arc=0pt,outer arc=0pt,boxrule=0pt,boxsep=0pt,top=6pt,left=6pt,right=6pt,bottom=6pt,middle=0pt,
toprule=0.75bp,bottomrule=0.75bp,leftrule=0.75bp,rightrule=0.75bp,colback=white, colbacktitle=white,colframe=black,%
coltitle=black, titlerule=0pt,fontupper=\fontsize{7.5bp}{10bp}\selectfont\raggedright,
title={\parbox{\textwidth}{\noindent{\bfseries Box\space\thetcbcounter.\par}\noindent\itshape#2\par}},fonttitle={\fontsize{8bp}{9bp}\selectfont},
attach boxed title to bottom center={yshift=0pt},boxed title style={arc=0pt,outer arc=0pt,boxrule=0pt,boxsep=0pt,top=12.5pt,left=0pt,right=0pt,bottom=0pt},
pad at break=0pt,pad before break=0pt,pad after break=0pt,%topsep at break=12pt,
bottomrule at break=0pt,toprule at break=0pt,titlerule style={white,line width=0pt},
    before app={\par\addvspace{12pt plus0pt}\noindent},
    after app={\par\addvspace{12pt plus0pt}},
%title after break={{\boxnameA~\theBoxA\enspace continued\par}}%
}%
%
\renewtcolorbox{BoxTypeA*}[2][]{%
%label={#1},%enhanced spartan,
breakable,arc=0pt,outer arc=0pt,boxrule=0pt,boxsep=0pt,top=6pt,left=6pt,right=6pt,bottom=6pt,middle=0pt,
toprule=0.75bp,bottomrule=0.75bp,leftrule=0.75bp,rightrule=0.75bp,colback=white, colbacktitle=white,colframe=black,%
coltitle=black, titlerule=0pt,fontupper=\fontsize{7.5bp}{10bp}\selectfont\raggedright,
title={\parbox{\textwidth}{\noindent\itshape#2\par}},fonttitle={\fontsize{8bp}{9bp}\selectfont},
attach boxed title to bottom center={yshift=0pt},boxed title style={arc=0pt,outer arc=0pt,boxrule=0pt,boxsep=0pt,top=12.5pt,left=0pt,right=0pt,bottom=0pt},
pad at break=0pt,pad before break=0pt,pad after break=0pt,%topsep at break=12pt,
bottomrule at break=0pt,toprule at break=0pt,titlerule style={white,line width=0pt},
    before app={\par\addvspace{12pt plus0pt}\noindent},
    after app={\par\addvspace{12pt plus0pt}},
title after break={\ifodd\c@page\else{{\sffamily\fontsize{10.5bp}{12bp}\selectfont\bfseries{\theBoxA}}\enspace{\ignorespaces\addfontfeature{LetterSpace=5.0}\MakeUppercase{continued}\par\vspace*{5pt}}}\fi}%
}%

%%%%%%%%%%%%%%%%%% Theorem
%
\let\openbox\relax
\RequirePackage{amsthm}
%%%%%%%%%%%%%%%%%%% StyleOne Definition
\newtheoremstyle{thmplain}
{12pt}                  % Space above
{12pt}                  % Space below
{\normalfont\normalsize\leftskip12pt}   % Body font
{\z@}            % Indent amount
{\fontsize{10}{12}\selectfont}             % Theorem head font
{}                     % Punctuation after theorem head
{3pt}                 % Space after theorem headi
{\thm@notefont{\the\thm@headfont}\@ifempty{#2}{%        % Optional head on unnumbered
    \@ifempty{#3}{\thmname{#1}}{\thmnote{{\the\thm@headfont#3}}}%
}{%                     % Main head on numbered
    \thmname{#1}\thmnumber{\@ifnotempty{#1}{ }\@upn{#2}}\thmnote{ {\the\thm@notefont(#3)}}%
}}%
%
\renewenvironment{proof}[1][\proofname]{\par
  \pushQED{\qed}%
  \normalfont \topsep12\p@\partopsep\z@\labelsep2.5pt\relax
  \trivlist\leftskip12pt
  \item[\hskip\labelsep
        \bfseries
    #1\@addpunct{:}]\ignorespaces
}{%
  \endtrivlist\@endpefalse%\popQED
}
%
\theoremstyle{thmplain}
\newtheorem{theorem}{Theorem}[chapter]
%
%%%%%%%%
%%%%%%%%%%%%%%%%%% Abbrevitation style
%
\newenvironment{abbrvlist}[1][]%
               {%\fontsize{10bp}{12bp}\selectfont\raggedright%
               \list{}{\def\@abbarg{#1}\ifx\@abbarg\@empty\labelwidth=6pc\else\settowidth{\labelwidth}{#1}\labelsep=19pt\fi%
                        \leftmargin\labelwidth%
                        \advance\leftmargin\labelsep\itemsep0pt\parsep\z@\topsep0\p@\partopsep\z@%
                        \def\makelabel##1{\rlap{{##1}}}%\letterspaceabbrvitem
                        }}%
               {\endlist}%
%
%%%%%%%%
\RequirePackage{url}
\RequirePackage{hyperref}
\RequirePackage{breakurl}
\urlstyle{rm}
    \hypersetup{colorlinks=false,linkcolor=false,bookmarks=false,bookmarksdepth=0,hyperfootnotes=false,breaklinks=true,draft}%
    \Hy@AtBeginDocument{\let\hyper@anchorstart\@gobble}%

%%%%%%%%%
\endinput
%%
%% End of file `IntechOpen-Book.cls'.
