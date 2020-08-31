import React from "react";
import {
  Theme,
  makeStyles,
  Typography,
  Button,
  Grid,
  TextField,
} from "@material-ui/core";
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
import { useHistory } from "react-router-dom";
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
export default ({ id }: { id: string | number }) => {
  const history = useHistory();
  const classes = useStyles();
  const [image, setImage] = React.useState<File[]>([]);
  const [message, setMessage] = React.useState("");
  const [textItems, setTextItems] = React.useState("");
  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (image.length === 0 && textItems.trim().length === 0) {
      setMessage("No items added");
      return;
    }
    addItem({
      id,
      images:
        // @ts-ignore
        image
          .map((item) => ({
            imgStringBase64: `data:${
              // @ts-ignore
              item.fileType
              // @ts-ignore
            };base64,${item.getFileEncodeBase64String()}`,
            name: item.filenameWithoutExtension.substring(0, 40),
          }))
          .concat(
            textItems
              .trim()
              .split("\n")
              .map((item) => ({
                imgStringBase64: "",
                name: item.substring(0, 40),
              }))
          ),
    })
      .then(() => {
        setImage([]);
        setTextItems("");
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
    <Page maxWidth="md">
      <Typography component="h1" variant="h5">
        Add Items
      </Typography>
      <Typography component="p" variant="subtitle1">
        An item can either be an image or just plain text. For uploading an
        image, the name of that image item is the file name of the image. The
        name of an item automatically gets truncated down to a maximum of 40
        characters.
      </Typography>

      <form className={classes.form} noValidate onSubmit={onSubmit}>
        <Grid container spacing={1} justify="center">
          <Grid item xs={12}>
            <Typography component="p" variant="subtitle1">
              Add image items
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
            <Typography component="p" variant="subtitle1">
              Add text items
            </Typography>
            <TextField
              variant="outlined"
              fullWidth
              multiline
              rows={5}
              label="Item names"
              placeholder="Put each item on a new line"
              onChange={(e) => setTextItems(e.target.value)}
              value={textItems}
              color="secondary"
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
                if (image.length || textItems.trim().length !== 0)
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
