export interface Topic {
    id: string;
    name: string;
    unit: string;
    frequency: string; // e.g., "3/3 Years"
    probability: number; // 0-100
    trend: "up" | "down" | "stable";
    reasoning: string;
    sampleQuestions?: string[];
}

export const MOCK_RESULTS: Topic[] = [
    {
        id: "1",
        name: "K-Means Clustering Algorithm",
        unit: "Unit 3",
        frequency: "5/5 Years",
        probability: 92,
        trend: "up",
    },
    {
        id: "2",
        name: "Bayesian Belief Networks",
        unit: "Unit 4",
        frequency: "4/5 Years",
        probability: 85,
        trend: "stable",
    },
    {
        id: "3",
        name: "A* Search Algorithm",
        unit: "Unit 2",
        frequency: "3/5 Years",
        probability: 78,
        trend: "down",
    },
    {
        id: "4",
        name: "Neural Network Backpropagation",
        unit: "Unit 5",
        frequency: "2/5 Years",
        probability: 65,
        trend: "up",
    },
    {
        id: "5",
        name: "Minimax Algorithm with Alpha-Beta",
        unit: "Unit 2",
        frequency: "2/5 Years",
        probability: 45,
        trend: "stable",
    },
    {
        id: "6",
        name: "Fuzzy Logic Systems",
        unit: "Unit 4",
        frequency: "1/5 Years",
        probability: 30,
        trend: "down",
    },
];

export interface ExamQuestion {
    id: string;
    section: "A" | "B";
    number: string;
    text: string;
    marks: number;
    relatedTopic: string;
    probability: number;
    pastYearRef: string;
    difficulty: "Easy" | "Medium" | "Hard";
    reasoning: string;
}

export const MOCK_EXAM: ExamQuestion[] = [
    // Section A: Short Answers
    {
        id: "q1",
        section: "A",
        number: "1.a",
        text: "Define the term 'Heuristic Function' in the context of A* Search.",
        marks: 5,
        relatedTopic: "A* Search Algorithm",
        probability: 88,
        pastYearRef: "2022 Q1(b), 2020 Q2(a)",
        difficulty: "Easy",
        reasoning: "High recurrence in short-answer sections. Fundamental definition."
    },
    {
        id: "q2",
        section: "A",
        number: "1.b",
        text: "Differentiate between Supervised and Unsupervised learning with examples.",
        marks: 5,
        relatedTopic: "Machine Learning Basics",
        probability: 92,
        pastYearRef: "2023 Q1(a), 2021 Q1(a)",
        difficulty: "Easy",
        reasoning: "Staple introductory question. Appears in 90% of past papers."
    },
    {
        id: "q3",
        section: "A",
        number: "1.c",
        text: "Explain the concept of 'support' and 'confidence' in Association Rule Mining.",
        marks: 5,
        relatedTopic: "Data Mining",
        probability: 75,
        pastYearRef: "2019 Q2(b)",
        difficulty: "Medium",
        reasoning: "Secondary topic but due for rotation based on gap years."
    },

    // Section B: Long Answers
    {
        id: "q4",
        section: "B",
        number: "2",
        text: "Explain the K-Means Clustering algorithm step-by-step. Given the data points {2, 4, 10, 12, 3, 20, 30, 11, 25}, apply K-Means with K=2. Show two iterations.",
        marks: 15,
        relatedTopic: "K-Means Clustering",
        probability: 96,
        pastYearRef: "2023 Q4, 2022 Q3, 2021 Q5",
        difficulty: "Hard",
        reasoning: "Highest probability topic. Numerical application is almost guaranteed."
    },
    {
        id: "q5",
        section: "B",
        number: "3",
        text: "Describe the architecture of a Multi-Layer Perceptron (MLP). Derive the Backpropagation weight update rule for the output layer.",
        marks: 15,
        relatedTopic: "Neural Networks",
        probability: 82,
        pastYearRef: "2020 Q6, 2018 Q5",
        difficulty: "Hard",
        reasoning: "Critical theoretical derivation. Often alternates with CNN questions."
    },
    {
        id: "q6",
        section: "B",
        number: "4",
        text: "Construct a Bayesian Network for the 'Burglar Alarm' problem. Explain the concept of d-separation with respect to the graph.",
        marks: 15,
        relatedTopic: "Bayesian Reasoning",
        probability: 78,
        pastYearRef: "2021 Q3",
        difficulty: "Medium",
        reasoning: "Strong conceptual topic for Unit 4. Consistent pattern of appearance."
    }
];
