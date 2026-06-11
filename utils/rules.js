module.exports = [
  /* ================= AGE 5–8 YEARS ================= */

  {
    id: "school_feelings",
    question: "How does the child usually feel before going to school?",
    triggers: {
      Happy: [],
      Sometimes_Worried: ["A"],
      Often_Cries: ["D"]
    }
  },
  {
    id: "unexplained_fear",
    question: "Does the child feel scared or anxious without clear reason?",
    triggers: {
      Never: [],
      Sometimes: ["A"],
      Often: ["D"]
    }
  },
  {
    id: "calm_down",
    question: "When upset, how easily does the child calm down?",
    triggers: {
      Easily: [],
      Needs_Help: ["B"],
      Stays_Upset: ["D"]
    }
  },
  {
    id: "screen_time_child",
    question: "Daily screen time?",
    triggers: {
      Less_Than_1_Hour: [],
      One_To_Two_Hours: ["B"],
      More_Than_Two_Hours: ["D"]
    }
  },
  {
    id: "screen_removed",
    question: "Reaction when screen time is stopped?",
    triggers: {
      Calm: [],
      Irritated: ["B"],
      Severe_Tantrum: ["D"]
    }
  },
  {
    id: "sleep_quality_child",
    question: "How is the child’s sleep?",
    triggers: {
      Good: [],
      Disturbed: ["B"],
      Very_Poor: ["D"]
    }
  },
  {
    id: "physical_complaints_child",
    question: "Complains of headache or stomach pain without illness?",
    triggers: {
      Never: [],
      Sometimes: ["C"],
      Often: ["D"]
    }
  },
  {
    id: "social_play",
    question: "How does the child behave with friends?",
    triggers: {
      Plays_Well: [],
      Shy: ["A"],
      Avoids_or_Aggressive: ["D"]
    }
  },
  {
    id: "express_emotions",
    question: "Does the child express emotions?",
    triggers: {
      Easily: [],
      Sometimes: ["A"],
      Rarely: ["D"]
    }
  },
  {
    id: "overall_mood_child",
    question: "Overall mood of the child?",
    triggers: {
      Cheerful: [],
      Sometimes_Low: ["C"],
      Mostly_Unhappy: ["E"]
    }
  },

  /* ================= AGE 8–15 YEARS ================= */

  {
    id: "school_pressure",
    question: "How do you feel about schoolwork?",
    triggers: {
      Enjoy: [],
      Sometimes_Stressed: ["B"],
      Very_Stressed: ["D"]
    }
  },
  {
    id: "performance_pressure",
    question: "Do you feel pressure to perform well?",
    triggers: {
      No: [],
      Some: ["B"],
      Extreme: ["D"]
    }
  },
  {
    id: "worry_level",
    question: "How often do you feel worried or tense?",
    triggers: {
      Rarely: [],
      Often: ["C"],
      Always: ["D"]
    }
  },
  {
    id: "talk_feelings",
    question: "Can you talk about your feelings?",
    triggers: {
      Easily: [],
      Sometimes: ["A"],
      No_One: ["D"]
    }
  },
  {
    id: "loneliness",
    question: "How often do you feel lonely?",
    triggers: {
      Never: [],
      Sometimes: ["A"],
      Very_Often: ["D"]
    }
  },
  {
    id: "reaction_failure",
    question: "How do you react when things go wrong?",
    triggers: {
      Calm: [],
      Upset: ["B"],
      Lose_Control: ["D"]
    }
  },
  {
    id: "digital_dependence",
    question: "How do you feel without phone or games?",
    triggers: {
      Fine: [],
      Restless: ["B"],
      Very_Anxious: ["D"]
    }
  },
  {
    id: "sleep_quality_teen",
    question: "Sleep quality?",
    triggers: {
      Good: [],
      Poor: ["C"],
      Very_Poor: ["D"]
    }
  },
  {
    id: "overall_happiness_teen",
    question: "Overall happiness?",
    triggers: {
      Happy: [],
      Sometimes_Unhappy: ["C"],
      Very_Unhappy: ["E"]
    }
  },

  /* ================= AGE 15–18 YEARS ================= */

  {
    id: "future_anxiety",
    question: "Do you feel anxious about your future?",
    triggers: {
      No: [],
      Sometimes: ["C"],
      Constant: ["E"]
    }
  },
  {
    id: "overwhelmed",
    question: "Do you feel overwhelmed?",
    triggers: {
      Rarely: [],
      Often: ["C"],
      Almost_Always: ["E"]
    }
  },
  {
    id: "sadness",
    question: "Feelings of sadness or emptiness?",
    triggers: {
      Never: [],
      Sometimes: ["C"],
      Constant: ["E"]
    }
  },
  {
    id: "support_system",
    question: "Can you seek emotional support?",
    triggers: {
      Easily: [],
      Rarely: ["B"],
      No_Support: ["E"]
    }
  },
  {
    id: "giving_up",
    question: "Thoughts of giving up?",
    triggers: {
      Never: [],
      Sometimes: ["D"],
      Often: ["E"]
    }
  },
  {
    id: "phone_dependency",
    question: "Phone dependency level?",
    triggers: {
      Low: [],
      High: ["C"],
      Addictive: ["D"]
    }
  },
  {
    id: "focus_level",
    question: "Ability to focus?",
    triggers: {
      Good: [],
      Poor: ["B"],
      Very_Poor: ["D"]
    }
  },
  {
    id: "emotional_balance",
    question: "Overall emotional balance?",
    triggers: {
      Stable: [],
      Disturbed: ["C"],
      Very_Unstable: ["E"]
    }
  }
];
