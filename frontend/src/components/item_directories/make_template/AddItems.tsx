import React from "react";
import { Theme, makeStyles, Typography, Button, Grid } from "@material-ui/core";
import PopUp from "../../helpers/PopUp";
import { FilePond, registerPlugin, File } from "react-filepond";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImageResize from "filepond-plugin-image-resize";
// @ts-ignore
import FilePondPluginFileEncode from "filepond-plugin-file-encode";
import { Link, useHistory } from "react-router-dom";
import { addItem } from "../../../services/template";
import Page from "../../helpers/Page";
registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageExifOrientation,
  FilePondPluginFileValidateType,
  FilePondPluginImageResize,
  FilePondPluginFileEncode
);
const useStyles = makeStyles((theme: Theme) => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}));
export default ({ title }: { title: string }) => {
  const history = useHistory();
  const classes = useStyles();
  const [image, setImage] = React.useState<File[]>([]);
  const [message, setMessage] = React.useState("");
  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (image.length === 0) {
      setMessage("No images uploaded");
      return;
    }
    addItem({
      titleOfTemplate: title,
      imgStringBase64:
        // @ts-ignore
        image.map(
          (item) =>
            `data:${
              // @ts-ignore
              item.fileType
              // @ts-ignore
            };base64,${item.getFileEncodeBase64String()}`
        ),
    })
      .then(() => {
        setImage([]);
        setMessage("Successfully added the item(s)&severity=success");
      })
      .catch((err) => {
        if (err.response) {
          const status = err.response.status;
          setMessage(`Error code ${status}.`);
        }
      });
  };
  return (
    <Page maxWidth="xs">
      <Typography component="h1" variant="h5">
        Add Items
      </Typography>
      <form className={classes.form} noValidate onSubmit={onSubmit}>
        <Grid container spacing={1} justify="center">
          <Grid item xs={12}>
            <Typography component="p" variant="subtitle1">
              Upload Item Images
            </Typography>
            <FilePond
              files={image}
              // @ts-ignore
              imagePreviewHeight={150}
              imagePreviewMaxFileSize="1MB"
              imageResizeMode="cover"
              acceptedFileTypes={["image/*"]}
              allowMultiple={true}
              getFileEncodeBase64String
              onupdatefiles={(fileItems) => setImage(fileItems)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" fullWidth variant="contained" color="primary">
              Add Items
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={() => {
                if (image.length)
                  setMessage("Add or remove all items before finishing");
                else {
                  history.push("./myitems");
                }
              }}
            >
              Finish
            </Button>
          </Grid>
        </Grid>
      </form>
      <PopUp severity="error" message={message} setMessage={setMessage} />
    </Page>
  );
};
