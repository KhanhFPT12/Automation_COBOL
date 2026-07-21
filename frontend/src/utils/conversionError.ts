export interface ConversionErrorDetails {
  code: string;
  message: string;
  line: string;
  suggestion: string;
}

export const GENERIC_CONVERSION_ERROR: ConversionErrorDetails = {
  code: "CONVERSION_FAILED",
  message: "The conversion could not be completed.",
  line: "Not available",
  suggestion: "Check the BMS file format and try the conversion again.",
};

export function getConversionError(payload: unknown, status: number): ConversionErrorDetails {
  if (!payload || typeof payload !== "object") {
    return { ...GENERIC_CONVERSION_ERROR, code: status ? `HTTP_${status}` : GENERIC_CONVERSION_ERROR.code };
  }
  const body = payload as Record<string, unknown>;
  const detail = body.error && typeof body.error === "object" ? body.error as Record<string, unknown> : {};
  return {
    code: typeof detail.code === "string" ? detail.code : `HTTP_${status}`,
    message: typeof detail.message === "string" ? detail.message : typeof body.message === "string" ? body.message : GENERIC_CONVERSION_ERROR.message,
    line: typeof detail.line === "string" ? detail.line : GENERIC_CONVERSION_ERROR.line,
    suggestion: typeof detail.suggestion === "string" ? detail.suggestion : GENERIC_CONVERSION_ERROR.suggestion,
  };
}
