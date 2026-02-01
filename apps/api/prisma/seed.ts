import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

    // Create Admin User
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@csequiz.com' },
        update: {},
        create: {
            email: 'admin@csequiz.com',
            password: adminPassword,
            name: 'Admin User',
            role: 'ADMIN',
        },
    });
    console.log('✅ Created admin user:', admin.email);

    // Create Test User
    const userPassword = await bcrypt.hash('user123', 10);
    const user = await prisma.user.upsert({
        where: { email: 'user@csequiz.com' },
        update: {},
        create: {
            email: 'user@csequiz.com',
            password: userPassword,
            name: 'Test User',
            role: 'USER',
        },
    });
    console.log('✅ Created test user:', user.email);

    // Create Main Categories
    const cseCategory = await prisma.category.upsert({
        where: { id: '00000000-0000-0000-0000-000000000001' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000001',
            name: 'Computer Science Engineering',
        },
    });
    console.log('✅ Created category:', cseCategory.name);

    // Create Subcategories
    const subcategories = [
        { id: '00000000-0000-0000-0000-000000000011', name: 'Programming', parentId: cseCategory.id },
        { id: '00000000-0000-0000-0000-000000000012', name: 'Data Structures', parentId: cseCategory.id },
        { id: '00000000-0000-0000-0000-000000000013', name: 'Algorithms', parentId: cseCategory.id },
        { id: '00000000-0000-0000-0000-000000000014', name: 'Software Development', parentId: cseCategory.id },
        { id: '00000000-0000-0000-0000-000000000015', name: 'Databases', parentId: cseCategory.id },
        { id: '00000000-0000-0000-0000-000000000016', name: 'Operating Systems', parentId: cseCategory.id },
        { id: '00000000-0000-0000-0000-000000000017', name: 'Computer Networks', parentId: cseCategory.id },
    ];

    for (const subcat of subcategories) {
        await prisma.category.upsert({
            where: { id: subcat.id },
            update: {},
            create: subcat,
        });
        console.log('✅ Created subcategory:', subcat.name);
    }

    // Create Sample Questions
    const programmingCategory = await prisma.category.findFirst({
        where: { name: 'Programming' },
    });

    if (programmingCategory) {
        const sampleQuestions = [
            {
                question: 'What is the output of print(type([]))?',
                options: ["<class 'list'>", "<class 'dict'>", "<class 'tuple'>", "<class 'set'>"],
                correctAnswer: "<class 'list'>",
                explanation: 'The [] syntax creates an empty list in Python, so type([]) returns the list class.',
                difficulty: 'EASY',
                type: 'MCQ',
                categoryId: programmingCategory.id,
            },
            {
                question: 'Which of the following is NOT a valid Python data type?',
                options: ['int', 'float', 'char', 'bool'],
                correctAnswer: 'char',
                explanation: 'Python does not have a char data type. Single characters are represented as strings of length 1.',
                difficulty: 'EASY',
                type: 'MCQ',
                categoryId: programmingCategory.id,
            },
            {
                question: 'What is the time complexity of accessing an element in a Python list by index?',
                options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
                correctAnswer: 'O(1)',
                explanation: 'Python lists are implemented as dynamic arrays, allowing constant-time access by index.',
                difficulty: 'MEDIUM',
                type: 'MCQ',
                categoryId: programmingCategory.id,
            },
            {
                question: 'What does the "yield" keyword do in Python?',
                options: [
                    'Terminates a function',
                    'Creates a generator function',
                    'Raises an exception',
                    'Imports a module',
                ],
                correctAnswer: 'Creates a generator function',
                explanation: 'The yield keyword is used to create generator functions, which return an iterator that yields values one at a time.',
                difficulty: 'MEDIUM',
                type: 'MCQ',
                categoryId: programmingCategory.id,
            },
            {
                question: 'What is a decorator in Python?',
                options: [
                    'A function that modifies another function',
                    'A type of variable',
                    'A loop structure',
                    'A class method',
                ],
                correctAnswer: 'A function that modifies another function',
                explanation: 'Decorators are functions that take another function and extend its behavior without explicitly modifying it.',
                difficulty: 'HARD',
                type: 'MCQ',
                categoryId: programmingCategory.id,
            },
        ];

        for (const q of sampleQuestions) {
            await prisma.question.create({
                data: q as any,
            });
        }
        console.log(`✅ Created ${sampleQuestions.length} sample questions`);
    }

    // Create Data Structures Questions
    const dsCategory = await prisma.category.findFirst({
        where: { name: 'Data Structures' },
    });

    if (dsCategory) {
        const dsQuestions = [
            {
                question: 'What is the time complexity of inserting an element at the beginning of a linked list?',
                options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
                correctAnswer: 'O(1)',
                explanation: 'Inserting at the beginning of a linked list only requires updating the head pointer, which is O(1).',
                difficulty: 'EASY',
                type: 'MCQ',
                categoryId: dsCategory.id,
            },
            {
                question: 'Which data structure uses LIFO (Last In First Out) principle?',
                options: ['Queue', 'Stack', 'Tree', 'Graph'],
                correctAnswer: 'Stack',
                explanation: 'A stack follows LIFO principle where the last element added is the first one to be removed.',
                difficulty: 'EASY',
                type: 'MCQ',
                categoryId: dsCategory.id,
            },
            {
                question: 'What is the worst-case time complexity of binary search?',
                options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
                correctAnswer: 'O(log n)',
                explanation: 'Binary search divides the search space in half with each comparison, resulting in O(log n) time complexity.',
                difficulty: 'MEDIUM',
                type: 'MCQ',
                categoryId: dsCategory.id,
            },
        ];

        for (const q of dsQuestions) {
            await prisma.question.create({
                data: q as any,
            });
        }
        console.log(`✅ Created ${dsQuestions.length} data structures questions`);
    }

    console.log('\n🎉 Database seeding completed!');
    console.log('\n📝 Login Credentials:');
    console.log('Admin - Email: admin@csequiz.com | Password: admin123');
    console.log('User  - Email: user@csequiz.com | Password: user123');
}

main()
    .catch((e) => {
        console.error('❌ Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
