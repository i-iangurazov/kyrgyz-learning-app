# Mobile App Shell Guidelines

This document defines the app shell UX for the MVP and future mobile-first work.

## Shell Goal

The shell should make the web app feel like a premium mobile app while still working well on desktop.

The shell should:

- Keep content centered on desktop.
- Optimize for around 390px mobile width.
- Provide stable top-level navigation.
- Avoid desktop-style sidebars or wide layouts.
- Keep lesson and practice actions reachable by thumb.

## Top Header

Current behavior:

- Sticky top header.
- Product/level label.
- Product title.
- Streak indicator.
- Settings icon.

Guidelines:

- Keep the header compact.
- Use it for context, not navigation overload.
- Avoid adding more than two right-side actions.
- Header text should truncate cleanly.
- In focused lesson/exam mode, the header can become smaller or switch to a step/progress header.

The top header may show:

- App title.
- Current track or level.
- Streak/daily activity.
- Settings.
- Lesson step progress in focused flows.

The top header should not show:

- Long methodology labels.
- Source metadata.
- Multiple competing buttons.
- Marketing copy.

## Bottom Floating Island Tab Bar

The MVP uses exactly 5 tabs:

- Home
- Learn
- Practice
- Games
- Profile

Rules:

- Keep 5 tabs maximum.
- Use icons plus short labels.
- Preserve active state.
- Keep tap targets comfortable.
- Keep bottom safe-area spacing.
- Do not add hidden overflow tabs.
- Do not use the bottom nav for lesson-step navigation.

## Desktop Behavior

Desktop should preserve a mobile app-like frame:

- Center the app content.
- Use a mobile max width.
- Do not stretch lesson content across the full browser.
- Use surrounding background only as app framing.

Desktop is for convenience and QA, not the primary layout target.

## Safe Area And Bottom Padding

Rules:

- Main content needs enough bottom padding so the floating island does not cover final actions.
- Sticky or fixed bottom actions must account for the tab bar.
- On iOS-like devices later, support safe-area inset behavior.
- Full-page screenshots may show the nav over mid-page content; actual scroll endpoints must remain usable.

## When Bottom Nav Should Be Visible

Show bottom nav on:

- Home.
- Learn.
- Practice.
- Games.
- Profile.
- Standard lesson browsing in MVP.

Bottom nav can be hidden or reduced in:

- Focused lesson mode.
- Exam mode.
- Placement test.
- Recording/speaking mode.
- AI roleplay mode.

If hidden, provide a clear exit/back path.

## Accessibility

Rules:

- Navigation must have an accessible label.
- Icon-only controls need accessible names.
- Active tab state should be visually clear.
- Text contrast must remain readable.
- Touch targets should be at least 44px where practical.
- Avoid relying on color alone.
- Support keyboard focus states.
- Do not trap focus in normal app screens.

## Keyboard And Touch Target Rules

- Primary buttons should be full-width in narrow lesson cards when appropriate.
- Inline answer choices should be large enough to tap.
- Avoid tiny text links for primary actions.
- Avoid hover-only behavior.
- Keep spacing between answer choices.

## Empty States

Empty states should:

- Explain what will appear here.
- Offer one useful action.
- Avoid internal implementation language.
- Avoid making the product feel broken.

Examples:

- Practice: "Your review queue will appear here after more lessons."
- Games: "Mini-games unlock from lesson words."
- Profile: "Track and goal settings will live here."

## Loading States

Loading states should:

- Preserve layout shape.
- Avoid sudden shifts.
- Use small skeletons or calm loading text.
- Not block the whole app unless necessary.

## Error States

Error states should:

- Be specific.
- Offer a retry or navigation action.
- Avoid exposing stack traces.
- Keep the tone calm.

## Internal Metadata Visibility

Learners should not see:

- `sourceNotes`
- `rightsNotes`
- `validatedAgainst`
- `methodologyRefs`
- raw methodist review fields

They may see simplified trust labels only when intentionally designed, such as:

- "Demo lesson"
- "Expert review pending"
- "Audio coming later"

These labels should be brief and not dominate the lesson.
