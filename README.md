# Push Iteration Protocol

[![NPM][npm-image]][npm-url]
[![Build Status][build-status-img]][build-status-link]
[![Code Quality][quality-img]][quality-link]
[![Coverage][coverage-img]][coverage-link]
[![GitHub Project][github-image]][github-url]
[![API Documentation][api-docs-image]][api documentation]

Push iteration protocol is a faster alternative to traditional JavaScript [iteration protocol].

It extends [Iterator] interface with special method `[PushIterator__symbol](accept?)`, where `PushIterator__symbol`
is a special symbol. This method pushes iterated elements to `accept` callback, until there is no more elements,
or `accept` function returns `true` (to suspend iteration) or `false` (to stop it).

The method returns a push iterator instance to continue iteration with. If `accept` returned `false` then further
iteration won't be possible with returned iterator.

When called without `accept` parameter it just returns an iterator.

Another method it extends [Iterator] with is `isOver()`, that checks whether iteration is over.

[iteration protocol]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
[iterator]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol
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
[api documentation]: https://proc7ts.github.io/push-iterator/

## Instant Iteration

It is quite common to just iterate over [Iterable] instantly rather constructing its [Iterator]. The library supports
this. For that, a `[PushIterator__symbol]` method may be defined for [Iterable] in addition to `[Symbol.iterator]` one.
When the library function encounters such method, it calls it to iterate over elements instead of constructing a new
iterator.

## Iteration Mode Hints

The `[PushIterator__symbol](accept?, mode?)` method of `PushIterable` interface accepts optional _iteration mode_ hint
as second parameter. The latter used to optimize iteration algorithm. Such hints provided by iterable consumption
methods.

For example, an [itsEach] function sets this hint to `PushIterationMode.All` to inform the iterable implementation that
all of its elements will be consumed. This allows to select the fastest iteration strategy without any intermediate
checks.

Another example is [itsEvery] function. It sets this hint to `PushIterationMode.Only` to inform the iterable
implementation that only some of its elements will be consumed, and then iteration will be aborted. This allows to
select iteration strategy that does not support suspend and resume.

Another mode is `PushIterationMode.Next`. It is typically set by `Iterator.next()` compatibility method. It informs that
only the next element will be consumed, after which the iteration will be suspended.

The default mode is `PushIterationMode.Some`. With this mode it is possible to suspended, resumed, or abort iteration.

## Rationale

**Performance!**

Traditional [iteration protocol] implies a call to `next()` method and creation of `IteratorResult` object on each
iteration step. The push iteration protocol avoids that.

See [benchmarking results] for performance comparison.

JavaScript engines optimize native iteration heavily in some situations, especially for arrays. Still, in non-trivial
cases push iteration protocol demonstrates better performance, especially when it deals with push iterators rather
with raw ones.

[benchmarking results]: https://github.com/proc7ts/push-iterator/tree/master/benchmarks

## Design Goals

1. **Performance**.

   Push iterators are faster. Still, a lot of the code base relies on raw iterators and arrays. The library contains
   performance optimizations to deal with it.

2. **Compatibility**.

   - Push iterator implements [Iterator] interface.
   - Each function in this library handles JavaScript [Iterator]/[Iterable] objects in addition to push iterator/push
     iterable ones.

3. **Tree shaking** support.

   The library API represented by functions. When tree-shaken, the unused ones get removed from bundles.

[iterable]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol

## API

See the full [API documentation].

### Push Iterable Construction

Each of the following functions returns a push iterable instance:

- [`overArray(array)`][overarray] - Creates a push iterable over elements of array-like structure.
- [`overElementsOf(...iterables)`][overelementsof] - Creates a push iterable over elements of other iterables.
- [`overEntries(object)`][overentries] - Creates a push iterable over the property key/value entries of the given
  object.
- [`overIndexed(indexed)`][overindexed] - Creates a push iterable over items of [indexed list].
- [`overIterable(iterable)`][overiterable] - Creates a push iterable over elements of the given raw iterable.
- [`overIterator(() => Iterator)`][overiterator] - Creates a push iterable over elements of iterator created by the
  given function.
- [`overKeys(object)`][overkeys] - Creates a push iterable over keys of the given object.
- [`overMany(...values)`][overmany] - Creates a push iterable over many values.
- [`overNone()`][overnone] - Returns a push iterable iterator without elements.
- [`overOne(value)`][overone] - Creates a push iterable over one value.
- [`reverseArray(array)`][reversearray] - Creates a push iterable over elements of array-like structure in reverse
  order.

[overarray]: https://proc7ts.github.io/push-iterator/modules/_proc7ts_push_iterator.html#overArray
[overelementsof]: https://proc7ts.github.io/push-iterator/modules/_proc7ts_push_iterator.html#overElementsOf
[overentries]: https://proc7ts.github.io/push-iterator/modules/_proc7ts_push_iterator.html#overEntries
[overindexed]: https://proc7ts.github.io/push-iterator/modules/_proc7ts_push_iterator.html#overIndexed
[overiterable]: https://proc7ts.github.io/push-iterator/modules/_proc7ts_push_iterator.html#overIterable
[overiterator]: https://proc7ts.github.io/push-iterator/modules/_proc7ts_push_iterator.html#overIterator
[overkeys]: https://proc7ts.github.io/push-iterator/modules/_proc7ts_push_iterator.html#overKeys
[overmany]: https://proc7ts.github.io/push-iterator/modules/_proc7ts_push_iterator.html#overMany
[overnone]: https://proc7ts.github.io/push-iterator/modules/_proc7ts_push_iterator.html#overNone
[overone]: https://proc7ts.github.io/push-iterator/modules/_proc7ts_push_iterator.html#overOne
[reversearray]: https://proc7ts.github.io/push-iterator/modules/_proc7ts_push_iterator.html#reverseArray

### Iteration

[`iterateIt(iterable, accept): PushIterator`][iterateit] function iterates over the leading elements of the given
iterable and returns its trailing iterator.

[iterateit]: https://proc7ts.github.io/push-iterator/modules/_proc7ts_push_iterator.html#iterateIt

### Iterable Consumption

Each of the following functions accepts either [Iterable] or push iterable:

- [`itsEach(iterable, action)`][itseach] - Performs the given `action` for each element of the given `iterable`.
- [`itsElements(iterable[, convert])`][itselements] - Creates a new, shallow-copied array instance containing elements
  of the source iterable optionally converted by the given converter function. This is an `Array.from()` function
  analog optimized for push iterables.
- [`itsEmpty(iterable): boolean`][itsempty] - Checks whether the given `iterable` is empty.
- [`itsEvery(iterable, test): boolean`][itsevery] - Tests whether all elements of the given `iterable` pass the test
  implemented by the provided function.
- [`itsFind(iterable, search): R | undefined`][itsfind] - Searches for the value in `iterable`.
- [`itsFirst(iterable): T | undefined`][itsfirst] - Extracts the first element of the given `iterable`, if any.
- [`itsIterator(iterable)`][itsiterator] - Starts iteration over the given `iterable`. Always returns a push iterator.
- [`itsMatch(iterable, test): T | undefined`][itsmatch] - Extracts the first element matching the given condition from
  `iterable`.
- [`itsReduction(iterable, reducer, initialValue): T`][itsreduction] - Applies a function against an accumulator and
  each element of the given `iterable` to reduce elements to a single value.
- [`itsSome(iterable, test): boolean`][itssome] - Tests whether at least one element of the given `iterable` passes the
  test implemented by the provided function.

[itseach]: https://proc7ts.github.io/push-iterator/modules/_proc7ts_push_iterator.html#itsEach
[itselements]: https://proc7ts.github.io/push-iterator/modules/_proc7ts_push_iterator.html#itsElements
[itsempty]: https://proc7ts.github.io/push-iterator/modules/_proc7ts_push_iterator.html#itsEmpty
[itsevery]: https://proc7ts.github.io/push-iterator/modules/_proc7ts_push_iterator.html#itsEvery
[itsfind]: https://proc7ts.github.io/push-iterator/modules/_proc7ts_push_iterator.html#itsFind
[itsfirst]: https://proc7ts.github.io/push-iterator/modules/_proc7ts_push_iterator.html#itsFirst
[itsiterator]: https://proc7ts.github.io/push-iterator/modules/_proc7ts_push_iterator.html#itsIterator
[itsmatch]: https://proc7ts.github.io/push-iterator/modules/_proc7ts_push_iterator.html#itsMatch
[itsreduction]: https://proc7ts.github.io/push-iterator/modules/_proc7ts_push_iterator.html#itsReduction
[itssome]: https://proc7ts.github.io/push-iterator/modules/_proc7ts_push_iterator.html#itsSome

### Iterable Transformation

Each of the following functions accepts either [Iterable] or push iterable, and returns a push iterable:

- [`filterIt(source, test)`][filterit] - Creates a push iterable with all `source` iterable elements that pass the test
  implemented by provided function.
- [`flatMapIt(source, convert?)`][flatmapit] - First maps each element of the `source` iterable using a mapping
  function, then flattens the result into new push iterable.
- [`mapIt(source, convert)`][mapit] - Creates a push iterable with the results of calling a provided function on every
  element of the `source` iterable.
- [`valueIt(source, valueOf)`][valueit] - Creates a push iterable with the values of elements of the `source` iterable.
  A more effective combination of [mapIt]/[filterIt].

[filterit]: https://proc7ts.github.io/push-iterator/modules/_proc7ts_push_iterator.html#filterIt
[flatmapit]: https://proc7ts.github.io/push-iterator/modules/_proc7ts_push_iterator.html#flatMapIt
[mapit]: https://proc7ts.github.io/push-iterator/modules/_proc7ts_push_iterator.html#mapIt
[valueit]: https://proc7ts.github.io/push-iterator/modules/_proc7ts_push_iterator.html#valueIt

### Array Transformation

Each of the following functions accepts an array-like instance, and returns a push iterable:

- [`filterArray(array, test)`][filterarray] - Creates a push iterable with all `array` elements that pass the test
  implemented by provided function.
- [`flatMapArray(array, convert?)`][flatmaparray] - First maps each element of the source `array` using a mapping
  function, then flattens the result into new push iterable.
- [`mapArray(array, convert)`][maparray] - Creates a push iterable with the results of calling a provided function on
  every element of the given `array`.
- [`valueArray(array, valueOf)`][valuearray] - Creates a push iterable with the values of elements of the given `array`.
  A more effective combination of [mapArray]/[filterIt].

[filterarray]: https://proc7ts.github.io/push-iterator/modules/_proc7ts_push_iterator.html#filterArray
[flatmaparray]: https://proc7ts.github.io/push-iterator/modules/_proc7ts_push_iterator.html#flatMapArray
[maparray]: https://proc7ts.github.io/push-iterator/modules/_proc7ts_push_iterator.html#mapArray
[valuearray]: https://proc7ts.github.io/push-iterator/modules/_proc7ts_push_iterator.html#valueArray

### Indexed List Transformation

An [indexed list] of items is an object with two properties:

- `length` contains the length of the list,
- `item(index: number): T | null | undefined` returns the item value under the given index.

Each of the following functions accepts an indexed list of items, and returns a push iterable:

- [`filterIndexed(indexed, test)`][filterindexed] - Creates a push iterable with all items of the given indexed list
  that pass the test implemented by the provided function.
- [`flatMapIndexed(indexed, convert?)`][flatmapindexed] - First maps each item of the source indexed list using
  a mapping function, then flattens the result into new push iterable.
- [`mapIndexed(array, convert)`][mapindexed] - Creates a push iterable with the results of calling a provided function
  on every item of the given indexed list.
- [`valueIndexed(array, convert)`][valueindexed] - Creates a push iterable with the values of items of the given indexed
  list. A more effective combination of [mapIndexed]/[filterIt].

[indexed list]: https://proc7ts.github.io/push-iterator/interfaces/_proc7ts_push-iterator.IndexedItemList.html
[filterindexed]: https://proc7ts.github.io/push-iterator/modules/_proc7ts_push_iterator.html#filterIndexed
[flatmapindexed]: https://proc7ts.github.io/push-iterator/modules/_proc7ts_push_iterator.html#flatMapIndexed
[mapindexed]: https://proc7ts.github.io/push-iterator/modules/_proc7ts_push_iterator.html#mapIndexed
[valueindexed]: https://proc7ts.github.io/push-iterator/modules/_proc7ts_push_iterator.html#valueIndexed

### Utilities

- [`isPushIterable(iterable)`][ispushiterable] - Checks whether the given iterable or iterator conforms to push
  iteration protocol.
- [`iteratorOf(iterable)`][iteratorof] - Creates iterator over elements of the given `iterable`.
- [`makePushIterable(iterate)`][makepushiterable] - Creates a push iterable implementation.
- [`makePushIterator(forNext)`][makepushiterator] - Creates a push iterator implementation.

[ispushiterable]: https://proc7ts.github.io/push-iterator/modules/_proc7ts_push_iterator.html#isPushIterable
[iteratorof]: https://proc7ts.github.io/push-iterator/modules/_proc7ts_push_iterator.html#iteratorOf
[makepushiterable]: https://proc7ts.github.io/push-iterator/modules/_proc7ts_push_iterator.html#makePushIterable
[makepushiterator]: https://proc7ts.github.io/push-iterator/modules/_proc7ts_push_iterator.html#makePushIterator
