%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% This file is copyright 2018 Nova Techset Pvt. Ltd.                           %
% All Rights Reserved.                                                         %
% CreationDate: 2018/07/26                                                     %
% Version: 1.0                                                                 %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\newcommand\classname{ICED-Paper}
\newcommand\lastmodifieddate{2022/08/31}
\newcommand\versionnumber{2.0}

% Are we printing crop marks?
\newif\if@cropmarkson \@cropmarksonfalse

\NeedsTeXFormat{LaTeX2e}[2000/06/01]
\ProvidesClass{\classname}[\lastmodifieddate\space ICED-Paper,
                           Version \versionnumber^^J%
                           LaTeX Document Class for Conference Proceedings (ICED17)^^J%
                           (C) 2018 Nova Techset Pvt. Ltd.^^J^^J]

\setlength{\paperwidth}{210truemm}
\setlength{\paperheight}{297truemm}

\DeclareOption{draft}{\PassOptionsToPackage{draft}{graphicx}}
\DeclareOption{a4paper}{\PassOptionsToPackage{a4}{crop}}
\DeclareOption{centre}{\PassOptionsToPackage{center}{crop}}
\DeclareOption{crop}{\PassOptionsToPackage{cam}{crop}\global\@cropmarksontrue}
\DeclareOption{nocrop}{\PassOptionsToPackage{off}{crop}\global\@cropmarksonfalse}
\DeclareOption{info}{\PassOptionsToPackage{info}{crop}}
\DeclareOption{noinfo}{\PassOptionsToPackage{noinfo}{crop}}

\newif\if@numberedref\@numberedreffalse%
\newif\ifprinter\printerfalse%
\DeclareOption{numbered}{\global\@numberedreftrue}
\DeclareOption{printer}{\global\printertrue}

\ExecuteOptions{a4paper,nocrop,centre,info}

\ProcessOptions

% Load all necessary packages

\RequirePackage[T1]{fontenc}
\RequirePackage{crop}
\RequirePackage{graphics}
\RequirePackage{graphicx,array,amsthm}
\RequirePackage[fleqn]{amsmath}
\RequirePackage{amssymb,amsfonts,upref,rotating}
\RequirePackage{stfloats,marginnote}
\RequirePackage{mathptmx}
\RequirePackage{times}
%\RequirePackage{url}
%\RequirePackage[scaled]{helvet}
\RequirePackage{txfonts}
\RequirePackage[scaled]{uarial}


% Not sure if needed.
\newcommand\@ptsize{0}

% Set twoside printing
\@twosidetrue

% Marginal notes are on the outside edge
\@mparswitchtrue

% Default font sizes
\renewcommand\normalsize{%
  \@setfontsize\normalsize{11bp}{13\p@}%
  \abovedisplayskip 6.5\p@ \@plus 1\p@ \@minus1\p@
  \abovedisplayshortskip 3\p@ \@plus 1\p@ \@minus1\p@
  \belowdisplayshortskip 3\p@ \@plus 1\p@ \@minus1\p@
  \belowdisplayskip \abovedisplayskip
  \let\@listi\@listI}
\normalsize
\let\@bls\baselineskip

\newcommand\small{%
  \@setfontsize\small{10bp}{11\p@}%
  \abovedisplayskip 11\p@ \@plus1\p@ \@minus1\p@
  \abovedisplayshortskip 3\p@ \@plus 2\p@ \@minus1\p@
  \belowdisplayshortskip 2\p@ \@plus 1\p@ \@minus1\p@
  \def\@listi{\leftmargin\leftmargini
              \listparindent \parindent
              \topsep 6\p@ \@plus2\p@ \@minus1\p@
              \parsep \z@ \itemsep \z@}%
  \belowdisplayskip \abovedisplayskip}

\newcommand\footnotesize{%
 \@setfontsize\footnotesize{10bp}{12\p@}%
  \abovedisplayskip 10\p@ \@plus2\p@ \@minus4\p@
  \abovedisplayshortskip \z@ \@plus \p@
  \belowdisplayshortskip 1\p@ \@plus2\p@ \@minus2\p@
  \def\@listi{\leftmargin\leftmargini
              \listparindent 1em
              \topsep 5\p@ \@plus 2\p@ \@minus 1\p@
              \parsep \z@ \itemsep \z@}%
  \belowdisplayskip \abovedisplayskip}
  
  
\def\scriptsize{\@setfontsize\scriptsize{7bp}{9\p@}}
\def\tiny{\@setfontsize\tiny{6\p@}{7\p@}}
\def\little{\@setfontsize\little{5\p@}{6\p@}}
\def\large{\@setfontsize\large{12\p@}{14\p@}}
\def\Large{\@setfontsize\Large{14\p@}{16\p@}}
\def\LARGE{\@setfontsize\LARGE{16\p@}{18\p@}}
\def\huge{\@setfontsize\huge{24\p@}{26\p@}}
\def\Huge{\@setfontsize\Huge{25\p@}{27\p@}}

\DeclareOldFontCommand{\rm}{\normalfont\rmfamily}{\mathrm}
\DeclareOldFontCommand{\sf}{\normalfont\sffamily}{\mathsf}
\DeclareOldFontCommand{\tt}{\normalfont\ttfamily}{\mathtt}
\DeclareOldFontCommand{\bf}{\normalfont\bfseries}{\mathbf}
\DeclareOldFontCommand{\it}{\normalfont\itshape}{\mathit}
\DeclareOldFontCommand{\sl}{\normalfont\slshape}{\@nomath\sl}
\DeclareOldFontCommand{\sc}{\normalfont\scshape}{\@nomath\sc}

% Line spacing
\setlength\lineskip{1\p@}
\setlength\normallineskip{1\p@}
\renewcommand\baselinestretch{}

% Paragraph dimensions and inter-para spacing
\setlength\parskip{0\p@}
\setlength\parindent{0\p@}
\setlength\mathindent{8mm}

% Set inter-para skips
\setlength\smallskipamount{3\p@ \@plus 1\p@ \@minus 1\p@}
\setlength\medskipamount{6.5\p@ \@plus 2\p@ \@minus 2\p@}
\setlength\bigskipamount{13\p@ \@plus 3\p@ \@minus 3\p@}

% Page break penalties
\@lowpenalty   51
\@medpenalty  151
\@highpenalty 301

% Disallow widows and orphans
\clubpenalty 10000
\widowpenalty 10000

% Disable page breaks before equations, allow pagebreaks after
% equations and discourage widow lines before equations.
\displaywidowpenalty 100
\predisplaypenalty   10000
\postdisplaypenalty  2500

% Allow breaking the page in the middle of a paragraph
\interlinepenalty 0

% Disallow breaking the page after a hyphenated line
\brokenpenalty 10000

% Hyphenation; don't split words into less than three characters
\lefthyphenmin=3
\righthyphenmin=3

\newbox\textlinehtbox%
\setbox\textlinehtbox=\hbox{{\reset@font\normalsize 1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ}}%
\newdimen\textlineheight%
\textlineheight=\ht\textlinehtbox%

%
% Set page layout dimensions
%
\setlength\headheight{12\p@}        % height of running head
\setlength\headsep{17.5\p@}           % space below running head

\setlength\topmargin{12.3mm}         % top margin
\addtolength\topmargin{-1in}       % subtract out the 1 inch driver margin

\setlength\topskip{\textlineheight}% height of first line of text%

\setlength\footskip{45\p@}         % space above footer line
\setlength\maxdepth{.5\topskip}    % pages can be short or deep by half a line?

\setlength\textwidth{160mm}        % text measure excluding margins

\setlength\textheight{53\@bls}     % text height
\addtolength\textheight{\topskip}  % including first line of text

%
% Set the margins
%
\setlength\marginparsep{6\p@}
\setlength\marginparpush{12\p@}
\setlength\marginparwidth{14\p@}

\setlength\oddsidemargin{25mm}
\addtolength\oddsidemargin{-1in}

\setlength\@tempdima{\paperwidth}
\addtolength\@tempdima{-\textwidth}
\addtolength\@tempdima{-25mm}

\setlength\evensidemargin{\@tempdima}
\addtolength\evensidemargin{-1in}

\setlength\columnsep{18\p@}         % space between columns for double-column text
\setlength\columnseprule{0\p@}      % width of rule between two columns

% Footnotes
\setlength\footnotesep{0\p@}     % space between footnotes
% space between text and footnote
\setlength{\skip\footins}{12\p@ \@plus 2\p@ \@minus 2\p@}


% Float placement parameters
% The total number of floats that can be allowed on a page.
\setcounter{totalnumber}{10}
% The maximum number of floats at the top and bottom of a page.
\setcounter{topnumber}{5}
\setcounter{bottomnumber}{5}
% The maximum part of the top or bottom of a text page that can be
% occupied by floats. This is set so that at least four lines of text
% fit on the page.
\renewcommand\topfraction{.921}
\renewcommand\bottomfraction{.921}
% The minimum amount of a text page that must be occupied by text.
% This should accomodate four lines of text.
\renewcommand\textfraction{.079}
% The minimum amount of a float page that must be occupied by floats.
\renewcommand\floatpagefraction{.887}

% The same parameters repeated for double column output
\renewcommand\dbltopfraction{.88}
\renewcommand\dblfloatpagefraction{.88}

% Space between floats
\setlength\floatsep    {12\p@ \@plus 1\p@ \@minus 1\p@}
% Space between floats and text
\setlength\textfloatsep{12\p@ \@plus 1\p@ \@minus 1\p@}
% Space above and below an inline figure
\setlength\intextsep   {12\p@ \@plus 1\p@ \@minus 1\p@}

% For double column floats
\setlength\dblfloatsep    {12\p@ \@plus 1\p@ \@minus 1\p@}
\setlength\dbltextfloatsep{20\p@ \@plus 2\p@ \@minus 4\p@}

% Space left at top, bottom and inbetween floats on a float page.
\setlength\@fptop{0\p@}         % no space above float page figures
\setlength\@fpsep{13\p@ \@plus 2fil}
\setlength\@fpbot{0\p@ \@plus 1fil}

% The same for double column
\setlength\@dblfptop{0\p@}
\setlength\@dblfpsep{12\p@ \@plus 1fil}
\setlength\@dblfpbot{0\p@ \@plus 2fil}

%%%%%%%%%%%%%%%%%%%%%%%%%%% Counters %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Counters
\newcounter{part}
\newcounter{section}
\newcounter{subsection}[section]
\newcounter{subsubsection}[subsection]
\newcounter{paragraph}[subsubsection]
\newcounter{subparagraph}[paragraph]

\newcounter{figure}
\newcounter{table}
\newcounter{Algorithm}

% Form of the numbers
\newcommand\thepage{\arabic{page}}
\renewcommand\thesection{\arabic{section}}
\renewcommand\thesubsection{\thesection.\arabic{subsection}}
\renewcommand\thesubsubsection{\thesubsection.\arabic{subsubsection}}
\renewcommand\theparagraph{\thesubsubsection.\arabic{paragraph}}
\renewcommand\thesubparagraph{\theparagraph.\arabic{subparagraph}}

% Form of the words
\newcommand\contentsname{Contents}
\newcommand\listfigurename{List of Figures}
\newcommand\listtablename{List of Tables}
\newcommand\partname{Part}
\newcommand\figurename{Figure}
\newcommand\tablename{Table}
\newcommand\Algorithmname{Algorithm}

% Clearemptydoublepage should really clear the running heads too
\newcommand{\clearemptydoublepage}{\newpage{\pagestyle{empty}\cleardoublepage}}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% From ifmtarg.sty
% Copyright Peter Wilson and Donald Arseneau, 2000
\begingroup
\catcode`\Q=3
\long\gdef\@ifmtarg#1{\@xifmtarg#1QQ\@secondoftwo\@firstoftwo\@nil}
\long\gdef\@xifmtarg#1#2Q#3#4#5\@nil{#4}
\long\gdef\@ifnotmtarg#1{\@xifmtarg#1QQ\@firstofone\@gobble\@nil}
\endgroup

%%%%%%%%%%%%%%%%%%%%%%%% PostScript Rotation Macros %%%%%%%%%%%%%%%%%%%%%%%%%%%%
\newif\if@rotate \@rotatefalse
\newif\if@rotatecenter \@rotatecenterfalse
\def\rotatecenter{\global\@rotatecentertrue}
\def\rotateendcenter{\global\@rotatecenterfalse}
\def\rotate{\global\@rotatetrue}
\def\endrotate{\global\@rotatefalse}
\newdimen\rotdimen
\def\rotstart#1{\special{ps: gsave currentpoint currentpoint translate
    #1 neg exch neg exch translate}}
\def\rotfinish{\special{ps: currentpoint grestore moveto}}
\def\rotl#1{\rotdimen=\ht#1\advance\rotdimen by \dp#1
    \hbox to \rotdimen{\vbox to\wd#1{\vskip \wd#1
    \rotstart{270 rotate}\box #1\vss}\hss}\rotfinish}
\def\rotr#1{\rotdimen=\ht #1\advance\rotdimen by \dp#1
    \hbox to \rotdimen{\vbox to \wd#1{\vskip \wd#1
    \rotstart{90 rotate}\box #1\vss}\hss}\rotfinish}

%%%%%%%%%%%%%%%%%%%%%%%%%%% Page Styles %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\def\RHfont{\reset@font\fontsize{9bp}{10.5pt}\sf\selectfont}%

\def\confname#1{\gdef\@confname{#1}}%
\def\confcode#1{\gdef\@confcode{#1}}%
\def\confdate#1{\gdef\@confdate{#1}}%
\def\confplace#1{\gdef\@confplace{#1}}%

\newdimen\catchlinehsize%
\catchlinehsize=\textwidth%
\advance\catchlinehsize by -35pt% logo size
\advance\catchlinehsize by -18pt%

\newcommand{\titlepageheadline}{\vbox{\vglue-20pt\hbox{\bfseries\MakeUppercase{\@confname}}\par\hbox{\MakeUppercase{\@confdate, \@confplace}}}\hfill\smash{\lower42pt\hbox{\includegraphics{ICED-logo}}}}%

\def\ps@titlepage{\setlength\headsep{25.5\p@}           % space below running head%
  %%\def\@evenhead{\RHfont\titlepageheadline}%
  \let\@evenhead\@empty%{\thepage\hfill}%
%%  \def\@oddhead{\RHfont\titlepageheadline}%
  \let\@oddhead\@empty%{\hfill\thepage}%
  %% \def\@evenfoot{\thepage\hfill\reset@font\normalsize{ICED23}}%
    \def\@evenfoot{\hfill\reset@font\normalsize{ICED}}%
   %% \def\@oddfoot{\reset@font\normalsize{ICED23}\hfill\thepage}%
  \def\@oddfoot{\reset@font\normalsize{ICED}}%
}%

\def\ps@headings{%
  %%\def\@evenhead{\RHfont\titlepageheadline}%
  \let\@evenhead\@empty%{\thepage\hfill}%
%%  \def\@oddhead{\RHfont\titlepageheadline}%
  \let\@oddhead\@empty%{\hfill\thepage}%
%%  \def\@evenfoot{\thepage\hfill\reset@font\normalsize{ICED23}}%
  \def\@evenfoot{\hfill\reset@font\normalsize{ICED}}%
%%  \def\@oddfoot{\reset@font\normalsize{ICED23}\hfill\thepage}%
  \def\@oddfoot{\reset@font\normalsize{ICED}}%

}%


   \thispagestyle{titlepage}%
   \pagestyle{headings}%

%\def\ps@headings{%
%  \let\@evenhead\@empty%
%  \let\@oddhead\@empty%
%  \def\@oddfoot{\reset@font\normalsize\@confcode\hfill\thepage}%
%  \def\@evenfoot{\reset@font\normalsize\thepage\hfill\@confcode}%
%}%

%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Titling Macros %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% Reset default command signatures

\def\title{\@ifnextchar[{\@title@wst@}{\@title@nst@}}
\def\@title@wst@[#1]{\@title@assign@}
\def\@title@nst@#1{\@title@assign@{#1}}
\def\@title@assign@#1{\def\@title{#1}}

\def\author{\@ifnextchar[{\@author@wst@}{\@author@nst@}}
\def\@author@wst@[#1]{\@author@assign@}
\def\@author@nst@#1{\@author@assign@{#1}}
\def\@author@assign@#1{\gdef\@author{#1}\global\@author@providedtrue}

% Ifs for titling commands
\newif\if@author@provided \@author@providedfalse
\newif\if@abstract@provided \@abstract@providedfalse
\newif\if@keywords@provided \@keywords@providedfalse
\newif\if@contact@provided \@contact@providedfalse

\def\address#1{\gdef\@address{#1}}\address{}
\def\keywords#1{\gdef\@keywords{\textbf{Keywords}:\ #1}\global\@keywords@providedtrue}
\def\contact#1{\gdef\@contact{\textbf{Contact}:\\ #1}\global\@contact@providedtrue}

\newbox\@abstractbox%
\newenvironment{abstract}{\global\@abstract@providedtrue%
  \global\setbox\@abstractbox\vbox\bgroup\normalsize%
  \hbox{\sf\bfseries Abstract\rlap{\vphantom{Ay}}}\par%
  \nointerlineskip\vskip6pt\nointerlineskip%
  }{\rlap{\vphantom{Ay}}\par\egroup}%

%% Reimplement Titling Layout
\newcommand\maketitle{\par
  \begingroup
   \thispagestyle{titlepage}%
   \global\@topnum\z@   % Prevents figures from going at top of page.
   \@maketitle
  \endgroup
  \@afterindentfalse
  \@afterheading
  \global\let\maketitle\relax
  \global\let\@maketitle\relax}

\global\let\maketitle\relax% included since first page auto generate from conftool

\def\raggedcenter{\leftskip0pt plus 1fil\rightskip0pt plus 1fil\parfillskip=0pt}%

\def\titlefont{\reset@font\fontsize{14bp}{20pt}\sf\bfseries\selectfont}%

\newdimen\fpboxhsize%
\fpboxhsize=\textwidth%
\advance\fpboxhsize by -8pt%

\def\fpendbox{%
\fboxrule=0.75pt\fbox{\vbox{\raggedright\hangindent=8pt\small\hsize\fpboxhsize%
Please cite this paper as:\break
Surnames, Initials: \textit{Title of paper}. In: Proceedings of the 24\textsuperscript{th} International Conference on Engineering Design (ICED23),\break
Bordeaux, France, 24.-28.07.2023.\par}\par}}%

\def\@maketitle{%
  \begingroup\let\\\break%
   \nointerlineskip\vspace*{63.5pt}\nointerlineskip%
   \vbox{\raggedright\titlefont\MakeUppercase{\@title}\rlap{\vphantom{AQ}}}\par%
   \if@author@provided\relax%
   \nointerlineskip\vspace*{12pt}\nointerlineskip%
    \vbox{\raggedright\normalsize\bfseries\@author\rlap{\vphantom{Ay}}}\par%
    \ifx\@address\empty\else%
    \vbox{\raggedright\normalsize\@address\rlap{\vphantom{Ay}}}\par%
    \fi%
   \fi%
   \if@abstract@provided\relax%
   \nointerlineskip\vspace*{27pt}\nointerlineskip%
    {\unvbox\@abstractbox}%
   \fi%
   \if@keywords@provided\relax%
   \nointerlineskip\vspace*{15pt}\nointerlineskip%
    \vbox{\raggedright\normalsize\@keywords\rlap{\vphantom{Ay}}}\par%
   \fi%
   \if@contact@provided\relax%
   \nointerlineskip\vspace*{15pt}\nointerlineskip%
    \vbox{\raggedright\normalsize\@contact\rlap{\vphantom{Ay}}}\par%
   \fi%
   \vfill%
   \fpendbox%
   \clearpage%
\endgroup}

%%%%%%%%%%%%%%%%%%%%%%%%%%% Sectioning macros %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Lowest level heading that takes a number by default
\setcounter{secnumdepth}{4}%

\def\@startsection#1#2#3#4#5#6{%
  \if@noskipsec \leavevmode \fi
  \par
  \@tempskipa #4\relax
  \@afterindenttrue
  \ifdim \@tempskipa <\z@
    \@tempskipa -\@tempskipa% \@afterindentfalse
  \fi
%  \if@nobreak
%    \everypar{}\noindent%
%  \else
    \addpenalty\@secpenalty\addvspace\@tempskipa\noindent
%  \fi
  \@ifstar
    {\@ssect{#3}{#4}{#5}{#6}}%
    {\@dblarg{\@sect{#1}{#2}{#3}{#4}{#5}{#6}}}}

\newdimen\secnumsep%
\secnumsep=6pt%

\renewcommand{\@seccntformat}[1]{{\csname the#1\endcsname\hskip\secnumsep}}

% Reset the default section macros to help with title casing
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
       \ifnum #2=1\relax%
        \@hangfrom%
        {\hskip #3\relax\@svsec}%
          \interlinepenalty \@M\MakeUppercase{#8}\@@par
       \else%
        \@hangfrom%
        {\hskip #3\relax\@svsec}%
          \interlinepenalty \@M {#8}\@@par
       \fi}%
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
      \@svsec #8.}%
      \csname #1mark\endcsname{#7}%
      \addcontentsline{toc}{#1}{%
        \ifnum #2>\c@secnumdepth \else
          \protect\numberline{\csname the#1\endcsname}%
        \fi
        #7}}%
  \fi
  \@xsect{#5}}

\let\sechead=A%
\let\subsechead=B%
\let\subsubsechead=C%

\def\@ssect#1#2#3#4#5{%
  \@tempskipa #3\relax
  \ifdim \@tempskipa>\z@
    \begingroup
      #4{%
      \ifx\seclevel\sechead%
        %\@hangfrom%
        {\hskip #1}%
          \interlinepenalty \@M \MakeUppercase{#5}\@@par%
      \else%
        %\@hangfrom%
        {\hskip #1}%
          \interlinepenalty \@M #5\@@par%
      \fi}%
    \endgroup
  \else
    \def\@svsechd{#4{\hskip #1\relax #5}}%
  \fi
  \@xsect{#3}}

%%\def\HIfontsize{\reset@font\fontsize{12bp}{12}\sf\bfseries\selectfont\raggedright}%
\def\HIfontsize{\reset@font\fontsize{12bp}{12}\sf\bfseries\selectfont\raggedright}%
\def\HIIfontsize{\reset@font\fontsize{11bp}{12}\sf\bfseries\selectfont\raggedright}%
\def\HIIIfontsize{\reset@font\fontsize{10bp}{12}\sf\bfseries\itshape\selectfont\raggedright}%

% H1
\def\section{%
  \@startsection{section}{1}{\z@}
  {-13\p@ plus -3\p@ minus -2\p@}{6.5\p@}
  {\HIfontsize\secnumsep=12pt\let\seclevel=A}}

% H2
\def\subsection{%
  \@startsection{subsection}{2}{\z@}
  {-13\p@ plus -3\p@ minus -2\p@}{3\p@}
  {\reset@font\HIIfontsize\secnumsep=12pt\let\seclevel=B}}

% H3
\def\subsubsection{%
  \@startsection{subsubsection}{3}{\z@}
  {-13\p@ plus -3\p@ minus -2\p@}{2.5\p@}
  {\reset@font\HIIIfontsize\secnumsep=12pt\let\seclevel=C}}

% H4
\def\paragraph{%
  \@startsection{paragraph}{4}{\z@}
  {-13\p@ plus -1\p@}{-0.5em}
  {\reset@font\normalsize\itshape\let\seclevel=D}}

%%%%%%%%%%%%%%%%%%%%%%%%% Figures and Tables %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%\usepackage[hypcap]{caption}%

\newlength{\abovecaptionskip}
\newlength{\belowcaptionskip}
\setlength{\abovecaptionskip}{6\p@}
\setlength{\belowcaptionskip}{6\p@}

\def\figraggedcenter{\leftskip8mm plus 1fil\rightskip8mm plus 1fil\parfillskip=0pt}%

\def\figcapfont{\reset@font\fontsize{10bp}{12}\sf\itshape\selectfont\figraggedcenter}%

\long\def\@makecaption#1#2{\par%
\nointerlineskip\vspace{\abovecaptionskip}%
\vbox{\figcapfont#1\#2\rlap{\vphantom{Ay}}\par}\par}%

\def\tabcapfont{\reset@font\fontsize{10bp}{12}\sf\itshape\selectfont\figraggedcenter}%

\long\def\@tablecaption#1#2{\par%
{\tabcapfont#1\ #2\rlap{\vphantom{Ay}}\par}\par%
\vspace{\belowcaptionskip}}

\newenvironment{unnumfig}{\begingroup\vskip8pt%
}{\vskip8pt\endgroup}

\def\theAlgorithm{\@arabic\c@Algorithm}
\def\fps@Algorithm{h}
\def\ftype@Algorithm{1}
\def\ext@Algorithm{lof}
\def\fnum@Algorithm{{\Algorithmname}~\theAlgorithm:}
\def\Algorithm{\@float{Algorithm}}
\def\endAlgorithm{\end@float}


\def\thefigure{\@arabic\c@figure}
\def\fps@figure{h}
\def\ftype@figure{1}
\def\ext@figure{lof}
\def\fnum@figure{{\figurename}~\thefigure.}
\def\figure{\let\@makecaption\@tablecaption\@float{figure}}
\def\endfigure{\let\@makecaption\@tablecaption\end@float}
\@namedef{figure*}{\@dblfloat{figure}}
\@namedef{endfigure*}{\end@dblfloat}

\def\thetable{\@arabic\c@table}
\def\fps@table{h}
\def\ftype@table{3}
\def\ext@table{lot}
\def\fnum@table{{\tablename}~\thetable.}
\def\table{\let\@makecaption\@tablecaption\@float{table}}
\def\endtable{\end@float}
\@namedef{table*}{\let\@makecaption\@tablecaption\@dblfloat{table}}
\@namedef{endtable*}{\end@dblfloat}



\newdimen\tempdime
\newbox\temptbox

\let\toprule\hline
\let\midrule\hline
\let\botrule\hline

% Table and array parameters
\setlength\arraycolsep{.5em}
\setlength\tabcolsep{.5em}
\setlength\arrayrulewidth{.5pt}
\setlength\doublerulesep{2.5pt}
\renewcommand\arraystretch{1}

\def\hrulefill{\leavevmode\leaders\hrule height .25pt\hfill\kern\z@}

\newcolumntype{P}[1]{>{\raggedright\let\\\@arraycr\hangindent1em}p{#1}}

\newenvironment{processtable}[3]{\setbox\temptbox=\hbox{{\normalsize#2}}%
\tempdime\wd\temptbox\@processtable{#1}{#2}{#3}{\tempdime}}%
{\relax}

\newenvironment{@processtable}[4]{%
\if!#1!%
\addtocounter{table}{-1}%%
\def\fnum@table{}%
\else%
\def\fnum@table{{\tablename}~\thetable.}%
\fi%
\setbox4=\hbox to \hsize{{\hfill\begin{minipage}[t]{#4}%
\caption{#1}{\normalsize#2}
\@ifmtarg{#3}{}{\vskip4pt\parbox{#4}{\hspace*{7pt}\small#3\par}}%
\end{minipage}\hfill}}%
\box4}{\relax}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Lists %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\def\labelenumi{\theenumi.}
\def\theenumi{\arabic{enumi}}
\def\labelenumii{{\rm(\theenumii)}}
\def\theenumii{\alph{enumii}}
\def\p@enumii{\theenumi}
\def\labelenumiii{{\rm(\theenumiii)}}
\def\theenumiii{\roman{enumiii}}
\def\p@enumiii{\theenumi(\theenumii)}
\def\labelenumiv{{\rm(\theenumiv)}}
\def\theenumiv{\Alph{enumiv}}
\def\p@enumiv{\p@enumiii\theenumiii}

\def\labelitemi{$\bullet$}
\def\labelitemii{\textendash}
\def\labelitemiii{$\bullet$}
\def\labelitemiv{$\bullet$}

\setlength{\leftmargini}{\z@}
\setlength{\leftmarginii}{\z@}
\setlength{\leftmarginiii}{\z@}
\setlength{\leftmarginiv}{\z@}

\def\enumargs{%
   \partopsep     \z@
   \itemsep       \z@
   \parsep        \z@
   \rightmargin   \z@
   \labelsep      0.5em
   \listparindent \parindent
   \itemindent    \z@}

\def\enumerate{%
    \@ifnextchar[{\@numerate}{\@numerate[3.]}}

\def\@numerate[#1]{%
     \ifnum \@enumdepth >3 \@toodeep\else
     \advance\@enumdepth \@ne
     \edef\@enumctr{enum\romannumeral\the\@enumdepth}
     \list{\csname label\@enumctr\endcsname}{%
       \enumargs
       \setlength{\leftmargin}{\csname leftmargin\romannumeral\the\@listdepth\endcsname}
       \ifnum\@enumdepth=1\relax\setlength{\labelsep}{14.5pt}\fi%
       \usecounter{\@enumctr}
       \settowidth\labelwidth{#1}
       \addtolength{\leftmargin}{\labelwidth}
       \addtolength{\leftmargin}{\labelsep}
       \def\makelabel##1{\hss \llap{##1}}}%
     \fi}
\def\endenumerate{\endlist\advance \@listdepth -1}

% Changes to the list parameters for itemize
\def\itemargs{%
   \partopsep     \z@
   \itemsep       \z@
   \parsep        \z@
   \rightmargin   \z@
   \labelsep      0.5em
   \listparindent \parindent
   \itemindent    \z@}

\def\itemize{%
    \@ifnextchar[{\@itemize}{\@itemize[$\bullet$]}}

\def\@itemize[#1]{%
     \ifnum \@itemdepth >3 \@toodeep\else
     \advance\@itemdepth \@ne
     \ifnum\@enumdepth=1\relax\advance\@itemdepth \@ne\fi%
     \edef\@itemctr{item\romannumeral\the\@itemdepth}
     \list{\csname label\@itemctr\endcsname}{%
       \itemargs
       \setlength{\leftmargin}{\csname leftmargin\romannumeral\the\@listdepth\endcsname}
       \ifnum\@itemdepth=1\relax\setlength{\labelsep}{17.5pt}\fi%
       \settowidth\labelwidth{#1}
       \addtolength{\leftmargin}{\labelwidth}
       \addtolength{\leftmargin}{\labelsep}
       \def\makelabel##1{\hss \llap{##1}}}%
     \fi}
\let\enditemize\endlist

\setlength{\topsep}{\z@}
\setlength{\itemsep}{\z@}

\def\@listI{\leftmargin\leftmargini}
\let\@listi\@listI
\@listi
\def\@listii{\leftmargin\leftmarginii\topsep\z@}
\def\@listiii{\leftmargin\leftmarginiii\topsep\z@}
\def\@listiv{\leftmargin\leftmarginiv\topsep\z@}
\def\@listv{\leftmargin\leftmarginv\topsep\z@}
\def\@listvi{\leftmargin\leftmarginvi\topsep\z@}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% unnumbered list %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\newenvironment{description}{%
  \begin{list}{}{%
      \usecounter{enumi}%
      \setlength{\itemsep}{\z@}%
      \setlength{\labelwidth}{\z@}%
      \setlength{\leftmargin}{2em}%
      \setlength{\itemindent}{-2em}}}%
{\end{list}}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Extracts %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\def\quotation{\par\begin{list}{}{\footnotesize%  Extracts in small type
      \setlength{\topsep}{\medskipamount}%
      \setlength{\itemsep}{\z@}%
      \setlength\labelwidth{\z@}%
      \setlength\labelsep{\z@}%
      \setlength\leftmargin{12pt}%
      \setlength\rightmargin{12pt}%
      \listparindent \parindent}%
  \item[\vrule width\z@ height 9\p@]}
\def\endquotation{\end{list}}

\let\quote\quotation
\let\endquote\endquotation

\def\extract{\par\begin{list}{}{%  Extracts in small type
      \setlength{\topsep}{0pt}%
      \setlength{\itemsep}{\z@}%
      \setlength\labelwidth{\z@}%
      \setlength\labelsep{\z@}%
      \setlength\leftmargin{8mm}%
      \setlength\rightmargin{0pt}%
      \listparindent \parindent}%
  \item[\vrule width\z@ height 9\p@]}
\def\endextract{\end{list}}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Footnotes %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\def\@makefnmark{\textsuperscript{\@thefnmark}}%
\renewcommand\thefootnote{\@arabic\c@footnote}%

\renewcommand\footnoterule{\begingroup\leftskip\z@\noindent%
\rule{12pc}{0.5\p@}\vspace{4\p@}\endgroup}

\newcommand\@makefntext[1]{%
 \begingroup
    \leftskip=\z@\rightskip=\z@
    \footnotesize%
    \@makefnmark\ignorespaces\ #1\par%
  \endgroup}

%%%%%%%%%%%%%%%%%%%%%%%%% References %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\newcommand\newblock{\hskip .11em\@plus.33em\@minus.07em}
\newenvironment{thebibliography}[1]{}% dummy defined to avoid compilation error

%%%%%%%%%%%%%%%%%%%%%%%%%% Appendix %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\def\appendix{\par%
 \renewcommand{\thesection}{\Alph{section}}
 \def\thetable{\thesection\@arabic\c@table}
 \def\thefigure{\thesection\@arabic\c@figure}
 \def\theequation{\thesection\arabic{equation}}
 \setcounter{section}{0}
 \setcounter{table}{0}
 \setcounter{figure}{0}
 \setcounter{equation}{0}
 \setcounter{subsection}{0}
}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Override settings in MathTime back to TeX defaults
\DeclareMathSizes{5}     {5}   {5}  {5}
\DeclareMathSizes{6}     {6}   {5}  {5}
\DeclareMathSizes{7}     {7}   {5}  {5}
\DeclareMathSizes{8}     {8}   {6}  {5}
\DeclareMathSizes{9}     {9}   {7}  {5}
\DeclareMathSizes{10}   {10}   {7}  {5}
\DeclareMathSizes{12}   {12}   {9}  {7}

%Math parameters
\setlength{\jot}{5\p@}
\skip\@mpfootins = \skip\footins

\medmuskip=4mu% plus 2mu minus 4mu
\thickmuskip=5mu% plus 5mu

\vbadness=9999
\tolerance=9999
\doublehyphendemerits 10000
\doublehyphendemerits 640000
\finalhyphendemerits  1000000

\flushbottom
\frenchspacing
\onecolumn
%\pagestyle{empty}
\setcounter{page}{2}

\fboxsep=4\p@
\fboxrule=0.5\p@

\let\endash\textendash

\def\dbond{\raise0.18ex\hbox{$=$}}
\def\bond{\raise0.18ex\hbox{$-$}}

\def\endash{--}
\def\emdash{\,--\,}
\def\sdot#1{{\buildrel{\scriptscriptstyle\bullet}\over{\hbox{$#1$}}}}
\def\ssdot#1{{\buildrel{\scriptscriptstyle\bullet\bullet}\over{\hbox{$#1$}}}}

%%%%%%%%%%% Hyphenation %%%%%%%%%%%%%%%%%%

\hyphenation{Table}
\hyphenation{Figure}
\hyphenation{Section}
\hyphenation{equation}
\hyphenation{Theorem}
\hyphenation{Lemma}
\hyphenation{Algorithm}
\hyphenation{Definition}
\hyphenation{Corollary}
\hyphenation{Proof}
\hyphenation{Remark}

%%%%%%%%%%%%%%%%%%% URL %%%%%%%%%%%%%%%%%%%%%%%%

\usepackage{url}
\urlstyle{rm}
\def\UrlSpecials{\do\<{\langle}\do\>{\mathbin{\rangle}}\do\_{\_%
 \penalty\@m}\do\|{\mid}\do\{{\lbrace}\do\}{\mathbin{\rbrace}}\do
 \\{\mathbin{\backslash}}\do\~{\raise0ex\hbox{\m@th$\scriptstyle\sim$}}\do
 \ {\ }}%

%%%%%%%%%%%%%%%%%%% Hyperlink %%%%%%%%%%%%%%%%%%%%%%%%

\usepackage[bookmarksopen=true,bookmarksnumbered=true,bookmarksopenlevel=3]{hyperref}
%\usepackage{hypernat}
\ifprinter
\hypersetup{
    pdfpagemode=UseNone,%
    colorlinks,%
    citecolor=black,%
    filecolor=black,%
    linkcolor=black,%
    urlcolor=black
}
\else
\hypersetup{
    pdfpagemode=UseNone,%
    colorlinks,%
    citecolor=blue,%
    filecolor=blue,%
    linkcolor=blue,%
    urlcolor=blue
}
\fi

%%%%%%%%%%%%%%%%% Conference Information %%%%%%%%%%%%%%%%%%%%%%%%

\confname{24\textsuperscript{th} International Conference on Engineering Design, ICED23}
\confcode{ICED23}
\confdate{24-28 July 2023}
\confplace{Bordeaux, France}

%%%%%%%%%%%%%%%% END %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\endinput
