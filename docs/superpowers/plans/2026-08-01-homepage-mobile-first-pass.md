# Homepage Mobile First Pass Implementation Plan

> For agentic workers: execute this plan task-by-task with TDD. Steps use checkbox syntax for tracking.

Goal: Reduce mobile homepage density while preserving the existing desktop editorial composition and all public content boundaries.

Architecture: Keep the current homepage data sources and desktop markup. Add explicit mobile content variants for Hero and the flywheel, turn the existing AI guide window into one reusable desktop/mobile window shell, and make ProjectLibrary conditionally render six supporting projects on compact viewports using matchMedia instead of CSS-only hiding.

Tech Stack: Next.js 16, React 19, TypeScript, CSS, Node test runner, existing tsc and Next build gates.

## Global Constraints

- Work in the existing demonstratio checkout; do not create a worktree, commit, push, reset, checkout, stash, clean, or deploy.
- Preserve the baseline detail-page modifications in app/case-study.css, components/case-study/, content/flagship-cases/, tests/flagship-case-contract.test.mjs, tests/service-agent-case-layout.test.mjs, docs/superpowers/plans/2026-08-01-scs-case-page-layout-refine.md, docs/superpowers/specs/2026-08-01-scs-case-page-layout-refine-design.md, and artifacts/.
- Modify only homepage components, homepage styles, and homepage contract tests.
- Keep desktop Hero, full AI guide window, nine-project library, and circular flywheel available.
- On phone widths, render only the lean Hero, the AI entry card plus Sheet when opened, six supporting projects, and the semantic six-step flywheel.
- Do not use overflow-x: hidden, transform: scale(), negative flywheel margins, or a fixed 620px mobile flywheel height.
- Mobile body text is at least 14px; labels and auxiliary text are at least 11px; interactive controls are at least 44px high.

### Task 1: Add failing homepage mobile contracts

Files:
- Create tests/homepage-mobile-first-pass.test.mjs
- Modify tests/v5-home-contract.test.mjs only where the new stable project numbering supersedes the old assertion
- Read all homepage source files and record the baseline status before editing

Step 1: Write focused red tests.

The new test must read source files and assert:

    const hero = await read("components/home/Hero.tsx");
    const guide = await read("components/PortfolioGuide.tsx");
    const library = await read("components/ProjectLibrary.tsx");
    const flywheel = await read("components/DataFlywheel.tsx");
    const css = await read("app/portfolio-polish.css");
    const globals = await read("app/globals.css");
    const v5 = await read("app/v5.css");

    assert.match(hero, /hero-lead-mobile/);
    assert.match(hero, /hero-mobile-proof/);
    assert.match(hero, /hero-ai-label-mobile/);
    assert.match(guide, /guide-mobile-entry/);
    assert.match(guide, /guide-window-shell/);
    assert.match(guide, /guide-sheet-close/);
    assert.match(guide, /guide-role-description/);
    assert.match(library, /useSyncExternalStore/);
    assert.match(library, /!project\.featured/);
    assert.match(library, /project\.index/);
    assert.match(library, /library-card-compact/);
    assert.match(flywheel, /flywheel-mobile/);
    assert.match(flywheel, /咨询接入/);
    assert.match(css, /@media \(max-width: 720px\)/);
    assert.match(css, /hero-mobile-proof/);
    assert.match(css, /guide-window-shell\.is-open/);
    assert.match(css, /guide-role-tabs/);
    assert.match(css, /font-size:\s*(?:11|12|13|14|15|16)px/);
    assert.doesNotMatch(globals, /transform:\s*scale\(\.88\)/);
    assert.doesNotMatch(globals, /min-height:\s*620px/);
    assert.doesNotMatch(v5, /overflow-x:\s*hidden/);

Step 2: Run the focused test and confirm it fails because the new names and contracts are absent.

    node --test tests/homepage-mobile-first-pass.test.mjs

Step 3: Update the existing v5 contract so the stable visible project number is read from project.index, not an array position. Do not weaken unrelated assertions.

Step 4: Run the focused test again and record the expected red failures before production changes.

### Task 2: Implement the lean mobile Hero

Files:
- Modify components/home/Hero.tsx
- Modify app/portfolio-polish.css
- Modify app/editorial-responsive.css only if an existing mobile rule prevents the explicit final variant

Interfaces:
- Hero continues to accept metrics: BoundPublicMetric[].
- Desktop existing hero-title-desktop, hero-title-mobile, hero-ai-path, hero-links, capability-index, and desktop resume CTA remain available.
- New mobile-only nodes are hero-lead-mobile and hero-mobile-proof.

Step 1: Add a short mobile paragraph with two sentence lines and a mobile proof strip that maps metrics.slice(0, 3). Add desktop/mobile label spans inside the AI button so the desktop wording remains unchanged.

Step 2: Add final mobile rules:

    @media (max-width: 720px) {
      .hero-ai-path,
      .hero-links,
      .capability-index,
      .hero-lead-desktop,
      .hero .button-tertiary { display: none; }
      .hero-lead-mobile { display: block; }
      .hero-actions { display: grid; grid-template-columns: minmax(0, 1.08fr) minmax(0, .92fr); }
      .hero-actions .button { min-height: 48px; font-size: 14px; }
      .hero-mobile-proof { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); min-height: 92px; }
    }

Ensure the mobile title and body use the requested readable floor and do not reintroduce the full desktop invitation card.

Step 3: Run the Hero-focused test and the existing homepage editorial tests.

    node --test tests/homepage-mobile-first-pass.test.mjs tests/homepage-editorial-responsive.test.mjs tests/v5-home-contract.test.mjs

### Task 3: Convert the AI guide into a compact entry plus one full Sheet

Files:
- Modify components/PortfolioGuide.tsx
- Modify app/portfolio-polish.css
- Preserve the existing fetch, stream parser, state, suggestions, transcript, source links, wait state, and error copy.

Interfaces:
- Add sheetOpen state and refs for the mobile trigger and close button.
- Keep one guide-window instance in guide-window-shell; desktop renders it inline, compact view renders it only while guide-window-shell has is-open.
- Add guide-mobile-entry, guide-sheet-backdrop, guide-sheet-close, and guide-role-description.

Step 1: Add failing behavior assertions for one window instance, a mobile entry trigger, a close button, a current-role description, focus restoration, and body scroll locking.

Step 2: Add open/close handlers. On open, add guide-sheet-open to body and focus the close button; on close, remove the class and restore the trigger focus. Close on the backdrop and Escape/cancel path.

Step 3: Keep the desktop guide window in the current two-column guide layout. At max-width 720px, hide the inline window shell while closed and make it a full viewport Sheet while open. The mobile entry card is the only visible guide control when closed.

Step 4: Make the mobile role tabs a three-column segmented control. Hide inactive long notes and expose only the selected role through guide-role-description. Set chat text to 14px minimum, metadata/labels to 11px minimum, and all role/input/close controls to at least 44px.

Step 5: Run the focused guide and homepage tests.

    node --test tests/homepage-mobile-first-pass.test.mjs tests/portfolio-guide-ux-r2.test.mjs tests/portfolio-guide.test.mjs tests/v5-home-contract.test.mjs

### Task 4: Make ProjectLibrary render six mobile projects without hidden duplicate nodes

Files:
- Modify components/ProjectLibrary.tsx
- Modify app/portfolio-polish.css
- Modify tests/v5-home-contract.test.mjs if its number contract still refers to array position

Interfaces:
- ProjectLibrary continues to receive the full non-archived project list.
- Use useSyncExternalStore with a 720px media query and a server snapshot that renders the compact six-project set.
- visible filters archived projects, then excludes featured when compact and showAllProjects is false.
- A mobile jump control sets active to 全部 and showAllProjects to true.
- Desktop card markup retains images. Compact card markup is an anchor row with project.index, title, subtitle, status and up to two metrics; no image node is rendered.

Step 1: Write the red assertions for useSyncExternalStore, compact rendering, project.index numbering, six-project filtering, and the absence of CSS-only featured hiding.

Step 2: Implement the media-query snapshot and conditional render. The initial compact list is projects.filter(project => !project.archived && !project.featured), so LoRA remains the first row because its data index is 04 and it is the first non-featured project.

Step 3: Add the mobile “已查看三个旗舰案例 · 查看全部九个项目” control and make it keyboard-operable with aria-expanded and a 44px minimum target.

Step 4: Add compact list styles with min-width: 0, readable text, visible arrow affordance, and a focus-visible outline. Do not hide featured cards with display:none.

Step 5: Run the focused library and existing homepage tests.

    node --test tests/homepage-mobile-first-pass.test.mjs tests/v5-home-contract.test.mjs

### Task 5: Replace the mobile flywheel geometry and remove old shrink rules

Files:
- Modify components/DataFlywheel.tsx
- Modify components/ProductMethod.tsx only if the wrapper needs a semantic label adjustment
- Modify app/globals.css
- Modify app/portfolio-polish.css
- Modify app/v5.css

Interfaces:
- DataFlywheel keeps the existing steps data and desktop .flywheel class.
- Add .flywheel-desktop and .flywheel-mobile variants.
- The mobile variant is an ordered list with six li elements and a final “↺ 回到咨询接入” loop marker.

Step 1: Write the red assertions for flywheel-mobile, six numbered steps, no scale, no negative margins, no 620px mobile height, and no overflow-x hidden.

Step 2: Render the desktop ring and semantic mobile list from the same steps array. Keep the ring decorative with aria-hidden and give the list an explicit aria-label.

Step 3: Replace the old mobile flywheel rule in globals.css. Add final styles that show the list under 720px and the ring above it. Use 64px section rhythm, 40px subsection rhythm and 16px card gaps without fixed-height compression.

Step 4: Run the focused flywheel and homepage tests.

    node --test tests/homepage-mobile-first-pass.test.mjs tests/v5-home-contract.test.mjs

### Task 6: Run all gates and responsive browser verification

Files:
- Read all changed homepage files.
- Do not modify any detail-page file, detail-page test, detail-page spec/plan, or artifacts file.

Step 1: Run TypeScript and the homepage/guide/project tests:

    npm run lint
    node --test tests/homepage-mobile-first-pass.test.mjs tests/homepage-editorial-responsive.test.mjs tests/v5-home-contract.test.mjs tests/portfolio-guide-ux-r2.test.mjs tests/portfolio-guide.test.mjs

Step 2: Run the remaining existing project tests that do not mutate the workspace:

    npm run test:v5
    npm run test:guide
    npm run test:cases

If the pre-existing detail-page authority-package condition fails, report it separately and do not edit detail files to resolve it.

Step 3: Build the production artifact:

    npm run build

Step 4: Start the local production app and inspect the home route at 360px, 375px, 390px and 430px. For each viewport record:

- Hero contains the mobile value, two CTA controls and three proof metrics.
- Hero links, full invitation prompts and capability index are not focusable or exposed in the compact view.
- AI guide shows only the entry card until opened; opening shows a full-height Sheet, horizontal role control and 44px controls.
- ProjectLibrary renders six supporting projects by default, LoRA is first with index 04, and expansion renders all nine without CSS-only hidden duplicate cards.
- Flywheel shows six semantic vertical steps.
- document.documentElement.scrollWidth === document.documentElement.clientWidth.

Step 5: Run the final diff boundary check:

    git diff --check
    git status --short
    git diff --name-only

Verify that every changed source/test path is a homepage path. Do not commit or push.
