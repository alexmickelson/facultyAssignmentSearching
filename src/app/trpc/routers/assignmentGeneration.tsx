import { z } from "zod";
import { publicProcedure } from "../utils/trpc";
import {  readFileContentsServerOnly } from "./files";
import { getAiResponse } from "~/aiUtils";

export const assignmentGenerationRouter = {
  generateAssignment: publicProcedure
    .input(
      z.object({
        fileNames: z.array(z.string()),
        prompt: z.string(),
      })
    )
    .mutation(async ({ input: { fileNames, prompt } }) => {
      const fileContents = await Promise.all(
        fileNames.map(async (fileName) => {
          const { fileContents } = await readFileContentsServerOnly(fileName);
          return fileContents;
        })
      );
      const assignmentPrompts =
        "<example>" + fileContents.join("</example>\n<example>") + "</example>";
      const fullPrompt = `
<Example Assignments>
${assignmentPrompts}
</Example Assignments>

User Assignment Prompt:
${prompt}`;

      const result = getAiResponse(fullPrompt);
      return result;
    }),
};
