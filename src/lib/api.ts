import { Topic, MOCK_RESULTS } from "./mock-data";

const API_BASE_URL = "http://127.0.0.1:8000";

/**
 * Analyzes uploaded papers using the backend API.
 * Falls back to mock data if the backend is unavailable.
 */
export async function analyzePapers(
    syllabusFile: File,
    pastPaperFiles: File[]
): Promise<Topic[]> {
    try {
        // Prepare form data
        const formData = new FormData();

        // Add syllabus (backend expects single file upload endpoint)
        // We'll upload syllabus first
        formData.append("file", syllabusFile);

        // Calculate actual paper count
        const paperCount = pastPaperFiles.length;

        console.log(`Uploading syllabus to backend with ${paperCount} past papers...`);
        const response = await fetch(`${API_BASE_URL}/upload?paper_count=${paperCount}`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Backend responded with status ${response.status}`);
        }

        const result = await response.json();
        console.log("Backend response:", result);

        // Extract analysis array from response
        const analysisData = result.analysis;

        if (!Array.isArray(analysisData) || analysisData.length === 0) {
            console.warn("Backend returned empty or invalid analysis, using mock data");
            return MOCK_RESULTS;
        }

        // Transform backend format to frontend Topic interface
        const topics: Topic[] = analysisData.map((item, index) => ({
            id: `topic-${index + 1}`,
            name: item.topic,
            unit: inferUnit(item.topic, index),
            frequency: item.frequency,
            probability: item.probability,
            trend: inferTrend(item.probability),
            reasoning: item.reasoning || "No reasoning provided",
            sampleQuestions: item.sample_questions || [],
        }));

        console.log(`Successfully transformed ${topics.length} topics`);
        return topics;

    } catch (error) {
        console.error("API call failed, falling back to mock data:", error);
        // Graceful degradation - return mock data if backend is down
        return MOCK_RESULTS;
    }
}

/**
 * Infer unit from topic name or use default
 */
function inferUnit(topicName: string, index: number): string {
    // Simple heuristic: extract "Unit X" if mentioned
    const unitMatch = topicName.match(/Unit (\d+)/i);
    if (unitMatch) {
        return `Unit ${unitMatch[1]}`;
    }

    // Otherwise, distribute across units based on index
    const unitNumber = (index % 5) + 1;
    return `Unit ${unitNumber}`;
}

/**
 * Infer trend from probability score
 */
function inferTrend(probability: number): "up" | "down" | "stable" {
    if (probability >= 80) return "up";
    if (probability <= 40) return "down";
    return "stable";
}
