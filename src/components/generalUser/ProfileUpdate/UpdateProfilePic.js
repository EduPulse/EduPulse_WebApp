import React, {useState} from 'react'
import {Button, Grid, makeStyles,} from '@material-ui/core';
import axios from 'axios';
import {DropzoneArea} from 'material-ui-dropzone'
import Swal from 'sweetalert2'
import { user } from "../../auth/auth"
import APIURL from "../../API/APIURL";
import config from "../../../config/config";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        display: 'block',
        marginTop: 20
    },

    cardStyle: {
        marginBottom: '30px',
        borderRadius: '10px',
    },

    avatar: {
        backgroundColor: '#935FF9',
    },

    buttonStyleMain: {
        backgroundColor: '#935FF9',
        color: '#FFFFFF',
        '&:hover': {
            backgroundColor: '#4411A8',
        },
        marginBottom: '20px',
        width: '180px',
        marginLeft: '130px'
    },
    buttonStyleSub: {
        backgroundColor: '#9e9e9e',
        color: '#FFFFFF',
        '&:hover': {
            backgroundColor: '#d81b60',
        },
        marginBottom: '20px',
        width: '180px'
    },
}));

function UpdateProfilePic() {
    const classes = useStyles();

    let userID = ""
    let userRole = "";
    if (user()) {
        userID = user()._id;
        userRole = user().role;
    }
    const [files, setfiles] = useState(null)
    const handlefileChange = ([file]) => {
        file && setfiles(file)
        console.log(file)
    }

    const urlUploadProfPic = APIURL('/update_profile/uploadProfPic');
    const handleSubmit = (e) => {
        e.preventDefault();

        // console.log(files);
        const formData = new FormData();
        formData.append("userID", userID);
        formData.append("media", files, files.name);
        console.log('photo upload try');
        console.log(formData.get("userID"));
        // console.log(files.name);

        axios({
            method: "put",
            url: urlUploadProfPic,
            data: formData,
            headers: {"Content-Type": "multipart/form-data"},
            // onUploadProgress: function (progressEvent) {
            //     var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            //     console.log(percentCompleted)
            // }
        })
        .then(function (response) {
            Swal.fire({
                icon: 'success',
                title: 'Profile picture is uploaded successfully',
                timer: 3500
            })
            console.log("Profile Pic updated successfully", "", "success");
            window.location.href=config.applicationRoot+'/components/generalUser/UpdateProfile'
        })
        .catch(function (err) {
            Swal.fire({
                icon: 'error',
                title: 'Sorry!',
                text: 'Something went wrong. Try again later.'
            })
        });
    }

    const urlRemoveProfPic = APIURL("update_profile/removeProfPic/");

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
                axios.delete(urlRemoveProfPic + userID).then(function (response) {
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
