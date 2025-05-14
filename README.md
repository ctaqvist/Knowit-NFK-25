# Knowit-NFK-25
Welcome to Knowit NFK 2025 where we create an interplanetary rover!

[![C++ CI](https://github.com/ctaqvist/Knowit-NFK-25/actions/workflows/cpp-ci.yml/badge.svg)](https://github.com/ctaqvist/Knowit-NFK-25/actions/workflows/cpp-ci.yml)
[![Python CI](https://github.com/ctaqvist/Knowit-NFK-25/actions/workflows/python-ci.yml/badge.svg)](https://github.com/ctaqvist/Knowit-NFK-25/actions/workflows/python-ci.yml)
[![ServerJS CI](https://github.com/ctaqvist/Knowit-NFK-25/actions/workflows/serverjs-ci.yml/badge.svg)](https://github.com/ctaqvist/Knowit-NFK-25/actions/workflows/serverjs-ci.yml)
[![Android CI](https://github.com/ctaqvist/Knowit-NFK-25/actions/workflows/android-ci.yml/badge.svg)](https://github.com/ctaqvist/Knowit-NFK-25/actions/workflows/android-ci.yml)

___  
## Workflow standard

Here are the decided general GitHub standards for the entire project.

### Tickets

- Each ticket should have a short and clear name. **Max 4 words**.  
    - If more information is needed, it should be put in the description.

- Each ticket should have one branch where only that ticket's scope is worked on, named according to the following template:  
	- `id/name-of-ticket`
- Id must be the same as the ticket id and name must be the same as the ticket name.

### Commits

- Commit name should be short and clear.  
- If more information is needed, put it in the commit description.

### Branch naming convention
 - A branch should be linked to a ticket. Then the name must be: `id/name-of-ticket`
	- It should always be lower caps
 - In the special case when a branch is not linked to a ticket it follow the convetion: `tag/name-of-assignment`
	- Where tag should be something fitting like `bug`, `extra`, `update`, `fix` 

### Pull request
- The PR name must match the branch naming standard: `id/name-of-ticket`

- Before creating a pull request, check these points:  
	- Is my code tested enough so that all cases are checked?  
	- Does my code affect any other part of the project? If so, make sure that code changes don't break any other part of the project.  
	- Am I following the guidelines that we set for the code?  
	- Is my commit message descriptive enough for what the changes involve?

### Merging

- One teammate must review code before merging.  
- Squash all commits again (if new commits have been done).  
A pull request should not be merged if any of these are not fulfilled:  
	- No one from my team has reviewed my pull request.  
	- If definition of done is not met.
- The PR merging commit message must match the branch naming standard: `id/name-of-ticket`
___

## Code
For each part of the project there is folder created (Embedded, Backend, Application and UX). Depending on what part of the project you will be working on you will only be pushing code to one of these, or maybe you will be able to work in multiple of them.

# Remember, all of these points below are suggestions, not necessarily set in stone and you are allowed to modify it. This is how most projects looks like however. 
### Working with the code
Make sure that for each code change (/ ticket) you make that you create a separate branch for it related to the changes like: **156** (ticket number)

To get a consistent looking code work together with the "sub"team you will work with and if needed, create a code formatter / linter.
##### For example, from a real project we have coding guidelines like this:
Tabs and spaces:
	Editors should be set to insert 4 spaces instead of tabs. Most decent editors will support this option. This ensures that files opened on other editors will always look the same since tab sizes vary from editor to editor.

Line breaks:
	All the files should use UNIX formatting for line endings (LF).

Braces should be put on separate lines:
	Braces should always be placed on separate lines and should be used for all if else, while, and for statements:
		if ( a > 10 )
		{
		    // statement_1
		}
		else
		{
		    // statement_2
		}

Use spaces within parentheses:
	Spaces allow for easily readable grouping in statements containing operators (while, for, if, etc.):
	
		if ( a > 10 )
		{
		    foo( a );
		}

	NOT:

		if (a > 10)
		{
		    foo(a);
		}

Use extra parentheses with conditions:
	They help to read the code and ensures developer's intentions:
		
		if ( ( a > 10 ) && ( a < 20 ) )
	or:
		if ( ( a > 10 ) &&
	       	 ( a < 20 ) )
	but NOT:
		if ( a > 10 && a < 20 )

### Pushing code
All code shall be pushed to the branch created for the issue / feature that you are working with to avoid pushing code directly to master(not good...). 

**All code** that shall be pushed to master branch needs to have been reviewed with a pull request. Pull requests are necessary, they improve code quality, collaboration, and version control by enabling code reviews, preventing bugs, ensuring stability, and maintaining a clear change history.

Before creating a pull request check these points out:
* Is my code tested enough so that all cases are checked?
* Does my code affect any other part of the project? If so, make sure that code changes doesn't break any other part of the project.
* Am I following the guidelines that we set for the code?
* Is my commit message descriptive enough for what the changes involve?
  
A pull request should not be merged if any of these are not fulfilled:
* No one from my team has reviewed my pull request.
* If definition of done is not met.
