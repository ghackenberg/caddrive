%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% CUP authoring template for PDS                                %
% Version: 1.0                                                                 %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


\NeedsTeXFormat{LaTeX2e}[1995/12/01]
\ProvidesClass{CUP-JNL-PDS}
              [2024/09/23 v0.1: An authoring template for CUP PDS articles]

\newif\if@restonecol
\newif\if@titlepage   \@titlepagefalse
\newif\if@cropmarkson \@cropmarksonfalse
\newif\if@citearticle@provided \@citearticle@providedfalse
\newif\ifpreview

%% Template Options
\DeclareOption{a4paper}{\PassOptionsToPackage{a4}{crop}}
\DeclareOption{a3paper}{\PassOptionsToClass{a3paper}{article}\PassOptionsToPackage{a3}{crop}}
\DeclareOption{centre}{\PassOptionsToPackage{center}{crop}}
\DeclareOption{crop}{\PassOptionsToPackage{frame}{crop}\global\@cropmarksontrue}
\DeclareOption{nocrop}{\PassOptionsToPackage{off}{crop}\global\@cropmarksontrue}
\DeclareOption{info}{\PassOptionsToPackage{info}{crop}}
\DeclareOption{noinfo}{\PassOptionsToPackage{noinfo}{crop}}
\DeclareOption{preview}{\previewtrue}

%% Classfile Options
\DeclareOption{oneside}{\@twosidefalse \@mparswitchfalse}
\DeclareOption{twoside}{\@twosidetrue  \@mparswitchtrue}
\DeclareOption{draft}{\setlength\overfullrule{5pt}}
\DeclareOption{titlepage}{\@titlepagetrue}
\DeclareOption{notitlepage}{\@titlepagefalse}
\DeclareOption{onecolumn}{\@twocolumnfalse}
\DeclareOption{twocolumn}{\@twocolumntrue}
\DeclareOption{openbib}{\let\if@openbib\iftrue}

\ExecuteOptions{twosidecrop,crop,centre,info,croppage}
\ProcessOptions
\LoadClass[twoside,fleqn]{article}

%% General Packages Used
\RequirePackage{url}
\RequirePackage{soul}
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%% Fonts & Sizes %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
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

\renewcommand\normalsize{%
   \@setfontsize\normalsize{11pt}{12.5pt}%
   \abovedisplayskip 9.5\p@ \@plus2\p@ \@minus0\p@
   \abovedisplayshortskip 3\p@ \@plus3\p@%
   \belowdisplayshortskip 9.5\p@ \@plus3\p@ \@minus3\p@%
   \belowdisplayskip \abovedisplayskip%
   \let\@listi\@listI}%
\normalsize
%%\DeclareMathSizes{11}{10}{7.4}{6}
\everydisplay{\footnotesize}

\newcommand\medsize{%
   \@setfontsize\small\@xipt{13}%
   \abovedisplayskip 5\p@ \@plus3\p@ \@minus4\p@
   \abovedisplayshortskip \z@ \@plus2\p@
   \belowdisplayshortskip 3\p@ \@plus2\p@ \@minus2\p@
   \def\@listi{\leftmargin\leftmargini
               \topsep 4\p@ \@plus2\p@ \@minus2\p@
               \parsep 2\p@ \@plus\p@ \@minus\p@
               \itemsep \parsep}%
   \belowdisplayskip \abovedisplayskip}
\renewcommand\small{%
   \@setfontsize\small\@ixpt{11}%
   \abovedisplayskip 5\p@ \@plus3\p@ \@minus4\p@
   \abovedisplayshortskip \z@ \@plus2\p@
   \belowdisplayshortskip 3\p@ \@plus2\p@ \@minus2\p@
   \def\@listi{\leftmargin\leftmargini
               \topsep 4\p@ \@plus2\p@ \@minus2\p@
               \parsep 2\p@ \@plus\p@ \@minus\p@
               \itemsep \parsep}%
   \belowdisplayskip \abovedisplayskip}
\renewcommand\footnotesize{%
   \@setfontsize\footnotesize{10}{11.5}%
   \abovedisplayskip 5\p@ \@plus2\p@ \@minus4\p@
   \abovedisplayshortskip \z@ \@plus\p@
   \belowdisplayshortskip 3\p@ \@plus\p@ \@minus2\p@
   \def\@listi{\leftmargin\leftmargini
               \topsep 3\p@ \@plus\p@ \@minus\p@
               \parsep 2\p@ \@plus\p@ \@minus\p@
               \itemsep \parsep}%
   \belowdisplayskip \abovedisplayskip}
%
\renewcommand\scriptsize{\@setfontsize\scriptsize\@ixpt\@ixpt}
\newcommand\scrisize{\@setfontsize\scrisize{9.3}{9}}
\renewcommand\tiny{\@setfontsize\tiny\@vpt\@vipt}
\renewcommand\large{\@setfontsize\large{12}{14}}
\newcommand\larg{\@setfontsize\larg{11}{13}}
\renewcommand\Large{\@setfontsize\Large{16}{18}}
\renewcommand\LARGE{\@setfontsize\LARGE\@xviipt{22}}
\renewcommand\huge{\@setfontsize\huge\@xxpt{25}}
\renewcommand\Huge{\@setfontsize\Huge\@xxvpt{30}}
%
\DeclareMathSizes{\@ixpt}{\@ixpt}{7}{5}
\DeclareMathSizes{\@xpt}{\@xpt}{7}{5}
\DeclareMathSizes{\@xipt}{\@xipt}{7}{5}


%
%%%%%%%%%%%%%%%%%%%%%%%%%%%% Layout Settings %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
 
\RequirePackage{framed}
\RequirePackage{color}
\RequirePackage{etoolbox}
\RequirePackage{geometry}
\RequirePackage{mathptmx,helvet}


\definecolor{dscolor}{RGB}{59, 92, 133}

 
%% Regular Pages (for Opening page - redefined)
\geometry{%
    paperwidth=210mm,
    paperheight=297mm,
    top=25mm,
%    headheight=7pt,
%%    headsep=19.5pt,
    textwidth=441pt,
    textheight=670pt,
    marginparsep=3mm,
    marginparwidth=10mm,
%    bindingoffset=6mm,
    lmargin=25mm,
    rmargin=25mm,
    footskip=65pt}
%

\setlength{\marginparsep}{3mm}%
\setlength{\marginparwidth}{10mm}%

%\setlength\footskip{50\p@}
\setlength\maxdepth{0pt}

\setlength\footnotesep{5.75\p@}
\setlength{\skip\footins}{8\p@ \@plus 4\p@ \@minus 0\p@}

\setlength\parindent{0pt}

%
%%%%%%%%%%%%%%%%%%%%%%%%%%%% Pagination Settings %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% Line spacing
\setlength\lineskip{1\p@}
\setlength\normallineskip{1\p@}
\renewcommand\baselinestretch{}
\parskip=0pt

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
\postdisplaypenalty  0

% Set these global demerits
\doublehyphendemerits 1000000   % corresponds to badness 800
\finalhyphendemerits  1000000  % corresponds to badness 1000


%Math parameters
\setlength{\jot}{5\p@}
\skip\@mpfootins = \skip\footins
\fboxsep=6\p@
\fboxrule=.25\p@

\medmuskip=4mu% plus 2mu minus 4mu
\thickmuskip=5mu% plus 5mu

% Allow loose lines rather than overfull lines
\vbadness=9999
\tolerance=9999

% Allow breaking the page in the middle of a paragraph
\interlinepenalty 0

% Disallow breaking the page after a hyphenated line
\brokenpenalty 10000

% Hyphenation; don't split words into less than three characters
\lefthyphenmin=3
\righthyphenmin=3

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
\renewcommand\textfraction{.13}

% The minimum amount of a float page that must be occupied by floats.
\renewcommand\floatpagefraction{.887}

% The same parameters repeated for double column output
\renewcommand\dbltopfraction{.88}
\renewcommand\dblfloatpagefraction{.88}

% Space between floats
\setlength\floatsep    {6\p@ \@plus 1\p@ \@minus 1\p@}

% Space between floats and text
\setlength\textfloatsep{6\p@ \@plus 1\p@ \@minus 1\p@}

% Space above and below an inline figure
\setlength\intextsep   {18\p@ \@plus 2\p@ \@minus 2\p@}

% For double column floats
\setlength\dblfloatsep    {6\p@ \@plus 1\p@ \@minus 1\p@}
\setlength\dbltextfloatsep{6\p@ \@plus 1\p@ \@minus 1\p@}

\hyphenation{Figure Figures Table Tables Equation Equations Section Sections Appendix Theorem Lemma}

%
%%%%%%%%%%%%%%%%%%%%%%%%%%% Math Settings %%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%% For above/below spacing  
\def\eqnarray{%
   \stepcounter{equation}%
   \def\@currentlabel{\p@equation\theequation}%
   \global\@eqnswtrue
   \m@th
   \global\@eqcnt\z@
   \tabskip\@centering
   \let\\\@eqncr
   $$\everycr{}\halign to\displaywidth\bgroup
       \hskip\@centering$\displaystyle\tabskip\z@skip{##}$\@eqnsel
      &\global\@eqcnt\@ne\hskip \tw@\arraycolsep \hfil${##}$\hfil
      &\global\@eqcnt\tw@ \hskip \tw@\arraycolsep
         $\displaystyle{##}$\hfil\tabskip\@centering
      &\global\@eqcnt\thr@@ \hb@xt@\z@\bgroup\hss##\egroup
         \tabskip\z@skip
      \cr
}
\def\endeqnarray{%
      \@@eqncr
      \egroup
      \global\advance\c@equation\m@ne
   $$\@ignoretrue
}
%
%%%%%%%%%%%%%%%%%%%%%%%%%%% Titles %%%%%%%%%%%%%%%%%%%%%%%%%%%
%

\renewcommand\contentsname{Contents}
\renewcommand\listfigurename{List of Figures}
\renewcommand\listtablename{List of Tables}
\renewcommand\refname{References}
\renewcommand\indexname{Index}
\renewcommand\figurename{Figure}
\renewcommand\tablename{Table}
\renewcommand\partname{Part}
\renewcommand\appendixname{Appendix}
\renewcommand\abstractname{Abstract}

%
%%%%%%%%%%%%%%%%%%%%%%%%%%% Article Front Matter %%%%%%%%%%%%%%%%%%%%%%%%%%%
%

%% Article Type
\sodef\letterspacetwty{}{.1em}{.4em plus1em}{.5em plus 1em minus1em }
\def\articletype#1{\gdef\ArtType{{#1}}\gdef\@ArtType{#1}}%
%%\def\articletype#1{\gdef\ArtType{\letterspacetwty{#1}}\gdef\@ArtType{#1}}%
\articletype{}%

%% Meta Info
\def\@artid{xx}
\def\@jname{xxx xxx}
\def\@jvol{xx}
\def\@jissue{xx}
\def\@jyear{{0000}}
\def\@jmonth{xx}
\def\@DOI{}
\def\@logourl{}
%

\def\DOItext{}
\def\artid#1{\gdef\@artid{#1}}
\def\jname#1{\markboth{\textit{#1}}{\textit{#1}}\gdef\@jname{#1}}
\def\jvol#1{\gdef\@jvol{#1}}
\def\jissue#1{\gdef\@jissue{#1}}
\def\jyear#1{\gdef\@jyear{#1}}
\def\jmonth#1{\gdef\@jmonth{#1}}
\def\jdoi#1{\gdef\@DOI{\DOItext#1}\gdef\@logourl{#1}}
\jdoi{10.4153/xxxx}
\jname{The Journal of Navigation}%
%


%%% Font Def
\def\Titlefont{\color{dscolor}\fontfamily{\sfdefault}\fontsize{15}{17.5}\fontseries{b}\selectfont}
\def\Artcatfont{\fontfamily{\rmdefault}\fontsize{8.5}{10.5}\fontseries{b}\selectfont}
\def\Authorfont{\fontfamily{\sfdefault}\fontsize{12}{14}\selectfont}
\def\addressfont{\fontfamily{\sfdefault}\fontsize{9}{11}\selectfont\raggedright}
\def\abstractheadfont{\fontfamily{\sfdefault}\fontsize{11}{13}\fontseries{b}\selectfont}%
\def\abstractsubheadfont{\fontfamily{\rmdefault}\fontsize{9}{11}\fontseries{b}\selectfont}%
\def\abstractfont{\fontfamily{\rmdefault}\fontsize{10}{11.5}\selectfont}%
\def\keywordfont{\fontfamily{\sfdefault}\fontsize{10}{11.5}\selectfont\fontseries{m}\fontshape{it}}%
\def\historyfont{\fontsize{8}{10}\selectfont\raggedright}

\def\footerfont{\fontfamily{\sfdefault}\fontsize{11}{11.5}\selectfont}%

%% Article Title
%\def\title#1{\gdef\@title{#1}}

\renewcommand{\title}[2][]{%
\gdef\@checktitle{#1}\ifx\@checktitle\empty\gdef\@title{#2}
\gdef\s@title{#2}\else\gdef\@title{#2}\gdef\s@title{#1}\fi}

%% Cross Link for Author & Address
\def\jmkLabel#1{\@bsphack\protected@write\@auxout{}{\string\Newlabel{#1}{\@currentlabel}}\@esphack}
\def\Newlabel#1#2{\expandafter\xdef\csname X@#1\endcsname{#2}}
\def\jmkRef#1{\@ifundefined{X@#1}{0}{\csname X@#1\endcsname}}

%% Article Author(s)
\let\sep\@empty%
\let\authorsep\@empty%
\newcount\aucount%
\newcount\punctcount%
\def\author{\advance\aucount by 1\@ifstar\@@corrauthor\@@author}%
\def\au@and{\ifnum\punctcount=2\ and\else\unskip,\advance\punctcount by -1 \fi}%
\def\artauthors{}
\newif\if@auemail%
\newcommand{\@@author}[2][]{\g@addto@macro\artauthors{%
    \ifnum\aucount=1%
    \global\@auemailtrue%
    \else%
    \global\@auemailfalse%
    \fi%
    \Authorfont%
    \def\baselinestretch{1}%
    \authorsep{#2\,}\unskip\ifx#1\empty\else\textsuperscript{\smash{{%
      \@for\@@affmark:=#1\do{\edef\affnum{\@ifundefined{X@\@@affmark}{1}{\jmkRef{\@@affmark}}}%
     \unskip\sep\affnum\let\sep=,}}}}\fi%
    \def\authorsep{\au@and~}%%% 
    \global\let\sep\@empty\global\let\@corref\@empty%
}}%


\newcommand{\@@corrauthor}[2][]{\g@addto@macro\artauthors{\setbox0\hbox{\includegraphics{post-card-logo-Small.eps}}%
    \global\@auemailtrue%
    \Authorfont%
    \def\baselinestretch{1}%
    \authorsep{#2\,}\unskip\ifx#1\empty\textsuperscript{\copy0}\else\textsuperscript{\smash{{%
      \@for\@@affmark:=#1\do{\edef\affnum{\@ifundefined{X@\@@affmark}{1}{\jmkRef{\@@affmark}},\copy0}%
     \unskip\sep\affnum\let\sep=,}}}}\fi%
    \def\authorsep{\au@and~}%%% 
    \global\let\sep\@empty\global\let\@corref\@empty%
}}%
%
%\RequirePackage{ltxcmds}%
\def\authororcid#1{%
\ltx@ifpackageloaded{hyperref}{\href{https://orcid.org/#1}{\includegraphics{orcid_logo}}}{{\includegraphics{orcid_logo}}}%
}
\newcommand{\orcid}[1]{\protect\g@addto@macro\artauthors{%
\authororcid{#1}%
}}
%
%% Author Email
\newif\ifcorrauth
\def\addressrule{\kern-10\p@ \hrule \@height.15pt \@width\marginparwidth \kern 1.6\p@}%
\def\@email{}
\DeclareUrlCommand\myemail{}%
\def\corresemail#1{\gdef\@email{\hbox{\includegraphics{post-card-logo-big.eps}~\addressfont{#1}}}}%
\let\nomail\relax

%% Corrseponding Address 
\def\@copycorthanks{}
\def\auaddress{}
\def\@auaddress{}
\newcounter{affn}
\renewcommand\theaffn{\arabic{affn}}
\def\address{\@ifstar\@@coraddress\@@address}
\newcount\addcount% To check the count of address
\newcommand{\@@coraddress}[2][]{%\advance\addcount by 1
\g@addto@macro\auaddress{%
     \stepcounter{affn}%
     \xdef\@currentlabel{\theaffn}%
     \jmkLabel{\theaffn}%
     {\textsuperscript{#1}\,#2}\space }
}

%% Author Address 
\def\addsep{\par\vskip0pt}
\newcount\addcount% To check the count of address
\newcommand{\@@address}[2][]{\advance\addcount by 1\g@addto@macro\auaddress{%
     \stepcounter{affn}%
     \xdef\@currentlabel{\theaffn}%
     \jmkLabel{\theaffn}%
     {\textsuperscript{#1}\,#2}\space }%\theaffn
}


%% Address tagging 
\newcommand{\orgdiv}[1]{#1}%
\newcommand{\orgname}[1]{#1}%
\newcommand{\orgaddress}[1]{#1}%
\newcommand{\street}[1]{#1}
\newcommand{\postcode}[1]{#1}
\newcommand{\city}[1]{#1}
\newcommand{\state}[1]{#1}
\newcommand{\country}[1]{#1}

%% Author name in Running Head
\def\@authormark{}% 
\def\authormark#1{\markright{{{#1}}}\gdef\@authormark{\def\etal{{et al.}}#1}\gdef\@authormarkforcite{\def\etal{\textit{et al.}}#1}}%
\def\etal{\textit{et al.}}

%% Optional Text
\def\artnotefont{\reset@font\fontfamily{\rmdefault}\fontsize{8.6}{13}\selectfont\raggedright}
\def\artnote#1{\gdef\@Artnote{#1}}\artnote{}%

\newcommand{\tempquery}[2]{\relax}%

\def\@citearticle{}
\newcommand\citearticle[1]{%
     \if!#1!\relax\@latex@error{Please provide cite author Details!!!}\fi%
     \global\@citearticle@providedtrue%
     \gdef\@citearticle{\textbf{Cite this article:}\ #1\ (\@jyear).\ {\let~\space\let\break\space\let\\\relax\let\query\tempquery\@title}.\ 
     \textit{The Journal of Navigation}\ \ifpreview\relax\else\textbf{\@jvol},\ \fi\firstpage--\pageref*{LastPage}.\ \def\DOItext{}\url{https://doi.org/\@DOI}}}%

%% Article Abstract
\newcommand\abstracthead{\@startsection {section}{1}{\z@}{-1pt \@plus1ex \@minus0ex}{0.0001pt}{\abstractheadfont}}
\newcommand\subabstracthead{\@startsection{subsection}{2}{\z@}{3pt \@plus0ex \@minus0ex}{-.5em}{\abstractsubheadfont}}
\definecolor{shadecolor}{cmyk}{0,0,0,.10}

\newdimen\absboxdim%
\absboxdim=\textwidth
\advance\absboxdim by -18pt%
\def\@abstract{}%
\long\def\abstract#1{\def\@abstract{\fboxsep9pt\fcolorbox{black}{black!5}{\parbox{\absboxdim}{%
\let\paragraph\subabstracthead%
\abstractfont%
\abstracthead*{\abstractname}\par\vskip2.5pt%
#1\par}}}}%

\def\printabstract{\ifx\@abstract\empty\else\@abstract\fi\par\vspace*{9pt}}%

\def\printkeywords{\ifx\@keywords\empty\else\@keywords\fi\par}%

%
%% Keywords
\def\keywordname{Keywords}
\newcommand{\keywords}[2][\keywordname]{%
\g@addto@macro\@keywords{\par\addvspace{5pt}{\keywordfont\textsf{\textit{#1:}} \textsf{\textit{#2}}\par}}}
\def\@keywords{}
\newcommand{\codes}[2][Primary]{\textit{#1} -- #2}%

%% Article History

\newcommand{\received}[2][Received:]{\g@addto@macro\@history{{\textbf{#1} #2}}}%
\newcommand{\revised}[2][Revised:]{\g@addto@macro\@history{{; \textbf{#1} #2}}}%
\newcommand{\accepted}[2][Accepted:]{\g@addto@macro\@history{{; \textbf{#1} #2}}}%

%% Article Header Definition
\renewcommand{\@maketitle}
{\noindent{\vbox{%
    \hsize\textwidth\parindent0pt%
    \vskip78pt%
    %% Aritle Type
%    {\hbox to \textwidth{{\Artcatfont\ArtType\hfill}\par}}
%    {\vskip5pt\hbox to \textwidth{\ltx@ifpackageloaded{hyperref}{\href{https://crossmark.crossref.org/dialog?doi=\@logourl}}{}{\includegraphics{CrossRef-logo}}
%    \par}}
    %% Aritle Title
    \ifx\@title\empty\else%
        \vskip15.5pt%
        {\Titlefont\@title\par}
        %\addcontentsline{toc}{chapter}{\@title}% for bookmarks
    \fi%
    %% Aritle Authors, Address and Correspondings
    \ifnum\aucount>0
        \global\punctcount\aucount%
        \vskip24pt%
        \artauthors\par%%     authors and emails
        {\vskip7pt\addressfont\auaddress\par\vskip7pt%%      corresponding adress
	\@email\par\vskip15pt%
        %\corremail\par
        }
     \fi%
%     {\printhistory\par}%
     {\printabstract\par}%
     {\printkeywords\par}%
    }}\par\addvspace{23pt plus0pt minus0pt}}

%% Printing Article Header
\renewcommand\maketitle{\par
  \@afterindentfalse%
  \begingroup
    \gdef\UrlFont{\rmfamily}%
    \renewcommand\thefootnote{\@fnsymbol\c@footnote}%
    \def\@makefnmark{\rlap{\@textsuperscript{\normalfont\smash{\@thefnmark}}}}%
    \long\def\@makefntext##1{\parindent 1em\noindent\small\selectfont
            \hbox{\@textsuperscript{\normalfont\@thefnmark}}##1}%
    \if@twocolumn
      \ifnum \col@number=\@ne%
        \twocolumn[\@maketitle]%
      \else
        \twocolumn[\@maketitle]%
      \fi%
    \else%
      \newpage%
      \global\@topnum\z@% Prevents figures from going at top of page.
      \@maketitle%
    \fi%
    \thispagestyle{titlepage}%
  \endgroup%
  \global\advance\opshortpage0pt%
%  \enlargethispage{-38pt}%  
  \setcounter{footnote}{0}%
  \global\let\thanks\relax%
  \global\let\maketitle\relax%
  \global\let\@maketitle\relax%
  %\global\let\@thanks\@empty%
  \global\let\@author\@empty%
  \global\let\@date\@empty%
  %\global\let\@title\@empty%
  \global\let\title\relax%
  \global\let\author\relax%
  \global\let\date\relax%
  \global\let\and\relax
  %%%print continuous abstract on next page
  \@afterheading}%


\newenvironment{Frontmatter}{\par}{\maketitle\par}

\newenvironment{Backmatter}{\par\fontsize{10}{11.5}\selectfont
\def\sectionfont{\fontfamily{\sfdefault}\fontsize{12}{14}\fontseries{b}\selectfont\raggedright}
\def\paragraphfont{\fontfamily{\sfdefault}\fontsize{10}{12}\fontseries{b}\selectfont\raggedright\boldmath}
\renewcommand\section{\@startsection {section}{1}{\z@}%
                                   {-12pt \@plus -2ex \@minus 0ex}%
                                   {3pt}%
                                   {\sectionfont}}%
\renewcommand\paragraph{\@startsection{paragraph}{4}{\z@}%
                                    {2.25ex \@plus1ex \@minus.2ex}%
                                    {-.5em}%
                                    {\paragraphfont}}
\def\bibfont{\fontsize{10}{11.5}\selectfont}%
}{\par}
\def\bysame{\leavevmode\hbox to3em{\hrulefill}}

%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Page Styles %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
\def\opheaderfont{\fontfamily{\sfdefault}\fontsize{10}{10}\selectfont}
\def\headerfont{\fontfamily{\sfdefault}\fontsize{10}{12}\selectfont}
 


%% Regular Page Style      
\def\ps@headings{%
\let\@evenhead\@empty%
\let\@oddhead\@empty%
     \def\@oddfoot{\vbox{\hbox to \textwidth{\hfill\rule{40pt}{0.4pt}}\par\removelastskip\nointerlineskip\vskip4.5pt%
\hbox to \textwidth{\footerfont\@ArtType\hfill\thepage}}}%%
     \def\@evenfoot{\vbox{\hbox to \textwidth{\rule{40pt}{0.4pt}\hfill}\par\removelastskip\nointerlineskip\vskip4.5pt%
\hbox to \textwidth{\footerfont\thepage\hfill\@ArtType}}}%%
      \let\@mkboth\markboth%
      }

\newdimen\opshortpage%

\def\printcopyright#1{#1}%%

\def\copytext#1{\def\@copyrighttext{\begin{minipage}[t]{\textwidth}\footerfont #1\end{minipage}}}
\copytext{$\copyright$ The Royal Institute of Navigation 2020}%

\AtEndDocument{%\if@citearticle@provided\relax%
   % \let\@makefntext\@citeartfntext%
   % \footnotetext{\@citearticle}%
  %\fi%
\label{LastPage}}
\def\@opjournalheader{\color{dscolor}\textbf{\textsf{Proceedings of the Design Society, Volume 5: ICED25}}\\[2pt]
\textsf{\color{dscolor}\@DOI}}%

%% Opening Page Style      
\def\ps@titlepage{%
     \def\@oddhead{{\hbox to \textwidth{%
      \vbox to 0pt{\vskip29pt\rlap{\hbox to \textwidth{\hfill\includegraphics[scale=.75]{ICED25Logo.eps}\hspace*{-1pt}}}}%
      \vbox to 0pt{\vskip27pt\rlap{\parbox{\textwidth}{\opheaderfont\begin{tabular*}{\textwidth}[t]{@{\extracolsep{\fill}}@{}l@{}}%
      \@opjournalheader%
      \end{tabular*}}}}%
      }}}%
     \let\@evenhead\@oddhead%
     \def\@oddfoot{\vbox{\hbox to \textwidth{\hfill\rule{40pt}{0.4pt}}\removelastskip\nointerlineskip\vskip4.5pt%
\hbox to \textwidth{\footerfont\@ArtType\hfill\thepage}}}%%
     \let\@evenfoot\@oddfoot}%

%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Sections %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
\def\numbered{\setcounter{secnumdepth}{3}}
\def\unnumbered{\setcounter{secnumdepth}{0}}
\numbered%% default is unnumbered Sections

\newcounter {chapter}[part]% for bookmarks
\renewcommand\thepart         {\@Roman\c@part}
\renewcommand\thesection      {\@arabic\c@section}
\renewcommand\thesubsection   {\thesection.\@arabic\c@subsection}
\renewcommand\thesubsubsection{\thesubsection.\@arabic\c@subsubsection}
\renewcommand\theparagraph    {\thesubsubsection.\@arabic\c@paragraph}
\renewcommand\thesubparagraph {\theparagraph.\@arabic\c@subparagraph}
%%
\renewcommand\part{\par
   \addvspace{4ex}%
   \@afterindentfalse
   \secdef\@part\@spart}
%%
\def\@part[#1]#2{%
    \ifnum \c@secnumdepth >\m@ne
      \refstepcounter{part}%
      \addcontentsline{toc}{part}{\thepart\hspace{1em}#1}%
    \else
      \addcontentsline{toc}{part}{#1}%
    \fi
    {\parindent \z@ \raggedright
     \interlinepenalty \@M
     \normalfont
     \ifnum \c@secnumdepth >\m@ne
       \Large\bfseries \partname~\thepart
       \par\nobreak
     \fi
     \huge \bfseries #2%
     \markboth{}{}\par}%
    \nobreak
    \vskip 3ex
    \@afterheading}

\def\@spart#1{%
    {\parindent \z@ \raggedright
     \interlinepenalty \@M
     \normalfont
     \huge \bfseries #1\par}%
     \nobreak
     \vskip 3ex
     \@afterheading}

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
        \@hangfrom{\hskip #3\relax\@svsec}%
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
      \@svsec #8.}%
      \csname #1mark\endcsname{#7}%
      \addcontentsline{toc}{#1}{%
        \ifnum #2>\c@secnumdepth \else
          \protect\numberline{\csname the#1\endcsname}%
        \fi
        #7}}%
  \fi
  \@xsect{#5}}
%
\def\sectionfont{\color{dscolor}\fontfamily{\sfdefault}\fontsize{14}{16}\fontseries{b}\selectfont\raggedright}
\def\subsectionfont{\color{dscolor}\fontfamily{\sfdefault}\fontsize{12}{14}\fontseries{b}\selectfont\raggedright}
\def\subsubsectionfont{\color{dscolor}\fontfamily{\sfdefault}\fontsize{11}{13}\fontseries{m}\fontshape{it}\selectfont\raggedright}
\def\paragraphfont{\fontfamily{\sfdefault}\fontsize{9.5}{11.5}\fontshape{it}\selectfont\raggedright\boldmath}
\def\subparagraphfont{\color{dscolor}\fontfamily{\sfdefault}\fontsize{10}{12}\fontseries{b}\fontshape{it}\selectfont\raggedright}

\def\@seccntformat#1{{\csname the#1\endcsname.}\hskip.5em}

\renewcommand\section{\@startsection {section}{1}{\z@}%
                                   {-12pt \@plus -1\p@ \@minus -1\p@}%
                                   {4pt}%
                                   {\sectionfont}}
\renewcommand\subsection{\@startsection{subsection}{2}{\z@}%
                                     {-12pt \@plus -1\p@ \@minus -1\p@}%
                                     {2pt}%
                                     {\subsectionfont}}
\renewcommand\subsubsection{\@startsection{subsubsection}{3}{\z@}%
                                     {-12.5pt \@plus -1\p@ \@minus -1\p@}%
                                     {2pt}%
                                     {\subsubsectionfont}}
\renewcommand\paragraph{\@startsection{paragraph}{4}{\z@}%
                                    {12.5pt \@plus1ex \@minus.2ex}%
                                    {0.0001pt}%
                                    {\paragraphfont}}
\renewcommand\subparagraph{\@startsection{subparagraph}{5}{\z@}%
                                       {-6pt \@plus1ex \@minus .2ex}%
                                       {-1em}%
                                     {\subparagraphfont}}
%
\def\@startsection#1#2#3#4#5#6{%
  \if@noskipsec \leavevmode \fi
  \par
  \@tempskipa #4\relax
  \@afterindenttrue
  \ifdim \@tempskipa <\z@
    \@tempskipa -\@tempskipa \@afterindentfalse
  \fi
  \if@nobreak
    \everypar{}\ifnum#2=2\vskip0pt\else\ifnum#2=3\vskip1pt\else\ifnum#2=4\vskip1pt\fi\fi\fi%
  \else
    \addpenalty\@secpenalty\addvspace\@tempskipa
  \fi
  \@ifstar
    {\@ssect{#3}{#4}{#5}{#6}}%
    {\@dblarg{\@sect{#1}{#2}{#3}{#4}{#5}{#6}}}}
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Lists %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%

\newdimen\labelwidthi
\newdimen\labelwidthii
\newdimen\labelwidthiii
\newdimen\labelwidthiv
\def\normal@labelsep{0.5em}
\labelsep\normal@labelsep
\settowidth{\labelwidthi}{(iii)}
\settowidth{\labelwidthii}{(d)}
\settowidth{\labelwidthiii}{(iii)}
\settowidth{\labelwidthiv}{(M)}
\leftmargini\labelwidthi    \advance\leftmargini\labelsep
\leftmarginii\labelwidthii  \advance\leftmarginii\labelsep
\leftmarginiii\labelwidthiii \advance\leftmarginiii\labelsep
\leftmarginiv\labelwidthiv  \advance\leftmarginiv\labelsep
\def\setleftmargin#1#2{\settowidth{\@tempdima}{#2}\labelsep\normal@labelsep
  \csname labelwidth#1\endcsname\@tempdima
  \@tempdimb\@tempdima \advance\@tempdimb\labelsep
  \csname leftmargin#1\endcsname\@tempdimb}
\def\@listI{\leftmargin\leftmargini
  \labelwidth\labelwidthi \labelsep\normal@labelsep
  \topsep 6pt \partopsep\z@ \parsep\z@ \itemsep\z@
  \listparindent 1em}
\def\@listii{\leftmargin\leftmarginii
  \labelwidth\labelwidthii \labelsep\normal@labelsep
  \topsep\z@ \partopsep\z@ \parsep\z@ \itemsep\z@
  \listparindent 1em}
\def\@listiii{\leftmargin\leftmarginiii
  \labelwidth\labelwidthiii \labelsep\normal@labelsep
  \topsep\z@ \partopsep\z@ \parsep\z@ \itemsep\z@
  \listparindent 1em}
\def\@listiv{\leftmargin\leftmarginiv
  \labelwidth\labelwidthiv \labelsep\normal@labelsep
  \topsep\z@ \partopsep\z@ \parsep\z@ \itemsep\z@
  \listparindent 1em}
\let\@listi\@listI
\@listi
%
\setlength  \labelsep  {.5em}
\setlength  \labelwidth{\leftmargini}
\addtolength\labelwidth{-\labelsep}
\@beginparpenalty -\@lowpenalty
\@endparpenalty   -\@lowpenalty
\@itempenalty     -\@lowpenalty
\def\labelitemi{$\bullet$}          \def\labelitemii{$\cdot$}
\def\labelenumi{\theenumi.}        \def\theenumi{\arabic{enumi}}
\def\labelenumii{(\alph{enumii})}   \def\theenumii{\theenumi\alph{enumii}}
\def\labelenumiii{(\roman{enumiii})}\def\theenumiii{\theenumii.\roman{enumiii}}
\def\labelenumiv{(\Alph{enumiv})}   \def\theenumiv{\theenumiii.\Alph{enumiv}}

%
%%%%%%%%%%%%%%%%%%%%%%%%%%% Ordered & Unordered List  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%

\def\listfont{\selectfont}%

\def\enumargs{%
   \listfont%
   \leftmargini18pt%
   \topsep 6pt%
   \partopsep     \z@%
   \itemsep       \z@%
   \parsep        \z@%
   \labelsep      .75em%
   \rightmargin   \z@%
   \raggedright%   
   \listparindent \parindent%
   \itemindent    \z@}%

\def\enumerate{%
    \@ifnextchar[{\@numerate}{\@numerate[0.]}}

\def\@numerate[#1]{\par%
     \ifnum \@enumdepth >3 \@toodeep\else
     \advance\@enumdepth \@ne
     \edef\@enumctr{enum\romannumeral\the\@enumdepth}
     \list{\csname label\@enumctr\endcsname}{%
       \enumargs%
       \setlength{\leftmargin}{\csname leftmargin\romannumeral\the\@enumdepth\endcsname}
       \usecounter{\@enumctr}
       \settowidth\labelwidth{#1}
       \addtolength{\leftmargin}{\labelwidth}
       \addtolength{\leftmargin}{\labelsep}
       \def\makelabel##1{\hss\llap{##1}}}%
     \fi
   }
\let\endenumerate\endlist

%%Unnumbered list%%
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
     \list{\csname label\@enumctr\endcsname}{%
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

\def\itemargs{%
   \listfont%
   \leftmargini18pt%
   \topsep 6pt%
   \partopsep     \z@%
   \itemsep       \z@%
   \parsep        \z@%
   \labelsep      .75em%
   \rightmargin   \z@%
   \raggedright%   
   \listparindent \parindent%
   \itemindent    \z@}%

\renewcommand\labelitemi{\textbullet}
\renewcommand\labelitemii{\textendash}

\def\itemize{%
   \@ifnextchar[{\@itemize}{\@itemize[$\bullet$]}}

\def\@itemize[#1]{\par%
     \ifnum \@itemdepth >3 \@toodeep\else
     \advance\@itemdepth \@ne
     \edef\@itemctr{item\romannumeral\the\@itemdepth}
     \list{\csname label\@itemctr\endcsname}{%
       \itemargs
       \setlength{\leftmargin}{\csname leftmargin\romannumeral\the\@itemdepth\endcsname}
       \settowidth\labelwidth{#1}
       \addtolength{\leftmargin}{\labelwidth}
       \addtolength{\leftmargin}{\labelsep}
       \def\makelabel##1{\hss \llap{##1}}}%
     \fi
   }
\let\enditemize\endlist
%
\def\verse{\let\\=\@centercr
  \list{}{\itemsep\z@
  \itemindent \z@
  \listparindent\z@
  \rightmargin 1em
  \leftmargin \rightmargin}\item[]}
\let\endverse\endlist
\def\quotation{\list{}{\vskip 8pt\itemindent\z@
 \leftmargin 1em \rightmargin \z@
  \parsep \z@ \@plus 1pt}\item[]}
\newcommand\e{\endlist\vskip 8pt}
\let\endquotation\e
\def\quote{\list{}{\itemindent\z@
   \leftmargin 1em \rightmargin \z@}%
\item[]}
\let\endquote\endlist
\def\descriptionlabel#1{\hspace\labelsep\bfseries #1}
\def\description{\list{}{\leftmargin=2em\labelwidth\z@
  \leftmargin \z@ \topsep6pt\itemindent-\leftmargin
  %\advance\itemindent-\labelsep
  \let\makelabel\descriptionlabel}}
\let\enddescription\endlist
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Float %%%%%%%%%%%%%%%%%%%%%%%%%%%%

\setlength\abovecaptionskip{2.25\p@}
\setlength\belowcaptionskip{3\p@}

\setlength\arraycolsep{2\p@}
\setlength\tabcolsep{6\p@}
\setlength\arrayrulewidth{.4\p@}
\setlength\doublerulesep{2\p@}
\setlength\tabbingsep{\labelsep}

\def\fnum@figure{{\figurename}\space\relax{\thefigure}}
\def\fnum@table{{\tablename}\space\relax{\thetable}}

\def\FigName{figure}

\long\def\@makecaption#1#2{%
    \ifx\FigName\@captype
      \vskip\abovecaptionskip
        \@figurecaption{#1}{#2}
    \else
        \@tablecaption{#1}{#2}
      \vskip\belowcaptionskip
    \fi%
}


%% Figure
\DeclareMathVersion{sansbold}
\DeclareSymbolFont{alphabets}{\encodingdefault}{\rmdefault}{m}{it}
\DeclareSymbolFont{numbers}{\encodingdefault}{\rmdefault}{m}{n}

\SetSymbolFont{alphabets}{sansbold}{\encodingdefault}{\sfdefault}{b}{it}
\SetSymbolFont{numbers}{sansbold}{\encodingdefault}{\sfdefault}{b}{n}
\SetSymbolFont{operators}{sansbold}{\encodingdefault}{\sfdefault}{b}{n}

\def\figurenumfont{\reset@font\fontfamily{\sfdefault}\fontsize{10}{11.5}\fontseries{b}\selectfont}
\def\figurecaptionfont{\color{dscolor}\fontfamily{\sfdefault}\fontsize{10}{11.5}\fontseries{b}\selectfont\mathversion{sansbold}}

\newdimen\figwidth%
\newdimen\figheight%
\newdimen\sidecapwidth
\newdimen\wrapcapline%
\newdimen\totalwrapline%
\newdimen\wraptotline%

%% Figures macro
\def\FIG#1#2{%
{\centering#1\par}
#2}

%% Figures caption
\newbox\figcapbox
\newbox\capbox
\long\def\@figurecaption#1#2{%
{%
\setbox\figcapbox\hbox{\figurecaptionfont{\figurenumfont #1}\hskip.5em#2.\vphantom{y}\par}
%% Caption printing depending on figure width
%\ifdim\wd\figcapbox>\textwidth
%{\figurecaptionfont{\figurenumfont #1.}\hskip.5em{#2}.\par}%
%\else%
{{\centering\figurecaptionfont\textsf{\textbf{\figurenumfont #1.}}\hskip.5em\textsf{\textbf{#2}}\par}}%
%\fi%
}}%

%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
\RequirePackage{booktabs}
\cmidrulewidth=.15pt%
%
\def\tablenumfont{\fontfamily{\sfdefault}\reset@font\fontsize{10}{11.5}\fontseries{b}\selectfont\bfseries}
\def\tablecaptionfont{\color{dscolor}\fontfamily{\sfdefault}\fontsize{10}{11.5}\fontseries{b}\selectfont\bfseries}
\def\tablebodyfont{\fontsize{10}{12}\selectfont}
\def\tablecolheadfont{\fontsize{10}{12}\selectfont}
\def\tablefootnotefont{\fontsize{7}{8}\selectfont\raggedright}
\AtBeginEnvironment{tabular}{\fontfamily{\rmdefault}\fontsize{10}{12}\selectfont}
\AtBeginEnvironment{tabular*}{\fontfamily{\rmdefault}\fontsize{10}{12}\selectfont}

\def\tablefoot#1{{\noindent\fontfamily{\rmdefault}\fontsize{10}{12}\selectfont#1}}

%% Table Macro
\newbox\tablebox
%\newdimen\tabbodywidth
\long\def\TBL#1#2{%
\renewcommand\arraystretch{1}%
%\setbox\tablebox\hbox{\tablebodyfont #2\par}
%\tabbodywidth\wd\tablebox%
#1\vskip 0pt%
{\tablebodyfont #2\par}%
}

\def\raggedcenter{\leftskip0pt plus 1fill\rightskip0pt plus 1fill\parfillskip=0pt}%
%% Table Caption
\newbox\tabcapbox
\newdimen\tabcapwidth
\long\def\@tablecaption#1#2{%
{\setbox\tabcapbox\hbox{\tablecaptionfont{\tablenumfont #1.}\hskip.5em#2.\vphantom{y}\endgraf}%
\tabcapwidth\wd\tabcapbox%
%\ifdim\tabcapwidth<\hsize%
    {{\centering\tablecaptionfont\textsf{\textbf{#1.}}\hskip.5em\textsf{\textbf{#2}}\vphantom{y}\par}}%
%\else
 %   {\tablecaptionfont{\tablenumfont #1.}\hskip.5em#2.\vphantom{y}\par}%
%\fi
}}%

%% Table Column Heads
\def\TCH#1{{\tablecolheadfont #1}}

%% Table Footnotes
\newenvironment{fntable}[1][\columnwidth]{%
\def\@makefnmark{\hbox{\@textsuperscript{\fontsize{5}{5}\selectfont\@thefnmark}}}%
\begin{minipage}{#1}%
\def\thempfootnote{{\@arabic\c@mpfootnote}}
%%%%%%%%%%
\def\@xfootnotemark[##1]{%
   \begingroup
      %\c@footnote #1\relax
      \unrestored@protected@xdef\@thefnmark{##1}%
   \endgroup
   \@footnotemark}
%%%%%%%%%
\def\@xfootnotenext[##1]{%
  \begingroup
     %\csname c@\@mpfn\endcsname ##1\relax
     \unrestored@protected@xdef\@thefnmark{##1}%
  \endgroup
  \@footnotetext}
\renewcommand\@makefntext[1]{{%
\tablefootnotefont%
\hskip0pt{\smash{\@makefnmark}}##1\par}}
\renewcommand\footnotesize{\@setfontsize\footnotesize{10}{11.5}}%
}%
{\vspace{-0.75\skip\footins}%
\renewcommand{\footnoterule}{}%
\end{minipage}}%

%% Table Rules
\def\toprule{%\noalign{\vskip3pt}
\noalign{\ifnum0=`}\fi
  \hrule \@height 0\p@ \@width 0pt
  \hrule \@height .15\p@ % <- rule height
  \hrule \@height 5pt \@width 0pt
  \futurelet\@tempa\@xhline}
% Middle rule
\def\midrule{\noalign{\ifnum0=`}\fi%
  \hrule \@height 3pt \@width 0pt
  \hrule \@height .15pt % <- rule height
  \hrule \@height 5pt \@width 0pt
  \futurelet \@tempa\@xhline}
% Bottom rule
\def\botrule{\noalign{\ifnum0=`}\fi
  \hrule \@height 3pt \@width 0pt
  \hrule \@height .15\p@ % <- rule height
  \futurelet\@tempa\@xhline}
%
\def\@@@cmidrule[#1-#2]#3#4{\global\@cmidla#1\relax
    \global\advance\@cmidla\m@ne
    \ifnum\@cmidla>0\global\let\@gtempa\@cmidrulea\else
    \global\let\@gtempa\@cmidruleb\fi
    \global\@cmidlb#2\relax
    \global\advance\@cmidlb-\@cmidla
    \global\@thisrulewidth=#3
    \@setrulekerning{#4}
    \ifnum\@lastruleclass=\z@\vskip 3\p@\fi
    \ifnum0=`{\fi}\@gtempa
    \noalign{\ifnum0=`}\fi\futurenonspacelet\@tempa\@xcmidrule}
\def\@xcmidrule{%
   \ifx\@tempa\cmidrule
       \vskip-\@thisrulewidth
       \global\@lastruleclass=\@ne
   \else \ifx\@tempa\morecmidrules
       \vskip \cmidrulesep
       \global\@lastruleclass=\@ne\else
       \vskip 5\p@
       \global\@lastruleclass=\z@
   \fi\fi
   \ifnum0=`{\fi}}
\let\cline\cmidrule

%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%5
%

\renewcommand\@pnumwidth{1.55em}
\renewcommand\@tocrmarg{2.55em}
\renewcommand\@dotsep{4.5}
\setcounter{tocdepth}{3}
\renewcommand\tableofcontents{%
    \section*{\contentsname
        \@mkboth{%
           \MakeUppercase\contentsname}{\MakeUppercase\contentsname}}%
    \@starttoc{toc}%
    }
\renewcommand*\l@part[2]{%
  \ifnum \c@tocdepth >-2\relax
    \addpenalty\@secpenalty
    \addvspace{2.25em \@plus\p@}%
    \begingroup
      \setlength\@tempdima{3em}%
      \parindent \z@ \rightskip \@pnumwidth
      \parfillskip -\@pnumwidth
      {\leavevmode
       \large \bfseries #1\hfil \hb@xt@\@pnumwidth{\hss #2}}\par
       \nobreak
       \if@compatibility
         \global\@nobreaktrue
         \everypar{\global\@nobreakfalse\everypar{}}%
      \fi
    \endgroup
  \fi}
\renewcommand*\l@section[2]{%
  \ifnum \c@tocdepth >\z@
    \addpenalty\@secpenalty
    \addvspace{0em}% \@plus\p@}%
    \setlength\@tempdima{1.5em}%
    \begingroup
      \parindent \z@ \rightskip \@pnumwidth
      \parfillskip -\@pnumwidth
      \leavevmode \bfseries
      \advance\leftskip\@tempdima
      \hskip -\leftskip
      #1\nobreak\hfil \nobreak\hb@xt@\@pnumwidth{\hss #2}\par
    \endgroup
  \fi}
\renewcommand*\l@subsection{\@dottedtocline{2}{1.5em}{2.3em}}
\renewcommand*\l@subsubsection{\@dottedtocline{3}{3.8em}{3.2em}}
\renewcommand*\l@paragraph{\@dottedtocline{4}{7.0em}{4.1em}}
\renewcommand*\l@subparagraph{\@dottedtocline{5}{10em}{5em}}
\renewcommand\listoffigures{%
    \section*{\listfigurename
      \@mkboth{\MakeUppercase\listfigurename}%
              {\MakeUppercase\listfigurename}}%
    \@starttoc{lof}%
    }
\renewcommand*\l@figure{\@dottedtocline{1}{1.5em}{2.3em}}
\renewcommand\listoftables{%
    \section*{\listtablename
      \@mkboth{%
          \MakeUppercase\listtablename}{\MakeUppercase\listtablename}}%
    \@starttoc{lot}%
    }
\let\l@table\l@figure

%
%%%%%%%%%%%%%%%%%%%%%%%%%%%% Mini-TOC %%%%%%%%%%%%%%%%%%%%%%%%%
%
%\RequirePackage{etoc}
%\etocarticlestylenomarks
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%% Other Env. %%%%%%%%%%%%%%%%%%%%%%%%%
%
\newcommand{\appendixfontsize}{\@setfontsize\appendixfontsize{11pt}{12.5\p@}\selectfont}

%%%%%%%%%%%%%%%%%%%%%%%%%% Appendix %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\newif\ifappend % Are we in the Appendix?
\def\appendix{\par\appendixfontsize%
\gdef\thesection{\@Alph\c@section}
%  \renewcommand\thetable{\thesection\@arabic\c@table}
%  \renewcommand\thefigure{\thesection\@arabic\c@figure}
  \renewcommand\theequation{\thesection.\@arabic\c@equation}
  \renewcommand\theHequation{\thesection.\arabic{equation}}%
  \setcounter{section}{0}
  \setcounter{subsection}{0}
  \setcounter{subsubsection}{0}
%  \setcounter{table}{0}
%  \setcounter{figure}{0}
  \setcounter{equation}{0}
        \appendtrue}

\renewenvironment{quote}
               {\list{}{\topsep=0pt\topsep6pt\leftmargin=36pt\rightmargin=36pt\itshape}%
                \item\relax}
               {\endlist}
               

%
%%%%%%%%%%%%%%%%%%%%%%%%%%%% Appendix %%%%%%%%%%%%%%%%%%%%%%%%%
%

\newif\ifbackmatter%
\newcommand{\backmatter}{\par\global\backmattertrue}
               
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%% Appendix %%%%%%%%%%%%%%%%%%%%%%%%%
%
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%% BackMatters %%%%%%%%%%%%%%%%%%%%%%%%%
%
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%


%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Doi-Links %%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%% From doi.sty %%

\DeclareRobustCommand{\doitext}{}%

%% the meat of the code
%% the first command opens a group, and changes a few catcodes.
\newcommand*{\DOI}{%
  \begingroup
  \lccode`\~=`\#\relax
  \lowercase{\def~{\#}}%
  \lccode`\~=`\_\relax
  \lowercase{\def~{\_}}%
  \lccode`\~=`\<\relax
  \lowercase{\def~{\textless}}%
  \lccode`\~=`\>\relax
  \lowercase{\def~{\textgreater}}%
  \lccode`\~=0\relax
  \catcode`\#=\active
  \catcode`\_=\active
  \catcode`\<=\active
  \catcode`\>=\active
  \doitext\@mydoi
}

%% this is the actual command which processes the argument, with the catcodes
%% set in the previous command
%% it closes the group, and spits out the url.
\def\@mydoi#1{%
  \let\#\relax
  \let\_\relax
  \let\textless\relax
  \let\textgreater\relax
  \edef\x{\toks0={{#1}}}%
  \x
  \edef\#{\@percentchar23}%
  \edef\_{_}%
  \edef\textless{\@percentchar3C}% instead of {\string<} for Apple
  \edef\textgreater{\@percentchar3E}% instead of {\sting>} for Apple
  \edef\x{\toks1={\noexpand\href{http://dx.doi.org/#1}}}%
  \x
  \edef\x{\endgroup\the\toks1 \the\toks0}%
  \x
}
%
%%%%%%%%%%%%%%%%%%%%%%%%%%% Article History  %%%%%%%%%%%%%%%%%%%%
%
\def\@history{}
\def\printhistory{{\par\addvspace{5pt}%
\historyfont\noindent%
\ifx\@history\empty\gdef\@history{Received xx xxx xxxx}\fi\@history\par}
}%

%
\renewenvironment{theindex}
               {\if@twocolumn
                  \@restonecolfalse
                \else
                  \@restonecoltrue
                \fi
                \columnseprule \z@
                \columnsep 35\p@
                \twocolumn[\section*{\indexname}]%
                \@mkboth{\MakeUppercase\indexname}%
                        {\MakeUppercase\indexname}%
                \thispagestyle{plain}\parindent\z@
                \parskip\z@ \@plus .3\p@\relax
                \let\item\@idxitem}
               {\if@restonecol\onecolumn\else\clearpage\fi}
\renewcommand\@idxitem{\par\hangindent 40\p@}
\renewcommand\subitem{\@idxitem \hspace*{20\p@}}
\renewcommand\subsubitem{\@idxitem \hspace*{30\p@}}
\renewcommand\indexspace{\par \vskip 10\p@ \@plus5\p@ \@minus3\p@\relax}

%
%%%%%%%%%%%%%%%%%%%%%%% Footnotes %%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%

\renewcommand\footnoterule{%
  \kern2\p@%
  \hrule \@height.5pt \@width12pc%
  \kern4.5\p@}%
%

\def\@makefnmark{{\textsuperscript{\@thefnmark}}}

\renewcommand\@makefntext[1]{%
    {\smash{\@makefnmark}}\,#1}
%

\def\doi#1{\quad\url{http://dx.doi.org/#1}}
%
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%

\pagestyle{headings}
\pagenumbering{arabic}
\sloppy
\frenchspacing
\flushbottom

%%% special parameters for TeX
\linepenalty=100

\newcommand\@citeartfntext[1]{%
  \begingroup\hsize\textwidth%
    \leftskip=\z@\rightskip=\z@%
    \footnotesize%
    \setlength\parindent{0pt}%
    \leavevmode#1\par%
  \endgroup}

\def\firstpage{1}

\AtBeginDocument{%\let\bibsection\relax
  \renewcommand\bibsection{%
   \section*{\color{dscolor}\refname}%
  }%
}
\AtBeginDocument{\setlength\mathindent{35pt}
\setlength{\bibhang}{18pt}

}
%\def\displaystyle{\fontsize{10}{12}\selectfont}
 \endinput
