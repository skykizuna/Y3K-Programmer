import { Character, Question, TappleRound, GlitchRound, QuestRound } from './types';

export const CHARACTERS: Character[] = [
  {
    id: 'sine',
    name: 'SINE',
    description: 'The Wave Rider. Smooth logic, fluid code.',
    color: '#00f3ff',
    avatar: '🌊',
    ability: {
      name: 'TIME DILATION',
      description: 'Adds 5 seconds to the current timer.',
      type: 'TIME'
    }
  },
  {
    id: 'cosine',
    name: 'COSINE',
    description: 'The Phase Shifter. Always ahead of the curve.',
    color: '#ff00ff',
    avatar: '⚡',
    ability: {
      name: 'ERROR ERASE',
      description: 'Removes one incorrect answer option.',
      type: 'ERASE'
    }
  },
  {
    id: 'tangent',
    name: 'TANGENT',
    description: 'The Limit Breaker. Unpredictable but powerful.',
    color: '#7000ff',
    avatar: '🔥',
    ability: {
      name: 'SCORE MULTIPLIER',
      description: '2x multiplier on the next correct answer.',
      type: 'MULTIPLIER'
    }
  }
];

export const BASIC_TIME_TRIAL_QUESTIONS: Question[] = [
  { id: 1, text: 'Which data type is used to store a single character in C++?', options: ['char', 'string', 'int', 'bool'], answer: 'char', difficulty: 1 },
  { id: 2, text: 'What is the modulus operator in C++?', options: ['/', '*', '%', '&'], answer: '%', difficulty: 1 },
  { id: 3, text: 'Which of these is a valid variable name?', options: ['1variable', '_varName', 'var-name', 'float'], answer: '_varName', difficulty: 2 },
  { id: 4, text: 'What is the output of: for(int i=0; i<3; i++) cout << i;', options: ['012', '0123', '123', '333'], answer: '012', difficulty: 2 },
  { id: 5, text: 'How do you declare a constant in C++?', options: ['const int x = 5;', 'int const x = 5;', 'Both are correct', 'define x 5'], answer: 'Both are correct', difficulty: 3 },
  { id: 6, text: 'What is the index of the last element in an array of size N?', options: ['N', 'N+1', 'N-1', '0'], answer: 'N-1', difficulty: 3 },
  { id: 7, text: 'Which function is used to find the length of a string?', options: ['length()', 'size()', 'Both A and B', 'count()'], answer: 'Both A and B', difficulty: 4 },
  { id: 8, text: 'What does "cin >> x;" do?', options: ['Prints x', 'Reads input into x', 'Clears x', 'Exits program'], answer: 'Reads input into x', difficulty: 4 },
  { id: 9, text: 'Which sorting algorithm has the best average case complexity?', options: ['Bubble Sort', 'Selection Sort', 'Quick Sort', 'Insertion Sort'], answer: 'Quick Sort', difficulty: 5 },
  { id: 10, text: 'What is the time complexity of Binary Search?', options: ['O(n)', 'O(n^2)', 'O(log n)', 'O(1)'], answer: 'O(log n)', difficulty: 5 }
];

export const ADVANCED_TIME_TRIAL_QUESTIONS: Question[] = [
  { id: 1, text: 'What is the output of: int x=5; int *p=&x; *p=10; cout << x;', options: ['5', '10', 'Address of x', 'Error'], answer: '10', difficulty: 3 },
  { id: 2, text: 'Which keyword is used to handle exceptions in C++?', options: ['catch', 'throw', 'try', 'All of these'], answer: 'All of these', difficulty: 3 },
  { id: 3, text: 'What does the "virtual" keyword do in a base class function?', options: ['Makes it private', 'Enables polymorphism', 'Prevents inheritance', 'Speeds up execution'], answer: 'Enables polymorphism', difficulty: 4 },
  { id: 4, text: 'Which STL container stores unique elements in sorted order?', options: ['vector', 'list', 'set', 'stack'], answer: 'set', difficulty: 4 },
  { id: 5, text: 'What is the purpose of a "template" in C++?', options: ['To create generic code', 'To define UI', 'To speed up build', 'To manage memory'], answer: 'To create generic code', difficulty: 4 },
  { id: 6, text: 'Which smart pointer is used for exclusive ownership?', options: ['shared_ptr', 'weak_ptr', 'unique_ptr', 'auto_ptr'], answer: 'unique_ptr', difficulty: 5 },
  { id: 7, text: 'What is the result of (5 << 1)?', options: ['5', '10', '2.5', '25'], answer: '10', difficulty: 5 },
  { id: 8, text: 'How do you capture all variables by value in a lambda?', options: ['[&]', '[=]', '[val]', '[]'], answer: '[=]', difficulty: 5 },
  { id: 9, text: 'What is a "dangling pointer"?', options: ['Pointer to null', 'Pointer to deleted memory', 'Uninitialized pointer', 'Pointer to a pointer'], answer: 'Pointer to deleted memory', difficulty: 5 },
  { id: 10, text: 'What is the "Rule of Three" in C++?', options: ['3 types of loops', '3 access specifiers', 'Destructor, Copy Constructor, Copy Assignment', 'Int, Float, Char'], answer: 'Destructor, Copy Constructor, Copy Assignment', difficulty: 5 }
];

export const BASIC_TAPPLE_ROUNDS: TappleRound[] = [
  { id: 1, category: 'Programming Keywords', examples: ['if', 'else', 'while', 'return', 'void'] },
  { id: 2, category: 'Loop Types', examples: ['for', 'while', 'do-while', 'range-based for'] },
  { id: 3, category: 'Data Types', examples: ['int', 'float', 'double', 'char', 'bool', 'string'] },
  { id: 4, category: 'Searching Concepts', examples: ['Linear Search', 'Binary Search', 'Key', 'Index', 'Midpoint'] },
  { id: 5, category: 'Sorting Terms', examples: ['Bubble', 'Selection', 'Insertion', 'Merge', 'Quick', 'Swap'] }
];

export const ADVANCED_TAPPLE_ROUNDS: TappleRound[] = [
  { id: 1, category: 'File Operations', examples: ['open', 'close', 'read', 'write', 'append', 'ifstream', 'ofstream'] },
  { id: 2, category: 'Errors/Bugs', examples: ['Syntax', 'Runtime', 'Logical', 'Segmentation Fault', 'Memory Leak'] },
  { id: 3, category: 'Functions Terminology', examples: ['Parameter', 'Argument', 'Return Type', 'Prototype', 'Definition', 'Call'] },
  { id: 4, category: 'Array Operations', examples: ['Initialization', 'Traversal', 'Insertion', 'Deletion', 'Access'] },
  { id: 5, category: 'Algorithm Vocabulary', examples: ['Complexity', 'Efficiency', 'Pseudocode', 'Flowchart', 'Iteration'] }
];

export const BASIC_GLITCH_ROUNDS: GlitchRound[] = [
  { id: 1, corruptedCode: 'int x = "hello";', error: 'Type Mismatch', cause: 'Assigning string to int', fix: 'string x = "hello";', hint: 'Check the data type of the variable x.', explanation: 'In C++, you cannot assign a string literal to an integer variable.', difficulty: 1 },
  { id: 2, corruptedCode: 'if (x = 5) { ... }', error: 'Logical Error', cause: 'Using assignment instead of equality', fix: 'if (x == 5)', hint: 'Are you comparing values or assigning them?', explanation: 'The single = is for assignment; double == is for comparison.', difficulty: 1 },
  { id: 3, corruptedCode: 'cout << "Hello World"', error: 'Syntax Error', cause: 'Missing semicolon', fix: 'cout << "Hello World";', hint: 'Every statement in C++ must end with a specific character.', explanation: 'Semicolons are required at the end of statements in C++.', difficulty: 2 },
  { id: 4, corruptedCode: 'int arr[5]; arr[5] = 10;', error: 'Runtime Error', cause: 'Array index out of bounds', fix: 'arr[4] = 10;', hint: 'Arrays in C++ start at index 0.', explanation: 'An array of size 5 has indices 0, 1, 2, 3, and 4.', difficulty: 2 },
  { id: 5, corruptedCode: 'while(i < 10) { cout << i; }', error: 'Infinite Loop', cause: 'Variable i is never incremented', fix: 'i++; inside the loop', hint: 'How will the loop condition ever become false?', explanation: 'Without updating the loop variable, the condition remains true forever.', difficulty: 3 },
  { id: 6, corruptedCode: 'int sum(int a, b) { return a + b; }', error: 'Syntax Error', cause: 'Missing type for parameter b', fix: 'int sum(int a, int b)', hint: 'Every parameter in a function needs its own type declaration.', explanation: 'C++ requires explicit types for all function parameters.', difficulty: 3 },
  { id: 7, corruptedCode: 'for(int i=10; i>0; i++)', error: 'Logical Error', cause: 'Incrementing instead of decrementing', fix: 'i--', hint: 'If you start at 10 and want to reach 0, should you add or subtract?', explanation: 'To count down, you must use the decrement operator.', difficulty: 4 },
  { id: 8, corruptedCode: 'void print() { return 5; }', error: 'Type Mismatch', cause: 'Void function returning a value', fix: 'int print()', hint: 'Check the return type of the function.', explanation: 'A void function cannot return a value.', difficulty: 4 },
  { id: 9, corruptedCode: 'Binary search on unsorted array', error: 'Algorithm Bug', cause: 'Binary search requires sorted data', fix: 'Sort array first', hint: 'What is the prerequisite for Binary Search?', explanation: 'Binary search only works on data that is already sorted.', difficulty: 5 },
  { id: 10, corruptedCode: 'Recursive function without base case', error: 'Stack Overflow', cause: 'Infinite recursion', fix: 'Add a base case', hint: 'When should the recursion stop?', explanation: 'Recursive functions must have a base case to prevent infinite calls.', difficulty: 5 }
];

export const ADVANCED_GLITCH_ROUNDS: GlitchRound[] = [
  { 
    id: 1, 
    corruptedCode: 'int sum=0; for(int i=0; i<1000; i++) if(i%3=0 || i%5=0) sum+=i;', 
    error: 'Syntax Error', 
    cause: 'Using assignment (=) instead of equality (==)', 
    fix: 'if(i%3==0 || i%5==0)', 
    hint: 'Check your comparison operators inside the if statement.',
    explanation: 'Project Euler #1: Multiples of 3 and 5. The sum of all multiples of 3 or 5 below 1000 is 233168.',
    difficulty: 3 
  },
  { 
    id: 2, 
    corruptedCode: 'int a=1, b=2, sum=0; while(b < 4000000) { if(b%2==0) sum+=b; a=b; b=a+b; }', 
    error: 'Logical Error', 
    cause: 'Incorrect Fibonacci sequence update (a is overwritten too early)', 
    fix: 'int next=a+b; a=b; b=next;', 
    hint: 'How do you update Fibonacci numbers without losing the previous value?',
    explanation: 'Project Euler #2: Even Fibonacci numbers. By considering the terms in the Fibonacci sequence whose values do not exceed four million, the sum of the even-valued terms is 4613732.',
    difficulty: 3 
  },
  { 
    id: 3, 
    corruptedCode: 'long n=600851475143; for(int i=2; i<n; i++) if(n%i==0) n/=i;', 
    error: 'Efficiency/Logic', 
    cause: 'Loop condition i<n changes as n is divided, and i should be long', 
    fix: 'for(long i=2; i*i<=n; i++)', 
    hint: 'To find the largest prime factor, you only need to check up to the square root of n.',
    explanation: 'Project Euler #3: Largest prime factor. The prime factors of 13195 are 5, 7, 13 and 29. The largest prime factor of 600851475143 is 6857.',
    difficulty: 4 
  },
  { 
    id: 4, 
    corruptedCode: 'int maxP=0; for(int i=100; i<1000; i++) for(int j=100; j<1000; j++) if(isPal(i*j)) maxP=i*j;', 
    error: 'Logical Error', 
    cause: 'Not checking if the new palindrome is actually larger than maxP', 
    fix: 'if(isPal(i*j) && i*j > maxP)', 
    hint: 'You found a palindrome, but is it the LARGEST one?',
    explanation: 'Project Euler #4: Largest palindrome product. The largest palindrome made from the product of two 2-digit numbers is 9009 = 91 × 99. The largest palindrome made from the product of two 3-digit numbers is 906609.',
    difficulty: 4 
  },
  { 
    id: 5, 
    corruptedCode: 'int n=1; while(true) { bool ok=true; for(int i=1; i<=20; i++) if(n%i!=0) ok=false; if(ok) break; n++; }', 
    error: 'Efficiency Error', 
    cause: 'Brute force is too slow; should use LCM', 
    fix: 'Use Least Common Multiple (LCM) algorithm', 
    hint: 'Is there a mathematical way to find the smallest number divisible by 1-20 without checking every number?',
    explanation: 'Project Euler #5: Smallest multiple. 2520 is the smallest number that can be divided by each of the numbers from 1 to 10 without any remainder. The smallest positive number that is evenly divisible by all of the numbers from 1 to 20 is 232792560.',
    difficulty: 4 
  },
  { 
    id: 6, 
    corruptedCode: 'int s1=0, s2=0; for(int i=1; i<=100; i++) { s1+=i*i; s2+=i; } int diff = s1 - s2*s2;', 
    error: 'Logical Error', 
    cause: 'Difference should be (square of sum) - (sum of squares)', 
    fix: 'int diff = s2*s2 - s1;', 
    hint: 'The question asks for the difference between the square of the sum and the sum of the squares.',
    explanation: 'Project Euler #6: Sum square difference. The difference between the sum of the squares of the first ten natural numbers and the square of the sum is 3025 − 385 = 2640. For the first 100 natural numbers, it is 25164150.',
    difficulty: 3 
  },
  { 
    id: 7, 
    corruptedCode: 'int count=0, n=2; while(count < 10001) { if(isPrime(n)) count++; n++; } cout << n;', 
    error: 'Off-by-one Error', 
    cause: 'n is incremented after the 10001st prime is found', 
    fix: 'cout << n-1;', 
    hint: 'Watch out for the final increment of n after the loop condition is met.',
    explanation: 'Project Euler #7: 10001st prime. By listing the first six prime numbers: 2, 3, 5, 7, 11, and 13, we can see that the 6th prime is 13. The 10001st prime number is 104743.',
    difficulty: 4 
  },
  { 
    id: 8, 
    corruptedCode: 'long maxProd=0; for(int i=0; i<str.len()-13; i++) { long p=1; for(int j=0; j<13; j++) p*=str[i+j]; }', 
    error: 'Type/Logic Error', 
    cause: 'str[i+j] is a char, needs to be converted to int (str[i+j]-\'0\')', 
    fix: 'p *= (str[i+j] - \'0\');', 
    hint: 'Characters like \'5\' are not the same as the integer 5 in C++.',
    explanation: 'Project Euler #8: Largest product in a series. The four adjacent digits in the 1000-digit number that have the greatest product are 9 × 9 × 8 × 9 = 5832. The thirteen adjacent digits that have the greatest product is 23514624000.',
    difficulty: 5 
  },
  { 
    id: 9, 
    corruptedCode: 'for(int a=1; a<1000; a++) for(int b=a; b<1000; b++) { int c = 1000-a-b; if(a*a + b*b = c*c) cout << a*b*c; }', 
    error: 'Syntax Error', 
    cause: 'Using assignment (=) instead of equality (==)', 
    fix: 'if(a*a + b*b == c*c)', 
    hint: 'Check your Pythagorean theorem condition.',
    explanation: 'Project Euler #9: Special Pythagorean triplet. A Pythagorean triplet is a set of three natural numbers, a < b < c, for which, a^2 + b^2 = c^2. There exists exactly one Pythagorean triplet for which a + b + c = 1000. That product abc is 31875000.',
    difficulty: 3 
  },
  { 
    id: 10, 
    corruptedCode: 'long sum=0; for(int i=2; i<2000000; i++) if(isPrime(i)) sum+=i;', 
    error: 'Efficiency/Type', 
    cause: 'isPrime check is too slow for 2 million; use a Sieve', 
    fix: 'Use Sieve of Eratosthenes', 
    hint: 'Checking every number for primality up to 2 million will take too long. Is there a faster way to find all primes?',
    explanation: 'Project Euler #10: Summation of primes. The sum of the primes below 10 is 2 + 3 + 5 + 7 = 17. The sum of all the primes below two million is 142913828922.',
    difficulty: 5 
  }
];

export const BASIC_QUEST_ROUNDS: QuestRound[] = [
  { id: 1, scenario: 'Find a student record quickly in 1 million sorted entries.', options: [{label: 'Linear Search', value: 'A'}, {label: 'Binary Search', value: 'B'}, {label: 'Bubble Sort', value: 'C'}], correctValue: 'B', reasoning: 'Binary Search is O(log n), much faster for sorted data.' },
  { id: 2, scenario: 'Need to store a list of 50 student names.', options: [{label: 'int', value: 'A'}, {label: 'string array', value: 'B'}, {label: 'float', value: 'C'}], correctValue: 'B', reasoning: 'Arrays store multiple values of the same type.' },
  { id: 3, scenario: 'Perform a task exactly 10 times.', options: [{label: 'if statement', value: 'A'}, {label: 'for loop', value: 'B'}, {label: 'struct', value: 'C'}], correctValue: 'B', reasoning: 'For loops are ideal for known iteration counts.' },
  { id: 4, scenario: 'Store a student\'s name, ID, and GPA together.', options: [{label: 'Array', value: 'A'}, {label: 'Structure (struct)', value: 'B'}, {label: 'Function', value: 'C'}], correctValue: 'B', reasoning: 'Structs group related data of different types.' },
  { id: 5, scenario: 'Save game progress so it persists after closing.', options: [{label: 'Variables', value: 'A'}, {label: 'Files', value: 'B'}, {label: 'Loops', value: 'C'}], correctValue: 'B', reasoning: 'Files provide permanent storage.' },
  { id: 6, scenario: 'Check if a number is even or odd.', options: [{label: 'Modulus (%)', value: 'A'}, {label: 'Division (/)', value: 'B'}, {label: 'Addition (+)', value: 'C'}], correctValue: 'A', reasoning: 'x % 2 == 0 checks for even numbers.' },
  { id: 7, scenario: 'Reusable block of code to calculate area.', options: [{label: 'Variable', value: 'A'}, {label: 'Function', value: 'B'}, {label: 'Array', value: 'C'}], correctValue: 'B', reasoning: 'Functions promote code reuse.' },
  { id: 8, scenario: 'Search for a name in a small, unsorted list.', options: [{label: 'Linear Search', value: 'A'}, {label: 'Binary Search', value: 'B'}, {label: 'Quick Sort', value: 'C'}], correctValue: 'A', reasoning: 'Linear search is simple and works on unsorted data.' },
  { id: 9, scenario: 'Choose one of five different options in a menu.', options: [{label: 'if-else', value: 'A'}, {label: 'switch statement', value: 'B'}, {label: 'while loop', value: 'C'}], correctValue: 'B', reasoning: 'Switch is cleaner for multiple discrete choices.' },
  { id: 10, scenario: 'Keep asking for input until the user types "exit".', options: [{label: 'Sentinel Loop', value: 'A'}, {label: 'For Loop', value: 'B'}, {label: 'Struct', value: 'C'}], correctValue: 'A', reasoning: 'Sentinel loops run until a specific value is met.' }
];

export const ADVANCED_QUEST_ROUNDS: QuestRound[] = [
  { id: 1, scenario: 'SDG 9: Optimize a high-frequency trading system by passing large data structures without copying them.', options: [{label: 'Pass by Value', value: 'A'}, {label: 'Pass by Pointer/Reference', value: 'B'}, {label: 'Global Variables', value: 'C'}], correctValue: 'B', reasoning: 'Pointers/References avoid expensive deep copies of large objects.' },
  { id: 2, scenario: 'SDG 1: A micro-finance app needs to store unique user IDs mapped to their account balances for O(1) access.', options: [{label: 'std::vector', value: 'A'}, {label: 'std::unordered_map', value: 'B'}, {label: 'std::list', value: 'C'}], correctValue: 'B', reasoning: 'Unordered maps provide average constant time complexity for lookups.' },
  { id: 3, scenario: 'SDG 5: Ensure that sensitive user gender data can only be modified through specific validation functions.', options: [{label: 'Public members', value: 'A'}, {label: 'Encapsulation (Private members)', value: 'B'}, {label: 'Static variables', value: 'C'}], correctValue: 'B', reasoning: 'Encapsulation protects data integrity by restricting direct access.' },
  { id: 4, scenario: 'SDG 8: Implement a system to handle job applications in the exact order they were received.', options: [{label: 'Stack (LIFO)', value: 'A'}, {label: 'Queue (FIFO)', value: 'B'}, {label: 'Priority Queue', value: 'C'}], correctValue: 'B', reasoning: 'Queues process elements in First-In-First-Out order.' },
  { id: 5, scenario: 'SDG 10: Create a sorting function that can handle both integer and floating-point donation amounts without rewriting code.', options: [{label: 'Function Overloading', value: 'A'}, {label: 'Templates', value: 'B'}, {label: 'Void Pointers', value: 'C'}], correctValue: 'B', reasoning: 'Templates allow for generic programming across different data types.' },
  { id: 6, scenario: 'SDG 16: Secure a peace treaty document by flipping specific bits in its digital signature.', options: [{label: 'Arithmetic operators', value: 'A'}, {label: 'Bitwise operators (^, ~, |)', value: 'B'}, {label: 'Logical operators', value: 'C'}], correctValue: 'B', reasoning: 'Bitwise operators allow for direct manipulation of individual bits.' },
  { id: 7, scenario: 'SDG 17: A global partnership portal needs to execute a custom "thank you" logic provided by different NGOs at runtime.', options: [{label: 'Hardcoded strings', value: 'A'}, {label: 'Lambda functions / Callbacks', value: 'B'}, {label: 'Switch statements', value: 'C'}], correctValue: 'B', reasoning: 'Lambdas provide a way to pass executable logic as arguments.' },
  { id: 8, scenario: 'SDG 12: Prevent memory leaks in a waste-tracking system by automatically releasing memory when it\'s no longer needed.', options: [{label: 'Raw pointers', value: 'A'}, {label: 'Smart pointers (unique_ptr)', value: 'B'}, {label: 'Static allocation', value: 'C'}], correctValue: 'B', reasoning: 'Smart pointers manage memory automatically using RAII.' },
  { id: 9, scenario: 'SDG 13: Model different types of renewable energy sources (Solar, Wind) that all share a common "calculateOutput" method.', options: [{label: 'Multiple inheritance', value: 'A'}, {label: 'Polymorphism (Virtual functions)', value: 'B'}, {label: 'Structs', value: 'C'}], correctValue: 'B', reasoning: 'Polymorphism allows a base class pointer to call derived class methods.' },
  { id: 10, scenario: 'SDG 11: Represent a city\'s subway network where stations are nodes and tracks are edges.', options: [{label: '2D Array', value: 'A'}, {label: 'Adjacency List (Vector of Vectors)', value: 'B'}, {label: 'Linked List', value: 'C'}], correctValue: 'B', reasoning: 'Adjacency lists are efficient for representing sparse graphs like transit networks.' }
];
