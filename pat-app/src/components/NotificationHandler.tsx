import { toast } from "react-toastify";
import {APINotification, APIPlayer} from "@/types/api";
import React from "react";
import {Avatar} from "@mui/material";
import useSWR from "swr";


type NotificationProps = {
    player: APIPlayer,
    emoter: APIPlayer,
    emote: string
    location: string
    total_count: number
}
const Notification: React.FC<NotificationProps> = ({player, emoter, emote, location,total_count}) => {
    return <>
        <Avatar style={{marginRight: "5px"}} src={emoter.avatar_uri}/>{emoter.name} just <b>{emote === "pat" ? emote : `${emote}ed`}</b> {player.name} in {location}
        <div>Bringing the total to: {total_count}</div>
        <div>
            {
                total_count.toString().endsWith("69") && "Nice!!"
            }
            {
                (total_count - 1).toString().endsWith("69") && "Breaking the 69 BOOOOOOOOOOOOOOOOOOOO"
            }
        </div>

    </>
}

const NotificationHandler: React.FC = ()=>{
    const {data} = useSWR<APINotification[]>("/api/notifications", {refreshInterval: 2000})
    if(data){
        for(const notification of data){
            toast(<Notification player={notification.player} emoter={notification.emoter} emote={notification.emote} location={notification.location} total_count={notification.total_player}/>, {
                toastId: notification.id,
                autoClose: (notification.total_player.toString().endsWith("69") || (notification.total_player - 1).toString().endsWith("69")) ? 30000 : 5000
            })
        }
    }
    return (
       <></>
    )
}

export default NotificationHandler