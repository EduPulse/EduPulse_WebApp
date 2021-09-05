import React, {useState} from 'react'
import {Button, Grid, makeStyles,} from '@material-ui/core';
import axios from 'axios';
import {DropzoneArea} from 'material-ui-dropzone'
import Swal from 'sweetalert2'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        display: 'block',
    },

    cardStyle: {
        marginBottom: '30px',
        borderRadius: '10px',
    },

    avatar: {
        backgroundColor: '#935FF9',
    },

    buttonStyleMain: {
        backgroundColor: '#4411A8',
        color: '#FFFFFF',
        '&:hover': {
            backgroundColor: '#b3b3cc',
        },
        marginBottom: '20px',
        marginLeft: '100px'
    },

    buttonStyleSub: {
        backgroundColor: '#b3b3cc',
        color: '#FFFFFF',
        '&:hover': {
            backgroundColor: '#FA2C2C',
        },
        marginBottom: '20px'
    },
}));

function UpdateProfilePic({userID, userProfilePic}) {
    const classes = useStyles();

    const [files, setfiles] = useState(null)
    const handlefileChange = ([file]) => {
        file && setfiles(file)
        console.log(files)
    }

    const urlUploadProfPic = 'http://localhost:9000/update_profilePic/uploadProfPic';

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("_id", userID);
        formData.append("media", files);
        console.log('photo upload try');

        axios({
            method: "put",
            url: urlUploadProfPic,
            data: formData,
            headers: {"Content-Type": "multipart/form-data"},
        })
            .then(function (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Profile picture is uploaded successfully',
                    timer: 1500
                })
                console.log("Profile Pic updated successfully", "", "success");
            })
            .catch(function (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Sorry!',
                    text: 'Something went wrong. Try again later.'
                })
                console.log(err);
            });
    }

    const urlRemoveProfPic = "http://localhost:9000/update_profilePic/removeProfPic";

    const removePhoto = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(urlRemoveProfPic, userID).then(function (response) {
                    console.log('Profile Pic is removed successfully');
                })
                    .then(function (response) {
                        Swal.fire(
                            'Deleted!',
                            'Your image has been deleted.',
                            'success'
                        )
                    })
                    .catch(function (err) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Sorry!',
                            text: 'Something went wrong. Try again later.'
                        })
                        console.log(err);
                    });
            }
        })
    }

    return (
        <div>
            <form className={classes.root} noValidate autoComplete="off">
                <Grid container spacing={3}>
                    <DropzoneArea
                        onChange={handlefileChange}
                        acceptedFiles={['image/jpeg', 'image/png']}
                        maxFileSize={50000000}
                        filesLimit={1}
                        showFileNamesInPreview={true}
                        filename="media"
                    />

                    <Grid item>
                        <Button
                            aria-label="recipe"
                            className={classes.buttonStyleMain}
                            type="submit"
                            onClick={handleSubmit}
                        >
                            Upload New Photo
                        </Button>
                    </Grid>

                    <Grid item>
                        <Button
                            aria-label="recipe"
                            className={classes.buttonStyleSub}
                            onClick={removePhoto}
                        >
                            Remove Photo
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </div>
    )
}

export default UpdateProfilePic
