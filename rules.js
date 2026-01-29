module.exports = [
    {
      id: "eye_contact",
      question: "Does the child maintain eye contact while speaking?",
      triggers: {
        Yes: ["A"],
        Sometimes: ["A"],
        No: []
      }
    },
    {
      id: "responds_name",
      question: "Does the child respond to their name?",
      triggers: {
        Yes: ["A"],
        Sometimes: ["A"],
        No: [] 
      }
    },
  
    // NEW QUESTION
    {
      id: "repetitive_behav",
      question: "Does the child show repetitive behaviours?",
      triggers: {
        Yes: ["C"],
        Sometimes: ["C"],
        No: []
      }
    },
    {
      id: "upset_changes",
      question: "Does the child get upset with changes in routine?",
      triggers: {
        Yes: ["D"],
        Sometimes: ["D"],
        No: []
      }
    },
    {
      id: "avoids_touch",
      question: "Does the child avoid physical touch?",
      triggers: {
        Yes: ["A"],
        Sometimes: ["A"],
        No: []
      }
    },
  
    {
      id: "prefers_alone",
      question: "Does the child prefer playing alone?",
      triggers: {
        Yes: ["A"],
        Sometimes: ["A"],
        No: []
      }
    },
    {
      id: "difficulty_sitting",
      question: "Does the child have difficulty sitting still?",
      triggers: {
        Yes: ["B"],
        Sometimes: ["B"],
        No: []
      }
    },
    {
      id: "fidgety",
      question: "Is the child very fidgety?",
      triggers: {
        Yes: ["B"],
        Sometimes: ["B"],
        No: []
      }
    },
    {
      id: "impulsive",
      question: "Acts impulsively without thinking?",
      triggers: {
        Yes: ["B"],
        Sometimes: ["B"],
        No: []
      }
    },
    {
      id: "leaves_tasks",
      question: "Leaves tasks unfinished?",
      triggers: {
        Yes: ["B"],
        Sometimes: ["B"],
        No: []
      }
    },
    {
      id: "follow_instruct",
      question: "Difficulty following instructions?",
      triggers: {
        Yes: ["B"],
        Sometimes: ["B"],
        No: []
      }
    },
    {
      id: "mobile_usage",
      question: "Daily Mobile Usage",
      triggers: {
        "0-1 Hr": ["A", "B"],
        "1-2 Hr": ["B"],
        ">2 Hr": ["D"],
        "Always": ["D"]
      }
    },
    {
      id: "letters",
      question: "Difficulty recognizing letters?",
      triggers: {
        Yes: ["L"],
        Often: ["L"],
        No: []
      }
    },
    {
      id: "remembering_concepts",
      question: "Difficulty remembering learned concepts?",
      triggers: {
        Often: ["L"],
        Sometimes: ["L"],
        Rarely: []
      }
    },
    {
      id: "reading_words",
      question: "Difficulty reading simple words?",
      triggers: {
        Often: ["L"],
        Sometimes: ["L"],
        Rarely: []
      }
    },
    {
      id: "writing_neatly",
      question: "Struggles with writing neatly?",
      triggers: {
        Yes: ["L"],
        Unclear: ["L"],
        No: []
      }
    }
  
  ];
  