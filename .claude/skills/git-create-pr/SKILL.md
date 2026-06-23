# Git Create Pull Request Skill
description: Automates the process of pushing the current branch and opening a Pull Request on GitHub. Use this skill when the user says they finished a feature and want to open a PR or submit code.

## Guidelines
- Identify the current branch name using `git branch --show-current`.
- Push the branch to remote using `git push origin <branch-name>`.
- Use the GitHub CLI to create the PR: `gh pr create --title "<branch title>" --body "Automated PR created by Claude Code for TaskFlow workspace."`.
- Print the generated GitHub PR URL to the user.
