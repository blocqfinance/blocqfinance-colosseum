import fs from 'fs';
import path from 'path';

// tell solc to include node_modules imports (like @openzeppelin)
export function findImports(importPath: string) {
    try {
        if (importPath.startsWith('@')) {
            return {
                contents: fs.readFileSync(
                    path.resolve(__dirname, '../node_modules', importPath),
                    'utf8',
                ),
            };
        }
        return {
            contents: fs.readFileSync(
                path.resolve(__dirname, '../contracts', importPath),
                'utf8',
            ),
        };
    } catch (e) {
        return { error: 'File not found: ' + importPath + '::' + e };
    }
}
