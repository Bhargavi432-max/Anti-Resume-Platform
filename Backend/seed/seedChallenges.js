// seed/seedChallenges.js
const mongoose = require('mongoose');
const Challenge = require('../models/Challenge');
require('dotenv').config();

const seedChallenges = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected...');

    // Clear existing challenges
    await Challenge.deleteMany();

    const challenges = [
      {
        title: 'Print Hello World in Python',
        description: 'Write a Python program to print "Hello, World!"',
        type: 'python',
        input: '',
        expectedOutput: 'Hello, World!',
        boilerplateCode: 'print("")',
      },
      {
        title: 'Sum of Two Numbers in Java',
        description: 'Take 2 integers as input and print their sum.',
        type: 'java',
        input: '5 3',
        expectedOutput: '8',
        boilerplateCode: `import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    // your code here\n  }\n}`,
      },
      {
        title: 'Add Two Numbers in C',
        description: 'Read two integers and print their sum.',
        type: 'c',
        input: '10 20',
        expectedOutput: '30',
        boilerplateCode: `#include <stdio.h>\nint main() {\n  int a, b;\n  // your code here\n  return 0;\n}`,
      },
      {
        title: 'Add Two Numbers in C++',
        description: 'Take two integers and print their sum.',
        type: 'c++',
        input: '4 6',
        expectedOutput: '10',
        boilerplateCode: `#include <iostream>\nusing namespace std;\nint main() {\n  int a, b;\n  // your code here\n  return 0;\n}`,
      },
      {
        title: 'Print Hello in JavaScript',
        description: 'Print "Hello, JS World!"',
        type: 'javascript',
        input: '',
        expectedOutput: 'Hello, JS World!',
        boilerplateCode: `console.log("");`,
      },
    ];

    await Challenge.insertMany(challenges);
    console.log('✅ Challenges seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding challenges:', err);
    process.exit(1);
  }
};

seedChallenges();
