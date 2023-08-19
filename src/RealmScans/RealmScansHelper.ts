export function getSlugFromTitle(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/-s-/, 's-')
        .replace(/-ll-/, 'll-')
}

export function extractVariableValues(chapterData: string): Record<string, string> {
    const variableRegex = /var\s+(\w+)\s*=\s*([\s\S]*?);/g // modified to not only match strings
    const variables: Record<string, string> = {}
    let match

    // thanks past me for this code
    // Under no circumstances directly eval (or Function), as they might go hardy harr-harr sneaky and pull an RCE
    while ((match = variableRegex.exec(chapterData)) !== null) {
        const [, variableName, variableValue] = match as unknown as [string, string, string]
        variables[variableName] = variableValue
    }

    return variables
}