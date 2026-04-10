Dear Georg Hackenberg,

Thank you for submitting your paper to SPLC 2025. We regret to inform you that your paper entitled Bridging Digital and Physical: Applying Software Product Line Engineering Principles to Digital LEGO has not been accepted for the SPLC 2025 research track.

We received 41 complete submissions, from which we desk-rejected 2 due to being out of scope,  2 were witdrawn by authors, one was moved to the industrial track as per authors request and one did not ended in a full submission. This led to 33 papers to review.

We include all reviews of your paper below. We hope that the feedback and recommendations given by the reviewers are helpful in further revisions of your paper.

There are still many other opportunities to participate in SPLC 2025:
- Workshops Papers (June 12th)
- Journal First Papers (June 12th)
- Demonstrations and Tools (June 12th)
- Doctoral Symposium (June 12th)
- Tutorials (June 12th)
- Challenges Solutions (June 12th)

Best Regards,

Sandra Greiner and José A. Galindo
SPLC 2025 Research Track Chairs.

SUBMISSION: 53
TITLE: Bridging Digital and Physical: Applying Software Product Line Engineering Principles to Digital LEGO


----------------------- REVIEW 1 ---------------------
SUBMISSION: 53
TITLE: Bridging Digital and Physical: Applying Software Product Line Engineering Principles to Digital LEGO
AUTHORS: Aleksandra Erohina, Christian Zehetner and Georg Hackenberg

----------- Overall evaluation -----------
SCORE: -2 (reject)
----- TEXT:
While this paper explores an interesting idea to build a reusable/reproducible case that could be used for PLE including hardware and software, the paper in its current form does not fit the research track and the extent of the derived case is too small to be used for PLE.
----------- Summary -----------
The paper proposes to use SPLE on Lego to build cases for the integration/interaction of software and hardware components in modern (cyber-physical) systems. This is an interesting idea that could result in feasible case studies with well-defined ground truths that could help in future research.
----------- Strengths -----------
- Nice idea for developing cases with well-defined ground truth
- Well written
----------- Weaknesses -----------
- The methodology is not well-described
- The resulting case is too limited/small and has some unexplained/confusing results
- Related work (and threats to validity) missing
- Research questions have not been answered
----------- Overall Assessment -----------
Below, I will first judge the five criteria. Afterwards, I will go through detailed comments and suggestions for improvement, and connect those to the criteria, too.


Originality:
The idea of using Lego for showcasing the interactions between software and hardware is new. However, I would suggest to reflect on the fact that Lego always has been a typical example for PLE, as visible in a recent paper at VaMoS (noticed it is not yet available on ACM, but the linked teaching materials have been long build and use Lego as an example) [1].

Importance:
Having good cases with feasible ground truths is very important to develop future benchmarks are being able to compare new research. However, I do not feel that this is very well motivated in the paper at the moment. One reference that could maybe help motivate and scope this more precisely (or to find some other related work) could be the work by Strüber et al. [2].


Soundness:
The paper does make sense, but delves much into details that are not very interesting/research-relevant. Moreover, it does not explain important steps and states methodologies that are not reported on. The research questions are not answered (at least I could not find it), and the resulting case is very small. So, I do not feel that the paper as is contributes a sound artifact for the community. However, I am convinced that this can be improved in the future and can lead to a useful case for PLE research.


Transparency:
Many steps are logical, but quite some things are not explained. I am not fully convinced all steps can be fully grasped or replicated at the moment.


Presentation quality:
The paper is written very well and the general structure works nicely.



Detailed comments:

- [Major, Soundness/Novelty, Paper e.g. Line 111 particularly Section 2] The paper states several times that  a literature review was conducted. However, there are no details on the process of this literature review (which is a research method). For instance, I cannot find any information on
-- What were the search queries?
-- What databases were searched?
-- What were selection criteria?
-- How many papers were found/selected?
-- ...
As a consequence, Section 2 is not really related work, it is background at best. This is further underpinned by the many (example only, there are many more!) references I provide throughout my review and in the list at the end. The related work does not have to be a literature review or complete. But currently, it lacks tremendous amounts of related work, which in turn results in a sub-optimal positioning of this paper in the context of existing research.

- [Major, Soundness/Transparency, Section 3] The case study immediately delves into descriptions of the product (line) and its components. There is no description of the design method:
-- How was the case study designed?
-- What steps were involved in the analysis and construction of the product line?
-- What were design decisions?
-- What does "the selected product line" mean? I thought it was created for the paper and did not exist before?
-- How was the validity of the resulting artifact(s) evaluated?
-- What are some metrics (number variants, lines of code, programming language, ...) of the product line, or is it only a feature model?
I strongly advise to check the ACM SIGSOFT Empirical Standards [3] regarding research methods and references/examples. I would say the method here is roughly engineering research / design science; but the process of constructing the case is not really described. Without such details, the soundness/transparency of the work is threatened and the paper may be more fitting for an industry/practice track.

- [Major, Importance/Soundness, Paper especially Section 3 and Figure 2] The constructed product line with its feature model seem very small. I am wondering to what extent such a small example would help in product-line research. Also (connecting to the previous point): why have two distinct features frame and cover, if cover is fully depending on frame? Frame immediately defines cover, so is it necessary to split these up as conceptual features? Maybe yes, but I could not find a reasoning for it.

- [Major, Soundness/Presentation, Paper/RQs] The research questions form the introduction are not (at least not explicitly/visibly) answered. RQ1 I can somewhat find. RQ2 and RQ3 not at all, for instance "tool*" (RQ3) is mentioned only 3 times in the entire paper, there seem to be no results or answers to these questions. In addition, the RQs are not well-designed: they are all yes/no questions (and therefore the answer to all of them is likely or rather should be yes, but with varying problems).


- [Minor, Presentation, Abstract] The abstract is very short. It does not give any details about the context and background of the paper: Where is it positioned?

- [Minor, Soundness, Line 146] Why using this type of feature model? What are the reasons? There are many more representations and recent attempts have been made to define a unified variability-modeling language [4]; why not use that one instead to future proof the case?

- [Minor, Presentation/Soundness/Novelty, Paper] There are some phrases throughout the paper that are confusing to me and sometimes they make me feel that the paper is not fully sound, for example:
-- [Line 31] What does it mean that a market shift's from a seller's to a buyer's? Does this basically refer to supply and demand? I.e., producers will only produce when the (enough) customer requests for a product? I am sorry if this is a common English phrasing, but I do not fully get what is meant here.
-- [Line 35ff] It is very weird to me to claim that most industries do not start from scratch, and the only reference is a single case study in a very specific market. You may want to check out and use a paper [5] (or cases from within it) that has collected cost data and lists many cases, most extractive.
-- [Line 78] This is confusing me. SPLE has actually originated in hardware platforms/PLE. First, automotive/... companies started product lines (literally) and then software engineering adapted. Now, there may be a shift back, but this statement does not parse correctly. Maybe check out the teaching materials by Kuiter et al. [1] for also a historical overview.
-- [Line89] What "geometric" means becomes only clear much later in the paper. I strongly advise to either define more precisely here, or maybe us geometric form instead of representation.
-- [Line 94] What is the current situation? The previous sentence ended with SPLE not yet being feasibly incorporated into technical systems. This is not really the scope of the paper. Also, there are many works that actually investigate hardware/software product lines (please note that cyber-physical is just a current instantiation with more interaction/feedback loops, which I do not supported in the Lego case) [5,6,7,8,9,10]. I do not feel that this makes this case special. What makes it special is the idea of creating a reusable, fully accessible, and replicable ground truth that is not challenged by industry having to hide information/details.


References:
[1] Elias Kuiter, Thomas Thüm and Timo Kehrer: Teach Variability! A Modern University Course on Software Product Lines. VaMoS 2025 (https://eur02.safelinks.protection.outlook.com/?url=https%3A%2F%2Fraw.githubusercontent.com%2FSoftVarE-Group%2FPapers%2Fmain%2F2025%2F2025-VaMoS-Kuiter.pdf&data=05%7C02%7Cgeorg.hackenberg%40fh-wels.at%7C0776a4a9cb8d4f23876208dd9ebfcd5e%7Cf88d4b736bb24b9aabc7eb96e5a6407c%7C0%7C0%7C638841269118701570%7CUnknown%7CTWFpbGZsb3d8eyJFbXB0eU1hcGkiOnRydWUsIlYiOiIwLjAuMDAwMCIsIlAiOiJXaW4zMiIsIkFOIjoiTWFpbCIsIldUIjoyfQ%3D%3D%7C0%7C%7C%7C&sdata=qDv93DsvZAHpKvtD%2FUi6WAs4pdbX7OUD0kqaELCkJko%3D&reserved=0)
[2] Daniel Strüber, Mukelabai Mukelabai, Jacob Krüger, Stefan Fischer, Lukas Linsbauer, Jabier Martinez, Thorsten Berger: Facing the truth: Benchmarking the techniques for the evolution of variant-rich systems. SPLC 2019
[3] https://eur02.safelinks.protection.outlook.com/?url=https%3A%2F%2Fwww2.sigsoft.org%2FEmpiricalStandards%2Fdocs%2Fstandards&data=05%7C02%7Cgeorg.hackenberg%40fh-wels.at%7C0776a4a9cb8d4f23876208dd9ebfcd5e%7Cf88d4b736bb24b9aabc7eb96e5a6407c%7C0%7C0%7C638841269118722053%7CUnknown%7CTWFpbGZsb3d8eyJFbXB0eU1hcGkiOnRydWUsIlYiOiIwLjAuMDAwMCIsIlAiOiJXaW4zMiIsIkFOIjoiTWFpbCIsIldUIjoyfQ%3D%3D%7C0%7C%7C%7C&sdata=KFbttld5oOAyh5Xi%2FyWg60Afh4Z85M0VSvq0shlgaJs%3D&reserved=0
[4] David Benavides, Chico Sundermann, Kevin Feichtinger, José A. Galindo, Rick Rabiser, Thomas Thüm: UVL: Feature modelling with the Universal Variability Language. J. Syst. Softw. 2025
[5] Jacob Krüger, Thorsten Berger: An empirical analysis of the costs of clone- and platform-oriented software reuse. ESEC/SIGSOFT FSE 2020
[6] Thomas Fogdal, Helene Scherrebeck, Juha Kuusela, Martin Becker, Bo Zhang: Ten years of product line engineering at Danfoss: Lessons learned and way ahead. SPLC 2016
[7] Motoi Nagamine, Tsuyoshi Nakajima, Noriyoshi Kuno: A case study of applying software product line engineering to the air conditioner domain. SPLC 2016
[8] Muhammad Abbas, Robbert Jongeling, Claes Lindskog, Eduard Paul Enoiu, Mehrdad Saadatmand, Daniel Sundmark: Product line adoption in industry: An experience report from the railway domain. SPLC 2020
[9] Robert Lindohf, Jacob Krüger, Erik Herzog, Thorsten Berger: Software product-line evaluation in the large. Empir. Softw. Eng. 2021
[10] Elias Kuiter, Jacob Krüger, Gunter Saake: Iterative development and changing requirements: Drivers of variability in an industrial system for veterinary anesthesia. SPLC 2021
----------- Reviewer's confidence -----------
SCORE: 5 ((expert))



----------------------- REVIEW 2 ---------------------
SUBMISSION: 53
TITLE: Bridging Digital and Physical: Applying Software Product Line Engineering Principles to Digital LEGO
AUTHORS: Aleksandra Erohina, Christian Zehetner and Georg Hackenberg

----------- Overall evaluation -----------
SCORE: -2 (reject)
----- TEXT:
The work is well presented and easy to follow.
LEGO is a good case study in general and especially well-suited for education.

This work addresses a very challenging and important topic that has not been sufficiently addressed yet.
However, it is not solved as easily as is suggested in this work: not by enumerating all product variants.

My biggest concern is the very small case study (only three product variants) and how the 150% model explicitly enumerates all product variants.
I believe the problem is oversimplified and the solution infeasible in practice.

Detailed Comments:

Section 2.2: "it is worth mentioning that PLE goes hand in hand with the concept of modularity" -> Not necessarily. Prominent counter example: preprocessor-based product lines. Not modular, rather scattered and cross-cutting.

Figure 3: Main model and submodels seem to contain the exact same information: three variants of the drone.

After the explanation in Section 3.4 it sounds as if the root LDraw model actually contains all three variants. This is not a 150% model but an enumeration of all possible variants and is infeasible as it does not scale. It works for this toy example with only three product variants.

Section 4 Conclusion: "geometric interfaces between components of physical products in a product line" -> Sounds interesting!
----------- Summary -----------
The paper explores the application of SPLE to the development of physical products by using digital LEGO as a case study.
----------- Strengths -----------
- Well written and structured and easy to follow. Good figures.
- LEGO is a good case study and also well-suited for PLE education.
- Dealing with geometric/space constraints is a very challenging and important topic that has not been sufficiently addressed yet.
----------- Weaknesses -----------
- The case study is too small (three product variants is not enough).
- The problem is oversimplified and not as easily solved as suggested (a more complex case study system would have reveled this).
- The 150% model is actually an explicit enumeration.
----------- Overall Assessment -----------
The work is original and addresses an important and relevant topic.
It is properly presented and easy to follow.
However, the case study is too simplistic, the problem is oversimplified and not solved as easily as is suggested in this work.
What is advertised as a 150% model is actually a complete enumeration of all possible product variants and is thus not a feasible solution.
----------- Reviewer's confidence -----------
SCORE: 4 ((high))



----------------------- REVIEW 3 ---------------------
SUBMISSION: 53
TITLE: Bridging Digital and Physical: Applying Software Product Line Engineering Principles to Digital LEGO
AUTHORS: Aleksandra Erohina, Christian Zehetner and Georg Hackenberg

----------- Overall evaluation -----------
SCORE: -2 (reject)
----- TEXT:
The paper investigates the principles for software product lines and variability to systems including mechanical components.

I appreciate the exploration of real-world systems with physical, electronic and software components.

My main concern is that the authors seem to not be aware that software product lines actually originated from physical product lines. Also, there is quite a bit of tooling available that allows for significantly more advanced analysis of variants for physical products, such as the Siemens SIMIT platform, as well as well established approaches such as the "Baukasten" approach by Volkswagen and others.

Concluding, I am unable to identify a significant scientific or industrial contribution in the work.
----------- Summary -----------
The paper investigates the principles for software product lines and variability to systems including mechanical components.
----------- Strengths -----------
I appreciate the exploration of real-world systems with physical, electronic and software components.
----------- Weaknesses -----------
My main concern is that the authors seem to not be aware that software product lines actually originated from physical product lines. Also, there is quite a bit of tooling available that allows for significantly more advanced analysis of variants for physical products, such as the Siemens SIMIT platform, as well as well established approaches such as the "Baukasten" approach by Volkswagen and others.
----------- Overall Assessment -----------
See above. I am unable to identify a significant scientific or industrial contribution in the work.
----------- Reviewer's confidence -----------
SCORE: 4 ((high))