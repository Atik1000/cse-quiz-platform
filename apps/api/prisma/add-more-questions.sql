-- Add more sample questions for testing
-- Run this with: psql -U foysal -d cse_quiz -f prisma/add-more-questions.sql

-- Get category IDs first (these are from seed data)
-- Programming, Data Structures, Algorithms

-- Programming Questions
INSERT INTO questions (id, question, options, "correctAnswer", explanation, difficulty, type, "categoryId", "createdAt", "updatedAt")
SELECT 
    gen_random_uuid(),
    'What is the output of: print(type([]))?',
    ARRAY['<class ''list''>', '<class ''array''>', '<class ''dict''>', '<class ''tuple''>'],
    '<class ''list''>',
    'In Python, [] creates an empty list. The type() function returns <class ''list''> for list objects.',
    'EASY',
    'MULTIPLE_CHOICE',
    id,
    NOW(),
    NOW()
FROM categories WHERE name = 'Programming';

INSERT INTO questions (id, question, options, "correctAnswer", explanation, difficulty, type, "categoryId", "createdAt", "updatedAt")
SELECT 
    gen_random_uuid(),
    'Which keyword is used to define a function in Python?',
    ARRAY['function', 'def', 'func', 'define'],
    'def',
    'The ''def'' keyword is used to define functions in Python.',
    'EASY',
    'MULTIPLE_CHOICE',
    id,
    NOW(),
    NOW()
FROM categories WHERE name = 'Programming';

INSERT INTO questions (id, question, options, "correctAnswer", explanation, difficulty, type, "categoryId", "createdAt", "updatedAt")
SELECT 
    gen_random_uuid(),
    'What is the purpose of the ''break'' statement in a loop?',
    ARRAY['Skip current iteration', 'Exit the loop', 'Pause the loop', 'Continue to next loop'],
    'Exit the loop',
    'The ''break'' statement is used to exit (terminate) a loop prematurely.',
    'MEDIUM',
    'MULTIPLE_CHOICE',
    id,
    NOW(),
    NOW()
FROM categories WHERE name = 'Programming';

INSERT INTO questions (id, question, options, "correctAnswer", explanation, difficulty, type, "categoryId", "createdAt", "updatedAt")
SELECT 
    gen_random_uuid(),
    'What does OOP stand for?',
    ARRAY['Object Oriented Programming', 'Order Of Precedence', 'Optimized Output Processing', 'Object Ordered Protocol'],
    'Object Oriented Programming',
    'OOP stands for Object Oriented Programming, a programming paradigm based on objects and classes.',
    'EASY',
    'MULTIPLE_CHOICE',
    id,
    NOW(),
    NOW()
FROM categories WHERE name = 'Programming';

-- Data Structures Questions
INSERT INTO questions (id, question, options, "correctAnswer", explanation, difficulty, type, "categoryId", "createdAt", "updatedAt")
SELECT 
    gen_random_uuid(),
    'What is the time complexity of accessing an element in an array by index?',
    ARRAY['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
    'O(1)',
    'Array elements can be accessed in constant time O(1) using their index because arrays store elements in contiguous memory locations.',
    'MEDIUM',
    'MULTIPLE_CHOICE',
    id,
    NOW(),
    NOW()
FROM categories WHERE name = 'Data Structures';

INSERT INTO questions (id, question, options, "correctAnswer", explanation, difficulty, type, "categoryId", "createdAt", "updatedAt")
SELECT 
    gen_random_uuid(),
    'Which data structure uses LIFO (Last In First Out) principle?',
    ARRAY['Queue', 'Stack', 'Array', 'Tree'],
    'Stack',
    'A Stack follows the LIFO principle where the last element added is the first one to be removed.',
    'EASY',
    'MULTIPLE_CHOICE',
    id,
    NOW(),
    NOW()
FROM categories WHERE name = 'Data Structures';

INSERT INTO questions (id, question, options, "correctAnswer", explanation, difficulty, type, "categoryId", "createdAt", "updatedAt")
SELECT 
    gen_random_uuid(),
    'In a binary tree, what is the maximum number of children a node can have?',
    ARRAY['1', '2', '3', 'Unlimited'],
    '2',
    'By definition, a binary tree node can have at most 2 children (left and right child).',
    'EASY',
    'MULTIPLE_CHOICE',
    id,
    NOW(),
    NOW()
FROM categories WHERE name = 'Data Structures';

INSERT INTO questions (id, question, options, "correctAnswer", explanation, difficulty, type, "categoryId", "createdAt", "updatedAt")
SELECT 
    gen_random_uuid(),
    'What is the worst-case time complexity of searching in a hash table?',
    ARRAY['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
    'O(n)',
    'In the worst case, when all elements hash to the same bucket, searching becomes O(n). Average case is O(1).',
    'HARD',
    'MULTIPLE_CHOICE',
    id,
    NOW(),
    NOW()
FROM categories WHERE name = 'Data Structures';

-- Algorithms Questions
INSERT INTO questions (id, question, options, "correctAnswer", explanation, difficulty, type, "categoryId", "createdAt", "updatedAt")
SELECT 
    gen_random_uuid(),
    'What is the time complexity of Binary Search?',
    ARRAY['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
    'O(log n)',
    'Binary Search divides the search space in half each iteration, resulting in O(log n) time complexity.',
    'MEDIUM',
    'MULTIPLE_CHOICE',
    id,
    NOW(),
    NOW()
FROM categories WHERE name = 'Algorithms';

INSERT INTO questions (id, question, options, "correctAnswer", explanation, difficulty, type, "categoryId", "createdAt", "updatedAt")
SELECT 
    gen_random_uuid(),
    'Which sorting algorithm has the best worst-case time complexity?',
    ARRAY['Bubble Sort', 'Quick Sort', 'Merge Sort', 'Selection Sort'],
    'Merge Sort',
    'Merge Sort has a guaranteed O(n log n) worst-case time complexity, unlike Quick Sort which can be O(n²).',
    'HARD',
    'MULTIPLE_CHOICE',
    id,
    NOW(),
    NOW()
FROM categories WHERE name = 'Algorithms';

INSERT INTO questions (id, question, options, "correctAnswer", explanation, difficulty, type, "categoryId", "createdAt", "updatedAt")
SELECT 
    gen_random_uuid(),
    'What type of algorithm is Depth First Search (DFS)?',
    ARRAY['Greedy', 'Dynamic Programming', 'Graph Traversal', 'Divide and Conquer'],
    'Graph Traversal',
    'DFS is a graph traversal algorithm that explores as far as possible along each branch before backtracking.',
    'MEDIUM',
    'MULTIPLE_CHOICE',
    id,
    NOW(),
    NOW()
FROM categories WHERE name = 'Algorithms';

INSERT INTO questions (id, question, options, "correctAnswer", explanation, difficulty, type, "categoryId", "createdAt", "updatedAt")
SELECT 
    gen_random_uuid(),
    'What is the principle behind Dynamic Programming?',
    ARRAY['Divide and Conquer', 'Memoization and Optimal Substructure', 'Greedy Choice', 'Backtracking'],
    'Memoization and Optimal Substructure',
    'Dynamic Programming solves complex problems by breaking them down into simpler subproblems and storing results (memoization) to avoid redundant calculations.',
    'HARD',
    'MULTIPLE_CHOICE',
    id,
    NOW(),
    NOW()
FROM categories WHERE name = 'Algorithms';

-- Show count
SELECT 'Questions added successfully!' as status;
SELECT c.name, COUNT(q.id) as question_count 
FROM categories c 
LEFT JOIN questions q ON c.id = q."categoryId" 
GROUP BY c.name 
ORDER BY c.name;
