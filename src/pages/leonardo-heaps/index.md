---
title: Leonardo heaps and how they work
date: '2019-02-16'
spoiler: "Part II: Understanding the heap operations"
---

In the [previous post](/leonardo-numbers) I talked about Leonardo heaps and the Leonardo numbers that they are based on. I proved that any number can be written as a sum of distinct Leonardo numbers, which means that any set of numbers can be transformed into one or more binary trees, each having $x_i$ nodes where $x_i$ is a Leonardo number. 

For reasons that will become apparent later let's make a convention and consider that the set of binary trees is sorted in descending order of the size of each tree. Let's take a look at some example Leonardo heaps with 6 and 13 elements:

<div><leonardo-heap-example id="example-1"></leonardo-heap-example></div>

<div><leonardo-heap-example id="example-2"></leonardo-heap-example></div>

But in order for this set of binary trees to actually be a heap we need to define how to _insert_ a node and how to _pop_ the current maximum value. And in order for these operations to happen in $O(lg\ n)$ we need to add some properties to the binary trees, namely:

1. All the binary trees in the set obey the max-heap property, _they are themselves heaps_ of the subset of elements they contain.
2. The roots of the binary trees are in ascending order.

### Push

Based on the induction proof in [previous post](/leonardo-numbers) we know that when adding a new element to our list of trees we have three possible scenarios:

1. A new tree is formed from the last two trees. This corresponds to case (1) of the proof.

<div><leonardo-heap-push-example id="example-1"></leonardo-heap-push-example></div>

2. A new single-node tree is added to the list. This corresponds to case (2) and (3) of the proof.

<div><leonardo-heap-push-example id="example-3"></leonardo-heap-push-example></div>

In the case above, after pushing, we have both $L_0$ and $L_1$ sized trees.
