import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { lessons } from "../src/data/lessons";
import { problems, allTests } from "../src/data/problems";
import { topics } from "../src/data/topics";
import { pythonSessions } from "../src/data/python";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  for (const topic of topics) {
    const { error } = await supabase.from("topics").upsert(
      {
        slug: topic.slug,
        phase: topic.phase,
        title: topic.title,
        description: topic.description,
        sort_order: topic.sortOrder,
        prerequisites: topic.prerequisites,
      },
      { onConflict: "slug" },
    );
    if (error) throw error;
  }

  const { data: topicRows, error: topicReadError } = await supabase.from("topics").select("id, slug");
  if (topicReadError) throw topicReadError;
  const topicIdBySlug = new Map((topicRows ?? []).map((row) => [String(row.slug), String(row.id)]));

  for (const lesson of lessons) {
    const topic = topics.find((item) => item.id === lesson.topicId);
    const topicId = topic ? topicIdBySlug.get(topic.slug) : undefined;
    if (!topicId) throw new Error(`Missing topic for lesson ${lesson.slug}`);
    const { error } = await supabase.from("lessons").upsert(
      {
        topic_id: topicId,
        slug: lesson.slug,
        title: lesson.title,
        sort_order: lesson.sortOrder,
        content: lesson.content,
        content_version: lesson.contentVersion,
      },
      { onConflict: "topic_id,slug" },
    );
    if (error) throw error;
  }

  for (const problem of problems) {
    const { error } = await supabase.from("problems").upsert(
      {
        slug: problem.slug,
        title: problem.title,
        statement: problem.statement,
        difficulty: problem.difficulty,
        input_format: problem.inputFormat,
        output_format: problem.outputFormat,
        constraints: problem.constraints,
        starter_code: problem.starterCode,
        editorial_content: problem.editorial,
        hints: problem.hints,
        tags: problem.tags,
        active: problem.active,
      },
      { onConflict: "slug" },
    );
    if (error) throw error;
  }

  for (const session of pythonSessions) {
    const { error } = await supabase.from("python_sessions").upsert(
      {
        session_number: session.sessionNumber,
        title: session.title,
        content: session,
        sort_order: session.sessionNumber,
      },
      { onConflict: "session_number" },
    );
    if (error) throw error;
  }

  console.log(`Seeded ${topics.length} topics, ${lessons.length} lessons, ${problems.length} problems, ${allTests.length} tests metadata.`);
  console.log("Map problem_topics after inspecting problem UUIDs in the dashboard or extend this script.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
