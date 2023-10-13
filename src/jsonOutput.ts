import { BsDiagnostic } from 'brighterscript';
import * as fs from "fs";

interface QualityLevel {
    severity: string
    type: string
}

function severityToQualityLevel(severity: number): QualityLevel {
    switch (severity) {
        case 1:
            return { severity: "ERROR", type: "BUG"};

        case 2:
            return { severity: "WARNING", type: "CODE_SMELL" };

        case 3:
            return  { severity: "INFORMATION", type: "INFO" };

        case 4:
            return { severity: "HINT", type: "HINT" };
    }
}

function convertToJson(diags: BsDiagnostic[]): string {
    let out = "{\"issues\":[";

    for (let i = 0; i < diags.length; ++i) {
        let d = diags[i];
        out += "{";
        out += "\"engineId\":\"bslint\"";
        out += `,"ruleId":"${d.code}"`;
        let qualityLevel = severityToQualityLevel(d.severity);
        out += `,"severity":"${qualityLevel.severity}"`;
        out += `,"type":"${qualityLevel.type}"`;
        out += `,"primaryLocation":{`;
        out += `"message":"${d.message}"`;
        out += `,"filePath":"${d.file.pkgPath}"`;
        out += `,"textRange":{"startLine":"${d.range.start.line}","endLine":"${d.range.end.line}"}`
        out += "}";
        out += "}";
        out += (i === diags.length - 1) ? "" : ",";
    }

    out += "]}";

    return out;
}

export function outputAsJson(diags: BsDiagnostic[], filename: string) {
    let out = convertToJson(diags);
    fs.writeFileSync(filename, out);
}
