export type Note = {
    id: number;
    title: string;
    desc: string;
    smallDesc: string;
  };
  
  export const notes: Note[] = [
    {
      id: 1,
      title: "Learn React Native",
      desc: "React Native is a popular framework for building mobile applications using JavaScript and React. It allows for cross-platform development.",
      smallDesc: "Learn React Native for cross-platform mobile development.",
    },
    {
      id: 2,
      title: "TypeScript Basics",
      desc: "TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling and error checking.",
      smallDesc: "Learn TypeScript for better JavaScript development.",
    },
    {
      id: 3,
      title: "Expo Router",
      desc: "Expo Router simplifies navigation in React Native apps by leveraging file-based routing, similar to frameworks like Next.js.",
      smallDesc: "Use Expo Router for file-based routing in React Native.",
    },
    {
      id: 4,
      title: "State Management",
      desc: "State management is a crucial concept in React Native for handling and synchronizing the application's state efficiently across components.",
      smallDesc: "Learn state management in React Native.",
    },
    {
      id: 5,
      title: "React Hooks",
      desc: "React Hooks, like useState and useEffect, provide a way to use state and lifecycle methods in functional components.",
      smallDesc: "Understand React Hooks for functional components.",
    },
    {
      id: 6,
      title: "REST API Integration",
      desc: "REST APIs are used to fetch data from external servers. Integration involves using libraries like Axios or Fetch in React Native.",
      smallDesc: "Integrate REST APIs with libraries like Axios.",
    },
    {
      id: 7,
      title: "UI Libraries in React Native",
      desc: "React Native has several UI libraries like React Native Paper and Native Base, which provide pre-built components for faster development.",
      smallDesc: "Explore UI libraries for React Native components.",
    },
    {
      id: 8,
      title: "Debugging in React Native",
      desc: "Debugging is essential in development. Tools like React Native Debugger and Flipper can help identify and resolve issues in your app.",
      smallDesc: "Learn to debug React Native apps with tools like Flipper.",
    },
    {
      id: 9,
      title: "Deployment on App Stores",
      desc: "Deploying a React Native app involves preparing builds for Android and iOS, setting up app store accounts, and publishing the app.",
      smallDesc: "Learn how to deploy React Native apps to app stores.",
    },
    {
      id: 10,
      title: "Memory Optimization",
      desc: "Memory optimization ensures your React Native app runs efficiently by reducing resource consumption and handling large data sets smartly.",
      smallDesc: "Optimize React Native apps for better performance.",
    },
  ];
  