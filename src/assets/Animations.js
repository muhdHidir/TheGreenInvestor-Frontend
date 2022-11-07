export const variants = {
  hidden: {
    y: "100%",
  },
  visible: {
    y: "0%",
    transition: {
      when: "afterChildren",
      staggerChildren: 0.5,
      type: "spring",
      duration: 1.5,
    },
  },
  hidden_ease: {
    opacity: "0%,",
  },
  visible_ease: {
    opacity: "100%",
    transition: {
      when: "afterChildren",
      staggerChildren: 0.5,
      type: "spring",
      duration: 1.5,
    },
  },
};

// const variants = {
//     hidden: {
//       y: "100%",
//     },
//     visible: {
//       y: "0%",
//       transition: {
//         when: "beforeChildren",
//         staggerChildren: 0.5,
//         default: { ease: "linear" },
//         duration: 1.5,
//       },
//     },
//   };
