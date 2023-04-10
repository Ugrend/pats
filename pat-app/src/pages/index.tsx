import Head from 'next/head'
import Image from 'next/image'
import {Inter} from 'next/font/google'
import styles from '@/styles/Home.module.css'
import useSWR from 'swr'
import {APIPat, APIPlayer} from "@/types/api";
import {CircularProgress, Container, Paper} from "@mui/material";
import PatPlayer from "@/components/PatPlayer";
import NotificationHandler from "@/components/NotificationHandler";

const inter = Inter({subsets: ['latin']})

export default function Home() {
    const {data: players, isLoading: playersLoading} = useSWR<APIPlayer[]>("/api/player")
    const {data: pats} = useSWR<APIPat>("/api/pat", {refreshInterval: 2000})
    if (playersLoading)
        return <CircularProgress/>
    if (pats && players) {
        return (
            <>
                <Container>

                    {Object.entries(pats).map(obj => {
                        return <Paper style={{marginTop: "30px"}} key={obj[0]}><PatPlayer id={parseInt(obj[0])}
                                                                                          players={players}
                                                                                          patStats={obj[1]}/></Paper>
                    })}
                </Container>
                <NotificationHandler />
            </>
        )


    }
    return (
        <>
        </>
    )
}
