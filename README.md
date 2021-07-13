Push Iteration Protocol
=======================

[![NPM][npm-image]][npm-url]
[![Build Status][build-status-img]][build-status-link]
[![Code Quality][quality-img]][quality-link]
[![Coverage][coverage-img]][coverage-link]
[![GitHub Project][github-image]][github-url]
[![API Documentation][api-docs-image]][API documentation]

Push iteration protocol is a faster alternative to traditional JavaScript [iteration protocol].

It extends [Iterator] interface with special method `[PushIterator__symbol](accept?)`, where `PushIterator__symbol`
is a special symbol. This method pushes iterated elements to `accept` callback, until there is no more elements,
or `accept` function returns `true` (to suspend iteration) or `false` (to stop it).

The method returns a push iterator instance to continue iteration with. If `accept` returned `false` then further
iteration won't be possible with returned iterator.

When called without `accept` parameter it just returns an iterator.

Another method it extends [Iterator] with is `isOver()`, that checks whether iteration is over.

[iteration protocol]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
[Iterator]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol

[npm-image]: https://img.shields.io/npm/v/@proc7ts/push-iterator.svg?logo=npm
[npm-url]: https://www.npmjs.com/package/@proc7ts/push-iterator
[build-status-img]: https://github.com/proc7ts/push-iterator/workflows/Build/badge.svg
[build-status-link]: https://github.com/proc7ts/push-iterator/actions?query=workflow:Build
[quality-img]: https://app.codacy.com/project/badge/Grade/afd92eac51954f43bf49ac82c0e74eb8
[quality-link]: https://www.codacy.com/gh/proc7ts/push-iterator/dashboard?utm_source=github.com&utm_medium=referral&utm_content=proc7ts/push-iterator&utm_campaign=Badge_Grade
[coverage-img]: https://app.codacy.com/project/badge/Coverage/afd92eac51954f43bf49ac82c0e74eb8
[coverage-link]: https://www.codacy.com/gh/proc7ts/push-iterator/dashboard?utm_source=github.com&utm_medium=referral&utm_content=proc7ts/push-iterator&utm_campaign=Badge_Coverage
[github-image]: https://img.shields.io/static/v1?logo=github&label=GitHub&message=project&color=informational
[github-url]: https://github.com/proc7ts/push-iterator
[api-docs-image]: https://img.shields.io/static/v1?logo=typescript&label=API&message=docs&color=informational
[API documentation]: https://proc7ts.github.io/push-iterator/


Instant Iteration
-----------------

It is quite common to just iterate over [Iterable] instantly rather constructing its [Iterator]. The library supports
this. For that, a `[PushIterator__symbol]` method may be defined for [Iterable] in addition to `[Symbol.iterator]` one.
When the library function encounters such method, it calls it to iterate over elements instead of constructing a new
iterator.


Rationale
---------

**Performance!**

Traditional [iteration protocol] implies a call to `next()` method and creation of `IteratorResult` object on each
iteration step. The push iteration protocol avoids that.

See [benchmarking results] for performance comparison.

JavaScript engines optimize native iteration heavily in some situations, especially for arrays. Still, in non-trivial
cases push iteration protocol demonstrates better performance, especially when it deals with push iterators rather
with raw ones.

[benchmarking results]: https://github.com/proc7ts/push-iterator/tree/master/benchmarks


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

[Iterable]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol


API
---

See the full [API documentation].


### Push Iterable Construction

Each of the following functions returns a push iterable instance:

- [`overArray(array)`][overArray] - Creates a push iterable over elements of array-like structure.
- [`overElementsOf(...iterables)`][overElementsOf] - Creates a push iterable over elements of other iterables.
- [`overEntries(object)`][overEntries] - Creates a push iterable over the property key/value entries of the given
  object.
- [`overIndexed(indexed)`][overIndexed] - Creates a push iterable over items of [indexed list]. 
- [`overIterable(iterable)`][overIterable] - Creates a push iterable over elements of the given raw iterable.  
- [`overIterator(() => Iterator)`][overIterator] - Creates a push iterable over elements of iterator created by the
  given function. 
- [`overKeys(object)`][overKeys] - Creates a push iterable over keys of the given object.
- [`overMany(...values)`][overMany] - Creates a push iterable over many values.
- [`overNone()`][overNone] - Returns a push iterable iterator without elements.
- [`overOne(value)`][overOne] - Creates a push iterable over one value.
- [`reverseArray(array)`][reverseArray] - Creates a push iterable over elements of array-like structure in reverse
  order.

[overArray]: https://proc7ts.github.io/push-iterator/modules/Module__proc7ts_push_iterator.html#overArray
[overElementsOf]: https://proc7ts.github.io/push-iterator/modules/Module__proc7ts_push_iterator.html#overElementsOf
[overEntries]: https://proc7ts.github.io/push-iterator/modules/Module__proc7ts_push_iterator.html#overEntries
[overIndexed]: https://proc7ts.github.io/push-iterator/modules/Module__proc7ts_push_iterator.html#overIndexed
[overIterable]: https://proc7ts.github.io/push-iterator/modules/Module__proc7ts_push_iterator.html#overIterable
[overIterator]: https://proc7ts.github.io/push-iterator/modules/Module__proc7ts_push_iterator.html#overIterator
[overKeys]: https://proc7ts.github.io/push-iterator/modules/Module__proc7ts_push_iterator.html#overKeys
[overMany]: https://proc7ts.github.io/push-iterator/modules/Module__proc7ts_push_iterator.html#overMany
[overNone]: https://proc7ts.github.io/push-iterator/modules/Module__proc7ts_push_iterator.html#overNone
[overOne]: https://proc7ts.github.io/push-iterator/modules/Module__proc7ts_push_iterator.html#overOne
[reverseArray]: https://proc7ts.github.io/push-iterator/modules/Module__proc7ts_push_iterator.html#reverseArray


### Iterable Consumption

Each of the following functions accepts either [Iterable] or push iterable:

- [`itsEach(iterable, action)`][itsEach] - Performs the given `action` for each element of the given `iterable`.
- [`itsElements(iterable[, convert])`][itsElements] - Creates a new, shallow-copied array instance containing elements
   of the source iterable optionally converted by the given converter function. This is an `Array.from()` function
   analog optimized for push iterables.
- [`itsEmpty(iterable): boolean`][itsEmpty] - Checks whether the given `iterable` is empty.
- [`itsEvery(iterable, test): boolean`][itsEvery] - Tests whether all elements of the given `iterable` pass the test
  implemented by the provided function.
- [`itsFind(iterable, search): R | undefined`][itsFind] - Searches for the value in `iterable`.
- [`itsFirst(iterable): T | undefined`][itsFirst] - Extracts the first element of the given `iterable`, if any.
- [`itsHead(iterable, accept): PushIterator`][itsHead] - Iterates over the head elements of the given iterable and
  returns its tail iterator.
- [`itsIterated(iterable, accept): boolean`][itsIterated] - Iterates over elements of the given `iterable`.
- [`itsIterator(iterable)`][itsIterator] - Starts iteration over the given `iterable`. Always returns a push iterator.
- [`itsMatch(iterable, test): T | undefined`][itsMatch] - Extracts the first element matching the given condition from
  `iterable`.
- [`itsReduction(iterable, reducer, initialValue): T`][itsReduction] - Applies a function against an accumulator and
   each element of the given `iterable` to reduce elements to a single value.
- [`itsSome(iterable, test): boolean`][itsSome] - Tests whether at least one element of the given `iterable` passes the
  test implemented by the provided function.

[itsEach]: https://proc7ts.github.io/push-iterator/modules/Module__proc7ts_push_iterator.html#itsEach
[itsElements]: https://proc7ts.github.io/push-iterator/modules/Module__proc7ts_push_iterator.html#itsElements
[itsEmpty]: https://proc7ts.github.io/push-iterator/modules/Module__proc7ts_push_iterator.html#itsEmpty
[itsEvery]: https://proc7ts.github.io/push-iterator/modules/Module__proc7ts_push_iterator.html#itsEvery
[itsFind]: https://proc7ts.github.io/push-iterator/modules/Module__proc7ts_push_iterator.html#itsFind
[itsFirst]: https://proc7ts.github.io/push-iterator/modules/Module__proc7ts_push_iterator.html#itsFirst
[itsHead]: https://proc7ts.github.io/push-iterator/modules/Module__proc7ts_push_iterator.html#itsHead
[itsIterated]: https://proc7ts.github.io/push-iterator/modules/Module__proc7ts_push_iterator.html#itsIterated
[itsIterator]: https://proc7ts.github.io/push-iterator/modules/Module__proc7ts_push_iterator.html#itsIterator
[itsMatch]: https://proc7ts.github.io/push-iterator/modules/Module__proc7ts_push_iterator.html#itsMatch
[itsReduction]: https://proc7ts.github.io/push-iterator/modules/Module__proc7ts_push_iterator.html#itsReduction
[itsSome]: https://proc7ts.github.io/push-iterator/modules/Module__proc7ts_push_iterator.html#itsSome


### Iterable Transformation

Each of the following functions accepts either [Iterable] or push iterable, and returns a push iterable:

- [`filterIt(source, test)`][filterIt] - Creates a push iterable with all `source` iterable elements that pass the test
  implemented by provided function.
- [`flatMapIt(source, convert?)`][flatMapIt] - First maps each element of the `source` iterable using a mapping
  function, then flattens the result into new push iterable.
- [`mapIt(source, convert)`][mapIt] - Creates a push iterable with the results of calling a provided function on every
  element of the `source` iterable.
- [`valueIt(source, valueOf)`][valueIt] - Creates a push iterable with the values of elements of the `source` iterable.
  A more effective combination of [mapIt]/[filterIt]. 

[filterIt]: https://proc7ts.github.io/push-iterator/modules/Module__proc7ts_push_iterator.html#filterIt
[flatMapIt]: https://proc7ts.github.io/push-iterator/modules/Module__proc7ts_push_iterator.html#flatMapIt
[mapIt]: https://proc7ts.github.io/push-iterator/modules/Module__proc7ts_push_iterator.html#mapIt
[valueIt]: https://proc7ts.github.io/push-iterator/modules/Module__proc7ts_push_iterator.html#valueIt
  

### Array Transformation

Each of the following functions accepts an array-like instance, and returns a push iterable:  

- [`filterArray(array, test)`][filterArray] - Creates a push iterable with all `array` elements that pass the test
  implemented by provided function.
- [`flatMapArray(array, convert?)`][flatMapArray] - First maps each element of the source `array` using a mapping
  function, then flattens the result into new push iterable.
- [`mapArray(array, convert)`][mapArray] - Creates a push iterable with the results of calling a provided function on
  every element of the given `array`.
- [`valueArray(array, valueOf)`][valueArray] - Creates a push iterable with the values of elements of the given `array`.
  A more effective combination of [mapArray]/[filterIt].

[filterArray]: https://proc7ts.github.io/push-iterator/modules/Module__proc7ts_push_iterator.html#filterArray
[flatMapArray]: https://proc7ts.github.io/push-iterator/modules/Module__proc7ts_push_iterator.html#flatMapArray
[mapArray]: https://proc7ts.github.io/push-iterator/modules/Module__proc7ts_push_iterator.html#mapArray
[valueArray]: https://proc7ts.github.io/push-iterator/modules/Module__proc7ts_push_iterator.html#valueArray


### Indexed List Transformation

An [indexed list] of items is an object with two properties:

- `length` contains the length of the list,
- `item(index: number): T | null | undefined` returns the item value under the given index.   

Each of the following functions accepts an indexed list of items, and returns a push iterable:

- [`filterIndexed(indexed, test)`][filterIndexed] - Creates a push iterable with all items of the given indexed list
  that pass the test implemented by the provided function.
- [`flatMapIndexed(indexed, convert?)`][flatMapIndexed] - First maps each item of the source indexed list using
  a mapping function, then flattens the result into new push iterable.
- [`mapIndexed(array, convert)`][mapIndexed] - Creates a push iterable with the results of calling a provided function
  on every item of the given indexed list.
- [`valueIndexed(array, convert)`][valueIndexed] - Creates a push iterable with the values of items of the given indexed
  list. A more effective combination of [mapIndexed]/[filterIt].

[indexed list]: https://proc7ts.github.io/push-iterator/interfaces/@proc7ts_push-iterator.IndexedItemList.html
[filterIndexed]: https://proc7ts.github.io/push-iterator/modules/Module__proc7ts_push_iterator.html#filterIndexed
[flatMapIndexed]: https://proc7ts.github.io/push-iterator/modules/Module__proc7ts_push_iterator.html#flatMapIndexed
[mapIndexed]: https://proc7ts.github.io/push-iterator/modules/Module__proc7ts_push_iterator.html#mapIndexed
[valueIndexed]: https://proc7ts.github.io/push-iterator/modules/Module__proc7ts_push_iterator.html#valueIndexed


### Utilities

- [`isPushIterable(iterable)`][isPushIterable] - Checks whether the given iterable or iterator conforms to push
  iteration protocol.
- [`iteratorOf(iterable)`][iteratorOf] - Constructs iterator over elements of the given `iterable`.
- [`makePushIterable(iterate)`][makePushIterable] - Creates a push iterable implementation.
- [`makePushIterator(forNext)`][makePushIterator] - Creates a push iterator implementation.
- [`pushHead(iterable, accept): PushIterator`][pushHead] - Iterates over the head elements of the given push iterable
  and returns its tail iterator.
- [`pushIterated(iterable, accept): boolean`][pushIterated] - Iterates over elements of the given push iterable.

[isPushIterable]: https://proc7ts.github.io/push-iterator/modules/Module__proc7ts_push_iterator.html#isPushIterable
[iteratorOf]: https://proc7ts.github.io/push-iterator/modules/Module__proc7ts_push_iterator.html#iteratorOf
[makePushIterable]: https://proc7ts.github.io/push-iterator/modules/Module__proc7ts_push_iterator.html#makePushIterable
[makePushIterator]: https://proc7ts.github.io/push-iterator/modules/Module__proc7ts_push_iterator.html#makePushIterator
[pushHead]: https://proc7ts.github.io/push-iterator/modules/Module__proc7ts_push_iterator.html#pushHead
[pushIterated]: https://proc7ts.github.io/push-iterator/modules/Module__proc7ts_push_iterator.html#pushIterated
