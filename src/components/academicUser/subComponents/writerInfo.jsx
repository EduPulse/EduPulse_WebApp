import React, {useEffect, useState} from 'react';
import {alpha, makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import {Link} from "@material-ui/core";
import axios from "axios";
import APIURL from "../../API/APIURL";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        // width: "80%",
        borderRadius: 6,
    },
    profilePic: {
        width: 60,
        height: 60,
    },
    img: {
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
    },
    actionButton: {
        width: "90%",
        backgroundColor: "#935FF9",
        margin: "auto",
        padding: 8,
        color: "#fff",
        '&:hover': {
            backgroundColor: alpha("#935FF9", 0.70),
        },
    },
    bio: {
        fontWeight: 530,
    },
    moreInfoTitle: {
        fontWeight: "bold",
        fontSize: 15,
        color: "#424040"
    },
    moreInfoValue: {
        fontSize: 17,
    }
}));

export default function WriterInfo({writerID, viewerID, name, bio, profileURL, university, status}) {
    const classes = useStyles();

    let [stateFollowed, setStateFollowed] = useState(false);
    let [stateFollowedLabel, setStateFollowedLabel] = useState("Follow");

    useEffect(() => {
        if (viewerID === "" || writerID === viewerID)
            setStateFollowed(true)
    }, [])

    // check already fallowed
    const urlCheckFollowed = APIURL("view_article/is_fallowed");
    useEffect(() => {
        if (viewerID !== "")
            axios.post(urlCheckFollowed, {"user_ID": viewerID, "writer_ID": writerID}).then(function (response) {
                if (response.data.is_fallowed) {
                    setStateFollowed(true);
                    setStateFollowedLabel("Followed")
                }
            }).catch(function () {
                console.error("load failed");
            })
    }, [stateFollowed]);

    // events
    const doFollowOperation = () => {
        // make follow
        const urlMakeFallow = APIURL("view_article/follow_writer");
        axios.post(urlMakeFallow, {"user_ID": viewerID, "writer_ID": writerID}).then(function (response) {
            if (response.data) {
                setStateFollowed(true);
                setStateFollowedLabel("Followed")
            }
        }).catch(function () {
            console.error("load failed");
        })
    }
    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <Typography variant="h5" color="primary" component="h5"
                            style={{fontWeight: 600, paddingBottom: 15, textAlign: "left"}}>
                    Original Author
                </Typography>
                <Grid container spacing={2}>
                    <Grid item>
                        <ButtonBase className={classes.profilePic}>
                            <Avatar alt="Profile image" className={classes.profilePic} src={profileURL}/>
                        </ButtonBase>
                    </Grid>
                    <Grid item xs={12} sm container>
                        <Grid item xs container direction="column" spacing={2}>
                            <Grid item xs>
                                <Link href={"/components/academicUser/authorProfile/" + writerID}
                                      style={{textDecoration: "none"}}>
                                    <Typography gutterBottom variant="h4">
                                        {name}
                                    </Typography>
                                </Link>
                                <Typography variant="body1" gutterBottom className={classes.bio}>
                                    {bio}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" onClick={doFollowOperation}
                                        disabled={stateFollowed} className={classes.actionButton}>
                                    {stateFollowedLabel}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6" component="h6" style={{textAlign: "left"}}>
                            <span className={classes.moreInfoTitle}>University</span> <br/>
                            <span className={classes.moreInfoValue}>{university}</span><br/>

                            <span className={classes.moreInfoTitle}>Status</span> <br/>
                            <span className={classes.moreInfoValue}>{status}</span><br/>

                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
}
