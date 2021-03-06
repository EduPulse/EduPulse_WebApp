import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import {red} from '@material-ui/core/colors';
import ShareIcon from '@material-ui/icons/Share';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Skeleton from '@material-ui/lab/Skeleton';
//import Collapse from '@material-ui/core/Collapse';
import PropTypes from 'prop-types';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import {animated, useSpring} from 'react-spring'; // web.cjs is required for IE 11 support
import Img2 from '../assets/EduPulse.png';
import {Icon} from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import axios from 'axios';
import {v4 as uuidv4} from 'uuid';
import Postviewer from './postviewer';
import APIURL from './API/APIURL';
import googleNormal from '../assets/buttons/google_signin_normal.png';
import googleFocus from '../assets/buttons/google_signin_pressed.png';

import config from '../config/config'

const useStyles = makeStyles((theme) => ({
    root: {
        borderRadius: '15px',
        marginBottom: '20px'
    },
    media: {
        height: 0,
        margin: '0px 5px',
        borderRadius: '10px',
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
    likes: {
        paddingLeft: '5px',
        paddingRight: '40px'
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: '#DFDAE8',
        borderRadius: '15px',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        width: '230px',
        height: '370px'
    },
    paper2: {
        backgroundColor: '#DFDAE8',
        borderRadius: '15px',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        width: '80vw',
        height: '80vh',
        overflowY: 'scroll',
    },
    logo: {
        width: '70px',
        height: '70px',
        borderRadius: '6px',
        boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '20px'
    },
    usericon: {
        width: '150px',
        height: '150px',
        display: 'block',
        margin: '20px auto',
    },
    authicons: {
        display: 'block',
        marginTop: '40px'
    },
    card: {
        maxWidth: 345,
        margin: theme.spacing(2),
    },
}));

const Fade = React.forwardRef(function Fade(props, ref) {
    const {in: open, children, onEnter, onExited, ...other} = props;
    const style = useSpring({
        from: {opacity: 0},
        to: {opacity: open ? 1 : 0},
        onStart: () => {
            if (open && onEnter) {
                onEnter();
            }
        },
        onRest: () => {
            if (!open && onExited) {
                onExited();
            }
        },
    });

    return (
        <animated.div ref={ref} style={style} {...other}>
            {children}
        </animated.div>
    );
});

Fade.propTypes = {
    children: PropTypes.element,
    in: PropTypes.bool.isRequired,
    onEnter: PropTypes.func,
    onExited: PropTypes.func,
};

function Media(props) {
    const {loading = false} = props;
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardHeader
                avatar={
                    loading ? (
                        <Skeleton animation="wave" variant="circle" width={40} height={40}/>
                    ) : ('')}
                action={
                    loading ? null : (
                        <IconButton aria-label="settings">
                            <MoreVertIcon/>
                        </IconButton>
                    )
                }
                title={
                    loading ? (
                        <Skeleton animation="wave" height={10} width="80%" style={{marginBottom: 6}}/>
                    ) : ('')}
                subheader={loading ? <Skeleton animation="wave" height={10} width="40%"/> : '5 hours ago'}
            />
            {loading ? (
                <Skeleton animation="wave" variant="rect" className={classes.media}/>
            ) : ('')}

            <CardContent>
                {loading ? (
                    <React.Fragment>
                        <Skeleton animation="wave" height={30} style={{marginBottom: 6}}/>
                        <Skeleton animation="wave" height={30} width="80%"/>
                    </React.Fragment>
                ) : ('')}
            </CardContent>
        </Card>
    );
}

Media.propTypes = {
    loading: PropTypes.bool,
};

export default function Posts() {
    const classes = useStyles();
//    const [expanded, setExpanded] = useState(false);
    const [posts, setPosts] = useState([]);
    /*     const [loading, setLoading] = useState(false);
        const handleExpandClick = () => {
            setExpanded(!expanded);
        }; */
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const url = APIURL('posts/feed');

    useEffect(() => {

        axios.get(url)
            .then(function (response) {
                console.log(response.data)
                setPosts(response.data);
            })
            .catch(function (err) {
                console.log(err);
            })
    }, [url])

    /*     if (loading) {
            return <p>Data is loading...</p>;
        } */

    return (

        <div>
            {posts.length > 0 ?
                posts.map((x) => (x.type === "article" && x.article.status === "published" && x.visibility === "Anyone") ? (
                    <Card className={classes.root} key={uuidv4()}>
                        <CardHeader
                            avatar={
                                <Avatar aria-label="recipe" className={classes.avatar} src={x.author.profilePicture}
                                        key={uuidv4()}/>
                            }

                            title={x.author.name}
                            //subheader={new Date(x.article.versions[0].createdAt).toLocaleString()}
                            subheader={new Date(x.createdAt).toLocaleString()}
                        />

                        <CardMedia
                            className={classes.media}
                            image={x.article.current.coverImage}
                            title="Paella dish"
                        />
                        <CardContent>
                            <Typography variant="h5" color="textPrimary" component="p">
                                {x.article.current.title}
                            </Typography>
                        </CardContent>

                        <CardActions disableSpacing>
                            <IconButton aria-label="add to favorites" onClick={handleOpen}>
                                <ThumbUpIcon/>
                            </IconButton>
                            <Typography variant="h7" className={classes.likes}>
                                {x.article.upvotes.length}
                            </Typography>

                            <IconButton aria-label="views" onClick={handleOpen}>
                                <VisibilityIcon/>
                            </IconButton>
                            <Typography variant="h7" className={classes.likes}>
                                {x.viewCount} Views
                            </Typography>

                            <IconButton aria-label="share" onClick={handleOpen}>
                                <ShareIcon/>
                            </IconButton>

                            <Postviewer data={x}/>

                            <Typography variant="h7">
                                View more...
                            </Typography>

                        </CardActions>

                        {/* <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <CardContent>
                            <div dangerouslySetInnerHTML={{__html:x.article.current.content }}/>
                        </CardContent>
                    </Collapse> */}
                    </Card>
                ) : "")
                : (
                    <div>
                        <Media loading/>
                        <Media loading/>
                        <Media loading/>
                    </div>
                )
            }


            <Modal
                aria-labelledby="spring-modal-title"
                aria-describedby="spring-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className={classes.paper}>
                        <img src={Img2} alt="logo" className={classes.logo}/>
                        <Icon color="primary">
                            <AccountCircleIcon className={classes.usericon}/>
                        </Icon>

                        <div className={classes.authicons}>
                            <center>
                            <button onClick={() => {
                                window.location.href = config.applicationRoot + '/openid/google'
                            }}
                                    style={{
                                        padding: '0px 0px',
                                        margin: '0px',
                                        border: 'none',
                                        backgroundColor: '#DFDAE8',
                                        cursor: "pointer"
                                    }}>
                                <img src={googleNormal} alt="google button" style={{width: '218px'}}
                                     onMouseOver={e => (e.currentTarget.src = googleFocus)}
                                     onMouseOut={e => (e.currentTarget.src = googleNormal)}
                                />
                            </button>
                            </center>
                            {/*
                            <button onClick={() => {
                                window.location.href = config.applicationRoot + '/openid/azure'
                            }}
                                    style={{
                                        padding: '0px 0px',
                                        margin: '0px',
                                        border: 'none',
                                        backgroundColor: '#DFDAE8',
                                        cursor: "pointer"
                                    }}>
                                <img src={Msbutton} alt="ms button" style={{width: '218px'}}/>
                            </button>*/}
                        </div>
                    </div>
                </Fade>
            </Modal>
        </div>

    );
}
