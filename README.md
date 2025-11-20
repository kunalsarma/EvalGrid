# EvalGrid - LLM-Powered Data Evaluation Tool

A web-based tool for Product Managers to perform automated evaluation of spreadsheet data using LLM-powered scoring across custom evaluation fields.

## Features

- **File Upload**: Accept XLSX files with flexible column structures
- **Custom Evaluation Fields**: Define multiple evaluation fields with custom scoring criteria
- **Context Columns**: Include relevant context columns with descriptions for better LLM evaluations
- **Multiple Gemini Models**: Support for 5 different Google Gemini models with various performance characteristics
- **Smart Rate Limiting**: Automatic request pacing based on model rate limits
- **Progress Tracking**: Real-time progress monitoring with speed and time estimates
- **Error Handling**: Graceful error recovery with retry logic
- **Results Export**: Download evaluated data as XLSX with results appended
- **Local Storage**: Persistent API key and configuration storage (localStorage)

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Google AI Studio API key (get it at https://aistudio.google.com/apikey)

### Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The application will open at `http://localhost:5173/`

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

## Usage

### 1. Download Template
Click "Download Template" to get an example XLSX file showing the expected format:
- Column A: "customer message"
- Column B: "template reply"
- Column C: "rephrased reply"

### 2. Prepare Your Data
Edit the template with your own data, maintaining the column structure.

### 3. Upload File
- Drag and drop your XLSX file or click to select
- The app will display detected columns and row count

### 4. Configure API Key
- Provide your Google AI Studio API key
- The key is stored locally in your browser (use HTTPS only in production)

### 5. Select Model and Tier
- Choose from 5 available Gemini models
- Select your Google AI Studio tier (Free, Tier 1, 2, or 3)
- View rate limits for the selected model/tier combination

### 6. Configure Evaluation Fields
For each evaluation field:
1. **Field Name** (e.g., "Accuracy", "Tone Appropriateness")
2. **Field Description** - helps the LLM understand the evaluation criteria
3. **Target Column** - which column to evaluate
4. **Context Columns** - select relevant columns and describe what they represent
5. **Score Values** - define scoring scale with descriptions
   - Example: Score "5" = "Perfectly accurate and professional"

### 7. Start Evaluation
1. Click "Start Evaluation" when all fields are configured
2. Monitor progress with:
   - Completion percentage
   - Current row/total rows
   - Processing speed (rows/minute)
   - Estimated time remaining

### 8. Download Results
After evaluation completes, download the results as XLSX:
- All original columns preserved
- New columns added for each evaluation field
- Column format: `[Field Name]_Score`
- Filename includes timestamp

## Supported Models

| Model | Type | Best For |
|-------|------|----------|
| **Gemini 2.5 Pro** | Most capable, slower | Complex evaluations, high accuracy |
| **Gemini 2.5 Flash** | Balanced (Recommended) | General-purpose evaluations |
| **Gemini 2.5 Flash-Lite** | Fast, high throughput | Large datasets, simple criteria |
| **Gemini 2.0 Flash** | High speed | Volume processing, medium complexity |
| **Gemini 2.0 Flash-Lite** | Highest throughput | Maximum speed, simple evaluations |

## Rate Limits by Tier

### Free Tier
- Gemini 2.5 Pro: 2 RPM, 125k TPM, 50 RPD
- Gemini 2.5 Flash: 10 RPM, 250k TPM, 250 RPD
- Gemini 2.5 Flash-Lite: 15 RPM, 250k TPM, 1k RPD
- Gemini 2.0 Flash: 15 RPM, 1M TPM, 200 RPD
- Gemini 2.0 Flash-Lite: 30 RPM, 1M TPM, 200 RPD

### Tier 1 (Paid)
- Gemini 2.5 Pro: 150 RPM, 2M TPM, 10k RPD
- Gemini 2.5 Flash: 1k RPM, 1M TPM, 10k RPD
- Gemini 2.5 Flash-Lite: 4k RPM, 4M TPM, Unlimited RPD
- Gemini 2.0 Flash: 2k RPM, 4M TPM, Unlimited RPD
- Gemini 2.0 Flash-Lite: 4k RPM, 4M TPM, Unlimited RPD

### Tier 2 & 3
See header for current tier information or check the Rate Limits display in the app.

*RPM = Requests Per Minute, TPM = Tokens Per Minute, RPD = Requests Per Day*

## LLM Prompt Strategy

For each row, the app constructs a detailed prompt including:
- The evaluation field name and description
- The target column content to evaluate
- Context columns with their descriptions
- All possible score values with definitions

The LLM responds with just the score value, which is then recorded.

## Security & Privacy

### Important Notes:
- **Data Privacy**: Your uploaded data is sent to Google's API for evaluation
- **API Key Storage**: The API key is stored in browser localStorage - only use this tool on trusted devices
- **HTTPS Only**: In production, serve this application over HTTPS
- **Client-Side Processing**: All data processing happens in your browser, no server storage

### Clear Data
Use the "Clear All" button in the header to:
- Remove your API key from localStorage
- Clear all field configurations
- Reset progress and results

## Error Handling

The application handles various error scenarios:

- **429 Rate Limit Errors**: Automatic retry with exponential backoff
- **Network Failures**: Retry with saved progress
- **Invalid API Key**: Clear error message with instructions
- **Invalid Response Format**: Marked as ERROR in results, evaluation continues
- **Pause/Resume**: Evaluation can be paused and resumed from the last successful row

## Performance Recommendations

- **Small datasets (<100 rows)**: Use any model
- **Medium datasets (100-500 rows)**: Flash or Flash-Lite recommended
- **Large datasets (500+ rows)**: Flash-Lite or 2.0 Flash-Lite recommended

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **File Processing**: SheetJS (xlsx)
- **LLM API**: Google AI Studio (Gemini models)
- **Build Tool**: Vite
- **State Management**: React Context API

## Project Structure

```
/src
  /components
    - Header.tsx
    - FileUpload.tsx
    - ApiKeyInput.tsx
    - FieldConfiguration.tsx
    - FieldConfigCard.tsx
    - ScoreValueInput.tsx
    - ContextColumnSelector.tsx
    - ProcessingControl.tsx
    - ProgressBar.tsx
    - ResultsDownload.tsx
  /context
    - AppContext.tsx (Global state management)
  /constants
    - models.ts (Model configurations)
    - errors.ts (Error messages)
  /types
    - index.ts (TypeScript interfaces)
  /utils
    - excelHandler.ts (XLSX file processing)
    - geminiEvaluator.ts (API integration)
    - rateLimitManager.ts (Rate limiting & backoff)
    - promptBuilder.ts (LLM prompt construction)
    - storage.ts (localStorage/sessionStorage utilities)
  - App.tsx (Main application component)
  - main.tsx (Entry point)
  - index.css (Global styles)
```

## Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### API Key Not Working?
1. Verify you have the correct API key from Google AI Studio
2. Check that your tier has available quota
3. Ensure you're using HTTPS in production

### Rate Limit Errors?
1. Switch to a faster model (Flash-Lite)
2. Upgrade your tier for higher limits
3. Process data in smaller batches

### Large File Issues?
1. Split your file into smaller batches
2. Use a faster model to process more rows per minute
3. Increase API tier limits

## Future Enhancements

- [ ] Support for CSV and other file formats
- [ ] Multiple LLM provider support (OpenAI, Anthropic)
- [ ] Batch processing of multiple files
- [ ] Cloud storage integration
- [ ] Evaluation confidence scores
- [ ] Historical evaluation projects
- [ ] Custom prompt templates
- [ ] Advanced analytics and reporting
- [ ] Cost tracking per evaluation

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or feature requests, please check:
- Google AI Studio documentation: https://ai.google.dev/
- Gemini API docs: https://ai.google.dev/docs/gemini_api_overview

## Contributing

This is a product evaluation tool. Contributions are welcome for:
- Bug fixes
- Performance improvements
- UI/UX enhancements
- Documentation improvements

---

**Made with ❤️ for Product Managers**
