# Contributing to discord.js-template-v14

We would love for you to contribute to this project and help make it even better!
As a contributor, here are the guidelines we would like you to follow:

- [Code of Conduct](#code-of-conduct)
- [Question or Problem?](#question-or-problem)
- [Issues and Bugs](#found-a-bug)
- [Feature Requests](#missing-a-feature)
- [Submission Guidelines](#submission-guidelines)
- [Coding Rules](#coding-rules)
- [Commit Message Guidelines](#commit-message-format)
- [Signing the CLA](#signing-the-cla)

## Code of Conduct

Help us keep this project open and inclusive.
Please read and follow our [Code of Conduct](./CODE_OF_CONDUCT.md).

## Question or Problem?

Do not open issues for general support questions as we want to keep GitHub issues for bug reports and feature requests.
Instead, we recommend using our [Discord Server](https://discord.gg/GsYF4xceZZ) to ask support-related questions.

Discord is a much better place to ask questions since:
- There are community people willing to help
- Questions and answers stay available for public viewing

We will systematically close all issues that are requests for general support and redirect people to Discord.

## Found a Bug?

If you find a bug in the source code, you can help us by [submitting an issue](#submitting-an-issue) to our [GitHub Repository](https://github.com/xirothedev/discord.js-template-v14/issues).
Even better, you can [submit a Pull Request](#submitting-a-pull-request) with a fix.

## Missing a Feature?

You can _request_ a new feature by [submitting an issue](#submitting-an-issue) to our GitHub Repository.
If you would like to _implement_ a new feature, please consider the size of the change:

- For a **Major Feature**, first open an issue and outline your proposal so that it can be discussed.
- **Small Features** can be crafted and directly [submitted as a Pull Request](#submitting-a-pull-request).

## Submission Guidelines

### Submitting an Issue

Before you submit an issue, please search the issue tracker. An issue for your problem might already exist and the discussion might inform you of workarounds.

We want to fix all the issues as soon as possible, but before fixing a bug, we need to reproduce and confirm it. In order to reproduce bugs, we require that you provide a minimal reproduction.

You can file new issues by selecting from our [new issue templates](https://github.com/xirothedev/discord.js-template-v14/issues/new/choose) and filling out the template.

### Submitting a Pull Request (PR)

Before you submit your Pull Request (PR) consider the following guidelines:

1. Search [GitHub PRs](https://github.com/xirothedev/discord.js-template-v14/pulls) for an open or closed PR that relates to your submission.
2. Be sure that an issue describes the problem you're fixing, or documents the design for the feature you'd like to add.
3. Please sign our [Contributor License Agreement (CLA)](#signing-the-cla) before sending PRs.
4. [Fork](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo) the repo.
5. In your forked repository, make your changes in a new git branch:
   ```sh
   git checkout -b my-fix-branch main
   ```
6. Create your patch.
7. Follow our [Coding Rules](#coding-rules).
8. Make sure to test your changes.
9. Commit your changes using a descriptive commit message that follows our [commit message conventions](#commit-message-format).
   ```sh
   git commit --all
   ```
10. Push your branch to GitHub:
    ```sh
    git push origin my-fix-branch
    ```
11. In GitHub, send a pull request to `main` branch.

#### Reviewing a Pull Request

The maintainers reserve the right not to accept pull requests from community members who haven't been good citizens of the community. Such behavior includes not following the [Code of Conduct](./CODE_OF_CONDUCT.md).

##### Addressing review feedback
If we ask for changes via code reviews then:
1. Make the required updates to the code.
2. Create a fixup commit and push to your GitHub repository:
   ```sh
   git commit --all --fixup HEAD
   git push
   ```

##### Updating the commit message
A reviewer might suggest changes to a commit message. To update the commit message of the last commit on your branch:
1. Check out your branch:
   ```sh
   git checkout my-fix-branch
   ```
2. Amend the last commit and modify the commit message:
   ```sh
   git commit --amend
   ```
3. Push to your GitHub repository:
   ```sh
   git push --force-with-lease
   ```

#### After your pull request is merged
After your pull request is merged, you can safely delete your branch and pull the changes from the main repository:
- Delete the remote branch on GitHub either through the GitHub web UI or your local shell:
  ```sh
  git push origin --delete my-fix-branch
  ```
- Check out the main branch:
  ```sh
  git checkout main -f
  ```
- Delete the local branch:
  ```sh
  git branch -D my-fix-branch
  ```
- Update your main with the latest upstream version:
  ```sh
  git pull --ff upstream main
  ```

## Coding Rules

To ensure consistency throughout the source code, keep these rules in mind as you are working:
- All features or bug fixes **must be tested**.
- All public API methods **must be documented**.

## Commit Message Format

We have very precise rules over how our Git commit messages must be formatted. This format leads to **easier to read commit history**.

Each commit message consists of a **header**, a **body**, and a **footer**.

```
<header>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The `header` is mandatory and must conform to the format:
```
<type>(<scope>): <short summary>
```
- **type**: build|ci|docs|feat|fix|perf|refactor|test
- **scope**: api|commands|config|entities|events|guards|i18n|services|utils|cli|#{issue_id}|(empty)
- **summary**: imperative, present tense, no period at the end

The `body` is mandatory for all commits except for those of type "docs". When present, it must be at least 20 characters long and explain the motivation for the change.

The `footer` is optional. It can contain information about breaking changes, deprecations, or references to issues/PRs.

### Revert commits
If the commit reverts a previous commit, it should begin with `revert: `, followed by the header of the reverted commit.

## Signing the CLA

Please sign our Contributor License Agreement (CLA) before sending pull requests. For any code changes to be accepted, the CLA must be signed. It's a quick process!

- For individuals, we have a simple click-through form.
- For corporations, we'll need you to print, sign, and send the form.

If you have more than one GitHub account, or multiple email addresses associated with a single GitHub account, you must sign the CLA using the primary email address of the GitHub account used to author Git commits and send pull requests. 