---
title: Leonardo heaps and how they work
date: '2019-02-16'
spoiler: "Part II: Understanding the heap operations"
---

In the [previous post](/leonardo-numbers) I talked about Leonardo heaps and the Leonardo numbers that they are based on. I proved that any number can be written as a sum of distinct Leonardo numbers, which means that any set of numbers can be transformed into one or more binary trees, each having $x_i$ nodes where $x_i$ is a Leonardo number. 

For reasons that will become apparent later let's make a convention and consider that the set of binary trees is sorted in descending order of size. Let's take a look at some example Leonardo heaps with 6 and 13 elements:

<div><leonardo-heap-show id="show-1"></leonardo-heap></div>

<div><leonardo-heap-show id="show-2"></leonardo-heap></div>

But in order for this set of binary trees to actually be a heap we need to define how to _push_ a node and how to _pop_ the current maximum value. And in order for these operations to happen in $O(lg\ n)$ we need to add some properties to the binary trees, namely:

1. All the binary trees in the set obey the max-heap property, _they are themselves heaps_ of the subset of elements they contain.
2. The roots of the binary trees are in ascending order.

### Push

Based on the induction proof in [previous post](/leonardo-numbers) we know that when adding a new element to our list of trees we have three possible scenarios:

1. A new tree is formed from the new item as the root and the last two trees as it's children. This corresponds to case (1) of the proof.

<div><leonardo-heap-push id="push-1"></leonardo-heap-push></div>

2. A new single-node tree is added to the list. This corresponds to case (2) and (3) of the proof.

<div><leonardo-heap-push id="push-3"></leonardo-heap-push></div>

Of course this isn't the whole story because none of these trees obey the max-heap property, so after this _structural_ addition we need to also rebalance the data structure.

In both cases above we have a new tree in the list, this can either be the result of merging two previous trees (1) or inserting a new single node one (2). Remember in order for the tree to be balanced we need to ensure that:

1. All tree roots are in ascending order

This is the first thing that we need to solve after inserting a new node. We will call this operation root swapping. It is achieved by swapping our new root with the root of the previous tree whenever the previous tree's root is bigger than both the our new root and it's immediate children (if it has any).
This is a bit hard to wrap your head around so let's look at an example:

<div><leonardo-heap-balance id="balance-1"></leonardo-heap-balance></div>

The example above does not do any automatic balancing. When you push the next node with the value $11$ it will first be added as a new single node tree at the right. Pressing the balance button will first take it to the left-most tree as the new root while changing places with the others, and then the tree where it ends up will get rebalanced, pushing it down.

2. The binary trees are balanced

As you saw in the example above and is obvious from the proofs, you will always need to rebalance only one binary tree, the one that ends up containing the new node after the root swapping is done.


### Pop

Very similar to the _push_ operation, popping has two possible situations:

1. The last tree is a single node tree, in which case it is simply removed and it's value is returned.
2. The last tree has children in which case the two children become two new trees at end of the list, and their root is returned.

The first case obviously does not require any balancing while for the second case we need to do the same root swap and rebalance that we did when _popping_ but in this case it has to be done for both of the new trees, first the left and then the right one.

<div><leonardo-heap-balance id="balance-2"></leonardo-heap-balance></div>

The example above, similar to the one in push, doesn't auto-balance. You can see it in action by first _popping_ and then balancing.

### Complexity

Now because of the proof involving the closed form for the Fibonacci sequence we know that the upper limit on the number of binary trees in a Leonardo heap of size $n$ is $lg\ n$ the size of each binary tree in the heap is $lg\ n$ as well which means that the pop worst case runs in $O(2 * lg\ n) = O(lg\ n)$, one $lg\ n$ to ensure the three roots are sorted, and one to rebalance the binary tree. Also it's really important to note that the best case for this is $O(1)$ when the element inserted is the new maximum.

The pop handles pretty much the same, except it needs to do four $lg\ n$ passes in worst case, for the two subtrees that get added, resulting in the same $O(lg\ n)$. But, and this is crucial for _smoothsort_, the better the structure is balance the bigger chance of $O(1)$ when popping. This is especially true if you consider an in-place heap sort where if the initial array is fully sorted all pops will be $O(1)$ resulting in $O(n)$ best case for the whole operation, but I'll focus on that in the next post where we look at the _smoothsort_ implementation.


