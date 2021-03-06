import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Avatar from '@material-ui/core/Avatar';
import {red} from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
    root: {
        borderRadius: '5px',
        marginBottom: '20px',
        maxWidth: '550px',
        height: '400px'
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    avatar: {
        backgroundColor: red[500],
        width: '70px',
        height: '70px',
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 0px 20px 0 rgba(0, 0, 0, 0.19)'
    },
    titleStyle: {
        fontSize: '24px',
        textAlign: 'center'
    },
    readTimeStyle: {
        fontSize: '14px',
        marginBottom: '0px'
    },
    authorStyle: {
        fontSize: '20px',
        marginBottom: '0px'
    }
}));


export default function Post({author, profilePic, title, coverImg, readTime,}) {
    const classes = useStyles();

    return (
        <div>
            <Card className={classes.root}>
                <CardHeader
                    avatar={
                        <Avatar
                            aria-label="recipe" className={classes.avatar}
                            alt="Profile image"
                            src={profilePic}
                        />
                    }
                    title={
                        <p className={classes.titleStyle}>{title}</p>
                    }
                    subheader={
                        <div>
                            <p className={classes.authorStyle}>Written by {author}</p>
                            <p className={classes.readTimeStyle}> {readTime} minutes read</p>
                        </div>
                    }
                />

                <CardMedia
                    className={classes.media}
                    image={coverImg}
                    title="Cover Image"
                />

            </Card>
        </div>
    );
}