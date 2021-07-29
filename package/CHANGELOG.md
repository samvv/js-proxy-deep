Change Log
==========

This document keeps track of all changes made to the library over time. If
updated your dependencies and the library suddenly stopped working, this change
log might be of help.

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

