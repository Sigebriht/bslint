import { BsDiagnostic } from 'brighterscript';
import * as fs from "fs";
import { join } from "path";

interface QualityLevel {
    severity: string
    type: string
}

function severityToQualityLevel(severity: number): QualityLevel {
    switch (severity) {
        case 1:
            return { severity: "CRITICAL", type: "BUG"};

        case 2:
            return { severity: "MAJOR", type: "CODE_SMELL" };

        case 3:
            return  { severity: "MINOR", type: "CODE_SMELL" };

        case 4:
            return { severity: "INFO", type: "CODE_SMELL" };
    }
}

function convertToJson(diags: BsDiagnostic[], fileRoot?: string): string {
    let out = "{\"issues\":[";

    for (let i = 0; i < diags.length; ++i) {
        let d = diags[i];

        let filePath = fileRoot ? join(fileRoot, d.file.pkgPath) : d.file.pkgPath;

        out += "{";
        out += "\"engineId\":\"bslint\"";
        out += `,"ruleId":"${d.code}"`;
        let qualityLevel = severityToQualityLevel(d.severity);
        out += `,"severity":"${qualityLevel.severity}"`;
        out += `,"type":"${qualityLevel.type}"`;
        out += `,"primaryLocation":{`;
        out += `"message":"${d.message}"`;
        out += `,"filePath":"${filePath}"`;
        out += `,"textRange":{"startLine":"${d.range.start.line}","endLine":"${d.range.end.line}"}`
        out += "}";
        out += "}";
        out += (i === diags.length - 1) ? "" : ",";
    }

    out += "]}";

    return out;
}

export function outputAsJson(diags: BsDiagnostic[], filename: string, fileRoot?: string) {
    let out = convertToJson(diags, fileRoot);
    fs.writeFileSync(filename, out);
}
