import React from "react";
import useSWR from "swr";
import {APIEmoterStat, APIPatStat, APIPlayer} from "@/types/api";
import {
    Avatar,
    CircularProgress, Paper, Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";

type PatPlayerProps = {
    id: number
    players: APIPlayer[]
    patStats: APIPatStat
}

type PatPlayerInfoProps = {
    player: APIPlayer,
    players: APIPlayer[],
    patStats: APIPatStat
}
type EmoterInfoProps = {
    id: number
    players: APIPlayer[],
    emoterStat: APIEmoterStat
}
type EmoterTableEntryProps = {
    player: APIPlayer
    emoterStat: APIEmoterStat
}

const EmoterTableEntry: React.FC<EmoterTableEntryProps> = ({player, emoterStat}) => {
    return <TableRow>
        <TableCell><div style={{display: "flex"}}><Avatar src={player.avatar_uri}/> <Typography style={{alignSelf: 'center', marginLeft: "5px"}}>{player.name}</Typography></div></TableCell>
        <TableCell><Typography>{emoterStat.total_pats ?? 0}</Typography></TableCell>
        <TableCell><Typography>{emoterStat.total_dotes ?? 0}</Typography></TableCell>
        <TableCell><Typography>{emoterStat.total_nice ?? 0}</Typography></TableCell>
        <TableCell><Typography>{emoterStat.total_breaks ?? 0}</Typography></TableCell>
    </TableRow>
}
const EmoterInfo: React.FC<EmoterInfoProps> = ({id, players, emoterStat}) => {

    const foundPlayer = players.find(p => p.id === id);
    const {data: player, isLoading: playerLoading} = useSWR<APIPlayer>(foundPlayer == null ? `/api/player/${id}` : null);

    if(foundPlayer)
        return <EmoterTableEntry player={foundPlayer} emoterStat={emoterStat}/>
    if(playerLoading)
        return <CircularProgress/>
    if(player)
        return <EmoterTableEntry player={player} emoterStat={emoterStat}/>
    return null;

}

const PatPlayerInfo: React.FC<PatPlayerInfoProps> = ({player, players, patStats}) => {
   return <div>
       <div style={{display: "flex"}}>
           <Avatar src={player.avatar_uri}/>
           <Typography variant="h3">{player.name}</Typography>
       </div>

       <div style={{display: "flex", alignItems: "center"}}>
           <img className="hidden-mobile" src={player.portrait_uri} height={"500px"}/>
           <div style={{flex: 1}}>
               <Typography>Total Pats: {patStats.total_pats ?? 0}</Typography>
               <Typography>Total Dotes: {patStats.total_dotes ?? 0}</Typography>
               <TableContainer>
                   <Table style={{width: "100%"}}>
                       <TableHead>
                           <TableRow>
                               <TableCell>Player</TableCell>
                               <TableCell>Total Pats</TableCell>
                               <TableCell>Total Dotes</TableCell>
                               <TableCell>Nice</TableCell>
                               <TableCell>Not Nice</TableCell>
                           </TableRow>
                       </TableHead>
                       <TableBody>
                           {Object.entries(patStats.players).map(obj => {
                               return <EmoterInfo key={obj[0]} id={parseInt(obj[0])} players={players} emoterStat={obj[1]}/>
                           })}
                       </TableBody>
                   </Table>
               </TableContainer>

           </div>

       </div>

   </div>
}

const PatPlayer: React.FC<PatPlayerProps> = ({id, players, patStats}) => {
    const foundPlayer = players.find(p => p.id === id);
    const {data: player, isLoading: playerLoading} = useSWR<APIPlayer>(foundPlayer == null ? `/api/player/${id}` : null);

    if(foundPlayer)
        return <PatPlayerInfo player={foundPlayer} patStats={patStats} players={players}/>
    if(playerLoading)
        return <CircularProgress/>
    if(player)
        return <PatPlayerInfo player={player} patStats={patStats} players={players}/>
    return null;
}
export default PatPlayer