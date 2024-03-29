Change Log
==========

This document keeps track of all changes made to the library over time. If
updated your dependencies and the library suddenly stopped working, this change
log might be of help.

## 4.0.1

 - Fixed `package.json` to export the right source file as entry point for this
   library.

## 4.0.0

 - Moved to ESM exports. CommonJS imports are no longer supported. While you
   are moving your code to ESM, you can stil use version 3.1.1 of this library,
   which is almost identical.
 - Updated development dependencies
 - Added automated end-to-end test
 - Added small FAQ to README.md

## v3.1.1

 - Fixed a broken hyperlink in the README

## v3.1.0

 - Removed unsupported `DeepProxy.revocable` from typings
 - Fixed example in README.md
 - Updated development dependencies

## v3.0.0

 - Updated the TypeScript definitions file to be a regular module, so it is
   easier to import and to extend.
 - Converted the project to use yarn workspaces so that the package can easily
   be tested in a dummy package.

## v2.3.0

 - Removed dependency on `lodash`, which makes this library dependency-free

## v2.2.0

 - Add full TypeScript definitions. A big thank you to @serkanyersen for doing the bulk of the work.
 - Added more tests to make sure this library works as intended
 - Fixed the example in the README to actually work

