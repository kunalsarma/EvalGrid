import { EvaluationField, FileData } from '../types';

export const promptBuilder = {
  buildEvaluationPrompt: (
    field: EvaluationField,
    row: Record<string, any>,
    fileData: FileData
  ): string => {
    const targetContent = row[field.targetColumn] || '';

    let contextInfo = '';
    if (field.contextColumns.length > 0) {
      contextInfo = 'Context Information:\n';
      field.contextColumns.forEach((ctx) => {
        const columnContent = row[ctx.column] || '';
        contextInfo += `- ${ctx.column} (${ctx.description}):\n  "${columnContent}"\n`;
      });
    }

    const scoreDefinitions = field.scoreValues
      .map((score) => `- ${score.value}: ${score.description}`)
      .join('\n');

    return `You are an evaluation assistant. Evaluate the following content according to the specified criteria.

Evaluation Field: ${field.name}
Field Description: ${field.description}

Content to Evaluate (from ${field.targetColumn}):
"${targetContent}"

${contextInfo}

Possible Scores:
${scoreDefinitions}

Based on the content to evaluate and the provided context, assign the most appropriate score. Consider all context information when making your evaluation.

Respond with ONLY the score value (e.g., "${field.scoreValues[0]?.value}" or "${field.scoreValues[field.scoreValues.length - 1]?.value}"), nothing else.`;
  },
};
