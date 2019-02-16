---
title: Leonardo numbers and Math I wish I knew
date: '2019-02-15'
spoiler: "Part I: Understanding the math behind Leonardo heaps"
---

A couple of weeks ago I ended up on [this page](http://www.keithschwarz.com/smoothsort/) about smoothsort, _thanks [hackernews](https://news.ycombinator.com) you faithful time sync._ Smoothsort is widely considered to be the greatest of the greats when it comes to both execution time and memory. It manages $O(n\ lg\ n)$ optimized for $O(n)$ best case and $O(n)$ memory. 

The short story is that it uses an _in-place_ heap sort to achieve this but instead of a boring old binary heap it uses a mighty __Leonardo heap__.

I will not go in depth about Leonardo heaps or smoothsort as I want to follow up with a post about implementing all of this in Rust as my _hello world_, instead I will talk about the math behind this wonderfully quirky data structure.

### The lesser known Leonardo numbers

Everybody knows about Fibonacci, but the Leonardo numbers _have one up on them_... Sorry couldn't help myself.

$\displaystyle
L_0 = 1 \newline
L_1 = 1 \newline
L_i = L_{i-2} + L_{i-1} + 1
$

Which means that the first few Leonardo numbers are:

$\displaystyle
\{ 1, 1, 3, 5, 9, 15, 25, 41, 67, 109... \}
$

A Leonardo heap consists of one or more [binary trees](https://en.wikipedia.org/wiki/Binary_tree) such that the number of nodes in each tree is a Leonardo number. Now in order for Leonardo heaps to work we must prove that:

1. __Any number $n$ can be written as a sum of distinct Leonardo numbers__. Thus we can take any set of $n$ numbers and arrange them into $k$ binary trees each having ${s_i, 0 \le i \lt k}$ nodes, such that $s_i$ is a Leonardo number.
2. __For any $n$, the number of binary trees needed to form the heap ($k$) is at most $lg\ n$__. Knowing how many binary trees our Leonardo heap contains will help when calculating the asymptotic complexity of the push and pop operations.

I really wanted to prove these two conjectures myself so I stopped reading Keith's explanation and picked up a pencil. I have to say it was harder than it should have been.

### The proof

> <span style="font-size: 16px; line-height: 16px;"> <b>Caveat</b>: I'm pretty rusty when it comes to math so pretty please let me know if I get stuff wrong. There's a "Did I get something wrong?" link at the end that points to the GitHub page where you can open an issue or submit a pull-request for this very article.


$\displaystyle
\forall n \in ℕ, \exist x_k \textrm{ such that }
\sum_{\mathclap{0\le i\le k}} L_{x_i} = n \textrm{ and } x_i < x_{i+1}
$

That's the gist of what we want to prove. In English, we need to prove that for any natural number $n$ there exists a sequence of $k$ numbers denoted $x_k$ such that the sum of the $x_i$-th Leonardo numbers ($L_{x_i}$) for $0\lt i\lt k$ is $n$, also we restrict the sequence to be of distinct monotonically increasing numbers by adding the condition $x_i < x_{i+1}$.

I stared at these equations for a while. I knew there was some sort of induction proof out there. The Leonardo sequence formula hinted at that especially hard with the plus one in $L_i = L_{i-1}+L_{i-2} +1 $. But I couldn't figure it out. It felt like you transition from $n$ to $n+1$ by collapsing two consecutive Leonardo numbers into the next one, but there was one piece of the puzzle missing.

Finally I started to do what every computer scientist knows best, actually build the sets of numbers manually and look for patterns. I did that on my notebook first but then I thought to myself, _you know javascript!_

With a little help from React I built this nifty widget that computes the desired sequence $x_k$ for consecutive $n$. The first column is $n$, the next are the members of the set. You can use the toggle at the top to switch between the actual Leonardo numbers or the Leonardo sequence indices.

<div><leonardo-vizualizer></leonardo-vizualizer></div>

Source on [github](https://github.com/bowd/bowd.io/blob/master/src/components/helpers/leonardo/numbers.js).

You might have noticed that for the $n=1$ I actually use $L_1$ instead of $L_0$ this is intentional and actually part of the nifty solution. You can already start to see some pretty clear patterns and recursion emerge. If you look closely at the numbers you'll see that between any two consecutive $n$ only one of two things happens:

1. $x_1$ = $x_0 + 1$, aka the first to indices are consecutive and they collapse into the next Leonardo number, because if we have two consecutive indices there $L_{x_0} + L_{x_1} + 1 = L_{x_1+1}$

2. We add $L_0$ or $L_1$ at the front of the sequence, if both were already there that would fall into (1).

The first situation isn't intuitively true because, when trying to transition from $n$ to $n+1$, collapsing two consecutive Leonardo numbers might give you another number that's already in the sequence. But that's actually the missing piece. If you look at all the numbers in the box you'll notice that we only ever get consecutive Leonardo numbers in the first two positions of the sequence, check it out. Thus we can prove the conjecture by further restricting its conditions:

$\displaystyle
\forall n \in ℕ, \exist x_k \textrm{ such that }\newline
\textrm{(1) } \sum_{\mathclap{0\le i\le k}} L_{x_i} = n \newline
\textrm{(2) } x_0 < x_1 \newline
\textrm{(3) } x_i + 1 < x_{i+1}, \textrm{for } i > 0 \newline
\textrm{(4) } x_0 = 0 \iff x_1 = 1
$

Let's break it down. The first condition stays the same as before. The 2nd and 3rd ensure not only that the sequence is monotonically increasing but that two consecutive indices will _only_ occur at the beginning of the sequence. The 4th is a little helper condition that enforces $0$ to be part of the sequence only if $1$ already is. It helps us have a single valid transition when neither $0, L_0 = 1$ or $1, L_1 = 1$ are part of the sequence for $n$ and we're transitioning to $n+1$.

For the induction part we say that for $n=0$, the empty sequence fulfils all conditions. Now we need to prove that for any $n$ with a sequence $x_k$, fulfilling the conditions, there's a sequence $y_l$ fulfilling the same conditions for $n+1$. This becomes trivial after the observations I made above, when looking at the changes in structure between consecutive values of $n$. We have these cases:

1. $x_1$ = $x_0$ + 1, the first two elements of $x$ are consecutive

If that's the case we can defined a sequence $y$ with $k-1$ elements. $y_0 = x_1 + 1$ and $y_i = x_i+1, i > 0$. It follows that:

$\displaystyle
\sum_{\mathclap{0\le i\le k-1}} L_{y_i} = L_{x_1 + 1} +  \sum_{\mathclap{2\le i\le k}}  L_{x_i}= L_{x_1} +L_{x_1-1} + 1 + \sum_{\mathclap{2\le i\le k}} L_{x_i} = \sum_{\mathclap{0\le i\le k}} L_{x_i}  + 1 = n + 1
$

2. $x_0$ = 1 and case (1) does not apply, which means that we can define $y$ with $k+1$ elements such that $y_0 = 0$ and $y_i = x_{i-1}, i > 0$, it follows that:

$\displaystyle
\sum_{\mathclap{0\le i\le k-1}} L_{y_i} = L_{0} +  \sum_{\mathclap{0\le i\le k}} = 1 + \sum_{\mathclap{0\le i\le k}}  L_{x_i}= n + 1
$

3. $x_0$ ≠ $1$, from that follows that $x_0$ ≠ $0$ otherwise the 4th condition would imply $x_1 = 1$ and case (1) would apply. So let there be a sequence $y$ with $k+1$ elements such that $y_0 = 1$ and $y_i = x_{i-1}, i > 0$, it follows that:

$\displaystyle
\sum_{\mathclap{0\le i\le k-1}} L_{y_i} = L_{1} +  \sum_{\mathclap{0\le i\le k}} = 1 + \sum_{\mathclap{0\le i\le k}}  L_{x_i}= n + 1
$

Which wraps up our proof nicely. All that's left now is to figure out if for the series $x_k, k <= lg\ n$, but I'll leave this as an exercise to the reader[^1].

[^1]:
    <span style="font-size: 12px"> Hint: write Leonardo numbers as a function of Fibonacci numbers. </span>

Tune in next time when I take all this further and talk about the Leonardo heap and how that's used in implementing the elusive _smoothsort_.

