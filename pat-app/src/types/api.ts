export type APIPlayer = {
    id: number,
    name: string,
    server: string,
    lodestone_id: number
    avatar_uri: string,
    portrait_uri: string,
    first_seen: string,
    last_updated: string
}

export type APINotification = {
    id: number,
    player: APIPlayer,
    emoter: APIPlayer,
    emote: string
    location: string,
    total_player: number,
    total_emoter: number,
    date: string
}
export type APIEmoterStat = {
    total_pats?: number,
    total_dotes?: number
    total_hugs?: number
    total_slaps?: number
    total_nice?: number
    total_breaks?: number
}
export type APIPatStat = {
    total_dotes?: number
    total_pats?: number
    total_hugs?: number
    total_slaps?: number
    players: {
        [key: string]: APIEmoterStat
    }
}

export type APIPat = {
    [key: string]: APIPatStat
}