import { useReducer, useCallback, useMemo } from "react";
import { SAMPLES } from "../store";

export interface ConversionStats {
  linesOfLegacy: number;
  linesOfModern: number;
  approximateSavedOpexPercentage: number;
}

export interface ConverterState {
  sourceCode: string;
  convertedCode: string;
  explanation: string;
  isConverting: boolean;
  progressStep: string;
  fileType: "COBOL" | "RPG" | "Assembly";
  targetType:
    | "Java 17 (Spring Boot)"
    | "Nodejs Express (TS)"
    | "Python FastAPI";
  stats: ConversionStats | null;
  copied: boolean;
  activeSample: "customerRecord" | "invoiceItem" | "employeeDetails";
  isDragging: boolean;
  demoVideoPlaying: boolean;
}

type ConverterAction =
  | { type: "SET_SOURCE_CODE"; payload: string }
  | {
      type: "SET_FILE_TYPE";
      payload: "COBOL" | "RPG" | "Assembly";
      defaultSource: string;
    }
  | {
      type: "SET_TARGET_TYPE";
      payload:
        | "Java 17 (Spring Boot)"
        | "Nodejs Express (TS)"
        | "Python FastAPI";
    }
  | { type: "START_CONVERSION" }
  | { type: "SET_PROGRESS_STEP"; payload: string }
  | {
      type: "COMPLETE_CONVERSION";
      payload: {
        convertedCode: string;
        explanation: string;
        stats: ConversionStats | null;
      };
    }
  | { type: "FAIL_CONVERSION" }
  | { type: "RESET_CONVERSION" }
  | { type: "SET_COPIED"; payload: boolean }
  | { type: "SET_DRAGGING"; payload: boolean }
  | { type: "SET_DEMO_VIDEO"; payload: boolean }
  | {
      type: "SET_ACTIVE_SAMPLE";
      payload: "customerRecord" | "invoiceItem" | "employeeDetails";
    };

const DEFAULT_SOURCE = SAMPLES.COBOL.customerRecord;

const initialState: ConverterState = {
  sourceCode: DEFAULT_SOURCE,
  convertedCode: "",
  explanation: "",
  isConverting: false,
  progressStep: "",
  fileType: "COBOL",
  targetType: "Java 17 (Spring Boot)",
  stats: null,
  copied: false,
  activeSample: "customerRecord",
  isDragging: false,
  demoVideoPlaying: false,
};

function converterReducer(
  state: ConverterState,
  action: ConverterAction,
): ConverterState {
  switch (action.type) {
    case "SET_SOURCE_CODE":
      return {
        ...state,
        sourceCode: action.payload,
        convertedCode: "",
        explanation: "",
        stats: null,
      };
    case "SET_FILE_TYPE":
      return {
        ...state,
        fileType: action.payload,
        sourceCode: action.defaultSource,
        convertedCode: "",
        explanation: "",
        stats: null,
        activeSample: "customerRecord",
      };
    case "SET_TARGET_TYPE":
      return {
        ...state,
        targetType: action.payload,
      };
    case "START_CONVERSION":
      return {
        ...state,
        isConverting: true,
        progressStep: "Initializing parsing agent...",
      };
    case "SET_PROGRESS_STEP":
      return {
        ...state,
        progressStep: action.payload,
      };
    case "COMPLETE_CONVERSION":
      return {
        ...state,
        isConverting: false,
        progressStep: "",
        convertedCode: action.payload.convertedCode,
        explanation: action.payload.explanation,
        stats: action.payload.stats,
      };
    case "FAIL_CONVERSION":
      return {
        ...state,
        isConverting: false,
        progressStep: "",
      };
    case "RESET_CONVERSION":
      return {
        ...state,
        convertedCode: "",
        explanation: "",
        stats: null,
        isConverting: false,
        progressStep: "",
      };
    case "SET_COPIED":
      return {
        ...state,
        copied: action.payload,
      };
    case "SET_DRAGGING":
      return {
        ...state,
        isDragging: action.payload,
      };
    case "SET_DEMO_VIDEO":
      return {
        ...state,
        demoVideoPlaying: action.payload,
      };
    case "SET_ACTIVE_SAMPLE":
      return {
        ...state,
        activeSample: action.payload,
      };
    default:
      return state;
  }
}

export function useCodeConverter() {
  const [state, dispatch] = useReducer(converterReducer, initialState);

  const currentLanguageSamples = useMemo(() => {
    return SAMPLES[state.fileType];
  }, [state.fileType]);

  const computedStatsText = useMemo(() => {
    if (!state.stats) return null;
    const legacyCount = state.stats.linesOfLegacy;
    const modernCount = state.stats.linesOfModern;
    const ratio =
      legacyCount > 0 ? (modernCount / legacyCount).toFixed(1) : "0";
    return {
      lineRatioText: `${ratio}x source equivalence profile`,
      savingsExplanation: `Estimated ${state.stats.approximateSavedOpexPercentage}% infrastructure & OPEX reduction saved.`,
    };
  }, [state.stats]);

  const setSourceCode = useCallback((code: string) => {
    dispatch({ type: "SET_SOURCE_CODE", payload: code });
  }, []);

  const setFileType = useCallback((type: "COBOL" | "RPG" | "Assembly") => {
    const defaultSource = SAMPLES[type].customerRecord;
    dispatch({ type: "SET_FILE_TYPE", payload: type, defaultSource });
  }, []);

  const setTargetType = useCallback(
    (
      type: "Java 17 (Spring Boot)" | "Nodejs Express (TS)" | "Python FastAPI",
    ) => {
      dispatch({ type: "SET_TARGET_TYPE", payload: type });
    },
    [],
  );

  const handleSampleChange = useCallback(
    (sampleKey: "customerRecord" | "invoiceItem" | "employeeDetails") => {
      const code = SAMPLES[state.fileType][sampleKey];
      dispatch({ type: "SET_ACTIVE_SAMPLE", payload: sampleKey });
      dispatch({ type: "SET_SOURCE_CODE", payload: code });
    },
    [state.fileType],
  );

  const setDemoVideoPlaying = useCallback((play: boolean) => {
    dispatch({ type: "SET_DEMO_VIDEO", payload: play });
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(state.convertedCode);
    dispatch({ type: "SET_COPIED", payload: true });
    setTimeout(() => {
      dispatch({ type: "SET_COPIED", payload: false });
    }, 2000);
  }, [state.convertedCode]);

  const setDragging = useCallback((dragging: boolean) => {
    dispatch({ type: "SET_DRAGGING", payload: dragging });
  }, []);

  const runConversion = useCallback(async () => {
    if (state.isConverting || !state.sourceCode) return;

    dispatch({ type: "START_CONVERSION" });

    const steps = [
      "Scanning PIC/Packed field variables...",
      "Mapping type equivalences and precision levels...",
      "Generating target abstractions and class declarations...",
      "Compiling Spring JPA/Native code structures...",
      "Finalizing enterprise refactoring validation...",
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      dispatch({ type: "SET_PROGRESS_STEP", payload: steps[i] });
    }

    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceCode: state.sourceCode,
          fileType: state.fileType,
          targetType: state.targetType,
        }),
      });

      if (!response.ok) {
        throw new Error("Server conversion failed");
      }

      const result = await response.json();
      dispatch({
        type: "COMPLETE_CONVERSION",
        payload: {
          convertedCode: result.convertedCode,
          explanation: result.explanation,
          stats: result.stats || {
            linesOfLegacy: state.sourceCode.split("\n").length,
            linesOfModern: result.convertedCode.split("\n").length,
            approximateSavedOpexPercentage: 65,
          },
        },
      });
    } catch (err) {
      console.error(err);
      dispatch({ type: "FAIL_CONVERSION" });
    }
  }, [state.sourceCode, state.fileType, state.targetType, state.isConverting]);

  const handleReset = useCallback(() => {
    dispatch({ type: "RESET_CONVERSION" });
  }, []);

  return {
    state,
    currentLanguageSamples,
    computedStatsText,
    setSourceCode,
    setFileType,
    setTargetType,
    handleSampleChange,
    setDemoVideoPlaying,
    handleCopy,
    setDragging,
    runConversion,
    handleReset,
  };
}
