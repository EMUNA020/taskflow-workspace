# Angular Clean Code Skill
description: Enforces minimal, strict, and highly optimized Angular 19 code. Use this skill when writing services, components, or performing a code review.

## Guidelines
- Functions must be under 10 lines of code and do only one thing.
- Use strictly Pure Angular Signals (input(), output(), computed()). No unnecessary RxJS.
- Use new control flow (@if, @for).
- Delete any unused variables, comments, or console.logs automatically.