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
}
const Notification: React.FC<NotificationProps> = ({player, emoter, emote, location}) => {
    return <>
        <Avatar style={{marginRight: "5px"}} src={emoter.avatar_uri}/>{emoter.name} just <b>{emote === "pat" ? emote : `${emote}ed`}</b> {player.name} in {location}
    </>
}

const NotificationHandler: React.FC = ()=>{
    const {data} = useSWR<APINotification[]>("/api/notifications", {refreshInterval: 2000})
    if(data){
        for(const notification of data){
            toast(<Notification player={notification.player} emoter={notification.emoter} emote={notification.emote} location={notification.location}/>, {
                toastId: notification.id
            })
        }
    }
    return (
       <></>
    )
}

export default NotificationHandler