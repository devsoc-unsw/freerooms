# Git Workflow

## Initial Setup

1. Set up SSH keys for each of your machines
2. `git clone` the repository onto your machine

## Branching Model

We will be using the Gitflow workflow to organise the branches in our repository (see [here](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) for more info).

We have two master branches, that is, `master` and `dev`. 

- `master` will contain only deployment-ready code. Code from `dev` will be merged into `master` every few commits or so, as the code is finalised.
- `dev` will contain a detailed record of the entire project. This branch is what we will be working off.

From the `dev` branch, we can create temporary branches to work on different features.

- `feat/branch-name` - this is a feature branch. Each feature will have its own branch.
- `fix/branch-name` - this is a fix branch. If some code needs to be fixed, create a `fix` branch, write the fix, then merge it back to `dev`

## Workflow

1. `git checkout dev` - move to the `dev` branch
2. `git pull` - synchronise your local branch (the branch on your machine) with the remote branch (the branch on Github)
3. `git checkout -b branch-name` - creates a new branch with the above naming conventions and moves (checks out) to it.
4. Make one **atomic** change to your files. Every commit should have only one purpose, hence you should always ensure that you are making frequent commits.
5. `git add -A` or `git add .` - the former adds all files to the staging area to be commited while the latter adds only files in the current directory and all subdirectories.
    1. Individual files can be added like `git add file1 file2`
    2. If you don't want to add newly created files, use the `-u` flag instead
6. `git commit -m "commit message here"`  - commit your changes to your local branch.
7. `git push` - pushes your changes to your feature's remote branch. This can be done any time you want.

When you are finished with your work:

1. `git rebase -i origin/dev` - rebase your current branch onto the `dev` branch. This is done to incorporate into your branch anything which has been done on `dev` while you have been working. It also allows you to squash all your little commits into one single commit, making it easier to understand.

    This first picture on this [Atlassian](https://www.atlassian.com/git/tutorials/rewriting-history/git-rebase) site does a great job of visualising what happens in a rebase.

    When you run this command, git will open your default text editor and a file will open up which looks like step 6 on [this site](https://medium.com/singlestone/a-git-workflow-using-rebase-1b1210de83e5) (this is good reading if you're still confused on what a rebase is and how to perform it).

    Edit the file so that all the commits are now `squash` (or `fixup` if you don't care about your other commit messages) **except the first one**. Then, save and close the file. Finally, write a new commit message to describe what you did in your branch e.g. "Added feature X" or "Fixed issue with X".

    You might encounter merge conflicts here so fix them up as instructed by `rebase`

2. `git push --force-with-lease` - push your work onto the remote's feature branch

    The push needs to be forced because `rebase` creates a new commit history. The `--force-with-lease` option ensures that you will not overwrite anyone else's code when pushing if multiple people are working on your feature. 

3. Finally, open an pull request from your feature branch into the `dev` branch so your work can be inspected before it is merged into `dev`.
4. You're done! Now wait for your merge request to be approved before merging it into `dev`.

Feel free to use `git alias` to shorten these commands and make things more convenient for you.