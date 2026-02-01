export function getSourceLocation({ startAreaCode, startLocationCode }: { startAreaCode: string | null; startLocationCode: string | null }) {
    return [startAreaCode, startLocationCode].filter(x => x != null).join('/');
}

export function getTargetLocation({ endAreaCode, endLocationCode }: { endAreaCode: string; endLocationCode: string | null }) {
    return [endAreaCode, endLocationCode].filter(x => x != null).join('/');
}

export function getLocations({ startLocationCode, endLocationCode }: { startLocationCode: string | null; endLocationCode: string | null }) {
    return [startLocationCode, endLocationCode].filter(x => x != null).join('/');
}