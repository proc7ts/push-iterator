Push Iteration Protocol
=======================

[![NPM][npm-image]][npm-url]
[![Build Status][build-status-img]][build-status-link]
[![codecov][codecov-image]][codecov-url]
[![GitHub Project][github-image]][github-url]
[![API Documentation][api-docs-image]][api-docs-url]

Push iteration protocol is a faster alternative to traditional JavaScript [iteration protocol].

It extends [Iterator] interface with `forNext(accept: (this: void, element: T) => void | boolean): boolean` method.
The latter pushes iterated elements to `accept` function until there is no more elements, or `accept` function returns
`false` yo stop iteration. The `forNext()` method returns `true` if there are more elements to iterate, or `false`
otherwise. The former is possible only when iteration stopped, i.e. `accept` returned `false`.


Rationale
---------

**Performance!**

Traditional [iteration protocol] implies a call to `next()` method and creation of `IteratorResult` object on each
iteration step. The push iteration protocol avoids that.

See [benchmarking results] for performance comparison.

JavaScript engines optimize native iteration heavily in some situations, especially for arrays. Still, in non-trivial
cases the push iteration protocol demonstrates better performance, especially when it deals with push iterators rather
with raw ones.


Design Goals
------------

1. **Performance**.
   
   Push iterators are faster. Still, a lot of the code base relies on raw iterators and arrays. The library contains
   performance optimizations to deal with it.

2. **Compatibility**.

   - Push iterator implements [Iterator] interface.
   - Each function in this library handles JavaScript [Iterator]/[Iterable] objects in addition to push iterator/push
     iterable ones.

3. **Tree shaking** support.

   The library API represented by functions. When tree-shaken the unused ones removed from bundles.


[iteration protocol]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
[Iterator]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol
[Iterable]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol
[benchmarking results]: https://github.com/proc7ts/push-iterator/tree/master/benchmarks

[npm-image]: https://img.shields.io/npm/v/@proc7ts/push-iterator.svg?logo=npm
[npm-url]: https://www.npmjs.com/package/@proc7ts/push-iterator
[build-status-img]: https://github.com/proc7ts/push-iterator/workflows/Build/badge.svg
[build-status-link]: https://github.com/proc7ts/push-iterator/actions?query=workflow%3ABuild
[codecov-image]: https://codecov.io/gh/proc7ts/push-iterator/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/proc7ts/push-iterator
[github-image]: https://img.shields.io/static/v1?logo=github&label=GitHub&message=project&color=informational
[github-url]: https://github.com/proc7ts/push-iterator
[api-docs-image]: https://img.shields.io/static/v1?logo=typescript&label=API&message=docs&color=informational
[api-docs-url]: https://proc7ts.github.io/push-iterator/
[IoC]: https://en.wikipedia.org/wiki/Inversion_of_control


API
---

See the full [API Documentation].


### Push Iterable Construction

Each of the following functions returns a push iterable instance:

- `overArray(array)` - Creates a push iterable over elements of array-like structure.
- `overElementsOf(...iterables)` - Creates a push iterable over elements of other iterables.
- `overEntries(object)` - Creates a push iterable over the property key/value entries of the given object.
- `overKeys(object)` - Creates a push iterable over keys of the given object.
- `overMany(...values)` - Creates a push iterable over many values.
- `overNone()` - Returns a push iterable iterator without elements.
- `reverseArray(array)` - Creates a push iterable over elements of array-like structure in reverse order.


### Iterable Consumption

Each of the following functions accepts either [Iterable] or push iterable:

- `itsEach(iterable, action)` - Performs the given `action` for each element of the given `iterable`.
- `itsElements(iterable[, convert])` - Creates a new, shallow-copied array instance containing elements of the source
   iterable optionally converted by the given converter function. This is an `Array.from()` function analog optimized
   for push iterables.
- `itsEmpty(iterable): boolean` - Checks whether the given `iterable` is empty.
- `itsEvery(iterable, test): boolean` - Tests whether all elements of the given `iterable` pass the test implemented
   by the provided function.
- `itsFirst(iterable): T | undefined` - Extracts the first element of the given `iterable`, if any.
- `itsReduction(iterable, reducer, initialValue): T` - Applies a function against an accumulator and each element
   of the given `iterable` to reduce elements to a single value.
- `itsSome(iterable, test): boolean` - Tests whether at least one element of the given `iterable` passes the test
   implemented by the provided function.


### Iterable Transformation

Each of the following functions accepts either [Iterable] or push iterable, and returns a push iterable:

- `filterIt(source, test)` - Creates a push iterable with all `source` iterable elements that pass the test
  implemented by provided function.
- `flatMapIt(source, convert?)` - First maps each element of the `source` iterable using a mapping function,
  then flattens the result into new push iterable.
- `mapIt(source, convert)` - Creates a push iterable with the results of calling a provided function on every element
  of the `source` iterable.
  

### Array Transformation

Each of the following functions accepts an array-like instance, and returns a push iterable:  

- `filterArray(aray, test)` - Creates a push iterable with all `array` elements that pass the test implemented
   by provided function.
- `flatMapArray(array, convert?)` - First maps each element of the source `array` using a mapping function,
   then flattens the result into new push iterable.
- `mapArray(array, convert)` - Creates a push iterable with the results of calling a provided function on every element
   of the given `array`.


### Utilities

- `iteratorOf(iterable)` - Constructs iterator over elements of the given `iterable`.
- `itsIterator(iterable)` - Starts iteration over the given `iterable`. Always returns a push iterator.
- `makePushIterator(forNext)` - Creates push iterator implementation.
