---
title: Leonardo Heaps and Math I wish I knew
date: '2019-02-15'
spoiler: I should have actually attended my classes in high school.
---

A couple of weeks ago I ended up on [this page](http://www.keithschwarz.com/smoothsort/) about smoothsort, _thanks [hackernews](news.ycombinator.com) you faithful time sync._ Smoothsort is widely considered to be the greatest of the greats when it comes to both execution time and memory. It manages $O(n\ lg\ n)$ optimized for $O(n)$ best case and $O(n)$ memory. 

The short story is that it uses an _in-place_ heap sort to achieve this but instead of a boring old binary heap it uses a mighty Leonardo Heap[^1].
I will not go in depth about the Leonardo Heap as I want to follow up with a post about implementing all of this in Rust as my _hello world_, instead I will talk about the math behind this wonderfully quirky data structure.

[^1]:
    In [his page](http://www.keithschwarz.com/smoothsort/) Keith Schwarz refers to the structure as Leonardo Heaps (plural). I disagree because I like to think of the whole data structure as a heap, composed of a series of binary-trees which have sizes equal to Leonardo Numbers. This make more sense because he discusses poping and pushing on the whole _list of trees_.


### The lesser known Leonardo numbers

Everybody knows about Fibonacci, but the lesser known Leonardo numbers are fun as well:

$\displaystyle
L_0 = 1 \newline
L_1 = 1 \newline
L_i = L_{i-2} + L_{i-1} + 1
$

Which means that the first few Leonardo numbers are:

$\displaystyle
\{ 1, 1, 3, 5, 9, 15, 25, 41, 67, 109... \}
$

Now in order for Leonardo heaps to work we must prove that:

1. Any number $n$ can be written as a sum of distinct Leonardo numbers
2. The set of Leonardo numbers that add up to $n$ has less than $lg\ n$ members

I really wanted to prove these two conjectures are true myself so I stopped reading and picked up a pencil. I have to say it was harder than it should have been, so let's get to it.

> Caveat: I'm pretty rusty when it comes to math so pretty please let me know if I get stuff wrong, there's a link to the github page of this article right at the end.

$\displaystyle
\forall n \in ℕ, \exist x_k \textrm{ such that }
\sum_{\mathclap{0\le i\le k}} L_{x_i} = n \textrm{ and } x_i < x_{i+1}
$

That's the gist of what we want to prove. In English, we need to prove that for any natural number $n$ there exists a sequence of $k$ numbers denoted $x_k$ such that the sum of the $x_i$-th Leonardo numbers ($L_{x_i}$) for $0\lt i\lt k$ is $n$, also we restrict the sequence to be of distinct monotonically increasing numbers by adding the condition $x_i > x_{i+1}$.

I stared at these equations for a while. I knew there was some sort of induction proof out there. The Leonardo sequence formula hinted at that especially hard with the plus one in $L_i = L_{i-1}+L_{i-2} +1 $. But I couldn't figure it out. 

Finally I started to do what every computer scientist knows best, actually build the sets of numbers manually and look for patterns. I did that on my notebook first but then I thought to myself, _you know javascript!_

With a little help from React I built this nifty widget that computes the desired sequence $x_k$ for consecutive $n$. The first column is $n$, the next are the members of the set. You can use the toggle at the top to switch between the actual Leonardo numbers or the Leonardo sequence indices.

<leonardo-vizualizer></leonardo-vizualizer>
Source on [github](https://github.com/bowd/bowd.io/blob/master/src/components/helpers/leonardo.js).

You might have noticed that for the $n=1$ I actually use $L_1$ instead of $L_0$ this is intentional and actually part of the nifty solution. You can already start to see some pretty clear patterns and recursion emerge.

If you look closely at the numbers you'll see that between any two consecutive $n$ only one of two things happen.

1. $x_1$ = $x_0 + 1$, aka the first to indices are consecutive and they collapse into the next Leonardo number, because if we have two consecutive indices there $L_{x_0} + L_{x_1} + 1 = L_{x_1+1}$

2. We add $L_0$ or $L_1$ at the front of the sequence, both can't be there because that's covered by (1).

The first situation isn't intuitively true because, when trying to transition from $n$ to $n+1$,  collapsing two consecutive Leonardo numbers might give you another number that's already in the sequence. But that's actually the missing piece. The way to prove this is by further restricting the properties of the sequence:

$\displaystyle
\forall n \in ℕ, \exist x_k \textrm{ such that }\newline
\textrm{(1) } \sum_{\mathclap{0\le i\le k}} L_{x_i} = n \newline
\textrm{(2) } x_0 < x_1 \newline
\textrm{(3) } x_i + 1 < x_{i+1}, \textrm{for } i > 0 \newline
\textrm{(4) } x_0 = 0 \iff x_1 = 1
$

Let's break it down. (1) stays the same as before, number (2) and (3) ensure not only that the sequence is monotonically increasing but that two consecutive indices will _only_ occur at the beginning of the sequence. (4) is a little helper condition that states that we only use $L_0$ if we've already used $L_1$.

For our induction we say that for $n=0$ all four statements hold true. Now we need to prove for $n+1$. This becomes trivial after the observation I made above because if we take as true that there's a sequence $x_k$ that satisfies all four conditions we have only these cases:

1. $x_1$ = $x_0$ + 1

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

Which wraps up our proof nicely. All that's left now is to figure out if for the series $x_k, k < log_2(n)$, but I'll leave this as an exercise to the reader[^2].

[^2]:
    Hint: write Leonardo numbers as a function of Fibonacci numbers.

Tune in next time when I take all this further and talk about the Leonardo heap and how that's used in implementing the elusive _smoothsort_.

