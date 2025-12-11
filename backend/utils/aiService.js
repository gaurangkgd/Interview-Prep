const Groq = require('groq-sdk');

// Initialize Groq AI
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const generateInterviewQuestions = async ({ role, topic, difficulty, count }) => {
  try {
    const prompt = `Generate EXACTLY ${count} interview questions for a ${role} developer position.
Topic: ${topic}
Difficulty: ${difficulty}

IMPORTANT: Generate exactly ${count} questions, no more, no less.

Return a valid JSON array with this exact structure:
[
  {
    "question": "the question text",
    "answer": "detailed answer with explanation",
    "topic": "${topic}",
    "difficulty": "${difficulty}"
  }
]

Rules:
- Generate EXACTLY ${count} questions
- Each question must be unique and practical
- Answers should be detailed (3-5 sentences)
- Focus on real interview scenarios
- Return ONLY valid JSON, no markdown formatting, no code blocks, no extra text`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 4000,
    });

    let text = completion.choices[0]?.message?.content || '';
    
    console.log('AI Response (first 500 chars):', text.substring(0, 500));
    
    // Clean up response - remove markdown code blocks if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error('No JSON found in AI response');
      throw new Error('Failed to parse AI response - no JSON array found');
    }
    
    const questions = JSON.parse(jsonMatch[0]);
    
    console.log(`Successfully generated ${questions.length} questions (requested: ${count})`);
    
    // If we got fewer questions than requested, pad with fallback
    if (questions.length < count) {
      console.log(`Only got ${questions.length} questions, padding with fallback`);
      const fallback = getFallbackQuestions(topic, difficulty, count - questions.length);
      questions.push(...fallback);
    }
    
    // Trim if we got too many
    const finalQuestions = questions.slice(0, count);
    
    return {
      success: true,
      questions: finalQuestions,
      metadata: {
        role,
        topic,
        difficulty,
        count: finalQuestions.length,
        generatedAt: new Date(),
      }
    };
    
  } catch (error) {
    console.error('AI Generation Error:', error);
    console.error('Error details:', error.message);
    return {
      success: false,
      error: error.message,
      questions: getFallbackQuestions(topic, difficulty, count)
    };
  }
};

// Fallback questions if AI fails
const getFallbackQuestions = (topic, difficulty, count) => {
  const fallbacks = {
    'React': [
      {
        question: 'What is the Virtual DOM and how does it work in React?',
        answer: 'The Virtual DOM is a lightweight JavaScript representation of the actual DOM. React uses it to optimize rendering by comparing the virtual DOM with the real DOM (diffing) and only updating what changed (reconciliation). This improves performance by minimizing expensive DOM manipulations.',
        topic: 'React',
        difficulty: difficulty
      },
      {
        question: 'Explain the difference between state and props in React.',
        answer: 'Props are read-only data passed from parent to child components, while state is internal, mutable data managed within a component. Props enable component communication, while state manages component-specific data that can change over time and trigger re-renders.',
        topic: 'React',
        difficulty: difficulty
      },
      {
        question: 'What are React Hooks and why were they introduced?',
        answer: 'React Hooks are functions that let you use state and lifecycle features in functional components. They were introduced to eliminate class components, reduce code complexity, make state logic reusable, and improve code organization through custom hooks.',
        topic: 'React',
        difficulty: difficulty
      },
      {
        question: 'How does useEffect work and what is its cleanup function?',
        answer: 'useEffect runs side effects after render. It takes a callback and dependency array. The cleanup function (returned from useEffect) runs before the component unmounts or before the effect runs again, useful for cleaning up subscriptions, timers, or event listeners.',
        topic: 'React',
        difficulty: difficulty
      },
      {
        question: 'What is the Context API and when should you use it?',
        answer: 'Context API provides a way to share data across the component tree without prop drilling. Use it for global state like themes, user auth, or language preferences. For complex state management, consider Redux or Zustand instead.',
        topic: 'React',
        difficulty: difficulty
      }
    ],
    'Node.js': [
      {
        question: 'What is the event loop in Node.js and how does it work?',
        answer: 'The event loop is a mechanism that handles asynchronous operations in Node.js. It processes callbacks from the callback queue when the call stack is empty, enabling non-blocking I/O operations. It has multiple phases: timers, I/O callbacks, idle, poll, check, and close callbacks.',
        topic: 'Node.js',
        difficulty: difficulty
      },
      {
        question: 'Explain the difference between process.nextTick() and setImmediate().',
        answer: 'process.nextTick() executes callbacks before the next event loop iteration, while setImmediate() executes in the check phase of the event loop. nextTick has higher priority and runs before any I/O events, while setImmediate runs after I/O events in the current cycle.',
        topic: 'Node.js',
        difficulty: difficulty
      },
      {
        question: 'What are streams in Node.js and what types exist?',
        answer: 'Streams are objects for handling streaming data. Four types exist: Readable (read data), Writable (write data), Duplex (both read/write), and Transform (modify data while reading/writing). They process data chunk by chunk, improving memory efficiency for large files.',
        topic: 'Node.js',
        difficulty: difficulty
      },
      {
        question: 'How does middleware work in Express.js?',
        answer: 'Middleware functions have access to request, response, and next() function. They execute sequentially in the order defined, can modify req/res objects, end the request-response cycle, or call next() to pass control. Used for logging, authentication, parsing, error handling.',
        topic: 'Node.js',
        difficulty: difficulty
      },
      {
        question: 'What is clustering in Node.js and why is it important?',
        answer: 'Clustering allows running multiple Node.js processes (workers) to handle requests, utilizing all CPU cores. The master process distributes incoming connections among workers using round-robin. This improves performance and provides fault tolerance if a worker crashes.',
        topic: 'Node.js',
        difficulty: difficulty
      }
    ],
    'JavaScript': [
      {
        question: 'What is closure in JavaScript and provide a practical example?',
        answer: 'A closure is a function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned. Example: function counter() { let count = 0; return () => ++count; }. The inner function remembers count even after counter() completes.',
        topic: 'JavaScript',
        difficulty: difficulty
      },
      {
        question: 'Explain the difference between == and === in JavaScript.',
        answer: '== performs type coercion before comparison (loose equality), while === compares both value and type without coercion (strict equality). Example: "5" == 5 is true, but "5" === 5 is false. Always prefer === to avoid unexpected type conversions.',
        topic: 'JavaScript',
        difficulty: difficulty
      },
      {
        question: 'What is the difference between var, let, and const?',
        answer: 'var is function-scoped, hoisted, and can be redeclared. let is block-scoped, not hoisted to usable state, cannot be redeclared. const is like let but cannot be reassigned (though object properties can be modified). Always prefer const, use let when reassignment is needed, avoid var.',
        topic: 'JavaScript',
        difficulty: difficulty
      },
      {
        question: 'What is event delegation and why is it useful?',
        answer: 'Event delegation attaches a single event listener to a parent element instead of multiple listeners on children. It uses event bubbling to handle events from child elements. Benefits: better performance, handles dynamically added elements, reduces memory usage.',
        topic: 'JavaScript',
        difficulty: difficulty
      },
      {
        question: 'Explain promises and async/await in JavaScript.',
        answer: 'Promises represent eventual completion/failure of async operations with states: pending, fulfilled, rejected. async/await is syntactic sugar over promises. async functions return promises, await pauses execution until promise resolves. Makes async code look synchronous and easier to read.',
        topic: 'JavaScript',
        difficulty: difficulty
      }
    ]
  };
  
  const topicQuestions = fallbacks[topic] || fallbacks['JavaScript'];
  return topicQuestions.slice(0, count);
};

// Test AI connection
const testAIConnection = async () => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'Say "AI Ready"' }],
      model: 'llama-3.3-70b-versatile',
      max_tokens: 10,
    });
    console.log('✅ Groq AI is ready');
    return true;
  } catch (error) {
    console.error('❌ Groq AI error:', error.message);
    return false;
  }
};

module.exports = {
  generateInterviewQuestions,
  testAIConnection,
};
