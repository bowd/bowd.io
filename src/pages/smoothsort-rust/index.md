---
title: Smoothsort in Rust
date: '2019-03-05'
spoiler: "Part III: Implementing Leonardo Heaps and smoothsort in Rust"
---

In the [previous post](/leonardo-heaps) I explained how [leonardo numbers](/leonardo-numbers) 
and their proprieties are used in order to build Leonardo Heaps, this quirky data structure. 
Now we'll look at actually implementing them in Rust.

> tl;dr https://github.com/bowd/smoothsort -
> It's super slow, mostly because I'm new at Rust and doing things wrong, but implementing 
something that should run fast is a good way to understand the intricacies of a system programming language.

## Theory

The first decision we have to make when implementing Leonardo heaps is how do we structure the data such that:

- We can traverse it in a way that makes sense for our algorithm
- It helps in the pursuit of the mythical $O(n)$ best case

If you're familiar with representing balanced binary trees as linear structures you 
might be familiar with `nodes[i]` being the parent of `nodes[2*i]` and `nodes[2*i+1]`. 
For Leonardo heaps we need to take a similar, yet slightly more complicated approach:

![heap-example](http://www.keithschwarz.com/smoothsort/images/implicit-leonardo-heap.png)
<div style="text-align: center; font-size: 14px; position: relative; top: -40px;">
  <a href="http://www.keithschwarz.com/smoothsort/">
    source
  </a>
</div>

In the illustration above we have a Leonardo Heap composed of three trees of sizes $L_4 = 9$, $L_2 = 3$ and $L_1 = 1$. 
Underneath the trees you can see the vectorial representation.
The last item on the right is the top of the heap and the root of tree of smallest Leonardo order.

This means that in order to traverse through the trees we need to start at the 
last element in the array and we need to know the sizes of the trees. And we subtract the size of the current tree from the offset in order to move back

Starting at the last element in the array `93` we move back $L_1$ (1) places and land on `90` which is the root of the previous tree.
From there we move back $L_2$ (3) places and land on `58` which is the root of the first tree in the heap.

Once we're at the root of a tree moving down inside it is similar. Because of the way we compose trees in the Leonardo heap (discussed at length in the previous post) we know that any trees of order $L_i, i > 1$ will be formed by a left sub tree of size $L_{i-1}$, a right subtree of size $L_{i-2}$ and a root, which lines up with $L_i = L_{i-2} + L_{i-1} + 1$.

Thus, if we're starting at `58`, which is a tree of order $L_4$, we move left $L_2 + 1 = 4$ places to get to the root of the left child `41` or we move left 1 place to get to `53` the root of the right subtree. This works recursively because any subtree in a Leonardo tree is also a Leonardo tree.

Overall in order to navigate the heap we need to:

- Know the Leonardo orders of all the trees and the offset of the last element in the heap to move sideways between the roots
- Know the Leonardo order of the current subtree and the offset in the array to move down to it's children

In order to achieve this there are two methods, one that's simpler to understand but requires $O(lg\ n)$ additional memory to store the configuration of the trees, and one that manages $O(1)$ additional memory by doing some fancy work with bit-vectors. To keep things simple I have implemented the $O(lg\ n)$ variant for now but I might try the $O(1)$ one at some point just to compare memory impact vs performance in practice.

## Practice

I'm not gonna go over a lot of Rust specific and I'm very unsure about most of the things that I've done here. I'm fairly certain that I'm copying memory where I shouldn't be but I wanted to first get something that's working and then iterate to understand the language internals better.

The [implementation](https://github.com/bowd/smoothsort) has tree main components:

- [`heap::shape::Shape`](https://github.com/bowd/smoothsort/blob/master/src/heap/shape.rs) a structure that stores the current shape of the heap, i.e. a vector of Leonardo orders of the sizes of trees in the heap
- [`heap::LeonardoHeap`](https://github.com/bowd/smoothsort/blob/master/src/heap/mod.rs) a structure that holds the `Vec<T>`, the comparator function and a `Shape`
- [`numbers::get`](https://github.com/bowd/smoothsort/blob/master/src/numbers.rs) a function that returns the n-th Leonardo number, currently by looking into a hard-coded list. Heh.

### Shape

The `Shape` struct helps us traverse the trees in the heap by storing the Leonardo order of each tree and it's offset in the linear representation. Let's look at the example again:

![heap-example](http://www.keithschwarz.com/smoothsort/images/implicit-leonardo-heap.png)
<div style="text-align: center; font-size: 14px; position: relative; top: -40px;">
  <a href="http://www.keithschwarz.com/smoothsort/">
    source
  </a>
</div>

Let's consider a tree to be represented as a tuple `(leonardo_order, offset)`. In the example above we have 3 trees, `(4, 0), (2, 9), (1, 12)`. 

Building up the shape follows nicely from the proof all the way back in the [first article](/leonardo-numbers):

```rust
pub fn push(&mut self) {
    if self.can_collapse() {
      let (_, _) = self.trees.pop().unwrap();
      let (index, offset) = self.trees.pop().unwrap();
      self.trees.push((index + 1, offset))
    } else {
      self.trees.push(
          match self.trees.last() {
              Some((1, offset)) => (0, offset+1),
              Some((index, offset)) => (1, offset+(numbers::get(*index) as usize)),
              None => (1, 0),
          }
      )
    }
}

fn can_collapse(&self) -> bool {
    if self.trees.len() < 2 {
        return false
    }

    let (ln_last_index, _) = self.trees[self.trees.len()-1];
    let (ln_prev_last_index, _) = self.trees[self.trees.len()-2];
    ln_prev_last_index == ln_last_index + 1
}
```

When adding a new element to this virtual shape, we either:

1. Collapse the last two trees if their indices are consecutive
2. If there's already a tree of order 1, add one of order 0
3. Add a tree of order 1 (either at the start with offset 0, or at the end and determine the offset by adding the size of the previous tree to it's offset).

We also need to maintain the shape when removing elements from the heap

```rust
pub fn pop(&mut self) {
  match self.trees.pop() {
    Some((0, _)) => { }
    Some((1, _)) => { }
    Some((index, offset)) => {
      self.trees.push((index-1, offset));
      self.trees.push((index-2, offset + (numbers::get(index-1) as usize)));
    },
      None => {}
  }
```

This is much simpler. We always remove the last tree and either discard it if it's a three of size 1 (order 0 or 1), or we break it down into two trees of the previous two orders. It's easy to visualize in the example heap above by mentally executing two pop operations.
You first you pop `93` discard its tree leaving you with `(4, 0), (2, 9)` and then you pop `90` and split the last tree into two yielding `(4, 0), (1, 9), (0, 10)`.

Now given a starting Tree which is defined as the tuple above we need to navigate to it's children.
I find it easier to think about this tuple as being a pointer to a specific tree. So just by know this pointer and knowing the Leonardo numbers you can derive the pointer of the children easily:

- Left child for $(i, j)$ is $(i-1, j)$, eg: `(4, 0)`'s left child is `(3, 0)`
- Right child for $(i, j)$ is $(i-2, j + L_{i-1})$, eg: `(4, 0)`'s right child is `(2, 5)`

```rust
pub fn left_child(&self, tree: Tree) -> Option<Tree> {
  match tree {
    (0, _) => None,
    (1, _) => None,
    (ln_index, offset) => Some(
      (
         ln_index - 1,
         offset,
      )
    ),
  }
}

pub fn right_child(&self, tree: Tree) -> Option<Tree> {
  match tree {
    (0, _) => None,
    (1, _) => None,
    (ln_index, offset) => Some(
      (
         ln_index-2,
         offset + numbers::get(ln_index - 1) as usize,
      ),
    ),
  }
}
```

The last think you need to know is, how to determine the position of the root of a tree:

```rust
pub fn root_offset(&self, tree: tree) -> usize {
  let (index, offset) = tree;
  offset + (numbers::get(index) as usize) - 1
}
```

With all of these helpers in place it's easy to implement the actual heap. Even though it's a bit painstaking when comparing nodes as tree references. You need to transform the `Tree` into a offset in the array and then into a value. Here's the method that balances a tree:
```rust
fn balance(&mut self, tree: Tree) {
    let left_child = self.shape.left_child(tree);
    let right_child = self.shape.right_child(tree);
    if let Some(_) = left_child {
        let left_child = left_child.unwrap();
        let right_child = right_child.unwrap();
        let left_child_offset = self.shape.root_offset(left_child);
        let right_child_offset = self.shape.root_offset(right_child);
        let tree_offset = self.shape.root_offset(tree);
        let cmp = self.cmp;

        if cmp(&self.items[left_child_offset], &self.items[tree_offset]) &&
            cmp(&self.items[left_child_offset], &self.items[right_child_offset]) {
            self.items.swap(left_child_offset, tree_offset);
            self.balance(left_child);
        } else if cmp(&self.items[right_child_offset], &self.items[tree_offset]) {
            self.items.swap(right_child_offset, tree_offset);
            self.balance(right_child);
        }
    }
}
```

This is a simple case of balancing a binary tree, if the root is smaller then one of the children, swap it and go down to that subtree. But as you can see it's a bit ugly. There are things that I'm sure a seasoned rustacean would do much much better, and I hope I'll get there.

### Memory and performance

Benchmarks at the time of writing are awful:

```
test benchmark_smooth_sort_10000            ... bench:   4,786,450 ns/iter (+/- 1,702,816)
test benchmark_smooth_sort_best_case_10000  ... bench:   1,432,432 ns/iter (+/- 381,747)
test benchmark_std_sort_10000               ... bench:     859,976 ns/iter (+/- 270,358)
test benchmark_std_sort_best_case_10000     ... bench:       5,290 ns/iter (+/- 2,839)
```

All the benchmarks sort 10k items, the first two using my smooth sort implementation and the last two using the standard `sort` implementation in Rust's `Vec`. The `best_case` benchmarks operate on an already sorted `Vec`.

Ouch.

Of course I wasn't expecting anything crazy but I think, if implemented right, `smoothsort` should be comparable in performance with the standard implementation (on medium sized arrays). But the 5-6x difference is clear indicator of issues in the implementation that I can't wait to figure out.

I didn't mention this so far but it's important to note that this algorithm is only interesting from a theoretical standpoint. In practice, it behaves worse than alternatives because of the way it jumps through memory to compare values, meaning that it doesn't take advantage of the RAM cache locality, whereas most alternatives do. I am unaware of a cache-friendly variant of smoothsort.

On a more positive note we can at least see a clear performance improvement when the input sequence is sorted, even though that's still much worse than the standard sort. 

What I found really interesting is how the default sort achieves such a low run time when the input sequence is sorted, it feels a bit _too_ fast, being 2 orders of magnitude faster than the average case. I wonder if there's some internal magic there.

## Conclusions

This has been an interesting choice of my first journey into Rust especially because this naive implementation is something I can now iterate on. Memory management in Rust is smart but it's not easy and my bet is that I'm treating memory sub-optimally causing some unwanted copies and the performance degradation. I'll let you know what I find out.
