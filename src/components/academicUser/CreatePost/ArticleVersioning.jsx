import React, {useEffect, useState} from 'react'
import NavBarWP from '../navBars/navBarWP';
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {alpha, makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    Snackbar,
    TextField
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {MultiSelect} from "react-multi-select-component";
import axios from "axios";
import nodeFetch from 'node-fetch';
import {createApi} from 'unsplash-js';
import APIURL from "../../API/APIURL";
import {user} from "../../auth/auth";
import PublishVersion from "../subComponents/publishVersion";
import UploadMediaForArticle from "../subComponents/uploadMediaForArticle";
import {Alert} from "@material-ui/lab";

const config = require('../../../config/config')

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    editor: {
        paddingTop: 120,
        width: "50%",
        paddingBottom: 30,
        margin: "auto"
    },
    navBar: {
        display: "block",
    },
    optionSection: {
        width: "50%",
        paddingBottom: 100,
        margin: "auto"
    },
    question: {
        marginTop: 20,
        marginBottom: 20,
    },
    buttonPublish: {
        backgroundColor: '#935FF9',
        borderRadius: '5px',
        '&:hover': {
            backgroundColor: alpha("#935FF9", 0.70),
        },
        color: 'white',
        // width: '15%',
        fontSize: 16,
        marginRight: theme.spacing(2)
    },
    licenceQuestion: {
        // display:"none",
    },
    moreButton: {
        backgroundColor: '#935FF9',
        color: '#fff'
    },
    postTitle: {
        marginTop: 20,
        marginBottom: 20,
        width: "100%",
        fontSize: 30,
        // padding:10,
    },
}));


export default function ArticleVersioning() {
    const classes = useStyles();
    let userID = ""
    let userRole = "";
    if (user()) {
        userID = user()._id;
        userRole = user().role;
    }

    let [stateArticleID, setStateArticleID] = useState(window.location.href.split('/').slice(-1)[0]);
    let [stateTagList, setStateTagList] = useState([]);
    let [stateArticleTitle, setStateArticleTitle] = useState("");
    let [stateArticleContent, setStateArticleContent] = useState("<h3>Welcome to EduPulse...</h3><br><br><br>");
    let [stateSelectedTags, setStateSelectedTags] = useState([]);
    const [openSnackBar, setOpenSnackBar] = React.useState(false);

    useEffect(() => {
        // load article details for continue editing
        const urlGetArticleData = APIURL("view_article/preview_article");
        axios.post(urlGetArticleData, {"_id": stateArticleID}).then(function (response) {
            setStateArticleTitle(response.data.article.current.title);
            setStateArticleContent(response.data.article.current.content);
        }).catch(function () {
            console.error("load failed");
        })

    }, []);

    // load tags
    useEffect(() => {
        axios.get(APIURL("tag_operation/")).then(function (response) {
            let i = 0;
            let tags = [];
            response.data.map(data => {
                tags[i++] = {label: data.verbose, value: data._id};
            })
            setStateTagList(tags);
        }).catch(function () {
            console.error("load failed");
        })
    }, []);

    // real time save
    useEffect(() => {
        let savingContent = stateArticleContent;
        // check for image references
        const splitContent = stateArticleContent.split("$EduPulseEmbedImage$")
        if (splitContent.length > 2) {
            let i = 1;
            while (i < splitContent.length) {
                let imageURL = splitContent[i];
                splitContent[i] = "<img class='articleImage' src='" + imageURL + "'/>"
                i = i + 2;
            }
            window.location.reload();
        }

        let postInfo = {
            "post_ID": stateArticleID,
            "post_title": stateArticleTitle,
            "post_content": splitContent
        };
        axios.post(APIURL("write_article/real_time_content_save/"), postInfo).then(function (response) {
            if (response.data.bad_word)
                setOpenSnackBar(true)
            else {
                setOpenSnackBar(false)
                console.log("article saved")
            }
        }).catch(function () {
            console.error("load failed");
        })
    }, [stateArticleContent, stateArticleTitle]);

    // events
    // handle title changes
    const handleTitleChange = event => {
        setStateArticleTitle(event.target.value);
    };

    const handleTagSelection = (selectedList, selectedItem) => {
        setStateSelectedTags(selectedList)
    }

    // alert box function
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    let [stateIsFirstPartDone, setStateIsFirstPartDone] = useState(false);
    let [statePostData, setStatePostData] = useState({});
    const handleSubmit = event => {
        // close alert box
        setOpen(false);

        // check all are filed
        if (stateArticleTitle !== "" && stateArticleContent !== "") {
            //get tagID list
            // tagList.
            let tagIDList = [];
            let i = 0;
            stateSelectedTags.map(item => tagIDList[i++] = (item.value))

            // generate cover image
            const unsplash = createApi({
                accessKey: config.clients.unsplash.access_key,
                fetch: nodeFetch,
            });

            // get random key for search an image
            let key = stateSelectedTags[Math.round(Math.random() * (tagIDList.length - 1))].label;
            // call unsplash api for take a random image based on key
            unsplash.photos.getRandom({query: key, count: 1,}).then(function (response) {
                let imageURL = response.response[0].urls.regular;

                // call api to get post visibility and licence
                axios.post(APIURL("view_article/preview_article"), {"_id": stateArticleID}).then(function (response) {

                    // update database

                    let stateData = {
                        "post_ID": stateArticleID,
                        "post_title": stateArticleTitle,
                        "post_content": stateArticleContent,
                        "cover_image": imageURL,
                        "related_tags": tagIDList,
                        "contributor": userID,
                        "post_visibility": response.data.visibility,
                        "post_licence": response.data.article.license,
                        "institute": "",
                    };
                    setStatePostData(stateData);

                    axios.post(APIURL("write_article/publish_post"), stateData).then(function (response) {
                        console.log("publish_post done ")
                        setStateIsFirstPartDone(true)
                    }).catch(function () {
                        console.error("publish_post failed");
                    });


                }).catch(function () {
                    console.error("load failed");
                })
            });
        }
    }

    // sneaker bar events
    const handleCloseSneaker = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackBar(false);
    };

    // set local storage variable to store post ID
    localStorage.setItem('postID', stateArticleID);
    localStorage.setItem('type', "articleVersioning");
    return (
        <div>
            <NavBarWP className={classes.navBar}/>

            <div align="center" className={classes.editor}>

                <form className={classes.root} noValidate autoComplete="off">

                    <TextField id="outlined-basic" label="Title" variant="outlined" multiline rows={3}
                               className={classes.postTitle}
                               onChange={handleTitleChange}
                               value={stateArticleTitle}
                    />
                </form>
                <div style={{margin: 20}}>
                    <UploadMediaForArticle/>
                </div>
                <CKEditor
                    style={{height: 100}}
                    editor={ClassicEditor}
                    data={stateArticleContent}
                    onChange={(event, editor) => {
                        setStateArticleContent(editor.getData())
                    }}
                />

            </div>

            <div className={classes.optionSection}>
                <Typography component="h6" variant="h6" className={classes.question}>
                    Select tags:
                </Typography>
                <FormControl style={{minWidth: 200}}>
                    <MultiSelect options={stateTagList} onChange={setStateSelectedTags} value={stateSelectedTags}
                                 labelledBy="Select" style={{fontSize: 15}}/>
                </FormControl>


                <div style={{textAlign: "center", marginTop: 50}}>
                    <div>
                        <Button variant="contained" className={classes.buttonPublish} onClick={handleClickOpen}>
                            Create new Version and Publish
                        </Button>

                        {/*redirect to publishing section*/}
                        {
                            stateIsFirstPartDone ? (
                                <PublishVersion jsonObject={statePostData} postID={stateArticleID}/>
                            ) : (
                                <span/>
                            )
                        }
                        <Dialog
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">Post Versioning Declaration</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    I agree that, with the new version, not harm happen to the original user and the
                                    system. Similarly,
                                    I declare that altered content is originally mine and I have not copied from
                                    anywhere.
                                    Remind that once releases a version, you are unable to edit. So, check your
                                    alterations before publishing to EduPulse.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose} color="primary">
                                    Disagree
                                </Button>
                                <Button onClick={handleSubmit} color="primary" autoFocus>
                                    Agree
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </div>

                <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleCloseSneaker}>
                    <Alert onClose={handleCloseSneaker} severity="warning">
                        Check your title and text again. It consist hate words. Remove them to activate auto saving
                        function.
                    </Alert>
                </Snackbar>

            </div>
        </div>
    )
}
